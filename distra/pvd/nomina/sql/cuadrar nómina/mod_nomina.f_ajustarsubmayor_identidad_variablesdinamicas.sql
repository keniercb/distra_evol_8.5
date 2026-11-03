CREATE OR REPLACE FUNCTION mod_nomina.f_ajustarsubmayor_identidad(
	p_identidad numeric--, p_idtipopagosalario numeric,p_idtipopagovac numeric
	)
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
	v_calculo_tiempoacumulado numeric(19,2):=0.00;
	v_calculo_importeacumulado numeric(19,2):=0.00;

	v_vac_acum_d numeric(19,2):=0.00;
	v_vac_acum_i numeric(19,2):=0.00;
	v_calculo_saldoentiempo numeric(19,2):=0.00;
	v_calculo_saldoenimporte numeric(19,2):=0.00;

	v_anterior_calculo_saldoentiempo numeric(19,2):=0.00;
	v_anterior_calculo_saldoenimporte numeric(19,2):=0.00;

	v_deserializada BOOLEAN;
	sql_text TEXT;
	nuevo_nombre text;

BEGIN

/* --nombre dinámicos de las variebles de la nómina
select lower(emn.denominacion) as denominacion,emn.acumulaliquida,emn.idtiponomina, mn.idtipopago
from mod_nomina.conf_estructuramodelosnomina as emn
inner join mod_nomina.conf_estructuramodelosnominaentidad as emne on (emn.idestructuramodelodomina = emne.idestructuramodelodomina)
inner join mod_nomina.conf_modelonomina as mn on (mn.idtiponomina = emn.idtiponomina)
where emne.idestructura = 200531368 
	--and emn.idtiponomina = 72 --11 vacaciones, 10 salario, 72 pxr
	and emn.acumulaliquida <> 0
	and mn.idtipopago = 37
order by emn.acumulaliquida
*/
/*	
 IF p_identidad IS NULL OR p_idtipopagosalario IS NULL OR p_idtipopagovac IS NULL THEN
        RAISE EXCEPTION 'Parámetros inválidos: identidad=%, idtipopagosalario=%, idtipopagovac=%', 
            p_identidad, p_idtipopagosalario, p_idtipopagovac;
    END IF;
*/
raise notice 'Ajustando la entidad: %',p_identidad;
<<ciclo_externo>>  -- ETIQUETA para el ciclo exterior
for v_carga_inicial_persona in (select idvacacionespersona, idpersona, identidad, 
										tiempoacumuladoinicial, importeacumuladoinicial	 
									from mod_nomina.dat_vacacionespersona 
	where identidad = p_identidad and idvacacionespersona = 11227
	--and idpersona = XXXX --solo persona especificada
	)
loop
	raise notice 'v_carga_inicial_persona: %',v_carga_inicial_persona.idvacacionespersona;
	--raise notice 'Persona: %',v_carga_inicial_persona.idpersona;
	--auxiliares
	--obtener datos his_vacacionespersona del v_carga_inicial_persona.idvacacionespersona
	 <<ciclo_interno>>  -- ETIQUETA para el ciclo interior
	for v_datos_hisvacaciones in (select ROW_NUMBER() OVER (ORDER BY hvp.idhisvacacionespersona) as row_num,
										hvp.idhisvacacionespersona, hvp.idvacacionespersona, 
										hvp.idnomina, dn.numeronomina,
										hvp.tipooperacion, 
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
	raise notice 'idnomina: % ',v_datos_hisvacaciones.idnomina;
		--limpiar para obtener de la nómina
		v_vac_acum_d := 0.00;
		v_vac_acum_i := 0.00;
		--verificar que la nómina está deserializada por PHP, sino aplicar la deserialización via sql.	
		SELECT EXISTS(select 1 from mod_nomina.dat_nominadatos_json
						where idnomina::numeric = v_datos_hisvacaciones.idnomina) INTO v_deserializada;
		if (v_datos_hisvacaciones.idnomina = 46967) then
    		raise notice 'idnomina: % v_deserializada: %',v_datos_hisvacaciones.idnomina,v_deserializada;
		end if;
    	IF NOT v_deserializada THEN
        	RAISE NOTICE 'El ID % no existe en la tabla', v_datos_hisvacaciones.idnomina;
			RAISE NOTICE 'Aplicando deserialización vía sql...';
			perform from mod_nomina.deserializar_nominas_lista(array[v_datos_hisvacaciones.idnomina]);
			RAISE NOTICE 'Guardando en formato JSON...';

			INSERT INTO mod_nomina.dat_nominadatos_json(idnomina, datos_json)
			( SELECT v_datos_hisvacaciones.idnomina as idn, json_agg(row_to_json(t))
  				FROM ( select * from tmp_nomina ) t
			)ON CONFLICT (idnomina) 
				DO UPDATE SET datos_json = EXCLUDED.datos_json;

			RAISE NOTICE 'Modificando las claves a (VacAcumD,VacAcumI,DiasPagar,TBDVac)...';		
			update mod_nomina.dat_nominadatos_json
				set datos_json = replace(replace(replace(replace(datos_json::text
								, 'vacacumd', 'VacAcumD')
								, 'vacacumi', 'VacAcumI')
								, 'diaspagar', 'DiasPagar')
								, 'tbdvac', 'TBDVac')::json
			where idnomina = v_datos_hisvacaciones.idnomina;
    	END IF;
		--RAISE NOTICE 'Ajustando valores del submayor...';
-- datos deserializados
/*
select lower(emn.denominacion) as denominacion,emn.acumulaliquida,emn.idtiponomina, mn.idtipopago
from mod_nomina.conf_estructuramodelosnomina as emn
inner join mod_nomina.conf_estructuramodelosnominaentidad as emne on (emn.idestructuramodelodomina = emne.idestructuramodelodomina)
inner join mod_nomina.conf_modelonomina as mn on (mn.idtiponomina = emn.idtiponomina)
where emne.idestructura = 200531368 
	--and emn.idtiponomina = 72 --11 vacaciones, 10 salario, 72 pxr
	and emn.acumulaliquida <> 0
	and mn.idtipopago = 37
order by emn.acumulaliquida
*/

--nuevo
FOR v_variables IN 
        SELECT emn.denominacion, emn.acumulaliquida, emn.idtiponomina, mn.idtipopago
        FROM mod_nomina.conf_estructuramodelosnomina AS emn
        INNER JOIN mod_nomina.conf_estructuramodelosnominaentidad AS emne 
            ON (emn.idestructuramodelodomina = emne.idestructuramodelodomina)
        INNER JOIN mod_nomina.conf_modelonomina AS mn 
            ON (mn.idtiponomina = emn.idtiponomina)
        WHERE emne.idestructura = p_identidad 
            AND emn.acumulaliquida <> 0
            AND mn.idtipopago = v_datos_hisvacaciones.idtipopago
        ORDER BY emn.acumulaliquida
    LOOP
	raise notice 'v_variables.acumulaliquida: %',v_variables.acumulaliquida;
        if(v_variables.acumulaliquida = 1)then
			nuevo_nombre := 'VariableAcumD';
			-- Construir y ejecutar el UPDATE dinámico
	        sql_text := 'UPDATE mod_nomina.dat_nominadatos_json ' ||
	                    'SET datos_json = replace(datos_json::text, $1, $2)::json ' ||
	                    'WHERE idnomina = $3';
		else
			-- Construir y ejecutar el UPDATE dinámico
			nuevo_nombre := 'VariableAcumI';
	        sql_text := 'UPDATE mod_nomina.dat_nominadatos_json ' ||
	                    'SET datos_json = replace(datos_json::text, $1, $2)::json ' ||
	                    'WHERE idnomina = $3';	        
		end if;

		execute sql_text using v_variables.denominacion, nuevo_nombre, v_datos_hisvacaciones.idnomina;
		nuevo_nombre := '';
    END LOOP;

	--pago de salario, contiene VacAcumD, VacAcumI ---- 10 Pago de Salario (37)
	RAISE NOTICE 'Procesando nómina...';
	with w_contenido as ( SELECT 
    						idnomina,							
    						(json_array_elements(datos_json::json)->>'idpersona') as idpersona,
    						(json_array_elements(datos_json::json)->>'VariableAcumD')::numeric as vacacumd,
    						(json_array_elements(datos_json::json)->>'VariableAcumI')::numeric as vacacumi
							--, (json_array_elements(datos_json::json)->>'DiasPagar')::numeric as diaspagar
							--, (json_array_elements(datos_json::json)->>'TBDVac')::numeric as tbdvac
						FROM mod_nomina.dat_nominadatos_json
						WHERE idnomina::numeric = v_datos_hisvacaciones.idnomina
					)
			select	COALESCE (ABS(vacacumd::numeric(19,2)),0.00) as vac_acum_d,
					ABS(vacacumi::numeric(19,2)) as vac_acum_i
			into v_datos_deserializados from w_contenido where idpersona::numeric = v_carga_inicial_persona.idpersona;

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

	--limpiar las variables para la próxima persona (idvacacionespersona)
	v_calculo_tiempoacumulado :=0.00;
	v_calculo_importeacumulado :=0.00;

	v_vac_acum_d :=0.00;
	v_vac_acum_i :=0.00;

	v_calculo_saldoentiempo :=0.00;
	v_calculo_saldoenimporte :=0.00;

	v_anterior_calculo_saldoentiempo :=0.00;
	v_anterior_calculo_saldoenimporte :=0.00;

	--EXIT ciclo_externo WHEN v_carga_inicial_persona.idvacacionespersona = XXXXX;-- idvacacionespersona caso único
end loop;
return 'Ajuste terminado. Verificar el (Gestionar submayor de vacaciones)';
END;
$BODY$;

ALTER FUNCTION mod_nomina.f_ajustarsubmayor_identidad(numeric/*, numeric, numeric*/) OWNER TO zeolides;
