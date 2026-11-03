ALTER TABLE mod_estructuracomp.dat_cargo ADD COLUMN alias character varying(500);

COMMENT ON COLUMN mod_estructuracomp.dat_cargo.alias IS 'Alias del cargo civil.';