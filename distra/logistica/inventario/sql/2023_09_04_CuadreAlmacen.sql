-- Type: td_valordepositosbyfecha

DROP TYPE IF EXISTS mod_loginventario.td_valordepositosbyfecha CASCADE;

CREATE TYPE mod_loginventario.td_valordepositosbyfecha AS
(
	iddeposito numeric(19,0),
	deposito character varying,
	apertura numeric(25,6),
	aperturaalt numeric(25,6),
	compras numeric(25,6),
	comprasalt numeric(25,6),
	ventas numeric(25,6),
	ventasalt numeric(25,6),
	gastos numeric(25,6),
	gastosalt numeric(25,6),
	ajustes numeric(25,6),
	ajustesalt numeric(25,6),
	importe numeric(25,6),
	importealternativo numeric(25,6),
	entidad character varying,
	logo text,
	fechaminima date,
	fechamaxima date,
	importerevaluado numeric(25,6),
	saldofinal numeric(25,6),
	saldofinalalt numeric(25,6),
	dinamico character varying,
	iddinamico numeric,
	diferencia numeric,
	diferenciaalt numeric,
	total numeric,
	canceladopos numeric(25,2),
	canceladoneg numeric(25,2)
);

ALTER TYPE mod_loginventario.td_valordepositosbyfecha
    OWNER TO zeolides;
	
-- FUNCTION: mod_loginventario.f_recvalordepositobyfecha(character varying, numeric, numeric, character varying, date, date, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_loginventario.f_recvalordepositobyfecha(character varying, numeric, numeric, character varying, date, date, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_recvalordepositobyfecha(
	p_idestructuraop character varying,
	p_idestructuracomun numeric,
	p_idsubsistema numeric,
	p_iddocs character varying,
	p_fechafin date,
	p_fechainicio date,
	p_detalle numeric,
	p_start numeric,
	p_limit numeric,
	p_diferencia numeric)
    RETURNS SETOF mod_loginventario.td_valordepositosbyfecha 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
all_rec mod_loginventario.td_valordepositosbyfecha;

v_ejerciciocontable record;
v_idejercicio numeric;

BEGIN
if p_idestructuracomun is not null and p_idsubsistema is not null then
  v_ejerciciocontable = mod_logistica.f_obtenerejercicioactivo(p_idsubsistema, p_idestructuracomun);
    v_idejercicio = v_ejerciciocontable.idejercicioactual;
else 
  v_idejercicio = null;
end if;
if p_detalle = 1 THEN--desglose por naturaleza
for all_rec in SELECT e.idestructuraop AS iddeposito, (btrim(concat(e.codigo,'-',e.denominacion),'-')) AS deposito,  
coalesce(((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog','compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable < p_fechainicio OR p_fechainicio is null)
AND d.estado in (3,4) AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 and m.signo = '+') - 
COALESCE((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
left join mod_logfacturacion.dat_docfactura fact on fact.idfactura = d.iddocumento
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('facturaLog', 'valeLog', 'transferenciaLog', 'ajusteLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable < p_fechainicio OR p_fechainicio is null)
AND d.estado in (4) AND 
(CASE WHEN fact.idfactura is null then e.idestructuraop = d.idestructuracomun else e.idestructuraop = fact.iddeposito end)
AND d.cronologia > 0 and m.signo = '-'),0)), 0) AS apertura, 
/*coalesce(((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog','compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable < p_fechainicio OR p_fechainicio is null)
AND d.estado in (3,4) AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 and m.signo = '+') - 
COALESCE((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
left join mod_logfacturacion.dat_docfactura fact on fact.idfactura = d.iddocumento
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('facturaLog', 'valeLog', 'transferenciaLog', 'ajusteLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable < p_fechainicio OR p_fechainicio is null)
AND d.estado in (4) AND 
(CASE WHEN fact.idfactura is null then e.idestructuraop = d.idestructuracomun else e.idestructuraop = fact.iddeposito end)
AND d.cronologia > 0 and m.signo = '-'),0)), 0)*/0 AS aperturaalt, 
coalesce((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('recepcionLog', 'valedev') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) AS compras, 
/*coalesce((SELECT sum(round(m.importealternativo,2)) FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('recepcionLog', 'valedev') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0)*/0 AS comprasalt, 
coalesce(round((SELECT sum(coalesce(m.importecontable,0)+coalesce(round(m.importealternativo,2),0)) FROM mod_logistica.dat_movimiento m
 INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
 INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
 WHERE np.abreviatura IN ('facturaLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
 AND ni1.idnaturaleza = ni.idnaturaleza
 AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
 AND (d.fechacontable <= p_fechafin OR p_fechafin is null) AND d.estado = 4 
 AND e.idestructuraop = pp.idestructura AND d.cronologia >
 0 ), 2), 0) -
 coalesce(round((SELECT sum(coalesce(m.importecontable,0)+coalesce(round(m.importealternativo,2),0)) FROM mod_logistica.dat_movimiento m INNER
 JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
  INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
 WHERE np.abreviatura IN ('compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
  AND ni1.idnaturaleza = ni.idnaturaleza
 AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null)  
 AND (d.fechacontable <= p_fechafin OR p_fechafin is null) AND d.estado = 4 
 AND e.idestructuraop = pp.idestructura AND d.cronologia >
 0 ), 2), 0) AS ventas, 
 
 /*coalesce(round((SELECT sum(m.importealternativo) 
 FROM mod_logistica.dat_movimiento m 
 INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
 INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
 INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
 WHERE np.abreviatura IN ('facturaLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
 AND ni1.idnaturaleza = ni.idnaturaleza
 AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
 AND (d.fechacontable <= p_fechafin OR p_fechafin is null) 
 AND d.estado = 4 AND e.idestructuraop = pp.idestructura
 AND d.cronologia > 0 ), 2), 0) - 
  coalesce(round((SELECT sum(m.importealternativo) 
 FROM mod_logistica.dat_movimiento m 
 INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
 INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
 INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
 WHERE np.abreviatura IN ('compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
 AND ni1.idnaturaleza = ni.idnaturaleza
 AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
 AND (d.fechacontable <= p_fechafin OR p_fechafin is null) 
 AND d.estado = 4 AND e.idestructuraop = pp.idestructura
 AND d.cronologia > 0 ), 2), 0)*/0  AS ventasalt,
coalesce((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0) AS gastos, 
/*coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0)*/0 AS gastosalt, 
(coalesce((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) - 
coalesce((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '-'), 0)) AS ajustes, 
/*(coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) - 
coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
AND ni1.idnaturaleza = ni.idnaturaleza
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null)  
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '-'), 0))*/0 AS ajustesalt, 
round(sum(p.importe), 2) AS importe, round(sum(p.importealternativo), 2) AS importealternativo,
(select e.denominacion from mod_estructuracomp.v_dametodasestructuras e where e.idestructura = p_idestructuracomun) as entida,
(select ii.urllogo from mod_logistica.conf_general ii where ii.idestructura = p_idestructuracomun) as urllogo,
'11/11/2020' as fechaminima,
'11/11/2020' as fechamaxima,
0 AS reevaluacion,0,0,
nat.codigo,
ni.idnaturaleza,0,0,
count(*) OVER() as total
 FROM mod_logistica.dat_producto p
INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = p.idindicador 
left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
INNER JOIN mod_estructuracomp.dat_estructuraop e ON e.idestructuraop = p.idestructura 
/*INNER JOIN ( select distinct dp.idestructuraop as idest,
        coalesce((
             SELECT sum(ddp.cantidad * ddp.precio)
                FROM mod_logistica.dat_producto ddp
                INNER JOIN mod_datosmaestros.nom_indicador ind on ind.idindicador = ddp.idindicador
                where dp.idestructuraop = ddp.idestructura
        ),0) 
        as importe, 
        coalesce((
             SELECT sum(ddp.cantidad * ddp.precioalternativo)
                FROM mod_logistica.dat_producto ddp
                INNER JOIN mod_datosmaestros.nom_indicador ind on ind.idindicador = ddp.idindicador
                where dp.idestructuraop = ddp.idestructura
        ),0)
        as importealt
    from mod_estructuracomp.dat_estructuraop dp
) q on q.idest = p.idestructura*/ WHERE p.cronologia > 0 AND p.idestructuracomun = $2 AND p.idestructura = ANY (CAST(p_idestructuraop as NUMERIC[])) 
GROUP BY e.denominacion, e.idestructuraop,e.codigo,p.idestructura,nat.codigo,
ni.idnaturaleza--,p.importe,p.importealternativo 
ORDER BY deposito
offset p_start limit p_limit
loop 
	all_rec.saldofinal := all_rec.apertura + all_rec.compras - all_rec.ventas - all_rec.gastos + all_rec.ajustes;
	all_rec.saldofinalalt := all_rec.aperturaalt + all_rec.comprasalt - all_rec.ventasalt - all_rec.gastosalt + all_rec.ajustesalt;
    all_rec.diferencia := all_rec.saldofinal - all_rec.importe;
	all_rec.diferenciaalt := all_rec.saldofinalalt - all_rec.importealternativo;
	return next all_rec; 
end loop;
elseif p_detalle = 2 then--desglose por producto

CREATE TEMPORARY TABLE tem_movimientosdeposistos (
        iddeposito numeric(19,0),
    deposito VARCHAR,
    idproducto numeric(19,0),
    producto VARCHAR,
    idmovimiento numeric(19,0),
    cronologia numeric,
    cronologiaprod numeric,
    fechacontable date,
    estado numeric(1,0),
    tipodocumento VARCHAR,
    iddoc numeric(19,0),
    idnaturaleza numeric(19,0),
    naturaleza VARCHAR,
    idclasificacion numeric(19,0),
    clasificacioncontable VARCHAR,
    signo VARCHAR,
    importe numeric(25,2),
    importealt numeric(25,2),
    importetotal numeric(25,2),
    importetotalalt numeric(25,2),
    entidad VARCHAR,
    identidad numeric(19,0),
    logo VARCHAR) ON COMMIT DROP;
        insert into tem_movimientosdeposistos(
        iddeposito,
        deposito,
        idproducto,
        producto,
        idmovimiento,
        cronologia,
        cronologiaprod,
        fechacontable,
        estado,
        tipodocumento,
        iddoc,
        idnaturaleza,
        naturaleza,
        idclasificacion,
        clasificacioncontable,
        signo,
        importe,
        importealt,
        importetotal,
        importetotalalt,
        entidad,
        identidad,
        logo
        )
        (SELECT alm.idestructura AS iddeposito,
         (alm.codigo || ' ' || alm.denominacion) AS deposito,
         mm.idproducto,
         (ni.numeropieza || ' ' || ni.denominacion) AS producto,
         mm.idmovimiento,
         dd.cronologia,
         dp.cronologia AS cronologiaprod,
         dd.fechacontable,
         dd.estado,
         ndp.abreviatura AS tipodocumento,
         dd.iddoc,
         0,--ni.idnaturaleza,
         '',--nat.denominacion AS naturaleza,
         COALESCE(mm.idclasificacion, dp.idclasificacioncontable) AS idclasificacion,
         '',--clc.denominacion AS clasificacioncontable,
         mm.signo,
         mm.importecontable AS importe,
         mm.importealternativo AS importealt,
         mm.importetotal,
         mm.importetotalalt,
         ent.denominacion AS entidad,
         ent.idestructura AS identidad,
         '' AS logo
  FROM mod_logistica.dat_movimiento mm
       JOIN mod_logistica.dat_producto dp ON mm.idproducto = dp.idproducto
       JOIN mod_logistica.dat_documento dd ON mm.iddocumento = dd.iddocumento
       JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc
       JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
       JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist
       JOIN mod_estructuracomp.v_dametodasestructuras ent ON ent.idestructura = des.idestructuracomun
       JOIN mod_estructuracomp.v_dametodasestructuras alm ON alm.idestructura = dp.idestructura
       JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
       --LEFT JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
       /*LEFT JOIN mod_logistica.nom_clasificacioncontable clc ON clc.idclasificacioncontable = CASE
                                                                                                WHEN mm.idclasificacion IS NOT NULL THEN
                                                                                                  mm.idclasificacion
                                                                                                ELSE dp.idclasificacioncontable
                                                                                              END*/
  WHERE dd.estado in (3, 4, 7, 8) AND
        ndp.abreviatura in ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog', 'compdevLog', 'facturaLog', 'valeLog'
          , 'transferenciaLog', 'compventaLog') AND
        dd.cronologia > 0 AND
        dp.cronologia > 0 and ent.idestructura = $2
        and alm.idestructura = ANY (CAST(p_idestructuraop as NUMERIC[])) and dd.iddoc = ANY(CAST(p_iddocs as NUMERIC[])));
     

for all_rec in SELECT e.idestructuraop AS iddeposito, (btrim(concat(e.codigo,'-',e.denominacion),'-')) AS deposito,  
coalesce(((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
--inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
--INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE m.tipodocumento IN ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog','compdevLog') AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idproducto = p.idproducto
AND (m.fechacontable < p_fechainicio OR p_fechainicio is null)
AND m.estado in (3,4) AND e.idestructuraop = m.iddeposito and m.signo = '+') - 
COALESCE((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
--inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
--left join mod_logfacturacion.dat_docfactura fact on fact.idfactura = d.iddocumento
--INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
--INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE m.tipodocumento IN ('facturaLog', 'valeLog', 'transferenciaLog', 'ajusteLog','compventaLog') 
AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idproducto = p.idproducto
AND (m.fechacontable < p_fechainicio OR p_fechainicio is null)
AND m.estado in (4) AND 
e.idestructuraop = m.iddeposito
AND m.signo = '-'),0)), 0) AS apertura, 
0 AS aperturaalt, 
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
--inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
--INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE m.tipodocumento IN ('recepcionLog', 'valedev') AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idproducto = p.idproducto
AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (m.fechacontable <= p_fechafin OR p_fechafin is null)
AND m.estado = 4 AND e.idestructuraop = m.iddeposito and m.signo = '+'), 0) AS compras, 
0 AS comprasalt, 
coalesce(round((SELECT sum(coalesce(m.importe,0)+coalesce(round(m.importealt,2),0)) FROM tem_movimientosdeposistos m
 --INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 --dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
 WHERE m.tipodocumento IN ('facturaLog','compventaLog') AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
 AND m.idproducto = p.idproducto
 AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null) 
 AND (m.fechacontable <= p_fechafin OR p_fechafin is null) 
 AND m.estado = 4 
 AND e.idestructuraop = m.iddeposito --AND d.cronologia >0 
 ), 2), 0) -
 coalesce(round((SELECT sum(coalesce(m.importe,0)+coalesce(round(m.importealt,2),0)) FROM tem_movimientosdeposistos m 
 --INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 --dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
 WHERE m.tipodocumento IN ('compdevLog') AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
 AND m.idproducto = p.idproducto
 AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null)  
 AND (m.fechacontable <= p_fechafin OR p_fechafin is null) AND m.estado = 4 
 AND e.idestructuraop = m.iddeposito), 2), 0) AS ventas, 
 0  AS ventasalt,
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
--inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
--INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
--INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE m.tipodocumento IN ('valeLog', 'transferenciaLog') AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idproducto = p.idproducto
AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (m.fechacontable <= p_fechafin OR p_fechafin is null)
AND m.estado = 4 AND e.idestructuraop = m.iddeposito), 0) AS gastos, 
0 AS gastosalt, 
(coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
 --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
--INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
--INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE m.tipodocumento IN ('ajusteLog') AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idproducto = p.idproducto
AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (m.fechacontable <= p_fechafin OR p_fechafin is null)
AND m.estado = 4 AND e.idestructuraop = m.iddeposito and m.signo = '+'), 0) - 
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
 --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
--INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
--INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE m.tipodocumento IN ('ajusteLog') AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idproducto = p.idproducto
AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (m.fechacontable <= p_fechafin OR p_fechafin is null)
AND m.estado = 4 AND e.idestructuraop = m.iddeposito and m.signo = '-'), 0)) AS ajustes, 
0 AS ajustesalt, 
round(sum(p.importe), 2) AS importe, round(sum(p.importealternativo), 2) AS importealternativo,
(select e.denominacion from mod_estructuracomp.v_dametodasestructuras e where e.idestructura = p_idestructuracomun) as entida,
(select ii.urllogo from mod_logistica.conf_general ii where ii.idestructura = p_idestructuracomun) as urllogo,
'11/11/2020' as fechaminima,
'11/11/2020' as fechamaxima,
0 AS reevaluacion,0,0,
(ni.numeropieza || ' ' || ni.denominacion) producto,
p.idproducto,0,0,
count(*) OVER() as total,
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
WHERE m.estado in (7,8) AND m.idproducto = p.idproducto --AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (m.fechacontable <= p_fechafin OR p_fechafin is null) AND e.idestructuraop = m.iddeposito and m.signo = '+'), 0) as canceladopos,
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
WHERE m.estado in (7,8) AND m.idproducto = p.idproducto --AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (m.fechacontable <= p_fechafin OR p_fechafin is null) AND e.idestructuraop = m.iddeposito and m.signo = '-'), 0) as canceladoneg
 FROM mod_logistica.dat_producto p
INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = p.idindicador 
INNER JOIN mod_estructuracomp.dat_estructuraop e ON e.idestructuraop = p.idestructura 
 WHERE p.cronologia > 0 AND p.idestructuracomun = $2 AND p.idestructura = ANY (CAST(p_idestructuraop as NUMERIC[])) 
 and (case when p_diferencia = 1 then (
coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosdeposistos mm 
--INNER JOIN mod_logistica.dat_documento dm ON dm.iddocumento = mm.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dm.iddoc 
WHERE mm.idproducto = p.idproducto --AND ddp.sigla <> 'cambioccontableLog' AND ddp.sigla <> 'revaluacionLog'
AND (mm.fechacontable <= p_fechainicio OR p_fechainicio is null)
--and dm.cronologia > 0
AND mm.estado in (3,4,7,8) and mm.signo = '+'),2),0)
-coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosdeposistos mm 
--INNER JOIN mod_tegistica.dat_documento dm ON dm.iddocumento = mm.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dm.iddoc 
WHERE mm.idproducto = p.idproducto --AND ddp.sigla <> 'cambioccontableLog' AND ddp.sigla <> 'revaluacionLog'
AND (mm.fechacontable <= p_fechafin OR p_fechafin is null)
--and dm.cronologia > 0
AND mm.estado in (3,4,7,8) and mm.signo = '-'),2),0)
-round(COALESCE(p.importe,0), 2)) <> 0 or round(p.cantidad*p.precio,2) <> p.importe else true end)
GROUP BY e.denominacion, e.idestructuraop,e.codigo,p.idestructura,ni.numeropieza,ni.denominacion,
p.idproducto--,p.importe,p.importealternativo 
ORDER BY deposito, (
coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosdeposistos mm 
--INNER JOIN mod_logistica.dat_documento dm ON dm.iddocumento = mm.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dm.iddoc 
WHERE mm.idproducto = p.idproducto --AND ddp.sigla <> 'cambioccontableLog' AND ddp.sigla <> 'revaluacionLog'
AND (mm.fechacontable <= p_fechainicio OR p_fechainicio is null)
--and dm.cronologia > 0
AND mm.estado in (3,4,7,8) and mm.signo = '+'),2),0)
-coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosdeposistos mm 
--INNER JOIN mod_logistica.dat_documento dm ON dm.iddocumento = mm.iddocumento 
--INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dm.iddoc 
WHERE mm.idproducto = p.idproducto --AND ddp.sigla <> 'cambioccontableLog' AND ddp.sigla <> 'revaluacionLog'
AND (mm.fechacontable <= p_fechafin OR p_fechafin is null)
--and dm.cronologia > 0
AND mm.estado in (3,4,7,8) and mm.signo = '-'),2),0)
-round(COALESCE(p.importe,0), 2)) ASC
offset p_start limit p_limit
loop 
	all_rec.saldofinal := all_rec.apertura + all_rec.compras - all_rec.ventas - all_rec.gastos + all_rec.ajustes + all_rec.canceladopos - all_rec.canceladoneg;
	all_rec.saldofinalalt := all_rec.aperturaalt + all_rec.comprasalt - all_rec.ventasalt - all_rec.gastosalt + all_rec.ajustesalt;
    all_rec.diferencia := all_rec.saldofinal - all_rec.importe;
	all_rec.diferenciaalt := all_rec.saldofinalalt - all_rec.importealternativo;
	return next all_rec; 
end loop;
elseif p_detalle = 3 then--desglose por clasificacion contable
	for all_rec in  SELECT e.idestructuraop AS iddeposito, (btrim(concat(e.codigo,'-',e.denominacion),'-')) AS deposito,  
coalesce(((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog','compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable < p_fechainicio OR p_fechainicio is null)
AND d.estado in (3,4) AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 and m.signo = '+') - 
COALESCE((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
left join mod_logfacturacion.dat_docfactura fact on fact.idfactura = d.iddocumento
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('facturaLog', 'valeLog', 'transferenciaLog', 'ajusteLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable < p_fechainicio OR p_fechainicio is null)
AND d.estado in (4) AND 
(CASE WHEN fact.idfactura is null then e.idestructuraop = d.idestructuracomun else e.idestructuraop = fact.iddeposito end)
AND d.cronologia > 0 and m.signo = '-'),0)), 0) AS apertura, 
/*coalesce(((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador 
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog','compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable < p_fechainicio OR p_fechainicio is null)
AND d.estado in (3,4) AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 and m.signo = '+') - 
COALESCE((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
left join mod_logfacturacion.dat_docfactura fact on fact.idfactura = d.iddocumento
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('facturaLog', 'valeLog', 'transferenciaLog', 'ajusteLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable < p_fechainicio OR p_fechainicio is null)
AND d.estado in (4) AND 
(CASE WHEN fact.idfactura is null then e.idestructuraop = d.idestructuracomun else e.idestructuraop = fact.iddeposito end)
AND d.cronologia > 0 and m.signo = '-'),0)), 0)*/0 AS aperturaalt, 
coalesce((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('recepcionLog', 'valedev') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) AS compras, 
/*coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto p1 on p1.idproducto = m.idproducto
--INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = p1.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('recepcionLog', 'valedev') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0)*/0 AS comprasalt, 
coalesce(round((SELECT sum(coalesce(m.importecontable,0)+coalesce(round(m.importealternativo,2),0)) FROM mod_logistica.dat_movimiento m
 INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
 --INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
 WHERE np.abreviatura IN ('facturaLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
 AND m.idclasificacion = nct.idclasificacioncontable
 AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
 AND (d.fechacontable <= p_fechafin OR p_fechafin is null) AND d.estado = 4 
 AND e.idestructuraop = pp.idestructura AND d.cronologia >
 0 ), 2), 0) -
 coalesce(round((SELECT sum(coalesce(m.importecontable,0)+coalesce(round(m.importealternativo,2),0)) FROM mod_logistica.dat_movimiento m INNER
 JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
  --INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
 WHERE np.abreviatura IN ('compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
 AND m.idclasificacion = nct.idclasificacioncontable
 AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null)  
 AND (d.fechacontable <= p_fechafin OR p_fechafin is null) AND d.estado = 4 
 AND e.idestructuraop = pp.idestructura AND d.cronologia >
 0 ), 2), 0	) AS ventas, 
 /*coalesce(round((SELECT sum(m.importealternativo) FROM mod_logistica.dat_movimiento m
 INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
 --INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
 WHERE np.abreviatura IN ('facturaLog','compventaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
 AND m.idclasificacion = nct.idclasificacioncontable
 AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
 AND (d.fechacontable <= p_fechafin OR p_fechafin is null) AND d.estado = 4 
 AND e.idestructuraop = pp.idestructura AND d.cronologia >
 0 ), 2), 0) -
 coalesce(round((SELECT sum(m.importealternativo) FROM mod_logistica.dat_movimiento m INNER
 JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento INNER JOIN mod_datosmaestros.dat_documentoprim
 dp on dp.iddoc = d.iddoc INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
 inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
  --INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
 WHERE np.abreviatura IN ('compdevLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
 AND m.idclasificacion = nct.idclasificacioncontable
 AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null)  
 AND (d.fechacontable <= p_fechafin OR p_fechafin is null) AND d.estado = 4 
 AND e.idestructuraop = pp.idestructura AND d.cronologia >
 0 ), 2), 0	)*/0 as ventasalt,
coalesce((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
--INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0) AS gastos, 
/*coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
--INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0 ), 0)*/0 AS gastosalt, 
(coalesce((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 --INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) - 
coalesce((SELECT sum(round(coalesce(m.importecontable,0),2)+coalesce(round(m.importealternativo,2),0)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 --INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '-'), 0)) AS ajustes, 
/*(coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 --INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '+'), 0) - 
coalesce((SELECT sum(round(m.importealternativo,2)) 
FROM mod_logistica.dat_movimiento m 
inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto 
 --INNER JOIN mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = pp.idindicador
INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
WHERE np.abreviatura IN ('ajusteLog') AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND m.idclasificacion = nct.idclasificacioncontable
AND (d.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (d.fechacontable <= p_fechafin OR p_fechafin is null)
AND d.estado = 4 AND e.idestructuraop = d.idestructuracomun AND d.cronologia > 0  and m.signo = '-'), 0))*/0 AS ajustesalt, 
round(sum(p.importe), 2) AS importe, round(sum(p.importealternativo), 2) AS importealternativo,
(select e.denominacion from mod_estructuracomp.v_dametodasestructuras e where e.idestructura = p_idestructuracomun) as entida,
(select ii.urllogo from mod_logistica.conf_general ii where ii.idestructura = p_idestructuracomun) as urllogo,
'11/11/2020' as fechaminima,
'11/11/2020' as fechamaxima,
0 AS reevaluacion,0,0,
nct.denominacion,
nct.idclasificacioncontable,0,0,
count(*) OVER() as total
 FROM mod_logistica.dat_producto p
inner join mod_logistica.nom_clasificacioncontable nct on nct.idclasificacioncontable = p.idclasificacioncontable
INNER JOIN mod_estructuracomp.dat_estructuraop e ON e.idestructuraop = p.idestructura 
 WHERE p.cronologia > 0 AND p.idestructuracomun = $2 AND p.idestructura = ANY (CAST(p_idestructuraop as NUMERIC[]))
 GROUP BY e.denominacion, e.idestructuraop,e.codigo,p.idestructura,nct.denominacion,
nct.idclasificacioncontable--,p.importe,p.importealternativo 
ORDER BY deposito
offset p_start limit p_limit
loop 
	all_rec.saldofinal := all_rec.apertura + all_rec.compras - all_rec.ventas - all_rec.gastos + all_rec.ajustes;
	all_rec.saldofinalalt := all_rec.aperturaalt + all_rec.comprasalt - all_rec.ventasalt - all_rec.gastosalt + all_rec.ajustesalt;
    all_rec.diferencia := all_rec.saldofinal - all_rec.importe;
	all_rec.diferenciaalt := all_rec.saldofinalalt - all_rec.importealternativo;
	return next all_rec; 
end loop;
ELSE
CREATE TEMPORARY TABLE tem_movimientosdeposistos (
        iddeposito numeric(19,0),
    deposito VARCHAR,
    idproducto numeric(19,0),
    producto VARCHAR,
    idmovimiento numeric(19,0),
    cronologia numeric,
    cronologiaprod numeric,
    fechacontable date,
    estado numeric(1,0),
    tipodocumento VARCHAR,
    iddoc numeric(19,0),
    idnaturaleza numeric(19,0),
    naturaleza VARCHAR,
    idclasificacion numeric(19,0),
    clasificacioncontable VARCHAR,
    signo VARCHAR,
    importe numeric(25,2),
    importealt numeric(25,2),
    importetotal numeric(25,2),
    importetotalalt numeric(25,2),
    entidad VARCHAR,
    identidad numeric(19,0),
    logo VARCHAR) ON COMMIT DROP;
        insert into tem_movimientosdeposistos(
        iddeposito,
        deposito,
        idproducto,
        producto,
        idmovimiento,
        cronologia,
        cronologiaprod,
        fechacontable,
        estado,
        tipodocumento,
        iddoc,
        idnaturaleza,
        naturaleza,
        idclasificacion,
        clasificacioncontable,
        signo,
        importe,
        importealt,
        importetotal,
        importetotalalt,
        entidad,
        identidad,
        logo
        )
        (SELECT alm.idestructura AS iddeposito,
         (alm.codigo || ' ' || alm.denominacion) AS deposito,
         mm.idproducto,
         ''/*(ni.numeropieza::text || ' '::text) || ni.denominacion::text*/ AS producto,
         mm.idmovimiento,
         dd.cronologia,
         dp.cronologia AS cronologiaprod,
         dd.fechacontable,
         dd.estado,
         ndp.abreviatura AS tipodocumento,
         dd.iddoc,
         0,--ni.idnaturaleza,
         '',--nat.denominacion AS naturaleza,
         COALESCE(mm.idclasificacion, dp.idclasificacioncontable) AS idclasificacion,
         '',--clc.denominacion AS clasificacioncontable,
         mm.signo,
         mm.importecontable AS importe,
         mm.importealternativo AS importealt,
         mm.importetotal,
         mm.importetotalalt,
         ent.denominacion AS entidad,
         ent.idestructura AS identidad,
         '' AS logo
  FROM mod_logistica.dat_movimiento mm
       JOIN mod_logistica.dat_producto dp ON mm.idproducto = dp.idproducto
       JOIN mod_logistica.dat_documento dd ON mm.iddocumento = dd.iddocumento
       JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc
       JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
       JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist
       JOIN mod_estructuracomp.v_dametodasestructuras ent ON ent.idestructura = des.idestructuracomun
       JOIN mod_estructuracomp.v_dametodasestructuras alm ON alm.idestructura = dp.idestructura
       --JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
       --LEFT JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
       /*LEFT JOIN mod_logistica.nom_clasificacioncontable clc ON clc.idclasificacioncontable = CASE
                                                                                                WHEN mm.idclasificacion IS NOT NULL THEN
                                                                                                  mm.idclasificacion
                                                                                                ELSE dp.idclasificacioncontable
                                                                                              END*/
  WHERE dd.estado in (3, 4, 7, 8) AND
        ndp.abreviatura in ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog', 'compdevLog', 'facturaLog', 'valeLog'
          , 'transferenciaLog', 'compventaLog') AND
        dd.cronologia > 0 AND
        dp.cronologia > 0 and ent.idestructura = $2
        and alm.idestructura = ANY (CAST(p_idestructuraop as NUMERIC[])) and dd.iddoc = ANY(CAST(p_iddocs as NUMERIC[])));
        

for all_rec in SELECT p.idestructuraop AS iddeposito, (p.codigo||' '||p.denominacion) AS deposito,  
coalesce(((SELECT sum(round(COALESCE(m.importe,0),2)+round(coalesce(m.importealt,0),2)) 
FROM tem_movimientosdeposistos m
WHERE m.tipodocumento IN ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog','compdevLog') --AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (m.fechacontable < p_fechainicio OR p_fechainicio is null)
AND m.estado in (3,4) AND m.iddeposito = p.idestructuraop and m.signo = '+') - 
COALESCE((SELECT sum(round(COALESCE(m.importe,0),2)+round(coalesce(m.importealt,0),2)) 
FROM tem_movimientosdeposistos m
WHERE m.tipodocumento IN ('facturaLog', 'valeLog', 'transferenciaLog', 'ajusteLog', 'compventaLog') --AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (m.fechacontable < p_fechainicio OR p_fechainicio is null)
AND m.estado in (4) AND m.iddeposito = p.idestructuraop
 AND m.signo = '-'),0)), 0) AS apertura, 
0 AS aperturaalt, 
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
WHERE m.tipodocumento IN ('recepcionLog', 'valedev'/*,'compdevLog'*/) --AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (m.fechacontable <= p_fechafin OR p_fechafin is null)
AND m.estado = 4 AND p.idestructuraop = m.iddeposito and m.signo = '+'), 0) AS compras, 
0 AS comprasalt, 
coalesce(round((SELECT sum(coalesce(m.importe,0)+coalesce(round(m.importealt,2),0)) FROM tem_movimientosdeposistos m 
 WHERE m.tipodocumento IN ('facturaLog','compventaLog') --AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
 AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null) 
 AND (m.fechacontable <= p_fechafin OR p_fechafin is null) AND m.estado = 4 
 AND p.idestructuraop = m.iddeposito ), 2), 0) -
 coalesce(round((SELECT sum(coalesce(m.importe,0)+coalesce(round(m.importealt,2),0)) FROM tem_movimientosdeposistos m 
 WHERE m.tipodocumento IN ('compdevLog') --AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
 AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null)  
 AND (m.fechacontable <= p_fechafin OR p_fechafin is null) AND m.estado = 4 
 AND p.idestructuraop = m.iddeposito), 2), 0) AS ventas, 
 0  AS ventasalt,
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
WHERE m.tipodocumento IN ('valeLog', 'transferenciaLog') --AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (m.fechacontable <= p_fechafin OR p_fechafin is null)
AND m.estado = 4 AND p.idestructuraop = m.iddeposito ), 0) AS gastos, 
0 AS gastosalt, 
(coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
WHERE m.tipodocumento IN ('ajusteLog') --AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (m.fechacontable <= p_fechafin OR p_fechafin is null)
AND m.estado = 4 AND p.idestructuraop = m.iddeposito and m.signo = '+'), 0) - 
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
WHERE m.tipodocumento IN ('ajusteLog') --AND m.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null) 
AND (m.fechacontable <= p_fechafin OR p_fechafin is null)
AND m.estado = 4 AND p.idestructuraop = m.iddeposito AND m.signo = '-'), 0)) AS ajustes, 
0 AS ajustesalt, 
sum(round(dp.precio*dp.cantidad, 2)) AS importe, 0 AS importealternativo,
(select e.denominacion from mod_estructuracomp.v_dametodasestructuras e where e.idestructura = p_idestructuracomun) as entidad,
(select ii.urllogo from mod_logistica.conf_general ii where ii.idestructura = p_idestructuracomun) as urllogo,
'11/11/2020' as fechaminima,
'11/11/2020' as fechamaxima,
0 AS reevaluacion,0,0,
p.denominacion as dinamico,
-1,0,0,count(*) OVER() as total,
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
WHERE m.estado in (7,8) --AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (m.fechacontable <= p_fechafin OR p_fechafin is null) AND p.idestructuraop = m.iddeposito and m.signo = '+'), 0) as canceladopos,
coalesce((SELECT sum(round(coalesce(m.importe,0),2)+coalesce(round(m.importealt,2),0)) 
FROM tem_movimientosdeposistos m 
WHERE m.estado in (7,8) --AND (m.fechacontable >= p_fechainicio OR p_fechainicio is null)
AND (m.fechacontable <= p_fechafin OR p_fechafin is null) AND p.idestructuraop = m.iddeposito and m.signo = '-'), 0) as canceladoneg
 FROM mod_logistica.dat_producto dp
--INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = p.idindicador 
--left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
 INNER JOIN mod_estructuracomp.dat_estructuraop p ON p.idestructuraop = dp.idestructura 
WHERE dp.cronologia > 0 AND dp.idestructuracomun = $2 and p.idestructuraop = ANY (CAST(p_idestructuraop as NUMERIC[]))
GROUP BY p.idestructuraop, p.codigo, p.denominacion--, p.iddeposito --,p.idestructura--,q.importe,q.importealt 
ORDER BY deposito
offset p_start limit p_limit
loop 
	all_rec.saldofinal := all_rec.apertura + all_rec.compras - all_rec.ventas - all_rec.gastos + all_rec.ajustes + all_rec.canceladopos - all_rec.canceladoneg;
	all_rec.saldofinalalt := all_rec.aperturaalt + all_rec.comprasalt - all_rec.ventasalt - all_rec.gastosalt + all_rec.ajustesalt;
    all_rec.diferencia := all_rec.saldofinal - all_rec.importe;
	all_rec.diferenciaalt := all_rec.saldofinalalt - all_rec.importealternativo;
	return next all_rec; 
end loop;
end if;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_recvalordepositobyfecha(character varying, numeric, numeric, character varying, date, date, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;



-- FUNCTION: mod_loginventario.f_generarajustescero(numeric, numeric, numeric, character varying)

-- DROP FUNCTION IF EXISTS mod_loginventario.f_generarajustescero(numeric, numeric, numeric, character varying);

CREATE OR REPLACE FUNCTION mod_loginventario.f_generarajustescero(
	p_idestructura numeric,
	p_iddeposito numeric,
	p_idusuario numeric,
	p_iddocs character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_producto record;
  v_idespecialidad numeric;
  v_idperiodo record;
  v_iddoc numeric;
  v_iddocumentopos numeric;
  v_iddocumentoneg numeric;
  v_idproducto numeric;
  v_fecha date;
  v_negativo numeric;
  v_positivo numeric;
  v_operacionresta numeric;
  v_operacionsuma numeric;
BEGIN
	v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                    where cue.idusuario = p_idusuario limit 1);
    
    v_operacionresta := (select vg.valor from mod_logistica.nom_variableglobal vg 
                    where vg.nombre = 'OPER_AJUSTECERO_RESTA' limit 1);
    
    v_operacionsuma := (select vg.valor from mod_logistica.nom_variableglobal vg 
                    where vg.nombre = 'OPER_AJUSTECERO_SUMA' limit 1);                
        
    if v_operacionresta is not null and v_operacionsuma is not null then
    	v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, p_idestructura);
    
        v_negativo = 0;
        v_positivo = 0;

        v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'ajusteLog' and des.idestructuracomun = p_idestructura limit 1);
        
        v_fecha := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 10 and des.idestructuracomun = p_idestructura limit 1);
              	        
            raise notice 'iddoc ,%', v_iddoc;
            --generando ajuste con productos negativos      
            INSERT INTO 
              mod_logistica.dat_documento
            (
              iddoc,
              anno,
              fechacontable,
              observaciones,
              cronologia,
              version,
              idusuario,
              idoperacion,
              estado,
              idejercicio,
              idestructuracomun,
              idperiodo,
              numeroref,
              idespecialidad
            )
            VALUES (
              v_iddoc,
              date_part('year', CAST(to_char(v_fecha, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fecha,
              'AJUSTE A CERO',
              0,
              1,
              p_idusuario,
              v_operacionsuma,
              1,
              v_idperiodo.idejercicioactual,
              p_iddeposito,
              v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_iddeposito
              ),0)+1),
              v_idespecialidad
            ) returning iddocumento into v_iddocumentoneg;
            INSERT INTO 
              mod_loginventario.dat_ajuste
            (
              idajuste,
              version,
              idoperacion
            )
            VALUES (
              v_iddocumentoneg,
              1,
              v_operacionsuma
            );
            --generando ajuste con productos positivos      
            INSERT INTO 
              mod_logistica.dat_documento
            (
              iddoc,
              anno,
              fechacontable,
              observaciones,
              cronologia,
              version,
              idusuario,
              idoperacion,
              estado,
              idejercicio,
              idestructuracomun,
              idperiodo,
              numeroref,
              idespecialidad
            )
            VALUES (
              v_iddoc,
              date_part('year', CAST(to_char(v_fecha, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fecha,
              'AJUSTE A CERO',
              0,
              1,
              p_idusuario,
              v_operacionresta,
              1,
              v_idperiodo.idejercicioactual,
              p_iddeposito,
              v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_iddeposito
              ),0)+1),
              v_idespecialidad
            ) returning iddocumento into v_iddocumentopos;
            INSERT INTO 
              mod_loginventario.dat_ajuste
            (
              idajuste,
              version,
              idoperacion
            )
            VALUES (
              v_iddocumentopos,
              1,
              v_operacionresta
            );
            
            CREATE TEMPORARY TABLE tem_movimientosaux (
            iddeposito numeric(19,0),
            deposito VARCHAR,
            idproducto numeric(19,0),
            producto VARCHAR,
            idmovimiento numeric(19,0),
            cronologia numeric,
            cronologiaprod numeric,
            fechacontable date,
            estado numeric(1,0),
            tipodocumento VARCHAR,
            iddoc numeric(19,0),
            idnaturaleza numeric(19,0),
            naturaleza VARCHAR,
            idclasificacion numeric(19,0),
            clasificacioncontable VARCHAR,
            signo VARCHAR,
            importe numeric(25,2),
            importealt numeric(25,2),
            importetotal numeric(25,2),
            importetotalalt numeric(25,2),
            entidad VARCHAR,
            identidad numeric(19,0),
            logo VARCHAR) ON COMMIT DROP;
                insert into tem_movimientosaux(
                idmovimiento,
                iddeposito,
                idproducto,
                cronologia,
                cronologiaprod,
                fechacontable,
                estado,
                tipodocumento,
                iddoc,
                signo,
                importe,
                importealt,
                importetotal,
                importetotalalt
                )
                (SELECT distinct mm.idmovimiento, alm.idestructura AS iddeposito,
                 mm.idproducto,
                 dd.cronologia,
                 dp.cronologia AS cronologiaprod,
                 dd.fechacontable,
                 dd.estado,
                 ndp.abreviatura AS tipodocumento,
                 dd.iddoc,
                 mm.signo,
                 coalesce(mm.importecontable,0) AS importe,
                 coalesce(mm.importealternativo,0) AS importealt,
                 mm.importetotal,
                 mm.importetotalalt
          FROM mod_logistica.dat_movimiento mm
               JOIN mod_logistica.dat_producto dp ON mm.idproducto = dp.idproducto
               JOIN mod_logistica.dat_documento dd ON mm.iddocumento = dd.iddocumento
               JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc
               JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
               JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist
               JOIN mod_estructuracomp.v_dametodasestructuras ent ON ent.idestructura = des.idestructuracomun
               JOIN mod_estructuracomp.v_dametodasestructuras alm ON alm.idestructura = dp.idestructura
               JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
          WHERE dd.estado in (3, 4, 7, 8) AND
                ndp.abreviatura in ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog', 'compdevLog', 'facturaLog', 'valeLog'
                  , 'transferenciaLog', 'compventaLog') AND
                dd.cronologia > 0 AND
                dp.cronologia > 0 and ent.idestructura = p_idestructura
                and alm.idestructura = p_iddeposito and dd.iddoc = ANY(CAST(p_iddocs as NUMERIC[])));
                  
            for v_producto in 
                  
            select p.idproducto, p.idumedida, p.idelementogasto, p.idclasificacioncontable,
            (
            coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosaux mm  
            WHERE mm.idproducto = p.idproducto 
            --AND mm.fechacontable <= p_fecha
            AND mm.estado in (3,4,7,8) and mm.signo = '+'),2),0)
            -coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosaux mm 
            WHERE mm.idproducto = p.idproducto 
            --AND (mm.fechacontable <= p_fechafin OR p_fechafin is null)
            AND mm.estado in (3,4,7,8) and mm.signo = '-'),2),0)
            -round(COALESCE(p.precio*p.cantidad,0), 2)) as diferencia 
            FROM mod_logistica.dat_producto p
             WHERE p.cronologia > 0 AND p.idestructuracomun = p_idestructura AND p.idestructura = p_iddeposito 
             and p.cantidad = 0 and (
            coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosaux mm  
            WHERE mm.idproducto = p.idproducto 
            --AND mm.fechacontable <= p_fecha
            AND mm.estado in (3,4,7,8) and mm.signo = '+'),2),0)
            -coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosaux mm 
            WHERE mm.idproducto = p.idproducto 
            --AND (mm.fechacontable <= p_fechafin OR p_fechafin is null)
            AND mm.estado in (3,4,7,8) and mm.signo = '-'),2),0)
            -round(COALESCE(p.precio*p.cantidad,0), 2)) <> 0
                  
            loop
                if v_producto.diferencia < 0 then
                    v_negativo = 1;
                    INSERT INTO 
                      mod_logistica.dat_movimiento
                    (
                      iddocumento,
                      idproducto,
                      preciocontable,
                      importecontable,
                      cantidad,
                      cronologia,
                      importetotal,
                      signo,
                      idunidadmedida,
                      idelementogasto,
                      idclasificacion
                    )
                    VALUES (
                      v_iddocumentoneg,
                      v_producto.idproducto,
                      0,
                      v_producto.diferencia*-1,
                      0,
                      0,
                      0,
                      '+',
                      v_producto.idumedida,
                      v_producto.idelementogasto,
                      v_producto.idclasificacioncontable
                    );
                else 
                    v_positivo = 1;
                    INSERT INTO 
                      mod_logistica.dat_movimiento
                    (
                      iddocumento,
                      idproducto,
                      preciocontable,
                      importecontable,
                      cantidad,
                      cronologia,
                      importetotal,
                      signo,
                      idunidadmedida,
                      idelementogasto,
                      idclasificacion
                    )
                    VALUES (
                      v_iddocumentopos,
                      v_producto.idproducto,
                      0,
                      v_producto.diferencia,
                      0,
                      0,
                      0,
                      '-',
                      v_producto.idumedida,
                      v_producto.idelementogasto,
                      v_producto.idclasificacioncontable
                    );
                end if;              
                
            end loop;
            if v_negativo = 0 THEN
                delete from mod_logistica.dat_documento where iddocumento = v_iddocumentoneg;
            end if;
            
            if v_positivo = 0 THEN
                delete from mod_logistica.dat_documento where iddocumento = v_iddocumentopos;
            end if;
    end if;
END;
$BODY$;

ALTER FUNCTION mod_loginventario.f_generarajustescero(numeric, numeric, numeric, character varying)
    OWNER TO zeolides;
