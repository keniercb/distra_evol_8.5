with t_ultima_baja_ft as (select dpe.idpersona, max(dsl.idsituacionlaboralp) as m_idsituacionlaboralp,
				ddi.numero, case when dp.snombre is not null then dp.nombre ||' '|| dp.snombre ||' '|| dp.papel ||' '|| dp.sapel 
								else dp.nombre ||' '|| dp.papel ||' '|| dp.sapel
							end as nombre, nc.denominacion as denomcargo, 
				nslp.denominacion as denomsituacion, cpn.idplantillanominal, 
				cpn.denominacion as denomplantilla, nfe.ordenunico
		from mod_persona.dat_persona dp
		left  join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona)
		inner join mod_persona.dat_personaentidad dpe on (dp.idpersona = dpe.idpersona)
		inner join mod_persona.dat_situacionlaboral dsl on (dsl.idpersonaentidad = dpe.idpersonaentidad)
		inner join mod_persona.nom_situacion nslp on (nslp.idsituacion = dsl.idsituacion)
		inner join mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dsl.idcargo )
		inner join mod_estructuracomp.dat_cargo dc on (dc.idcargo = nfe.idfila and dc.idproyecto = 0)
		left  join mod_estructuracomp.nom_cargo nc on dc.idnomcargo = nc.idnomcargo
		inner join mod_nomina.dat_cargosocupados dco on (dsl.idcargo = dco.idcargo and dp.idpersona = dco.idpersona)
		left  join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
		left  join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal)
		where dpe.identidad = $identidad and dsl.estado = 2
			and dpe.fhasta is not null
	 		and dsl.fhasta is not null
			and ( nfe.fechafin is null or nfe.fechafin >= now() )
		group by dpe.idpersona, ddi.numero, dp.snombre, dp.nombre, 
					dp.papel, dp.sapel, nc.denominacion, nslp.denominacion,
					cpn.idplantillanominal, cpn.denominacion, nfe.ordenunico
		order by nfe.ordenunico, dpe.idpersona asc),
	t_altas_ft as (select distinct dpe.idpersona from mod_persona.dat_persona dp
			inner join mod_persona.dat_personaentidad dpe on (dp.idpersona = dpe.idpersona)
			inner join mod_persona.dat_situacionlaboral dsl on (dsl.idpersonaentidad = dpe.idpersonaentidad)
			inner join mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila=dsl.idcargo)
			inner join mod_estructuracomp.dat_cargo dc on (dc.idcargo = nfe.idfila and dc.idproyecto = 0)
			where dpe.identidad = $identidad and dsl.estado = 0
				and dpe.fhasta is null or dpe.fhasta >= now()
				and dsl.fhasta is null or dsl.fhasta >= now()
				and (nfe.fechafin is null or nfe.fechafin >= now() )			
			)
select 
	ultima_baja_ft.idpersona as idpersona_baja, dc.idcargo, 
	ultima_baja_ft.numero, ultima_baja_ft.nombre, ultima_baja_ft.denomcargo, 
	ultima_baja_ft.denomsituacion, ultima_baja_ft.idplantillanominal,
	ultima_baja_ft.denomplantilla, ultima_baja_ft.ordenunico
from t_ultima_baja_ft as ultima_baja_ft 	
inner join mod_persona.dat_situacionlaboral dsl on (dsl.idsituacionlaboralp = ultima_baja_ft.m_idsituacionlaboralp)
inner join mod_estructuracomp.dat_cargo dc on (dc.idcargo = dsl.idcargo)
left join t_altas_ft as altas_ft on (altas_ft.idpersona = ultima_baja_ft.idpersona)
where altas_ft.idpersona is null
	and ultima_baja_ft.idpersona in ( select distinct dco.idpersona from mod_persona.dat_persona dp
										inner join mod_persona.dat_personaentidad dpe on (dp.idpersona = dpe.idpersona)
										inner join mod_persona.dat_situacionlaboral dsl on (dsl.idpersonaentidad = dpe.idpersonaentidad)
										inner join mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dsl.idcargo)
										inner join mod_estructuracomp.dat_cargo dc on (dc.idcargo = nfe.idfila and dc.idproyecto = 0)
										inner join mod_nomina.dat_cargosocupados dco on (dsl.idcargo = dco.idcargo and dp.idpersona = dco.idpersona)
										where dpe.identidad = $identidad
											and (nfe.fechafin is null or nfe.fechafin >= now() )
									)
order by ultima_baja_ft.ordenunico