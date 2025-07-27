from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum, Q, F
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.serializers import ModelSerializer, EmailField, CharField, ValidationError

from .models import ProductMaster, StockMain, StockDetail
from .serializers import (
    ProductMasterSerializer, StockMainSerializer, StockDetailSerializer,
    StockMainCreateSerializer, InventorySummarySerializer, StockMovementSerializer
)


class ProductMasterViewSet(viewsets.ModelViewSet):
    """ViewSet for ProductMaster CRUD operations"""
    queryset = ProductMaster.objects.all()
    serializer_class = ProductMasterSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = ProductMaster.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__icontains=category)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Search by name or code
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(product_name__icontains=search) | 
                Q(product_code__icontains=search)
            )
        
        return queryset

    @action(detail=True, methods=['get'])
    def stock_movements(self, request, pk=None):
        """Get stock movement history for a specific product"""
        try:
            product = self.get_object()
            movements = StockDetail.objects.filter(product=product).select_related('transaction')
            
            # Filter by date range
            start_date = request.query_params.get('start_date', None)
            end_date = request.query_params.get('end_date', None)
            
            if start_date:
                movements = movements.filter(transaction__transaction_date__gte=start_date)
            if end_date:
                movements = movements.filter(transaction__transaction_date__lte=end_date)
            
            movements = movements.order_by('-transaction__transaction_date')
            
            serializer = StockMovementSerializer(movements, many=True)
            return Response(serializer.data)
        except ProductMaster.DoesNotExist:
            return Response(
                {'error': 'Product not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class StockMainViewSet(viewsets.ModelViewSet):
    """ViewSet for StockMain CRUD operations"""
    queryset = StockMain.objects.all()
    serializer_class = StockMainSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return StockMainCreateSerializer
        return StockMainSerializer

    def get_queryset(self):
        queryset = StockMain.objects.all()
        
        # Filter by transaction type
        transaction_type = self.request.query_params.get('transaction_type', None)
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            queryset = queryset.filter(transaction_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(transaction_date__lte=end_date)
        
        # Search by reference number or supplier/customer
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(reference_number__icontains=search) | 
                Q(supplier_customer__icontains=search)
            )
        
        return queryset.order_by('-transaction_date')

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """Get details for a specific transaction"""
        try:
            transaction = self.get_object()
            details = transaction.details.all()
            serializer = StockDetailSerializer(details, many=True)
            return Response(serializer.data)
        except StockMain.DoesNotExist:
            return Response(
                {'error': 'Transaction not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class StockDetailViewSet(viewsets.ModelViewSet):
    """ViewSet for StockDetail CRUD operations"""
    queryset = StockDetail.objects.all()
    serializer_class = StockDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = StockDetail.objects.select_related('product', 'transaction')
        
        # Filter by product
        product_id = self.request.query_params.get('product_id', None)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        # Filter by transaction
        transaction_id = self.request.query_params.get('transaction_id', None)
        if transaction_id:
            queryset = queryset.filter(transaction_id=transaction_id)
        
        # Filter by movement type
        movement_type = self.request.query_params.get('movement_type', None)
        if movement_type:
            if movement_type.upper() == 'IN':
                queryset = queryset.filter(quantity__gt=0)
            elif movement_type.upper() == 'OUT':
                queryset = queryset.filter(quantity__lt=0)
        
        return queryset.order_by('-created_at')


class InventorySummaryView(generics.ListAPIView):
    """View for inventory summary with current stock levels"""
    serializer_class = InventorySummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Get all active products with their current stock levels
        products = ProductMaster.objects.filter(is_active=True)
        
        summary_data = []
        for product in products:
            # Calculate current stock
            current_stock = product.current_stock
            
            # Calculate total value
            total_value = current_stock * product.unit_price
            
            # Get last movement date
            last_movement = StockDetail.objects.filter(
                product=product
            ).select_related('transaction').order_by('-transaction__transaction_date').first()
            
            last_movement_date = last_movement.transaction.transaction_date if last_movement else None
            
            # Check if stock is low (less than 10 units)
            is_low_stock = current_stock < 10
            
            summary_data.append({
                'product_id': product.product_id,
                'product_code': product.product_code,
                'product_name': product.product_name,
                'category': product.category or '',
                'unit': product.unit,
                'current_stock': current_stock,
                'unit_price': product.unit_price,
                'total_value': total_value,
                'last_movement_date': last_movement_date,
                'is_low_stock': is_low_stock
            })
        
        return summary_data

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Filter by category
        category = request.query_params.get('category', None)
        if category:
            queryset = [item for item in queryset if category.lower() in item['category'].lower()]
        
        # Filter by low stock
        low_stock_only = request.query_params.get('low_stock_only', None)
        if low_stock_only and low_stock_only.lower() == 'true':
            queryset = [item for item in queryset if item['is_low_stock']]
        
        # Sort by current stock (ascending for low stock first)
        sort_by = request.query_params.get('sort_by', 'product_name')
        reverse_sort = request.query_params.get('reverse', 'false').lower() == 'true'
        
        if sort_by in ['current_stock', 'product_name', 'total_value']:
            queryset = sorted(queryset, key=lambda x: x[sort_by], reverse=reverse_sort)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DashboardStatsView(generics.GenericAPIView):
    """View for dashboard statistics"""
    permission_classes = [AllowAny]

    def get(self, request):
        """Get dashboard statistics"""
        try:
            # Total products
            total_products = ProductMaster.objects.filter(is_active=True).count()
            
            # Total transactions today
            today = timezone.now().date()
            today_transactions = StockMain.objects.filter(
                transaction_date__date=today
            ).count()
            
            # Total stock value
            total_value = 0
            for product in ProductMaster.objects.filter(is_active=True):
                total_value += product.current_stock * product.unit_price
            
            # Low stock products
            low_stock_products = 0
            for product in ProductMaster.objects.filter(is_active=True):
                if product.current_stock < 10:
                    low_stock_products += 1
            
            # Recent transactions (last 7 days)
            week_ago = timezone.now() - timedelta(days=7)
            recent_transactions = StockMain.objects.filter(
                transaction_date__gte=week_ago
            ).count()
            
            # Stock movements today
            today_movements = StockDetail.objects.filter(
                transaction__transaction_date__date=today
            ).count()
            
            stats = {
                'total_products': total_products,
                'today_transactions': today_transactions,
                'total_stock_value': float(total_value),
                'low_stock_products': low_stock_products,
                'recent_transactions': recent_transactions,
                'today_movements': today_movements
            }
            
            return Response(stats)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RegisterSerializer(ModelSerializer):
    email = EmailField(required=True)
    password = CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        if not value.endswith('@gmail.com'):
            raise ValidationError('Only Gmail addresses are allowed.')
        if User.objects.filter(email=value).exists():
            raise ValidationError('A user with this email already exists.')
        return value

    def create(self, validated_data):
        username = validated_data['username']
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
