# NEPKART Sequence Diagrams

## Quick View (Mermaid – renders on GitHub)

### 1. Customer Sign Up

```mermaid
sequenceDiagram
    participant C as Customer
    participant F as Frontend
    participant B as Backend API
    participant DB as Supabase

    C->>F: Fill signup form (name, email, password)
    C->>F: Submit
    F->>F: Validate password (8+ chars, upper, lower, digit, symbol)
    F->>B: POST /api/auth/customer/register
    B->>DB: Check email exists
    alt Email exists
        B-->>F: 409 Email already registered
        F-->>C: Show error
    else Email available
        B->>B: Hash password (BCrypt)
        B->>DB: Save Customer
        DB-->>B: OK
        B-->>F: 201 Success
        F-->>C: Redirect to Login
    end
```

### 2. Customer Login

```mermaid
sequenceDiagram
    participant C as Customer
    participant F as Frontend
    participant B as Backend API
    participant DB as Supabase

    C->>F: Enter email & password
    C->>F: Submit
    F->>B: POST /api/auth/customer/login
    B->>DB: Find customer by email
    DB-->>B: Customer
    alt Invalid or inactive
        B-->>F: 401 Invalid credentials
        F-->>C: Show error
    else Valid
        B->>B: Verify password (BCrypt)
        B->>B: Set session (customerId, email, name)
        B-->>F: 200 Success + customer info
        F->>F: Update AuthContext
        F->>B: GET /api/cart (load saved cart)
        B->>DB: Get cart items
        B-->>F: Cart items
        F-->>C: Redirect to home, show "Welcome, [name]"
    end
```

### 3. Add to Cart (Logged-in Customer)

```mermaid
sequenceDiagram
    participant C as Customer
    participant F as Frontend
    participant B as Backend API
    participant DB as Supabase

    C->>F: Click "Add to Cart"
    F->>F: Update local cart state
    F->>B: POST /api/cart (sync quantities)
    Note over F,B: credentials: include (session cookie)
    B->>B: Get customerId from session
    B->>DB: Upsert CartItem records
    DB-->>B: OK
    B->>B: GET cart
    B-->>F: Updated cart items
    F-->>C: Show updated cart badge
```

### 4. Checkout / Place Order

```mermaid
sequenceDiagram
    participant C as Customer
    participant F as Frontend
    participant B as Backend API
    participant DB as Supabase

    C->>F: Fill shipping details
    C->>F: Click "Place Order"
    F->>B: POST /api/shipping/calculate
    B-->>F: Shipping cost
    F->>B: GET /api/tax/rate
    B-->>F: Tax rate
    F->>B: POST /api/orders
    Note over F,B: customer, productQuantities
    B->>DB: Find or create Customer
    B->>DB: Create Order + OrderItems
    B->>DB: Decrement product stock
    DB-->>B: OK
    B-->>F: Order created
    F->>F: Clear cart
    F-->>C: Show order confirmation
```

### 5. Admin Login

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant B as Backend API

    A->>F: Enter username & password
    A->>F: Submit
    F->>B: POST /api/auth/admin/login
    B->>B: Verify credentials (admin/nepkart2026)
    alt Invalid
        B-->>F: 401 Invalid credentials
        F-->>A: Show error
    else Valid
        B->>B: Set session (admin=true)
        B-->>F: 200 Success
        F->>F: Update AuthContext
        F-->>A: Redirect to /admin
    end
```

### 6. Admin Update Product

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant B as Backend API
    participant DB as Supabase

    A->>F: Edit product (stock, price, etc.)
    A->>F: Click Save
    F->>B: PUT /api/products/{id}
    Note over F,B: Session cookie (admin)
    B->>B: Verify admin session
    B->>DB: Update Product
    DB-->>B: OK
    B-->>F: Updated product
    F->>F: Reload products list
    F-->>A: Show updated data
```

### 7. Forgot Password / Reset Password

```mermaid
sequenceDiagram
    participant C as Customer
    participant F as Frontend
    participant B as Backend API
    participant DB as Supabase

    Note over C,F: Step 1: Request reset
    C->>F: Enter email on Forgot Password
    F->>B: POST /api/auth/customer/forgot-password
    B->>DB: Find customer by email
    B->>DB: Create PasswordResetToken (1hr expiry)
    B-->>F: 200 + token (dev: in response; prod: email)
    F-->>C: Redirect to Reset Password with token

    Note over C,F: Step 2: Reset with new password
    C->>F: Enter token, new password
    F->>B: POST /api/auth/customer/reset-password
    B->>DB: Validate token, find customer
    B->>B: Hash new password
    B->>DB: Update customer passwordHash
    B->>DB: Mark token used
    B-->>F: 200 Success
    F-->>C: Redirect to Login
```

---

## PlantUML Diagrams (for detailed view)

### Customer Sign Up

```
@startuml Customer-SignUp
actor Customer
participant "Frontend" as F
participant "Backend API" as B
database "Supabase" as DB

Customer -> F: Fill signup form
Customer -> F: Submit
F -> F: Validate password
F -> B: POST /auth/customer/register
B -> DB: findByEmail
alt Email exists
    B --> F: 409 Conflict
    F --> Customer: Show error
else OK
    B -> B: Hash password
    B -> DB: save(customer)
    B --> F: 201 Created
    F --> Customer: Redirect to Login
end
@enduml
```

### Customer Login

```
@startuml Customer-Login
actor Customer
participant "Frontend" as F
participant "Backend API" as B
database "Supabase" as DB

Customer -> F: Enter email & password
F -> B: POST /auth/customer/login
B -> DB: findByEmail
B -> B: verify password
B -> B: set session
B --> F: 200 + customer
F -> B: GET /cart
B -> DB: get cart
B --> F: cart items
F --> Customer: Welcome, [name]
@enduml
```

### Add to Cart

```
@startuml Add-To-Cart
actor Customer
participant "Frontend" as F
participant "Backend API" as B
database "Supabase" as DB

Customer -> F: Add to Cart
F -> F: Update local state
F -> B: POST /cart (sync)
B -> B: get customerId from session
B -> DB: sync CartItems
B --> F: cart
F --> Customer: Update badge
@enduml
```

### Checkout

```
@startuml Checkout
actor Customer
participant "Frontend" as F
participant "Backend API" as B
database "Supabase" as DB

Customer -> F: Place Order
F -> B: POST /shipping/calculate
B --> F: shipping cost
F -> B: POST /orders
B -> DB: create Order, OrderItems
B -> DB: decrement stock
B --> F: order
F -> F: clear cart
F --> Customer: Confirmation
@enduml
```

---

## How to View

1. **GitHub:** The Mermaid diagrams above render automatically in this file.
2. **PlantUML:** Copy the code blocks to [plantuml.com/plantuml](https://www.plantuml.com/plantuml/uml/) or use the `.puml` files in `docs/`.
3. **VS Code:** Install the PlantUML extension for preview.
