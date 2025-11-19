# Architecture

## General Tech Stack

Model: Client-Server (frontend + backend communicating via REST APIs)

- Frontend: React (Vite)  
- Styling: Tailwind CSS  
- Backend: Java Spring Boot (REST)  
- Database: PostgreSQL

## Devices

- Web (desktop browser)

## Database Schemas

Tables:
- **Users** (id, email, password_hash, username, role, created_at)
- **Products** (id, sku, title, description, brand, category, image_url, stock, reorder_threshold)
- **InventoryTransactions** (id, product_id, delta, reason, external_reference, actor, created_at)
- **ImportBatches** (id, file_name, file_hash, uploader_id, created_at)
- **PurchaseOrders** (id, supplier_id, status, created_at)
- **Alerts** (id, product_id, type, message, seen, created_at)

## Authentication & Authorization

- JWT-based auth (short-lived access tokens)
- Roles: `ADMIN`, `MANAGER`, `VIEWER`

## Hosting

- Frontend: Vercel (static site)  
- Backend: Cloud container (Render / DigitalOcean / Heroku)  
- Database: Managed Postgres (DigitalOcean, AWS RDS, or similar)

## Architecture Design


![Architecture Design](./.png)



