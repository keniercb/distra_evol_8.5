CREATE SEQUENCE mod_regimentrabajo.sec_conf_usuarios_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_regimentrabajo.sec_conf_usuarios_seq RESTART WITH 1;

CREATE TABLE mod_regimentrabajo.conf_usuarios (
  id NUMERIC DEFAULT nextval('mod_regimentrabajo.sec_conf_usuarios_seq'::regclass) NOT NULL,
  idusuario NUMERIC NOT NULL,
  CONSTRAINT conf_usuarios_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_usuarios
  OWNER TO zeolides;