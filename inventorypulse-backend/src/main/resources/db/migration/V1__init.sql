SET search_path = inventorypulse_app;

-- ========== USERS ==========
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'VIEWER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== PRODUCTS ==========
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  category TEXT,
  image_url TEXT,
  stock INT NOT NULL DEFAULT 0,
  reorder_threshold INT NOT NULL DEFAULT 0
);

-- ========== INVENTORY TRANSACTIONS ==========
CREATE TABLE inventory_transactions (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  delta INT NOT NULL,
  reason TEXT,
  external_reference TEXT,
  actor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (external_reference)
);

-- ========== IMPORT BATCHES ==========
CREATE TABLE import_batches (
  id BIGSERIAL PRIMARY KEY,
  file_name TEXT,
  file_hash TEXT UNIQUE,
  uploader_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== PURCHASE ORDERS ==========
CREATE TABLE purchase_orders (
  id BIGSERIAL PRIMARY KEY,
  supplier_id BIGINT,
  status TEXT CHECK (status IN ('PENDING', 'RECEIVED', 'CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== ALERTS ==========
CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  seen BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
