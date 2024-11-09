// Cards.js
const productos = [
    {
        titulo: "Auriculares Hyperx Cloud III",
        descripcion: "Headset Audífonos Gamer Hyperx Cloud Iii 3 Color Black/red.",
        precio: 59.99,
        img: "/img/auricular.png"
    },
    {
        titulo: "Monitor Samsung Odyssey G4",
        descripcion: "Monitor Samsung Odyssey G4 S25BG40 25 pulgadas, IPS, 240Hz.",
        precio: 299.99,
        img: "/img/Monitor samsung.png" 
    },
    {
        titulo: "Placa Madre Asus TUF B450m",
        descripcion: "Placa Madre Asus Tuf Gaming B450m Plus 2 Ryzen.",
        precio: 129.99,
        img: "/img/mother.png"
    }
];

// Función para renderizar las cards
function renderCards(productos) {
    const container = document.querySelector('.row');
    if (!container) {
        console.error('Contenedor de cards no encontrado');
        return;
    }
    container.innerHTML = '';  // Limpiar el contenido antes de agregar nuevas cards

    productos.forEach(producto => {
        const card = `
        <div class="col">
            <div class="card" style="width: 18rem;">
                <img src="${producto.img}" class="card-img-top" alt="${producto.titulo}">
                <div class="card-body">
                    <h5 class="card-title">${producto.titulo}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text"><strong>$${producto.precio}</strong></p>
                    <input type="number" value="1" min="1" class="quantity">
                    <button class="btn btn-primary">Agregar al carrito</button>
                </div>
            </div>
        </div>`;
        
        container.innerHTML += card;
    });
}

// Renderizar las cards al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderCards(productos);
});
