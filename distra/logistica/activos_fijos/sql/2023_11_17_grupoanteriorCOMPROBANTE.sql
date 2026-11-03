ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN IF NOT EXISTS idgruposubgrupoold NUMERIC(19,0);
  
CREATE OR REPLACE FUNCTION public.ft_addguposubgrupoold (
)
RETURNS trigger AS
$body$
DECLARE
  
BEGIN
  if new.idgruposubgrupo is not null then
  	new.idgruposubgrupoold = new.idgruposubgrupo;
  end if;
  return new;  
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION public.ft_addguposubgrupoold ()
  OWNER TO postgres;
  
CREATE TRIGGER dat_movregnumericoactivo_tr
  BEFORE INSERT 
  ON mod_logactivofijotangible.dat_movregnumericoactivo
  
FOR EACH ROW 
  EXECUTE PROCEDURE public.ft_addguposubgrupoold();