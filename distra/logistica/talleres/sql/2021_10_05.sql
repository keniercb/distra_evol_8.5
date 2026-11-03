CREATE TABLE mod_logtaller.conf_tallerfacturacion (
  idestructuracomun NUMERIC(19,0) NOT NULL,
  facturarcerrar NUMERIC(1,0) DEFAULT 0,
  idoperacion NUMERIC(19,0),
  facturarparcial NUMERIC(1,0) DEFAULT 0,
  CONSTRAINT conf_tallerfacturacion_pkey PRIMARY KEY(idestructuracomun)
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.conf_tallerfacturacion
  OWNER TO zeolides;