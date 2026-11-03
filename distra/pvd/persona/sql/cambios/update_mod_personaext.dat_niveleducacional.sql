update mod_personaext.dat_niveleducacional set fdesde = now()::date
where fdesde is null;

with repetidos as (select (idpersona::text ||' '|| idniveleducacional::text)as v1, count(idpersona::text ||' '|| idniveleducacional::text) as v2
from mod_personaext.dat_niveleducacional
group by idpersona::text ||' '|| idniveleducacional::text
having count(idpersona::text ||' '|| idniveleducacional::text) > 1)

delete from mod_personaext.dat_niveleducacional
where idniveleducacionalp in (select idniveleducacionalp
from mod_personaext.dat_niveleducacional niv , repetidos
where (niv.idpersona::text ||' '|| niv.idniveleducacional::text)= repetidos.v1
offset 1);

--Restricción de unicidad
alter table if exists mod_personaext.dat_niveleducacional drop constraint if exists ak_personanivel;
alter table if exists mod_personaext.dat_niveleducacional
    add constraint ak_personanivel unique (idpersona, idniveleducacional);
