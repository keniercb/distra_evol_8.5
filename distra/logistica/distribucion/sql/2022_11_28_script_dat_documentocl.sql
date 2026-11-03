CREATE SEQUENCE mod_logistica.sec_datdocumentocl_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logistica.sec_datdocumentocl_seq RESTART WITH 1000000002;


CREATE TABLE mod_logistica.dat_documentocl (
  iddocumentocl NUMERIC(19,0) DEFAULT nextval('mod_logistica.sec_datdocumentocl_seq'::regclass) NOT NULL,
  iddocumento NUMERIC(19,0) NOT NULL,
  idproducto NUMERIC(19,0) NOT NULL,
  CONSTRAINT dat_documentocl_pkey PRIMARY KEY(iddocumentocl),
  CONSTRAINT dat_documentocl_fk FOREIGN KEY (iddocumento)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logistica.dat_documentocl
  OWNER TO zeolides;