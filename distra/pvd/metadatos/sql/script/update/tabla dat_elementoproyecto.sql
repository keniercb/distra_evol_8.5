CREATE TABLE mod_estructuracomp.dat_elementoproyecto (
  idelementoproyecto BIGSERIAL NOT NULL,
  idfila NUMERIC(19,0) NOT NULL,
  idproyecto NUMERIC(6,0),
  orden NUMERIC(6,0),
  ordenunico public.ltree,
  PRIMARY KEY(idelementoproyecto)
) 
WITH (oids = false);

ALTER TABLE mod_estructuracomp.dat_elementoproyecto
  OWNER TO zeolides;