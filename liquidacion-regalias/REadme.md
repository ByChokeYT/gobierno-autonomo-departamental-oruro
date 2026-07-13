# 🪙 Fase 5: SISREMIN - Liquidación de Regalías Mineras (Oruro)

Este proyecto simula el cálculo, registro e impresión de las liquidaciones de **Regalías Mineras** para la Dirección de Minería y Metalurgia de la Gobernación Autónoma Departamental de Oruro. Está alineado con las fórmulas de cálculo de la **Ley N° 535 de Minería y Metalurgia** de Bolivia.

---

## 📖 Guía de Aprendizaje Pedagógica (Tres Niveles)

Diseñado para estudiantes de ingeniería de software con tres niveles progresivos de complejidad técnica:

### 1. 🟢 Nivel Básico: Eventos y Fórmulas Metalúrgicas (Manipulación de Datos)
* **Objetivo**: Capturar los inputs del formulario en tiempo real para simular los valores del mineral antes de guardarlos.
* **Conceptos clave**:
  * Escuchar el evento `'input'` para disparar cálculos síncronos sin tener que recargar la página.
  * Realizar conversiones métricas (kilogramos a libras finas y onzas troy en base al mineral).
  * Fórmulas de cálculo de peso seco y ley de concentración fina:
    * $\text{Peso Seco} = \text{Peso Húmedo} \times (1 - \text{Humedad}/100)$
    * $\text{Peso Fino} = \text{Peso Seco} \times (\text{Ley}/100)$

### 2. 🟡 Nivel Intermedio: Acumuladores Declarativos y Persistencia (LocalStorage)
* **Objetivo**: Persistir los registros de liquidaciones en la bandeja centralizada y actualizar los KPIs generales del departamento de Oruro de manera reactiva.
* **Conceptos clave**:
  * Serialización de objetos estructurados JSON (`JSON.stringify` y `JSON.parse`) para evitar pérdida de datos.
  * Uso de métodos declarativos de arreglos: `.reduce()` para sumar el total recaudado, y estructurar filtros para encontrar el mineral líder (mayor volumen de extracción).

### 3. 🔴 Nivel Avanzado: Formateo de Impresión y Modales (Print Stylesheets)
* **Objetivo**: Crear una boleta de pre-liquidación oficial (estilo Banco Unión) que permita ser impresa de manera limpia y profesional para trámites presenciales.
* **Conceptos clave**:
  * Diseñar un modal overlay con fondos translúcidos y desenfoque Gaussiano (`backdrop-filter: blur()`).
  * Aplicar directivas `@media print` en el CSS para ocultar la interfaz web (menús, botones, KPIs) y centrar la boleta en formato A5/Carta blanco y negro nítido.

---

## 🛠️ Estructura del Proyecto

* **`index.html`**: Estructura principal con el tablero de KPIs, formulario interactivo de liquidación y la boleta bancaria modular.
* **`assets/css/styles.css`**: Hoja de estilos con paleta *Gravel & Copper* (cobre metálico y carbón slate) y reglas de impresión física.
* **`src/main.js`**: Motor metalúrgico de cálculo, cotizaciones de la Bolsa de Metales de Londres (LME) y sincronizador de persistencia local.

---

## 🏛️ Regla de Distribución de Regalías (Bolivia)
Por ley nacional, el aporte de regalías mineras recaudado se distribuye de la siguiente manera:
1. **85%** va directamente a las cuentas de la **Gobernación Autónoma Departamental de Oruro** para proyectos de desarrollo vial e infraestructura.
2. **15%** es destinado al **Municipio Productor** de donde se extrajo el recurso natural.
