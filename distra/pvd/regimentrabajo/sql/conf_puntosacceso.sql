CREATE TABLE mod_regimentrabajo.conf_puntosacceso (
  idpuntoacceso NUMERIC(19,0) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  CONSTRAINT nom_puntosacceso_pkey PRIMARY KEY(idpuntoacceso)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_puntosacceso
  OWNER TO zeolides;