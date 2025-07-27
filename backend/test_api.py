#!/usr/bin/env python3
"""
Test script for Warehouse Inventory API
Run this script to test all API endpoints
"""

import requests
import json
from datetime import datetime

# API Base URL
BASE_URL = "http://127.0.0.1:8000/api"

def test_api_endpoints():
    """Test all API endpoints"""
    print("🧪 Testing Warehouse Inventory API")
    print("=" * 50)
    
    # Test 1: Dashboard Stats
    print("\n1. Testing Dashboard Stats...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard-stats/")
        if response.status_code == 200:
            print("✅ Dashboard Stats: SUCCESS")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Dashboard Stats: FAILED ({response.status_code})")
    except Exception as e:
        print(f"❌ Dashboard Stats: ERROR - {e}")
    
    # Test 2: Products List
    print("\n2. Testing Products List...")
    try:
        response = requests.get(f"{BASE_URL}/products/")
        if response.status_code == 200:
            print("✅ Products List: SUCCESS")
            print(f"   Count: {len(response.json()['results'])} products")
        else:
            print(f"❌ Products List: FAILED ({response.status_code})")
    except Exception as e:
        print(f"❌ Products List: ERROR - {e}")
    
    # Test 3: Create a Product
    print("\n3. Testing Product Creation...")
    try:
        product_data = {
            "product_code": "TEST001",
            "product_name": "Test Product",
            "description": "A test product for API testing",
            "category": "Test Category",
            "unit": "PCS",
            "unit_price": "10.50",
            "is_active": True
        }
        response = requests.post(f"{BASE_URL}/products/", json=product_data)
        if response.status_code == 201:
            print("✅ Product Creation: SUCCESS")
            product_id = response.json()['product_id']
            print(f"   Created Product ID: {product_id}")
        else:
            print(f"❌ Product Creation: FAILED ({response.status_code})")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Product Creation: ERROR - {e}")
    
    # Test 4: Create a Stock Transaction
    print("\n4. Testing Stock Transaction Creation...")
    try:
        transaction_data = {
            "transaction_type": "IN",
            "transaction_date": datetime.now().isoformat(),
            "reference_number": "PO-001",
            "supplier_customer": "Test Supplier",
            "notes": "Test stock in transaction",
            "total_amount": "105.00",
            "created_by": "test_user",
            "details": [
                {
                    "product": 1,  # Assuming product ID 1 exists
                    "quantity": "10.00",
                    "unit_price": "10.50",
                    "batch_number": "BATCH001",
                    "notes": "Test stock detail"
                }
            ]
        }
        response = requests.post(f"{BASE_URL}/transactions/", json=transaction_data)
        if response.status_code == 201:
            print("✅ Stock Transaction Creation: SUCCESS")
            transaction_id = response.json()['transaction_id']
            print(f"   Created Transaction ID: {transaction_id}")
        else:
            print(f"❌ Stock Transaction Creation: FAILED ({response.status_code})")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Stock Transaction Creation: ERROR - {e}")
    
    # Test 5: Inventory Summary
    print("\n5. Testing Inventory Summary...")
    try:
        response = requests.get(f"{BASE_URL}/inventory-summary/")
        if response.status_code == 200:
            print("✅ Inventory Summary: SUCCESS")
            print(f"   Count: {len(response.json())} products in summary")
        else:
            print(f"❌ Inventory Summary: FAILED ({response.status_code})")
    except Exception as e:
        print(f"❌ Inventory Summary: ERROR - {e}")
    
    # Test 6: Stock Details List
    print("\n6. Testing Stock Details List...")
    try:
        response = requests.get(f"{BASE_URL}/stock-details/")
        if response.status_code == 200:
            print("✅ Stock Details List: SUCCESS")
            print(f"   Count: {len(response.json()['results'])} stock details")
        else:
            print(f"❌ Stock Details List: FAILED ({response.status_code})")
    except Exception as e:
        print(f"❌ Stock Details List: ERROR - {e}")
    
    print("\n" + "=" * 50)
    print("🎉 API Testing Complete!")
    print("\n📋 Available Endpoints:")
    print(f"   • Dashboard Stats: {BASE_URL}/dashboard-stats/")
    print(f"   • Products: {BASE_URL}/products/")
    print(f"   • Transactions: {BASE_URL}/transactions/")
    print(f"   • Stock Details: {BASE_URL}/stock-details/")
    print(f"   • Inventory Summary: {BASE_URL}/inventory-summary/")
    print(f"   • API Documentation: http://127.0.0.1:8000/api/docs/")
    print(f"   • Admin Interface: http://127.0.0.1:8000/admin/")

if __name__ == "__main__":
    test_api_endpoints() 