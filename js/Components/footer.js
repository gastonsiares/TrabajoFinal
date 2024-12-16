function crearFooter() {
    const footer = document.createElement('footer');
    footer.className = 'bg-dark text-white py-4';
    footer.innerHTML = `
        <div class="container text-center">
            <p>&copy; 2024 Tienda 5-5. Todos los derechos reservados.</p>
            <ul class="list-inline">
                <li class="list-inline-item"><a href="/Pages/home.html" class="text-white text-decoration-none">Políticas</a></li>
                <li class="list-inline-item"><a href="/Pages/home.html" class="text-white text-decoration-none">Contacto</a></li>
                <li class="list-inline-item"><a href="/Pages/home.html" class="text-white text-decoration-none">FAQ</a></li>
            </ul>
            <p>Síguenos en:</p>
            <ul class="list-inline">
                <li class="list-inline-item"><a href="https://facebook.com" target="_blank"><i class="fab fa-facebook"></i></a></li>
                <li class="list-inline-item"><a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a></li>
                <li class="list-inline-item"><a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a></li>
            </ul>
        </div>
    `;
    return footer;
}


document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    body.appendChild(crearFooter());
});
