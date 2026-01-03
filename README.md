# Sistema de Cajas - Selectos Supermercado

Este proyecto es un sistema de punto de venta (POS) desarrollado en Python utilizando el framework Flask.  
Cuenta con una interfaz web construida con HTML, CSS y JavaScript, y usa una base de datos SQLite para el manejo de productos y ventas.  
El objetivo es simular el sistema de cajas de un supermercado, inspirado en los procesos de Selectos.

---

## Descripción general

El sistema permite:
- Hacer Login de un cajero
- Mostrar productos organizados por categorías.
- Añadir productos al carrito de compras.
- Calcular automáticamente subtotal, impuesto (10%) y total.
- Procesar las compras y registrar las ventas en la base de datos.
- Vaciar el carrito completo con confirmación ("Void Total").
- Ver el historial de compras del cajero

---

## Tecnologías utilizadas

- Python 3  
- Flask (microframework para el backend)  
- SQLite (base de datos ligera)  
- HTML5, CSS3, JavaScript (interfaz de usuario)  
- Jinja2 (plantillas HTML dinámicas)

---


---

## Instalación y configuración

### 1. Clonar el repositorio

### 2. Crear entorno virtual

Activar entorno virtual:

- En Windows:


### 3. Instalar dependencias


### 4. Crear la base de datos

Ejecuta el siguiente comando para generar las tablas y los productos base:


Esto creará el archivo `supermercado.db` con los datos iniciales.

---

## Ejecución del sistema

Ejecuta el servidor Flask con:


---

## Uso del sistema

1. Selecciona una categoría de productos desde las pestañas.  
2. Haz clic en los productos para añadirlos al carrito.  
3. Observa el subtotal, el impuesto (10%) y el total en tiempo real.  
4. Usa el botón **Procesar compra** para registrar la venta.  
5. Si deseas vaciar el carrito, usa el botón **Void Total** (pedirá confirmación).  

Cada venta se almacena automáticamente en la tabla `ventas` dentro de la base de datos SQLite.

---

## Estructura de la base de datos

El sistema utiliza dos tablas principales: `productos` y `ventas`.

### Tabla: productos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | INTEGER | Identificador único del producto |
| nombre | TEXT | Nombre del producto |
| precio | REAL | Precio del producto |
| categoria | TEXT | Categoría del producto |
| stock | INTEGER | Cantidad disponible |

### Tabla: ventas

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | INTEGER | Identificador único de la venta |
| fecha | TEXT | Fecha y hora en que se realizó la venta |
| total | REAL | Total de la compra |
| detalles | TEXT | Detalles de los productos vendidos (formato JSON) |

---

## Funciones principales del sistema

| Función | Archivo | Descripción |
|----------|----------|-------------|
| obtener_productos() | models/producto.py | Obtiene la lista de productos desde la base de datos |
| registrar_venta() | models/venta.py | Registra una venta con fecha, total y detalle en la base de datos |
| actualizarCarrito() | static/js/script.js | Actualiza los totales del carrito dinámicamente |
| voidTotal() | static/js/script.js | Limpia el carrito completo con confirmación del usuario |

---

## Próximas mejoras

- Página de historial de ventas para revisar compras anteriores.  
- Sistema de inicio de sesión para cajeros y administradores.  
- Panel de control para agregar, editar o eliminar productos.  
- Gestión automática del inventario (reducción de stock por venta).  
- Inclusión de imágenes de productos en la interfaz.  
- Reportes y estadísticas de ventas por día o por categoría.

---

## Autor

Desarrollado por: Yamniel Negroni Febus 
Proyecto: Sistema de Cajas - Selectos Supermercado  
Lenguajes: Python, HTML, CSS, JavaScript  
Base de datos: SQLite  
Framework: Flask  
Año: 2025
