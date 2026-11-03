CREATE SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_seq RESTART WITH 1;


CREATE TABLE mod_regimentrabajo.conf_resumenausentismocausas (
  idconceptocausa NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_conceptocausas_seq'::regclass) NOT NULL, 
  idconcepto NUMERIC(19,1) NOT NULL, 
  idcausa NUMERIC(19,1) NOT NULL, 
  CONSTRAINT conf_resumenausentimocausas_pkey PRIMARY KEY(idconceptocausa)
) WITHOUT OIDS;