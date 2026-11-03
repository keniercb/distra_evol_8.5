CREATE SEQUENCE mod_logfarmacia.sec_dat_imptarjeta_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;
  
CREATE TABLE mod_logfarmacia.dat_imptarjeta (
  idimptarjeta NUMERIC(19,0) DEFAULT nextval('mod_logfarmacia.sec_dat_imptarjeta_seq'::regclass) NOT NULL,
  numeroidentidad VARCHAR(200),
  nombrepaciente VARCHAR(200),
  direccion VARCHAR(200),
  cmf VARCHAR(255),
  provincia VARCHAR(150),
  municipio VARCHAR(150),
  medicamento VARCHAR(255),
  dosis NUMERIC(19,0),
  nombremedico VARCHAR(200),
  nroregistro NUMERIC(19,0),
  policlinico VARCHAR(255),
  hospital VARCHAR(150),
  otrasunidades VARCHAR(150),
  fechaexpedicion DATE,
  CONSTRAINT dat_imptarjeta_pkey PRIMARY KEY(idimptarjeta)
) 
WITH (oids = false);

ALTER TABLE mod_logfarmacia.dat_imptarjeta
  OWNER TO zeolides;