#Importing required libraries
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

#Loading Dataset
print("Loading MIMO Dataset...")
current_dir = os.path.dirname(__file__)
csv_path = os.path.join(current_dir, 'hfss_mimo_master_dataset.csv')
df = pd.read_csv(csv_path)
print("Dataset loaded successfully.")

#CSV File Columns
df.columns = ['L_mmr', 'L_stub1', 'L_stub2', 'W_mmr', 'Freq', 'S11', 'S21', 'S12', 'S22']

#Inputs
X = df[['L_mmr', 'L_stub1', 'L_stub2', 'W_mmr', 'Freq']]

#Outputs
y = df[['S11', 'S21', 'S12', 'S22']]

print("Training MIMO Model...")

# Train the Random Forest Regressor
model = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1)
model.fit(X, y)

#Save the trained model
model_path = os.path.join(current_dir, 'mimo_rf_model.pkl')
joblib.dump(model, model_path)
print(f"Model trained and saved successfully to {model_path}")
