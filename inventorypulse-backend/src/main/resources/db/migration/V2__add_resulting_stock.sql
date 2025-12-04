SET search_path = inventorypulse_app;

ALTER TABLE inventory_transactions
ADD COLUMN resulting_stock INT;