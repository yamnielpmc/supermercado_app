from models.db import get_connection

def obtener_productos():
    conn = get_connection()     # Obtener una conexión a la base de datos
    cursor = conn.cursor()      # Crear un cursor para ejecutar consultas
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    conn.close()
    return [dict(p) for p in productos]