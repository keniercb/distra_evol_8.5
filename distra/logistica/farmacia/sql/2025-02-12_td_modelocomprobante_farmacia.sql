--------------- SQL ---------------

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_modelocomprobante_farmacia (
  p_iddocumento numeric,
  p_idestructura numeric,
  p_original numeric = 0
)
RETURNS SETOF mod_logpuntoventa.td_modelocomprobante_farmacia AS
$body$
declare
all_rec mod_logpuntoventa.td_modelocomprobante_farmacia;
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
((select sum(vp.descuento) from mod_logpuntoventa.dat_ventaproducto vp where vp.idventas = dd.iddocumento)
 + case when dv.conceptoventa = '-' then COALESCE(dv.calculoconcepto,0) else 0 end) as descuento,
((select sum(vp.recargo) from mod_logpuntoventa.dat_ventaproducto vp where vp.idventas = dd.iddocumento)
+ case when dv.conceptoventa = '+' then COALESCE(dv.calculoconcepto,0) else 0 end) as recargo,
case when p_original = 1 then dv.importe else dv.importe - coalesce(dv.importedevuelto,0) end as total,
nm.codigoiso,
COALESCE(dav.nombre,(SELECT es.denominacion FROM mod_estructuracomp.dat_estructuraop es WHERE es.idestructuraop = p_idestructura)) as entidad,
COALESCE(dav.direccion,(SELECT dir.direccion FROM mod_estructuracomp.dat_estructuraop dir WHERE dir.idestructuraop = p_idestructura)) as direccion,
COALESCE(dav.telefono,(SELECT tl.telefono FROM mod_estructuracomp.dat_estructuraop tl WHERE tl.idestructuraop = p_idestructura)) as telefono,
COALESCE(dav.correo,(SELECT cr.correo FROM mod_estructuracomp.dat_estructuraop cr WHERE cr.idestructuraop = p_idestructura)) as correo,
i.urllogo as logo,
(per.nombre||' '||coalesce(per.snombre,'')||' '||per.papel||' '||per.sapel) as vendedor,
dd.estado, /*tarj.titular, tarj.digitos, nmv.codigoiso,*/'','','',dv.idpago, coalesce(dvo.nroorden, '-') as nropedido,
dv.idoperacion,doc.imagen as qrdocumento, imgtr.imagen as qrenzona, imgez.imagen as qrtransfermovil, naturaleza as idnaturaleza
from mod_logistica.dat_documento dd
inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = dd.iddocumento
inner join mod_logistica.dat_producto dp on dp.idventas = dv.idventas
inner join mod_datosmaestros.nom_indicador ni on dp.idindicador = ni.idindicador
inner join mod_datosmaestros.nom_naturaleza nn on ni.idnaturaleza = nn.idnaturaleza
left join mod_logpuntoventa.dat_ventaorden dvo on dvo.idventas = dv.idventas
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logpuntoventa.dat_areaventa dav on dav.idestructuraop = dd.idestructuracomun and dav.idestructuracomun = p_idestructura
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
left join mod_logistica.dat_documentoimagen ddoc on ddoc.iddocumento = dd.iddocumento and ddoc.tipo = 3
left join mod_logistica.nom_imagen doc on doc.idimagen = ddoc.idimagen
left join mod_logistica.dat_documentoimagen dtr on dtr.iddocumento = dd.iddocumento and dtr.tipo = 2
left join mod_logistica.nom_imagen imgtr on dtr.idimagen = imgtr.idimagen
left join mod_logistica.dat_documentoimagen dez on dez.iddocumento = dd.iddocumento and dez.tipo = 1
left join mod_logistica.nom_imagen imgez on dez.idimagen = imgez.idimagen
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