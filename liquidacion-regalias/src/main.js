// ------------------------------------------------------------------
// SISREMIN v1.0 - CONTROL TRIBUTARIO Y REGALÍAS MINERAS DE ORURO
// Lógica de Negocio y Persistencia
// ------------------------------------------------------------------

// 1. Estado de la Aplicación (Carga inicial)
let liquidaciones = JSON.parse(localStorage.getItem('liquidaciones')) || [];

// Cotizaciones Oficiales de Referencia (Simuladas en base a Bolsa de Metales de Londres - LME)
const CONFIG_MINERALES = {
    'Estaño': { cotizacion: 12.50, unidad: 'lb', alicuota: 5.0, factor: 2.20462 },
    'Zinc': { cotizacion: 1.20, unidad: 'lb', alicuota: 5.0, factor: 2.20462 },
    'Plata': { cotizacion: 24.00, unidad: 'oz troy', alicuota: 6.0, factor: 32.1507 },
    'Plomo': { cotizacion: 0.95, unidad: 'lb', alicuota: 5.0, factor: 2.20462 }
};

const TIPO_CAMBIO = 6.86;

// 2. Referencias del DOM (Formulario y Simulación)
const formLiquidacion = document.getElementById('form-liquidacion');
const inputEmpresa = document.getElementById('input-empresa');
const selectMunicipio = document.getElementById('select-municipio');
const selectMineral = document.getElementById('select-mineral');
const inputPesoHumedo = document.getElementById('input-peso-humedo');
const inputHumedad = document.getElementById('input-humedad');
const inputLey = document.getElementById('input-ley');

// Live preview
const valPesoSeco = document.getElementById('val-peso-seco');
const valPesoFino = document.getElementById('val-peso-fino');
const valCotizacion = document.getElementById('val-cotizacion');
const valBrutoBs = document.getElementById('val-bruto-bs');
const valAlicuota = document.getElementById('val-alicuota');
const valRegaliaTotal = document.getElementById('val-regalia-total');

// KPIs
const kpiTotalRecaudacion = document.getElementById('kpi-total-recaudacion');
const kpiTotalGobernacion = document.getElementById('kpi-total-gobernacion');
const kpiTotalMunicipios = document.getElementById('kpi-total-municipios');
const kpiMineralLider = document.getElementById('kpi-mineral-lider');

// Tabla
const tbodyLiquidaciones = document.getElementById('tbody-liquidaciones');
const tablaVacia = document.getElementById('tabla-vacía');

// Modal Boleta
const modalBoleta = document.getElementById('modal-boleta');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnImprimirBoleta = document.getElementById('btn-imprimir-boleta');

// Referencias Internas de la Boleta Imprimible
const bolCodigo = document.getElementById('bol-codigo');
const bolFecha = document.getElementById('bol-fecha');
const bolEmpresa = document.getElementById('bol-empresa');
const bolMunicipio = document.getElementById('bol-municipio');
const bolMineral = document.getElementById('bol-mineral');
const bolCotizacion = document.getElementById('bol-cotizacion');
const bolPesoHumedo = document.getElementById('bol-peso-humedo');
const bolHumedad = document.getElementById('bol-humedad');
const bolPesoSeco = document.getElementById('bol-peso-seco');
const bolLey = document.getElementById('bol-ley');
const bolPesoFino = document.getElementById('bol-peso-fino');
const bolValorBruto = document.getElementById('bol-valor-bruto');
const bolTotalRegalia = document.getElementById('bol-total-regalia');
const bolGobernacion85 = document.getElementById('bol-gobernacion-85');
const bolMunicipio15 = document.getElementById('bol-municipio-15');


// ------------------------------------------------------------------
// CÁLCULOS METALÚRGICOS Y SIMULACIÓN EN VIVO
// ------------------------------------------------------------------
function calcularSimulacion() {
    const mineral = selectMineral.value;
    const pesoHumedo = parseFloat(inputPesoHumedo.value) || 0;
    const humedad = parseFloat(inputHumedad.value) || 0;
    const ley = parseFloat(inputLey.value) || 0;

    if (!mineral || pesoHumedo <= 0 || humedad < 0 || ley <= 0) {
        resetearValoresSimulacion();
        return;
    }

    const conf = CONFIG_MINERALES[mineral];
    
    // 1. Peso Neto Seco
    const pesoSeco = pesoHumedo * (1 - humedad / 100);
    
    // 2. Peso Fino (kg)
    const pesoFinoKg = pesoSeco * (ley / 100);
    
    // 3. Conversión a Unidad de Cotización (libras o onzas troy)
    const pesoFinoUnidad = pesoFinoKg * conf.factor;
    
    // 4. Valor Bruto de Venta en USD y Bs
    const brutoUsd = pesoFinoUnidad * conf.cotizacion;
    const brutoBs = brutoUsd * TIPO_CAMBIO;
    
    // 5. Regalía Minera Total
    const regaliaTotal = brutoBs * (conf.alicuota / 100);

    // Renderizar resultados rápidos
    valPesoSeco.textContent = `${pesoSeco.toFixed(2)} kg`;
    valPesoFino.textContent = `${pesoFinoKg.toFixed(2)} kg`;
    valCotizacion.textContent = `USD ${conf.cotizacion.toFixed(2)} / ${conf.unidad}`;
    valBrutoBs.textContent = `${brutoBs.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    valAlicuota.textContent = `${conf.alicuota.toFixed(1)}%`;
    valRegaliaTotal.textContent = `${regaliaTotal.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
}

function resetearValoresSimulacion() {
    valPesoSeco.textContent = "0.00 kg";
    valPesoFino.textContent = "0.00 kg";
    valCotizacion.textContent = "-";
    valBrutoBs.textContent = "0.00 Bs";
    valAlicuota.textContent = "0.0%";
    valRegaliaTotal.textContent = "0.00 Bs";
}

// ------------------------------------------------------------------
// PERSISTENCIA, KPIs Y TABLA
// ------------------------------------------------------------------
function guardarEstadoYSincronizar() {
    localStorage.setItem('liquidaciones', JSON.stringify(liquidaciones));
    renderizarTabla();
    actualizarKPIs();
}

function actualizarKPIs() {
    if (liquidaciones.length === 0) {
        kpiTotalRecaudacion.textContent = "0.00 Bs";
        kpiTotalGobernacion.textContent = "0.00 Bs";
        kpiTotalMunicipios.textContent = "0.00 Bs";
        kpiMineralLider.textContent = "-";
        return;
    }

    // Sumatorias de aportes declarados
    const totalRecaudado = liquidaciones.reduce((sum, item) => sum + item.regaliaTotal, 0);
    const totalGobernacion = liquidaciones.reduce((sum, item) => sum + item.gobPart, 0);
    const totalMunicipios = liquidaciones.reduce((sum, item) => sum + item.munPart, 0);

    kpiTotalRecaudacion.textContent = `${totalRecaudado.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    kpiTotalGobernacion.textContent = `${totalGobernacion.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    kpiTotalMunicipios.textContent = `${totalMunicipios.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;

    // Buscar el mineral con mayor peso húmedo total extraído (Mineral Líder)
    const volumenes = liquidaciones.reduce((acc, item) => {
        acc[item.mineral] = (acc[item.mineral] || 0) + item.pesoHumedo;
        return acc;
    }, {});

    let lider = "-";
    let maxVol = 0;
    for (const min in volumenes) {
        if (volumenes[min] > maxVol) {
            maxVol = volumenes[min];
            lider = min;
        }
    }

    kpiMineralLider.textContent = lider;
}

function renderizarTabla() {
    tbodyLiquidaciones.innerHTML = '';

    if (liquidaciones.length === 0) {
        tablaVacia.classList.remove('hidden');
        return;
    }

    tablaVacia.classList.add('hidden');

    liquidaciones.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${item.codigo}</strong></td>
            <td>
                <div style="font-weight: 600;">${item.empresa}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Muncipio: ${item.municipio}</div>
            </td>
            <td>${item.mineral}</td>
            <td><strong>${item.regaliaTotal.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs</strong></td>
            <td>${item.gobPart.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs</td>
            <td>
                <div class="action-buttons">
                    <button type="button" class="btn-boleta" onclick="abrirBoleta(${item.id})">📄 Boleta</button>
                    <button type="button" class="btn-delete" onclick="eliminarLiquidacion(${item.id})">&times;</button>
                </div>
            </td>
        `;
        tbodyLiquidaciones.appendChild(fila);
    });
}

// ------------------------------------------------------------------
// ACCIONES DE LIQUIDACIÓN
// ------------------------------------------------------------------
function registrarLiquidacion(event) {
    event.preventDefault();

    const empresa = inputEmpresa.value.trim();
    const municipio = selectMunicipio.value;
    const mineral = selectMineral.value;
    const pesoHumedo = parseFloat(inputPesoHumedo.value);
    const humedad = parseFloat(inputHumedad.value);
    const ley = parseFloat(inputLey.value);

    if (!empresa || !municipio || !mineral || isNaN(pesoHumedo) || isNaN(humedad) || isNaN(ley)) {
        alert("Por favor complete todos los campos de liquidación.");
        return;
    }

    const conf = CONFIG_MINERALES[mineral];
    const pesoSeco = pesoHumedo * (1 - humedad / 100);
    const pesoFinoKg = pesoSeco * (ley / 100);
    const pesoFinoUnidad = pesoFinoKg * conf.factor;
    const brutoUsd = pesoFinoUnidad * conf.cotizacion;
    const brutoBs = brutoUsd * TIPO_CAMBIO;
    const regaliaTotal = brutoBs * (conf.alicuota / 100);
    const gobPart = regaliaTotal * 0.85;
    const munPart = regaliaTotal * 0.15;

    const nuevaLiqui = {
        id: Date.now(),
        codigo: `LQ-MIN-${String(liquidaciones.length + 1).padStart(4, '0')}`,
        fecha: new Date().toLocaleString('es-BO'),
        empresa,
        municipio,
        mineral,
        pesoHumedo,
        humedad,
        pesoSeco,
        ley,
        pesoFinoKg,
        pesoFinoUnidad,
        unidad: conf.unidad,
        cotizacion: conf.cotizacion,
        brutoBs,
        alicuota: conf.alicuota,
        regaliaTotal,
        gobPart,
        munPart
    };

    liquidaciones.push(nuevaLiqui);
    guardarEstadoYSincronizar();

    // Resetear formulario y simulador
    formLiquidacion.reset();
    resetearValoresSimulacion();
    alert(`Liquidación minera registrada correctamente con código: ${nuevaLiqui.codigo}`);
}

window.eliminarLiquidacion = function(id) {
    if (!confirm("¿Está seguro de eliminar esta declaración minera?")) return;
    liquidaciones = liquidaciones.filter(l => l.id !== id);
    guardarEstadoYSincronizar();
};

// ------------------------------------------------------------------
// GESTIÓN DE MODAL Y BOLETA BANCARIA
// ------------------------------------------------------------------
window.abrirBoleta = function(id) {
    const item = liquidaciones.find(l => l.id === id);
    if (!item) return;

    // Poblar boleta imprimible
    bolCodigo.textContent = item.codigo;
    bolFecha.textContent = item.fecha;
    bolEmpresa.textContent = item.empresa;
    bolMunicipio.textContent = item.municipio;
    bolMineral.textContent = item.mineral;
    bolCotizacion.textContent = `USD ${item.cotizacion.toFixed(2)} / ${item.unidad}`;
    bolPesoHumedo.textContent = `${item.pesoHumedo.toLocaleString('es-BO')} kg`;
    bolHumedad.textContent = `${item.humedad.toFixed(1)}%`;
    bolPesoSeco.textContent = `${item.pesoSeco.toFixed(2)} kg`;
    bolLey.textContent = `${item.ley.toFixed(4)}%`;
    bolPesoFino.textContent = `${item.pesoFinoKg.toFixed(2)} kg (${item.pesoFinoUnidad.toLocaleString('es-BO', { maximumFractionDigits: 2 })} ${item.unidad})`;
    bolValorBruto.textContent = `${item.brutoBs.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    bolAlicuota.textContent = `${item.alicuota.toFixed(1)}%`;
    
    // Distribución
    bolTotalRegalia.textContent = `${item.regaliaTotal.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    bolGobernacion85.textContent = `${item.gobPart.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    bolMunicipio15.textContent = `${item.munPart.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;

    // Abrir modal
    modalBoleta.classList.remove('hidden');
    setTimeout(() => {
        modalBoleta.classList.add('open');
    }, 10);
};

function cerrarModal() {
    modalBoleta.classList.remove('open');
    setTimeout(() => {
        modalBoleta.classList.add('hidden');
    }, 300);
}

// ------------------------------------------------------------------
// LISTENERS E INICIALIZACIÓN
// ------------------------------------------------------------------
formLiquidacion.addEventListener('submit', registrarLiquidacion);

// Listeners para cálculos en tiempo real
[selectMineral, inputPesoHumedo, inputHumedad, inputLey].forEach(element => {
    element.addEventListener('input', calcularSimulacion);
});

// Cerrar modal
btnCerrarModal.addEventListener('click', cerrarModal);
modalBoleta.addEventListener('click', (e) => {
    if (e.target === modalBoleta) cerrarModal();
});

// Impresión de boleta
btnImprimirBoleta.addEventListener('click', () => {
    window.print();
});

// Carga Inicial
guardarEstadoYSincronizar();
