-- Make password_hash column nullable in customers table
ALTER TABLE customers ALTER COLUMN password_hash DROP NOT NULL;
