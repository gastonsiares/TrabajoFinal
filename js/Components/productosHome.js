const contenedorProductos = document.getElementById("contenedor-productos");

// Función para cargar productos de una categoría desde la API de MercadoLibre
async function cargarProductos(categoria) {
    const respuesta = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${categoria}`);
    const datos = await respuesta.json();
    return datos.results.slice(0, 2).map(producto => ({
        title: producto.title,
        price: producto.price,
        description: producto.attributes.find(attr => attr.id === "ITEM_CONDITION")?.value_name || "Descripción no disponible",
        thumbnail: producto.thumbnail.replace("I.jpg", "O.jpg"),
        link: producto.permalink
    }));
}

// Función para renderizar las cards de productos
async function mostrarProductos() {
    const categorias = ["monitores", "teclados", "mouse"];
    
    for (const categoria of categorias) {
        const productos = await cargarProductos(categoria);
        
        // Crear una fila para cada categoría
        const categoriaRow = document.createElement("div");
        categoriaRow.classList.add("row", "mb-4");

        // Crear una card para cada producto
        productos.forEach(producto => {
            const colDiv = document.createElement("div");
            colDiv.classList.add("col-md-6", "col-lg-6", "mb-4");

            
            const card = `
                <div class="card h-100 shadow-sm">
                    <img src="${producto.thumbnail}" class="card-img-top" alt="${producto.title}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text">${producto.description}</p>
                        <p class="card-price">$${producto.price}</p>

                        <div class="quantity-control d-flex align-items-center justify-content-between mb-3">
                            <button class="btn btn-outline-secondary btn-sm btn-restar">-</button>
                            <span class="cantidad">1</span>
                            <button class="btn btn-outline-secondary btn-sm btn-sumar">+</button>
                        </div>

                        <button class="btn btn-primary btn-agregar-carrito">Añadir al carrito</button>
                    </div>
                </div>
            `;
            
            colDiv.innerHTML = card;
            categoriaRow.appendChild(colDiv);
        });
        
        contenedorProductos.appendChild(categoriaRow);
    }

    // Agrega los event listeners para los botones de sumar, restar y añadir al carrito
    agregarEventListeners();
}


mostrarProductos();

// Función control de cantidad y añadir al carrito
function agregarEventListeners() {
    document.querySelectorAll(".btn-sumar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const cantidadSpan = e.target.parentElement.querySelector(".cantidad");
            let cantidad = parseInt(cantidadSpan.textContent);
            cantidadSpan.textContent = ++cantidad;
        });
    });

    document.querySelectorAll(".btn-restar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const cantidadSpan = e.target.parentElement.querySelector(".cantidad");
            let cantidad = parseInt(cantidadSpan.textContent);
            if (cantidad > 1) cantidadSpan.textContent = --cantidad;
        });
    });

    document.querySelectorAll(".btn-agregar-carrito").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            const title = card.querySelector(".card-title").textContent;
            const price = parseFloat(card.querySelector(".card-price").textContent.replace("$", ""));
            const cantidad = parseInt(card.querySelector(".cantidad").textContent);
            
            console.log(`Añadido al carrito: ${title} - Cantidad: ${cantidad} - Precio unitario: $${price}`);
        });
    });
}
