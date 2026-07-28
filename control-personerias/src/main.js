// ════════════════════════════════════════════════════════════════
// SISTEMA DE CONTROL DE PERSONERÍAS JURÍDICAS — GOBERNACIÓN DE ORURO
// Ley N° 031 (Marco de Autonomías) · Resolución Departamental
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

// ─── Estado Global ────────────────────────────────────────────────
let solicitudes = [];
let solicitudesFiltradas = [];
let solicitudSeleccionada = null;
let sortConfig = { campo: 'codigo', asc: true };

// ─── Inicialización ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    iniciarRelojVivo();
    filtrarSolicitudes();
    actualizarEstadisticas();

    // Atajo de teclado Ctrl + K → Búsqueda
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            switchTab('dashboard');
            setTimeout(() => {
                const input = document.getElementById("input-buscar");
                if (input) {
                    input.focus();
                    input.select();
                    mostrarToast("Búsqueda activada · Ctrl+K", "info");
                }
            }, 80);
        }

        if (e.key === "Escape") {
            cerrarResolucion();
        }
    });
});

// ─── Reloj Institucional en Vivo ─────────────────────────────────
function iniciarRelojVivo() {
    const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");

        const clockTime = document.getElementById("clock-time");
        const clockDate = document.getElementById("clock-date");

        if (clockTime) clockTime.textContent = `${h}:${m}:${s}`;
        if (clockDate) {
            const dia = DIAS[ahora.getDay()];
            const fecha = `${dia} ${ahora.getDate()} ${MESES[ahora.getMonth()]} ${ahora.getFullYear()}`;
            clockDate.textContent = fecha;
        }
    };

    tick();
    setInterval(tick, 1000);
}

// ─── Datos Iniciales ──────────────────────────────────────────────
function inicializarDatos() {
    const dataLocal = localStorage.getItem("oruro_personerias_v2");
    if (dataLocal) {
        solicitudes = JSON.parse(dataLocal);
    } else {
        solicitudes = [
            {
                codigo: "RD-OR-2026-0001",
                nombre: "Comunidad Originaria Salinas de Garci Mendoza",
                tipo: "Comunidad Indígena",
                provincia: "Ladislao Cabrera",
                representante: "Florencio Choque Nina",
                documentos: { acta: true, estatuto: true, reglamento: true, directorio: true },
                estado: "Aprobado",
                fecha: "12 Ene 2026 - 09:30"
            },
            {
                codigo: "RD-OR-2026-0002",
                nombre: "Junta Vecinal Oruro Moderno - Sector Este",
                tipo: "OTB",
                provincia: "Cercado",
                representante: "Valerio Apaza Mamani",
                documentos: { acta: true, estatuto: true, reglamento: false, directorio: false },
                estado: "En Trámite",
                fecha: "05 Mar 2026 - 11:15"
            },
            {
                codigo: "RD-OR-2026-0003",
                nombre: "Asociación de Artesanos Productores de Calzado Oruro",
                tipo: "Asociación Civil",
                provincia: "Cercado",
                representante: "Elena Quispe Mamani",
                documentos: { acta: true, estatuto: true, reglamento: true, directorio: false },
                estado: "En Trámite",
                fecha: "20 Jun 2026 - 14:00"
            },
            {
                codigo: "RD-OR-2026-0004",
                nombre: "Sindicato Agrario de Trabajadores Campesinos de Challapata",
                tipo: "Sindicato Agrario",
                provincia: "Eduardo Abaroa",
                representante: "Marcos Mamani Choque",
                documentos: { acta: true, estatuto: true, reglamento: true, directorio: true },
                estado: "Aprobado",
                fecha: "02 Jul 2026 - 10:45"
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_personerias_v2", JSON.stringify(solicitudes));
}

// ─── Navegación entre Pestañas ────────────────────────────────────
function switchTab(tabName) {
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));

    const pane = document.getElementById(`tab-${tabName}`);
    const navBtn = document.getElementById(`nav-${tabName}`);
    if (pane) pane.classList.add("active");
    if (navBtn) navBtn.classList.add("active");

    const titles = {
        dashboard: "Bandeja de Control de Solicitudes",
        registro:  "Registro de Nueva Personería Jurídica"
    };

    const pageTitle = document.getElementById("page-title");
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    filtrarSolicitudes();
    actualizarEstadisticas();
}

// ─── Estadísticas & KPIs ─────────────────────────────────────────
function actualizarEstadisticas() {
    const total = solicitudes.length;
    const aprobados = solicitudes.filter(s => s.estado === "Aprobado").length;
    const tramite = solicitudes.filter(s => s.estado === "En Trámite").length;

    const el = (id) => document.getElementById(id);
    if (el("stat-total"))     el("stat-total").textContent     = total;
    if (el("stat-aprobados")) el("stat-aprobados").textContent = aprobados;
    if (el("stat-tramite"))   el("stat-tramite").textContent   = tramite;
    if (el("nav-count"))      el("nav-count").textContent      = total;
}

// ─── Filtrado y Búsqueda ──────────────────────────────────────────
function filtrarSolicitudes() {
    const query  = (document.getElementById("input-buscar")?.value ?? "").toLowerCase().trim();
    const tipo   = document.getElementById("filtro-tipo")?.value ?? "";
    const estado = document.getElementById("filtro-estado")?.value ?? "";

    solicitudesFiltradas = solicitudes.filter(s => {
        const q = !query
            || s.codigo.toLowerCase().includes(query)
            || s.nombre.toLowerCase().includes(query)
            || s.representante.toLowerCase().includes(query)
            || s.provincia.toLowerCase().includes(query);

        const t = !tipo || s.tipo === tipo;
        const e = !estado || s.estado === estado;
        return q && t && e;
    });

    solicitudesFiltradas = ordenarSolicitudes(solicitudesFiltradas);
    renderTabla();

    const badge = document.getElementById("filter-result-badge");
    if (badge) badge.textContent = `${solicitudesFiltradas.length} resultado${solicitudesFiltradas.length !== 1 ? 's' : ''}`;

    const aprobadosCount = solicitudesFiltradas.filter(s => s.estado === "Aprobado").length;
    const pctAprobados = solicitudesFiltradas.length > 0 ? Math.round((aprobadosCount / solicitudesFiltradas.length) * 100) : 0;

    const footerCount = document.getElementById("table-total-count");
    const footerPct   = document.getElementById("table-total-aprobados");
    if (footerCount) footerCount.textContent = `${solicitudesFiltrados.length} de ${solicitudes.length} trámites`;
    if (footerPct)   footerPct.textContent   = `${pctAprobados}% Aprobados en esta vista`;
}

function limpiarFiltros() {
    const ids = ["input-buscar", "filtro-tipo", "filtro-estado"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    filtrarSolicitudes();
}

// ─── Ordenamiento ─────────────────────────────────────────────────
function ordenarPor(campo) {
    if (sortConfig.campo === campo) {
        sortConfig.asc = !sortConfig.asc;
    } else {
        sortConfig.campo = campo;
        sortConfig.asc = true;
    }
    filtrarSolicitudes();
}

function ordenarSolicitudes(lista) {
    return [...lista].sort((a, b) => {
        let va = a[sortConfig.campo] ?? "";
        let vb = b[sortConfig.campo] ?? "";
        if (va < vb) return sortConfig.asc ? -1 : 1;
        if (va > vb) return sortConfig.asc ? 1 : -1;
        return 0;
    });
}

// ─── Render Tabla ─────────────────────────────────────────────────
function renderTabla() {
    const tbody      = document.getElementById("tabla-solicitudes");
    const emptyState = document.getElementById("estado-vacio");

    tbody.innerHTML = "";

    if (solicitudesFiltrados.length === 0) {
        if (emptyState) emptyState.style.display = "flex";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    solicitudesFiltrados.forEach((sol, idx) => {
        const docs = sol.documentos || {};
        const totalDocsCount = (docs.acta ? 1 : 0) + (docs.estatuto ? 1 : 0) + (docs.reglamento ? 1 : 0) + (docs.directorio ? 1 : 0);

        const tr = document.createElement("tr");
        tr.style.animationDelay = `${idx * 0.03}s`;

        const reqBadge = totalDocsCount === 4
            ? `<span class="badge badge-documentos completo"><svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 4/4 Completo</span>`
            : `<span class="badge badge-documentos">${totalDocsCount}/4 Requisitos</span>`;

        const estadoBadge = sol.estado === "Aprobado"
            ? `<span class="badge badge-aprobado"><span class="badge-dot-indicator"></span> Aprobado</span>`
            : `<span class="badge badge-tramite"><span class="badge-dot-indicator"></span> En Trámite</span>`;

        const actionButton = sol.estado === "Aprobado"
            ? `<button class="btn-resolucion" onclick="verResolucion('${sol.codigo}')" title="Ver e imprimir Resolución Departamental"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Resolución</button>`
            : `<button class="btn-resolucion" style="background:rgba(16,185,129,0.08);border-color:rgba(16,185,129,0.2);color:var(--accent-emerald);" onclick="completarRequisitos('${sol.codigo}')" title="Completar requisitos y aprobar"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Aprobar</button>`;

        tr.innerHTML = `
            <td>
                <div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;color:#fff;">${sol.codigo}</div>
                <div style="font-size:0.65rem;color:var(--text-muted);">${sol.fecha}</div>
            </td>
            <td>
                <div style="font-weight:700;font-size:0.875rem;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${sol.nombre}">${sol.nombre}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);margin-top:2px;">Rep: ${sol.representante}</div>
            </td>
            <td>
                <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${sol.tipo}</span>
            </td>
            <td>
                <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${sol.provincia}</span>
            </td>
            <td>${reqBadge}</td>
            <td>${estadoBadge}</td>
            <td>
                <div style="display:flex;gap:6px;align-items:center;">
                    ${actionButton}
                    <button class="btn-delete" onclick="eliminarSolicitud('${sol.codigo}')" title="Eliminar trámite">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Verificar Documentación en Formulario ────────────────────────
function verificarDocumentacion() {
    const chkActa       = document.getElementById("chk-acta").checked;
    const chkEstatuto   = document.getElementById("chk-estatuto").checked;
    const chkReglamento = document.getElementById("chk-reglamento").checked;
    const chkDirectorio = document.getElementById("chk-directorio").checked;

    const total = (chkActa ? 1 : 0) + (chkEstatuto ? 1 : 0) + (chkReglamento ? 1 : 0) + (chkDirectorio ? 1 : 0);
    const aviso = document.getElementById("aviso-estado");

    if (aviso) {
        if (total === 4) {
            aviso.className = "info-aviso completo";
            aviso.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> <span>Documentación completa 4/4. El trámite se registrará automáticamente como <strong>Aprobado</strong>.</span>`;
        } else {
            aviso.className = "info-aviso";
            aviso.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> <span>Requisitos legibles: <strong>${total}/4 presentados</strong>. El trámite se registrará <strong>En Trámite</strong>.</span>`;
        }
    }
}

// ─── Registrar Nueva Solicitud ───────────────────────────────────
function registrarNuevaSolicitud(e) {
    e.preventDefault();

    const nombre        = document.getElementById("org-nombre").value.trim();
    const tipo          = document.getElementById("org-tipo").value;
    const provincia     = document.getElementById("org-provincia").value;
    const representante = document.getElementById("org-representante").value.trim();

    const documentos = {
        acta:       document.getElementById("chk-acta").checked,
        estatuto:   document.getElementById("chk-estatuto").checked,
        reglamento: document.getElementById("chk-reglamento").checked,
        directorio: document.getElementById("chk-directorio").checked
    };

    const completo = documentos.acta && documentos.estatuto && documentos.reglamento && documentos.directorio;
    const estado = completo ? "Aprobado" : "En Trámite";

    const numCorrelativo = String(solicitudes.length + 1).padStart(4, "0");
    const codigo = `RD-OR-2026-${numCorrelativo}`;
    const fecha = obtenerFechaHoraActual();

    const nueva = { codigo, nombre, tipo, provincia, representante, documentos, estado, fecha };

    solicitudes.unshift(nueva);
    guardarLocal();

    document.getElementById("form-solicitud").reset();
    verificarDocumentacion();

    mostrarToast(`Solicitud ${codigo} registrada correctamente.`, "success");
    switchTab('dashboard');

    if (completo) {
        setTimeout(() => verResolucion(codigo), 300);
    }
}

// ─── Aprobar y Completar Requisitos ──────────────────────────────
function completarRequisitos(codigo) {
    const index = solicitudes.findIndex(s => s.codigo === codigo);
    if (index !== -1) {
        solicitudes[index].documentos = { acta: true, estatuto: true, reglamento: true, directorio: true };
        solicitudes[index].estado = "Aprobado";
        guardarLocal();
        filtrarSolicitudes();
        actualizarEstadisticas();
        mostrarToast(`Trámite ${codigo} completado y APROBADO.`, "success");
        setTimeout(() => verResolucion(codigo), 300);
    }
}

// ─── Eliminar Solicitud ───────────────────────────────────────────
function eliminarSolicitud(codigo) {
    const sol = solicitudes.find(s => s.codigo === codigo);
    if (!sol) return;

    if (confirm(`¿Confirmar eliminación definitiva del trámite ${codigo} ("${sol.nombre}")?`)) {
        solicitudes = solicitudes.filter(s => s.codigo !== codigo);
        guardarLocal();
        filtrarSolicitudes();
        actualizarEstadisticas();
        mostrarToast(`Trámite ${codigo} eliminado del registro.`, "warning");
    }
}

// ─── Modal de Resolución Departamental ───────────────────────────
function verResolucion(codigo) {
    solicitudSeleccionada = solicitudes.find(s => s.codigo === codigo);
    if (!solicitudSeleccionada) return;

    const sol = solicitudSeleccionada;
    const el = (id) => document.getElementById(id);

    if (el("res-subtitle"))         el("res-subtitle").textContent         = `${sol.codigo} · ${sol.nombre}`;
    if (el("res-codigo"))           el("res-codigo").textContent           = `RESOLUCIÓN ADMINISTRATIVA DEPARTAMENTAL N° ${sol.codigo}`;
    if (el("res-fecha"))            el("res-fecha").textContent            = sol.fecha;
    if (el("res-representante"))    el("res-representante").textContent    = sol.representante;
    if (el("res-nombre"))           el("res-nombre").textContent           = sol.nombre;
    if (el("res-nombre-cuerpo"))    el("res-nombre-cuerpo").textContent    = sol.nombre;
    if (el("res-provincia"))        el("res-provincia").textContent        = sol.provincia;
    if (el("res-provincia-cuerpo")) el("res-provincia-cuerpo").textContent = sol.provincia;
    if (el("res-tipo"))             el("res-tipo").textContent             = sol.tipo.toUpperCase();

    document.getElementById("modal-resolucion").classList.add("open");
}

function cerrarResolucion() {
    document.getElementById("modal-resolucion").classList.remove("open");
    solicitudSeleccionada = null;
}

// ─── Exportar CSV ─────────────────────────────────────────────────
function exportarCSV() {
    if (solicitudes.length === 0) {
        mostrarToast("No hay trámites para exportar.", "warning");
        return;
    }

    const BOM = "\uFEFF";
    const headers = ["CodigoResolucion", "Organizacion", "TipoEntidad", "Provincia", "RepresentanteLegal", "Estado", "FechaRegistro", "DocumentosCompletos"];
    const rows = solicitudes.map(s => [
        s.codigo, s.nombre, s.tipo, s.provincia, s.representante, s.estado, s.fecha,
        Object.values(s.documentos || {}).filter(Boolean).length + "/4"
    ]);

    const csvContent = BOM + [headers, ...rows]
        .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `personerias_juridicas_oruro_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    mostrarToast(`Registro CSV (${solicitudes.length} trámites) exportado.`, "success");
}

function obtenerFechaHoraActual() {
    const ahora = new Date();
    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const d = ahora.getDate();
    const m = meses[ahora.getMonth()];
    const y = ahora.getFullYear();
    const h = String(ahora.getHours()).padStart(2,"0");
    const min = String(ahora.getMinutes()).padStart(2,"0");
    return `${d} ${m} ${y} - ${h}:${min}`;
}

function imprimirResolucion() {
    window.print();
}

function mostrarToast(mensaje, tipo = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const ICONS = {
        success: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
        warning: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        info:    `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        error:   `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    };

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<div class="toast-icon-wrap">${ICONS[tipo] || ICONS.info}</div><span>${mensaje}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastOut 0.35s var(--ease-spring) forwards";
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}
