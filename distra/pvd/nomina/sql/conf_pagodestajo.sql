-- Sequence: mod_nomina.sec_conf_pagodestajo_seq

-- DROP SEQUENCE mod_nomina.sec_conf_pagodestajo_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_conf_pagodestajo_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_conf_pagodestajo_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_conf_pagodestajo_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_conf_pagodestajo_seq TO zeolides;

-- Table: mod_nomina.conf_pagodestajo

-- DROP TABLE mod_nomina.conf_pagodestajo;
CREATE TABLE IF NOT EXISTS mod_nomina.conf_pagodestajo
(
    idconfpagodestajo numeric NOT NULL DEFAULT nextval('mod_nomina.sec_conf_pagodestajo_seq'::regclass),
  	denominacion VARCHAR(100) NOT NULL,
    tipoentrada VARCHAR(100) NOT NULL,
    entrada VARCHAR(100) NOT NULL,
    idformula NUMERIC(19,0) NOT NULL,
    identidad NUMERIC(19,0) NOT NULL,
    orden NUMERIC(19,0) NOT NULL,
    descripcion VARCHAR(255),
    CONSTRAINT pk_confpagodestajo PRIMARY KEY (idconfpagodestajo)  
)