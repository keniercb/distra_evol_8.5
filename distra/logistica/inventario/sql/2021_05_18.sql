 -- object recreation
DROP FUNCTION mod_logistica.f_movproducto(idestructuracomun numeric, p_idproducto numeric, p_aliasiddoc varchar, p_iddocs varchar, p_fechainicio date, p_fechafin date, p_idmonedacontable numeric, p_idmonedaalternativa numeric);

CREATE FUNCTION mod_logistica.f_movproducto (
  p_idestructuracomun numeric,
  p_idproducto numeric,
  p_aliasiddoc varchar,
  p_iddocs varchar,
  p_fechainicio date,
  p_fechafin date,
  p_idmonedacontable numeric,
  p_idmonedaalternativa numeric
)
RETURNS SETOF mod_logistica.td_movproducto AS
$body$
  declare
  v_rec mod_logistica.td_movproducto;
  begin
    for v_rec in
      select
      cg.urllogo as logo,
      de.denominacion as entidad,
      de.codigo as codentidad,
      deop.denominacion as deposito,
      deop.codigo as coddeposito,
      COALESCE(ni.numeropieza, ni.codigo) as codprod,
      ni.denominacion as denomprod,
      num.abreviaturaunidadmedida as um,
      (select i.descripcion from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuenta
      where h.idclasificacioncontable = dp.idclasificacioncontable and i.idcuenta <> i.idcuentapadre) as analisiscontable,

      (select descripcion from mod_contabilidad.nom_cuenta where idcuenta =  (select i.idcuentapadre from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuenta
      where h.idclasificacioncontable = dp.idclasificacioncontable) and idcuenta <> idcuentapadre) as subcontable,

      (select concat(concatcta,' ',descripcion) from mod_contabilidad.nom_cuenta where idcuenta =
      (select idcuentapadre from mod_contabilidad.nom_cuenta where idcuenta =  (select i.idcuentapadre from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuenta
      where h.idclasificacioncontable = dp.idclasificacioncontable)) and idcuenta = idcuentapadre) as cuenta,

      (select i.descripcion from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuentaalt
      where h.idclasificacioncontable = dp.idclasificacioncontable and i.idcuenta <> i.idcuentapadre) as analisisalter,

      (select descripcion from mod_contabilidad.nom_cuenta where idcuenta =  (select i.idcuentapadre from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuentaalt
      where h.idclasificacioncontable = dp.idclasificacioncontable) and idcuenta <> idcuentapadre) as subalter,

      (select concat(concatcta,' ',descripcion) from mod_contabilidad.nom_cuenta where idcuenta =
      (select idcuentapadre from mod_contabilidad.nom_cuenta where idcuenta =  (select i.idcuentapadre from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuentaalt
      where h.idclasificacioncontable = dp.idclasificacioncontable)) and idcuenta = idcuentapadre) as cuentaalter,
      dd.fechacontable as fecha,
      ndp.denominacion as tipodoc,
      dd.nrodoc,
      (select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(a.codigo,'-',a.nombre),'-') <> '' ) then btrim(concat(a.codigo,'-',a.nombre),'-') end),
  coalesce((case when (btrim(concat(b.codigo,'-',b.denominacion),'-') <> '') then btrim(concat(b.codigo,'-',b.denominacion),'-') end),
    btrim(concat(c.nombre,' ',c.snombre,' ',c.papel,' ',c.sapel)))))
            when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
              when ddc.tipocliente = 3 then (btrim(concat(g.codigo,'-',g.denominacion),'-')) end)
        from  mod_logistica.dat_documentocliente ddc
        left join mod_datosmaestros.nom_clientesproveedor a on a.idclientesproveedores = ddc.idcliente
        left join mod_estructuracomp.v_dametodasestructuras b on b.idestructura = a.idestructura
        left join mod_persona.dat_persona c on c.idpersona = a.idpersona
        left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
        left join mod_estructuracomp.dat_estructuraop g on g.idestructuraop = ddc.idcliente
        where ddc.iddocumento = dd.iddocumento)as pd,
        
      (case when dm.signo ='+' then (round(dm.cantidad,6)) end) as entradacant,
      (case when dm.signo ='+' then ( round(dm.importecontable,2)) end) as entradaimpcontable,
      (case when dm.signo ='+' then (round(dm.importealternativo,2)) end) as entradaimpalter,
      
      (case when dm.signo ='-' then round(dm.cantidad,6) end) as salidacant,
      (case when dm.signo ='-' then (round(dm.importecontable,2)) end) as salidaimpcontable,
      (case when dm.signo ='-' then (round(dm.importealternativo,2)) end) as salidaimpalter,
      
      dm.existenciaactual as existcant,
      dm.preciocontable as preciopromcontable,
      dm.precioalternativo as preciopromalter,
      dm.importecontable as importecontable,
      dm.importealternativo as importealter,
      (select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc
      inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta
      where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuenta,
      (select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc
      inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta
      where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuentaalt,
      round(dm.importetotal, 2) as importetotal,
      round(dm.importetotalalt, 2) as importetotalalt,
      round(dm.preciopromedio, 6) as preciopromedio,
      (select min(ddd.fechacontable)
      from mod_logistica.dat_documento ddd
      where ddd.idestructuracomun = $1) as fechaminima,

      (select max(ddd.fechacontable)
      from mod_logistica.dat_documento ddd
      where ddd.idestructuracomun = $1) as fechamaxima,
      dd.estado,
      (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $7) as monedacontable,   
      (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $8) as monedaalternativa      
      from mod_logistica.dat_movimiento dm
      inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
      inner join mod_logistica.dat_documento dd on dm.iddocumento = dd.iddocumento
      inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
      inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
      left join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
      left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = desu.idestructuracomun
      left join mod_logistica.conf_general cg on cg.idestructura = de.idestructura
      left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
      left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
      left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
      left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
      where dm.idproducto = $2 and dp.idestructura = $1
      and ndp.abreviatura in('valedev','valeLog','recepcionLog','inventariogLog','transferenciaLog','facturaLog',
      'ajusteLog','aperturaLog','conduceLog','revaluacionLog','compventaLog','compdevLog')
      and dd.cronologia > 0
      --and (dd.iddoc = any(cast($4 as numeric[])) or $4 is null)      
	  and ( CASE WHEN p_fechainicio is not null THEN dd.fechacontable >= p_fechainicio ELSE TRUE END)
	  and ( CASE WHEN p_fechafin is not null THEN dd.fechacontable <= p_fechafin ELSE TRUE END)
      order by dd.cronologia asc, dd.iddocumento asc
    loop
      return next v_rec;
    end loop;
  end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER TYPE mod_loginventario.td_listarinformerecepcion
  ADD ATTRIBUTE importe NUMERIC(25,6);
 
 CREATE OR REPLACE FUNCTION mod_loginventario.f_listarinformerecepcion (
  p_idestructuraop numeric,
  p_estado numeric,
  p_tipodocumento numeric,
  p_docorigen varchar,
  p_creadopor numeric,
  p_contabilizadopor numeric,
  p_fechainicio date,
  p_fechafin date,
  p_idestructura numeric
)
RETURNS SETOF mod_loginventario.td_listarinformerecepcion AS
$body$
declare
all_rec mod_loginventario.td_listarinformerecepcion;
begin
for all_rec in
select dd.nrodoc as numerodocumento,dd.fechacontable,
case when dd.estado = 1 then 'Elaboración'
when dd.estado = 2 then 'Preparado'
when dd.estado = 4 then 'Contabilizado'
when dd.estado = 7 then 'Cancelado'
when dd.estado = 13 then 'Preelaborado'
else null end as estado,
de.denominacion as entidad,
ves.denominacion as deposito,
(select concat(ncp.codigo,'-',ncp.nombre) 
from mod_datosmaestros.nom_clientesproveedor ncp
where ncp.idclientesproveedores = ddc.idcliente) as proveedor,
(select count (*) from mod_logistica.dat_movimiento m where m.iddocumento = dd.iddocumento) as cantidadprod,
coalesce(su.nombreusuario,'-') as creadopor,
coalesce(su1.nombreusuario,'-') as aprobadopor,
i.urllogo,
(select min(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_loginventario.dat_recepcion ddisd on ddisd.iddocumento = ddd.iddocumento 
where ddd.idestructuracomun = ves.idestructura) as fechaminima,
(select max(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_loginventario.dat_recepcion ddisd on ddisd.iddocumento = ddd.iddocumento 
where ddd.idestructuracomun = ves.idestructura) as fechamaxima,
ves.codigo,
(case when (select dea.estado from mod_logistica.dat_estadoalmacen dea where dea.iddeposito = ves.idestructura) = 1 
then 'Abierto' else 'Cerrado' end) as estadoop,
dd.numeroref,
(select sum(m.importecontable) from mod_logistica.dat_movimiento m where m.iddocumento = dd.iddocumento) as importe
from mod_logistica.dat_documento dd
inner join mod_estructuracomp.v_dametodasestructuras ves on ves.idestructura = dd.idestructuracomun
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
left join mod_logistica.dat_documentotransporte ddt on dd.iddocumento = ddt.iddocumento
inner join mod_loginventario.dat_recepcion dr on dd.iddocumento = dr.iddocumento
left join mod_logistica.dat_documentopadre ddpad on dd.iddocumento = ddpad.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_datosmaestros.dat_cierre dc on dc.idestructurasubsist = des.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = de.idestructura
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.estado in(1,2,4,13)
and (dd.estado = $2 or $2 is null) 
and dd.idestructuracomun = $1 and de.idestructura = $9
and (dd.estado = $2 or $2 is null)
and (dd.idoperacion = $3 or $3 is null) 
and (dr.nrodocorigen = $4 or $4 is null)
and (su.idusuario = $5 or $5 is null)
and (su1.idusuario = $6 or $6 is null)
and ((dd.fechacontable >= $7 or $7 is null) and (dd.fechacontable <= $8 or $8 is null))
and (dd.idperiodo = dc.idperiodoactual or $2 is null or $3 is null or 
$4 is null or $5 is null or $6 is null or $7 is null or $8 is null)
order by dd.iddocumento desc
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

ALTER TYPE mod_loginventario.td_listarinformerecepcion
  ALTER ATTRIBUTE importe TYPE NUMERIC(25,2);

ALTER TYPE mod_loginventario.td_listardocsalida
  ADD ATTRIBUTE importe NUMERIC(25,2);
  
CREATE OR REPLACE FUNCTION mod_loginventario.f_listardocsalida (
  p_idestructuraop numeric,
  p_estado numeric,
  p_aprobadopor numeric,
  p_creadopor numeric,
  p_fechainicio date,
  p_fechafin date,
  p_idestructura numeric
)
RETURNS SETOF mod_loginventario.td_listardocsalida AS
$body$
DECLARE
  all_rec mod_loginventario.td_listardocsalida;
BEGIN
for all_rec in
select
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(des.codigo,'-',des.denominacion),'-') when ci.esminfar = 1 then des.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(des.codigo,'-',des.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.dat_estructura where idestructura = ci.idpadre limit 1) end)
end) as entidad,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',des.codigo,'-',desop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable,
btrim(concat(desop.codigo,'-',desop.denominacion),'-'),
(select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
  coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
  btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))))

      when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
      when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-')) end)) as entregar,
case when dd.estado = 1 then 'ElaboraciÃ³n'
     when dd.estado = 2 then 'Preparado'
     when dd.estado = 3 then 'Aprobado'
     when dd.estado = 4 then 'Contabilizado'
else 'Sin Estado' end as estado,
su.nombreusuario as creadopor,
(select count(dp.idproducto) from mod_logistica.dat_producto dp inner join mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto where dm.iddocumento = dd.iddocumento) as cantidad,
su1.nombreusuario,
ndp.denominacion as tipodocumento,
i.urllogo,
(select min(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logistica.dat_entrega ddisd on ddisd.iddocumento = ddd.iddocumento  
where ddd.idestructuracomun = $1) as fechaminima,

(select max(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logistica.dat_entrega ddisd on ddisd.iddocumento = ddd.iddocumento 
where ddd.idestructuracomun = $1) as fechamaxima,
desop.codigo,
(case when (select dea.estado
from mod_estructuracomp.nom_filaestruc nf
inner join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = nf.idfila
where nf.idfila = desop.idestructuraop) = 1 then 'Abierto' else 'Cerrado' end) as estadoop,
dd.numeroref,
(select sum(dm.importecontable) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento) as importe

from mod_logistica.dat_documento dd 
left join mod_logistica.dat_documentotransporte ddt on dd.iddocumento = ddt.iddocumento 
inner join mod_logistica.dat_entrega den on den.iddocumento = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc

inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona

inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun 
inner join mod_logistica.conf_general i on i.idestructura = des.idestructura
left join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = dd.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
inner join mod_logistica.dat_documentopadre ddpad on dd.iddocumento = ddpad.iddocumento 
inner join mod_logistica.dat_documento ddo on ddo.iddocumento = ddpad.idpadre
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = desu.idestructuracomun
where dd.idestructuracomun = p_idestructuraop and des.idestructura = p_idestructura and dd.iddoc in(select ddp1.iddoc from mod_datosmaestros.dat_documentoprim ddp1 
     inner join mod_datosmaestros.nom_docprim ndp1 on ndp1.iddocumentos = ddp1.iddocumentos
     inner join mod_datosmaestros.dat_estructurasubsist desu1 on desu1.idestructurasubsist = ddp1.idestructurasubsist
   where desu1.idestructuracomun = p_idestructura)
AND ( CASE WHEN p_estado is not null THEN dd.estado = p_estado else dd.estado in(1,2,3,4) END)
AND ( CASE WHEN p_creadopor is not null THEN su.idusuario = p_creadopor else true END)
AND ( CASE WHEN p_aprobadopor is not null THEN su1.idusuario = p_aprobadopor else true END)
AND ( CASE WHEN p_fechainicio is not null THEN dd.fechacontable >= p_fechainicio else true END)
AND ( CASE WHEN p_fechafin is not null THEN dd.fechacontable <= p_fechafin else true END)
order by dd.iddocumento desc
loop
  return next all_rec;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;