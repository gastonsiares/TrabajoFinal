import { navBarComponent, actualizarContadorCarrito, actualizarEstadoSesion } from "./Components/Navbar.js";

document.addEventListener('DOMContentLoaded', () => {
    // Insertar el navbar
    const navContainer = document.querySelector('header');
    if (navContainer) {
        navContainer.innerHTML = navBarComponent;
        
        // Una vez que el navbar está en el DOM, inicializar las funcionalidades
        initializeNavbar();
        
        // mensaje de bienvenida
        mostrarMensajeBienvenida();
    }
});

function initializeNavbar() {
    // Inicializar carrito
    actualizarContadorCarrito();
    
    // Inicializar estado de sesión
    actualizarEstadoSesion();
    
    // Configurar el botón de logout
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