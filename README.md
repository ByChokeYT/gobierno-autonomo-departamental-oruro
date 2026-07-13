# 🏛️ Portafolio de Consultoría Tecnológica
### Gobernación Autónoma Departamental de Oruro (Bolivia)

![Escudo Departamental de Oruro](https://upload.wikimedia.org/wikipedia/commons/5/59/Escudo_departamental_de_Oruro.jpg)

![Estado](https://img.shields.io/badge/Estado-Prototipos%20de%20Inducci%C3%B3n-blue?style=flat-square) ![Tecnologías](https://img.shields.io/badge/Tecnologías-Vanilla%20JS%20%7C%20CSS3%20%7C%20HTML5-orange?style=flat-square) ![Auditoría](https://img.shields.io/badge/Auditoría-Seguro%20%26%20Confidencial-red?style=flat-square)

---

Este repositorio reúne una suite de soluciones tecnológicas, paneles de control y módulos de gestión pública diseñados y desarrollados durante mi gestión como **Consultor Privado de Software** para la **Gobernación Autónoma Departamental de Oruro** (Bolivia). 

Los proyectos abordan problemáticas reales de la administración pública local, abarcando desde el control de flujo de trámites ciudadanos y la trazabilidad de correspondencia oficial, hasta la liquidación automatizada de regalías mineras conforme a la normativa boliviana vigente.

> [!IMPORTANT]
> **Carácter Demostrativo e Inductivo:** Los proyectos de este repositorio constituyen **bases técnicas, prototipos y maquetas funcionales** que modelan los requisitos y la lógica de negocio de los sistemas definitivos. 
> 
> **Seguridad y Confidencialidad de la Información:** Al trabajar en un entorno gubernamental como la Gobernación Autónoma Departamental de Oruro, los sistemas de producción reales están sujetos a rigurosos controles de calidad, auditorías gubernamentales y manejo de **información confidencial y privilegiada**. Por motivos de seguridad y cumplimiento normativo, los sistemas definitivos operan bajo infraestructura aislada y segura. Este repositorio tiene un propósito puramente arquitectónico, de inducción técnica y demostrativo de capacidades, sin exponer bases de datos reales ni código de producción sensible.

---

## 📂 Resumen de Proyectos y Sistemas Implementados

El ecosistema de desarrollo consta de **6 proyectos modulares**, estructurados de forma pedagógica y técnica según diversas fases de complejidad en ingeniería de software:

| # | Proyecto / Módulo | Nivel / Fase | Descripción Principal | Tecnologías Clave |
|---|---|---|---|---|
| 1 | **[SISREMIN](./liquidacion-regalias) - Regalías Mineras** | Fase 5 (Avanzado) | Liquidación y facturación de regalías de la Dirección de Minería y Metalurgia bajo la Ley N° 535. | CSS `@media print`, LocalStorage, Fórmulas de Ley Fina y Cotización Bolsa de Londres (LME). |
| 2 | **[Sistema de Correspondencia](./sistema-correspondencia)** | Fase 4 (Avanzado) | Registro y derivación de Hojas de Ruta entre secretarías con timeline interactivo de auditoría. | Datos anidados (Historial), Renderizado dinámico de Timeline, Modales de Proveídos. |
| 3 | **[Panel de Control Demográfico](./Panel-de-control)** | Fase 3 (Intermedio) | Dashboard estadístico interactivo para el análisis poblacional y toma de decisiones gubernamentales. | Programación funcional avanzada (`.reduce()`), Localización numérica (`.toLocaleString()`). |
| 4 | **[Registro de Trámites CRUD](./registro-tramites)** | Fase 2 (Básico-Medio) | Mini-sistema CRUD de correspondencia ciudadana con persistencia local permanente. | LocalStorage API, Sincronización asíncrona del DOM, Control de estados vacíos. |
| 5 | **[Sistema de Turnos FIFO](./sistema-turnos)** | Fase 1 (Básico) | Emisor y gestor de turnos secuenciales para salas de atención al ciudadano. | Estructuras de colas en memoria, Programación de algoritmos FIFO (`.shift()`, `.push()`). |
| 6 | **[Monitor del Dólar](./monitor-dolar)** | Herramienta Auxiliar | Dashboard de visualización del tipo de cambio e histórico del dólar en tiempo real. | ES6 Modules, Fetch API asíncrona, Control y actualización del DOM. |

---

## 🛠️ Detalles de los Módulos de Software

### 1. 🪙 SISREMIN - Liquidación de Regalías Mineras (`liquidacion-regalias`)
Módulo desarrollado para la **Dirección de Minería y Metalurgia** de la Gobernación de Oruro. Permite digitalizar y certificar las liquidaciones tributarias por explotación de minerales:
*   **Fórmulas Metalúrgicas**: Peso Seco y Ley de Concentración Fina en función del mineral (estaño, zinc, plata, plomo, etc.) utilizando valores de la Bolsa de Metales de Londres (LME).
    *   `Peso Seco = Peso Húmedo * (1 - Humedad / 100)`
    *   `Peso Fino = Peso Seco * (Ley / 100)`
*   **Marco de Distribución (Ley N° 535)**:
    *   **85%** va directamente a la Gobernación Autónoma Departamental de Oruro para obras viales e infraestructura.
    *   **15%** va para el Municipio Productor de donde se extrajo el recurso natural.
*   **Boleta de Pre-Liquidación**: Diseño con fondos translúcidos y desenfoque Gaussiano, y soporte de hojas de estilo exclusivas de impresión física (`@media print`) para generar una boleta nítida de pre-liquidación oficial (estilo Banco Unión) en formato A5/Carta a blanco y negro.

### 2. 🏛️ Seguimiento de Hojas de Ruta (`sistema-correspondencia`)
Desarrollado para resolver la trazabilidad de documentos en la burocracia pública mediante un flujo de correspondencia departamental.
*   **Proveídos y Derivaciones**: Permite a cada secretaría derivar el documento a otra oficina ingresando el nuevo estado y el proveído (comentario oficial).
*   **Línea de Tiempo Dinámica**: Renderizado dinámico tipo vertical timeline que rastrea e ilustra cada paso del expediente desde Ventanilla Única, destacando el estado activo y los completados.

### 📊 3. Dashboard Estadístico Departamental (`Panel-de-control`)
Panel visual premium orientado a la toma de decisiones por los directores y secretarios de la Gobernación.
*   **Big Data Local**: Filtra y acumula miles de registros en memoria usando programación funcional avanzada (`.reduce()`, `.filter()`).
*   **Formatos Oficiales**: Renderiza e internacionaliza montos y cantidades usando el estándar oficial de localización de JavaScript `.toLocaleString()`, garantizando legibilidad en Bolivia.

### 📝 4. Gestor de Trámites Ciudadanos (`registro-tramites`)
Un CRUD simplificado con persistencia local permanente para registrar solicitudes ciudadanas en Ventanilla Única sin necesidad de bases de datos centralizadas en la primera fase.
*   **Persistencia**: Sincronización transparente con `LocalStorage`.
*   **UI/UX**: Control de estado vacío (cuando no hay trámites en bandeja, la interfaz muestra un mensaje institucional).

### 🚶 5. Sistema de Gestión de Turnos (`sistema-turnos`)
Mapea el flujo de atención al ciudadano en las oficinas centrales de la Gobernación de Oruro.
*   **Algoritmo**: Estructura de Cola secuencial clásica (First-In, First-Out).
*   **Diseño**: Panel de visualización de turnos para salas de espera e interfaz de control para los operarios de ventanilla.

### 💵 6. Monitor del Dólar en Tiempo Real (`monitor-dolar`)
Un panel auxiliar que permite monitorear cotizaciones de monedas extranjeras para estimaciones presupuestarias en licitaciones internacionales.
*   **Asincronía**: Implementación nativa de la Fetch API para llamadas no bloqueantes.
*   **Modularidad**: Código altamente reutilizable estructurado bajo ES6 Modules (`import`/`export`).

---

## ⚡ Requisitos e Instrucciones de Ejecución

Debido a que varias de las aplicaciones utilizan JavaScript modular (ES6 Modules) y APIs del navegador con restricciones de seguridad CORS, es necesario servir los proyectos desde un servidor local.

### Opción 1: Python (Recomendada en Linux/macOS)
Abre la terminal en la carpeta raíz del proyecto seleccionado y ejecuta:
```bash
python3 -m http.server 8000
```
Luego ingresa a `http://localhost:8000` en tu navegador.

### Opción 2: VS Code Live Server
Si utilizas Visual Studio Code:
1. Instala la extensión **Live Server**.
2. Haz clic derecho sobre el archivo `index.html` del proyecto deseado y selecciona **"Open with Live Server"**.

---

## 🎯 Impacto y Objetivos del Portafolio
Este conjunto de proyectos refleja la capacidad de resolver retos de ingeniería de software aplicados a la administración pública:
*   **Optimización del Tiempo**: La digitalización de la correspondencia y de turnos reduce los tiempos de espera y tramitación ciudadana.
*   **Seguridad Fiscal**: El cálculo exacto y boletas estandarizadas de regalías mineras protegen la recaudación departamental.
*   **Decisiones Basadas en Datos**: El Dashboard demográfico permite una mejor asignación de presupuestos provinciales.
*   **Código Limpio e Institucional**: Estilos visuales consistentes con la identidad de la Gobernación de Oruro, priorizando usabilidad, velocidad de carga y accesibilidad.
