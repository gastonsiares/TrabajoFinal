import { fetchProductos } from '../api/mercadolibre.js';
import { productManager } from './productos.js';

async function cargarResultadosBusqueda() {
    const busqueda = sessionStorage.getItem('ultimaBusqueda');
    if (!busqueda) {
        document.getElementById('resultados').innerHTML = '<p>No se encontraron resultados</p>';
        return;
    }

    try {
        const productos = await fetchProductos(busqueda);
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los resultados:', error);
        document.getElementById('resultados').innerHTML = '<p>Error al cargar los resultados</p>';
    }
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('resultados');
    if (!productos || productos.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron productos para esta búsqueda</p>';
        return;
    }

    contenedor.innerHTML = productos.map(producto => {
        const stock = producto.stock || 10;
        return `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 producto-card">
                    <div class="card-img-wrapper position-relative">
                        <img src="${producto.imagen}" 
                             class="card-img-top img-fluid" 
                             alt="${producto.titulo}">
                        ${producto.descuento ? `
                            <span class="badge bg-danger position-absolute top-0 end-0">
                                -${producto.descuento}%
                            </span>
                        ` : ''}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${producto.descripcion}</h5>
                        <p class="card-text">
                            <strong>Condición: </strong>${producto.condicion}
                        </p>
                        <div class="price-container">
                            ${producto.precioOriginal ? `
                                <span class="text-decoration-line-through text-muted">
                                    $${producto.precioOriginal}
                                </span>
                            ` : ''}
                            <p class="card-price fs-4">$${producto.precio}</p>
                        </div>
                        <p class="stock-info ${stock < 5 ? 'text-danger' : ''}">
                            ${stock < 5 ? `¡Solo quedan ${stock} unidades!` : `Stock disponible: ${stock}`}
                        </p>
                        <div class="quantity-control d-flex align-items-center mb-3">
                            <button class="btn btn-sm btn-secondary decrement">-</button>
                            <input type="number" 
                                   value="1" 
                                   min="1" 
                                   max="${stock}"
                                   class="form-control mx-2 quantity-input" 
                                   style="width: 60px;">
                            <button class="btn btn-sm btn-secondary increment">+</button>
                        </div>
                        <button class="btn btn-primary agregar-carrito" 
                                data-id="${producto.id}"
                                ${stock === 0 ? 'disabled' : ''}>
                            ${stock === 0 ? 'Sin Stock' : 'Agregar al carrito'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Agregar eventos a todos los controles de los productos
    const cards = contenedor.querySelectorAll('.producto-card');
    cards.forEach(card => {
        const quantityInput = card.querySelector('.quantity-input');
        const incrementBtn = card.querySelector('.increment');
        const decrementBtn = card.querySelector('.decrement');
        const agregarCarritoBtn = card.querySelector('.agregar-carrito');

        // Función para actualizar la cantidad
        const updateQuantity = (newValue) => {
            const max = parseInt(quantityInput.max);
            const value = Math.max(1, Math.min(newValue, max));
            quantityInput.value = value;
        };

        //controles de cantidad
        incrementBtn?.addEventListener('click', () => {
            updateQuantity(parseInt(quantityInput.value) + 1);
        });

        decrementBtn?.addEventListener('click', () => {
            updateQuantity(parseInt(quantityInput.value) - 1);
        });

        quantityInput?.addEventListener('change', (e) => {
            updateQuantity(parseInt(e.target.value));
        });

        //agregar al carrito
        agregarCarritoBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            productManager.agregarAlCarrito(e);
        });
    });
}

// Inicializar la carga de resultados al cargar la página
document.addEventListener('DOMContentLoaded', cargarResultadosBusqueda);