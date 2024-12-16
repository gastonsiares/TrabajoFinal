const categoriasConfig = {
    monitores: {
        displayName: "Monitores",
        filename: "monitores",
        searchTerm: "monitor pc",
        icon: "tv"
    },
    gabinete: {
        displayName: "Gabinetes",
        filename: "gabinete",
        searchTerm: "gabinete pc",
        icon: "desktop"
    },
    discoSsd: {
        displayName: "Discos Solidos SSD",
        filename: "discoSolidoSsd",
        searchTerm: "disco ssd",
        icon: "hdd"
    },
    MemoriaRam: {
        displayName: "Memorias Ram",
        filename: "memoriaRam",
        searchTerm: "memoria ram pc",
        icon: "memory"
    },
    procesadores: {
        displayName: "Procesadores",
        filename: "microProcesadores",
        searchTerm: "procesador intel amd",
        icon: "microchip"
    },
    motherboards: {
        displayName: "Motherboards",
        filename: "motherboards",
        searchTerm: "motherboard",
        icon: "server"
    },
    perifericos: {
        displayName: "Perifericos",
        filename: "perifericos",
        searchTerm: "perifericos pc",
        icon: "keyboard"
    },
    PlacasDeVideo: {
        displayName: "Placas De Video",
        filename: "placaDeVideo",
        searchTerm: "placa video",
        icon: "tv"
    },
    RefrigeracionLiquida: {
        displayName: "Refrigeracion Liquida",
        filename: "refrigeracion",
        searchTerm: "refrigeracion liquida pc",
        icon: "snowflake"
    }
};


class HomeManager {
    constructor() {
        this.init();
        this.cache = new Map();
        this.retryAttempts = 3;
        this.retryDelay = 1000;

      
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => this.mostrarProductos());
        window.addEventListener('error', this.handleError.bind(this));
    }

    handleError(error) {
        console.error('Error capturado:', error);
        this.mostrarNotificacion('Ha ocurrido un error. Por favor, recarga la página.', 'error');
    }

    createWelcomeSection() {
        const welcomeSection = document.createElement("div");
        welcomeSection.classList.add("welcome-section", "text-center", "mb-5");
        welcomeSection.innerHTML = `
            <h1 class="display-4 animate__animated animate__fadeIn">Bienvenido a TIENDA 5-5</h1>
            <p class="lead animate__animated animate__fadeIn animate__delay-1s">
                Explora nuestra selección de productos tecnológicos
            </p>
        `;
        return welcomeSection;
    }

    createProductCard(producto, categoria) {
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card product-card h-100 shadow-sm" 
                     data-categoria="${categoria}"
                     onclick="window.location.href='/Pages/categorias/${categoriasConfig[categoria]?.filename || 'productos'
            }.html'">
                    <div class="card-hover-zoom position-relative">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                             data-src="${producto.thumbnail.replace("I.jpg", "O.jpg")}"
                             class="card-img-top lazy-load"
                             alt="${producto.title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${producto.title}</h5>
                        <p class="card-text">
                            ${producto.price ? `
                                <span class="price">$${producto.price.toLocaleString()}</span>
                                ${producto.original_price ? `
                                    <span class="text-decoration-line-through text-muted ms-2">
                                        $${producto.original_price.toLocaleString()}
                                    </span>
                                ` : ''}
                            ` : ''}
                        </p>
                        ${producto.shipping?.free_shipping ? `
                            <span class="badge bg-success">
                                <i class="fas fa-truck"></i> Envío gratis
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    createCategorySection(categoria, productos) {
        const section = document.createElement("div");
        section.classList.add("categoria-section", "mb-5", "animate__animated", "animate__fadeIn");
        section.innerHTML = `
            <div class="category-header d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center">
                    <i class="fas fa-${categoriasConfig[categoria].icon} me-2"></i>
                    <h2 class="category-title mb-0">${categoriasConfig[categoria].displayName}</h2>
                </div>
                <a href="/Pages/categorias/${categoriasConfig[categoria].filename}.html" 
                   class="btn btn-outline-primary btn-sm">
                    Ver todos <i class="fas fa-arrow-right ms-1"></i>
                </a>
            </div>
            <div class="row g-4">
                ${productos.map(producto => this.createProductCard(producto, categoria)).join('')}
            </div>
        `;
        return section;
    }

    async fetchWithRetry(url, attempts = this.retryAttempts) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            if (attempts === 1) throw error;
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            return this.fetchWithRetry(url, attempts - 1);
        }
    }

    async cargarProductosParalelo() {
        const categoriasAMostrar = Object.keys(categoriasConfig);
        const promises = categoriasAMostrar.map(async categoria => {
            try {
                if (this.cache.has(categoria)) {
                    return this.cache.get(categoria);
                }

                const searchTerm = categoriasConfig[categoria].searchTerm || categoria;
                const datos = await this.fetchWithRetry(
                    `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(searchTerm)}`
                );

                const resultado = {
                    categoria,
                    productos: datos.results?.slice(0, 3).map(producto => ({
                        title: producto.title,
                        price: producto.price,
                        original_price: producto.original_price,
                        thumbnail: producto.thumbnail,
                        shipping: producto.shipping,
                        categoria
                    })) || []
                };

                this.cache.set(categoria, resultado);
                return resultado;

            } catch (error) {
                console.error(`Error en ${categoria}:`, error);
                return { categoria, productos: [] };
            }
        });

        return Promise.all(promises);
    }

    async mostrarProductos() {
        const contenedorProductos = document.getElementById("contenedor-productos");
        if (!contenedorProductos) return;

        contenedorProductos.id = "home-products";

        try {
            contenedorProductos.innerHTML = `
                <div class="text-center p-5">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
            `;

            const welcomeSection = this.createWelcomeSection();
            const resultados = await this.cargarProductosParalelo();

            contenedorProductos.innerHTML = '';
            contenedorProductos.appendChild(welcomeSection);

            const mainGrid = document.createElement('div');
            mainGrid.classList.add('container');

            const productosValidos = resultados.filter(({ productos }) => productos.length > 0);

            if (productosValidos.length === 0) {
                mainGrid.innerHTML = `
                    <div class="alert alert-info">
                        No se encontraron productos disponibles en este momento.
                        <button class="btn btn-link" onclick="location.reload()">
                            Intentar nuevamente
                        </button>
                    </div>
                `;
            } else {
                productosValidos.forEach(({ categoria, productos }) => {
                    mainGrid.appendChild(this.createCategorySection(categoria, productos));
                });
            }

            contenedorProductos.appendChild(mainGrid);
            this.initLazyLoading();

        } catch (error) {
            console.error('Error al cargar los productos:', error);
            contenedorProductos.innerHTML = `
                <div class="alert alert-danger">
                    <h4 class="alert-heading">Error al cargar los productos</h4>
                    <p>Lo sentimos, ha ocurrido un error al cargar los productos.</p>
                    <hr>
                    <button class="btn btn-danger" onclick="location.reload()">
                        Intentar nuevamente
                    </button>
                </div>
            `;
        }
    }

    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy-load').forEach(img => {
            imageObserver.observe(img);
        });
    }

    mostrarNotificacion(mensaje, tipo) {
        const toast = document.createElement('div');
        toast.classList.add('toast', 'position-fixed', 'bottom-0', 'end-0', 'm-3');
        toast.innerHTML = `
            <div class="toast-header bg-${tipo === 'success' ? 'success' : 'danger'} text-white">
                <strong class="me-auto">Notificación</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${mensaje}
            </div>
        `;
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}


// Inicializar
const homeManager = new HomeManager();
