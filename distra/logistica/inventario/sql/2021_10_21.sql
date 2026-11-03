ALTER TYPE mod_logdistribucion.td_modelodistribucionproducto
  ADD ATTRIBUTE ubicacioncompleta VARCHAR(255);
  
CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucionproducto AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucionproducto;
begin
 for all_rec in
select DISTINCT
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denominacionproducto,
ni.numeropieza,
dpo.cantidad,
dum.abreviaturaunidadmedida,
ncat.denominacion as categoria,
dp.precio as precio,
coalesce(dp.precio * dpo.cantidad,0) as importe, 

(select dpoc.entregado from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as cantdespachado,

(select (dpoc.cantidadoriginal - dpoc.entregado) from mod_logdistribucion.dat_prodordencmpto dpoc where dpoc.idprodorden = dpo.idprodorden)  as catparcial,
dp.precioalternativo as preciocuc,
coalesce(dp.precioalternativo * dpo.cantidad,0) as importecuc,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dpo.idorden,
btrim(concat(desop.codigo,'-',desop.denominacion ),'-') as deposito,

(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))
      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)
from mod_logistica.dat_documentocliente ddc 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ddc.iddocumento = dpo.idorden and ncp.idclientesproveedores = dpo.idcliente) as entregara,

(select (case when a.tipocliente = 1 then (coalesce(b.direccion,coalesce(e.direccion,d.direccion))) end) 
from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores
left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = b.idestructura 
left join mod_persona.dat_persona c on c.idpersona = b.idpersona
left join mod_persona.dat_direccion d on d.idpersona = c.idpersona
where a.iddocumento = dpo.idorden and b.idclientesproveedores = dpo.idcliente
) as direccion,

(select (case when a.tipocliente = 1 then (select dcb.numerocuenta from mod_datosmaestros.dat_cuentabanccliente dcb 
where dcb.idclienteproveedores = b.idclientesproveedores and dcb.predeterminado = 1)end)
from mod_logistica.dat_documentocliente a
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dpo.idorden and b.idclientesproveedores = dpo.idcliente) as cuentabancaria,

(select ns.numero from mod_datosmaestros.nom_sucursal ns
inner join mod_datosmaestros.dat_cuentabanccliente dcb on dcb.idsucursal = ns.idsucursal
left join mod_datosmaestros.nom_clientesproveedor b on  dcb.idclienteproveedores = b.idclientesproveedores
left join mod_logistica.dat_documentocliente a on a.idcliente = b.idclientesproveedores
where dcb.predeterminado = 1 and a.iddocumento = dpo.idorden and b.idclientesproveedores = dpo.idcliente) as numerosucursal,

(select a.tipocliente from mod_logistica.dat_documentocliente a 
left join mod_datosmaestros.nom_clientesproveedor b on a.idcliente = b.idclientesproveedores 
where a.iddocumento = dpo.idorden and b.idclientesproveedores = dpo.idcliente) as tipocliente,
dpo.idcliente,
(select * from mod_loginventario.f_obtenerubicompleta(deup.idestructuraubicacion,deup.nivel)) as ubicacioncompleta
from mod_logdistribucion.dat_prodorden dpo
left join mod_logistica.dat_producto dp on dpo.idproducto = dp.idproducto  
left join mod_logistica.nom_categoria ncat on ncat.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on dp.idindicador = ni.idindicador 
left join mod_datosmaestros.nom_unidadmedida dum on dp.idumedida = dum.idunidadmedida
left join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dp.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = nf.idfila
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun

left join mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dp.idproducto
left join mod_logubicacion.dat_estructuraubicacion deup on deup.idestructuraubicacion = dup.idubicacion
where dpo.idorden = p_iddocumento
order by dpo.idorden DESC
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