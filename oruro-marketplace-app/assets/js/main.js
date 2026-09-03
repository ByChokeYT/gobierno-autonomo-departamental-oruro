// ════════════════════════════════════════════════════════════════
// ORURO PRODUCE MARKETPLACE — FERIA DE LAS 16 PROVINCIAS
// Secretaría de Desarrollo Productivo · Gobernación Autónoma Departamental de Oruro
// Senior Principal Software Architect Level
// ════════════════════════════════════════════════════════════════

'use strict';

const productos = [
    {
        id: "MKT-ORU-01",
        nombre: "Quinua Real Blanca Orgánica (Saco 50 Kg)",
        categoria: "Quinua",
        productor: "Asociación APROQUIRI",
        provincia: "Ladislao Cabrera",
        municipio: "Salinas de Garci Mendoza",
        precio: 850,
        unidad: "Saco 50 Kg",
        descripcion: "Quinua real orgánica de grano grande, cosechada a más de 3.700 msnm con certificación de exportación."
    },
    {
        id: "MKT-ORU-02",
        nombre: "Charque de Llama Especial (Paquete 1 Kg)",
        categoria: "Camélidos",
        productor: "Asociación de Ganaderos APROCAM",
        provincia: "Eduardo Abaroa",
        municipio: "Challapata",
        precio: 120,
        unidad: "Paquete 1 Kg",
        descripcion: "Charque deshidratado al sol andino, libre de colesterol y alto valor proteico."
    },
    {
        id: "MKT-ORU-03",
        nombre: "Poncho Fino de Fibra de Alpaca",
        categoria: "Textiles",
        productor: "Artesanos del Telar Sajama",
        provincia: "Sajama",
        municipio: "Curahuara de Carangas",
        precio: 650,
        unidad: "Pieza",
        descripcion: "Poncho artesanal tejido a mano con 100% fibra de alpaca extrafina y tintes naturales."
    },
    {
        id: "MKT-ORU-04",
        nombre: "Artesanías en Minería y Estaño",
        categoria: "Textiles",
        productor: "Cooperativa Minera Huanuni",
        provincia: "Pantaleón Dalence",
        municipio: "Huanuni",
        precio: 350,
        unidad: "Escultura",
        descripcion: "Estatuillas decorativas y recuerdos repujados en estaño puro con motivos de la mitología minera."
    },
    {
        id: "MKT-ORU-05",
        nombre: "Queso Criollo Tradicional de Llama",
        categoria: "Camélidos",
        productor: "Productores de Sabaya",
        provincia: "Sabaya",
        municipio: "Sabaya",
        precio: 45,
        unidad: "Unidad (800g)",
        descripcion: "Queso artesanal curado con hierbas aromáticas del altiplano orureño."
    },
    {
        id: "MKT-ORU-06",
        nombre: "Galletas Nutritivas de Quinua y Cañahua",
        categoria: "Quinua",
        productor: "Empresa Departamental de Alimentos",
        provincia: "Cercado",
        municipio: "Oruro",
        precio: 25,
        unidad: "Caja 12 Uds",
        descripcion: "Galletas enriquecidas con superalimentos andinos para la alimentación escolar y familiar."
    }
];

let productosFiltrados = [...productos];
let categoriaActual = "TODOS";

document.addEventListener("DOMContentLoaded", () => {
    iniciarRelojVivo();
    renderProductos();
});

function iniciarRelojVivo() {
    const tick = () => {
        const ahora = new Date();
        const h = String(ahora.getHours()).padStart(2, "0");
        const m = String(ahora.getMinutes()).padStart(2, "0");
        const s = String(ahora.getSeconds()).padStart(2, "0");

        const el = document.getElementById("mkt-clock-time");
        if (el) el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

function renderProductos() {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No se encontraron productos con los filtros seleccionados.</div>`;
        return;
    }

    productosFiltrados.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="prod-prov-tag">📍 ${p.provincia}</span>
                <span style="font-size:0.7rem;color:var(--accent-emerald);font-weight:700;">PROVINCIA ACREDITADA</span>
            </div>
            <h3 class="prod-title">${p.nombre}</h3>
            <p class="prod-desc">${p.descripcion}</p>
            <div style="font-size:0.76rem;color:var(--primary-light);font-weight:600;">Productor: ${p.productor}</div>
            <div class="prod-price-row">
                <div>
                    <span style="font-size:0.65rem;color:var(--text-muted);display:block;">PRECIO DE VENTA</span>
                    <span class="prod-price">Bs. ${p.precio.toLocaleString()}</span>
                </div>
                <button class="btn-ficha" onclick="abrirFichaProducto('${p.id}')">
                    Ficha A4 📄
                </button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function filtrarCategoria(cat) {
    categoriaActual = cat;
    document.querySelectorAll(".navigation-menu .nav-item").forEach(b => b.classList.remove("active"));
    event.currentTarget.classList.add("active");
    aplicarFiltros();
}

function filtrarPorProvincia() {
    aplicarFiltros();
}

function filtrarPorTexto() {
    aplicarFiltros();
}

function aplicarFiltros() {
    const provSelect = document.getElementById("select-provincia-filtro")?.value || "TODOS";
    const query = (document.getElementById("input-buscar-producto")?.value || "").toLowerCase().trim();

    productosFiltrados = productos.filter(p => {
        const matchCat  = (categoriaActual === "TODOS" || p.categoria === categoriaActual);
        const matchProv = (provSelect === "TODOS" || p.provincia === provSelect);
        const matchText = (!query || p.nombre.toLowerCase().includes(query) || p.productor.toLowerCase().includes(query) || p.provincia.toLowerCase().includes(query));
        return matchCat && matchProv && matchText;
    });

    renderProductos();
}

// ─── Modal A4 & Reporte ───────────────────────────────────────────
function abrirFichaProducto(id) {
    const p = productos.find(item => item.id === id);
    if (!p) return;

    const el = (elementId) => document.getElementById(elementId);
    if (el("ficha-mkt-subtitle"))  el("ficha-mkt-subtitle").textContent  = `${p.id} · Productor: ${p.productor}`;
    if (el("ficha-mkt-codigo"))    el("ficha-mkt-codigo").textContent    = `ACREDITACIÓN DE ORIGEN N° ${p.id}`;
    if (el("ficha-mkt-fecha"))     el("ficha-mkt-fecha").textContent     = new Date().toLocaleDateString('es-BO', {day:'2-digit', month:'short', year:'numeric'});
    if (el("ficha-mkt-productor")) el("ficha-mkt-productor").textContent = p.productor;
    if (el("ficha-mkt-provincia")) el("ficha-mkt-provincia").textContent = `${p.provincia} (${p.municipio})`;
    if (el("ficha-mkt-producto"))  el("ficha-mkt-producto").textContent  = p.nombre;
    if (el("ficha-mkt-precio"))    el("ficha-mkt-precio").textContent    = `Bs. ${p.precio.toLocaleString()} / ${p.unidad}`;

    document.getElementById("modal-ficha-producto").classList.add("open");
}

function cerrarFichaProducto() {
    document.getElementById("modal-ficha-producto").classList.remove("open");
}

function imprimirFichaProducto() {
    window.print();
}

function generarReporteEjecutivoMarketplace() {
    const el = (elementId) => document.getElementById(elementId);
    const tbody = el("reporte-mkt-tabla-body");
    if (tbody) {
        tbody.innerHTML = productos.map(p => `
            <tr>
                <td><strong>${p.id}</strong></td>
                <td>${p.nombre}</td>
                <td>${p.productor}</td>
                <td>${p.provincia}</td>
                <td>Bs. ${p.precio.toLocaleString()}</td>
            </tr>
        `).join("");
    }

    const area = el("area-impresion-reporte-mkt");
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
