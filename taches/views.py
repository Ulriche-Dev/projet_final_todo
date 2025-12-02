from django.shortcuts import render, redirect, get_object_or_404
from .models import Tache
from .forms import TacheForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TacheSerializer

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

@api_view(['GET', 'POST'])
def liste_taches_api(request):
    """Vue API pour lister les tâches (GET) ou en créer une nouvelle (POST)."""
    if request.method == 'GET':
        taches = Tache.objects.all()
        serializer = TacheSerializer(taches, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = TacheSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)  # 201 Created
        return Response(serializer.errors, status=400)  # 400 Bad Request

@api_view(['GET', 'PUT', 'DELETE'])
def detail_tache_api(request, pk):
    """Vue API pour récupérer, mettre à jour ou supprimer une tâche."""
    try:
        tache = Tache.objects.get(pk=pk)
    except Tache.DoesNotExist:
        return Response({'error': 'Tâche non trouvée'}, status=404)

    if request.method == 'GET':
        serializer = TacheSerializer(tache)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = TacheSerializer(tache, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        tache.delete()
        return Response({'message': 'Tâche supprimée avec succès'}, status=204)
