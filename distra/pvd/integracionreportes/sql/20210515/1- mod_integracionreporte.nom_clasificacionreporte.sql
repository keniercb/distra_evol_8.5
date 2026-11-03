CREATE SEQUENCE mod_integracionreporte.sec_clasificacionreporte_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 1999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_integracionreporte.sec_clasificacionreporte_seq RESTART WITH 1;

CREATE TABLE mod_integracionreporte.nom_clasificacionreporte (
  idclasificacion NUMERIC(19,0) DEFAULT nextval('mod_integracionreporte.sec_clasificacionreporte_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  CONSTRAINT nom_clasificacionreporte_pkey PRIMARY KEY(idclasificacion)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_integracionreporte.nom_clasificacionreporte.denominacion
IS 'Denominacion de la clasificacion';

ALTER TABLE mod_integracionreporte.nom_clasificacionreporte
  OWNER TO zeolides;