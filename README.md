# Proyecto DER - TecnoBolivia S.R.L.

## Parte 1: Descripción de la organización

**Nombre:** TecnoBolivia S.R.L.  
**Actividad comercial:** Venta de equipos electrónicos (computadoras, laptops, tablets, celulares, accesorios) y servicios de reparación.

**Misión:** Proveer soluciones tecnológicas de calidad a precios competitivos, garantizando la satisfacción de nuestros clientes y contribuyendo al desarrollo digital del país.

**Visión:** Ser la empresa líder en venta de tecnología en Bolivia, reconocida por innovación, servicio al cliente y responsabilidad social.

**Objetivos:**
- Incrementar ventas anuales en un 20% mediante marketing digital.
- Ampliar cartera de clientes en un 15% cada año.
- Mantener inventario óptimo con rotación trimestral.
- Ofrecer soporte técnico postventa con respuesta en menos de 24 horas.

**Organigrama:**
- Gerencia General
  - Departamento de Ventas
  - Departamento de Compras e Inventario
  - Departamento de Recursos Humanos
  - Departamento de Contabilidad y Finanzas
  - Departamento de Soporte Técnico

**Descripción del Departamento de Ventas (enfoque del DER):**
- Gestiona atención al cliente, cotizaciones, ventas, facturación y seguimiento de pedidos.
- Interactúa con clientes, productos, empleados (vendedores) y genera ventas con detalles.

## Parte 2: Diagrama Entidad-Relación (DER)

**Entidades y atributos:**

- **Cliente** (`idCliente`, `nombre`, `apellidos`, `ci`, `dirección`, `teléfono`, `email`)
- **Empleado** (`idEmpleado`, `nombre`, `apellidos`, `cargo`, `fechaContratación`)
- **Producto** (`idProducto`, `nombre`, `descripción`, `precioUnitario`, `stock`)
- **Venta** (`idVenta`, `fecha`, `total`, `idCliente`, `idEmpleado`)
- **DetalleVenta** (`idDetalle`, `idVenta`, `idProducto`, `cantidad`, `precioUnitario`, `subtotal`)

**Cardinalidades:**
- Un **Cliente** realiza **muchas Ventas** (1:N)
- Una **Venta** pertenece a **un Cliente** (1:1)
- Un **Empleado** atiende **muchas Ventas** (1:N)
- Una **Venta** contiene **muchos Detalles** (1:N)
- Un **Producto** aparece en **muchos Detalles** (1:N)

**Representación gráfica (textual):**
