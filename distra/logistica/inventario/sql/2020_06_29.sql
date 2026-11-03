create or replace function mod_logistica.ft_setelementogasto() returns trigger
    language plpgsql
as
$$
DECLARE
    v_recind record;
BEGIN
    select i.idelementogasto, i.idelementogastoalt,p.idclasificacioncontable into v_recind
    from mod_logistica.dat_producto p
             inner join  mod_datosmaestros.nom_indicador i USING(idindicador)
    where p.idproducto =  new.idproducto;
    new.idelementogasto = v_recind.idelementogasto;
    new.idelementogastoalt = v_recind.idelementogastoalt;
    new.idclasificacion = case when new.idclasificacion is null then v_recind.idclasificacioncontable else new.idclasificacion end;
    return new;
END;
$$;
