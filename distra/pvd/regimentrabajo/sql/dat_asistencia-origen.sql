ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN origen NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.origen
IS '0-Gestionar asistencia
1-Plan de vacaciones';