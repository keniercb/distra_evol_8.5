ALTER TYPE mod_loginventario.td_modeloapertura
  DROP ATTRIBUTE codigo,
  DROP ATTRIBUTE denominacion,
  DROP ATTRIBUTE um,
  DROP ATTRIBUTE categoria,
  DROP ATTRIBUTE codigoproveedor,
  DROP ATTRIBUTE precio,
  DROP ATTRIBUTE cantidad,
  DROP ATTRIBUTE importe,
  DROP ATTRIBUTE precioalternativo,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE monedaalternativa,
  DROP ATTRIBUTE monedacontable,
  DROP ATTRIBUTE cuenta,
  DROP ATTRIBUTE cuentaalt,
  DROP ATTRIBUTE atribprod;
  


DROP FUNCTION mod_loginventario.f_modeloapertura (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);
CREATE OR REPLACE FUNCTION mod_loginventario.f_modeloapertura (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modeloapertura AS
$body$
declare
  all_rec mod_loginventario.td_modeloapertura;
begin
for all_rec in
select distinct
(case when de.idestructura is not null then
  (case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
       when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
  end)
else
  (case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(deopa.codigo,'-',deopa.denominacion),'-') when ci.esminfar = 1 then deopa.codigo end)
       when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(deopa.codigo,'-',deopa.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.dat_estructuraop where idestructuraop = ci.idpadre limit 1) end)
  end)
end)
,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',coalesce( de.codigo,deopa.codigo),'-',deop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable,
btrim(concat(deop.codigo,'-',deop.denominacion),'-'),
su1.nombreusuario as aprobadopor,
dd.observaciones,
i.urllogo as icono,
dd.estado,
dd.numeroref,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.idusuario limit 1) as nombrepersona,


(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.idusuario limit 1) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.aprobadopor limit 1) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar
from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopa on deopa.idestructuraop = des.idestructuracomun
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos 
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
left join mod_logistica.conf_general i on (i.idestructura = de.idestructura OR i.idestructura = deopa.idestructuraop)
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_modeloaperturaproducto
  ADD ATTRIBUTE cuenta VARCHAR(255),
  ADD ATTRIBUTE cuentaalt VARCHAR(255);

CREATE OR REPLACE FUNCTION mod_loginventario.f_modeloaperturaproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modeloaperturaproducto AS
$body$
declare
  all_rec mod_loginventario.td_modeloaperturaproducto;
begin
for all_rec in
select distinct
ni.codigo,
ni.denominacion,
num.abreviaturaunidadmedida as unidadmedida,
nc.denominacion as categoria,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
coalesce(dm.preciocontable,0),
coalesce(dm.cantidad,0),
coalesce(dm.importecontable,0),
coalesce(dm.precioalternativo,0),
coalesce(dm.importealternativo,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable),
'',--(select atributo from mod_loginventario.f_modeloaperturatribprod(dp.idproducto)) as atribprod
(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuenta,
(select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuentaalt
from mod_logistica.dat_movimiento dm 
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_informediferencias
  DROP ATTRIBUTE codprod,
  DROP ATTRIBUTE catprod,
  DROP ATTRIBUTE prod,
  DROP ATTRIBUTE um,
  DROP ATTRIBUTE sobrante,
  DROP ATTRIBUTE faltante,
  DROP ATTRIBUTE importesobfalt,
  DROP ATTRIBUTE preciodiferencia,
  DROP ATTRIBUTE importediferencia,
  DROP ATTRIBUTE otros,
  DROP ATTRIBUTE importeotros,
  DROP ATTRIBUTE punitario,
  DROP ATTRIBUTE importe,
  DROP ATTRIBUTE codigoproveedor,
  DROP ATTRIBUTE precioalternativo,
  DROP ATTRIBUTE importealternativo,
  DROP ATTRIBUTE monedaalternativa,
  DROP ATTRIBUTE monedacontable;

 -- object recreation
DROP FUNCTION mod_loginventario.f_modelodiferencia(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);
CREATE OR REPLACE FUNCTION mod_loginventario.f_modelodiferencia (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_informediferencias AS
$body$
declare
all_rec mod_loginventario.td_informediferencias;

begin 

for all_rec in
select distinct
i.urllogo,
ndp.denominacion as aliadoc,
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(deh.codigo,'-',deh.denominacion),'-') when ci.esminfar = 1 then deh.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(deh.codigo,'-',deh.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,

deh.codigo as reeup,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(ddh.nrodoc as varchar) when ci.esminfar = 1 then cast(ddh.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(ddh.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(ddh.nrodoc,'-',deh.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

ddh.fechacontable,
btrim(concat(deop.codigo,'-',deop.denominacion ),'-') as deposito,
(select COALESCE(ncp.nombre,COALESCE(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ncp.idclientesproveedores = ddco.idcliente limit 1) as sum,
(select COALESCE(ncp.direccion,de.direccion)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ncp.idclientesproveedores = ddco.idcliente limit 1) as dirsum,
ndpo.denominacion as aliadocorigen,
ddo.fechacontable as fechaorigen,
dr.nrocontrato as contratorecep,
ddh.observaciones as obsum,
  (select COALESCE(ncp.nombre,de.denominacion)
  from mod_datosmaestros.nom_clientesproveedor ncp 
  left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
  where ncp.idclientesproveedores = ddt.idorganizacion limit 1) as entransp,
  
  (select COALESCE(ncp.direccion,de.direccion)
  from mod_datosmaestros.nom_clientesproveedor ncp 
  left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
  where ncp.idclientesproveedores = ddt.idorganizacion limit 1) as dirtransp,
  
  (select COALESCE(ncp.codigo,de.codigo)
  from mod_datosmaestros.nom_clientesproveedor ncp 
  left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
  where ncp.idclientesproveedores = ddt.idorganizacion limit 1) as reeuptransp,
ddt.nombreconductor as conductor,
ddt.ciconductor as ci,
ddt.matricula as chapa,
ddt.cartaporte as cartaporte,
(case when drr.viatransporte = 1 then 'Ferroviario'
      when drr.viatransporte = 2 then 'Marítimo'
      when drr.viatransporte = 3 then 'Aérea'
      when drr.viatransporte = 4 then 'Terrestre'
end)as via,
ddo.observaciones as obsrecep,
(case when cio.idestructuracomun = cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then cast(ddo.nrodoc as varchar) end)
     when cio.idestructuracomun <> cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then btrim(concat(ddo.nrodoc,'-',deo.codigo,'-',deopo.codigo),'-') end)
end) as nrodoco,

(select COALESCE(ncp.codigo,de.codigo)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ncp.idclientesproveedores = ddco.idcliente limit 1) as reuupsum,
(select dcb.numerocuenta from mod_datosmaestros.dat_cuentabanccliente dcb 
inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dcb.idclienteproveedores
where ncp.idclientesproveedores = ddco.idcliente and dcb.predeterminado = 1 limit 1) as numerocuenta,
(select ns.numero from mod_datosmaestros.nom_sucursal ns
inner join mod_datosmaestros.dat_cuentabanccliente dcb on dcb.idsucursal = ns.idsucursal
inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dcb.idclienteproveedores
where ncp.idclientesproveedores = ddco.idcliente and dcb.predeterminado = 1 limit 1) as numerosucursal,
dr.nrodocorigen,
deh.direccion,
ddh.estado,
ddo.numeroref,
dr.fechacontrato as fechacontratorecep,
dr.fechadocorigen as fechadocorigenrecep,
dr.nrodocorigen as nrodocorigenrecep,
nop.denominacion as denomoperrecep,
ddt.casilla,
dr.cantbulto,
(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = ddh.idusuario limit 1) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = ddh.idusuario limit 1) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = ddh.aprobadopor limit 1) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = ddh.aprobadopor limit 1) as cargopersonaprobar
from mod_logistica.dat_documento ddh
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = ddh.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddh.idestructuracomun
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras deh on deh.idestructura = des.idestructuracomun
inner join mod_logistica.conf_general i on i.idestructura = deh.idestructura
inner join mod_logistica.dat_documentopadre ddpad on ddpad.iddocumento = ddh.iddocumento
inner join mod_logistica.dat_documento ddo on ddo.iddocumento = ddpad.idpadre
inner join mod_logistica.dat_documentocliente ddco on ddco.iddocumento = ddo.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddpo on ddpo.iddoc = ddo.iddoc
inner join mod_datosmaestros.nom_docprim ndpo on ndpo.iddocumentos = ddpo.iddocumentos
inner join mod_loginventario.dat_reclamacion drr on drr.iddocumento = ddh.iddocumento
inner join mod_loginventario.dat_recepcion dr on dr.iddocumento = drr.idrecepcion
inner join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = ddo.idoperacion
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = ddo.iddocumento
left join mod_datosmaestros.dat_estructurasubsist deso on deso.idestructurasubsist = ddpo.idestructurasubsist
left join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = deso.idestructuracomun
left join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopo on deopo.idestructuraop = ddo.idestructuracomun
where ddh.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;


 CREATE OR REPLACE FUNCTION mod_loginventario.f_modelodiferenciaproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_informediferenciasproducto AS
$body$
declare
all_rec mod_loginventario.td_informediferenciasproducto;

begin 

for all_rec in
select distinct
ni.codigo as codprod,
nc.denominacion as catprod,
ni.denominacion as prod,
num.abreviaturaunidadmedida as um,
(case when dmd.signo = '1' then dmd.cantidaddiferencia else 0 end) as sobrante,
(case when dmd.signo = '2' then dmd.cantidaddiferencia else 0 end) as faltante,
coalesce((dmd.cantidaddiferencia * dm.preciocontable),0) as importesobfalt,
coalesce(dmd.preciodiferencia,0),
coalesce(dmd.importediferencia,0),
COALESCE((select sum(dmdc.cantidaddiferencia) from mod_loginventario.dat_movdiferenciacalidad dmdc where dmdc.idmovimiento = dm.idmovimiento),0) as  otros, 
COALESCE((select (sum(dmdc.cantidaddiferencia)* dm.preciocontable) from mod_loginventario.dat_movdiferenciacalidad dmdc where dmdc.idmovimiento = dm.idmovimiento),0) as importeotros,
coalesce(md.preciodiferencia) as punitario,
coalesce(md.importediferencia,0) as importe,
ni.numeropieza,
COALESCE(md.preciodiferenciaalt,0),
COALESCE(md.importediferenciaalt,0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable
from mod_logistica.dat_movimiento dm
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_loginventario.dat_movdiferencia dmd on dmd.idmovimiento = dm.idmovimiento
left join mod_loginventario.dat_movdiferencia md on md.idmovimiento = dm.idmovimiento
where dm.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;


 -- object recreation
DROP FUNCTION mod_loginventario.f_modelorecepcion(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE FUNCTION mod_loginventario.f_modelorecepcion (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_recepcion AS
$body$
declare
all_rec mod_loginventario.td_recepcion;
begin
for all_rec in
select distinct
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,
    
btrim(concat(deop.codigo,'-',deop.denominacion),'-'),
    
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,
    
dd.fechacontable as fechadocumento,
nop.denominacion,
dr.nrodocorigen,
(select ddo.fechacontable from mod_loginventario.dat_reclamacion drr   where drr.iddocumento = ddo.iddocumento limit 1) as fechareclamacion,

(case when cio.idestructuracomun = cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then cast(ddo.nrodoc as varchar) end)
     when cio.idestructuracomun <> cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then btrim(concat(ddo.nrodoc,'-',deo.codigo,'-',deopo.codigo),'-') end)
end) as nroreclamacion,
--(select ddo.nrodoc from mod_loginventario.dat_reclamacion _dr where _dr.iddocumento = ddo.iddocumento limit 1) as nroreclamacion,
dr.nrocontrato,
ddt.manifiesto,
ddt.partida,
ddt.casilla,
ddt.embarque,
(select coalesce(c.nombre,coalesce(de.denominacion,concat(dper0.nombre,' ',dper0.snombre,' ',dper0.papel,' ',dper0.sapel)))
from mod_logistica.dat_documentotransporte ddt 
    left join mod_datosmaestros.nom_clientesproveedor c on c.idclientesproveedores = ddt.idorganizacion 
    left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = c.idestructura 
    left join mod_persona.dat_persona dper0 on dper0.idpersona = c.idpersona
    where ddt.iddocumento =dd.iddocumento limit 1) as enttransp,
ddt.nombreconductor,
ddt.ciconductor,
ddt.cartaporte,
ddt.matricula,
i.urllogo as icono,
dr.fechacontrato,
dd.observaciones,
(case when ddc.tipocliente = 3 then (select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = ddc.idcliente) else 
(select coalesce(c.nombre,coalesce(dee.denominacion,(concat(dper.nombre,' ',dper.snombre,' ',dper.papel,' ',dper.sapel))))
from mod_logistica.dat_documentocliente ddc 
    left join mod_datosmaestros.nom_clientesproveedor c on c.idclientesproveedores = ddc.idcliente 
    left join mod_estructuracomp.v_dametodasestructuras dee on dee.idestructura = c.idestructura 
    left join mod_persona.dat_persona dper on dper.idpersona = c.idpersona
    where ddc.iddocumento =dd.iddocumento limit 1) end)
 as suministrador,
ndp.denominacion,
de.codigo as reeup,
deop.codigo as codigoop,      
(case when ddc.tipocliente = 3 then (select codigo from mod_estructuracomp.dat_estructuraop where idestructuraop = ddc.idcliente) else 
(select coalesce(ded.codigo,(coalesce(ddi.numero,c.codigo)))
from mod_logistica.dat_documentocliente ddc 
    left join mod_datosmaestros.nom_clientesproveedor c on c.idclientesproveedores = ddc.idcliente 
    left join mod_estructuracomp.v_dametodasestructuras ded on ded.idestructura = c.idestructura 
    left join mod_persona.dat_persona dper on dper.idpersona = c.idpersona
    left join mod_persona.dat_docidentidad ddi on ddi.idpersona = dper.idpersona
    where ddc.iddocumento =dd.iddocumento limit 1) end) as codigosuministrador,
    dd.estado,
    ddo.numeroref as numeroref,
    dr.fechadocorigen as fechadocorigen,
dr.cantbulto,
dr.tipobulto,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.idusuario limit 1) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.idusuario limit 1) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.aprobadopor limit 1) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar
from mod_logistica.dat_documento dd
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento 
inner join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dpr.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.dat_recepcion dr on dr.iddocumento = dd.iddocumento
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dd.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = nf.idfila
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dpr.iddocumentos
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = dd.iddocumento
left join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = ddt.idorganizacion
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
left join mod_logistica.conf_general i on i.idestructura = de.idestructura        
left join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
left join mod_logistica.dat_documento ddo on ddo.iddocumento = ddp.iddocumento
left join mod_datosmaestros.dat_documentoprim ddpo on ddpo.iddoc = ddo.iddoc
left join mod_datosmaestros.dat_estructurasubsist deso on deso.idestructurasubsist = ddpo.idestructurasubsist
left join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = deso.idestructuracomun
left join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopo on deopo.idestructuraop = ddo.idestructuracomun
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;


ALTER TYPE mod_loginventario.td_recepcionproducto
  ADD ATTRIBUTE ubicacion VARCHAR(255);

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_recepcionproducto AS
$body$
declare
all_rec mod_loginventario.td_recepcionproducto;
begin
for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
nc.denominacion as categoria,
ni.numeropieza,
ni.denominacion as nombreproducto,
dum.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as cantidadproducto,
coalesce(round(dm.preciocontable,6),0),
coalesce(round((dm.preciocontable * dm.cantidad + coalesce(dm.recargodescuento, 0)),2),0),
dm.existenciaactual,
coalesce(round(dm.recargodescuento,2),0),
coalesce(round(dm.preciocontable,6),0) + coalesce(round(dm.recargodescuento/(case when dm.cantidad = 0 then 1 else dm.cantidad end),6),0) as preciounitariototal,
coalesce(round(dm.precioalternativo,6),0),
coalesce(round((dm.precioalternativo * dm.cantidad +dm.recargodescuentoalt),2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dmr.cantidad as cantidadporfactura,
dm.idmovimiento,
round((select sum(round(ddmv.importecontable,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = p_iddocumento),2) as importecup, 
round((select sum(round(ddmv.importealternativo,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = p_iddocumento),2) as importecuc,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion   
from mod_logistica.dat_movimiento dm
left join mod_loginventario.dat_movrecepcion dmr on dmr.idmovimiento = dm.idmovimiento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
where dm.iddocumento = p_iddocumento
order by dm.idmovimiento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;