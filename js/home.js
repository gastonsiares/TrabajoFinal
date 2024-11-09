



async function fetchProductos() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLA/search?q=monitores&limit=10');
    if (!response.ok) throw new Error('Error al cargar los productos.');
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error(error);
  }
}

async function mostrarProductosPorCategoria() {
  const productos = await fetchProductos();
  if (!productos) return;

  const cardContainer = document.getElementById('cardContainer');
  if (!cardContainer) {
    console.error('No se encontró el contenedor de cards');
    return;
  }

  productos.forEach(producto => {
    const highResImage = producto.thumbnail.replace('I.jpg', 'O.jpg'); // Imagen en alta resolución
    const card = document.createElement('div');
    card.classList.add('card', 'col-4', 'mb-3');
    card.innerHTML = `
      <img src="${highResImage}" class="card-img-top img-fluid" alt="${producto.title}" style="height: 290px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${producto.title}</h5>
        <p class="card-price">$${producto.price}</p>
        <button class="btn btn-primary agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
      </div>
    `;
    cardContainer.appendChild(card);
  });

  // Agrega eventos a los botones de "Agregar al carrito"
  document.querySelectorAll('.agregar-carrito').forEach(button => {
    button.addEventListener('click', agregarAlCarrito);
  });
}

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
  const productoId = event.target.dataset.id;
  // Aquí puedes almacenar el producto en LocalStorage, en un array, etc.
  console.log(`Producto con ID ${productoId} agregado al carrito`);
}

mostrarProductosPorCategoria();








// Función para obtener la lista inicial de productos
// async function fetchProductos() {
//     try {
//       const response = await fetch('https://api.mercadolibre.com/sites/MLA/search?q=monitores&limit=6');
//       if (!response.ok) throw new Error('Error al cargar los productos.');
//       const data = await response.json();
//       return data.results; // Los productos están en la propiedad `results`
//     } catch (error) {
//       console.error(error);
//     }
//   }
  
//   // Función para obtener los detalles de un producto específico por `id`
//   async function fetchProductoDetalle(id) {
//     try {
//       const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
//       if (!response.ok) throw new Error('Error al cargar el detalle del producto.');
//       const data = await response.json();
//       return data.pictures[0].url; // URL de la imagen en alta resolución
//     } catch (error) {
//       console.error(error);
//     }
//   }
  
//   // Función para mostrar los productos en la página
//   async function mostrarProductosPorCategoria() {
//     const productos = await fetchProductos();
    
//     if (!productos) return;
  
//     const cardContainer = document.getElementById('cardContainer');
//     if (!cardContainer) {
//       console.error('No se encontró el contenedor de cards');
//       return;
//     }
  
//     // Recorre cada producto y obtiene la imagen en alta resolución
//     for (const producto of productos) {
//       const imageUrl = await fetchProductoDetalle(producto.id); // Llama a la función para obtener la imagen
  
//       const card = document.createElement('div');
//       card.classList.add('card', 'col-4', 'mb-3');
//       card.innerHTML = `
//         <img src="${imageUrl}" class="card-img-top" alt="${producto.title}">
//         <div class="card-body">
//           <h5 class="card-title">${producto.title}</h5>
//           <p class="card-price">$${producto.price}</p>
//         </div>
//       `;
//       cardContainer.appendChild(card);
//     }
//   }
  
//   // Llama a la función al cargar la página
//   mostrarProductosPorCategoria();
  





// import { cardComponent } from "./Components/card.js";
// import { carouselComponent } from "./Components/carousel.js";

// Definición de productos
// const productos = [
//     {
//         img: "/img/auricular.png",
//         titulo: "Auriculares Hyperx Cloud III",
//         descripcion: "Headset Audífonos Gamer Hyperx Cloud III 3 Color Black/red.",
//         precio: 59.99
//     },
//     {
//         img: "/img/MonitorSamsung.png",
//         titulo: "Monitor Samsung Odyssey G4",
//         descripcion: "Monitor Samsung Odyssey G4 S25BG40 25 pulgadas, IPS, 240Hz.",
//         precio: 299.99
//     },
//     {
//         img: "/img/mother.png",
//         titulo: "Placa Madre Asus TUF B450m",
//         descripcion: "Placa Madre Asus Tuf Gaming B450m Plus 2 Ryzen.",
//         precio: 129.99
//     }
// ];

// Imágenes para el carrusel
// const carouselImages = [
//     "/img/auricular.png",
//     "/img/MonitorSamsung.png",
//     "/img/mother.png"
// ];

// // Obtener el contenedor del carrusel y las tarjetas
// let carouselContainer = document.getElementById('carouselEContainer');
// let cardContainer = document.getElementById('cardContainer');

// // Esperar a que la página se cargue
// window.addEventListener('load', () => {
//     // Limpiar los contenedores antes de agregar nuevo contenido
//     cardContainer.innerHTML = '';
//     carouselContainer.innerHTML = '';

//     // Generar y añadir el HTML del carrusel al contenedor
//     carouselContainer.innerHTML = carouselComponent(carouselImages[0], carouselImages[1], carouselImages[2]);

//     // Iterar sobre los productos y generar tarjetas
//     productos.forEach(producto => {
//         const cardHTML = cardComponent(producto.img, producto.titulo, producto.descripcion, producto.precio);
//         cardContainer.innerHTML += cardHTML;
//     });
// });

// document.addEventListener('show.bs.dropdown', function (event) {
//     console.log('Dropdown is being shown:', event.target);
// });



// import { cardComponent } from "./Components/card.js";
// import {carouselComponent} from "./Components/carousel.js";

// const productos = [
//     {
//         img: "/img/auricular.png",
//         titulo: "Auriculares Hyperx Cloud III",
//         descripcion: "Headset Audífonos Gamer Hyperx Cloud III 3 Color Black/red.",
//         precio: 59.99
//     },
//     {
//         img: "/img/Monitor samsung.png",
//         titulo: "Monitor Samsung Odyssey G4",
//         descripcion: "Monitor Samsung Odyssey G4 S25BG40 25 pulgadas, IPS, 240Hz.",
//         precio: 299.99
//     },
//     {
//         img: "/img/mother.png",
//         titulo: "Placa Madre Asus TUF B450m",
//         descripcion: "Placa Madre Asus Tuf Gaming B450m Plus 2 Ryzen.",
//         precio: 129.99
//     }
// ];

// const carouselImages = [
//     "/img/auricular.png",
//     "/img/Monitor samsung.png",
//     "/img/mother.png"
// ];

// import {carouselComponent} from "./Components/carousel.js";
// const carousel =[
//     {
//         img:"/img/auricular.png"
//     },
//     {
//         img:"/img/Monitor samsung.png"
//     },
//     {
//         img:"/img/mother.png"
//     }
// ];

// // Obtener el contenedor del carrusel
// let carouselContainer = document.getElementById('carouselEContainer');
// // Obtener el contenedor donde se insertarán las tarjetas
// let cardContainer = document.getElementById('cardContainer');

// // Esperar a que la página se cargue
// window.addEventListener('load', () => {
//     // Limpiar el contenedor antes de agregar nuevas tarjetas
//     cardContainer.innerHTML = '';
//     carouselContainer.innerHTML = '';

//     // Generar el HTML del carrusel con las imágenes
//     carouselContainer.innerHTML = carouselComponent(carouselImages[0], carouselImages[1], carouselImages[2]);
    
   
//     // Iterar sobre los productos y generar cada tarjeta
//     productos.forEach(producto => {
//         // Generar una tarjeta para cada producto usando el cardComponent
//         const cardHTML = cardComponent(producto.img, producto.titulo, producto.descripcion, producto.precio);
        
//         // Añadir la tarjeta al contenedor
//         cardContainer.innerHTML += cardHTML;
//     });
// });









// import { cardComponent } from "./Components/card.js";

// let cardContainer = document.getElementById('cardContainer')
// window.addEventListener('load',()=>{

//     cardContainer.innerHTML = cardComponent('titulo1','texto text','texto 2sss')
// })