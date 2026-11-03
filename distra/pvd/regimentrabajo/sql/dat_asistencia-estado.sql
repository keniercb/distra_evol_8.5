ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN estado NUMERIC(1,0) DEFAULT 1;

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.estado
IS 'Estado de animo de la persona en el dia
1-  Feliz
2-  Normal
3- Triste';