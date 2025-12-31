from flask import Flask, render_template, jsonify, request # type: ignore
from models.producto import obtener_productos
from models.venta import registrar_venta, obtener_historial
import json

app = Flask(__name__)

@app.route('/')
# Página principal que muestra los productos
def index():
    productos = obtener_productos()
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

# Ejecutar la aplicación Flask
if __name__ == '__main__':
    app.run(debug=True)