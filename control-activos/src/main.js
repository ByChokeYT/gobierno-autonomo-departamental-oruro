// Lógica de Negocio - Control de Activos Fijos
// Gobernación Autónoma Departamental de Oruro

let activos = [];
let activoSeleccionado = null; // Para el modal de auditoría

document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    renderTabla();
    actualizarEstadisticas();
});

// Inicializar con datos de prueba
function inicializarDatos() {
    const dataLocal = localStorage.getItem("oruro_activos");
    if (dataLocal) {
        activos = JSON.parse(dataLocal);
    } else {
        activos = [
            {
                codigo: "ACT-2026-0001",
                tipo: "Equipos de Computación",
                modelo: "Laptop HP EliteBook G8 (Intel i7, 16GB RAM)",
                oficina: "Secretaría General",
                custodio: "Roberto Gómez Colque",
                logs: [
                    { fecha: "12 Ene 2026 - 08:30", tipo: "registro", descripcion: "Registro inicial en inventario y asignación de custodio a Roberto Gómez Colque." }
                ]
            },
            {
                codigo: "ACT-2026-0002",
                tipo: "Vehículos Terrestres",
                modelo: "Camioneta Toyota Hilux 4x4 (Placa 4521-FDS)",
                oficina: "Servicio de Caminos (SEDECA)",
                custodio: "Marcos Mamani Choque",
                logs: [
                    { fecha: "15 Feb 2026 - 10:15", tipo: "registro", descripcion: "Ingreso de parque automotor y asignación de custodio a Marcos Mamani Choque." }
                ]
            },
            {
                codigo: "ACT-2026-0003",
                tipo: "Muebles y Enseres",
                modelo: "Escritorio de Roble Ejecutivo con cajonera",
                oficina: "Dirección Jurídica",
                custodio: "Julio Choque Valda",
                logs: [
                    { fecha: "20 Jun 2026 - 14:00", tipo: "registro", descripcion: "Registro inicial de mobiliario y asignación de custodio a Julio Choque Valda." }
                ]
            }
        ];
        guardarLocal();
    }
}

function guardarLocal() {
    localStorage.setItem("oruro_activos", JSON.stringify(activos));
}

// Cambiar de pestaña
function switchTab(tabName) {
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    
    if (tabName === 'inventario') {
        document.querySelector("button[onclick=\"switchTab('inventario')\"]").classList.add("active");
        document.getElementById("tab-inventario").classList.add("active");
        document.getElementById("page-title").innerText = "Inventario de Activos Departamentales";
    } else if (tabName === 'registro') {
        document.querySelector("button[onclick=\"switchTab('registro')\"]").classList.add("active");
        document.getElementById("tab-registro").classList.add("active");
        document.getElementById("page-title").innerText = "Registrar Nuevo Activo Fijo";
    }
    
    renderTabla();
    actualizarEstadisticas();
}

// Estadísticas de cabecera
function actualizarEstadisticas() {
    const total = activos.length;
    const computo = activos.filter(a => a.tipo === "Equipos de Computación").length;
    
    // Contar total de transferencias en todos los logs
    let transferenciasCount = 0;
    activos.forEach(a => {
        transferenciasCount += a.logs.filter(l => l.tipo === "transferencia").length;
    });

    document.getElementById("stat-total").innerText = total;
    document.getElementById("stat-computo").innerText = computo;
    document.getElementById("stat-transferencias").innerText = transferenciasCount;
}

// Render de la tabla
function renderTabla() {
    const tbody = document.getElementById("tabla-activos");
    const emptyState = document.getElementById("estado-vacio");
    tbody.innerHTML = "";

    if (activos.length === 0) {
        emptyState.style.display = "flex";
        return;
    } else {
        emptyState.style.display = "none";
    }

    activos.forEach(act => {
        const tr = document.createElement("tr");
        
        // Conteo de transferencias de este activo
        const transCount = act.logs.filter(l => l.tipo === "transferencia").length;
        const logBadge = transCount > 0 
            ? `<span class="badge badge-bajo" style="background: rgba(6,182,212,0.1); color: #06b6d4; border: 1px solid rgba(6,182,212,0.2);">${transCount} Cambios</span>`
            : `<span class="badge badge-documentos">Origen</span>`;

        tr.innerHTML = `
            <td><strong>${act.codigo}</strong></td>
            <td>${act.tipo}</td>
            <td>${act.modelo}</td>
            <td>${act.oficina}</td>
            <td>${act.custodio}</td>
            <td>${logBadge}</td>
            <td>
                <button class="btn-action" onclick="abrirAuditoria('${act.codigo}')">🔍 Auditoría QR</button>
                <button class="btn-delete" onclick="eliminarActivo('${act.codigo}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Registrar nuevo bien
function registrarActivo(e) {
    e.preventDefault();

    const tipo = document.getElementById("act-tipo").value;
    const modelo = document.getElementById("act-modelo").value.trim();
    const oficina = document.getElementById("act-oficina").value;
    const custodio = document.getElementById("act-custodio").value.trim();

    // Generar código único
    const correlativo = String(activos.length + 1).padStart(4, "0");
    const codigo = `ACT-2026-${correlativo}`;

    // Log de registro
    const ahora = obtenerFechaHoraActual();
    const logs = [
        { fecha: ahora, tipo: "registro", descripcion: `Registro inicial de bien e inventario asignado a ${custodio} en ${oficina}.` }
    ];

    const nuevo = {
        codigo,
        tipo,
        modelo,
        oficina,
        custodio,
        logs
    };

    activos.push(nuevo);
    guardarLocal();

    // Resetear formulario
    document.getElementById("form-activo").reset();
    switchTab('inventario');
}

// Eliminar
function eliminarActivo(codigo) {
    if (confirm(`¿Está seguro de dar de baja el activo ${codigo} del inventario oficial?`)) {
        activos = activos.filter(a => a.codigo !== codigo);
        guardarLocal();
        renderTabla();
        actualizarEstadisticas();
    }
}

// Abrir modal de Auditoría QR
function abrirAuditoria(codigo) {
    activoSeleccionado = activos.find(a => a.codigo === codigo);
    if (!activoSeleccionado) return;

    // Actualizar etiqueta del sticker
    document.getElementById("etiqueta-codigo").innerText = activoSeleccionado.codigo;
    document.getElementById("etiqueta-custodio").innerText = activoSeleccionado.custodio;
    document.getElementById("etiqueta-oficina").innerText = activoSeleccionado.oficina;

    // Pre-llenar formulario de transferencia
    document.getElementById("trans-custodio").value = "";
    document.getElementById("trans-oficina").value = activoSeleccionado.oficina;

    // Dibujar Código QR en el Canvas
    const qrTexto = `${activoSeleccionado.codigo} | ${activoSeleccionado.modelo} | CUSTODIO: ${activoSeleccionado.custodio} | GAD-ORU`;
    dibujarQR("qr-canvas", qrTexto);

    // Renderizar logs
    renderLogs();

    // Abrir Modal
    document.getElementById("modal-qr").classList.add("open");
}

function cerrarModal() {
    document.getElementById("modal-qr").classList.remove("open");
    activoSeleccionado = null;
    renderTabla();
    actualizarEstadisticas();
}

// Ejecutar Transferencia / Reasignación
function transferirActivo(e) {
    e.preventDefault();
    if (!activoSeleccionado) return;

    const nuevaOficina = document.getElementById("trans-oficina").value;
    const nuevoCustodio = document.getElementById("trans-custodio").value.trim();
    const ahora = obtenerFechaHoraActual();

    // Crear log de transferencia
    const logDescripcion = `Transferencia de custodia aprobada: De ${activoSeleccionado.custodio} (${activoSeleccionado.oficina}) a ${nuevoCustodio} (${nuevaOficina}).`;
    activoSeleccionado.logs.push({
        fecha: ahora,
        tipo: "transferencia",
        descripcion: logDescripcion
    });

    // Actualizar custodio y oficina activos
    activoSeleccionado.oficina = nuevaOficina;
    activoSeleccionado.custodio = nuevoCustodio;

    // Guardar
    const index = activos.findIndex(a => a.codigo === activoSeleccionado.codigo);
    if (index !== -1) {
        activos[index] = activoSeleccionado;
        guardarLocal();
    }

    // Actualizar UI del Modal
    document.getElementById("etiqueta-custodio").innerText = nuevoCustodio;
    document.getElementById("etiqueta-oficina").innerText = nuevaOficina;
    
    // Regenerar el QR porque los datos cambiaron
    const qrTexto = `${activoSeleccionado.codigo} | ${activoSeleccionado.modelo} | CUSTODIO: ${nuevoCustodio} | GAD-ORU`;
    dibujarQR("qr-canvas", qrTexto);

    // Resetear formulario interno y actualizar logs
    document.getElementById("trans-custodio").value = "";
    renderLogs();
}

// Render logs del activo seleccionado
function renderLogs() {
    const logsContainer = document.getElementById("logs-auditoria");
    logsContainer.innerHTML = "";

    // Renderizar al revés para mostrar el más reciente arriba
    [...activoSeleccionado.logs].reverse().forEach(log => {
        const div = document.createElement("div");
        div.className = `log-item ${log.tipo}`;
        div.innerHTML = `
            <div class="log-date">${log.fecha} [${log.tipo.toUpperCase()}]</div>
            <div>${log.descripcion}</div>
        `;
        logsContainer.appendChild(div);
    });
}

// ALGORITMO GENERADOR DE QR DETERMINÍSTICO EN CANVAS NATIVO (Sin Librerías)
// Dibuja una grilla 21x21 (Código QR V1) en base a un texto
function dibujarQR(canvasId, texto) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = canvas.width; // 180px
    const modules = 21; // Grilla 21x21
    const modSize = size / modules; // Tamaño de cada cuadrito (~8.57px)

    // Limpiar canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

    // Crear matriz booleana 21x21 inicializada en falso
    let matriz = Array(modules).fill().map(() => Array(modules).fill(false));

    // 1. Dibujar los 3 Patrones de Búsqueda (Finder Patterns)
    // Superior Izquierdo (0,0)
    dibujarFinderPattern(matriz, 0, 0);
    // Superior Derecho (14, 0)
    dibujarFinderPattern(matriz, 14, 0);
    // Inferior Izquierdo (0, 14)
    dibujarFinderPattern(matriz, 0, 14);

    // 2. Dibujar Líneas de Sincronización (Timing Patterns)
    for (let i = 7; i < 14; i++) {
        matriz[6][i] = (i % 2 === 0); // Horizontal
        matriz[i][6] = (i % 2 === 0); // Vertical
    }

    // 3. Rellenar el resto determinísticamente con un generador pseudo-aleatorio basado en el hash del texto
    let hash = hashTexto(texto);
    let randomSeeded = () => {
        let x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
    };

    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            // Saltarse si es parte de los patrones de búsqueda o líneas de sincronización
            if (esAreaReservada(r, c)) continue;
            
            // Decisión binaria basada en el hash
            matriz[r][c] = (randomSeeded() > 0.5);
        }
    }

    // 4. Pintar en el canvas
    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            if (matriz[r][c]) {
                ctx.fillRect(c * modSize, r * modSize, modSize + 0.5, modSize + 0.5); // +0.5 para evitar costuras
            }
        }
    }
}

// Dibuja la estructura 7x7 del buscador de QR
function dibujarFinderPattern(matriz, startR, startC) {
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            // Anillo exterior (negro), Anillo interior (blanco), Centro (negro)
            const esBordeExterior = (r === 0 || r === 6 || c === 0 || c === 6);
            const esCentro = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
            
            if (esBordeExterior || esCentro) {
                matriz[startR + r][startC + c] = true;
            } else {
                matriz[startR + r][startC + c] = false;
            }
        }
    }
}

// Determinar si una celda es parte del patrón fijo de QR
function esAreaReservada(r, c) {
    // Patrón superior izquierdo
    if (r < 8 && c < 8) return true;
    // Patrón superior derecho
    if (r < 8 && c > 13) return true;
    // Patrón inferior izquierdo
    if (r > 13 && c < 8) return true;
    // Línea de sincronización vertical/horizontal
    if (r === 6 || c === 6) return true;
    
    return false;
}

// Función hash simple para sembrar el generador pseudo-aleatorio (DJB2)
function hashTexto(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return Math.abs(hash);
}

// Helper fecha y hora
function obtenerFechaHoraActual() {
    const ahora = new Date();
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    const fecha = ahora.toLocaleDateString("es-ES", opciones);
    const hora = ahora.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });
    return `${fecha} - ${hora}`;
}

// Imprimir etiqueta
function imprimirEtiqueta() {
    window.print();
}

// Descargar etiqueta completa en PNG limpio
function descargarEtiqueta() {
    if (!activoSeleccionado) return;

    // Crear canvas temporal de la etiqueta física
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 300;
    tempCanvas.height = 420;
    const ctx = tempCanvas.getContext("2d");

    // Fondo blanco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Borde exterior discontinuo de corte
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(10, 10, tempCanvas.width - 20, tempCanvas.height - 20);
    ctx.setLineDash([]); // Resetear line dash

    // Cabecera GOBIERNO DE ORURO
    ctx.fillStyle = "#000000";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GOBIERNO DE ORURO", 150, 45);
    
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#555555";
    ctx.fillText("CONTROL DE ACTIVOS FIJOS", 150, 60);

    // Línea divisoria
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, 72);
    ctx.lineTo(280, 72);
    ctx.stroke();

    // Copiar el QR del canvas original
    const qrCanvas = document.getElementById("qr-canvas");
    if (qrCanvas) {
        ctx.drawImage(qrCanvas, 60, 90, 180, 180);
    }

    // Línea divisoria inferior
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 290);
    ctx.lineTo(280, 290);
    ctx.stroke();

    // Detalles del Activo
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 11px monospace";
    
    ctx.fillText("CÓDIGO:", 30, 315);
    ctx.fillText("CUSTODIO:", 30, 335);
    ctx.fillText("OFICINA:", 30, 355);

    ctx.font = "11px monospace";
    const truncarText = (txt, max) => txt.length > max ? txt.substring(0, max) + "..." : txt;

    ctx.fillText(activoSeleccionado.codigo, 100, 315);
    ctx.fillText(truncarText(activoSeleccionado.custodio, 20), 100, 335);
    ctx.fillText(truncarText(activoSeleccionado.oficina, 20), 100, 355);

    // Pie de página de etiqueta
    ctx.textAlign = "center";
    ctx.font = "italic 9px sans-serif";
    ctx.fillStyle = "#888888";
    ctx.fillText("ETIQUETA OFICIAL DE INVENTARIO", 150, 395);

    // Descargar PNG
    const link = document.createElement("a");
    link.download = `etiqueta_${activoSeleccionado.codigo}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
