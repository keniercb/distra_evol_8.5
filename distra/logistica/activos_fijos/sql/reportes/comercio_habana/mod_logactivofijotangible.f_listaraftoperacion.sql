-- FUNCTION: mod_logactivofijotangible.f_listaraftoperacion(character varying, character varying, date, date, character varying, character varying, character varying, numeric, character varying, numeric, numeric, character varying, character varying)

-- DROP FUNCTION IF EXISTS mod_logactivofijotangible.f_listaraftoperacion(character varying, character varying, date, date, character varying, character varying, character varying, numeric, character varying, numeric, numeric, character varying, character varying);

CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listaraftoperacion(
	p_idestructuraop character varying,--1
	p_idnomoperaciones character varying,--2
	p_fechainicio date,--3
	p_fechafin date,--4
	p_alias character varying,--5
	p_codigo character varying,--6
	p_valor character varying,--7
	p_tipo numeric,--8
	p_ubicaciones character varying,--9
	p_responsable numeric,--10
	p_contabilidad numeric,--11
	p_exlcuirnaturaleza character varying,--12
	p_namereport character varying)--13
    RETURNS SETOF mod_logactivofijotangible.td_listaraftoperacion 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

    declare
    v_datos record;
    v_rec mod_logactivofijotangible.td_listaraftoperacion;
    v_sql varchar = '';
    p_alias varchar[]:= string_to_array($5,',');
    p_codigo varchar[]:= string_to_array($6,',');
    p_valor varchar[]:= string_to_array($7,',');
    v_cont integer:= array_length(p_codigo,1);
    i integer :=1;
    v_alias varchar;
    v_select varchar='';
    v_joins varchar='';
    v_condinicial varchar='';
    v_cond varchar='';
    v_datatype varchar='';
    v_identificador varchar = '';
    v_sql1 varchar = ''; 
    begin
    
		if $1 is not null then v_condinicial = v_condinicial || ' and drna.idarearesp = any(cast( ' || $$'$$ || $1 || $$'$$  ||' as numeric[])) ';end if;
		if $11 is not null then
    		v_joins = v_joins || ' left join mod_logactivofijotangible.conf_gruposcuentas cfggrupos on nih.idgruposubgrupo = cfggrupos.idgruposubgrupo
    					left join mod_contabilidad.nom_cuenta ncuenta on cfggrupos.idcuentaactivo = ncuenta.idcuenta ';
    		v_select :=$$ ,concat(ncuenta.concatcta,' ',ncuenta.descripcion) as cuenta $$;
    	end if;
    
    	if $2 is not null then 
        	v_condinicial = v_condinicial || ' and nop.idnomoperaciones = any(cast( ' || $$'$$ || $2 || $$'$$  ||' as numeric[])) ';
         	v_select :=' ,nop.denominacion as operacion,    
    			ndp.denominacion as tipodocumento,
                dd.fechacontable as fechadoc ';                            
    	end if;
    
    	if $3 is not null then v_condinicial = v_condinicial || ' and (dd.fechacontable >= ' || $$'$$ || $3 || $$'$$ || $$::date$$ ||' ) ';end if;

    	if $4 is not null then v_condinicial = v_condinicial || ' and (dd.fechacontable <= ' || $$'$$ || $4 || $$'$$ || $$::date$$ ||' ) ';end if;
    	--if $8 is not null then v_condinicial = v_condinicial || ' and nat.idnaturaleza = -5 and drna.esbaja = 0';end if; 
    	if $8 is not null then v_condinicial = v_condinicial || ' and nih.isuh = 1 and drna.esbaja = 0';end if; 
    	if $9 is not null then v_condinicial = v_condinicial || ' and drna.idubicacion = any(cast( ' || $$'$$ || $9 || $$'$$  ||' as numeric[])) ';end if;
    	if $12 is not null then v_condinicial = v_condinicial || ' and nat.idnaturaleza != all(cast( ' || $$'$$ || $12 || $$'$$  ||' as numeric[])) ';end if;
    	if $12 is not null and -5 = any(cast($12 as numeric[])) then v_condinicial = v_condinicial || ' and nih.isuh = 0 ';end if;
    	if $10 is not null then
    		v_joins = v_joins || ' INNER JOIN mod_logactivofijotangible.dat_responsable dresp on dresp.idresponsable = drna.idresponsable
    						LEFT JOIN mod_persona.dat_persona person on person.idpersona = '|| $10;
    		v_condinicial = v_condinicial || ' and dresp.idpersona =  ' || $10 ;
       	end if;

    	if (select 'OPER_BAJA' = any(p_alias)) then
    		v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docbajaventa OPER_BAJA on OPER_BAJA.iddocbajaventa = dd.iddocumento left join mod_logactivofijotangible.nom_destinofinal ndf on ndf.iddestinofinal = OPER_BAJA.iddestinofinal ';
    		v_select :=' ,ndf.denominacion as destinofinal ';
    	end if;

	    if (select 'OPER_BAJA_DESARME' = any(p_alias)) then
    		v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docbajadesarme OPER_BAJA_DESARME on OPER_BAJA_DESARME.iddocbajadesarme = dd.iddocumento left join mod_logactivofijotangible.nom_destinofinal ndfd on ndfd.iddestinofinal = OPER_BAJA_DESARME.iddestinofinal ';
    		v_select :=' ,ndfd.denominacion as destinofinal ';
    	end if;       
	
		if (select 'OPER_ALQUILER' = any(p_alias)) then
    		v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docalquiler OPER_ALQUILER on OPER_ALQUILER.iddocalquiler = dd.iddocumento ';
    	end if;

	    if (select 'OPER_COMPRA' = any(p_alias)) then
    		v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docaltacompra OPER_COMPRA on OPER_COMPRA.iddocaltacompra = dd.iddocumento ';
    	end if;

	    if (select 'OPER_REPGENERAL' = any(p_alias)) then
    		v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docenviadoreparar OPER_REPGENERAL on OPER_REPGENERAL.iddocenviadoreparar = dd.iddocumento ';
    	end if;
    	
		if (select 'OPER_PRESTAMO' = any(p_alias)) then
    		v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docprestamo OPER_PRESTAMO on OPER_PRESTAMO.iddocprestamo = dd.iddocumento ';
    	end if;
	
		if (select 'OPER_TRASLADO' = any(p_alias)) then
    		v_joins = v_joins || ' left join mod_logactivofijotangible.dat_doctransfentidades OPER_TRASLADO on OPER_TRASLADO.iddoctranfentidades = dd.iddocumento ';
    	end if;

    while i<= v_cont

    loop

	    if ((select 'OPER_BAJA' = (p_alias[i]))) then v_alias = 'OPER_BAJA';end if;
	
	    if ((select 'OPER_ALQUILER' = (p_alias[i]))) then v_alias = 'OPER_ALQUILER';end if;
	
	    if ((select 'OPER_COMPRA' = (p_alias[i]))) then v_alias = 'OPER_COMPRA';end if;
	
	    if ((select 'OPER_BAJA_DESARME' = (p_alias[i]))) then v_alias = 'OPER_BAJA_DESARME';end if;
	
	    if ((select 'OPER_REPGENERAL' = (p_alias[i]))) then v_alias = 'OPER_REPGENERAL';end if;
	
	    if ((select 'OPER_PRESTAMO' = (p_alias[i]))) then v_alias = 'OPER_PRESTAMO';end if;
	
	    if ((select 'OPER_TRASLADO' = (p_alias[i]))) then v_alias = 'OPER_TRASLADO';end if;

	    if (SELECT p_valor[i]::varchar ~ '^[0-9]+$') then v_datatype=' = ' || p_valor[i]::varchar; else v_datatype= ' ~~* '|| $$'%$$ || p_valor[i] || $$%'$$ ;end if;
	
	    v_cond = v_cond || ' and (' || v_alias || '.' || p_codigo[i] || v_datatype ||' ) ';
	
	    i= i + 1;

    end loop;

    v_sql = $$select distinct
    drn.idregnumerico,
    ni.denominacion as producto,
    modelo.denominacion as modelo,
    marca.denominacion as marca,
    drna.nroinventario as nroinventario,
    drna.valorcontable as valorcontable,    
    drna.valorcontablealternativo as valorcontablealternativo,
    net.denominacion as estado,
    deop.denominacion as arearesponsabilidad,
    deop.codigo as codigoarearesp,
    drn.nroserie ,
    drna.depreciacionacumulada ,
    drna.depreciacionacumuladaalternativo ,
    drna.vidautil,
    drna.porcientorecuperacion ,
    drna.fechaexpini,
    drna.fechaexpfin,
    drna.fechaadq,
    (select d.fechacontable
 from mod_logistica.dat_documento d
 inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
 inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
 inner join mod_logactivofijotangible.dat_registronumerico r2 on r2.idproducto = p.idproducto
 inner join mod_logactivofijotangible.dat_regnumericoactivo ra2 on ra2.idregnumerico = r2.idregnumerico
 where
 ra2.idestadoperacion = 7
 and ra2.idregnumerico =  drna.idregnumerico
 and d.cronologia > 0
 order by d.cronologia desc
 limit 1
 ) as fechabaja,
    drna.tasafiscal,
    drna.valoradquisicion,
    drna.asignado ,
    drna.esmodulo,
    drna.annofabricacion,
    drna.recursoconsumido,
    drna.cantidadrecursoconsumido,
    drna.recursoconsumidomax,
    drna.fechainicialgarantia,
    drna.fechafingarantia,
    nc1.denominacion as colorprim,
    nc2.denominacion as colorsec,
    na.denominacion as actividad,
    cat.denominacion as categoria,
    tipcom.denominacion as tipocombustible,
    t.nrocirculacion,
    t.nromatricula,
    t.nromotor1,
    t.nromotor2,
    t.indiceconsumo,
    t.indicativo,
    t.nollaveencendido,
    t.capacidad,
    t.vin,
    t.ficav,
    t.lot,
    t.combustibleasignado,
    t.vencimientolot,
    t.vencimientoficav,
    t.vencimientocirculacion,
    t.expedicioncirculacion ,
    im.identificador,
    '' as valoridentificador,
    im.nombretabla,
    im.denominacion as den,
    im.tipo as tipoconf,     
    ubi.descripcion as ubicacion,
    ni.numeropieza as codigoproveedor,
    ncc.descripcioncentrogrupo as centrocosto
    $$

    ||v_select||'

    from mod_logactivofijotangible.dat_registronumerico drn
    inner join mod_logactivofijotangible.dat_movregnumerico dmrn on dmrn.idregnumerico = drn.idregnumerico
    inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = drn.idregnumerico
    left join mod_logactivofijotangible.dat_regnumericoactivotransp t on t.idregnumerico = drna.idregnumerico
    inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmrn.idmovimiento
    inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
    inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador
    inner join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
    left join mod_datosmaestros.nom_marca marca on nih.idmarca = marca.idmarca
    left join mod_datosmaestros.nom_modelo modelo on nih.idmodelo = modelo.idmodelo
    left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
    left join mod_logactivofijotangible.nom_estatustecnico net on net.idestatustecnico = drna.idestatustecnico
    inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    left join mod_logactivofijotangible.nom_color nc1 on nc1.idcolor = drna.idcolorprim
    left join mod_logactivofijotangible.nom_color nc2 on nc2.idcolor = drna.idcolorsec
    left join mod_logactivofijotangible.nom_actividad na on na.idactividad = drna.idactividad
    left join mod_logactivofijotangible.nom_tipocombustible tipcom on t.idtipocombustible = tipcom.idtipocombustible
    left join mod_logistica.nom_categoria cat on cat.idcategoria = drna.idcategoria
    left join mod_logubicacion.dat_estructuraubicacion ubi on ubi.idestructuraubicacion = drna.idubicacion
    left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = drna.idcentrocosto
    left join mod_logactivofijotangible.conf_identificadormedio im on im.idindicador = ni.idindicador
    inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = drna.idarearesp and deop.idproyecto = 0 ' || v_joins
	|| ' where dd.estado in(3) and drna.esbaja = 0'
    || v_condinicial
    || v_cond || ' ORDER BY deop.denominacion,ubi.descripcion,ncc.descripcioncentrogrupo';

	for v_rec in execute v_sql

    loop
	    if v_rec.nombretabla = 'dat_registronumerico' then
	    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_registronumerico rg where rg.idregnumerico = ' || v_rec.idregnumerico;
	    execute v_sql1 into v_identificador;
	    v_rec.identificador = v_rec.den || ': ' || v_identificador;
	    v_rec.valoridentificador = v_identificador;
	    end if;
	
	    if v_rec.nombretabla = 'dat_regnumericoactivo' then
	    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_regnumericoactivo rg where rg.idregnumerico = ' || v_rec.idregnumerico;
	    execute v_sql1 into v_identificador;
	    v_rec.identificador = v_rec.den || ': ' || v_identificador;
	    v_rec.valoridentificador = v_identificador;
	    end if;
	
	    if v_rec.nombretabla = 'dat_regnumericoactivotransp' then
	    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_regnumericoactivotransp rg where rg.idregnumerico = ' || v_rec.idregnumerico;
	    execute v_sql1 into v_identificador;
	    v_rec.identificador = v_rec.den || ': ' || v_identificador;
	    v_rec.valoridentificador = v_identificador;
	    end if;
	
	    if v_rec.tipoconf = 2 then
	    v_sql1 = 'select ' || split_part(v_rec.identificador,'.',3) || ' from '|| split_part(v_rec.identificador,'.',1)|| '.'|| split_part(v_rec.identificador,'.',2)||' rg where rg.idregnumerico = ' || v_rec.idregnumerico;
	    execute v_sql1 into v_identificador;
	    v_rec.identificador = v_rec.den || ': ' || v_identificador;
	    v_rec.valoridentificador = v_identificador;
	    end if;
	
	    return next v_rec;
    end loop;
    end;
$BODY$;

ALTER FUNCTION mod_logactivofijotangible.f_listaraftoperacion(character varying, character varying, date, date, character varying, character varying, character varying, numeric, character varying, numeric, numeric, character varying, character varying)
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_logactivofijotangible.f_listaraftoperacion(character varying, character varying, date, date, character varying, character varying, character varying, numeric, character varying, numeric, numeric, character varying, character varying)
    IS 'usada por comercio. Fuente de implementación base de datos distra_une.';
