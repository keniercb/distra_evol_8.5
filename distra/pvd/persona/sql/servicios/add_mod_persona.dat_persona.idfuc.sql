ALTER TABLE IF EXISTS mod_persona.dat_persona
    ADD COLUMN IF NOT EXISTS idfuc character varying(32) COLLATE pg_catalog."default";
COMMENT ON COLUMN mod_persona.dat_persona.idfuc
    IS 'Identificador de la integración con la Ficha Única del Ciudadano (FUC).';
