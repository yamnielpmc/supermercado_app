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
    detalles = data.get('detalles', [])
    total = data.get('total', 0)
    registrar_venta(detalles, total)
    return jsonify({'mensaje': 'Venta registrada con éxito'})

if __name__ == '__main__':
    app.run(debug=True)