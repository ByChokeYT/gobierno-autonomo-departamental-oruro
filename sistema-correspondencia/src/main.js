// ------------------------------------------------------------------
// GOBERNACIÓN AUTÓNOMA DEPARTAMENTAL DE ORURO
// FASE 4: Sistema de Hojas de Ruta y Correspondencia (SISCO v2.5)
// ------------------------------------------------------------------

// 1. Estado de la Aplicación (Carga inicial desde LocalStorage)
let hojasDeRuta = JSON.parse(localStorage.getItem('hojasDeRuta')) || [];

// 2. Referencias del DOM (Navegación del Workspace)
const navItems = document.querySelectorAll('.nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');
const pageCurrentTitle = document.getElementById('page-current-title');

// Referencias del DOM (Ventanilla Única)
const formCorrespondencia = document.getElementById('form-correspondencia');
const inputRemitente = document.getElementById('input-remitente');
const inputCI = document.getElementById('input-ci');
const inputAsunto = document.getElementById('input-asunto');
const selectDestinoInicial = document.getElementById('select-destino-inicial');
const contadorTramites = document.getElementById('contador-tramites');

// Referencias del DOM (Bandeja Interna)
const tbodyHojasRuta = document.getElementById('tbody-hojas-ruta');
const tablaVacia = document.getElementById('tabla-vacía');
const tablaHojasRuta = document.getElementById('tabla-hojas-ruta');

// Referencias del DOM (Buscador y Rastreador)
const inputBuscarCodigo = document.getElementById('input-buscar-codigo');
const btnBuscar = document.getElementById('btn-buscar');
const seguimientoVacio = document.getElementById('seguimiento-vacio');
const infoTramiteBuscado = document.getElementById('info-tramite-buscado');
const timelineDerivaciones = document.getElementById('timeline-derivaciones');

// Referencias de campos de visualización en la Consulta
const infoCodigo = document.getElementById('info-codigo');
const infoEstado = document.getElementById('info-estado');
const infoRemitente = document.getElementById('info-remitente');
const infoAsunto = document.getElementById('info-asunto');

// Referencias al DOM (Drawer Deslizable)
const drawerDerivacion = document.getElementById('drawer-derivacion');
const formDerivar = document.getElementById('form-derivar');
const modalTramiteId = document.getElementById('modal-tramite-id');
const modalCodigoTramite = document.getElementById('modal-codigo-tramite');
const modalUbicacionTramite = document.getElementById('modal-ubicacion-tramite');
const selectOficinaDestino = document.getElementById('select-oficina-destino');
const selectNuevoEstado = document.getElementById('select-nuevo-estado');
const textareaProveido = document.getElementById('textarea-proveido');
const checkboxFirmaDigital = document.getElementById('checkbox-firma-digital');
const btnCerrarDrawer = document.getElementById('btn-cerrar-drawer');
const btnCancelarDrawer = document.getElementById('btn-cancelar-drawer');

// Referencias adicionales para impresión
const btnImprimirFicha = document.getElementById('btn-imprimir-ficha');

// ------------------------------------------------------------------
// GESTIÓN DE PESTAÑAS (TAB SYSTEM)
// ------------------------------------------------------------------
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Quitar estado activo previo
        navItems.forEach(i => i.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Activar elemento actual
        item.classList.add('active');
        const activeTabId = item.getAttribute('data-tab');
        document.getElementById(activeTabId).classList.add('active');

        // Actualizar título de cabecera
        switch (activeTabId) {
            case 'tab-registro':
                pageCurrentTitle.textContent = "Ventanilla Única de Registro";
                break;
            case 'tab-bandeja':
                pageCurrentTitle.textContent = "Bandeja Interna de Trámites";
                renderizarTabla(); // Recargar tabla al entrar a la bandeja
                break;
            case 'tab-consulta':
                pageCurrentTitle.textContent = "Rastreador de Hojas de Ruta";
                break;
        }
    });
});

// ------------------------------------------------------------------
// FUNCIONES AUXILIARES Y RENDERIZADO
// ------------------------------------------------------------------

// Guardar datos en LocalStorage y actualizar la UI
function guardarEstadoYSincronizar() {
    localStorage.setItem('hojasDeRuta', JSON.stringify(hojasDeRuta));
    actualizarContador();
    renderizarTabla();
}

// Actualizar el indicador de trámites activos
function actualizarContador() {
    contadorTramites.textContent = hojasDeRuta.length;
}

// Obtener la clase CSS del badge correspondiente al estado
function obtenerClaseBadge(estado) {
    switch (estado) {
        case 'Pendiente':
            return 'badge-pendiente';
        case 'En Revisión':
            return 'badge-revision';
        case 'Aprobado':
            return 'badge-aprobado';
        case 'Archivado / Completado':
        case 'Archivado':
            return 'badge-archivado';
        default:
            return 'badge-pendiente';
    }
}

// Renderizar la lista general de correspondencia en la bandeja de control
function renderizarTabla() {
    tbodyHojasRuta.innerHTML = '';

    if (hojasDeRuta.length === 0) {
        tablaVacia.classList.remove('hidden');
        tablaHojasRuta.classList.add('hidden');
        return;
    }

    tablaVacia.classList.add('hidden');
    tablaHojasRuta.classList.remove('hidden');

    hojasDeRuta.forEach(tramite => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td><strong>${tramite.codigo}</strong></td>
            <td>
                <div style="font-weight: 600;">${tramite.remitente}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${tramite.ci}</div>
            </td>
            <td>${tramite.asunto}</td>
            <td>${tramite.oficinaActual}</td>
            <td><span class="badge ${obtenerClaseBadge(tramite.estadoActual)}">${tramite.estadoActual}</span></td>
            <td>
                <button class="btn-derivar" onclick="abrirDrawerDerivacion(${tramite.id})">
                    <span>➡️</span> Derivar
                </button>
            </td>
        `;

        tbodyHojasRuta.appendChild(fila);
    });
}

// Generar código único de hoja de ruta (HR-OR-Año-Correlativo)
function generarCodigoHojaRuta() {
    const añoActual = new Date().getFullYear();
    const correlativo = String(hojasDeRuta.length + 1).padStart(4, '0');
    return `HR-OR-${añoActual}-${correlativo}`;
}

// ------------------------------------------------------------------
// ACCIONES Y EVENTOS
// ------------------------------------------------------------------

// Registrar una nueva correspondencia (Ventanilla Única)
function registrarCorrespondencia(event) {
    event.preventDefault();

    const remitente = inputRemitente.value.trim();
    const ci = inputCI.value.trim();
    const asunto = inputAsunto.value.trim();
    const destinoInicial = selectDestinoInicial.value;

    if (!remitente || !ci || !asunto || !destinoInicial) {
        alert("Por favor complete todos los campos obligatorios.");
        return;
    }

    const nuevoCodigo = generarCodigoHojaRuta();
    const fechaHoraIngreso = new Date().toLocaleString('es-BO');

    // Estructura de datos para modelar la correspondencia
    const nuevoTramite = {
        id: Date.now(),
        codigo: nuevoCodigo,
        remitente: remitente,
        ci: ci,
        asunto: asunto,
        oficinaActual: destinoInicial,
        estadoActual: 'Pendiente',
        fechaRegistro: fechaHoraIngreso,
        historial: [
            {
                fecha: fechaHoraIngreso,
                oficinaDestino: destinoInicial,
                estado: 'Pendiente',
                comentario: 'Recepción del trámite en Ventanilla Única e inicio del flujo de la Hoja de Ruta.',
                firmaDigital: null
            }
        ]
    };

    hojasDeRuta.push(nuevoTramite);
    guardarEstadoYSincronizar();

    // Resetear formulario y dar feedback visual
    formCorrespondencia.reset();
    alert(`Trámite iniciado con éxito. Código de seguimiento: ${nuevoCodigo}`);

    // Redirigir automáticamente a la pestaña de bandeja
    document.querySelector('.nav-item[data-tab="tab-bandeja"]').click();
}

// Abrir drawer de derivación
window.abrirDrawerDerivacion = function(id) {
    const tramite = hojasDeRuta.find(t => t.id === id);
    if (!tramite) return;

    modalTramiteId.value = tramite.id;
    modalCodigoTramite.textContent = tramite.codigo;
    modalUbicacionTramite.textContent = tramite.oficinaActual;

    // Resetear campos
    selectOficinaDestino.value = '';
    selectNuevoEstado.value = 'En Revisión';
    textareaProveido.value = '';
    checkboxFirmaDigital.checked = false;

    drawerDerivacion.classList.remove('hidden');
    // Forzar reflow de animación
    setTimeout(() => {
        drawerDerivacion.classList.add('open');
    }, 10);
};

// Cerrar drawer de derivación
function cerrarDrawer() {
    drawerDerivacion.classList.remove('open');
    setTimeout(() => {
        drawerDerivacion.classList.add('hidden');
    }, 300); // Esperar que termine la animación
}

// Guardar la derivación en el historial del trámite
function procesarDerivacion(event) {
    event.preventDefault();

    const id = parseInt(modalTramiteId.value);
    const oficinaDestino = selectOficinaDestino.value;
    const nuevoEstado = selectNuevoEstado.value;
    const proveido = textareaProveido.value.trim();
    const firmarDigital = checkboxFirmaDigital.checked;

    if (!oficinaDestino || !nuevoEstado || !proveido) {
        alert("Por favor complete todos los datos de derivación.");
        return;
    }

    const tramite = hojasDeRuta.find(t => t.id === id);
    if (!tramite) return;

    const fechaHoraDerivacion = new Date().toLocaleString('es-BO');

    // Simular Hash de firma digital de ADSIB Bolivia
    let hashFirma = null;
    if (firmarDigital) {
        hashFirma = 'adsib-hash-' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    }

    // Añadir paso al historial
    tramite.historial.push({
        fecha: fechaHoraDerivacion,
        oficinaDestino: oficinaDestino,
        estado: nuevoEstado,
        comentario: proveido,
        firmaDigital: hashFirma
    });

    tramite.oficinaActual = oficinaDestino;
    tramite.estadoActual = nuevoEstado;

    guardarEstadoYSincronizar();
    cerrarDrawer();

    // Si el trámite derivado estaba siendo consultado, refrescar la vista de consulta
    if (!infoTramiteBuscado.classList.contains('hidden') && infoCodigo.textContent === tramite.codigo) {
        buscarTramitePorCodigo(tramite.codigo);
    }
}

// Buscar trámite y renderizar la línea de tiempo (Timeline)
function consultarTramite() {
    const codigoABuscar = inputBuscarCodigo.value.trim().toUpperCase();
    if (!codigoABuscar) {
        alert("Ingrese un código de Hoja de Ruta para realizar la búsqueda.");
        return;
    }
    buscarTramitePorCodigo(codigoABuscar);
}

function buscarTramitePorCodigo(codigo) {
    const tramite = hojasDeRuta.find(t => t.codigo.toUpperCase() === codigo.toUpperCase());

    if (!tramite) {
        alert(`No se encontró ninguna Hoja de Ruta con el código: ${codigo}`);
        seguimientoVacio.classList.remove('hidden');
        infoTramiteBuscado.classList.add('hidden');
        timelineDerivaciones.classList.add('hidden');
        return;
    }

    // Mostrar contenedores
    seguimientoVacio.classList.add('hidden');
    infoTramiteBuscado.classList.remove('hidden');
    timelineDerivaciones.classList.remove('hidden');

    // Rellenar metadatos
    infoCodigo.textContent = tramite.codigo;
    infoEstado.textContent = tramite.estadoActual;
    infoEstado.className = `badge ${obtenerClaseBadge(tramite.estadoActual)}`;
    infoRemitente.textContent = tramite.remitente;
    infoAsunto.textContent = tramite.asunto;

    // Renderizar la línea de tiempo
    timelineDerivaciones.innerHTML = '';

    tramite.historial.forEach((movimiento, index) => {
        const item = document.createElement('div');
        item.classList.add('timeline-item');
        
        if (index === tramite.historial.length - 1) {
            item.classList.add('active');
        } else {
            item.classList.add('completed');
        }

        let firmaHtml = '';
        if (movimiento.firmaDigital) {
            firmaHtml = `
                <div class="timeline-signature-block" style="margin-top: 10px; font-size: 0.75rem; background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.3); padding: 6px 12px; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px; color: #34d399; width: fit-content;">
                    <span>🔒 Firmado Digitalmente (ADSIB Bolivia)</span>
                    <code style="font-family: monospace; color: #a3e635; font-size: 0.7rem; background: rgba(0,0,0,0.3); padding: 1px 6px; border-radius: 2px;">${movimiento.firmaDigital}</code>
                </div>
            `;
        }

        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-card">
                <div class="timeline-header">
                    <span class="timeline-office">📍 ${movimiento.oficinaDestino}</span>
                    <span class="timeline-date">${movimiento.fecha}</span>
                </div>
                <div class="timeline-status">Estado: ${movimiento.estado}</div>
                <div class="timeline-comment">"${movimiento.comentario}"</div>
                ${firmaHtml}
            </div>
        `;

        timelineDerivaciones.appendChild(item);
    });
}

// Imprimir Ficha de Hoja de Ruta
if (btnImprimirFicha) {
    btnImprimirFicha.addEventListener('click', () => {
        window.print();
    });
}

// ------------------------------------------------------------------
// CONFIGURACIÓN DE LISTENERS
// ------------------------------------------------------------------
formCorrespondencia.addEventListener('submit', registrarCorrespondencia);
formDerivar.addEventListener('submit', procesarDerivacion);
btnBuscar.addEventListener('click', consultarTramite);

// Cerrar drawer
btnCerrarDrawer.addEventListener('click', cerrarDrawer);
btnCancelarDrawer.addEventListener('click', cerrarDrawer);

// Cerrar drawer al hacer click en el overlay
drawerDerivacion.addEventListener('click', (e) => {
    if (e.target === drawerDerivacion) {
        cerrarDrawer();
    }
});

// Permitir presionar "Enter" para buscar
inputBuscarCodigo.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        consultarTramite();
    }
});

// Inicialización automática
guardarEstadoYSincronizar();
actualizarContador();
