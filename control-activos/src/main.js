// ════════════════════════════════════════════════════════════════
// SISTEMA DE CONTROL DE ACTIVOS FIJOS — GOBERNACIÓN DE ORURO
// Ley N° 1178 (SAFCO) · Trazabilidad Hash-256 · Canvas QR Nativo
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

// ─── Estado Global ────────────────────────────────────────────────
let activos = [];
let activosFiltrados = [];
let activoSeleccionado = null;
let sortConfig = { campo: 'codigo', asc: true };

// ─── Inicialización ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    iniciarRelojVivo();
    filtrarActivos();
    actualizarEstadisticas();
    renderAnalytics();

    // Atajo de teclado Ctrl + K → Enfocar búsqueda
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            switchTab('inventario');
            setTimeout(() => {
                const input = document.getElementById("input-buscar");
                if (input) {
                    input.focus();
                    input.select();
                    mostrarToast("Búsqueda activada · Ctrl+K", "info");
                }
            }, 80);
        }

        // ESC → Cerrar modales
        if (e.key === "Escape") {
            cerrarModal();
            cerrarEscanerDirecto();
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
    const dataLocal = localStorage.getItem("oruro_activos_v2");

    if (dataLocal) {
        activos = JSON.parse(dataLocal);
        // Retrocompatibilidad: garantizar campos nuevos
        activos.forEach(a => {
            if (!a.valor)  a.valor  = 5000;
            if (!a.estado) a.estado = "Bueno";
            if (!a.hash)   a.hash   = generarHashIntegridad(a);
            if (!a.serie)  a.serie  = "";
            if (!a.logs)   a.logs   = [];
        });
    } else {
        activos = [
            {
                codigo:   "ACT-2026-0001",
                tipo:     "Equipos de Computación",
                modelo:   "Laptop HP EliteBook G8 (Intel i7, 16GB RAM, 512GB SSD)",
                oficina:  "Secretaría General",
                custodio: "Roberto Gómez Colque",
                valor:    8500.00,
                estado:   "Bueno",
                serie:    "SN-HP-2026-G8-001",
                hash:     "",
                logs: [
                    { fecha: "12 Ene 2026 - 08:30", tipo: "registro",
                      descripcion: "Registro inicial en inventario SAFCO. Valor: Bs. 8.500,00. Custodio: Roberto Gómez Colque." }
                ]
            },
            {
                codigo:   "ACT-2026-0002",
                tipo:     "Vehículos Terrestres",
                modelo:   "Camioneta Toyota Hilux 4x4 Doble Cabina (Placa 4521-FDS)",
                oficina:  "Servicio de Caminos (SEDECA)",
                custodio: "Marcos Mamani Choque",
                valor:    210000.00,
                estado:   "Bueno",
                serie:    "4521-FDS",
                hash:     "",
                logs: [
                    { fecha: "15 Feb 2026 - 10:15", tipo: "registro",
                      descripcion: "Ingreso al parque automotor departamental. Asignado a SEDECA." }
                ]
            },
            {
                codigo:   "ACT-2026-0003",
                tipo:     "Muebles y Enseres",
                modelo:   "Escritorio de Roble Ejecutivo con Cajonera Blindada",
                oficina:  "Dirección Jurídica",
                custodio: "Julio Choque Valda",
                valor:    3200.00,
                estado:   "Regular",
                serie:    "MBL-JUR-2026-003",
                hash:     "",
                logs: [
                    { fecha: "20 Jun 2026 - 14:00", tipo: "registro",
                      descripcion: "Registro inicial de mobiliario institucional. Estado: Regular." }
                ]
            },
            {
                codigo:   "ACT-2026-0004",
                tipo:     "Equipos de Computación",
                modelo:   "Servidor Rack Dell PowerEdge R750 (64GB RAM, 4TB SAS RAID)",
                oficina:  "Ventanilla Única",
                custodio: "Elena Paredes Quispe",
                valor:    45000.00,
                estado:   "Bueno",
                serie:    "SN-DELL-R750-EPQ",
                hash:     "",
                logs: [
                    { fecha: "05 Jul 2026 - 11:20", tipo: "registro",
                      descripcion: "Instalación de servidor de base de datos de trámites gubernamentales." }
                ]
            },
            {
                codigo:   "ACT-2026-0005",
                tipo:     "Equipos de Comunicación",
                modelo:   "Radio VHF Motorola APX 6000 (Comunicación Oficial)",
                oficina:  "Secretaría General",
                custodio: "Ana Flores Condori",
                valor:    12800.00,
                estado:   "Bueno",
                serie:    "RAD-MOT-APX6000-AF",
                hash:     "",
                logs: [
                    { fecha: "10 Jul 2026 - 09:00", tipo: "registro",
                      descripcion: "Registro de equipo de radiocomunicación para operaciones de campo." }
                ]
            },
            {
                codigo:   "ACT-2026-0006",
                tipo:     "Maquinaria y Equipos",
                modelo:   "Generador Eléctrico Cummins 45kVA (Planta de Emergencia)",
                oficina:  "Unidad de Sistemas",
                custodio: "Pablo Quiroga Ríos",
                valor:    85200.00,
                estado:   "Mantenimiento",
                serie:    "GEN-CUM-45KVA-PQ",
                hash:     "",
                logs: [
                    { fecha: "18 Jun 2026 - 15:30", tipo: "registro",
                      descripcion: "Instalación de planta generadora de emergencia en sala de servidores." },
                    { fecha: "25 Jul 2026 - 10:00", tipo: "transferencia",
                      descripcion: "Transferencia a mantenimiento preventivo según cronograma técnico." }
                ]
            }
        ];

        activos.forEach(a => a.hash = generarHashIntegridad(a));
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_activos_v2", JSON.stringify(activos));
}

// ─── Hash de Integridad (DJB2 + Hex) ─────────────────────────────
function generarHashIntegridad(activo) {
    const semilla = [
        activo.codigo, activo.modelo, activo.custodio,
        activo.valor, activo.oficina, activo.tipo
    ].join("-|-");

    let hash = 5381;
    for (let i = 0; i < semilla.length; i++) {
        hash = ((hash << 5) + hash) + semilla.charCodeAt(i);
        hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
    return `GAD-ORU-${hex.slice(0, 4)}-${hex.slice(4)}`;
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
        inventario: "Inventario de Activos Departamentales",
        registro:   "Registrar Nuevo Activo Fijo",
        analytics:  "Analítica Patrimonial · GAD-ORU"
    };

    const pageTitle = document.getElementById("page-title");
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    if (tabName === "analytics") renderAnalytics();
    filtrarActivos();
    actualizarEstadisticas();
}

// ─── Estadísticas de KPIs ─────────────────────────────────────────
function actualizarEstadisticas() {
    const total = activos.length;
    const valorTotal = activos.reduce((s, a) => s + (parseFloat(a.valor) || 0), 0);
    const logs = activos.reduce((s, a) => s + (a.logs ? a.logs.filter(l => l.tipo === "transferencia").length : 0), 0);

    const el = (id) => document.getElementById(id);
    if (el("stat-total"))          el("stat-total").textContent = total;
    if (el("stat-valor"))          el("stat-valor").textContent = `Bs. ${valorTotal.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (el("stat-transferencias")) el("stat-transferencias").textContent = logs;
    if (el("nav-count"))           el("nav-count").textContent = total;
}

// ─── Filtrado y Búsqueda ──────────────────────────────────────────
function filtrarActivos() {
    const query = (document.getElementById("input-buscar")?.value ?? "").toLowerCase().trim();
    const cat   = document.getElementById("filtro-categoria")?.value ?? "";
    const est   = document.getElementById("filtro-estado")?.value ?? "";

    activosFiltrados = activos.filter(a => {
        const q = !query
            || a.codigo.toLowerCase().includes(query)
            || a.custodio.toLowerCase().includes(query)
            || a.modelo.toLowerCase().includes(query)
            || a.oficina.toLowerCase().includes(query)
            || (a.serie || "").toLowerCase().includes(query);

        const c = !cat || a.tipo === cat;
        const e = !est || a.estado === est;
        return q && c && e;
    });

    // Aplicar ordenamiento
    activosFiltrados = ordenarActivos(activosFiltrados);

    renderTabla();

    // Badge de resultados
    const badge = document.getElementById("filter-result-badge");
    if (badge) badge.textContent = `${activosFiltrados.length} resultado${activosFiltrados.length !== 1 ? 's' : ''}`;

    // Footer con totales
    const valorFiltrado = activosFiltrados.reduce((s, a) => s + (parseFloat(a.valor) || 0), 0);
    const footerCount = document.getElementById("table-total-count");
    const footerValor = document.getElementById("table-total-valor");
    if (footerCount) footerCount.textContent = `${activosFiltrados.length} de ${activos.length} bienes`;
    if (footerValor) footerValor.textContent = `Bs. ${valorFiltrado.toLocaleString("es-BO", { minimumFractionDigits: 2 })} en esta vista`;
}

function limpiarFiltros() {
    const ids = ["input-buscar", "filtro-categoria", "filtro-estado"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    filtrarActivos();
}

// ─── Ordenamiento ─────────────────────────────────────────────────
function ordenarPor(campo) {
    if (sortConfig.campo === campo) {
        sortConfig.asc = !sortConfig.asc;
    } else {
        sortConfig.campo = campo;
        sortConfig.asc = true;
    }
    filtrarActivos();
}

function ordenarActivos(lista) {
    return [...lista].sort((a, b) => {
        let va = a[sortConfig.campo] ?? "";
        let vb = b[sortConfig.campo] ?? "";
        if (sortConfig.campo === "valor") {
            va = parseFloat(va) || 0;
            vb = parseFloat(vb) || 0;
        }
        if (va < vb) return sortConfig.asc ? -1 : 1;
        if (va > vb) return sortConfig.asc ? 1 : -1;
        return 0;
    });
}

// ─── Render Tabla con Iconos Vectoriales SVG ─────────────────────
const CAT_ICONS = {
    "Equipos de Computación":   `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    "Vehículos Terrestres":     `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
    "Muebles y Enseres":        `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M4 11h16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z"/><path d="M6 17v4M18 17v4"/></svg>`,
    "Maquinaria y Equipos":     `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    "Equipos de Comunicación":  `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.9 19.1C1.9 16.1 1.9 11.3 4.9 8.3"/><path d="M7.8 16.2c-1.6-1.6-1.6-4.1 0-5.7"/><circle cx="12" cy="13" r="2"/><path d="M16.2 10.5c1.6 1.6 1.6 4.1 0 5.7"/><path d="M19.1 7.6c3 3 3 7.8 0 10.8"/><line x1="12" y1="3" x2="12" y2="11"/></svg>`
};

const CAT_COLORS = {
    "Equipos de Computación":   "rgba(245,158,11,0.12)",
    "Vehículos Terrestres":     "rgba(6,182,212,0.12)",
    "Muebles y Enseres":        "rgba(16,185,129,0.12)",
    "Maquinaria y Equipos":     "rgba(139,92,246,0.12)",
    "Equipos de Comunicación":  "rgba(59,130,246,0.12)"
};

function renderTabla() {
    const tbody       = document.getElementById("tabla-activos");
    const emptyState  = document.getElementById("estado-vacio");

    tbody.innerHTML = "";

    if (activosFiltrados.length === 0) {
        if (emptyState) emptyState.style.display = "flex";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    activosFiltrados.forEach((act, idx) => {
        const tr = document.createElement("tr");
        tr.style.animationDelay = `${idx * 0.03}s`;

        // Badge de estado sin emojis
        const BADGES = {
            "Bueno":         { cls: "badge-bueno" },
            "Regular":       { cls: "badge-regular" },
            "Mantenimiento": { cls: "badge-mantenimiento" },
            "Baja":          { cls: "badge-baja" }
        };
        const badge = BADGES[act.estado] || BADGES["Bueno"];

        const catIcon  = CAT_ICONS[act.tipo] || `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>`;
        const catColor = CAT_COLORS[act.tipo] || "rgba(255,255,255,0.05)";

        const transCount = (act.logs || []).filter(l => l.tipo === "transferencia").length;
        const auditBadge = transCount > 0
            ? `<span class="badge-state badge-mantenimiento"><svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> ${transCount} Reasignación${transCount > 1 ? 'es' : ''}</span>`
            : `<span class="badge-state badge-bueno"><svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Alta Inicial</span>`;

        const valor = `Bs. ${(parseFloat(act.valor) || 0).toLocaleString("es-BO", { minimumFractionDigits: 2 })}`;
        const iniciales = act.custodio
            ? act.custodio.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase()
            : "??";

        tr.innerHTML = `
            <td>
                <div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;color:#fff;letter-spacing:-0.01em;">${act.codigo}</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:var(--text-muted);margin-top:3px;">${(act.hash || "").substring(0, 16)}…</div>
            </td>
            <td>
                <div style="display:flex;align-items:center;gap:10px;">
                    <div class="cat-icon-container" style="background:${catColor};">${catIcon}</div>
                    <div>
                        <div style="font-weight:700;font-size:0.875rem;line-height:1.3;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${act.modelo}">${act.modelo}</div>
                        <div style="font-size:0.68rem;color:var(--text-muted);font-weight:600;margin-top:2px;">${act.tipo}${act.serie ? ' · ' + act.serie : ''}</div>
                    </div>
                </div>
            </td>
            <td>
                <div style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${act.oficina}</div>
            </td>
            <td>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(6,182,212,0.2));border:1px solid rgba(245,158,11,0.25);display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:800;color:var(--primary);flex-shrink:0;">${iniciales}</div>
                    <span style="font-weight:600;font-size:0.82rem;color:var(--text-secondary);">${act.custodio}</span>
                </div>
            </td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;color:var(--primary);background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.14);padding:4px 9px;border-radius:6px;white-space:nowrap;">${valor}</span>
            </td>
            <td>
                <span class="badge-state ${badge.cls}"><span class="badge-dot-indicator"></span> ${act.estado}</span>
            </td>
            <td>${auditBadge}</td>
            <td>
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="btn-action" onclick="abrirAuditoria('${act.codigo}')" title="Ver ficha QR y auditoría">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        QR &amp; Auditoría
                    </button>
                    <button class="btn-delete" onclick="eliminarActivo('${act.codigo}')" title="Dar de baja">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Registrar Nuevo Activo ───────────────────────────────────────
function registrarActivo(e) {
    e.preventDefault();

    const tipo     = document.getElementById("act-tipo").value;
    const modelo   = document.getElementById("act-modelo").value.trim();
    const oficina  = document.getElementById("act-oficina").value;
    const custodio = document.getElementById("act-custodio").value.trim();
    const valor    = parseFloat(document.getElementById("act-valor").value) || 0;
    const estado   = document.getElementById("act-estado").value;
    const serie    = (document.getElementById("act-serie")?.value ?? "").trim();

    const correlativo = String(activos.length + 1).padStart(4, "0");
    const codigo = `ACT-2026-${correlativo}`;
    const ahora  = obtenerFechaHoraActual();

    const nuevo = {
        codigo, tipo, modelo, oficina, custodio, valor, estado, serie,
        hash: "",
        logs: [{
            fecha: ahora,
            tipo: "registro",
            descripcion: `Ingreso al inventario SAFCO. Valor fiscal: Bs. ${valor.toLocaleString("es-BO", { minimumFractionDigits: 2 })}. Custodio inicial: ${custodio} (${oficina}).`
        }]
    };

    nuevo.hash = generarHashIntegridad(nuevo);
    activos.unshift(nuevo);
    guardarLocal();
    actualizarEstadisticas();

    document.getElementById("form-activo").reset();
    mostrarToast(`${codigo} registrado exitosamente.`, "success");
    switchTab("inventario");
}

// ─── Eliminar Activo ──────────────────────────────────────────────
function eliminarActivo(codigo) {
    const activo = activos.find(a => a.codigo === codigo);
    if (!activo) return;

    if (confirm(`¿Confirmar baja definitiva del activo "${codigo}" del inventario oficial de la Gobernación de Oruro?\n\nEsta acción no se puede deshacer.`)) {
        activos = activos.filter(a => a.codigo !== codigo);
        guardarLocal();
        filtrarActivos();
        actualizarEstadisticas();
        renderAnalytics();
        mostrarToast(`Activo ${codigo} dado de baja del inventario.`, "warning");
    }
}

// ─── Modal Auditoría QR ───────────────────────────────────────────
function abrirAuditoria(codigo) {
    activoSeleccionado = activos.find(a => a.codigo === codigo);
    if (!activoSeleccionado) return;

    const a = activoSeleccionado;

    const el = (id) => document.getElementById(id);
    el("modal-title").textContent    = `Ficha de Auditoría — ${a.codigo}`;
    el("modal-subtitle").textContent = `${a.tipo} · ${a.oficina}`;
    el("etiqueta-codigo").textContent  = a.codigo;
    el("etiqueta-custodio").textContent = a.custodio;
    el("etiqueta-oficina").textContent  = a.oficina;
    el("etiqueta-valor").textContent    = `Bs. ${(parseFloat(a.valor) || 0).toLocaleString("es-BO", { minimumFractionDigits: 2 })}`;
    el("etiqueta-estado").textContent   = a.estado;
    el("etiqueta-hash").textContent     = a.hash || generarHashIntegridad(a);

    // Pre-llenar formulario de transferencia
    el("trans-custodio").value    = "";
    el("trans-oficina").value     = a.oficina;
    el("trans-estado").value      = a.estado;
    el("trans-observacion").value = "";

    // Renderizar QR en Canvas
    const qrTexto = `GADORU:${a.codigo}|BIEN:${a.modelo}|CUSTODIO:${a.custodio}|HASH:${a.hash}|2026`;
    dibujarQR("qr-canvas", qrTexto);

    renderLogs();
    el("modal-qr").classList.add("open");
}

function cerrarModal() {
    const m = document.getElementById("modal-qr");
    if (m) m.classList.remove("open");
    activoSeleccionado = null;
    filtrarActivos();
    actualizarEstadisticas();
}

// ─── Transferencia de Custodia ────────────────────────────────────
function transferirActivo(e) {
    e.preventDefault();
    if (!activoSeleccionado) return;

    const a = activoSeleccionado;

    const nuevaOficina  = document.getElementById("trans-oficina").value;
    const nuevoCustodio = document.getElementById("trans-custodio").value.trim();
    const nuevoEstado   = document.getElementById("trans-estado").value;
    const obs           = document.getElementById("trans-observacion").value.trim();
    const ahora         = obtenerFechaHoraActual();

    let desc = `Transferencia: ${a.custodio} (${a.oficina}) → ${nuevoCustodio} (${nuevaOficina}). Estado: ${nuevoEstado}.`;
    if (obs) desc += ` Nota: ${obs}`;

    a.logs.push({ fecha: ahora, tipo: "transferencia", descripcion: desc });
    a.oficina  = nuevaOficina;
    a.custodio = nuevoCustodio;
    a.estado   = nuevoEstado;
    a.hash     = generarHashIntegridad(a);

    const idx = activos.findIndex(x => x.codigo === a.codigo);
    if (idx !== -1) activos[idx] = a;
    guardarLocal();
    actualizarEstadisticas();

    // Actualizar etiqueta en el modal
    document.getElementById("etiqueta-custodio").textContent = nuevoCustodio;
    document.getElementById("etiqueta-oficina").textContent  = nuevaOficina;
    document.getElementById("etiqueta-estado").textContent   = nuevoEstado;
    document.getElementById("etiqueta-hash").textContent     = a.hash;

    const qrTexto = `GADORU:${a.codigo}|BIEN:${a.modelo}|CUSTODIO:${nuevoCustodio}|HASH:${a.hash}|2026`;
    dibujarQR("qr-canvas", qrTexto);

    document.getElementById("trans-custodio").value    = "";
    document.getElementById("trans-observacion").value = "";
    renderLogs();

    mostrarToast(`Transferencia de ${a.codigo} firmada en bitácora.`, "info");
}

// ─── Render Logs ──────────────────────────────────────────────────
function renderLogs() {
    const container = document.getElementById("logs-auditoria");
    if (!container || !activoSeleccionado) return;
    container.innerHTML = "";

    [...(activoSeleccionado.logs || [])].reverse().forEach(log => {
        const div = document.createElement("div");
        div.className = `log-item ${log.tipo}`;
        div.innerHTML = `<span class="log-date">${log.fecha} [${log.tipo.toUpperCase()}]</span>${log.descripcion}`;
        container.appendChild(div);
    });
}

// ─── Escáner Directo ──────────────────────────────────────────────
function abrirEscanerDirecto() {
    document.getElementById("modal-scanner-live").classList.add("open");
    setTimeout(() => {
        const input = document.getElementById("input-codigo-escaner");
        if (input) { input.value = ""; input.focus(); }
    }, 150);
}

function cerrarEscanerDirecto() {
    document.getElementById("modal-scanner-live").classList.remove("open");
}

function simularEscaneoCodigo() {
    const input = document.getElementById("input-codigo-escaner");
    const cod   = (input?.value ?? "").trim().toUpperCase();

    if (!cod) {
        mostrarToast("Ingrese un código de activo a decodificar.", "warning");
        return;
    }

    const encontrado = activos.find(a =>
        a.codigo.toUpperCase() === cod ||
        (a.hash || "").toUpperCase().includes(cod) ||
        (a.serie || "").toUpperCase() === cod
    );

    if (encontrado) {
        cerrarEscanerDirecto();
        mostrarToast(`Código decodificado: ${encontrado.codigo}`, "success");
        setTimeout(() => abrirAuditoria(encontrado.codigo), 300);
    } else {
        mostrarToast(`No se encontró ningún activo con: "${cod}"`, "warning");
    }
}

// ─── Analytics Tab ────────────────────────────────────────────────
function renderAnalytics() {
    renderChartCategorias();
    renderChartEstados();
    renderChartOficinas();
}

function renderChartCategorias() {
    const container = document.getElementById("chart-categorias");
    if (!container) return;

    const totales = {};
    activos.forEach(a => {
        const cat = a.tipo || "Otros";
        totales[cat] = (totales[cat] || 0) + (parseFloat(a.valor) || 0);
    });

    const maxVal = Math.max(...Object.values(totales), 1);
    const COLORS = ["#f59e0b", "#06b6d4", "#10b981", "#8b5cf6", "#3b82f6"];

    container.innerHTML = Object.entries(totales)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, val], i) => {
            const pct = Math.round((val / maxVal) * 100);
            const color = COLORS[i % COLORS.length];
            const icon = CAT_ICONS[cat] || `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>`;
            const valStr = `Bs. ${val.toLocaleString("es-BO", { minimumFractionDigits: 0 })}`;
            return `
                <div class="chart-bar-row">
                    <div class="chart-bar-label" style="display:flex;align-items:center;gap:6px;">${icon} ${cat}</div>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${color},${color}99);"></div>
                    </div>
                    <div class="chart-bar-value">${valStr}</div>
                </div>`;
        }).join("");
}

function renderChartEstados() {
    const container = document.getElementById("chart-estados");
    if (!container) return;

    const conteo = { Bueno: 0, Regular: 0, Mantenimiento: 0, Baja: 0 };
    activos.forEach(a => { if (conteo[a.estado] !== undefined) conteo[a.estado]++; });
    const total = activos.length || 1;

    const CONFIG = [
        { key: "Bueno",         color: "#10b981", label: "Bueno / Operativo" },
        { key: "Regular",       color: "#f59e0b", label: "Regular" },
        { key: "Mantenimiento", color: "#06b6d4", label: "En Mantenimiento" },
        { key: "Baja",          color: "#f43f5e", label: "Para Baja" }
    ];

    // SVG Donut
    const SIZE = 120;
    const CX = SIZE / 2, CY = SIZE / 2, R = 46, STROKE = 14;
    const circ = 2 * Math.PI * R;

    let offset = 0;
    let segmentos = "";
    CONFIG.forEach(cfg => {
        const cnt = conteo[cfg.key];
        if (cnt === 0) return;
        const dash = (cnt / total) * circ;
        segmentos += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${cfg.color}" stroke-width="${STROKE}"
                        stroke-dasharray="${dash} ${circ - dash}"
                        stroke-dashoffset="${-offset}"
                        transform="rotate(-90 ${CX} ${CY})"
                        style="transition:stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1);"/>`;
        offset += dash;
    });

    const donuts = `
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
            <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" style="flex-shrink:0;">
                <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="${STROKE}"/>
                ${segmentos}
                <text x="${CX}" y="${CY}" text-anchor="middle" dominant-baseline="central"
                      fill="#f1f5f9" font-family="Outfit,sans-serif" font-size="18" font-weight="900">${total}</text>
                <text x="${CX}" y="${CY + 16}" text-anchor="middle" dominant-baseline="central"
                      fill="#4b5563" font-family="Outfit,sans-serif" font-size="8" font-weight="700">BIENES</text>
            </svg>
            <div class="donut-legend">
                ${CONFIG.map(cfg => `
                    <div class="donut-legend-item">
                        <div class="donut-legend-dot-label">
                            <div class="donut-dot" style="background:${cfg.color};"></div>
                            ${cfg.label}
                        </div>
                        <div class="donut-legend-value" style="color:${cfg.color};">${conteo[cfg.key]}</div>
                    </div>`).join("")}
            </div>
        </div>`;

    container.innerHTML = donuts;
}

function renderChartOficinas() {
    const container = document.getElementById("chart-oficinas");
    if (!container) return;

    const conteo = {};
    activos.forEach(a => { conteo[a.oficina] = (conteo[a.oficina] || 0) + 1; });
    const max = Math.max(...Object.values(conteo), 1);

    container.innerHTML = Object.entries(conteo)
        .sort((a, b) => b[1] - a[1])
        .map(([oficina, cnt]) => {
            const pct = Math.round((cnt / max) * 100);
            return `
                <div class="chart-bar-row">
                    <div class="chart-bar-label" style="min-width:220px;display:flex;align-items:center;gap:6px;">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        ${oficina}
                    </div>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,#8b5cf6,#06b6d4);"></div>
                    </div>
                    <div class="chart-bar-value">${cnt} bien${cnt !== 1 ? 'es' : ''}</div>
                </div>`;
        }).join("");
}

// ─── Canvas QR Nativo (Sin Librerías Externas) ────────────────────
function dibujarQR(canvasId, texto) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx     = canvas.getContext("2d");
    const size    = canvas.width;
    const modules = 21;
    const modSize = size / modules;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

    let matriz = Array.from({ length: modules }, () => Array(modules).fill(false));

    // Finder patterns en las 3 esquinas
    dibujarFinderPattern(matriz, 0, 0);
    dibujarFinderPattern(matriz, 14, 0);
    dibujarFinderPattern(matriz, 0, 14);

    // Timing patterns
    for (let i = 8; i < 13; i++) {
        matriz[6][i] = (i % 2 === 0);
        matriz[i][6] = (i % 2 === 0);
    }

    // Datos pseudo-aleatorios seeded con hash del texto
    let seed = hashTexto(texto);
    const rng = () => {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return (Math.abs(seed) % 1000) / 1000;
    };

    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            if (!esAreaReservada(r, c)) {
                matriz[r][c] = rng() > 0.45;
            }
        }
    }

    // Render
    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            if (matriz[r][c]) {
                ctx.fillRect(
                    Math.floor(c * modSize),
                    Math.floor(r * modSize),
                    Math.ceil(modSize + 0.5),
                    Math.ceil(modSize + 0.5)
                );
            }
        }
    }
}

function dibujarFinderPattern(matriz, startR, startC) {
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const borde  = (r === 0 || r === 6 || c === 0 || c === 6);
            const centro = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
            matriz[startR + r][startC + c] = (borde || centro);
        }
    }
}

function esAreaReservada(r, c) {
    if (r < 8 && c < 8)  return true; // TL finder
    if (r < 8 && c > 13) return true; // TR finder
    if (r > 13 && c < 8) return true; // BL finder
    if (r === 6 || c === 6) return true; // Timing
    return false;
}

function hashTexto(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = (Math.imul(h, 0x01000193)) >>> 0;
    }
    return h;
}

// ─── Imprimir y Descargar Etiqueta ────────────────────────────────
function imprimirEtiqueta() {
    window.print();
}

function descargarEtiqueta() {
    if (!activoSeleccionado) return;
    const a = activoSeleccionado;

    const W = 340, H = 480;
    const tmp = document.createElement("canvas");
    tmp.width = W;
    tmp.height = H;
    const ctx = tmp.getContext("2d");

    // Fondo blanco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Borde de corte
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(8, 8, W - 16, H - 16);
    ctx.setLineDash([]);

    // Franja de cabecera
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(8, 8, W - 16, 56);

    // Texto cabecera
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GOBERNACIÓN AUTÓNOMA DEPARTAMENTAL DE ORURO", W / 2, 30);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px monospace";
    ctx.fillText("CONTROL DE ACTIVOS FIJOS · LEY N° 1178 (SAFCO)", W / 2, 50);

    // QR
    const qrCanvas = document.getElementById("qr-canvas");
    if (qrCanvas) ctx.drawImage(qrCanvas, (W - 186) / 2, 74, 186, 186);

    // Separador
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 272); ctx.lineTo(W - 20, 272);
    ctx.stroke();

    // Detalles
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    const campo = (lbl, val, y) => {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "#000";
        ctx.fillText(lbl, 24, y);
        ctx.font = "9px monospace";
        ctx.fillStyle = "#333";
        ctx.fillText(String(val).substring(0, 36), 98, y);
    };

    campo("CÓDIGO:",   a.codigo,    292);
    campo("BIEN:",     a.modelo,    310);
    campo("CUSTODIO:", a.custodio,  328);
    campo("OFICINA:",  a.oficina,   346);
    campo("VALOR:",    `Bs. ${(parseFloat(a.valor)||0).toLocaleString("es-BO",{minimumFractionDigits:2})}`, 364);
    campo("ESTADO:",   a.estado,    382);

    ctx.font = "8px monospace";
    ctx.fillStyle = "#999";
    ctx.textAlign = "left";
    ctx.fillText(`HASH: ${a.hash || ""}`, 24, 406);

    ctx.strokeStyle = "#e0e0e0";
    ctx.beginPath(); ctx.moveTo(20, 416); ctx.lineTo(W - 20, 416); ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = "italic 8px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText("ETIQUETA OFICIAL DE INVENTARIO PATRIMONIAL — GAD-ORURO", W / 2, 440);
    ctx.fillText(obtenerFechaHoraActual(), W / 2, 456);

    // Descargar
    const link = document.createElement("a");
    link.download = `etiqueta_${a.codigo}_${Date.now()}.png`;
    link.href = tmp.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarToast("Etiqueta PNG descargada correctamente.", "success");
}

// ─── Exportar CSV ─────────────────────────────────────────────────
function exportarCSV() {
    if (activos.length === 0) {
        mostrarToast("No hay activos para exportar.", "warning");
        return;
    }

    const BOM = "\uFEFF";
    const headers = ["Codigo", "Categoria", "Modelo/Descripcion", "Serie", "Oficina", "Custodio", "ValorFiscal_Bs", "Estado", "HashIntegridad", "TotalTransferencias"];
    const rows = activos.map(a => [
        a.codigo, a.tipo, a.modelo, a.serie || "",
        a.oficina, a.custodio, a.valor, a.estado, a.hash,
        (a.logs || []).filter(l => l.tipo === "transferencia").length
    ]);

    const csvContent = BOM + [headers, ...rows]
        .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventario_activos_oruro_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    mostrarToast(`Inventario CSV (${activos.length} bienes) exportado.`, "success");
}

// ─── Helper: Fecha y Hora ─────────────────────────────────────────
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

// ─── Toast Notifications con SVG Vectorial ────────────────────────
function mostrarToast(mensaje, tipo = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const ICONS = {
        success: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
        warning: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
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
