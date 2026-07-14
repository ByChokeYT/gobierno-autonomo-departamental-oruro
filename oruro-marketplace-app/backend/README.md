# 🏛️ Guía de Desarrollo del Backend - Oruro Marketplace

Este directorio contiene el núcleo del servidor de la aplicación **Oruro Marketplace App**, desarrollado utilizando **Node.js**, **Express.js** y el ORM **Prisma** con soporte para base de datos relacional **PostgreSQL** (compatible con migraciones automáticas a **Supabase**).

---

## 📂 Estructura del Directorio Backend

El código está organizado siguiendo el patrón arquitectónico **MVC (Modelo-Vista-Controlador)** desacoplado:

*   `server.js`: Punto de entrada de la aplicación Express. Inicializa middlewares y el cliente de base de datos.
*   `prisma/schema.prisma`: Esquema de datos de Prisma que define tablas, relaciones, índices y enumeradores.
*   `controllers/`: Lógica de negocio de la aplicación (consulta, CRUD, analítica).
    *   `authController.js`: Lógica de registro e inicio de sesión de usuarios.
    *   `productController.js`: Gestión de las ofertas del catálogo y CRUD del productor.
    *   `analyticController.js`: Reportes estadísticos y moderación para la Gobernación.
*   `routes/`: Enrutadores Express que exponen los endpoints HTTP.
    *   `authRoutes.js`: Rutas de registro y login.
    *   `productRoutes.js`: Rutas de productos públicos y privados.
    *   `analyticRoutes.js`: Rutas de analítica y moderación de administrador.
*   `middleware/`: Funciones intermedias del flujo de ejecución HTTP.
    *   `authMiddleware.js`: Control de acceso mediante validación estricta de tokens JWT.
*   `.env`: Archivo de variables de entorno (puertos, claves secretas y URIs de base de datos).

---

## ⚡ Requisitos e Instrucciones de Ejecución

### 1. Instalación de Dependencias
Asegúrate de estar en el directorio `backend/` y ejecuta:
```bash
npm install
```
Esto instalará los paquetes necesarios verificados y validados de forma segura:
*   `express`: Servidor HTTP.
*   `cors`: Control de acceso HTTP (CORS).
*   `dotenv`: Carga de variables de entorno desde `.env`.
*   `jsonwebtoken`: Creación y firma de tokens JWT seguros.
*   `prisma`: Herramienta CLI de base de datos (DevDependency).
*   `@prisma/client`: Motor de consultas a base de datos autogenerado.
*   `nodemon`: Ejecución en desarrollo con autorecarga (DevDependency).

### 2. Configuración de Base de Datos
Edita el archivo `.env` configurando la cadena de conexión correspondiente:

*   **Para Desarrollo Local (PostgreSQL local):**
    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oruro_market?schema=public"
    ```
*   **Para Despliegue en Producción (Supabase):**
    ```env
    DATABASE_URL="postgresql://postgres.[ID_PROYECTO]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
    ```

### 3. Generación del Cliente Prisma y Migración
Para mapear el esquema Prisma físicamente a la base de datos PostgreSQL y generar las definiciones de tipos en JavaScript, ejecuta en la consola:

*   **Paso A: Crear y aplicar migraciones en base de datos:**
    ```bash
    npx prisma migrate dev --name init
    ```
*   **Paso B: Regenerar el cliente de base de datos:**
    ```bash
    npx prisma generate
    ```

### 4. Lanzar el Servidor en Desarrollo
Para iniciar el servidor con recarga automática al modificar archivos:
```bash
npm run dev
```
El servidor comenzará a escuchar peticiones en `http://localhost:5000` (o el puerto definido en tu `.env`).

---

## 🔒 Estándares de Seguridad y Buenas Prácticas (Ingeniería de Sistemas)

Para cumplir con las normas de seguridad del Gobierno Autónomo Departamental de Oruro y mitigar vulnerabilidades, se deben seguir estrictamente las siguientes pautas en el desarrollo de la lógica de negocio:

### 1. Prevención de Inyección SQL (SQLi)
*   **Regla:** Nunca utilices concatenación de strings para formar sentencias SQL sobre la base de datos.
*   **Acción:** Prisma ORM parametriza de forma nativa todas las consultas (por ejemplo, al usar `prisma.producto.findMany()`). Si por algún motivo de rendimiento requieres escribir SQL puro, utiliza exclusivamente `prisma.$queryRaw` pasando los parámetros como variables separadas (las cuales se inyectan como marcadores de posición parametrizados `?`), nunca concatenando variables directamente en la cadena de texto.

### 2. Prevención de Cross-Site Scripting (XSS) en la API
*   **Regla:** Valida y sanea todas las entradas de texto del cliente antes de almacenarlas.
*   **Acción:** Los controladores deben validar que las cadenas de texto ingresadas por los productores (títulos de productos, descripciones) no contengan etiquetas de script u otros caracteres maliciosos. Asegúrate de sanitizar la entrada y forzar a que el frontend use asignación de texto plano (`textContent`) en lugar de `innerHTML` al renderizar estos datos en el DOM.

### 3. Seguridad en Autenticación y JWT
*   **Regla:** Protege los recursos privados del productor y del administrador de forma robusta.
*   **Acción:** El middleware `verifyToken` debe rechazar peticiones que no cuenten con un token firmado bajo el algoritmo seguro **HS256**. Nunca uses contraseñas en texto plano ni almacenes claves secretas directamente en el código de producción. El sistema está configurado para generar una clave efímera segura de forma local (`jwt_secret.txt`) si no se detecta la variable en el entorno.

### 4. Cabeceras HTTP y Políticas CORS
*   **Regla:** Mitiga riesgos de Clickjacking y MIME sniffing.
*   **Acción:** Las cabeceras `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` y la política `Content-Security-Policy` se inyectan automáticamente en cada petición mediante el middleware global configurado en `server.js`. Las políticas CORS están restringidas únicamente a los dominios autorizados de desarrollo y producción para evitar solicitudes de dominios maliciosos de terceros.
