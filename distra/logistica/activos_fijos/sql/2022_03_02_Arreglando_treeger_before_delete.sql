CREATE OR REPLACE FUNCTION mod_logactivofijotangible.ft_eliminarregnum (
)
RETURNS trigger AS
$body$
DECLARE
  v_rec record;
BEGIN
	SELECT max(m.cronologia) as cronologia into v_rec
    FROM mod_logactivofijotangible.dat_registronumerico rn
    INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
    INNER JOIN mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
    WHERE rn.idregnumerico = OLD.idregnumerico;
    
    IF v_rec.cronologia > 0 THEN 
    	RAISE EXCEPTION 'EL REGISTRO NUMERICO NO PUEDE SER ELIMINADO';
    END IF;
    
    RETURN OLD;    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_logactivofijotangible.ft_eliminarmovrn (
)
RETURNS trigger AS
$body$
DECLARE
  v_recmovrn record;
BEGIN
  
	SELECT m.cronologia INTO v_recmovrn
    FROM mod_logactivofijotangible.dat_movregnumerico mrn
    INNER JOIN mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
    WHERE mrn.idmovregnumerico = OLD.idmovregnumerico;
    
    IF v_recmovrn.cronologia > 0 THEN
    	RAISE EXCEPTION 'NO SE PUEDE ELIMINAR EL MOVIMIENTO DEL REGISTRO NUMERICO';
    END IF;
    
    RETURN OLD;
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;