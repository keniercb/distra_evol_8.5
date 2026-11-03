CREATE SEQUENCE mod_regimentrabajo.sec_nom_concepto_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_regimentrabajo.sec_nom_concepto_seq RESTART WITH 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_nom_concepto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_concepto".';

CREATE TABLE mod_regimentrabajo.nom_concepto (
  idconcepto NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_nom_concepto_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255),
  orden NUMERIC(19,0) NOT NULL,
  CONSTRAINT nom_concepto_pkey PRIMARY KEY(idconcepto)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.nom_concepto
  OWNER TO zeolides;