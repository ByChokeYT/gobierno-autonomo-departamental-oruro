# 📜 Registro y Emisión de Personerías Jurídicas (Oruro)

**Gobernación Autónoma Departamental de Oruro (Bolivia)**  
*Cumplimiento Ley N° 031 Marco de Autonomías y Descentralización · Dirección General de Asuntos Jurídicos*

---

## 📌 Descripción General

Este módulo automatiza y fiscaliza el flujo de aprobación legal para la emisión de **Personerías Jurídicas** de organizaciones civiles, comunidades indígenas originarias, juntas vecinales (OTBs), sindicatos agrarios y asociaciones sin fines de lucro en el Departamento de Oruro.

Incluye **checklist dinámico de validación documental**, **emisión de Resoluciones Administrativas Departamentales membretadas**, **generación de correlativos institucionales (`RD-OR-2026-XXXX`)**, **exportación de registros en CSV** y **filtro universal con atajos de teclado**.

---

## 🚀 Características Principales

### 1. 📋 Checklist de Validación Documental 4/4
* **Verificación de 4 Requisitos Obligatorios:**
  1. Acta de Fundación / Constitución Legal.
  2. Estatuto Orgánico Institucional.
  3. Reglamento Interno Aprobado.
  4. Acta de Elección y Posesión del Directorio.
* **Aprobación Automática:** Los trámites que cumplen con el 100% de la documentación pasan automáticamente al estado `Aprobado`, generando el código correlativo de resolución.

### 2. 🏛️ Emisión e Impresión de Resoluciones Departamentales
* Documento oficial previsualizable e imprimible (`Ctrl+P`) con el **Escudo de Oruro como marca de agua**, visto, considerandos, por tanto, resuelve y líneas de firma del Asesor Jurídico y del Gobernador.

### 3. ⌨️ Accesibilidad, Filtros & CSV
* **Atajo `Ctrl + K`:** Acceso directo e instantáneo a la búsqueda universal.
* **Filtros por Tipo y Provincia:** Selección rápida por provicia (Cercado, Eduardo Abaroa, Carangas, Sajama, Sabaya, Poopó, Dalence, etc.).
* **Exportar CSV con BOM UTF-8:** Descarga de reportes compatibles con Microsoft Excel.

### 4. 🎨 Diseño UI/UX Royal Navy & Legal Gold
* Tema oscuro institucional con detalles en oro legal y azul marino real.
* Iconografía 100% vectorial SVG sin emojis genéricos.
* Reloj institucional en vivo `HH:MM:SS` en `JetBrains Mono`.

---

## 📂 Estructura de Archivos

```text
control-personerias/
├── index.html                   # Dashboard de control legal, formulario con checklist y modal de resolución
├── assets/
│   └── css/
│       └── styles.css           # Estilos royal navy dark, checklist customizado y documento de resolución imprimible
└── src/
    └── main.js                  # Lógica de validación 4/4, correlativos, exportador CSV y LocalStorage
```

---

## ⚡ Instalación y Ejecución

1. No requiere instalación de librerías externas (`Zero dependencies`).
2. Abre [index.html](file:///c:/Users/Admin/Downloads/gobierno-autonomo-departamental-oruro/control-personerias/index.html) directamente en cualquier navegador web moderno.

---

*Gobernación Autónoma Departamental de Oruro — Servicio Jurídico Transparente y Eficiente*
