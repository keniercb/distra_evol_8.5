CREATE TABLE mod_loginventario.conf_inventarioext (
  idestructuracomun NUMERIC(19,0) NOT NULL,
  minimo NUMERIC(3,3),
  fondofijo NUMERIC(3,3),
  reserva NUMERIC(3,3),
  normabast NUMERIC(5,0),
  minarea NUMERIC(3,0),
  ptoreposicion NUMERIC(1,0) DEFAULT 0,
  diaconsignado NUMERIC(5,0),
  diaminvencido NUMERIC(5,0),
  diamintarjeta NUMERIC(5,0),
  diaproxvencer NUMERIC(5,0),
  lotevencido NUMERIC(1,0) DEFAULT 0,
  CONSTRAINT conf_inventarioext_pkey PRIMARY KEY(idestructuracomun)
) 
WITH (oids = false);

ALTER TABLE mod_loginventario.conf_inventarioext
  OWNER TO zeolides;