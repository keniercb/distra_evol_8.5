CREATE OR REPLACE FUNCTION mod_loginventario.f_balancecontable (
  p_idestructura numeric,
  p_fecha date
)
RETURNS SETOF mod_loginventario.td_balanceinv AS
$body$
DECLARE
  v_result mod_loginventario.td_balanceinv;
  v_fecha date;
  _query varchar;
  v_recejercicio record;
BEGIN
   if p_fecha is not null THEN
	v_fecha := p_fecha;
   ELSE
    v_fecha := now();
   END if;
   select ec.idejercicio, ec.inicio, ec.fin into v_recejercicio 
    from mod_datosmaestros.dat_ejerciciocontable ec
    where  v_fecha between ec.inicio and ec.fin;
   	PERFORM case when v_fecha >= '01/01/2021'::date then 'sbqAfter2021' else  'sbqBefore2021' end as _query;

 	for v_result in (
		with sbqBefore2021 as (SELECT sbq.idcuenta,
                              sbq.concatcta,
                              sum(sbq.valor) as valor
                       from (
                              select nc.idcuenta,
                                     nc.concatcta,
                                     round((coalesce((
                                                       SELECT sum(v.importemb)
                                                       from
                                                         mod_logistica.v_importetotalmov
                                                         v
                                                       where v.idestructuracomun
                                                         = p_idestructura and
                                                             v.idclasificacion =
                                                               ncc.idclasificacioncontable
  and
                                                             v.signo = '+' and
                                                             v.fechacontable <=
                                                               v_fecha
                                     ), 0) - coalesce((
                                                        SELECT sum(v.importemb)
                                                        from
                                                          mod_logistica.v_importetotalmov
                                                          v
                                                        where
                                                          v.idestructuracomun =
                                                          p_idestructura and
                                                              v.idclasificacion
                                                                =
                                                                ncc.idclasificacioncontable
  and
                                                              v.signo = '-' and
                                                              v.fechacontable <=
                                                                v_fecha
                                     ), 0)), 2) as valor,
                     		round(
                                  coalesce (
                                      (
                                         select sum(rp.saldomb) as saldo from mod_contabilidad.res_centroelem_saldo rp
                                          inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
                                          where rp.idcuenta = nc.idcuenta and rp.fechaemision between v_recejercicio.inicio and v_recejercicio.fin
                                          and eec.idestructuracomun = p_idestructura and rp.fechaemision <= v_fecha
                                      )
                                  ,0)
                              ,2) as saldo
                              from mod_logistica.nom_clasificacioncontable ncc
                                   join mod_contabilidad.nom_cuenta nc on
                                     nc.idcuenta = ncc.idcuenta
                                   join
                                     mod_logistica.dat_clasificacioncontableentidad
                                     cce on ncc.idclasificacioncontable =
                                     cce.idclasificacioncontable
                              where cce.idestructuracomun = p_idestructura and
                                    ncc.idclasificacioncontable in (
                                                                     SELECT
                                                                       distinct
                                                                       idclasificacioncontable
                                                                     from
                                                                       mod_logistica.dat_producto
                                                                     where
                                                                       cce.idestructuracomun
                                                                       =
                                                                       p_idestructura
  and
                                                                           cce.idclasificacioncontable
                                                                             is
                                                                             not
                                                                             null
                                    )
                              union
                              SELECT nc.idcuenta,
                                     nc.concatcta,
                                     round((coalesce((
                                                       SELECT sum(v.importema)
                                                       from
                                                         mod_logistica.v_importetotalmov
                                                         v
                                                       where v.idestructuracomun
                                                         = p_idestructura and
                                                             v.idclasificacion =
                                                               ncc.idclasificacioncontable
  and
                                                             v.signo = '+' and
                                                             v.fechacontable <=
                                                               v_fecha
                                     ), 0) - coalesce((
                                                        SELECT sum(v.importema)
                                                        from
                                                          mod_logistica.v_importetotalmov
                                                          v
                                                        where
                                                          v.idestructuracomun =
                                                          p_idestructura and
                                                              v.idclasificacion
                                                                =
                                                                ncc.idclasificacioncontable
  and
                                                              v.signo = '-' and
                                                              v.fechacontable <=
                                                                v_fecha
                                     ), 0)), 2) as valor,
                                     round(
                                        coalesce (
                                            (
                                               select sum(rp.saldomb) as saldo from mod_contabilidad.res_centroelem_saldo rp
                                                inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
                                                where rp.idcuenta = nc.idcuenta and rp.fechaemision between v_recejercicio.inicio and v_recejercicio.fin
                                                and eec.idestructuracomun = p_idestructura and rp.fechaemision <= v_fecha
                                            )
                                        ,0)
                                    ,2) as saldo
                              from mod_logistica.nom_clasificacioncontable ncc
                                   join mod_contabilidad.nom_cuenta nc on
                                     nc.idcuenta = ncc.idcuentaalt
                                   join
                                     mod_logistica.dat_clasificacioncontableentidad
                                     cce on ncc.idclasificacioncontable =
                                     cce.idclasificacioncontable
                              where cce.idestructuracomun = p_idestructura and
                                    ncc.idclasificacioncontable in (
                                                                     SELECT
                                                                       distinct
                                                                       idclasificacioncontable
                                                                     from
                                                                       mod_logistica.dat_producto
                                                                     where
                                                                       cce.idestructuracomun
                                                                       =
                                                                       p_idestructura
  and
                                                                           cce.idclasificacioncontable
                                                                             is
                                                                             not
                                                                             null
                                    )
                            ) sbq
                       group by sbq.idcuenta,
                                sbq.concatcta
                       order by sbq.concatcta),
     sbqAfter2021 as (SELECT nc.idcuenta,
                             nc.concatcta,
                             round((coalesce((
                                               SELECT sum(v.importetotal)
                                               from
                                                 mod_logistica.v_importetotalmov
                                                 v
                                               where v.idestructuracomun =
                                                 p_idestructura and
                                                     v.idclasificacion =
                                                       ncc.idclasificacioncontable
  and
                                                     v.signo = '+' and
                                                     v.fechacontable <= v_fecha
                             ), 0) - coalesce((
                                                SELECT sum(v.importetotal)
                                                from
                                                  mod_logistica.v_importetotalmov
                                                  v
                                                where v.idestructuracomun =
                                                  p_idestructura and
                                                      v.idclasificacion =
                                                        ncc.idclasificacioncontable
  and
                                                      v.signo = '-' and
                                                      v.fechacontable <= v_fecha
                             ), 0)), 2) as valor,
                             round(
                                  coalesce (
                                      (
                                         select sum(rp.saldomb) as saldo from mod_contabilidad.res_centroelem_saldo rp
                                          inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
                                          where rp.idcuenta = nc.idcuenta and rp.fechaemision between v_recejercicio.inicio and v_recejercicio.fin
                                          and eec.idestructuracomun = p_idestructura and rp.fechaemision <= v_fecha
                                      )
                                  ,0)
                              ,2) as saldo
                      from mod_logistica.nom_clasificacioncontable ncc
                           join mod_contabilidad.nom_cuenta nc on nc.idcuenta =
                             ncc.idcuenta
                           join mod_logistica.dat_clasificacioncontableentidad
                             cce on ncc.idclasificacioncontable =
                             cce.idclasificacioncontable
                      where cce.idestructuracomun = p_idestructura and
                            ncc.idclasificacioncontable in (
                                                             SELECT distinct
                                                               idclasificacioncontable
                                                             from
                                                               mod_logistica.dat_producto
                                                             where
                                                               cce.idestructuracomun
                                                               = p_idestructura and
                                                                   cce.idclasificacioncontable
                                                                     is not null
                            )
                      order by nc.concatcta asc)
SELECT sbqAfter2021.idcuenta,
       sbqAfter2021.concatcta as concatctax,
       sbqAfter2021.valor as valorinv,
       sbqAfter2021.saldo as saldo,
       sbqAfter2021.valor - sbqAfter2021.saldo as diff
from sbqAfter2021 ) loop
                	return next v_result;
                end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;