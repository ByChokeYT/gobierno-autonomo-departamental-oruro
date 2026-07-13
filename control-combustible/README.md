# ⛽ Fase 10: Sistema de Emisión y Conciliación de Vales de Combustible (Oruro)

Este módulo controla, emite y fiscaliza la asignación de vales de gasolina y diésel para la flota vehicular oficial de la Gobernación de Oruro (Secretaría General, SEDECA, etc.), implementando **tokens criptográficos simulados** para prevenir la falsificación y clonación de vales.

---

## 🎯 Objetivo de Aprendizaje
Dominar la **seguridad informática aplicada al frontend** mediante algoritmos de generación de firmas hash de control (SHA-256 simulado) y la creación de **documentos de control de tesorería imprimibles** con validación descentralizada.

---

## 📂 Estructura del Proyecto
El proyecto está estructurado de la siguiente forma:

```text
control-combustible/
├── index.html                   (Tablero operativo, inventario de combustible y vales emitidos)
├── assets/
│   └── css/
│       └── styles.css           (Tema operativo industrial oscuro, estilos de impresión de vales)
└── src/
    └── main.js                  (Algoritmos de dispersión de token, control de inventario y LocalStorage)
```

---

## ⚠️ Reglas del Reto
1. **Prevención de Fraude (Token Criptográfico)**: Cada vale emitido debe generar un token de seguridad único calculado mediante un algoritmo hash que fusione:
   * Código de Vale + Placa del Vehículo + Cantidad de Litros + Clave Secreta Gubernamental.
   * El token resultante se dibuja en la boleta impresa en formato de texto y barras.
2. **Consumo de Inventario Reactivo**: Al emitir un vale de gasolina o diésel, el inventario virtual del tanque de la gobernación (ej. Tanque Base de 5,000 Litros) debe decrementarse reactivamente y mostrar alertas visuales si cae por debajo del 20% (Reserva Crítica).
3. **Boleta Oficial de Impresión**: El sistema debe incluir un botón de impresión que emita la boleta/vale en formato térmico o A6, optimizado bajo `@media print` para ser canjeado directamente en las estaciones de servicio autorizadas.

---

## 📈 Ruta de Aprendizaje e Ingeniería (Los 3 Niveles)

### 🟢 Nivel 1: Básico (Registro Simple de Vales en Lista)
*   **Foco**: Registro plano en texto de litros entregados a cada conductor, sin hashes ni decremento de tanques.
*   **Problema**: Elevada vulnerabilidad a la falsificación de firmas y duplicación manual de vales.

### 🟡 Nivel 2: Intermedio (Decremento de Inventario General)
*   **Foco**: Vinculación de consumos con la capacidad del tanque general para alertas de desabastecimiento, pero sin token criptográfico de validación.

### 🔴 Nivel 3: Avanzado (Fase Actual - Token Hash y Conciliación Criptográfica)
*   **Foco**: Emisión de vales de alta seguridad con tokens hash inalterables que evitan la falsificación física del cupón impreso, combinados con un control de inventario de tanques centralizado e inmutable en `LocalStorage`.
