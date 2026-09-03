// ════════════════════════════════════════════════════════════════
// SISREMIN — LIQUIDACIÓN DE REGALÍAS MINERAS (LEY N° 535)
// Dirección de Minería y Metalurgia · Gobernación de Oruro
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

let liquidaciones = [];
const ALICUOTAS = { Sn: 0.05, Ag: 0.06, Zn: 0.05, Pb: 0.05, Au: 0.07, Cu: 0.05 };
const NOMBRES_MINERAL = {
    Sn: "Estaño (Sn)", Ag: "Plata (Ag)", Zn: "Zinc (Zn)",
    Pb: "Plomo (Pb)", Au: "Oro (Au)", Cu: "Cobre (Cu)"
};

document.addEventListener("DOMContentLoaded", () => {
    inicializarLiquidaciones();
    iniciarRelojVivo();
    actualizarCalculosMetalurgicos();
    renderTabla();
    actualizarKPIs();
});

function iniciarRelojVivo() {
    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");

        const el = document.getElementById("clock-time");
        if (el) el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

function inicializarLiquidaciones() {
    const local = localStorage.getItem("oruro_regalias_mineras_v2");
    if (local) {
        liquidaciones = JSON.parse(local);
    } else {
        liquidaciones = [
            {
                id: "SISREMIN-2026-0001",
                empresa: "Cooperativa Minera Huanuni R.L.",
                mineralKey: "Sn",
                mineral: "Estaño (Sn)",
                municipio: "Huanuni",
                pesoHumedo: 10000.0,
                humedad: 3.5,
                ley: 48.5,
                cotizacionLME: 14.50,
                pesoFino: 4679.75,
                valorBruto: 472120.00,
                regaliaTotal: 23606.00,
                gob85: 20065.10,
                mun15: 3540.90,
                fecha: "12 Ene 2026 - 10:30"
            },
            {
                id: "SISREMIN-2026-0002",
                empresa: "Empresa Minera Colquiri - Mina Poopó",
                mineralKey: "Zn",
                mineral: "Zinc (Zn)",
                municipio: "Poopó",
                pesoHumedo: 25000.0,
                humedad: 4.0,
                ley: 52.0,
                cotizacionLME: 1.25,
                pesoFino: 12480.00,
                valorBruto: 108576.00,
                regaliaTotal: 5428.80,
                gob85: 4614.48,
                mun15: 814.32,
                fecha: "18 Feb 2026 - 11:45"
            },
            {
                id: "SISREMIN-2026-0003",
                empresa: "Compañía Minera Tiwanaku S.A.",
                mineralKey: "Ag",
                mineral: "Plata (Ag)",
                municipio: "Antequera",
                pesoHumedo: 8000.0,
                humedad: 2.0,
                ley: 65.0,
                cotizacionLME: 28.50,
                pesoFino: 5096.00,
                valorBruto: 1010026.80,
                regaliaTotal: 60601.61,
                gob85: 51511.37,
                mun15: 9090.24,
                fecha: "05 Mar 2026 - 15:20"
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_regalias_mineras_v2", JSON.stringify(liquidaciones));
}

function calcularMetalurgia(pesoHumedo, humedad, ley, cotizacion, mineralKey) {
    const pesoSeco = pesoHumedo * (1 - (humedad / 100));
    const pesoFino = pesoSeco * (ley / 100);
    const alicuota = ALICUOTAS[mineralKey] || 0.05;

    // Cotización LME en USD * 6.96 (Tipo de Cambio Oficial Bolivia)
    const valorBruto = pesoFino * cotizacion * 6.96;
    const regaliaTotal = valorBruto * alicuota;
    const gob85 = regaliaTotal * 0.85;
    const mun15 = regaliaTotal * 0.15;

    return { pesoSeco, pesoFino, alicuota, valorBruto, regaliaTotal, gob85, mun15 };
}

function actualizarCalculosMetalurgicos() {
    const pesoHumedo = parseFloat(document.getElementById("input-peso-humedo")?.value || 0);
    const humedad    = parseFloat(document.getElementById("input-humedad")?.value || 0);
    const ley        = parseFloat(document.getElementById("input-ley")?.value || 0);
    const cotizacion = parseFloat(document.getElementById("input-cotizacion")?.value || 0);
    const mineralKey = document.getElementById("select-mineral")?.value || "Sn";

    const m = calcularMetalurgia(pesoHumedo, humedad, ley, cotizacion, mineralKey);

    const el = (id) => document.getElementById(id);
    if (el("prev-peso-fino"))    el("prev-peso-fino").textContent    = `${m.pesoFino.toLocaleString('es-BO', {maximumFractionDigits: 2})} Kg`;
    if (el("prev-valor-bruto"))  el("prev-valor-bruto").textContent  = `Bs. ${m.valorBruto.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("prev-regalia-total"))el("prev-regalia-total").textContent= `Bs. ${m.regaliaTotal.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
}

function registrarLiquidacion(e) {
    e.preventDefault();

    const empresa    = document.getElementById("input-empresa").value.trim();
    const mineralKey = document.getElementById("select-mineral").value;
    const municipio  = document.getElementById("select-municipio").value;
    const pesoHumedo = parseFloat(document.getElementById("input-peso-humedo").value) || 0;
    const humedad    = parseFloat(document.getElementById("input-humedad").value) || 0;
    const ley        = parseFloat(document.getElementById("input-ley").value) || 0;
    const cotizacion = parseFloat(document.getElementById("input-cotizacion").value) || 0;

    const m = calcularMetalurgia(pesoHumedo, humedad, ley, cotizacion, mineralKey);

    const num = String(liquidaciones.length + 1).padStart(4, "0");
    const id = `SISREMIN-2026-${num}`;
    const fecha = new Date().toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' }) + " - " + new Date().toLocaleTimeString('es-BO', {hour:'2-digit', minute:'2-digit'});

    const nueva = {
        id, empresa, mineralKey, mineral: NOMBRES_MINERAL[mineralKey], municipio,
        pesoHumedo, humedad, ley, cotizacionLME: cotizacion,
        pesoFino: m.pesoFino, valorBruto: m.valorBruto, regaliaTotal: m.regaliaTotal,
        gob85: m.gob85, mun15: m.mun15, fecha
    };

    liquidaciones.unshift(nueva);
    guardarLocal();

    document.getElementById("form-liquidacion").reset();
    actualizarCalculosMetalurgicos();
    renderTabla();
    actualizarKPIs();
    mostrarToast(`Boleta ${id} emitida. Regalía: Bs. ${m.regaliaTotal.toLocaleString('es-BO', {minimumFractionDigits:2})}`, "success");
    setTimeout(() => abrirFichaRegalia(id), 300);
}

function eliminarLiquidacion(id) {
    if (confirm(`¿Eliminar la liquidación ${id}?`)) {
        liquidaciones = liquidaciones.filter(l => l.id !== id);
        guardarLocal();
        renderTabla();
        actualizarKPIs();
        mostrarToast(`Liquidación ${id} eliminada.`, "warning");
    }
}

function renderTabla() {
    const tbody = document.getElementById("tabla-liquidaciones-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    liquidaciones.forEach(l => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--primary-light);">${l.id}</strong>
            </td>
            <td>
                <div style="font-weight:700;color:var(--text-main);">${l.empresa}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);">Municipio: ${l.municipio}</div>
            </td>
            <td>
                <span style="font-size:0.8rem;font-weight:700;color:var(--accent-cyan);">${l.mineral}</span>
            </td>
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--accent-emerald);">Bs. ${Number(l.regaliaTotal).toLocaleString('es-BO', {minimumFractionDigits:2})}</strong>
            </td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button class="btn-ficha" onclick="abrirFichaRegalia('${l.id}')" title="Ver Boleta A4 SAFCO">
                        Boleta A4
                    </button>
                    <button class="btn-delete" onclick="eliminarLiquidacion('${l.id}')">
                        ✕
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function actualizarKPIs() {
    const totalRecaudacion = liquidaciones.reduce((sum, l) => sum + Number(l.regaliaTotal || 0), 0);
    const totalGob = liquidaciones.reduce((sum, l) => sum + Number(l.gob85 || 0), 0);
    const totalMun = liquidaciones.reduce((sum, l) => sum + Number(l.mun15 || 0), 0);

    const el = (id) => document.getElementById(id);
    if (el("kpi-total-recaudacion")) el("kpi-total-recaudacion").textContent = `Bs. ${totalRecaudacion.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("kpi-total-gobernacion"))  el("kpi-total-gobernacion").textContent  = `Bs. ${totalGob.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("kpi-total-municipios"))   el("kpi-total-municipios").textContent   = `Bs. ${totalMun.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
}

// ─── Modal A4 & Reporte ───────────────────────────────────────────
function abrirFichaRegalia(id) {
    const l = liquidaciones.find(item => item.id === id);
    if (!l) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("ficha-regalia-subtitle"))   el("ficha-regalia-subtitle").textContent   = `${l.id} · ${l.empresa}`;
    if (el("ficha-regalia-codigo"))     el("ficha-regalia-codigo").textContent     = `BOLETA DE LIQUIDACIÓN DE REGALÍA MINERA N° ${l.id}`;
    if (el("ficha-regalia-fecha"))      el("ficha-regalia-fecha").textContent      = l.fecha;
    if (el("ficha-regalia-num"))        el("ficha-regalia-num").textContent        = l.id;
    if (el("ficha-regalia-empresa"))    el("ficha-regalia-empresa").textContent    = l.empresa;
    if (el("ficha-regalia-mineral"))    el("ficha-regalia-mineral").textContent    = l.mineral;
    if (el("ficha-regalia-municipio"))  el("ficha-regalia-municipio").textContent  = l.municipio;
    if (el("ficha-regalia-peso-fino"))  el("ficha-regalia-peso-fino").textContent  = `${Number(l.pesoFino).toLocaleString('es-BO', {maximumFractionDigits: 2})} Kg`;
    if (el("ficha-regalia-ley"))        el("ficha-regalia-ley").textContent        = `${l.ley}%`;
    if (el("ficha-regalia-valor-bruto"))el("ficha-regalia-valor-bruto").textContent= `Bs. ${Number(l.valorBruto).toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("ficha-regalia-lme"))        el("ficha-regalia-lme").textContent        = `USD ${l.cotizacionLME}`;
    if (el("ficha-regalia-total"))      el("ficha-regalia-total").textContent      = `Bs. ${Number(l.regaliaTotal).toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("ficha-regalia-85"))         el("ficha-regalia-85").textContent         = `Bs. ${Number(l.gob85).toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("ficha-regalia-15"))         el("ficha-regalia-15").textContent         = `Bs. ${Number(l.mun15).toLocaleString('es-BO', {minimumFractionDigits: 2})}`;

    document.getElementById("modal-ficha-regalia").classList.add("open");
}

function cerrarFichaRegalia() {
    document.getElementById("modal-ficha-regalia").classList.remove("open");
}

function imprimirFichaRegalia() {
    window.print();
}

function generarReporteEjecutivoRegalias() {
    const totalRecaudacion = liquidaciones.reduce((sum, l) => sum + Number(l.regaliaTotal || 0), 0);
    const totalGob = liquidaciones.reduce((sum, l) => sum + Number(l.gob85 || 0), 0);
    const totalMun = liquidaciones.reduce((sum, l) => sum + Number(l.mun15 || 0), 0);

    const el = (elementId) => document.getElementById(elementId);
    if (el("rep-regalia-total")) el("rep-regalia-total").textContent = `Bs. ${totalRecaudacion.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("rep-regalia-85"))    el("rep-regalia-85").textContent    = `Bs. ${totalGob.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    if (el("rep-regalia-15"))    el("rep-regalia-15").textContent    = `Bs. ${totalMun.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;

    const tbody = el("reporte-regalias-tabla-body");
    if (tbody) {
        tbody.innerHTML = liquidaciones.map(l => `
            <tr>
                <td><strong>${l.id}</strong></td>
                <td>${l.empresa}</td>
                <td>${l.mineral}</td>
                <td>${l.municipio}</td>
                <td>Bs. ${Number(l.valorBruto).toLocaleString('es-BO', {minimumFractionDigits:2})}</td>
                <td><strong>Bs. ${Number(l.regaliaTotal).toLocaleString('es-BO', {minimumFractionDigits:2})}</strong></td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-regalias");
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
