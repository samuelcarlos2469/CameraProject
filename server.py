from flask import Flask, request, jsonify, send_file
import cv2
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.before_request
def log_request():
    print("Request Headers:", request.headers)
    print("Request Form:", request.form)
    print("Request Files:", request.files)

@app.route("/process", methods=["POST"])
def process_image():
    if "image" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    image_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(image_path)

    # Processamento de bordas
    image = cv2.imread(image_path)
    edges = cv2.Canny(image, 100, 200)
    processed_path = os.path.join(UPLOAD_FOLDER, "edges_" + file.filename)
    cv2.imwrite(processed_path, edges)

    # URL corrigido para apontar ao ngrok
    processed_url = f"https://1f9e-170-254-22-164.ngrok-free.app/uploads/edges_{file.filename}"

    return jsonify({"message": "Image processed", "processed_image": processed_url})

@app.route("/uploads/<filename>")
def get_image(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename))

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
