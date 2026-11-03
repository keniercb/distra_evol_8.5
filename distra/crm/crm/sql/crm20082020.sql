CREATE SEQUENCE mod_crmadministracion.sec_confproforma_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 7
  CACHE 1;
ALTER TABLE mod_crmadministracion.sec_confproforma_seq
  OWNER TO zeolides;


CREATE TABLE mod_crmadministracion.conf_proforma
(
  idconfproforma numeric(1,0) NOT NULL DEFAULT nextval('mod_crmadministracion.sec_confproforma_seq'::regclass), -- Identificador de la solicitud de negocio
  idespaciotrabajo character varying(255), -- Identificador del espacio de trabajo
  espaciotrabajo character varying(255), -- Denominación del espacio de trabajo.
  activo numeric(1,0), -- 1 si esta activo o no el gestor documental
  CONSTRAINT pk_confproforma PRIMARY KEY (idconfproforma)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_crmadministracion.conf_proforma
  OWNER TO zeolides;
COMMENT ON COLUMN mod_crmadministracion.conf_proforma.idconfproforma IS 'Identificador de la solicitud de negocio';
COMMENT ON COLUMN mod_crmadministracion.conf_proforma.idespaciotrabajo IS 'Identificador del espacio de trabajo';
COMMENT ON COLUMN mod_crmadministracion.conf_proforma.espaciotrabajo IS 'Denominación del espacio de trabajo.';
COMMENT ON COLUMN mod_crmadministracion.conf_proforma.activo IS '1 si esta activo o no el gestor documental';




CREATE SEQUENCE mod_crmcontratacion.sec_tipocontratoentidad_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE mod_crmcontratacion.sec_tipocontratoentidad_seq
  OWNER TO zeolides;






CREATE TABLE mod_crmcontratacion.dat_tipocontratoentidad
(
  idtipocontratoentidad numeric(19,0) NOT NULL DEFAULT nextval('mod_crmcontratacion.sec_tipocontratoentidad_seq'::regclass), -- Identidficador de la tabla dat_tipocontratoentidad.
  idtipocontrato numeric(19,0), -- Identificador de cliente-proveedor.
  idestructuracomun numeric(19,0), -- Identificador de la estructura común.
  CONSTRAINT pk_tipocontratoentidad PRIMARY KEY (idtipocontratoentidad),
  CONSTRAINT fk_filaestruct_tipocontratoentidad FOREIGN KEY (idestructuracomun)
      REFERENCES mod_estructuracomp.nom_filaestruc (idfila) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_tipocontrato_tipocontratoentidad FOREIGN KEY (idtipocontrato)
      REFERENCES mod_crmcontratacion.dat_tipocontrato (idtipocontrato) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_crmcontratacion.dat_tipocontratoentidad
  OWNER TO zeolides;
COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idtipocontratoentidad IS 'Identidficador de la tabla dat_tipocontratoentidad.';
COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idtipocontrato IS 'Identificador de cliente-proveedor.';
COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idestructuracomun IS 'Identificador de la estructura común.';




ALTER TABLE mod_crmcontratacion.dat_tipocontrato ADD COLUMN idespaciotrabajo character varying(255);