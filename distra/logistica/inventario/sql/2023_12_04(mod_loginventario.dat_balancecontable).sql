CREATE SEQUENCE mod_loginventario.sec_datbalancecontable_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1 OWNED BY NONE;

ALTER SEQUENCE mod_loginventario.sec_datbalancecontable_seq RESTART WITH 1000000019;



CREATE TABLE mod_loginventario.dat_balancecontable (
  idbalancecontable NUMERIC(19,0) DEFAULT nextval('mod_loginventario.sec_datbalancecontable_seq'::regclass) NOT NULL,
  idcuenta NUMERIC(19,0) NOT NULL,
  valorcontable NUMERIC(25,2),
  valorinventario NUMERIC(25,2),
  diferencia NUMERIC(25,2),
  identidad NUMERIC(19,0),
  fecha DATE,
  idusuario NUMERIC(19,0),
  cuenta VARCHAR(255),
  CONSTRAINT dat_balancecontable_pkey PRIMARY KEY(idbalancecontable)
) 
WITH (oids = false);

ALTER TABLE mod_loginventario.dat_balancecontable
  OWNER TO zeolides;