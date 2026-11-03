CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelopedido (
  p_iddocumento numeric
)
RETURNS SETOF mod_logdistribucion.td_modelopedido AS
$body$
declare
all_rec mod_logdistribucion.td_modelopedido;
begin
for all_rec in
select distinct
des.denominacion,
dd.nrodoc,
dd.fechacontable,
dd.observaciones,
su.nombreusuario as creadopor,
su1.nombreusuario as aprobadopor,
i.urllogo,
des.codigo,
ndp.denominacion,
(select sum((case when dpp.servicio = 1 then nih.precio 
		  		  when dpp.servicio = 0 then (dpp.cantidad * nih.precio) end))                  
from mod_logdistribucion.dat_productopedido dpp
inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dpp.idproducto
where dpp.idpedido = dp.iddocumento)as importe,

coalesce(c.nombre,coalesce(de.denominacion,concat(dper.nombre,' ',dper.snombre,' ',dper.papel,' ',dper.sapel))) as denominacioncliente,
coalesce(de.codigo,(coalesce(ddi.numero,c.codigo))) as codigocliente,
coalesce(de.direccion,(coalesce(ddcc.direccion,c.direccion))) as direccioncliente,
des.direccion as direccionentidad,
(select sum((case when dpp.servicio = 1 then nih.precio end))                  
from mod_logdistribucion.dat_productopedido dpp
inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dpp.idproducto
where dpp.idpedido = dp.iddocumento) as importeservicio,

(select sum((case when dpp.servicio = 0 then (dpp.cantidad * nih.precio) end))                  
from mod_logdistribucion.dat_productopedido dpp
inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dpp.idproducto
where dpp.idpedido = dp.iddocumento)as importeproducto,
dd.estado

from mod_logistica.dat_documento dd 
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
inner join mod_logdistribucion.dat_pedido dp on dp.iddocumento = dd.iddocumento     
inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = dd.iddocumento
left join mod_datosmaestros.nom_clientesproveedor c on dc.idcliente = c.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = c.idestructura
left join mod_persona.dat_persona dper on dper.idpersona = c.idpersona
left join mod_persona.dat_docidentidad ddi on ddi.idpersona = dper.idpersona
left join mod_persona.dat_direccion ddcc on ddcc.idpersona = dper.idpersona
left join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
left join mod_logistica.conf_general i on i.idestructura = des.idestructura 
where dd.iddocumento = $1
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