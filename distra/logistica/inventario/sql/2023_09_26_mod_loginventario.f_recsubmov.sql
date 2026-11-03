DROP FUNCTION IF EXISTS mod_loginventario.f_recsubmov(numeric, character varying, character varying, numeric, date, date, character varying, numeric, numeric, numeric, numeric, numeric);
DROP TYPE IF EXISTS mod_loginventario.td_recsubmov;

CREATE TYPE mod_loginventario.td_recsubmov AS
(
	iddocumento numeric(19,0),
	fecha date,
	iddoc numeric(19,0),
	estado numeric(19,0),
	denomdocumento character varying,
	numerodocumento numeric(19,0),
	cliente character varying,
	entradacant numeric(25,6),
	entradaimp numeric(25,6),
	entradaimpalt numeric(25,6),
	salidacant numeric(25,6),
	salidaimp numeric(25,6),
	salidaimpalt numeric(25,6),
	existenciaactual numeric(25,6),
	preciopromedio numeric(25,6),
	importetotal numeric(25,6),
	importetotalalt numeric(25,6),
	preciopromedioalt numeric(25,6),
	um character varying,
	abreviatura character varying,
	monedacontable character varying,
	monedaalternativa character varying,
	deposito character varying,
	codigodeposito character varying,
	codigoproducto character varying,
	producto character varying,
	cuenta character varying,
	cuentaalt character varying,
	analisiscontable character varying,
	subcontable character varying,
	analisisalter character varying,
	subalter character varying,
	cuentaalter character varying,
	fechaminima date,
	fechamaxima date,
	numerochip character varying,
	fechachip date,
	observaciones character varying,
	nrolote character varying,
	numeroref numeric(19,0)
);

ALTER TYPE mod_loginventario.td_recsubmov
    OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_recsubmov(
	p_idproducto numeric,
	p_idoperaciones character varying,
	p_iddocs character varying,
	p_iddoc numeric,
	p_fechainicio date,
	p_fechafin date,
	p_idtipodocs character varying,
	p_idlote numeric,
	p_idnroserie numeric,
	p_idpartida numeric,
	p_idmonedacontable numeric,
	p_idmonedaalternativa numeric)
    RETURNS SETOF mod_loginventario.td_recsubmov 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare 
v_rec mod_loginventario.td_recsubmov;
begin
for v_rec in
select 
dd.iddocumento as iddocumento,dd.fechacontable,dd.iddoc,dd.estado,
ndp.denominacion as denomdocumento,
coalesce(ddf.nrofactura,dd.nrodoc) as numerodocumento,
case when dd.estado = 8 then 'Cancelado' when ndp.abreviatura like 'ajusteLog' or ndp.abreviatura like 'revaluacionLog%' or ndp.abreviatura like 'aperturaLog' then deop.denominacion  else (
select (case when ddc.tipocliente = 1 then (coalesce((case when (btrim(concat(ncp.codigo,'-',ncp.nombre),'-') <> '' ) then btrim(concat(ncp.codigo,'-',ncp.nombre),'-') end),
coalesce((case when (btrim(concat(de.codigo,'-',de.denominacion),'-') <> '') then btrim(concat(de.codigo,'-',de.denominacion),'-') end),
btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))))) 
when ddc.tipocliente = 2 then (btrim(concat(ncc.codigocentrogrupo,'-',ncc.descripcioncentrogrupo),'-'))
when ddc.tipocliente = 3 then (btrim(concat(deop.codigo,'-',deop.denominacion),'-'))
 end)
from mod_logistica.dat_documentocliente ddc 
left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = ddc.idcliente
left join mod_estructuracomp.v_dametodasestructuras dte on dte.idestructura = dd.idestructuracomun
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona where ddc.iddocumento = dd.iddocumento) end as cliente,
(case when p_idlote is not null then (case when dm.signo ='+' then round(dml.cantidad,6) end)
    when p_idnroserie is not null then (case when dm.signo ='+' then round(1) end)
      when p_idpartida is not null then (case when dm.signo ='+' then round(dmpm.cantidad,6) else (case when dmtm.idmovimiento = dm.idmovimiento then (select round(sum(dmtm1.cantidad),6) from mod_loginventario.dat_movtransferenciamunic dmtm1 where dmtm1.idpartidadestino = p_idpartida and dmtm1.idmovimiento = dm.idmovimiento) end) end)
      when(dm.signo ='+' /*and dd.idoperacion <> any (cast(p_idoperaciones as numeric[]))*/) then round(dm.cantidad,6)end) as entradacant,
(case when p_idlote is not null then (case when dm.signo ='+' then round(dm.importecontable,2) end)
    when p_idnroserie is not null then (case when dm.signo ='+' then round(dm.importecontable,2) end)
    when p_idpartida is not null then (case when dm.signo ='+' then round(dmpm.cantidad * dm.preciocontable,2) else (case when dmtm.idmovimiento = dm.idmovimiento then (select round(sum(dmtm3.cantidad*dm.preciocontable),2) from mod_loginventario.dat_movtransferenciamunic dmtm3 where dmtm3.idpartidadestino = p_idpartida and dmtm3.idmovimiento = dm.idmovimiento) end)end)
      when dm.signo ='+' then round(dm.importecontable,2) end) as entradaimp,  
(case when dm.signo ='+' then round(dm.importealternativo,2) end) as entradaimpalt, 
(case when p_idlote is not null then (case when dm.signo ='-' then round(dml.cantidad,6) end)
    when p_idnroserie is not null then (case when dm.signo ='-' then round(1) end)
      when p_idpartida is not null then (case when dm.signo ='-' then round(dmpm.cantidad,6) else (case when dmtm.idmovimiento = dm.idmovimiento then (select round(dmtm2.cantidad,6) from mod_loginventario.dat_movtransferenciamunic dmtm2 where dmtm2.idpartidaorigen = p_idpartida and dmtm2.idmovimiento = dm.idmovimiento) end)end)
    when (dm.signo ='-' /*and dd.idoperacion <> any (cast(p_idoperaciones as numeric[]))*/) /*or (dm.signo ='-' and p_idoperaciones is not null)*/ then round(dm.cantidad, 6) end) as salidacant, 
(case when p_idlote is not null then (case when dm.signo ='-' then round(dm.importecontable,2) end)
    when p_idnroserie is not null then (case when dm.signo ='-' then round(dm.importecontable,2) end)
    when p_idpartida is not null then (case when dm.signo ='-' then round(dmpm.cantidad * dm.preciocontable,2) else (case when dmtm.idmovimiento = dm.idmovimiento then (select round(sum(dmtm4.cantidad * dm.preciocontable),2) from mod_loginventario.dat_movtransferenciamunic dmtm4 where dmtm4.idpartidaorigen = p_idpartida and dmtm4.idmovimiento = dm.idmovimiento) end)end)
      when dm.signo ='-' then round(dm.importecontable,2) end) as salidaimp, 
(case when dm.signo ='-' then round(dm.importealternativo,2) end) as salidaimpalt, 
(case when p_idlote is not null then round(dl.existencia,6)
      when p_idnroserie is not null then 1
      when p_idpartida is not null then round(((select coalesce(sum(dmpm5.cantidad),0) from mod_loginventario.dat_movproductomunic dmpm5  where dmpm5.idproductomunic = p_idpartida and dmpm5.idmovimiento in (select dmpm7.idmovimiento from mod_loginventario.dat_movproductomunic dmpm7 inner join mod_logistica.dat_movimiento m2 on m2.idmovimiento = dmpm7.idmovimiento inner join mod_logistica.dat_documento datd2 on datd2.iddocumento = m2.iddocumento 
        where m2.signo = '+' and m2.cronologia <= dm.cronologia and datd2.estado in (3,4)))-(select coalesce(sum(dmpm6.cantidad),0) from mod_loginventario.dat_movproductomunic dmpm6 where dmpm6.idproductomunic = p_idpartida and dmpm6.idmovimiento in (select dmpm8.idmovimiento from mod_loginventario.dat_movproductomunic dmpm8 
        inner join mod_logistica.dat_movimiento m3 on m3.idmovimiento = dmpm8.idmovimiento  inner join mod_logistica.dat_documento datd3 on datd3.iddocumento = m3.iddocumento
        where m3.signo = '-' and m3.cronologia <= dm.cronologia  and datd3.estado in (3,4)))+(select coalesce(sum(dmtm11.cantidad),0) from mod_loginventario.dat_movtransferenciamunic dmtm11 where dmtm11.idpartidadestino = p_idpartida and dmtm11.idmovimiento 
        in (select dmtm12.idmovimiento from mod_loginventario.dat_movtransferenciamunic dmtm12 inner join mod_logistica.dat_movimiento m7 on m7.idmovimiento = dmtm12.idmovimiento
        inner join mod_logistica.dat_documento datd7 on datd7.iddocumento = m7.iddocumento where m7.cronologia <= dm.cronologia and datd7.estado in (3,4)))-(select coalesce(sum(dmtm5.cantidad),0) from mod_loginventario.dat_movtransferenciamunic 
        dmtm5 where dmtm5.idpartidaorigen = p_idpartida and dmtm5.idmovimiento in (select dmtm6.idmovimiento from mod_loginventario.dat_movtransferenciamunic dmtm6 
        inner join mod_logistica.dat_movimiento m4 on m4.idmovimiento = dmtm6.idmovimiento inner join mod_logistica.dat_documento datd4 on datd4.iddocumento = m4.iddocumento where m4.cronologia <= dm.cronologia and datd4.estado in (3,4)))),6) 
else dm.existenciaactual end) as existenciaactual, 
(case when p_idlote is not null then round(dm.preciopromedio,6)
      when p_idnroserie is not null then round(dm.preciopromedio,6)
      when p_idpartida is not null then round(dm.preciocontable,6)
    else round(dm.preciopromedio, 6) end) as preciopromedio,
(case when p_idlote is not null then round(dm.importetotal,2)
      when p_idnroserie is not null then round(dm.importetotal,2)
      when p_idpartida is not null then round(((select coalesce(sum(dmpm1.cantidad * dm.preciocontable),0) from mod_loginventario.dat_movproductomunic dmpm1 where dmpm1.idproductomunic = p_idpartida and dmpm1.idmovimiento in (select dmpm3.idmovimiento from mod_loginventario.dat_movproductomunic dmpm3 inner join  mod_logistica.dat_movimiento m on m.idmovimiento = dmpm3.idmovimiento
        inner join mod_logistica.dat_documento datd on datd.iddocumento = m.iddocumento where m.signo = '+' and m.cronologia <= dm.cronologia and datd.estado in (3,4))) - (select coalesce(sum(dmpm2.cantidad*dm.preciocontable),0) from mod_loginventario.dat_movproductomunic dmpm2 where dmpm2.idproductomunic = p_idpartida and dmpm2.idmovimiento in (select dmpm4.idmovimiento 
        from mod_loginventario.dat_movproductomunic dmpm4 inner join mod_logistica.dat_movimiento m1 on m1.idmovimiento = dmpm4.idmovimiento inner join mod_logistica.dat_documento datd1 on datd1.iddocumento = m1.iddocumento where m1.signo = '-' and m1.cronologia <= dm.cronologia and datd1.estado in (3,4))) - (select coalesce(sum(dmtm7.cantidad * dm.preciocontable), 0) 
        from mod_loginventario.dat_movtransferenciamunic dmtm7 where dmtm7.idpartidaorigen = p_idpartida and dmtm7.idmovimiento in (select dmtm8.idmovimiento from mod_loginventario.dat_movtransferenciamunic dmtm8 inner join mod_logistica.dat_movimiento m5 on m5.idmovimiento = dmtm8.idmovimiento inner join mod_logistica.dat_documento datd5 on datd5.iddocumento = m5.iddocumento
        where m5.cronologia <= dm.cronologia and datd5.estado in (3, 4))) + (select coalesce(sum(dmtm9.cantidad * dm.preciocontable), 0) from mod_loginventario.dat_movtransferenciamunic dmtm9 where dmtm9.idpartidadestino = p_idpartida and dmtm9.idmovimiento in (select dmtm10.idmovimiento from mod_loginventario.dat_movtransferenciamunic dmtm10 
        inner join mod_logistica.dat_movimiento m6 on m6.idmovimiento = dmtm10.idmovimiento inner join mod_logistica.dat_documento datd6 on datd6.iddocumento = m6.iddocumento where m6.cronologia <= dm.cronologia and datd6.estado in (3, 4)))),2)
      else  round(dm.importetotal,2)  
end) as importetotal,
round(dm.importetotalalt, 2) importetotalalt, 
round(dm.preciopromalt, 6) as preciopromedioalt,
num.abreviaturaunidadmedida as um,
ndp.abreviatura as abreviatura,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable ) as monedacontable,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaalternativa ) as monedaalternativa,
deop.denominacion as deposito,
deop.codigo as coddeposito,
ni.numeropieza as codprod,
ni.denominacion as denomprod,
      (select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc
      inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta
      where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuenta,
      
      (select concat(nc.concatcta,' ',nc.descripcion) from mod_contabilidad.nom_cuenta nc
      inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta
      where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuentaalt,
      
        (select i.descripcion from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuenta
      where h.idclasificacioncontable = dp.idclasificacioncontable and i.idcuenta <> i.idcuentapadre) as analisiscontable,

       (select descripcion from mod_contabilidad.nom_cuenta where idcuenta =  (select i.idcuentapadre from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuenta
      where h.idclasificacioncontable = dp.idclasificacioncontable) and idcuenta <> idcuentapadre) as subcontable,

      (select i.descripcion from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuentaalt
      where h.idclasificacioncontable = dp.idclasificacioncontable and i.idcuenta <> i.idcuentapadre) as analisisalter,
      
     (select descripcion 
      from mod_contabilidad.nom_cuenta where idcuenta = (select i.idcuentapadre from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuentaalt
      where h.idclasificacioncontable = dp.idclasificacioncontable) and idcuenta <> idcuentapadre) as subalter,
            
      (select concat(concatcta,' ',descripcion) from mod_contabilidad.nom_cuenta where idcuenta =
      (select idcuentapadre from mod_contabilidad.nom_cuenta where idcuenta =  (select i.idcuentapadre from mod_logistica.nom_clasificacioncontable h
      inner join mod_contabilidad.nom_cuenta i on i.idcuenta = h.idcuentaalt
      where h.idclasificacioncontable = dp.idclasificacioncontable)) and idcuenta = idcuentapadre) as cuentaalter,
      (select min(ddd.fechacontable)
      from mod_logistica.dat_documento ddd
      where ddd.idestructuracomun = $1) as fechaminima,

      (select max(ddd.fechacontable)
      from mod_logistica.dat_documento ddd
      where ddd.idestructuracomun = $1) as fechamaxima,
      dm.numerochip as numerochip,
      dm.fecha as fechachip,
      coalesce(dd.observaciones, '-') as observaciones,
      COALESCE((SELECT ARRAY_TO_STRING(ARRAY_AGG(dll.numero), ', ') 
      FROM (
        SELECT idlote, numero, idproducto FROM mod_logistica.dat_lote WHERE idproducto = p_idproducto ORDER BY idlote
      ) dll WHERE dll.idproducto = dm.idproducto), '-') as nrolote,
      dd.numeroref
from mod_logistica.dat_movimiento dm
inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento
left join mod_logistica.dat_movlote dml on dml.idmovimiento = dm.idmovimiento and p_idlote is not null
left join mod_logistica.dat_lote dl on dl.idproducto = dp.idproducto and p_idlote is not null
left join mod_loginventario.dat_movnroserie dmns on dmns.idmovimiento = dm.idmovimiento and p_idnroserie is not null
left join mod_loginventario.dat_movproductomunic dmpm on dmpm.idmovimiento = dm.idmovimiento and p_idpartida is not null
left join mod_loginventario.dat_movtransferenciamunic dmtm on dmtm.idmovimiento = dm.idmovimiento and p_idpartida is not null
left join mod_loginventario.dat_productomunic dpm on dpm.idproducto = dp.idproducto and p_idpartida is not null
left join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dd.idestructuracomun
left join mod_loginventario.dat_recepcion rec on rec.iddocumento = dd.iddocumento
where dd.cronologia > 0 and dm.idproducto = p_idproducto
and (dm.signo in('+','-') or ndp.abreviatura = 'inventariogLog'/*or dd.iddoc = any(cast(p_iddocs as numeric[]))*/)
and (case when p_iddoc is not null then dd.iddoc <> p_iddoc else true end)
and ((dd.fechacontable >= p_fechainicio or p_fechainicio is null) and (dd.fechacontable <= p_fechafin or p_fechafin is null))
and (case when p_idtipodocs is not null then dd.iddoc = any(cast(p_idtipodocs as numeric[])) else true end)
and ndp.abreviatura <> 'cambioccontableLog' 
--Productos espec�ficos
--and (case when p_idlote is not null then (dml.idlote = p_idlote and dl.idlote = p_idlote) else true end)
--and (case when p_idnroserie is not null then dmns.idnroserie = p_idnroserie else true end)
--and (case when p_idpartida is not null then (dmpm.idproductomunic = p_idpartida or dmtm.idpartidaorigen = p_idpartida) else true end)

order by dd.cronologia asc
loop
      return next v_rec;
    end loop;
  end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_recsubmov(numeric, character varying, character varying, numeric, date, date, character varying, numeric, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;
