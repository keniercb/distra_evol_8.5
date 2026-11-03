-- FUNCTION: mod_nomina.f_ajustarsubmayor_identidad(numeric)

-- DROP FUNCTION IF EXISTS mod_nomina.f_ajustarsubmayor_identidad(numeric);

CREATE OR REPLACE FUNCTION mod_nomina.f_ajustarsubmayor_identidad(
	p_identidad numeric)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	v_carga_inicial_persona record;
	v_datos_hisvacaciones record;
    v_datos_deserializados record;
	v_variables record;

	v_vac_acum_d numeric(19,2):=0.00;
	v_vac_acum_i numeric(19,2):=0.00;
	v_calculo_saldoentiempo numeric(19,2):=0.00;
	v_calculo_saldoenimporte numeric(19,2):=0.00;

	v_anterior_calculo_saldoentiempo numeric(19,2):=0.00;
	v_anterior_calculo_saldoenimporte numeric(19,2):=0.00;

	sql_text TEXT;
	nuevo_nombre text;
	v_nominas numeric[];

BEGIN
 IF p_identidad IS NULL THEN
        RAISE EXCEPTION 'Parámetros identidad es obligatorio.!!!';
    END IF;
--raise notice 'Actualizado configuración de las variables pertenecientes a los tipos de pago en la entidad.';

--Guardar las variables configuradas
INSERT INTO mod_nomina.conf_variablestipogago_acumliq(
	denominacion, acumulaliquida, idtiponomina, idtipopago, idestructura)
(with tipos_pagos_hisvac as (select distinct dep.idtipopago
									from mod_nomina.his_vacacionespersona as hvp
									inner join mod_nomina.dat_nomina as dn on (hvp.idnomina = dn.idnomina)
									inner join mod_nomina.dat_elaborarpagos as dep on (dep.idelaborarpagos = dn.idelaborarpago)
							)									
SELECT emn.denominacion, emn.acumulaliquida, emn.idtiponomina, mn.idtipopago, emne.idestructura
        FROM mod_nomina.conf_estructuramodelosnomina AS emn
        INNER JOIN mod_nomina.conf_estructuramodelosnominaentidad AS emne 
            ON (emn.idestructuramodelodomina = emne.idestructuramodelodomina)
        INNER JOIN mod_nomina.conf_modelonomina AS mn 
            ON (mn.idtiponomina = emn.idtiponomina)
	inner join tipos_pagos_hisvac as tphv on (mn.idtipopago = tphv.idtipopago)
        WHERE emne.idestructura = p_identidad
            AND emn.acumulaliquida <> 0
        ORDER BY mn.idtipopago, emn.idtiponomina, emn.acumulaliquida
) on conflict (acumulaliquida, idtiponomina, idtipopago, idestructura) do nothing
	--update set denominacion = excluded.denominacion
	;

--verificar cambios de variables pendientes array_agg(idnomina) as nominas_pendientes
SELECT array_agg(idnomina) into v_nominas FROM mod_nomina.dat_nominadatos_json
	where identidad = p_identidad and datos_json::jsonb -> 0 ? 'VariableAcumI' = false;
--raise notice 'v_nominas: %', v_nominas;

if (v_nominas is not null) then
	for v_variables in ( select * from mod_nomina.conf_variablestipogago_acumliq where idestructura = p_identidad )
			loop
				if(v_variables.acumulaliquida = 1)then
					nuevo_nombre := 'VariableAcumD';
				else
					nuevo_nombre := 'VariableAcumI';        
				end if;
		    	sql_text := 'UPDATE mod_nomina.dat_nominadatos_json ' ||
		                    'SET datos_json = replace(datos_json::text, $1, $2)::json ' ||
		                    'WHERE identidad = $3 and idnomina = any($4)';
				execute sql_text using v_variables.denominacion, nuevo_nombre, p_identidad, v_nominas;
				nuevo_nombre := '';
			end loop;
end if;

<<ciclo_externo>>  -- ETIQUETA para el ciclo exterior
for v_carga_inicial_persona in (select idvacacionespersona, idpersona, identidad, 
										tiempoacumuladoinicial, importeacumuladoinicial	 
									from mod_nomina.dat_vacacionespersona 
									where identidad = p_identidad)
loop
	--obtener datos his_vacacionespersona del v_carga_inicial_persona.idvacacionespersona
	 <<ciclo_interno>>  -- ETIQUETA para el ciclo interior
	for v_datos_hisvacaciones in (select ROW_NUMBER() OVER (ORDER BY hvp.idhisvacacionespersona) as row_num,
										hvp.idhisvacacionespersona, hvp.idvacacionespersona, 
										hvp.idnomina, hvp.tipooperacion, 
										hvp.ajusteimporte, hvp.ajustetiempo, 
										hvp.tipoajuste, --(1- suma, 2- resta)
										dep.idtipopago
									from mod_nomina.his_vacacionespersona as hvp
									inner join mod_nomina.dat_nomina as dn on (hvp.idnomina = dn.idnomina)
									inner join mod_nomina.dat_elaborarpagos as dep on (dep.idelaborarpagos = dn.idelaborarpago)
									inner join mod_nomina.nom_tipopago as ntp on (ntp.idtipopago = dep.idtipopago)
									where idvacacionespersona = v_carga_inicial_persona.idvacacionespersona
		 						)
	loop 
		--limpiar para obtener de la nómina
		v_vac_acum_d := 0.00;
		v_vac_acum_i := 0.00;

	with w_contenido as ( SELECT 
    						idnomina,							
    						(json_array_elements(datos_json::json)->>'idpersona') as idpersona,
    						(json_array_elements(datos_json::json)->>'VariableAcumD')::numeric as vacacumd,
    						(json_array_elements(datos_json::json)->>'VariableAcumI')::numeric as vacacumi
							FROM mod_nomina.dat_nominadatos_json
							WHERE idnomina::numeric = v_datos_hisvacaciones.idnomina
						)
	select	COALESCE (ABS(vacacumd::numeric(19,2)),0.00) as vac_acum_d,
			COALESCE (ABS(vacacumi::numeric(19,2)),0.00) as vac_acum_i
			into v_datos_deserializados 
	from w_contenido where idpersona::numeric = v_carga_inicial_persona.idpersona;

	IF v_datos_deserializados IS NULL THEN
    	RAISE WARNING 'No se encontraron datos deserializados para persona % en nómina %', 
        v_carga_inicial_persona.idpersona, v_datos_hisvacaciones.idnomina;
    	CONTINUE; -- Saltar a la siguiente iteración
	END IF;
	--siempre obtener de la nómina
	v_vac_acum_d:=v_datos_deserializados.vac_acum_d;
	v_vac_acum_i:=v_datos_deserializados.vac_acum_i;
	if(v_datos_hisvacaciones.row_num = 1)then
			--primer registro del histórico
			--verificar operación
		if(v_datos_hisvacaciones.tipooperacion = 1) then
			--Acumulación (+)
			v_calculo_saldoentiempo:=(v_carga_inicial_persona.tiempoacumuladoinicial + v_datos_deserializados.vac_acum_d);
			v_calculo_saldoenimporte:=(v_carga_inicial_persona.importeacumuladoinicial + v_datos_deserializados.vac_acum_i);
		else
			--Liquidación (-) /*Verificar los signos en la operación*/
			v_calculo_saldoentiempo:=(v_carga_inicial_persona.tiempoacumuladoinicial - v_datos_deserializados.vac_acum_d);
			v_calculo_saldoenimporte:=(v_carga_inicial_persona.importeacumuladoinicial - v_datos_deserializados.vac_acum_i);
		end if;

			--Verificar tipo de ajuste
		if(v_datos_hisvacaciones.tipoajuste is not null)then
			if(v_datos_hisvacaciones.tipoajuste = 1) then
				--Suma (+)
				v_calculo_saldoentiempo:=(v_calculo_saldoentiempo + v_datos_hisvacaciones.ajustetiempo);
				v_calculo_saldoenimporte:=(v_calculo_saldoenimporte + v_datos_hisvacaciones.ajusteimporte);
			else
				--Resta 
				v_calculo_saldoentiempo:=(v_calculo_saldoentiempo - v_datos_hisvacaciones.ajustetiempo);
				v_calculo_saldoenimporte:=(v_calculo_saldoenimporte - v_datos_hisvacaciones.ajusteimporte);
			end if;
		end if;

	elsif(v_datos_hisvacaciones.row_num > 1) then
			--Otras nóminas del submayor
			--verificar operación
		if(v_datos_hisvacaciones.tipooperacion = 1) then
			--Acumulación (+)
			v_calculo_saldoentiempo:=(v_anterior_calculo_saldoentiempo + v_datos_deserializados.vac_acum_d);
			v_calculo_saldoenimporte:=(v_anterior_calculo_saldoenimporte + v_datos_deserializados.vac_acum_i);
		else
			--Liquidación (-) /*Verificar los signos en la operación*/
			v_calculo_saldoentiempo:=(v_anterior_calculo_saldoentiempo - v_datos_deserializados.vac_acum_d);
			v_calculo_saldoenimporte:=(v_anterior_calculo_saldoenimporte - v_datos_deserializados.vac_acum_i);
		end if;

		--Verificar tipo de ajuste
		if(v_datos_hisvacaciones.tipoajuste is not null)then
			if(v_datos_hisvacaciones.tipoajuste = 1) then
				--Suma (+)
				v_calculo_saldoentiempo:=(v_calculo_saldoentiempo + v_datos_hisvacaciones.ajustetiempo);
				v_calculo_saldoenimporte:=(v_calculo_saldoenimporte + v_datos_hisvacaciones.ajusteimporte);
			else
				--Resta 
				v_calculo_saldoentiempo:=(v_calculo_saldoentiempo - v_datos_hisvacaciones.ajustetiempo);
				v_calculo_saldoenimporte:=(v_calculo_saldoenimporte - v_datos_hisvacaciones.ajusteimporte);
			end if;
		end if;
	else
		raise exception 'Nuevo caso row_num = 1: v_datos_hisvacaciones.idnomina = %',v_datos_hisvacaciones.idnomina; --eliminar luego
	end if;
--raise notice 'v_datos_hisvacaciones.idhisvacacionespersona: %, v_carga_inicial_persona.idpersona: %',v_datos_hisvacaciones.idhisvacacionespersona, v_carga_inicial_persona.idpersona;
	update mod_nomina.his_vacacionespersona
		set 
		tiempoacumulado = v_vac_acum_d, 
		importeacumulado = v_vac_acum_i, 
		saldoentiempo = v_calculo_saldoentiempo,
		saldoenimporte = v_calculo_saldoenimporte
	where idhisvacacionespersona = v_datos_hisvacaciones.idhisvacacionespersona;

	v_anterior_calculo_saldoentiempo:=v_calculo_saldoentiempo;
	v_anterior_calculo_saldoenimporte:=v_calculo_saldoenimporte;
end loop;

v_vac_acum_d :=0.00;
v_vac_acum_i :=0.00;

v_calculo_saldoentiempo :=0.00;
v_calculo_saldoenimporte :=0.00;

v_anterior_calculo_saldoentiempo :=0.00;
v_anterior_calculo_saldoenimporte :=0.00;

end loop;

return 'Ajuste terminado. Verificar el (Gestionar submayor de vacaciones)';
END;
$BODY$;

ALTER FUNCTION mod_nomina.f_ajustarsubmayor_identidad(numeric)
    OWNER TO zeolides;
