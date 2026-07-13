// ------------------------------------------------------------------
// MISIÓN PARA EL ALUMNO:
// Debes hacer que los botones funcionen modificando ÚNICAMENTE este archivo.
// NO puedes usar bases de datos ni LocalStorage todavía.
// Toda la información debe vivir en estas dos variables globales:
// ------------------------------------------------------------------

// Arreglo para guardar a las personas que están esperando
let filaDeEspera = [];

// Número correlativo para asignar el turno (ej. 1, 2, 3...)
let numeroTurnoGlobal = 1;

// ------------------------------------------------------------------
// REFERENCIAS AL DOM (Las conexiones entre JS y el HTML)
// ------------------------------------------------------------------
const inputNombre = document.getElementById('nombre-ciudadano');
const btnRegistrar = document.getElementById('btn-registrar');
const btnLlamar = document.getElementById('btn-llamar');
const displayTurnoActual = document.getElementById('turno-actual');
const displayNombreActual = document.getElementById('nombre-actual');
const listaEsperaUl = document.getElementById('lista-espera');
const contadorFila = document.getElementById('contador-fila');

// ------------------------------------------------------------------
// FUNCIONES CORE (Tu trabajo empieza aquí)
// ------------------------------------------------------------------

function registrarCiudadano() {
    // RETO 1:
    // 1. Obtener el valor de 'inputNombre'
    const nombre = inputNombre.value.trim();

    // 2. Validar que no esté vacío (TIP: ten cuidado con los espacios en blanco)
    if (nombre === "") {
        alert("Por favor, ingrese el nombre del ciudadano.");
        return;
    }

    // 3. Crear un objeto literal que represente a la persona. Ejemplo:
    //    { turno: "A-1", nombre: "Juan Pérez" }
    const nuevoCiudadano = {
        turno: `A-${numeroTurnoGlobal}`,
        nombre: nombre
    };

    // 4. Agregar ese objeto a 'filaDeEspera'
    filaDeEspera.push(nuevoCiudadano);

    // 5. Incrementar 'numeroTurnoGlobal' para el siguiente
    numeroTurnoGlobal++;

    // 6. Limpiar el input para que quede listo para otra persona
    inputNombre.value = "";

    // 7. Llamar a la función 'actualizarInterfazFila()'
    actualizarInterfazFila();
}

function llamarSiguiente() {
    // RETO 2:
    // 1. Validar si 'filaDeEspera' está vacía. Si es así, avisar y salir.
    if (filaDeEspera.length === 0) {
        alert("No hay ciudadanos en la fila de espera.");
        return;
    }

    // 2. Extraer a la PRIMERA persona de la 'filaDeEspera' (piensa en FIFO)
    const siguientePersona = filaDeEspera.shift();

    // 3. Mostrar el turno de esa persona en 'displayTurnoActual'
    displayTurnoActual.innerText = siguientePersona.turno;

    // 4. Mostrar el nombre de esa persona en 'displayNombreActual'
    displayNombreActual.innerText = siguientePersona.nombre;

    // 5. Llamar a la función 'actualizarInterfazFila()'
    actualizarInterfazFila();
}

function actualizarInterfazFila() {
    // RETO 3:
    // 1. Limpiar el contenido actual de 'listaEsperaUl' para evitar duplicados
    listaEsperaUl.innerHTML = "";

    // 2. Recorrer el arreglo 'filaDeEspera'
    filaDeEspera.forEach(persona => {
        // 3. Por cada persona, crear un elemento <li> (ej. "Turno: A-X - Nombre")
        const li = document.createElement('li');
        
        // Usamos estructura interna para que el CSS (flexbox justify-content: space-between)
        // separe adecuadamente el turno del nombre
        li.innerHTML = `<span>Turno: ${persona.turno}</span> <span>${persona.nombre}</span>`;

        // 4. Agregar ese <li> al 'listaEsperaUl'
        listaEsperaUl.appendChild(li);
    });

    // 5. Actualizar el texto de 'contadorFila' con la cantidad de gente esperando.
    contadorFila.innerText = filaDeEspera.length;
}

// ------------------------------------------------------------------
// EVENT LISTENER (Conectando clics a las funciones)
// ------------------------------------------------------------------
btnRegistrar.addEventListener('click', registrarCiudadano);
btnLlamar.addEventListener('click', llamarSiguiente);