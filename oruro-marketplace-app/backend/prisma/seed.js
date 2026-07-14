const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando inserción de datos semilla (Seeding)...");

  // 1. Limpieza de datos previos (Previene duplicados en desarrollo)
  await prisma.interaccion.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.usuario.deleteMany({});
  console.log("🧹 Base de datos limpia de registros previos.");

  // 2. Creación de Usuarios Semilla
  // Productor 1: Salinas (Quinua)
  const prodQuinua = await prisma.usuario.create({
    data: {
      telefonoWhatsapp: "59171234567",
      tipoPerfil: "productor",
      municipio: "Salinas de Garci Mendoza",
      estadoModeracion: "activo"
    }
  });

  // Productor 2: Sajama (Alpaca y Llama)
  const prodCamelidos = await prisma.usuario.create({
    data: {
      telefonoWhatsapp: "59172345678",
      tipoPerfil: "productor",
      municipio: "Sajama",
      estadoModeracion: "activo"
    }
  });

  // Administrador de la Gobernación de Oruro
  const adminGov = await prisma.usuario.create({
    data: {
      telefonoWhatsapp: "59170001122",
      tipoPerfil: "admin",
      municipio: "Cercado",
      estadoModeracion: "activo"
    }
  });
  console.log("👤 Usuarios registrados (Productores y Administrador).");

  // 3. Creación de Productos Semilla (Con imágenes de alta calidad cargadas)
  const p1 = await prisma.producto.create({
    data: {
      usuarioId: prodQuinua.id,
      titulo: "Quinua Real Orgánica en Grano",
      descripcion: "Quinua real blanca seleccionada y lavada, directo de la asociación de productores de Salinas de Garci Mendoza.",
      categoria: "Quinua_Real",
      precio: 120.00,
      fotosUrl: ["/assets/images/quinua_real.png"],
      municipioOrigen: "Salinas de Garci Mendoza",
      estado: "activo"
    }
  });

  const p2 = await prisma.producto.create({
    data: {
      usuarioId: prodCamelidos.id,
      titulo: "Charque de Llama Deshidratado",
      descripcion: "Charque de carne de llama de primera calidad, deshidratado de forma natural en el altiplano de Sajama.",
      categoria: "Camelidos",
      precio: 85.50,
      fotosUrl: ["/assets/images/charque_llama.png"],
      municipioOrigen: "Sajama",
      estado: "activo"
    }
  });

  const p3 = await prisma.producto.create({
    data: {
      usuarioId: prodCamelidos.id,
      titulo: "Lana de Alpaca Natural",
      descripcion: "Madejas de lana de alpaca 100% pura hilada a mano, ideales para prendas de invierno de alta calidad.",
      categoria: "Textiles",
      precio: 150.00,
      fotosUrl: ["/assets/images/lana_alpaca.png"],
      municipioOrigen: "Sajama",
      estado: "activo"
    }
  });

  const p4 = await prisma.producto.create({
    data: {
      usuarioId: prodCamelidos.id,
      titulo: "Poncho Tradicional Oruro",
      descripcion: "Poncho de lana de llama tejido a mano en telar artesanal, con iconografía andina nativa de la provincia Sajama.",
      categoria: "Textiles",
      precio: 450.00,
      fotosUrl: ["/assets/images/poncho_oruro.png"],
      municipioOrigen: "Sajama",
      estado: "activo"
    }
  });
  console.log("📦 Catálogo de productos inicializado.");

  // 4. Creación de Interacciones de Prueba (Simulador de histórico)
  await prisma.interaccion.create({
    data: {
      productoId: p1.id,
      tipoContacto: "clic_whatsapp",
      fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // hace 3 días
    }
  });

  await prisma.interaccion.create({
    data: {
      productoId: p1.id,
      tipoContacto: "clic_llamada",
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // hace 2 días
    }
  });

  await prisma.interaccion.create({
    data: {
      productoId: p2.id,
      tipoContacto: "clic_whatsapp",
      fecha: new Date() // ahora
    }
  });

  await prisma.interaccion.create({
    data: {
      productoId: p3.id,
      tipoContacto: "clic_whatsapp",
      fecha: new Date() // ahora
    }
  });
  console.log("📈 Historial de interacciones comerciales creado.");
  console.log("🎉 ¡Seeding de base de datos finalizado con éxito!");
}

main()
  .catch((e) => {
    console.error("Error durante el seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
