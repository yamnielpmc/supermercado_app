import sqlite3, os, json
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'database', 'supermercado.db')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
detalles = json.dumps([{"id":1,"nombre":"Manzana","precio":0.75,"cantidad":2}])
total = 1.50

cursor.execute(
    "INSERT INTO ventas (fecha, total, detalles) VALUES (?, ?, ?)",
    (fecha, total, detalles)
)
conn.commit()
conn.close()

print("✅ Venta insertada correctamente en la base de datos.")
