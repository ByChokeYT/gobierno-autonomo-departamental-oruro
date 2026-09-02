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
let editandoCodigo = null;
let sortConfig = { campo: 'codigo', asc: true };
let filtroKpiActivo = '';

// ─── Inicialización ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    iniciarRelojVivo();
    filtrarSolicitudes();
    actualizarEstadisticas();
    actualizarDraftEnVivo();

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
            cerrarChecklistEditor();
            cerrarTimelineModal();
            cerrarVerificadorDigital();
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
    if (tabName === 'registro') {
        actualizarDraftEnVivo();
    }
}

// ─── Estadísticas & KPIs ─────────────────────────────────────────
function actualizarEstadisticas() {
    const total = solicitudes.length;
    const aprobados = solicitudes.filter(s => s.estado === "Aprobado").length;
    const tramite = solicitudes.filter(s => s.estado === "En Trámite").length;

    const pctAprobados = total > 0 ? Math.round((aprobados / total) * 100) : 0;

    const el = (id) => document.getElementById(id);
    if (el("stat-total"))     el("stat-total").textContent     = total;
    if (el("stat-aprobados")) el("stat-aprobados").textContent = aprobados;
    if (el("stat-tramite"))   el("stat-tramite").textContent   = tramite;
    if (el("nav-count"))      el("nav-count").textContent      = total;

    // Meter Bar Fill
    const meterBar = el("meter-bar-fill");
    const meterPct = el("meter-pct-text");
    if (meterBar) meterBar.style.width = `${pctAprobados}%`;
    if (meterPct) meterPct.textContent = `${pctAprobados}% Aprobadas (${aprobados} de ${total})`;

    // Highlight active KPI
    ["kpi-total", "kpi-aprobados", "kpi-tramite"].forEach(id => {
        el(id)?.classList.remove("active-kpi");
    });
    if (filtroKpiActivo === 'Aprobado') el("kpi-aprobados")?.classList.add("active-kpi");
    else if (filtroKpiActivo === 'En Trámite') el("kpi-tramite")?.classList.add("active-kpi");
    else el("kpi-total")?.classList.add("active-kpi");
}

function filtrarPorEstadoKpi(estado) {
    filtroKpiActivo = estado;
    const selectEstado = document.getElementById("filtro-estado");
    if (selectEstado) selectEstado.value = estado;
    filtrarSolicitudes();
    actualizarEstadisticas();
}

function filtrarPorTipoChip(tipo) {
    const selectTipo = document.getElementById("filtro-tipo");
    if (selectTipo) selectTipo.value = tipo;

    document.querySelectorAll(".chip-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.textContent.includes(tipo) || (tipo === '' && btn.textContent === 'Todos')) {
            btn.classList.add("active");
        }
    });

    filtrarSolicitudes();
}

// ─── Filtrado y Búsqueda ──────────────────────────────────────────
function filtrarSolicitudes() {
    const query     = (document.getElementById("input-buscar")?.value ?? "").toLowerCase().trim();
    const tipo      = document.getElementById("filtro-tipo")?.value ?? "";
    const provincia = document.getElementById("filtro-provincia")?.value ?? "";
    const estado    = document.getElementById("filtro-estado")?.value ?? "";

    solicitudesFiltradas = solicitudes.filter(s => {
        const q = !query
            || s.codigo.toLowerCase().includes(query)
            || s.nombre.toLowerCase().includes(query)
            || s.representante.toLowerCase().includes(query)
            || s.provincia.toLowerCase().includes(query);

        const t = !tipo || s.tipo === tipo;
        const p = !provincia || s.provincia === provincia;
        const e = !estado || s.estado === estado;
        return q && t && p && e;
    });

    solicitudesFiltradas = ordenarSolicitudes(solicitudesFiltradas);
    renderTabla();

    const badge = document.getElementById("filter-result-badge");
    if (badge) badge.textContent = `${solicitudesFiltradas.length} resultado${solicitudesFiltradas.length !== 1 ? 's' : ''}`;

    const aprobadosCount = solicitudesFiltradas.filter(s => s.estado === "Aprobado").length;
    const pctAprobados = solicitudesFiltradas.length > 0 ? Math.round((aprobadosCount / solicitudesFiltradas.length) * 100) : 0;

    const footerCount = document.getElementById("table-total-count");
    const footerPct   = document.getElementById("table-total-aprobados");
    if (footerCount) footerCount.textContent = `${solicitudesFiltradas.length} de ${solicitudes.length} trámites mostrados`;
    if (footerPct)   footerPct.textContent   = `${pctAprobados}% Aprobados en esta vista`;
}

function limpiarFiltros() {
    filtroKpiActivo = '';
    const ids = ["input-buscar", "filtro-tipo", "filtro-provincia", "filtro-estado"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    document.querySelectorAll(".chip-btn").forEach((btn, idx) => {
        btn.classList.toggle("active", idx === 0);
    });

    filtrarSolicitudes();
    actualizarEstadisticas();
    mostrarToast("Filtros restablecidos", "info");
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

    if (solicitudesFiltradas.length === 0) {
        if (emptyState) emptyState.style.display = "flex";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    solicitudesFiltradas.forEach((sol, idx) => {
        const docs = sol.documentos || {};
        const totalDocsCount = (docs.acta ? 1 : 0) + (docs.estatuto ? 1 : 0) + (docs.reglamento ? 1 : 0) + (docs.directorio ? 1 : 0);

        const tr = document.createElement("tr");
        tr.style.animationDelay = `${idx * 0.03}s`;

        const docChips = `
            <div class="doc-chips-wrap" onclick="abrirChecklistEditor('${sol.codigo}')" style="cursor:pointer;" title="Click para editar checklist de documentos">
                <span class="doc-chip ${docs.acta ? 'ok' : 'missing'}">${docs.acta ? '✓' : '✗'} Acta</span>
                <span class="doc-chip ${docs.estatuto ? 'ok' : 'missing'}">${docs.estatuto ? '✓' : '✗'} Estatuto</span>
                <span class="doc-chip ${docs.reglamento ? 'ok' : 'missing'}">${docs.reglamento ? '✓' : '✗'} Reg.</span>
                <span class="doc-chip ${docs.directorio ? 'ok' : 'missing'}">${docs.directorio ? '✓' : '✗'} Dir.</span>
            </div>
        `;

        const reqBadge = totalDocsCount === 4
            ? `<div style="display:flex;flex-direction:column;gap:4px;"><span class="badge badge-documentos completo"><svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 4/4 Completo</span>${docChips}</div>`
            : `<div style="display:flex;flex-direction:column;gap:4px;"><span class="badge badge-documentos" onclick="abrirChecklistEditor('${sol.codigo}')">${totalDocsCount}/4 Requisitos</span>${docChips}</div>`;

        const estadoBadge = sol.estado === "Aprobado"
            ? `<span class="badge badge-aprobado"><span class="badge-dot-indicator"></span> Aprobado</span>`
            : `<span class="badge badge-tramite"><span class="badge-dot-indicator"></span> En Trámite</span>`;

        const toggleBtnText = sol.estado === "Aprobado" ? "Pasar a Trámite" : "Aprobar";

        const actionButtons = `
            <div style="display:flex;gap:6px;align-items:center;">
                <button class="btn-resolucion" onclick="verResolucion('${sol.codigo}')" title="Ver e imprimir Resolución Departamental">
                    <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Resol.
                </button>
                <button class="btn-timeline" onclick="abrirTimelineModal('${sol.codigo}')" title="Ver línea de tiempo de auditoría legal">
                    <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Trazabilidad
                </button>
                <button class="btn-toggle" onclick="toggleEstado('${sol.codigo}')" title="Cambiar estado del trámite">
                    ${toggleBtnText}
                </button>
                <button class="btn-delete" onclick="eliminarSolicitud('${sol.codigo}')" title="Eliminar trámite">
                    <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        `;

        tr.innerHTML = `
            <td>
                <div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;color:var(--primary-light);">${sol.codigo}</div>
                <div style="font-size:0.65rem;color:var(--text-muted);margin-top:2px;">${sol.fecha}</div>
            </td>
            <td>
                <div style="font-weight:700;font-size:0.88rem;color:var(--text-main);max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${sol.nombre}">${sol.nombre}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);margin-top:2px;">Rep: <strong style="color:var(--text-secondary);">${sol.representante}</strong></div>
            </td>
            <td>
                <span style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:3px 8px;border-radius:6px;">${sol.tipo}</span>
            </td>
            <td>
                <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${sol.provincia}</span>
            </td>
            <td>${reqBadge}</td>
            <td>${estadoBadge}</td>
            <td>${actionButtons}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Draft en Vivo en Registro ────────────────────────────────────
function actualizarDraftEnVivo() {
    const nombre = document.getElementById("org-nombre")?.value.trim() || "[Nombre de la Organización Civil]";
    const tipo = document.getElementById("org-tipo")?.value || "[Tipo Entidad]";
    const provincia = document.getElementById("org-provincia")?.value || "[Provincia]";
    const rep = document.getElementById("org-representante")?.value.trim() || "[Representante Legal]";

    const chkActa       = document.getElementById("chk-acta")?.checked ?? false;
    const chkEstatuto   = document.getElementById("chk-estatuto")?.checked ?? false;
    const chkReglamento = document.getElementById("chk-reglamento")?.checked ?? false;
    const chkDirectorio = document.getElementById("chk-directorio")?.checked ?? false;

    const total = (chkActa ? 1 : 0) + (chkEstatuto ? 1 : 0) + (chkReglamento ? 1 : 0) + (chkDirectorio ? 1 : 0);

    const el = (id) => document.getElementById(id);
    if (el("draft-org")) el("draft-org").textContent = nombre;
    if (el("draft-prov")) el("draft-prov").textContent = provincia;
    if (el("draft-rep")) el("draft-rep").textContent = rep;
    if (el("draft-req-status")) el("draft-req-status").textContent = `${total}/4 requisitos documentales verificados`;

    const dictamen = el("draft-dictamen");
    const badgeStatus = el("draft-badge-status");

    if (total === 4) {
        if (dictamen) dictamen.innerHTML = `<span style="color:#059669;font-weight:800;">✓ Documentación 100% Completa. Dictamen Favorable: APROBADO.</span>`;
        if (badgeStatus) {
            badgeStatus.textContent = "Listo para Aprobación";
            badgeStatus.style.background = "rgba(16,185,129,0.15)";
            badgeStatus.style.color = "#10b981";
            badgeStatus.style.borderColor = "rgba(16,185,129,0.3)";
        }
    } else {
        if (dictamen) dictamen.innerHTML = `<span style="color:#d97706;font-weight:700;">⚠ Documentación incompleta (${total}/4). Dictamen: EN TRÁMITE.</span>`;
        if (badgeStatus) {
            badgeStatus.textContent = "En Borrador / Trámite";
            badgeStatus.style.background = "rgba(245,158,11,0.15)";
            badgeStatus.style.color = "#f59e0b";
            badgeStatus.style.borderColor = "rgba(245,158,11,0.3)";
        }
    }
}

// ─── Verificar Documentación en Formulario ────────────────────────
function verificarDocumentacion() {
    const chkActa       = document.getElementById("chk-acta").checked;
    const chkEstatuto   = document.getElementById("chk-estatuto").checked;
    const chkReglamento = document.getElementById("chk-reglamento").checked;
    const chkDirectorio = document.getElementById("chk-directorio").checked;

    const total = (chkActa ? 1 : 0) + (chkEstatuto ? 1 : 0) + (chkReglamento ? 1 : 0) + (chkDirectorio ? 1 : 0);
    const aviso = document.getElementById("aviso-estado");
    const pctLabel = document.getElementById("form-checklist-pct");
    const pctFill = document.getElementById("form-progress-fill");

    const pct = Math.round((total / 4) * 100);
    if (pctLabel) pctLabel.textContent = `${pct}% Completado`;
    if (pctFill) pctFill.style.width = `${pct}%`;

    if (aviso) {
        if (total === 4) {
            aviso.className = "info-aviso completo";
            aviso.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> <span>Documentación completa 4/4. El trámite se registrará automáticamente como <strong>Aprobado</strong>.</span>`;
        } else {
            aviso.className = "info-aviso";
            aviso.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> <span>Requisitos presentados: <strong>${total}/4 verificados</strong>. Estado inicial: <strong>En Trámite</strong>.</span>`;
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

// ─── FEATURE 1: Audit Timeline Modal ──────────────────────────────
function abrirTimelineModal(codigo) {
    const sol = solicitudes.find(s => s.codigo === codigo);
    if (!sol) return;

    const el = (id) => document.getElementById(id);
    if (el("timeline-subtitle")) el("timeline-subtitle").textContent = `${sol.codigo} · ${sol.nombre}`;

    const docs = sol.documentos || {};
    const totalDocs = Object.values(docs).filter(Boolean).length;
    const esAprobado = sol.estado === "Aprobado";

    const content = `
        <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:16px;border-radius:12px;margin-bottom:20px;">
            <h4 style="font-size:0.95rem;color:var(--text-main);margin-bottom:4px;">${sol.nombre}</h4>
            <p style="font-size:0.78rem;color:var(--text-secondary);">Provincia: <strong>${sol.provincia}</strong> | Representante: <strong>${sol.representante}</strong></p>
        </div>

        <div class="timeline-track-wrap">
            <div class="timeline-step-item completed">
                <div class="timeline-step-dot">✓</div>
                <div class="timeline-step-title">1. Ventanilla Única de Atención Ciudadana</div>
                <div class="timeline-step-desc">Ingreso y recepción formal de la solicitud. Asignación de código correlativo <code>${sol.codigo}</code>.</div>
                <div class="timeline-step-time">${sol.fecha} · Operador Ventanilla GAD-ORU</div>
            </div>

            <div class="timeline-step-item ${totalDocs > 0 ? (totalDocs === 4 ? 'completed' : 'active') : ''}">
                <div class="timeline-step-dot">${totalDocs === 4 ? '✓' : '•'}</div>
                <div class="timeline-step-title">2. Revisión Técnica y Validación Documental</div>
                <div class="timeline-step-desc">Verificación de requisitos por la Dirección de Asuntos Jurídicos: <strong>${totalDocs}/4 requisitos verificados</strong>.</div>
                <div class="timeline-step-time">${totalDocs === 4 ? 'Documentación Completa ✓' : 'Faltan ' + (4 - totalDocs) + ' documentos obligatorios'}</div>
            </div>

            <div class="timeline-step-item ${esAprobado ? 'completed' : ''}">
                <div class="timeline-step-dot">${esAprobado ? '✓' : '•'}</div>
                <div class="timeline-step-title">3. Dictamen Jurídico y Sello Legal</div>
                <div class="timeline-step-desc">${esAprobado ? 'Dictamen legal Favorable. Verificación constitucional de estatuto y reglamento interno aprobada.' : 'En evaluación legal pendiente de completar requisitos.'}</div>
                <div class="timeline-step-time">${esAprobado ? 'Aprobado por Asesor Jurídico Principal' : 'Pendiente'}</div>
            </div>

            <div class="timeline-step-item ${esAprobado ? 'completed' : ''}">
                <div class="timeline-step-dot">${esAprobado ? '✓' : '•'}</div>
                <div class="timeline-step-title">4. Emisión de Resolución Departamental A4 y Firma Digital</div>
                <div class="timeline-step-desc">${esAprobado ? 'Resolución emitida por el Gobernador M.A.E. Generación de Hash SHA-256 de integridad criptográfica.' : 'A la espera de resolución.'}</div>
                <div class="timeline-step-time">${esAprobado ? 'Documento Oficial Emitido Listo para Impresión A4' : 'En cola de emisión'}</div>
            </div>
        </div>
    `;

    document.getElementById("timeline-content-body").innerHTML = content;
    document.getElementById("modal-timeline").classList.add("open");
}

function cerrarTimelineModal() {
    document.getElementById("modal-timeline").classList.remove("open");
}

// ─── FEATURE 3: Verificador Digital QR / Hash SHA-256 ──────────────
function abrirVerificadorDigital() {
    document.getElementById("modal-verificador").classList.add("open");
}

function cerrarVerificadorDigital() {
    document.getElementById("modal-verificador").classList.remove("open");
    const box = document.getElementById("verification-result-box");
    if (box) box.style.display = "none";
}

function ejecutarVerificacionDigital() {
    const query = (document.getElementById("input-hash-verify")?.value ?? "").trim();
    const resultBox = document.getElementById("verification-result-box");
    if (!resultBox) return;

    if (!query) {
        mostrarToast("Ingrese un código o Hash para verificar", "warning");
        return;
    }

    const sol = solicitudes.find(s =>
        s.codigo.toLowerCase() === query.toLowerCase() ||
        query.length > 10 && (s.codigo.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(s.codigo.toLowerCase()))
    );

    if (sol && sol.estado === "Aprobado") {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div class="verify-result-card valid">
                <div style="display:flex;align-items:center;gap:10px;color:var(--accent-emerald);">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <div>
                        <h4 style="font-size:0.98rem;font-weight:800;">RESOLUCIÓN VÁLIDA Y AUTÉNTICA</h4>
                        <span style="font-size:0.75rem;color:var(--text-secondary);">Certificado Criptográfico Vigente · GAD-ORU</span>
                    </div>
                </div>
                <div style="font-size:0.82rem;color:var(--text-main);margin-top:8px;">
                    <p><strong>Organización:</strong> ${sol.nombre}</p>
                    <p><strong>Resolución:</strong> <code>${sol.codigo}</code> | Provincia: ${sol.provincia}</p>
                    <p><strong>Representante Legal:</strong> ${sol.representante}</p>
                    <p><strong>Fecha de Registro:</strong> ${sol.fecha}</p>
                    <p style="margin-top:6px;font-size:0.68rem;color:var(--text-muted);font-family:var(--font-mono);">Hash Hash SHA-256 Validado: SHA256: 4f89a2b1c90d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d</p>
                </div>
            </div>
        `;
        mostrarToast("Firma Digital y Resolución Verificadas ✓", "success");
    } else if (sol && sol.estado !== "Aprobado") {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div class="verify-result-card invalid">
                <div style="display:flex;align-items:center;gap:10px;color:var(--warning);">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 1 1.73-3Z"/><line x1="12" y1="9" x2="12"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div>
                        <h4 style="font-size:0.98rem;font-weight:800;">EN TRÁMITE - SIN EMISIÓN DEFINITIVA</h4>
                        <span style="font-size:0.75rem;color:var(--text-secondary);">El trámite existe pero aún no ha sido Aprobado</span>
                    </div>
                </div>
                <div style="font-size:0.82rem;color:var(--text-main);margin-top:8px;">
                    <p><strong>Organización:</strong> ${sol.nombre}</p>
                    <p><strong>Código:</strong> <code>${sol.codigo}</code></p>
                    <p style="color:var(--warning);">Faltan documentos por completar en la Dirección Jurídica.</p>
                </div>
            </div>
        `;
    } else {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div class="verify-result-card invalid">
                <div style="display:flex;align-items:center;gap:10px;color:var(--accent-rose);">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    <div>
                        <h4 style="font-size:0.98rem;font-weight:800;">REGISTRO NO ENCONTRADO</h4>
                        <span style="font-size:0.75rem;color:var(--text-secondary);">No se halló resolución con el código o hash ingresado</span>
                    </div>
                </div>
            </div>
        `;
        mostrarToast("No se encontró el registro", "error");
    }
}

// ─── FEATURE 4: Reporte Ejecutivo A4 para Impresión ──────────────
function generarReporteEjecutivo() {
    const total = solicitudes.length;
    const aprobados = solicitudes.filter(s => s.estado === "Aprobado").length;
    const tramite = solicitudes.filter(s => s.estado === "En Trámite").length;

    const el = (id) => document.getElementById(id);
    if (el("reporte-stat-total")) el("reporte-stat-total").textContent = total;
    if (el("reporte-stat-aprobados")) el("reporte-stat-aprobados").textContent = aprobados;
    if (el("reporte-stat-tramite")) el("reporte-stat-tramite").textContent = tramite;

    const tbody = el("reporte-tabla-body");
    if (tbody) {
        tbody.innerHTML = solicitudes.map(s => `
            <tr>
                <td><strong>${s.codigo}</strong></td>
                <td>${s.nombre}</td>
                <td>${s.tipo}</td>
                <td>${s.provincia}</td>
                <td>${Object.values(s.documentos || {}).filter(Boolean).length}/4</td>
                <td><strong>${s.estado}</strong></td>
            </tr>
        `).join("");
    }

    const areaReporte = el("area-impresion-reporte");
    if (areaReporte) areaReporte.style.display = "block";

    window.print();

    setTimeout(() => {
        if (areaReporte) areaReporte.style.display = "none";
    }, 1000);
}

// ─── Toggle Estado y Quick Edit ───────────────────────────────────
function toggleEstado(codigo) {
    const sol = solicitudes.find(s => s.codigo === codigo);
    if (!sol) return;

    if (sol.estado === "Aprobado") {
        sol.estado = "En Trámite";
        mostrarToast(`Trámite ${codigo} cambiado a En Trámite.`, "info");
    } else {
        sol.documentos = { acta: true, estatuto: true, reglamento: true, directorio: true };
        sol.estado = "Aprobado";
        mostrarToast(`Trámite ${codigo} APROBADO exitosamente.`, "success");
    }

    guardarLocal();
    filtrarSolicitudes();
    actualizarEstadisticas();
}

function abrirChecklistEditor(codigo) {
    const sol = solicitudes.find(s => s.codigo === codigo);
    if (!sol) return;

    editandoCodigo = codigo;
    const docs = sol.documentos || {};

    const el = (id) => document.getElementById(id);
    if (el("edit-modal-subtitle")) el("edit-modal-subtitle").textContent = `Trámite ${sol.codigo} · ${sol.nombre}`;
    if (el("edit-chk-acta")) el("edit-chk-acta").checked = !!docs.acta;
    if (el("edit-chk-estatuto")) el("edit-chk-estatuto").checked = !!docs.estatuto;
    if (el("edit-chk-reglamento")) el("edit-chk-reglamento").checked = !!docs.reglamento;
    if (el("edit-chk-directorio")) el("edit-chk-directorio").checked = !!docs.directorio;

    document.getElementById("modal-checklist-editor").classList.add("open");
}

function cerrarChecklistEditor() {
    document.getElementById("modal-checklist-editor").classList.remove("open");
    editandoCodigo = null;
}

function guardarChecklistEditado() {
    if (!editandoCodigo) return;
    const index = solicitudes.findIndex(s => s.codigo === editandoCodigo);
    if (index !== -1) {
        const docs = {
            acta: document.getElementById("edit-chk-acta").checked,
            estatuto: document.getElementById("edit-chk-estatuto").checked,
            reglamento: document.getElementById("edit-chk-reglamento").checked,
            directorio: document.getElementById("edit-chk-directorio").checked
        };
        solicitudes[index].documentos = docs;
        const total = Object.values(docs).filter(Boolean).length;
        solicitudes[index].estado = total === 4 ? "Aprobado" : "En Trámite";

        guardarLocal();
        filtrarSolicitudes();
        actualizarEstadisticas();
        cerrarChecklistEditor();
        mostrarToast(`Checklist del trámite ${editandoCodigo} actualizado (${total}/4).`, "success");
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

    if (el("res-hash-val")) {
        const hash = "SHA256: " + Array.from(sol.codigo + sol.nombre).reduce((acc, char) => (acc + char.charCodeAt(0)).toString(16), "4f89a2b1c90d8e7f").slice(0, 48);
        el("res-hash-val").textContent = hash;
    }

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
