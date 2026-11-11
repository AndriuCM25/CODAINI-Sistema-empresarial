"""
CODAINI - Microservicio Python
Módulo de Procesamiento de Datos, Analítica e IA Especializada
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime

app = FastAPI(
    title="CODAINI AI & Analytics Microservice",
    description="Microservicio independiente para análisis predictivo y asistente empresarial",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectAnalyticsRequest(BaseModel):
    proyecto_id: int
    presupuesto: float
    total_tareas: int
    tareas_completadas: int
    dias_restantes: int

class SentimentAnalysisRequest(BaseModel):
    texto: str

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "CODAINI Python Microservice",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.post("/analytics/project-health")
def calculate_project_health(data: ProjectAnalyticsRequest):
    """
    Calcula el índice de salud del proyecto y riesgo de retraso.
    """
    if data.total_tareas == 0:
        progreso = 0.0
    else:
        progreso = round((data.tareas_completadas / data.total_tareas) * 100, 2)

    # Evaluación de riesgo
    if progreso < 40 and data.dias_restantes < 15:
        nivel_riesgo = "Alto"
        recomendacion = "Reasignar tareas de alta prioridad e incrementar recursos."
    elif progreso < 70 and data.dias_restantes < 10:
        nivel_riesgo = "Medio"
        recomendacion = "Monitorear tareas en cuello de botella."
    else:
        nivel_riesgo = "Bajo"
        recomendacion = "El proyecto avanza según el cronograma previsto."

    return {
        "proyecto_id": data.proyecto_id,
        "progreso_porcentaje": progreso,
        "nivel_riesgo": nivel_riesgo,
        "recomendacion": recomendacion
    }

@app.post("/nlp/analyze-feedback")
def analyze_feedback(data: SentimentAnalysisRequest):
    """
    Analiza observaciones o comentarios de clientes y colaboradores.
    """
    texto_lower = data.texto.lower()
    
    positivas = ["excelente", "bueno", "gran", "éxito", "puntual", "satisfecho", "calidad"]
    negativas = ["retraso", "problema", "deficiente", "error", "tarde", "inconforme", "queja"]

    score_pos = sum(1 for p in positivas if p in texto_lower)
    score_neg = sum(1 for n in negativas if n in texto_lower)

    if score_pos > score_neg:
        sentimiento = "Positivo"
    elif score_neg > score_pos:
        sentimiento = "Negativo"
    else:
        sentimiento = "Neutral"

    return {
        "texto": data.texto,
        "sentimiento_detectado": sentimiento,
        "polaridad_score": score_pos - score_neg
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
