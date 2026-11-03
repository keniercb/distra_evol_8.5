CREATE SEQUENCE mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_cambiosescalaspersonacargoconceptospd".';

CREATE TABLE mod_nomina.dat_cambiosescalaspersonacargoconceptospd
(
  idcambiosescalaspersonacargoconceptospd numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq'::regclass),
  idpersona numeric(19,0) NOT NULL,
  idcargo numeric(19,0) NOT NULL,
  fecha date NOT NULL DEFAULT now(),
  CONSTRAINT pk_dat_cambiosescalaspersonacargoconceptospd PRIMARY KEY (idcambiosescalaspersonacargoconceptospd)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.dat_cambiosescalaspersonacargoconceptospd
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.dat_cambiosescalaspersonacargoconceptospd TO zeolides;

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
   ALTER COLUMN anno TYPE numeric(19,2) USING anno::numeric;