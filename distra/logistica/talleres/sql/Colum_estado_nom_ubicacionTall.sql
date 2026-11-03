ALTER TABLE IF EXISTS mod_logtaller.nom_ubicaciontall
    ADD COLUMN IF NOT EXISTS estado numeric(1,0) NOT NULL DEFAULT 1;
