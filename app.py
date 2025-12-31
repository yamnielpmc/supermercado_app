from flask import Flask, render_template, jsonify, request # type: ignore
from models.producto import obtener_productos
from models.venta import registrar_venta

app = Flask(__name__)

@app.route('/')
def index():
    productos = obtener_productos()
    return render_template('index.html', productos=productos)

@app.route('/procesar_venta', methods=['POST'])
def procesar_venta():
    data = request.get_json()
    if not data:
        return jsonify({'mensaje': 'Datos inválidos'}), 400

    detalles = data.get('detalles', [])
    total = data.get('total', 0)

    try:
        registrar_venta(detalles, total)
        return jsonify({'mensaje': 'Venta registrada con éxito'}), 200
    except Exception as e:
        print("Error al registrar la venta:", e)  # Esto mostrará el error real en terminal
        return jsonify({'mensaje': 'Error al registrar la venta', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)