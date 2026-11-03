CREATE OR REPLACE FUNCTION mod_logistica.ft_eliminarprod (
)
RETURNS trigger AS
$body$
DECLARE
  v_recprod record;
BEGIN
  
  SELECT p.cronologia INTO v_recprod
  FROM mod_logistica.dat_producto p
  WHERE p.idproducto = OLD.idproducto;
  
  IF v_recprod.cronologia > 0 THEN 
  RAISE EXCEPTION 'EL PRODUCTO NO PUEDE SER ELIMINADO';
  END IF;
  
  RETURN OLD;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE;


DROP TRIGGER IF EXISTS t_eliminarprod ON mod_logistica.dat_producto;
CREATE TRIGGER t_eliminarprod
  BEFORE DELETE 
  ON mod_logistica.dat_producto
  
FOR EACH ROW 
  EXECUTE PROCEDURE ft_eliminarprod();