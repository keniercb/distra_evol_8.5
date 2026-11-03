-- Sequence: mod_nomina.sec_dat_variablespagodestajo_seq

-- DROP SEQUENCE mod_nomina.sec_dat_variablespagodestajo_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_dat_variablespagodestajo_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_dat_variablespagodestajo_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_variablespagodestajo_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_variablespagodestajo_seq TO zeolides;

-- Table: mod_nomina.dat_variablespagodestajo

-- DROP TABLE mod_nomina.dat_variablespagodestajo;
CREATE TABLE IF NOT EXISTS mod_nomina.dat_variablespagodestajo
(
    idvariablespagodestajo NUMERIC(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_dat_variablespagodestajo_seq'::regclass),
  	idnomtipodestajo NUMERIC(19,0) NOT NULL,
    identidad NUMERIC(19,0) NOT NULL,
    datos TEXT NULL,
    periodo VARCHAR(40),
    CONSTRAINT pk_datvariablespagodestajo PRIMARY KEY (idvariablespagodestajo)  
)