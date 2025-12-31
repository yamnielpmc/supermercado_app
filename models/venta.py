from models.db import get_connection
from datetime import datetime
import json

def registrar_venta(detalles, total):
    conn = get_connection()
    cursor = conn.cursor()
    fecha = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    detalles_json = json.dumps(detalles)
    
    cursor.execute("INSERT INTO ventas (total, fecha, detalles) VALUES (%s, %s, %s)",
        (total, fecha, detalles_json)
    )
    conn.commit()
    conn.close()