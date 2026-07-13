# 🏛️ Gobernación de Oruro - Hojas de Ruta y Correspondencia (Fase 4 - Avanzado)

¡Bienvenido a la **Fase 4 (Nivel Avanzado)** del programa de inducción técnica!

En esta fase, dejarás de construir aplicaciones aisladas y resolverás uno de los mayores problemas de la gestión pública en Bolivia: el **seguimiento y control de Hojas de Ruta** para solicitudes ciudadanas. Este proyecto simula el ciclo de vida de un documento (trámite) a medida que viaja por diferentes secretarías de la Gobernación de Oruro.

---

## 🎯 Objetivo de Aprendizaje
Dominar el modelado de **datos anidados** (arreglos de objetos dentro de otros objetos), la manipulación del DOM para generar interfaces tipo **Líneas de Tiempo (Timeline)** y la persistencia de transacciones e historiales de estado en `LocalStorage`.

---

## 📂 Estructura del Proyecto
El proyecto está organizado en las siguientes carpetas y archivos:

```text
sistema-correspondencia/
├── index.html                   (Panel con módulos de registro, consulta y bandeja)
├── assets/
│   └── css/
│       └── styles.css           (Hojas de estilo premium que incluye timeline e interfaz)
└── src/
    └── main.js                  (Lógica de negocio e historial de movimientos)
```

---

## ⚠️ Reglas del Reto
1. **Preservar el Archivo index.html**: No debes modificar la estructura básica de los campos ni los IDs de los inputs y contenedores.
2. **Estructura de Datos Única**: Cada documento debe modelarse con un identificador único (ID), un código correlativo formal (`HR-OR-2026-XXXX`) e incluir un arreglo interno llamado `historial` que registre cada movimiento del trámite.
3. **Persistencia Síncrona**: Toda derivación o cambio de oficina debe reflejarse en `LocalStorage` de forma inmediata.

---

## 🛠️ Misiones (Los Retos de la Fase 4)
Para completar el entrenamiento, debes implementar o entender la lógica programada en `src/main.js`:

*   **RETO 1: Generación de Códigos y Registro Inicial**
    *   Al registrar un trámite en *Ventanilla Única*, debes calcular el código correlativo de manera incremental basándote en la longitud del arreglo.
    *   Debes inicializar el trámite en estado `"Pendiente"` y crear el primer registro en su arreglo `historial` detallando la oficina de destino inicial y el mensaje de recepción.
*   **RETO 2: Lógica de Derivaciones y Proveídos**
    *   Al pulsar en **Derivar**, debes capturar el ID del trámite, abrir la ventana modal y poblar los campos del formulario.
    *   Al enviar el formulario de derivación, debes buscar el trámite en tu base de datos y añadir un nuevo objeto al final del arreglo `historial` con la nueva oficina, el nuevo estado y el comentario/proveído del funcionario.
*   **RETO 3: Motor de Búsqueda y Timeline Dinámico**
    *   Implementar una consulta que busque exactamente por el código del trámite (sin distinguir mayúsculas de minúsculas).
    *   Si se encuentra el documento, renderizar dinámicamente una línea de tiempo (timeline) vertical utilizando los elementos del arreglo `historial`, destacando el paso actual (activo) con estilos visuales diferentes a los pasos anteriores (completados).

---

## 📈 Ruta de Aprendizaje e Ingeniería (Los 3 Niveles)
*Perspectiva de Arquitectura de Software Gubernamental*

### 🟢 Nivel 1: Básico (Trámites Estáticos sin Historial)
*   **Foco**: Guardar documentos con un único estado y oficina de destino. Si el documento cambia de oficina, simplemente se sobrescribe el dato.
*   **Problema**: Se pierde la trazabilidad. No es posible auditar qué funcionarios procesaron el archivo o cuánto tiempo tardó en cada dependencia.

### 🟡 Nivel 2: Intermedio (Estructuras Relacionales de Trámites)
*   **Foco**: Uso de persistencia estructurada local, vinculando estados y tablas en memoria de manera lineal. Se implementa una tabla bidimensional para ver la ubicación actual de los archivos.

### 🔴 Nivel 3: Avanzado (Fase Actual - Hojas de Ruta Complejas y Timelines)
*   **Foco**: Modelado transaccional completo. El estado actual de la hoja de ruta se deriva de la sumatoria de sus pasos pasados.
*   **Ejemplo Técnico del Historial Anidado**:
    ```javascript
    const tramite = {
        codigo: "HR-OR-2026-0001",
        oficinaActual: "Asesoría Jurídica",
        estadoActual: "En Revisión",
        historial: [
            { fecha: "10/07/2026 19:00", oficinaDestino: "Secretaría General", estado: "Pendiente", comentario: "Ingreso" },
            { fecha: "10/07/2026 19:15", oficinaDestino: "Asesoría Jurídica", estado: "En Revisión", comentario: "Revisión técnica de firma legal" }
        ]
    };
    ```

---

## 🚀 Cómo Ejecutar el Sistema
1. Abre `index.html` en tu navegador.
2. Registra un nuevo trámite ciudadano en la sección **Ventanilla Única**.
3. Revisa la **Bandeja de Control de Correspondencia** (abajo), pulsa **Derivar**, selecciona una nueva oficina destino, introduce un proveído y guarda la derivación.
4. Escribe el código generado en el buscador de la sección **Consulta y Seguimiento Ciudadano** y observa cómo se genera y actualiza la línea de tiempo interactiva.

---
*Evaluación Técnica a cargo de Ingeniería de Sistemas.*
