ALTER TABLE mod_logtaller.conf_actividad
  ALTER COLUMN minimo DROP DEFAULT;

  ALTER TABLE mod_logtaller.conf_actividad
  ALTER COLUMN maximo DROP DEFAULT;

  ALTER TABLE mod_logtaller.conf_actividad
  ALTER COLUMN porcentual SET DEFAULT 0;
  
ALTER TABLE mod_logtaller.conf_actividad
  ALTER COLUMN modificado SET DEFAULT 0;