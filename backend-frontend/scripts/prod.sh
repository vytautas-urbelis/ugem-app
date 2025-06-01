#!/bin/bash

python -c "import time; time.sleep(3)"

python manage.py collectstatic --no-input
python manage.py migrate
gunicorn project.asgi:application -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000
#gunicorn -w 4 -b 0.0.0.0:8000 project.wsgi:application