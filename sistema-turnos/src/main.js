// ════════════════════════════════════════════════════════════════
// SISTEMA DE TURNOS FIFO Y LLAMADOR DE VENTANILLAS — SAFCO
// Atención al Ciudadano · Gobernación Autónoma Departamental de Oruro
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

let colaTurnos = [];
let historialAtendidos = [];
let contadorTurno = 100;
let turnoActual = null;

document.addEventListener("DOMContentLoaded", () => {
    inicializarTurnos();
    iniciarRelojVivo();
    renderCola();
});

function iniciarRelojVivo() {
    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");

        const el = document.getElementById("turn-clock-time");
        if (el) el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

function inicializarTurnos() {
    colaTurnos = [
        { id: "T-101", nombre: "Juan Pérez Ramos", servicio: "Ventanilla 1 - Trámites Generales", hora: "09:00" },
        { id: "T-102", nombre: "María Elena Quispe", servicio: "Ventanilla 2 - Personerías Jurídicas", hora: "09:10" },
        { id: "T-103", nombre: "Roberto Mamani", servicio: "Ventanilla 3 - Regalías Mineras", hora: "09:15" }
    ];
    contadorTurno = 103;
}

function emitirTurno(e) {
    e.preventDefault();

    const nombre   = document.getElementById("nombre-ciudadano").value.trim();
    const servicio = document.getElementById("select-servicio").value;

    contadorTurno++;
    const id = `T-${contadorTurno}`;
    const hora = new Date().toLocaleTimeString('es-BO', {hour:'2-digit', minute:'2-digit'});

    const nuevo = { id, nombre, servicio, hora };
    colaTurnos.push(nuevo);

    document.getElementById("form-emitir-turno").reset();
    renderCola();
    mostrarToast(`Ticket ${id} emitido para ${nombre}.`, "success");
    setTimeout(() => abrirFichaTurno(nuevo), 300);
}

function llamarSiguienteTurno() {
    if (colaTurnos.length === 0) {
        mostrarToast("No hay ciudadanos esperando en la cola FIFO.", "warning");
        return;
    }

    turnoActual = colaTurnos.shift(); // Algoritmo FIFO (First-In, First-Out)
    historialAtendidos.push(turnoActual);

    const el = (id) => document.getElementById(id);
    if (el("turno-actual"))  el("turno-actual").textContent  = turnoActual.id;
    if (el("nombre-actual")) el("nombre-actual").textContent = `${turnoActual.nombre} · ${turnoActual.servicio}`;

    renderCola();
    mostrarToast(`🔔 ¡Llamando al Turno ${turnoActual.id} en ${turnoActual.servicio}!`, "info");
}

function renderCola() {
    const lista = document.getElementById("lista-espera");
    const contador = document.getElementById("contador-fila");
    if (contador) contador.textContent = colaTurnos.length;
    if (!lista) return;

    lista.innerHTML = "";

    if (colaTurnos.length === 0) {
        lista.innerHTML = `<li style="font-size:0.8rem;color:var(--text-muted);text-align:center;padding:12px;">Sin turnos en fila</li>`;
        return;
    }

    colaTurnos.forEach((t, idx) => {
        const li = document.createElement("li");
        li.style.cssText = "background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:10px 14px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;";
        li.innerHTML = `
            <div>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--primary-light);">${t.id}</strong>
                <span style="font-size:0.82rem;color:var(--text-main);margin-left:8px;">${t.nombre}</span>
            </div>
            <span style="font-size:0.68rem;color:var(--text-muted);font-weight:700;">#${idx + 1} en fila</span>
        `;
        lista.appendChild(li);
    });
}

// ─── Modal A4 & Reporte ───────────────────────────────────────────
function abrirFichaTurno(t) {
    if (!t) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("ficha-turno-subtitle")) el("ficha-turno-subtitle").textContent = `${t.id} · Ciudadano: ${t.nombre}`;
    if (el("ficha-turno-codigo"))   el("ficha-turno-codigo").textContent   = `TICKET DE ATENCIÓN N° ${t.id}`;
    if (el("ficha-turno-fecha"))    el("ficha-turno-fecha").textContent    = new Date().toLocaleDateString('es-BO', {day:'2-digit', month:'short', year:'numeric'}) + " - " + t.hora;
    if (el("ficha-turno-numero"))   el("ficha-turno-numero").textContent   = t.id;
    if (el("ficha-turno-nombre"))   el("ficha-turno-nombre").textContent   = t.nombre;
    if (el("ficha-turno-servicio")) el("ficha-turno-servicio").textContent = t.servicio;

    document.getElementById("modal-ficha-turno").classList.add("open");
}

function cerrarFichaTurno() {
    document.getElementById("modal-ficha-turno").classList.remove("open");
}

function imprimirFichaTurno() {
    window.print();
}

function generarReporteEjecutivoTurnos() {
    const el = (elementId) => document.getElementById(elementId);
    const tbody = el("reporte-turn-tabla-body");
    if (tbody) {
        const todos = [...historialAtendidos, ...colaTurnos];
        tbody.innerHTML = todos.map(t => `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td>${t.nombre}</td>
                <td>${t.servicio}</td>
                <td>${historialAtendidos.includes(t) ? 'Atendido' : 'En Espera'}</td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-turnos");
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