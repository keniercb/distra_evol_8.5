CREATE SEQUENCE mod_objetivos.sec_dat_carpetadocumentos_seq
  INCREMENT 1 MINVALUE 9000000000
  MAXVALUE 9999999999 START 9000000001
  CACHE 1;

ALTER SEQUENCE mod_objetivos.sec_dat_carpetadocumentos_seq RESTART WITH 9000060610;

COMMENT ON SEQUENCE mod_objetivos.sec_dat_carpetadocumentos_seq
IS 'Secuencia para los id de la tabla dat_carpetadocumentos';

CREATE TABLE mod_objetivos.dat_carpetadocumentos (
  idcarpeta NUMERIC(19,0) DEFAULT nextval('mod_objetivos.sec_dat_carpetadocumentos_seq'::regclass) NOT NULL,
  idespacio VARCHAR,
  nombrecarpeta VARCHAR,
  elemento VARCHAR,
  idautor NUMERIC(19,0) NOT NULL,
  fechacreacion TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  tipoproceso NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT dat_carpetadocumentos_pkey PRIMARY KEY(idcarpeta)
) 
WITH (oids = false);
