-- Column: jefebrigada

-- ALTER TABLE mod_estructuracomp.dat_cargo DROP COLUMN jefebrigada;

ALTER TABLE mod_estructuracomp.dat_cargo ADD COLUMN jefebrigada numeric(1,0);
ALTER TABLE mod_estructuracomp.dat_cargo ALTER COLUMN jefebrigada SET DEFAULT 0;
COMMENT ON COLUMN mod_estructuracomp.dat_cargo.jefebrigada IS 'Estado del cargo, permite conocer si es jefe brigada o no.';
