# 📂 Fase 6: Sistema de Registro y Emisión de Personerías Jurídicas (Oruro)

Este módulo automatiza y controla el proceso de emisión del reconocimiento de **Personerías Jurídicas** de comunidades indígenas, juntas vecinales (OTBs), sindicatos agrarios y asociaciones civiles dentro de la jurisdicción del Gobierno Autónomo Departamental de Oruro.

---

## 🎯 Objetivo de Aprendizaje
Dominar la **validación de estados complejos**, la estructuración de flujos de aprobación basados en requerimientos legales acumulativos (checklists documentales) y el formato y emisión de resoluciones institucionales mediante estilos imprimibles (`@media print`).

---

## 📂 Estructura del Proyecto
El proyecto está estructurado de la siguiente forma:

```text
control-personerias/
├── index.html                   (Panel administrativo de registro, checklist y resoluciones)
├── assets/
│   └── css/
│       └── styles.css           (Hojas de estilo corporativas y formato de impresión)
└── src/
    └── main.js                  (Lógica de validación, correlativos y guardado local)
```

---

## ⚠️ Reglas del Reto
1. **Validación Obligatoria**: No se puede cambiar el estado de un trámite a "Aprobado" si no se ha completado el 100% de la documentación obligatoria (Acta de Fundación, Estatuto Orgánico, Reglamento Interno y Acta de Elección).
2. **Generación de Resoluciones**: Las Personerías Jurídicas aprobadas deben habilitar un botón para abrir y previsualizar la Resolución Departamental formal (estilo papel membretado oficial).
3. **Persistencia Síncrona**: Cada cambio en el estado del trámite debe guardarse inmediatamente en `LocalStorage`.

---

## 📈 Ruta de Aprendizaje e Ingeniería (Los 3 Niveles)

### 🟢 Nivel 1: Básico (Registro Simple sin Validación Documental)
*   **Foco**: Formularios de registro simples con estados estáticos (Aprobado/Rechazado) de entrada.
*   **Problema**: Carga la bandeja con datos incompletos o personerías aprobadas sin sustento legal.

### 🟡 Nivel 2: Intermedio (Flujo Documental y Aprobación Condicionada)
*   **Foco**: Los estados cambian condicionalmente basados en el checklist documental. El estado pasa por "Pendiente", "En Revisión" y solo habilita "Aprobado" tras la carga del 100% de los documentos.

### 🔴 Nivel 3: Avanzado (Fase Actual - Emisión de Resolución e Impresión)
*   **Foco**: Generación de códigos correlativos institucionales (ej. `RD-OR-2026-0001`), impresión física limpia con directivas `@media print` para omitir botones del navegador, y persistencia síncrona en LocalStorage.
