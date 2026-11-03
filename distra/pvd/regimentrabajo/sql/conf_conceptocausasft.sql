CREATE SEQUENCE mod_regimentrabajo.sec_conf_conceptocausasft_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;
  
  CREATE TABLE mod_regimentrabajo.conf_conceptocausasft (
  idconceptocausa NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_conf_conceptocausasft_seq'::regclass) NOT NULL,
  idconcepto NUMERIC(19,0),
  idcausa NUMERIC(19,0) NOT NULL,
  CONSTRAINT "conf_conceptocausasFT_pkey" PRIMARY KEY(idconceptocausa)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_conceptocausasft
  OWNER TO zeolides;