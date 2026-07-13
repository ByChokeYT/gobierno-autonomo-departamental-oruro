// api.js

export async function obtenerPrecioDolar() {
    try {
        // Usamos una API pública y gratuita de tasas de cambio
        const respuesta = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!respuesta.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        
        const datos = await respuesta.json();
        
        // Retornamos el valor del dólar convertido a Bolivianos (BOB)
        return datos.rates.BOB; 
        
    } catch (error) {
        console.error('Fallo en el módulo API:', error);
        return null; // Retornamos null para que la UI sepa que hubo un error
    }
}