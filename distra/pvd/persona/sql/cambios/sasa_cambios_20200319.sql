ALTER TABLE mod_persona.dat_situacionlaboral
  DROP CONSTRAINT chk_estado_situacionlaboral RESTRICT;

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.nromn
IS 'Número que se genera en el movimiento de nómina.';

ALTER TABLE mod_persona.dat_situacionlaboral
  ADD CONSTRAINT chk_estado_situacionlaboral CHECK ((((estado = (0)::numeric) OR (estado = (1)::numeric)) OR (estado = (2)::numeric)) OR (estado = (3)::numeric));

COMMENT ON CONSTRAINT chk_estado_situacionlaboral ON mod_persona.dat_situacionlaboral
IS 'Restricción sobre la(s) columna(s) "estado".';

COMMENT ON SCHEMA mod_persona IS 'Actualización: ';
--mod_personaext

ALTER TABLE mod_personaext.dat_estadosalud
  DROP CONSTRAINT chk_estadosalud_estadosalud RESTRICT;

ALTER TABLE mod_personaext.dat_sancion
  DROP CONSTRAINT chk_unidadtiempo_sancion RESTRICT;

ALTER TABLE mod_personaext.nom_sancion
  DROP CONSTRAINT chk_unidadtiempo_sancion RESTRICT;

ALTER TABLE mod_personaext.his_trayectorialaboral
  ALTER COLUMN orgentidad DROP NOT NULL;

ALTER TABLE mod_personaext.his_trayectorialaboral
  ALTER COLUMN cargo DROP NOT NULL;

ALTER TABLE mod_personaext.dat_estadosalud
  ADD CONSTRAINT chk_estadosalud_estadosalud CHECK (((estadosalud = (0)::numeric) OR (estadosalud = (1)::numeric)) OR (estadosalud = (2)::numeric));

COMMENT ON CONSTRAINT chk_estadosalud_estadosalud ON mod_personaext.dat_estadosalud
IS 'Restricción sobre la(s) columna(s) "estadosalud".';

ALTER TABLE mod_personaext.dat_sancion
  ADD CONSTRAINT chk_unidadtiempo_sancion CHECK (((unidadtiempo = (0)::numeric) OR (unidadtiempo = (1)::numeric)) OR (unidadtiempo = (2)::numeric));

COMMENT ON CONSTRAINT chk_unidadtiempo_sancion ON mod_personaext.dat_sancion
IS 'Restricción sobre la(s) columna(s) "unidadtiempo".';

ALTER TABLE mod_personaext.nom_sancion
  ADD CONSTRAINT chk_unidadtiempo_sancion CHECK (((unidadtiempo = (0)::numeric) OR (unidadtiempo = (1)::numeric)) OR (unidadtiempo = (2)::numeric));

COMMENT ON CONSTRAINT chk_unidadtiempo_sancion ON mod_personaext.nom_sancion
IS 'Restricción sobre la(s) columna(s) "unidadtiempo".';

COMMENT ON SCHEMA mod_persona IS 'Actualización: ';