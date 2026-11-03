-- DROP TABLE IF EXISTS mod_nomina.dat_nominadatos_json;
CREATE TABLE IF NOT EXISTS mod_nomina.dat_nominadatos_json
(
    idnomina numeric NOT NULL,
    datos_json jsonb,
    identidad numeric(19,0) NOT NULL,
    CONSTRAINT dat_nominadatos_json_pkey PRIMARY KEY (idnomina)
)
WITH (OIDS = FALSE) TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_nomina.dat_nominadatos_json OWNER to zeolides;
COMMENT ON COLUMN mod_nomina.dat_nominadatos_json.idnomina IS 'Identificador de la nómina.';
COMMENT ON COLUMN mod_nomina.dat_nominadatos_json.datos_json IS 'Datos de la nómina.';
COMMENT ON COLUMN mod_nomina.dat_nominadatos_json.identidad IS 'Identificador de la estructura.';
