from flask import Flask, request, jsonify
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Servidor Flask está ativo e funcionando!"})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        app.logger.info("Nenhum arquivo encontrado na solicitação.")
        return 'No file part', 400
    file = request.files['image']
    if file.filename == '':
        app.logger.info("Nenhum arquivo selecionado.")
        return 'No selected file', 400
    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        app.logger.info(f"Arquivo recebido: {file.filename}")
        app.logger.info(f"Arquivo salvo em {filepath}")
        return 'File uploaded successfully', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)