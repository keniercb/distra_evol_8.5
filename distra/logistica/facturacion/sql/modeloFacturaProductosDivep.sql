-- FUNCTION: mod_logfacturacion.f_modelofacturaprod(numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logfacturacion.f_modelofacturaprod(numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modelofacturaprod(
	p_iddocumento numeric,
	p_monedacontable numeric,
	p_monedalternativa numeric)
    RETURNS SETOF mod_logfacturacion.td_modelofacturaprod 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE

	v_rec mod_logfacturacion.td_modelofacturaprod;
    v_conf numeric;
    v_diferencia numeric;
	BEGIN    
    
    	v_conf := (select cf.listarmcomercial from mod_logfacturacion.conf_configuracionfactura cf 
        		  where cf.idestructuracomun = (select df.idestructuracomun from mod_logfacturacion.dat_docfactura df where df.idfactura = $1 limit 1) limit 1);
                  
		if v_conf = 1 then
        	for v_rec in              

            select q.* 
            from ((select DISTINCT 

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            (case when def.idunidadmedida is null then num.abreviaturaunidadmedida else (
            	select uma.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uma where uma.idunidadmedida = def.idunidadmedida
            ) end) as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2) 
            from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select (dde.preciotarifa- (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2)) * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3) from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select (dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3))* def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Productos' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	 COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
           (SELECT 
            (
            (case when nomdlo.denominacion is null then '' else  'Modelo: '||nomdlo.denominacion end)
            ||(case when nom.denominacion is null then '' else  '-Marca: '||nom.denominacion end)
            ||(case when drnat.nromatricula is null then '' else '-Matricula: ' ||drnat.nromatricula end  )
            ||(case when drnat.nromotor1 is null then '' else '-NoMotor: '|| drnat.nromotor1 end)
            ||(case when nomc.denominacion is null then '' else '-Color: '||nomc.denominacion end)
            ||(case when drna.annofabricacion is null then '' else '-AñoFab: '||drna.annofabricacion end)
            ||(case when drn.nroserie is null then '' else '-Serie: '||drn.nroserie end)
            ||(case when drnat.vin is null then '' else '-Vin: '|| drnat.vin end)
            )
            FROM 
            mod_logactivofijotangible.dat_regnumericoactivo drna
            inner join mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drna.idregnumerico
            inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = drnat.idregnumerico    
            inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
            inner join mod_datosmaestros.nom_indicador nind on nind.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja nindh on nindh.idindicador = nind.idindicador
            left join mod_datosmaestros.nom_modelo nomdlo on nomdlo.idmodelo = nindh.idmodelo
            left join mod_logactivofijotangible.nom_color nomc on nomc.idcolor = drna.idcolorprim
            left join mod_datosmaestros.nom_marca nom on nom.idmarca = nindh.idmarca
            where drna.idregnumerico = daf.idregnumerico) as denomcilindro,
            -1 as cantcilindro,
            ni.idindicador,
            (case when def.minutosactividad > 0 then (SELECT make_interval(0,0,0,0,0,CAST(def.minutosactividad as integer))) else null end) as tiempo,
            null,null,-1,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 3 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto
            
            from mod_logfacturacion.dat_elementosfactura def
            --inner join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            inner join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = daf.idindicador       
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            --left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = def.idelementofactura            
            inner join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            
            where def.idfactura = $1 )
				  
			UNION
            
            (select 

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            (case when def.idunidadmedida is null then num.abreviaturaunidadmedida else (
                select uma.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uma where uma.idunidadmedida = def.idunidadmedida
            ) end) as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2) 
            from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select (dde.preciotarifa- (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2)) * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3) from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select (dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3))* def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            (CASE WHEN dpn.tipo = 1 THEN 'Productos' ELSE 'Servicios Asociados' END) as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                    ,
                        (CASE WHEN dpn.tipo = 1 THEN 
                        COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                        ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable))
                        ELSE (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable) END)
                        
                    ) as monedaitem,
            COALESCE(cf.denominacion, ni2.denominacion) as denomcilindro,
            COALESCE(cf.cantidad, pserv.cantidad) as cantcilindro,
            coalesce(pserv.idprodservicio, ni.idindicador),
            (case when def.minutosactividad > 0 then (SELECT make_interval(0,0,0,0,0,CAST(def.minutosactividad as integer))) else null end) as tiempo,
            null,
            coalesce(pserv.matricula,ni2.numeropieza) as codigocilindro,
            coalesce(pserv.preciobase,0),
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 2 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto

            from mod_logfacturacion.dat_elementosfactura def
            inner join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            --left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador        
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = def.idelementofactura
            left join mod_logfacturacion.dat_prodservicios pserv on pserv.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni2 on ni2.idindicador = pserv.idindicador
            inner join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            where def.idfactura = $1)	  
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Servicios Asociados' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
			0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            null, -1, null,null,null,null,-1,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 3 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto
            
            from mod_logfacturacion.dat_elementosfactura def 
			inner join mod_logfacturacion.dat_prodservnomenclador dps on def.idelementofactura = dps.idelementofactura
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dps.idindicador
            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad            
            left join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza

            where def.idfactura = $1)

            union

            (select

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,
             
            (case when (
                select count(*) from mod_logfacturacion.dat_elementocategoria dec11 where dec11.idmovimiento = dm.idmovimiento
            ) = 0 then (select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) 
             else 
            (select dmm1.preciocontable from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento) end) as precio,
             
            (case when (
                select count(*) from mod_logfacturacion.dat_elementocategoria dec11 where dec11.idmovimiento = dm.idmovimiento
            ) = 0 then round((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2),2) 
             else 
            round((select dmm1.preciocontable * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),2) end) as importe, 
            /*(case when dpf.idtipoprecio is not null and coalesce((select coalesce(dmp.preciopromedio,0) from mod_logfacturacion.dat_matrizprecio dmp 
                                                                  where dmp.idestructuracomun = (select from mod_logfacturacion.dat_docfactura) 
                                                        and dmp.idindicador = ni.idindicador and dmp.idtipoprecio = dpf.idtipoprecio limit 1),0) <> 1)*/
            --(select dmm1.preciocontable from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento) as precio,

            --round((select dmm1.preciocontable * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),2) as importe,
            COALESCE((select dmm1.precioalternativo from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),0) as precioalternativo,
            COALESCE((select dmm1.precioalternativo * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Productos' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dm.idmovimiento as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            coalesce(dprod.cantidad,0) as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro,
            ni.idindicador,null,null,null,-1,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto
            
            
            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
            
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = dm.idmovimiento
            
            inner join mod_logistica.dat_documento d on d.iddocumento = dm.iddocumento
                        
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun

            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            
            where dm.iddocumento = $1)
            
            union
            
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            (COALESCE((select sum(round(dec1.valor*dm1.cantidad,2)) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2 and dm1.iddocumento = $1/*dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = 1000544145)*/),0)
             +COALESCE((select sum(round(dec1.valor*dm1.cantidad,2)) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2 and dm1.idfactura = $1),0)) as precio,

            (COALESCE((select sum(round(dec1.valor*dm1.cantidad,2)) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2  and dm1.iddocumento = $1/*dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = 1000544145)*/),0)
             +COALESCE((select sum(round(dec1.valor*dm1.cantidad,2)) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2  and dm1.idfactura = $1),0)) as importe,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3),0)) as precioalternativo,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3),0)) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'y' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dcd.idcuentadesgloseprecio as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem, null, -1 , null, null, null, null, -1,
            /*case when conf.ordenproducto = 1 then ni.codigo end*/null as codigoproducto,
            /*case when conf.ordenproducto = 2 then ni.denominacion end*/null as denomproducto,
            /*case when conf.ordenproducto = 3 then dm.idmovimiento end*/null as ordeninsercion,
            /*case when conf.ordenproducto = 4 then ni.numeropieza end*/null as codigofabricante,
            /*case when conf.ordenproducto = 5 then nat.denominacion end*/null as naturalezaprod,
            conf.ordenproducto

            from mod_logfacturacion.dat_elementocategoria dec
            left join mod_logistica.dat_movimiento dm on dm.idmovimiento = dec.idmovimiento
			left join mod_logfacturacion.dat_elementosfactura deff on deff.idelementofactura = dec.idelementofactura
            --inner join mod_logistica.dat_producto p on p.idproducto = dm.idproducto
            --inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = p.idindicador
            inner join mod_logfacturacion.dat_cuentadesgloseprecio dcd on dcd.idcuentadesgloseprecio = dec.idcuentadesgloseprecio
            --inner join mod_logfacturacion.dat_categoriaprecioentidad dce on dce.idcategoriaprecioentidad = dcd.idcategoriaprecioentidad
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcd.idcategoriaprecio               
            inner join mod_logistica.dat_documento d on d.iddocumento = dm.iddocumento or deff.idfactura = d.iddocumento       
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            --left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza 
            where dm.iddocumento = $1 or deff.idfactura = $1
			group by dcd.idcuentadesgloseprecio, dec.idcuentadesgloseprecio, ncp.denominacion, conf.ordenproducto)

            union
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0) as precio,

            round(COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0),2) as importe,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as precioalternativo,

            COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'Z' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dcp.idcategoriaprecio as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp11 on ddcp11.idmonedacategoria = mmo.idmoneda
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddcp11.idcategoriafactura = dcp.idcategoriafactura limit 1)
                ,
                	COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        inner join mod_logfacturacion.dat_categoriapreciofactura dcp11 on dcp11.idfactura = ddfm.idfactura
                        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp11 on ddcp11.idcategoriafactura = dcp11.idcategoriafactura
                        where ddfm.idfactura = p_iddocumento and dcp11.idcategoriafactura = dcp.idcategoriafactura 
                        and ddcp11.idmonedacategoria is null limit 1)
                    ,
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                    )
                )
            ) as monedaitem,
            null, -1, null, null,null,null,-1,  
            null as codigoproducto,
            null as denomproducto,
            null as ordeninsercion,
            null as  codigofabricante,
            null as naturalezaprod,
            null as ordenproducto
            

            from mod_logfacturacion.dat_categoriapreciofactura dcp
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio        
            where dcp.idfactura = $1))q
            order by 
            case when q.ordenproducto = 1 then q.codigoproducto end,
            case when q.ordenproducto = 2 then q.denomproducto end,
            case when q.ordenproducto = 3 then q.ordeninsercion end,
            case when q.ordenproducto = 4 then q.codigofabricante end,
            case when q.ordenproducto = 5 then q.naturalezaprod end

           loop
                v_diferencia = 0;
                if v_rec.codigo = '-' and v_rec.identificador is not null then
                    v_diferencia := (select coalesce((
                    coalesce((select sum(round(coalesce(mm.precio*dm.cantidad,0),2)+round(coalesce(des.preciotarifa*de.cantidad,0),2)) from mod_logistica.dat_documento dd
                    left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                    left join mod_logfacturacion.dat_elementosfactura de on de.idfactura = dd.iddocumento
                    left join mod_logistica.dat_movmoneda mm on mm.idmovimiento = dm.idmovimiento and mm.idmoneda = 9900000000
                    left join mod_logfacturacion.dat_desgloselemento des on des.idelementofactura = de.idelementofactura and des.idmoneda = 9900000000
                    inner join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento or ec.idelementofactura = de.idelementofactura
                    where dd.iddocumento = $1 and ec.idcuentadesgloseprecio = v_rec.identificador),0)
                    -
                    coalesce((select sum(round(coalesce(dm.preciocontable*dm.cantidad,0),2) + round(coalesce(de.preciotarifabase*de.cantidad,0),2))
                              +sum(coalesce(round(coalesce(ec.valor*dm.cantidad),2),0)) from mod_logistica.dat_documento dd
                    left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                    left join mod_logfacturacion.dat_elementosfactura de on de.idfactura = dd.iddocumento
                    left join mod_logistica.dat_movmoneda mm on mm.idmovimiento = dm.idmovimiento and mm.idmoneda = 9900000000
                    left join mod_logfacturacion.dat_desgloselemento des on des.idelementofactura = de.idelementofactura and des.idmoneda = 9900000000
                    inner join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento or ec.idelementofactura = de.idelementofactura
                    where dd.iddocumento = $1 and ec.idcuentadesgloseprecio = v_rec.identificador),0)),0));
                    
                    v_rec.precio = v_rec.precio + v_diferencia;
                    v_rec.importe = v_rec.importe + v_diferencia;
                end if;
                v_rec.monedafactura := (select COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                ));
				if lower(v_rec.tipoindicador) = 'z' or lower(v_rec.tipoindicador) = 'y' then
	                if v_rec.importe > 0 then
	                	return next v_rec;
	                end if;
				else
					return next v_rec;
				end if;
            end loop;
		elseif v_conf = 2 then
			for v_rec in              

            select q.* 
            from ((select 
				   
            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            (case when def.idunidadmedida is null then num.abreviaturaunidadmedida else (
            	select uma.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uma where uma.idunidadmedida = def.idunidadmedida
            ) end) as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Productos' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                    ,
                        (COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                        ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)))
                        
                    ) as monedaitem,
            (SELECT 
              (
              (case when nomdlo.denominacion is null then '' else  'Modelo: '||nomdlo.denominacion end)
              ||(case when nom.denominacion is null then '' else  '-Marca: '||nom.denominacion end)
              ||(case when drnat.nromatricula is null then '' else '-Matricula: ' ||drnat.nromatricula end  )
              ||(case when drnat.nromotor1 is null then '' else '-NoMotor: '|| drnat.nromotor1 end)
              ||(case when nomc.denominacion is null then '' else '-Color: '||nomc.denominacion end)
              ||(case when drna.annofabricacion is null then '' else '-AñoFab: '||drna.annofabricacion end)
              ||(case when drn.nroserie is null then '' else '-Serie: '||drn.nroserie end)
              ||(case when drnat.vin is null then '' else '-Vin: '|| drnat.vin end)
              ) 
                FROM 
              mod_logactivofijotangible.dat_regnumericoactivo drna
              inner join mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drna.idregnumerico
              inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = drnat.idregnumerico  
              inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
              inner join mod_datosmaestros.nom_indicador nind on nind.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja nindh on nindh.idindicador = nind.idindicador
              left join mod_datosmaestros.nom_modelo nomdlo on nomdlo.idmodelo = nindh.idmodelo
              left join mod_logactivofijotangible.nom_color nomc on nomc.idcolor = drna.idcolorprim
              left join mod_datosmaestros.nom_marca nom on nom.idmarca = nindh.idmarca
              where drna.idregnumerico = daf.idregnumerico) as denomcilindro,
            -1,
            ni.idindicador,
            (case when def.minutosactividad > 0 then (SELECT make_interval(0,0,0,0,0,CAST(def.minutosactividad as integer))) else null end) as tiempo,
            null,
            null,
            -1,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 2 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto

            from mod_logfacturacion.dat_elementosfactura def
            --left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            inner join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = daf.idindicador        
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            inner join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            inner join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            where def.idfactura = $1)
            
            UNION
            
            (select 

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            (case when def.idunidadmedida is null then num.abreviaturaunidadmedida else (
                select uma.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uma where uma.idunidadmedida = def.idunidadmedida
            ) end) as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            (CASE WHEN dpn.tipo = 1 THEN 'Productos' ELSE 'Servicios Asociados' END) as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                    ,
                        (CASE WHEN dpn.tipo = 1 THEN 
                        COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                        ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable))
                        ELSE (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable) END)
                        
                    ) as monedaitem,
            COALESCE(cf.denominacion, ni2.denominacion) as denomcilindro,
            COALESCE(cf.cantidad, pserv.cantidad) as cantcilindro,
            coalesce(pserv.idprodservicio, ni.idindicador),
            (case when def.minutosactividad > 0 then (SELECT make_interval(0,0,0,0,0,CAST(def.minutosactividad as integer))) else null end) as tiempo,
            null,
            coalesce(pserv.matricula,ni2.numeropieza) as codigocilindro,
            coalesce(pserv.preciobase,0),
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 2 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto

            from mod_logfacturacion.dat_elementosfactura def
            inner join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            --left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador        
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = def.idelementofactura
            left join mod_logfacturacion.dat_prodservicios pserv on pserv.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni2 on ni2.idindicador = pserv.idindicador
            inner join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            where def.idfactura = $1)
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            '' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
            ,
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
            ) as monedaitem, null, null, null, null, null, null, null,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 3 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto
            from mod_logfacturacion.dat_elementosfactura def 
			left join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dps.idindicador
            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad
            
            inner join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza

            where def.idfactura = $1)

            union

            (select

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,

            (select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) as precio,

            round((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2),2) as importe,
            COALESCE((select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as precioalternativo,
            COALESCE((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Productos' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dm.idmovimiento as identificador,
            0 as estado,
            coalesce(dprod.cantidad,0) as existencia,
            COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
            ,
                COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
                ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro,
            ni.idindicador,null, null, null, null,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto

            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
            
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idmovimiento = dm.idmovimiento
            
            inner join mod_logistica.dat_documento d on d.iddocumento = dm.iddocumento
                        
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun

            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza

            where dm.iddocumento = $1)
            
            union
            
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0) as precio,

            round(COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0),2) as importe,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as precioalternativo,

            COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'Z' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dcp.idcategoriaprecio as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp11 on ddcp11.idmonedacategoria = mmo.idmoneda
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddcp11.idcategoriafactura = dcp.idcategoriafactura limit 1)
                ,
                	COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        inner join mod_logfacturacion.dat_categoriapreciofactura dcp11 on dcp11.idfactura = ddfm.idfactura
                        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp11 on ddcp11.idcategoriafactura = dcp11.idcategoriafactura
                        where ddfm.idfactura = p_iddocumento and dcp11.idcategoriafactura = dcp.idcategoriafactura 
                        and ddcp11.idmonedacategoria is null limit 1)
                    ,
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                    )
                )
            ) as monedaitem,
            null, -1, null, null,null,null,-1,  
            null as codigoproducto,
            null as denomproducto,
            null as ordeninsercion,
            null as  codigofabricante,
            null as naturalezaprod,
            null as ordenproducto
            

            from mod_logfacturacion.dat_categoriapreciofactura dcp
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio        
            where dcp.idfactura = $1))q
            order by 
            case when q.ordenproducto = 1 then q.codigoproducto end,
            case when q.ordenproducto = 2 then q.denomproducto end,
            case when q.ordenproducto = 3 then q.ordeninsercion end,
            case when q.ordenproducto = 4 then q.codigofabricante end,
            case when q.ordenproducto = 5 then q.naturalezaprod end

           loop
                v_diferencia = 0;
                if v_rec.codigo = '-' and v_rec.identificador is not null then
                    v_diferencia := (select coalesce((
                    coalesce((select sum(round(coalesce(mm.precio*dm.cantidad,0),2)+round(coalesce(des.preciotarifa*de.cantidad,0),2)) from mod_logistica.dat_documento dd
                    left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                    left join mod_logfacturacion.dat_elementosfactura de on de.idfactura = dd.iddocumento
                    left join mod_logistica.dat_movmoneda mm on mm.idmovimiento = dm.idmovimiento and mm.idmoneda = 9900000000
                    left join mod_logfacturacion.dat_desgloselemento des on des.idelementofactura = de.idelementofactura and des.idmoneda = 9900000000
                    inner join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento or ec.idelementofactura = de.idelementofactura
                    where dd.iddocumento = $1 and ec.idcuentadesgloseprecio = v_rec.identificador),0)
                    -
                    coalesce((select sum(round(coalesce(dm.preciocontable*dm.cantidad,0),2) + round(coalesce(de.preciotarifabase*de.cantidad,0),2))
                              +sum(coalesce(round(coalesce(ec.valor*dm.cantidad),2),0)) from mod_logistica.dat_documento dd
                    left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                    left join mod_logfacturacion.dat_elementosfactura de on de.idfactura = dd.iddocumento
                    left join mod_logistica.dat_movmoneda mm on mm.idmovimiento = dm.idmovimiento and mm.idmoneda = 9900000000
                    left join mod_logfacturacion.dat_desgloselemento des on des.idelementofactura = de.idelementofactura and des.idmoneda = 9900000000
                    inner join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento or ec.idelementofactura = de.idelementofactura
                    where dd.iddocumento = $1 and ec.idcuentadesgloseprecio = v_rec.identificador),0)),0));
                    
                    v_rec.precio = v_rec.precio + v_diferencia;
                    v_rec.importe = v_rec.importe + v_diferencia;
                end if;
                v_rec.monedafactura := (select COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                ));
                if lower(v_rec.tipoindicador) = 'z' or lower(v_rec.tipoindicador) = 'y' then
	                if v_rec.importe > 0 then
	                	return next v_rec;
	                end if;
				else
					return next v_rec;
				end if;    
            end loop;
        else
        	for v_rec in              

            select q.* 
            from ((select 
				   
            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            (case when def.idunidadmedida is null then num.abreviaturaunidadmedida else (
            	select uma.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uma where uma.idunidadmedida = def.idunidadmedida
            ) end) as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Productos' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                    ,
                        (COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                        ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)))
                        
                    ) as monedaitem,
            (SELECT 
              (
              (case when nomdlo.denominacion is null then '' else  'Modelo: '||nomdlo.denominacion end)
              ||(case when nom.denominacion is null then '' else  '-Marca: '||nom.denominacion end)
              ||(case when drnat.nromatricula is null then '' else '-Matricula: ' ||drnat.nromatricula end  )
              ||(case when drnat.nromotor1 is null then '' else '-NoMotor: '|| drnat.nromotor1 end)
              ||(case when nomc.denominacion is null then '' else '-Color: '||nomc.denominacion end)
              ||(case when drna.annofabricacion is null then '' else '-AñoFab: '||drna.annofabricacion end)
              ||(case when drn.nroserie is null then '' else '-Serie: '||drn.nroserie end)
              ||(case when drnat.vin is null then '' else '-Vin: '|| drnat.vin end)
              ) 
                FROM 
              mod_logactivofijotangible.dat_regnumericoactivo drna
              inner join mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drna.idregnumerico
              inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = drnat.idregnumerico  
              inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
              inner join mod_datosmaestros.nom_indicador nind on nind.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja nindh on nindh.idindicador = nind.idindicador
              left join mod_datosmaestros.nom_modelo nomdlo on nomdlo.idmodelo = nindh.idmodelo
              left join mod_logactivofijotangible.nom_color nomc on nomc.idcolor = drna.idcolorprim
              left join mod_datosmaestros.nom_marca nom on nom.idmarca = nindh.idmarca
              where drna.idregnumerico = daf.idregnumerico) as denomcilindro,
            -1,
            ni.idindicador,
            (case when def.minutosactividad > 0 then (SELECT make_interval(0,0,0,0,0,CAST(def.minutosactividad as integer))) else null end) as tiempo,
            null,
            null,
            -1,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 2 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto

            from mod_logfacturacion.dat_elementosfactura def
            --left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            inner join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = daf.idindicador        
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            inner join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            inner join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            where def.idfactura = $1)
            
            UNION
            
            (select 

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            (case when def.idunidadmedida is null then num.abreviaturaunidadmedida else (
                select uma.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uma where uma.idunidadmedida = def.idunidadmedida
            ) end) as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            (CASE WHEN dpn.tipo = 1 THEN 'Productos' ELSE 'Servicios Asociados' END) as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                    ,
                        (CASE WHEN dpn.tipo = 1 THEN 
                        COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                        ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable))
                        ELSE (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable) END)
                        
                    ) as monedaitem,
            COALESCE(cf.denominacion, ni2.denominacion) as denomcilindro,
            COALESCE(cf.cantidad, pserv.cantidad) as cantcilindro,
            coalesce(pserv.idprodservicio, ni.idindicador),
            (case when def.minutosactividad > 0 then (SELECT make_interval(0,0,0,0,0,CAST(def.minutosactividad as integer))) else null end) as tiempo,
            null,
            coalesce(pserv.matricula,ni2.numeropieza) as codigocilindro,
            coalesce(pserv.preciobase,0),
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 2 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto

            from mod_logfacturacion.dat_elementosfactura def
            inner join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            --left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador        
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = def.idelementofactura
            left join mod_logfacturacion.dat_prodservicios pserv on pserv.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni2 on ni2.idindicador = pserv.idindicador
            inner join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            where def.idfactura = $1)
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            '' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
            ,
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
            ) as monedaitem, null, null, null, null, null, null, null,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 3 then def.idelementofactura end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto
            from mod_logfacturacion.dat_elementosfactura def 
			left join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dps.idindicador
            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad
            
            inner join mod_logistica.dat_documento d on d.iddocumento = def.idfactura       
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza

            where def.idfactura = $1)

            union

            (select

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,

            (select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) as precio,

            round((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2),2) as importe,
            COALESCE((select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as precioalternativo,
            COALESCE((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Productos' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dm.idmovimiento as identificador,
            0 as estado,
            coalesce(dprod.cantidad,0) as existencia,
            COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
            ,
                COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
                ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro,
            ni.idindicador,null, null, null, null,
            case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
            case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
            case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion,
            case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
            case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
            conf.ordenproducto

            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
            
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idmovimiento = dm.idmovimiento
            
            inner join mod_logistica.dat_documento d on d.iddocumento = dm.iddocumento
                        
            left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun

            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza

            where dm.iddocumento = $1))q 
            order by 
            case when q.ordenproducto = 1 then q.codigoproducto end,
            case when q.ordenproducto = 2 then q.denomproducto end,
            case when q.ordenproducto = 3 then q.ordeninsercion end,
            case when q.ordenproducto = 4 then q.codigofabricante end,
            case when q.ordenproducto = 5 then q.naturalezaprod end

            loop
				v_rec.monedafactura := (select COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                ));
                return next v_rec;

            end loop;
        end if;
		
	END;
$BODY$;

ALTER FUNCTION mod_logfacturacion.f_modelofacturaprod(numeric, numeric, numeric)
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_logfacturacion.f_modelofacturaprod(numeric, numeric, numeric)
    IS 'ees';
