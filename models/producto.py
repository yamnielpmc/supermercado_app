from models.db import get_connection

def obtener_productos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    conn.close()
    return [dict(p) for p in productos]