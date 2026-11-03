CREATE SEQUENCE mod_logubicacion.sec_datprodtranfintubicacion_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logubicacion.sec_datprodtranfintubicacion_seq RESTART WITH 1000000013;


CREATE TABLE mod_logubicacion.dat_prodtranfintubicacion (
  idprodtranfintubicacion NUMERIC(19,0) DEFAULT nextval('mod_logubicacion.sec_datprodtranfintubicacion_seq'::regclass) NOT NULL,
  idestructuraubicacion NUMERIC(19,0),
  cantidad NUMERIC(25,6),
  idprodtransfinterna NUMERIC(19,0),
  CONSTRAINT dat_prodtransfinterna_pkey PRIMARY KEY(idprodtranfintubicacion),
  CONSTRAINT fk_estructuraubicacion_prodtransfinterna FOREIGN KEY (idestructuraubicacion)
    REFERENCES mod_logubicacion.dat_estructuraubicacion(idestructuraubicacion)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_prodtransferencia_produbicacion FOREIGN KEY (idprodtransfinterna)
    REFERENCES mod_loginventario.dat_prodtransfinterna(idprodtransfinterna)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

CREATE INDEX dat_prodtransfubicacion_idx ON mod_logubicacion.dat_prodtranfintubicacion
  USING btree (idprodtransfinterna);

ALTER TABLE mod_logubicacion.dat_prodtranfintubicacion
  OWNER TO zeolides;
  
