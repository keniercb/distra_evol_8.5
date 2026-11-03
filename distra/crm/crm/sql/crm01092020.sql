CREATE SEQUENCE mod_crmcontratacion.sec_hitocertificodesglose_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999 START 1
  CACHE 1;


CREATE TABLE mod_crmcontratacion.dat_hitocertificodesglose (
  idhitocertificodesglose NUMERIC(19,0) DEFAULT nextval('mod_crmcontratacion.sec_hitocertificodesglose_seq'::regclass) NOT NULL,
  idhito NUMERIC(19,0) NOT NULL,
  idusuario NUMERIC(19,0) NOT NULL,
  fecha DATE,
  CONSTRAINT pk_hito_hitocertificodesglos PRIMARY KEY(idhitocertificodesglose),
  CONSTRAINT fk_hito_hitocertificodesglos FOREIGN KEY (idhito)
    REFERENCES mod_crmcontratacion.dat_hito(idhito)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);

ALTER TABLE mod_crmcontratacion.dat_hitocertificodesglose
  OWNER TO zeolides;