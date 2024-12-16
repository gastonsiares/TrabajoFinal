import { fetchProductos } from '../api/mercadolibre.js';

class ProductManager {
  constructor() {
    this.carrito = this.getCarritoFromStorage();
    this.initEventListeners();
  }

  getCarritoFromStorage() {
    try {
      return JSON.parse(localStorage.getItem("carrito")) || [];
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return [];
    }
  }

  crearCardProducto(producto) {
    const stock = producto.stock || 10; 
    const card = document.createElement('div');
    card.classList.add('card', 'col-4', 'mb-3', 'producto-card');
    card.innerHTML = `
            <div class="card-img-wrapper position-relative">
                <img src="${producto.imagen}" 
                     class="card-img-top img-fluid lazy-load" 
                     alt="${this.sanitizeHTML(producto.titulo)}"
                     data-src="${producto.imagen}">
                ${producto.descuento ? `
                    <span class="badge bg-danger position-absolute top-0 end-0">
                        -${producto.descuento}%
                    </span>
                ` : ''}
            </div>
            <div class="card-body">
                <h5 class="card-title">${this.sanitizeHTML(producto.titulo)}</h5>
                <p class="card-text">${this.sanitizeHTML(producto.condicion)}</p>
                <p class="card-description">${this.sanitizeHTML(producto.descripcion)}</p>
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
        `;
    return card;
  }

  sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  agregarEventosCard(card) {
    const incrementBtn = card.querySelector('.increment');
    const decrementBtn = card.querySelector('.decrement');
    const quantityInput = card.querySelector('.quantity-input');
    const agregarCarritoBtn = card.querySelector('.agregar-carrito');

    const updateQuantity = (newValue) => {
      const max = parseInt(quantityInput.max);
      const value = Math.max(1, Math.min(newValue, max));
      quantityInput.value = value;
    };

    incrementBtn?.addEventListener('click', () => {
      updateQuantity(parseInt(quantityInput.value) + 1);
    });

    decrementBtn?.addEventListener('click', () => {
      updateQuantity(parseInt(quantityInput.value) - 1);
    });

    quantityInput?.addEventListener('change', (e) => {
      updateQuantity(parseInt(e.target.value));
    });

    agregarCarritoBtn?.addEventListener('click', (e) => this.agregarAlCarrito(e));
  }

  async agregarAlCarrito(event) {
    try {
      const card = event.target.closest('.card');
      const productoId = event.target.dataset.id;
      const cantidad = parseInt(card.querySelector('.quantity-input').value);
      const stock = parseInt(card.querySelector('.quantity-input').max);

      if (cantidad > stock) {
        throw new Error(`Solo hay ${stock} unidades disponibles`);
      }

      const productoExistente = this.carrito.find(item => item.id === productoId);
      const nuevaCantidad = (productoExistente?.cantidad || 0) + cantidad;

      if (nuevaCantidad > stock) {
        throw new Error('La cantidad total supera el stock disponible');
      }

      if (productoExistente) {
        productoExistente.cantidad = nuevaCantidad;
      } else {
        this.carrito.push({
          id: productoId,
          titulo: card.querySelector('.card-title').textContent,
          precio: parseFloat(card.querySelector('.card-price').textContent.replace('$', '')),
          cantidad: cantidad,
          imagen: card.querySelector('img').src,
          stock: stock
        });
      }

      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      this.actualizarContadorCarrito();
      this.mostrarNotificacion('Producto agregado al carrito', 'success');
    } catch (error) {
      this.mostrarNotificacion(error.message, 'error');
    }
  }

  actualizarContadorCarrito() {
    const totalProductos = this.carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
      cartCount.textContent = totalProductos;
      cartCount.classList.add('animate__animated', 'animate__bounce');
      setTimeout(() => {
        cartCount.classList.remove('animate__animated', 'animate__bounce');
      }, 1000);
    }
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

  initEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.actualizarContadorCarrito();
      const cardContainer = document.getElementById('cardContainer');
      if (cardContainer) {
        const categoria = cardContainer.dataset.categoria;
        this.mostrarProductosPorCategoria(categoria);
      }
    });
  }

  async mostrarProductosPorCategoria(categoria) {
    const cardContainer = document.getElementById('cardContainer');
    if (!cardContainer) return;

    try {
      cardContainer.innerHTML = `
                <div class="text-center p-5">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
            `;

      const productos = await fetchProductos(categoria);
      cardContainer.innerHTML = '';

      if (productos.length === 0) {
        cardContainer.innerHTML = `
                    <div class="alert alert-info">
                        No se encontraron productos en esta categoría
                    </div>
                `;
        return;
      }

      productos.forEach(producto => {
        const card = this.crearCardProducto(producto);
        this.agregarEventosCard(card);
        cardContainer.appendChild(card);
      });

      this.initLazyLoading();
    } catch (error) {
      console.error('Error al mostrar productos:', error);
      cardContainer.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar los productos. Por favor, intenta nuevamente.
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
}

export const productManager = new ProductManager();
export const { actualizarContadorCarrito } = productManager;



