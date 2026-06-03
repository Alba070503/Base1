const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// ---------- DATOS INICIALES (simulación) ----------
let clientes = [
  { idCliente: 1, nombre: 'Carlos', apellidos: 'Mendoza', ci: '1234567', direccion: 'Av. America 123', telefono: '78945612', email: 'carlos@mail.com' },
  { idCliente: 2, nombre: 'Luisa', apellidos: 'Fernandez', ci: '7654321', direccion: 'Calle Junin 456', telefono: '65412378', email: 'luisa@mail.com' }
];

let empleados = [
  { idEmpleado: 1, nombre: 'Ana', apellidos: 'Perez', cargo: 'Vendedora', fechaContratacion: '2024-01-15' }
];

let productos = [
  { idProducto: 1, nombre: 'Laptop HP 15', descripcion: 'Core i5, 8GB RAM', precioUnitario: 4500, stock: 10 },
  { idProducto: 2, nombre: 'Mouse Logitech', descripcion: 'Inalámbrico', precioUnitario: 150, stock: 30 }
];

let ventas = [
  { idVenta: 1, fecha: '2025-05-21', total: 9000, idCliente: 1, idEmpleado: 1 }
];

let detalleVentas = [
  { idDetalle: 1, idVenta: 1, idProducto: 1, cantidad: 2, precioUnitario: 4500, subtotal: 9000 }
];

// ---------- FUNCIONES AUXILIARES ----------
function preguntar(pregunta) {
  return new Promise(resolve => readline.question(pregunta, resolve));
}

function formatearFecha() {
  const hoy = new Date();
  return hoy.toISOString().slice(0, 10);
}

// ========== NUEVAS FUNCIONES PARA MOSTRAR LISTAS ==========
function mostrarClientes() {
  if (clientes.length === 0) {
    console.log("📭 No hay clientes registrados.");
    return;
  }
  console.log("\n📋 LISTA DE CLIENTES:");
  console.log("ID | Nombre completo | CI | Teléfono | Email");
  clientes.forEach(c => {
    console.log(`${c.idCliente} | ${c.nombre} ${c.apellidos} | ${c.ci} | ${c.telefono} | ${c.email}`);
  });
}

function mostrarProductos() {
  if (productos.length === 0) {
    console.log("📭 No hay productos registrados.");
    return;
  }
  console.log("\n🛒 LISTA DE PRODUCTOS:");
  console.log("ID | Nombre | Precio (Bs) | Stock | Descripción");
  productos.forEach(p => {
    console.log(`${p.idProducto} | ${p.nombre} | ${p.precioUnitario} | ${p.stock} | ${p.descripcion || '-'}`);
  });
}

// ========== ABMC MEJORADAS (muestran listas después de crear) ==========
async function crearCliente() {
  console.log("\n--- NUEVO CLIENTE ---");
  const nombre = await preguntar("Nombre: ");
  const apellidos = await preguntar("Apellidos: ");
  const ci = await preguntar("CI: ");
  const direccion = await preguntar("Dirección: ");
  const telefono = await preguntar("Teléfono: ");
  const email = await preguntar("Email: ");
  const nuevoId = clientes.length ? Math.max(...clientes.map(c => c.idCliente)) + 1 : 1;
  const nuevo = { idCliente: nuevoId, nombre, apellidos, ci, direccion, telefono, email };
  clientes.push(nuevo);
  console.log(`✅ Cliente "${nombre} ${apellidos}" creado con ID ${nuevoId}`);
  mostrarClientes(); // 👈 Ahora muestra la lista actualizada
}

async function crearProducto() {
  console.log("\n--- NUEVO PRODUCTO ---");
  const nombre = await preguntar("Nombre: ");
  const descripcion = await preguntar("Descripción: ");
  const precio = parseFloat(await preguntar("Precio unitario (Bs): "));
  const stock = parseInt(await preguntar("Stock inicial: "));
  const nuevoId = productos.length ? Math.max(...productos.map(p => p.idProducto)) + 1 : 1;
  const nuevo = { idProducto: nuevoId, nombre, descripcion, precioUnitario: precio, stock };
  productos.push(nuevo);
  console.log(`✅ Producto "${nombre}" creado con ID ${nuevoId}`);
  mostrarProductos(); // 👈 Ahora muestra la lista actualizada
}

async function realizarVenta() {
  console.log("\n--- REALIZAR VENTA ---");
  // Mostrar clientes disponibles (tabla formateada)
  mostrarClientes();
  const idCliente = parseInt(await preguntar("\nID del cliente que compra: "));
  if (!clientes.find(c => c.idCliente === idCliente)) {
    console.log("❌ Cliente no existe");
    return;
  }
  const idEmpleado = 1; // Vendedor por defecto (Ana)
  const nuevaVenta = {
    idVenta: ventas.length ? Math.max(...ventas.map(v => v.idVenta)) + 1 : 1,
    fecha: formatearFecha(),
    total: 0,
    idCliente,
    idEmpleado
  };
  ventas.push(nuevaVenta);
  console.log(`✅ Venta N° ${nuevaVenta.idVenta} iniciada. Agregue productos:`);

  let seguir = true;
  while (seguir) {
    // Mostrar productos disponibles (tabla formateada)
    mostrarProductos();
    const idProducto = parseInt(await preguntar("ID del producto (0 para terminar): "));
    if (idProducto === 0) break;
    const producto = productos.find(p => p.idProducto === idProducto);
    if (!producto) {
      console.log("❌ Producto no existe");
      continue;
    }
    const cantidad = parseInt(await preguntar("Cantidad: "));
    if (cantidad > producto.stock) {
      console.log(`❌ Stock insuficiente. Solo hay ${producto.stock}`);
      continue;
    }
    const subtotal = cantidad * producto.precioUnitario;
    const nuevoIdDetalle = detalleVentas.length ? Math.max(...detalleVentas.map(d => d.idDetalle)) + 1 : 1;
    detalleVentas.push({
      idDetalle: nuevoIdDetalle,
      idVenta: nuevaVenta.idVenta,
      idProducto,
      cantidad,
      precioUnitario: producto.precioUnitario,
      subtotal
    });
    producto.stock -= cantidad;
    nuevaVenta.total = detalleVentas.filter(d => d.idVenta === nuevaVenta.idVenta).reduce((sum, d) => sum + d.subtotal, 0);
    console.log(`✅ Agregado: ${cantidad} x ${producto.nombre} → Subtotal Bs ${subtotal}`);
    const respuesta = await preguntar("¿Agregar otro producto? (s/n): ");
    if (respuesta.toLowerCase() !== 's') seguir = false;
  }
  console.log(`✅ Venta N° ${nuevaVenta.idVenta} finalizada. Total: Bs ${nuevaVenta.total}`);
}

function listarVentas() {
  console.log("\n=== LISTADO DE VENTAS ===");
  if (ventas.length === 0) {
    console.log("No hay ventas registradas.");
    return;
  }
  for (const venta of ventas) {
    const cliente = clientes.find(c => c.idCliente === venta.idCliente);
    const empleado = empleados.find(e => e.idEmpleado === venta.idEmpleado);
    console.log(`\n📄 Venta N° ${venta.idVenta} | Fecha: ${venta.fecha} | Total: Bs ${venta.total}`);
    console.log(`   Cliente: ${cliente?.nombre} ${cliente?.apellidos} | Vendedor: ${empleado?.nombre}`);
    const detalles = detalleVentas.filter(d => d.idVenta === venta.idVenta);
    if (detalles.length === 0) console.log("   Sin productos");
    for (const det of detalles) {
      const prod = productos.find(p => p.idProducto === det.idProducto);
      console.log(`   - ${prod?.nombre} x ${det.cantidad} = Bs ${det.subtotal}`);
    }
  }
}

async function actualizarProducto() {
  mostrarProductos(); // Muestra los productos antes de actualizar
  const id = parseInt(await preguntar("\nID del producto a actualizar: "));
  const prod = productos.find(p => p.idProducto === id);
  if (!prod) {
    console.log("❌ Producto no existe");
    return;
  }
  const nuevoPrecio = await preguntar(`Nuevo precio (actual ${prod.precioUnitario}): `);
  if (nuevoPrecio) prod.precioUnitario = parseFloat(nuevoPrecio);
  const nuevoStock = await preguntar(`Nuevo stock (actual ${prod.stock}): `);
  if (nuevoStock) prod.stock = parseInt(nuevoStock);
  console.log(`✅ Producto actualizado: ${prod.nombre}`);
  mostrarProductos(); // Muestra la lista actualizada después de modificar
}

async function eliminarVenta() {
  console.log("\n--- ELIMINAR VENTA ---");
  listarVentas();
  const id = parseInt(await preguntar("ID de la venta a eliminar: "));
  const index = ventas.findIndex(v => v.idVenta === id);
  if (index === -1) {
    console.log("❌ Venta no existe");
    return;
  }
  const detallesAEliminar = detalleVentas.filter(d => d.idVenta === id);
  for (const det of detallesAEliminar) {
    const prod = productos.find(p => p.idProducto === det.idProducto);
    if (prod) prod.stock += det.cantidad;
  }
  detalleVentas = detalleVentas.filter(d => d.idVenta !== id);
  ventas.splice(index, 1);
  console.log(`🗑️ Venta ${id} eliminada. Stock restaurado.`);
}

async function consultarStockBajo() {
  const limite = parseInt(await preguntar("Mostrar productos con stock menor a: "));
  const bajos = productos.filter(p => p.stock < limite);
  console.log(`\n=== PRODUCTOS CON STOCK < ${limite} ===`);
  if (bajos.length === 0) console.log("Ninguno.");
  bajos.forEach(p => console.log(`${p.nombre} | stock: ${p.stock}`));
}

// ---------- MENÚ PRINCIPAL ----------
async function mainMenu() {
  let opcion = -1;
  while (opcion !== 0) {
    console.log("\n===== SISTEMA DE VENTAS - TECNOBOLIVIA =====");
    console.log("1. Registrar nuevo cliente");
    console.log("2. Registrar nuevo producto");
    console.log("3. Realizar venta");
    console.log("4. Listar todas las ventas");
    console.log("5. Actualizar producto (precio/stock)");
    console.log("6. Eliminar una venta");
    console.log("7. Consultar productos con stock bajo");
    console.log("0. Salir");
    opcion = parseInt(await preguntar("Opción: "));
    switch (opcion) {
      case 1: await crearCliente(); break;
      case 2: await crearProducto(); break;
      case 3: await realizarVenta(); break;
      case 4: listarVentas(); break;
      case 5: await actualizarProducto(); break;
      case 6: await eliminarVenta(); break;
      case 7: await consultarStockBajo(); break;
      case 0: console.log("👋 ¡Hasta luego!"); break;
      default: console.log("Opción inválida");
    }
  }
  readline.close();
}

mainMenu();
