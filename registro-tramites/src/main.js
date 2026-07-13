// ------------------------------------------------------------------
// GOBERNACIÓN AUTÓNOMA DEPARTAMENTAL DE ORURO
// FASE 2: La Memoria (Persistencia de Datos con LocalStorage)
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// 1. ESTADO DE LA APLICACIÓN (Variables Globales)
// ------------------------------------------------------------------
// Intentamos cargar la lista desde LocalStorage al iniciar. Si no hay nada, inicializamos vacío.
let listaTramites = [];

// ------------------------------------------------------------------
// 2. REFERENCIAS AL DOM
// ------------------------------------------------------------------
const formulario = document.getElementById('formulario-tramite');
const inputNombre = document.getElementById('nombre');
const inputCedula = document.getElementById('cedula');
const selectTramite = document.getElementById('tipo-tramite');
const tbodyTramites = document.getElementById('tbody-tramites');
const contadorTramites = document.getElementById('contador-tramites');
const estadoVacio = document.getElementById('estado-vacio');

// ------------------------------------------------------------------
// 3. FUNCIONES DE PERSISTENCIA (LocalStorage)
// ------------------------------------------------------------------

// RETO 1: Guardar información en LocalStorage
function guardarEnLocalStorage() {
    // 1. Convertir el arreglo 'listaTramites' a un String usando JSON.stringify
    // 2. Guardar en localStorage bajo la clave 'tramites_gobernacion'
    localStorage.setItem('tramites_gobernacion', JSON.stringify(listaTramites));
}

// RETO 2: Cargar información desde LocalStorage
function cargarDesdeLocalStorage() {
    // 1. Obtener el string guardado en localStorage bajo la clave 'tramites_gobernacion'
    const datosRaw = localStorage.getItem('tramites_gobernacion');
    
    // 2. Si existen datos, convertirlos de vuelta a un arreglo usando JSON.parse y asignarlos a 'listaTramites'
    if (datosRaw) {
        listaTramites = JSON.parse(datosRaw);
    }
}

// ------------------------------------------------------------------
// 4. FUNCIONES DE RENDERIZADO (Actualizar la Interfaz)
// ------------------------------------------------------------------

// RETO 3: Dibujar la tabla dinámicamente
function renderizarTabla() {
    // 1. Limpiar el contenido actual del cuerpo de la tabla para evitar duplicidad
    tbodyTramites.innerHTML = '';

    // 2. Controlar la visibilidad de la sección de "Sin Registros / Estado Vacío"
    if (listaTramites.length === 0) {
        estadoVacio.classList.remove('hidden');
    } else {
        estadoVacio.classList.add('hidden');
    }

    // 3. Recorrer el arreglo y crear las filas HTML dinámicamente
    listaTramites.forEach((tramite, index) => {
        // Crear elemento de fila tr
        const fila = document.createElement('tr');

        // Llenar contenido de celdas
        fila.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>${tramite.nombre}</td>
            <td>${tramite.cedula}</td>
            <td><span class="cell-badge">${tramite.tipo}</span></td>
            <td>
                <button class="btn-completar" onclick="completarTramite(${tramite.id})">
                    <span>✔️</span> Completar
                </button>
            </td>
        `;

        // Añadir la fila al tbody
        tbodyTramites.appendChild(fila);
    });

    // 4. Actualizar el contador numérico en el encabezado
    contadorTramites.innerText = listaTramites.length;
}

// ------------------------------------------------------------------
// 5. ACCIONES DEL CRUD (Registrar y Completar/Eliminar)
// ------------------------------------------------------------------

// RETO 4: Registrar un nuevo trámite
function registrarTramite(event) {
    // 1. Prevenir el comportamiento por defecto del formulario (evitar recarga de página)
    event.preventDefault();

    // 2. Capturar valores y limpiar espacios innecesarios
    const nombre = inputNombre.value.trim();
    const cedula = inputCedula.value.trim();
    const tipo = selectTramite.value;

    // 3. Validaciones básicas de seguridad
    if (nombre === "" || cedula === "" || tipo === "") {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // 4. Crear un objeto literal para el trámite con un ID único (timestamp)
    const nuevoTramite = {
        id: Date.now(), // ID único basado en milisegundos
        nombre: nombre,
        cedula: cedula,
        tipo: tipo
    };

    // 5. Agregar el objeto al arreglo 'listaTramites'
    listaTramites.push(nuevoTramite);

    // 6. Guardar en LocalStorage y Renderizar
    guardarEnLocalStorage();
    renderizarTabla();

    // 7. Resetear el formulario para un nuevo ingreso
    formulario.reset();
}

// RETO 5: Eliminar/Completar un trámite
function completarTramite(id) {
    // 1. Filtrar el arreglo 'listaTramites' para remover el trámite con el id seleccionado
    listaTramites = listaTramites.filter(tramite => tramite.id !== id);

    // 2. Guardar el arreglo actualizado en LocalStorage
    guardarEnLocalStorage();

    // 3. Renderizar la tabla de nuevo
    renderizarTabla();
}

// ------------------------------------------------------------------
// 6. INICIALIZACIÓN Y EVENTOS
// ------------------------------------------------------------------

// Escuchar el submit del formulario para registrar
formulario.addEventListener('submit', registrarTramite);

// Función de arranque de la aplicación
function inicializar() {
    cargarDesdeLocalStorage();
    renderizarTabla();
}

// Arrancar al cargar el documento
document.addEventListener('DOMContentLoaded', inicializar);
