# 🏢 Gobernación de Oruro - Sistema de Turnos (Fase 1)

Bienvenido a tu primera asignación técnica en el Departamento de Desarrollo de la **Gobernación Autónoma Departamental de Oruro**. Este proyecto simula un entorno real de Atención al Ciudadano. Tu objetivo es desarrollar la lógica central del sistema de emisión y llamado de turnos.

---

## 🎯 Objetivo del Proyecto
Evaluar la capacidad de implementar estructuras de datos en memoria (Colas/Queues) utilizando la lógica **FIFO** (*First In, First Out*), así como la manipulación dinámica y eficiente del DOM usando **JavaScript puro (Vanilla JS)**.

---

## 📂 Estructura del Proyecto
El proyecto cuenta con la siguiente estructura de archivos:

```text
sistema-turnos/
├── index.html             (Interfaz Web - NO MODIFICAR)
├── assets/
│   └── css/
│       └── styles.css     (Hojas de Estilo - NO MODIFICAR)
└── src/
    └── main.js            (Lógica del Sistema - TU ÁREA DE TRABAJO)
```

---

## ⚠️ Reglas Estrictas de Desarrollo
1. **Preservar el Diseño**: Queda totalmente prohibido modificar `index.html` o `styles.css`. La interfaz ya cuenta con la aprobación del área de Experiencia de Usuario (UX/UI).
2. **Estado en Memoria**: Para esta Fase 1, no está permitido el uso de bases de datos externas ni almacenamiento persistente en el navegador (`LocalStorage`). Toda la información debe persistir únicamente en la sesión de memoria activa (`let filaDeEspera = []`).
3. **Clean Code**: Mantén el código ordenado, con nombres de variables descriptivos y comentarios concisos.

---

## ⚙️ Arquitectura del Flujo de Datos (FIFO)
El sistema opera bajo una estructura de cola secuencial clásica:

```text
  [ Ciudadano ] ---> (Registrar) ---> [ Cola de Espera ] (filaDeEspera)
                                           |  A-1  |  A-2  |  A-3  |
                                           +-------+-------+-------+
                                                       |
  [ Ventanilla ] <--- (Llamar Siguiente) <-------------+ (Remueve el primero)
```

---

## 🛠️ Misiones (Retos de la Fase 1)
Abre `src/main.js` y completa las siguientes implementaciones:

*   **RETO 1 (`registrarCiudadano`)**: 
    1. Obtén el nombre desde el input.
    2. Valida que no contenga únicamente espacios en blanco usando `.trim()`.
    3. Construye el objeto del ciudadano con formato `{ turno: "A-X", nombre: "..." }`.
    4. Insértalo al final de la cola `filaDeEspera`.
    5. Limpia el input y refresca la lista.
*   **RETO 2 (`llamarSiguiente`)**: 
    1. Comprueba si hay ciudadanos esperando en el array.
    2. Extrae al primer ciudadano de la fila utilizando el método `.shift()` (garantiza la lógica FIFO).
    3. Actualiza el panel del funcionario mostrando el turno y nombre seleccionado.
    4. Refresca la lista.
*   **RETO 3 (`actualizarInterfazFila`)**: 
    1. Limpia la lista del DOM `listaEsperaUl` para prevenir duplicación visual.
    2. Recorre el arreglo y genera elementos `<li>` dinámicos.
    3. Modifica el contador en pantalla con la longitud actual de la cola (`filaDeEspera.length`).

---

## 📈 Ruta de Aprendizaje y Evolución (Los 3 Niveles)
*Diseñado por la Dirección de Ingeniería de Software (Arquitectura Senior - +20 años de experiencia)*

Este mini-proyecto está diseñado para escalar técnicamente a medida que adquieres nuevas habilidades en desarrollo de software:

### 🟢 Nivel 1: Básico (Fase Actual - En Memoria)
*   **Foco**: Lógica síncrona en memoria y sincronización básica del DOM.
*   **Ejemplo de implementación**:
    ```javascript
    // Agregar elemento a la fila (FIFO)
    filaDeEspera.push({ turno: `A-${numeroTurnoGlobal}`, nombre: "Juan Pérez" });
    // Extraer primer elemento (FIFO)
    const proximo = filaDeEspera.shift();
    ```

### 🟡 Nivel 2: Intermedio (Siguiente Paso - Resiliencia y Persistencia)
*   **Foco**: Persistencia local ante fallos o recargas de página y manejo de estados limpios.
*   **Ejemplo de implementación**:
    ```javascript
    // Guardar estado en el navegador
    localStorage.setItem("filaDeEspera", JSON.stringify(filaDeEspera));
    
    // Recuperar estado al iniciar la aplicación
    const datosGuardados = localStorage.getItem("filaDeEspera");
    if (datosGuardados) {
        filaDeEspera = JSON.parse(datosGuardados);
    }
    ```

### 🔴 Nivel 3: Avanzado (Enterprise - Tiempo Real, APIs y Audio)
*   **Foco**: Arquitectura cliente-servidor distribuida, eventos asíncronos en tiempo real y accesibilidad.
*   **Ejemplo de implementación**:
    ```javascript
    // 1. Notificación por Altavoces mediante Web Speech API
    const mensaje = new SpeechSynthesisUtterance(`Turno ${proximo.turno}, favor pasar a ventanilla`);
    window.speechSynthesis.speak(mensaje);

    // 2. Sincronización en tiempo real vía WebSockets
    socket.emit("nuevo-turno-llamado", { turno: proximo.turno });
    ```

---

## 🚀 Cómo Ejecutar el Proyecto
Para visualizar y probar la aplicación en tu entorno local:
1. Asegúrate de haber completado las funciones en `src/main.js`.
2. Abre el archivo `index.html` haciendo doble clic en él en tu explorador de archivos para cargarlo en el navegador, o levanta un servidor de desarrollo local usando VS Code (como Live Server) o Python:
   ```bash
   python3 -m http.server 8000
   ```
3. Accede en tu navegador a `http://localhost:8000`.

---
*Evaluación Técnica a cargo de Ingeniería de Sistemas.*