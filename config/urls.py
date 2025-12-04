from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.authtoken.views import obtain_auth_token
from taches.views import FrontendAppView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('taches/', include('taches.urls')),
    path('api/token/', obtain_auth_token),

    re_path(r'^.*$', FrontendAppView.as_view()),
]