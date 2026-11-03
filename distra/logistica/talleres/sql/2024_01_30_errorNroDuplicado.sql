ALTER TABLE IF EXISTS mod_logtaller.dat_ordentrabajo
  ADD COLUMN IF NOT EXISTS iddoc NUMERIC(19,0);
  
ALTER TABLE IF EXISTS mod_logtaller.dat_ordentrabajo
  ADD COLUMN IF NOT EXISTS idestructuracomun NUMERIC(19,0);
    
ALTER TABLE IF EXISTS mod_logtaller.dat_ordentrabajo
  ADD COLUMN IF NOT EXISTS idejercicio NUMERIC(19,0);
  
ALTER TABLE IF EXISTS mod_logtaller.dat_ordentrabajo
  ADD COLUMN IF NOT EXISTS nrodoc NUMERIC(19,0);
  
ALTER TABLE IF EXISTS mod_logtaller.dat_ordentrabajo
  ADD COLUMN IF NOT EXISTS flag NUMERIC(19,0);
  
ALTER TABLE mod_logtaller.dat_ordentrabajo
  ALTER COLUMN flag SET DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS dat_ordentrabajo_idunique ON mod_logtaller.dat_ordentrabajo
  USING btree (iddoc, idestructuracomun, idejercicio, nrodoc, flag);