// ════════════════════════════════════════════════════════════════
// REGISTRO DE TRÁMITES CIUDADANOS (CRUD) — SAFCO
// Secretaría General · Gobernación Autónoma Departamental de Oruro
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

let tramites = [];
let tramitesFiltrados = [];

document.addEventListener("DOMContentLoaded", () => {
    inicializarTramites();
    iniciarRelojVivo();
    filtrarTramites();
    actualizarContador();
});

function iniciarRelojVivo() {
    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");

        const el = document.getElementById("tram-clock-time");
        if (el) el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

function inicializarTramites() {
    const local = localStorage.getItem("oruro_registro_tramites_v2");
    if (local) {
        tramites = JSON.parse(local);
    } else {
        tramites = [
            {
                id: "TR-2026-0001",
                nombre: "Juan Carlos Flores Pérez",
                cedula: "1234567 OR",
                tipo: "Licencia de Funcionamiento",
                estado: "En Proceso",
                fecha: "02 Sep 2026 - 08:45"
            },
            {
                id: "TR-2026-0002",
                nombre: "María Elena Quispe Colque",
                cedula: "4589120 OR",
                tipo: "Certificación Técnica Ambiental",
                estado: "Aprobado",
                fecha: "02 Sep 2026 - 09:30"
            },
            {
                id: "TR-2026-0003",
                nombre: "Roberto Mamani Choque",
                cedula: "7891234 OR",
                tipo: "Pago de Impuestos Departamentales",
                estado: "Pendiente",
                fecha: "02 Sep 2026 - 10:15"
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_registro_tramites_v2", JSON.stringify(tramites));
}

function actualizarContador() {
    const el = document.getElementById("contador-tramites");
    if (el) el.textContent = tramites.length;
}

function registrarTramite(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const cedula = document.getElementById("cedula").value.trim();
    const tipo   = document.getElementById("tipo-tramite").value;

    const num = String(tramites.length + 1).padStart(4, "0");
    const id = `TR-2026-${num}`;
    const fecha = new Date().toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' }) + " - " + new Date().toLocaleTimeString('es-BO', {hour:'2-digit', minute:'2-digit'});

    const nuevo = { id, nombre, cedula, tipo, estado: "En Proceso", fecha };
    tramites.unshift(nuevo);
    guardarLocal();

    document.getElementById("formulario-tramite").reset();
    actualizarContador();
    filtrarTramites();
    mostrarToast(`Trámite ${id} registrado exitosamente.`, "success");
    setTimeout(() => abrirFichaTramite(id), 300);
}

function eliminarTramite(id) {
    if (confirm(`¿Eliminar el trámite ${id}?`)) {
        tramites = tramites.filter(t => t.id !== id);
        guardarLocal();
        actualizarContador();
        filtrarTramites();
        mostrarToast(`Trámite ${id} eliminado.`, "warning");
    }
}

function filtrarTramiteTexto() {
    filtrarTramites();
}

function filtrarEstado(estado) {
    filtrarTramites();
}

function filtrarTramites() {
    const query = (document.getElementById("input-buscar-tramite")?.value || "").toLowerCase().trim();

    tramitesFiltrados = tramites.filter(t => {
        return !query || t.id.toLowerCase().includes(query) || t.nombre.toLowerCase().includes(query) || t.cedula.toLowerCase().includes(query);
    });

    renderTabla();
}

function renderTabla() {
    const tbody = document.getElementById("tbody-tramites");
    if (!tbody) return;
    tbody.innerHTML = "";

    tramitesFiltrados.forEach(t => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--primary-light);">${t.id}</strong>
            </td>
            <td>
                <div style="font-weight:700;color:var(--text-main);">${t.nombre}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);">C.I.: ${t.cedula}</div>
            </td>
            <td>
                <span style="font-size:0.8rem;color:var(--text-secondary);">${t.tipo}</span>
            </td>
            <td>
                <span style="font-size:0.72rem;font-weight:800;padding:3px 8px;border-radius:999px;background:${t.estado === 'Aprobado' ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)'};color:${t.estado === 'Aprobado' ? 'var(--primary-light)' : 'var(--accent-gold)'};">${t.estado}</span>
            </td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button class="btn-ficha" onclick="abrirFichaTramite('${t.id}')" title="Ver Ticket A4">
                        Ticket A4
                    </button>
                    <button class="btn-delete" onclick="eliminarTramite('${t.id}')">
                        ✕
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Modal A4 & Reporte ───────────────────────────────────────────
function abrirFichaTramite(id) {
    const t = tramites.find(item => item.id === id);
    if (!t) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("ficha-tramite-subtitle")) el("ficha-tramite-subtitle").textContent = `${t.id} · Ciudadano: ${t.nombre}`;
    if (el("ficha-tramite-codigo"))   el("ficha-tramite-codigo").textContent   = `TICKET DE RECEPCIÓN N° ${t.id}`;
    if (el("ficha-tramite-fecha"))    el("ficha-tramite-fecha").textContent    = t.fecha;
    if (el("ficha-tramite-num"))      el("ficha-tramite-num").textContent      = t.id;
    if (el("ficha-tramite-nombre"))   el("ficha-tramite-nombre").textContent   = t.nombre;
    if (el("ficha-tramite-ci"))       el("ficha-tramite-ci").textContent       = t.cedula;
    if (el("ficha-tramite-tipo"))     el("ficha-tramite-tipo").textContent     = t.tipo;
    if (el("ficha-tramite-estado"))   el("ficha-tramite-estado").textContent   = t.estado;

    document.getElementById("modal-ficha-tramite").classList.add("open");
}

function cerrarFichaTramite() {
    document.getElementById("modal-ficha-tramite").classList.remove("open");
}

function imprimirFichaTramite() {
    window.print();
}

function generarReporteEjecutivoTramites() {
    const el = (elementId) => document.getElementById(elementId);
    const tbody = el("reporte-tram-tabla-body");
    if (tbody) {
        tbody.innerHTML = tramites.map(t => `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td>${t.nombre}</td>
                <td>${t.cedula}</td>
                <td>${t.tipo}</td>
                <td>${t.estado}</td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-tramites");
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
