ALTER TABLE mod_logfacturacion.conf_configuracionfactura
  ADD COLUMN tipopreciocentral NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_logfacturacion.conf_configuracionfactura.tipopreciocentral
IS 'Campo para configurar el tipo de costo centyralizado q se usa
0 - precio promedio
1 - mayor costo
2 - menor costo';

CREATE TABLE mod_logfacturacion.nom_codigocategoria (
  codigo VARCHAR(10) NOT NULL,
  CONSTRAINT nom_codigocategoria_pkey PRIMARY KEY(codigo)
) 
WITH (oids = false);

ALTER TABLE mod_logfacturacion.nom_codigocategoria
  OWNER TO zeolides;
  
DELETE FROM mod_logfacturacion.nom_codigocategoria;  
INSERT INTO mod_logfacturacion.nom_codigocategoria(codigo)VALUES ('CL');
INSERT INTO mod_logfacturacion.nom_codigocategoria(codigo)VALUES ('TRANSP');
INSERT INTO mod_logfacturacion.nom_codigocategoria(codigo)VALUES ('GAV');
INSERT INTO mod_logfacturacion.nom_codigocategoria(codigo)VALUES ('RCC');