WITH 
	datos_laborales_actual
	AS ( SELECT identificador, documento_identidad, 
				primer_nombre, segundo_nombre, primer_apellido, 
				segundo_apellido, nombre_completo, 
				fecha_alta_entidad, entidad, unidad_basica, 
				area, cargo, idcargo, tipo_de_contrato, situacion_laboral
			FROM mod_fuerzatrabajo.v_get_datoslaboralescontractuales
			--WHERE identificador in (9000000001699,9000000001932,10189133) --- filtro de personas
		),
	asistencia_cargo_viejo 
	AS ( SELECT da.idasistencia, da.idpersona, da.idcargo, 
				nc.denominacion as cargo, da.observacion,
				da.fecharegistro, da.idgrupodescanso, 
				dla.idcargo as idcargonuevo,
				ncn.denominacion as cargonuevo
			FROM mod_regimentrabajo.dat_asistencia as da
			--cargo viejo
			INNER JOIN mod_estructuracomp.dat_cargo as dc on (da.idcargo = dc.idcargo)
			INNER JOIN mod_estructuracomp.nom_cargo as nc on (nc.idnomcargo = dc.idnomcargo)
			LEFT JOIN datos_laborales_actual as dla on (dla.identificador = da.idpersona)
			--cargo nuevo
			LEFT JOIN mod_estructuracomp.dat_cargo as dcn on (dla.idcargo = dcn.idcargo)
			LEFT JOIN mod_estructuracomp.nom_cargo as ncn on (ncn.idnomcargo = dcn.idnomcargo)
			WHERE da.idpersona = dla.identificador
			AND da.fecharegistro >= $FECHA--'01-01-2026' ---parámetro
			AND da.idcargo <> dla.idcargo
		)
UPDATE mod_regimentrabajo.dat_asistencia 
	SET observacion = 'Cambio de cargo al registro (vía sql), detalles: '
						||chr(10)||'Cargo anterior'
						||chr(10)||'idcargo: '||acv.idcargo
						||chr(10)||'cargo: '||acv.cargo	
						||chr(10)||chr(10)||'Cargo nuevo'
						||chr(10)||'idcargo: '||acv.idcargonuevo
						||chr(10)||'cargo: '||acv.cargonuevo	
		, idcargo = acv.idcargonuevo
  FROM asistencia_cargo_viejo AS acv
  WHERE mod_regimentrabajo.dat_asistencia.idasistencia = acv.idasistencia;
