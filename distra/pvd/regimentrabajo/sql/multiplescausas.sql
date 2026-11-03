CREATE TABLE mod_regimentrabajo.conf_habilitarmultiplescausas (
  id NUMERIC(19,0) NOT NULL,
  habilitado NUMERIC DEFAULT 0 NOT NULL,
  CONSTRAINT conf_habilitarmultiplescausas_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_habilitarmultiplescausas
  ALTER COLUMN id SET STATISTICS 0;

ALTER TABLE mod_regimentrabajo.conf_habilitarmultiplescausas
  ALTER COLUMN habilitado SET STATISTICS 0;

COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarmultiplescausas.id
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarmultiplescausas.habilitado
IS 'habilitar multiples causas
0- No habilitado
1- habilitado';

ALTER TABLE mod_regimentrabajo.conf_habilitarmultiplescausas
  OWNER TO postgres;

INSERT INTO mod_regimentrabajo.conf_habilitarmultiplescausas VALUES (1, 0);
  
  
  CREATE SEQUENCE mod_regimentrabajo.sec_dat_asistenciamultiplescausas_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE mod_regimentrabajo.sec_dat_asistenciamultiplescausas_seq RESTART WITH 286386;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_dat_asistenciamultiplescausas_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_asistencia".';

CREATE TABLE mod_regimentrabajo.dat_asistenciamultiplescausas (
  idpersona NUMERIC(19,0) NOT NULL,
  idcausa NUMERIC(19,0) NOT NULL,
  fecharegistro DATE NOT NULL,
  horaentrada TIME(0) WITHOUT TIME ZONE NOT NULL,
  horasalida TIME(0) WITHOUT TIME ZONE NOT NULL,
  observaciones VARCHAR(255),
  idasistenciamultiplescausas NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_dat_asistenciamultiplescausas_seq'::regclass) NOT NULL,
  horas VARCHAR(50),
  idasistencia NUMERIC(19,0) NOT NULL,
  CONSTRAINT dat_asistenciamultiplescausas_pkey PRIMARY KEY(idasistenciamultiplescausas)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.dat_asistenciamultiplescausas
  OWNER TO postgres;