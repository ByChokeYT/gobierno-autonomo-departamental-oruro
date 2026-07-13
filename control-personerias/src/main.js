// Lógica de Negocio - Control de Personerías Jurídicas
// Gobernación Autónoma Departamental de Oruro

let solicitudes = [];

// Cargar datos iniciales
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    renderTabla();
    actualizarEstadisticas();
});

// Inicializar base de datos local con datos semilla para demostración
function inicializarDatos() {
    const dataLocal = localStorage.getItem("oruro_personerias");
    if (dataLocal) {
        solicitudes = JSON.parse(dataLocal);
    } else {
        // Datos de prueba iniciales
        solicitudes = [
            {
                codigo: "RD-OR-2026-0001",
                nombre: "Comunidad Originaria Salinas de Garci Mendoza",
                tipo: "Comunidad Indígena",
                provincia: "Ladislao Cabrera",
                representante: "Florencio Choque Nina",
                documentos: {
                    acta: true,
                    estatuto: true,
                    reglamento: true,
                    directorio: true
                },
                estado: "Aprobado",
                fecha: "12 de Enero de 2026"
            },
            {
                codigo: "RD-OR-2026-0002",
                nombre: "Junta Vecinal Oruro Moderno - Sector Este",
                tipo: "OTB",
                provincia: "Cercado",
                representante: "Valerio Apaza Mamani",
                documentos: {
                    acta: true,
                    estatuto: true,
                    reglamento: false,
                    directorio: false
                },
                estado: "En Trámite",
                fecha: "05 de Marzo de 2026"
            },
            {
                codigo: "RD-OR-2026-0003",
                nombre: "Asociación de Artesanos Productores de Calzado Oruro",
                tipo: "Asociación Civil",
                provincia: "Cercado",
                representante: "Elena Quispe Mamani",
                documentos: {
                    acta: true,
                    estatuto: true,
                    reglamento: true,
                    directorio: false
                },
                estado: "En Trámite",
                fecha: "20 de Junio de 2026"
            }
        ];
        guardarLocal();
    }
}

// Guardar en LocalStorage
function guardarLocal() {
    localStorage.setItem("oruro_personerias", JSON.stringify(solicitudes));
}

// Cambiar de Tab
function switchTab(tabName) {
    // Desactivar todos los botones e indicadores
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    
    // Activar el tab correspondiente
    if (tabName === 'dashboard') {
        document.querySelector("button[onclick=\"switchTab('dashboard')\"]").classList.add("active");
        document.getElementById("tab-dashboard").classList.add("active");
        document.getElementById("page-title").innerText = "Bandeja de Control de Solicitudes";
    } else if (tabName === 'registro') {
        document.querySelector("button[onclick=\"switchTab('registro')\"]").classList.add("active");
        document.getElementById("tab-registro").classList.add("active");
        document.getElementById("page-title").innerText = "Registro de Nueva Personería";
    }
    renderTabla();
    actualizarEstadisticas();
}

// Actualizar contadores superiores
function actualizarEstadisticas() {
    const total = solicitudes.length;
    const aprobados = solicitudes.filter(s => s.estado === "Aprobado").length;
    const tramite = solicitudes.filter(s => s.estado === "En Trámite").length;

    document.getElementById("stat-total").innerText = total;
    document.getElementById("stat-aprobados").innerText = aprobados;
    document.getElementById("stat-tramite").innerText = tramite;
}

// Renderizar la tabla de solicitudes
function renderTabla() {
    const tbody = document.getElementById("tabla-solicitudes");
    const emptyState = document.getElementById("estado-vacio");
    tbody.innerHTML = "";

    if (solicitudes.length === 0) {
        emptyState.style.display = "flex";
        return;
    } else {
        emptyState.style.display = "none";
    }

    solicitudes.forEach(sol => {
        // Calcular cuántos documentos de 4 se tienen
        const docs = sol.documentos;
        const totalDocsCount = (docs.acta ? 1 : 0) + (docs.estatuto ? 1 : 0) + (docs.reglamento ? 1 : 0) + (docs.directorio ? 1 : 0);
        
        const tr = document.createElement("tr");
        
        // Determinar badge de documentos
        const reqBadge = totalDocsCount === 4 
            ? `<span class="badge badge-documentos completo">4/4 Completo</span>`
            : `<span class="badge badge-documentos">${totalDocsCount}/4 Requisitos</span>`;

        // Determinar badge de estado
        const estadoBadge = sol.estado === "Aprobado"
            ? `<span class="badge badge-aprobado">Aprobado</span>`
            : `<span class="badge badge-tramite">En Trámite</span>`;

        // Determinar botón de acción secundario
        const actionButton = sol.estado === "Aprobado"
            ? `<button class="btn-resolucion" onclick="verResolucion('${sol.codigo}')">📄 Ver Resolución</button>`
            : `<button class="btn-resolucion" style="background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.2); color: #10b981;" onclick="completarRequisitos('${sol.codigo}')">✔️ Aprobar</button>`;

        tr.innerHTML = `
            <td><strong>${sol.codigo}</strong></td>
            <td>${sol.nombre}</td>
            <td>${sol.tipo}</td>
            <td>${sol.provincia}</td>
            <td>${reqBadge}</td>
            <td>${estadoBadge}</td>
            <td>
                ${actionButton}
                <button class="btn-delete" onclick="eliminarSolicitud('${sol.codigo}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Verificar la documentación dinámica en el formulario
function verificarDocumentacion() {
    const chkActa = document.getElementById("chk-acta").checked;
    const chkEstatuto = document.getElementById("chk-estatuto").checked;
    const chkReglamento = document.getElementById("chk-reglamento").checked;
    const chkDirectorio = document.getElementById("chk-directorio").checked;

    const total = (chkActa ? 1 : 0) + (chkEstatuto ? 1 : 0) + (chkReglamento ? 1 : 0) + (chkDirectorio ? 1 : 0);
    const aviso = document.getElementById("aviso-estado");

    if (total === 4) {
        aviso.className = "info-aviso completo";
        aviso.innerHTML = "🎉 ¡Documentación completa! El trámite se registrará como <strong>Aprobado</strong> de forma automática.";
    } else {
        aviso.className = "info-aviso";
        aviso.innerHTML = `⚠️ Requisitos: <strong>${total}/4 presentados</strong>. El trámite se registrará <strong>En Trámite</strong>.`;
    }
}

// Registrar nueva solicitud desde el formulario
function registrarNuevaSolicitud(e) {
    e.preventDefault();

    const nombre = document.getElementById("org-nombre").value.trim();
    const tipo = document.getElementById("org-tipo").value;
    const provincia = document.getElementById("org-provincia").value;
    const representante = document.getElementById("org-representante").value.trim();
    
    const documentos = {
        acta: document.getElementById("chk-acta").checked,
        estatuto: document.getElementById("chk-estatuto").checked,
        reglamento: document.getElementById("chk-reglamento").checked,
        directorio: document.getElementById("chk-directorio").checked
    };

    const completo = documentos.acta && documentos.estatuto && documentos.reglamento && documentos.directorio;
    const estado = completo ? "Aprobado" : "En Trámite";

    // Generar correlativo
    const numCorrelativo = String(solicitudes.length + 1).padStart(4, "0");
    const codigo = `RD-OR-2026-${numCorrelativo}`;

    // Fecha formateada local
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fecha = new Date().toLocaleDateString("es-ES", opciones);

    // Agregar objeto
    const nueva = {
        codigo,
        nombre,
        tipo,
        provincia,
        representante,
        documentos,
        estado,
        fecha
    };

    solicitudes.push(nueva);
    guardarLocal();
    
    // Resetear formulario
    document.getElementById("form-solicitud").reset();
    verificarDocumentacion();

    // Redirigir y avisar
    switchTab('dashboard');
}

// Completar requisitos y aprobar desde la bandeja
function completarRequisitos(codigo) {
    const index = solicitudes.findIndex(s => s.codigo === codigo);
    if (index !== -1) {
        solicitudes[index].documentos = {
            acta: true,
            estatuto: true,
            reglamento: true,
            directorio: true
        };
        solicitudes[index].estado = "Aprobado";
        guardarLocal();
        renderTabla();
        actualizarEstadisticas();
    }
}

// Eliminar solicitud
function eliminarSolicitud(codigo) {
    if (confirm(`¿Está seguro de eliminar de forma permanente el trámite ${codigo}?`)) {
        solicitudes = solicitudes.filter(s => s.codigo !== codigo);
        guardarLocal();
        renderTabla();
        actualizarEstadisticas();
    }
}

// Ver y generar resolución
function verResolucion(codigo) {
    const sol = solicitudes.find(s => s.codigo === codigo);
    if (!sol) return;

    // Llenar datos de la resolución
    document.getElementById("res-codigo").innerText = `RESOL. ADM. DEPT. N° ${sol.codigo}`;
    document.getElementById("res-fecha").innerText = sol.fecha;
    document.getElementById("res-representante").innerText = sol.representante;
    document.getElementById("res-nombre").innerText = sol.nombre;
    document.getElementById("res-nombre-cuerpo").innerText = sol.nombre;
    document.getElementById("res-provincia").innerText = sol.provincia;
    document.getElementById("res-provincia-cuerpo").innerText = sol.provincia;
    document.getElementById("res-tipo").innerText = sol.tipo.toUpperCase();

    // Abrir Modal
    document.getElementById("modal-resolucion").classList.add("open");
}

// Cerrar resolución
function cerrarResolucion() {
    document.getElementById("modal-resolucion").classList.remove("open");
}

// Imprimir
function imprimirResolucion() {
    window.print();
}
