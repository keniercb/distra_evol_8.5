CREATE OR REPLACE FUNCTION mod_loginventario.f_recprodminmax (
  p_idestructuraop varchar,
  p_criterio varchar,
  p_minmax numeric,
  p_idestructuracomun numeric,
  p_idsubsistema numeric
)
RETURNS SETOF mod_loginventario.td_recprodminmax AS
$body$
declare
v_rec mod_loginventario.td_recprodminmax;
v_sql varchar = '';
v_ejerciciocontable record;
v_idejercicio numeric;    
begin
if p_idestructuracomun is not null and p_idsubsistema is not null then
v_ejerciciocontable = mod_logistica.f_obtenerejercicioactivo(p_idsubsistema, p_idestructuracomun);
v_idejercicio = v_ejerciciocontable.idejercicioactual;
else  
v_idejercicio = null;
end if;
v_sql = 'select distinct
dp.cantidad,
dp.disponible,
dp.minimo,
dp.maximo,
nic.numeropieza as codigo,
nic.denominacion as denomproducto,
e.denominacion as entidad,
btrim(concat(o.codigo,'|| $$'-',o.denominacion ),'-'$$ ||'),
num.abreviaturaunidadmedida,
ii.urllogo,
(select min(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logdistribucion.dat_distribucion ddisd on ddisd.iddistribucion = ddd.iddocumento 
where ddd.idestructuracomun  in(' || p_idestructuracomun || ' )) as fechaminima,
(select max(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logdistribucion.dat_distribucion ddisd on ddisd.iddistribucion = ddd.iddocumento 
where ddd.idestructuracomun  in(' || p_idestructuracomun || ' )) as fechamaxima,
(case when '|| p_minmax || ' = 0 then abs(dp.cantidad - dp.minimo) else abs(dp.cantidad - dp.maximo) end) as diferencia
from mod_logistica.dat_documento d
inner join mod_logistica.dat_movimiento dm on d.iddocumento = dm.iddocumento
inner join mod_logistica.dat_producto dp on dm.idproducto = dp.idproducto
left join mod_logistica.nom_categoria nc on dp.idcategoria = nc.idcategoria 
left join mod_datosmaestros.nom_indicador nic on dp.idindicador = nic.idindicador 
inner join mod_datosmaestros.nom_unidadmedida num on dp.idumedida = num.idunidadmedida
left join mod_datosmaestros.nom_indicadorhoja nich on nic.idindicador = nich.idindicador
left join mod_datosmaestros.nom_unidadmedida _nich on dp.idumedida = _nich.idunidadmedida 
inner join mod_datosmaestros.dat_documentoprim r on r.iddoc = d.iddoc
inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = r.idestructurasubsist
inner join mod_estructuracomp.dat_estructuraop o on o.idestructuraop = d.idestructuracomun and o.idestructuraop = dp.idestructura
inner join mod_estructuracomp.dat_estructura e on e.idestructura = es.idestructuracomun
inner join mod_logistica.conf_general ii on ii.idestructura = e.idestructura
where dp.cronologia <> 0 ';
--raise notice '%',v_sql;                        
                          
if p_minmax = 0 then v_sql = v_sql || ' and dp.cantidad < dp.minimo  '; --minimo 1
else v_sql = v_sql || ' and dp.cantidad > dp.maximo '; end if;    -- maximo
if p_idestructuraop is not null then v_sql = v_sql|| ' and o.idestructuraop in(' || p_idestructuraop || ' )' ; end if; 
if p_criterio is not null then  v_sql = v_sql|| ' and nic.denominacion ilike ''%' ||  p_criterio || '%''' ; end if;
if v_idejercicio is not null then v_sql = v_sql|| 'and d.idejercicio = '|| v_idejercicio; end if;
if p_minmax = 0  then v_sql = v_sql || ' order by dp.minimo';
else v_sql = v_sql || ' order by dp.maximo desc';
end if;

for v_rec in execute v_sql
loop
return next v_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;