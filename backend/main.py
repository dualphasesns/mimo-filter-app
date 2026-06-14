#Importing required Libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI()

#CORS: Connecting the frontend and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Loading the ML Model
current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, 'ml_engine', 'mimo_rf_model.pkl')

print(f"Loading ML model from: {model_path}")
model = joblib.load(model_path)
print("ML model loaded successfully.")  

#Defining the inputs
class MIMOParams(BaseModel):
    L_mmr: float
    L_stub1: float
    L_stub2: float
    W_mmr: float
    min_freq: float = 2.0
    max_freq: float = 12.0

#Prediction Model
@app.post("/predict")
def predict_s_parameters(params: MIMOParams):
    
    # FIX 1: Unified to use 'params' and named the array 'freqs'
    # Frequencies from min_freq to max_freq in 0.05 steps
    freqs = np.arange(params.min_freq, params.max_freq + 0.01, 0.05)

    # FIX 2: Now correctly looping through the 'freqs' array we just created
    #Bundling the inputs: ['L_mmr', 'L_stub1', 'L_stub2', 'W_mmr', 'Freq']
    X_predict = [[params.L_mmr, params.L_stub1, params.L_stub2, params.W_mmr, f] for f in freqs]

    # Predict S11, S21, S12, and S22 instantly
    predictions = model.predict(X_predict)

    #Graphing Library
    graph_data = []
    # FIX 3: Correctly enumerating through 'freqs'
    for i, f in enumerate(freqs):
        graph_data.append({
            "freq": round(float(f), 2),
            "S11": round(float(predictions[i][0]), 3),
            "S21": round(float(predictions[i][1]), 3),
            "S12": round(float(predictions[i][2]), 3),
            "S22": round(float(predictions[i][3]), 3)
        })

    return {"data": graph_data}