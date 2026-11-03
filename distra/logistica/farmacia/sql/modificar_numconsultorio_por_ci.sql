with numeros_identidad as (
select numero_ci
	from ( values ('76011666376'), /*('60111200808'),*/ ('60072913196'), ('21032361021') ) as numeros (numero_ci)
)
update mod_logfarmacia.dat_tarjetamedicamento
	set consultoriomedico = '000046'
from mod_logpuntoventa.dat_ventacliente dvc
WHERE dvc.numeroidentidad in (select numero_ci from numeros_identidad)
	and dat_tarjetamedicamento.idpaciente = dvc.idventacliente;
