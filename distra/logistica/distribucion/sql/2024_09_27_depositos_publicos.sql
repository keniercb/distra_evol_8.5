CREATE SEQUENCE mod_logdistribucion.sec_depositonaturaleza_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logdistribucion.sec_depositonaturaleza_seq RESTART WITH 1000000001;


CREATE TABLE mod_logdistribucion.dat_depositonaturaleza (
  iddepositonaturaleza NUMERIC(19,0) DEFAULT nextval('mod_logdistribucion.sec_depositonaturaleza_seq'::regclass) NOT NULL,
  idnaturaleza NUMERIC(19,0),
  iddeposito NUMERIC(19,0),
  CONSTRAINT dat_depositonaturaleza_pkey PRIMARY KEY(iddepositonaturaleza)
) 
WITH (oids = false);

ALTER TABLE mod_logdistribucion.dat_depositonaturaleza
  OWNER TO zeolides;
  
CREATE TABLE mod_logdistribucion.conf_depositopublico (
  iddeposito NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_depositopublico_pkey PRIMARY KEY(iddeposito),
  CONSTRAINT dat_estructuraop_idpublico_key FOREIGN KEY (iddeposito)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_logdistribucion.conf_depositopublico
IS 'Depósitos a publicar en el portal';

COMMENT ON COLUMN mod_logdistribucion.conf_depositopublico.iddeposito
IS 'id deposito a publicar';

ALTER TABLE mod_logdistribucion.conf_depositopublico
  OWNER TO zeolides;    