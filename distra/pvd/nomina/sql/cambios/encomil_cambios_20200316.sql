ALTER TABLE mod_nomina.dat_cargosocupados
  DROP CONSTRAINT fk_filaestruc_cargosocupados_idfila RESTRICT;

ALTER TABLE mod_nomina.nom_areascargos
  DROP CONSTRAINT pk_areascargos RESTRICT;

ALTER SEQUENCE mod_nomina.sec_afiliacionpolitica_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 13
  CACHE 1 NO CYCLE;

ALTER SEQUENCE mod_nomina.sec_conf_exportacionbanco_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1 NO CYCLE;

ALTER SEQUENCE mod_nomina.sec_conf_exportacionbancoficheroentidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 28
  CACHE 1 NO CYCLE;

ALTER SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 1
  CACHE 1 NO CYCLE;

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
      REFERENCES mod_estructuracomp.nom_filaestruc (idfila) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL;
/*
--<DELETE>

--Ejecutar para poder limpiar los datos que no reportaran información fiel, debido a la pérdida de datos físicos y de restricciones nuevas en el negocio.
--Operaciones aprobadas por el desarrollador principal del módulo.

DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idcargo not in (SELECT idcargo FROM mod_nomina.nom_areascargos);
DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idarea not in (SELECT idarea FROM mod_nomina.nom_areascargos);


DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idarea=26 and idcargo= 200531553;
DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idarea=32 and 
idcargo not in (
200531450,
200531525,
200531458,
200531460,
200531459,
200531416,
200531422,
200531463,
200532347

);
DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idarea=34 and 
idcargo not in (
200531470,
200531474,
200531473,
200531475,
200531476,
200531477,
200531480,
200531483,
200531490,
200532322
);

DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idarea=36 and 
idcargo not in (
200531554,
200531557,
200531559,
200531549,
200531560,
200532333,
200531565,
200531566,
200531586,
200531595,
200531573,
200531575,
200531581
);

DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idarea=47 and 
idcargo not in (
200531424,
200531427,
200531428,
200531421,
200531419,
200532360,
200532356
);
DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idarea=48 and
idcargo not in (
200531478,
200531484,
200531488,
200531495,
200531497,
200531500,
200531515,
200531516,
200531506,
200531508,
200531510,
200531527
);
--</DELETE>
*/

ALTER TABLE mod_nomina.conf_cargospagoporresultado
  ADD CONSTRAINT fk_idarea_idcargo FOREIGN KEY (idarea, idcargo)
    REFERENCES mod_nomina.nom_areascargos(idarea, idcargo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;