from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from .views import (
    ProductMasterViewSet, StockMainViewSet, StockDetailViewSet,
    InventorySummaryView, DashboardStatsView, RegisterView
)

# Create router for ViewSets
router = DefaultRouter()
router.register(r'products', ProductMasterViewSet)
router.register(r'transactions', StockMainViewSet)
router.register(r'stock-details', StockDetailViewSet)

urlpatterns = [
    # JWT Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Include router URLs
    path('', include(router.urls)),
    
    # Custom endpoints
    path('inventory-summary/', InventorySummaryView.as_view(), name='inventory-summary'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
] 