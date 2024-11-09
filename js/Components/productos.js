// Función para obtener productos desde la API de MercadoLibre según la categoría especificada
async function fetchProductos(categoria) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${categoria}&limit=10`);
    if (!response.ok) throw new Error('Error al cargar los productos.');
    const data = await response.json();
    return data.results; // Retornar los resultados de la búsqueda
  } catch (error) {
    console.error(error);
  }
}

// Función para mostrar los productos en la página
async function mostrarProductosPorCategoria(categoria) {
  const productos = await fetchProductos(categoria);
  if (!productos) return;

  const cardContainer = document.getElementById('cardContainer');
  if (!cardContainer) {
    console.error('No se encontró el contenedor de cards');
    return;
  }

  productos.forEach(producto => {
    const highResImage = producto.thumbnail.replace('I.jpg', 'O.jpg'); // Obtener imagen en alta resolución
    const card = document.createElement('div');
    card.classList.add('card', 'col-4', 'mb-3');
    card.innerHTML = `
      <img src="${highResImage}" class="card-img-top img-fluid" alt="${producto.title}">
      <div class="card-body">
        <h5 class="card-title">${producto.title}</h5>
        <p class="card-text">${producto.condition === 'new' ? 'Nuevo' : 'Usado'}</p>
        <p class="card-description">${producto.title.length > 80 ? producto.title.slice(0, 77) + '...' : producto.title}</p>
        <p class="card-price">$${producto.price}</p>

        <div class="quantity-control d-flex align-items-center mb-3">
          <button class="btn btn-sm btn-secondary decrement">-</button>
          <input type="number" value="1" min="1" class="form-control mx-2 quantity-input" style="width: 60px;">
          <button class="btn btn-sm btn-secondary increment">+</button>
        </div>

        <button class="btn btn-primary agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
      </div>
    `;
    cardContainer.appendChild(card);
  });

  // Agrega eventos a los botones de "Agregar al carrito"
  document.querySelectorAll('.agregar-carrito').forEach(button => {
    button.addEventListener('click', agregarAlCarrito);
  });

  // Agrega eventos para los controles de cantidad
  document.querySelectorAll('.increment').forEach(button => {
    button.addEventListener('click', event => {
      const input = event.target.previousElementSibling;
      input.value = parseInt(input.value) + 1;
    });
  });

  document.querySelectorAll('.decrement').forEach(button => {
    button.addEventListener('click', event => {
      const input = event.target.nextElementSibling;
      if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    });
  });
}

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
  const productoId = event.target.dataset.id;
  const cantidad = parseInt(event.target.previousElementSibling.querySelector('.quantity-input').value);
  // Aquí puedes almacenar el producto en LocalStorage, en un array, etc.
  console.log(`Producto con ID ${productoId} agregado al carrito con cantidad ${cantidad}`);
}

// Configurar la página para cargar la categoría especificada en data-categoria
document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById('cardContainer');
  const categoria = cardContainer.getAttribute('data-categoria'); // Leer la categoría desde el atributo

  // Llamar a la función para mostrar productos de la categoría especificada
  mostrarProductosPorCategoria(categoria);
});
