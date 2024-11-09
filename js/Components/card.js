export const cardComponent = (img, titulo, descripcion, precio) => {
    return `
        <div class="col">
            <div class="card" style="width: 18rem;">
                <img src="${img}" class="card-img-top" alt="${titulo}">
                <div class="card-body">
                    <h5 class="card-title">${titulo}</h5>
                    <p class="card-text">${descripcion}</p>
                    <p class="card-text"><strong>$${precio}</strong></p>
                    <input type="number" value="1" min="1" class="quantity">
                    <button class="btn btn-primary">Agregar al carrito</button>
                </div>
            </div>
        </div>
    `;
};



