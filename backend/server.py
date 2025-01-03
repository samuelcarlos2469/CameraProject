# from flask import Flask, request
# import os
# import cv2
# import pytesseract

# app = Flask(__name__)


# @app.route("/lerfoto", methods=["POST"])
# def lerfoto():
#     file = request.files["file"]
#     imagem = cv2.imread(file)

import cv2
import pytesseract

image = cv2.imread("./assets/testando.png")

text = pytesseract.image_to_string(image)
print(text)
