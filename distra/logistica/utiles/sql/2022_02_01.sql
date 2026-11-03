CREATE OR REPLACE FUNCTION mod_logistica.ft_eliminarmov()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

DECLARE
  v_recdoc record;
BEGIN
  select d.estado into v_recdoc  from mod_logistica.dat_documento d  
  join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento 
  where m.idproducto =  old.idproducto and m.idmovimiento = old.idmovimiento;

  if v_recdoc.estado <> 1 then 
  	raise exception 'EL MOVIMIENTO NO PUEDE SER ELIMINADO'; 
  end if; 
  
  return old;
END;
$BODY$;

ALTER FUNCTION mod_logistica.ft_eliminarmov()
    OWNER TO zeolides;

GRANT EXECUTE ON FUNCTION mod_logistica.ft_eliminarmov() TO zeolides;

GRANT EXECUTE ON FUNCTION mod_logistica.ft_eliminarmov() TO PUBLIC;

GRANT EXECUTE ON FUNCTION mod_logistica.ft_eliminarmov() TO logistica;