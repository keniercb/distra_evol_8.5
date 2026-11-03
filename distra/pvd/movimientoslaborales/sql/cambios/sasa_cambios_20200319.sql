COMMENT ON COLUMN mod_fuerzatrabajo.conf_nromn.anno
IS 'Año en que se generó el número del movimiento de nómina.';

ALTER TABLE mod_fuerzatrabajo.conf_nromn
  ALTER COLUMN anno TYPE NUMERIC(19,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fnotificacion
IS 'Fecha en la que se notifica al trabajador que se encuentra disponible.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.idprocesodisponibilidad
IS 'Identificador del proceso de disponibilidad';

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  ADD CONSTRAINT fk_situacionlaboral_disponible_idsituacionlaboralp FOREIGN KEY (idsituacionlaboralp)
    REFERENCES mod_persona.dat_situacionlaboral(idsituacionlaboralp)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  ADD CONSTRAINT fk_motivodisponibilidad_disponible_idmotivodisponibilidad FOREIGN KEY (idmotivodisponibilidad)
    REFERENCES mod_fuerzatrabajo.nom_motivodisponibilidad(idmotivodisponibilidad)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;