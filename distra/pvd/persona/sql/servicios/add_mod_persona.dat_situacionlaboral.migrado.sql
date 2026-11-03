ALTER TABLE IF EXISTS mod_persona.dat_situacionlaboral
    ADD COLUMN IF NOT EXISTS migrado integer;
