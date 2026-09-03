// ════════════════════════════════════════════════════════════════
// SISCO — SISTEMA DE CORRESPONDENCIA Y HOJAS DE RUTA (SAFCO)
// Secretaría General · Gobernación Autónoma Departamental de Oruro
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

let hojasRuta = [];
let hojasRutaFiltradas = [];
let idSeleccionadoDerivacion = null;

document.addEventListener("DOMContentLoaded", () => {
    inicializarHojasRuta();
    iniciarRelojVivo();
    filtrarHojasRuta();
    actualizarContador();
});

function iniciarRelojVivo() {
    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");

        const el = document.getElementById("sisco-clock-time");
        if (el) el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

function inicializarHojasRuta() {
    const local = localStorage.getItem("oruro_hojas_ruta_v2");
    if (local) {
        hojasRuta = JSON.parse(local);
    } else {
        hojasRuta = [
            {
                id: "HR-2026-0001",
                remitente: "Juan Pérez Ramos",
                ci: "4581298 OR",
                asunto: "Solicitud de asfaltado y mejoramiento tramo Caracollo - La Joya",
                ubicacion: "Secretaría de Obras Públicas (SEDECA)",
                prioridad: "Urgente",
                fecha: "02 Sep 2026 - 08:30",
                historial: [
                    { fecha: "02 Sep 2026 - 08:30", oficina: "Ventanilla Única", observacion: "Radicación e ingreso de solicitud." },
                    { fecha: "02 Sep 2026 - 09:15", oficina: "Secretaría de Obras Públicas (SEDECA)", observacion: "Derivado para informe de pre-factibilidad." }
                ]
            },
            {
                id: "HR-2026-0002",
                remitente: "Sindicato Agrario Poopó",
                ci: "7812903 OR",
                asunto: "Inspección técnica ambiental por afluentes mineros en cuenca",
                ubicacion: "Secretaría de Medio Ambiente y Agua",
                prioridad: "Normal",
                fecha: "02 Sep 2026 - 09:45",
                historial: [
                    { fecha: "02 Sep 2026 - 09:45", oficina: "Ventanilla Única", observacion: "Radicación e ingreso de nota." }
                ]
            },
            {
                id: "HR-2026-0003",
                remitente: "Asociación de Productores de Quinua Salinas",
                ci: "3491029 OR",
                asunto: "Convenio interinstitucional para equipamiento de centro de acopio",
                ubicacion: "Secretaría General",
                prioridad: "Muy Urgente",
                fecha: "02 Sep 2026 - 10:15",
                historial: [
                    { fecha: "02 Sep 2026 - 10:15", oficina: "Ventanilla Única", observacion: "Ingreso directo a despacho." }
                ]
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_hojas_ruta_v2", JSON.stringify(hojasRuta));
}

function actualizarContador() {
    const el = document.getElementById("stat-total-tramites");
    if (el) el.textContent = hojasRuta.length;
}

function cambiarPestana(nombre) {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

    const btn = document.querySelector(`.nav-item[onclick*="${nombre}"]`);
    if (btn) btn.classList.add("active");

    const pane = document.getElementById(`pane-${nombre}`);
    if (pane) pane.classList.add("active");

    const titles = {
        registro: "Ventanilla Única de Correspondencia",
        bandeja: "Bandeja Institucional de Hojas de Ruta",
        rastreo: "Rastreo Ciudadano de Hoja de Ruta"
    };
    const t = document.getElementById("page-title");
    if (t && titles[nombre]) t.textContent = titles[nombre];
}

function registrarCorrespondencia(e) {
    e.preventDefault();

    const remitente = document.getElementById("input-remitente").value.trim();
    const ci        = document.getElementById("input-ci").value.trim();
    const asunto    = document.getElementById("input-asunto").value.trim();
    const destino   = document.getElementById("select-destino").value;
    const prioridad = document.getElementById("select-prioridad").value;

    const num = String(hojasRuta.length + 1).padStart(4, "0");
    const id = `HR-2026-${num}`;
    const fecha = new Date().toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' }) + " - " + new Date().toLocaleTimeString('es-BO', {hour:'2-digit', minute:'2-digit'});

    const nueva = {
        id, remitente, ci, asunto, ubicacion: destino, prioridad, fecha,
        historial: [
            { fecha, oficina: "Ventanilla Única", observacion: "Radicación e ingreso de solicitud." },
            { fecha, oficina: destino, observacion: "Derivación inicial automática." }
        ]
    };

    hojasRuta.unshift(nueva);
    guardarLocal();

    document.getElementById("form-correspondencia").reset();
    actualizarContador();
    filtrarHojasRuta();
    mostrarToast(`Hoja de Ruta ${id} radicada exitosamente.`, "success");
    setTimeout(() => abrirFichaHR(id), 300);
}

function eliminarHojaRuta(id) {
    if (confirm(`¿Eliminar la Hoja de Ruta ${id}?`)) {
        hojasRuta = hojasRuta.filter(h => h.id !== id);
        guardarLocal();
        actualizarContador();
        filtrarHojasRuta();
        mostrarToast(`Hoja de Ruta ${id} eliminada.`, "warning");
    }
}

function filtrarHojasRuta() {
    const query = (document.getElementById("input-buscar-hr")?.value ?? "").toLowerCase().trim();

    hojasRutaFiltradas = hojasRuta.filter(h => {
        return !query || h.id.toLowerCase().includes(query) || h.remitente.toLowerCase().includes(query) || h.asunto.toLowerCase().includes(query);
    });

    renderTabla();
}

function renderTabla() {
    const tbody = document.getElementById("tabla-hojas-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    hojasRutaFiltradas.forEach(h => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong style="font-family:'JetBrains Mono',monospace;color:var(--primary-light);">${h.id}</strong>
            </td>
            <td>
                <div style="font-weight:700;color:var(--text-main);">${h.remitente}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);">C.I.: ${h.ci}</div>
            </td>
            <td>
                <span style="font-size:0.8rem;color:var(--text-secondary);">${h.asunto}</span>
            </td>
            <td>
                <span style="font-size:0.75rem;font-weight:700;color:var(--accent-gold);">${h.ubicacion}</span>
            </td>
            <td>
                <span style="font-size:0.72rem;font-weight:800;padding:3px 8px;border-radius:999px;background:${h.prioridad === 'Normal' ? 'rgba(56,189,248,0.15)' : 'rgba(251,113,133,0.15)'};color:${h.prioridad === 'Normal' ? 'var(--primary-light)' : 'var(--accent-rose)'};">${h.prioridad}</span>
            </td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button class="btn-ficha" onclick="abrirFichaHR('${h.id}')" title="Ver Hoja de Ruta A4">
                        Hoja A4
                    </button>
                    <button class="btn-secondary" style="padding:4px 8px;font-size:0.75rem;" onclick="abrirDerivacionModal('${h.id}')" title="Derivar a otra oficina">
                        Derivar
                    </button>
                    <button class="btn-delete" onclick="eliminarHojaRuta('${h.id}')">
                        ✕
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Derivación ──────────────────────────────────────────────────
function abrirDerivacionModal(id) {
    idSeleccionadoDerivacion = id;
    const h = hojasRuta.find(item => item.id === id);
    if (!h) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("deriv-modal-subtitle")) el("deriv-modal-subtitle").textContent = `${h.id} · Remitente: ${h.remitente}`;
    document.getElementById("modal-derivacion-hr").classList.add("open");
}

function cerrarDerivacionModal() {
    document.getElementById("modal-derivacion-hr").classList.remove("open");
    idSeleccionadoDerivacion = null;
}

function guardarDerivacion(e) {
    e.preventDefault();
    if (!idSeleccionadoDerivacion) return;

    const h = hojasRuta.find(item => item.id === idSeleccionadoDerivacion);
    if (!h) return;

    const nuevaOficina = document.getElementById("select-nueva-oficina").value;
    const instruccion   = document.getElementById("input-instruccion").value.trim();
    const fecha = new Date().toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' }) + " - " + new Date().toLocaleTimeString('es-BO', {hour:'2-digit', minute:'2-digit'});

    h.ubicacion = nuevaOficina;
    h.historial.push({ fecha, oficina: nuevaOficina, observacion: instruccion });
    guardarLocal();

    cerrarDerivacionModal();
    filtrarHojasRuta();
    mostrarToast(`Hoja de Ruta ${h.id} derivada a ${nuevaOficina}.`, "success");
}

// ─── Rastreo Ciudadano ───────────────────────────────────────────
function buscarRastreoCiudadano() {
    const cod = (document.getElementById("input-rastreo-codigo")?.value || "").toUpperCase().trim();
    const contenedor = document.getElementById("contenedor-resultado-rastreo");
    if (!cod || !contenedor) return;

    const h = hojasRuta.find(item => item.id === cod);
    if (!h) {
        contenedor.style.display = "block";
        contenedor.innerHTML = `<p style="color:var(--accent-rose);font-weight:700;">No se encontró la Hoja de Ruta "${cod}". Verifique el número de trámite.</p>`;
        return;
    }

    contenedor.style.display = "block";
    contenedor.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--border-subtle);padding-bottom:14px;margin-bottom:16px;">
            <div>
                <h3 style="font-family:var(--font-brand);color:var(--primary-light);font-size:1.2rem;">${h.id}</h3>
                <p style="font-size:0.85rem;color:var(--text-main);margin-top:2px;"><strong>Remitente:</strong> ${h.remitente} (C.I. ${h.ci})</p>
                <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px;"><strong>Asunto:</strong> ${h.asunto}</p>
            </div>
            <span style="font-size:0.75rem;font-weight:800;padding:5px 12px;border-radius:999px;background:rgba(245,158,11,0.15);color:var(--accent-gold);border:1px solid rgba(245,158,11,0.3);">Ubicación: ${h.ubicacion}</span>
        </div>
        <h4 style="font-family:var(--font-brand);font-size:0.9rem;color:var(--text-main);margin-bottom:12px;">LÍNEA DE TIEMPO Y HISTORIAL DE PROVEÍDOS:</h4>
        <div style="display:flex;flex-direction:column;gap:12px;">
            ${h.historial.map((step, idx) => `
                <div style="display:flex;gap:14px;align-items:flex-start;position:relative;">
                    <div style="width:28px;height:28px;border-radius:50%;background:rgba(56,189,248,0.2);border:1px solid var(--primary-light);color:var(--primary-light);font-weight:900;font-size:0.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${idx + 1}</div>
                    <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:10px 14px;border-radius:8px;flex:1;">
                        <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-muted);font-weight:700;">
                            <span>${step.oficina}</span>
                            <span>${step.fecha}</span>
                        </div>
                        <p style="font-size:0.82rem;color:var(--text-main);margin-top:4px;">${step.observacion}</p>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

// ─── Modal A4 & Reporte ───────────────────────────────────────────
function abrirFichaHR(id) {
    const h = hojasRuta.find(item => item.id === id);
    if (!h) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("ficha-hr-subtitle"))  el("ficha-hr-subtitle").textContent  = `${h.id} · Remitente: ${h.remitente}`;
    if (el("ficha-hr-codigo"))    el("ficha-hr-codigo").textContent    = `HOJA DE RUTA DEPARTAMENTAL N° ${h.id}`;
    if (el("ficha-hr-fecha"))     el("ficha-hr-fecha").textContent     = h.fecha;
    if (el("ficha-hr-num"))       el("ficha-hr-num").textContent       = h.id;
    if (el("ficha-hr-remitente")) el("ficha-hr-remitente").textContent = h.remitente;
    if (el("ficha-hr-ci"))        el("ficha-hr-ci").textContent        = h.ci;
    if (el("ficha-hr-asunto"))    el("ficha-hr-asunto").textContent    = h.asunto;
    if (el("ficha-hr-destino"))   el("ficha-hr-destino").textContent   = h.ubicacion;
    if (el("ficha-hr-prioridad")) el("ficha-hr-prioridad").textContent = h.prioridad;

    document.getElementById("modal-ficha-hr").classList.add("open");
}

function cerrarFichaHR() {
    document.getElementById("modal-ficha-hr").classList.remove("open");
}

function imprimirFichaHR() {
    window.print();
}

function generarReporteEjecutivoCorrespondencia() {
    const el = (elementId) => document.getElementById(elementId);
    const tbody = el("reporte-hr-tabla-body");
    if (tbody) {
        tbody.innerHTML = hojasRuta.map(h => `
            <tr>
                <td><strong>${h.id}</strong></td>
                <td>${h.remitente}</td>
                <td>${h.asunto}</td>
                <td>${h.ubicacion}</td>
                <td>${h.prioridad}</td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-correspondencia");
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
