# Warehouse Inventory Backend

A Django REST API for tracking stock movements in a warehouse inventory system.

## Features

- **Product Management**: CRUD operations for products with categories and pricing
- **Stock Transactions**: Track stock in/out movements with detailed line items
- **Inventory Summary**: Real-time inventory levels with current stock calculations
- **Dashboard Statistics**: Overview of warehouse operations
- **Stock Movement History**: Complete audit trail of all stock movements
- **Input Validation**: Comprehensive validation for all user inputs

## Database Schema

The system uses three main tables:

1. **prodmast** (ProductMaster): Product master data
2. **stckmain** (StockMain): Transaction headers
3. **stckdetail** (StockDetail): Transaction line items

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your database:

```bash
cp env.example .env
```

Edit `.env` file and add your Neon database URL:

```
DATABASE_URL=postgresql://username:password@host:port/database
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Database Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `POST /api/products/` - Create new product
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product
- `GET /api/products/{id}/stock_movements/` - Get stock movement history

### Transactions
- `GET /api/transactions/` - List all transactions
- `POST /api/transactions/` - Create new transaction with details
- `GET /api/transactions/{id}/` - Get transaction details
- `PUT /api/transactions/{id}/` - Update transaction
- `DELETE /api/transactions/{id}/` - Delete transaction
- `GET /api/transactions/{id}/details/` - Get transaction line items

### Stock Details
- `GET /api/stock-details/` - List all stock details
- `POST /api/stock-details/` - Create new stock detail
- `GET /api/stock-details/{id}/` - Get stock detail
- `PUT /api/stock-details/{id}/` - Update stock detail
- `DELETE /api/stock-details/{id}/` - Delete stock detail

### Inventory Summary
- `GET /api/inventory-summary/` - Get current inventory levels
- `GET /api/dashboard-stats/` - Get dashboard statistics

## Query Parameters

### Products
- `category` - Filter by category
- `is_active` - Filter by active status (true/false)
- `search` - Search by product name or code

### Transactions
- `transaction_type` - Filter by transaction type (IN/OUT/ADJUST)
- `start_date` - Filter from date (YYYY-MM-DD)
- `end_date` - Filter to date (YYYY-MM-DD)
- `search` - Search by reference number or supplier/customer

### Stock Details
- `product_id` - Filter by product ID
- `transaction_id` - Filter by transaction ID
- `movement_type` - Filter by movement type (IN/OUT)

### Inventory Summary
- `category` - Filter by category
- `low_stock_only` - Show only low stock items (true/false)
- `sort_by` - Sort by field (current_stock/product_name/total_value)
- `reverse` - Reverse sort order (true/false)

## Admin Interface

Access the Django admin interface at `/admin/` to manage:
- Products
- Stock transactions
- Stock details

## Validation Rules

### Products
- Product code must be unique
- Unit price must be non-negative
- Product name is required

### Stock Transactions
- Transaction type must be IN, OUT, or ADJUST
- Total amount must be non-negative
- At least one product detail is required

### Stock Details
- Quantity must be greater than zero
- Unit price must be non-negative
- Total price is auto-calculated

## Current Stock Calculation

The system automatically calculates current stock levels by:
1. Summing all stock movements (positive for IN, negative for OUT)
2. Providing real-time inventory levels
3. Tracking stock value based on unit prices

## Development

### Running Tests
```bash
python manage.py test
```

### API Documentation
Access interactive API documentation at `/api/docs/`

### Database Backup
```bash
python manage.py dumpdata > backup.json
```

### Database Restore
```bash
python manage.py loaddata backup.json
``` 