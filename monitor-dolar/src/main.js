// main.js

// 1. Importamos nuestras herramientas
import { obtenerPrecioDolar } from './modules/api.js';
import { actualizarPantalla } from './modules/ui.js';
// 2. Definimos el flujo principal
async function ejecutarCiclo() {
    // Pedimos el dato a la API
    const precio = await obtenerPrecioDolar();
    
    // Mandamos a pintar el dato en la pantalla
    actualizarPantalla(precio);
}

// 3. Arrancamos el sistema inmediatamente la primera vez
ejecutarCiclo();

// 4. Establecemos el "Tiempo Real"
// setInterval ejecutará la función cada 30 segundos (30000 milisegundos)
setInterval(ejecutarCiclo, 30000);