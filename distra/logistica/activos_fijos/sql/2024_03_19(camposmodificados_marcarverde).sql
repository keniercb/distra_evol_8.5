CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_camposmodificados (
  p_tablas varchar,
  p_campos varchar,
  p_idarearesp varchar
)
RETURNS TABLE (
  cadena varchar
) AS
$body$
DECLARE
v_sql varchar = '';
v_arregloids varchar;
v_result numeric ;
v_camposresult varchar[];
v_tabla varchar[];
v_campo varchar[];

BEGIN
v_tabla := string_to_array($1, ',');
v_campo := string_to_array($2, ',');

select 
string_agg(distinct mr.idregnumerico::text,','::text) into v_arregloids

from mod_logistica.dat_movimiento m
inner join mod_logactivofijotangible.dat_movregnumerico mr on mr.idmovimiento = m.idmovimiento
inner join mod_logactivofijotangible.dat_movregnumericoactivo mra on mra.idmovregnumerico = mr.idmovregnumerico
inner join mod_logistica.dat_producto dp on dp.idproducto = m.idproducto
inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idproducto = dp.idproducto and drn.idregnumerico = mr.idregnumerico
 where mra.idarearesp = any(cast($3 as numeric[]));

for i in 1 .. array_upper (v_tabla, 1)
loop
v_result = 0;

if v_tabla[i] in ('dat_movregnumericoactivo', 'dat_movregnumericoactivotransp') then
    v_sql = ' select count(*) from (select distinct t.' || v_campo[i] || ' from mod_logactivofijotangible.' || v_tabla[i] || ' t
    inner join mod_logactivofijotangible.dat_movregnumerico mr1 on t.idmovregnumerico = mr1.idmovregnumerico
    where mr1.idregnumerico in (' || v_arregloids ||')
    )q';
else
    v_sql = 'select count(*) from (select distinct mr1.' || v_campo[i] || ' from mod_logactivofijotangible.dat_movregnumerico mr1
    where mr1.idregnumerico in (' || v_arregloids ||')
    )q';
end if;
execute v_sql into v_result;
raise notice '%',v_result;
IF( v_result > 1) then 
v_camposresult :=  v_camposresult || v_campo[i];
end if;
end loop;

return query select unnest(v_camposresult);

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_camposmodificados (p_tablas varchar, p_campos varchar, p_idarearesp varchar)
  OWNER TO zeolides;