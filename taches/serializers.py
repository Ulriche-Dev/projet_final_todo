from rest_framework import serializers
from .models import Tache

class TacheSerializer(serializers.ModelSerializer):
    proprietaire = serializers.ReadOnlyField(source='owner.username')  # Champ en lecture seule

    class Meta:
        model = Tache
        fields = '__all__'