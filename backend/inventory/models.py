from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class ProductMaster(models.Model):
    """
    Product Master Table (prodmast)
    Stores the details of the products
    """
    product_id = models.AutoField(primary_key=True)
    product_code = models.CharField(max_length=50, unique=True, help_text="Unique product code")
    product_name = models.CharField(max_length=200, help_text="Product name")
    description = models.TextField(blank=True, null=True, help_text="Product description")
    category = models.CharField(max_length=100, blank=True, null=True, help_text="Product category")
    unit = models.CharField(max_length=20, default='PCS', help_text="Unit of measurement")
    unit_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0.00)],
        help_text="Unit price"
    )
    is_active = models.BooleanField(default=True, help_text="Product status")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'prodmast'
        verbose_name = 'Product Master'
        verbose_name_plural = 'Product Masters'
        ordering = ['product_name']

    def __str__(self):
        return f"{self.product_code} - {self.product_name}"

    @property
    def current_stock(self):
        """Calculate current stock level for this product"""
        from django.db.models import Sum
        # Sum all stock movements (positive for in, negative for out)
        stock_movements = StockDetail.objects.filter(
            product=self
        ).aggregate(
            total=Sum('quantity')
        )['total'] or 0
        return stock_movements


class StockMain(models.Model):
    """
    Stock Main Table (stckmain)
    Stores the transaction details
    """
    TRANSACTION_TYPES = [
        ('IN', 'Stock In'),
        ('OUT', 'Stock Out'),
        ('ADJUST', 'Stock Adjustment'),
    ]

    transaction_id = models.AutoField(primary_key=True)
    transaction_code = models.CharField(max_length=50, unique=True, help_text="Unique transaction code")
    transaction_type = models.CharField(
        max_length=10, 
        choices=TRANSACTION_TYPES,
        help_text="Type of transaction"
    )
    transaction_date = models.DateTimeField(default=timezone.now, help_text="Transaction date and time")
    reference_number = models.CharField(max_length=100, blank=True, null=True, help_text="External reference number")
    supplier_customer = models.CharField(max_length=200, blank=True, null=True, help_text="Supplier or customer name")
    notes = models.TextField(blank=True, null=True, help_text="Transaction notes")
    total_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0.00)],
        help_text="Total transaction amount"
    )
    created_by = models.CharField(max_length=100, blank=True, null=True, help_text="User who created the transaction")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stckmain'
        verbose_name = 'Stock Transaction'
        verbose_name_plural = 'Stock Transactions'
        ordering = ['-transaction_date']

    def __str__(self):
        return f"{self.transaction_code} - {self.get_transaction_type_display()}"

    def save(self, *args, **kwargs):
        # Auto-generate transaction code if not provided
        if not self.transaction_code:
            prefix = {
                'IN': 'IN',
                'OUT': 'OUT', 
                'ADJUST': 'ADJ'
            }.get(self.transaction_type, 'TXN')
            self.transaction_code = f"{prefix}{timezone.now().strftime('%Y%m%d%H%M%S')}"
        super().save(*args, **kwargs)


class StockDetail(models.Model):
    """
    Stock Detail Table (stckdetail)
    Stores the details of the products within each transaction
    """
    detail_id = models.AutoField(primary_key=True)
    transaction = models.ForeignKey(
        StockMain, 
        on_delete=models.CASCADE, 
        related_name='details',
        help_text="Related stock transaction"
    )
    product = models.ForeignKey(
        ProductMaster, 
        on_delete=models.CASCADE,
        related_name='stock_movements',
        help_text="Product in this transaction"
    )
    quantity = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Quantity moved"
    )
    unit_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.00)],
        help_text="Unit price at time of transaction"
    )
    total_price = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(0.00)],
        help_text="Total price for this line item"
    )
    batch_number = models.CharField(max_length=100, blank=True, null=True, help_text="Batch or lot number")
    expiry_date = models.DateField(blank=True, null=True, help_text="Expiry date if applicable")
    notes = models.TextField(blank=True, null=True, help_text="Line item notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stckdetail'
        verbose_name = 'Stock Detail'
        verbose_name_plural = 'Stock Details'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction.transaction_code} - {self.product.product_name} ({self.quantity})"

    def save(self, *args, **kwargs):
        # Auto-calculate total price if not provided
        if not self.total_price:
            self.total_price = self.quantity * self.unit_price
        
        # For stock out transactions, make quantity negative
        if self.transaction.transaction_type == 'OUT':
            self.quantity = -abs(self.quantity)
        
        super().save(*args, **kwargs)

    @property
    def movement_type(self):
        """Return whether this is a stock in or out movement"""
        if self.quantity > 0:
            return "IN"
        return "OUT"
