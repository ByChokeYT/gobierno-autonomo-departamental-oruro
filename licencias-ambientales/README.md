# 🍃 Monitoreo de Licencias Ambientales & Mapa de Riesgo Territorial

**Gobernación Autónoma Departamental de Oruro (Bolivia)**  
*Cumplimiento Ley N° 1333 de Medio Ambiente · Secretaría Departamental de Medio Ambiente y Agua*

---

## 📌 Descripción General

Este módulo gestiona, fiscaliza y evalúa las **Fichas Ambientales (FA)** y **Manifiestos Ambientales (MA)** para operadoras mineras, plantas concentradoras, industrias y proyectos de infraestructura en las 16 provincias del Departamento de Oruro.

Integra un **mapa SVG departamental interactivo con coloreado dinámico por nivel de riesgo promedio**, **evaluador automatizado de impacto ambiental (Risk Score Engine)**, **búsqueda y filtrado territorial**, **exportación de reportes en CSV** y **reloj en vivo con atajos de teclado**.

---

## 🚀 Características Principales

### 1. 🗺️ Mapa SVG Departamental Interactivo & Filtro Espacial
* **Visualización Dinámica:** Las 16 provincias de Oruro se colorean en vivo según el promedio acumulado de riesgo ambiental:
  * 🟢 **Riesgo Bajo (1-3 Pts):** Operaciones con bajo impacto ecológico.
  * 🟡 **Riesgo Medio (4-6 Pts):** Actividades agroindustriales u obras públicas.
  * 🔴 **Riesgo Alto (7-11 Pts):** Minería pesada, diques de colas o proximidad a cuencas hídricas / reservas.
* **Tooltip en Tiempo Real:** Al pasar el cursor sobre cualquier provincia se despliega la cantidad de operaciones y el nivel de riesgo promedio.
* **Filtro Territorial:** Al hacer clic en una provincia, la tabla de licencias filtra instantáneamente solo las operadoras registradas en ese territorio.

### 2. 🧮 Evaluador Automatizado de Riesgo Ambiental (Risk Score Engine)
* **Puntaje Base por Actividad:**
  * Minería Pesada / Planta Concentradora: **3 Pts**
  * Agroindustrial: **2 Pts**
  * Servicios / Obras Públicas: **1 Pt**
* **Factores Geográficos de Vulnerabilidad:**
  * Proximidad a cuencas hídricas / lagos (ej. Lago Poopó): **+3 Pts**
  * Proximidad a centros poblados o comunidades originarias: **+2 Pts**
  * Ubicada en áreas protegidas o reservas ecológicas: **+3 Pts**

### 3. ⌨️ Accesibilidad, Filtros & Exportación CSV
* **Atajo `Ctrl + K`:** Acceso directo a la barra de búsqueda universal.
* **Ordenamiento Dinámico:** Filtrado por código, operador, tipo de actividad o categoría de riesgo.
* **Exportar CSV con UTF-8 BOM:** Genera reportes de auditoría ambiental compatibles con Microsoft Excel.

### 4. 🎨 Diseño UI/UX Esmeralda Bioluminiscente
* Tema oscuro forestal con destellos verde esmeralda y cian.
* Iconografía 100% vectorial SVG sin emojis genéricos.
* Reloj institucional en vivo `HH:MM:SS` en `JetBrains Mono`.

---

## 📂 Estructura de Archivos

```text
licencias-ambientales/
├── index.html                   # Dashboard ambiental, mapa SVG interactivo, tabla y formulario de riesgo
├── assets/
│   └── css/
│       └── styles.css           # Estilos bioluminescent emerald dark, mapa SVG, tooltips y leyendas
└── src/
    └── main.js                  # Algoritmo de cálculo de riesgo, mapa SVG bidireccional, CSV y LocalStorage
```

---

## ⚡ Instalación y Ejecución

1. No requiere librerías externas ni servidores backend (`Zero dependencies`).
2. Abre [index.html](file:///c:/Users/Admin/Downloads/gobierno-autonomo-departamental-oruro/licencias-ambientales/index.html) directamente en cualquier navegador web moderno.

---

*Gobernación Autónoma Departamental de Oruro — Fiscalización Ambiental y Desarrollo Sostenible*
