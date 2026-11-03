CREATE TABLE mod_logproduccion.dat_ordenprod (
  idordenprod NUMERIC(19,0) NOT NULL,
  idproducto NUMERIC(19,0),
  idordenproduccion NUMERIC(19,0) NOT NULL,
  cantidad NUMERIC(19,0),
  CONSTRAINT dat_ordenprod_pkey PRIMARY KEY(idordenprod),
  CONSTRAINT dat_ordenprod_fk FOREIGN KEY (idordenproduccion)
    REFERENCES mod_logproduccion.dat_ordenproduccion(idordenproduccion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_ordenprod_fk1 FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logproduccion.dat_ordenprod
  OWNER TO zeolides;