CREATE SEQUENCE mod_logpuntoventa.sec_hisincidencia_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_hisincidencia_seq RESTART WITH 1000000000;


CREATE TABLE mod_logpuntoventa.his_incidencia (
  idincidencia NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_hisincidencia_seq'::regclass) NOT NULL,
  idestructuracomun NUMERIC(19,0) NOT NULL,
  fecha DATE NOT NULL,
  informacion TEXT NOT NULL,
  CONSTRAINT his_incidencias_pkey PRIMARY KEY(idincidencia)
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.his_incidencia
  ALTER COLUMN idincidencia SET STATISTICS 0;

ALTER TABLE mod_logpuntoventa.his_incidencia
  ALTER COLUMN idestructuracomun SET STATISTICS 0;

ALTER TABLE mod_logpuntoventa.his_incidencia
  ALTER COLUMN fecha SET STATISTICS 0;

COMMENT ON COLUMN mod_logpuntoventa.his_incidencia.idincidencia
IS 'Identificador de la tabla';

COMMENT ON COLUMN mod_logpuntoventa.his_incidencia.idestructuracomun
IS 'Id de la estructura donde ocurre la incidencia';

COMMENT ON COLUMN mod_logpuntoventa.his_incidencia.fecha
IS 'Fecha de la ocurrencia de la incidencia';

COMMENT ON COLUMN mod_logpuntoventa.his_incidencia.informacion
IS 'Descripcion detallada de la incidencia';

ALTER TABLE mod_logpuntoventa.his_incidencia
  OWNER TO zeolides;