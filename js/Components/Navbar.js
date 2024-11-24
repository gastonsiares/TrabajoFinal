// Navbar.js
const navElements = [
    { title: 'Inicio', link: '/Pages/home.html' },
    { title: 'Iniciar Sesion', link: '/Pages/InicioRegistro/login.html', hideWhenLoggedIn: true },
    { title: 'Registro', link: '/Pages/InicioRegistro/registro.html', hideWhenLoggedIn: true },
    {
        title: 'Componentes de PC',
        subItems: [
            { title: 'Monitores', link: '/Pages/categorias/monitores.html' },
            { title: 'Placas de Video', link: '/Pages/categorias/placaDeVideo.html' },
            { title: 'Perifericos', link: '/Pages/categorias/perifericos.html' },
            { title: 'Memorias Ram', link: '/Pages/categorias/memoriaRam.html' },
            { title: 'Procesadores', link: '/Pages/categorias/microProcesadores.html' },
            { title: 'Fuentes', link: '/Pages/categorias/fuente.html' },
            { title: 'Discos Solidos', link: '/Pages/categorias/discoSolidoSsd.html' },
            { title: 'Gabinetes', link: '/Pages/categorias/gabinete.html' },
            { title: 'Motherboards', link: '/Pages/categorias/motherboards.html' },
            { title: 'Refrigeracion', link: '/Pages/categorias/refrigeracion.html' },
        ]
    }
];

export const navBarComponent = `
<nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="/index.html">5-5</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav me-auto">
                ${navElements.map(i => {
                    if (i.subItems) {
                        return `
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    ${i.title}
                                </a>
                                <ul class="dropdown-menu">
                                    ${i.subItems.map(subItem => `
                                        <li><a class="dropdown-item" href="${subItem.link}">${subItem.title}</a></li>
                                    `).join('')}
                                </ul>
                            </li>
                        `;
                    } else {
                        return `
                            <li class="nav-item ${i.hideWhenLoggedIn ? 'nav-link-auth' : ''}">
                                <a class="nav-link" href="${i.link}">${i.title}</a>
                            </li>
                        `;
                    }
                }).join('')}
            </ul>

            <div class="d-flex align-items-center">
                <div id="userInfo" class="me-3 d-none">
                    <span id="userName" class="text-dark">Usuario</span>
                </div>

                <button id="logoutButton" class="btn btn-outline-danger me-3 d-none">
                    Cerrar Sesión
                </button>

                <!-- Carrito simplificado -->
                <div id="navbarCart" class="navbar-cart">
                    <a href="/Pages/carrito.html" class="nav-link position-relative">
                        <i class="fas fa-shopping-cart"></i>
                        <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            0
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</nav>
`;

export function actualizarContadorCarrito() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = totalItems.toString();
    }
}

export function actualizarEstadoSesion() {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const authLinks = document.querySelectorAll('.nav-link-auth');
    const logoutButton = document.getElementById('logoutButton');
    
    const usuarioActivo = sessionStorage.getItem('usuarioActivo');

    if (usuarioActivo) {
        const usuario = JSON.parse(usuarioActivo);
        
        if (userInfo && userName) {
            userInfo.classList.remove('d-none');
            userName.textContent = usuario.nombre;
        }

        if (logoutButton) {
            logoutButton.classList.remove('d-none');
        }
        
        authLinks.forEach(link => {
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.style.display = 'none';
            }
        });
    } else {
        if (userInfo) {
            userInfo.classList.add('d-none');
        }

        if (logoutButton) {
            logoutButton.classList.add('d-none');
        }
        
        authLinks.forEach(link => {
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.style.display = 'block';
            }
        });
    }
}