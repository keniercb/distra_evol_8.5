ALTER TABLE mod_crmcontratacion.dat_monedacontrato ADD COLUMN incremento numeric(19,0);

CREATE SEQUENCE mod_crmcontratacion.sec_hitocertificodesglose_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999 START 1
  CACHE 1;


CREATE TABLE mod_crmcontratacion.dat_hitocertificodesglose (
  idhitocertificodesglose NUMERIC(19,0) DEFAULT nextval('mod_crmcontratacion.sec_hitocertificodesglose_seq'::regclass) NOT NULL,
  idhito NUMERIC(19,0) NOT NULL,
  idusuario NUMERIC(19,0) NOT NULL,
  fecha DATE,
  CONSTRAINT pk_hito_hitocertificodesglos PRIMARY KEY(idhitocertificodesglose),
  CONSTRAINT fk_hito_hitocertificodesglos FOREIGN KEY (idhito)
    REFERENCES mod_crmcontratacion.dat_hito(idhito)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);

ALTER TABLE mod_crmcontratacion.dat_hitocertificodesglose
  OWNER TO zeolides;
  
  CREATE SEQUENCE mod_crmcontratacion.sec_lineanegocio_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;


CREATE TABLE mod_crmcontratacion.nom_lineanegocio (
  idlineanegocio NUMERIC(19,0) DEFAULT nextval('mod_crmcontratacion.sec_lineanegocio_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255),
  descripcion VARCHAR(255),
  fechainicio DATE,
  fechafin DATE,
  CONSTRAINT ln_denominacion UNIQUE(denominacion),
  CONSTRAINT pk_lineanegocio PRIMARY KEY(idlineanegocio)
)
WITH (oids = false);

COMMENT ON TABLE mod_crmcontratacion.nom_lineanegocio
IS 'Guarda las lineas de negocio definidas a nivel de país.';

ALTER TABLE mod_crmcontratacion.nom_lineanegocio
  OWNER TO zeolides;
  
  ALTER TABLE mod_crmcontratacion.dat_hito
  ADD COLUMN idlineanegocio NUMERIC(19,0);
  ALTER TABLE mod_crmcontratacion.dat_hito
  ADD CONSTRAINT fk_lineanegocio_hito FOREIGN KEY (idlineanegocio)
    REFERENCES mod_crmcontratacion.nom_lineanegocio(idlineanegocio)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
    NOT DEFERRABLE;
    
  ALTER TABLE mod_crmcontratacion.dat_hito
  DROP CONSTRAINT fk_lineanegocio_hito RESTRICT;

ALTER TABLE mod_crmcontratacion.dat_hito
  ADD CONSTRAINT dat_hito_fk FOREIGN KEY (idlineanegocio)
    REFERENCES mod_datosmaestros.nom_naturaleza(idnaturaleza)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
    NOT DEFERRABLE;
    
    ALTER TABLE mod_logfacturacion.dat_elementosfactura
  ADD COLUMN idhito NUMERIC(19,0);
  
  CREATE SEQUENCE mod_crmcontratacion.sec_contratoclienteasociado_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999 START 1
  CACHE 1;


CREATE TABLE mod_crmcontratacion.dat_contratoclienteasociado (
  idcontratoclienteasociado NUMERIC(19,0) DEFAULT nextval('mod_crmcontratacion.sec_contratoclienteasociado_seq'::regclass) NOT NULL,
  idcontrato NUMERIC(19,0) NOT NULL,
  idclienteproveedor NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_contratoclienteasociado PRIMARY KEY(idcontratoclienteasociado),
  CONSTRAINT fk_contrato_contratoclienteasociado FOREIGN KEY (idcontrato)
    REFERENCES mod_crmcontratacion.dat_contrato(idcontrato)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_clienteproveedor_contratoclienteasociado FOREIGN KEY (idclienteproveedor)
    REFERENCES mod_datosmaestros.nom_clientesproveedor(idclientesproveedores)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);

ALTER TABLE mod_crmcontratacion.dat_contratoclienteasociado
  OWNER TO zeolides;
  
  CREATE SEQUENCE mod_crmadministracion.sec_confproforma_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

CREATE TABLE mod_crmadministracion.conf_proforma (
  idconfproforma NUMERIC(1,0) DEFAULT nextval('mod_crmadministracion.sec_confproforma_seq'::regclass) NOT NULL,
  idespaciotrabajo VARCHAR(255),
  espaciotrabajo VARCHAR(255),
  activo NUMERIC(1,0),
  CONSTRAINT pk_confproforma PRIMARY KEY(idconfproforma)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_crmadministracion.conf_proforma.idconfproforma
IS 'Identificador de la solicitud de negocio';

COMMENT ON COLUMN mod_crmadministracion.conf_proforma.idespaciotrabajo
IS 'Identificador del espacio de trabajo';

COMMENT ON COLUMN mod_crmadministracion.conf_proforma.espaciotrabajo
IS 'Denominación del espacio de trabajo.';

COMMENT ON COLUMN mod_crmadministracion.conf_proforma.activo
IS '1 si esta activo o no el gestor documental';

ALTER TABLE mod_crmadministracion.conf_proforma
  OWNER TO zeolides;
  
  CREATE SEQUENCE mod_crmcontratacion.sec_tipocontratoentidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;


CREATE TABLE mod_crmcontratacion.dat_tipocontratoentidad (
  idtipocontratoentidad NUMERIC(19,0) DEFAULT nextval('mod_crmcontratacion.sec_tipocontratoentidad_seq'::regclass) NOT NULL,
  idtipocontrato NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT pk_tipocontratoentidad PRIMARY KEY(idtipocontratoentidad),
  CONSTRAINT fk_tipocontrato_tipocontratoentidad FOREIGN KEY (idtipocontrato)
    REFERENCES mod_crmcontratacion.dat_tipocontrato(idtipocontrato)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_filaestruct_tipocontratoentidad FOREIGN KEY (idestructuracomun)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);

COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idtipocontratoentidad
IS 'Identidficador de la tabla dat_tipocontratoentidad.';

COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idtipocontrato
IS 'Identificador de cliente-proveedor.';

COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idestructuracomun
IS 'Identificador de la estructura común.';


ALTER TABLE mod_crmcontratacion.dat_tipocontratoentidad
  OWNER TO zeolides;
  
  ALTER TABLE mod_crmcontratacion.dat_tipocontrato
  ADD COLUMN idespaciotrabajo VARCHAR(255);