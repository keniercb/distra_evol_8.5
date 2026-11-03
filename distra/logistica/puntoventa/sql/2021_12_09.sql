DROP FUNCTION mod_logpuntoventa.f_modelocomprobanteprod(p_iddocumento numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_modelocomprobanteprod (
  p_iddocumento numeric,
  p_original numeric = 0
)
RETURNS SETOF mod_logpuntoventa.td_modelocomprobanteprod AS
$body$
	DECLARE

	v_rec mod_logpuntoventa.td_modelocomprobanteprod;

	BEGIN    
		for v_rec in select DISTINCT coalesce(ni.numeropieza, ni.codigo) as codigo,
        ni.denominacion as denom,num.abreviaturaunidadmedida as um, 
        (case when p_original = 1 then vp.cantidad else (vp.cantidad - coalesce(vp.cantidaddev,0)) end)  as cantidad, 
        vp.precio, 
        (case when p_original = 1 then vp.importetotal else ((vp.cantidad - coalesce(vp.cantidaddev,0)) * vp.precio) end)  as importetotal, 
        vp.descuento,
        (vp.cantidad * COALESCE(nih.peso,0)/1000) as peso  
        from mod_logpuntoventa.dat_ventaproducto vp
        inner join mod_logistica.dat_producto dprod on dprod.idproducto = vp.idproducto
        left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador        
        left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
        left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dprod.idumedida
        --left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
        --left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
        where vp.idventas = $1
        group by ni.numeropieza,ni.codigo,nih.descripcionventa,ni.denominacion,num.abreviaturaunidadmedida,
        vp.cantidad,vp.cantidaddev,vp.precio,vp.importetotal,vp.descuento,nih.peso
        having (case when p_original = 1 then vp.cantidad else vp.cantidad - coalesce(vp.cantidaddev,0) end) > 0
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

ALTER FUNCTION mod_logpuntoventa.f_modelocomprobanteprod (p_iddocumento numeric, p_original numeric)
  OWNER TO zeolides;
  
DROP FUNCTION mod_logpuntoventa.f_modelocomprobante(p_iddocumento numeric, p_idestructura numeric);
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_modelocomprobante (
  p_iddocumento numeric,
  p_idestructura numeric,
  p_original numeric = 0
)
RETURNS SETOF mod_logpuntoventa.td_modelocomprobante AS
$body$
declare
all_rec mod_logpuntoventa.td_modelocomprobante;
v_rec record;
v_recdes numeric = 0;
begin
for all_rec in
select 
COALESCE(dv.nrofactura,cast(dd.nrodoc as varchar)) as nrofactura,
dd.fechacontable,
mp.denominacion as modopago,
dvc.nombre as nombrecliente,
dvc.numeroidentidad as cicliente,
dvc.direccion as dircliente,
dvc.telefono as telefcliente,
dvc.correo as correocliente,
dd.observaciones,
case when p_original = 1 then dv.importe else dv.importe - coalesce(dv.importedevuelto,0) end as subtotal,
(select sum(vp.descuento) from mod_logpuntoventa.dat_ventaproducto vp where vp.idventas = dd.iddocumento) as descuento,
(select sum(vp.recargo) from mod_logpuntoventa.dat_ventaproducto vp where vp.idventas = dd.iddocumento) as recargo,
case when p_original = 1 then dv.importe else dv.importe - coalesce(dv.importedevuelto,0) end as total,
nm.codigoiso,
COALESCE(dav.nombre,(SELECT es.denominacion FROM mod_estructuracomp.dat_estructuraop es WHERE es.idestructuraop = p_idestructura)) as entidad,
COALESCE(dav.direccion,(SELECT dir.direccion FROM mod_estructuracomp.dat_estructuraop dir WHERE dir.idestructuraop = p_idestructura)) as direccion,
COALESCE(dav.telefono,(SELECT tl.telefono FROM mod_estructuracomp.dat_estructuraop tl WHERE tl.idestructuraop = p_idestructura)) as telefono,
COALESCE(dav.correo,(SELECT cr.correo FROM mod_estructuracomp.dat_estructuraop cr WHERE cr.idestructuraop = p_idestructura)) as correo,
i.urllogo as logo,
(per.nombre||' '||coalesce(per.snombre,'')||' '||per.papel||' '||per.sapel) as vendedor,
dd.estado, /*tarj.titular, tarj.digitos, nmv.codigoiso,*/'','','',dv.idpago
from mod_logistica.dat_documento dd
inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logpuntoventa.dat_areaventa dav on dav.idestructuraop = dd.idestructuracomun
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento 
left join mod_datosmaestros.nom_moneda nm on nm.idmoneda = dv.idmoneda
inner join mod_logpuntoventa.nom_modopago mp on mp.idmodopago = dv.idpago
left join mod_logpuntoventa.dat_ventacliente dvc on dvc.idventacliente = dv.idpersona
--left join mod_logpuntoventa.dat_ventastarjeta tarj on tarj.idventas = dv.idventas
--left join mod_datosmaestros.nom_moneda nmv on nmv.idmoneda = tarj.idmoneda
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
inner join mod_seguridad.seg_usuario u on u.idusuario = dd.idusuario
left join mod_persona.dat_persona per on per.idpersona = u.idpersona 
where dd.iddocumento = p_iddocumento
loop
return next all_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logpuntoventa.f_modelocomprobante (p_iddocumento numeric, p_idestructura numeric, p_original numeric)
  OWNER TO zeolides;