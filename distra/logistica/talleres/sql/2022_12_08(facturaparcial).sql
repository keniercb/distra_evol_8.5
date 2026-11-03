ALTER TABLE mod_logtaller.dat_ordenactividad
ADD COLUMN IF NOT EXISTS pendiente NUMERIC(25,6) DEFAULT 0;

ALTER TABLE mod_logtaller.dat_ordenactividad
ADD COLUMN IF NOT EXISTS enproceso NUMERIC(25,6) DEFAULT 0;

ALTER TABLE mod_logtaller.dat_ordenactividad
ADD COLUMN IF NOT EXISTS facturado NUMERIC(25,6) DEFAULT 0;

ALTER TABLE mod_logtaller.dat_material
ADD COLUMN IF NOT EXISTS pendiente NUMERIC(25,6) DEFAULT 0;

ALTER TABLE mod_logtaller.dat_material
ADD COLUMN IF NOT EXISTS enproceso NUMERIC(25,6) DEFAULT 0;

ALTER TABLE mod_logtaller.dat_material
ADD COLUMN IF NOT EXISTS facturado NUMERIC(25,6) DEFAULT 0;