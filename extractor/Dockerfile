FROM python:3.12-slim

RUN apt-get update && apt-get install -y ffmpeg curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .

# Install base requirements first
RUN pip install --no-cache-dir -r requirements.txt

# Always upgrade yt-dlp to the latest version (handles policy changes)
RUN pip install --no-cache-dir --upgrade yt-dlp

COPY app.py .

EXPOSE 8080
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]