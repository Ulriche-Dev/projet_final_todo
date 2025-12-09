from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

from .views import TestCeleryView, StartReportGenerationView, CheckTaskStatusView

router = DefaultRouter()
router.register(r'taches', views.TacheViewSet, basename='tache')

urlpatterns = [
    path('', views.liste_taches, name='liste_taches'),
    path('ajouter/', views.ajouter_tache, name='ajouter_tache'),
    path('<int:id>/modifier/', views.modifier_tache, name='modifier_tache'),
    path('<int:id>/supprimer/', views.supprimer_tache, name='supprimer_tache'),
    path('api/', include(router.urls)),
    
    path('test-celery/', TestCeleryView.as_view(), name='test_celery'),
    path('start-report/', StartReportGenerationView.as_view(), name='start_report'),
    path('check-report-status/<str:task_id>/', CheckTaskStatusView.as_view(), name='check_report_status'),
]
