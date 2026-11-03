--------------- SQL ---------------

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_modelocomprobanteprod (
  p_iddocumento numeric,
  p_original numeric = 0
)
RETURNS SETOF mod_logpuntoventa.td_modelocomprobanteprod AS
$body$
	DECLARE

	v_rec mod_logpuntoventa.td_modelocomprobanteprod;

	BEGIN    
		for v_rec in select q.* from (select DISTINCT coalesce(ni.numeropieza, ni.codigo) as codigo,
        ni.denominacion as denom,num.abreviaturaunidadmedida as um, 
        (case when p_original = 1 then vp.cantidad else (vp.cantidad - coalesce(vp.cantidaddev,0)) end)  as cantidad, 
        vp.precio, 
        (case when p_original = 1 then vp.importetotal else ((vp.cantidad - coalesce(vp.cantidaddev,0)) * vp.precio) end)  as importetotal, 
        vp.descuento,
        (vp.cantidad * COALESCE(nih.peso,0)/1000) as peso,
        nn.denominacion as naturaleza
		
        from mod_logpuntoventa.dat_ventaproducto vp
        inner join mod_logistica.dat_producto dprod on dprod.idproducto = vp.idproducto
        left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador
        left join mod_datosmaestros.nom_naturaleza nn on ni.idnaturaleza = nn.idnaturaleza        
        left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
        left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dprod.idumedida
        --left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
        --left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
        where vp.idventas = $1
        group by ni.numeropieza,ni.codigo,nih.descripcionventa,ni.denominacion,num.abreviaturaunidadmedida,
        vp.cantidad,vp.cantidaddev,vp.precio,vp.importetotal,vp.descuento,nih.peso,ni.tipo
        having (case when p_original = 1 then vp.cantidad else vp.cantidad - coalesce(vp.cantidaddev,0) end) > 0
		UNION
		select DISTINCT coalesce(ni.numeropieza, ni.codigo) as codigo,
		        ni.denominacion as denom,num.abreviaturaunidadmedida as um, 
		        (case when p_original = 1 then vp.cantidad else (vp.cantidad - coalesce(vp.cantidaddev,0)) end)  as cantidad, 
        		vp.precio, 
        		(case when p_original = 1 then vp.importetotal else ((vp.cantidad - coalesce(vp.cantidaddev,0)) * vp.precio) end)  as importetotal, 
		        vp.descuento,
		        (vp.cantidad * COALESCE(nih.peso,0)/1000) as peso,
			    ni.tipo
		        from mod_logpuntoventa.dat_ventaservicio vp
		        inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = vp.idindicador        
		        inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
		        inner join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
		        --left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
		        --left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
		        where vp.idventas = $1
		        group by ni.numeropieza,ni.codigo,nih.descripcionventa,ni.denominacion,num.abreviaturaunidadmedida,
		        vp.cantidad,vp.cantidaddev,vp.precio,vp.importetotal,vp.descuento,nih.peso,ni.tipo
				having (case when p_original = 1 then vp.cantidad else vp.cantidad - coalesce(vp.cantidaddev,0) end) > 0
		) q order by q.tipo, q.codigo
		loop
			return next v_rec;
		end loop;
	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;