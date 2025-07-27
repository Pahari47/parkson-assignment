from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductMasterViewSet, StockMainViewSet, StockDetailViewSet,
    InventorySummaryView, DashboardStatsView
)

# Create router for ViewSets
router = DefaultRouter()
router.register(r'products', ProductMasterViewSet)
router.register(r'transactions', StockMainViewSet)
router.register(r'stock-details', StockDetailViewSet)

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Custom endpoints
    path('inventory-summary/', InventorySummaryView.as_view(), name='inventory-summary'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
] 