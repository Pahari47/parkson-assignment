from django.contrib import admin
from .models import ProductMaster, StockMain, StockDetail


@admin.register(ProductMaster)
class ProductMasterAdmin(admin.ModelAdmin):
    list_display = [
        'product_code', 'product_name', 'category', 'unit', 
        'unit_price', 'current_stock', 'is_active', 'created_at'
    ]
    list_filter = ['category', 'is_active', 'unit', 'created_at']
    search_fields = ['product_code', 'product_name', 'description']
    readonly_fields = ['product_id', 'current_stock', 'created_at', 'updated_at']
    ordering = ['product_name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('product_code', 'product_name', 'description', 'category')
        }),
        ('Pricing & Units', {
            'fields': ('unit', 'unit_price')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('System Information', {
            'fields': ('product_id', 'current_stock', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class StockDetailInline(admin.TabularInline):
    model = StockDetail
    extra = 1
    fields = ['product', 'quantity', 'unit_price', 'total_price', 'batch_number', 'expiry_date', 'notes']
    readonly_fields = ['total_price']


@admin.register(StockMain)
class StockMainAdmin(admin.ModelAdmin):
    list_display = [
        'transaction_code', 'transaction_type', 'transaction_date', 
        'supplier_customer', 'total_amount', 'details_count', 'created_by'
    ]
    list_filter = ['transaction_type', 'transaction_date', 'created_at']
    search_fields = ['transaction_code', 'reference_number', 'supplier_customer', 'notes']
    readonly_fields = ['transaction_id', 'transaction_code', 'created_at', 'updated_at']
    ordering = ['-transaction_date']
    inlines = [StockDetailInline]
    
    fieldsets = (
        ('Transaction Information', {
            'fields': ('transaction_type', 'transaction_date', 'reference_number')
        }),
        ('Party Information', {
            'fields': ('supplier_customer', 'notes')
        }),
        ('Financial', {
            'fields': ('total_amount',)
        }),
        ('User Information', {
            'fields': ('created_by',)
        }),
        ('System Information', {
            'fields': ('transaction_id', 'transaction_code', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def details_count(self, obj):
        return obj.details.count()
    details_count.short_description = 'Items'


@admin.register(StockDetail)
class StockDetailAdmin(admin.ModelAdmin):
    list_display = [
        'detail_id', 'transaction', 'product', 'quantity', 
        'unit_price', 'total_price', 'movement_type', 'created_at'
    ]
    list_filter = ['transaction__transaction_type', 'product__category', 'created_at']
    search_fields = ['transaction__transaction_code', 'product__product_name', 'product__product_code']
    readonly_fields = ['detail_id', 'total_price', 'movement_type', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Transaction Information', {
            'fields': ('transaction', 'product')
        }),
        ('Quantity & Pricing', {
            'fields': ('quantity', 'unit_price', 'total_price')
        }),
        ('Additional Information', {
            'fields': ('batch_number', 'expiry_date', 'notes')
        }),
        ('System Information', {
            'fields': ('detail_id', 'movement_type', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def movement_type(self, obj):
        return obj.movement_type
    movement_type.short_description = 'Movement Type'
