import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash # type: ignore
from .db import get_connection

# Registrar un nuevo cajero
def registrar_cajero(ssn, nombre, ap_paterno, ap_materno, telefono):
    conn = get_connection
    cursor = conn.cursor()
    hashed_ssn = generate_password_hash(ssn)
    cursor.execute('INSERT INTO cajero (ssn, nombre, apellido_paterno, apellido_materno, telefono) VALUES (?, ?, ?, ?, ?)',
                   (hashed_ssn, nombre, ap_paterno, ap_materno, telefono))
    conn.commit()
    conn.close()

# Autenticar un cajero
def verificar_cajero(ssn):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cajero WHERE ssn = ?', (ssn,))
    cajero = cursor.fetchone()
    conn.close()
    if not cajero:
        return None
    
    if cajero['ssn'] == ssn:
        return cajero
    else:
        return None