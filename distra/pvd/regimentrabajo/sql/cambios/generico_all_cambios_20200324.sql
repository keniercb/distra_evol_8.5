DROP TABLE mod_regimentrabajo.dat_asistenciamensual;

CREATE TABLE mod_regimentrabajo.dat_asistenciamensual
(
  idasistenciamensual numeric(19,0) NOT NULL DEFAULT nextval('mod_regimentrabajo.sec_asistenciamensual_seq'::regclass),
  fdesde date NOT NULL,
  fhasta date NOT NULL,
  asistencia character varying NOT NULL,
  apa character varying NOT NULL,
  idestructura numeric(19,0) NOT NULL,
  CONSTRAINT pk_asistenciamensual PRIMARY KEY (idasistenciamensual)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_regimentrabajo.dat_asistenciamensual OWNER TO zeolides;
GRANT ALL ON TABLE mod_regimentrabajo.dat_asistenciamensual TO zeolides;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999999999
  START 5
  CACHE 1;
ALTER TABLE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_fondodetiempo".';
  
CREATE TABLE mod_regimentrabajo.conf_fondodetiempo
(
  id numeric(19,1) NOT NULL DEFAULT nextval('mod_regimentrabajo.sec_conf_fondodetiempo_seq'::regclass),
  idcategoria numeric(19,1) NOT NULL,
  fondodetiempo numeric(19,1) NOT NULL,
  CONSTRAINT conf_fondodetiempo_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_regimentrabajo.conf_fondodetiempo OWNER TO zeolides;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_categoriacausas_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_regimentrabajo.sec_conf_categoriacausas_seq OWNER TO zeolides;

CREATE TABLE mod_regimentrabajo.conf_categoriacausas
(
  idcategoriacausa numeric(19,1) NOT NULL DEFAULT nextval('mod_regimentrabajo.sec_conf_categoriacausas_seq'::regclass),
  idcategoria numeric(19,1) NOT NULL,
  idcausa numeric(19,1) NOT NULL,
  CONSTRAINT conf_categoriacausas_pkey PRIMARY KEY (idcategoriacausa)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_regimentrabajo.conf_categoriacausas OWNER TO zeolides;  
