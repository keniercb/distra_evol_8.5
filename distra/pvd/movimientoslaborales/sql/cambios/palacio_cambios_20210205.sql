ALTER TABLE mod_fuerzatrabajo.dat_disponible
    ADD COLUMN fdeclaracion date NOT NULL DEFAULT now();

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fdeclaracion
    IS 'Fecha en que el trabajador es declarado disponible.';