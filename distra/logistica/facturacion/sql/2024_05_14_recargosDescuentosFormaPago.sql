ALTER TABLE IF EXISTS mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS tipoconceptoventa NUMERIC(1,0);

ALTER TABLE IF EXISTS mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS conceptoventa VARCHAR(1);

ALTER TABLE IF EXISTS mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS valorconcepto NUMERIC(25,2);

ALTER TABLE IF EXISTS mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS calculoconcepto NUMERIC(25,2);  


CREATE FUNCTION mod_logfacturacion.ft_updaterecargodescuento (
)
RETURNS trigger AS
$body$
DECLARE
  v_valorcalculo numeric(25,2);
BEGIN
  if new.conceptoventa = '+' or new.conceptoventa = '-' then
  	if coalesce(new.valorconcepto,0) > 0 then
    	if new.tipoconceptoventa = 1 then
        	new.calculoconcepto = new.importecontable*new.valorconcepto/100;
        else
        	new.calculoconcepto = new.valorconcepto;
        end if;
    end if; 
  end if;
  return new;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER;

CREATE TRIGGER update_recargodescuento_tr
  BEFORE UPDATE OF importecontable, tipoconceptoventa, conceptoventa, valorconcepto 
  ON mod_logfacturacion.dat_docfactura
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_logfacturacion.ft_updaterecargodescuento();