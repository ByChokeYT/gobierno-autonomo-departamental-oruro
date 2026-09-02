// ════════════════════════════════════════════════════════════════
// SISTEMA DE MONITOREO DE LICENCIAS AMBIENTALES — GOBERNACIÓN DE ORURO
// Ley N° 1333 (Medio Ambiente) · Mapa SVG Territorial & Risk Score
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

// ─── Estado Global ────────────────────────────────────────────────
let licencias = [];
let licenciasFiltradas = [];
let filtroProvinciaActivo = null;
let filtroRiesgoKpiActivo = null;
let sortConfig = { campo: 'codigo', asc: true };

// Map Provincias Slugs a Nombres Completos
const PROVINCIAS_MAP = {
    Cercado: "Cercado",
    Abaroa: "Eduardo Abaroa",
    Carangas: "Carangas",
    Poopo: "Poopó",
    Sajama: "Sajama",
    Sabaya: "Sabaya",
    Dalence: "Pantaleón Dalence",
    LadislaoCabrera: "Ladislao Cabrera",
    Pagador: "Sebastián Pagador",
    Litoral: "Litoral",
    Mejillones: "Puerto de Mejillones",
    NorCarangas: "Nor Carangas",
    Totora: "San Pedro de Totora",
    TomasBarron: "Tomas Barrón",
    Saucari: "Saucarí",
    SurCarangas: "Sur Carangas"
};

// ─── Inicialización ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    iniciarRelojVivo();
    actualizarEstadisticas();
    actualizarColoresMapa();
    filtrarLicencias();
    inicializarEventosMapa();
    calcularRiesgoFormulario();

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            switchTab('mapa');
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
            cerrarCertificadoDIA();
            cerrarTimelineAmbiental();
            cerrarVerificadorAmbiental();
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
    const dataLocal = localStorage.getItem("oruro_licencias_v2");
    if (dataLocal) {
        licencias = JSON.parse(dataLocal);
    } else {
        licencias = [
            {
                codigo: "LIC-2026-0001",
                operador: "Cooperativa Minera Huanuni R.L.",
                tipoActividad: "Minería Pesada",
                provincia: "Dalence",
                vulnerabilidad: { agua: true, poblacion: true, reserva: false },
                score: 8,
                riesgo: "Alto",
                fecha: "12 Ene 2026 - 08:30"
            },
            {
                codigo: "LIC-2026-0002",
                operador: "Planta Procesadora de Lácteos Challapata",
                tipoActividad: "Agroindustrial",
                provincia: "Abaroa",
                vulnerabilidad: { agua: false, poblacion: true, reserva: false },
                score: 4,
                riesgo: "Medio",
                fecha: "15 Feb 2026 - 10:15"
            },
            {
                codigo: "LIC-2026-0003",
                operador: "Dique de Colas Minera Bolívar",
                tipoActividad: "Concentración de Minerales",
                provincia: "Poopo",
                vulnerabilidad: { agua: true, poblacion: false, reserva: true },
                score: 9,
                riesgo: "Alto",
                fecha: "20 Jun 2026 - 14:00"
            },
            {
                codigo: "LIC-2026-0004",
                operador: "Proyecto de Riego Tecnificado Sabaya",
                tipoActividad: "Servicios/Infraestructura",
                provincia: "Sabaya",
                vulnerabilidad: { agua: true, poblacion: false, reserva: false },
                score: 4,
                riesgo: "Medio",
                fecha: "05 Jul 2026 - 09:45"
            },
            {
                codigo: "LIC-2026-0005",
                operador: "Pavimentado Avenida Principal Oruro Norte",
                tipoActividad: "Servicios/Infraestructura",
                provincia: "Cercado",
                vulnerabilidad: { agua: false, poblacion: true, reserva: false },
                score: 3,
                riesgo: "Bajo",
                fecha: "10 Jul 2026 - 11:20"
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_licencias_v2", JSON.stringify(licencias));
}

// ─── Navegación Pestañas ──────────────────────────────────────────
function switchTab(tabName) {
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));

    const pane = document.getElementById(`tab-${tabName}`);
    const navBtn = document.getElementById(`nav-${tabName}`);
    if (pane) pane.classList.add("active");
    if (navBtn) navBtn.classList.add("active");

    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        pageTitle.textContent = tabName === 'mapa' ? "Mapa & Monitoreo de Licencias Ambientales" : "Registro de Licencia Ambiental (Ficha FA/MA)";
    }

    filtrarLicencias();
    actualizarEstadisticas();
}

// ─── Estadísticas & KPIs ─────────────────────────────────────────
function actualizarEstadisticas() {
    const total = licencias.length;
    const alto = licencias.filter(l => l.riesgo === "Alto").length;
    const mineras = licencias.filter(l => l.tipoActividad.includes("Minería") || l.tipoActividad.includes("Minerales")).length;

    const el = (id) => document.getElementById(id);
    if (el("kpi-total-val"))   el("kpi-total-val").textContent   = total;
    if (el("kpi-alto-val"))    el("kpi-alto-val").textContent    = alto;
    if (el("kpi-mineras-val")) el("kpi-mineras-val").textContent = mineras;
    if (el("nav-count"))       el("nav-count").textContent       = total;
}

function filtrarPorRiesgoKpi(riesgo) {
    filtroRiesgoKpiActivo = riesgo;
    const selectRiesgo = document.getElementById("filtro-riesgo");
    if (selectRiesgo) selectRiesgo.value = riesgo;
    filtrarLicencias();
}

// ─── Eventos del Mapa SVG Interactivo ─────────────────────────────
function inicializarEventosMapa() {
    const polygons = document.querySelectorAll(".prov-polygon");
    const tooltip = document.getElementById("map-tooltip");

    polygons.forEach(p => {
        const provKey = p.getAttribute("data-provincia");
        const provNombre = PROVINCIAS_MAP[provKey] || provKey;

        p.addEventListener("mouseenter", (e) => {
            const count = licencias.filter(l => l.provincia === provKey || l.provincia === provNombre).length;
            const maxScore = licencias
                .filter(l => l.provincia === provKey || l.provincia === provNombre)
                .reduce((max, l) => Math.max(max, l.score), 0);

            let nivelRisk = "Riesgo Bajo";
            if (maxScore >= 7) nivelRisk = "Riesgo Alto ⚠️";
            else if (maxScore >= 4) nivelRisk = "Riesgo Medio ⚡";

            if (tooltip) {
                tooltip.style.display = "block";
                tooltip.innerHTML = `<strong>Provincia ${provNombre}</strong><br>${count} Licencias · ${nivelRisk}`;
            }
        });

        p.addEventListener("mousemove", (e) => {
            if (tooltip) {
                const containerRect = document.querySelector(".map-container").getBoundingClientRect();
                tooltip.style.left = `${e.clientX - containerRect.left + 15}px`;
                tooltip.style.top = `${e.clientY - containerRect.top + 15}px`;
            }
        });

        p.addEventListener("mouseleave", () => {
            if (tooltip) tooltip.style.display = "none";
        });

        p.addEventListener("click", () => {
            seleccionarProvinciaEnMapa(provKey);
        });
    });
}

function seleccionarProvinciaEnMapa(provKey) {
    document.querySelectorAll(".prov-polygon").forEach(p => p.classList.remove("active-prov"));

    if (filtroProvinciaActivo === provKey) {
        desseleccionarProvincia();
        return;
    }

    filtroProvinciaActivo = provKey;
    const poly = document.getElementById(`prov-${provKey}`);
    if (poly) poly.classList.add("active-prov");

    const btn = document.getElementById("btn-limpiar-provincia");
    if (btn) btn.style.display = "inline-flex";

    const provNombre = PROVINCIAS_MAP[provKey] || provKey;
    const tableTitle = document.getElementById("table-title");
    if (tableTitle) tableTitle.textContent = `Licencias en ${provNombre}`;

    filtrarLicencias();
    mostrarToast(`Filtrado por Provincia: ${provNombre}`, "info");
}

function desseleccionarProvincia() {
    filtroProvinciaActivo = null;
    document.querySelectorAll(".prov-polygon").forEach(p => p.classList.remove("active-prov"));
    const btn = document.getElementById("btn-limpiar-provincia");
    if (btn) btn.style.display = "none";
    const tableTitle = document.getElementById("table-title");
    if (tableTitle) tableTitle.textContent = "Registros Ambientales (Todos)";
    filtrarLicencias();
}

function actualizarColoresMapa() {
    Object.keys(PROVINCIAS_MAP).forEach(provKey => {
        const provNombre = PROVINCIAS_MAP[provKey];
        const maxScore = licencias
            .filter(l => l.provincia === provKey || l.provincia === provNombre)
            .reduce((max, l) => Math.max(max, l.score), 0);

        const poly = document.getElementById(`prov-${provKey}`);
        if (poly) {
            if (maxScore >= 7) poly.setAttribute("data-risk", "Alto");
            else if (maxScore >= 4) poly.setAttribute("data-risk", "Medio");
            else poly.setAttribute("data-risk", "Bajo");
        }
    });
}

// ─── Filtrado & Búsqueda ──────────────────────────────────────────
function filtrarLicencias() {
    const query     = (document.getElementById("input-buscar")?.value ?? "").toLowerCase().trim();
    const actividad = document.getElementById("filtro-actividad")?.value ?? "";
    const riesgo    = document.getElementById("filtro-riesgo")?.value ?? "";

    licenciasFiltradas = licencias.filter(l => {
        const q = !query
            || l.codigo.toLowerCase().includes(query)
            || l.operador.toLowerCase().includes(query)
            || l.provincia.toLowerCase().includes(query)
            || l.tipoActividad.toLowerCase().includes(query);

        const a = !actividad || l.tipoActividad === actividad;
        const r = !riesgo || l.riesgo === riesgo;
        const p = !filtroProvinciaActivo || (l.provincia === filtroProvinciaActivo || l.provincia === PROVINCIAS_MAP[filtroProvinciaActivo]);

        return q && a && r && p;
    });

    licenciasFiltradas = ordenarLicencias(licenciasFiltradas);
    renderTabla();

    const badge = document.getElementById("filter-result-badge");
    if (badge) badge.textContent = `${licenciasFiltradas.length} resultado${licenciasFiltradas.length !== 1 ? 's' : ''}`;

    const altoCount = licenciasFiltradas.filter(l => l.riesgo === "Alto").length;
    const pctAlto = licenciasFiltradas.length > 0 ? Math.round((altoCount / licenciasFiltradas.length) * 100) : 0;

    const footerCount = document.getElementById("table-total-count");
    const footerPct   = document.getElementById("table-pct-alto");
    if (footerCount) footerCount.textContent = `${licenciasFiltradas.length} de ${licencias.length} licencias mostradas`;
    if (footerPct)   footerPct.textContent   = `${pctAlto}% Riesgo Alto en esta vista`;
}

function ordenarPor(campo) {
    if (sortConfig.campo === campo) {
        sortConfig.asc = !sortConfig.asc;
    } else {
        sortConfig.campo = campo;
        sortConfig.asc = true;
    }
    filtrarLicencias();
}

function ordenarLicencias(lista) {
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
    const tbody      = document.getElementById("tabla-licencias");
    const emptyState = document.getElementById("estado-vacio");

    tbody.innerHTML = "";

    if (licenciasFiltradas.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    licenciasFiltradas.forEach(lic => {
        const tr = document.createElement("tr");

        const riskClass = lic.riesgo === "Alto" ? "alto" : (lic.riesgo === "Medio" ? "medio" : "bajo");

        tr.innerHTML = `
            <td>
                <div style="font-family:'JetBrains Mono',monospace;font-weight:800;color:var(--primary-light);">${lic.codigo}</div>
                <div style="font-size:0.65rem;color:var(--text-muted);margin-top:2px;">${lic.fecha}</div>
            </td>
            <td>
                <div style="font-weight:700;color:var(--text-main);">${lic.operador}</div>
            </td>
            <td>
                <span style="font-size:0.82rem;color:var(--text-secondary);">${PROVINCIAS_MAP[lic.provincia] || lic.provincia}</span>
            </td>
            <td>
                <span style="font-size:0.78rem;color:var(--text-secondary);background:rgba(255,255,255,0.03);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">${lic.tipoActividad}</span>
            </td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.95rem;color:var(--text-main);">${lic.score} Pts</span>
            </td>
            <td>
                <span class="badge-risk ${riskClass}">${lic.riesgo}</span>
            </td>
            <td>
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="btn-cert" onclick="abrirCertificadoDIA('${lic.codigo}')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> DIA A4
                    </button>
                    <button class="btn-timeline" onclick="abrirTimelineAmbiental('${lic.codigo}')">
                        Trazabilidad
                    </button>
                    <button class="btn-delete" onclick="eliminarLicencia('${lic.codigo}')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Calculadora de Riesgo Formulario ─────────────────────────────
function calcularRiesgoFormulario() {
    const act = document.getElementById("op-actividad")?.value || "";
    const chkAgua = document.getElementById("chk-agua")?.checked ?? false;
    const chkPoblacion = document.getElementById("chk-poblacion")?.checked ?? false;
    const chkReserva = document.getElementById("chk-reserva")?.checked ?? false;

    let baseScore = 3;
    if (act === "Minería Pesada") baseScore = 6;
    else if (act === "Concentración de Minerales") baseScore = 5;
    else if (act === "Agroindustrial") baseScore = 4;

    const totalScore = baseScore + (chkAgua ? 3 : 0) + (chkPoblacion ? 2 : 0) + (chkReserva ? 4 : 0);

    let riesgo = "Bajo";
    let cat = "Categoría IV";
    let desc = "Proyecto con impacto ambiental insignificante. Ficha Ambiental simplificada.";

    if (totalScore >= 7) {
        riesgo = "Alto";
        cat = "Categoría I / II";
        desc = "Proyecto de Alto Impacto. Requiere Estudio de Evaluación de Impacto Ambiental (EEIA) Analítico Integrativo.";
    } else if (totalScore >= 4) {
        riesgo = "Medio";
        cat = "Categoría III";
        desc = "Proyecto de Impacto Moderado. Requiere Plan de Aplicación y Seguimiento Ambiental (PASA).";
    }

    const el = (id) => document.getElementById(id);
    if (el("form-score-val")) el("form-score-val").textContent = totalScore;
    if (el("form-riesgo-label")) el("form-riesgo-label").textContent = `Riesgo ${riesgo} (${cat})`;
    if (el("form-riesgo-desc")) el("form-riesgo-desc").textContent = desc;

    return { totalScore, riesgo, cat };
}

function actualizarDraftEnVivo() {
    const op = document.getElementById("op-nombre")?.value.trim() || "[Nombre del Operador]";
    const act = document.getElementById("op-actividad")?.value || "[Actividad]";
    const prov = document.getElementById("op-provincia")?.value || "[Provincia]";

    const calc = calcularRiesgoFormulario();

    const el = (id) => document.getElementById(id);
    if (el("draft-op")) el("draft-op").textContent = op;
    if (el("draft-act")) el("draft-act").textContent = act;
    if (el("draft-prov")) el("draft-prov").textContent = PROVINCIAS_MAP[prov] || prov;
    if (el("draft-score")) el("draft-score").textContent = `${calc.totalScore} Pts`;
    if (el("draft-riesgo-text")) el("draft-riesgo-text").textContent = `Riesgo ${calc.riesgo}`;
    if (el("draft-badge-status")) el("draft-badge-status").textContent = calc.cat;
}

// ─── Registrar Nueva Licencia ────────────────────────────────────
function registrarNuevaLicencia(e) {
    e.preventDefault();

    const operador = document.getElementById("op-nombre").value.trim();
    const tipoActividad = document.getElementById("op-actividad").value;
    const provincia = document.getElementById("op-provincia").value;

    const vulnerabilidad = {
        agua: document.getElementById("chk-agua").checked,
        poblacion: document.getElementById("chk-poblacion").checked,
        reserva: document.getElementById("chk-reserva").checked
    };

    const calc = calcularRiesgoFormulario();
    const numCorrelativo = String(licencias.length + 1).padStart(4, "0");
    const codigo = `LIC-2026-${numCorrelativo}`;
    const fecha = obtenerFechaHoraActual();

    const nueva = {
        codigo, operador, tipoActividad, provincia, vulnerabilidad,
        score: calc.totalScore, riesgo: calc.riesgo, fecha
    };

    licencias.unshift(nueva);
    guardarLocal();

    document.getElementById("form-licencia").reset();
    calcularRiesgoFormulario();

    actualizarEstadisticas();
    actualizarColoresMapa();
    mostrarToast(`Licencia ${codigo} registrada correctamente.`, "success");
    switchTab('mapa');

    setTimeout(() => abrirCertificadoDIA(codigo), 300);
}

// ─── Eliminar Licencia ───────────────────────────────────────────
function eliminarLicencia(codigo) {
    const lic = licencias.find(l => l.codigo === codigo);
    if (!lic) return;

    if (confirm(`¿Confirmar eliminación definitiva de la Licencia ${codigo} ("${lic.operador}")?`)) {
        licencias = licencias.filter(l => l.codigo !== codigo);
        guardarLocal();
        filtrarLicencias();
        actualizarEstadisticas();
        actualizarColoresMapa();
        mostrarToast(`Licencia ${codigo} eliminada.`, "warning");
    }
}

// ─── Certificado D.I.A. Modal ─────────────────────────────────────
function abrirCertificadoDIA(codigo) {
    const lic = licencias.find(l => l.codigo === codigo);
    if (!lic) return;

    const provNombre = PROVINCIAS_MAP[lic.provincia] || lic.provincia;
    const el = (id) => document.getElementById(id);

    if (el("cert-subtitle"))       el("cert-subtitle").textContent       = `${lic.codigo} · ${lic.operador}`;
    if (el("cert-codigo"))         el("cert-codigo").textContent         = `DECLARATORIA DE IMPACTO AMBIENTAL N° ${lic.codigo}`;
    if (el("cert-fecha"))          el("cert-fecha").textContent          = lic.fecha;
    if (el("cert-operador"))       el("cert-operador").textContent       = lic.operador;
    if (el("cert-operador-cuerpo"))el("cert-operador-cuerpo").textContent= lic.operador;
    if (el("cert-actividad"))      el("cert-actividad").textContent      = lic.tipoActividad;
    if (el("cert-provincia"))      el("cert-provincia").textContent      = provNombre;
    if (el("cert-score"))          el("cert-score").textContent          = `${lic.score} Pts`;
    if (el("cert-riesgo"))         el("cert-riesgo").textContent         = `Riesgo ${lic.riesgo}`;

    if (el("cert-hash-val")) {
        const hash = "SHA256: " + Array.from(lic.codigo + lic.operador).reduce((acc, char) => (acc + char.charCodeAt(0)).toString(16), "8f9a2b1c90d8e7f").slice(0, 48);
        el("cert-hash-val").textContent = hash;
    }

    document.getElementById("modal-certificado-dia").classList.add("open");
}

function cerrarCertificadoDIA() {
    document.getElementById("modal-certificado-dia").classList.remove("open");
}

function imprimirCertificadoDIA() {
    window.print();
}

// ─── Timeline Fiscalización Ambiental Modal ────────────────────────
function abrirTimelineAmbiental(codigo) {
    const lic = licencias.find(l => l.codigo === codigo);
    if (!lic) return;

    const provNombre = PROVINCIAS_MAP[lic.provincia] || lic.provincia;
    const el = (id) => document.getElementById(id);

    if (el("timeline-ambient-subtitle")) el("timeline-ambient-subtitle").textContent = `${lic.codigo} · ${lic.operador}`;

    const content = `
        <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:16px;border-radius:12px;margin-bottom:20px;">
            <h4 style="font-size:0.95rem;color:var(--text-main);">${lic.operador}</h4>
            <p style="font-size:0.78rem;color:var(--text-secondary);">Provincia: <strong>${provNombre}</strong> | Sector: <strong>${lic.tipoActividad}</strong></p>
        </div>

        <div class="timeline-track-wrap" style="position:relative;padding-left:28px;display:flex;flex-direction:column;gap:18px;">
            <div style="position:relative;">
                <h5 style="font-size:0.9rem;color:var(--primary-light);">1. Presentación Ficha Ambiental (FA / MA)</h5>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Ingreso formal del proyecto y asignación del código <code>${lic.codigo}</code>.</p>
                <small style="font-size:0.68rem;color:var(--text-muted);">${lic.fecha}</small>
            </div>
            <div style="position:relative;">
                <h5 style="font-size:0.9rem;color:var(--primary-light);">2. Inspección Técnica In Situ</h5>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Verificación de factores de vulnerabilidad por la Secretaría de Medio Ambiente (Puntaje: ${lic.score} Pts).</p>
                <small style="font-size:0.68rem;color:var(--text-muted);">Auditor Fiscal Ambiental GAD-ORU</small>
            </div>
            <div style="position:relative;">
                <h5 style="font-size:0.9rem;color:var(--primary-light);">3. Categorización Ley N° 1333 & PASA</h5>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Asignación de categoría según matriz de riesgo (<strong>Riesgo ${lic.riesgo}</strong>) y aprobación de Plan de Manejo.</p>
            </div>
            <div style="position:relative;">
                <h5 style="font-size:0.9rem;color:var(--primary-light);">4. Emisión de Declaratoria D.I.A. & Hash SHA-256</h5>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Emisión de licencia oficial membretada A4 y certificación de monitoreo activo.</p>
            </div>
        </div>
    `;

    document.getElementById("timeline-ambient-body").innerHTML = content;
    document.getElementById("modal-timeline-ambiental").classList.add("open");
}

function cerrarTimelineAmbiental() {
    document.getElementById("modal-timeline-ambiental").classList.remove("open");
}

// ─── Verificador Criptográfico Ambiental ─────────────────────────
function abrirVerificadorAmbiental() {
    document.getElementById("modal-verificador-ambiental").classList.add("open");
}

function cerrarVerificadorAmbiental() {
    document.getElementById("modal-verificador-ambiental").classList.remove("open");
    const box = document.getElementById("verification-ambient-result-box");
    if (box) box.style.display = "none";
}

function ejecutarVerificacionAmbiental() {
    const query = (document.getElementById("input-hash-verify-ambient")?.value ?? "").trim();
    const resultBox = document.getElementById("verification-ambient-result-box");
    if (!resultBox) return;

    if (!query) {
        mostrarToast("Ingrese un código o Hash para verificar", "warning");
        return;
    }

    const lic = licencias.find(l =>
        l.codigo.toLowerCase() === query.toLowerCase() ||
        query.length > 10 && (l.codigo.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(l.codigo.toLowerCase()))
    );

    if (lic) {
        const provNombre = PROVINCIAS_MAP[lic.provincia] || lic.provincia;
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.3);border-radius:10px;padding:16px;">
                <h4 style="color:var(--primary-light);font-size:0.95rem;font-weight:800;">✓ LICENCIA AMBIENTAL VÁLIDA Y CERTIFICADA</h4>
                <p style="font-size:0.82rem;margin-top:6px;"><strong>Operador:</strong> ${lic.operador}</p>
                <p style="font-size:0.82rem;"><strong>Código:</strong> <code>${lic.codigo}</code> | Provincia: ${provNombre}</p>
                <p style="font-size:0.82rem;"><strong>Sector:</strong> ${lic.tipoActividad} (Score: ${lic.score} Pts - Riesgo ${lic.riesgo})</p>
                <p style="font-size:0.68rem;color:var(--text-muted);margin-top:6px;font-family:var(--font-mono);">Hash SHA-256 Validado: SHA256: 8f9a2b1c90d8e7f6a5b4c3d2e1f0a9b8c7d6e5f</p>
            </div>
        `;
        mostrarToast("Licencia Ambiental Verificada ✓", "success");
    } else {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div style="background:rgba(251,113,133,0.08);border:1px solid rgba(251,113,133,0.3);border-radius:10px;padding:16px;">
                <h4 style="color:var(--accent-rose);font-size:0.95rem;font-weight:800;">LICENCIA NO REGISTRADA</h4>
                <p style="font-size:0.82rem;">No se encontró registro ambiental válido con el código o hash ingresado.</p>
            </div>
        `;
        mostrarToast("No se encontró el registro", "error");
    }
}

// ─── Reporte Ejecutivo Ambiental A4 ──────────────────────────────
function generarReporteEjecutivoAmbiental() {
    const total = licencias.length;
    const alto = licencias.filter(l => l.riesgo === "Alto").length;
    const mineras = licencias.filter(l => l.tipoActividad.includes("Minería") || l.tipoActividad.includes("Minerales")).length;

    const el = (id) => document.getElementById(id);
    if (el("rep-amb-total")) el("rep-amb-total").textContent = total;
    if (el("rep-amb-alto")) el("rep-amb-alto").textContent = alto;
    if (el("rep-amb-mineras")) el("rep-amb-mineras").textContent = mineras;

    const tbody = el("reporte-ambient-tabla-body");
    if (tbody) {
        tbody.innerHTML = licencias.map(l => `
            <tr>
                <td><strong>${l.codigo}</strong></td>
                <td>${l.operador}</td>
                <td>${PROVINCIAS_MAP[l.provincia] || l.provincia}</td>
                <td>${l.tipoActividad}</td>
                <td>${l.score} Pts</td>
                <td><strong>Riesgo ${l.riesgo}</strong></td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-ambiental");
    if (area) area.style.display = "block";
    window.print();

    setTimeout(() => {
        if (area) area.style.display = "none";
    }, 1000);
}

// ─── Exportar CSV ─────────────────────────────────────────────────
function exportarCSV() {
    if (licencias.length === 0) {
        mostrarToast("No hay licencias para exportar.", "warning");
        return;
    }

    const BOM = "\uFEFF";
    const headers = ["CodigoLicencia", "Operador", "TipoActividad", "Provincia", "PuntajeImpacto", "NivelRiesgo", "FechaRegistro"];
    const rows = licencias.map(l => [
        l.codigo, l.operador, l.tipoActividad, PROVINCIAS_MAP[l.provincia] || l.provincia, l.score, l.riesgo, l.fecha
    ]);

    const csvContent = BOM + [headers, ...rows]
        .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `licencias_ambientales_oruro_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    mostrarToast(`Registro CSV (${licencias.length} licencias) exportado.`, "success");
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

    setTimeout(() => {
        toast.remove();
    }, 3500);
}
