FROM python:3

WORKDIR /app

COPY  . .

WORKDIR /app/RestfulApi

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5002
CMD ["python3", "rest.py"]