# 🏛️ Control y Auditoría de Activos Fijos con QR & Firma Hash-256

**Gobernación Autónoma Departamental de Oruro (Bolivia)**  
*Cumplimiento Ley N° 1178 (SAFCO) · Sistema de Gestión Pública y Trazabilidad Patrimonial*

---

## 📌 Descripción General

Este módulo forma parte del sistema de gestión pública departamental de Oruro. Permite el control físico, financiero e institucional de los bienes fijos (equipos informáticos, parque automotor, mobiliario, maquinaria pesada y equipos de radiocomunicación) asignados a los servidores públicos.

Integra la **generación autónoma de etiquetas con código QR en Canvas nativo**, **firmas criptográficas de integridad Hash-256**, **panel de analítica patrimonial**, **relógio institucional en vivo**, **impresión y descarga de etiquetas stickers en PNG** y **exportación de reportes de auditoría en CSV con codificación UTF-8 BOM**.

---

## 🚀 Características y Funcionalidades Principales

### 1. 📊 Analítica Patrimonial e Indicadores de Salud Operativa
* **Distribución Patrimonial en Bs.:** Gráfico dinámico de barras por categoría (Cómputo, Vehículos, Mobiliario, Maquinaria, Comunicaciones).
* **Salud Operativa del Parque (Donut SVG):** Estado técnico en tiempo real (`Bueno / Operativo`, `Regular`, `En Mantenimiento`, `Para Baja`).
* **Carga por Unidad Organizacional:** Gráfico de asignación de bienes por secretarias y direcciones departamentales.

### 2. 🛡️ Trazabilidad Inmutable & Hash-256 (Ley SAFCO N° 1178)
* Generación de suma de verificación criptográfica determinística (`GAD-ORU-XXXX-XXXX`) para prevenir la falsificación o alteración de etiquetas físicas.
* **Bitácora Inmutable de Auditoría:** Registro histórico de fecha, hora y proveído en cada transferencia de custodia o reasignación de oficina.

### 3. 🏷️ Generador de Código QR en Canvas Nativo (Sin Librerías)
* Dibujado cuadro a cuadro sobre HTML5 `<canvas>` usando el contexto 2D nativo de JavaScript con algoritmo de dispersión determinístico FNV/DJB2.
* **Descarga de Sticker PNG de Alta Resolución:** Genera la etiqueta oficial lista para impresión troquelada con escudo departamental, código de barra/QR, datos del custodio y hash de verificación.
* **Impresión Directa (`Ctrl+P`):** Reglas CSS `@media print` para imprimir únicamente la etiqueta del activo sin elementos de la interfaz.

### 4. 📷 Simulador de Escáner e Inspección en Vivo
* Modal HUD con animación de barrido láser cian y retícula de encuadre para simulación de lectura de etiquetas QR en campo (útil para inspecciones en zonas rurales de Oruro sin internet).

### 5. ⌨️ Accesibilidad y Atajos de Teclado (Command Palette)
* **`Ctrl + K` (o `Cmd + K`):** Enfoca e ilumina instantáneamente la barra de búsqueda de activos desde cualquier vista.
* **`Escape`:** Cierra cualquier modal o pantalla de inspección activa.

### 6. 🎨 Iconografía Vectorial SVG & Interfaz Enterprise
* Sustitución completa de emojis por **iconos vectoriales SVG limpios** (Lucide / Feather Icons).
* Reloj institucional en vivo en tipografía monoespaciada `JetBrains Mono`.
* Tema oscuro obsidian con degradados cian y ámbar institucional de Oruro.

---

## 📂 Estructura de Archivos

```text
control-activos/
├── index.html                   # Dashboard principal, vista de inventario, analítica y modales
├── assets/
│   └── css/
│       └── styles.css           # Design tokens, tema oscuro obsidian, animaciones HUD y print styles
└── src/
    └── main.js                  # Lógica de negocio, algoritmo QR Canvas, hash-256, charts y LocalStorage
```

---

## ⚡ Instalación y Ejecución

No requiere dependencias externas ni compilación (`Zero dependencies / Standalone vanilla stack`).

1. Clona o descarga el repositorio localmente.
2. Abre [index.html](file:///c:/Users/Admin/Downloads/gobierno-autonomo-departamental-oruro/control-activos/index.html) directamente en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).

---

## 🛠️ Especificaciones Técnicas

| Componente | Tecnología |
| :--- | :--- |
| **Estructura** | HTML5 Semántico + SVG Vectorial |
| **Estilos** | CSS3 Vanilla (Custom Properties, Glassmorphism, CSS Grid & Flexbox) |
| **Lógica** | JavaScript ES6+ (Manipulación de DOM, LocalStorage, Canvas 2D API) |
| **Tipografía** | `Outfit` (Headings) + `JetBrains Mono` (Datos Técnicos / Reloj / Hashes) |
| **Compatibilidad** | 100% Offline / Funcionamiento independiente sin servidor backend |

---

*Gobernación Autónoma Departamental de Oruro — Gestión Pública Transparente y Tecnificada*
