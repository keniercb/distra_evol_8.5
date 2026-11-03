CREATE OR REPLACE FUNCTION mod_datosmaestros.f_validadataimportaproducto (
)
RETURNS integer [] AS
$body$
declare
v_result integer[]:=array[0];
v_rec record;
begin

--Para productos  duplicados
select a.codigoproducto into v_rec
from mod_datosmaestros.dat_impproducto a
where  a.codigoproducto is not null
group by a.codigoproducto
having count(*) > 1
order by a.codigoproducto;

if v_rec.codigoproducto is not null then v_result:= v_result|| array[3]; end if;

--Código producto nulos
/*select a.codigoproducto, a.almacenamiento into v_rec from mod_datosmaestros.dat_impproducto a where a.codigoproducto is null;

if v_rec.almacenamiento is not null then v_result:= v_result|| array[4]; end if;*/


return v_result;
end
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

GRANT EXECUTE
  ON FUNCTION mod_datosmaestros.f_validadataimportaproducto() TO zeolides;