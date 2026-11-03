INSERT INTO 
  mod_logistica.nom_variableglobal
(
  nombre,
  valor,
  id,
  activo,
  ambito,
  datatype
)
VALUES (
  'cobropagoanticipo',
  'false',
  (select max(id)+1 from mod_logistica.nom_variableglobal),
  1,
  1,
  2
);


CREATE SEQUENCE mod_logistica.sec_datdocumentoanticipo_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logistica.sec_datdocumentoanticipo_seq RESTART WITH 1000000001;

COMMENT ON SEQUENCE mod_logistica.sec_datdocumentoanticipo_seq
IS 'Secuencia empleada para autogenerar el identificador de la 
tabla dat_documentoanticipo. ';

CREATE TABLE mod_logistica.dat_documentoanticipo (
  iddocumentoanticipo NUMERIC(19,0) DEFAULT nextval('mod_logistica.sec_datdocumentoanticipo_seq'::regclass) NOT NULL,
  iddocumento NUMERIC(19,0),
  idanticipo NUMERIC(19,0),
  importe NUMERIC(25,2),
  CONSTRAINT dat_documentoanticipo_pkey PRIMARY KEY(iddocumentoanticipo),
  CONSTRAINT dat_documentoanticipo_fk FOREIGN KEY (iddocumento)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logistica.dat_documentoanticipo
  OWNER TO zeolides;
