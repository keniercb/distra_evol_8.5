 -- object recreation
DROP FUNCTION mod_loginventario.f_recvalordeposito(p_idestructuraop varchar, p_idestructuracomun numeric, p_idsubsistema numeric, p_iddocs varchar, p_fechafin varchar);

CREATE FUNCTION mod_loginventario.f_recvalordeposito (
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
SELECT DISTINCT
e.idestructuraop AS iddeposito, 
(btrim(concat(e.codigo,'-',e.denominacion),'-')) AS deposito,  
coalesce(
(
  SELECT sum(round(vdm.importecontable,2)) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('aperturaLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))  
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
  and vdm.idestructuracomun = e.idestructuraop
), 0) AS apertura, 
coalesce(
(
  SELECT sum(round(vdm.importealternativo,2)) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('aperturaLog')  
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
  and vdm.idestructuracomun = e.idestructuraop
), 0) AS aperturaalt, 
coalesce(
(
  SELECT sum(round(vdm.importecontable,2)) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('recepcionLog', 'valedev')
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))  
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
  and vdm.idestructuracomun = e.idestructuraop
  AND vdm.signo = '+'
), 0) AS compras, 
coalesce(
(
  SELECT sum(round(vdm.importealternativo,2)) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('recepcionLog', 'valedev')
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
   and vdm.idestructuracomun = e.idestructuraop
), 0) AS comprasalt, 

coalesce(round(
(
  SELECT sum(vdm.importecontable) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  INNER JOIN mod_logistica.dat_producto pp ON pp.idproducto = vdm.idproducto
   WHERE vdm.abreviatura IN ('facturaLog','compventaLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))  
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
   and pp.idestructura = e.idestructuraop
 ), 2), 0) -
 coalesce(round(
 (
   SELECT sum(vdm.importecontable) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  INNER JOIN mod_logistica.dat_producto pp ON pp.idproducto = vdm.idproducto
   WHERE vdm.abreviatura IN ('compdevLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))  
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null) 
   and pp.idestructura = e.idestructuraop
 ), 2), 0) AS ventas, 
  
 coalesce(round(
 (
   SELECT sum(vdm.importealternativo) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  INNER JOIN mod_logistica.dat_producto pp ON pp.idproducto = vdm.idproducto 
   WHERE vdm.abreviatura IN ('facturaLog','compventaLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
   and pp.idestructura = e.idestructuraop
 ), 2), 0) - 
coalesce(round(
  (
  SELECT sum(vdm.importealternativo)    
  FROM mod_loginventario.v_documento_movimiento vdm 
  INNER JOIN mod_logistica.dat_producto pp ON pp.idproducto = vdm.idproducto 
  WHERE vdm.abreviatura IN ('compdevLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null) 
   and pp.idestructura = e.idestructuraop
 ), 2), 0)  AS ventasalt,
 
coalesce(
(
  SELECT sum(round(vdm.importecontable,2))   
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('valeLog', 'transferenciaLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
  and vdm.idestructuracomun = e.idestructuraop
), 0) AS gastos, 
coalesce(
(
SELECT sum(round(vdm.importealternativo,2)) 
FROM mod_loginventario.v_documento_movimiento vdm 
WHERE vdm.abreviatura IN ('valeLog', 'transferenciaLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null) 
 and vdm.idestructuracomun = e.idestructuraop
), 0) AS gastosalt, 

(coalesce(
(
  SELECT sum(round(vdm.importecontable,2)) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('ajusteLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))  
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
   and vdm.idestructuracomun = e.idestructuraop
  and vdm.signo = '+'
), 0) - 
coalesce(
(
  SELECT sum(round(vdm.importecontable,2)) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('ajusteLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[])) 
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
   and vdm.idestructuracomun = e.idestructuraop
   and vdm.signo = '-'
), 0)) AS ajustes, 
(coalesce(
(
  SELECT sum(round(vdm.importealternativo,2)) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('ajusteLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null) 
  and vdm.idestructuracomun = e.idestructuraop
     and vdm.signo = '+'
), 0) - 
coalesce(
(
  SELECT sum(round(vdm.importealternativo,2)) 
  FROM mod_loginventario.v_documento_movimiento vdm 
  WHERE vdm.abreviatura IN ('ajusteLog') 
  AND vdm.iddoc = ANY(CAST(p_iddocs as NUMERIC[]))  
  AND (vdm.fechacontable <= p_fechafin OR p_fechafin is null)
   and vdm.idestructuracomun = e.idestructuraop
   and vdm.signo = '-'
), 0)
) AS ajustesalt, 
coalesce((
   SELECT sum(ddp.cantidad * ddp.precio)
   FROM mod_logistica.dat_producto ddp
   WHERE e.idestructuraop = ddp.idestructura
),0) AS importe, 
coalesce((
   SELECT sum(ddp.cantidad * ddp.precioalternativo)
   FROM mod_logistica.dat_producto ddp
   WHERE e.idestructuraop = ddp.idestructura
),0) AS importealt,

(select e.denominacion from mod_estructuracomp.v_dametodasestructuras e where e.idestructura = p_idestructuracomun) as entida,
(select ii.urllogo from mod_logistica.conf_general ii where ii.idestructura = p_idestructuracomun) as urllogo,
(coalesce(
        (SELECT sum(mm.importecontable) 
        FROM mod_loginventario.v_documento_movimiento mm 
        INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto        
        WHERE mm.abreviatura = 'revaluacionLog' AND dp.idestructura = e.idestructuraop AND mm.signo = '+' )
    , 0) - 
    coalesce(
        (SELECT sum(mm.importecontable) 
        FROM mod_loginventario.v_documento_movimiento mm 
        INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto
        WHERE mm.abreviatura = 'revaluacionLog' AND dp.idestructura = e.idestructuraop AND mm.signo = '-' )
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
                    ORDER BY mm1.cronologia DESC
                )
                FROM mod_loginventario.v_documento_movimiento mm 
                INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto  
                WHERE mm.abreviatura = 'revaluacionLog' AND dp.idestructura = e.idestructuraop 
            ) 
        )
    , 0)
) AS reevaluacion
FROM mod_logistica.dat_producto p 
INNER JOIN mod_estructuracomp.dat_estructuraop e ON e.idestructuraop = p.idestructura
WHERE p.cronologia > 0 AND p.idestructuracomun = p_idestructuracomun 
AND p.idestructura = ANY (CAST(p_idestructuraop as NUMERIC[]))
GROUP BY e.denominacion, e.idestructuraop,e.codigo 
ORDER BY deposito
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;