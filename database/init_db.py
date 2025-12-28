import sqlite3

conn = sqlite3.connect('database/supermercado.db')
c = conn.cursor()

#Eliminar tablas si existen
c.execute('DROP TABLE IF EXISTS detalle_venta')
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

# Tabla Detalles de Venta
c.execute('''
CREATE TABLE IF NOT EXISTS detalle_venta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    subtotal REAL NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
)
''')

#Agregar algunos productos de ejemplo
productos = [
    (45,"Manzana Gala", 0.5, "Frutas"),
    (71,"Guineo Maduro", 0.3, "Frutas"),
    (65,"Platano Verde", 0.99, "Vegetales"),
    (74,"Aguacate", 0.89, "Vegetales"),
    (63559516421,"Pan", 1.0, "Panadería"),
    (3992704134,"Leche Tres Monjitas", 3.97, "Dairy"),
    (4125324355,"Arroz Selectos", 1.2, "Arroz"),
    (199622190,"Huevos", 2.0, "Dairy"),
    (3663204259,"Oikos Yogurt Griego Plain",9.69,"Dairy"),

]

c.executemany('INSERT INTO productos (id, nombre, precio, categoria) VALUES (?, ?, ?, ?)', productos)    

conn.commit()
conn.close()

print("Base de datos inicializada y productos agregados.")