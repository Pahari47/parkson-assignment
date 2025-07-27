# Warehouse Inventory API - Postman Testing Guide

## Base URL
```
http://127.0.0.1:8000/api
```

## Headers for All Requests
```
Content-Type: application/json
Accept: application/json
```

---

## 1. DASHBOARD STATISTICS

### GET Dashboard Stats
**URL:** `GET http://127.0.0.1:8000/api/dashboard-stats/`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Expected Response (200):**
```json
{
    "total_products": 0,
    "today_transactions": 0,
    "total_stock_value": 0.0,
    "low_stock_products": 0,
    "recent_transactions": 0,
    "today_movements": 0
}
```

---

## 2. PRODUCTS API

### GET All Products
**URL:** `GET http://127.0.0.1:8000/api/products/`

**Query Parameters (Optional):**
- `category` - Filter by category
- `is_active` - Filter by active status (true/false)
- `search` - Search by product name or code
- `page` - Page number for pagination

**Example:** `GET http://127.0.0.1:8000/api/products/?category=Electronics&is_active=true`

**Expected Response (200):**
```json
{
    "count": 0,
    "next": null,
    "previous": null,
    "results": []
}
```

### POST Create Product
**URL:** `POST http://127.0.0.1:8000/api/products/`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "product_code": "PROD001",
    "product_name": "Laptop Computer",
    "description": "High-performance laptop for business use",
    "category": "Electronics",
    "unit": "PCS",
    "unit_price": "999.99",
    "is_active": true
}
```

**Expected Response (201):**
```json
{
    "product_id": 1,
    "product_code": "PROD001",
    "product_name": "Laptop Computer",
    "description": "High-performance laptop for business use",
    "category": "Electronics",
    "unit": "PCS",
    "unit_price": "999.99",
    "is_active": true,
    "current_stock": 0,
    "created_at": "2025-07-27T10:30:00Z",
    "updated_at": "2025-07-27T10:30:00Z"
}
```

### GET Single Product
**URL:** `GET http://127.0.0.1:8000/api/products/{id}/`

**Example:** `GET http://127.0.0.1:8000/api/products/1/`

**Expected Response (200):**
```json
{
    "product_id": 1,
    "product_code": "PROD001",
    "product_name": "Laptop Computer",
    "description": "High-performance laptop for business use",
    "category": "Electronics",
    "unit": "PCS",
    "unit_price": "999.99",
    "is_active": true,
    "current_stock": 0,
    "created_at": "2025-07-27T10:30:00Z",
    "updated_at": "2025-07-27T10:30:00Z"
}
```

### PUT Update Product
**URL:** `PUT http://127.0.0.1:8000/api/products/{id}/`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "product_code": "PROD001",
    "product_name": "Updated Laptop Computer",
    "description": "Updated description",
    "category": "Electronics",
    "unit": "PCS",
    "unit_price": "1099.99",
    "is_active": true
}
```

**Expected Response (200):**
```json
{
    "product_id": 1,
    "product_code": "PROD001",
    "product_name": "Updated Laptop Computer",
    "description": "Updated description",
    "category": "Electronics",
    "unit": "PCS",
    "unit_price": "1099.99",
    "is_active": true,
    "current_stock": 0,
    "created_at": "2025-07-27T10:30:00Z",
    "updated_at": "2025-07-27T10:35:00Z"
}
```

### DELETE Product
**URL:** `DELETE http://127.0.0.1:8000/api/products/{id}/`

**Expected Response (204):** No content

### GET Product Stock Movements
**URL:** `GET http://127.0.0.1:8000/api/products/{id}/stock_movements/`

**Query Parameters (Optional):**
- `start_date` - Filter from date (YYYY-MM-DD)
- `end_date` - Filter to date (YYYY-MM-DD)

**Example:** `GET http://127.0.0.1:8000/api/products/1/stock_movements/?start_date=2025-07-01&end_date=2025-07-31`

**Expected Response (200):**
```json
[
    {
        "transaction_id": 1,
        "transaction_code": "IN20250727103000",
        "transaction_type": "IN",
        "transaction_date": "2025-07-27T10:30:00Z",
        "quantity": "10.00",
        "unit_price": "999.99",
        "total_price": "9999.90",
        "reference_number": "PO-001",
        "notes": "Initial stock"
    }
]
```

---

## 3. TRANSACTIONS API

### GET All Transactions
**URL:** `GET http://127.0.0.1:8000/api/transactions/`

**Query Parameters (Optional):**
- `transaction_type` - Filter by type (IN/OUT/ADJUST)
- `start_date` - Filter from date (YYYY-MM-DD)
- `end_date` - Filter to date (YYYY-MM-DD)
- `search` - Search by reference number or supplier/customer
- `page` - Page number for pagination

**Example:** `GET http://127.0.0.1:8000/api/transactions/?transaction_type=IN&start_date=2025-07-01`

**Expected Response (200):**
```json
{
    "count": 0,
    "next": null,
    "previous": null,
    "results": []
}
```

### POST Create Transaction
**URL:** `POST http://127.0.0.1:8000/api/transactions/`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "transaction_type": "IN",
    "transaction_date": "2025-07-27T10:30:00Z",
    "reference_number": "PO-001",
    "supplier_customer": "Tech Supplies Inc",
    "notes": "Initial stock purchase",
    "total_amount": "9999.90",
    "created_by": "admin",
    "details": [
        {
            "product": 1,
            "quantity": "10.00",
            "unit_price": "999.99",
            "batch_number": "BATCH001",
            "notes": "Laptop stock in"
        }
    ]
}
```

**Expected Response (201):**
```json
{
    "transaction_id": 1,
    "transaction_code": "IN20250727103000",
    "transaction_type": "IN",
    "transaction_type_display": "Stock In",
    "transaction_date": "2025-07-27T10:30:00Z",
    "reference_number": "PO-001",
    "supplier_customer": "Tech Supplies Inc",
    "notes": "Initial stock purchase",
    "total_amount": "9999.90",
    "created_by": "admin",
    "details": [
        {
            "detail_id": 1,
            "transaction": 1,
            "product": 1,
            "product_name": "Laptop Computer",
            "product_code": "PROD001",
            "quantity": "10.00",
            "unit_price": "999.99",
            "total_price": "9999.90",
            "batch_number": "BATCH001",
            "expiry_date": null,
            "notes": "Laptop stock in",
            "movement_type": "IN",
            "created_at": "2025-07-27T10:30:00Z",
            "updated_at": "2025-07-27T10:30:00Z"
        }
    ],
    "details_count": 1,
    "created_at": "2025-07-27T10:30:00Z",
    "updated_at": "2025-07-27T10:30:00Z"
}
```

### GET Single Transaction
**URL:** `GET http://127.0.0.1:8000/api/transactions/{id}/`

**Expected Response (200):**
```json
{
    "transaction_id": 1,
    "transaction_code": "IN20250727103000",
    "transaction_type": "IN",
    "transaction_type_display": "Stock In",
    "transaction_date": "2025-07-27T10:30:00Z",
    "reference_number": "PO-001",
    "supplier_customer": "Tech Supplies Inc",
    "notes": "Initial stock purchase",
    "total_amount": "9999.90",
    "created_by": "admin",
    "details": [...],
    "details_count": 1,
    "created_at": "2025-07-27T10:30:00Z",
    "updated_at": "2025-07-27T10:30:00Z"
}
```

### PUT Update Transaction
**URL:** `PUT http://127.0.0.1:8000/api/transactions/{id}/`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "transaction_type": "IN",
    "transaction_date": "2025-07-27T10:30:00Z",
    "reference_number": "PO-001-UPDATED",
    "supplier_customer": "Tech Supplies Inc",
    "notes": "Updated stock purchase",
    "total_amount": "9999.90",
    "created_by": "admin"
}
```

**Expected Response (200):** Updated transaction object

### DELETE Transaction
**URL:** `DELETE http://127.0.0.1:8000/api/transactions/{id}/`

**Expected Response (204):** No content

### GET Transaction Details
**URL:** `GET http://127.0.0.1:8000/api/transactions/{id}/details/`

**Expected Response (200):**
```json
[
    {
        "detail_id": 1,
        "transaction": 1,
        "product": 1,
        "product_name": "Laptop Computer",
        "product_code": "PROD001",
        "quantity": "10.00",
        "unit_price": "999.99",
        "total_price": "9999.90",
        "batch_number": "BATCH001",
        "expiry_date": null,
        "notes": "Laptop stock in",
        "movement_type": "IN",
        "created_at": "2025-07-27T10:30:00Z",
        "updated_at": "2025-07-27T10:30:00Z"
    }
]
```

---

## 4. STOCK DETAILS API

### GET All Stock Details
**URL:** `GET http://127.0.0.1:8000/api/stock-details/`

**Query Parameters (Optional):**
- `product_id` - Filter by product ID
- `transaction_id` - Filter by transaction ID
- `movement_type` - Filter by movement type (IN/OUT)
- `page` - Page number for pagination

**Example:** `GET http://127.0.0.1:8000/api/stock-details/?product_id=1&movement_type=IN`

**Expected Response (200):**
```json
{
    "count": 0,
    "next": null,
    "previous": null,
    "results": []
}
```

### POST Create Stock Detail
**URL:** `POST http://127.0.0.1:8000/api/stock-details/`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "transaction": 1,
    "product": 1,
    "quantity": "5.00",
    "unit_price": "999.99",
    "batch_number": "BATCH002",
    "notes": "Additional stock"
}
```

**Expected Response (201):**
```json
{
    "detail_id": 2,
    "transaction": 1,
    "product": 1,
    "product_name": "Laptop Computer",
    "product_code": "PROD001",
    "quantity": "5.00",
    "unit_price": "999.99",
    "total_price": "4999.95",
    "batch_number": "BATCH002",
    "expiry_date": null,
    "notes": "Additional stock",
    "movement_type": "IN",
    "created_at": "2025-07-27T10:35:00Z",
    "updated_at": "2025-07-27T10:35:00Z"
}
```

### GET Single Stock Detail
**URL:** `GET http://127.0.0.1:8000/api/stock-details/{id}/`

**Expected Response (200):**
```json
{
    "detail_id": 2,
    "transaction": 1,
    "product": 1,
    "product_name": "Laptop Computer",
    "product_code": "PROD001",
    "quantity": "5.00",
    "unit_price": "999.99",
    "total_price": "4999.95",
    "batch_number": "BATCH002",
    "expiry_date": null,
    "notes": "Additional stock",
    "movement_type": "IN",
    "created_at": "2025-07-27T10:35:00Z",
    "updated_at": "2025-07-27T10:35:00Z"
}
```

### PUT Update Stock Detail
**URL:** `PUT http://127.0.0.1:8000/api/stock-details/{id}/`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
    "transaction": 1,
    "product": 1,
    "quantity": "6.00",
    "unit_price": "999.99",
    "batch_number": "BATCH002",
    "notes": "Updated additional stock"
}
```

**Expected Response (200):** Updated stock detail object

### DELETE Stock Detail
**URL:** `DELETE http://127.0.0.1:8000/api/stock-details/{id}/`

**Expected Response (204):** No content

---

## 5. INVENTORY SUMMARY API

### GET Inventory Summary
**URL:** `GET http://127.0.0.1:8000/api/inventory-summary/`

**Query Parameters (Optional):**
- `category` - Filter by category
- `low_stock_only` - Show only low stock items (true/false)
- `sort_by` - Sort by field (current_stock/product_name/total_value)
- `reverse` - Reverse sort order (true/false)

**Example:** `GET http://127.0.0.1:8000/api/inventory-summary/?low_stock_only=true&sort_by=current_stock`

**Expected Response (200):**
```json
[
    {
        "product_id": 1,
        "product_code": "PROD001",
        "product_name": "Laptop Computer",
        "category": "Electronics",
        "unit": "PCS",
        "current_stock": "15.00",
        "unit_price": "999.99",
        "total_value": "14999.85",
        "last_movement_date": "2025-07-27T10:35:00Z",
        "is_low_stock": false
    }
]
```

---

## 6. ERROR RESPONSES

### Validation Error (400)
```json
{
    "product_code": [
        "Product code already exists."
    ],
    "unit_price": [
        "Unit price cannot be negative."
    ]
}
```

### Not Found Error (404)
```json
{
    "detail": "Not found."
}
```

### Server Error (500)
```json
{
    "error": "Internal server error message"
}
```

---

## 7. TESTING SCENARIOS

### Scenario 1: Complete Product Lifecycle
1. **Create Product** → POST `/api/products/`
2. **Get Product** → GET `/api/products/1/`
3. **Update Product** → PUT `/api/products/1/`
4. **Create Stock In Transaction** → POST `/api/transactions/`
5. **Check Inventory Summary** → GET `/api/inventory-summary/`
6. **Create Stock Out Transaction** → POST `/api/transactions/`
7. **Check Product Stock Movements** → GET `/api/products/1/stock_movements/`

### Scenario 2: Dashboard Testing
1. **Get Dashboard Stats** → GET `/api/dashboard-stats/`
2. **Create Multiple Products** → POST `/api/products/` (multiple times)
3. **Create Multiple Transactions** → POST `/api/transactions/` (multiple times)
4. **Check Updated Dashboard Stats** → GET `/api/dashboard-stats/`

### Scenario 3: Search and Filter Testing
1. **Get Products with Filters** → GET `/api/products/?category=Electronics&is_active=true`
2. **Get Transactions with Filters** → GET `/api/transactions/?transaction_type=IN&start_date=2025-07-01`
3. **Get Stock Details with Filters** → GET `/api/stock-details/?product_id=1&movement_type=IN`
4. **Get Inventory Summary with Filters** → GET `/api/inventory-summary/?low_stock_only=true`

---

## 8. POSTMAN COLLECTION

You can import this collection into Postman:

```json
{
    "info": {
        "name": "Warehouse Inventory API",
        "description": "Complete API testing for warehouse inventory system"
    },
    "item": [
        {
            "name": "Dashboard",
            "item": [
                {
                    "name": "Get Dashboard Stats",
                    "request": {
                        "method": "GET",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "url": {
                            "raw": "http://127.0.0.1:8000/api/dashboard-stats/",
                            "protocol": "http",
                            "host": ["127", "0", "0", "1"],
                            "port": "8000",
                            "path": ["api", "dashboard-stats", ""]
                        }
                    }
                }
            ]
        },
        {
            "name": "Products",
            "item": [
                {
                    "name": "Get All Products",
                    "request": {
                        "method": "GET",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "url": {
                            "raw": "http://127.0.0.1:8000/api/products/",
                            "protocol": "http",
                            "host": ["127", "0", "0", "1"],
                            "port": "8000",
                            "path": ["api", "products", ""]
                        }
                    }
                },
                {
                    "name": "Create Product",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"product_code\": \"PROD001\",\n    \"product_name\": \"Laptop Computer\",\n    \"description\": \"High-performance laptop for business use\",\n    \"category\": \"Electronics\",\n    \"unit\": \"PCS\",\n    \"unit_price\": \"999.99\",\n    \"is_active\": true\n}"
                        },
                        "url": {
                            "raw": "http://127.0.0.1:8000/api/products/",
                            "protocol": "http",
                            "host": ["127", "0", "0", "1"],
                            "port": "8000",
                            "path": ["api", "products", ""]
                        }
                    }
                }
            ]
        }
    ]
}
```

---

## 9. IMPORTANT NOTES

1. **Base URL**: Make sure the Django server is running on `http://127.0.0.1:8000`
2. **Headers**: Always include `Content-Type: application/json` for POST/PUT requests
3. **Validation**: All inputs are validated - check error responses for validation details
4. **Pagination**: List endpoints support pagination with `page` parameter
5. **Auto-generation**: Transaction codes are auto-generated if not provided
6. **Stock Calculation**: Current stock is calculated automatically from all movements
7. **CORS**: API supports CORS for frontend integration

---

## 10. QUICK TEST CHECKLIST

- [ ] Dashboard stats endpoint works
- [ ] Product CRUD operations work
- [ ] Transaction creation with details works
- [ ] Stock detail CRUD operations work
- [ ] Inventory summary shows correct data
- [ ] Search and filter parameters work
- [ ] Error responses are properly formatted
- [ ] Pagination works correctly
- [ ] Stock movements are tracked correctly
- [ ] Current stock calculations are accurate 