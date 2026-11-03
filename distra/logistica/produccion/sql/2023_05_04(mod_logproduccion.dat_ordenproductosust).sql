CREATE SEQUENCE mod_logproduccion.sec_ordenproductosust_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1 OWNED BY NONE;
--------------- SQL ---------------

CREATE TABLE mod_logproduccion.dat_ordenproductosust (
  idordenproductosust NUMERIC(19,0) DEFAULT nextval('mod_logproduccion.sec_ordenproductosust_seq'::regclass) NOT NULL,
  idordenproduccion NUMERIC(19,0) NOT NULL,
  idindicador NUMERIC(19,0),
  idproducto NUMERIC(19,0),
  norma NUMERIC(19,0),
  CONSTRAINT dat_ordenproductosust_idx UNIQUE(idordenproduccion, idindicador, idproducto),
  CONSTRAINT dat_ordenproductosust_pkey PRIMARY KEY(idordenproductosust),
  CONSTRAINT dat_ordenproductosust_fk FOREIGN KEY (idordenproduccion)
    REFERENCES mod_logproduccion.dat_ordenproduccion(idordenproduccion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_ordenproductosust_fk1 FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_ordenproductosust_fk2 FOREIGN KEY (idindicador)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_logproduccion.dat_ordenproductosust
IS 'Tabla para adicionar un producto no planificado a la orden de producción';

COMMENT ON COLUMN mod_logproduccion.dat_ordenproductosust.norma
IS 'Campo de norma de la actividad';

ALTER TABLE mod_logproduccion.dat_ordenproductosust
  OWNER TO zeolides;