// ════════════════════════════════════════════════════════════════
// CONTROL DE OBRAS VIALES (EVM) — GOBERNACIÓN DE ORURO
// Valor Ganado (ANSI/EIA 748) · SEDECA & Obras Públicas
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

let obras = [];
let obrasFiltradas = [];

document.addEventListener("DOMContentLoaded", () => {
    inicializarObras();
    iniciarRelojVivo();
    filtrarObras();
});

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
            clockDate.textContent = `${dia} ${ahora.getDate()} ${MESES[ahora.getMonth()]} ${ahora.getFullYear()}`;
        }
    };
    tick();
    setInterval(tick, 1000);
}

function inicializarObras() {
    const local = localStorage.getItem("oruro_obras_evm_v2");
    if (local) {
        obras = JSON.parse(local);
    } else {
        obras = [
            {
                id: "SEDECA-2026-0001",
                nombre: "Asfaltado Tramo Oruro - Huanuni (Fase II)",
                provincia: "Pantaleón Dalence",
                empresa: "Consorcio Altiplano / SEDECA",
                bac: 18500000.00,
                ac: 9200000.00,
                planificadoPct: 50.0,
                realPct: 52.5,
                fecha: "10 Ene 2026"
            },
            {
                id: "SEDECA-2026-0002",
                nombre: "Construcción Puente Vehicular Challapata",
                provincia: "Eduardo Abaroa",
                empresa: "Constructora San Cristóbal",
                bac: 7800000.00,
                ac: 4100000.00,
                planificadoPct: 55.0,
                realPct: 51.0,
                fecha: "18 Feb 2026"
            },
            {
                id: "SEDECA-2026-0003",
                nombre: "Mejoramiento Carretero Poopó - Antequera",
                provincia: "Poopó",
                empresa: "Asfaltos del Sur S.R.L.",
                bac: 12400000.00,
                ac: 6500000.00,
                planificadoPct: 50.0,
                realPct: 50.0,
                fecha: "05 Mar 2026"
            },
            {
                id: "SEDECA-2026-0004",
                nombre: "Pavimentado Riego Accesos Parque Sajama",
                provincia: "Sajama",
                empresa: "SEDECA Oruro (Directa)",
                bac: 9500000.00,
                ac: 3800000.00,
                planificadoPct: 40.0,
                realPct: 44.0,
                fecha: "12 May 2026"
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_obras_evm_v2", JSON.stringify(obras));
}

function calcularEVM(obra) {
    const bac = Number(obra.bac || 0);
    const ac = Number(obra.ac || 0);
    const pv = bac * (Number(obra.planificadoPct || 0) / 100);
    const ev = bac * (Number(obra.realPct || 0) / 100);

    const spi = pv > 0 ? (ev / pv) : 1.0;
    const cpi = ac > 0 ? (ev / ac) : 1.0;
    const cv = ev - ac;
    const sv = ev - pv;
    const eac = cpi > 0 ? (bac / cpi) : bac;

    let estadoKey = "optimo";
    let estadoLabel = "Excelente (En Plazo & Costo)";

    if (spi < 0.95 || cpi < 0.95) {
        estadoKey = "critico";
        estadoLabel = "Desviación Crítica";
    } else if (spi < 1.0 || cpi < 1.0) {
        estadoKey = "alerta";
        estadoLabel = "Alerta Menor";
    }

    return { bac, ac, pv, ev, spi, cpi, cv, sv, eac, estadoKey, estadoLabel };
}

function switchTab(tabName) {
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));

    const pane = document.getElementById(`tab-${tabName}`);
    const navBtn = document.getElementById(`nav-${tabName}`);
    if (pane) pane.classList.add("active");
    if (navBtn) navBtn.classList.add("active");

    const titles = {
        dashboard: "Monitoreo Financiero y Físico de Proyectos Viales",
        registro:  "Registrar Nuevo Proyecto Vial"
    };

    const pageTitle = document.getElementById("page-title");
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    filtrarObras();
}

function filtrarObras() {
    const query = (document.getElementById("input-buscar-obra")?.value ?? "").toLowerCase().trim();
    const provincia = document.getElementById("filtro-provincia-obra")?.value ?? "";
    const estadoEvm = document.getElementById("filtro-estado-evm")?.value ?? "";

    obrasFiltradas = obras.filter(o => {
        const evm = calcularEVM(o);
        const q = !query || o.nombre.toLowerCase().includes(query) || o.provincia.toLowerCase().includes(query) || o.empresa.toLowerCase().includes(query);
        const p = !provincia || o.provincia === provincia;
        const e = !estadoEvm || evm.estadoKey === estadoEvm;
        return q && p && e;
    });

    renderTabla();
    actualizarKPIs();

    const badge = document.getElementById("filter-result-badge-obras");
    if (badge) badge.textContent = `${obrasFiltradas.length} obra${obrasFiltradas.length !== 1 ? 's' : ''}`;
}

function actualizarKPIs() {
    const bacTotal = obras.reduce((sum, o) => sum + Number(o.bac || 0), 0);
    const evms = obras.map(calcularEVM);
    const spiProm = evms.length > 0 ? (evms.reduce((s, e) => s + e.spi, 0) / evms.length) : 1.0;
    const cpiProm = evms.length > 0 ? (evms.reduce((s, e) => s + e.cpi, 0) / evms.length) : 1.0;

    const el = (id) => document.getElementById(id);
    if (el("stat-presupuesto"))  el("stat-presupuesto").textContent  = `Bs ${bacTotal.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("stat-spi-promedio")) el("stat-spi-promedio").textContent = spiProm.toFixed(2);
    if (el("stat-cpi-promedio")) el("stat-cpi-promedio").textContent = cpiProm.toFixed(2);
    if (el("nav-count"))         el("nav-count").textContent         = obras.length;
}

function renderTabla() {
    const tbody = document.getElementById("tabla-proyectos");
    const emptyState = document.getElementById("estado-vacio");
    tbody.innerHTML = "";

    if (obrasFiltradas.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    obrasFiltradas.forEach(o => {
        const evm = calcularEVM(o);
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <div style="font-weight:700;color:var(--text-main);">${o.nombre}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);margin-top:2px;">Provincia: ${o.provincia} | ${o.empresa}</div>
            </td>
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--primary-light);">Bs. ${evm.bac.toLocaleString('es-BO', {minimumFractionDigits:2})}</strong>
            </td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;color:var(--text-secondary);">Bs. ${evm.ac.toLocaleString('es-BO', {minimumFractionDigits:2})}</span>
            </td>
            <td>
                <div style="font-size:0.75rem;font-weight:700;color:var(--text-main);">Real: ${o.realPct}% (Plan: ${o.planificadoPct}%)</div>
                <div class="progress-bar-wrap">
                    <div class="progress-bar-fill" style="width:${Math.min(o.realPct, 100)}%;"></div>
                </div>
            </td>
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:${evm.spi >= 1.0 ? 'var(--accent-cyan)' : 'var(--accent-rose)'};">${evm.spi.toFixed(2)}</strong>
            </td>
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:${evm.cpi >= 1.0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">${evm.cpi.toFixed(2)}</strong>
            </td>
            <td>
                <span class="badge-evm ${evm.estadoKey}">${evm.estadoLabel}</span>
            </td>
            <td>
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="btn-ficha" onclick="abrirFichaObra('${o.id}')" title="Ver Certificado A4">
                        Ficha A4
                    </button>
                    <button class="btn-timeline" onclick="abrirTimelineObra('${o.id}')" title="Ver línea de tiempo">
                        Hitos
                    </button>
                    <button class="btn-calc" onclick="abrirCalculadoraConDatos('${o.id}')" title="Simular EVM">
                        Simular
                    </button>
                    <button class="btn-delete" onclick="eliminarObra('${o.id}')">
                        ✕
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function registrarNuevaObra(e) {
    e.preventDefault();
    const nombre = document.getElementById("obra-nombre").value.trim();
    const provincia = document.getElementById("obra-provincia").value;
    const empresa = document.getElementById("obra-empresa").value.trim();
    const bac = parseFloat(document.getElementById("obra-bac").value) || 0;
    const ac = parseFloat(document.getElementById("obra-ac").value) || 0;
    const planificadoPct = parseFloat(document.getElementById("obra-planificado").value) || 0;
    const realPct = parseFloat(document.getElementById("obra-real").value) || 0;

    const num = String(obras.length + 1).padStart(4, "0");
    const id = `SEDECA-2026-${num}`;

    const nueva = {
        id, nombre, provincia, empresa, bac, ac, planificadoPct, realPct,
        fecha: new Date().toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' })
    };

    obras.unshift(nueva);
    guardarLocal();

    document.getElementById("form-obra").reset();
    mostrarToast(`Obra ${id} incorporada a fiscalización EVM.`, "success");
    switchTab('dashboard');
    setTimeout(() => abrirFichaObra(id), 300);
}

function eliminarObra(id) {
    const o = obras.find(item => item.id === id);
    if (!o) return;
    if (confirm(`¿Eliminar la obra ${id} ("${o.nombre}")?`)) {
        obras = obras.filter(item => item.id !== id);
        guardarLocal();
        filtrarObras();
        mostrarToast(`Obra ${id} eliminada.`, "warning");
    }
}

// ─── Modales A4 & Hitos ───────────────────────────────────────────
function abrirFichaObra(id) {
    const o = obras.find(item => item.id === id);
    if (!o) return;
    const evm = calcularEVM(o);

    const el = (elementId) => document.getElementById(elementId);
    if (el("ficha-obra-subtitle")) el("ficha-obra-subtitle").textContent = `${o.id} · ${o.nombre}`;
    if (el("ficha-obra-codigo"))   el("ficha-obra-codigo").textContent   = `CERTIFICADO DE AVANCE VIAL EVM N° ${o.id}`;
    if (el("ficha-obra-fecha"))    el("ficha-obra-fecha").textContent    = o.fecha;
    if (el("ficha-obra-nombre"))   el("ficha-obra-nombre").textContent   = o.nombre;
    if (el("ficha-obra-provincia"))el("ficha-obra-provincia").textContent= o.provincia;
    if (el("ficha-obra-empresa"))  el("ficha-obra-empresa").textContent  = o.empresa;
    if (el("ficha-obra-bac"))      el("ficha-obra-bac").textContent      = `Bs. ${evm.bac.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("ficha-obra-ac"))       el("ficha-obra-ac").textContent       = `Bs. ${evm.ac.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("ficha-obra-spi"))      el("ficha-obra-spi").textContent      = evm.spi.toFixed(2);
    if (el("ficha-obra-cpi"))      el("ficha-obra-cpi").textContent      = evm.cpi.toFixed(2);
    if (el("ficha-obra-eac"))      el("ficha-obra-eac").textContent      = `Bs. ${evm.eac.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("ficha-obra-dictamen")) el("ficha-obra-dictamen").textContent = evm.estadoLabel;

    document.getElementById("modal-ficha-obra").classList.add("open");
}

function cerrarFichaObra() {
    document.getElementById("modal-ficha-obra").classList.remove("open");
}

function imprimirFichaObra() {
    window.print();
}

function abrirTimelineObra(id) {
    const o = obras.find(item => item.id === id);
    if (!o) return;
    const evm = calcularEVM(o);

    const el = (elementId) => document.getElementById(elementId);
    if (el("timeline-obra-subtitle")) el("timeline-obra-subtitle").textContent = `${o.id} · ${o.nombre}`;

    const content = `
        <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:16px;border-radius:12px;margin-bottom:20px;">
            <h4 style="font-size:0.95rem;color:var(--text-main);">${o.nombre}</h4>
            <p style="font-size:0.78rem;color:var(--text-secondary);">Provincia: <strong>${o.provincia}</strong> | Empresa: <strong>${o.empresa}</strong></p>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);padding:14px;border-radius:10px;">
                <h5 style="color:var(--primary-light);font-size:0.88rem;">1. Licitación y Orden de Proceder</h5>
                <p style="font-size:0.76rem;color:var(--text-secondary);">Firma de contrato de ejecución con presupuesto asignado de <strong>Bs. ${evm.bac.toLocaleString('es-BO')}</strong>.</p>
                <small style="font-size:0.65rem;color:var(--text-muted);">${o.fecha}</small>
            </div>
            <div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);padding:14px;border-radius:10px;">
                <h5 style="color:var(--accent-cyan);font-size:0.88rem;">2. Medición e Inspección Físico-Financiera (EVM)</h5>
                <p style="font-size:0.76rem;color:var(--text-secondary);">Avance Planificado PV: <strong>${o.planificadoPct}%</strong> vs. Avance Real Ganado EV: <strong>${o.realPct}%</strong>.</p>
            </div>
            <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.25);padding:14px;border-radius:10px;">
                <h5 style="color:var(--accent-emerald);font-size:0.88rem;">3. Emisión de Planilla de Avance N° 1</h5>
                <p style="font-size:0.76rem;color:var(--text-secondary);">Certificación de costo real invertido (AC) de <strong>Bs. ${evm.ac.toLocaleString('es-BO')}</strong> con SPI=${evm.spi.toFixed(2)} y CPI=${evm.cpi.toFixed(2)}.</p>
            </div>
        </div>
    `;

    document.getElementById("timeline-obra-body").innerHTML = content;
    document.getElementById("modal-timeline-obra").classList.add("open");
}

function cerrarTimelineObra() {
    document.getElementById("modal-timeline-obra").classList.remove("open");
}

// ─── Calculadora EVM ──────────────────────────────────────────────
function abrirCalculadoraEVMDirecta() {
    document.getElementById("modal-calc-evm").classList.add("open");
    simularEVM();
}

function abrirCalculadoraConDatos(id) {
    const o = obras.find(item => item.id === id);
    if (!o) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("calc-bac")) el("calc-bac").value = o.bac;
    if (el("calc-ac"))  el("calc-ac").value  = o.ac;
    if (el("calc-pv"))  el("calc-pv").value  = o.planificadoPct;
    if (el("calc-ev"))  el("calc-ev").value  = o.realPct;

    abrirCalculadoraEVMDirecta();
}

function cerrarCalculadoraEVMDirecta() {
    document.getElementById("modal-calc-evm").classList.remove("open");
}

function simularEVM() {
    const bac = parseFloat(document.getElementById("calc-bac")?.value || 0);
    const ac  = parseFloat(document.getElementById("calc-ac")?.value || 0);
    const pvPct = parseFloat(document.getElementById("calc-pv")?.value || 0);
    const evPct = parseFloat(document.getElementById("calc-ev")?.value || 0);

    const pv = bac * (pvPct / 100);
    const ev = bac * (evPct / 100);

    const spi = pv > 0 ? (ev / pv) : 1.0;
    const cpi = ac > 0 ? (ev / ac) : 1.0;
    const cv = ev - ac;
    const sv = ev - pv;
    const eac = cpi > 0 ? (bac / cpi) : bac;

    const box = document.getElementById("calc-evm-results-box");
    if (!box) return;

    box.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:center;">
            <div style="background:rgba(56,189,248,0.1);padding:10px;border-radius:8px;">
                <span style="font-size:0.7rem;color:var(--text-muted);">SPI (Cronograma)</span>
                <h3 style="color:${spi>=1?'var(--accent-cyan)':'var(--accent-rose)'};font-size:1.4rem;">${spi.toFixed(2)}</h3>
            </div>
            <div style="background:rgba(52,211,153,0.1);padding:10px;border-radius:8px;">
                <span style="font-size:0.7rem;color:var(--text-muted);">CPI (Costo)</span>
                <h3 style="color:${cpi>=1?'var(--accent-emerald)':'var(--accent-rose)'};font-size:1.4rem;">${cpi.toFixed(2)}</h3>
            </div>
        </div>
        <div style="margin-top:14px;font-size:0.8rem;color:var(--text-secondary);">
            <p><strong>Variación de Costo (CV):</strong> Bs. ${cv.toLocaleString('es-BO', {minimumFractionDigits:2})}</p>
            <p><strong>Variación de Cronograma (SV):</strong> Bs. ${sv.toLocaleString('es-BO', {minimumFractionDigits:2})}</p>
            <p style="margin-top:6px;color:var(--primary-light);"><strong>Estimado al Finalizar (EAC):</strong> Bs. ${eac.toLocaleString('es-BO', {minimumFractionDigits:2})}</p>
        </div>
    `;
}

// ─── Reporte Ejecutivo A4 ─────────────────────────────────────────
function generarReporteEjecutivoObras() {
    const bacTotal = obras.reduce((sum, o) => sum + Number(o.bac || 0), 0);
    const evms = obras.map(calcularEVM);
    const spiProm = evms.length > 0 ? (evms.reduce((s, e) => s + e.spi, 0) / evms.length) : 1.0;
    const cpiProm = evms.length > 0 ? (evms.reduce((s, e) => s + e.cpi, 0) / evms.length) : 1.0;

    const el = (elementId) => document.getElementById(elementId);
    if (el("rep-obra-bac")) el("rep-obra-bac").textContent = `Bs. ${bacTotal.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("rep-obra-spi")) el("rep-obra-spi").textContent = spiProm.toFixed(2);
    if (el("rep-obra-cpi")) el("rep-obra-cpi").textContent = cpiProm.toFixed(2);

    const tbody = el("reporte-obras-tabla-body");
    if (tbody) {
        tbody.innerHTML = obras.map(o => {
            const e = calcularEVM(o);
            return `
                <tr>
                    <td><strong>${o.nombre}</strong></td>
                    <td>${o.provincia}</td>
                    <td>Bs. ${e.bac.toLocaleString('es-BO', {minimumFractionDigits:2})}</td>
                    <td>Bs. ${e.ac.toLocaleString('es-BO', {minimumFractionDigits:2})}</td>
                    <td>${e.spi.toFixed(2)}</td>
                    <td>${e.cpi.toFixed(2)}</td>
                    <td><strong>${e.estadoLabel}</strong></td>
                </tr>
            `;
        }).join("");
    }

    const area = el("area-impresion-reporte-obras");
    if (area) area.style.display = "block";
    window.print();
    setTimeout(() => { if (area) area.style.display = "none"; }, 1000);
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
