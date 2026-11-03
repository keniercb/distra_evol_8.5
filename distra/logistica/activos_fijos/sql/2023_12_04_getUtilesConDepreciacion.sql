--Modificación de la consulta del método getUtilesConDepreciacion
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA public;
CREATE INDEX IF NOT EXISTS ix_trgm_concatcta_n_cuenta
    ON mod_contabilidad.nom_cuenta USING gin
    (concatcta gin_trgm_ops);

select * from (
-- util (nroinventario is null) con cgc.idcuentadepreciacion is not null (162 filas pro sasa)
-- nc.concatcta like '187.%'	
with w_utiles as (select rna.idregnumerico as idregistro_util, rna.tasafiscal, p.idestructura, p.idestructuracomun, 
				  		rna.idresponsable, i.idnaturaleza, i.numeropieza, i.codigo, i.denominacion, g.denominacion as grupo,
				  		rna.nroinventario
					from mod_logactivofijotangible.dat_registronumerico rn
					inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
					inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
					inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
					inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
					left join mod_datosmaestros.nom_gruposubgrupo g on (g.idgruposubgrupo = ih.idgruposubgrupo)
					left join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = g.idgruposubgrupo and cgc.idestructura = p.idestructuracomun)
					left join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
				  	where nc.concatcta like '187.%' and cgc.idcuentadepreciacion is not null
				 )
(select distinct 'UTILES CON CUENTA DE DEPRECIACION' as agrupador,
		coalesce(utiles.numeropieza, utiles.codigo) as codigo,
		utiles.denominacion,
 		utiles.numeropieza,
	    coalesce(e.denominacion, eop.denominacion) as estructura,
        coalesce(ea.denominacion, eopa.denominacion) as area,                
		(pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
        utiles.denominacion as grupo,
        utiles.tasafiscal,
        n.denominacion as naturaleza,
 		utiles.nroinventario
from w_utiles as utiles --122
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = utiles.idestructuracomun
left join mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
left join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0

inner join mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = utiles.idestructura
left join mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
left join mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

left join mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = utiles.idresponsable
left join mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
left join mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = utiles.idnaturaleza
)

union

-- activo (nroinventario is not null) con ih.explotacion = 1 and ih.isuh = 1 (11712 filas)
-- nc.concatcta not like '187.%'	
(with w_activos as (select rna.idregnumerico as idregistro_activo, rna.tasafiscal, p.idestructura, p.idestructuracomun,
				  		rna.idresponsable, i.idnaturaleza, i.numeropieza, i.codigo, i.denominacion, g.denominacion as grupo,
						rna.nroinventario
				  	from mod_logactivofijotangible.dat_registronumerico rn
					inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
					inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
					inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
					inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
					left join mod_datosmaestros.nom_gruposubgrupo g on (g.idgruposubgrupo = ih.idgruposubgrupo)
					left join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = g.idgruposubgrupo and cgc.idestructura = p.idestructuracomun)
					left join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
				  	where nc.concatcta not like '187.%' and (ih.explotacion = 1 and ih.isuh = 1)
				 )
(select distinct 'ACTIVOS MARCADOS COMO UH' as agrupador,
		coalesce(activos.numeropieza, activos.codigo) as codigo,
		activos.denominacion,
 		activos.numeropieza,
	    coalesce(e.denominacion, eop.denominacion) as estructura,
        coalesce(ea.denominacion, eopa.denominacion) as area,                
		(pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
        activos.denominacion as grupo,
        activos.tasafiscal,
        n.denominacion as naturaleza,
 		activos.nroinventario
from w_activos as activos --122
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = activos.idestructuracomun
left join mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
left join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0

inner join mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = activos.idestructura
left join mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
left join mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

left join mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = activos.idresponsable
left join mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
left join mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = activos.idnaturaleza
)
)
	
) as recuperacion
