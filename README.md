# MIMO RF Filter AI Designer

An enterprise-grade, open-source Computer-Aided Engineering (CAE) application for real-time Multi-Input Multi-Output (MIMO) RF filter design. 

Traditional EM simulation software (like Ansys HFSS) is highly accurate but computationally heavy, taking minutes or hours per iteration. This application solves that bottleneck by using a **Multi-Output Machine Learning Regression Model** to instantly predict S-Parameters (S11, S21, S12, S22), wrapped in a modern, interactive 3D interface with a built-in Local AI Copilot.

## Core Features
* **Real-Time MIMO ML Engine:** Predicts four distinct S-parameter curves simultaneously in milliseconds.
* **Holographic 3D Visualizer:** Dynamic representation of the substrate and stubs that scales in real-time as physical parameters change.
* **Interactive Drag-and-Drop Builder:** Node-based design canvas for rapid RF prototyping.
* **Tolerance Analysis:** Calculates and plots shaded boundaries to show worst-case manufacturing scenarios.
* **Local LLM RF Copilot:** A privacy-first AI assistant (powered by Llama 3 via Ollama) that reads ML gradients to offer real-time design tuning tips.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Recharts (Graphing), React Three Fiber (3D), React Flow.
* **Backend:** FastAPI, Python, SQLite (Design History).
* **Machine Learning:** Scikit-Learn (Random Forest Regressor), Pandas.