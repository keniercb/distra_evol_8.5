-- Sequence: mod_nomina.sec_dat_pagodestajo_seq

-- DROP SEQUENCE mod_nomina.sec_dat_pagodestajo_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_dat_pagodestajo_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_dat_pagodestajo_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_pagodestajo_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_dat_pagodestajo_seq TO zeolides;

-- Table: mod_nomina.dat_pagodestajo

-- DROP TABLE mod_nomina.dat_pagodestajo;
CREATE TABLE IF NOT EXISTS mod_nomina.dat_pagodestajo
(
    iddatpagodestajo NUMERIC(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_dat_pagodestajo_seq'::regclass),
  	idnomtipodestajo NUMERIC(19,0) NOT NULL,
    identidad NUMERIC(19,0) NOT NULL,
    datos TEXT NULL,
    fechainicio DATE NOT NULL,
    fechafin DATE NOT NULL,
    estado NUMERIC DEFAULT 0 NOT NULL,
    periodo VARCHAR(40),
    fechacierre DATE,  
    CONSTRAINT pk_datpagodestajo PRIMARY KEY (iddatpagodestajo)  
)