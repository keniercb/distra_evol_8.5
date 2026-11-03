CREATE OR REPLACE FUNCTION mod_loginventario.f_recvalordeposito (
  p_idestructuraop varchar,
  p_idestructuracomun numeric,
  p_idsubsistema numeric,
  p_iddocs varchar,
  p_fechafin date
)
RETURNS SETOF mod_loginventario.td_valordepositos AS
$body$
DECLARE
all_rec mod_loginventario.td_valordepositos;

v_ejerciciocontable record;
v_idejercicio numeric;

BEGIN
if p_idestructuracomun is not null and p_idsubsistema is not null then
  v_ejerciciocontable = mod_logistica.f_obtenerejercicioactivo(p_idsubsistema, p_idestructuracomun);
    v_idejercicio = v_ejerciciocontable.idejercicioactual;
else 
  v_idejercicio = null;
end if;
for all_rec in
SELECT DISTINCT e.idestructuraop AS iddeposito, (btrim(concat(e.codigo,'-',e.denominacion),'-')) AS deposito,  
coalesce((SELECT sum(round(m.importecontable,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('aperturaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 3 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0) AS apertura, 
coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('aperturaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 3 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0) AS aperturaalt, 
coalesce((SELECT sum(round(m.importecontable,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('recepcionLog', 'valedev') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) AS compras, 
coalesce((SELECT sum(round(m.importealternativo,2)) FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('recepcionLog', 'valedev') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0) AS comprasalt, 
/*coalesce((round((SELECT SUM(dmm.precio * m.cantidad) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento 
INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento 
INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento 
WHERE dmm.idmoneda= 9900000000 AND df.iddeposito = e.idestructuraop AND dd.estado = 4) +
(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf. idcategoriafactura = ddcp.idcategoriafactura
INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura
INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura
WHERE ddcp.idmoneda = 9900000000  and ddcp.concepto = '+' AND df.iddeposito = e.idestructuraop) -
(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf. idcategoriafactura = ddcp.idcategoriafactura
INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura
INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura
WHERE ddcp.idmoneda = 9900000000  and ddcp.concepto = '-' AND df.iddeposito = e.idestructuraop),2)), 0) AS ventas, 
coalesce((round((SELECT SUM(dmm.precio * m.cantidad) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento 
INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento 
INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento 
WHERE dmm.idmoneda= 9900000001 AND df.iddeposito = e.idestructuraop AND dd.estado = 4) +
(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf. idcategoriafactura = ddcp.idcategoriafactura
INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura
INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura
WHERE ddcp.idmoneda = 9900000001  and ddcp.concepto = '+' AND df.iddeposito = e.idestructuraop) - 
(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf. idcategoriafactura = ddcp.idcategoriafactura
INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura
INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura
WHERE ddcp.idmoneda = 9900000001  and ddcp.concepto = '-' AND df.iddeposito = e.idestructuraop),2)), 0) AS ventasalt, */
coalesce(round((SELECT sum(m.importecontable) FROM mod_logistica.dat_movimiento m INNER
 JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
 WHERE np.abreviatura IN ('facturaLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) AND (d.fechacontable <= p_fechafin OR p_fechafin is null) AND d.estado = 4 
 AND e.idestructuraop = pp.idestructura AND d.cronologia >
 0 ), 2), 0) -
 coalesce(round((SELECT sum(m.importecontable) FROM mod_logistica.dat_movimiento m INNER
 JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
 WHERE np.abreviatura IN ('compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) AND (d.fechacontable <= p_fechafin OR p_fechafin is null) AND d.estado = 4 
 AND e.idestructuraop = pp.idestructura AND d.cronologia >
 0 ), 2), 0) AS ventas, 
 
 coalesce(round((SELECT sum(m.importealternativo) 
 FROM mod_logistica.dat_movimiento m 
 INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
 INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
 INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 WHERE np.abreviatura IN ('facturaLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) AND (d.fechacontable <= p_fechafin OR p_fechafin is null) 
 AND d.estado = 4 AND e.idestructuraop = pp.idestructura
 AND d.cronologia > 0 ), 2), 0) - 
  coalesce(round((SELECT sum(m.importealternativo) 
 FROM mod_logistica.dat_movimiento m 
 INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
 INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
 INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 WHERE np.abreviatura IN ('compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) AND (d.fechacontable <= p_fechafin OR p_fechafin is null) 
 AND d.estado = 4 AND e.idestructuraop = pp.idestructura
 AND d.cronologia > 0 ), 2), 0)  AS ventasalt,
coalesce((SELECT sum(round(m.importecontable,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0) AS gastos, 
coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0) AS gastosalt, 
(coalesce((SELECT sum(round(m.importecontable,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) - 
coalesce((SELECT sum(round(m.importecontable,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '-'), 0)) AS ajustes, 
(coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) - 
coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '-'), 0)) AS ajustesalt, 
round(q.importe, 2) AS importe, round(q.importealt, 2) AS importealternativo,
(select e.denominacion from mod_estructuracomp.v_dametodasestructuras e where e.idestructura = p_idestructuracomun) as entida,
(select ii.urllogo from mod_logistica.conf_general ii where ii.idestructura = p_idestructuracomun) as urllogo,
 /*(select min(dd.fechacontable) from mod_logistica.dat_documento dd
    inner join mod_datosmaestros.dat_documentoprim ddp on dd.iddoc = ddp.iddoc
    inner join mod_datosmaestros.dat_estructurasubsist deb on deb.idestructurasubsist = ddp.idestructurasubsist
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    --inventario general
    left join mod_logistica.dat_movimiento m on m.iddocumento = dd.iddocumento
    left join mod_logistica.dat_producto pm on pm.idproducto = m.idproducto
    left join mod_estructuracomp.dat_estructuraop eom on eom.idestructuraop = pm.idestructura
    --distribucion
    left join mod_logdistribucion.dat_prodorden o on o.idorden = dd.iddocumento
    left join mod_logistica.dat_producto po on po.idproducto = o.idproducto
    left join mod_estructuracomp.dat_estructuraop eoo on eoo.idestructuraop = po.idestructura
    --facturacion
    left join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
    left join mod_estructuracomp.dat_estructuraop eof on eof.idestructuraop = df.iddeposito
    where deb.idsubsistema in(10,13)
  and (df.iddeposito is not null or pm.idestructura is not null or po.idestructura is not null ) 
  and ((df.iddeposito = ANY (CAST(p_idestructuraop as NUMERIC[]))   or pm.idestructura = ANY(CAST(p_idestructuraop as NUMERIC[])) 
  or po.idestructura = ANY(CAST(p_idestructuraop as NUMERIC[]))) or p_idestructuraop is null))*/ '11/11/2020' as fechaminima,
  /*(select max(dd.fechacontable) from mod_logistica.dat_documento dd
    inner join mod_datosmaestros.dat_documentoprim ddp on dd.iddoc = ddp.iddoc
    inner join mod_datosmaestros.dat_estructurasubsist deb on deb.idestructurasubsist = ddp.idestructurasubsist
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    --inventario general
    left join mod_logistica.dat_movimiento m on m.iddocumento = dd.iddocumento
    left join mod_logistica.dat_producto pm on pm.idproducto = m.idproducto
    left join mod_estructuracomp.dat_estructuraop eom on eom.idestructuraop = pm.idestructura
    --distribucion
    left join mod_logdistribucion.dat_prodorden o on o.idorden = dd.iddocumento
    left join mod_logistica.dat_producto po on po.idproducto = o.idproducto
    left join mod_estructuracomp.dat_estructuraop eoo on eoo.idestructuraop = po.idestructura
    --facturacion
    left join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
    left join mod_estructuracomp.dat_estructuraop eof on eof.idestructuraop = df.iddeposito
    where deb.idsubsistema in(10,13)
  and (df.iddeposito is not null or pm.idestructura is not null or po.idestructura is not null ) 
  and ((df.iddeposito = ANY(CAST(p_idestructuraop as NUMERIC[]))  or pm.idestructura = ANY(CAST(p_idestructuraop as NUMERIC[]))  
  or po.idestructura = ANY(CAST(p_idestructuraop as NUMERIC[])) ) or p_idestructuraop is null))*/ '11/11/2020' as fechamaxima,
(coalesce(
        (SELECT sum(mm.importecontable) 
        FROM mod_logistica.dat_movimiento mm 
        INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto 
        INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = mm.iddocumento 
        INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc 
        INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos 
        WHERE ndp.abreviatura = 'revaluacionLog' AND dp.idestructura = e.idestructuraop AND mm.signo = '+' )
    , 0) - 
    coalesce(
        (SELECT sum(mm.importecontable) 
        FROM mod_logistica.dat_movimiento mm 
        INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto 
        INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = mm.iddocumento 
        INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc 
        INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos 
        WHERE ndp.abreviatura = 'revaluacionLog' AND dp.idestructura = e.idestructuraop AND mm.signo = '-' )
    , 0) + 
    coalesce(
        (SELECT sum(round(dm1.importetotalalt, 2)) AS importe 
        FROM mod_logistica.dat_movimiento dm1 
        INNER JOIN mod_logistica.dat_producto dp1 ON dm1.idproducto = dp1.idproducto 
        WHERE idmovimiento IN (
                SELECT(
                    SELECT mm1.idmovimiento FROM mod_logistica.dat_movimiento mm1 
                    INNER JOIN mod_logistica.dat_documento dd1 ON dd1.iddocumento = mm1.iddocumento
                    WHERE mm1.idproducto = dp.idproducto AND mm1.cronologia > 0 
                    AND mm1.cronologia < mm.cronologia AND mm1.signo <> 'N' 
                    ORDER BY mm1.cronologia DESC LIMIT 1
                )
                FROM mod_logistica.dat_movimiento mm 
                INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto 
                INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = mm.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc 
                INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos 
                WHERE ndp.abreviatura = 'revaluacionLog' AND dp.idestructura = e.idestructuraop 
            ) 
        )
    , 0)
) AS reevaluacion FROM mod_logistica.dat_producto p 
INNER JOIN mod_estructuracomp.dat_estructuraop e ON e.idestructuraop = p.idestructura 
INNER JOIN ( select distinct dp.idestructuraop as idest,
        coalesce((
             SELECT sum(ddp.cantidad * ddp.precio)
                FROM mod_logistica.dat_producto ddp
                where dp.idestructuraop = ddp.idestructura
        ),0) 
        as importe, 
        coalesce((
             SELECT sum(ddp.cantidad * ddp.precioalternativo)
                FROM mod_logistica.dat_producto ddp
                where dp.idestructuraop = ddp.idestructura
        ),0)
        as importealt
    from mod_estructuracomp.dat_estructuraop dp
) q on q.idest = p.idestructura WHERE p.cronologia > 0 AND p.idestructuracomun = $2 AND p.idestructura = ANY (CAST(p_idestructuraop as NUMERIC[])) 
GROUP BY e.denominacion, e.idestructuraop,e.codigo,p.idestructura,q.importe,q.importealt 
ORDER BY deposito
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;