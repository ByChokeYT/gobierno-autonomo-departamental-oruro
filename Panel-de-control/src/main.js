// ------------------------------------------------------------------
// GOBERNACIÓN AUTÓNOMA DEPARTAMENTAL DE ORURO
// FASE 3: Análisis de Datos y Renderizado Dinámico (Dashboard)
// ------------------------------------------------------------------

// Base de datos simulada (Fragmentación departamental de Oruro basada en Censo 2024)
const datosOruro = [
    { region: "Oruro (Capital)", poblacion: 300000, hombres: 145000, mujeres: 155000, viviendas: 150000 },
    { region: "Huanuni", poblacion: 35000, hombres: 18000, mujeres: 17000, viviendas: 15000 },
    { region: "Challapata", poblacion: 30000, hombres: 14500, mujeres: 15500, viviendas: 12000 },
    { region: "Otras Provincias", poblacion: 206471, hombres: 105308, mujeres: 101163, viviendas: 93705 }
];

// Referencias al DOM para KPIs de Resumen
const kpiPoblacion = document.getElementById('kpi-poblacion-total');
const kpiViviendas = document.getElementById('kpi-viviendas-total');
const kpiRatio = document.getElementById('kpi-ratio-hombres');

// Referencias al DOM para la Tabla y Acciones
const cuerpoTabla = document.getElementById('cuerpo-tabla-stats');
const btnRecargar = document.getElementById('btn-recargar');

// ------------------------------------------------------------------
// RETO 1: Calcular Totales (Matemáticas y Agregación con Arrays)
// ------------------------------------------------------------------
function calcularYMostrarKPIs() {
    // 1. Calcular la población total usando Array.prototype.reduce()
    const poblacionTotal = datosOruro.reduce((acumulador, region) => acumulador + region.poblacion, 0);
    // Mostrar en el DOM con formato de miles local (es-BO para Bolivia)
    kpiPoblacion.innerText = poblacionTotal.toLocaleString('es-BO');

    // 2. Calcular la suma total de viviendas registradas
    const viviendasTotal = datosOruro.reduce((acumulador, region) => acumulador + region.viviendas, 0);
    kpiViviendas.innerText = viviendasTotal.toLocaleString('es-BO');

    // 3. Calcular la suma total de hombres
    const hombresTotal = datosOruro.reduce((acumulador, region) => acumulador + region.hombres, 0);

    // 4. Calcular el ratio/porcentaje de masculinidad
    // (Población Hombres / Población Total) * 100
    const ratioHombres = (hombresTotal / poblacionTotal) * 100;
    // Mostrar en el DOM con formato de un decimal y el símbolo de porcentaje
    kpiRatio.innerText = `${ratioHombres.toFixed(1)}%`;

    // Quitar clases de procesamiento visual
    kpiPoblacion.classList.remove('procesando');
    kpiViviendas.classList.remove('procesando');
    kpiRatio.classList.remove('procesando');
}

// ------------------------------------------------------------------
// RETO 2: Generar Reporte Detallado (Renderizado Condicional)
// ------------------------------------------------------------------
function renderizarTabla() {
    // 1. Limpiar el cuerpo de la tabla para prevenir duplicados
    cuerpoTabla.innerHTML = '';

    // 2. Recorrer el arreglo de datos e inyectar las filas dinámicamente
    datosOruro.forEach(region => {
        // Crear elemento de fila de tabla <tr>
        const fila = document.createElement('tr');

        // Determinar el badge de densidad de población (Renderizado Condicional)
        let claseBadge = 'badge badge-media';
        let textoBadge = 'Media Densidad';

        if (region.poblacion > 100000) {
            claseBadge = 'badge badge-alta';
            textoBadge = 'Alta Densidad';
        }

        // Estructura interna de celdas formateadas localmente
        fila.innerHTML = `
            <td><strong>${region.region}</strong></td>
            <td>${region.poblacion.toLocaleString('es-BO')}</td>
            <td>${region.hombres.toLocaleString('es-BO')}</td>
            <td>${region.mujeres.toLocaleString('es-BO')}</td>
            <td>${region.viviendas.toLocaleString('es-BO')}</td>
            <td><span class="${claseBadge}">${textoBadge}</span></td>
        `;

        // Añadir la fila finalizada a la tabla
        cuerpoTabla.appendChild(fila);
    });
}

// ------------------------------------------------------------------
// INICIO Y CONTROL DE LA APLICACIÓN (Ciclo de Simulación)
// ------------------------------------------------------------------
function arrancarDashboard() {
    // Añadir efectos visuales de carga (Clase procesando para animar parpadeo)
    kpiPoblacion.innerText = "Procesando...";
    kpiViviendas.innerText = "Procesando...";
    kpiRatio.innerText = "Procesando...";
    
    kpiPoblacion.classList.add('procesando');
    kpiViviendas.classList.add('procesando');
    kpiRatio.classList.add('procesando');

    cuerpoTabla.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px 0;">
                <span class="procesando">Conectando con la Base de Datos Central...</span>
            </td>
        </tr>
    `;

    // Simular latencia de red (800ms) antes de realizar operaciones y renderizar
    setTimeout(() => {
        calcularYMostrarKPIs();
        renderizarTabla();
    }, 800);
}

// Event Listeners
btnRecargar.addEventListener('click', arrancarDashboard);

// Lanzar el arranque automático al cargar la página
document.addEventListener('DOMContentLoaded', arrancarDashboard);