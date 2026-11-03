DROP TABLE IF EXISTS mod_logactivofijotangible.conf_viewconfig;


CREATE TABLE IF NOT EXISTS mod_logactivofijotangible.conf_viewconfig (
  idusuario NUMERIC(19,0) NOT NULL,
  data JSON,
  PRIMARY KEY(idusuario)
) 
WITH (oids = false);

COMMENT ON TABLE mod_logactivofijotangible.conf_viewconfig
IS 'Tabla de configuracion de las columnas para los grids de activos que usan el componente viewconfigcache';