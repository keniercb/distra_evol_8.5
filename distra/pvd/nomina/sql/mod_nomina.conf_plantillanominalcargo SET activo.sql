UPDATE mod_nomina.conf_plantillanominalcargo SET activo = true;

UPDATE mod_nomina.conf_plantillanominalcargo SET activo = false
where idcargo in (SELECT idcargo FROM mod_estructuracomp.v_get_cargos_eliminados);
