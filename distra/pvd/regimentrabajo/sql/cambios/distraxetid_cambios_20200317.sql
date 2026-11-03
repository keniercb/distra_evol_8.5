ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ADD COLUMN idestructura numeric(19,0);
ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ALTER COLUMN idestructura SET NOT NULL;
