const categoriasConfig = {
    "monitores": {
        displayName: "Monitores",
        filename: "monitores",
        searchTerm: "monitor pc" 
    },
    "gabinete": {
        displayName: "Gabinetes",
        filename: "gabinete",
        searchTerm: "gabinete pc"
    },
    "discoSsd": {
        displayName: "Discos Solidos SSD",
        filename: "discoSolidoSsd",
        searchTerm: "disco ssd"
    },
    "MemoriaRam": {
        displayName: "Memorias Ram",
        filename: "memoriaRam",
        searchTerm: "memoria ram pc"
    },
    "procesadores": {
        displayName: "Procesadores",
        filename: "microProcesadores",
        searchTerm: "procesador intel amd"
    },
    "motherboards": {
        displayName: "Motherboards",
        filename: "motherboards",
        searchTerm: "motherboard"
    },
    "perifericos": {
        displayName: "Perifericos",
        filename: "perifericos",
        searchTerm: "perifericos pc"
    },
    "PlacasDeVideo": {
        displayName: "Placas De Video",
        filename: "placaDeVideo",
        searchTerm: "placa video"
    },
    "RefrigeracionLiquida": {
        displayName: "Refrigeracion Liquida",
        filename: "refrigeracion",
        searchTerm: "refrigeracion liquida pc"
    }
};

// crea el HTML de una card del producto
const createProductCard = (producto, categoria) => `
    <div class="col-md-6 col-lg-6">
        <div class="card product-card" onclick="window.location.href='/Pages/categorias/${categoriasConfig[categoria].filename}.html'">
            <div class="card-hover-zoom">
                <img src="${producto.thumbnail.replace("I.jpg", "O.jpg")}" class="card-img-top lazy-load" alt="${producto.title}">
            </div>
            <div class="card-body">
                <h5 class="card-title">${producto.title}</h5>
                <p class="card-price">$${producto.price.toLocaleString()}</p>
            </div>
        </div>
    </div>
`;

// Función para crear la sección de categoría
const createCategorySection = (categoria, productos) => {
    const section = document.createElement("div");
    section.classList.add("categoria-section", "mb-5");
    section.innerHTML = `
        <h2 class="category-title mb-4">${categoriasConfig[categoria].displayName}</h2>
        <div class="row g-4">
            ${productos.map(producto => createProductCard(producto, categoria)).join('')}
        </div>
    `;
    return section;
};

// Función para cargar productos de forma paralela
async function cargarProductosParalelo() {
    const categoriasAMostrar = Object.keys(categoriasConfig);
    const promises = categoriasAMostrar.map(categoria => {
        const searchTerm = categoriasConfig[categoria].searchTerm || categoria;
        return fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(searchTerm)}`)
            .then(response => response.ok ? response.json() : Promise.reject(`Error en ${categoria}`))
            .then(datos => ({
                categoria,
                productos: datos.results?.slice(0, 2).map(producto => ({
                    title: producto.title,
                    price: producto.price,
                    thumbnail: producto.thumbnail,
                    categoria
                })) || []
            }))
            .catch(error => {
                console.error(`Error en ${categoria}:`, error);
                return { categoria, productos: [] };
            });
    });

    return Promise.all(promises);
}

// Función principal 
async function mostrarProductos() {
    const contenedorProductos = document.getElementById("contenedor-productos");
    contenedorProductos.id = "home-products";
    
    // Mostrar un loader mientras se estan cargan los productos
    contenedorProductos.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;

    try {
        // sección de bienvenida
        const welcomeSection = document.createElement("div");
        welcomeSection.classList.add("welcome-section", "text-center", "mb-5");
        welcomeSection.innerHTML = `
            <h1 class="display-4 animate__animated animate__fadeIn">Bienvenido a TIENDA 5-5</h1>
            <p class="lead animate__animated animate__fadeIn animate__delay-1s">Explora nuestra selección de productos tecnológicos</p>
        `;

        // Cargar los productos en paralelo
        const resultados = await cargarProductosParalelo();
        
        
        contenedorProductos.innerHTML = '';
        contenedorProductos.appendChild(welcomeSection);

       
        const mainGrid = document.createElement('div');
        mainGrid.classList.add('container');

       
        resultados
            .filter(({ productos }) => productos.length > 0)
            .forEach(({ categoria, productos }) => {
                mainGrid.appendChild(createCategorySection(categoria, productos));
            });

        contenedorProductos.appendChild(mainGrid);

        
        const lazyLoadImages = () => {
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
                img.dataset.src = img.src;
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Placeholder
                imageObserver.observe(img);
            });
        };

       
        lazyLoadImages();

    } catch (error) {
        console.error('Error al cargar los productos:', error);
        contenedorProductos.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Hubo un error al cargar los productos. Por favor, intenta nuevamente más tarde.
            </div>
        `;
    }
}

// Agregar event listener para DOMContentLoaded
document.addEventListener('DOMContentLoaded', mostrarProductos);