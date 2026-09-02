# 📜 Consola Jurídica — Registro y Emisión de Personerías Jurídicas

### **Gobernación Autónoma Departamental de Oruro (Bolivia)**
*Dirección General de Asuntos Jurídicos · Fiscalización y Cumplimiento Ley N° 031 Marco de Autonomías y Descentralización*

[![Estado](https://img.shields.io/badge/Estado-Prototipo%20de%20Inducci%C3%B3n%20T%C3%A9cnica-blue?style=flat-square)](./index.html)
[![Normativa](https://img.shields.io/badge/Normativa-Ley%20N%C2%B0%20031%20Autonom%C3%ADas-orange?style=flat-square)](https://www.lexivox.org/packages/lexml/mostrar_jurisprudencia.php?sx=BO-L-N31)
[![Seguridad](https://img.shields.io/badge/Seguridad-Firma%20Digital%20SHA--256-green?style=flat-square)](#-nota-de-confidencialidad-y-alcance-del-prototipo)

---

> [!IMPORTANT]
> ### 🔒 Nota de Confidencialidad y Alcance del Prototipo Tecnológico
> **Exactitud Operativa y Carácter Demostrativo:** Este módulo representa un **prototipo arquitectónico, modelo funcional e inducción de ingeniería de software** desarrollado para la Dirección General de Asuntos Jurídicos del Gobierno Autónoma Departamental de Oruro.
> 
> * **Réplica Exacta de la Lógica de Negocio:** La estructura de validación documental (Checklist 4/4), la clasificación por las 16 provincias de Oruro, la numeración correlativa institucional (`RD-OR-2026-XXXX`) y la emisión membretada A4 reproducen con **estricta exactitud operativa** los flujos de fiscalización legal estipulados por la Ley N° 031.
> * **Protección de Datos e Infraestructura Segura:** Debido a que el manejo de expedientes gubernamentales reales involucra información institucional confidencial, firmas de autoridades y resoluciones normativas sujetas a auditorías del Estado (SAFCO), **los sistemas definitivos de producción operan en entornos aislados y de alta seguridad dentro de la red gubernamental**. Este prototipo demuestra con total transparencia la precisión técnica, modularidad y excelencia de UI/UX alcanzadas, sin exponer bases de datos reales ni información privilegiada.

---

## 🔄 Evolución del Sistema: ¿Para qué era suficiente antes vs. En qué mejora este proyecto?

### 📂 1. ¿Para qué era suficiente la metodología tradicional?
Antes de la implementación de esta consola digital, la gestión de personerías jurídicas se llevaba a cabo mediante **libros de recepción presencial y planillas locales**:
* **Suficiente para flujos de bajo volumen:** Permitía anotar manualmente la entrada de carpetas en cuadernos de ventanilla o tablas de Excel independientes.
* **Suficiente para consultas presenciales:** Los representantes debían acudir físicamente a las oficinas de la Gobernación en Oruro para averiguar el estado de su trámite.
* **Suficiente para transcripción manual:** La redacción de cada Resolución Administrativa se realizaba de forma individual en procesadores de texto, llenando nombres y datos uno a uno.

### ⚡ 2. ¿En qué mejora sustancialmente este proyecto?
Esta nueva Consola Jurídica moderniza y cualifica de manera **exponencial** el servicio público departamental:
1. **Redacción Automatizada sin Error Humano (*Borrador en Vivo*)**: La interfaz split-screen actualiza en tiempo real el borrador membretado de la Resolución Administrativa a medida que el operador ingresa los datos, asignando correlativos únicos.
2. **Fiscalización Estandarizada y Transparente (*Checklist 4/4*)**: Valida objetivamente la entrega del Acta de Fundación, Estatuto Orgánico, Reglamento Interno y Posesión de Directorio según la Ley N° 031, impidiendo dictámenes favorables si faltan documentos.
3. **Seguridad Criptográfica y Auditoría SAFCO (*Firma Digital SHA-256*)**: Genera un código hash único de 256 bits y un código QR de validación que certifica la validez legal del documento e impide alteraciones.
4. **Trazabilidad del Expediente (*Audit Timeline*)**: Permite visualizar la línea de tiempo del trámite desde Ventanilla Única hasta la Firma del Gobernador.
5. **Verificador Digital de Autenticidad**: Herramienta integrada para que autoridades y ciudadanos verifiquen la validez de cualquier resolución ingresando su código o código hash.
6. **Cobertura Territorial Departamental (16 Provincias)**: Filtrado nativo para el control geográfico de expedientes en todas las provincias de Oruro (Cercado, Ladislao Cabrera, Eduardo Abaroa, Poopó, Carangas, Sajama, Sabaya, Pantaleón Dalence, etc.).
7. **Reportes Ejecutivos e Impresión Membretada A4**: Generación instantánea de informes consolidados de gestión e impresiones oficiales adaptadas a papel A4/Carta con marca de agua institucional.

---

## 📌 Descripción General

El **Sistema de Control y Emisión de Personerías Jurídicas** automatiza el ciclo de vida completo de las solicitudes presentadas por las organizaciones civiles del Departamento de Oruro:

* **Juntas Vecinales (OTBs)** (Sector urbano).
* **Comunidades Indígena Originario Campesinas** (16 Provincias de Oruro).
* **Sindicatos Agrarios y Gremiales**.
* **Asociaciones Civiles y Fundaciones sin Fines de Lucro**.

---

## 🚀 Innovaciones Tecnológicas y UX/UI Implementadas

### 1. ⚡ Borrador en Tiempo Real (*Split-Screen Live Drafting*)
* **Previsualización Instantánea:** Al registrar una nueva solicitud, el panel izquierdo recopila los datos mientras el panel derecho renderiza en tiempo real el borrador oficial de la Resolución Administrativa.
* **Medidor de Avance:** Barra de progreso dinámica que calcula el porcentaje de cumplimiento (0%, 25%, 50%, 75%, 100%) y emite el dictamen preliminar automático.

### 2. 📋 Checklist de Validación Documental 4/4
* **4 Requisitos Obligatorios:**
  1. `Acta de Fundación / Constitución Legal`
  2. `Estatuto Orgánico Institucional`
  3. `Reglamento Interno Aprobado`
  4. `Acta de Elección y Posesión del Directorio`
* **Etiquetado por Micro-Chips:** La bandeja de control presenta chips visuales interactivos (`✓ Acta`, `✓ Estatuto`, `✗ Reg.`, `✗ Dir.`) con código de color dinámico y ventana modal de edición rápida.

### 3. 🔍 Módulo de Verificación Digital y Línea de Tiempo
* **Trazabilidad SAFCO:** Modal con historial paso a paso (*Ventanilla ➔ Revisión Técnica ➔ Dictamen Jurídico ➔ Emisión*).
* **Verificador Digital Criptográfico:** Consulta pública de validez mediante código de resolución o Hash SHA-256.

### 4. 🏛️ Emisión e Impresión de Resoluciones A4
* **Documento Oficial Membretado:** Incluye Escudo Departamental de Oruro en marca de agua, cabecera de doble línea, sello institucional en relieve dorado, visto, considerandos y articulado en cumplimiento de la Ley N° 031.
* **Impresión Física Exclusiva (`@media print`):** Adaptada para salida A4/Carta sin elementos sobrantes de la interfaz.

---

## 📂 Arquitectura de Software

```text
control-personerias/
├── index.html                   # Dashboard de control legal, vista split-screen de registro, verificador digital y modales
├── README.md                    # Documentación técnica, evolución del sistema y notas de confidencialidad
├── assets/
│   └── css/
│       └── styles.css           # Design Tokens (Gold & Royal Navy), glassmorphism y estilos de impresión A4
└── src/
    └── main.js                  # Lógica de negocio, borrador en vivo, firma hash SHA-256, verificador y reportes
```

---

## 🛠️ Especificaciones Técnicas

* **Tecnologías:** HTML5 Semántico, CSS3 Vanilla (Custom Properties & Glassmorphic UI), JavaScript ES6+ Nativo.
* **Patrón de Arquitectura:** State-driven UI, Event Delegation, Sincronización transparente con `LocalStorage API`.
* **Cero Dependencias:** No requiere instalación de paquetes Node ni servidores compilados. Funciona directamente en cualquier navegador moderno.

---

*Gobierno Autónomo Departamental de Oruro — Modernización Jurídica, Transparencia e Innovación Digital*
