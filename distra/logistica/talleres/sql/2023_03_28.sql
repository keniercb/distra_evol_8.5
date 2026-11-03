ALTER TABLE IF EXISTS mod_logtaller.conf_actividad
    ADD COLUMN IF NOT EXISTS tempario numeric(19, 2);

ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividad
    ADD COLUMN IF NOT EXISTS tempario numeric(19, 2);