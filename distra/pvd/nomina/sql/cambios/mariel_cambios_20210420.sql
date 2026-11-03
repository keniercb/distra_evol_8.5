CREATE SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 147
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_asociacioncuentascontables".';

CREATE TABLE mod_nomina.conf_asociacioncuentascontables (
  idasociacioncuentascont NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_asociacioncuentascontables_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idtiponomina NUMERIC(19,0) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  cuentasdeudoras VARCHAR(255) NOT NULL,
  cuentasacreedoras TEXT,
  CONSTRAINT pk_idasociacioncuentascont PRIMARY KEY(idasociacioncuentascont)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.conf_asociacioncuentascontables
IS 'Almacena las asociaciones de las cuentas contables.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.idasociacioncuentascont
IS 'Identificador de la tupla.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.identidad
IS ' Identificador de la entidad.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.idtiponomina
IS ' Identificador del tipo de nomina.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.cuentasdeudoras
IS 'Identificador de la cuenta deudora.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.cuentasacreedoras
IS 'Identificadores de los las cuentas acreedoras.';

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
  ADD COLUMN registrotiponominamanual NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT fk_filaestruc_areascargos_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT fk_cargo_area_estructura FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_plantillanominalcargo
  ADD CONSTRAINT fk_filaestruc_plantillanominalcarg_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_plantillanominalcargo
  ADD CONSTRAINT fk_cargo_plantilla_estructura FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;