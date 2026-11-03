 
CREATE TABLE mod_logistica.dat_productoinactivo (
  idproducto NUMERIC(19,0) NOT NULL,
  idusuario NUMERIC(19,0),
  fecha DATE DEFAULT now(),
  CONSTRAINT dat_productoinactivo_pkey PRIMARY KEY(idproducto)
) 
WITH (oids = false);

ALTER TABLE mod_logistica.dat_productoinactivo
  OWNER TO zeolides;  