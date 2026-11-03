CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_actualizarcantidadcomprometida (
  p_iddoc numeric,
  p_iddocumentos numeric []
)
RETURNS void AS
$body$
DECLARE
v_rec record;
v_cant numeric;
v_reccomp record;
v_idproducto numeric;
BEGIN
for v_rec in (select v.idproducto,sum(v.cantidad) as cantidad from mod_logpuntoventa.dat_ventaproducto v 
    where v.idventas =any (p_iddocumentos) group by v.idproducto) loop
    
    for v_reccomp in SELECT cc.*
      FROM mod_logistica.dat_cantidadcomprometida cc
      inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
      where d.iddoc = p_iddoc and cc.idproducto = v_rec.idproducto
      order by d.fechacontable asc loop
     
          --raise notice 'v_reccomp%',v_reccomp;
          --raise notice 'v_idproducto%',v_idproducto;
          --raise notice 'v_rec.idproducto%',v_rec.idproducto;

      if v_idproducto is null or v_idproducto <> v_rec.idproducto then
          v_cant = v_rec.cantidad;
          v_idproducto = v_rec.idproducto;
      end if;
          --raise notice 'v_idproducto%',v_idproducto;
          --raise notice 'v_cant%',v_cant;
      
      if v_reccomp.cantidad >= v_cant and v_cant > 0 then
          --raise notice 'aqui 1%',v_reccomp.cantidad;
          UPDATE mod_logistica.dat_cantidadcomprometida 
            SET cantidad = cantidad - v_cant --, estado = 2
          WHERE 
  			idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
          v_cant = 0;
          CONTINUE;
      else if v_reccomp.cantidad < v_cant and v_cant > 0 then
          v_cant = v_cant - v_reccomp.cantidad;          
          --raise notice 'dos 1%',v_reccomp.cantidad;
          UPDATE mod_logistica.dat_cantidadcomprometida 
            SET cantidad = 0, estado = 2
          WHERE 
  			idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
          CONTINUE;
      end if;
          --v_cant = v_rec.cantidad - v_rec.vendida;
      end if;
      
    end loop;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;