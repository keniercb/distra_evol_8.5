UPDATE mod_logistica.his_bitacora
	SET fecha=(substr(split_part(fecha::text,'-',1),0,3)||split_part(fecha::text,'-',3)
		||'-'||split_part(fecha::text,'-',2)
	    ||'-'||substr(split_part(fecha::text,'-',1),3,5))::date;
