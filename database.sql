-- ============================================
-- BASE DE DATOS PARA TECNOBOLIVIA S.R.L.
-- DEPARTAMENTO DE VENTAS
-- ============================================

CREATE DATABASE IF NOT EXISTS TecnoBolivia_Ventas;
USE TecnoBolivia_Ventas;

-- TABLA CLIENTE
CREATE TABLE Cliente (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    ci VARCHAR(20) UNIQUE NOT NULL,
    direccion VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(50)
);

-- TABLA EMPLEADO
CREATE TABLE Empleado (
    idEmpleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    cargo VARCHAR(50),
    fechaContratacion DATE
);

-- TABLA PRODUCTO
CREATE TABLE Producto (
    idProducto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precioUnitario DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

-- TABLA VENTA
CREATE TABLE Venta (
    idVenta INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    total DECIMAL(10,2) DEFAULT 0,
    idCliente INT NOT NULL,
    idEmpleado INT NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente) ON DELETE RESTRICT,
    FOREIGN KEY (idEmpleado) REFERENCES Empleado(idEmpleado) ON DELETE RESTRICT
);

-- TABLA DETALLE_VENTA
CREATE TABLE DetalleVenta (
    idDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idVenta INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precioUnitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precioUnitario) STORED,
    FOREIGN KEY (idVenta) REFERENCES Venta(idVenta) ON DELETE CASCADE,
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto) ON DELETE RESTRICT
);

-- ============================================
-- INSERCIONES DE EJEMPLO
-- ============================================
INSERT INTO Cliente VALUES 
(NULL, 'Carlos', 'Mendoza', '1234567', 'Av. America 123', '78945612', 'carlos@mail.com'),
(NULL, 'Luisa', 'Fernandez', '7654321', 'Calle Junin 456', '65412378', 'luisa@mail.com');

INSERT INTO Empleado VALUES 
(NULL, 'Ana', 'Perez', 'Vendedora', '2024-01-15');

INSERT INTO Producto VALUES 
(NULL, 'Laptop HP 15', 'Core i5, 8GB RAM', 4500.00, 10),
(NULL, 'Mouse Logitech', 'Inalámbrico', 150.00, 30);

-- Venta de ejemplo
INSERT INTO Venta VALUES (NULL, CURDATE(), 0, 1, 1);
SET @idVenta = LAST_INSERT_ID();
INSERT INTO DetalleVenta (idVenta, idProducto, cantidad, precioUnitario) 
VALUES (@idVenta, 1, 2, 4500.00);
UPDATE Venta SET total = (SELECT SUM(subtotal) FROM DetalleVenta WHERE idVenta = @idVenta) WHERE idVenta = @idVenta;

-- ============================================
-- CONSULTAS ABMC (EJEMPLOS)
-- ============================================

-- 1. ALTAS (INSERT)
INSERT INTO Producto (nombre, descripcion, precioUnitario, stock) 
VALUES ('Teclado Mecánico', 'RGB, switches azules', 350.00, 15);

-- 2. BAJAS (DELETE)
DELETE FROM DetalleVenta WHERE idDetalle = 1;  -- elimina un detalle
DELETE FROM Venta WHERE idVenta = 1;           -- elimina venta en cascada

-- 3. MODIFICACIONES (UPDATE)
UPDATE Producto SET precioUnitario = 4400.00 WHERE idProducto = 1;
UPDATE Cliente SET direccion = 'Av. Los Pinos 789' WHERE idCliente = 1;

-- 4. CONSULTAS (SELECT)
-- Ventas con cliente y vendedor
SELECT v.idVenta, v.fecha, v.total, c.nombre AS cliente, e.nombre AS vendedor
FROM Venta v
JOIN Cliente c ON v.idCliente = c.idCliente
JOIN Empleado e ON v.idEmpleado = e.idEmpleado;

-- Detalle de una venta específica
SELECT p.nombre, dv.cantidad, dv.precioUnitario, dv.subtotal
FROM DetalleVenta dv JOIN Producto p ON dv.idProducto = p.idProducto
WHERE dv.idVenta = 1;

-- Total gastado por cliente
SELECT c.nombre, SUM(v.total) AS total_gastado
FROM Cliente c LEFT JOIN Venta v ON c.idCliente = v.idCliente
GROUP BY c.idCliente;

-- Productos con bajo stock (< 5)
SELECT nombre, stock FROM Producto WHERE stock < 5;
