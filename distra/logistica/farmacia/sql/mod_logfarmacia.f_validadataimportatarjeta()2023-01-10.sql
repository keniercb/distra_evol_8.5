CREATE OR REPLACE FUNCTION mod_logfarmacia.f_validadataimportatarjeta (
)
RETURNS integer [] AS
$body$
declare
v_result integer[]:=array[0];
v_rec record;
begin

--Para tarjetas duplicadas
select a.numeroidentidad into v_rec
from mod_logfarmacia.dat_imptarjeta a
where  a.numeroidentidad is not null
group by a.numeroidentidad
having count(*) > 1
order by a.numeroidentidad;

if v_rec.numeroidentidad is not null then v_result:= v_result|| array[3]; end if;

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