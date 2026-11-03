CREATE OR REPLACE FUNCTION mod_logactivofijotangible.fr_listadoregistronumerico (
  p_idestructura numeric,
  p_codigo varchar,
  p_denominacion varchar,
  p_idmarca numeric,
  p_idmodelo numeric,
  "p_incluirNaturalezas" varchar,
  p_nroserie varchar,
  p_nroinventario varchar,
  p_min_valorcontable numeric,
  p_max_valorcontable numeric,
  p_annofabricacion numeric,
  p_min_recursoconsumidomax numeric,
  p_max_recursoconsumidomax numeric,
  p_idcolorprim numeric,
  p_idcolorsec numeric,
  p_min_recursoconsumido numeric,
  p_max_recursoconsumido numeric,
  p_min_cantidadrecursoconsumido numeric,
  p_max_cantidadrecursoconsumido numeric,
  p_idactividad numeric,
  p_responsable varchar,
  p_idcategoria numeric,
  p_fechaadq date,
  p_fechaexpini date,
  p_fechaexpfin date,
  p_vidautil numeric,
  p_min_valoradquisicion numeric,
  p_max_valoradquisicion numeric,
  p_tasafiscal numeric,
  p_porcientorecuperacion numeric,
  p_idestatustecnico numeric,
  p_idarearesp numeric,
  p_min_depreciacionacumulada numeric,
  p_max_depreciacionacumulada numeric,
  p_fechainicialgarantia date,
  p_fechafingarantia date,
  p_nromatricula varchar,
  p_nrocirculacion varchar,
  p_nromotor1 varchar,
  p_nromotor2 varchar,
  p_min_ficav date,
  p_max_ficav date,
  p_min_lot date,
  p_max_lot date,
  p_vin varchar,
  p_capacidad numeric,
  p_indiceconsumo numeric,
  p_nollaveencendido varchar,
  p_indicativo varchar,
  p_idtipocombustible numeric,
  p_combustibleasignado numeric,
  p_min_expedicioncirculacion date,
  p_max_expedicioncirculacion date,
  p_min_vencimientocirculacion date,
  p_max_vencimientocirculacion date,
  p_min_vencimientolot date,
  p_max_vencimientolot date,
  p_min_vencimientoficav date,
  p_max_vencimientoficav date,
  p_rnanulos varchar,
  p_rnatnulos varchar,
  p_idestructurasprod varchar,
  p_circulacion varchar,
  p_lot varchar,
  p_ficav varchar,
  p_idnat varchar,
  p_idind numeric,
  p_estadooperacion varchar,
  denomcentrocosto numeric,
  "p_incluirGrupos" varchar,
  identidad numeric
)
RETURNS SETOF mod_logactivofijotangible.td_listadoregistronumerico AS
$body$
declare
v_rec mod_logactivofijotangible.td_listadoregistronumerico;
v_identificador varchar = '';
v_sql1 varchar = '';
v_rnanulos varchar[]:= string_to_array($60,',');
v_rnatnulos varchar[]:= string_to_array($61,',');

begin


for v_rec in
select DISTINCT
drna.idregnumerico,
ni.denominacion,
nmo.denominacion as modelo,
nma.denominacion as marca,
deu.descripcion as ubicacion,
drna.nroinventario,
drna.valoradquisicion,
drna.valorcontable,
drna.vidautil,
drna.tasafiscal,
drna.depreciacionacumulada,
drna.fechaadq,
drna.fechaexpini,
drna.fechaexpfin,
drna.esbaja,
drna.estaentidad,
drnat.nromatricula as matricula,
drnat.indicativo,
drnat.nrocirculacion as numcirculacion,
drnat.nromotor1 as numeromotor1,
drnat.nromotor2 as numeromotor2,
drna.cantidadrecursoconsumido as kilometraje,
drnat.indiceconsumo,
drnat.ficav,
drnat.lot,
drnat.capacidad as pax,
ntc.denominacion as tipocombustible,
net.denominacion as estado,
--(select denominacion from mod_logactivofijotangible.f_buscarestructura(drna.idarearesp)) as entidad,
coalesce(de.denominacion, deop1.denominacion) as entidad,

deop.denominacion as arearesponsabilidad,
nc.denominacion as categoria,
drn.nroserie,
((case when dper.nombre is not null then (dper.nombre ||
(case when dper.papel is not null then ' ' else '' end))  else '' end) ||
(case when dper.papel is not null then (dper.papel ||
(case when dper.sapel is not null then ' ' else '' end)) else '' end) ||
(case when dper.sapel is not null then dper.sapel else '' end)) as responsable,
(select cg.urllogo from mod_logistica.conf_general cg where cg.idestructura = $1 limit 1) as logo,
ni.codigo,
drnat.vin,
ncprim.denominacion as colorprim,
ncsec.denominacion as colorsec,
na.denominacion as actividad,
drnat.combustibleasignado,
cim.identificador,
cim.nombretabla,
cim.denominacion as den,
cim.tipo as tipoconf,
drnat.vencimientolot,
drnat.vencimientoficav,
drnat.vencimientocirculacion,
drnat.expedicioncirculacion,
drna.fechainicialgarantia,
drna.fechafingarantia,
drna.recursoconsumidomax,
drna.recursoconsumido,
drna.cantidadrecursoconsumido,
drna.porcientorecuperacion,
drna.valorcontablealternativo,
drna.valoradquisicionalternativo,
drna.depreciacionacumuladaalternativo,
ni.numeropieza as codigoproveedor,
ncc.descripcioncentrogrupo as centrocosto,
grupo.denominacion as grupo,
neo.denominacion as estadooperacion,
 deop.idestructura,dr.idresponsable, ncc.idcentrogrupo

from mod_logactivofijotangible.dat_regnumericoactivo drna
left JOIN mod_logactivofijotangible.nom_estatusoperacion neo ON drna.idestadoperacion = neo.idestatusoperacion
left join mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drna.idregnumerico
left join mod_logactivofijotangible.nom_tipocombustible ntc on ntc.idtipocombustible = drnat.idtipocombustible
left join mod_logistica.nom_categoria nc on nc.idcategoria = drna.idcategoria
left join mod_logactivofijotangible.dat_responsable dr on dr.idresponsable = drna.idresponsable
left join mod_logactivofijotangible.nom_color ncprim on ncprim.idcolor = drna.idcolorprim
left join mod_logactivofijotangible.nom_color ncsec on ncsec.idcolor = drna.idcolorsec
left join mod_logubicacion.dat_estructuraubicacion deu on deu.idestructuraubicacion = drna.idubicacion
left join mod_logactivofijotangible.nom_estatustecnico net on net.idestatustecnico = drna.idestatustecnico
left join mod_logactivofijotangible.nom_actividad na on na.idactividad = drna.idactividad
left join mod_persona.dat_persona dper on dper.idpersona = dr.idpersona
inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = drna.idregnumerico
inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
left join mod_datosmaestros.nom_gruposubgrupo grupo on grupo.idgruposubgrupo = nih.idgruposubgrupo
left join mod_datosmaestros.nom_marca nma on nma.idmarca = nih.idmarca
left join mod_datosmaestros.nom_modelo nmo on nmo.idmodelo = nih.idmodelo
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = drna.idcentrocosto
inner join mod_logactivofijotangible.dat_movregnumerico dmrn on dmrn.idregnumerico = drn.idregnumerico
inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmrn.idmovimiento
inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
inner join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = drna.idarearesp
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = nf.idfila

--left join mod_estructuracomp.dat_estructura de on de.idestructura = nf.idpadre
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = dp.idestructuracomun
left join mod_estructuracomp.v_dametodasestructuras deop1 on deop1.idestructura = dp.idestructuracomun


left join mod_logactivofijotangible.conf_identificadormedio cim on cim.idindicador = ni.idindicador

where dd.estado = 3

and ( drna.esbaja = 0)
-- Excluyendo registros de baja(7) y no insertados(0)
and (drna.idestadoperacion NOT IN (0, 7))

-- Incluyendo naturalezas
and ( case when $6 is not null 
	
	then
    	case when -5 = ALL(CAST($6 as numeric[])) 
        	then nih.isuh = 1
        else
    		ni.idnaturaleza = any(cast($6 as numeric[])) end 
    else 
    	true 
    end)

-- Excluyendo naturalezas
and ( case when $66 is not null then nn.idnaturaleza != all(cast($66 as numeric[])) else true end)
and ( case when $66 is not null and -5 = any(CAST($66 as numeric[])) then nih.isuh = 0 else nih.isuh = 1 end)

and ( case when $67 is not null then ni.idindicador = $67  else true end)

-- es aqui 
and ( case when $62 is not null then dp.idestructura = any(cast($62 as numeric[])) else true end)
and ( case when $2 is not null then ni.codigo ilike '%' || $2 || '%'  else true end)
and ( case when $3 is not null then ni.denominacion ilike '%' || $3 || '%'  else true end)
and ( case when $7 is not null then (drn.nroserie ilike '%' || $7 || '%') else true end)
and ( case when $4 is not null then nih.idmarca = $4  else true end)
and ( case when $69 is not null then drna.idcentrocosto = $69  else true end)
and ( case when $5 is not null then nih.idmodelo = $5  else true end)
and ( case when $14 is not null then drna.idcolorprim = $14  else true end)
and ( case when $15 is not null then drna.idcolorsec = $15  else true end)
and ( case when $20 is not null then drna.idactividad = $20  else true end)
and ( case when $70 is not null then nih.idgruposubgrupo = any(cast($70 as numeric[]))  else true end)
and ( case when $71 is not null then dp.idestructuracomun = $71  else true end)
and ( case when $21 is not null then drna.idresponsable = cast($21 as numeric)  else true end)
and ( case when $22 is not null then drna.idcategoria = $22  else true end)
and ( case when $31 is not null then drna.idestatustecnico = $31  else true end)
and ( case when $32 is not null then drna.idarearesp = $32  else true end)
and ( case when $50 is not null then drnat.idtipocombustible = $50  else true end)
and (case when (select 'nroinventario' = any(v_rnanulos)) then (drna.nroinventario is null) else (drna.nroinventario = $8 or $8 is null) end)
and (case when (select 'valorcontable' = any(v_rnanulos)) then (drna.valorcontable is null) else (drna.valorcontable >= $9 or $9 is null) end)
and (case when (select 'valorcontable' = any(v_rnanulos )) then (drna.valorcontable is null) else (drna.valorcontable <= $10 or $10 is null) end)
and (case when (select 'valorcontablealternativo' = any(v_rnanulos)) then (drna.valorcontablealternativo is null) else (drna.valorcontablealternativo >= $9 or $9 is null) end)
and (case when (select 'valorcontablealternativo' = any(v_rnanulos )) then (drna.valorcontablealternativo is null) else (drna.valorcontablealternativo <= $10 or $10 is null) end)
and (case when (select 'valoradquisicionalternativo' = any(v_rnanulos)) then (drna.valoradquisicionalternativo is null) else (drna.valoradquisicionalternativo >= $9 or $9 is null) end)
and (case when (select 'valoradquisicionalternativo' = any(v_rnanulos )) then (drna.valoradquisicionalternativo is null) else (drna.valoradquisicionalternativo <= $10 or $10 is null) end)
and (case when (select 'depreciacionacumuladaalternativo' = any(v_rnanulos)) then (drna.depreciacionacumuladaalternativo is null) else (drna.depreciacionacumuladaalternativo >= $9 or $9 is null) end)
and (case when (select 'depreciacionacumuladaalternativo' = any(v_rnanulos )) then (drna.depreciacionacumuladaalternativo is null) else (drna.depreciacionacumuladaalternativo <= $10 or $10 is null) end)
and (case when (select 'annofabricacion' = any(v_rnanulos )) then (drna.annofabricacion is null) else (drna.annofabricacion = $11 or $11 is null) end)
and (case when (select 'recursoconsumidomax' = any(v_rnanulos )) then (drna.recursoconsumidomax is null) else (drna.recursoconsumidomax >= $12 or $12 is null) end)
and (case when (select 'recursoconsumidomax' = any(v_rnanulos )) then (drna.recursoconsumidomax is null) else (drna.recursoconsumidomax <= $13 or $13 is null) end)
and (case when (select 'recursoconsumido' = any(v_rnanulos )) then (drna.recursoconsumido is null) else (drna.recursoconsumido >= $16 or $16 is null) end)
and (case when (select 'recursoconsumido' = any(v_rnanulos )) then (drna.recursoconsumido is null) else (drna.recursoconsumido <= $17 or $17 is null) end)
and (case when (select 'cantidadrecursoconsumido' = any(v_rnanulos )) then (drna.cantidadrecursoconsumido is null) else (drna.cantidadrecursoconsumido >= $18 or $18 is null) end)
and (case when (select 'cantidadrecursoconsumido' = any(v_rnanulos )) then (drna.cantidadrecursoconsumido is null) else (drna.cantidadrecursoconsumido <= $19 or $19 is null) end)
and (case when (select 'fechaadq' = any(v_rnanulos )) then (drna.fechaadq is null) else (drna.fechaadq = $23 or $23 is null) end)
and (case when (select 'fechaexpini' = any(v_rnanulos )) then (drna.fechaexpini is null) else (drna.fechaexpini = $24 or $24 is null) end)
and (case when (select 'fechaexpfin' = any(v_rnanulos )) then (drna.fechaexpfin is null) else (drna.fechaexpfin = $25 or $25 is null) end)
and (case when (select 'vidautil' = any(v_rnanulos )) then (drna.vidautil is null) else (drna.vidautil = $26 or $26 is null) end)
and (case when (select 'valoradquisicion' = any(v_rnanulos )) then (drna.valoradquisicion is null) else (drna.valoradquisicion >= $27 or $27 is null) end)
and (case when (select 'valoradquisicion' = any(v_rnanulos )) then (drna.valoradquisicion is null) else (drna.valoradquisicion <= $28 or $28 is null) end)
and (case when (select 'tasafiscal' = any(v_rnanulos )) then (drna.tasafiscal is null) else (drna.tasafiscal = $29 or $29 is null) end)
and (case when (select 'porcientorecuperacion' = any(v_rnanulos )) then (drna.porcientorecuperacion is null) else (drna.porcientorecuperacion = $30 or $30 is null) end)
and (case when (select 'depreciacionacumulada' = any(v_rnanulos )) then (drna.depreciacionacumulada is null) else (drna.depreciacionacumulada >= $33 or $33 is null) end)
and (case when (select 'depreciacionacumulada' = any(v_rnanulos )) then (drna.depreciacionacumulada is null) else (drna.depreciacionacumulada <= $34 or $34 is null) end)
and (case when (select 'fechainicialgarantia' = any(v_rnanulos )) then (drna.fechainicialgarantia is null) else (drna.fechainicialgarantia = $35 or $35 is null) end)
and (case when (select 'fechafingarantia' = any(v_rnanulos )) then (drna.fechafingarantia is null) else (drna.fechafingarantia = $36 or $36 is null) end)
and (case when (select 'nromatricula' = any(v_rnatnulos )) then (drnat.nromatricula is null) else (drnat.nromatricula ilike '%' || $37 || '%' or $37 is null) end)
and (case when (select 'nrocirculacion' = any(v_rnatnulos )) then (drnat.nrocirculacion is null) else (drnat.nrocirculacion ilike '%' || $38 || '%' or $38 is null) end)
and (case when (select 'nromotor1' = any(v_rnatnulos )) then (drnat.nromotor1 is null) else (drnat.nromotor1 ilike '%' || $39 || '%' or $39 is null) end)
and (case when (select 'nromotor2' = any(v_rnatnulos )) then (drnat.nromotor2 is null) else (drnat.nromotor2 ilike '%' || $40 || '%' or $40 is null) end)
and (case when (select 'ficav' = any(v_rnatnulos )) then (drnat.ficav is null) else (drnat.ficav >= $41 or $41 is null) end)
and (case when (select 'ficav' = any(v_rnatnulos )) then (drnat.ficav is null) else (drnat.ficav <= $42 or $42 is null) end)
and (case when (select 'lot' = any(v_rnatnulos )) then (drnat.lot is null) else (drnat.lot >= $43 or $43 is null) end)
and (case when (select 'lot' = any(v_rnatnulos )) then (drnat.lot is null) else (drnat.lot <= $44 or $44 is null) end)
and (case when (select 'vin' = any(v_rnatnulos )) then (drnat.vin is null) else (drnat.vin ilike '%' || $45 || '%' or $45 is null) end)
and (case when (select 'capacidad' = any(v_rnatnulos )) then (drnat.capacidad is null) else (drnat.capacidad = $46 or $46 is null) end)
and (case when (select 'indiceconsumo' = any(v_rnatnulos )) then (drnat.indiceconsumo is null) else (drnat.indiceconsumo = $47 or $47 is null) end)
and (case when (select 'nollaveencendido' = any(v_rnatnulos )) then (drnat.nollaveencendido is null) else (drnat.nollaveencendido ilike '%' || $48 || '%' or $48 is null) end)
and (case when (select 'indicativo' = any(v_rnatnulos )) then (drnat.indicativo is null) else (drnat.indicativo ilike '%' || $49 || '%' or $49 is null) end)
and (case when (select 'combustibleasignado' = any(v_rnatnulos )) then (drnat.combustibleasignado is null) else (drnat.combustibleasignado = $51 or $51 is null) end)
and (case when (select 'expedicioncirculacion' = any(v_rnatnulos )) then (drnat.expedicioncirculacion is null) else (drnat.expedicioncirculacion >= $52 or $52 is null) end)
and (case when (select 'expedicioncirculacion' = any(v_rnatnulos )) then (drnat.expedicioncirculacion is null) else (drnat.expedicioncirculacion <= $53 or $53 is null) end)
and (case when (select 'vencimientocirculacion' = any(v_rnatnulos )) then (drnat.vencimientocirculacion is null) else (drnat.vencimientocirculacion >= $54 or $54 is null) end)
and (case when (select 'vencimientocirculacion' = any(v_rnatnulos )) then (drnat.vencimientocirculacion is null) else (drnat.vencimientocirculacion <= $55 or $55 is null) end)
and (case when (select 'vencimientolot' = any(v_rnatnulos )) then (drnat.vencimientolot is null) else (drnat.vencimientolot >= $56 or $56 is null) end)
and (case when (select 'vencimientolot' = any(v_rnatnulos )) then (drnat.vencimientolot is null) else (drnat.vencimientolot <= $57 or $57 is null) end)
and (case when (select 'vencimientoficav' = any(v_rnatnulos )) then (drnat.vencimientoficav is null) else (drnat.vencimientoficav >= $58 or $58 is null) end)
and (case when (select 'vencimientoficav' = any(v_rnatnulos )) then (drnat.vencimientoficav is null) else (drnat.vencimientoficav <= $59 or $59 is null) end)

and (case when (select 'estadooperacion' = any(v_rnanulos)) then (drna.idestadoperacion is null) else (drna.idestadoperacion = any(cast($68 as numeric[])) or $68 is null) end)

and ( case when (array_length(cast($63 as date[]),1) = 2)  then (
drnat.vencimientocirculacion between (cast($63 as date[]))[1] and (cast($63 as date[]))[2]
) else true end)

and ( case when (array_length(cast($64 as date[]),1) = 2)  then (
drnat.vencimientolot between (cast($64 as date[]))[1] and (cast($64 as date[]))[2]
) else true end)

and ( case when (array_length(cast($65 as date[]),1) = 2)  then (
drnat.vencimientoficav between (cast($65 as date[]))[1] and (cast($65 as date[]))[2]
) else true end)
ORDER BY deop.idestructura,dr.idresponsable, ncc.idcentrogrupo

loop
if v_rec.nombretabla = 'dat_registronumerico' then
    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_registronumerico rg where rg.idregnumerico = ' || v_rec.idregnumerico;
    execute v_sql1 into v_identificador;
    v_rec.identificador = v_rec.den || ': ' || v_identificador;
    end if;

    if v_rec.nombretabla = 'dat_regnumericoactivo' then
    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_regnumericoactivo rg where rg.idregnumerico = ' || v_rec.idregnumerico;
    execute v_sql1 into v_identificador;
    v_rec.identificador = v_rec.den || ': ' || v_identificador;
    end if;

    if v_rec.nombretabla = 'dat_regnumericoactivotransp' then
    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_regnumericoactivotransp rg where rg.idregnumerico = ' || v_rec.idregnumerico;
    execute v_sql1 into v_identificador;
    v_rec.identificador = v_rec.den || ': ' || v_identificador;
    end if;
    
    if v_rec.tipoconf = 2 then 
    v_sql1 = 'select ' || split_part(v_rec.identificador,'.',3) || ' from '|| split_part(v_rec.identificador,'.',1)|| '.'|| split_part(v_rec.identificador,'.',2)||' rg where rg.idregnumerico = ' || v_rec.idregnumerico;
    execute v_sql1 into v_identificador;
    v_rec.identificador = v_rec.den || ': ' || v_identificador;
    end if;
    return next v_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;



CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_balancecontbaleaft (
  p_idestructura numeric,
  p_idejercicioactual numeric
)
RETURNS SETOF mod_logactivofijotangible.td_balancecontbaleaft AS
$body$
DECLARE
 v_rec mod_logactivofijotangible.td_balancecontbaleaft;
 v_subsist_aft_aperturado numeric := 0;
 v_recejercicio record;
BEGIN

  select COALESCE(esubsist.aperturado, 0) into v_subsist_aft_aperturado
  from mod_datosmaestros.dat_estructurasubsist esubsist
  where esubsist.idsubsistema = 11 and esubsist.idestructuracomun = p_idestructura;

  select ec.fin, ec.inicio into v_recejercicio from mod_datosmaestros.dat_ejerciciocontable ec
  inner join mod_datosmaestros.dat_cierre dc on dc.idejercicioactual = ec.idejercicio
  inner join mod_datosmaestros.dat_estructurasubsist ees on ees.idestructurasubsist = dc.idestructurasubsist
  where ees.idestructuracomun = p_idestructura and ees.idsubsistema = 11;
  -- Para cuando el sistema ya esta aperturado
  IF(v_subsist_aft_aperturado = 1) THEN
    for v_rec in

        select q.concatcta, 
        COALESCE(q.saldo,0) as saldo, 
        COALESCE(sum(q.valor),0) as valor 
        
        from (
            /*select nca.concatcta, abs(sum(rp.debito - rp.credito)) as saldo, squery.valor                      
            from mod_contabilidad.nom_cuenta nca
            left join mod_contabilidad.res_resumen_pase rp on rp.idcuenta = nca.idcuenta  and rp.idestructuracomun = p_idestructura
            and rp.idejercicio = p_idejercicioactual*/
           
            
              select nca.concatcta, 
              sum(rp.saldomb) as saldo, squery.valor
              from mod_contabilidad.nom_cuenta nca
              INNER join mod_contabilidad.res_centroelem_saldo rp on rp.idcuenta = nca.idcuenta
              inner join mod_contabilidad.dat_estructurae dee on dee.idestructurae = rp.idestructurae  
                
              inner join 
              (select
              cg.idcuentaactivo as idcuenta,nc.concatcta, sum(rna.valorcontable) as valor
              from mod_logistica.dat_producto dp
              inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
              inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
              inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
              inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentaactivo
              where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
              and rna.idestadoperacion not in (7, 0)
              group by cg.idcuentaactivo,nc.concatcta
                            
              union 
                            
              select
              cg.idcuentaactivoalternativa as idcuenta ,nc.concatcta, sum(round(rna.valorcontablealternativo,2)) as valor
              from mod_logistica.dat_producto dp
              inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
              inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
              inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
              inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentaactivoalternativa                      
              where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
              and rna.idestadoperacion not in (7, 0)
              group by cg.idcuentaactivoalternativa,nc.concatcta
                            
              union 
                            
              select
              cg.idcuentadepreciacion as idcuenta ,nc.concatcta, sum(round(rna.depreciacionacumulada,2)) as valor
              from mod_logistica.dat_producto dp
              inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
              inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
              inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
              inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentadepreciacion
              where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
              and rna.idestadoperacion not in (7, 0)
              group by cg.idcuentadepreciacion,nc.concatcta
                            
              union 
                            
              select
              cg.idcuentadepreciacionalternativa as idcuenta ,nc.concatcta, sum(round(rna.depreciacionacumuladaalternativo,2)) as valor
              from mod_logistica.dat_producto dp
              inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
              inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
              inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
              inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentadepreciacionalternativa
              where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
              and rna.idestadoperacion not in (7, 0)
              group by cg.idcuentadepreciacionalternativa,nc.concatcta
                            
            ) squery on squery.idcuenta = nca.idcuenta 
          where 
          
          dee.idestructuracomun = p_idestructura
          and 
          rp.fechaemision BETWEEN v_recejercicio.inicio and v_recejercicio.fin/*<= (
              select decont.fin from mod_datosmaestros.dat_ejerciciocontable decont 
              where decont.idejercicio = p_idejercicioactual
          )*/ and   
          nca.idcuenta in (
             select cgc.idcuentaactivo from mod_logactivofijotangible.conf_gruposcuentas cgc
             union 
             select cgc1.idcuentaactivoalternativa from mod_logactivofijotangible.conf_gruposcuentas cgc1
             union                                                                                       
             select cgc2.idcuentadepreciacion from mod_logactivofijotangible.conf_gruposcuentas cgc2
             union
             select cgc3.idcuentadepreciacionalternativa from mod_logactivofijotangible.conf_gruposcuentas cgc3
          )
          group by nca.concatcta,squery.valor
          
          order by nca.concatcta
        
        ) q group by q.concatcta, q.saldo order by q.concatcta

    LOOP
        return next v_rec;
    END LOOP;
  
  ELSE
  -- Para cuando el sistema no esta aperturado, y tiene un solo movimiento por activo
    for v_rec in

        select q.concatcta, 
        COALESCE(
        --round(
        q.saldo
        --,2)
        ,0) as saldo, 
        COALESCE(
        --round(
        sum(q.valor)
        --,2)
        ,0) as valor from ( 
        
          /*select nca.concatcta, abs(sum(rp.debito - rp.credito)) as saldo, squery.valor                      
            from mod_contabilidad.nom_cuenta nca
            left join mod_contabilidad.res_resumen_pase rp on rp.idcuenta = nca.idcuenta  and rp.idestructuracomun = p_idestructura
            and rp.idejercicio = p_idejercicioactual*/
            
            select nca.concatcta, 
              sum(rp.saldomb) as saldo, squery.valor
              from mod_contabilidad.nom_cuenta nca
              INNER join mod_contabilidad.res_centroelem_saldo rp on rp.idcuenta = nca.idcuenta
              inner join mod_contabilidad.dat_estructurae dee on dee.idestructurae = rp.idestructurae
            
            inner join 
            (select
            cg.idcuentaactivo as idcuenta,nc.concatcta, sum(rna.valorcontable) as valor
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
            inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
            inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentaactivo
            --inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
            where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
            and rna.idestadoperacion not in (7) and rna.esbaja = 0
            group by cg.idcuentaactivo,nc.concatcta
                          
            union 
                          
            select
            cg.idcuentaactivoalternativa as idcuenta ,nc.concatcta, sum(rna.valorcontablealternativo) as valor
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
            inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
            inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentaactivoalternativa
            --inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico                      
            where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
            and rna.idestadoperacion not in (7) and rna.esbaja = 0
            group by cg.idcuentaactivoalternativa,nc.concatcta
                          
            union 
                          
            select
            cg.idcuentadepreciacion as idcuenta ,nc.concatcta, sum(rna.depreciacionacumulada) as valor
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
            inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
            inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentadepreciacion
            --inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
            where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
            and rna.idestadoperacion not in (7) and rna.esbaja = 0
            group by cg.idcuentadepreciacion,nc.concatcta
                          
            union 
                          
            select
            cg.idcuentadepreciacionalternativa as idcuenta ,nc.concatcta, sum(rna.depreciacionacumuladaalternativo) as valor
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
            inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
            inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentadepreciacionalternativa
            --inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
            where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
            and rna.idestadoperacion not in (7) and rna.esbaja = 0
            group by cg.idcuentadepreciacionalternativa,nc.concatcta
                          
          ) squery on squery.idcuenta = nca.idcuenta 
        where --squery.valor > 0 and
        dee.idestructuracomun = p_idestructura
          and 
          rp.fechaemision BETWEEN v_recejercicio.inicio and v_recejercicio.fin
          and
         
        nca.idcuenta in (
           select cgc.idcuentaactivo from mod_logactivofijotangible.conf_gruposcuentas cgc
           union 
           select cgc1.idcuentaactivoalternativa from mod_logactivofijotangible.conf_gruposcuentas cgc1
           union                                                                                       
           select cgc2.idcuentadepreciacion from mod_logactivofijotangible.conf_gruposcuentas cgc2
           union
           select cgc3.idcuentadepreciacionalternativa from mod_logactivofijotangible.conf_gruposcuentas cgc3
        )
        group by nca.concatcta,squery.valor order by nca.concatcta 
        ) q group by q.concatcta, q.saldo order by q.concatcta
  
    LOOP
        return next v_rec;
    END LOOP;
  
  END IF;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;
