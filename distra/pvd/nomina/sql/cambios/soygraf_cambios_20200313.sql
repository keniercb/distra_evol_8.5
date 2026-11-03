/*
--idarea:32 idcargo:200532586 idareacargos:1780  / 1783
SELECT idarea, idcargo FROM mod_nomina.nom_areascargos group by idarea, idcargo
  having count (idarea||'-'||idcargo) > 1;
*/

--Ejecutar para poder limpiar los datos que no reportaran información fiel, debido a la pérdida de datos físicos y de restricciones nuevas en el negocio.
--Operaciones aprobadas por el desarrollador principal del módulo.
--<DELETE>
DELETE FROM mod_nomina.nom_areascargos WHERE idareacargos=1780;
DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idarea not in (SELECT idarea FROM mod_nomina.nom_areascargos);
DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idcargo in (200531588,200531602,200532115);
DELETE FROM mod_nomina.nom_areascargos WHERE idcargo in (200531588,200531602,200532115);
DELETE FROM mod_nomina.dat_cargosocupados WHERE idcargo in (200531602,200532572);
DELETE FROM mod_nomina.conf_plantillanominalcargo WHERE idcargo in (200531588,200531755,200531993);
--</DELETE>

ALTER TABLE mod_nomina.nom_areascargos
  DROP CONSTRAINT pk_areascargos RESTRICT;

ALTER TABLE mod_nomina.conf_camposreportecorreo
  ADD COLUMN estotal NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ADD COLUMN cargoprincipal NUMERIC(1,0) DEFAULT 1;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN sumapluriempleo NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.nom_areascargos
  ALTER COLUMN idcargo SET NOT NULL;

ALTER TABLE mod_nomina.dat_elementosreportescertificaciones
  ADD COLUMN idcargo NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT pk_idarea_cargo 
    PRIMARY KEY (idarea, idcargo) NOT DEFERRABLE;

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT fk_filaestruc_areascargos_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_descuentosaplicadosporpersona
  ADD CONSTRAINT fk_idpersona_descuentosaplicadosporpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.dat_cargosocupados
  ADD CONSTRAINT fk_filaestruc_cargosocupados_idfila FOREIGN KEY (idcargo)
      REFERENCES mod_estructuracomp.nom_filaestruc (idfila) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE mod_nomina.conf_plantillanominalcargo
  ADD CONSTRAINT fk_filaestruc_plantillanominalcarg_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_cargospagoporresultado
  ADD CONSTRAINT fk_idarea_idcargo FOREIGN KEY (idarea, idcargo)
    REFERENCES mod_nomina.nom_areascargos(idarea, idcargo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE conf_exportacionbanco0colhi (
  idconfexportaciondbfbanco NUMERIC(19,0),
  idbanco NUMERIC(19,0),
  tipocampo VARCHAR(255),
  denomcampo VARCHAR(255),
  tipodato NUMERIC(19,0),
  longitudvalor NUMERIC(19,0),
  tipofichero NUMERIC(19,0),
  lugaresdecimales NUMERIC(19,0),
  orden NUMERIC(19,0),
  idconfexportaciondbfbancoficheroentidad NUMERIC(19,0)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO conf_exportacionbanco0colhi (idconfexportaciondbfbanco, idbanco, tipocampo, denomcampo, tipodato, longitudvalor, tipofichero, lugaresdecimales, orden, idconfexportaciondbfbancoficheroentidad)
SELECT idconfexportaciondbfbanco, idbanco, tipocampo, denomcampo, tipodato, longitudvalor, tipofichero, lugaresdecimales, orden, idconfexportaciondbfbancoficheroentidad FROM mod_nomina.conf_exportacionbanco;

-- Drop the source table

DROP TABLE mod_nomina.conf_exportacionbanco CASCADE;

-- Create the destination table

CREATE TABLE mod_nomina.conf_exportacionbanco (
  idconfexportaciondbfbanco NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_conf_exportacionbanco_seq'::regclass) NOT NULL,
  idbanco NUMERIC(19,0) NOT NULL,
  tipocampo VARCHAR(255) NOT NULL,
  denomcampo VARCHAR(255) NOT NULL,
  tipodato NUMERIC(19,0) NOT NULL,
  longitudvalor NUMERIC(19,0) NOT NULL,
  tipofichero NUMERIC(19,0) NOT NULL,
  lugaresdecimales NUMERIC(19,0) DEFAULT 0 NOT NULL,
  orden NUMERIC(19,0) DEFAULT 1,
  idconfexportaciondbfbancoficheroentidad NUMERIC(19,0) DEFAULT 0,
  CONSTRAINT pk_confexportaciondbfbanco PRIMARY KEY(idconfexportaciondbfbanco)
) 
WITH (oids = false);

-- Copy the temporary table's data to the destination table

INSERT INTO mod_nomina.conf_exportacionbanco (idconfexportaciondbfbanco, idbanco, tipocampo, denomcampo, tipodato, longitudvalor, tipofichero, lugaresdecimales, orden, idconfexportaciondbfbancoficheroentidad)
SELECT idconfexportaciondbfbanco, idbanco, tipocampo, denomcampo, tipodato, longitudvalor, tipofichero, lugaresdecimales, orden, idconfexportaciondbfbancoficheroentidad FROM conf_exportacionbanco0colhi;

-- Restore table's permissions

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_nomina.conf_exportacionbanco TO zeolides;


-- Drop the temporary table

DROP TABLE conf_exportacionbanco0colhi CASCADE;

-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_personaestructuranominacobrosypagos0qhhme (
  idpersonaestructuranominacobrosypagos NUMERIC(19,0),
  idpersona NUMERIC(19,0),
  idestructuramodelodomina NUMERIC(19,0),
  iddocumentoobligacion NUMERIC(19,0),
  idcuenta NUMERIC(19,0),
  estado NUMERIC(1,0),
  importe NUMERIC(5,2)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_personaestructuranominacobrosypagos0qhhme (idpersonaestructuranominacobrosypagos, idpersona, idestructuramodelodomina, iddocumentoobligacion, idcuenta, estado, importe)
SELECT idpersonaestructuranominacobrosypagos, idpersona, idestructuramodelodomina, iddocumentoobligacion, idcuenta, estado, importe FROM mod_nomina.dat_personaestructuranominacobrosypagos;

-- Drop the source table

DROP TABLE mod_nomina.dat_personaestructuranominacobrosypagos CASCADE;

-- Create the destination table

CREATE TABLE mod_nomina.dat_personaestructuranominacobrosypagos (
  idpersonaestructuranominacobrosypagos NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0),
  idestructuramodelodomina NUMERIC(19,0),
  iddocumentoobligacion NUMERIC(19,0),
  idcuenta NUMERIC(19,0),
  estado NUMERIC(1,0),
  importe NUMERIC(5,2),
  CONSTRAINT pk_personaestructuranominacobrosypagos PRIMARY KEY(idpersonaestructuranominacobrosypagos)
) 
WITH (oids = false);

-- Copy the temporary table's data to the destination table

INSERT INTO mod_nomina.dat_personaestructuranominacobrosypagos (idpersonaestructuranominacobrosypagos, idpersona, idestructuramodelodomina, iddocumentoobligacion, idcuenta, estado, importe)
SELECT idpersonaestructuranominacobrosypagos, idpersona, idestructuramodelodomina, iddocumentoobligacion, idcuenta, estado, importe FROM dat_personaestructuranominacobrosypagos0qhhme;

-- Drop the temporary table

DROP TABLE dat_personaestructuranominacobrosypagos0qhhme CASCADE;

