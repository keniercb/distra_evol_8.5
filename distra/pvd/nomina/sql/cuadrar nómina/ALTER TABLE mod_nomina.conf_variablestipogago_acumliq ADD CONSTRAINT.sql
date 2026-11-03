ALTER TABLE IF EXISTS mod_nomina.conf_variablestipogago_acumliq DROP CONSTRAINT IF EXISTS ak_restriccion;

ALTER TABLE IF EXISTS mod_nomina.conf_variablestipogago_acumliq
    ADD CONSTRAINT ak_restriccion UNIQUE (acumulaliquida, idtiponomina, idtipopago, idestructura, idnomina);
