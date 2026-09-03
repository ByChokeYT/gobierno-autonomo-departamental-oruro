// ════════════════════════════════════════════════════════════════
// CONTROL DE CARBURANTES Y SURTIDORES — GOBERNACIÓN DE ORURO
// ANH B-SISA · Ley N° 1178 (SAFCO)
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

let vales = [];
let valesFiltrados = [];
let tanques = {
    gasolina: { capacidad: 5000, actual: 3925, precio: 3.74 },
    diesel:   { capacidad: 5000, actual: 4200, precio: 3.72 }
};

document.addEventListener("DOMContentLoaded", () => {
    inicializarDatosCombustible();
    iniciarRelojVivo();
    actualizarTanquesUI();
    filtrarVales();
});

function iniciarRelojVivo() {
    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");

        const el = document.getElementById("fuel-clock-time");
        if (el) el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

function inicializarDatosCombustible() {
    const localVales = localStorage.getItem("oruro_vales_combustible_v2");
    if (localVales) {
        vales = JSON.parse(localVales);
    } else {
        vales = [
            {
                id: "VALE-2026-0001",
                vehiculo: "Camioneta Toyota Hilux 4x4 (4521-FDS)",
                unidad: "Servicio de Caminos (SEDECA)",
                conductor: "Marcos Mamani Choque",
                tipo: "Gasolina Especial",
                litros: 60.0,
                costo: 224.40,
                fecha: "02 Sep 2026 - 08:30"
            },
            {
                id: "VALE-2026-0002",
                vehiculo: "Volqueta Volvo FMX 460 6x4 (3812-KLP)",
                unidad: "Servicio de Caminos (SEDECA)",
                conductor: "Hernán Quispe Mamani",
                tipo: "Diésel Oíl",
                litros: 180.0,
                costo: 669.60,
                fecha: "02 Sep 2026 - 09:15"
            },
            {
                id: "VALE-2026-0003",
                vehiculo: "Vagoneta Nissan Patrol (2145-ORU)",
                unidad: "Secretaría General",
                conductor: "Roberto Gómez Colque",
                tipo: "Gasolina Especial",
                litros: 45.0,
                costo: 168.30,
                fecha: "02 Sep 2026 - 10:00"
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_vales_combustible_v2", JSON.stringify(vales));
}

function actualizarTanquesUI() {
    const pctGas = Math.round((tanques.gasolina.actual / tanques.gasolina.capacidad) * 1000) / 10;
    const pctDie = Math.round((tanques.diesel.actual / tanques.diesel.capacidad) * 1000) / 10;

    const el = (id) => document.getElementById(id);
    if (el("pct-badge-gasolina")) el("pct-badge-gasolina").textContent = `${pctGas}%`;
    if (el("val-gasolina-lts"))  el("val-gasolina-lts").textContent   = `${tanques.gasolina.actual.toLocaleString()} Lts`;
    if (el("wave-gasolina"))     el("wave-gasolina").style.height     = `${pctGas}%`;

    if (el("pct-badge-diesel"))   el("pct-badge-diesel").textContent   = `${pctDie}%`;
    if (el("val-diesel-lts"))    el("val-diesel-lts").textContent     = `${tanques.diesel.actual.toLocaleString()} Lts`;
    if (el("wave-diesel"))       el("wave-diesel").style.height       = `${pctDie}%`;
}

function recargarTanque(tipo) {
    const lts = prompt(`Ingrese volumen de recarga en litros para ${tipo}:`, "1000");
    if (!lts) return;
    const vol = parseFloat(lts);
    if (isNaN(vol) || vol <= 0) return;

    if (tipo === "Gasolina Especial") {
        tanques.gasolina.actual = Math.min(tanques.gasolina.capacidad, tanques.gasolina.actual + vol);
    } else {
        tanques.diesel.actual = Math.min(tanques.diesel.capacidad, tanques.diesel.actual + vol);
    }
    actualizarTanquesUI();
    mostrarToast(`Depósito de ${tipo} recargado (+${vol} Lts).`, "success");
}

function filtrarVales() {
    const query = (document.getElementById("input-buscar-vale")?.value ?? "").toLowerCase().trim();
    const tipo  = document.getElementById("filtro-combustible-tipo")?.value ?? "";

    valesFiltrados = vales.filter(v => {
        const q = !query || v.id.toLowerCase().includes(query) || v.vehiculo.toLowerCase().includes(query) || v.conductor.toLowerCase().includes(query) || v.unidad.toLowerCase().includes(query);
        const t = !tipo || v.tipo === tipo;
        return q && t;
    });

    renderTabla();
}

function renderTabla() {
    const tbody = document.getElementById("tabla-vales-body");
    const emptyState = document.getElementById("estado-vacio-combustible");
    tbody.innerHTML = "";

    if (valesFiltrados.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    valesFiltrados.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--accent-amber);">${v.id}</strong>
            </td>
            <td>
                <div style="font-weight:700;color:var(--text-main);">${v.vehiculo}</div>
            </td>
            <td>
                <span style="font-size:0.82rem;color:var(--text-secondary);">${v.unidad}</span>
            </td>
            <td>
                <span style="font-size:0.82rem;color:var(--text-secondary);">${v.conductor}</span>
            </td>
            <td>
                <span style="font-size:0.75rem;font-weight:700;color:${v.tipo === 'Gasolina Especial' ? 'var(--primary-light)' : 'var(--accent-amber)'};">${v.tipo}</span>
            </td>
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--primary-light);">${v.litros} Lts</strong>
            </td>
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--accent-emerald);">Bs. ${Number(v.costo).toLocaleString('es-BO', {minimumFractionDigits:2})}</strong>
            </td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button class="btn-ficha" onclick="abrirFichaVale('${v.id}')" title="Ver Vale A4">
                        Vale A4
                    </button>
                    <button class="btn-delete" onclick="eliminarVale('${v.id}')">
                        ✕
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalNuevoDespacho() {
    document.getElementById("modal-nuevo-despacho").classList.add("open");
    actualizarPrecioCalculado();
}

function cerrarModalNuevoDespacho() {
    document.getElementById("modal-nuevo-despacho").classList.remove("open");
}

function actualizarPrecioCalculado() {
    const tipo = document.getElementById("desp-tipo")?.value || "Gasolina Especial";
    const lts  = parseFloat(document.getElementById("desp-litros")?.value || 0);
    const precio = tipo === "Gasolina Especial" ? tanques.gasolina.precio : tanques.diesel.precio;
    const total  = lts * precio;

    const preview = document.getElementById("desp-costo-preview");
    if (preview) preview.textContent = `Bs. ${total.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
}

function registrarDespacho(e) {
    e.preventDefault();

    const vehiculo = document.getElementById("desp-vehiculo").value.trim();
    const unidad   = document.getElementById("desp-unidad").value;
    const conductor = document.getElementById("desp-conductor").value.trim();
    const tipo     = document.getElementById("desp-tipo").value;
    const litros   = parseFloat(document.getElementById("desp-litros").value) || 0;
    const precio   = tipo === "Gasolina Especial" ? tanques.gasolina.precio : tanques.diesel.precio;
    const costo    = litros * precio;

    if (tipo === "Gasolina Especial" && litros > tanques.gasolina.actual) {
        mostrarToast("Volumen insuficiente en el Tanque de Gasolina.", "warning");
        return;
    }
    if (tipo === "Diésel Oíl" && litros > tanques.diesel.actual) {
        mostrarToast("Volumen insuficiente en el Tanque de Diésel.", "warning");
        return;
    }

    if (tipo === "Gasolina Especial") tanques.gasolina.actual -= litros;
    else tanques.diesel.actual -= litros;

    actualizarTanquesUI();

    const num = String(vales.length + 1).padStart(4, "0");
    const id = `VALE-2026-${num}`;
    const fecha = new Date().toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' }) + " - " + new Date().toLocaleTimeString('es-BO', {hour:'2-digit', minute:'2-digit'});

    const nuevo = { id, vehiculo, unidad, conductor, tipo, litros, costo, fecha };
    vales.unshift(nuevo);
    guardarLocal();

    document.getElementById("form-despacho").reset();
    cerrarModalNuevoDespacho();
    mostrarToast(`Vale ${id} emitido. Se cargaron ${litros} Lts.`, "success");
    filtrarVales();
    setTimeout(() => abrirFichaVale(id), 300);
}

function eliminarVale(id) {
    if (confirm(`¿Eliminar el vale ${id}?`)) {
        vales = vales.filter(v => v.id !== id);
        guardarLocal();
        filtrarVales();
        mostrarToast(`Vale ${id} eliminado.`, "warning");
    }
}

// ─── Modal A4 & Reporte ───────────────────────────────────────────
function abrirFichaVale(id) {
    const v = vales.find(item => item.id === id);
    if (!v) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("ficha-vale-subtitle"))  el("ficha-vale-subtitle").textContent  = `${v.id} · ${v.vehiculo}`;
    if (el("ficha-vale-codigo"))    el("ficha-vale-codigo").textContent    = `VALE DE DESPACHO DE COMBUSTIBLE N° ${v.id}`;
    if (el("ficha-vale-fecha"))     el("ficha-vale-fecha").textContent     = v.fecha;
    if (el("ficha-vale-num"))       el("ficha-vale-num").textContent       = v.id;
    if (el("ficha-vale-vehiculo"))  el("ficha-vale-vehiculo").textContent  = v.vehiculo;
    if (el("ficha-vale-unidad"))    el("ficha-vale-unidad").textContent    = v.unidad;
    if (el("ficha-vale-conductor")) el("ficha-vale-conductor").textContent = v.conductor;
    if (el("ficha-vale-tipo"))      el("ficha-vale-tipo").textContent      = v.tipo;
    if (el("ficha-vale-litros"))    el("ficha-vale-litros").textContent    = `${v.litros} Lts`;
    if (el("ficha-vale-costo"))     el("ficha-vale-costo").textContent     = `Bs. ${Number(v.costo).toLocaleString('es-BO', {minimumFractionDigits: 2})}`;

    document.getElementById("modal-ficha-vale").classList.add("open");
}

function cerrarFichaVale() {
    document.getElementById("modal-ficha-vale").classList.remove("open");
}

function imprimirFichaVale() {
    window.print();
}

function generarReporteEjecutivoCombustible() {
    const totalVales = vales.length;
    const totalLitros = vales.reduce((sum, v) => sum + Number(v.litros || 0), 0);
    const totalCosto = vales.reduce((sum, v) => sum + Number(v.costo || 0), 0);

    const el = (elementId) => document.getElementById(elementId);
    if (el("rep-comb-vales"))  el("rep-comb-vales").textContent  = totalVales;
    if (el("rep-comb-litros")) el("rep-comb-litros").textContent = `${totalLitros.toLocaleString()} Lts`;
    if (el("rep-comb-costo"))  el("rep-comb-costo").textContent  = `Bs. ${totalCosto.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;

    const tbody = el("reporte-comb-tabla-body");
    if (tbody) {
        tbody.innerHTML = vales.map(v => `
            <tr>
                <td><strong>${v.id}</strong></td>
                <td>${v.vehiculo}</td>
                <td>${v.unidad}</td>
                <td>${v.tipo}</td>
                <td>${v.litros} Lts</td>
                <td>Bs. ${Number(v.costo).toLocaleString('es-BO', {minimumFractionDigits:2})}</td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-combustible");
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
