# 💵 Monitor del Dólar en Tiempo Real

Un sistema ligero de Frontend que consume una API pública para mostrar la cotización del dólar, actualizándose de manera asíncrona y continua.

## 🚀 Características Principales
*   **Separación de Responsabilidades:** Arquitectura basada en ES6 Modules.
*   **Tiempo Real:** Implementación de ciclo de actualización automatizado.
*   **Diseño Limpio:** Interfaz oscura (Dark Mode) estilizada y minimalista.

## 🛠️ Tecnologías Utilizadas
*   HTML5 / CSS3
*   JavaScript (Vanilla JS)
*   Fetch API

## ⚙️ Instalación y Ejecución
Debido a las políticas de seguridad (CORS) de los navegadores al usar módulos de JavaScript, el proyecto debe ejecutarse a través de un servidor local.

**Opción 1: Entorno de Desarrollo (VS Code)**
1. Instalar la extensión "Live Server".
2. Clic derecho sobre `index.html` -> Seleccionar "Open with Live Server".

**Opción 2: Desde la Terminal (Entornos Unix)**
1. Abrir la terminal en la raíz del proyecto.
2. Ejecutar el módulo de Python:
   `python3 -m http.server 8000`
3. Navegar a `http://localhost:8000`

## 📁 Estructura del Proyecto
*   `/index.html` - Punto de entrada y esqueleto de la UI.
*   `/assets/css/styles.css` - Hoja de estilos principal.
*   `/src/main.js` - Orquestador y bucle principal.
*   `/src/modules/api.js` - Gestión de peticiones HTTP.
*   `/src/modules/ui.js` - Renderizado y actualización del DOM.

---
*Desarrollado como proyecto de aprendizaje. Mentoría y revisión de arquitectura por ByChokeYT.*