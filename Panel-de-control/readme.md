# 📊 Gobernación de Oruro - Dashboard Demográfico (Fase 3)

¡Felicidades por alcanzar la **Fase 3**, la última etapa del programa de inducción técnica de la **Gobernación Autónoma Departamental de Oruro**! 

Como ingeniero del sector público, tu valor principal radica en la capacidad de procesar grandes cantidades de datos crudos (Big Data) y transformarlos en paneles ejecutivos (Dashboards) interactivos que faciliten la toma de decisiones críticas al instante.

---

## 🎯 Objetivo del Proyecto
Evaluar tu dominio de programación funcional aplicada a arreglos en JavaScript (especialmente en cálculos de agregación y sumatorias) y el renderizado condicional en la interfaz de usuario. Aprenderás a estructurar cálculos estadísticos optimizados y a presentar cifras legibles mediante localización e internacionalización del formato numérico.

---

## 📂 Estructura del Proyecto Organizada
Se ha estructurado el proyecto siguiendo las mejores prácticas de la industria:

```text
Panel-de-control/
├── index.html                   (Interfaz con estructura semántica HTML5)
├── assets/
│   └── css/
│       └── styles.css           (Diseño visual premium con estilo institucional)
└── src/
    └── main.js                  (Lógica matemática y renderizado dinámico)
```

---

## ⚠️ Reglas Estrictas de Desarrollo
1. **Preservar el Layout**: No se permite alterar `index.html` ni `styles.css`.
2. **Formateo Numérico Profesional**: Queda estrictamente prohibido formatear números de forma manual (mediante concatenación de strings o expresiones regulares). Debes utilizar el estándar oficial de localización de JavaScript: `.toLocaleString()`.
3. **Optimización con Programación Funcional**: Para demostrar habilidades profesionales avanzadas (Senior), los cálculos de KPI de tipo sumatoria deben resolverse mediante el método funcional `Array.prototype.reduce()` en lugar de bucles iterativos tradicionales (`for` o `while`).

---

## 🛠️ Misiones (Retos de la Fase 3)
Abre `src/main.js` y completa las siguientes tareas guiadas:

*   **RETO 1 (`calcularYMostrarKPIs`)**: 
    1. Calcula la población total del departamento sumando el campo `poblacion` de todas las regiones en `datosOruro` usando `.reduce()`. Formatea el resultado con `.toLocaleString('es-BO')` y muéstralo en `#kpi-poblacion-total`.
    2. Realiza el mismo proceso para obtener la sumatoria total de viviendas y muéstralo en `#kpi-viviendas-total`.
    3. Calcula la sumatoria de hombres. Obtén el porcentaje de población masculina respecto a la población total con un solo decimal de precisión y muéstralo en `#kpi-ratio-hombres` (ej. `49.5%`).
*   **RETO 2 (`renderizarTabla`)**: 
    1. Limpia el cuerpo de la tabla (`#cuerpo-tabla-stats`).
    2. Recorre `datosOruro` y construye dinámicamente cada fila de la tabla (`<tr>` y `<td>`) formateando todos los números.
    3. **Renderizado Condicional (Reto Final)**: Evalúa el tamaño de población de cada región. Si es mayor a `100,000` habitantes, añade un badge con la clase `.badge-alta` ("Alta Densidad"). Si es menor o igual, utiliza la clase `.badge-media` ("Media Densidad").

---

## 📈 Ruta de Aprendizaje y Evolución (Los 3 Niveles)
*Perspectiva de Ingeniería de Software (Arquitectura de Enseñanza Senior)*

### 🟢 Nivel 1: Básico (Estructuras de Control y Manipulación Simple)
*   **Foco Pedagógico**: Resolver cálculos usando estructuras de control imperativas tradicionales (`for`, `while`, `if/else`) y renderizar cadenas de texto simples sin formatear (ej. mostrar `571471` en lugar de `571.471`).
*   **Retos / Mejoras para el Alumno en este Nivel**:
    *   **Buscador Simple**: Crear un campo de entrada (`<input type="text">`) que filtre las filas de la tabla de municipios en tiempo real comparando el texto ingresado con los nombres de las regiones usando `.includes()` o `.indexOf()`.
    *   **Ordenamiento Básico**: Agregar botones en la cabecera de la tabla para ordenar alfabéticamente las regiones (A-Z) utilizando bucles simples.
    *   **Filtros Rápidos**: Añadir botones de filtro rápido (ej: "Mostrar solo Alta Densidad", "Mostrar Todo") usando comparaciones lógicas directas.

### 🟡 Nivel 2: Intermedio (Fase Actual - Programación Declarativa, Localización y Persistencia)
*   **Foco Pedagógico**: Utilizar métodos funcionales modernos de arreglos (`.reduce()`, `.map()`, `.filter()`), encapsular el estado en funciones puras y aplicar internacionalización local (`.toLocaleString('es-BO')`).
*   **Retos / Mejoras para el Alumno en este Nivel**:
    *   **Exportación de Datos**: Añadir un botón que permita descargar la tabla actual en formato CSV para que los funcionarios puedan abrir la información directamente en Microsoft Excel.
    *   **KPIs Dinámicos Interactivos**: Al hacer click en una fila de la tabla, mostrar una sección de detalles del municipio seleccionado, recalculando su porcentaje de viviendas respecto al total del departamento.
    *   **Persistencia de Configuración**: Implementar un selector de "Tema Visual" (Modo Oscuro / Modo Claro) y guardar la preferencia del usuario en `LocalStorage` para que persista al refrescar.
    *   **Gráficos Estáticos con SVG**: Dibujar un gráfico de barras sencillo utilizando elementos vectoriales `<svg>` generados dinámicamente con JavaScript para comparar la población entre municipios.

### 🔴 Nivel 3: Avanzado (Enterprise - Integraciones Complejas y Tiempo Real)
*   **Foco Pedagógico**: Consumo de servicios REST externos, visualización avanzada de datos, rendimiento y arquitectura modular en la nube.
*   **Retos / Mejoras para el Alumno en este Nivel**:
    *   **Visualización Científica de Datos (Chart.js / D3.js)**: Integrar librerías externas para renderizar gráficos de torta interactivos (proporción hombres/mujeres) y de líneas temporales con animaciones premium al cargar.
    *   **Integración con API del INE**: Conectar el Dashboard mediante `fetch()` a la API abierta del **INE (Instituto Nacional de Estadística)** para descargar en tiempo real datos demográficos reales de Bolivia, reemplazando la base simulada.
    *   **Generador de Reportes PDF**: Integrar **jsPDF** para generar informes analíticos con membrete institucional de la Gobernación de Oruro y permitir su descarga con firma digital simulada.
    *   **Mapas Coropléticos Interactivos**: Renderizar un mapa en formato **SVG / GeoJSON** del departamento de Oruro que pinte cada provincia de un color diferente (gradiente de dorado) según su densidad poblacional utilizando la librería **Leaflet** o manipulación directa de SVGs.
    *   **Actualizaciones en Tiempo Real (WebSockets)**: Simular una conexión por WebSockets donde los datos censales cambien dinámicamente si otro funcionario actualiza la base de datos central en otro navegador.

---

## 🚀 Cómo Ejecutar el Proyecto
1. Asegúrate de que las carpetas del proyecto estén organizadas.
2. Inicia un servidor de desarrollo local o abre `index.html` en tu navegador.
3. Haz clic en **Recargar Datos del Servidor** para experimentar el retraso de red simulado (latencia de red) y ver cómo el dashboard recalcula y actualiza la información en tiempo real.

---
*Evaluación Técnica a cargo de Ingeniería de Sistemas.*