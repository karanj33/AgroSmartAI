import cv2
import numpy as np
import tensorflow as tf
import json

class AgroDetectInference:
    def __init__(self, model_path, db_path):
        self.model = tf.keras.models.load_model(model_path)
        with open(db_path, 'r') as f:
            self.db = json.load(f)
        self.classes = sorted(list(self.db.keys()))

    def preprocess_image(self, image_path):
        # Load using OpenCV
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # Resize to MobileNet input size
        img = cv2.resize(img, (224, 224))
        # Normalize
        img = img.astype('float32') / 255.0
        return np.expand_dims(img, axis=0)

    def predict(self, image_path):
        processed_img = self.preprocess_image(image_path)
        predictions = self.model.predict(processed_img)
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        
        disease_name = self.classes[class_idx]
        info = self.db.get(disease_name, self.db['Healthy'])
        
        return {
            "disease_name": disease_name,
            "confidence_score": confidence,
            "cause": info['cause'],
            "pesticide_recommendation": info['pesticide'],
            "fertilizer_recommendation": info['fertilizer'],
            "prevention_tips": info['prevention']
        }

    def export_tflite(self, output_path):
        converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
        # Optimize for size/latency
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        tflite_model = converter.convert()
        with open(output_path, 'wb') as f:
            f.write(tflite_model)
        print(f"Model exported to {output_path}")

# Example Flask API structure
"""
from flask import Flask, request, jsonify
app = Flask(__name__)
inference = AgroDetectInference('model.h5', 'disease_db.json')

@app.route('/predict', methods=['POST'])
def predict_endpoint():
    file = request.files['image']
    file.save('temp.jpg')
    result = inference.predict('temp.jpg')
    return jsonify(result)
"""
