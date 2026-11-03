CREATE OR REPLACE FUNCTION mod_loginventario.f_reclentomov (
  p_idestructuraop varchar,
  p_fechainicio date,
  p_fechafin date,
  p_nombreproducto varchar,
  p_idestructuracomun numeric,
  p_idsubsistema numeric
)
RETURNS SETOF mod_loginventario.td_reclentomov AS
$body$
declare
v_result mod_loginventario.td_reclentomov;
v_rec record;
v_recent record;
v_cant numeric = 0;
v_id record;
v_ejerciciocontable record;
v_idejercicio numeric;
v_fechasist date;
begin
if p_idestructuracomun is not null and p_idsubsistema is not null then
v_ejerciciocontable = mod_logistica.f_obtenerejercicioactivo(p_idsubsistema, p_idestructuracomun);
v_idejercicio = v_ejerciciocontable.idejercicioactual;
v_fechasist = v_ejerciciocontable.fechamax;
else  v_idejercicio = null; end if;

create temp table datos (
idproducto numeric(19,0),
codigoproducto varchar(255),
categoria varchar(255),
denomproducto varchar(255),
fechaentrada date,
fechamov date,
cantidad numeric(25,6),
operacion varchar(255),
existencia numeric(25,6),
disponible numeric(25,6),
cant numeric(19,0),
deposito varchar(255),
almacen varchar(255),
logo VARCHAR);

for v_rec in 
select distinct p.idproducto, 
(case when (np.numeropieza is null or np.numeropieza = '') then np.codigo else np.numeropieza END) as codigo, 
np.denominacion as descripcion, 
p.cantidad, 
p.cantidad - coalesce((select sum(dcc.cantidad) 
from mod_logistica.dat_cantidadcomprometida dcc 
where dcc.idproducto = p.idproducto and dcc.estado <> 2),0) as disponible, op.denominacion as den, e.denominacion,
ii.urllogo as logo,ncp.denominacion as categoria
from mod_logistica.dat_producto p 
left join mod_logistica.nom_categoria ncp on p.idcategoria = ncp.idcategoria
inner join mod_datosmaestros.nom_indicador np on p.idindicador = np.idindicador 
inner join mod_estructuracomp.v_dametodasestructuras op on op.idestructura = p.idestructura 
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = op.idestructura
inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = f.idpadre
left join mod_logistica.conf_general ii on ii.idestructura = e.idestructura    
where p.idproducto <> 0    
and (p.idestructura = any(cast(p_idestructuraop as numeric[])))
and (case when p_nombreproducto is not null then (np.denominacion ilike '%' || p_nombreproducto || '%') else true end)
and p.cantidad > 0
and p.cronologia > 0 	    
loop    
insert into datos (idproducto, codigoproducto, denomproducto, fechaentrada,fechamov, cantidad, operacion, existencia, disponible, cant, deposito, almacen, logo, categoria)
values (v_rec.idproducto, v_rec.codigo, v_rec.descripcion, null,null, null, null, v_rec.cantidad, v_rec.disponible, null, v_rec.den, v_rec.denominacion, v_rec.logo, v_rec.categoria);
end loop;

for v_id in
select d.idproducto from datos d
loop    
select d.fechacontable, m.cantidad as cant, ndoc.denominacion, m.idproducto as id ,m.existenciaactual
from mod_logistica.dat_documento d
inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
inner join mod_datosmaestros.dat_documentoprim dp on d.iddoc = dp.iddoc
inner join mod_datosmaestros.nom_docprim ndoc on ndoc.iddocumentos = dp.iddocumentos  
where m.idproducto = v_id.idproducto
and ndoc.abreviatura in('conduceLog','facturaLog','valeLog')    
--and m.signo in('-')
and d.estado in ('4')
and d.cronologia > 0
and d.idejercicio = v_idejercicio  
order by d.cronologia desc limit 1
into v_rec;      
update datos set 
fechamov = v_rec.fechacontable,
cantidad = v_rec.cant,
operacion =  v_rec.fechacontable,
cant = (cast(v_fechasist as date) - v_rec.fechacontable)
where v_rec.id = idproducto; 

select d.fechacontable, m.cantidad as cant, ndoc.denominacion, m.idproducto as id ,m.existenciaactual
from mod_logistica.dat_documento d
inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
inner join mod_datosmaestros.dat_documentoprim dp on d.iddoc = dp.iddoc
inner join mod_datosmaestros.nom_docprim ndoc on ndoc.iddocumentos = dp.iddocumentos  
where m.idproducto = v_id.idproducto
and ndoc.abreviatura in('recepcionLog','aperturaLog')    
and d.estado in ('3','4')
and d.cronologia > 0
and d.idejercicio = v_idejercicio  
order by d.cronologia asc limit 1
into v_recent;      
update datos set 
fechaentrada = v_recent.fechacontable,    
operacion = v_rec.denominacion,
cant = (cast(v_fechasist as date) - v_recent.fechacontable) 
where v_recent.id = idproducto;   

end loop;

for v_result in 
select d.idproducto, codigoproducto, denomproducto, fechamov, cantidad, operacion, existencia, disponible, cant, deposito, almacen, d.logo, d.categoria 
from datos d
where ( case when p_fechainicio is not null then d.fechamov  not between p_fechainicio and p_fechafin else true end )
and ( case when  p_fechainicio is not null then d.fechaentrada  not between p_fechainicio and p_fechafin else true end )
order by d.deposito,d.codigoproducto 
loop
return next v_result; end loop; 
drop table datos;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;