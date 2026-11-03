CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modelonotadcprodsuchel (
  p_iddocumento numeric,
  p_monedacontable numeric,
  p_monedalternativa numeric
)
RETURNS SETOF mod_logfacturacion.td_modelofacturaprod AS
$body$
	DECLARE

	v_rec mod_logfacturacion.td_modelofacturaprod;
    v_count numeric = 0;
	v_pos numeric = 0;
    
	BEGIN    

		for v_rec in              

        (/*select '****' as codigo,

        'Ninguno' as categoria,

        '****' as denom,

        '' as um,

        1 as cantidad,

        (COALESCE((SELECT abs(SUM(COALESCE(dpf.importe, ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) - 
              ROUND(COALESCE (dpf.importefactmn,0),2)))) as importe FROM mod_logistica.dat_movimiento m
			INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento
			INNER JOIN mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = m.idmovimiento
			WHERE m.iddocumento = $1 and dmm.idmoneda = $2), 0) + 
            COALESCE((SELECT abs(SUM(COALESCE(dde.importe, ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
            THEN def.cantidadfactura - def.cantidad 
            ELSE def.cantidad END),2) - 
            ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2)))) as importe FROM mod_logfacturacion.dat_elementosfactura def
			INNER JOIN mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
			WHERE def.idfactura = $1 and dde.idmoneda = $2), 0) + 
            COALESCE((SELECT abs(SUM(ddcp.valorcalculo) - SUM(COALESCE(ddcp.valorcalculofact,0))) as valorcalculo FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
			INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
			WHERE ddcp.concepto = '+' and dcpf.idfactura = $1 and ddcp.idmoneda = $2), 0) - COALESCE((SELECT abs(SUM(ddcp.valorcalculo) - SUM(COALESCE(ddcp.valorcalculofact,0))) as valorcalculo FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
			INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
			WHERE ddcp.concepto = '-' and dcpf.idfactura = $1 and ddcp.idmoneda = $2), 0)) as precio,

        (COALESCE((SELECT abs(SUM(COALESCE(dpf.importe, ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) - 
              ROUND(COALESCE (dpf.importefactmn,0),2)))) as importe FROM mod_logistica.dat_movimiento m
			INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento
			INNER JOIN mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = m.idmovimiento
			WHERE m.iddocumento = $1 and dmm.idmoneda = $2), 0) + 
            COALESCE((SELECT abs(SUM(COALESCE(dde.importe, ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
            THEN def.cantidadfactura - def.cantidad 
            ELSE def.cantidad END),2) - 
            ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2)))) as importe FROM mod_logfacturacion.dat_elementosfactura def
			INNER JOIN mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
			WHERE def.idfactura = $1 and dde.idmoneda = $2), 0) + 
            COALESCE((SELECT abs(SUM(ddcp.valorcalculo) - SUM(COALESCE(ddcp.valorcalculofact,0))) as valorcalculo FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
			INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
			WHERE ddcp.concepto = '+' and dcpf.idfactura = $1 and ddcp.idmoneda = $2), 0) - COALESCE((SELECT abs(SUM(ddcp.valorcalculo) - SUM(COALESCE(ddcp.valorcalculofact,0))) as valorcalculo FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
			INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
			WHERE ddcp.concepto = '-' and dcpf.idfactura = $1 and ddcp.idmoneda = $2), 0)) as importe,

        (COALESCE((SELECT abs(SUM(dmm.precio * m.cantidad) - SUM(COALESCE (dpf.importefactalt,0))) as importe FROM mod_logistica.dat_movimiento m
			INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento
			INNER JOIN mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = m.idmovimiento
			WHERE m.iddocumento = $1 and dmm.idmoneda = $3), 0) + 
            COALESCE((SELECT abs(SUM(dde.preciotarifa * def.cantidad) - SUM(COALESCE(dde.preciotarifafactura,0) * def.cantidad)) as importe FROM mod_logfacturacion.dat_elementosfactura def
			INNER JOIN mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
			WHERE def.idfactura = $1 and dde.idmoneda = $3), 0) + 
            COALESCE((SELECT abs(SUM(ddcp.valorcalculo) - SUM(COALESCE(ddcp.valorcalculofact,0))) as valorcalculo FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
			INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
			WHERE ddcp.concepto = '+' and dcpf.idfactura = $1 and ddcp.idmoneda = $3), 0) - COALESCE((SELECT abs(SUM(ddcp.valorcalculo) - SUM(COALESCE(ddcp.valorcalculofact,0))) as valorcalculo FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
			INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
			WHERE ddcp.concepto = '-' and dcpf.idfactura = $1 and ddcp.idmoneda = $3), 0)) as precioalternativo,

        (COALESCE((SELECT abs(SUM(dmm.precio * m.cantidad) - SUM(COALESCE (dpf.importefactalt,0))) as importe FROM mod_logistica.dat_movimiento m
			INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento
			INNER JOIN mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = m.idmovimiento
			WHERE m.iddocumento = $1 and dmm.idmoneda = $3), 0) + 
            COALESCE((SELECT abs(SUM(dde.preciotarifa * def.cantidad) - SUM(COALESCE(dde.preciotarifafactura,0) * def.cantidad)) as importe FROM mod_logfacturacion.dat_elementosfactura def
			INNER JOIN mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
			WHERE def.idfactura = $1 and dde.idmoneda = $3), 0) + 
            COALESCE((SELECT abs(SUM(ddcp.valorcalculo) - SUM(COALESCE(ddcp.valorcalculofact,0))) as valorcalculo FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
			INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
			WHERE ddcp.concepto = '+' and dcpf.idfactura = $1 and ddcp.idmoneda = $3), 0) - COALESCE((SELECT abs(SUM(ddcp.valorcalculo) - SUM(COALESCE(ddcp.valorcalculofact,0))) as valorcalculo FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
			INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
			WHERE ddcp.concepto = '-' and dcpf.idfactura = $1 and ddcp.idmoneda = $3), 0)) as importealternativo,

        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
        'No tiene' as numeroserie,
        0 as recargoalternativa,

        0 as recargocontable,
        'Monto' as tipoindicador*/
        select 
        	(case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,
            '' as categoria,
            ni.denominacion,
            num.abreviaturaunidadmedida,
            dm.cantidad,
            (case when dpf.importe is not null and dpf.importe > 0 then 0 else 
            	COALESCE((SELECT abs(dmm.precio - 
                  COALESCE (dpf.preciofactura,0)) as importe FROM mod_logistica.dat_movimiento m
                INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento
                INNER JOIN mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = m.idmovimiento
                WHERE m.idmovimiento = dm.idmovimiento and dmm.idmoneda = p_monedacontable), 0)
            end) as precio,
            (case when dpf.importe is not null and dpf.importe > 0 then dpf.importe ELSE
            COALESCE((SELECT abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) - 
              ROUND(COALESCE (dpf.importefactmn,0),2)) as importe FROM mod_logistica.dat_movimiento m
			INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento
			INNER JOIN mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = m.idmovimiento
			WHERE m.idmovimiento = dm.idmovimiento and dmm.idmoneda = p_monedacontable), 0)
            end) as importe,
            0 as precioalternativo,
            0 as importealternativo,
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'Productos' as tipoindicador
        
        	from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
        	
            where dm.iddocumento = p_iddocumento
            
            union
            
            select 
        	(case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,
            '' as categoria,
            ni.denominacion,
            num.abreviaturaunidadmedida,
            deff.cantidad,
            (case when ddee.importe is not null and ddee.importe > 0 then 0 else 
            	COALESCE((SELECT abs(dde.preciotarifa - COALESCE(dde.preciotarifafactura,0)) as importe 
                FROM mod_logfacturacion.dat_elementosfactura def
			INNER JOIN mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
			WHERE def.idelementofactura = deff.idelementofactura and dde.idmoneda = p_monedacontable), 0)
            end) as precio,
            (case when ddee.importe is not null and ddee.importe > 0 then ddee.importe ELSE
            COALESCE((SELECT abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
            THEN def.cantidadfactura - def.cantidad 
            ELSE def.cantidad END),2) - 
            ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2)) as importe FROM mod_logfacturacion.dat_elementosfactura def
			INNER JOIN mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
			WHERE def.idelementofactura = deff.idelementofactura and dde.idmoneda = p_monedacontable), 0)
            end) as importe,
            0 as precioalternativo,
            0 as importealternativo,
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'Productos' as tipoindicador
        
        	from mod_logfacturacion.dat_elementosfactura deff
            INNER JOIN mod_logfacturacion.dat_desgloselemento ddee on ddee.idelementofactura = deff.idelementofactura and ddee.idmoneda = p_monedacontable
            left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = deff.idelementofactura        
            left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = deff.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador		
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = deff.idelementofactura
            left join mod_logfacturacion.dat_prodservicios pserv on pserv.idelementofactura = deff.idelementofactura
            left join mod_datosmaestros.nom_indicador ni2 on ni2.idindicador = pserv.idindicador
            inner join mod_logistica.dat_documento d on d.iddocumento = deff.idfactura       
            inner join mod_loginventario.conf_inventario conf on conf.idestructuracomun = d.idestructuracomun
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            where deff.idfactura = p_iddocumento   
        )

		loop
			return next v_rec;
		end loop;

	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_modelonotadcprodsuchel (p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric)
  OWNER TO zeolides;