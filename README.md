# InventoryPulse

> **Note:** This README was generated with assistance from AI tools (Claude Code) to provide comprehensive documentation for academic purposes. The codebase itself represents original student work for a university software development project.

<div align="center">

**A full-stack inventory management system for real-time stock tracking and analytics**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Backend](#backend)
  - [Backend Architecture](#backend-architecture)
  - [Database Schema](#database-schema)
  - [API Endpoints](#api-endpoints)
  - [Security Implementation](#security-implementation)
  - [Backend Setup](#backend-setup)
- [Frontend](#frontend)
  - [Frontend Architecture](#frontend-architecture)
  - [Component Structure](#component-structure)
  - [Frontend Setup](#frontend-setup)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)


---

## Overview

**InventoryPulse** is a modern, full-stack inventory management system designed for small to medium-sized businesses. It provides real-time stock tracking, transaction history, low-stock alerts, and bulk CSV import capabilities through a clean, responsive web interface.

### What is InventoryPulse?

InventoryPulse solves the problem of manual inventory tracking by providing:

- **Real-time inventory monitoring** - Track stock levels across all products instantly
- **Automated alerts** - Get notified when products reach reorder thresholds
- **Complete audit trail** - Every stock change is logged with timestamp, actor, and reason
- **Bulk operations** - Import hundreds of products via CSV files
- **Role-based access control** - Secure permissions for ADMIN, MANAGER, and VIEWER roles
- **Visual analytics** - Charts and graphs showing stock trends over time
- **RESTful API** - Backend exposes clean APIs for frontend or third-party integrations

### Use Cases

- **Warehouse Management**: Track inventory across multiple warehouses
- **Retail Operations**: Monitor in-store and online stock levels
- **E-commerce**: Integrate with online stores for real-time stock updates
- **Supply Chain**: Track product movement from suppliers to customers
- **Manufacturing**: Monitor raw materials and finished goods inventory

---

## System Architecture

InventoryPulse follows a modern **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  React 19 + TypeScript + Tailwind CSS + Vite              │
│  (Single Page Application - SPA)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/REST + JWT
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                         Backend                             │
│  Spring Boot 3.5 + Spring Security + Spring Data JPA      │
│  (RESTful API Server)                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ JDBC
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                        Database                             │
│  PostgreSQL 16+ (Relational Database)                      │
│  Flyway Migrations for Schema Management                   │
└─────────────────────────────────────────────────────────────┘
```

### Communication Flow

1. **User Interaction** → React frontend (browser)
2. **API Requests** → HTTP REST calls with JWT authentication
3. **Backend Processing** → Spring Boot validates, processes business logic
4. **Data Persistence** → JPA/Hibernate communicates with PostgreSQL
5. **Response** → JSON data flows back to frontend for rendering

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17 | Programming language |
| **Spring Boot** | 3.5.7 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring Data JPA** | 3.x | Database ORM & repository layer |
| **Spring Validation** | 3.x | Request validation |
| **PostgreSQL** | 16+ | Relational database |
| **Flyway** | 11.7.2 | Database migration tool |
| **JWT (JJWT)** | 0.11.5 | JSON Web Token implementation |
| **Lombok** | Latest | Reduce boilerplate code |
| **Maven** | 3.9+ | Build & dependency management |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | UI library |
| **TypeScript** | 5.9 | Type-safe JavaScript |
| **Vite** | 7.2 | Build tool & dev server |
| **React Router** | 6.30 | Client-side routing |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Recharts** | 3.5 | Data visualization library |
| **ESLint** | 9.x | Code linting |
| **PostCSS** | 8.5 | CSS processing |

### Database

- **PostgreSQL 16+**: Production-grade relational database
- **Flyway Migrations**: Version-controlled schema management
- **Connection Pooling**: Efficient database connection management

---

## Features

### Core Functionality

✅ **Authentication & Authorization**
- Secure JWT-based authentication
- User registration and login
- Role-based access control (RBAC)
- Protected API endpoints

✅ **Product Management**
- CRUD operations for products
- Search and filter products
- Unique SKU enforcement
- Bulk CSV import

✅ **Inventory Tracking**
- Real-time stock level monitoring
- Stock adjustment with transaction logging
- Prevent negative stock values
- Low stock alerts

✅ **Transaction History**
- Complete audit trail for all stock changes
- Track actor, reason, timestamp, and delta
- Resulting stock calculation
- Transaction history visualization

✅ **Data Import/Export**
- CSV import for bulk product creation
- Import result summary (total, imported, skipped)
- Duplicate SKU detection

✅ **Visual Analytics**
- Stock history line charts
- Low stock indicators
- Dashboard statistics

---

## Backend

### Backend Architecture

The backend follows **layered architecture** with clear separation of concerns:

```
src/main/java/com/inventorypulse/inventorypulse_backend/
├── InventoryPulseApplication.java    # Main application entry point
│
├── auth/                             # Authentication & JWT
│   ├── controller/
│   │   ├── AuthController.java       # Login/register endpoints
│   │   └── MeController.java         # Current user endpoint
│   ├── dtos/
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   └── RegisterRequest.java
│   ├── JwtAuthenticationFilter.java  # JWT token validation filter
│   ├── JwtTokenProvider.java         # JWT creation & parsing
│   └── UserDetailsServiceImpl.java   # Load user for authentication
│
├── config/                           # Configuration classes
│   ├── SecurityConfig.java           # Spring Security configuration
│   ├── CorsConfig.java              # CORS settings
│   └── TestUserSeeder.java          # Seed test users
│
├── controller/                       # REST API controllers
│   ├── ProductController.java        # Product endpoints
│   └── InventoryTransactionController.java  # Transaction endpoints
│
├── dto/                             # Data Transfer Objects
│   ├── product/
│   │   ├── CreateProductRequest.java
│   │   ├── UpdateProductRequest.java
│   │   ├── ProductResponse.java
│   │   └── ProductImportResult.java
│   ├── inventory/
│   │   ├── InventoryTransactionRequest.java
│   │   └── InventoryTransactionResponse.java
│   └── exception/
│       └── ApiErrorResponse.java
│
├── model/                           # JPA Entity classes
│   ├── User.java                    # User entity
│   ├── Product.java                 # Product entity
│   ├── InventoryTransaction.java    # Transaction entity
│   ├── Alert.java                   # Alert entity
│   ├── ImportBatch.java             # Import tracking entity
│   └── PurchaseOrder.java           # Purchase order entity
│
├── repository/                      # Spring Data JPA repositories
│   ├── UserRepository.java
│   ├── ProductRepository.java
│   ├── InventoryTransactionsRepository.java
│   ├── AlertRepository.java
│   ├── ImportBatchRepository.java
│   └── PurchaseOrderRepository.java
│
├── service/                         # Business logic layer
│   ├── ProductService.java          # Product business logic
│   └── InventoryTransactionService.java  # Transaction logic
│
└── exception/                       # Exception handling
    └── GlobalExceptionHandler.java  # Centralized error handling
```

### Design Patterns Used

1. **Layered Architecture**: Controller → Service → Repository → Database
2. **DTO Pattern**: Separate request/response objects from entities
3. **Repository Pattern**: Spring Data JPA repositories for data access
4. **Dependency Injection**: Constructor injection for loose coupling
5. **Builder Pattern**: Lombok builders for entity creation
6. **Filter Chain Pattern**: JWT authentication filter

### Database Schema

The PostgreSQL database consists of the following main tables:

**`users`**
- Stores user accounts with hashed passwords
- Fields: id, email, username, password_hash, role, created_at

**`products`**
- Core product information
- Fields: id, sku (unique), title, description, brand, category, image_url, stock, reorder_threshold

**`inventory_transactions`**
- Audit log of all stock changes
- Fields: id, product_id, delta, reason, external_reference, actor, created_at, resulting_stock

**`alerts`**
- System-generated alerts (low stock, etc.)
- Fields: id, product_id, type, message, created_at, acknowledged

**`import_batches`**
- Track CSV import operations
- Fields: id, filename, uploaded_by, uploaded_at, total_rows, imported, skipped

**`purchase_orders`** *(future use)*
- Purchase order tracking
- Fields: id, supplier, order_date, status, etc.

### Entity Relationships

```
User (1) ──────< (many) InventoryTransaction
                        │
Product (1) ─────< (many) InventoryTransaction
        │
        └────< (many) Alert
```

### API Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/auth/me` | Get current user info | Yes |

#### Products

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/products` | List all products | Yes | Any |
| GET | `/api/products/search?q=keyword` | Search products | Yes | Any |
| GET | `/api/products/low-stock` | Get low stock products | Yes | Any |
| GET | `/api/products/{id}` | Get single product | Yes | Any |
| POST | `/api/products` | Create new product | Yes | ADMIN/MANAGER |
| PUT | `/api/products/{id}` | Update product | Yes | ADMIN/MANAGER |
| DELETE | `/api/products/{id}` | Delete product | Yes | ADMIN |
| POST | `/api/products/import` | Import CSV | Yes | ADMIN/MANAGER |

#### Inventory Transactions

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/products/{id}/transactions` | Get transaction history | Yes | Any |
| POST | `/api/products/{id}/transactions` | Create stock adjustment | Yes | ADMIN/MANAGER |

### Request/Response Examples

**POST `/api/auth/login`**

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresInMillis": 86400000
}
```

**POST `/api/products/{id}/transactions`**

Request:
```json
{
  "delta": -10,
  "reason": "Customer order #1234",
  "externalReference": "ORDER-1234"
}
```

Response:
```json
{
  "id": 42,
  "productId": 5,
  "delta": -10,
  "reason": "Customer order #1234",
  "externalReference": "ORDER-1234",
  "actor": "user@example.com",
  "createdAt": "2025-12-04T15:30:00Z",
  "resultingStock": 90
}
```

### Security Implementation

**JWT (JSON Web Token) Authentication**

1. User submits credentials to `/api/auth/login`
2. Backend validates credentials against database
3. If valid, generate signed JWT token with user claims
4. Frontend stores token (localStorage)
5. All subsequent requests include token in `Authorization: Bearer <token>` header
6. `JwtAuthenticationFilter` validates token on every request
7. Token contains: user ID, email, role, expiration

**Password Security**
- Passwords hashed using BCrypt (Spring Security default)
- Salted hashing prevents rainbow table attacks
- Never store plain-text passwords

**Authorization**
- Method-level security with `@PreAuthorize` annotations
- Role-based access control (ADMIN, MANAGER, VIEWER)
- Protected endpoints return 403 Forbidden for insufficient permissions

**CORS Configuration**
- Configured to allow frontend origin (http://localhost:5173)
- Credentials allowed for cookie-based sessions (if needed)
- Specific HTTP methods whitelisted

### Backend Setup

#### Prerequisites

- **Java 17** or higher 
- **Maven 3.9+** (or use included Maven wrapper)
- **PostgreSQL 16+** installed and running
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code with Java extensions

#### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd InvPulse/inventorypulse-backend
   ```

2. **Configure database**

   Create a PostgreSQL database:

   ```sql
   CREATE DATABASE inventorypulse;
   CREATE USER invpulse_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE inventorypulse TO invpulse_user;
   ```

3. **Configure environment variables**

   Create `secrets.properties` file or set environment variables:

   ```bash
   export DB_URL=jdbc:postgresql://localhost:5432/inventorypulse
   export DB_USER=invpulse_user
   export DB_PASSWORD=your_password
   export DB_SCHEMA=public
   export JWT_SECRET=your-256-bit-secret-key-here
   ```

4. **Configure application.properties**

   Edit `src/main/resources/application.properties`:

   ```properties
   spring.datasource.url=${DB_URL}
   spring.datasource.username=${DB_USER}
   spring.datasource.password=${DB_PASSWORD}
   spring.jpa.hibernate.ddl-auto=validate
   spring.flyway.enabled=true
   jwt.secret=${JWT_SECRET}
   jwt.expiration=86400000
   ```

5. **Run Flyway migrations**

   ```bash
   mvn flyway:migrate
   ```

6. **Build the application**

   ```bash
   mvn clean install
   ```

7. **Run the backend**

   ```bash
   mvn spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

#### Available Maven Commands

| Command | Description |
|---------|-------------|
| `mvn spring-boot:run` | Run application in development mode |
| `mvn clean install` | Build and run tests |
| `mvn test` | Run unit tests |
| `mvn flyway:migrate` | Run database migrations |
| `mvn flyway:info` | Check migration status |
| `mvn package` | Create JAR file |

---

## Frontend

### Frontend Architecture

The frontend is a **Single Page Application (SPA)** built with React and follows a component-based architecture.

```
frontend/
├── public/                         # Static assets
├── src/
│   ├── assets/                     # Images, icons, SVGs
│   │   └── react.svg
│   │
│   ├── auth/                       # Authentication logic
│   │   ├── AuthContext.tsx         # Global auth state
│   │   └── ProtectedRoute.tsx      # Route guard component
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── ImportCsvModal.tsx      # CSV upload modal
│   │   ├── ProductStockChart.tsx   # Recharts line chart
│   │   └── ProductTable.tsx        # Product list table
│   │
│   ├── lib/                        # Utilities
│   │   └── api.ts                  # API client + types
│   │
│   ├── pages/                      # Route components
│   │   ├── LoginPage.tsx           # /login
│   │   ├── RegisterPage.tsx        # /register
│   │   ├── ProductsPage.tsx        # /products
│   │   └── ProductDetailPage.tsx   # /products/:id
│   │
│   ├── App.tsx                     # Root + routing
│   ├── App.css                     # Component styles
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global + Tailwind
│
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tailwind.config.cjs             # Tailwind setup
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── .env                            # Environment variables
```

### Component Structure

**Container Components** (`src/pages/`)
- Manage state and data fetching
- Handle business logic
- Pass data to presentational components

**Presentational Components** (`src/components/`)
- Receive data via props
- Focus on UI rendering
- Minimal internal state

**Shared Utilities** (`src/lib/`)
- API client with fetch wrapper
- Type definitions matching backend DTOs
- Helper functions

### State Management

- **React Context API** for global authentication state
- **Local component state** (useState) for UI interactions
- **No Redux/Zustand** - keeps bundle size small

### Routing Structure

```
/                          → Redirect to /products
/login                     → Public - Login page
/register                  → Public - Registration page
/products                  → Protected - Product list dashboard
/products/:id              → Protected - Product detail + transactions
```

### Frontend Setup

#### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 9+** (comes with Node.js)

#### Installation Steps

1. **Navigate to frontend directory**

   ```bash
   cd InvPulse/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   echo "VITE_API_BASE_URL=http://localhost:8080" > .env
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   Frontend will start on `http://localhost:5173`

#### Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production (output: dist/) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## Getting Started

### Prerequisites

Ensure you have all the following installed:

- ✅ **Java 17+** - Backend runtime
- ✅ **Maven 3.9+** - Build tool (or use Maven wrapper)
- ✅ **Node.js 18+** - Frontend runtime
- ✅ **npm 9+** - Package manager
- ✅ **PostgreSQL 16+** - Database server
- ✅ **Git** - Version control
