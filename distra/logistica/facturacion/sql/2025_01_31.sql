CREATE SEQUENCE mod_logfacturacion.sec_subcategoriaprecio_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logfacturacion.sec_subcategoriaprecio_seq RESTART WITH 1000000001;

CREATE TABLE mod_logfacturacion.nom_subcategoriaprecio (
  idsubcategoria NUMERIC(19,0) DEFAULT nextval('mod_logfacturacion.sec_subcategoriaprecio_seq'::regclass) NOT NULL,
  idcategoria NUMERIC(19,0),
  idcategoriapadre NUMERIC(19,0),
  prioridad NUMERIC(5,0),
  parentpath public.ltree,
  CONSTRAINT pk_subcategoria PRIMARY KEY(idsubcategoria)
) 
WITH (oids = false);