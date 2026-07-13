// ui.js

export function actualizarPantalla(precio) {
    const contenedorPrecio = document.getElementById('precio-dolar');
    const contenedorEstado = document.getElementById('estado');
    
    if (precio !== null) {
        // Si hay datos, actualizamos el precio y la hora exacta
        contenedorPrecio.textContent = `Bs. ${precio}`;
        const horaActual = new Date().toLocaleTimeString();
        contenedorEstado.textContent = `Última actualización: ${horaActual}`;
    } else {
        // Manejo de errores visual
        contenedorPrecio.textContent = 'Error';
        contenedorEstado.textContent = 'Reintentando conexión...';
    }
}