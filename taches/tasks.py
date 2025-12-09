import time

from celery import shared_task
from django.core.mail import send_mail
from .models import Tache

@shared_task
def tache_test_asynchrone():
    time.sleep(5)
    print("Tâche asynchrone terminée avec succès !")

@shared_task(autoretry_for=(Exception,), max_retries=3, countdown=10)
def send_creation_email(tache_id):
    try:
        tache = Tache.objects.get(id=tache_id)
    except Tache.DoesNotExist:
        return 'Tâche non trouvée.'
    # Simulation d'échec du service d'email
    raise Exception("Service d'email indisponible !")
    # sujet = f'Nouvelle tâche créée : {tache.titre}'
    # message = f'La tâche \"{tache.titre}\" a été créée avec succès.\nDescription : {tache.description}'
    # send_mail(
    #     sujet,
    #     message,
    #     'no-reply@example.com',  # Expéditeur
    #     ['admin@example.com'],   # Destinataire factice
    #     fail_silently=False,
    # )
    # return f'Email envoyé pour la tâche {tache_id}'

@shared_task
def generate_task_report():
    time.sleep(15)  # Simule un long traitement
    return "Le rapport de tâches a été généré avec succès !"