--------------- SQL ---------------

-- object recreation
ALTER TABLE mod_planificacion.dat_controlpermiso
  DROP CONSTRAINT fk_ejercicioplanificacion_controlpermiso RESTRICT;

ALTER TABLE mod_planificacion.dat_controlpermiso
  ADD CONSTRAINT fk_ejercicioplanificacion_controlpermiso FOREIGN KEY (idejercicio)
    REFERENCES mod_planificacion.nom_ejercicioplanificacion(idejercicio)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;
	
--------------- SQL ---------------

-- object recreation
ALTER TABLE mod_planifenergetica.dat_modelo
  DROP CONSTRAINT fk_ejercicioplanificacion_modelo RESTRICT;

ALTER TABLE mod_planifenergetica.dat_modelo
  ADD CONSTRAINT fk_ejercicioplanificacion_modelo FOREIGN KEY (idejercicio)
    REFERENCES mod_planificacion.nom_ejercicioplanificacion(idejercicio)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

	