import sqlite3
import json

DB_PATH = "database/supermercado.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Para acceder a columnas por nombre
    return conn

def obtener_historial():
    conn = get_connection()  # ✅ Crear la conexión aquí
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ventas ORDER BY fecha DESC")
    ventas = cursor.fetchall()
    conn.close()
    return ventas

def registrar_venta(detalles, total):
    conn = get_connection()  # ✅ Crear la conexión aquí
    cursor = conn.cursor()
    # Guardar detalles como JSON
    detalles_json = json.dumps(detalles)
    cursor.execute(
        "INSERT INTO ventas (detalles, total, fecha) VALUES (?, ?, datetime('now'))",
        (detalles_json, total)
    )
    conn.commit()
    conn.close()
