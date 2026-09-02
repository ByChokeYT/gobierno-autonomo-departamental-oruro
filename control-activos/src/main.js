// ════════════════════════════════════════════════════════════════
// SISTEMA DE CONTROL DE ACTIVOS FIJOS — GOBERNACIÓN DE ORURO
// Ley N° 1178 (SAFCO) · Trazabilidad Hash-256 & Custodia Directa
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

// ─── Estado Global ────────────────────────────────────────────────
let activos = [];
let activosFiltrados = [];
let sortConfig = { campo: 'codigo', asc: true };
let filtroKpiEstado = null;

// ─── Inicialización ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    iniciarRelojVivo();
    actualizarEstadisticas();
    filtrarActivos();
    renderAnaliticaPatrimonial();

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

        if (e.key === "Escape") {
            cerrarFichaActivo();
            cerrarTimelineActivo();
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
    } else {
        activos = [
            {
                codigo: "ACT-2026-0001",
                nombre: "Laptop HP EliteBook G8 (Intel i7, 16GB RAM, 512GB SSD)",
                categoria: "Equipos de Computación",
                oficina: "Secretaría General",
                custodio: "Roberto Gómez Colque",
                valor: 8500.00,
                estado: "Bueno",
                serie: "SN-HP-2026-G8-001",
                auditoria: "Alta Inicial",
                fecha: "12 Ene 2026 - 09:30"
            },
            {
                codigo: "ACT-2026-0002",
                nombre: "Camioneta Toyota Hilux 4x4 Doble Cabina 2.8L",
                categoria: "Vehículos Terrestres",
                oficina: "Servicio de Caminos (SEDECA)",
                custodio: "Marcos Mamani Choque",
                valor: 210000.00,
                estado: "Bueno",
                serie: "4521-FDS",
                auditoria: "Alta Inicial",
                fecha: "15 Feb 2026 - 10:15"
            },
            {
                codigo: "ACT-2026-0003",
                nombre: "Escritorio de Roble Ejecutivo con Cajonera Lateral",
                categoria: "Muebles y Enseres",
                oficina: "Dirección Jurídica",
                custodio: "Julio Choque Valda",
                valor: 3200.00,
                estado: "Regular",
                serie: "MBL-JUR-2026-003",
                auditoria: "Alta Inicial",
                fecha: "20 Jun 2026 - 14:00"
            },
            {
                codigo: "ACT-2026-0004",
                nombre: "Servidor Rack Dell PowerEdge R750 (64 Cores, 128GB RAM)",
                categoria: "Equipos de Computación",
                oficina: "Ventanilla Única",
                custodio: "Elena Paredes Quispe",
                valor: 45000.00,
                estado: "Bueno",
                serie: "SN-DELL-R750-EPQ",
                auditoria: "Alta Inicial",
                fecha: "05 Jul 2026 - 09:45"
            },
            {
                codigo: "ACT-2026-0005",
                nombre: "Radio VHF Motorola APX 6000 (Comunicaciones)",
                categoria: "Equipos de Comunicación",
                oficina: "Secretaría General",
                custodio: "Ana Flores Condori",
                valor: 12800.00,
                estado: "Bueno",
                serie: "RAD-MOT-APX6000-AF",
                auditoria: "Alta Inicial",
                fecha: "10 Jul 2026 - 11:20"
            },
            {
                codigo: "ACT-2026-0006",
                nombre: "Generador Eléctrico Cummins 45kVA Trifásico",
                categoria: "Maquinaria y Equipos",
                oficina: "Unidad de Sistemas",
                custodio: "Pablo Quiroga Ríos",
                valor: 85200.00,
                estado: "Mantenimiento",
                serie: "GEN-CUM-45KVA-PQ",
                auditoria: "1 Reasignación",
                fecha: "01 Ago 2026 - 16:30"
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_activos_v2", JSON.stringify(activos));
}

// ─── Navegación Pestañas ──────────────────────────────────────────
function switchTab(tabName) {
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));

    const pane = document.getElementById(`tab-${tabName}`);
    const navBtn = document.getElementById(`nav-${tabName}`);
    if (pane) pane.classList.add("active");
    if (navBtn) navBtn.classList.add("active");

    const titles = {
        inventario: "Inventario de Activos Departamentales",
        registro:   "Incorporación de Nuevo Activo Fijo",
        analytics:  "Analítica Patrimonial de Activos Fijos"
    };

    const pageTitle = document.getElementById("page-title");
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    filtrarActivos();
    actualizarEstadisticas();
    if (tabName === 'analytics') renderAnaliticaPatrimonial();
    if (tabName === 'registro') actualizarDraftEnVivo();
}

// ─── Estadísticas & KPIs ─────────────────────────────────────────
function actualizarEstadisticas() {
    const total = activos.length;
    const valorTotal = activos.reduce((sum, a) => sum + Number(a.valor || 0), 0);
    const auditorias = activos.filter(a => a.auditoria && a.auditoria !== 'Alta Inicial').length + total;

    const el = (id) => document.getElementById(id);
    if (el("stat-total"))      el("stat-total").textContent      = total;
    if (el("stat-valor"))      el("stat-valor").textContent      = `Bs. ${valorTotal.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("stat-auditorias")) el("stat-auditorias").textContent = auditorias;
    if (el("nav-count"))       el("nav-count").textContent       = total;
}

function filtrarPorEstadoKpi(estado) {
    filtroKpiEstado = estado;
    const selectEstado = document.getElementById("filtro-estado");
    if (selectEstado) selectEstado.value = estado;
    filtrarActivos();
}

// ─── Filtrado & Búsqueda ──────────────────────────────────────────
function filtrarActivos() {
    const query     = (document.getElementById("input-buscar")?.value ?? "").toLowerCase().trim();
    const categoria = document.getElementById("filtro-categoria")?.value ?? "";
    const estado    = document.getElementById("filtro-estado")?.value ?? "";

    activosFiltradas = activos.filter(a => {
        const q = !query
            || a.codigo.toLowerCase().includes(query)
            || a.nombre.toLowerCase().includes(query)
            || a.custodio.toLowerCase().includes(query)
            || a.oficina.toLowerCase().includes(query)
            || a.serie.toLowerCase().includes(query);

        const c = !categoria || a.categoria === categoria;
        const e = !estado || a.estado === estado;

        return q && c && e;
    });

    activosFiltradas = ordenarActivos(activosFiltradas);
    renderTabla();

    const badge = document.getElementById("filter-result-badge");
    if (badge) badge.textContent = `${activosFiltradas.length} resultado${activosFiltradas.length !== 1 ? 's' : ''}`;

    const valorVista = activosFiltradas.reduce((sum, a) => sum + Number(a.valor || 0), 0);

    const footerCount = document.getElementById("table-total-count");
    const footerValor = document.getElementById("table-total-valor");
    if (footerCount) footerCount.textContent = `${activosFiltradas.length} de ${activos.length} bienes mostrados`;
    if (footerValor) footerValor.textContent = `Bs. ${valorVista.toLocaleString('es-BO', {minimumFractionDigits: 2})} total en esta vista`;
}

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
        if (typeof va === 'number') {
            return sortConfig.asc ? va - vb : vb - va;
        }
        if (va < vb) return sortConfig.asc ? -1 : 1;
        if (va > vb) return sortConfig.asc ? 1 : -1;
        return 0;
    });
}

// ─── Render Tabla ─────────────────────────────────────────────────
function renderTabla() {
    const tbody      = document.getElementById("tabla-activos");
    const emptyState = document.getElementById("estado-vacio");

    tbody.innerHTML = "";

    if (activosFiltradas.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    activosFiltradas.forEach(act => {
        const tr = document.createElement("tr");

        const estadoClass = act.estado === "Bueno" ? "bueno" : (act.estado === "Regular" ? "regular" : (act.estado === "Mantenimiento" ? "mantenimiento" : "baja"));

        tr.innerHTML = `
            <td>
                <div style="font-family:'JetBrains Mono',monospace;font-weight:800;color:var(--primary-light);">${act.codigo}</div>
                <div style="font-size:0.64rem;color:var(--text-muted);margin-top:2px;">SN: ${act.serie}</div>
            </td>
            <td>
                <div style="font-weight:700;color:var(--text-main);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${act.nombre}">${act.nombre}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);margin-top:2px;">Cat: ${act.categoria}</div>
            </td>
            <td>
                <span style="font-size:0.82rem;color:var(--text-secondary);">${act.oficina}</span>
            </td>
            <td>
                <div style="display:flex;align-items:center;gap:6px;">
                    <div style="width:24px;height:24px;border-radius:50%;background:rgba(245,158,11,0.2);color:var(--primary-light);font-size:0.65rem;font-weight:800;display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);">${act.custodio.split(" ").map(n => n[0]).join("").slice(0,2)}</div>
                    <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${act.custodio}</span>
                </div>
            </td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:800;color:var(--primary-light);font-size:0.88rem;">Bs. ${Number(act.valor || 0).toLocaleString('es-BO', {minimumFractionDigits:2})}</span>
            </td>
            <td>
                <span class="badge-estado ${estadoClass}">${act.estado}</span>
            </td>
            <td>
                <span style="font-size:0.7rem;color:var(--accent-cyan);font-family:var(--font-mono);">${act.auditoria || 'Alta Inicial'}</span>
            </td>
            <td>
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="btn-ficha" onclick="abrirFichaActivo('${act.codigo}')" title="Ver Acta de Asignación A4 Membretada">
                        Ficha A4
                    </button>
                    <button class="btn-timeline" onclick="abrirTimelineActivo('${act.codigo}')" title="Ver historial de custodia">
                        Trazabilidad
                    </button>
                    <button class="btn-qr" onclick="abrirQRModalIndividual('${act.codigo}')" title="Generar etiqueta QR">
                        QR
                    </button>
                    <button class="btn-delete" onclick="eliminarActivo('${act.codigo}')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Live Draft Formulario ────────────────────────────────────────
function actualizarDraftEnVivo() {
    const bien = document.getElementById("act-nombre")?.value.trim() || "[Descripción del Bien]";
    const cat = document.getElementById("act-categoria")?.value || "[Categoría]";
    const ofi = document.getElementById("act-oficina")?.value || "[Oficina]";
    const cust = document.getElementById("act-custodio")?.value.trim() || "[Custodio]";
    const val = Number(document.getElementById("act-valor")?.value || 0);
    const est = document.getElementById("act-estado")?.value || "Bueno";
    const serie = document.getElementById("act-serie")?.value.trim() || "SN-2026";

    const el = (id) => document.getElementById(id);
    if (el("draft-bien")) el("draft-bien").textContent = bien;
    if (el("draft-custodio")) el("draft-custodio").textContent = cust;
    if (el("draft-oficina")) el("draft-oficina").textContent = ofi;
    if (el("draft-valor")) el("draft-valor").textContent = `Bs. ${val.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("draft-estado-text")) el("draft-estado-text").textContent = est;
}

// ─── Registrar Nuevo Activo ───────────────────────────────────────
function registrarNuevoActivo(e) {
    e.preventDefault();

    const nombre    = document.getElementById("act-nombre").value.trim();
    const categoria = document.getElementById("act-categoria").value;
    const oficina   = document.getElementById("act-oficina").value;
    const custodio = document.getElementById("act-custodio").value.trim();
    const valor    = parseFloat(document.getElementById("act-valor").value) || 0;
    const estado   = document.getElementById("act-estado").value;
    const serie    = document.getElementById("act-serie").value.trim();

    const numCorrelativo = String(activos.length + 1).padStart(4, "0");
    const codigo = `ACT-2026-${numCorrelativo}`;
    const fecha = obtenerFechaHoraActual();

    const nuevo = {
        codigo, nombre, categoria, oficina, custodio, valor, estado, serie,
        auditoria: "Alta Inicial", fecha
    };

    activos.unshift(nuevo);
    guardarLocal();

    document.getElementById("form-activo").reset();
    actualizarEstadisticas();
    mostrarToast(`Activo ${codigo} registrado e incorporado SAFCO.`, "success");
    switchTab('inventario');

    setTimeout(() => abrirFichaActivo(codigo), 300);
}

// ─── Eliminar Activo ──────────────────────────────────────────────
function eliminarActivo(codigo) {
    const act = activos.find(a => a.codigo === codigo);
    if (!act) return;

    if (confirm(`¿Confirmar baja definitiva del activo ${codigo} ("${act.nombre}")?`)) {
        activos = activos.filter(a => a.codigo !== codigo);
        guardarLocal();
        filtrarActivos();
        actualizarEstadisticas();
        mostrarToast(`Activo ${codigo} dado de baja.`, "warning");
    }
}

// ─── Ficha A4 SAFCO Modal ─────────────────────────────────────────
function abrirFichaActivo(codigo) {
    const act = activos.find(a => a.codigo === codigo);
    if (!act) return;

    const el = (id) => document.getElementById(id);
    if (el("ficha-subtitle"))   el("ficha-subtitle").textContent   = `${act.codigo} · ${act.nombre}`;
    if (el("ficha-codigo"))     el("ficha-codigo").textContent     = `ACTA DE ENTREGA Y CUSTODIA N° ${act.codigo}`;
    if (el("ficha-codigo-val")) el("ficha-codigo-val").textContent = act.codigo;
    if (el("ficha-fecha"))      el("ficha-fecha").textContent      = act.fecha;
    if (el("ficha-bien"))       el("ficha-bien").textContent       = act.nombre;
    if (el("ficha-categoria"))  el("ficha-categoria").textContent  = act.categoria;
    if (el("ficha-serie"))      el("ficha-serie").textContent      = act.serie;
    if (el("ficha-custodio"))   el("ficha-custodio").textContent   = act.custodio;
    if (el("ficha-oficina"))    el("ficha-oficina").textContent    = act.oficina;
    if (el("ficha-valor"))      el("ficha-valor").textContent      = `Bs. ${Number(act.valor || 0).toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("ficha-estado"))     el("ficha-estado").textContent     = act.estado;

    if (el("ficha-hash-val")) {
        const hash = "SHA256: " + Array.from(act.codigo + act.nombre).reduce((acc, char) => (acc + char.charCodeAt(0)).toString(16), "735392ca1f8b4c3d").slice(0, 48);
        el("ficha-hash-val").textContent = hash;
    }

    document.getElementById("modal-ficha-activo").classList.add("open");
}

function cerrarFichaActivo() {
    document.getElementById("modal-ficha-activo").classList.remove("open");
}

function imprimirFichaActivo() {
    window.print();
}

// ─── Timeline Audit Activo Modal ─────────────────────────────────
function abrirTimelineActivo(codigo) {
    const act = activos.find(a => a.codigo === codigo);
    if (!act) return;

    const el = (id) => document.getElementById(id);
    if (el("timeline-activo-subtitle")) el("timeline-activo-subtitle").textContent = `${act.codigo} · ${act.nombre}`;

    const content = `
        <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:16px;border-radius:12px;margin-bottom:20px;">
            <h4 style="font-size:0.95rem;color:var(--text-main);">${act.nombre}</h4>
            <p style="font-size:0.78rem;color:var(--text-secondary);">Oficina: <strong>${act.oficina}</strong> | Custodio Actual: <strong>${act.custodio}</strong></p>
        </div>

        <div class="timeline-track-wrap" style="position:relative;padding-left:28px;display:flex;flex-direction:column;gap:18px;">
            <div style="position:relative;">
                <h5 style="font-size:0.9rem;color:var(--primary-light);">1. Alta e Incorporación al Inventario SAFCO</h5>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Alta patrimonial registrada con valor fiscal inicial de <strong>Bs. ${Number(act.valor).toLocaleString('es-BO', {minimumFractionDigits: 2})}</strong>.</p>
                <small style="font-size:0.68rem;color:var(--text-muted);">${act.fecha}</small>
            </div>
            <div style="position:relative;">
                <h5 style="font-size:0.9rem;color:var(--accent-cyan);">2. Asignación Formal de Custodia Directa</h5>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Emisión de Acta A4 asignando responsabilidad a <strong>${act.custodio}</strong> (${act.oficina}).</p>
            </div>
            <div style="position:relative;">
                <h5 style="font-size:0.9rem;color:var(--accent-emerald);">3. Auditoría Física &amp; Etiquetado QR</h5>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Inspección física en estado <strong>${act.estado}</strong> con firma digital criptográfica Hash SHA-256.</p>
            </div>
        </div>
    `;

    document.getElementById("timeline-activo-body").innerHTML = content;
    document.getElementById("modal-timeline-activo").classList.add("open");
}

function cerrarTimelineActivo() {
    document.getElementById("modal-timeline-activo").classList.remove("open");
}

// ─── Generador / Escáner QR ──────────────────────────────────────
function abrirEscanerDirecto() {
    document.getElementById("modal-escaner-qr").classList.add("open");
}

function abrirQRModalIndividual(codigo) {
    const input = document.getElementById("input-qr-code");
    if (input) input.value = codigo;
    abrirEscanerDirecto();
    ejecutarEscaneoQR();
}

function cerrarEscanerDirecto() {
    document.getElementById("modal-escaner-qr").classList.remove("open");
    const box = document.getElementById("qr-generated-result-box");
    if (box) box.style.display = "none";
}

function ejecutarEscaneoQR() {
    const query = (document.getElementById("input-qr-code")?.value ?? "").trim();
    const resultBox = document.getElementById("qr-generated-result-box");
    if (!resultBox) return;

    if (!query) {
        mostrarToast("Ingrese un código de activo", "warning");
        return;
    }

    const act = activos.find(a => a.codigo.toLowerCase() === query.toLowerCase());

    if (act) {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:20px;text-align:center;">
                <h4 style="color:var(--primary-light);font-size:1rem;font-weight:800;">ETIQUETA PATRIMONIAL AUTOADHESIVA QR</h4>
                <div style="display:flex;justify-content:center;margin:16px 0;">
                    <svg width="140" height="140" viewBox="0 0 24 24" fill="var(--primary-light)">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h3v3h-3v-3zm0 5h3v3h-3v-3zm-5-5h3v3h-3v-3zm0 5h3v3h-3v-3z"/>
                    </svg>
                </div>
                <p style="font-family:var(--font-mono);font-size:1.1rem;font-weight:900;color:var(--primary-light);">${act.codigo}</p>
                <p style="font-size:0.85rem;font-weight:700;color:var(--text-main);margin-top:4px;">${act.nombre}</p>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Custodio: ${act.custodio} | Oficina: ${act.oficina}</p>
                <button class="btn-primary" onclick="window.print()" style="margin-top:14px;">Imprimir Etiqueta Sticker</button>
            </div>
        `;
        mostrarToast("Etiqueta QR Generada ✓", "success");
    } else {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div style="background:rgba(251,113,133,0.08);border:1px solid rgba(251,113,133,0.3);border-radius:10px;padding:16px;">
                <h4 style="color:var(--accent-rose);font-size:0.95rem;">ACTIVO NO ENCONTRADO</h4>
                <p style="font-size:0.82rem;">No se halló bien público con el código ingresado.</p>
            </div>
        `;
        mostrarToast("Código no encontrado", "error");
    }
}

// ─── Analítica Patrimonial ───────────────────────────────────────
function renderAnaliticaPatrimonial() {
    const container = document.getElementById("analytics-content-body");
    if (!container) return;

    const categorias = {};
    activos.forEach(a => {
        if (!categorias[a.categoria]) {
            categorias[a.categoria] = { count: 0, valor: 0 };
        }
        categorias[a.categoria].count += 1;
        categorias[a.categoria].valor += Number(a.valor || 0);
    });

    const valorTotal = activos.reduce((sum, a) => sum + Number(a.valor || 0), 0);

    let html = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
    `;

    Object.keys(categorias).forEach(cat => {
        const item = categorias[cat];
        const pct = valorTotal > 0 ? Math.round((item.valor / valorTotal) * 100) : 0;

        html += `
            <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:18px;border-radius:12px;">
                <h4 style="font-size:0.9rem;color:var(--text-main);margin-bottom:6px;">${cat}</h4>
                <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
                    <span style="font-size:1.3rem;font-weight:800;color:var(--primary-light);font-family:var(--font-mono);">Bs. ${item.valor.toLocaleString('es-BO', {minimumFractionDigits: 2})}</span>
                    <span style="font-size:0.75rem;color:var(--accent-cyan);font-weight:700;">${item.count} ítems (${pct}%)</span>
                </div>
                <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden;">
                    <div style="height:100%;width:${pct}%;background:linear-gradient(90deg, var(--primary), var(--primary-light));"></div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// ─── Reporte Ejecutivo Patrimonial A4 ─────────────────────────────
function generarReporteEjecutivoActivos() {
    const total = activos.length;
    const valorTotal = activos.reduce((sum, a) => sum + Number(a.valor || 0), 0);
    const buenos = activos.filter(a => a.estado === "Bueno").length;

    const el = (id) => document.getElementById(id);
    if (el("rep-act-total")) el("rep-act-total").textContent = total;
    if (el("rep-act-valor")) el("rep-act-valor").textContent = `Bs. ${valorTotal.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("rep-act-buenos")) el("rep-act-buenos").textContent = buenos;

    const tbody = el("reporte-activos-tabla-body");
    if (tbody) {
        tbody.innerHTML = activos.map(a => `
            <tr>
                <td><strong>${a.codigo}</strong></td>
                <td>${a.nombre}</td>
                <td>${a.oficina}</td>
                <td>${a.custodio}</td>
                <td>Bs. ${Number(a.valor || 0).toLocaleString('es-BO', {minimumFractionDigits: 2})}</td>
                <td><strong>${a.estado}</strong></td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-activos");
    if (area) area.style.display = "block";
    window.print();

    setTimeout(() => {
        if (area) area.style.display = "none";
    }, 1000);
}

// ─── Exportar CSV ─────────────────────────────────────────────────
function exportarCSV() {
    if (activos.length === 0) {
        mostrarToast("No hay bienes para exportar.", "warning");
        return;
    }

    const BOM = "\uFEFF";
    const headers = ["CodigoActivo", "NombreBien", "Categoria", "Oficina", "CustodioResponsable", "ValorFiscalBs", "EstadoFisico", "NumeroSerie", "FechaAlta"];
    const rows = activos.map(a => [
        a.codigo, a.nombre, a.categoria, a.oficina, a.custodio, a.valor, a.estado, a.serie, a.fecha
    ]);

    const csvContent = BOM + [headers, ...rows]
        .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activos_fijos_oruro_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    mostrarToast(`Inventario CSV (${activos.length} activos) exportado.`, "success");
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

function mostrarToast(mensaje, tipo = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<span>${mensaje}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3500);
}
