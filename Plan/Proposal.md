# InventoryPulse

**Names:** Louis Erik Hashimoto  
**Date:** 05/11/25


## Goal + Idea

- **Idea:** A inventory & supplier portal for small businesses that makes stock tracking simple, auditable, and actionable.  
- **Goal:** Help merchants avoid stockouts and overstock by providing a single source of truth for SKUs, fast imports, simple adjustments, and automated low-stock alerts.
- **How:**
  - Fast CSV / Shopify import and upsert by SKU
  - Per-SKU audit trail (every change = transaction)
  - Automated low-stock detection (thresholds or demand × lead-time)
  - Quick Sell / Restock UI and CSV export for accounting



## Core Features

- Product catalog import (CSV) with upsert by SKU
- Real-time stock adjustments (sales, restocks, manual) with audit transactions
- Product list + detail pages with current stock and transaction history
- Low-stock alerts based on configurable thresholds or computed reorder points


## Additional Features

- Import preview / dry-run and import batch metadata (undo support)
- Auto-create Purchase Orders for auto-reorder SKUs (email / webhook)
- Simple dashboard: SKUs, low-stock count, recent activity
- Integrations: Shopify / POS connector, Slack / webhook alerts



## Technology

- **Frontend:** React (CRA or Vite)
- **Backend:** Java Spring Boot (REST + services)
- **Database:** PostgreSQL (ACID + auditability)
- **Migrations:** Flyway
- **Auth:** JWT (short-lived)
- **Dev / Deploy:** Docker Compose



## Users

- Small retail merchants and Shopify sellers
- Store managers and inventory clerks
- Local wholesalers needing simple PO workflows



## Investors

- Retail-tech and fintech VCs (seed stage)
- Angel investors focused on SMB tooling
- Strategic partners: POS providers, Shopify apps marketplace, banks / payment processors

