import cv2
import PIL.Image
import google.generativeai as genai
from docx import Document
from flask import Flask


genai.configure(api_key="AIzaSyDqxdaEYCu3z727HXeJx3VRwyjeWkuV7e8")
model = genai.GenerativeModel("gemini-1.5-flash")

image_path = "./assets/images.jpg"
image = cv2.imread(image_path)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

_, thresh = cv2.threshold(gray, 102, 255, cv2.THRESH_BINARY_INV)

cv2.imwrite("imagem_processada.png", thresh)


text = PIL.Image.open("imagem_processada.png")
response = model.generate_content(
    ["O que está escrito? apenas transcreva o texto sem comentar nada", text]
)
print(response.text)

doc = Document()
style = doc.styles["Normal"]
font = style.font
font.name = "Times New Roman"
text_doc = response.text

doc.add_paragraph(text_doc)

doc.save("document.docx")

print("Convertido com sucesso!")
