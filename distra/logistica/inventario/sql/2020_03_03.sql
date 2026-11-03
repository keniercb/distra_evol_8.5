CREATE OR REPLACE FUNCTION mod_logistica.ft_setelementogasto (
)
RETURNS trigger AS
$body$
DECLARE
  v_recind record;
BEGIN
  select i.idelementogasto, i.idelementogastoalt,p.idclasificacioncontable into v_recind
  from mod_logistica.dat_producto p
  inner join  mod_datosmaestros.nom_indicador i USING(idindicador)
  where p.idproducto =  new.idproducto;
    new.idelementogasto = v_recind.idelementogasto;
    new.idelementogastoalt = v_recind.idelementogastoalt;
    if new.idclasificacion is null then
	    new.idclasificacion = v_recind.idclasificacioncontable;
    end if;
    return new;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logistica.ft_setelementogasto ()
  OWNER TO zeolides;