-- Sequence: mod_nomina.sec_dat_convenios_seq

-- DROP SEQUENCE mod_nomina.sec_dat_convenios_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_dat_convenios_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_dat_convenios_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_convenios_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_convenios_seq TO zeolides;

-- Table: mod_nomina.dat_convenios

-- DROP TABLE mod_nomina.dat_convenios;
CREATE TABLE IF NOT EXISTS mod_nomina.dat_convenios
(
    idconvenio numeric NOT NULL DEFAULT nextval('mod_nomina.sec_dat_convenios_seq'::regclass),
  	denominacion VARCHAR(100) NOT NULL,
    obra VARCHAR(100),
    importe NUMERIC(19,2) NOT NULL,
    fechainicio DATE NOT NULL,
    fechafin DATE,
    descripcion VARCHAR(255),
    idplantillanominal NUMERIC(19,0) NOT NULL,
    identidad NUMERIC(19,0),
    idnomtipodestajo NUMERIC(19,0),
    fechainicioperiodo DATE NOT NULL,
    fechafinperiodo DATE NOT NULL,
    CONSTRAINT pk_datconvenios PRIMARY KEY (idconvenio)  
)