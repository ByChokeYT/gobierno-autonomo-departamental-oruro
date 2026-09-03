// ════════════════════════════════════════════════════════════════
// PANEL DE CONTROL DEMOGRÁFICO — CENSO NACIONAL 2024
// Unidad de Estadística · Gobernación Autónoma Departamental de Oruro
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

const PROVINCIAS_ORURO = [
    { provincia: "Cercado", capital: "Oruro", poblacion: 310000, hombres: 152000, mujeres: 158000, viviendas: 95000, densidad: "Alta (54.5 Hab/km²)" },
    { provincia: "Eduardo Abaroa", capital: "Challapata", poblacion: 33200, hombres: 16400, mujeres: 16800, viviendas: 11200, densidad: "Media (8.8 Hab/km²)" },
    { provincia: "Pantaleón Dalence", capital: "Huanuni", poblacion: 29400, hombres: 14800, mujeres: 14600, viviendas: 9800, densidad: "Alta (30.6 Hab/km²)" },
    { provincia: "Poopó", capital: "Poopó", poblacion: 16800, hombres: 8300, mujeres: 8500, viviendas: 5600, densidad: "Media (8.4 Hab/km²)" },
    { provincia: "Ladislao Cabrera", capital: "Salinas de Garci Mendoza", poblacion: 14800, hombres: 7500, mujeres: 7300, viviendas: 5100, densidad: "Baja (1.7 Hab/km²)" },
    { provincia: "Sebastián Pagador", capital: "Santiago de Huari", poblacion: 13894, hombres: 6900, mujeres: 6994, viviendas: 4800, densidad: "Media (7.2 Hab/km²)" },
    { provincia: "Carangas", capital: "Corque", poblacion: 13500, hombres: 6800, mujeres: 6700, viviendas: 4900, densidad: "Baja (2.7 Hab/km²)" },
    { provincia: "Sabaya", capital: "Sabaya", poblacion: 11400, hombres: 5800, mujeres: 5600, viviendas: 3900, densidad: "Baja (1.3 Hab/km²)" },
    { provincia: "Saucarí", capital: "Toledo", poblacion: 10800, hombres: 5500, mujeres: 5300, viviendas: 3700, densidad: "Baja (6.5 Hab/km²)" },
    { provincia: "Litoral", capital: "Huachacalla", poblacion: 10400, hombres: 5300, mujeres: 5100, viviendas: 3500, densidad: "Baja (3.6 Hab/km²)" },
    { provincia: "Sajama", capital: "Curahuara de Carangas", poblacion: 10200, hombres: 5200, mujeres: 5000, viviendas: 3400, densidad: "Baja (1.8 Hab/km²)" },
    { provincia: "Sud Carangas", capital: "Andamarca", poblacion: 7200, hombres: 3700, mujeres: 3500, viviendas: 2600, densidad: "Baja (2.0 Hab/km²)" },
    { provincia: "Nor Carangas", capital: "Huayllamarca", poblacion: 5600, hombres: 2800, mujeres: 2800, viviendas: 2100, densidad: "Baja (6.4 Hab/km²)" },
    { provincia: "San Pedro de Totora", capital: "Totora", poblacion: 5500, hombres: 2800, mujeres: 2700, viviendas: 2000, densidad: "Baja (3.8 Hab/km²)" },
    { provincia: "Tomas Barrón", capital: "Eucaliptus", poblacion: 5400, hombres: 2700, mujeres: 2700, viviendas: 1900, densidad: "Media (15.1 Hab/km²)" },
    { provincia: "Puerto de Mejillones", capital: "La Rivera", poblacion: 2100, hombres: 1100, mujeres: 1000, viviendas: 920, densidad: "Baja (2.7 Hab/km²)" }
];

let provinciasFiltradas = [...PROVINCIAS_ORURO];

document.addEventListener("DOMContentLoaded", () => {
    iniciarRelojVivo();
    renderTabla();
    actualizarKPIs();
});

function iniciarRelojVivo() {
    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");

        const el = document.getElementById("demo-clock-time");
        if (el) el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

function filtrarProvinciaTexto() {
    const query = (document.getElementById("input-buscar-provincia")?.value || "").toLowerCase().trim();
    provinciasFiltradas = PROVINCIAS_ORURO.filter(p => {
        return !query || p.provincia.toLowerCase().includes(query) || p.capital.toLowerCase().includes(query);
    });
    renderTabla();
}

function filtrarTablaDemografica(tipo) {
    provinciasFiltradas = [...PROVINCIAS_ORURO];
    renderTabla();
}

function renderTabla() {
    const tbody = document.getElementById("cuerpo-tabla-stats");
    if (!tbody) return;
    tbody.innerHTML = "";

    provinciasFiltradas.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong style="font-weight:800;color:var(--text-main);">${p.provincia}</strong>
                <div style="font-size:0.68rem;color:var(--text-muted);">Capital: ${p.capital}</div>
            </td>
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--primary-light);">${p.poblacion.toLocaleString()} Hab.</strong>
            </td>
            <td>
                <span style="font-size:0.8rem;color:var(--text-secondary);">${p.hombres.toLocaleString()}</span>
            </td>
            <td>
                <span style="font-size:0.8rem;color:var(--text-secondary);">${p.mujeres.toLocaleString()}</span>
            </td>
            <td>
                <span style="font-size:0.8rem;font-family:'JetBrains Mono',monospace;color:var(--accent-gold);">${p.viviendas.toLocaleString()}</span>
            </td>
            <td>
                <span style="font-size:0.72rem;font-weight:800;padding:3px 8px;border-radius:999px;background:${p.densidad.includes('Alta') ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)'};color:${p.densidad.includes('Alta') ? 'var(--primary-light)' : 'var(--text-secondary)'};">${p.densidad}</span>
            </td>
            <td>
                <button class="btn-ficha" onclick="abrirFichaDemo('${p.provincia}')" title="Ver Ficha Estadistica A4">
                    Ficha A4
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function actualizarKPIs() {
    const totalPoblacion = PROVINCIAS_ORURO.reduce((sum, p) => sum + p.poblacion, 0);
    const totalViviendas = PROVINCIAS_ORURO.reduce((sum, p) => sum + p.viviendas, 0);
    const totalHombres   = PROVINCIAS_ORURO.reduce((sum, p) => sum + p.hombres, 0);
    const totalMujeres   = PROVINCIAS_ORURO.reduce((sum, p) => sum + p.mujeres, 0);

    const ratioHombres = Math.round((totalHombres / totalMujeres) * 1000) / 10;

    const el = (id) => document.getElementById(id);
    if (el("kpi-poblacion-total")) el("kpi-poblacion-total").textContent = `${totalPoblacion.toLocaleString()} Hab.`;
    if (el("kpi-viviendas-total")) el("kpi-viviendas-total").textContent = `${totalViviendas.toLocaleString()} Viv.`;
    if (el("kpi-ratio-hombres"))   el("kpi-ratio-hombres").textContent   = `${ratioHombres} %`;
}

// ─── Modal A4 & Reporte ───────────────────────────────────────────
function abrirFichaDemo(nombreProvincia) {
    const p = PROVINCIAS_ORURO.find(item => item.provincia === nombreProvincia);
    if (!p) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("ficha-demo-subtitle"))  el("ficha-demo-subtitle").textContent  = `Provincia ${p.provincia} · Capital ${p.capital}`;
    if (el("ficha-demo-provincia")) el("ficha-demo-provincia").textContent = `${p.provincia} (${p.capital})`;
    if (el("ficha-demo-poblacion")) el("ficha-demo-poblacion").textContent = `${p.poblacion.toLocaleString()} Hab.`;
    if (el("ficha-demo-hombres"))   el("ficha-demo-hombres").textContent   = p.hombres.toLocaleString();
    if (el("ficha-demo-mujeres"))   el("ficha-demo-mujeres").textContent   = p.mujeres.toLocaleString();
    if (el("ficha-demo-viviendas")) el("ficha-demo-viviendas").textContent = `${p.viviendas.toLocaleString()} Viv.`;
    if (el("ficha-demo-densidad"))  el("ficha-demo-densidad").textContent  = p.densidad;

    document.getElementById("modal-ficha-demo").classList.add("open");
}

function cerrarFichaDemo() {
    document.getElementById("modal-ficha-demo").classList.remove("open");
}

function imprimirFichaDemo() {
    window.print();
}

function generarReporteEjecutivoDemografico() {
    const el = (elementId) => document.getElementById(elementId);
    const tbody = el("reporte-demo-tabla-body");
    if (tbody) {
        tbody.innerHTML = PROVINCIAS_ORURO.map(p => `
            <tr>
                <td><strong>${p.provincia}</strong></td>
                <td>${p.capital}</td>
                <td><strong>${p.poblacion.toLocaleString()} Hab.</strong></td>
                <td>${p.hombres.toLocaleString()}</td>
                <td>${p.mujeres.toLocaleString()}</td>
                <td>${p.viviendas.toLocaleString()}</td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-demografico");
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