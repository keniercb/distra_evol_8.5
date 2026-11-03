CREATE OR REPLACE FUNCTION mod_logtaller.f_balancecuadreprocesotall (
  p_idestructura numeric,
  p_fecha date
)
RETURNS SETOF mod_logtaller.td_balancecuadreproceso AS
$body$
DECLARE
  v_result mod_logtaller.td_balancecuadreproceso;
  v_fecha date;
  v_recejercicio record;
BEGIN
   if p_fecha is not null THEN
	v_fecha := p_fecha;
   ELSE
    v_fecha := now();
   END if;
 	for v_result in (
		with sbqQuery as (SELECT sbq.idcuenta,
               sbq.cuenta,
               sbq.saldo,
               sbq.valor,
               sbq.fechacontable
               from (
                      select ncc.idcuenta,
                             ncc.cuenta,
                              (case when (SELECT idnaturaleza FROM mod_contabilidad.nom_cuenta cta where idcuenta = nc.idcuenta) = 8030 
                                then (select sum(s.creditomb) - sum(s.debitomb) 
                                FROM mod_contabilidad.nom_cuenta h
                                LEFT JOIN mod_contabilidad.dat_confcuentaentidade c ON h.idcuenta = c.idcuenta and c.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura)
                                INNER JOIN mod_contabilidad.res_centroelem_saldo s ON (h.idcuenta = s.idcuenta and s.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura))
                                INNER JOIN mod_contabilidad.dat_comprobante cmp ON (cmp.idcomprobante = s.idcomprobante)
                                INNER JOIN (SELECT parent_path FROM mod_contabilidad.nom_cuenta cta where idcuenta = nc.idcuenta) a on (h.parent_path OPERATOR(public.<@) a.parent_path)
                                WHERE (h.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura) OR c.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura)) AND s.fechaemision >= v_fecha)
                                  
                                else (select sum(s.debitomb) - sum(s.creditomb)
                                FROM mod_contabilidad.nom_cuenta h
                                LEFT JOIN mod_contabilidad.dat_confcuentaentidade c ON h.idcuenta = c.idcuenta and c.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura)
                                INNER JOIN mod_contabilidad.res_centroelem_saldo s ON (h.idcuenta = s.idcuenta and s.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura))
                                INNER JOIN mod_contabilidad.dat_comprobante cmp ON (cmp.idcomprobante = s.idcomprobante)
                                INNER JOIN (SELECT parent_path FROM mod_contabilidad.nom_cuenta cta where idcuenta = nc.idcuenta) a on (h.parent_path OPERATOR(public.<@) a.parent_path)
                                WHERE (h.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura) OR c.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura)) AND s.fechaemision >= v_fecha)end) as saldo,
                                  (select sum(COALESCE(dm.importecontable, 0)-(
                                          coalesce((
                                                      select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                                                      inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                                                      inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                                                      where ddev.estado = 4 and devp.idpadre = dd1.iddocumento and dev.idproducto = dm.idproducto
                                                  ),0)
                                      )) + coalesce((select sum(coalesce(res.debitomb,0))
                                   from mod_logtaller.dat_comprobantearreglo dca
                                   inner join mod_contabilidad.res_centroelem_saldo res ON res.idcomprobante = dca.idcomprobanteve
                                   inner join mod_contabilidad.dat_comprobante dc ON dc.idcomprobante = res.idcomprobante
                                   where res.numerocmp = dca.nrocomprobanteve and res.debitomb > 0 
                                   AND res.fechaemision >= v_fecha and res.idestructurae = (SELECT ae.idestructurae FROM mod_contabilidad.dat_estructurae ae where ae.idestructuracomun = p_idestructura) AND dca.idestructura = p_idestructura AND dc.creadoencontabilidad <> 1),0)
                                  from mod_logistica.dat_documento dd
                                  inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
                                  inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
                                  inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = ddp.iddocumento
                                  inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd1.iddocumento
                                  inner join mod_logistica.dat_documentocliente dmc on dmc.iddocumento = dd.iddocumento and dmc.tipocliente = 1
                                  inner join mod_datosmaestros.nom_clientesproveedor nmc on nmc.idclientesproveedores = dmc.idcliente
                                  where dd.idestructuracomun = p_idestructura
                                  and dd.estado in (1,2) and dd1.idcomprobante is not null and dd1.estado = 4) as valor,
                                (SELECT df.fechasist FROM mod_datosmaestros.dat_fecha df 
                                inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
                                WHERE des.idestructuracomun = p_idestructura and des.idsubsistema = 113) as fechacontable
                                
                      from mod_logtaller.nom_cuadreproceso ncc
                           join mod_contabilidad.nom_cuenta nc on
                             nc.idcuenta = ncc.idcuenta
                           join
                             mod_logtaller.dat_cuadreprocesoentidad
                             cce on ncc.idcuadreproceso =
                             cce.idcuadreproceso
                      where cce.idestructuracomun = p_idestructura) as sbq     
                       group by sbq.idcuenta, sbq.saldo, sbq.valor, sbq.fechacontable,
                       sbq.cuenta
                       order by sbq.cuenta)                                    
SELECT distinct
sbqQuery.idcuenta,
sbqQuery.cuenta,
sbqQuery.saldo,
(sbqQuery.valor) as valortall,
abs(sbqQuery.saldo - sbqQuery.valor) as diff,
sbqQuery.fechacontable,
i.urllogo as logo
FROM sbqQuery
LEFT JOIN mod_logistica.conf_general i ON i.idestructura = p_idestructura
		 group by
        sbqQuery.idcuenta,sbqQuery.cuenta,sbqQuery.saldo, sbqQuery.valor, sbqQuery.fechacontable, i.urllogo) loop
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

ALTER FUNCTION mod_logtaller.f_balancecuadreprocesotall (p_idestructura numeric, p_fecha date)
  OWNER TO zeolides;