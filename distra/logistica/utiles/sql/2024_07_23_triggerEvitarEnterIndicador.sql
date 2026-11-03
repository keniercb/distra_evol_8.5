CREATE FUNCTION mod_datosmaestros.ft_replaceretornocarro (
)
RETURNS trigger AS
$body$
DECLARE
  
BEGIN
  if trim(new.denominacion) like '%'||chr(10)||'%' or trim(new.denominacion) like '%'||chr(13)||'%' then
  	new.denominacion = regexp_replace(new.denominacion, E'[\\n\\r]+', '', 'g' );
  end if;
  return new;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER;

CREATE TRIGGER t_evitaretornodecarro
  BEFORE INSERT OR UPDATE OF denominacion 
  ON mod_datosmaestros.nom_indicador
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_datosmaestros.ft_replaceretornocarro();