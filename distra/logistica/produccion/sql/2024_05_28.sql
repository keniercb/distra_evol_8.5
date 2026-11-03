ALTER TABLE mod_logproduccion.dat_ordenproductosust
  ADD COLUMN idactividad NUMERIC(19,0);


-----
ALTER TABLE mod_logproduccion.dat_ordenproductosust
  ALTER COLUMN norma TYPE NUMERIC(19,6);