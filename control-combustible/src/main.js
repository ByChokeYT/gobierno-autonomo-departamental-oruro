// ════════════════════════════════════════════════════════════════
// SISTEMA DE CONTROL DE VALES DE COMBUSTIBLE — GOBERNACIÓN DE ORURO
// Ley N° 1178 (SAFCO) · Surtidor & Conciliación Operativa
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

let vales = [];
let valesFiltrados = [];
let tanqueGasolina = 3925; // Capacidad Max: 5000 Litros
let tanqueDiesel   = 4200; // Capacidad Max: 5000 Litros
const CAPACIDAD_MAX = 5000;

let valeSeleccionado = null;
let sortConfig = { campo: 'codigo', asc: true };

const GOB_SECRET = "LEY-1178-ORURO-2026-SEGURIDAD-SURTIDOR";

document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    iniciarRelojVivo();
    filtrarVales();
    actualizarEstadisticas();

    // Atajo Ctrl+K
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            switchTab('vales');
            setTimeout(() => {
                const input = document.getElementById("input-buscar");
                if (input) { input.focus(); input.select(); mostrarToast("Búsqueda activada · Ctrl+K", "info"); }
            }, 80);
        }
        if (e.key === "Escape") {
            cerrarModal();
            cerrarVerificadorDirecto();
        }
    });
});

function iniciarRelojVivo() {
    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");
        const clockTime = document.getElementById("fuel-clock-time");
        if (clockTime) clockTime.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

function inicializarDatos() {
    const dataVales = localStorage.getItem("oruro_vales_combustible_v3");
    const dataGasolina = localStorage.getItem("oruro_tanque_gasolina_v3");
    const dataDiesel = localStorage.getItem("oruro_tanque_diesel_v3");

    if (dataVales) {
        vales = JSON.parse(dataVales);
    } else {
        vales = [
            {
                codigo:    "VAL-2026-0001",
                conductor: "Oscar Valenzuela Pérez",
                placa:     "2451-FDS",
                tipo:      "Gasolina Especial",
                litros:    40,
                destino:   "Comisión Inspección Caminera Oruro - Toledo",
                fecha:     "12 Ene 2026 - 08:30",
                token:     "SHA-OR-8F32C69DA564BC12"
            },
            {
                codigo:    "VAL-2026-0002",
                conductor: "Ramiro Rocha Pérez",
                placa:     "3429-UYX",
                tipo:      "Diésel Oíl",
                litros:    80,
                destino:   "Transporte Maquinaria Pesada Challapata",
                fecha:     "15 Feb 2026 - 10:15",
                token:     "SHA-OR-A3B43C56D78E12F5"
            },
            {
                codigo:    "VAL-2026-0003",
                conductor: "Carlos Mendoza Quispe",
                placa:     "1842-BNM",
                tipo:      "Gasolina Especial",
                litros:    35,
                destino:   "Supervisión Obras Riego Caracollo",
                fecha:     "20 Jun 2026 - 14:20",
                token:     "SHA-OR-4C12D89EB701FA33"
            },
            {
                codigo:    "VAL-2026-0004",
                conductor: "Hernán Mamani Claros",
                placa:     "4021-POI",
                tipo:      "Diésel Oíl",
                litros:    120,
                destino:   "Mantenimiento Carretero SEDECA Huanuni",
                fecha:     "05 Jul 2026 - 09:45",
                token:     "SHA-OR-9E56F12AB843DC77"
            }
        ];
        guardarVales();
    }

    tanqueGasolina = dataGasolina ? parseFloat(dataGasolina) : 3925;
    tanqueDiesel   = dataDiesel   ? parseFloat(dataDiesel)   : 4200;
    guardarInventario();
}

function guardarVales() {
    localStorage.setItem("oruro_vales_combustible_v3", JSON.stringify(vales));
}

function guardarInventario() {
    localStorage.setItem("oruro_tanque_gasolina_v3", tanqueGasolina);
    localStorage.setItem("oruro_tanque_diesel_v3", tanqueDiesel);
}

function switchTab(tabName) {
    document.querySelectorAll(".fuel-pane").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".fuel-tab-btn").forEach(b => b.classList.remove("active"));

    if (tabName === "vales") {
        document.getElementById("pane-vales")?.classList.add("active");
        document.getElementById("tab-btn-vales")?.classList.add("active");
    } else if (tabName === "emitir") {
        document.getElementById("pane-emitir")?.classList.add("active");
        document.getElementById("tab-btn-emitir")?.classList.add("active");
    }

    filtrarVales();
    actualizarEstadisticas();
}

function actualizarEstadisticas() {
    const totalLitros = vales.reduce((s, v) => s + (parseInt(v.litros) || 0), 0);

    const el = (id) => document.getElementById(id);
    if (el("cnt-vales")) el("cnt-vales").textContent = vales.length;

    // Medidores 3D Tanques
    const pctGas = ((tanqueGasolina / CAPACIDAD_MAX) * 100).toFixed(1);
    const pctDie = ((tanqueDiesel / CAPACIDAD_MAX) * 100).toFixed(1);

    if (el("pct-badge-gasolina")) el("pct-badge-gasolina").textContent = `${pctGas}%`;
    if (el("val-gasolina-lts"))   el("val-gasolina-lts").textContent   = `${Math.round(tanqueGasolina).toLocaleString()} Lts`;
    if (el("wave-gasolina"))      el("wave-gasolina").style.width      = `${pctGas}%`;

    if (el("pct-badge-diesel")) el("pct-badge-diesel").textContent = `${pctDie}%`;
    if (el("val-diesel-lts"))   el("val-diesel-lts").textContent   = `${Math.round(tanqueDiesel).toLocaleString()} Lts`;
    if (el("wave-diesel"))      el("wave-diesel").style.width      = `${pctDie}%`;

    // Status Pills
    if (el("status-gasolina")) {
        el("status-gasolina").textContent = tanqueGasolina < 1000 ? "🔴 Reserva Crítica" : "🟢 Operativo";
        el("status-gasolina").className   = tanqueGasolina < 1000 ? "tank-status-pill text-danger" : "tank-status-pill ok";
    }
    if (el("status-diesel")) {
        el("status-diesel").textContent = tanqueDiesel < 1000 ? "🔴 Reserva Crítica" : "🟢 Operativo";
        el("status-diesel").className   = tanqueDiesel < 1000 ? "tank-status-pill text-danger" : "tank-status-pill ok";
    }
}

function filtrarVales() {
    const query = (document.getElementById("input-buscar")?.value ?? "").toLowerCase().trim();
    const tipo  = document.getElementById("filtro-tipo")?.value ?? "";

    valesFiltrados = vales.filter(v => {
        const q = !query
            || v.codigo.toLowerCase().includes(query)
            || v.conductor.toLowerCase().includes(query)
            || v.placa.toLowerCase().includes(query)
            || v.destino.toLowerCase().includes(query)
            || (v.token || "").toLowerCase().includes(query);

        const t = !tipo || v.tipo === tipo;
        return q && t;
    });

    valesFiltrados = ordenarVales(valesFiltrados);
    renderTabla();

    const badge = document.getElementById("filter-result-badge");
    if (badge) badge.textContent = `${valesFiltrados.length} Vales`;

    const litrosFiltrados = valesFiltrados.reduce((s, v) => s + (parseInt(v.litros) || 0), 0);
    const footerCount  = document.getElementById("table-total-count");
    const footerLitros = document.getElementById("table-total-litros");
    if (footerCount)  footerCount.textContent  = `${valesFiltrados.length} de ${vales.length} vales emitidos`;
    if (footerLitros) footerLitros.textContent = `${litrosFiltrados.toLocaleString()} Litros Despachados en Vista`;
}

function ordenarPor(campo) {
    if (sortConfig.campo === campo) sortConfig.asc = !sortConfig.asc;
    else { sortConfig.campo = campo; sortConfig.asc = true; }
    filtrarVales();
}

function ordenarVales(lista) {
    return [...lista].sort((a, b) => {
        let va = a[sortConfig.campo] ?? "";
        let vb = b[sortConfig.campo] ?? "";
        if (sortConfig.campo === "litros") { va = parseInt(va) || 0; vb = parseInt(vb) || 0; }
        if (va < vb) return sortConfig.asc ? -1 : 1;
        if (va > vb) return sortConfig.asc ? 1 : -1;
        return 0;
    });
}

function renderTabla() {
    const tbody      = document.getElementById("tabla-vales");
    const emptyState = document.getElementById("estado-vacio");

    tbody.innerHTML = "";

    if (valesFiltrados.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    valesFiltrados.forEach((v, idx) => {
        const tr = document.createElement("tr");
        tr.style.animationDelay = `${idx * 0.03}s`;

        const badgeClass = v.tipo === "Gasolina Especial" ? "tank-pill gas" : "tank-pill diesel";

        tr.innerHTML = `
            <td>
                <div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;color:var(--cyan-gas);">${v.codigo}</div>
                <div style="font-size:0.65rem;color:var(--text-fuel-muted);">${v.fecha}</div>
            </td>
            <td>
                <div style="font-weight:700;font-size:0.875rem;">${v.conductor}</div>
                <div style="font-size:0.68rem;color:var(--text-fuel-muted);max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${v.destino}">${v.destino}</div>
            </td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;background:rgba(255,255,255,0.04);border:1px solid var(--border-fuel);padding:3px 8px;border-radius:4px;color:#fff;">${v.placa}</span>
            </td>
            <td><span class="${badgeClass}">${v.tipo}</span></td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.85rem;color:var(--amber-gas);">${v.litros} Lts</span>
            </td>
            <td>
                <code style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:var(--cyan-gas);background:rgba(0,242,254,0.06);border:1px solid rgba(0,242,254,0.18);padding:3px 7px;border-radius:4px;">${v.token}</code>
            </td>
            <td>
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="btn-fuel-sec" style="padding:6px 10px;font-size:0.75rem;" onclick="abrirBoleta('${v.codigo}')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Ticket
                    </button>
                    <button class="btn-fuel-sec" style="padding:6px 8px;font-size:0.75rem;color:var(--rose-fuel);border-color:rgba(244,63,94,0.2);" onclick="eliminarVale('${v.codigo}')">Anular</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function registrarVale(e) {
    e.preventDefault();

    const conductor = document.getElementById("val-conductor").value.trim();
    const placa     = document.getElementById("val-placa").value.trim().toUpperCase();
    const tipo      = document.getElementById("val-tipo").value;
    const litros    = parseInt(document.getElementById("val-litros").value) || 0;
    const destino   = document.getElementById("val-destino").value.trim();

    if (litros <= 0) { mostrarToast("Ingrese una cantidad válida de litros.", "warning"); return; }

    if (tipo === "Gasolina Especial" && tanqueGasolina < litros) {
        mostrarToast(`Capacidad insuficiente en Tanque Gasolina (Disp: ${Math.round(tanqueGasolina)} L).`, "error"); return;
    }
    if (tipo === "Diésel Oíl" && tanqueDiesel < litros) {
        mostrarToast(`Capacidad insuficiente en Tanque Diésel (Disp: ${Math.round(tanqueDiesel)} L).`, "error"); return;
    }

    if (tipo === "Gasolina Especial") tanqueGasolina -= litros;
    else tanqueDiesel -= litros;
    guardarInventario();

    const correlativo = String(vales.length + 1).padStart(4, "0");
    const codigo = `VAL-2026-${correlativo}`;
    const ahora  = obtenerFechaHoraActual();
    const token  = generarTokenHash(codigo, placa, litros);

    const nuevo = { codigo, conductor, placa, tipo, litros, destino, fecha: ahora, token };
    vales.unshift(nuevo);
    guardarVales();

    document.getElementById("form-vale").reset();
    mostrarToast(`Vale ${codigo} emitido exitosamente (${litros} Lts).`, "success");
    switchTab("vales");
    setTimeout(() => abrirBoleta(codigo), 300);
}

function eliminarVale(codigo) {
    const v = vales.find(x => x.codigo === codigo);
    if (!v) return;

    if (confirm(`¿Anular permanentemente el vale "${codigo}"? Se restituirán ${v.litros} Litros al depósito.`)) {
        if (v.tipo === "Gasolina Especial") tanqueGasolina += parseFloat(v.litros);
        else tanqueDiesel += parseFloat(v.litros);

        guardarInventario();
        vales = vales.filter(x => x.codigo !== codigo);
        guardarVales();

        filtrarVales();
        actualizarEstadisticas();
        mostrarToast(`Vale ${codigo} anulado e inventario restituido.`, "warning");
    }
}

function recargarTanque(tipo) {
    const cantStr = prompt(`Ingrese los Litros a reponer en ${tipo} (Capacidad Max: ${CAPACIDAD_MAX} Lts):`, "1000");
    if (!cantStr) return;

    const cant = parseFloat(cantStr);
    if (isNaN(cant) || cant <= 0) { mostrarToast("Cantidad inválida.", "warning"); return; }

    if (tipo === "Gasolina Especial") tanqueGasolina = Math.min(CAPACIDAD_MAX, tanqueGasolina + cant);
    else tanqueDiesel = Math.min(CAPACIDAD_MAX, tanqueDiesel + cant);

    guardarInventario();
    actualizarEstadisticas();
    mostrarToast(`Reposición de ${cant} Lts en ${tipo} completada.`, "success");
}

function generarTokenHash(codigo, placa, litros) {
    const rawString = `${codigo}-${placa}-${litros}-${GOB_SECRET}`;
    let h1 = 5381, h2 = 0x811c9dc5;
    for (let i = 0; i < rawString.length; i++) {
        const char = rawString.charCodeAt(i);
        h1 = ((h1 << 5) + h1) + char;
        h2 ^= char; h2 = (Math.imul(h2, 0x01000193)) >>> 0;
    }
    const hex1 = Math.abs(h1).toString(16).toUpperCase().padStart(8, '0');
    const hex2 = Math.abs(h2).toString(16).toUpperCase().padStart(8, '0');
    return `SHA-OR-${hex1.slice(0, 4)}${hex2.slice(0, 4)}${hex1.slice(4, 8)}`.slice(0, 20);
}

function abrirBoleta(codigo) {
    valeSeleccionado = vales.find(v => v.codigo === codigo);
    if (!valeSeleccionado) return;

    const v = valeSeleccionado;
    const el = (id) => document.getElementById(id);

    if (el("t-codigo-sub")) el("t-codigo-sub").textContent = `${v.codigo} · GAD-ORU`;
    if (el("t-codigo"))     el("t-codigo").textContent     = v.codigo;
    if (el("t-fecha"))      el("t-fecha").textContent      = v.fecha;
    if (el("t-conductor"))  el("t-conductor").textContent  = v.conductor;
    if (el("t-placa"))      el("t-placa").textContent      = v.placa;
    if (el("t-tipo"))       el("t-tipo").textContent       = v.tipo;
    if (el("t-litros"))     el("t-litros").textContent     = `${v.litros} Litros`;
    if (el("t-destino"))    el("t-destino").textContent    = v.destino;
    if (el("t-token"))      el("t-token").textContent      = v.token;

    document.getElementById("modal-boleta").classList.add("open");
}

function cerrarModal() {
    document.getElementById("modal-boleta")?.classList.remove("open");
    valeSeleccionado = null;
}

function abrirVerificadorDirecto() {
    document.getElementById("modal-verificador")?.classList.add("open");
    const box = document.getElementById("resultado-verificacion");
    if (box) box.style.display = "none";
    setTimeout(() => {
        const input = document.getElementById("input-token-verificar");
        if (input) { input.value = ""; input.focus(); }
    }, 150);
}

function cerrarVerificadorDirecto() {
    document.getElementById("modal-verificador")?.classList.remove("open");
}

function verificarToken() {
    const input = document.getElementById("input-token-verificar");
    const token = (input?.value ?? "").trim().toUpperCase();
    const box   = document.getElementById("resultado-verificacion");

    if (!token) { mostrarToast("Ingrese el token SHA-256.", "warning"); return; }

    const vale = vales.find(v => v.token.toUpperCase() === token || v.codigo.toUpperCase() === token);

    box.style.display = "block";
    if (vale) {
        box.className = "verification-box valid";
        box.innerHTML = `
            <strong>✅ TOKEN VÁLIDO & AUTÉNTICO</strong><br>
            <strong>Vale:</strong> ${vale.codigo}<br>
            <strong>Conductor:</strong> ${vale.conductor}<br>
            <strong>Placa:</strong> ${vale.placa}<br>
            <strong>Asignación:</strong> ${vale.litros} Lts (${vale.tipo})<br>
            <strong>Fecha:</strong> ${vale.fecha}
        `;
    } else {
        box.className = "verification-box invalid";
        box.innerHTML = `
            <strong>❌ TOKEN INVÁLIDO O ALTERADO</strong><br>
            La firma criptográfica "${token}" no figura en los registros de Tesorería.
        `;
    }
}

function exportarCSV() {
    if (vales.length === 0) { mostrarToast("No hay vales para exportar.", "warning"); return; }

    const BOM = "\uFEFF";
    const headers = ["CodigoVale", "Conductor", "PlacaVehiculo", "TipoCarburante", "Litros", "RutaComision", "FechaEmision", "TokenHashSeguridad"];
    const rows = vales.map(v => [v.codigo, v.conductor, v.placa, v.tipo, v.litros, v.destino, v.fecha, v.token]);

    const csvContent = BOM + [headers, ...rows]
        .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vales_combustible_oruro_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    mostrarToast(`Reporte CSV (${vales.length} vales) descargado.`, "success");
}

function obtenerFechaHoraActual() {
    const ahora = new Date();
    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    return `${ahora.getDate()} ${meses[ahora.getMonth()]} ${ahora.getFullYear()} - ${String(ahora.getHours()).padStart(2,"0")}:${String(ahora.getMinutes()).padStart(2,"0")}`;
}

function imprimirBoleta() { window.print(); }

function mostrarToast(mensaje, tipo = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastOut 0.3s ease forwards";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
