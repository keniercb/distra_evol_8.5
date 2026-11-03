ALTER TABLE mod_logtaller.conf_talleres
  ADD COLUMN ordenproducto NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_logtaller.conf_talleres.ordenproducto
IS '''Orden en que se muestran los productos en las interfaces, 1- por codigo, 2- por  denominacion, 3 -por orden de insercion de los productos, 4- por numeropieza, 5- por naturaleza.''';