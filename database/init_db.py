import sqlite3

conn = sqlite3.connect('database/supermercado.db')
c = conn.cursor()

#Eliminar tablas si existen
c.execute('DROP TABLE IF EXISTS cajero')
c.execute('DROP TABLE IF EXISTS productos')
c.execute('DROP TABLE IF EXISTS ventas')

#Crear tabla de productos
c.execute('''
CREATE TABLE IF NOT EXISTS productos (
          id INTEGER PRIMARY KEY,
          nombre TEXT NOT NULL,
          precio REAL NOT NULL,
          categoria TEXT NOT NULL,
          es_comida BOOLEAN NOT NULL DEFAULT 1
          )
''')

#Crear tabla de ventas
c.execute('''
CREATE TABLE IF NOT EXISTS ventas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fecha TEXT NOT NULL,
          total REAL NOT NULL,
          detalles TEXT NOT NULL
        )
''')

#Crear tabla de cajero
c.execute('''
CREATE TABLE IF NOT EXISTS cajero (
          ssn INTEGER PRIMARY KEY,
          nombre TEXT NOT NULL,
          apellido_paterno TEXT NOT NULL,
          apellido_materno TEXT
        )
''')

conn.commit()
conn.close()

print("Base de datos inicializada y productos agregados.")