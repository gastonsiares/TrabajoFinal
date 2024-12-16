import { navBarComponent, actualizarContadorCarrito, actualizarEstadoSesion, initializeSearch } from "./Components/Navbar.js";

document.addEventListener('DOMContentLoaded', () => {

    const navContainer = document.querySelector('header');
    if (navContainer) {
        navContainer.innerHTML = navBarComponent;


        initializeNavbar();


        mostrarMensajeBienvenida();
    }
});

function initializeNavbar() {
    actualizarContadorCarrito();
    initializeSearch()
    actualizarEstadoSesion();


    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('usuarioActivo');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('nombreUsuario');
            window.location.href = '/Pages/InicioRegistro/login.html';
        });
    }
}

function mostrarMensajeBienvenida() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const usuarioActivo = sessionStorage.getItem('usuarioActivo');

    if (welcomeMessage && usuarioActivo) {
        const usuario = JSON.parse(usuarioActivo);
        welcomeMessage.textContent = `Bienvenido, ${usuario.nombre}`;
    }
}

export { initializeNavbar, mostrarMensajeBienvenida };

