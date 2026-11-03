-- Sequence: mod_nomina.sec_dat_personabrigada_seq

-- DROP SEQUENCE mod_nomina.sec_dat_personabrigada_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_dat_personabrigada_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_dat_personabrigada_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_personabrigada_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_personabrigada_seq TO zeolides;

-- Table: mod_nomina.dat_personabrigada

-- DROP TABLE mod_nomina.dat_personabrigada;
CREATE TABLE IF NOT EXISTS mod_nomina.dat_personabrigada
(
    idpersonabrigada numeric NOT NULL DEFAULT nextval('mod_nomina.sec_dat_personabrigada_seq'::regclass),
    idpersona NUMERIC(19,0) NOT NULL,
    idplantillanominal NUMERIC(19,0) NOT NULL,
    idgrupoescala NUMERIC(19,0) NULL,
    importe NUMERIC(19,2) NULL,
    trt NUMERIC(19,2) NULL,
    ft NUMERIC(19,2) NULL,
    evaluacion NUMERIC(19,2) NULL,
    salariotrt NUMERIC(19,2) NULL,
    salarioeval NUMERIC(19,2) NULL,
    montocobrar NUMERIC(19,2) NULL,
    identidad NUMERIC(19,0) NOT NULL,
    CONSTRAINT pk_datpersonabrigada PRIMARY KEY (idpersonabrigada)  
)