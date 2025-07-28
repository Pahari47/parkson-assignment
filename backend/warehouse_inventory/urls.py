"""
URL configuration for warehouse_inventory project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from decouple import config

# Import coreapi for documentation
try:
    import coreapi
    from rest_framework.documentation import include_docs_urls
    HAS_COREAPI = True
except ImportError:
    HAS_COREAPI = False

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inventory.urls')),
]

# Only include docs if coreapi is available and not in production
if HAS_COREAPI and config('DEBUG', default=True, cast=bool):
    urlpatterns.append(path('api/docs/', include_docs_urls(title='Warehouse Inventory API')))