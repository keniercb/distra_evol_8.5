ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  DROP CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina RESTRICT;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina CHECK (((vacacionesdiasimporte = (0)::numeric) OR (vacacionesdiasimporte = (1)::numeric)) OR (vacacionesdiasimporte = (2)::numeric));

COMMENT ON CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina ON mod_nomina.conf_estructuramodelosnomina
IS 'Restricción sobre la(s) columna(s) "vacacionesdiasimporte".';

