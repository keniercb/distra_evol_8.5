CREATE SEQUENCE mod_logpuntoventa.sec_nomtiempo_seq
  INCREMENT 1 MINVALUE 1000000001
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_nomtiempo_seq RESTART WITH 1000000034;
-------------------------------------------------------------------------------------------------
CREATE TABLE mod_logpuntoventa.nom_tiempo (
  idtiempo NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_nomtiempo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255),
  cantidaddias VARCHAR(255),
  estado NUMERIC(1,0) DEFAULT 1,
  fechainicio DATE,
  fechafin DATE,
  CONSTRAINT nom_tiempo_pkey PRIMARY KEY(idtiempo)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logpuntoventa.nom_tiempo.idtiempo
IS 'ID de la tabla';

COMMENT ON COLUMN mod_logpuntoventa.nom_tiempo.denominacion
IS 'Denominacion del tiempo';

COMMENT ON COLUMN mod_logpuntoventa.nom_tiempo.cantidaddias
IS 'Cantidad de dias que representa';
---------------------------------------------------------------------------
CREATE SEQUENCE mod_logpuntoventa.sec_dattiempoentidad_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_dattiempoentidad_seq RESTART WITH 1000000005;
-----------------------------------------------------------------------
CREATE TABLE mod_logpuntoventa.dat_tiempoentidad (
  idtiempoentidad NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_dattiempoentidad_seq'::regclass) NOT NULL,
  idtiempo NUMERIC(19,0),
  idnaturaleza NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  cantidaddiaslimventa NUMERIC(19,0),
  idtiempogarantia NUMERIC(19,0)
) 
WITH (oids = false);