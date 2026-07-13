# 🍃 Fase 7: Sistema de Monitoreo e Impacto de Licencias Ambientales (Oruro)

Este módulo gestiona, registra y fiscaliza las **Fichas Ambientales (FA)** y **Manifiestos Ambientales (MA)** para operadoras mineras, cooperativas e industrias en las 16 provincias del departamento de Oruro.

---

## 🎯 Objetivo de Aprendizaje
Dominar la **manipulación interactiva de gráficos vectoriales (SVG)** integrados directamente en el DOM, asociando datos estructurados a polígonos gráficos en tiempo real y calculando **índices de riesgo dinámicos** basados en múltiples variables ambientales.

---

## 📂 Estructura del Proyecto
El proyecto está estructurado de la siguiente forma:

```text
licencias-ambientales/
├── index.html                   (Panel de control, KPIs y mapa departamental SVG interactivo)
├── assets/
│   └── css/
│       └── styles.css           (Hojas de estilo con paleta ecológica y transiciones de riesgo)
└── src/
    └── main.js                  (Algoritmos de cálculo de riesgo, carga local y coloreado del mapa)
```

---

## ⚠️ Reglas del Reto
1. **Mapa SVG Interactivo**: El mapa de Oruro debe ser un gráfico SVG nativo en línea. Al hacer hover sobre una provincia, debe mostrarse su nombre y estadísticas clave en un tooltip. Al hacer click, debe filtrarse la bandeja para mostrar solo las licencias de esa provincia.
2. **Evaluación Automática de Riesgo**: Las solicitudes de licencia deben autoevaluar su riesgo (Bajo, Medio, Alto) en base a:
   * Tipo de actividad (Minería Pesada = Alto, Agroindustrial = Medio, Servicio = Bajo).
   * Cercanía a cuerpos de agua o reservas ecológicas (Sí = +3 puntos de riesgo).
3. **Persistencia Dinámica**: Al actualizar o registrar una nueva licencia, el color de la provincia en el mapa debe actualizarse dinámicamente de acuerdo con el promedio de riesgo acumulado en ella (Verde = Bajo, Amarillo = Medio, Rojo = Alto).

---

## 📈 Ruta de Aprendizaje e Ingeniería (Los 3 Niveles)

### 🟢 Nivel 1: Básico (Registro de Licencias y Listado)
*   **Foco**: Formulario simple y tabla de registros sin mapas ni cálculos.
*   **Problema**: Falta de análisis territorial, dificultando la toma de decisiones ecológicas.

### 🟡 Nivel 2: Intermedio (Evaluación de Riesgo y Alertas)
*   **Foco**: Cálculo automático de riesgo mediante algoritmos de decisión basados en variables geográficas e industriales.

### 🔴 Nivel 3: Avanzado (Fase Actual - Mapa Interactivo y Analítica Espacial)
*   **Foco**: Integración del mapa SVG interactivo conectado bidireccionalmente con la base de datos `LocalStorage`. El mapa refleja visualmente el estado del departamento y actúa como filtro espacial de datos.
