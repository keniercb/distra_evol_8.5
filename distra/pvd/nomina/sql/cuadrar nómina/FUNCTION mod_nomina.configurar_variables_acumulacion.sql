-- Función auxiliar para configurar variables
CREATE OR REPLACE FUNCTION mod_nomina.configurar_variables_acumulacion(p_identidad numeric)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
--Guardar las variables configuradas
insert into mod_nomina.conf_variablestipogago_acumliq( denominacion, acumulaliquida, idtiponomina, idtipopago, idestructura)
(with tipos_pagos_hisvac as (select distinct dep.idtipopago
								from mod_nomina.his_vacacionespersona as hvp
								inner join mod_nomina.dat_nomina as dn on (hvp.idnomina = dn.idnomina)
								inner join mod_nomina.dat_elaborarpagos as dep on (dep.idelaborarpagos = dn.idelaborarpago)
							)									
select emn.denominacion, emn.acumulaliquida, emn.idtiponomina, mn.idtipopago, emne.idestructura
from mod_nomina.conf_estructuramodelosnomina as emn
inner join mod_nomina.conf_estructuramodelosnominaentidad as emne on (emn.idestructuramodelodomina = emne.idestructuramodelodomina)
inner join mod_nomina.conf_modelonomina as mn on (mn.idtiponomina = emn.idtiponomina)
inner join tipos_pagos_hisvac as tphv on (mn.idtipopago = tphv.idtipopago)
where emne.idestructura = p_identidad and emn.acumulaliquida <> 0
order by mn.idtipopago, emn.idtiponomina, emn.acumulaliquida
) on conflict (acumulaliquida, idtiponomina, idtipopago, idestructura) do nothing;
END;
$$;
