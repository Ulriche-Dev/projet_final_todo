from django.shortcuts import render, redirect, get_object_or_404
from .models import Tache
from .forms import TacheForm
from .serializers import TacheSerializer
from rest_framework.viewsets import ModelViewSet

from django.views.generic import View
from django.http import HttpResponse
import os

from django.http import JsonResponse
from .tasks import tache_test_asynchrone

from .tasks import send_creation_email

# Vues classiques Django (HTML)
def liste_taches(request):
    taches = Tache.objects.all().order_by('-cree_le')
    return render(request, 'taches/tache_liste.html', {'taches': taches})

def ajouter_tache(request):
    if request.method == 'POST':
        form = TacheForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('liste_taches')
    else:
        form = TacheForm()
    return render(request, 'taches/tache_form.html', {'form': form})

def modifier_tache(request, id):
    tache = get_object_or_404(Tache, id=id)
    if request.method == 'POST':
        form = TacheForm(request.POST, instance=tache)
        if form.is_valid():
            form.save()
            return redirect('liste_taches')
    else:
        form = TacheForm(instance=tache)
    return render(request, 'taches/tache_form.html', {'form': form})

def supprimer_tache(request, id):
    tache = get_object_or_404(Tache, id=id)
    if request.method == 'POST':
        tache.delete()
        return redirect('liste_taches')
    return render(request, 'taches/tache_confirm_delete.html', {'tache': tache})

# ViewSet REST API
class TacheViewSet(ModelViewSet):
    """API REST : CRUD sur les tâches de l'utilisateur connecté."""
    serializer_class = TacheSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Tache.objects.filter(owner=user).order_by('-cree_le')
        return Tache.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        send_creation_email.delay(serializer.instance.id)

class FrontendAppView(View):
    def get(self, request):
        try:
            with open(os.path.join(os.path.dirname(__file__), '../frontend/dist/index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse(
                "Le build React n'existe pas. Exécutez 'npm run build' dans le dossier frontend.",
                status=501,
            )
            
class TestCeleryView(View):
    def get(self, request):
        tache_test_asynchrone.delay()
        return JsonResponse({'message': 'Tâche Celery déclenchée !'})

