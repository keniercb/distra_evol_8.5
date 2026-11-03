CREATE OR REPLACE FUNCTION mod_logdistribucion.fn_cancelarasignaciones (
  p_iddocumento numeric,
  p_motivo varchar
)
RETURNS void AS
$body$
DECLARE
  v_recdist record;
  v_cancelacion record;
BEGIN
	--Actualizando los entregados
	for v_recdist in (	
		select dpo.idprodorden, dpo.idproducto,dp.idproducto, cmpto.idprodorden,dpo.cantidad,dpo.idcliente,dpo.cancelar,
            cmpto.entregado as entregado, (dpo.cantidad - cmpto.entregado - cmpto.enproceso) as propuestoanular  
        from mod_logdistribucion.dat_prodorden dpo
        inner join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
        inner join mod_logdistribucion.dat_prodordencmpto cmpto on cmpto.idprodorden = dpo.idprodorden
        where dpo.idorden = p_iddocumento
    )
    loop
--    	raise notice 'iddoc ,%', v_recdist.propuestoanular;
		if v_recdist.propuestoanular > 0 then
            update mod_logdistribucion.dat_prodorden 
            set cancelar = v_recdist.propuestoanular 
            where idprodorden = v_recdist.idprodorden;
            
            select count(cc.idcancelacion) as existe into v_cancelacion from mod_logdistribucion.dat_cancelacion cc
            where cc.idprodorden = v_recdist.idprodorden and cc.estado = 1;
            
            if v_cancelacion.existe > 0 then 
                update mod_logdistribucion.dat_cancelacion
                set cantidad = v_recdist.propuestoanular,
                motivo = p_motivo,
                fecha = now()
                where idprodorden = v_recdist.idprodorden;            
            else 
                INSERT INTO 
                  mod_logdistribucion.dat_cancelacion
                (
                  idprodorden,
                  cantidad,
                  motivo,
                  estado,
                  fecha
                )
                VALUES (
                  v_recdist.idprodorden,
                  v_recdist.propuestoanular,
                  p_motivo,
                  1,
                  now()
                );
            end if;
        end if;
    end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logdistribucion.fn_cancelarasignaciones (p_iddocumento numeric, p_motivo varchar)
  OWNER TO zeolides;