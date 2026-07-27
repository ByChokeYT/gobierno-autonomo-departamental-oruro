# ⛽ Control, Emisión y Conciliación de Vales de Combustible con Firmas SHA-256

**Gobernación Autónoma Departamental de Oruro (Bolivia)**  
*Cumplimiento Ley N° 1178 (SAFCO) · Fiscalización de Carburantes y Tesorería*

---

## 📌 Descripción General

Este módulo forma parte del sistema de gestión pública de Oruro. Controla, fiscaliza y emite los vales de **Gasolina Especial** y **Diésel Oíl** para la flota de vehículos oficiales de la Gobernación (Secretaría General, Servicio Departamental de Caminos SEDECA, Direcciones e Inspecciones Técnicas).

Incorpora **tokens de seguridad criptográficos SHA-256**, **monitoreo en tiempo real de niveles de tanques centrales**, **alertas automáticas de reserva crítica (<20%)**, **boletas impresas en formato ticket térmico con código de barras** y **verificador antifraude de vales**.

---

## 🚀 Características Principales

### 1. 🛡️ Tokens Criptográficos SHA-256 Antifraude
* Cálculo determinístico de huella de control (`SHA-OR-XXXX-XXXX`) combinando: `Código de Vale + Placa + Litros + Destino + Clave Secreta de Tesorería`.
* Impide la clonación o falsificación física de cupones impresos.
* **Verificador Antifraude Integrado:** Herramienta para validación instantánea de autenticidad en estaciones de servicio.

### 2. 🛢️ Control Dinámico de Depósitos Centrales
* **Tanque Principal Gasolina Especial (5,000 Lts):** Decremento automático al emitir vales y restitución al anular cupones.
* **Tanque SEDECA Diésel Oíl (5,000 Lts):** Indicadores visuales de porcentaje disponible y opción de registro de compra/reposición.
* **Alerta de Reserva Crítica:** Notificación visual cuando cualquier depósito cae por debajo de 1,000 Litros.

### 3. 🧾 Boleta Imprimible en Formato Ticket Térmico
* Formato optimizado para impresión rápida (`Ctrl+P`) con código de barras simulado, resumen de comisión, firma del comisionado y sello oficial de Tesorería.

### 4. ⌨️ Búsqueda, Filtrado & Exportación CSV
* **Atajo `Ctrl + K`:** Acceso directo a la barra de búsqueda universal.
* **Ordenamiento Dinámico:** Filtrado por código, conductor, placa o carburante.
* **Exportar CSV con UTF-8 BOM:** Genera reportes de fiscalización compatibles con Microsoft Excel.

### 5. 🎨 Diseño UI/UX Senior Obsidian
* Tema oscuro petróleo con orbes ambientales radiales.
* Iconografía 100% vectorial SVG sin emojis genéricos.
* Reloj institucional en vivo en tipografía monoespaciada `JetBrains Mono`.

---

## 📂 Estructura de Archivos

```text
control-combustible/
├── index.html                   # Dashboard de conciliación, emisión de vales, medidores de tanques y modal ticket
├── assets/
│   └── css/
│       └── styles.css           # Estilos obsidian dark, barras de medidores de tanques y print styles
└── src/
    └── main.js                  # Lógica de inventario, firmas SHA-256, verificador y LocalStorage
```

---

## ⚡ Instalación y Ejecución

1. No requiere instalación de librerías ni servidor backend (`Zero dependencies`).
2. Abre [index.html](file:///c:/Users/Admin/Downloads/gobierno-autonomo-departamental-oruro/control-combustible/index.html) directamente en tu navegador web.

---

*Gobernación Autónoma Departamental de Oruro — Transparencia y Eficiencia en Gestión de Recursos*
