CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediario_apertura (
  f_inicio date,
  f_fin date,
  p_estado numeric = 0,
  p_isapertura numeric = 0,
  p_iddeposito numeric = NULL::numeric,
  p_idcierrediario numeric = NULL::numeric
)
RETURNS numeric AS
$body$
DECLARE
	v_result record;
	v_idcierrediario numeric;
    v_recejercicio record;
    
BEGIN
	/*if p_isapertura = 1 then 
          delete from mod_logistica.his_cuadrediario;
    end if;*/
    select ec.idejercicio, ec.inicio, ec.fin into v_recejercicio 
    from mod_datosmaestros.dat_ejerciciocontable ec
    where  f_fin between ec.inicio and ec.fin;
    
    if p_idcierrediario is null then
        delete from mod_logistica.his_cuadrediario where iddeposito = p_iddeposito
        and fechacierre = f_fin;
    else
        delete from mod_logistica.his_cuadreclasificacion where idcierrediario = p_idcierrediario;
        update mod_logistica.his_cuadrediario 
        set estado = p_estado,
            contador = contador +1,
            fechacierre = f_fin,
            saldocont = 0
        where idcierrediario = p_idcierrediario;
    end if;
    
if p_idcierrediario is null then
  INSERT INTO 
    mod_logistica.his_cuadrediario
  (
    iddeposito,
    estado,
    fechacierre,
    contador,
    apertura,
    saldoinicial,
    fechacierreanterior
  )
  select distinct cf.iddeposito, p_estado,f_fin,1,p_isapertura,(
  		coalesce((select cd.saldofinal from mod_logistica.his_cuadrediario cd
          where cd.iddeposito = p_iddeposito and cd.fechacierre < f_fin
          order by cd.fechacierre desc
          limit 1),0)),
          (select cd.fechacierre from mod_logistica.his_cuadrediario cd
          where cd.iddeposito = p_iddeposito and cd.fechacierre < f_fin
          order by cd.fechacierre desc
          limit 1)
    FROM mod_logdistribucion.conf_depositocuadrediario cf
    where (case when p_iddeposito is null then cf.iddeposito not in (
                        select h.iddeposito from mod_logistica.his_cuadrediario h 
                        where h.iddeposito = cf.iddeposito and h.apertura = 1)
    else cf.iddeposito = p_iddeposito end);
end if;

           
INSERT INTO 
  mod_logistica.his_cuadreclasificacion
(
  iddeposito,
  idclasificacioncontable,
  idcuenta,
  saldoinicial,
  saldofinal,
  clasificacion,
  cuenta,
  idcierrediario,
  saldocont
)
select distinct cf.iddeposito, cc.idclasificacioncontable,cf.idcuenta,(
		COALESCE((select cc.saldofinal from mod_logistica.his_cuadrediario d
        inner join mod_logistica.his_cuadreclasificacion cc on cc.idcierrediario = d.idcierrediario
        where d.iddeposito = cd.iddeposito and d.fechacierre = cd.fechacierreanterior 
        	and cc.idcuenta = cf.idcuenta
        order by cd.fechacierre desc
        limit 1),0)) as saldoinicial,
	round(
		coalesce((
             SELECT sum(ddp.cantidad * ddp.precio)
                FROM mod_logistica.dat_producto ddp
                where ddp.idestructura = cf.iddeposito
                and ddp.idclasificacioncontable = cc.idclasificacioncontable
  				--any(CAST(string_to_array(cf.clasificaciones, ',') as numeric[]))
        ),0) ,2)
        as saldoinv,
	cc.denominacion as clasificacion,nc.concatcta as cuenta,cd.idcierrediario,0
  FROM mod_logdistribucion.conf_depositocuadrediario cf,-- mod_logistica.dat_producto p,
  mod_contabilidad.nom_cuenta nc, mod_logistica.nom_clasificacioncontable cc, 
  mod_logistica.his_cuadrediario cd
  where cf.idcuenta = nc.idcuenta
  and cc.idclasificacioncontable = cf.idclasificacioncontable 
  and cd.iddeposito = cf.iddeposito 
  and cd.fechacierre = f_fin --cd.apertura = 1
  and (case when p_iddeposito is not null then cd.iddeposito = p_iddeposito else true end)
  group by cf.iddeposito, cc.idclasificacioncontable,cc.denominacion,nc.concatcta,cf.idcuenta,cd.idcierrediario
  order by cf.iddeposito,cc.idclasificacioncontable;

--if p_isapertura = 1 then
  CREATE TEMP TABLE tmp_cierres AS (
  select distinct cd.idcierrediario
    FROM mod_logdistribucion.conf_depositocuadrediario cf,-- mod_logistica.dat_producto p,
      mod_contabilidad.nom_cuenta nc, mod_logistica.nom_clasificacioncontable cc, 
      mod_logistica.his_cuadrediario cd
      where cf.idcuenta = nc.idcuenta
      and cc.idclasificacioncontable = cf.idclasificacioncontable 
      and cd.iddeposito = cf.iddeposito 
      and cd.fechacierre = f_fin --cd.apertura = 1
      and cd.apertura = 1
  );  
--end if;

UPDATE 
  mod_logistica.his_cuadreclasificacion hc
SET 
  saldocont = q.saldocont
from (select cf.idcuenta,cf.iddeposito,cf.idclasificacioncontable,cf.idcuadreclasificacion,
	/*(coalesce((select cc.saldocont from mod_logistica.his_cuadrediario d
    inner join mod_logistica.his_cuadreclasificacion cc on cc.idcierrediario = d.idcierrediario
    where d.iddeposito = cf.iddeposito and d.fechacierre = cd.fechacierreanterior and cc.idcuenta = rs.idcuenta
    ),0)::numeric + coalesce(
    (case when nc.idnaturaleza = 8030 then sum(rs.creditomb) - sum(rs.debitomb) else 
	sum(rs.debitomb) - sum(rs.creditomb) end),0)::numeric)*/
    (coalesce((select sum(coalesce(rp.saldomb,0)) as saldo from mod_contabilidad.res_centroelem_saldo rp
                                          inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
                                          where rp.idcuenta = cf.idcuenta and rp.fechaemision between v_recejercicio.inicio and f_fin
                                          and eec.idestructuracomun = ec.idestructuracomun),0)) as saldocont
	--sum(rs.saldomb) as saldocont  --cf.iddeposito
from mod_logistica.his_cuadreclasificacion cf
inner join mod_logistica.his_cuadrediario cd on cd.idcierrediario = cf.idcierrediario
--inner join mod_contabilidad.dat_comprobante_documento cp on cp.iddeposito = cf.iddeposito
--inner join mod_contabilidad.res_centroelem_saldo rs on /*cp.idcomprobante = rs.idcomprobante and*/ cf.idcuenta = rs.idcuenta
--inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cf.idcuenta
inner join mod_logdistribucion.conf_depositocuadrediario conf on conf.idcuenta = cf.idcuenta and cf.iddeposito = conf.iddeposito
--inner join mod_contabilidad.dat_comprobante cb on cb.idcomprobante = rs.idcomprobante
inner join mod_contabilidad.dat_estructurae ec on ec.idestructuracomun = conf.idestructura
where 
/*ec.idestructurae = cb.idestructurae and
  case when p_isapertura = 1 then rs.fechaemision between f_inicio and f_fin
  and cd.idcierrediario in (select idcierrediario from tmp_cierres)
  	else rs.fechaemision > cd.fechacierreanterior and rs.fechaemision <= f_fin end
  and */case when p_idcierrediario is not null then cf.idcierrediario = p_idcierrediario else true end
  and case when p_iddeposito is not null then cf.iddeposito = p_iddeposito and cd.fechacierre = f_fin else true end
  group by cf.idcuenta,cf.iddeposito,cf.idclasificacioncontable,
  cf.idcuadreclasificacion/*,nc.idnaturaleza*/,cd.fechacierreanterior,ec.idestructuracomun
) q
WHERE 
  hc.idcuadreclasificacion = q.idcuadreclasificacion;

UPDATE 
  mod_logistica.his_cuadreclasificacion hc
SET 
  saldocont = saldofinal
from 
(select cf.idcuadreclasificacion from mod_logistica.his_cuadreclasificacion cf
inner join mod_logistica.his_cuadrediario cd on cd.idcierrediario = cf.idcierrediario
where cd.fechacierre = f_fin
and case when p_idcierrediario is not null then cf.idcierrediario = p_idcierrediario else 
  true end
  and case when p_iddeposito is not null then cf.iddeposito = p_iddeposito and cd.fechacierre = f_fin else 
  true end
and cf.saldoinicial = cf.saldofinal and cf.saldocont = 0)q
where q.idcuadreclasificacion = hc.idcuadreclasificacion;

UPDATE 
  mod_logistica.his_cuadrediario cd
SET 
  --saldoinicial = d.saldoinicial,
  saldofinal = d.saldofinal,
  saldocont = d.saldocont
from (select distinct h.idcierrediario, /*sum(c.saldoinicial) as saldoinicial,*/
sum(c.saldofinal) as saldofinal, sum(c.saldocont) as saldocont
  FROM mod_logistica.his_cuadrediario h
  inner join mod_logistica.his_cuadreclasificacion c on c.idcierrediario = h.idcierrediario
  where h.fechacierre = f_fin
	  and case when p_iddeposito is not null then h.iddeposito = p_iddeposito
  	else true end
  group by h.idcierrediario)d
WHERE 
  d.idcierrediario = cd.idcierrediario
;
 
INSERT INTO 
  mod_logistica.his_cuadreresumen
(
  iddeposito,
  idclasificacioncontable,
  idcuadreclasificacion,
  importe,
  estado,
  signo,
  tipodocumento,
  iddoc
)
select distinct cf.iddeposito,p.idclasificacioncontable, cf.idcuadreclasificacion,
round(sum(m.importecontable),2) as importe,d.estado,m.signo,
	(select nd.abreviatura from mod_datosmaestros.dat_documentoprim dp
    inner join mod_datosmaestros.nom_docprim nd on nd.iddocumentos = dp.iddocumentos
    where dp.iddoc = d.iddoc),d.iddoc
  from mod_logistica.his_cuadreclasificacion cf, mod_logistica.dat_producto p, 
  mod_logistica.dat_movimiento m,mod_logistica.dat_documento d,mod_logistica.his_cuadrediario cd
  where p.cronologia > 0 and cf.idclasificacioncontable = p.idclasificacioncontable
  and cf.iddeposito = p.idestructura  
  and m.idproducto = p.idproducto
  and m.iddocumento = d.iddocumento 
  and cd.idcierrediario = cf.idcierrediario
  and case when p_iddeposito is null then d.fechacontable BETWEEN f_inicio and f_fin 
  	else d.fechacontable > cd.fechacierreanterior and d.fechacontable <= f_fin end 
  and d.cronologia > 0 and d.estado in (4,7)
  group by cf.iddeposito,d.iddoc,d.estado,m.signo,p.idclasificacioncontable,cf.idcuadreclasificacion;
  
if p_isapertura = 1 then
	INSERT INTO 
      mod_logistica.dat_estadoalmacen
    (
      iddeposito,
      estado,
      fechaapertura/*,
      fecha*/
    )
    select cf.iddeposito, 1, f_fin/*,(f_fin + interval '1 day')*/  from mod_logdistribucion.conf_depositocuadrediario cf
    where cf.iddeposito not in (select e.iddeposito from mod_logistica.dat_estadoalmacen e where e.iddeposito = cf.iddeposito);
    
    UPDATE 
      mod_logistica.dat_estadoalmacen st
    SET 
      fecha = f_fin --(f_fin + interval '1 day')
    from (select cf.iddeposito  from mod_logdistribucion.conf_depositocuadrediario cf
    inner join mod_logistica.dat_estadoalmacen e on e.iddeposito = cf.iddeposito
    )q
    WHERE 
      q.iddeposito = st.iddeposito
    ;

end if;
select distinct idcierrediario into v_idcierrediario from mod_logistica.his_cuadrediario where fechacierre = f_fin and iddeposito = p_iddeposito limit 1;
return v_idcierrediario;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_loginventario.fn_cuadrediario_apertura (f_inicio date, f_fin date, p_estado numeric, p_isapertura numeric, p_iddeposito numeric, p_idcierrediario numeric)
  OWNER TO zeolides;
  
--Funcion para recalcular saldo contable en caso de error

CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediario_recalcular (
  f_fechacierre date,
  p_iddeposito numeric = NULL::numeric,
  p_idcierrediario numeric = NULL::numeric
)
RETURNS void AS
$body$
DECLARE
	v_result record;
	v_idcierrediario numeric;
    v_recejercicio record;
    
BEGIN
    select ec.idejercicio, ec.inicio, ec.fin into v_recejercicio 
    from mod_datosmaestros.dat_ejerciciocontable ec
    where  f_fechacierre between ec.inicio and ec.fin;           


UPDATE 
  mod_logistica.his_cuadreclasificacion hc
SET 
  saldocont = q.saldocont
from (select conf.idcuenta,cf.iddeposito,cf.idclasificacioncontable,cf.idcuadreclasificacion,
    (coalesce((select sum(coalesce(rp.saldomb,0)) as saldo from mod_contabilidad.res_centroelem_saldo rp
                                          inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
                                          where rp.idcuenta = conf.idcuenta and rp.fechaemision between v_recejercicio.inicio and f_fechacierre
                                          and eec.idestructuracomun = ec.idestructuracomun),0)) as saldocont
	--sum(rs.saldomb) as saldocont  --cf.iddeposito
from mod_logistica.his_cuadreclasificacion cf
inner join mod_logistica.his_cuadrediario cd on cd.idcierrediario = cf.idcierrediario
inner join mod_logdistribucion.conf_depositocuadrediario conf on cf.iddeposito = conf.iddeposito
inner join mod_contabilidad.dat_estructurae ec on ec.idestructuracomun = conf.idestructura
where 
cf.idcierrediario = p_idcierrediario 
  and cf.iddeposito = p_iddeposito and cd.fechacierre = f_fechacierre
  group by conf.idcuenta,cf.iddeposito,cf.idclasificacioncontable,
  cf.idcuadreclasificacion,cd.fechacierreanterior,ec.idestructuracomun
) q
WHERE 
  hc.idcuadreclasificacion = q.idcuadreclasificacion;

UPDATE 
  mod_logistica.his_cuadreclasificacion hc
SET 
  saldocont = saldofinal
from 
(select cf.idcuadreclasificacion from mod_logistica.his_cuadreclasificacion cf
inner join mod_logistica.his_cuadrediario cd on cd.idcierrediario = cf.idcierrediario
where cd.fechacierre = f_fechacierre
and cf.idcierrediario = p_idcierrediario 
  and cf.iddeposito = p_iddeposito and cd.fechacierre = f_fechacierre 
and cf.saldoinicial = cf.saldofinal and cf.saldocont = 0)q
where q.idcuadreclasificacion = hc.idcuadreclasificacion;

UPDATE 
  mod_logistica.his_cuadrediario cd
SET 
  saldofinal = d.saldofinal,
  saldocont = d.saldocont
from (select distinct h.idcierrediario, 
sum(c.saldofinal) as saldofinal, sum(c.saldocont) as saldocont
  FROM mod_logistica.his_cuadrediario h
  inner join mod_logistica.his_cuadreclasificacion c on c.idcierrediario = h.idcierrediario
  where h.fechacierre = f_fechacierre
	  and h.iddeposito = p_iddeposito
  group by h.idcierrediario)d
WHERE 
  d.idcierrediario = cd.idcierrediario and cd.idcierrediario = p_idcierrediario
;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_loginventario.fn_cuadrediario_recalcular (f_fechacierre date, p_iddeposito numeric, p_idcierrediario numeric)
  OWNER TO zeolides;

--Funcion recalcular todos las clasificaciones con diferencias

CREATE OR REPLACE FUNCTION mod_loginventario.fn_fixcuadrediferenciasall (
)
RETURNS void AS
$body$
DECLARE
  v_rec record;
BEGIN
	for v_rec in (	
		select hc.* from mod_logistica.his_cuadrediario hc where hc.apertura = 0 and (hc.saldocont-hc.saldofinal) <> 0
    )
    loop
    	PERFORM mod_loginventario.fn_cuadrediario_recalcular(v_rec.fechacierre, v_rec.iddeposito, v_rec.idcierrediario);
    end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_loginventario.fn_fixcuadrediferenciasall ()
  OWNER TO zeolides;

-------------------------------------------------------------------
CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediarioproductos (
  p_idalmacen numeric,
  p_agrupadopor numeric,
  p_idcierrediario numeric = NULL::numeric,
  p_saldos numeric = 0,
  p_idestructuracomun numeric = 0,
  p_arrayclasifcontab varchar = NULL::character varying,
  p_arraynaturalezas varchar = NULL::character varying,
  p_desde date = NULL::date,
  p_hasta date = NULL::date
)
RETURNS SETOF mod_loginventario.td_cuadrediarioproductos AS
$body$
DECLARE
  v_result mod_loginventario.td_cuadrediarioproductos;
BEGIN
	for v_result in (
          SELECT DISTINCT p.idproducto,upper(coalesce(i.numeropieza,i.codigo)||' - '||i.denominacion) as producto, 
          upper(um.abreviaturaunidadmedida) as um, hc.clasificacion,
          nat.denominacion as naturaleza,p.idestructura,
          coalesce((
          SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6)) 
          FROM mod_logistica.dat_movimiento m 
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
          WHERE np.abreviatura IN ('recepcionLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0  and m.signo = '+'), 0) as recepcion,
          coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6)) 
          FROM mod_logistica.dat_movimiento m 
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('valedev') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0  and m.signo = '+'), 0)+
          coalesce(round((SELECT sum(case when p_saldos = 1 then m.importecontable else m.cantidad end) 
          FROM mod_logistica.dat_movimiento m INNER
          JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('facturaLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 7 
          --AND v.idestructura = pp.idestructura 
          AND d.cronologia >
          0 ), 6), 0)+
          coalesce(round((SELECT sum(case when p_saldos = 1 then m.importecontable else m.cantidad end) 
          FROM mod_logistica.dat_movimiento m INNER
          JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('compdevLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND d.fechacontable = h.fechacierre
          AND m.idproducto = p.idproducto
          AND d.estado = 4 
          --AND v.idestructura = pp.idestructura 
          AND d.cronologia >
          0 ),6), 0)+coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6))
          FROM mod_logistica.dat_movimiento m 
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 7 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0 ), 0) as valedev,
          coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6)) 
          FROM mod_logistica.dat_movimiento m 
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('ajusteLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0 and m.signo = '+'), 0) as ajustent,
          coalesce(round((SELECT sum(case when p_saldos = 1 then m.importecontable else m.cantidad end) 
          FROM mod_logistica.dat_movimiento m INNER
          JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('facturaLog','compventaLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 4 
          --AND v.idestructura = pp.idestructura 
          AND d.cronologia >
          0 ), 6), 0) as ventas,
          coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6)) 
          FROM mod_logistica.dat_movimiento m 
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('ajusteLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0  and m.signo = '-'), 0) as ajustesal, 
          coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6))
          FROM mod_logistica.dat_movimiento m 
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0 ), 0) AS salidacosto,
          coalesce((SELECT sum(round(m.cantidad,6)) 
          FROM mod_logistica.dat_movimiento m 
          INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
          INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
          INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
          --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
          WHERE np.abreviatura IN ('recepcionLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
          AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
          else d.fechacontable = h.fechacierre end)
          AND m.idproducto = p.idproducto
          AND d.estado = 7 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0), 0) as devrecep,
          0 as existinicial, p.cantidad as existfinal, p.precio, p.importe,
          coalesce((select round(m.importetotal,2)
                from mod_logistica.dat_movimiento m
                inner join mod_logistica.dat_documento d using(iddocumento)
                where d.fechacontable < h.fechacierre -- cast(COALESCE(e.fecha,f.fecha) as date) 
                      AND m.idproducto = p.idproducto
                order by d.cronologia desc limit 1
          ),0) as importeinicial,
          coalesce((select round(m.importetotal,2)
                from mod_logistica.dat_movimiento m
                inner join mod_logistica.dat_documento d using(iddocumento)
                where d.fechacontable = h.fechacierre -- cast(COALESCE(e.fecha,f.fecha) as date)
                      AND m.idproducto = p.idproducto
               -- and dd.estado = 4
                order by d.cronologia desc limit 1
          ),0) as importefinal,
          (case when p_agrupadopor = 1 then hc.clasificacion else 
          case when p_agrupadopor = 2 then nat.denominacion else
          case when p_agrupadopor = 3 then v.codigo||' - '||v.denominacion else 
          coalesce(i.numeropieza,i.codigo)||' - '||i.denominacion end end end) as agrupador,
          p.idestructuracomun, /*COALESCE(e.fecha,f.fecha)::date*/ h.fechacierre  as fechaactual,
          h.fechacierre::date as fechaultcierre, 
          es.direccion as direccion, es.telefono as telefono, es.fax as fax, es.correo as correo, 
          es.codigo||' - '||es.denominacion as entidad, cg.urllogo,
          v.codigo||' - '||v.denominacion as almacen,
          round(coalesce(h.saldofinal,0),2) as saldoinicial,v.idestructura AS iddeposito,
          (COALESCE((
          	select sum(hc1.saldocont) from mod_logistica.his_cuadreclasificacion hc1 where hc1.idcierrediario = h.idcierrediario
            and hc1.idclasificacioncontable = hc.idclasificacioncontable
          ),0)) as saldocont,nat.idnaturaleza,hc.idcuenta, 
          coalesce(i.numeropieza,i.codigo) as codigo
          FROM mod_logistica.his_cuadrediario h    
          inner join mod_logistica.his_cuadreclasificacion hc on hc.idcierrediario = h.idcierrediario            
          inner join mod_logistica.dat_producto p on h.iddeposito = p.idestructura                
          inner join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = p.idumedida
          inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
          left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
          --inner join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = h.iddeposito
          INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = h.iddeposito
          left join mod_logistica.dat_estadoalmacen e on e.iddeposito = h.iddeposito                
          left join mod_logistica.conf_general cg on cg.idestructura = p.idestructuracomun
          INNER JOIN mod_estructuracomp.v_dametodasestructuras es ON es.idestructura = cg.idestructura 
          WHERE p.cronologia > 0  
          and p.idclasificacioncontable = hc.idclasificacioncontable
          AND (CASE WHEN h.idcierrediario is not null THEN h.idcierrediario = p_idcierrediario ELSE true END)
          AND (CASE WHEN p_idalmacen is not null THEN 
              p.idestructura = p_idalmacen
              else p.idestructuracomun = p_idestructuracomun END)
          and ( CASE WHEN p_arrayclasifcontab is not null 
              THEN p.idclasificacioncontable = ANY(cast(p_arrayclasifcontab as numeric[])) ELSE true END)
          and ( CASE WHEN p_arraynaturalezas is not null  
              THEN i.idnaturaleza = any(cast(p_arraynaturalezas as numeric[])) ELSE true END)
          GROUP BY p.idestructura,h.saldofinal,p.idproducto,i.codigo,i.numeropieza,
          e.fecha,h.fechacierre,i.numeropieza,i.codigo,--agrupador,
          es.direccion, es.telefono, es.fax, es.correo, cg.urllogo,nat.idnaturaleza,
          v.codigo,v.denominacion,v.idestructura,entidad,almacen,hc.idcuenta,
          i.denominacion, um.abreviaturaunidadmedida,nat.denominacion,hc.clasificacion, h.idcierrediario, hc.idclasificacioncontable --$addGroupBy
      ORDER BY agrupador
    )loop
    	if v_result.importefinal = 0 then
        	v_result.importefinal = v_result.importeinicial;
        end if;
    	return next v_result;
    end loop;
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.fn_cuadrediarioproductos (p_idalmacen numeric, p_agrupadopor numeric, p_idcierrediario numeric, p_saldos numeric, p_idestructuracomun numeric, p_arrayclasifcontab varchar, p_arraynaturalezas varchar, p_desde date, p_hasta date)
  OWNER TO zeolides;
  
-----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediariomov (
  p_idalmacen numeric,
  p_agrupadopor numeric,
  p_idcierrediario numeric = NULL::numeric,
  p_tiporeporte numeric = 0,
  p_idestructuracomun numeric = 0,
  p_arrayclasifcontab varchar = NULL::character varying,
  p_arraynaturalezas varchar = NULL::character varying,
  p_estado numeric = 0
)
RETURNS SETOF mod_loginventario.td_cuadrediario AS
$body$
DECLARE
  v_result mod_loginventario.td_cuadrediario;
  v_datosfecha record;
  v_fechainicio date = null;
  v_fechafin date = null;
BEGIN
	/*if p_isapertura = 1 and p_idestructuracomun is not null then 
      select * into v_datosfecha 
      from mod_datosmaestros.dat_estructurasubsist sub                                  
      inner join mod_datosmaestros.dat_fecha f on f.idestructurasubsist = sub.idestructurasubsist
      inner join mod_datosmaestros.dat_cierre c on c.idestructurasubsist = sub.idestructurasubsist
      inner join mod_datosmaestros.dat_ejerciciocontable ec on ec.idejercicio = c.idejercicioactual
      where sub.idestructuracomun = p_idestructuracomun and sub.idsubsistema = 10;
      v_fechainicio = v_datosfecha.inicio; 
      v_fechafin = v_datosfecha.fin;
    end if;*/
	if p_estado = 0 then
      for v_result in (
            select DISTINCT v.codigo||' - '||v.denominacion as almacen,
            sum(q.recepcion) as recepcion, sum(q.valedev) as valedev, sum(q.ajusteent) as ajusteent, sum(ventas) as ventas,
            sum(q.ajustesal) as ajustesal, sum(q.salidacosto) as salidacosto, sum(q.devrecep) as devrecep,
            sum(q.importeinicial) as importeinicial,sum(q.importefinal) as importefinal,q.fechaactual, q.fechaultcierre,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,upper(q.agrupador) as agrupador,sum(q.importeinv) as saldoinv,
            0,q.saldocont,now(), q.iddeposito, round(sum(q.importefinal) - sum(q.importeinv),2) as diferencia,count(q.idproducto) as items
            from (
                select * from mod_loginventario.fn_cuadrediarioproductos(p_idalmacen,p_agrupadopor, 
                	p_idcierrediario, 1, p_idestructuracomun, 
                	p_arrayclasifcontab, p_arraynaturalezas,v_fechainicio,v_fechafin)
                ) q
            INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = q.idestructura 
            INNER JOIN mod_estructuracomp.v_dametodasestructuras es ON es.idestructura = q.idestructuracomun
            left join mod_logistica.conf_general cg on cg.idestructura = es.idestructura
            GROUP by q.agrupador,v.codigo,v.denominacion,q.fechaactual, q.fechaultcierre,q.idcuenta,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,q.iddeposito,q.saldocont
            ORDER BY diferencia desc, agrupador
      )loop
      		v_result.saldomov = round(v_result.recepcion+v_result.valedev+v_result.ajusteent-
            	v_result.ventas-v_result.salidacosto-v_result.devrecep-v_result.ajustesal,2);
            v_result.proxfecha = cast(v_result.fechaactual as date)+cast('1 days' as interval);
            --v_result.saldoinv = v_result.importeinv;
            --v_result.diferencia = round(v_result.importefinal - v_result.importeinv,2);
          return next v_result;
      end loop;
    else
      for v_result in (
      		SELECT DISTINCT v.codigo||' - '||v.denominacion as almacen,
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'recepcionLog' and cr.estado = 4 limit 1),0) as recepcion,
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'valedev' and cr.estado = 4 limit 1),0)+
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'facturaLog' and cr.estado = 7 limit 1),0)+
            COALESCE((select sum(cr.importe) from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento IN ('valeLog', 'transferenciaLog') and cr.estado = 7 limit 1),0)+
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'compdevLog' and cr.estado = 4 limit 1),0) as valedev,
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'ajusteLog' and cr.estado = 4 and cr.signo = '+' limit 1),0) as ajusteent,
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'ajusteLog' and cr.estado = 4 and cr.signo = '-' limit 1),0) as ajustesal,
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'facturaLog' and cr.estado = 4 limit 1),0)+
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'compventaLog' and cr.estado = 4 limit 1),0) as ventas,
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'transferenciaLog' and cr.estado = 4 limit 1),0) as salidacosto,
            COALESCE((select cr.importe from mod_logistica.his_cuadreresumen cr where cr.idcuadreclasificacion = hc.idcuadreclasificacion
            and cr.tipodocumento = 'recepcionLog' and cr.estado = 7 limit 1),0) as devrecep,        
            hc.saldoinicial as importeinicial,hc.saldofinal as importefinal,h.fechacierre, h.fechacierre,
            es.direccion, es.telefono, es.fax, es.correo, es.codigo||' - '||es.denominacion as entidad, cg.urllogo,
            hc.clasificacion,hc.saldofinal as saldoinv,
            0,hc.saldocont,h.fechacierre, hc.iddeposito, round(hc.saldofinal - hc.saldoinicial,2) as diferencia,0 as items
            FROM mod_logistica.his_cuadrediario h    
            inner join mod_logistica.his_cuadreclasificacion hc on hc.idcierrediario = h.idcierrediario    
            --inner join mod_logistica.his_cuadreresumen cr on cr.idcuadreclasificacion = hc.idcuadreclasificacion     
            inner join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = h.iddeposito
            INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = h.iddeposito
            left join mod_logistica.dat_estadoalmacen e on e.iddeposito = h.iddeposito                
            left join mod_logistica.conf_general cg on cg.idestructura = cf.idestructura
            INNER JOIN mod_estructuracomp.v_dametodasestructuras es ON es.idestructura = cg.idestructura
            WHERE h.idcierrediario = p_idcierrediario
            /*AND (CASE WHEN p_idalmacen is not null THEN 
            h.iddeposito = p_idalmacen
            else cf.idestructura = p_idestructuracomun END)
            and ( CASE WHEN p_arrayclasifcontab is not null 
            THEN hc.idclasificacioncontable = ANY(cast(p_arrayclasifcontab as numeric[])) ELSE true END)*/
            GROUP BY h.saldofinal,e.fecha,h.fechacierre,hc.iddeposito,--cr.tipodocumento,cr.estado,
            es.direccion, es.telefono, es.fax, es.correo, cg.urllogo,
            v.codigo,v.denominacion,v.idestructura,entidad,almacen,hc.idcuenta,
            hc.clasificacion,hc.saldoinicial,hc.saldofinal,hc.saldocont,
            recepcion,valedev,ajusteent,ventas,ajustesal,salidacosto,devrecep
            ORDER BY hc.clasificacion
    )loop
      	return next v_result;
      end loop;
end if;
            
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.fn_cuadrediariomov (p_idalmacen numeric, p_agrupadopor numeric, p_idcierrediario numeric, p_tiporeporte numeric, p_idestructuracomun numeric, p_arrayclasifcontab varchar, p_arraynaturalezas varchar, p_estado numeric)
  OWNER TO zeolides;