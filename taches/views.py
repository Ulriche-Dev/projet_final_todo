from django.shortcuts import render, redirect, get_object_or_404
from .models import Tache
from .forms import TacheForm

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
