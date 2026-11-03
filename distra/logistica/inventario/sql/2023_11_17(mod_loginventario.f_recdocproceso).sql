CREATE OR REPLACE FUNCTION mod_loginventario.f_recdocproceso (
  p_idestructuraop varchar,
  p_estado varchar,
  p_nrodoc numeric,
  p_idusuario numeric,
  p_fechainicio date,
  p_fechafin date,
  p_iddoc numeric,
  p_idestructuracomun numeric,
  p_idsubsistema numeric
)
RETURNS SETOF mod_loginventario.td_docproceso AS
$body$
declare
v_rec mod_loginventario.td_docproceso;
v_ejerciciocontable record;
v_idejercicio numeric;
begin
if p_idestructuracomun is not null and p_idsubsistema is not null then
v_ejerciciocontable = mod_logistica.f_obtenerejercicioactivo(p_idsubsistema, p_idestructuracomun);
v_idejercicio = v_ejerciciocontable.idejercicioactual;
else  
v_idejercicio = null;
end if;
for v_rec in
select
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

/*(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,*/
(SELECT concat(codigo,'-',denominacion) from mod_estructuracomp.v_dametodasestructuras where idestructura = p_idestructuracomun limit 1) as entidad,

btrim(concat(deop.codigo,'-',deop.denominacion ),'-') as deposito,
dd.fechacontable,
ndp.denominacion,
su.nombreusuario,
case when dd.estado = 1 then 'Elaboración'
     when dd.estado = 2 then 'Preparado'
     when dd.estado = 3 then 'Aprobado'
     when dd.estado = 4 then 'Contabilizado'
     when dd.estado = 5 then 'Eliminado'
     when dd.estado = 6 then 'Anulado'
     when dd.estado = 7 then 'Cancelado'
     when dd.estado = 8 then 'Cancelado-Duplicado'
     when dd.estado = 9 then 'Cerrado'
     when dd.estado = 10 then 'Propuesto a cancelar'
     when dd.estado = 11 then 'Revisado'
     when dd.estado = 12 then 'Conciliado'
     when dd.estado = 13 then 'Pre-elaborado'
     when dd.estado = 14 then 'Aprobado con prórroga'
     when dd.estado = 15 then 'Prorrogar'
     else 'Sin Estado'
end as estado,
i.urllogo,
v_ejerciciocontable.fechamin,
v_ejerciciocontable.fechamax,
dd.nrodoc,
dd.numeroref

/*(select min(ddd.fechacontable)
from mod_logistica.dat_documento ddd
inner join mod_estructuracomp.dat_estructuraop deopp on deopp.idestructuraop = ddd.idestructuracomun
where (case when  p_idestructuraop is null then true else deopp.idestructuraop = any(cast(p_idestructuraop as numeric[])) end)) as fechaminima,

(select max(ddd.fechacontable)
from mod_logistica.dat_documento ddd
inner join mod_estructuracomp.dat_estructuraop deopp on deopp.idestructuraop = ddd.idestructuracomun
where (case when  p_idestructuraop is null then true else deopp.idestructuraop = any(cast(p_idestructuraop as numeric[])) end)) as fechamaxima*/

from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddprim on ddprim.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddprim.iddocumentos
left join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dd.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddprim.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where (case when p_idestructuraop is not null then (deop.idestructura = any(cast(p_idestructuraop as numeric[])) or dd.idestructuracomun = p_idestructuracomun) else dd.idestructuracomun = p_idestructuracomun end)
and (case when  p_estado is not null then dd.estado = any(cast(p_estado as numeric[])) else true end)
/*and (case when p_nrodoc is not null then ((case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end)) ilike '%'||p_nrodoc||'%' else true end)*/
and (case when p_nrodoc is not null then dd.nrodoc = p_nrodoc or dd.numeroref = p_nrodoc else true end) 
and (case when p_idusuario is not null then su.idusuario = p_idusuario else true end)
and ((case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end) 
and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end))
and (case when v_idejercicio is not null then dd.idejercicio = v_idejercicio else true end)
and (case when p_iddoc is not null then dd.iddoc = p_iddoc else true end)
order by deop.idestructura desc
loop return next v_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_recdocproceso (p_idestructuraop varchar, p_estado varchar, p_nrodoc numeric, p_idusuario numeric, p_fechainicio date, p_fechafin date, p_iddoc numeric, p_idestructuracomun numeric, p_idsubsistema numeric)
  OWNER TO zeolides;