# CODAINI - Microservicio de IA y Analítica (Python)

Este microservicio provee capacidades de análisis de datos avanzado, cálculo de riesgos de proyectos y procesamiento de lenguaje natural (NLP) para el sistema empresarial de CODAINI.

## Requisitos
- Python 3.9 o superior

## Instalación
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

## Ejecución
```bash
python main.py
```
O directamente con Uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## Documentación Interactiva de la API
Una vez iniciado el servicio, puedes acceder a:
- Swagger UI: `http://localhost:8001/docs`
- Redoc: `http://localhost:8001/redoc`
