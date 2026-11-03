CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listado_doc_aft (
  idestructura numeric,
  idocs varchar,
  aprobadopor numeric,
  desde varchar,
  idestado numeric,
  idusuario numeric,
  nrodoc numeric,
  tipodoc numeric,
  hasta varchar,
  idarearesp numeric,
  idoperacion numeric
)
RETURNS SETOF mod_logactivofijotangible.td_listado_doc_aft AS
$body$
declare
v_rec mod_logactivofijotangible.td_listado_doc_aft;
begin
for v_rec in 
  select distinct
  d.nrodoc,
  nd.denominacion as documento,
  nop.denominacion as operacion,
  uc.nombreusuario as usuario,
  ua.nombreusuario as aprobadopor,
  d.fechacontable,
  d.anno,
  (case when d.estado = '1' then 'Elaboración'
  when d.estado = '2' then 'Preparado'
  when d.estado = '3' then 'Aprobado'
  when d.estado = '5' then 'Anulado'
  when d.estado = '6' then 'Cancelado' end) as estado,
  (select count(mrn.idmovregnumerico)
  from mod_logactivofijotangible.dat_movregnumerico mrn
  inner join mod_logistica.dat_movimiento m on mrn.idmovimiento = m.idmovimiento
  inner join mod_logistica.dat_documento d2 on m.iddocumento = d2.iddocumento
  where d2.iddocumento = d.iddocumento) as medios,
  i.urllogo as icono,
  
  (select sum(mrna.valorcontable) + sum(mrna.valorcontablealternativo)
  from mod_logactivofijotangible.dat_movregnumerico mrn
  inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
  inner join mod_logistica.dat_movimiento m on mrn.idmovimiento = m.idmovimiento
  inner join mod_logistica.dat_documento d2 on m.iddocumento = d2.iddocumento
  where d2.iddocumento = d.iddocumento) as importe,

  (select sum(mrna.depreciacionacumulada) + sum(mrna.depreciacionacumuladaalternativo)
  from mod_logactivofijotangible.dat_movregnumerico mrn
  inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
  inner join mod_logistica.dat_movimiento m on mrn.idmovimiento = m.idmovimiento
  inner join mod_logistica.dat_documento d2 on m.iddocumento = d2.iddocumento
  where d2.iddocumento = d.iddocumento) as depreciacion
  
  from mod_logistica.dat_documento d
  inner join mod_logistica.dat_movimiento m on d.iddocumento = m.iddocumento
  inner join mod_datosmaestros.dat_documentoprim dd on d.iddoc = dd.iddoc
  inner join mod_datosmaestros.nom_docprim nd on dd.iddocumentos = nd.iddocumentos
  inner join mod_datosmaestros.nom_operacion nop on d.idoperacion = nop.idnomoperaciones
  inner join mod_logistica.dat_producto p on m.idproducto = p.idproducto
  inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dd.idestructurasubsist
  
  --inner join mod_estructuracomp.nom_filaestruc f1 on f1.idfila = des.idestructuracomun
  
  --left join mod_estructuracomp.dat_estructura de on de.idestructura = des.idestructuracomun
  --left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = des.idestructuracomun
  
  left join mod_seguridad.seg_usuario uc on d.idusuario = uc.idusuario
  left join mod_seguridad.seg_usuario ua on d.aprobadopor = ua.idusuario
  
  left join mod_logistica.conf_general i on i.idestructura = des.idestructuracomun
  
  inner join mod_estructuracomp.nom_filaestruc f on p.idestructura = f.idfila
  inner join mod_estructuracomp.v_dametodasestructuras v on v.idestructura = f.idfila
  left join mod_logactivofijotangible.dat_docalquiler docalquiler on d.iddocumento = docalquiler.iddocalquiler
  left join mod_logactivofijotangible.dat_docenviadoreparar docreparar on d.iddocumento = docreparar.iddocenviadoreparar
  left join mod_logactivofijotangible.dat_doctransfentidades docentidades on d.iddocumento = docentidades.iddoctranfentidades
  where d.iddoc = any (cast ($2 as numeric[]))
  and d.estado in(3) 
  and (d.aprobadopor = $3 or $3 is null)  
  and (d.fechacontable >= (cast ($4 as date)) or $4 is null)
   and (d.fechacontable <= (cast ($9 as date)) or $9 is null)    
    and (d.estado = $5 or $5 is null)
     and (d.idusuario = $6 or $6 is null)
      and (d.nrodoc = $7 or $7 is null)
       and (dd.iddoc = $8 or $8 is null)
        and (d.idestructuracomun = $10 or $10 is null)
  and f.idfila in (select a.idfila from mod_estructuracomp.nom_filaestruc a 
  where a.parent_path <@ (select parent_path from mod_estructuracomp.nom_filaestruc where idfila = $1))
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

ALTER FUNCTION mod_logactivofijotangible.f_listado_doc_aft (idestructura numeric, idocs varchar, aprobadopor numeric, desde varchar, idestado numeric, idusuario numeric, nrodoc numeric, tipodoc numeric, hasta varchar, idarearesp numeric, idoperacion numeric)
  OWNER TO zeolides;




 ALTER TYPE mod_logactivofijotangible.td_listado_doc_aft
  ADD ATTRIBUTE importe NUMERIC(25,6),
  ADD ATTRIBUTE depreciacion NUMERIC(25,6);