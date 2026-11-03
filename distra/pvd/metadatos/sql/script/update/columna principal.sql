-- Column: principal

-- ALTER TABLE mod_estructuracomp.dat_cargo DROP COLUMN principal;

ALTER TABLE mod_estructuracomp.dat_cargo ADD COLUMN principal numeric(1,0);
ALTER TABLE mod_estructuracomp.dat_cargo ALTER COLUMN principal SET DEFAULT 0;
COMMENT ON COLUMN mod_estructuracomp.dat_cargo.principal IS 'Estado del cargo, permite conocer si es principal o no.';