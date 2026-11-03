CREATE OR REPLACE FUNCTION mod_logactivofijotangible.tr_before_eliminar_rna (
)
RETURNS trigger AS
$body$
DECLARE
  v_rec record;
BEGIN
    SELECT rna.idestadoperacion into v_rec
    FROM mod_logactivofijotangible.dat_regnumericoactivo rna
    WHERE rna.idregnumerico = OLD.idregnumerico;
    
    
    IF v_rec.idestadoperacion > 0 THEN 
    	RAISE EXCEPTION 'EL REGISTRO NUMERICO ACTIVO TIENE IDESTADOOPERACION > 0 Y NO PUEDE SER ELIMINADO';
    END IF;
    
    RETURN OLD; 
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE;

DROP TRIGGER IF EXISTS t_before_eliminar ON mod_logactivofijotangible.dat_regnumericoactivo;

CREATE TRIGGER t_before_eliminar
  BEFORE DELETE 
  ON mod_logactivofijotangible.dat_regnumericoactivo
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_logactivofijotangible.tr_before_eliminar_rna();