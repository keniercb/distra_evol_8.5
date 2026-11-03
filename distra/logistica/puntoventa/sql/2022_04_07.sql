ALTER TABLE mod_logpuntoventa.dat_pedidotienda
  ADD COLUMN IF NOT EXISTS id_state numeric(10,0);

ALTER TABLE mod_logpuntoventa.dat_pedidotienda
  ADD COLUMN IF NOT EXISTS iso_municipio VARCHAR(5);
  
ALTER TABLE mod_logpuntoventa.dat_pedidotienda
  ADD COLUMN IF NOT EXISTS municipio varchar(255);  

CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_almacenregion (
  idestructura NUMERIC(19,0),
  codigoregion VARCHAR(5),
  id_state numeric(10,0),
  PRIMARY KEY(idestructura, id_state)
) 
WITH (oids = false);

CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_provinciamunicipio (
  iso_municipio VARCHAR(5),
  municipio VARCHAR(50),
  provincia VARCHAR(50),
  id_state numeric(10,0),
  PRIMARY KEY(id_state)
) 
WITH (oids = false);