ALTER TABLE mod_persona.dat_situacionlaboral
  DROP CONSTRAINT chk_estado_situacionlaboral RESTRICT;

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.nromn
IS 'Número que se genera en el movimiento de nómina.';

ALTER TABLE mod_persona.dat_situacionlaboral
  ADD CONSTRAINT chk_estado_situacionlaboral CHECK ((((estado = (0)::numeric) OR (estado = (1)::numeric)) OR (estado = (2)::numeric)) OR (estado = (3)::numeric));

COMMENT ON CONSTRAINT chk_estado_situacionlaboral ON mod_persona.dat_situacionlaboral
IS 'Restricción sobre la(s) columna(s) "estado".';

