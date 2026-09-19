# ===================================================
# DropoutGuard AI - ML Inference Microservice
# Python 3.11 Slim with FastAPI & Scikit-Learn
# ===================================================

FROM python:3.11-slim

# Set environment flags for Python in container
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5001

WORKDIR /app

# Install system dependencies (curl for health check)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first for caching
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy serialized models, inference code, and evaluation metrics
COPY model.pkl /app/
COPY scaler.pkl /app/
COPY logistic_model.pkl /app/
COPY evaluation_metrics.json /app/
COPY predict.py /app/

# Expose port
EXPOSE 5001

# Healthcheck to verify FastAPI is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5001/metrics || exit 1

# Start Uvicorn ASGI server
CMD ["python", "-m", "uvicorn", "predict:app", "--host", "0.0.0.0", "--port", "5001"]
