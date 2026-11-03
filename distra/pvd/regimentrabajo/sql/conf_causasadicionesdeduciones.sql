CREATE SEQUENCE mod_regimentrabajo.sec_conf_causasadicionesdeduciones_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;


CREATE TABLE mod_regimentrabajo.conf_causasadicionesdeduciones (
  id NUMERIC DEFAULT nextval('mod_regimentrabajo.sec_conf_causasadicionesdeduciones_seq'::regclass) NOT NULL,
  adiciondeducion NUMERIC(1,0) DEFAULT 0 NOT NULL,
  idcausa NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_causasadicionesdeduciones_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_regimentrabajo.conf_causasadicionesdeduciones.adiciondeducion
IS '0-Deducion
1-Adicion';

ALTER TABLE mod_regimentrabajo.conf_causasadicionesdeduciones
  OWNER TO zeolides;