DROP FUNCTION IF EXISTS mod_logactivofijotangible.fr_listadoregistronumerico(numeric, character varying, character varying, numeric, numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, character varying, character varying, character varying, character varying, date, date, date, date, character varying, numeric, numeric, character varying, character varying, numeric, numeric, date, date, date, date, date, date, date, date, character varying, character varying, character varying, character varying, character varying, character varying, character varying, numeric, character varying, numeric, character varying, numeric);

DROP TYPE IF EXISTS mod_logactivofijotangible.td_listadoregistronumerico;

CREATE TYPE mod_logactivofijotangible.td_listadoregistronumerico AS
(
	idregnumerico numeric(19,0),
	denominacion character varying(255),
	modelo character varying(255),
	marca character varying(255),
	ubicacion character varying(255),
	nroinventario character varying(255),
	valoradquisicion numeric(25,2),
	valorcontable numeric(25,2),
	vidautil numeric(19,0),
	tasafiscal numeric(25,6),
	depreciacionacumulada numeric(19,2),
	fechaadq date,
	fechaexpini date,
	fechaexpfin date,
	esbaja numeric(1,0),
	estaentidad numeric(1,0),
	matricula character varying(50),
	indicativo character varying(50),
	numcirculacion character varying(50),
	numeromotor1 character varying(50),
	numeromotor2 character varying(50),
	kilometraje numeric(25,6),
	indiceconsumo numeric(25,6),
	ficav character varying(50),
	lot character varying(50),
	pax numeric(9,0),
	tipocombustible character varying(255),
	estado character varying(255),
	entidad character varying(100),
	arearesponsabilidad character varying(100),
	categoria character varying(255),
	nroserie character varying(255),
	responsable character varying(200),
	logo text,
	codigo character varying(255),
	vin character varying(255),
	colorprim character varying(255),
	colorsec character varying(255),
	actividad character varying(255),
	combustibleasignado numeric(19,0),
	identificador character varying(255),
	nombretabla character varying(255),
	den character varying(255),
	tipoconf numeric(1,0),
	vencimientolot date,
	vencimientoficav date,
	vencimientocirculacion date,
	expedicioncirculacion date,
	fechainicialgarantia date,
	fechafingarantia date,
	recursoconsumidomax numeric(19,0),
	recursoconsumido numeric(19,0),
	cantidadrecursoconsumido numeric(19,0),
	porcientorecuperacion numeric(19,0),
	valorcontablealternativo numeric(25,6),
	valoradquisicionalternativo numeric(25,6),
	depreciacionacumuladaalternativo numeric(25,6),
	codigoproveedor character varying(255),
	centrocosto character varying(255),
	grupo character varying(255),
	estadooperacion character varying(255)
);

ALTER TYPE mod_logactivofijotangible.td_listadoregistronumerico OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logactivofijotangible.fr_listadoregistronumerico(
	p_idestructura numeric,
	p_codigo character varying,
	p_denominacion character varying,
	p_idmarca numeric,
	p_idmodelo numeric,
	"p_incluirNaturalezas" character varying,
	p_nroserie character varying,
	p_nroinventario character varying,
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
	p_responsable character varying,
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
	p_nromatricula character varying,
	p_nrocirculacion character varying,
	p_nromotor1 character varying,
	p_nromotor2 character varying,
	p_min_ficav date,
	p_max_ficav date,
	p_min_lot date,
	p_max_lot date,
	p_vin character varying,
	p_capacidad numeric,
	p_indiceconsumo numeric,
	p_nollaveencendido character varying,
	p_indicativo character varying,
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
	p_rnanulos character varying,
	p_rnatnulos character varying,
	p_idestructurasprod character varying,
	p_circulacion character varying,
	p_lot character varying,
	p_ficav character varying,
	p_idnat character varying,
	p_idind numeric,
	p_estadooperacion character varying,
	denomcentrocosto numeric,
	"p_incluirGrupos" character varying,
	identidad numeric)
    RETURNS SETOF mod_logactivofijotangible.td_listadoregistronumerico 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
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
drna.denominacion,
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
COALESCE(
    TRIM(
        CONCAT_WS(' ',
            NULLIF(trim(nombre), ''),
	 		NULLIF(trim(snombre), ''),
            NULLIF(trim(papel), ''),
            NULLIF(trim(sapel), '')
        )
    ),
    ''
) AS responsable,
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
left join mod_datosmaestros.nom_gruposubgrupo grupo on grupo.idgruposubgrupo = drna.idgruposubgrupo
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
and (case when (select 'nroinventario' = any(v_rnanulos)) then (drna.nroinventario is null) else (upper(drna.nroinventario) = upper($8) or $8 is null) end)
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
$BODY$;

ALTER FUNCTION mod_logactivofijotangible.fr_listadoregistronumerico(numeric, character varying, character varying, numeric, numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, character varying, character varying, character varying, character varying, date, date, date, date, character varying, numeric, numeric, character varying, character varying, numeric, numeric, date, date, date, date, date, date, date, date, character varying, character varying, character varying, character varying, character varying, character varying, character varying, numeric, character varying, numeric, character varying, numeric) OWNER TO zeolides;
