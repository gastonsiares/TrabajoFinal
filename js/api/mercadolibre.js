const API_BASE_URL = 'https://api.mercadolibre.com/sites/MLA';

export async function fetchProductos(categoria) {
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${categoria}&limit=10`);
        if (!response.ok) throw new Error('Error al cargar los productos.');
        const data = await response.json();
        return data.results.map(producto => ({
            id: producto.id,
            titulo: producto.title,
            precio: producto.price,
            condicion: producto.condition === 'new' ? 'Nuevo' : 'Usado',
            imagen: producto.thumbnail.replace('I.jpg', 'O.jpg'),
            descripcion: producto.title.length > 80 ? producto.title.slice(0, 77) + '...' : producto.title
        }));
    } catch (error) {
        console.error('Error en fetchProductos:', error);
        throw error;
    }
}