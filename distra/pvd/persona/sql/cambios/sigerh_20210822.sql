ALTER TABLE mod_persona.dat_persona
    ADD CONSTRAINT uk_persona_idsuin UNIQUE (idsuin);
COMMENT ON CONSTRAINT uk_persona_idsuin ON mod_persona.dat_persona
    IS 'Llave de unicidad para la columna idsuin. Identificador del Sistema Único de Identificación Nacional.';