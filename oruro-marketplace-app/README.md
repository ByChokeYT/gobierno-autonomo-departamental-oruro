# oruro-marketplace-app

Este documento detalla el estándar profesional para estructurar este proyecto desde su concepción hasta su ejecución, asegurando una arquitectura sólida[cite: 1]. 

## 1. Documento de Requisitos del Producto (PRD)
El PRD define el qué y el por qué del proyecto[cite: 1].
* **Objetivos y Visión:** Digitalizar la oferta de los productores y microempresarios del rubro de la quinua y los camélidos en Oruro, permitiéndoles publicar sus productos y conectar directamente con compradores a nivel local, nacional e internacional.
* **Público Objetivo:** Usuarios con perfil dual: Productor/Vendedor (zonas rurales y urbanas de Oruro) y Comprador. El sistema además contará con un usuario administrador gestionado por la Gobernación del Departamento de Oruro.
* **Historias de Usuario:** 
  * "Como Productor, quiero registrarme y cargar fotos, título, descripción, precio y categoría (ej. Quinua Real, Charque de Llama, Lana de Alpaca) para ofrecer mi producción."
  * "Como Comprador, quiero usar el buscador y los filtros (por municipio, tipo de producto, rango de precio) para encontrar proveedores específicos."
  * "Como Administrador (Gobernación), quiero un Panel Web para moderar usuarios, eliminar publicaciones indebidas y visualizar estadísticas de interés comercial."
* **Alcance (In/Out):** 
  * *In (Fase 1 - MVP):* Aplicación ligera e intuitiva priorizada para dispositivos Android, registro dual, publicación, buscador y sistema de contacto.
  * *Out:* Pasarelas de pago integradas y logística de envíos. El cierre de venta se delega externamente.

## 2. Documento de Requisitos Técnicos (TRD)
El TRD traduce el PRD en decisiones de ingeniería[cite: 1].
* **Stack Tecnológico:** 
  * *Frontend:* Aplicación desarrollada con React y estilizada con Tailwind CSS para garantizar una interfaz sumamente ligera y responsiva.
  * *Backend & Base de Datos:* Entorno Node.js con base de datos PostgreSQL.
* **Entorno de Desarrollo:** Configuración estructurada y optimizada para entornos basados en Linux.
* **Autoría & Estándares:** Arquitectura central y desarrollo impulsado bajo los estándares de código de ByChokeYT.
* **Seguridad y Rendimiento:** Autenticación JWT y algoritmos de compresión de imágenes en el lado del cliente (vital para mitigar la lentitud de subida de fotos en áreas rurales con baja conectividad).

## 3. App Flow (Flujo de la Aplicación)
Mapeo de la navegación del usuario[cite: 1].

[Inicio / Splash Screen]   
├──> [Registro Dual] -> (Selección: Productor o Comprador)  
├──> [Feed Principal Android] -> Catálogo de Quinua y Camélidos  
│      ├──> [Buscador y Filtros] -> (Municipio, Tipo, Precio)  
│      └──> [Detalle de Producto]   
│             └──> [Sistema de Contacto] -> Redirección API directa a WhatsApp o Llamada Telefónica  
└──> [Panel Web Exclusivo] -> Entorno de escritorio para la Gobernación (Moderación)

## 4. Diseño UI/UX
* **Wireframes:** Bocetos estructurales pensados para maximizar la usabilidad en pantallas Android de gama de entrada[cite: 1].
* **Mockups:** Interfaz de alta fidelidad. Por lineamiento de diseño, los componentes de interfaz principales y botones de acción primaria se estructurarán estrictamente en color negro para contraste y legibilidad, descartando el uso de rojo.
* **Prototipos:** Flujo interactivo que simula la experiencia completa de carga de un producto (ej. subida de fotos de la granja)[cite: 1].

## 5. Esquema del Backend (Base de Datos y API)

### 5.1 Modelado de Base de Datos (Prisma Schema y PostgreSQL)
Para facilitar el desarrollo ágil y permitir una migración fluida desde un entorno local de desarrollo hacia **Supabase** (o cualquier otro proveedor en la nube), implementaremos **Prisma ORM**. 

El archivo de configuración `prisma/schema.prisma` define las entidades, enumeradores y relaciones del sistema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Perfil {
  productor
  comprador
  admin
}

enum Categoria {
  Quinua_Real @map("Quinua Real")
  Camelidos   @map("Camélidos")
  Textiles    @map("Textiles")
  Otros       @map("Otros")
}

enum EstadoModeracion {
  activo
  suspendido
}

enum EstadoProducto {
  activo
  eliminado
  pendiente
}

enum TipoContacto {
  clic_whatsapp
  clic_llamada
}

model Usuario {
  id                String            @id @default(uuid()) @db.Uuid
  telefonoWhatsapp  String            @unique @map("telefono_whatsapp")
  tipoPerfil        Perfil            @map("tipo_perfil")
  municipio         String
  estadoModeracion  EstadoModeracion  @default(activo) @map("estado_moderacion")
  creadoEn          DateTime          @default(now()) @map("creado_en")
  productos         Producto[]

  @@map("usuarios")
}

model Producto {
  id              String         @id @default(uuid()) @db.Uuid
  usuarioId       String         @map("usuario_id") @db.Uuid
  usuario         Usuario        @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  titulo          String
  descripcion     String
  categoria       Categoria
  precio          Decimal        @db.Decimal(10, 2)
  fotosUrl        String[]       @default([]) @map("fotos_url")
  municipioOrigen String         @map("municipio_origen")
  estado          EstadoProducto @default(activo)
  creadoEn        DateTime       @default(now()) @map("creado_en")
  interacciones   Interaccion[]

  @@index([municipioOrigen])
  @@index([categoria])
  @@map("productos")
}

model Interaccion {
  id           String       @id @default(uuid()) @db.Uuid
  productoId   String       @map("producto_id") @db.Uuid
  producto     Producto     @relation(fields: [productoId], references: [id], onDelete: Cascade)
  tipoContacto TipoContacto @map("tipo_contacto")
  fecha        DateTime     @default(now())

  @@index([productoId])
  @@index([fecha])
  @@map("interacciones")
}
```

### 5.2 Estrategia de Migración a Supabase
La arquitectura de Prisma permite transicionar el modelo a **Supabase** de manera instantánea siguiendo estos pasos:

1. **Obtener el String de Conexión de Supabase:**
   En el panel de control del proyecto Supabase, ir a *Project Settings -> Database* y copiar la URI de conexión (utilizando el Transaction Connection Pooler para entornos serverless, puerto 6543, o Session Pooler para persistencia directa, puerto 5432).
2. **Configurar las Variables de Entorno (`.env`):**
   ```env
   # Local Development:
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oruro_market?schema=public"

   # Supabase Production Migration:
   # DATABASE_URL="postgresql://postgres.[PROYECTO_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
3. **Ejecutar la Migración:**
   Para aplicar los esquemas en producción y generar el cliente tipado:
   ```bash
   npx prisma migrate deploy
   ```


### 5.3 Especificación de la API REST
Los endpoints de comunicación estructurados para la interacción entre el cliente (React) y el servidor (Node.js/Express) son:

#### Autenticación y Usuarios
*   `POST /api/auth/register`
    *   **Descripción:** Registra un nuevo usuario en la plataforma.
    *   **Payload (JSON):**
        ```json
        {
          "telefono_whatsapp": "59171234567",
          "tipo_perfil": "productor",
          "municipio": "Salinas de Garci Mendoza"
        }
        ```
    *   **Respuesta Exitosa (201 Created):**
        ```json
        {
          "mensaje": "Usuario registrado exitosamente",
          "token": "eyJhbGciOiJIUzI1NiIsIn...",
          "usuario": { "id": "uuid-...", "tipo_perfil": "productor" }
        }
        ```
*   `POST /api/auth/login`
    *   **Descripción:** Inicia sesión validando el número de WhatsApp registrado.
    *   **Payload (JSON):**
        ```json
        {
          "telefono_whatsapp": "59171234567"
        }
        ```
    *   **Respuesta Exitosa (200 OK):**
        ```json
        {
          "token": "eyJhbGciOiJIUzI1NiIsIn...",
          "usuario": { "id": "uuid-...", "tipo_perfil": "productor", "municipio": "Salinas de Garci Mendoza" }
        }
        ```

#### Gestión del Catálogo de Productos
*   `GET /api/products`
    *   **Descripción:** Obtiene los productos filtrados y ordenados.
    *   **Query Params (Opcionales):** `search`, `category`, `municipio`, `sort` (asc/desc), `limit`, `page`.
    *   **Respuesta Exitosa (200 OK):**
        ```json
        [
          {
            "id": "uuid-prod-1",
            "titulo": "Quinua Real Seleccionada",
            "precio": 120.00,
            "categoria": "Quinua Real",
            "municipio_origen": "Salinas de Garci Mendoza",
            "fotos_url": ["https://s3.amazonaws.com/..."],
            "telefono_whatsapp": "59171234567"
          }
        ]
        ```
*   `POST /api/products`
    *   **Descripción:** Registra una nueva publicación de producto (Requiere Auth: Productor).
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Payload (JSON):**
        ```json
        {
          "titulo": "Charque de Llama en Hojuelas",
          "descripcion": "Charque Premium elaborado con carne de llama seleccionada del municipio de Sajama.",
          "categoria": "Camélidos",
          "precio": 85.00,
          "fotos_url": ["https://s3.amazonaws.com/temp-image.jpg"],
          "municipio_origen": "Sajama"
        }
        ```
    *   **Respuesta Exitosa (201 Created):**
        ```json
        {
          "mensaje": "Producto publicado con éxito",
          "producto_id": "uuid-prod-2"
        }
        ```
*   `PUT /api/products/:id`
    *   **Descripción:** Edita un producto existente (Requiere Auth: Propietario del producto).
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Payload (JSON):** Campos a actualizar (ej., `precio`, `descripcion`).
    *   **Respuesta Exitosa (200 OK):** `{ "mensaje": "Producto actualizado correctamente" }`
*   `DELETE /api/products/:id`
    *   **Descripción:** Elimina físicamente o hace borrado lógico de un producto (Requiere Auth: Propietario o Administrador).
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Respuesta Exitosa (200 OK):** `{ "mensaje": "Producto eliminado exitosamente" }`

#### Registro de Métricas y Analítica
*   `POST /api/interactions`
    *   **Descripción:** Registra cuando un comprador pulsa el botón de contacto para inferir interés comercial.
    *   **Payload (JSON):**
        ```json
        {
          "producto_id": "uuid-prod-1",
          "tipo_contacto": "clic_whatsapp"
        }
        ```
    *   **Respuesta Exitosa (201 Created):** `{ "mensaje": "Interacción registrada" }`
*   `GET /api/admin/analytics`
    *   **Descripción:** Obtiene métricas agregadas de clics y productos (Requiere Auth: Admin/Gobernación).
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Respuesta Exitosa (200 OK):**
        ```json
        {
          "kpis": {
            "total_productos": 156,
            "total_whatsapp": 420,
            "total_llamadas": 182,
            "total_productores": 48
          },
          "por_municipio": [
            { "municipio": "Salinas de Garci Mendoza", "cantidad": 45 },
            { "municipio": "Sajama", "cantidad": 38 }
          ],
          "por_categoria": [
            { "categoria": "Quinua Real", "cantidad": 75 },
            { "categoria": "Camélidos", "cantidad": 50 }
          ]
        }
        ```

## 6. Plan de Implementación (16 Semanas / 4 Meses)
Hoja de ruta adaptada a metodologías ágiles para cumplir con el cronograma oficial[cite: 1].
* **Fase 1 (Semanas 1-4):** Configuración del entorno Linux, diseño UI/UX de vistas principales en Android y esquematización de PostgreSQL.
* **Fase 2 (Semanas 5-8):** Desarrollo de la API REST (Backend) y construcción del Panel Administrativo (Web) para la Gobernación.
* **Fase 3 (Semanas 9-12):** Maquetación del Frontend en React/Tailwind (Registro de usuarios, CRUD de publicación de productos, buscador y filtros).
* **Fase 4 (Semanas 13-16):** Integración de deep-linking para WhatsApp/Llamadas, pruebas de rendimiento rural, entregas progresivas de revisión a la Gobernación y despliegue final.

## 7. Gestión de Riesgos e Infraestructura
* **Gestión de Riesgos:** Para evitar un "cuello de botella" en la moderación, se implementarán reportes comunitarios donde los mismos usuarios puedan marcar publicaciones indebidas, aligerando la carga manual de la Gobernación[cite: 1].
* **DevOps (CI/CD):** Enlace de repositorios Git, pruebas de integración automatizadas, despliegue continuo de la SPA web a servidores Linux locales de la Gobernación y generación y empaquetamiento automático de APKs de Android.
* **Estrategia de Analítica:** Dado que las ventas se cierran por WhatsApp (fuera de la app), el KPI principal de comercio se medirá rastreando los clics en el "Botón de Contacto", lo que permitirá a la Gobernación inferir la demanda real[cite: 1].

## 8. Estructura de Directorios del Proyecto
El proyecto está diseñado bajo una arquitectura de monorepo estructurado que separa la lógica de negocio del Backend (servicios Node.js y conexión Postgres) y el cliente Frontend (React.js + Tailwind CSS):

```text
oruro-marketplace-app/
├── README.md                      # Documentación del estándar de arquitectura
├── database/
│   └── schema.sql                 # Scripts DDL de base de datos PostgreSQL
├── backend/                       # API REST con Node.js y Express
│   ├── package.json
│   ├── server.js                  # Punto de entrada de la aplicación Node
│   ├── config/
│   │   └── db.js                  # Conexión al pool de PostgreSQL (pg)
│   ├── controllers/
│   │   ├── authController.js      # Registro y login de usuarios
│   │   ├── productController.js   # CRUD de productos y filtros
│   │   └── analyticController.js  # Registro de métricas e informes de la Gobernación
│   ├── middleware/
│   │   ├── authMiddleware.js      # Verificación de JWT
│   │   └── errorMiddleware.js     # Manejador centralizado de excepciones (sin fugas SQL)
│   ├── models/
│   │   └── queries.js             # Sentencias SQL parametrizadas (Previene SQLi)
│   └── routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       └── analyticRoutes.js
└── frontend/                      # Cliente React.js + Tailwind CSS (Vite)
    ├── package.json
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx               # Punto de inicio React
        ├── App.jsx                # Enrutador y layout base (Tema negro puro)
        ├── assets/
        │   └── css/
        │       └── index.css      # Directivas de Tailwind CSS
        ├── components/
        │   ├── PhoneFrame.jsx     # Contenedor simulador de interfaz Android
        │   ├── ProductCard.jsx    # Tarjeta de producto reactiva
        │   └── StatCard.jsx       # Tarjetas de KPIs para la Gobernación
        ├── pages/
        │   ├── SplashScreen.jsx   # Pantalla de bienvenida
        │   ├── AuthScreen.jsx     # Registro de productor/comprador
        │   ├── FeedScreen.jsx     # Catálogo con filtros y buscador
        │   ├── DetailScreen.jsx   # Detalle de producto y botón de WhatsApp
        │   ├── ProducerPanel.jsx  # CRUD de productor (Agregar/Editar)
        │   └── GovDashboard.jsx   # Panel exclusivo web de moderación y analítica
        └── utils/
            ├── imageCompressor.js # Función de compresión de fotos antes de subida
            └── api.js             # Cliente Axios configurado para llamadas a la API
```