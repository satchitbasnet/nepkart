# NEPKART - E-Commerce Platform

NEPKART is a full-stack e-commerce application designed to bridge the gap for the Nepali diaspora and Himalayan culture enthusiasts in the USA. The platform manages authentic Nepali products with real-time inventory tracking to prevent selling out-of-stock items.

## Documentation

- **[Use Case Diagrams](docs/USE_CASE_DIAGRAMS.md)** – Frontend and backend use cases for Customer and Admin
- **[Sequence Diagrams](docs/SEQUENCE_DIAGRAMS.md)** – Sign up, login, cart, checkout, admin flows

## Project Structure

```
CURSOR/
├── frontend/          # React.js frontend application
├── backend/           # Java Spring Boot backend application
└── README.md         # This file
```

## Features

### Frontend (React.js)
- **Catalog Management**: Support for distinct categories (Food, Clothing, Religious, Decor)
- **Product Search**: Search functionality across products
- **Product Details**: Detailed product pages with image zoom capability
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Complete order placement with customer information
- **Admin Dashboard**: Warehouse inventory management with low stock alerts
- **Theme**: Crimson Red, White, and Deep Blue color scheme

### Backend (Java Spring Boot)
- **RESTful API**: Complete REST API for frontend integration
- **Domain Models**: Product, Customer, Order, OrderItem
- **Inventory Management**: Real-time stock tracking and decrement
- **Shipping Calculation**: Weight-based shipping cost calculation
- **Database**: Supabase (PostgreSQL) – shared cloud database for all developers

## Technology Stack

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- React Image Zoom 3.0.0

### Backend
- Java 17
- Spring Boot 3.1.5
- Spring Data JPA
- Supabase (PostgreSQL) – cloud database

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Java 17 or higher
- Maven 3.6 or higher

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create `.env` from the example (password in QUICKSTART.md):
```bash
cp .env.example .env
# Edit .env: SPRING_DATASOURCE_PASSWORD=nepkart9841
```

3. Run:
```bash
# Windows
.\run.ps1

# Mac/Linux
./run.sh
```

The backend API will be available at `http://localhost:8081`. Uses **Supabase** by default—data persists across restarts.

### Access Points

- **Frontend**: http://localhost:5173 (or 5174, 5175…)
- **Backend API**: http://localhost:8081/api

## API Endpoints

### Products
- `GET /api/products` - Get all products (optional query params: category, search)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/out-of-stock` - Get out of stock products
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/order-id/{orderId}` - Get order by order ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/status` - Update order status

### Shipping
- `POST /api/shipping/calculate` - Calculate shipping cost

## Database Schema

### Products Table
- id (Long, Primary Key)
- sku (String, Unique)
- name (String)
- category (String)
- price (BigDecimal)
- stock (Integer)
- low_stock_threshold (Integer)
- weight (BigDecimal)
- origin (String)
- description (String)
- image_url (String)

### Customers Table
- id (Long, Primary Key)
- first_name (String)
- last_name (String)
- email (String, Unique)
- phone (String)
- address (String)
- city (String)
- state (String)
- zip_code (String)

### Orders Table
- id (Long, Primary Key)
- order_id (String, Unique)
- customer_id (Long, Foreign Key)
- subtotal (BigDecimal)
- shipping_cost (BigDecimal)
- total (BigDecimal)
- order_date (LocalDateTime)
- status (Enum: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)

### Order Items Table
- id (Long, Primary Key)
- order_id (Long, Foreign Key)
- product_id (Long, Foreign Key)
- quantity (Integer)
- price (BigDecimal)

## Key Features Implementation

### Real-time Inventory Tracking
- Stock is decremented immediately when an order is placed
- Products are marked "Out of Stock" when stock reaches 0
- Low stock alerts are shown in the admin dashboard

### Shipping Calculation
- Weight-based calculation:
  - < 1 kg: $5.99
  - 1-5 kg: $12.99
  - 5-10 kg: $19.99
  - > 10 kg: $29.99

### Admin Dashboard
- Grid view of all products with SKU, name, category, price, stock
- Low stock items highlighted in yellow
- Out of stock items highlighted in red
- Statistics showing total products, low stock items, and out of stock items

## Development Notes

- The frontend connects to the backend API
- The backend initializes sample products on first run (when DB is empty)
- CORS is configured to allow frontend-backend communication
- The application uses **Supabase (PostgreSQL)** by default—no local database setup

## Future Enhancements

- User authentication and authorization
- Payment gateway integration
- Email notifications
- Order tracking
- Product reviews and ratings
- Image upload functionality
- Advanced search and filtering
- Inventory replenishment alerts

## License

This project is for educational purposes.
# nepkart
