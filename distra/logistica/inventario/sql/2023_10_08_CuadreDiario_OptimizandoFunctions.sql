CREATE TABLE mod_logistica.his_cuadrediario_clasificacion (
  idcierrediario NUMERIC(19,0) NOT NULL,
  saldoinicial NUMERIC(25,2) DEFAULT 0 NOT NULL,
  saldofinal NUMERIC(25,2) DEFAULT 0 NOT NULL,
  saldocontable NUMERIC(25,2) DEFAULT 0 NOT NULL,
  recepciones NUMERIC(25,2) DEFAULT 0 NOT NULL,
  devoluciones NUMERIC(25,6) DEFAULT 0 NOT NULL,
  ajustesentrada NUMERIC(25,6) DEFAULT 0 NOT NULL,
  ventas NUMERIC(25,6) DEFAULT 0 NOT NULL,
  salidascosto NUMERIC(25,6) DEFAULT 0 NOT NULL,
  devrecepciones NUMERIC(25,6) DEFAULT 0 NOT NULL,
  ajustessalida NUMERIC(25,6) DEFAULT 0 NOT NULL,
  clasificacion VARCHAR NOT NULL,
  CONSTRAINT his_cuadrediario_clasificacion_idx UNIQUE(idcierrediario, clasificacion),
  CONSTRAINT his_cuadrediario_clasificacion_fk FOREIGN KEY (idcierrediario)
    REFERENCES mod_logistica.his_cuadrediario(idcierrediario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logistica.his_cuadrediario_clasificacion
  ALTER COLUMN idcierrediario SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario_clasificacion
  ALTER COLUMN saldoinicial SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario_clasificacion
  ALTER COLUMN saldofinal SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario_clasificacion
  ALTER COLUMN saldocontable SET STATISTICS 0;

COMMENT ON COLUMN mod_logistica.his_cuadrediario_clasificacion.idcierrediario
IS 'Id del cuadre diario de almacen';

COMMENT ON COLUMN mod_logistica.his_cuadrediario_clasificacion.saldoinicial
IS 'Saldo inicial: valor del saldo final del cierre anterior';

COMMENT ON COLUMN mod_logistica.his_cuadrediario_clasificacion.saldofinal
IS 'saldo final: es la sumatoria de los saldos de cada movimiento del dia por clasificación contable.';

COMMENT ON COLUMN mod_logistica.his_cuadrediario_clasificacion.saldocontable
IS 'saldo contable: valor de la cuenta contable de la clasificación en la contabilidad';

ALTER TABLE mod_logistica.his_cuadrediario_clasificacion
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadediario_apertura (
)
RETURNS void AS
$body$
DECLARE
	v_result record;
BEGIN
  delete from mod_logistica.his_cuadrediario;

  INSERT INTO mod_logistica.his_cuadrediario
  (
  	iddeposito,
    fechacierre,
    saldoinicial,
    saldofinal,
    contador,
    apertura,
    saldocontable,
    estado
  )
  select q.idestructura,q.fecha,sum(q.saldoinicial) as saldoinicial,sum(q.saldofinal) as saldofinal,0,1,q.saldocont from (
  select distinct p.idestructura,coalesce(f.fecha,e.fecha) as fecha,
  round(p.importe,2) as saldoinicial,round(p.importe,2) as saldofinal,cc.idcuenta,p.idestructuracomun,
  /*coalesce((SELECT sum(round(rs.saldomb,2)) 
  FROM mod_contabilidad.dat_comprobante_documento cd 
  inner join mod_contabilidad.res_centroelem_saldo rs on rs.idcomprobante = cd.idcomprobante
  WHERE rs.idcuenta = cc.idcuenta and rs.fechaemision between ec.inicio and ec.fin
  AND cd.iddeposito = p.idestructura), 0)*/0 as saldocont,1
  FROM mod_logistica.dat_producto p 
  inner join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = p.idestructura
  --INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = p.idestructura 
  left join mod_logistica.dat_estadoalmacen e on e.iddeposito = cf.iddeposito 
  inner join mod_datosmaestros.dat_estructurasubsist sub on sub.idestructuracomun = p.idestructuracomun 
          and sub.idsubsistema = 10                
  inner join mod_datosmaestros.dat_fecha f on f.idestructurasubsist = sub.idestructurasubsist
  inner join mod_datosmaestros.dat_cierre c on c.idestructurasubsist = sub.idestructurasubsist
  inner join mod_datosmaestros.dat_ejerciciocontable ec on ec.idejercicio = c.idejercicioactual
  left join mod_logistica.his_cuadrediario h on h.iddeposito = p.idestructura
  inner join mod_logistica.nom_clasificacioncontable cc on cc.idclasificacioncontable = p.idclasificacioncontable
  
  /*left join mod_contabilidad.dat_comprobante_documento cd on cd.iddeposito = p.idestructura
  left join mod_contabilidad.res_centroelem_saldo rs on rs.idcomprobante = cd.idcomprobante
  			and rs.idcuenta = cc.idcuenta and rs.fechaemision between ec.inicio and ec.fin*/
  WHERE p.cronologia > 0 and p.idclasificacioncontable = 
          any(CAST(string_to_array(cf.clasificaciones, ',') as numeric[]))
          and p.idestructura not in (select iddeposito from mod_logistica.his_cuadrediario where apertura = 1)
  GROUP BY p.idestructura,p.importe,h.saldofinal,--p.idproducto,
  e.fecha,f.fecha,h.fechacierre,cf.clasificaciones,cc.idcuenta,ec.inicio,ec.fin,p.idestructuracomun
  order by p.idestructura
  )q
  group by q.idestructura,q.fecha,q.saldocont;

for v_result in (select distinct cf.iddeposito, h.idcierrediario,p.idestructuracomun 
  FROM mod_logdistribucion.conf_depositocuadrediario cf
  inner join mod_logistica.dat_producto p on cf.iddeposito = p.idestructura
  inner join mod_logistica.his_cuadrediario h on h.iddeposito = cf.iddeposito and h.apertura = 1)loop
	
  INSERT INTO 
    mod_logistica.his_cuadrediario_clasificacion
  (
    idcierrediario,
    saldoinicial,
    saldofinal,
    saldocontable,
    recepciones,
    devoluciones,
    ajustesentrada,
    ventas,
    salidascosto,
    devrecepciones,
    ajustessalida,
    clasificacion
  )  
  SELECT v_result.idcierrediario,0 as importeinicial,importefinal,saldocont,recepcion,valedev,
  ajusteent,ventas,salidacosto,devrecep,ajustesal,agrupador
  FROM mod_loginventario.fn_cuadrediariomov(v_result.iddeposito,1,1,v_result.idestructuracomun, NULL, NULL, 1) q
  --inner join mod_logistica.his_cuadrediario h on h.iddeposito = q.iddeposito and h.apertura = 1
  ;
end loop;

  

  --select * FROM mod_loginventario.fn_cuadrediariomov(200532740,1,1,200531052, NULL, NULL, 1)
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;
ALTER FUNCTION mod_loginventario.fn_cuadrediario_apertura ()
  OWNER TO zeolides;
 
DROP FUNCTION mod_loginventario.fn_cuadrediarioproductos(p_idalmacen numeric, p_agrupadopor numeric, p_saldos numeric, p_idestructuracomun numeric, p_arrayclasifcontab varchar, p_arraynaturalezas varchar, p_desde date, p_hasta date);
DROP FUNCTION mod_loginventario.fn_cuadrediariomov(p_idalmacen numeric, p_agrupadopor numeric, p_tiporeporte numeric, p_idestructuracomun numeric, p_arrayclasifcontab varchar, p_arraynaturalezas varchar, p_isapertura numeric);

DROP TYPE mod_loginventario.td_cuadrediario;
DROP TYPE mod_loginventario.td_cuadrediarioproductos; 
  
CREATE TYPE mod_loginventario.td_cuadrediario AS (
  almacen VARCHAR,
  recepcion NUMERIC(25,2),
  valedev NUMERIC(25,2),
  ajusteent NUMERIC(25,2),
  ventas NUMERIC(25,2),
  ajustesal NUMERIC(25,2),
  salidacosto NUMERIC(25,2),
  devrecep NUMERIC(25,6),
  importeinicial NUMERIC(25,6),
  importefinal NUMERIC(25,2),
  fechaactual DATE,
  fechaultcierre DATE,
  direccion VARCHAR,
  telefono VARCHAR,
  fax VARCHAR,
  correo VARCHAR,
  entidad VARCHAR,
  logo VARCHAR,
  agrupador VARCHAR,
  saldoinv NUMERIC(25,2),
  saldomov NUMERIC(25,2),
  saldocont NUMERIC(25,2),
  proxfecha DATE,
  iddeposito NUMERIC(19,0),
  diferencia NUMERIC(25,2),
  cantprod NUMERIC(5,0)
);

ALTER TYPE mod_loginventario.td_cuadrediario
  OWNER TO zeolides;
  

CREATE TYPE mod_loginventario.td_cuadrediarioproductos AS (
  idproducto NUMERIC(19,0),
  producto VARCHAR,
  um VARCHAR,
  clasificacion VARCHAR,
  naturaleza VARCHAR,
  idestructura NUMERIC(19,0),
  recepcion NUMERIC(25,6),
  valedev NUMERIC(25,6),
  ajusteent NUMERIC(25,6),
  ventas NUMERIC(25,6),
  ajustesal NUMERIC(25,6),
  salidacosto NUMERIC(25,6),
  devrecep NUMERIC(25,6),
  existinicial NUMERIC(25,6),
  existfinal NUMERIC(25,6),
  precio NUMERIC(25,6),
  importeinv NUMERIC(25,2),
  importeinicial NUMERIC(25,2),
  importefinal NUMERIC(25,2),
  agrupador VARCHAR,
  idestructuracomun NUMERIC(19,0),
  fechaactual DATE,
  fechaultcierre DATE,
  direccion VARCHAR,
  telefono VARCHAR,
  fax VARCHAR,
  correo VARCHAR,
  entidad VARCHAR,
  logo VARCHAR,
  almacen VARCHAR,
  saldoinicial NUMERIC(25,2),
  iddeposito NUMERIC(19,0),
  saldocont NUMERIC(25,2),
  idnaturaleza NUMERIC(19,0),
  idcuenta NUMERIC(19,0)
);

ALTER TYPE mod_loginventario.td_cuadrediarioproductos
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediariomov (
  p_idalmacen numeric,
  p_agrupadopor numeric,
  p_tiporeporte numeric = 0,
  p_idestructuracomun numeric = 0,
  p_arrayclasifcontab varchar = NULL::character varying,
  p_arraynaturalezas varchar = NULL::character varying,
  p_isapertura numeric = 0
)
RETURNS SETOF mod_loginventario.td_cuadrediario AS
$body$
DECLARE
  v_result mod_loginventario.td_cuadrediario;
  v_datosfecha record;
  v_fechainicio date = null;
  v_fechafin date = null;
BEGIN
	if p_isapertura = 1 and p_idestructuracomun is not null then 
      select * into v_datosfecha 
      from mod_datosmaestros.dat_estructurasubsist sub                                  
      inner join mod_datosmaestros.dat_fecha f on f.idestructurasubsist = sub.idestructurasubsist
      inner join mod_datosmaestros.dat_cierre c on c.idestructurasubsist = sub.idestructurasubsist
      inner join mod_datosmaestros.dat_ejerciciocontable ec on ec.idejercicio = c.idejercicioactual
      where sub.idestructuracomun = p_idestructuracomun and sub.idsubsistema = 10;
      v_fechainicio = v_datosfecha.inicio; 
      v_fechafin = v_datosfecha.fin;
    end if;    
    --if p_tiporeporte = 0 then 
      for v_result in (
            select DISTINCT v.codigo||' - '||v.denominacion as almacen,
            sum(q.recepcion) as recepcion, sum(q.valedev) as valedev, sum(q.ajusteent) as ajusteent, sum(ventas) as ventas,
            sum(q.ajustesal) as ajustesal, sum(q.salidacosto) as salidacosto, sum(q.devrecep) as devrecep,
            sum(q.importeinicial) as importeinicial,sum(q.importefinal) as importefinal,q.fechaactual, q.fechaultcierre,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,upper(q.agrupador) as agrupador,sum(q.importeinv) as saldoinv,
            0,(case when  p_agrupadopor = 1 then 
            	coalesce((SELECT sum(round(rs.saldomb,2)) 
                FROM mod_contabilidad.dat_comprobante_documento cd 
                inner join mod_contabilidad.res_centroelem_saldo rs on rs.idcomprobante = cd.idcomprobante
                WHERE rs.idcuenta = q.idcuenta --and rs.fechaemision between ec.inicio and ec.fin
                AND (case when p_isapertura = 1 then rs.fechaemision between v_fechainicio and v_fechafin
                	else rs.fechaemision = q.fechaactual end)
                
                AND cd.iddeposito = p_idalmacen), 0)
            else 0 end),now(), q.iddeposito, round(sum(q.importefinal) - sum(q.importeinv),2) as diferencia,count(q.idproducto) as items
            from (
                select * from mod_loginventario.fn_cuadrediarioproductos(p_idalmacen,p_agrupadopor, 1, p_idestructuracomun, 
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
    --else if p_tiporeporte = 1 then
      /*for v_result in (         
            select DISTINCT v.codigo||' - '||v.denominacion as almacen,
            sum(q.recepcion) as recepcion, sum(q.valedev) as valedev, sum(q.ajusteent) as ajusteent, sum(ventas) as ventas,
            sum(q.ajustesal) as ajustesal, sum(q.salidacosto) as salidacosto, sum(q.devrecep) as devrecep,
            sum(q.importeinicial) as importeinicial,sum(q.importefinal) as importefinal,q.fechaactual, q.fechaultcierre,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,upper(q.agrupador) as agrupador,0,0,0,now(),
            q.iddeposito,sum(q.saldoinicial) as saldoinicial, sum(q.importeinv) as importeinv
            from (
                select * from mod_loginventario.fn_cuadrediarioproductos(p_idalmacen,p_agrupadopor, 1, p_idestructuracomun, p_arrayclasifcontab, p_arraynaturalezas)
                ) q
            INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = q.idestructura 
            INNER JOIN mod_estructuracomp.v_dametodasestructuras es ON es.idestructura = q.idestructuracomun
            left join mod_logistica.conf_general cg on cg.idestructura = es.idestructura
            GROUP by q.agrupador,v.codigo,v.denominacion,q.fechaactual, q.fechaultcierre,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,q.iddeposito
            ORDER BY agrupador
      )loop
      		v_result.saldomov = round(v_result.recepcion+v_result.valedev+v_result.ajusteent-
            	v_result.ventas-v_result.salidacosto-v_result.devrecep-v_result.ajustesal,2);
            v_result.proxfecha = cast(v_result.fechaactual as date)+cast('1 days' as interval);
            v_result.saldoinv = v_result.importeinv;
            v_result.diferencia = round(v_result.importefinal - v_result.saldoinv,2);
          return next v_result;
      end loop;*/
    	
    	--end if;
   -- end if;
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.fn_cuadrediariomov (p_idalmacen numeric, p_agrupadopor numeric, p_tiporeporte numeric, p_idestructuracomun numeric, p_arrayclasifcontab varchar, p_arraynaturalezas varchar, p_isapertura numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediarioproductos (
  p_idalmacen numeric,
  p_agrupadopor numeric,
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
raise notice 'p_desde%',p_desde;
	for v_result in (
    SELECT DISTINCT p.idproducto,upper(coalesce(i.numeropieza,i.codigo)||' - '||i.denominacion) as producto, 
                upper(um.abreviaturaunidadmedida) as um, cc.denominacion as clasificacion,
                nat.denominacion as naturaleza,p.idestructura,
                /*coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6)) 
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
                INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
                --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
                WHERE np.abreviatura IN ('aperturaLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
                AND m.idproducto = p.idproducto
                AND d.estado = 3 AND v.idestructura = d.idestructuracomun AND d.cronologia > 0 ), 0) as apertura,*/
                coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6)) 
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
                INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
                --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
                WHERE np.abreviatura IN ('recepcionLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
                AND (case when p_desde is not null then d.fechacontable between p_desde and p_hasta 
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
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
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
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
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
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
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
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
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
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
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
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
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
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
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
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
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
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
                else d.fechacontable = COALESCE(e.fecha,f.fecha) end)
                AND m.idproducto = p.idproducto
                AND d.estado = 7 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0), 0) as devrecep,
                coalesce((select m.existenciaactual
                      from mod_logistica.dat_movimiento m
                      inner join mod_logistica.dat_documento d using(iddocumento)
                      where m.idproducto = p.idproducto 
                      AND d.fechacontable < cast(COALESCE(e.fecha,f.fecha) as date)
                     -- and dd.estado = 4
                      order by d.cronologia desc limit 1
                ),0) as existinicial, p.cantidad as existfinal, p.precio, p.importe,
                coalesce((select m.importetotal
                      from mod_logistica.dat_movimiento m
                      inner join mod_logistica.dat_documento d using(iddocumento)
                      inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
                      inner join mod_datosmaestros.nom_indicador dn on dn.idindicador = pp.idindicador
                      where d.fechacontable < cast(COALESCE(e.fecha,f.fecha) as date) 
                			AND m.idproducto = p.idproducto
                      order by d.cronologia desc limit 1
                ),0) as importeinicial,
                coalesce((select m.importetotal
                      from mod_logistica.dat_movimiento m
                      inner join mod_logistica.dat_documento d using(iddocumento)
                      inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
                      where d.fechacontable = cast(COALESCE(e.fecha,f.fecha) as date)
                			AND m.idproducto = p.idproducto
                     -- and dd.estado = 4
                      order by d.cronologia desc limit 1
                ),0) as importefinal,
                (case when p_agrupadopor = 1 then cc.denominacion else 
                case when p_agrupadopor = 2 then nat.denominacion else
                case when p_agrupadopor = 3 then v.codigo||' - '||v.denominacion else 
                coalesce(i.numeropieza,i.codigo)||' - '||i.denominacion end end end) as agrupador,
                p.idestructuracomun, COALESCE(e.fecha,f.fecha)::date as fechaactual,
                h.fechacierre::date as fechaultcierre, 
                es.direccion as direccion, es.telefono as telefono, es.fax as fax, es.correo as correo, 
        		es.codigo||' - '||es.denominacion as entidad, cg.urllogo,
                v.codigo||' - '||v.denominacion as almacen,
                round(coalesce(h.saldofinal,0),2) as saldoinicial,v.idestructura AS iddeposito,
                
                /*coalesce((SELECT sum(round(rs.saldomb,2)) 
                FROM mod_contabilidad.dat_comprobante_documento cd 
                inner join mod_contabilidad.res_centroelem_saldo rs on rs.idcomprobante = cd.idcomprobante
                WHERE rs.idcuenta = cc.idcuenta --and rs.fechaemision between ec.inicio and ec.fin
                AND rs.fechaemision = COALESCE(e.fecha,f.fecha)
                AND cd.iddeposito = p.idestructura), 0)*/0 as saldocont,
                
                
                /*coalesce((SELECT sum(round(rs.saldomb,2)) 
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = m.iddocumento 
                INNER JOIN mod_contabilidad.dat_comprobante_documento cd on cd.iddocumento = dd.iddocumento
                inner join mod_contabilidad.res_centroelem_saldo rs on rs.idcomprobante = cd.idcomprobante
                --inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rs.idestructurae
                WHERE dd.fechacontable = COALESCE(e.fecha,f.fecha)
                AND m.idproducto = p.idproducto and rs.idcuenta = cc.idcuenta
                AND rs.fechaemision = dd.fechacontable
                AND dd.idestructuracomun = v.idestructura AND dd.cronologia > 0 ), 0) as saldocont,*/
                nat.idnaturaleza,cc.idcuenta, 
                coalesce(i.numeropieza,i.codigo) as codigo
                FROM mod_logistica.dat_producto p 
                inner join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = p.idumedida
                inner join mod_logistica.nom_clasificacioncontable cc on cc.idclasificacioncontable = p.idclasificacioncontable
                inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
                inner join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = p.idestructura
                INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = p.idestructura 
                left join mod_logistica.dat_estadoalmacen e on e.iddeposito = cf.iddeposito 
                left join mod_datosmaestros.dat_estructurasubsist sub on sub.idestructuracomun = p.idestructuracomun 
                        and sub.idsubsistema = 10
                inner join mod_datosmaestros.dat_fecha f on f.idestructurasubsist = sub.idestructurasubsist
                left join mod_logistica.his_cuadrediario h on h.iddeposito = p.idestructura
                left join mod_logistica.conf_general cg on cg.idestructura = p.idestructuracomun
				INNER JOIN mod_estructuracomp.v_dametodasestructuras es ON es.idestructura = cg.idestructura 
                WHERE p.cronologia > 0  --$addFiltro
                AND ( CASE WHEN p_idalmacen is not null THEN 
                	p.idestructura = p_idalmacen
                	else p.idestructuracomun = p_idestructuracomun END)
                and p.idclasificacioncontable = 
                        any(CAST(string_to_array(cf.clasificaciones, ',') as numeric[]))
                and ( CASE WHEN p_arrayclasifcontab is not null 
                	THEN p.idclasificacioncontable = ANY(cast(p_arrayclasifcontab as numeric[])) ELSE true END)
                and ( CASE WHEN p_arraynaturalezas is not null  
                	THEN i.idnaturaleza = any(cast(p_arraynaturalezas as numeric[])) ELSE true END)
                GROUP BY p.idestructura,h.saldofinal,p.idproducto,i.codigo,i.numeropieza,
                e.fecha,f.fecha,h.fechacierre,i.numeropieza,i.codigo,agrupador,
                es.direccion, es.telefono, es.fax, es.correo, cg.urllogo,nat.idnaturaleza,
                v.codigo,v.denominacion,v.idestructura,entidad,almacen,cc.idcuenta,
                i.denominacion, um.abreviaturaunidadmedida,cc.codigo,cc.denominacion,nat.denominacion --$addGroupBy
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
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.fn_cuadrediarioproductos (p_idalmacen numeric, p_agrupadopor numeric, p_saldos numeric, p_idestructuracomun numeric, p_arrayclasifcontab varchar, p_arraynaturalezas varchar, p_desde date, p_hasta date)
  OWNER TO zeolides;
  
DROP TABLE mod_logistica.his_cuadrediario_clasificacion;

CREATE SEQUENCE mod_logistica.sec_hisclasificacion_seq
INCREMENT 1 MINVALUE 1000000000
MAXVALUE 1099999999 START 1000000000
CACHE 1;

ALTER SEQUENCE mod_logistica.sec_hisclasificacion_seq RESTART WITH 1000000000;

COMMENT ON SEQUENCE mod_logistica.sec_hisclasificacion_seq
IS 'Secuencia empleada para autogenerar el identificador de la 
tabla his_clasificacion. ';

CREATE TABLE mod_logistica.his_cuadreclasificacion (
  idcuadreclasificacion NUMERIC(19,0) DEFAULT nextval('mod_logistica.sec_hisclasificacion_seq'::regclass) NOT NULL,
  iddeposito NUMERIC(19,0) NOT NULL,
  idclasificacioncontable NUMERIC(19,0) NOT NULL,
  idcuenta NUMERIC(19,0) NOT NULL,
  saldoinicial NUMERIC(25,2) DEFAULT 0 NOT NULL,
  saldofinal NUMERIC(25,2) DEFAULT 0 NOT NULL,
  saldocont NUMERIC(25,2) DEFAULT 0 NOT NULL,
  clasificacion VARCHAR(100) NOT NULL,
  cuenta VARCHAR(50) NOT NULL,
  CONSTRAINT his_cuadreclasificacion_pkey PRIMARY KEY(idcuadreclasificacion),
  CONSTRAINT his_cuadrediario_clasificacion_idx UNIQUE(idcuadreclasificacion, clasificacion),
  CONSTRAINT his_cuadreclasificacion_fk FOREIGN KEY (idclasificacioncontable)
    REFERENCES mod_logistica.nom_clasificacioncontable(idclasificacioncontable)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT his_cuadreclasificacion_fk1 FOREIGN KEY (iddeposito)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT his_cuadreclasificacion_fk2 FOREIGN KEY (idcuenta)
    REFERENCES mod_contabilidad.nom_cuenta(idcuenta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logistica.his_cuadreclasificacion
  ALTER COLUMN idcuadreclasificacion SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadreclasificacion
  ALTER COLUMN saldoinicial SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadreclasificacion
  ALTER COLUMN saldofinal SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadreclasificacion
  ALTER COLUMN saldocont SET STATISTICS 0;

COMMENT ON COLUMN mod_logistica.his_cuadreclasificacion.idcuadreclasificacion
IS 'Id del cuadre diario de almacen';

COMMENT ON COLUMN mod_logistica.his_cuadreclasificacion.saldoinicial
IS 'Saldo inicial: valor del saldo final del cierre anterior';

COMMENT ON COLUMN mod_logistica.his_cuadreclasificacion.saldofinal
IS 'saldo final: es la sumatoria de los saldos de cada movimiento del dia por clasificación contable.';

COMMENT ON COLUMN mod_logistica.his_cuadreclasificacion.saldocont
IS 'saldo contable: valor de la cuenta contable de la clasificación en la contabilidad';

ALTER TABLE mod_logistica.his_cuadreclasificacion
  OWNER TO zeolides;
  
CREATE SEQUENCE mod_logistica.sec_hiscuadreresumen_seq
INCREMENT 1 MINVALUE 1000000000
MAXVALUE 1099999999 START 1000000000
CACHE 1;

ALTER SEQUENCE mod_logistica.sec_hiscuadreresumen_seq RESTART WITH 1000000000;

COMMENT ON SEQUENCE mod_logistica.sec_hiscuadreresumen_seq
IS 'Secuencia empleada para autogenerar el identificador de la 
tabla his_cuadreresumen.';

drop table mod_logistica.his_cuadreresumen;

CREATE TABLE mod_logistica.his_cuadreresumen (
  idcuadreresumen NUMERIC(19,0) DEFAULT nextval('mod_logistica.sec_hiscuadreresumen_seq'::regclass) NOT NULL,
  iddeposito NUMERIC(19,0) NOT NULL,
  idclasificacioncontable NUMERIC(19,0) NOT NULL,
  idcuadreclasificacion NUMERIC(19,0),
  tipodocumento VARCHAR(100) NOT NULL,
  importe NUMERIC(25,2) DEFAULT 0 NOT NULL,
  estado NUMERIC(1,0) NOT NULL,
  signo VARCHAR(1) NOT NULL,
  iddoc NUMERIC(19,0) NOT NULL,
  CONSTRAINT his_cuadreresumen_pkey PRIMARY KEY(idcuadreresumen),
  CONSTRAINT his_cuadreresumen_fk FOREIGN KEY (idcuadreclasificacion)
    REFERENCES mod_logistica.his_cuadreclasificacion(idcuadreclasificacion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT his_cuadreresumen_fk1 FOREIGN KEY (idclasificacioncontable)
    REFERENCES mod_logistica.nom_clasificacioncontable(idclasificacioncontable)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT his_cuadreresumen_fk2 FOREIGN KEY (iddeposito)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logistica.his_cuadreresumen
  OWNER TO zeolides;
  
CREATE INDEX dat_comprobante_documento_idx1 ON mod_contabilidad.dat_comprobante_documento
  USING btree (iddeposito);
  
  
CREATE INDEX conf_depositocuadrediario_idx ON mod_logdistribucion.conf_depositocuadrediario
  USING btree (iddeposito);
  
ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  ADD COLUMN idconfdeposito NUMERIC(19,0) NOT NULL UNIQUE;
  
CREATE SEQUENCE mod_logdistribucion.sec_confdepositocuadrediario_seq
INCREMENT 1 MINVALUE 1000000000
MAXVALUE 1099999999 START 1000000000
CACHE 1;

ALTER SEQUENCE mod_logdistribucion.sec_confdepositocuadrediario_seq RESTART WITH 1000000000;

COMMENT ON SEQUENCE mod_logdistribucion.sec_confdepositocuadrediario_seq
IS 'Secuencia empleada para autogenerar el identificador de la 
tabla conf_depositocuadrediario.';

ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  ALTER COLUMN idconfdeposito SET DEFAULT nextval('mod_logdistribucion.sec_confdepositocuadrediario_seq'::regclass);
  
ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  DROP CONSTRAINT conf_depositocuadrediario_pkey RESTRICT;
  
ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  DROP CONSTRAINT conf_depositocuadrediario_idconfdeposito_key RESTRICT;

ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  ADD PRIMARY KEY (idconfdeposito);


ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  DROP COLUMN clasificaciones;
  
ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  ADD COLUMN idclasificacioncontable NUMERIC(19,0) NOT NULL;
  
  

ALTER TABLE mod_logistica.his_cuadreclasificacion
  DROP CONSTRAINT his_cuadrediario_clasificacion_idx RESTRICT;
  
CREATE INDEX his_cuadreclasificacion_idx ON mod_logistica.his_cuadreclasificacion
  USING btree (iddeposito);
  
CREATE INDEX his_cuadreclasificacion_idx2 ON mod_logistica.his_cuadreclasificacion
  USING btree (idclasificacioncontable);

ALTER TABLE mod_logistica.his_cuadreresumen
  ADD COLUMN iddoc NUMERIC(19,0) NOT NULL;
  
DROP FUNCTION mod_loginventario.fn_cuadrediario_apertura();

CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediario_apertura (
  f_inicio date,
  f_fin date
)
RETURNS void AS
$body$
DECLARE
	v_result record;
BEGIN
  delete from mod_logistica.his_cuadreclasificacion;

INSERT INTO 
  mod_logistica.his_cuadreclasificacion
(
  iddeposito,
  idclasificacioncontable,
  idcuenta,
  saldoinicial,
  saldofinal,
  clasificacion,
  cuenta
)
select distinct cf.iddeposito, cc.idclasificacioncontable,cc.idcuenta,0 as saldoinicial,
	round(
		coalesce((
             SELECT sum(ddp.cantidad * ddp.precio)
                FROM mod_logistica.dat_producto ddp
                where ddp.idestructura = cf.iddeposito
                and ddp.idclasificacioncontable = cc.idclasificacioncontable
  				--any(CAST(string_to_array(cf.clasificaciones, ',') as numeric[]))
        ),0) ,2)
        as saldoinv,
	cc.denominacion as clasificacion,nc.concatcta as cuenta

  FROM mod_logdistribucion.conf_depositocuadrediario cf,-- mod_logistica.dat_producto p,
  mod_logistica.nom_clasificacioncontable cc, mod_contabilidad.nom_cuenta nc
  where cc.idclasificacioncontable = cf.idclasificacioncontable --and p.idestructura = cf.iddeposito
  and cf.iddeposito not in (select h.iddeposito from mod_logistica.his_cuadrediario h 
  					where h.iddeposito = cf.iddeposito and h.apertura = 1)
  and nc.idcuenta = cc.idcuenta
  group by cf.iddeposito, cc.idclasificacioncontable,cc.denominacion,nc.concatcta,cc.idcuenta
  order by cf.iddeposito,cc.idclasificacioncontable;
  
UPDATE 
  mod_logistica.his_cuadreclasificacion hc
SET 
  saldocont = q.saldocont
from (
	SELECT rs.idcuenta,sum(rs.saldomb) as saldocont,cp.iddeposito,cc.idclasificacioncontable,cf.idcuadreclasificacion  --cf.iddeposito
from mod_contabilidad.res_centroelem_saldo rs
inner join mod_contabilidad.dat_comprobante_documento cp on cp.idcomprobante = rs.idcomprobante
inner join mod_logistica.his_cuadreclasificacion cf on cf.iddeposito = cp.iddeposito
inner join mod_logistica.nom_clasificacioncontable cc on cc.idclasificacioncontable = cf.idclasificacioncontable
	and cc.idcuenta = rs.idcuenta
where rs.fechaemision between f_inicio and f_fin
group by rs.idcuenta,cp.iddeposito,cc.idclasificacioncontable,cf.idcuadreclasificacion
) q
WHERE 
  hc.idcuadreclasificacion = q.idcuadreclasificacion;
  
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
  mod_logistica.dat_movimiento m,mod_logistica.dat_documento d/*,
  mod_datosmaestros.dat_documentoprim dp, mod_datosmaestros.nom_docprim nd,
  mod_logistica.nom_clasificacioncontable cc, mod_contabilidad.nom_cuenta nc, 
  mod_datosmaestros.dat_estructurasubsist sub, mod_datosmaestros.dat_fecha f,
  mod_datosmaestros.dat_cierre c, mod_datosmaestros.dat_ejerciciocontable ec,
  mod_contabilidad.dat_estructurae ee*/
  where p.cronologia > 0 and cf.idclasificacioncontable = p.idclasificacioncontable
  and cf.iddeposito = p.idestructura  
  and m.idproducto = p.idproducto
  and m.iddocumento = d.iddocumento 
  and d.fechacontable between f_inicio and f_fin
  and d.cronologia > 0 and d.estado in (4,7) --and nd.abreviatura <> 'cambioccontableLog'
  /*
  and nc.idcuenta = cc.idcuenta
  and m.iddocumento = d.iddocumento 
  and dp.iddoc = d.iddoc
  and nd.iddocumentos = dp.iddocumentos
  and sub.idestructuracomun = p.idestructuracomun 
  		and sub.idsubsistema = 10
  and f.idestructurasubsist = sub.idestructurasubsist
  and c.idestructurasubsist = sub.idestructurasubsist
  and ec.idejercicio = c.idejercicioactual
  and ee.idestructuracomun =  p.idestructuracomun */
  group by cf.iddeposito,d.iddoc,d.estado,m.signo,p.idclasificacioncontable,cf.idcuadreclasificacion;

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.fn_cuadrediario_apertura (f_inicio date, f_fin date)
  OWNER TO zeolides;

--------------------------------------------
ALTER TABLE mod_logistica.his_cuadreclasificacion
 ADD COLUMN idcierrediario NUMERIC(19,0) NOT NULL;
  
ALTER TABLE mod_logistica.his_cuadreclasificacion
  ADD CONSTRAINT his_cuadreclasificacion_fk3 FOREIGN KEY (idcierrediario)
    REFERENCES mod_logistica.his_cuadrediario(idcierrediario)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logistica.his_cuadrediario
  RENAME COLUMN saldocontable TO saldocont;

CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediario_apertura (
  f_inicio date,
  f_fin date
)
RETURNS void AS
$body$
DECLARE
	v_result record;
BEGIN
  delete from mod_logistica.his_cuadrediario;

INSERT INTO 
  mod_logistica.his_cuadrediario
(
  iddeposito,
  estado,
  fechacierre,
  contador,
  apertura
)
select distinct cf.iddeposito, 1,now(),1,1
  FROM mod_logdistribucion.conf_depositocuadrediario cf
  where cf.iddeposito not in (select h.iddeposito from mod_logistica.his_cuadrediario h 
  					where h.iddeposito = cf.iddeposito and h.apertura = 1);
                        
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
  idcierrediario
)
select distinct cf.iddeposito, cc.idclasificacioncontable,cc.idcuenta,0 as saldoinicial,
	round(
		coalesce((
             SELECT sum(ddp.cantidad * ddp.precio)
                FROM mod_logistica.dat_producto ddp
                where ddp.idestructura = cf.iddeposito
                and ddp.idclasificacioncontable = cc.idclasificacioncontable
  				--any(CAST(string_to_array(cf.clasificaciones, ',') as numeric[]))
        ),0) ,2)
        as saldoinv,
	cc.denominacion as clasificacion,nc.concatcta as cuenta,cd.idcierrediario

  FROM mod_logdistribucion.conf_depositocuadrediario cf,-- mod_logistica.dat_producto p,
  mod_logistica.nom_clasificacioncontable cc, mod_contabilidad.nom_cuenta nc,
  mod_logistica.his_cuadrediario cd
  where cc.idclasificacioncontable = cf.idclasificacioncontable --and p.idestructura = cf.iddeposito
  and cd.iddeposito = cf.iddeposito and cd.apertura = 1
  and nc.idcuenta = cc.idcuenta
  
  group by cf.iddeposito, cc.idclasificacioncontable,cc.denominacion,nc.concatcta,cc.idcuenta,cd.idcierrediario
  order by cf.iddeposito,cc.idclasificacioncontable;
  
UPDATE 
  mod_logistica.his_cuadreclasificacion hc
SET 
  saldocont = q.saldocont
from (
	SELECT rs.idcuenta,sum(rs.saldomb) as saldocont,cp.iddeposito,cc.idclasificacioncontable,cf.idcuadreclasificacion  --cf.iddeposito
from mod_contabilidad.res_centroelem_saldo rs
inner join mod_contabilidad.dat_comprobante_documento cp on cp.idcomprobante = rs.idcomprobante
inner join mod_logistica.his_cuadreclasificacion cf on cf.iddeposito = cp.iddeposito
inner join mod_logistica.nom_clasificacioncontable cc on cc.idclasificacioncontable = cf.idclasificacioncontable
	and cc.idcuenta = rs.idcuenta
where rs.fechaemision between f_inicio and f_fin
group by rs.idcuenta,cp.iddeposito,cc.idclasificacioncontable,cf.idcuadreclasificacion
) q
WHERE 
  hc.idcuadreclasificacion = q.idcuadreclasificacion;

UPDATE 
  mod_logistica.his_cuadrediario cd
SET 
  saldoinicial = d.saldoinicial,
  saldofinal = d.saldofinal,
  saldocont = d.saldocont
from (select distinct h.idcierrediario, sum(c.saldoinicial) as saldoinicial,
sum(c.saldofinal) as saldofinal, sum(c.saldocont) as saldocont
  FROM mod_logistica.his_cuadrediario h
  inner join mod_logistica.his_cuadreclasificacion c on c.idcierrediario = h.idcierrediario
  where h.apertura = 1
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
  mod_logistica.dat_movimiento m,mod_logistica.dat_documento d
  where p.cronologia > 0 and cf.idclasificacioncontable = p.idclasificacioncontable
  and cf.iddeposito = p.idestructura  
  and m.idproducto = p.idproducto
  and m.iddocumento = d.iddocumento 
  and d.fechacontable BETWEEN f_inicio and f_fin
  and d.cronologia > 0 and d.estado in (4,7)
  group by cf.iddeposito,d.iddoc,d.estado,m.signo,p.idclasificacioncontable,cf.idcuadreclasificacion;

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;


ALTER TABLE mod_logfacturacion.conf_pagoelectronico
  DROP CONSTRAINT conf_pagoelectronico_pkey RESTRICT;
  
CREATE INDEX conf_pagoelectronico_idx ON mod_logfacturacion.conf_pagoelectronico
  USING btree (idestructura);

  
ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  ADD COLUMN idestructura NUMERIC(19,0) DEFAULT 0 NOT NULL;
  
ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  ALTER COLUMN idestructura DROP DEFAULT;
  
ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  ADD COLUMN idcuenta NUMERIC(19,0);
  
CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediario_apertura (
  f_inicio date,
  f_fin date,
  p_estado numeric = 0,
  p_isapertura numeric = 0,
  p_iddeposito numeric = NULL::numeric,
  p_idcierrediario numeric = NULL::numeric
)
RETURNS void AS
$body$
DECLARE
	v_result record;
	v_idcierrediario numeric;
    
BEGIN
	/*if p_isapertura = 1 then 
          delete from mod_logistica.his_cuadrediario;
    end if;*/
    
    if p_idcierrediario is null then
        delete from mod_logistica.his_cuadrediario where iddeposito = p_iddeposito
        and fechacierre = f_fin;
    else
        delete from mod_logistica.his_cuadreclasificacion where idcierrediario = p_idcierrediario;
        update mod_logistica.his_cuadrediario 
        set estado = p_estado,
            contador = contador +1,
            fechacierre = f_fin
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
    apertura
  )
  select distinct cf.iddeposito, p_estado,f_fin,1,p_isapertura
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
  idcierrediario
)
select distinct cf.iddeposito, cc.idclasificacioncontable,cf.idcuenta,0 as saldoinicial,
	round(
		coalesce((
             SELECT sum(ddp.cantidad * ddp.precio)
                FROM mod_logistica.dat_producto ddp
                where ddp.idestructura = cf.iddeposito
                and ddp.idclasificacioncontable = cc.idclasificacioncontable
  				--any(CAST(string_to_array(cf.clasificaciones, ',') as numeric[]))
        ),0) ,2)
        as saldoinv,
	cc.denominacion as clasificacion,nc.concatcta as cuenta,cd.idcierrediario
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
 
UPDATE 
  mod_logistica.his_cuadreclasificacion hc
SET 
  saldocont = q.saldocont
from (
	SELECT rs.idcuenta,cp.iddeposito,cf.idclasificacioncontable,cf.idcuadreclasificacion,sum(rs.saldomb) as saldocont  --cf.iddeposito
from mod_logistica.his_cuadreclasificacion cf
inner join mod_contabilidad.dat_comprobante_documento cp on cp.iddeposito = cf.iddeposito
inner join mod_contabilidad.res_centroelem_saldo rs on cp.idcomprobante = rs.idcomprobante and cf.idcuenta = rs.idcuenta
--inner join mod_logistica.nom_clasificacioncontable cc on rs.idcuenta = cc.idcuenta
where 
  case when p_iddeposito is null then rs.fechaemision between f_inicio and f_fin
  	else rs.fechaemision = f_fin end
    --and cc.idcuenta = rs.idcuenta
--and cf.idclasificacioncontable = cc.idclasificacioncontable and cf.idcuenta = rs.idcuenta
group by rs.idcuenta,cp.iddeposito,cf.idclasificacioncontable,cf.idcuadreclasificacion
) q
WHERE 
  hc.idcuadreclasificacion = q.idcuadreclasificacion;

UPDATE 
  mod_logistica.his_cuadrediario cd
SET 
  saldoinicial = d.saldoinicial,
  saldofinal = d.saldofinal,
  saldocont = d.saldocont
from (select distinct h.idcierrediario, sum(c.saldoinicial) as saldoinicial,
sum(c.saldofinal) as saldofinal, sum(c.saldocont) as saldocont
  FROM mod_logistica.his_cuadrediario h
  inner join mod_logistica.his_cuadreclasificacion c on c.idcierrediario = h.idcierrediario
  where h.fechacierre = f_fin --h.apertura = 1
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
  mod_logistica.dat_movimiento m,mod_logistica.dat_documento d
  where p.cronologia > 0 and cf.idclasificacioncontable = p.idclasificacioncontable
  and cf.iddeposito = p.idestructura  
  and m.idproducto = p.idproducto
  and m.iddocumento = d.iddocumento 
  and case when p_iddeposito is null then d.fechacontable BETWEEN f_inicio and f_fin 
  	else d.fechacontable = f_fin end  
  and d.cronologia > 0 and d.estado in (4,7)
  group by cf.iddeposito,d.iddoc,d.estado,m.signo,p.idclasificacioncontable,cf.idcuadreclasificacion;
  
if p_isapertura = 1 then
	INSERT INTO 
      mod_logistica.dat_estadoalmacen
    (
      iddeposito,
      estado,
      fechaapertura,
      fecha
    )
    select cf.iddeposito, 1, f_fin,(f_fin + interval '1 day')  from mod_logdistribucion.conf_depositocuadrediario cf
    where cf.iddeposito not in (select e.iddeposito from mod_logistica.dat_estadoalmacen e where e.iddeposito = cf.iddeposito);
    
    UPDATE 
      mod_logistica.dat_estadoalmacen st
    SET 
      fecha = (f_fin + interval '1 day')
    from (select cf.iddeposito  from mod_logdistribucion.conf_depositocuadrediario cf
    inner join mod_logistica.dat_estadoalmacen e on e.iddeposito = cf.iddeposito
    )q
    WHERE 
      q.iddeposito = st.iddeposito
    ;

end if;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.fn_cuadrediario_apertura (f_inicio date, f_fin date, p_estado numeric, p_isapertura numeric, p_iddeposito numeric, p_idcierrediario numeric)
  OWNER TO zeolides;
  
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
          0 as saldocont,nat.idnaturaleza,hc.idcuenta, 
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
          i.denominacion, um.abreviaturaunidadmedida,nat.denominacion,hc.clasificacion --$addGroupBy
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
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.fn_cuadrediarioproductos (p_idalmacen numeric, p_agrupadopor numeric, p_idcierrediario numeric, p_saldos numeric, p_idestructuracomun numeric, p_arrayclasifcontab varchar, p_arraynaturalezas varchar, p_desde date, p_hasta date)
  OWNER TO zeolides;
  
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
            0,0,now(), q.iddeposito, round(sum(q.importefinal) - sum(q.importeinv),2) as diferencia,count(q.idproducto) as items
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
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.fn_cuadrediariomov (p_idalmacen numeric, p_agrupadopor numeric, p_idcierrediario numeric, p_tiporeporte numeric, p_idestructuracomun numeric, p_arrayclasifcontab varchar, p_arraynaturalezas varchar, p_estado numeric)
  OWNER TO zeolides;