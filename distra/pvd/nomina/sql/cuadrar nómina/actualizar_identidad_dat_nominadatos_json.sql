update mod_nomina.dat_nominadatos_json
	set identidad=consulta.identidad
from (select hvp.idnomina, dvp.identidad
		from mod_nomina.dat_vacacionespersona as dvp
		inner join mod_nomina.his_vacacionespersona as hvp on (hvp.idvacacionespersona = dvp.idvacacionespersona)
	) as consulta
where mod_nomina.dat_nominadatos_json.idnomina = consulta.idnomina;
