ALTER TYPE mod_loginventario.td_balanceinv
  ADD ATTRIBUTE estructura VARCHAR;
ALTER TYPE mod_loginventario.td_balanceinv
  ALTER ATTRIBUTE estructura TYPE VARCHAR(255);
  
  CREATE OR REPLACE FUNCTION mod_loginventario.f_balancecontable (
  p_idestructura numeric,
  p_fecha date
)
RETURNS SETOF mod_loginventario.td_balanceinv AS
$body$
DECLARE
  v_result mod_loginventario.td_balanceinv;
  v_fecha date;
  v_ejercicio record;
BEGIN
   if p_fecha is not null THEN
	v_fecha := p_fecha;
   ELSE
    v_fecha := now();
   END if;
   select * into  v_ejercicio
	from mod_loginventario.v_ejerciciocontable ec
				where v_fecha between ec.inicio and ec.fin  limit 1;

 	FOR v_result IN (
       SELECT
         q.idcuenta,
         q.concatctax,
         q.valorinv,
         q.saldo,
         q.valorinv - q.saldo as diff,
         ( SELECT urllogo FROM mod_logistica.conf_general  where idestructura = p_idestructura) as logo,
         ( SELECT denominacion FROM mod_estructuracomp.v_dametodasestructuras  where idestructura = p_idestructura) as estructura
       FROM
        (
       SELECT sq.idcuenta,
              sq.concatctax,
              round((round(coalesce((
                                      select sum(vbm.importecontable) as importecontable
                                      from mod_loginventario.v_balancecontable_movimiento vbm
                                      where vbm.idcuenta = sq.idcuenta and
                                            vbm.signo = '+' and
                                            vbm.fechacontable <= v_fecha and
                                            vbm.idestructuracomun = p_idestructura
              ), 0), 2) - round(coalesce((
                                      select sum(vbm.importecontable) as importecontable
                                      from mod_loginventario.v_balancecontable_movimiento vbm
                                      where vbm.idcuenta = sq.idcuenta and
                                            vbm.signo = '-' and
                                            vbm.fechacontable <= v_fecha and
                                            vbm.idestructuracomun = p_idestructura
              ), 0), 2)), 2) as valorinv,
             coalesce((select sum(rp.saldomb) as saldo 
             from mod_contabilidad.res_centroelem_saldo rp
							inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
                            where rp.idcuenta = sq.idcuenta and rp.fechaemision between v_ejercicio.inicio and v_ejercicio.fin
							and eec.idestructuracomun = p_idestructura and rp.fechaemision <= v_fecha limit 1),0) as saldo
       from (
              SELECT distinct vcp.idcuenta,
                     nc.concatctax
              from mod_loginventario.v_contable_producto vcp
       		  JOIN mod_contabilidad.nom_cuenta nc ON nc.idcuenta = vcp.idcuenta
              where vcp.idestructuracomun = p_idestructura
            ) sq
       order by sq.concatctax
     ) as q

    ) LOOP
      return next v_result;
    END LOOP;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;