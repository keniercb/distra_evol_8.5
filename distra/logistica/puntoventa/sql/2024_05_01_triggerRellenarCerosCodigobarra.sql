CREATE OR REPLACE FUNCTION mod_datosmaestros.ft_completecodigobarra (
)
RETURNS trigger AS
$body$
DECLARE
  v_init varchar(14);
BEGIN
  v_init := '00000000000000';
  
  if length(new.codigobarra) < 14 then
  	new.codigobarra = SUBSTRING(v_init, 1, 14-length(new.codigobarra))||new.codigobarra;
  end if;
  return new;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_datosmaestros.ft_completecodigobarra ()
  OWNER TO zeolides;

CREATE TRIGGER t_completecodigobarra
  BEFORE INSERT OR UPDATE OF codigobarra 
  ON mod_datosmaestros.nom_indicadorhoja
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_datosmaestros.ft_completecodigobarra();