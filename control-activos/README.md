# 🖥️ Fase 8: Sistema de Registro y Auditoría de Activos Fijos con QR (Oruro)

Este módulo gestiona e inventaría los bienes e infraestructura de la Gobernación Autónoma Departamental de Oruro (equipos informáticos, mobiliario, vehículos) asignados a los servidores públicos, automatizando el control físico con **códigos QR dinámicos generados en caliente**.

---

## 🎯 Objetivo de Aprendizaje
Aprender a **dibujar y renderizar gráficos binarios estructurados en Canvas** (código QR nativo) sin usar dependencias o librerías externas de terceros, controlando además **estructuras de datos transaccionales** para logs históricos e inmutables de transferencias de custodios.

---

## 📂 Estructura del Proyecto
El proyecto está estructurado de la siguiente forma:

```text
control-activos/
├── index.html                   (Dashboard principal, generador de etiquetas y simulador de escáner)
├── assets/
│   └── css/
│       └── styles.css           (Tema industrial de alta precisión con animaciones de escaneo)
└── src/
    └── main.js                  (Algoritmo generador de código QR nativo en Canvas, historial y LocalStorage)
```

---

## ⚠️ Reglas del Reto
1. **Generación Nociva Cero (Sin Librerías)**: Está estrictamente prohibido cargar librerías externas para el código QR (como qrcode.js). El código QR debe generarse dibujando cuadrados negros y blancos en un elemento `<canvas>` usando el contexto 2D de JavaScript nativo, basándose en la codificación de la información del activo.
2. **Simulador de Escáner**: Debe existir una interfaz interactiva de "Cámara de Escaneo" que simule la lectura del QR. Al pasar el cursor sobre la etiqueta QR o hacer clic en "Escanear", la cámara simulada debe decodificar el código y desplegar en pantalla un modal con la información exacta del activo.
3. **Historial de Transferencias**: Cada vez que se cambia el custodio o la oficina de un activo, debe registrarse la acción en un log inmutable de auditoría adjunto a la ficha del activo.

---

## 📈 Ruta de Aprendizaje e Ingeniería (Los 3 Niveles)

### 🟢 Nivel 1: Básico (CRUD Simple de Activos)
*   **Foco**: Registros planos de activos en una tabla sin códigos QR ni control de custodios.
*   **Problema**: Dificultad para realizar inventarios físicos en campo de forma rápida.

### 🟡 Nivel 2: Intermedio (Asignación de Códigos de Barra/QR Estáticos)
*   **Foco**: Integración de códigos QR mediante APIs externas que requieren conexión a internet permanente.

### 🔴 Nivel 3: Avanzado (Fase Actual - QR en Canvas y Trazabilidad Histórica)
*   **Foco**: Generación local y autónoma de códigos QR sobre Canvas (útil para auditorías en zonas rurales de Oruro sin internet) e historial inmutable de custodios guardado en `LocalStorage`.
