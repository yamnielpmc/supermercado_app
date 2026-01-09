from flask import Flask, render_template, jsonify, request, redirect, url_for, session # type: ignore
from models.producto import obtener_productos
from models.venta import registrar_venta, obtener_historial, obtener_venta_por_id, get_producto_by_id, get_producto_by_name
from models.cajero import verificar_cajero
import json

# Crear la aplicación Flask
app = Flask(__name__)

app.secret_key = "aqui_llego_tu_tiburon"

# Configuración de la clave secreta para sesiones
@app.before_request
def require_login():
    allowed_routes = ['login', 'static']
    if 'cajero' not in session and request.endpoint not in allowed_routes:
        return redirect(url_for('login'))

@app.route('/')
# Página principal que muestra los productos
def index():
    productos = obtener_productos() # Obtener la lista de productos desde models
    return render_template('index.html', productos=productos)

@app.route('/procesar_venta', methods=['POST'])
# Endpoint para procesar una venta
def procesar_venta():
    data = request.get_json()
    print("Datos recibidos para la venta:", data)  # Depuración básica
    if not data:
        return jsonify({'mensaje': 'Datos inválidos'}), 400

    detalles = data.get('detalles', [])
    total = data.get('total', 0)

    # Validar datos básicos
    try:
        registrar_venta(detalles, total)
        return jsonify({'mensaje': 'Venta registrada con éxito'}), 200
    except Exception as e:
        print("Error al registrar la venta:", e)  # Esto mostrará el error real en terminal
        return jsonify({'mensaje': 'Error al registrar la venta', 'error': str(e)}), 500
# Endpoint para entrar a los ajustes
@app.route('/settings')
def settings():
    return render_template('settings.html')
# Endpoint para ver el historial de ventas
@app.route('/historial')
def historial():
    ventas = obtener_historial()
    # Convertir cada Row a diccionario para poder modificar
    ventas_list = []
    for venta in ventas:
        venta_dict = dict(venta)  # Convertir a dict
        venta_dict['detalles'] = json.loads(venta_dict['detalles'])
        ventas_list.append(venta_dict)
    return render_template('historial.html', ventas=ventas_list)

# Endpoint para la página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        ssn = request.form['ssn']
        cajero = verificar_cajero(ssn)
        if cajero:
            # convertir Row a dict
            cajero_dict = dict(cajero)
            session['cajero'] = {
                'ssn': cajero_dict['ssn'],
                'nombre': cajero_dict['nombre']
            }
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error="Credenciales incorrectas")
    return render_template('login.html')

# Endpoint para la pagina de recibo
@app.route('/recibo/<int:venta_id>')
def recibo(venta_id):
    if 'cajero' not in session:
        return redirect(url_for('login')) # Asegurar que el cajero esté logueado
    
    venta = obtener_venta_por_id(venta_id)
    if not venta:
        return "Venta no encontrada", 404
    
    venta_dict = dict(venta)
    venta_dict['detalles'] = json.loads(venta_dict['detalles'])

    # Calcular totales
    subtotal = sum(item['precio'] * item['cantidad'] for item in venta_dict['detalles'])
    impuesto = subtotal * 0.10

    return render_template('recibo.html', venta=venta_dict, subtotal=subtotal,impuesto=impuesto)
                        
# Endpoint para cerrar sesión
def logout():
    session.pop('cajero', None)
    return redirect(url_for('login'))

@app.route('/buscar', methods=['GET'])
def buscar_producto():
    prod_id = request.args.get('id')
    prod_name = request.args.get('name')
    producto = None
    if prod_id:
        producto = get_producto_by_id(prod_id)
        if producto:
            producto = dict(producto)
    elif prod_name:
        producto = get_producto_by_name(prod_name)
        if producto:
            producto = dict(producto)
    return render_template('buscar.html', producto=producto, id_busqueda=prod_id, name_busqueda=prod_name)


# Ejecutar la aplicación Flask
if __name__ == '__main__':
    app.run(debug=True)