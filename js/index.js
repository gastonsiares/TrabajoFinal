

import { navBarComponent } from "./Components/Navbar.js";

document.addEventListener('DOMContentLoaded', () => {
  let navContainer = document.querySelector('header');
  
  window.addEventListener('load', () => {
    navContainer.innerHTML = navBarComponent;

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage && isLoggedIn && nombreUsuario) {
      welcomeMessage.textContent = `Bienvenido, ${nombreUsuario}`;
  }
    
  });
});

// Inicializar todos los dropdowns de Bootstrap manualmente
// document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
//   new bootstrap.Dropdown(dropdown);
// });


