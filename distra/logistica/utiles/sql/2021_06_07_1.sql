CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_ventaproductocliente (
  p_criterio varchar,
  p_idnaturaleza numeric,
  p_fechainicio date,
  p_fechafin date,
  p_filtronaturaleza varchar,
  p_filtrocliente varchar,
  p_filtroproducto varchar,
  p_filtrocampo varchar,
  p_filtrosigno numeric,
  p_valor numeric
)
RETURNS SETOF mod_logpuntoventa.td_ventaproductocliente AS
$body$
declare
all_rec mod_logpuntoventa.td_ventaproductocliente;



begin



for all_rec in
select dp.idindicador,(COALESCE(ni.numeropieza,ni.codigo)||' - '||coalesce(nih.descripcionventa,substring(ni.denominacion,0,30))) as text,
nn.denominacion as naturaleza,(vc.nombre||'  [ '||vc.numeroidentidad||' ] ') as nombre,sum(vp.cantidad) as cantidad,
sum(vp.importetotal) as importe,vc.idventacliente as idcliente
from mod_datosmaestros.nom_indicador ni
inner join mod_logistica.dat_producto dp on ni.idindicador = dp.idindicador
inner join mod_logpuntoventa.dat_ventaproducto vp on vp.idproducto = dp.idproducto
inner join mod_logpuntoventa.dat_ventas v on v.idventas = vp.idventas
inner join mod_logpuntoventa.dat_ventacliente vc on vc.idventacliente = v.idpersona
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dp.idumedida
left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador
left join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza
where dp.cronologia > 0 
/*Filtro Comparaciones*/
and (case when p_filtrocampo='importe' and p_filtrosigno=1  then (vp.importetotal < p_valor ) else true END)
and (case when p_filtrocampo ='importe' and p_filtrosigno=2  then (vp.importetotal > p_valor) else true END)
and (case when p_filtrocampo ='importe' and p_filtrosigno=3 then (vp.importetotal = p_valor) else true END)

and (case when p_filtrocampo='cantidad' and p_filtrosigno=1  then (vp.cantidad < p_valor ) else true END)
and (case when p_filtrocampo ='cantidad' and p_filtrosigno=2  then (vp.cantidad> p_valor) else true END)
and (case when p_filtrocampo ='cantidad' and p_filtrosigno=3 then (vp.cantidad = p_valor) else true END)
and (case when p_criterio is not null then (ni.denominacion ilike '%' || p_criterio || '%' or 
ni.numeropieza ilike '%' || p_criterio || '%' or ni.codigo ilike '%' || p_criterio || '%') else
true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else
 true end)

and (case when p_filtrocliente is not null then (vc.nombre ilike '%' || p_filtrocliente||'%' OR vc.numeroidentidad ilike '%' || p_filtrocliente||'%') else
true end)
and (case when p_filtronaturaleza is not null then (nn.denominacion ilike '%' || p_filtronaturaleza || '%') else
true end)
and (case when p_filtroproducto is not null then (ni.denominacion ilike '%' || p_filtroproducto || '%') else
true end)





group by dp.idindicador,num.abreviaturaunidadmedida,ni.codigo,ni.numeropieza,ni.denominacion,
nih.descripcionventa,nn.denominacion,vc.nombre,vc.numeroidentidad,vc.idventacliente
order by ni.denominacion,cantidad desc,nombre
loop
--raise exception '%', all_rec;
return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;



--------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_ventastarjeta (
  p_digitos varchar, 
  p_filtrotienda varchar,
  p_filtrotargeta varchar,
  p_filtronoventa numeric,
  p_filtroproducto varchar,
  p_filtronaturaleza varchar,
  p_filtroentidad varchar,
  p_filtrocampo varchar,
  p_filtrosigno numeric,
  p_valor numeric,
  p_filtrotitular varchar,
  p_ordenar varchar
)
RETURNS SETOF mod_logpuntoventa.td_ventastarjeta AS
$body$
declare
all_rec mod_logpuntoventa.td_ventastarjeta;
begin 
for all_rec in

SELECT v.nroventa,upper(vt.titular) as titular,vt.digitos,coalesce(i.numeropieza,i.codigo)||' - '||coalesce(h.descripcionventa,substr(i.denominacion,0,30)) as producto,
na.denominacion as naturaleza,vp.cantidad,vp.importetotal,cf.urllogo,av.nombre,vc.numeroidentidad||' - '||vc.nombre as cliente,
es.codigo||' - '||es.denominacion
FROM mod_logpuntoventa.dat_ventas v
INNER JOIN mod_logpuntoventa.dat_ventacliente vc ON vc.idventacliente = v.idpersona
INNER JOIN mod_logpuntoventa.dat_ventastarjeta vt ON (vt.idventas = v.idventas)
INNER JOIN mod_logpuntoventa.dat_ventaproducto vp ON (vp.idventas =  v.idventas)
INNER JOIN mod_logpuntoventa.nom_modopago nmp ON (nmp.idmodopago = v.idpago and nmp.codigo = '02')
INNER JOIN mod_logpuntoventa.dat_areaventa av ON (av.idareaventa =  v.idareaventa)
INNER JOIN mod_estructuracomp.v_dametodasestructuras es on es.idestructura = av.idestructuracomun
INNER JOIN mod_logistica.dat_producto p ON (p.idproducto =  vp.idproducto)
INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador =  p.idindicador)
INNER JOIN mod_datosmaestros.nom_indicadorhoja h on h.idindicador = i.idindicador
INNER JOIN mod_datosmaestros.nom_naturaleza na ON (i.idnaturaleza =  na.idnaturaleza)
INNER JOIN mod_logistica.conf_general cf on cf.idestructura = p.idestructuracomun
where (CASE When p_digitos is not null then vt.digitos = p_digitos else true END)
/*Filtros*/
    and(case when p_filtrotienda is not null then all_rec.tienda ILIKE '%'||p_filtrotienda||'%' else true end)
    and(case when p_filtrotargeta is not null then vt.digitos ILIKE '%'||p_filtrotargeta||'%'  else true end)
    and(case when p_filtroproducto is not null then es.codigo||' - '||es.denominacion ILIKE '%'||p_filtroproducto||'%'  else true end)
    and(case when p_filtronaturaleza is not null then na.denominacion ILIKE '%'|| p_filtronaturaleza ||'%'  else true end)
    and(case when p_filtroentidad is not null then all_rec.entidad ILIKE '%'||p_filtroentidad||'%'  else true end)

        
    and (case when p_filtrocampo ='nroventa' and p_filtrosigno=1  then (v.nroventa < p_valor ) else true END)
    and (case when p_filtrocampo ='nroventa' and p_filtrosigno=2  then (v.nroventa > p_valor) else true END)
    and (case when p_filtrocampo ='nroventa' and p_filtrosigno=3 then (v.nroventa = p_valor) else true END)
    
    and (case when p_filtrocampo ='importetotal' and p_filtrosigno=1  then (vp.importetotal < p_valor ) else true END)
    and (case when p_filtrocampo ='importetotal' and p_filtrosigno=2  then (vp.importetotal > p_valor) else true END)
    and (case when p_filtrocampo ='importetotal' and p_filtrosigno=3 then (vp.importetotal = p_valor) else true END)
    
    and (case when p_filtrocampo ='cantidad' and p_filtrosigno=1  then (vp.cantidad < p_valor ) else true END)
    and (case when p_filtrocampo ='cantidad' and p_filtrosigno=2  then (vp.cantidad > p_valor) else true END)
    and (case when p_filtrocampo ='cantidad' and p_filtrosigno=3 then (vp.cantidad = p_valor) else true END)
    and(case when p_filtrotitular is not null then upper(vt.titular) ILIKE '%'||p_filtrotitular||'%'  else true end)
    /*Fin Filtros*/
and v.idpago = -2

--order by vt.titular asc,av.nombre,es.denominacion,v.idventas desc

order by 
(case when p_ordenar ='cantidad' then vp.cantidad end)desc,
(case when p_ordenar ='importe' then vp.importetotal end)desc,
(case when p_ordenar ='ninguno' then vt.titular end)asc,
(case when p_ordenar ='ninguno' then av.nombre end),
(case when p_ordenar ='ninguno' then es.denominacion end),
(case when p_ordenar ='ninguno' then v.idventas end)desc

--limit 100
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

----------------------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_listadoventasxcliente (
  p_idcliente numeric,
  p_idareaventa numeric,
  p_fechainicio date,
  p_fechafin date,
  p_idindicador numeric,
  p_criterio varchar,
  p_abreviatura varchar,
  p_filtroentidad varchar,
  p_filtroareaventa varchar,
  p_filtrovendedor varchar,
  p_filtronroventa numeric,
  p_filtrotipodoc varchar,
  p_ordenalfabetico varchar,
  p_ordenmayorimporte varchar,
  p_filtrocampomenor varchar,
  p_filtrovalormenor numeric,
  p_filtrocampomayor varchar,
  p_filtrovalormayor numeric,
  p_filtrocampoigual varchar,
  p_filtrovalorigual numeric
)
RETURNS SETOF mod_logpuntoventa.td_ventasxcliente AS
$body$
declare
all_rec mod_logpuntoventa.td_ventasxcliente;


begin 

for all_rec in

SELECT d.iddocumento,COALESCE(vc.nombre||'  [ '||vc.numeroidentidad||' ] ',vcc.nombre||'  [ '||vcc.numeroidentidad||' ] ') as nombre,
av.nombre as areaventa,COALESCE(v.importe,dv.totalefectdevuelto) as importe,d.fechacontable,
(case when dv.iddevolucion is null then d.nrodoc::VARCHAR else d.nrodoc||' / '||vv.nroventa end) as nrodoc,
(case when dv.iddevolucion is null then (SELECT count(vp.idventaproducto) FROM mod_logpuntoventa.dat_ventaproducto vp
WHERE (vp.idventas = v.idventas)) else (SELECT count(pd.idproductodevolucion) FROM mod_logpuntoventa.dat_productodevolucion pd
WHERE (pd.iddevolucion = dv.iddevolucion)) end) as cantprod,cf.urllogo,nc.denominacion,
/*(case when dv.iddevolucion is null then v.importe else dv.totalefectdevuelto * -1 end)*/0 as importetotal,
es.codigo||' - '||es.denominacion,upper(COALESCE(v.vendedor,(pers.nombre||' '||coalesce(pers.snombre,'')||' '||pers.papel||' '||pers.sapel))) as vendedor,
(case when p_abreviatura is not null then sum(vp.cantidad) else 0 end) as cantidad,
(case when p_abreviatura is not null then sum(vp.importetotal) else 0 end) as importeproducto
FROM mod_logistica.dat_documento d
--INNER JOIN mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
--INNER JOIN mod_logistica.dat_producto p on p.idproducto = m.idproducto
LEFT JOIN mod_logpuntoventa.dat_ventas v ON v.idventas = d.iddocumento
LEFT JOIN mod_logpuntoventa.dat_ventaproducto vp on vp.idventas = v.idventas
LEFT JOIN mod_logistica.dat_producto p on p.idproducto = vp.idproducto
LEFT JOIN mod_logpuntoventa.dat_devolucion dv ON dv.iddevolucion = d.iddocumento
LEFT JOIN mod_logpuntoventa.dat_ventas vv on vv.idventas = dv.idventas
LEFT JOIN mod_logpuntoventa.dat_ventacliente vc ON vc.idventacliente = v.idpersona
LEFT JOIN mod_logpuntoventa.dat_ventacliente vcc ON vcc.idventacliente = vv.idpersona
LEFT JOIN mod_logpuntoventa.dat_areaventa av ON (av.idestructuraop = d.idestructuracomun) 
LEFT JOIN mod_logistica.conf_general cf on cf.idestructura = av.idestructuracomun
INNER JOIN mod_estructuracomp.v_dametodasestructuras es on es.idestructura = av.idestructuracomun
INNER JOIN mod_datosmaestros.dat_documentoprim dc on dc.iddoc = d.iddoc
INNER JOIN mod_datosmaestros.nom_docprim nc on nc.iddocumentos = dc.iddocumentos
LEFT JOIN mod_seguridad.seg_usuario sg on sg.idusuario = d.idusuario
LEFT JOIN mod_persona.dat_persona pers on sg.idpersona = pers.idpersona
where (CASE When p_abreviatura is not null then nc.abreviatura in (p_abreviatura) else nc.abreviatura in ('compventaLog','compdevLog') END) 
and (CASE When p_idcliente is not null then vc.idventacliente = p_idcliente else true END)
and (CASE When p_idareaventa is not null then av.idareaventa = p_idareaventa else true END)
and (CASE When p_fechainicio is not null then CAST(v.fechaventa as date) >= cast(p_fechainicio as date) else true END)
and (CASE When p_fechafin is not null then CAST(v.fechaventa as date) <= cast(p_fechafin as date) else true END)
and (CASE When p_idindicador is not null then p.idindicador = p_idindicador else true END)
/*Filtros*/
and (CASE When p_filtroareaventa is not null then av.nombre ilike '%'||p_filtroareaventa||'%' else true END)
and (CASE When p_filtrotipodoc is not null then all_rec.tipodoc ilike '%'||p_filtrotipodoc||'%' else true END)
and (CASE when p_filtrovendedor is not null then 
upper(COALESCE(v.vendedor,(pers.nombre||' '||coalesce(pers.snombre,'')||' '||pers.papel||' '||pers.sapel)))ilike '%'||p_filtrovendedor||'%'
else true end)
/*Filtro Comparaciones*/
and (CASE When p_filtrocampomenor ='importe' then (v.importe < p_filtrovalormenor) else true END)
and (CASE When p_filtrocampomayor ='importe' then (v.importe > p_filtrovalormayor) else true END)
and (CASE When p_filtrocampoigual ='importe' then (v.importe = p_filtrovalorigual) else true END)



group by d.iddocumento,vc.nombre,vc.numeroidentidad,av.nombre,vp.importetotal,d.fechacontable,
d.nrodoc,cf.urllogo,nc.denominacion,es.codigo,es.denominacion,pers.nombre,pers.snombre,pers.papel,pers.sapel,p.idindicador,
vcc.nombre,vcc.numeroidentidad,v.importe,dv.totalefectdevuelto,dv.iddevolucion,vv.nroventa,v.idventas
/*Ordenar*/
ORDER BY

CASE WHEN p_ordenmayorimporte is not null then v.importe  END desc,
CASE WHEN p_ordenmayorimporte is not null then dv.totalefectdevuelto  END desc,
CASE WHEN p_ordenalfabetico  is not null then  vcc.nombre END asc






/*ORDER BY nombre,d.iddocumento desc*/


   

limit 100
/*SELECT 
vc.nombre, 
i.denominacion, 
av.nombre as areaventa, 
vp.cantidad as cantidadproductos, 
vp.importetotal, 
v.fechaventa,
v.nroventa, 
(SELECT count(v.idventas) as cantidadventas
  FROM mod_logpuntoventa.dat_ventas v INNER JOIN mod_logpuntoventa.dat_ventacliente vc ON (vc.idventacliente =  v.idpersona) WHERE vc.idventacliente = p_idcliente)
  FROM mod_logpuntoventa.dat_ventas v
  INNER JOIN mod_logpuntoventa.dat_ventaproducto vp ON (vp.idventas =  v.idventas)
  INNER JOIN mod_logpuntoventa.dat_ventacliente vc ON (vc.idventacliente =  v.idpersona)
  INNER JOIN mod_logpuntoventa.dat_areaventa av ON (av.idareaventa =  v.idareaventa)
  INNER JOIN mod_logistica.dat_producto p ON (p.idproducto =  vp.idproducto)
  INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador =  p.idindicador)
where (CASE When p_idcliente is not null then vc.idventacliente = p_idcliente else true END)
and (CASE When p_idareaventa is not null then av.idareaventa = p_idareaventa else true END)
and (CASE When p_fechainicio is not null then v.fechaventa <= p_fechainicio else true END)
and (CASE When p_fechafin is not null then v.fechaventa >= p_fechafin else true END)
group by vc.nombre,i.denominacion,av.nombre, vp.cantidad, vp.importetotal, v.fechaventa,v.nroventa
order by vc.nombre,v.nroventa,v.fechaventa*/
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;