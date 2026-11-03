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
  diferencia NUMERIC(25,2)
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
  iddeposito NUMERIC(19,0)
);

ALTER TYPE mod_loginventario.td_cuadrediarioproductos
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediarioproductos (
  p_idalmacen numeric,
  p_agrupadopor numeric,
  p_saldos numeric = 0,
  p_idestructuracomun numeric = 0
)
RETURNS SETOF mod_loginventario.td_cuadrediarioproductos AS
$body$
DECLARE
  v_result mod_loginventario.td_cuadrediarioproductos;
BEGIN
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
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
                AND m.idproducto = p.idproducto
                AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0  and m.signo = '+'), 0) as recepcion,
                coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6)) 
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
                INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
                --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
                WHERE np.abreviatura IN ('valedev') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
                AND m.idproducto = p.idproducto
                AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0  and m.signo = '+'), 0)+
                coalesce(round((SELECT sum(case when p_saldos = 1 then m.importecontable else m.cantidad end) 
                FROM mod_logistica.dat_movimiento m INNER
                JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
                INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
                WHERE np.abreviatura IN ('facturaLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
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
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
                AND m.idproducto = p.idproducto
                AND d.estado = 7 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0 ), 0) as valedev,
                coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6)) 
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
                INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
                --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
                WHERE np.abreviatura IN ('ajusteLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
                AND m.idproducto = p.idproducto
                AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0 and m.signo = '+'), 0) as ajustent,
                coalesce(round((SELECT sum(case when p_saldos = 1 then m.importecontable else m.cantidad end) 
                FROM mod_logistica.dat_movimiento m INNER
                JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc 
                INNER join mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
                WHERE np.abreviatura IN ('facturaLog','compventaLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
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
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
                AND m.idproducto = p.idproducto
                AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0  and m.signo = '-'), 0) as ajustesal, 
                coalesce((SELECT sum(round(case when p_saldos = 1 then m.importecontable else m.cantidad end,6))
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
                INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
                --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
                WHERE np.abreviatura IN ('valeLog', 'transferenciaLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
                AND m.idproducto = p.idproducto
                AND d.estado = 4 /*AND v.idestructura = d.idestructuracomun*/ AND d.cronologia > 0 ), 0) AS salidacosto,
                coalesce((SELECT sum(round(m.cantidad,6)) 
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc 
                INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos 
                --inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto AND p.idestructura = p_idalmacen
                WHERE np.abreviatura IN ('recepcionLog') --AND dp.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
                AND d.fechacontable = COALESCE(e.fecha,f.fecha)
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
                ),0)  as importefinal,
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
                        --AND p.idestructura = ANY (CAST(p_idestructuraop as NUMERIC[])) 
                GROUP BY p.idestructura,h.saldofinal,p.idproducto,i.codigo,i.numeropieza,
                e.fecha,f.fecha,h.fechacierre,i.numeropieza,i.codigo,agrupador,
                es.direccion, es.telefono, es.fax, es.correo, cg.urllogo,
                v.codigo,v.denominacion,v.idestructura,entidad,almacen,
                i.denominacion, um.abreviaturaunidadmedida,cc.codigo,cc.denominacion,nat.denominacion --$addGroupBy
            ORDER BY agrupador
    )loop
    	return next v_result;
    end loop;
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.fn_cuadrediarioproductos (p_idalmacen numeric, p_agrupadopor numeric, p_saldos numeric, p_idestructuracomun numeric)
  OWNER TO postgres;
  
CREATE OR REPLACE FUNCTION mod_loginventario.fn_cuadrediariomov (
  p_idalmacen numeric,
  p_agrupadopor numeric,
  p_tiporeporte numeric = 0,
  p_idestructuracomun numeric = 0
)
RETURNS SETOF mod_loginventario.td_cuadrediario AS
$body$
DECLARE
  v_result mod_loginventario.td_cuadrediario;
BEGIN
    if p_tiporeporte = 0 then 
      for v_result in (
            select DISTINCT v.codigo||' - '||v.denominacion as almacen,
            sum(q.recepcion) as recepcion, sum(q.valedev) as valedev, sum(q.ajusteent) as ajusteent, sum(ventas) as ventas,
            sum(q.ajustesal) as ajustesal, sum(q.salidacosto) as salidacosto, sum(q.devrecep) as devrecep,
            sum(q.importeinicial) as importeinicial,sum(q.importeinv) as importefinal,q.fechaactual, q.fechaultcierre,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,upper(q.agrupador) as agrupador,0,0,0,now(),
            q.iddeposito,q.saldoinicial
            from (
                select * from mod_loginventario.fn_cuadrediarioproductos(p_idalmacen,p_agrupadopor, 1, p_idestructuracomun)
                ) q
            INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = q.idestructura 
            INNER JOIN mod_estructuracomp.v_dametodasestructuras es ON es.idestructura = q.idestructuracomun
            left join mod_logistica.conf_general cg on cg.idestructura = es.idestructura
            GROUP by q.agrupador,v.codigo,v.denominacion,q.fechaactual, q.fechaultcierre,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,q.iddeposito,q.saldoinicial
            ORDER BY agrupador
      )loop
      		v_result.saldomov = round(v_result.recepcion+v_result.valedev+v_result.ajusteent-
            	v_result.ventas-v_result.salidacosto-v_result.devrecep-v_result.ajustesal,2);
            v_result.proxfecha = cast(v_result.fechaactual as date)+cast('1 days' as interval);
            v_result.saldoinv = v_result.importefinal;
            v_result.diferencia = round(v_result.saldomov - v_result.saldocont,2);
          return next v_result;
      end loop;
    else if p_tiporeporte = 1 then
      for v_result in (            
            select DISTINCT v.codigo||' - '||v.denominacion as almacen,
            sum(q.recepcion) as recepcion, sum(q.valedev) as valedev, sum(q.ajusteent) as ajusteent, sum(ventas) as ventas,
            sum(q.ajustesal) as ajustesal, sum(q.salidacosto) as salidacosto, sum(q.devrecep) as devrecep,
            sum(q.importeinicial) as importeinicial,sum(q.importeinv) as importefinal,q.fechaactual, q.fechaultcierre,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,upper(q.agrupador) as agrupador,0,0,0,now(),
            q.iddeposito,q.saldoinicial
            from (
                select * from mod_loginventario.fn_cuadrediarioproductos(p_idalmacen,p_agrupadopor, 1, p_idestructuracomun)
                ) q
            INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = q.idestructura 
            INNER JOIN mod_estructuracomp.v_dametodasestructuras es ON es.idestructura = q.idestructuracomun
            left join mod_logistica.conf_general cg on cg.idestructura = es.idestructura
            GROUP by q.agrupador,v.codigo,v.denominacion,q.fechaactual, q.fechaultcierre,
            q.direccion, q.telefono, q.fax, q.correo, q.entidad, q.logo,q.iddeposito,q.saldoinicial
            ORDER BY agrupador
      )loop
      		v_result.saldomov = round(v_result.recepcion+v_result.valedev+v_result.ajusteent-
            	v_result.ventas-v_result.salidacosto-v_result.devrecep-v_result.ajustesal,2);
            v_result.proxfecha = cast(v_result.fechaactual as date)+cast('1 days' as interval);
            v_result.saldoinv = v_result.importefinal;
            v_result.diferencia = round(v_result.saldomov - v_result.saldocont,2);
            
          return next v_result;
      end loop;
    	
    	end if;
    end if;
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.fn_cuadrediariomov (p_idalmacen numeric, p_agrupadopor numeric, p_tiporeporte numeric, p_idestructuracomun numeric)
  OWNER TO zeolides;