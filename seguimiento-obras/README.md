# 🚧 Fase 9: Sistema de Control de Inversión y Caminos EVM (Oruro)

Este módulo gestiona el avance físico y financiero de las obras de infraestructura vial del Servicio Departamental de Caminos (**SEDECA**) en Oruro, implementando métricas avanzadas de **Earned Value Management (EVM)** para la toma de decisiones presupuestarias.

---

## 🎯 Objetivo de Aprendizaje
Dominar la **implementación de algoritmos matemáticos financieros de gestión de proyectos** (EVM / Valor Ganado), creando representaciones de rendimiento reactivas (SPI/CPI) y visualizaciones dinámicas de barras de progreso superpuestas (Progreso Planificado vs. Progreso Real).

---

## 📂 Estructura del Proyecto
El proyecto está estructurado de la siguiente forma:

```text
seguimiento-obras/
├── index.html                   (Dashboard de proyectos viales, KPIs y semáforos de desempeño)
├── assets/
│   └── css/
│       └── styles.css           (Hojas de estilo inspiradas en ingeniería civil, barra EVM)
└── src/
    └── main.js                  (Lógica matemática de EVM, cálculo de desviaciones y LocalStorage)
```

---

## ⚠️ Reglas del Reto
1. **Cálculo Matemático de EVM**: El sistema debe calcular en tiempo real los siguientes valores clave para cada obra registrada:
   * **Valor Planificado (PV)**: $\text{Presupuesto Total} \times \text{Porcentaje de Avance Planificado}$
   * **Valor Ganado (EV)**: $\text{Presupuesto Total} \times \text{Porcentaje de Avance Real}$
   * **Costo Real (AC)**: Costo real devengado cargado desde contabilidad.
   * **CV (Cost Variance)**: $\text{EV} - \text{AC}$
   * **SV (Schedule Variance)**: $\text{EV} - \text{PV}$
   * **CPI (Cost Performance Index)**: $\text{EV} / \text{AC}$ (Eficiencia de costo).
   * **SPI (Schedule Performance Index)**: $\text{EV} / \text{PV}$ (Eficiencia de cronograma).
2. **Semáforos de Rendimiento**: Los índices SPI y CPI deben mostrarse con badges de colores:
   * **Verde (Óptimo)**: $\ge 1.0$ (Proyecto a tiempo o menor costo).
   * **Amarillo (Alerta)**: $0.85$ a $0.99$ (Ligero retraso o sobrecosto).
   * **Rojo (Crítico)**: $< 0.85$ (Retraso grave o desviación presupuestaria severa).
3. **Barras de Progreso Comparativas**: Cada fila del proyecto en la tabla debe mostrar una barra de progreso que superponga visualmente el porcentaje planificado (línea delgada/sombreada) y el porcentaje real ejecutado (barra de color sólida).

---

## 📈 Ruta de Aprendizaje e Ingeniería (Los 3 Niveles)

### 🟢 Nivel 1: Básico (Registro de Obras y Avance Porcentual)
*   **Foco**: Registro básico del porcentaje de avance reportado por supervisores, sin cruzarlo con el presupuesto real gastado.
*   **Problema**: Se asume que si un proyecto va al 50% de tiempo, ha gastado el 50% del dinero, ocultando malversaciones o sobrecostos.

### 🟡 Nivel 2: Intermedio (Registro de Costos Reales)
*   **Foco**: Inclusión de presupuestos y costos devengados contables, pero calculando desviaciones puras en valor monetario absoluto sin índices de eficiencia relativos.

### 🔴 Nivel 3: Avanzado (Fase Actual - Implementación Completa de EVM)
*   **Foco**: Uso de la metodología estándar del PMI (Project Management Institute) - **EVM** (SPI/CPI) para medir la salud real del portafolio vial del departamento, con visualización de doble barra de progreso e indicadores semafóricos.
