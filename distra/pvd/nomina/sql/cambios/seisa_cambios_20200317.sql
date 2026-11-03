ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  DROP CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina RESTRICT;

ALTER TABLE mod_nomina.dat_cargosocupados
  DROP CONSTRAINT fk_filaestruc_cargosocupados_idfila RESTRICT;

ALTER TABLE mod_nomina.nom_areascargos
  DROP CONSTRAINT pk_areascargos RESTRICT;

ALTER TABLE mod_nomina.conf_camposreportecorreo
  ADD COLUMN estotal NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ADD COLUMN cargoprincipal NUMERIC(1,0) DEFAULT 1;

COMMENT ON COLUMN mod_nomina.conf_tiporeportescertificaciones.cargoprincipal
IS 'Columna para definir si se va a gestionar las personas solo por el cargo principal o por el cargo principal y ademas el  cargo pluriempleado';

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN sumapluriempleo NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.nom_areascargos
  ALTER COLUMN idcargo SET NOT NULL;

ALTER TABLE mod_nomina.dat_elementosreportescertificaciones
  ADD COLUMN idcargo NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT pk_idarea_cargo 
    PRIMARY KEY (idarea, idcargo) NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_cargosocupados
  ADD CONSTRAINT fk_filaestruc_cargosocupados_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_cargospagoporresultado
  ADD CONSTRAINT fk_idarea_idcargo FOREIGN KEY (idarea, idcargo)
    REFERENCES mod_nomina.nom_areascargos(idarea, idcargo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina CHECK (((vacacionesdiasimporte = (0)::numeric) OR (vacacionesdiasimporte = (1)::numeric)) OR (vacacionesdiasimporte = (2)::numeric));

COMMENT ON CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina ON mod_nomina.conf_estructuramodelosnomina
IS 'Restricción sobre la(s) columna(s) "vacacionesdiasimporte".';

