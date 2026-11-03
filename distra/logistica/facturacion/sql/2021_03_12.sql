ALTER TABLE mod_logfacturacion.conf_configuracionfactura
  ADD COLUMN idpadrematriz NUMERIC(19,0) DEFAULT NULL;
  
ALTER TABLE mod_logfacturacion.conf_configuracionfactura
  ADD COLUMN preciocentral NUMERIC(1,0) DEFAULT 0;
  
CREATE SEQUENCE public.dat_controlactualizarprecios_id_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE public.dat_controlactualizarprecios_id_seq RESTART WITH 7;  
  
  
CREATE TABLE public.dat_controlactualizarprecios (
  id NUMERIC DEFAULT nextval('dat_controlactualizarprecios_id_seq'::regclass) NOT NULL,
  fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  CONSTRAINT pk_dat_controlactualizarprecios PRIMARY KEY(id)
) 
WITH (oids = false);

ALTER TABLE public.dat_controlactualizarprecios
  OWNER TO zeolides;