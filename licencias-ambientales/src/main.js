// Lógica de Negocio - Control de Licencias Ambientales
// Gobernación Autónoma Departamental de Oruro

let licencias = [];
let filtroProvinciaActivo = null;

// Cargar datos
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    actualizarEstadisticas();
    actualizarColoresMapa();
    renderTabla();
    inicializarEventosMapa();
    calcularRiesgoFormulario(); // Inicializar vista en formulario
});

// Inicializar datos semilla
function inicializarDatos() {
    const dataLocal = localStorage.getItem("oruro_licencias");
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
                score: 8, // 3 base + 3 agua + 2 poblacion
                riesgo: "Alto"
            },
            {
                codigo: "LIC-2026-0002",
                operador: "Planta Procesadora de Lácteos Challapata",
                tipoActividad: "Agroindustrial",
                provincia: "Abaroa",
                vulnerabilidad: { agua: false, poblacion: true, reserva: false },
                score: 4, // 2 base + 2 poblacion
                riesgo: "Medio"
            },
            {
                codigo: "LIC-2026-0003",
                operador: "Dique de Colas Minera Bolivar",
                tipoActividad: "Concentración de Minerales",
                provincia: "Poopo",
                vulnerabilidad: { agua: true, poblacion: false, reserva: true },
                score: 9, // 3 base + 3 agua + 3 reserva
                riesgo: "Alto"
            },
            {
                codigo: "LIC-2026-0004",
                operador: "Proyecto de Riego Tecnificado Sabaya",
                tipoActividad: "Servicios/Infraestructura",
                provincia: "Sabaya",
                vulnerabilidad: { agua: true, poblacion: false, reserva: false },
                score: 4, // 1 base + 3 agua
                riesgo: "Medio"
            },
            {
                codigo: "LIC-2026-0005",
                operador: "Pavimentado Avenida Principal Oruro",
                tipoActividad: "Servicios/Infraestructura",
                provincia: "Cercado",
                vulnerabilidad: { agua: false, poblacion: true, reserva: false },
                score: 3, // 1 base + 2 poblacion
                riesgo: "Bajo"
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_licencias", JSON.stringify(licencias));
}

// Cambiar de vista
function switchTab(tabName) {
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    
    if (tabName === 'mapa') {
        document.querySelector("button[onclick=\"switchTab('mapa')\"]").classList.add("active");
        document.getElementById("tab-mapa").classList.add("active");
        document.getElementById("page-title").innerText = "Mapa de Riesgo Ambiental Departamental";
    } else if (tabName === 'registro') {
        document.querySelector("button[onclick=\"switchTab('registro')\"]").classList.add("active");
        document.getElementById("tab-registro").classList.add("active");
        document.getElementById("page-title").innerText = "Registrar Licencia Ambiental";
    }
    
    actualizarEstadisticas();
    actualizarColoresMapa();
    renderTabla();
}

// Calcular contadores
function actualizarEstadisticas() {
    const total = licencias.length;
    const criticos = licencias.filter(l => l.riesgo === "Alto").length;
    const minerias = licencias.filter(l => l.tipoActividad === "Minería Pesada" || l.tipoActividad === "Concentración de Minerales").length;

    document.getElementById("stat-total").innerText = total;
    document.getElementById("stat-critico").innerText = criticos;
    document.getElementById("stat-minerias").innerText = minerias;
}

// Renderizar listado de la bandeja
function renderTabla() {
    const tbody = document.getElementById("tabla-licencias");
    const emptyState = document.getElementById("estado-vacio-licencias");
    const title = document.getElementById("table-title");
    tbody.innerHTML = "";

    // Filtrar si hay una provincia seleccionada
    let filtradas = licencias;
    if (filtroProvinciaActivo) {
        filtradas = licencias.filter(l => l.provincia.toLowerCase() === filtroProvinciaActivo.toLowerCase());
        const provEl = document.getElementById(`prov-${filtroProvinciaActivo}`);
        const nombreHumano = provEl ? provEl.getAttribute("data-nombre") : filtroProvinciaActivo;
        title.innerText = `Registros en Prov. ${nombreHumano}`;
    } else {
        title.innerText = "Registros Ambientales (Todos)";
    }

    if (filtradas.length === 0) {
        emptyState.style.display = "flex";
        return;
    } else {
        emptyState.style.display = "none";
    }

    filtradas.forEach(lic => {
        const tr = document.createElement("tr");
        
        let badgeCls = "badge-bajo";
        if (lic.riesgo === "Medio") badgeCls = "badge-medio";
        if (lic.riesgo === "Alto") badgeCls = "badge-alto";

        // Mapear provincia ID a Nombre Humano
        const provEl = document.getElementById(`prov-${lic.provincia}`);
        const provNombre = provEl ? provEl.getAttribute("data-nombre") : lic.provincia;

        tr.innerHTML = `
            <td><strong>${lic.codigo}</strong></td>
            <td>${lic.operador}</td>
            <td>${provNombre}</td>
            <td>${lic.tipoActividad}</td>
            <td>${lic.score} Pts</td>
            <td><span class="badge ${badgeCls}">${lic.riesgo}</span></td>
            <td>
                <button class="btn-delete" onclick="eliminarLicencia('${lic.codigo}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Lógica de cálculo en caliente del formulario
function calcularRiesgoFormulario() {
    const tipo = document.getElementById("lic-tipo-actividad").value;
    const chkAgua = document.getElementById("chk-agua").checked;
    const chkPoblacion = document.getElementById("chk-poblacion").checked;
    const chkReserva = document.getElementById("chk-reserva").checked;

    // Calcular score
    let score = 1; // Base
    if (tipo === "Minería Pesada") score = 3;
    if (tipo === "Concentración de Minerales") score = 3;
    if (tipo === "Agroindustrial") score = 2;

    if (chkAgua) score += 3;
    if (chkPoblacion) score += 2;
    if (chkReserva) score += 3;

    // Clasificar riesgo
    let riesgo = "Bajo";
    let bgCircle = "#10b981"; // Verde
    if (score >= 4 && score <= 6) {
        riesgo = "Medio";
        bgCircle = "#f59e0b"; // Naranja
    } else if (score >= 7) {
        riesgo = "Alto";
        bgCircle = "#ef4444"; // Rojo
    }

    // Actualizar vista del formulario
    const circle = document.getElementById("riesgo-score-circ");
    circle.innerText = score;
    circle.style.backgroundColor = bgCircle;

    document.getElementById("riesgo-detalle").innerHTML = `Actividad: <strong>${tipo}</strong>. Puntaje final: <strong>${score} Pts</strong>. Riesgo de impacto: <strong style="color: ${bgCircle}">${riesgo}</strong>.`;

    return { score, riesgo };
}

// Registrar desde el formulario
function registrarNuevaLicencia(e) {
    e.preventDefault();

    const operador = document.getElementById("lic-operador").value.trim();
    const tipoActividad = document.getElementById("lic-tipo-actividad").value;
    const provincia = document.getElementById("lic-provincia").value;
    
    const vulnerabilidad = {
        agua: document.getElementById("chk-agua").checked,
        poblacion: document.getElementById("chk-poblacion").checked,
        reserva: document.getElementById("chk-reserva").checked
    };

    const calculo = calcularRiesgoFormulario();

    const numCorrelativo = String(licencias.length + 1).padStart(4, "0");
    const codigo = `LIC-2026-${numCorrelativo}`;

    const nueva = {
        codigo,
        operador,
        tipoActividad,
        provincia,
        vulnerabilidad,
        score: calculo.score,
        riesgo: calculo.riesgo
    };

    licencias.push(nueva);
    guardarLocal();

    // Resetear
    document.getElementById("form-licencia").reset();
    calcularRiesgoFormulario();

    // Volver al mapa
    switchTab('mapa');
}

// Eliminar
function eliminarLicencia(codigo) {
    if (confirm(`¿Eliminar la licencia ambiental permanente ${codigo}?`)) {
        licencias = licencias.filter(l => l.codigo !== codigo);
        guardarLocal();
        actualizarEstadisticas();
        actualizarColoresMapa();
        renderTabla();
    }
}

// Inicializar eventos de interacción sobre el SVG del mapa
function inicializarEventosMapa() {
    const tooltip = document.getElementById("map-tooltip");
    const provincias = document.querySelectorAll(".provincia");

    provincias.forEach(prov => {
        const id = prov.id.replace("prov-", "");
        const nombre = prov.getAttribute("data-nombre");

        prov.addEventListener("mouseover", (e) => {
            // Obtener estadísticas de esta provincia
            const provLicencias = licencias.filter(l => l.provincia.toLowerCase() === id.toLowerCase());
            const total = provLicencias.length;
            
            let riesgoMedio = "Ninguno";
            if (total > 0) {
                const totalScore = provLicencias.reduce((sum, current) => sum + current.score, 0);
                const avgScore = totalScore / total;
                if (avgScore >= 7) riesgoMedio = "Alto";
                else if (avgScore >= 4) riesgoMedio = "Medio";
                else riesgoMedio = "Bajo";
            }

            tooltip.innerHTML = `
                <strong>Provincia ${nombre}</strong><br>
                Operaciones: ${total}<br>
                Riesgo Promedio: <span style="font-weight: 800; color: ${
                    riesgoMedio === 'Alto' ? '#ef4444' : (riesgoMedio === 'Medio' ? '#f59e0b' : '#10b981')
                }">${riesgoMedio}</span>
            `;
            tooltip.style.opacity = 1;
        });

        prov.addEventListener("mousemove", (e) => {
            // Posicionar tooltip relativo al contenedor del mapa
            const rect = document.querySelector(".map-container").getBoundingClientRect();
            tooltip.style.left = (e.clientX - rect.left + 15) + "px";
            tooltip.style.top = (e.clientY - rect.top + 15) + "px";
        });

        prov.addEventListener("mouseout", () => {
            tooltip.style.opacity = 0;
        });

        prov.addEventListener("click", () => {
            // Toggle filtro de provincia
            if (filtroProvinciaActivo === id) {
                resetFiltroProvincia();
            } else {
                filtroProvinciaActivo = id;
                provincias.forEach(p => p.classList.remove("active-filter"));
                prov.classList.add("active-filter");
                renderTabla();
            }
        });
    });
}

// Reiniciar filtros del mapa
function resetFiltroProvincia() {
    filtroProvinciaActivo = null;
    document.querySelectorAll(".provincia").forEach(p => p.classList.remove("active-filter"));
    renderTabla();
}

// Pintar el mapa con el nivel de riesgo promedio de cada provincia
function actualizarColoresMapa() {
    const provincias = document.querySelectorAll(".provincia");
    
    provincias.forEach(prov => {
        const id = prov.id.replace("prov-", "");
        
        // Limpiar clases de riesgo
        prov.classList.remove("riesgo-bajo", "riesgo-medio", "riesgo-alto");

        const provLicencias = licencias.filter(l => l.provincia.toLowerCase() === id.toLowerCase());
        const total = provLicencias.length;

        if (total > 0) {
            const totalScore = provLicencias.reduce((sum, curr) => sum + curr.score, 0);
            const avg = totalScore / total;

            if (avg >= 7) {
                prov.classList.add("riesgo-alto");
            } else if (avg >= 4) {
                prov.classList.add("riesgo-medio");
            } else {
                prov.classList.add("riesgo-bajo");
            }
        }
    });
}
