stener("DOMContentLoaded", () => {
  inicializarCarrito();
});

function inicializarCarrito() {
  crearEstructuraHTML();
  mostrarCarrito();
  calcularTotal();
  initializeTooltips();
  setupEventListeners();
}

function crearEstructuraHTML() {
  const mainContainer = document.createElement('div');
  mainContainer.className = 'row';
  mainContainer.innerHTML = `
  <div class="col-lg-8">
      <h2 class="mb-4">Mi Carrito</h2>
      <div id="carritoContainer" class="list-group">
        <!-- Los productos se agregarán dinámicamente -->
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card p-3">
        <h4>Resumen de compra</h4>
        <div class="d-flex justify-content-between">
          <span>Subtotal:</span>
          <span id="subtotal">$0</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Envío:</span>
          <span id="envio">$0</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between">
          <strong>Total:</strong>
          <strong id="total">$0</strong>
        </div>
        <button class="btn btn-danger w-100 mt-3" id="vaciarCarrito">
          Vaciar Carrito
        </button>
        <button class="btn btn-primary w-100 mt-3" id="finalizarCompra">
          Finalizar Compra
        </button>
      </div>
    </div>
`;
const carritoMainContainer = document.getElementById('carritoMainContainer');
  if (carritoMainContainer) {
    carritoMainContainer.appendChild(mainContainer);
  }

  // Crear el modal
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'confirmarCompraModal';
  modal.setAttribute('tabindex', '-1');
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar Compra</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas finalizar la compra?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="confirmarCompraBtn">Confirmar Compra</button>
        </div>
      </div>
    </div>
  `;

  
  
  document.body.appendChild(modal);
}

function setupEventListeners() {
  //Vaciar el carrito
  document.getElementById('vaciarCarrito').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem("carrito");
    mostrarCarrito();
    calcularTotal();
    mostrarNotificacion("Carrito vaciado", "info");
  });
  
  
  document.getElementById('carritoContainer').addEventListener('click', (e) => {
    const target = e.target.closest('button, a');
    if (!target) return;

    if (target.tagName === 'BUTTON') {
      e.preventDefault();
    }

    if (target.classList.contains('btn-eliminar')) {
      eliminarProducto(target.dataset.id);
    } else if (target.classList.contains('btn-cantidad')) {
      cambiarCantidad(target.dataset.id, parseInt(target.dataset.accion));
    }
  });

  // Botón de finalizar compra
  document.getElementById('finalizarCompra').addEventListener('click', (e) => {
    e.preventDefault();
    const carrito = cargarCarrito();
    if (carrito.length === 0) {
      mostrarNotificacion("El carrito está vacío", "warning");
      return;
    }
    const modal = new bootstrap.Modal(document.getElementById('confirmarCompraModal'));
    modal.show();
  });

  // Botón de confirmar compra en el modal
  document.getElementById('confirmarCompraBtn').addEventListener('click', procesarCompra);
}

function initializeTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function cargarCarrito() {
  try {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    mostrarNotificacion("Error al cargar el carrito", "danger");
    return [];
  }
}

function guardarCarrito(carrito) {
  try {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } catch (error) {
    console.error("Error al guardar el carrito:", error);
    mostrarNotificacion("Error al guardar los cambios", "danger");
  }
}

function mostrarCarrito() {
  const carritoContainer = document.getElementById("carritoContainer");
  if (!carritoContainer) return;

  const carrito = cargarCarrito();

  if (carrito.length === 0) {
    carritoContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
        <h5>Tu carrito está vacío</h5>
        <p class="text-muted">¡Agrega algunos productos para comenzar!</p>
        <a href="/index.html" class="btn btn-primary mt-3">
          <i class="fas fa-shopping-bag me-2"></i>Ir a la tienda
        </a>
      </div>
    `;
    return;
  }

  carritoContainer.innerHTML = carrito.map(producto => `
    <div class="list-group-item producto-card" data-id="${producto.id}">
      <div class="row align-items-center">
        <div class="col-12 col-md-2">
          <img src="${producto.imagen}" alt="${producto.titulo}" 
               class="img-fluid rounded producto-imagen">
        </div>
        <div class="col-12 col-md-4">
          <h5 class="mb-1">${producto.titulo}</h5>
          <p class="mb-1 text-muted">Precio unitario: $${producto.precio.toFixed(2)}</p>
        </div>
        <div class="col-12 col-md-3">
          <div class="input-group quantity-control">
            <button class="btn btn-outline-secondary btn-cantidad" 
                    data-id="${producto.id}" 
                    data-accion="-1">
              <i class="fas fa-minus"></i>
            </button>
            <input type="text" class="form-control text-center" 
                   value="${producto.cantidad}" readonly>
            <button class="btn btn-outline-secondary btn-cantidad" 
                    data-id="${producto.id}" 
                    data-accion="1">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        <div class="col-12 col-md-2 text-end">
          <p class="mb-1">
            <strong>$${(producto.precio * producto.cantidad).toFixed(2)}</strong>
          </p>
        </div>
        <div class="col-12 col-md-1 text-end">
          <button class="btn btn-outline-danger btn-eliminar" 
                  data-id="${producto.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function cambiarCantidad(id, accion) {
  if (!id) return;

  let carrito = cargarCarrito();
  const producto = carrito.find(p => p.id === id);

  if (producto) {
    const nuevaCantidad = producto.cantidad + accion;
    if (nuevaCantidad < 1) {
      mostrarNotificacion("La cantidad no puede ser menor a 1", "warning");
      return;
    }
    producto.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    mostrarCarrito();
    calcularTotal();
  }
}

function eliminarProducto(id) {
  if (!id) return;

  const productoElement = document.querySelector(`.producto-card[data-id="${id}"]`);
  if (productoElement) {
    productoElement.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      let carrito = cargarCarrito();
      carrito = carrito.filter(producto => producto.id !== id);
      guardarCarrito(carrito);
      mostrarCarrito();
      calcularTotal();
    }, 300);
  }
}

function calcularTotal() {
  const carrito = cargarCarrito();
  const subtotal = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
  const envio = subtotal > 0 ? 5000 : 0;
  const total = subtotal + envio;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("envio").textContent = `$${envio.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;

  const finalizarBtn = document.getElementById("finalizarCompra");
  if (finalizarBtn) {
    finalizarBtn.disabled = carrito.length === 0;
  }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  toast.style.zIndex = '1050';
  toast.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function procesarCompra() {
  localStorage.removeItem("carrito");
  mostrarCarrito();
  calcularTotal();
  mostrarNotificacion("¡Gracias por tu compra!", "success");

  const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarCompraModal'));
  if (modal) modal.hide();
}