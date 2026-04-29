DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    BEGIN
      ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'patient';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  ELSE
    CREATE TYPE user_role AS ENUM ('doctor', 'pharmacist', 'patient');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS patient_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER NOT NULL CHECK (age > 0),
  sex VARCHAR(20) NOT NULL CHECK (sex IN ('male', 'female', 'Male', 'Female')),
  has_chronic_disease BOOLEAN NOT NULL DEFAULT FALSE,
  chronic_disease_name TEXT,
  chifa_number VARCHAR(80) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
