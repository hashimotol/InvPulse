# Requirements

## Inventory Tracking
- Users can log stock movements quickly (fields: SKU, quantity change, reason, note, supplier, order ID). The UI must allow one-click actions for common flows (sale, restock, count).
- Users can upload and edit product catalogs via CSV (columns: `sku`, `title`, `description`, `brand`, `category`, `imageUrl`, `initial_stock`, `reorder_threshold`, etc.). CSV import must support **preview/dry-run**.
- Users can set and edit per-SKU reorder thresholds and lead times.
- Users should be able to see stock status at a glance (stock bar or pill, reorder point, status: OK / Low / Out).
- Users can view historical stock trends (daily, weekly, monthly) for each SKU and for the catalog as a whole.

## Insights & Visualization
- Show inventory data in simple, easy-to-read charts (stock-level timeline, bar chart of top movers, pie by category).
- Call out fastest-selling SKUs, slow movers, and unusual spikes in returns or shrinkage.
- Present insights positively and actionably (e.g., “Top movers — consider restocking” rather than guilt).

## Alerts & Reminders
- Send customizable alerts for low stock, delayed POs, and overdue cycle counts.
- Allow scheduled reminders for routine tasks (cycle count, reconcile, PO follow-up).
- Provide short, actionable tips or reminders to help staff stay consistent (e.g., “Run a quick count for top 10 SKUs today”).




## Tech & Non-functional Requirements
- **Frontend:** React (CRA or Vite) — mobile-friendly for quick counts.  
- **Backend:** Java Spring Boot (REST + services).  
- **Database:** PostgreSQL (ACID).  
- **Migrations:** Flyway.  
- **Dev/Deploy:** Docker Compose for local dev.  
- No secrets in repo — use env vars for DB/JWT/SMTP/webhook secrets.  
- Provide clear error messages and server-side validation (especially during CSV import).




