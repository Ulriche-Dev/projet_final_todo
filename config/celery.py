import os
from celery import Celery

# Définit le module de configuration Django par défaut pour les workers Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Crée l'instance Celery
app = Celery('projet_final_todo')

# Charge la configuration depuis les settings Django, en utilisant le namespace CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# Découvre automatiquement les tâches dans tous les fichiers tasks.py des apps installées
app.autodiscover_tasks()

# Pour afficher les tâches chargées (en debug)
@app.task(bind=True)
def debug_task(self):
    print(f'Requête reçue : {self.request!r}')