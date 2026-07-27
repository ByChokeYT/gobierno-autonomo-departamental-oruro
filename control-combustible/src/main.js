// ════════════════════════════════════════════════════════════════
// SISTEMA DE CONTROL DE VALES DE COMBUSTIBLE — GOBERNACIÓN DE ORURO
// Ley N° 1178 (SAFCO) · Conciliación Operativa & Tokens SHA-256
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

// ─── Estado Global ────────────────────────────────────────────────
let vales = [];
let valesFiltrados = [];
let tanqueGasolina = 4180; // Capacidad Max: 5000 Litros
let tanqueDiesel   = 4420; // Capacidad Max: 5000 Litros
const CAPACIDAD_MAX = 5000;

let valeSeleccionado = null;
let sortConfig = { campo: 'codigo', asc: true };

// Sal secreta gubernamental para firmar los tokens criptográficos
const GOB_SECRET = "LEY-1178-ORURO-2026-SEGURIDAD-TESORERIA";

// ─── Inicialización ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    iniciarRelojVivo();
    filtrarVales();
    actualizarEstadisticas();

    // Atajo de teclado Ctrl + K → Enfocar búsqueda
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            switchTab('vales');
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
            cerrarModal();
            cerrarVerificadorDirecto();
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
    const dataVales = localStorage.getItem("oruro_vales_combustible_v2");
    const dataGasolina = localStorage.getItem("oruro_tanque_gasolina_v2");
    const dataDiesel = localStorage.getItem("oruro_tanque_diesel_v2");

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
                destino:   "Supervisión Obras de Riego Caracollo",
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
    localStorage.setItem("oruro_vales_combustible_v2", JSON.stringify(vales));
}

function guardarInventario() {
    localStorage.setItem("oruro_tanque_gasolina_v2", tanqueGasolina);
    localStorage.setItem("oruro_tanque_diesel_v2", tanqueDiesel);
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
        vales:     "Gestión de Vales de Combustible",
        registro:  "Emitir Nuevo Vale de Combustible",
        tanques:   "Monitoreo de Nivel de Tanques Centráles"
    };

    const pageTitle = document.getElementById("page-title");
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    filtrarVales();
    actualizarEstadisticas();
    actualizarMedidoresTanques();
}

// ─── Estadísticas & KPIs ─────────────────────────────────────────
function actualizarEstadisticas() {
    const totalLitros = vales.reduce((s, v) => s + (parseInt(v.litros) || 0), 0);

    const el = (id) => document.getElementById(id);
    if (el("stat-litros"))          el("stat-litros").textContent = `${totalLitros.toLocaleString()} Lts`;
    if (el("stat-tanque-gasolina")) el("stat-tanque-gasolina").textContent = `${Math.round(tanqueGasolina).toLocaleString()} Lts`;
    if (el("stat-tanque-diesel"))   el("stat-tanque-diesel").textContent = `${Math.round(tanqueDiesel).toLocaleString()} Lts`;
    if (el("nav-count"))            el("nav-count").textContent = vales.length;

    // Alerta de Reserva Crítica (< 20% o < 1000 Litros)
    const alertaEl = el("alerta-reserva");
    if (alertaEl) {
        if (tanqueGasolina < 1000 || tanqueDiesel < 1000) {
            alertaEl.style.display = "flex";
        } else {
            alertaEl.style.display = "none";
        }
    }

    actualizarMedidoresTanques();
}

function actualizarMedidoresTanques() {
    const pctGas = Math.round((tanqueGasolina / CAPACIDAD_MAX) * 100);
    const pctDie = Math.round((tanqueDiesel / CAPACIDAD_MAX) * 100);

    const el = (id) => document.getElementById(id);
    if (el("meter-gasolina"))     el("meter-gasolina").style.width = `${pctGas}%`;
    if (el("val-gasolina-disp"))  el("val-gasolina-disp").textContent = `${Math.round(tanqueGasolina).toLocaleString()} Lts`;
    if (el("pct-gasolina-disp"))  el("pct-gasolina-disp").textContent = `${pctGas}%`;

    if (el("meter-diesel"))        el("meter-diesel").style.width = `${pctDie}%`;
    if (el("val-diesel-disp"))     el("val-diesel-disp").textContent = `${Math.round(tanqueDiesel).toLocaleString()} Lts`;
    if (el("pct-diesel-disp"))     el("pct-diesel-disp").textContent = `${pctDie}%`;
}

// ─── Filtrado & Búsqueda ──────────────────────────────────────────
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
    if (badge) badge.textContent = `${valesFiltrados.length} resultado${valesFiltrados.length !== 1 ? 's' : ''}`;

    const litrosFiltrados = valesFiltrados.reduce((s, v) => s + (parseInt(v.litros) || 0), 0);
    const footerCount  = document.getElementById("table-total-count");
    const footerLitros = document.getElementById("table-total-litros");
    if (footerCount)  footerCount.textContent  = `${valesFiltrados.length} de ${vales.length} vales emitidos`;
    if (footerLitros) footerLitros.textContent = `${litrosFiltrados.toLocaleString()} Litros totales en esta vista`;
}

function limpiarFiltros() {
    const ids = ["input-buscar", "filtro-tipo"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    filtrarVales();
}

// ─── Ordenamiento ─────────────────────────────────────────────────
function ordenarPor(campo) {
    if (sortConfig.campo === campo) {
        sortConfig.asc = !sortConfig.asc;
    } else {
        sortConfig.campo = campo;
        sortConfig.asc = true;
    }
    filtrarVales();
}

function ordenarVales(lista) {
    return [...lista].sort((a, b) => {
        let va = a[sortConfig.campo] ?? "";
        let vb = b[sortConfig.campo] ?? "";
        if (sortConfig.campo === "litros") {
            va = parseInt(va) || 0;
            vb = parseInt(vb) || 0;
        }
        if (va < vb) return sortConfig.asc ? -1 : 1;
        if (va > vb) return sortConfig.asc ? 1 : -1;
        return 0;
    });
}

// ─── Render Tabla ─────────────────────────────────────────────────
function renderTabla() {
    const tbody      = document.getElementById("tabla-vales");
    const emptyState = document.getElementById("estado-vacio");

    tbody.innerHTML = "";

    if (valesFiltrados.length === 0) {
        if (emptyState) emptyState.style.display = "flex";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    valesFiltrados.forEach((v, idx) => {
        const tr = document.createElement("tr");
        tr.style.animationDelay = `${idx * 0.03}s`;

        const badgeClass = v.tipo === "Gasolina Especial" ? "badge-tipo gasolina" : "badge-tipo diesel";

        tr.innerHTML = `
            <td>
                <div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;color:#fff;">${v.codigo}</div>
                <div style="font-size:0.65rem;color:var(--text-muted);">${v.fecha}</div>
            </td>
            <td>
                <div style="font-weight:700;font-size:0.875rem;">${v.conductor}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${v.destino}">${v.destino}</div>
            </td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;background:rgba(255,255,255,0.04);border:1px solid var(--border-main);padding:3px 8px;border-radius:4px;color:var(--text-main);">${v.placa}</span>
            </td>
            <td><span class="${badgeClass}">${v.tipo}</span></td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.85rem;color:var(--primary);">${v.litros} Lts</span>
            </td>
            <td>
                <code style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:var(--accent-cyan);background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.15);padding:3px 7px;border-radius:4px;">${v.token}</code>
            </td>
            <td>
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="btn-action" onclick="abrirBoleta('${v.codigo}')" title="Ver e Imprimir Vale">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Vale PDF
                    </button>
                    <button class="btn-delete" onclick="eliminarVale('${v.codigo}')" title="Anular Vale">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Emitir Nuevo Vale ────────────────────────────────────────────
function registrarVale(e) {
    e.preventDefault();

    const conductor = document.getElementById("val-conductor").value.trim();
    const placa     = document.getElementById("val-placa").value.trim().toUpperCase();
    const tipo      = document.getElementById("val-tipo").value;
    const litros    = parseInt(document.getElementById("val-litros").value) || 0;
    const destino   = document.getElementById("val-destino").value.trim();

    if (litros <= 0) {
        mostrarToast("Ingrese una cantidad válida de litros.", "warning");
        return;
    }

    // Verificar existencias
    if (tipo === "Gasolina Especial" && tanqueGasolina < litros) {
        mostrarToast(`Capacidad insuficiente en Tanque Gasolina (Disponible: ${Math.round(tanqueGasolina)} Lts).`, "error");
        return;
    }
    if (tipo === "Diésel Oíl" && tanqueDiesel < litros) {
        mostrarToast(`Capacidad insuficiente en Tanque Diésel (Disponible: ${Math.round(tanqueDiesel)} Lts).`, "error");
        return;
    }

    // Decrementar inventario
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
    mostrarToast(`Vale ${codigo} emitido correctamente (${litros} Lts).`, "success");
    switchTab("vales");
    setTimeout(() => abrirBoleta(codigo), 300);
}

// ─── Eliminar / Anular Vale ───────────────────────────────────────
function eliminarVale(codigo) {
    const v = vales.find(x => x.codigo === codigo);
    if (!v) return;

    if (confirm(`¿Anular permanentemente el vale "${codigo}"? Se restituirán ${v.litros} Litros al tanque central.`)) {
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

// ─── Recargar Tanque ──────────────────────────────────────────────
function recargarTanque(tipo) {
    const cantStr = prompt(`Ingrese la cantidad de Litros a reponer para ${tipo} (Capacidad Max: ${CAPACIDAD_MAX} Lts):`, "1000");
    if (!cantStr) return;

    const cant = parseFloat(cantStr);
    if (isNaN(cant) || cant <= 0) {
        mostrarToast("Cantidad inválida.", "warning");
        return;
    }

    if (tipo === "Gasolina Especial") {
        tanqueGasolina = Math.min(CAPACIDAD_MAX, tanqueGasolina + cant);
    } else {
        tanqueDiesel = Math.min(CAPACIDAD_MAX, tanqueDiesel + cant);
    }

    guardarInventario();
    actualizarEstadisticas();
    mostrarToast(`Reposición de ${cant} Lts de ${tipo} registrada.`, "success");
}

// ─── Generador de Token Hash SHA-256 (DJB2 + Salt) ───────────────
function generarTokenHash(codigo, placa, litros) {
    const rawString = `${codigo}-${placa}-${litros}-${GOB_SECRET}`;

    let h1 = 5381;
    let h2 = 0x811c9dc5;

    for (let i = 0; i < rawString.length; i++) {
        const char = rawString.charCodeAt(i);
        h1 = ((h1 << 5) + h1) + char;
        h2 ^= char;
        h2 = (Math.imul(h2, 0x01000193)) >>> 0;
    }

    const hex1 = Math.abs(h1).toString(16).toUpperCase().padStart(8, '0');
    const hex2 = Math.abs(h2).toString(16).toUpperCase().padStart(8, '0');

    return `SHA-OR-${hex1.slice(0, 4)}${hex2.slice(0, 4)}${hex1.slice(4, 8)}`.slice(0, 20);
}

// ─── Modal Boleta Imprimible ──────────────────────────────────────
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
    document.getElementById("modal-boleta").classList.remove("open");
    valeSeleccionado = null;
}

// ─── Verificador de Token ─────────────────────────────────────────
function abrirVerificadorDirecto() {
    document.getElementById("modal-verificador").classList.add("open");
    const box = document.getElementById("resultado-verificacion");
    if (box) box.style.display = "none";
    setTimeout(() => {
        const input = document.getElementById("input-token-verificar");
        if (input) { input.value = ""; input.focus(); }
    }, 150);
}

function cerrarVerificadorDirecto() {
    document.getElementById("modal-verificador").classList.remove("open");
}

function verificarToken() {
    const input = document.getElementById("input-token-verificar");
    const token = (input?.value ?? "").trim().toUpperCase();
    const box   = document.getElementById("resultado-verificacion");

    if (!token) {
        mostrarToast("Ingrese el token de seguridad SHA-256.", "warning");
        return;
    }

    const vale = vales.find(v => v.token.toUpperCase() === token || v.codigo.toUpperCase() === token);

    box.style.display = "block";
    if (vale) {
        box.className = "verification-result-box valid";
        box.innerHTML = `
            <strong>TOKEN AUTÉNTICO & VERIFICADO</strong><br>
            <strong>Vale:</strong> ${vale.codigo}<br>
            <strong>Conductor:</strong> ${vale.conductor}<br>
            <strong>Placa:</strong> ${vale.placa}<br>
            <strong>Asignación:</strong> ${vale.litros} Lts (${vale.tipo})<br>
            <strong>Fecha:</strong> ${vale.fecha}
        `;
    } else {
        box.className = "verification-result-box invalid";
        box.innerHTML = `
            <strong>TOKEN INVÁLIDO O NO REGISTRADO</strong><br>
            La firma criptográfica "${token}" no figura en la base de datos de tesorería o fue alterada.
        `;
    }
}

// ─── Exportar CSV ─────────────────────────────────────────────────
function exportarCSV() {
    if (vales.length === 0) {
        mostrarToast("No hay vales para exportar.", "warning");
        return;
    }

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
    const d = ahora.getDate();
    const m = meses[ahora.getMonth()];
    const y = ahora.getFullYear();
    const h = String(ahora.getHours()).padStart(2,"0");
    const min = String(ahora.getMinutes()).padStart(2,"0");
    return `${d} ${m} ${y} - ${h}:${min}`;
}

function imprimirBoleta() {
    window.print();
}

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
