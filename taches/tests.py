from django.test import TestCase
from django.urls import reverse
from .models import Tache

class TacheTests(TestCase):

    def test_liste_taches_status_code(self):
        """Vérifie que la page listant les tâches retourne un code 200."""
        url = reverse('liste_taches')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_creation_tache(self):
        """Vérifie que la création d'une tâche via POST fonctionne et redirige."""
        url = reverse('ajouter_tache')
        data = {
            'titre': 'Nouvelle Tâche',
            'description': 'Description de la tâche',
            'termine': False
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)  # Redirection après création
        self.assertTrue(Tache.objects.filter(titre='Nouvelle Tâche').exists())
