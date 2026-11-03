ALTER TABLE mod_logtaller.conf_actividad
  ALTER COLUMN minimo TYPE NUMERIC(19,2);

ALTER TABLE mod_logtaller.conf_actividad
  ALTER COLUMN maximo TYPE NUMERIC(19,2);
  
ALTER TABLE mod_logtaller.conf_actividad
  DROP COLUMN medida;

ALTER TABLE mod_logtaller.conf_actividad
  ADD COLUMN medida NUMERIC(19,0);