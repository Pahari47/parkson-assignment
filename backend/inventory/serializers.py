from rest_framework import serializers
from .models import ProductMaster, StockMain, StockDetail


class ProductMasterSerializer(serializers.ModelSerializer):
    """Serializer for ProductMaster model"""
    current_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductMaster
        fields = [
            'product_id', 'product_code', 'product_name', 'description', 
            'category', 'unit', 'unit_price', 'is_active', 'current_stock',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['product_id', 'created_at', 'updated_at', 'current_stock']

    def validate_product_code(self, value):
        """Validate product code uniqueness"""
        if ProductMaster.objects.filter(product_code=value).exists():
            raise serializers.ValidationError("Product code already exists.")
        return value

    def validate_unit_price(self, value):
        """Validate unit price is non-negative"""
        if value < 0:
            raise serializers.ValidationError("Unit price cannot be negative.")
        return value


class StockDetailSerializer(serializers.ModelSerializer):
    """Serializer for StockDetail model"""
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_code = serializers.CharField(source='product.product_code', read_only=True)
    movement_type = serializers.ReadOnlyField()
    
    class Meta:
        model = StockDetail
        fields = [
            'detail_id', 'transaction', 'product', 'product_name', 'product_code',
            'quantity', 'unit_price', 'total_price', 'batch_number', 'expiry_date',
            'notes', 'movement_type', 'created_at', 'updated_at'
        ]
        read_only_fields = ['detail_id', 'total_price', 'movement_type', 'created_at', 'updated_at']

    def validate_quantity(self, value):
        """Validate quantity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        return value

    def validate_unit_price(self, value):
        """Validate unit price is non-negative"""
        if value < 0:
            raise serializers.ValidationError("Unit price cannot be negative.")
        return value


class StockMainSerializer(serializers.ModelSerializer):
    """Serializer for StockMain model"""
    details = StockDetailSerializer(many=True, read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    details_count = serializers.SerializerMethodField()
    
    class Meta:
        model = StockMain
        fields = [
            'transaction_id', 'transaction_code', 'transaction_type', 
            'transaction_type_display', 'transaction_date', 'reference_number',
            'supplier_customer', 'notes', 'total_amount', 'created_by',
            'details', 'details_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['transaction_id', 'transaction_code', 'created_at', 'updated_at']

    def get_details_count(self, obj):
        """Get count of details in this transaction"""
        return obj.details.count()

    def validate_transaction_type(self, value):
        """Validate transaction type"""
        valid_types = ['IN', 'OUT', 'ADJUST']
        if value not in valid_types:
            raise serializers.ValidationError(f"Transaction type must be one of: {', '.join(valid_types)}")
        return value

    def validate_total_amount(self, value):
        """Validate total amount is non-negative"""
        if value < 0:
            raise serializers.ValidationError("Total amount cannot be negative.")
        return value


class StockMainCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating StockMain with nested details"""
    details = StockDetailSerializer(many=True)
    
    class Meta:
        model = StockMain
        fields = [
            'transaction_type', 'transaction_date', 'reference_number',
            'supplier_customer', 'notes', 'total_amount', 'created_by', 'details'
        ]

    def create(self, validated_data):
        details_data = validated_data.pop('details', [])
        transaction = StockMain.objects.create(**validated_data)
        
        # Create stock details
        for detail_data in details_data:
            detail_data['transaction'] = transaction
            StockDetail.objects.create(**detail_data)
        
        return transaction

    def validate_details(self, value):
        """Validate that details are provided"""
        if not value:
            raise serializers.ValidationError("At least one product detail is required.")
        return value


class InventorySummarySerializer(serializers.Serializer):
    """Serializer for inventory summary"""
    product_id = serializers.IntegerField()
    product_code = serializers.CharField()
    product_name = serializers.CharField()
    category = serializers.CharField()
    unit = serializers.CharField()
    current_stock = serializers.DecimalField(max_digits=10, decimal_places=2)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    last_movement_date = serializers.DateTimeField(allow_null=True)
    is_low_stock = serializers.BooleanField()


class StockMovementSerializer(serializers.Serializer):
    """Serializer for stock movement history"""
    transaction_id = serializers.IntegerField()
    transaction_code = serializers.CharField()
    transaction_type = serializers.CharField()
    transaction_date = serializers.DateTimeField()
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2)
    reference_number = serializers.CharField(allow_null=True)
    notes = serializers.CharField(allow_null=True) 