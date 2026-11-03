ALTER TABLE IF EXISTS mod_loginventario.tmp_impproductorecepcion
  ADD COLUMN IF NOT EXISTS codigobarra VARCHAR(100);