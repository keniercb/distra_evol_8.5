CREATE SEQUENCE mod_logproduccion.sec_datoperarioactividad
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

CREATE TABLE mod_logproduccion.dat_operarioactividad (
  idoperarioactividad NUMERIC(19,0) DEFAULT nextval('mod_logproduccion.sec_datoperarioactividad'::regclass) NOT NULL,
  idordenactividad NUMERIC(19,0),
  idactividad NUMERIC(19,0),
  idresponsable NUMERIC(19,0),
  CONSTRAINT dat_operarioactividad_pkey PRIMARY KEY(idoperarioactividad)
) 
WITH (oids = false);

ALTER TABLE mod_logproduccion.dat_operarioactividad
  OWNER TO zeolides;