CREATE SEQUENCE mod_loginventario.sec_dattransfinternalote_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

CREATE TABLE mod_loginventario.dat_transfinternalote (
  idtransfinternalote NUMERIC(19,0) DEFAULT nextval('mod_loginventario.sec_dattransfinternalote_seq'::regclass) NOT NULL,
  idproducto NUMERIC(19,0),
  idtransfinterna NUMERIC(19,0),
  idlote NUMERIC(19,0),
  cantpasar NUMERIC(19,0) DEFAULT 0,
  idprodtransfinterna NUMERIC(19,0),
  CONSTRAINT pk_transfinternalote PRIMARY KEY(idtransfinternalote),
  CONSTRAINT fk_lote_transfinternalote FOREIGN KEY (idlote)
    REFERENCES mod_logistica.dat_lote(idlote)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_prodtransfinterna_transfinternalote FOREIGN KEY (idprodtransfinterna)
    REFERENCES mod_loginventario.dat_prodtransfinterna(idprodtransfinterna)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_producto_transfinternalote FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_loginventario.dat_transfinternalote.cantpasar
IS 'Almacena la cantidad a pasar';

ALTER TABLE mod_loginventario.dat_transfinternalote
  OWNER TO zeolides;