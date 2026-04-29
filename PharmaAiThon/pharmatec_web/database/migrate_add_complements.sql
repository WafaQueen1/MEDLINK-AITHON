DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_item_type') THEN
    CREATE TYPE stock_item_type AS ENUM ('medicine', 'complement');
  END IF;
END $$;

ALTER TABLE pharmacy_medicines
ADD COLUMN IF NOT EXISTS item_type stock_item_type NOT NULL DEFAULT 'medicine';

ALTER TABLE pharmacy_medicines
ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0;

ALTER TABLE pharmacy_medicines
DROP CONSTRAINT IF EXISTS pharmacy_medicines_discount_percentage_check;

ALTER TABLE pharmacy_medicines
ADD CONSTRAINT pharmacy_medicines_discount_percentage_check
CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
