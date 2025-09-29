# iCanGrow Backend - Inventory API Documentation

This document outlines all the inventory-related API endpoints that have been implemented based on the frontend requirements.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All inventory endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Inventory Endpoints

### 1. Get Inventory Lots
**GET** `/inventory/lots`

Get all inventory lots with optional filtering (only shows packaging stage items).

**Query Parameters:**
- `searchTerm` (optional): Search in lot code, product name, or strain
- `facilityFilter` (optional): Filter by facility name
- `productTypeFilter` (optional): Filter by product type (flower, trim, oil, packaged)
- `stageFilter` (optional): Filter by stage
- `statusFilter` (optional): Filter by status (available, quarantine, expired, approved)

**Response:**
```json
{
  "success": true,
  "message": "Inventory lots retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "lot_code": "LOT-2024-001",
      "product_name": "Premium Flower",
      "strain": "OG Kush",
      "stage": "packaging",
      "status": "approved",
      "facility": "Main Facility",
      "quantity": 1000,
      "unit_of_measure": "grams",
      "expiry_date": "2024-12-31",
      "coa_approved": true,
      "stock_levels": [{
        "available_quantity": 950,
        "reserved_quantity": 50
      }],
      "coa_records": {
        "lab_name": "CannaLab Testing",
        "test_date": "2024-01-15",
        "thc_percentage": 22.5,
        "cbd_percentage": 1.2
      }
    }
  ]
}
```

### 2. Get Specific Lot Details
**GET** `/inventory/lots/:id`

Get detailed information about a specific lot including traceability data.

**Response:**
```json
{
  "success": true,
  "message": "Lot details retrieved successfully",
  "data": {
    "id": "uuid",
    "lot_code": "LOT-2024-001",
    "batch_id": "batch-uuid",
    "product_name": "Premium Flower",
    "strain": "OG Kush",
    "stage": "packaging",
    "status": "approved",
    "facility": "Main Facility",
    "quantity": 1000,
    "unit_of_measure": "grams",
    "expiry_date": "2024-12-31",
    "coa_approved": true,
    "stock_levels": [{
      "available_quantity": 950,
      "reserved_quantity": 50
    }],
    "coa_records": {
      "lab_name": "CannaLab Testing",
      "test_date": "2024-01-15",
      "thc_percentage": 22.5,
      "cbd_percentage": 1.2
    }
  }
}
```

### 3. Get Stock Movements
**GET** `/inventory/lots/:id/movements`

Get all stock movements (history) for a specific lot.

**Response:**
```json
{
  "success": true,
  "message": "Stock movements retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "movement_type": "adjust",
      "quantity": -50,
      "unit_of_measure": "grams",
      "from_facility": null,
      "to_facility": null,
      "reason": "Quality control sample",
      "created_at": "2024-01-15T10:30:00Z",
      "performed_by": "user-uuid"
    }
  ]
}
```

### 4. Adjust Stock Quantity
**POST** `/inventory/lots/:id/adjust`

Adjust the stock quantity for a specific lot (add or remove stock).

**Request Body:**
```json
{
  "quantity": -50,
  "reason": "Quality control sample taken",
  "unit_of_measure": "grams"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stock adjusted successfully",
  "data": {
    "success": true,
    "newQuantity": 950,
    "adjustment": -50
  }
}
```

### 5. Toggle Quarantine Status
**PATCH** `/inventory/lots/:id/quarantine`

Place a lot in quarantine or release it from quarantine.

**Request Body:**
```json
{
  "action": "quarantine"  // or "release"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lot quarantined successfully",
  "data": {
    "success": true,
    "oldStatus": "available",
    "newStatus": "quarantine"
  }
}
```

### 6. Get Batch Information
**GET** `/inventory/batches/:id`

Get batch information for traceability.

**Response:**
```json
{
  "success": true,
  "message": "Batch information retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Batch-2024-001",
    "strain": "OG Kush",
    "current_stage": "packaging",
    "start_date": "2024-01-01",
    "plant_count": 100,
    "progress": 85,
    "status": "active",
    "room": "Flower Room A"
  }
}
```

### 7. Get Batch Stages
**GET** `/inventory/batches/:id/stages`

Get the progression through different growth stages for a batch.

**Response:**
```json
{
  "success": true,
  "message": "Batch stages retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "stage_id": "stage-uuid",
      "stage_name": "Vegetative",
      "status": "completed",
      "started_at": "2024-01-01T00:00:00Z",
      "completed_at": "2024-01-15T00:00:00Z",
      "stage_weight": 500.5
    },
    {
      "id": "uuid",
      "stage_id": "stage-uuid",
      "stage_name": "Flowering",
      "status": "active",
      "started_at": "2024-01-15T00:00:00Z",
      "completed_at": null,
      "stage_weight": null
    }
  ]
}
```

### 8. Get Daily Logs
**GET** `/inventory/batches/:id/daily-logs?limit=5`

Get recent daily logs for a batch (environmental data, observations, etc.).

**Query Parameters:**
- `limit` (optional): Number of logs to return (default: 5)

**Response:**
```json
{
  "success": true,
  "message": "Daily logs retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "date": "2024-01-15",
      "stage": "flowering",
      "temperature": 22.5,
      "humidity": 55.0,
      "plant_count": 95,
      "observations": "Plants looking healthy, good bud development",
      "logged_by": "John Doe"
    }
  ]
}
```

### 9. Get Inventory Statistics
**GET** `/inventory/stats`

Get summary statistics for inventory dashboard.

**Response:**
```json
{
  "success": true,
  "message": "Inventory statistics retrieved successfully",
  "data": {
    "totalLots": 145,
    "dispatchReady": 23,
    "quarantined": 5,
    "expired": 2
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "field_name",
      "message": "Specific validation error"
    }
  ]
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Frontend Integration

These APIs are designed to work seamlessly with the provided React frontend. The frontend expects:

1. **Inventory lots** with stock levels and COA information
2. **Stock movements** for traceability
3. **Batch information** for complete supply chain visibility
4. **Quarantine management** capabilities
5. **Stock adjustment** functionality

## Database Tables Used

The APIs interact with the following database tables:
- `inventory_lots` - Main lot information
- `stock_levels` - Available and reserved quantities
- `stock_movements` - All stock transactions
- `batches` - Batch cultivation information
- `batch_stages` - Growth stage progression
- `stages` - Stage definitions
- `daily_logs` - Environmental and observation data
- `coa_records` - Certificate of Analysis data

## Notes

- All lot queries are filtered to only show items in the "packaging" stage
- Stock adjustments create movement records for full traceability
- Quarantine actions also generate movement records
- All timestamps are in ISO 8601 format
- Quantities are stored as numeric with 3 decimal precision
- User authentication is required for all operations