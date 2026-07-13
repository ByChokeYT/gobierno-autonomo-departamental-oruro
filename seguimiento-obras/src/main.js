// Lógica de Negocio - Control de Inversión y Caminos EVM
// Gobernación Autónoma Departamental de Oruro

let proyectos = [];

document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    renderTabla();
    actualizarEstadisticas();
});

// Inicializar con datos semilla para demostrar desviaciones y cálculo EVM
function inicializarDatos() {
    const dataLocal = localStorage.getItem("oruro_proyectos_evm");
    if (dataLocal) {
        proyectos = JSON.parse(dataLocal);
    } else {
        proyectos = [
            {
                id: "PROY-0001",
                nombre: "Mejoramiento de Camino Vecinal Caracollo - La Joya",
                provincia: "Cercado",
                presupuesto: 8000000, // BAC
                avancePlanificado: 50, // %
                avanceReal: 52, // %
                costoReal: 3900000 // AC
            },
            {
                id: "PROY-0002",
                nombre: "Construcción Puente Vehicular Salinas de Garci Mendoza",
                provincia: "Ladislao Cabrera",
                presupuesto: 3500000, // BAC
                avancePlanificado: 80, // %
                avanceReal: 75, // %
                costoReal: 2900000 // AC
            },
            {
                id: "PROY-0003",
                nombre: "Apertura Senda Vial e Integración Choquecota",
                provincia: "Carangas",
                presupuesto: 2000000, // BAC
                avancePlanificado: 60, // %
                avanceReal: 40, // %
                costoReal: 1800000 // AC
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_proyectos_evm", JSON.stringify(proyectos));
}

// Cambiar de vista
function switchTab(tabName) {
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    
    if (tabName === 'dashboard') {
        document.querySelector("button[onclick=\"switchTab('dashboard')\"]").classList.add("active");
        document.getElementById("tab-dashboard").classList.add("active");
        document.getElementById("page-title").innerText = "Monitoreo Financiero de Proyectos Viales";
    } else if (tabName === 'registro') {
        document.querySelector("button[onclick=\"switchTab('registro')\"]").classList.add("active");
        document.getElementById("tab-registro").classList.add("active");
        document.getElementById("page-title").innerText = "Registrar Proyecto Vial";
    }
    
    renderTabla();
    actualizarEstadisticas();
}

// Actualizar contadores superiores
function actualizarEstadisticas() {
    if (proyectos.length === 0) {
        document.getElementById("stat-presupuesto").innerText = "Bs 0.00";
        document.getElementById("stat-spi-promedio").innerText = "0.00";
        document.getElementById("stat-cpi-promedio").innerText = "0.00";
        return;
    }

    let sumaPresupuestos = 0;
    let sumaSpi = 0;
    let sumaCpi = 0;

    proyectos.forEach(p => {
        sumaPresupuestos += parseFloat(p.presupuesto);
        
        // Calcular métricas individuales de EVM
        const evm = calcularEVM(p);
        sumaSpi += evm.spi;
        sumaCpi += evm.cpi;
    });

    const spiPromedio = (sumaSpi / proyectos.length).toFixed(2);
    const cpiPromedio = (sumaCpi / proyectos.length).toFixed(2);

    document.getElementById("stat-presupuesto").innerText = "Bs " + sumaPresupuestos.toLocaleString("es-BO");
    
    // Asignar colores a los promedios globales
    const spiEl = document.getElementById("stat-spi-promedio");
    spiEl.innerText = spiPromedio;
    spiEl.className = "stat-num " + obtenerColorIndicador(spiPromedio);

    const cpiEl = document.getElementById("stat-cpi-promedio");
    cpiEl.innerText = cpiPromedio;
    cpiEl.className = "stat-num " + obtenerColorIndicador(cpiPromedio);
}

// Renderizar la tabla con las barras de progreso dobles
function renderTabla() {
    const tbody = document.getElementById("tabla-proyectos");
    const emptyState = document.getElementById("estado-vacio");
    tbody.innerHTML = "";

    if (proyectos.length === 0) {
        emptyState.style.display = "flex";
        return;
    } else {
        emptyState.style.display = "none";
    }

    proyectos.forEach(p => {
        const evm = calcularEVM(p);
        const tr = document.createElement("tr");

        // Formato para mostrar desviaciones monetarias
        let desviacionHTML = "";
        if (evm.cv >= 0) {
            desviacionHTML += `<span class="text-success" style="font-size: 0.8rem; font-weight: 600; display: block;">CV: +Bs ${evm.cv.toLocaleString("es-BO")}</span>`;
        } else {
            desviacionHTML += `<span class="text-danger" style="font-size: 0.8rem; font-weight: 600; display: block;">CV: -Bs ${Math.abs(evm.cv).toLocaleString("es-BO")}</span>`;
        }

        if (evm.sv >= 0) {
            desviacionHTML += `<span class="text-success" style="font-size: 0.8rem; font-weight: 600; display: block;">SV: +Bs ${evm.sv.toLocaleString("es-BO")}</span>`;
        } else {
            desviacionHTML += `<span class="text-danger" style="font-size: 0.8rem; font-weight: 600; display: block;">SV: -Bs ${Math.abs(evm.sv).toLocaleString("es-BO")}</span>`;
        }

        // Obtener clases para insignias SPI y CPI
        const classSpi = obtenerClaseEval(evm.spi);
        const classCpi = obtenerClaseEval(evm.cpi);

        // Clase de color de la barra real
        const barClass = evm.spi >= 1.0 ? "bar-optimo" : (evm.spi >= 0.85 ? "bar-alerta" : "bar-critico");

        tr.innerHTML = `
            <td>
                <strong>${p.nombre}</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Provincia: ${p.provincia}</span>
            </td>
            <td>Bs ${parseFloat(p.presupuesto).toLocaleString("es-BO")}</td>
            <td>Bs ${parseFloat(p.costoReal).toLocaleString("es-BO")}</td>
            <td>
                <div class="progress-double-wrapper">
                    <div class="progress-double">
                        <!-- Capa Planificada -->
                        <div class="progress-double-planned" style="width: ${p.avancePlanificado}%;"></div>
                        <!-- Capa Real -->
                        <div class="progress-double-real ${barClass}" style="width: ${p.avanceReal}%;"></div>
                    </div>
                    <div class="progress-double-labels">
                        <span>Plan: ${p.avancePlanificado}%</span>
                        <span>Real: ${p.avanceReal}%</span>
                    </div>
                </div>
            </td>
            <td>
                <span class="badge-eval ${classSpi}">
                    ${evm.spi.toFixed(2)}
                </span>
            </td>
            <td>
                <span class="badge-eval ${classCpi}">
                    ${evm.cpi.toFixed(2)}
                </span>
            </td>
            <td>
                ${desviacionHTML}
            </td>
            <td>
                <button class="btn-delete" onclick="eliminarProyecto('${p.id}')">🗑️ Dar de Baja</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Calcular valores EVM
function calcularEVM(p) {
    const bac = parseFloat(p.presupuesto);
    const avPlan = parseFloat(p.avancePlanificado) / 100;
    const avReal = parseFloat(p.avanceReal) / 100;
    const ac = parseFloat(p.costoReal);

    // Fórmulas
    const pv = bac * avPlan;
    const ev = bac * avReal;

    const cv = ev - ac;
    const sv = ev - pv;

    // Control de divisiones por cero
    const cpi = ac > 0 ? (ev / ac) : 1.0;
    const spi = pv > 0 ? (ev / pv) : 1.0;

    return { pv, ev, ac, cv, sv, cpi, spi };
}

// Obtener clase de semáforo para la UI
function obtenerClaseEval(index) {
    if (index >= 1.0) return "eval-optimo";
    if (index >= 0.85) return "eval-alerta";
    return "eval-critico";
}

// Obtener color de texto para cabecera
function obtenerColorIndicador(index) {
    if (index >= 1.0) return "text-success";
    if (index >= 0.85) return "text-warning";
    return "text-danger";
}

// Registrar nueva obra
function registrarProyecto(e) {
    e.preventDefault();

    const nombre = document.getElementById("pro-nombre").value.trim();
    const provincia = document.getElementById("pro-provincia").value;
    const presupuesto = document.getElementById("pro-presupuesto").value;
    const avancePlanificado = document.getElementById("pro-avance-plan").value;
    const avanceReal = document.getElementById("pro-avance-real").value;
    const costoReal = document.getElementById("pro-costo-real").value;

    const id = `PROY-${String(proyectos.length + 1).padStart(4, "0")}`;

    const nuevo = {
        id,
        nombre,
        provincia,
        presupuesto,
        avancePlanificado,
        avanceReal,
        costoReal
    };

    proyectos.push(nuevo);
    guardarLocal();

    // Resetear formulario
    document.getElementById("form-proyecto").reset();
    switchTab('dashboard');
}

// Eliminar obra
function eliminarProyecto(id) {
    if (confirm(`¿Dar de baja del sistema de monitoreo al proyecto vial ${id}?`)) {
        proyectos = proyectos.filter(p => p.id !== id);
        guardarLocal();
        renderTabla();
        actualizarEstadisticas();
    }
}
