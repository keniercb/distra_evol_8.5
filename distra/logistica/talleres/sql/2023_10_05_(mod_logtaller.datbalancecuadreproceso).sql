CREATE SEQUENCE mod_logtaller.sec_datbalancecuadreproceso_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1 OWNED BY NONE;

ALTER SEQUENCE mod_logtaller.sec_datbalancecuadreproceso_seq RESTART WITH 1000000019;
CREATE TABLE mod_logtaller.dat_balancecuadreproceso (
  idbalancecuadreproceso NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_datbalancecuadreproceso_seq'::regclass) NOT NULL,
  idcuenta NUMERIC(19,0) NOT NULL,
  saldocontable NUMERIC(25,2),
  saldoot NUMERIC(25,2),
  diferencia NUMERIC(25,2),
  idestructura NUMERIC(19,0),
  cierre NUMERIC(19,0) DEFAULT 0,
  fecha DATE,
  CONSTRAINT dat_balancecuadreproceso_pkey PRIMARY KEY(idbalancecuadreproceso)
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_balancecuadreproceso
  OWNER TO zeolides;