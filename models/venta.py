import sqlite3
import json

DB_PATH = "database/supermercado.db"    # Ruta a la base de datos SQLite

# Función para conectar a la base de datos
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Para acceder a columnas por nombre
    return conn

# Función para obtener el historial de ventas
def obtener_historial():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ventas ORDER BY fecha DESC")
    ventas = cursor.fetchall()
    conn.close()
    return ventas

# Función para registrar una nueva venta
def registrar_venta(detalles, total):
    conn = get_connection()
    cursor = conn.cursor()
    # Guardar detalles como JSON
    detalles_json = json.dumps(detalles)
    cursor.execute(
        "INSERT INTO ventas (detalles, total, fecha) VALUES (?, ?, datetime('now'))",
        (detalles_json, total)
    )
    conn.commit()
    conn.close()

# Funcion para buscar un producto por su ID
def get_producto_by_id(prod_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM productos WHERE id = ?", (prod_id,))
    producto = cursor.fetchone
    return producto

# Funcion para buscar un producto por su nombre
def get_producto_by_name(prod_name):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM productos WHERE nombre = ?", (prod_name,))
    producto = cursor.fetchone
    return producto

# Funcion para buscar la venta por su ID
def obtener_venta_por_id(venta_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ventas WHERE id = ?", (venta_id,))
    venta = cursor.fetchone()
    conn.close()
    return venta
