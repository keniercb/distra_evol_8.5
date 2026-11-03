ALTER TABLE mod_estructuracomp.dat_estructura ADD COLUMN alias character varying(500);

COMMENT ON COLUMN mod_estructuracomp.dat_estructura.alias IS 'Alias de la estructura.';