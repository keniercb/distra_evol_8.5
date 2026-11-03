ALTER TABLE mod_nomina.dat_cargosocupados
ADD COLUMN activa NUMERIC(1,0) NOT NULL DEFAULT 1
CHECK (activa IN (0, 1));