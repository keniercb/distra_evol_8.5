-- Sequence: mod_nomina.sec_dat_variablespagodestajotemporal_seq

-- DROP SEQUENCE mod_nomina.sec_dat_variablespagodestajotemporal_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_dat_variablespagodestajotemporal_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_dat_variablespagodestajotemporal_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_variablespagodestajotemporal_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_variablespagodestajotemporal_seq TO zeolides;

-- Table: mod_nomina.dat_variablespagodestajotemporal

-- DROP TABLE mod_nomina.dat_variablespagodestajotemporal;
CREATE TABLE IF NOT EXISTS mod_nomina.dat_variablespagodestajotemporal
(
    idvariablespagodestajotemporal NUMERIC(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_dat_variablespagodestajotemporal_seq'::regclass),
    identidad NUMERIC(19,0) NOT NULL,
    montobrigada TEXT  NOT NULL,
    coeficiente TEXT,
    salariocalculado TEXT  NOT NULL,
    idplantillanominal NUMERIC(19,0) NOT NULL,
    CONSTRAINT pk_datvariablespagodestajotemporal PRIMARY KEY (idvariablespagodestajotemporal)  
)