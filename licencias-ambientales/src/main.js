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
let sortConfig = { campo: 'codigo', asc: true };

// ─── Inicialización ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    iniciarRelojVivo();
    actualizarEstadisticas();
    actualizarColoresMapa();
    filtrarLicencias();
    inicializarEventosMapa();
    calcularRiesgoFormulario();

    // Atajo de teclado Ctrl + K → Búsqueda
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
                operador: "Pavimentado Avenida Principal Oruro",
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

    const titles = {
        mapa:     "Mapa de Riesgo Ambiental Departamental",
        registro: "Registrar Nueva Licencia Ambiental"
    };

    const pageTitle = document.getElementById("page-title");
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    actualizarEstadisticas();
    actualizarColoresMapa();
    filtrarLicencias();
}

// ─── Estadísticas & KPIs ─────────────────────────────────────────
function actualizarEstadisticas() {
    const total = licencias.length;
    const criticos = licencias.filter(l => l.riesgo === "Alto").length;
    const minerias = licencias.filter(l => l.tipoActividad === "Minería Pesada" || l.tipoActividad === "Concentración de Minerales").length;

    const el = (id) => document.getElementById(id);
    if (el("stat-total"))    el("stat-total").textContent    = total;
    if (el("stat-critico"))  el("stat-critico").textContent  = criticos;
    if (el("stat-minerias")) el("stat-minerias").textContent = minerias;
    if (el("nav-count"))     el("nav-count").textContent     = total;
}

// ─── Filtrado y Búsqueda ──────────────────────────────────────────
function filtrarLicencias() {
    const query     = (document.getElementById("input-buscar")?.value ?? "").toLowerCase().trim();
    const actividad = document.getElementById("filtro-actividad")?.value ?? "";
    const riesgo    = document.getElementById("filtro-riesgo")?.value ?? "";
    const title     = document.getElementById("table-title");

    licenciasFiltradas = licencias.filter(l => {
        const q = !query
            || l.codigo.toLowerCase().includes(query)
            || l.operador.toLowerCase().includes(query)
            || l.provincia.toLowerCase().includes(query)
            || l.tipoActividad.toLowerCase().includes(query);

        const a = !actividad || l.tipoActividad === actividad;
        const r = !riesgo || l.riesgo === riesgo;
        const p = !filtroProvinciaActivo || l.provincia.toLowerCase() === filtroProvinciaActivo.toLowerCase();

        return q && a && r && p;
    });

    if (title) {
        if (filtroProvinciaActivo) {
            const provEl = document.getElementById(`prov-${filtroProvinciaActivo}`);
            const nombreHumano = provEl ? provEl.getAttribute("data-nombre") : filtroProvinciaActivo;
            title.textContent = `Registros en Prov. ${nombreHumano}`;
        } else {
            title.textContent = "Registros Ambientales (Todos)";
        }
    }

    licenciasFiltradas = ordenarLicencias(licenciasFiltradas);
    renderTabla();

    const badge = document.getElementById("filter-result-badge");
    if (badge) badge.textContent = `${licenciasFiltradas.length} resultado${licenciasFiltradas.length !== 1 ? 's' : ''}`;

    const altosCount = licenciasFiltradas.filter(l => l.riesgo === "Alto").length;
    const pctAltos   = licenciasFiltradas.length > 0 ? Math.round((altosCount / licenciasFiltradas.length) * 100) : 0;

    const footerCount = document.getElementById("table-total-count");
    const footerRiesgo = document.getElementById("table-total-riesgo");
    if (footerCount)  footerCount.textContent  = `${licenciasFiltradas.length} de ${licencias.length} licencias`;
    if (footerRiesgo) footerRiesgo.textContent = `${pctAltos}% Riesgo Alto en esta vista`;
}

function limpiarFiltros() {
    const ids = ["input-buscar", "filtro-actividad", "filtro-riesgo"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    filtrarLicencias();
}

// ─── Ordenamiento ─────────────────────────────────────────────────
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
        if (sortConfig.campo === "score") {
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
    const tbody      = document.getElementById("tabla-licencias");
    const emptyState = document.getElementById("estado-vacio-licencias");

    tbody.innerHTML = "";

    if (licenciasFiltradas.length === 0) {
        if (emptyState) emptyState.style.display = "flex";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    licenciasFiltradas.forEach((lic, idx) => {
        const tr = document.createElement("tr");
        tr.style.animationDelay = `${idx * 0.03}s`;

        let badgeClass = "badge-bajo";
        if (lic.riesgo === "Medio") badgeClass = "badge-medio";
        if (lic.riesgo === "Alto")  badgeClass = "badge-alto";

        const provEl = document.getElementById(`prov-${lic.provincia}`);
        const provNombre = provEl ? provEl.getAttribute("data-nombre") : lic.provincia;

        tr.innerHTML = `
            <td>
                <div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.82rem;color:#fff;">${lic.codigo}</div>
                <div style="font-size:0.65rem;color:var(--text-muted);">${lic.fecha || ''}</div>
            </td>
            <td>
                <div style="font-weight:700;font-size:0.875rem;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${lic.operador}">${lic.operador}</div>
            </td>
            <td>
                <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${provNombre}</span>
            </td>
            <td>
                <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);">${lic.tipoActividad}</span>
            </td>
            <td>
                <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:0.85rem;color:var(--primary-light);">${lic.score} Pts</span>
            </td>
            <td>
                <span class="badge ${badgeClass}"><span class="badge-dot-indicator"></span> ${lic.riesgo}</span>
            </td>
            <td>
                <button class="btn-delete" onclick="eliminarLicencia('${lic.codigo}')" title="Eliminar registro">
                    <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Calculadora de Riesgo Formulario ─────────────────────────────
function calcularRiesgoFormulario() {
    const tipo         = document.getElementById("lic-tipo-actividad")?.value ?? "Minería Pesada";
    const chkAgua      = document.getElementById("chk-agua")?.checked ?? false;
    const chkPoblacion = document.getElementById("chk-poblacion")?.checked ?? false;
    const chkReserva   = document.getElementById("chk-reserva")?.checked ?? false;

    let score = 1;
    if (tipo === "Minería Pesada") score = 3;
    if (tipo === "Concentración de Minerales") score = 3;
    if (tipo === "Agroindustrial") score = 2;

    if (chkAgua) score += 3;
    if (chkPoblacion) score += 2;
    if (chkReserva) score += 3;

    let riesgo = "Bajo";
    let bgCircle = "var(--success)";
    if (score >= 4 && score <= 6) {
        riesgo = "Medio";
        bgCircle = "var(--warning)";
    } else if (score >= 7) {
        riesgo = "Alto";
        bgCircle = "var(--danger)";
    }

    const circle  = document.getElementById("riesgo-score-circ");
    const detalle = document.getElementById("riesgo-detalle");

    if (circle) {
        circle.textContent = score;
        circle.style.backgroundColor = bgCircle;
    }

    if (detalle) {
        detalle.innerHTML = `Actividad: <strong>${tipo}</strong>. Puntaje acumulado: <strong>${score} Pts</strong>. Categoría: <strong style="color:${bgCircle}">${riesgo} Riesgo</strong>.`;
    }

    return { score, riesgo };
}

// ─── Registrar Nueva Licencia ─────────────────────────────────────
function registrarNuevaLicencia(e) {
    e.preventDefault();

    const operador      = document.getElementById("lic-operador").value.trim();
    const tipoActividad = document.getElementById("lic-tipo-actividad").value;
    const provincia     = document.getElementById("lic-provincia").value;

    const vulnerabilidad = {
        agua:      document.getElementById("chk-agua").checked,
        poblacion: document.getElementById("chk-poblacion").checked,
        reserva:   document.getElementById("chk-reserva").checked
    };

    const calculo = calcularRiesgoFormulario();
    const numCorrelativo = String(licencias.length + 1).padStart(4, "0");
    const codigo = `LIC-2026-${numCorrelativo}`;
    const fecha = obtenerFechaHoraActual();

    const nueva = {
        codigo, operador, tipoActividad, provincia, vulnerabilidad,
        score: calculo.score, riesgo: calculo.riesgo, fecha
    };

    licencias.unshift(nueva);
    guardarLocal();

    document.getElementById("form-licencia").reset();
    calcularRiesgoFormulario();

    mostrarToast(`Licencia ${codigo} emitida (${calculo.riesgo} Riesgo).`, "success");
    switchTab('mapa');
}

// ─── Eliminar Licencia ────────────────────────────────────────────
function eliminarLicencia(codigo) {
    const lic = licencias.find(l => l.codigo === codigo);
    if (!lic) return;

    if (confirm(`¿Confirmar eliminación permanente de la licencia ${codigo} ("${lic.operador}")?`)) {
        licencias = licencias.filter(l => l.codigo !== codigo);
        guardarLocal();
        actualizarEstadisticas();
        actualizarColoresMapa();
        filtrarLicencias();
        mostrarToast(`Licencia ${codigo} eliminada.`, "warning");
    }
}

// ─── Eventos del Mapa SVG Interactivo ─────────────────────────────
function inicializarEventosMapa() {
    const tooltip    = document.getElementById("map-tooltip");
    const provincias = document.querySelectorAll(".provincia");

    provincias.forEach(prov => {
        const id = prov.id.replace("prov-", "");
        const nombre = prov.getAttribute("data-nombre");

        prov.addEventListener("mouseover", (e) => {
            const provLicencias = licencias.filter(l => l.provincia.toLowerCase() === id.toLowerCase());
            const total = provLicencias.length;

            let riesgoMedio = "Sin registros";
            let colorCode   = "var(--text-muted)";

            if (total > 0) {
                const totalScore = provLicencias.reduce((sum, current) => sum + current.score, 0);
                const avgScore = totalScore / total;

                if (avgScore >= 7)       { riesgoMedio = "Alto";  colorCode = "var(--danger)"; }
                else if (avgScore >= 4)  { riesgoMedio = "Medio"; colorCode = "var(--warning)"; }
                else                    { riesgoMedio = "Bajo";  colorCode = "var(--success)"; }
            }

            if (tooltip) {
                tooltip.innerHTML = `
                    <strong style="color:#fff;font-size:0.85rem;">Provincia ${nombre}</strong><br>
                    <span style="color:var(--text-muted);">Licencias registradas:</span> <strong>${total}</strong><br>
                    <span style="color:var(--text-muted);">Riesgo Promedio:</span> <strong style="color:${colorCode}">${riesgoMedio}</strong>
                `;
                tooltip.style.opacity = 1;
            }
        });

        prov.addEventListener("mousemove", (e) => {
            const container = document.querySelector(".map-container");
            if (tooltip && container) {
                const rect = container.getBoundingClientRect();
                tooltip.style.left = (e.clientX - rect.left + 15) + "px";
                tooltip.style.top  = (e.clientY - rect.top + 15)  + "px";
            }
        });

        prov.addEventListener("mouseout", () => {
            if (tooltip) tooltip.style.opacity = 0;
        });

        prov.addEventListener("click", () => {
            if (filtroProvinciaActivo === id) {
                resetFiltroProvincia();
            } else {
                filtroProvinciaActivo = id;
                provincias.forEach(p => p.classList.remove("active-filter"));
                prov.classList.add("active-filter");
                filtrarLicencias();
                mostrarToast(`Filtro aplicado: Prov. ${nombre}`, "info");
            }
        });
    });
}

function resetFiltroProvincia() {
    filtroProvinciaActivo = null;
    document.querySelectorAll(".provincia").forEach(p => p.classList.remove("active-filter"));
    filtrarLicencias();
}

function actualizarColoresMapa() {
    const provincias = document.querySelectorAll(".provincia");

    provincias.forEach(prov => {
        const id = prov.id.replace("prov-", "");
        prov.classList.remove("riesgo-bajo", "riesgo-medio", "riesgo-alto");

        const provLicencias = licencias.filter(l => l.provincia.toLowerCase() === id.toLowerCase());
        const total = provLicencias.length;

        if (total > 0) {
            const totalScore = provLicencias.reduce((sum, curr) => sum + curr.score, 0);
            const avg = totalScore / total;

            if (avg >= 7)      prov.classList.add("riesgo-alto");
            else if (avg >= 4) prov.classList.add("riesgo-medio");
            else               prov.classList.add("riesgo-bajo");
        }
    });
}

// ─── Exportar CSV ─────────────────────────────────────────────────
function exportarCSV() {
    if (licencias.length === 0) {
        mostrarToast("No hay licencias para exportar.", "warning");
        return;
    }

    const BOM = "\uFEFF";
    const headers = ["CodigoLicencia", "OperadorProyecto", "TipoActividad", "Provincia", "ScoreRiesgo", "CategoriaRiesgo", "FechaRegistro"];
    const rows = licencias.map(l => [l.codigo, l.operador, l.tipoActividad, l.provincia, l.score, l.riesgo, l.fecha || ""]);

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
    return `${ahora.getDate()} ${meses[ahora.getMonth()]} ${ahora.getFullYear()} - ${String(ahora.getHours()).padStart(2,"0")}:${String(ahora.getMinutes()).padStart(2,"0")}`;
}

function mostrarToast(mensaje, tipo = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const ICONS = {
        success: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
        warning: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
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
