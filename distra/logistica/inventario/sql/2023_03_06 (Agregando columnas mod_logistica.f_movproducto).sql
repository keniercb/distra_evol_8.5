ALTER TYPE mod_logistica.td_movproducto
  ADD ATTRIBUTE observaciones VARCHAR,
  ADD ATTRIBUTE nrolote VARCHAR;



CREATE OR REPLACE FUNCTION mod_logistica.f_movproducto (
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
      (case when ndp.abreviatura = 'facturaLog' then df.nrofactura else dd.nrodoc end) as nrodoc,
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
      (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $8) as monedaalternativa,
      coalesce(dd.observaciones, '-') as observaciones,
      COALESCE((SELECT ARRAY_TO_STRING(ARRAY_AGG(dll.numero), ', ') 
      FROM (
        SELECT idlote, numero, idproducto FROM mod_logistica.dat_lote WHERE idproducto = p_idproducto ORDER BY idlote
      ) dll WHERE dll.idproducto = dm.idproducto), '-') as nrolote           
      from mod_logistica.dat_movimiento dm
      inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
      inner join mod_logistica.dat_documento dd on dm.iddocumento = dd.iddocumento
      left join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
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
PARALLEL UNSAFE
COST 100 ROWS 1000;