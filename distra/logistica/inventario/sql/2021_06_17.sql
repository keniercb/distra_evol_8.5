CREATE OR REPLACE FUNCTION mod_datosmaestros.f_actualizarpreciosbyparams (
  p_idindicador numeric,
  p_iddocumento numeric,
  p_idnaturaleza numeric
)
RETURNS void AS
$body$
declare
v_rec record;
v_recAux record;
v_precio numeric = 0;
v_precioalt numeric = 0;
begin
for v_rec in
SELECT dp.idindicador, sum(dp.cantidad) as cant, sum(coalesce(dp.importe,0)) as imp, sum(coalesce(dp.importealternativo,0)) as impalt
  FROM mod_logistica.dat_producto dp
  INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
WHERE dp.esbaja = 0 AND dp.cantidad is not null
	  AND (CASE WHEN p_idindicador IS NOT NULL THEN dp.idindicador = p_idindicador ELSE TRUE END)
      AND (CASE WHEN p_iddocumento IS NOT NULL THEN dp.idindicador IN (
      	SELECT dp1.idindicador FROM mod_logistica.dat_producto dp1
        INNER JOIN mod_logistica.dat_movimiento mov on mov.idproducto = dp1.idproducto
        WHERE mov.iddocumento = p_iddocumento
      ) ELSE TRUE END)
   	  AND (CASE WHEN p_idnaturaleza IS NOT NULL THEN ni.idnaturaleza = p_idnaturaleza ELSE TRUE END)
  group by dp.idindicador
  having (sum(dp.cantidad) > 0)
loop

v_precio := v_rec.imp / v_rec.cant;
v_precioalt := v_rec.impalt / v_rec.cant;
UPDATE mod_datosmaestros.nom_indicador SET precio=v_precio, precioalternativo=v_precioalt WHERE idindicador=v_rec.idindicador;
end loop;
--CALCULAR PRECIO DE COSTO SEGUN HISTORICO CUANDO NO HAY EXISTENCIA
/*for v_rec in
SELECT idindicador
  FROM mod_logistica.dat_producto
  inner join mod_datosmaestros.nom_indicador ni using(idindicador)
WHERE esbaja = 0 --and (ni.precio is null or ni.precio = 0) and (ni.precioalternativo is null or ni.precioalternativo = 0)
  group by idindicador
  having (sum(coalesce(cantidad,0)) = 0)
loop
  v_precio := 0;
  v_precioalt := 0;
  for v_recAux in select DISTINCT dm.idproducto, dp.idindicador, 
  coalesce(dm.preciocontable,0) as precio, 
  coalesce(dm.precioalternativo,0) as precioalt,
  count(*) OVER() as total
   from mod_logistica.dat_movimiento dm
	inner join mod_logistica.dat_producto dp using(idproducto)
    where dp.idindicador =  v_rec.idindicador and dm.cronologia = (
    select max(mov.cronologia) from mod_logistica.dat_movimiento mov
    where mov.idproducto = dm.idproducto and (mov.preciocontable > 0 or mov.precioalternativo > 0)
    )
   LOOP
   	v_precio := v_precio + v_recAux.precio;
	v_precioalt := v_precioalt + v_recAux.precioalt;
   end loop;
   UPDATE mod_datosmaestros.nom_indicador SET precio=v_precio/v_recAux.total, precioalternativo=v_precioalt/v_recAux.total WHERE idindicador=v_rec.idindicador;
end loop;*/
end
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 500;

ALTER FUNCTION mod_datosmaestros.f_actualizarpreciosbyparams (p_idindicador numeric, p_iddocumento numeric, p_idnaturaleza numeric)
  OWNER TO zeolides;