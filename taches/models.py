from django.db import models
from django.contrib.auth.models import User  # Import du modèle User

class Tache(models.Model):
    titre = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cree_le = models.DateTimeField(auto_now_add=True)
    termine = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='taches')  # Champ propriétaire

    def __str__(self):
        return self.titre