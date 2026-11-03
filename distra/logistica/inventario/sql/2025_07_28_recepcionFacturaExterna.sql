CREATE SEQUENCE mod_loginventario.sec_facturaproveedor_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 1099999999 START 1
  CACHE 1;
  
CREATE SEQUENCE mod_loginventario.sec_facturaproducto_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 1099999999 START 1
  CACHE 1;
  
CREATE TABLE mod_loginventario.dat_facturaproveedor (
  idfactura NUMERIC(19,0) DEFAULT nextval('mod_loginventario.sec_facturaproveedor_seq'::regclass) NOT NULL,
  idestructuracomun NUMERIC(19,0) NOT NULL,
  idreferencia NUMERIC(19,0) NOT NULL,
  codigocliente VARCHAR(100),
  codigoproveedor VARCHAR(100),
  nrofactura VARCHAR(100),
  fecha DATE,
  CONSTRAINT pk_facturaproveedor PRIMARY KEY(idfactura)
) 
WITH (oids = false);

CREATE TABLE mod_loginventario.dat_facturaproducto (
  idproductofactura NUMERIC(19,0) DEFAULT nextval('mod_loginventario.sec_facturaproducto_seq'::regclass) NOT NULL,
  idfactura NUMERIC(19,0) NOT NULL,
  codigo VARCHAR(100) NOT NULL,
  denominacion VARCHAR(255),
  descripcion VARCHAR(255),
  nrolote VARCHAR(100),
  fechavencimiento DATE,
  umedida VARCHAR(100),
  cantidad numeric(25,6),
  precio numeric(25,6),
  CONSTRAINT pk_facturaproducto PRIMARY KEY(idproductofactura),
  CONSTRAINT fk_factura_producto FOREIGN KEY (idfactura)
    REFERENCES mod_loginventario.dat_facturaproveedor(idfactura)
    ON DELETE cascade
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);