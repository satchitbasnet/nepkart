# NEPKART Domain Model & Database Documentation

## 1. Main Entities Identified from Use Cases

| Use Case | Entities Involved |
|----------|-------------------|
| Browse & Search Products | Product |
| View Product Details | Product |
| Manage Cart | CartItem, Product, Customer |
| Sign Up | Customer |
| Login / Logout | Customer |
| Forgot / Reset Password | Customer, PasswordResetToken |
| Checkout | Order, OrderItem, Product, Customer |
| Admin Login | (Session – no entity) |
| Manage Inventory | Product |
| View / Update Orders | Order, OrderItem, Product, Customer |
| View / Manage Customers | Customer |

**Core Entities:** Product, Customer, Order, OrderItem, CartItem, PasswordResetToken

---

## 2. Problem Domain (UML Classes)

### Product
- **Purpose:** Represents a sellable item in the catalog
- **Attributes:** id, sku, name, category, price, stock, lowStockThreshold, weight, origin, description, imageUrl
- **Behavior:** isOutOfStock(), isLowStock(), decrementStock()

### Customer
- **Purpose:** Represents a buyer (registered or guest)
- **Attributes:** id, firstName, lastName, email, passwordHash, isActive, createdAt, phone, address, city, state, zipCode
- **Relationships:** Has many Orders, has many CartItems

### Order
- **Purpose:** Represents a purchase transaction
- **Attributes:** id, orderId, subtotal, shippingCost, tax, total, orderDate, status
- **Relationships:** Belongs to Customer, has many OrderItems

### OrderItem
- **Purpose:** Line item in an order (product + quantity + price snapshot)
- **Attributes:** id, quantity, price
- **Relationships:** Belongs to Order, references Product

### CartItem
- **Purpose:** Product in a customer's shopping cart
- **Attributes:** id, quantity
- **Relationships:** Belongs to Customer, references Product

### PasswordResetToken
- **Purpose:** One-time token for password reset
- **Attributes:** id, token, expiresAt, used
- **Relationships:** Belongs to Customer

---

## 3. Domain – Database Mapping (ERD)

| Domain Class | Table (PK) | Selected Columns | Relationships/FKs | Notes |
|--------------|------------|-------------------|-------------------|-------|
| Product | products (id) | id, sku, name, category, price, stock, low_stock_threshold, weight, origin, description, image_url | — | sku unique; root entity |
| Customer | customers (id) | id, first_name, last_name, email, password_hash, is_active, created_at, phone, address, city, state, zip_code | — | email unique; password_hash null for guests |
| Order | orders (id) | id, order_id, customer_id, subtotal, shipping_cost, tax, total, order_date, status | customer_id → customers(id) | order_id unique; status enum (RECEIVED, IN_PROGRESS, SHIPPED) |
| OrderItem | order_items (id) | id, order_id, product_id, quantity, price | order_id → orders(id), product_id → products(id) | price snapshot at order time; cascade delete with Order |
| CartItem | cart_items (id) | id, customer_id, product_id, quantity | customer_id → customers(id), product_id → products(id) | One cart item per customer+product |
| PasswordResetToken | password_reset_tokens (id) | id, customer_id, token, expires_at, used | customer_id → customers(id) | token unique; one-time use |

**Column naming:** Domain uses camelCase; database uses snake_case (e.g., `lowStockThreshold` → `low_stock_threshold`).

---

## 4. Use Case – Data Operations Mapping

| Use Case | Service Method | Repos Used | Data Actions |
|----------|----------------|------------|--------------|
| Browse & Search Products | `ProductService.getAllProducts()`, `getProductsByCategory()`, `searchProducts()` | ProductRepository | Read Product |
| View Product Details | `ProductService.getProductById()` | ProductRepository | Read Product |
| Manage Cart (Get) | `CartService.getCart()` | CartItemRepository | Read CartItem |
| Manage Cart (Sync) | `CartService.syncCart()` | CartItemRepository, CustomerRepository, ProductRepository | Create/Update CartItem, Read Customer, Read Product |
| Manage Cart (Clear) | `CartService.clearCart()` | CartItemRepository | Delete CartItem |
| Sign Up | `CustomerAuthService.register()` | CustomerRepository | Create Customer |
| Login | `CustomerAuthService.authenticate()` | CustomerRepository | Read Customer |
| Logout | (Session invalidate – no service) | — | — |
| Forgot Password | `CustomerAuthService.requestPasswordReset()` | CustomerRepository, PasswordResetTokenRepository | Read Customer, Create PasswordResetToken |
| Reset Password | `CustomerAuthService.resetPassword()` | CustomerRepository, PasswordResetTokenRepository | Read Customer, Read PasswordResetToken, Update Customer, Update PasswordResetToken |
| Checkout | `OrderService.createOrder()` | OrderRepository, CustomerRepository, ProductRepository, ProductService | Create Order (cascade OrderItem), Read/Create Customer, Read Product, Update Product (decrement stock) |
| Admin Login | `AuthService.authenticate()` | — | (Session only, no DB) |
| Manage Inventory (List) | `ProductService.getAllProducts()`, `getLowStockProducts()`, `getOutOfStockProducts()` | ProductRepository | Read Product |
| Manage Inventory (CRUD) | `ProductService.createProduct()`, `updateProduct()`, `deleteProduct()` | ProductRepository | Create/Read/Update/Delete Product |
| View / Update Orders | `OrderService.getAllOrders()`, `getOrderById()`, `getOrderByOrderId()`, `updateOrderStatus()`, `deleteOrder()` | OrderRepository | Read Order, Update Order (status), Delete Order |
| View / Manage Customers | `CustomerController.listCustomers()`, `setActive()` | CustomerRepository | Read Customer, Update Customer (isActive) |

---

## 5. Diagram Files

- **UML Class Diagram:** `docs/class-diagram.puml`
- **Database ERD:** `docs/database-erd.puml`
- **Use Case – Data Operations Mapping:** `docs/data-operations-mapping.puml`

See the PlantUML files for visual diagrams. Export at [plantuml.com](https://www.plantuml.com/plantuml/uml/).
