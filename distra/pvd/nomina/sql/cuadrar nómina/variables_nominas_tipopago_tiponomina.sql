with tipos_pagos_hisvac as (select distinct dep.idtipopago
									from mod_nomina.his_vacacionespersona as hvp
									inner join mod_nomina.dat_nomina as dn on (hvp.idnomina = dn.idnomina)
									inner join mod_nomina.dat_elaborarpagos as dep on (dep.idelaborarpagos = dn.idelaborarpago)
							)									
SELECT emn.denominacion, emn.acumulaliquida, emn.idtiponomina, mn.idtipopago
        FROM mod_nomina.conf_estructuramodelosnomina AS emn
        INNER JOIN mod_nomina.conf_estructuramodelosnominaentidad AS emne 
            ON (emn.idestructuramodelodomina = emne.idestructuramodelodomina)
        INNER JOIN mod_nomina.conf_modelonomina AS mn 
            ON (mn.idtiponomina = emn.idtiponomina)
	inner join tipos_pagos_hisvac as tphv on (mn.idtipopago = tphv.idtipopago)
        WHERE emne.idestructura = p_identidad --Argumento
            AND emn.acumulaliquida <> 0
        ORDER BY mn.idtipopago, emn.idtiponomina, emn.acumulaliquida;
