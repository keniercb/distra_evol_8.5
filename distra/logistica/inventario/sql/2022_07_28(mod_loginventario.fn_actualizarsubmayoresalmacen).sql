CREATE OR REPLACE FUNCTION mod_loginventario.fn_actualizarsubmayoresalmacen (
  p_iddeposito numeric
)
RETURNS void AS
$body$
DECLARE
  v_rec record;
BEGIN
    for v_rec in (
    	select p.idproducto
		from mod_logistica.dat_producto p
		where p.idestructura = p_iddeposito
    )loop
    	PERFORM mod_loginventario.fn_actualizarsubmayores(v_rec.idproducto);
    end loop;  
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.fn_actualizarsubmayoresalmacen (p_iddeposito numeric)
  OWNER TO zeolides;