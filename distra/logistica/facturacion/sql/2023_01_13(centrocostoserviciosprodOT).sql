ALTER TABLE mod_logfacturacion.dat_elementosfactura
  ADD COLUMN idcentrocosto NUMERIC(19,0);
  
ALTER TABLE mod_logfacturacion.dat_elementosfactura
  ADD COLUMN denomcentrocosto VARCHAR(255);
  

CREATE OR REPLACE FUNCTION mod_logfacturacion.updatecentrocosto (
)
RETURNS trigger AS
$body$
DECLARE
  
BEGIN
  if new.idcentrocosto is not null then
  	update mod_logfacturacion.dat_elementosfactura as ef
    set denomcentrocosto = (select nc.codigocentrogrupo ||'-'||nc.descripcioncentrogrupo
     from mod_contabilidadcosto.nom_centrocosto nc where nc.idcentrogrupo = new.idcentrocosto limit 1)
     where ef.idelementofactura = new.idelementofactura;
  end if;
  return new;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logfacturacion.updatecentrocosto ()
  OWNER TO zeolides;
  
  
CREATE TRIGGER dat_elementosfactura_tr
  AFTER INSERT 
  ON mod_logfacturacion.dat_elementosfactura
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_logfacturacion.updatecentrocosto();