CREATE SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_onei_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_onei_seq RESTART WITH 1;

CREATE TABLE mod_regimentrabajo.conf_conceptocausas_onei (
  idconceptocausa NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_conceptocausas_onei_seq'::regclass) NOT NULL,
  idconcepto NUMERIC(19,1),
  idcausa NUMERIC(19,1) NOT NULL,
  CONSTRAINT "conf_conceptocausasONEI_pkey" PRIMARY KEY(idconceptocausa)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_conceptocausas_onei
  OWNER TO zeolides;