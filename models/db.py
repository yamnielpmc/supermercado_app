import sqlite3
import os

# Definir la ruta de la base de datos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'database', 'supermercado.db') # Ruta relativa a la carpeta 'database'

def get_connection():
    conn = sqlite3.connect(DB_PATH)     # Establecer el factory para obtener filas como diccionarios
    conn.row_factory = sqlite3.Row
    return conn
