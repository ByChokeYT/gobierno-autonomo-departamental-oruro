// Lógica de Negocio - Conciliación de Vales de Combustible
// Gobernación Autónoma Departamental de Oruro

let vales = [];
let tanqueGasolina = 4200; // Capacidad inicial (Max: 5000 Lts)
let tanqueDiesel = 4500;   // Capacidad inicial (Max: 5000 Lts)
let valeSeleccionado = null;

// Sal secreta gubernamental para firmar los tokens
const GOB_SECRET = "LEY-1178-ORURO-2026-SEGURIDAD";

document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    renderTabla();
    actualizarEstadisticas();
});

// Inicializar base de datos local
function inicializarDatos() {
    const dataLocalVales = localStorage.getItem("oruro_vales_combustible");
    const dataLocalGasolina = localStorage.getItem("oruro_tanque_gasolina");
    const dataLocalDiesel = localStorage.getItem("oruro_tanque_diesel");

    if (dataLocalVales) {
        vales = JSON.parse(dataLocalVales);
    } else {
        vales = [
            {
                codigo: "VAL-2026-0001",
                conductor: "Oscar Valenzuela Perez",
                placa: "2451-FDS",
                tipo: "Gasolina Especial",
                litros: 40,
                destino: "Comisión de Inspección de Caminos Toledo",
                fecha: "12 de Enero de 2026",
                token: "SHA-OR-8F32C69DA564BC12"
            },
            {
                codigo: "VAL-2026-0002",
                conductor: "Ramiro Rocha Perez",
                placa: "3429-UYX",
                tipo: "Diésel Oíl",
                litros: 80,
                destino: "Transporte de Maquinaria Pesada Challapata",
                fecha: "15 de Febrero de 2026",
                token: "SHA-OR-A3B43C56D78E12F5"
            }
        ];
        guardarLocalVales();
    }

    tanqueGasolina = dataLocalGasolina ? parseFloat(dataLocalGasolina) : 4180; // 4200 - 40 (vales iniciales aproximados)
    tanqueDiesel = dataLocalDiesel ? parseFloat(dataLocalDiesel) : 4420;     // 4500 - 80

    guardarInventario();
}

function guardarLocalVales() {
    localStorage.setItem("oruro_vales_combustible", JSON.stringify(vales));
}

function guardarInventario() {
    localStorage.setItem("oruro_tanque_gasolina", tanqueGasolina);
    localStorage.setItem("oruro_tanque_diesel", tanqueDiesel);
}

// Cambiar de Pestaña
function switchTab(tabName) {
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    
    if (tabName === 'vales') {
        document.querySelector("button[onclick=\"switchTab('vales')\"]").classList.add("active");
        document.getElementById("tab-vales").classList.add("active");
        document.getElementById("page-title").innerText = "Gestión de Vales de Combustible";
    } else if (tabName === 'registro') {
        document.querySelector("button[onclick=\"switchTab('registro')\"]").classList.add("active");
        document.getElementById("tab-registro").classList.add("active");
        document.getElementById("page-title").innerText = "Emitir Vale de Combustible";
    }
    
    renderTabla();
    actualizarEstadisticas();
}

// Actualizar KPIs superiores
function actualizarEstadisticas() {
    // Suma de litros emitidos
    const totalLitros = vales.reduce((sum, v) => sum + parseInt(v.litros), 0);
    document.getElementById("stat-litros").innerText = `${totalLitros} Lts`;

    // Niveles de los tanques
    const gasolinaEl = document.getElementById("stat-tanque-gasolina");
    gasolinaEl.innerText = `${tanqueGasolina.toFixed(0)} Lts`;
    gasolinaEl.className = tanqueGasolina < 1000 ? "stat-num text-danger" : "stat-num text-warning";

    const dieselEl = document.getElementById("stat-tanque-diesel");
    dieselEl.innerText = `${tanqueDiesel.toFixed(0)} Lts`;
    dieselEl.className = tanqueDiesel < 1000 ? "stat-num text-danger" : "stat-num text-info";

    // Alerta de Reserva Crítica (< 1000 Litros o 20%)
    const alertaEl = document.getElementById("alerta-reserva");
    if (tanqueGasolina < 1000 || tanqueDiesel < 1000) {
        alertaEl.style.display = "block";
    } else {
        alertaEl.style.display = "none";
    }
}

// Renderizar tabla
function renderTabla() {
    const tbody = document.getElementById("tabla-vales");
    const emptyState = document.getElementById("estado-vacio");
    tbody.innerHTML = "";

    if (vales.length === 0) {
        emptyState.style.display = "flex";
        return;
    } else {
        emptyState.style.display = "none";
    }

    vales.forEach(v => {
        const tr = document.createElement("tr");
        
        const badgeCls = v.tipo === "Gasolina Especial" ? "badge-tipo gasolina" : "badge-tipo diesel";

        tr.innerHTML = `
            <td><strong>${v.codigo}</strong></td>
            <td>${v.conductor}</td>
            <td>${v.placa}</td>
            <td><span class="${badgeCls}">${v.tipo}</span></td>
            <td><strong>${v.litros} Lts</strong></td>
            <td><code style="font-family: monospace; font-size: 0.8rem; color: var(--primary-color);">${v.token}</code></td>
            <td>
                <button class="btn-imprimir" onclick="abrirBoleta('${v.codigo}')">📄 Imprimir</button>
                <button class="btn-delete" onclick="eliminarVale('${v.codigo}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Emitir nuevo vale
function registrarVale(e) {
    e.preventDefault();

    const conductor = document.getElementById("val-conductor").value.trim();
    const placa = document.getElementById("val-placa").value.trim().toUpperCase();
    const tipo = document.getElementById("val-tipo").value;
    const litros = parseInt(document.getElementById("val-litros").value);
    const destino = document.getElementById("val-destino").value.trim();

    // Validar existencias de inventario
    if (tipo === "Gasolina Especial" && tanqueGasolina < litros) {
        alert(`Error: Inventario insuficiente en Tanque Principal de Gasolina. Solo quedan ${tanqueGasolina.toFixed(0)} litros.`);
        return;
    }
    if (tipo === "Diésel Oíl" && tanqueDiesel < litros) {
        alert(`Error: Inventario insuficiente en Tanque de Diésel SEDECA. Solo quedan ${tanqueDiesel.toFixed(0)} litros.`);
        return;
    }

    // Decrementar inventario
    if (tipo === "Gasolina Especial") {
        tanqueGasolina -= litros;
    } else {
        tanqueDiesel -= litros;
    }
    guardarInventario();

    // Generar código de vale correlativo
    const correlativo = String(vales.length + 1).padStart(4, "0");
    const codigo = `VAL-2026-${correlativo}`;

    // Fecha actual formateada
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    const fecha = new Date().toLocaleDateString("es-ES", opciones);

    // Calcular firma de seguridad HASH
    const token = generarTokenHash(codigo, placa, litros);

    const nuevo = {
        codigo,
        conductor,
        placa,
        tipo,
        litros,
        destino,
        fecha,
        token
    };

    vales.push(nuevo);
    guardarLocalVales();

    // Limpiar formulario y redireccionar
    document.getElementById("form-vale").reset();
    switchTab('vales');
}

// Eliminar
function eliminarVale(codigo) {
    const vale = vales.find(v => v.codigo === codigo);
    if (!vale) return;

    if (confirm(`¿Dar de baja y anular de forma permanente el vale ${codigo}? (Se restituirá el inventario del tanque)`)) {
        // Restituir inventario
        if (vale.tipo === "Gasolina Especial") {
            tanqueGasolina += parseFloat(vale.litros);
        } else {
            tanqueDiesel += parseFloat(vale.litros);
        }
        guardarInventario();

        // Eliminar
        vales = vales.filter(v => v.codigo !== codigo);
        guardarLocalVales();

        renderTabla();
        actualizarEstadisticas();
    }
}

// Abrir modal de boleta imprimible
function abrirBoleta(codigo) {
    valeSeleccionado = vales.find(v => v.codigo === codigo);
    if (!valeSeleccionado) return;

    // Rellenar ticket térmico
    document.getElementById("t-codigo").innerText = valeSeleccionado.codigo;
    document.getElementById("t-fecha").innerText = valeSeleccionado.fecha;
    document.getElementById("t-conductor").innerText = valeSeleccionado.conductor;
    document.getElementById("t-placa").innerText = valeSeleccionado.placa;
    document.getElementById("t-tipo").innerText = valeSeleccionado.tipo;
    document.getElementById("t-litros").innerText = `${valeSeleccionado.litros} Litros`;
    document.getElementById("t-destino").innerText = valeSeleccionado.destino;
    document.getElementById("t-token").innerText = valeSeleccionado.token;

    // Abrir modal
    document.getElementById("modal-boleta").classList.add("open");
}

function cerrarModal() {
    document.getElementById("modal-boleta").classList.remove("open");
    valeSeleccionado = null;
}

// Generación de firmas criptográficas simuladas (SHA-256 / DJB2 Hash)
function generarTokenHash(codigo, placa, litros) {
    const rawString = `${codigo}-${placa}-${litros}-${GOB_SECRET}`;
    
    // Algoritmo DJB2 modificado a hex de alta precisión
    let hash = 5381;
    for (let i = 0; i < rawString.length; i++) {
        hash = ((hash << 5) + hash) + rawString.charCodeAt(i);
    }
    
    const hexDigest = Math.abs(hash).toString(16).toUpperCase();
    const hexDigestAux = (hash * 33).toString(16).toUpperCase(); // Ampliar cadena de control
    
    return `SHA-OR-${hexDigest}${hexDigestAux}`.substring(0, 24);
}

// Imprimir
function imprimirBoleta() {
    window.print();
}
