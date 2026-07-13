# 🏢 Gobernación de Oruro - Registro de Trámites (Fase 2)

¡Bienvenido a la **Fase 2** del programa de inducción técnica de la **Gobernación Autónoma Departamental de Oruro**! En esta fase avanzamos hacia la persistencia de información y el ciclo de vida básico de los datos.

---

## 🎯 Objetivo del Proyecto
Desarrollar un **Mini-Sistema CRUD** (Crear, Leer, Eliminar) para el registro de trámites ciudadanos en el cual los datos persistan de manera local. El estudiante aprenderá a manipular tablas HTML de forma dinámica y a interactuar con la **Web Storage API (LocalStorage)** para que la información no se pierda al recargar la página o cerrar el navegador.

---

## 📂 Estructura del Proyecto
El proyecto cuenta con la siguiente estructura:

```text
registro-tramites/
├── index.html             (Interfaz Web - NO MODIFICAR)
├── assets/
│   └── css/
│       └── styles.css     (Hojas de Estilo - NO MODIFICAR)
└── src/
    └── main.js            (Lógica del CRUD - TU ÁREA DE TRABAJO)
```

---

## ⚠️ Reglas Estrictas de Desarrollo
1. **Preservar el Diseño**: No debes alterar el archivo `index.html` ni `styles.css`.
2. **Almacenamiento Local**: Toda la persistencia debe realizarse única y exclusivamente en `LocalStorage`. Aún no se permite la conexión a bases de datos en servidor (APIs).
3. **Control del Estado Vacío**: Cuando no existan trámites en la tabla, el contenedor `#estado-vacio` debe mostrarse adecuadamente.

---

## ⚙️ Arquitectura del Flujo de Datos (LocalStorage)

El ciclo de persistencia y renderizado sigue este flujo unidireccional:

```text
  [ Formulario ] -- (submit) -> [ Array en Memoria ] -- (Guardar) -> [ LocalStorage ]
        ^                              |                                   |
        |                        (Renderizar)                              |
        |                              v                                   |
  (Limpiar Input)              [ Tabla HTML (DOM) ] <--- (Cargar al iniciar)
```

---

## 🛠️ Misiones (Retos de la Fase 2)
Abre `src/main.js` y completa las siguientes implementaciones:

*   **RETO 1 (`guardarEnLocalStorage`)**: 
    Convierte el arreglo `listaTramites` en un string de formato JSON utilizando `JSON.stringify()` y almacénalo en `localStorage` bajo la clave `"tramites_gobernacion"`.
*   **RETO 2 (`cargarDesdeLocalStorage`)**: 
    Recupera el string almacenado bajo la clave `"tramites_gobernacion"`. Si existe, conviértelo nuevamente en un arreglo de objetos usando `JSON.parse()` y asígnalo a la variable global `listaTramites`.
*   **RETO 3 (`renderizarTabla`)**: 
    1. Vacía el cuerpo de la tabla (`tbodyTramites`).
    2. Si el arreglo está vacío, quita la clase `hidden` de `#estado-vacio` (y viceversa).
    3. Recorre el arreglo creando elementos `<tr>` dinámicos con los datos del trámite y un botón para completarlo.
    4. Inserta los elementos en el DOM y actualiza el contador global de trámites.
*   **RETO 4 (`registrarTramite`)**: 
    1. Captura el evento `submit` y cancela la recarga de página con `event.preventDefault()`.
    2. Lee y valida los campos del formulario (`.trim()`).
    3. Construye un objeto literal agregando un ID único (puedes usar `Date.now()` para generar un timestamp único).
    4. Empuja el objeto a `listaTramites`, guarda en localStorage, renderiza y limpia el formulario con `reset()`.
*   **RETO 5 (`completarTramite`)**: 
    Recibe el `id` de un trámite, fíltralo de la lista usando el método `.filter()`, guarda el nuevo estado en `LocalStorage` y vuelve a renderizar la tabla para reflejar la eliminación.

---

## 📈 Ruta de Aprendizaje y Evolución (Los 3 Niveles)
*Perspectiva de Ingeniería de Software (Arquitectura Senior - +20 años de experiencia)*

### 🟢 Nivel 1: Básico (Sin LocalStorage)
*   **Foco**: Renderizado básico de tablas y captura de datos en variables globales efímeras.
*   **Limitaciones**: Si la página se recarga, la tabla se borra por completo.

### 🟡 Nivel 2: Intermedio (Fase Actual - Persistencia con LocalStorage)
*   **Foco**: Persistencia de datos locales no volátiles mediante serialización JSON.
*   **Ventajas**: Los datos sobreviven a cierres accidentales del navegador y recargas de página.
*   **Ejemplo Técnico**:
    ```javascript
    // Guardar en formato string
    localStorage.setItem("tramites_gobernacion", JSON.stringify(listaTramites));
    // Recuperar en formato Objeto
    listaTramites = JSON.parse(localStorage.getItem("tramites_gobernacion"));
    ```

### 🔴 Nivel 3: Avanzado (Enterprise - Servidor y Sincronización Cloud)
*   **Foco**: Persistencia en bases de datos relacionales y autenticación de funcionarios.
*   **Evolución**:
    *   Sustituir `LocalStorage` por llamadas HTTP asíncronas (`fetch` / `axios`) a un Backend REST.
    *   Guardar la información de los trámites en una base de datos segura (como PostgreSQL).
    *   Añadir roles (ej. un funcionario puede registrar, un supervisor puede aprobar y eliminar).

---

## 🚀 Cómo Ejecutar el Proyecto
1. Asegúrate de que los archivos estén estructurados según la carpeta del proyecto.
2. Abre `index.html` haciendo doble clic en el explorador de archivos o inicia un servidor HTTP rápido:
   ```bash
   python3 -m http.server 8000
   ```
3. Registra trámites, refresca la página presionando `F5` para corroborar que los datos siguen ahí, y presiona el botón **Completar** para validar que se eliminen correctamente del almacenamiento.

---
*Evaluación Técnica a cargo de Ingeniería de Sistemas.*
