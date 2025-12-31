import sqlite3, os
from .db import get_connection

def registrar_venta(detalles, total):
    conn = get_connection()
    cursor = conn.cursor()

    from datetime import datetime
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    import json
    detalles_json = json.dumps(detalles)  # convierte lista de dict a string JSON

    # Usar placeholders ? para seguridad y evitar errores de sintaxis
    cursor.execute(
        "INSERT INTO ventas (fecha, total, detalles) VALUES (?, ?, ?)",
        (fecha, total, detalles_json)
    )
    conn.commit()
    conn.close()
