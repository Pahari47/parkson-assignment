#!/usr/bin/env bash

# Navigate to backend directory
cd backend

# Start the server with gunicorn
gunicorn warehouse_inventory.wsgi:app --bind 0.0.0.0:$PORT 