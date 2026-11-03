
DROP FUNCTION mod_logactivofijotangible.f_listado_doc_aft(idestructura numeric, idocs varchar, aprobadopor numeric, desde varchar, idestado numeric, idusuario numeric, nrodoc numeric, tipodoc numeric, hasta varchar, idarearesp numeric, idoperacion numeric);


CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listado_doc_aft (
  p_idestructura numeric,
  p_idocs varchar,
  p_aprobadopor numeric,
  p_desde varchar,
  p_idestado numeric,
  p_idusuario numeric,
  p_nrodoc numeric,
  p_tipodoc numeric,
  p_hasta varchar,
  p_idarearesp numeric,
  p_idoperacion numeric
)
RETURNS SETOF mod_logactivofijotangible.td_listado_doc_aft AS
$body$
declare
v_rec mod_logactivofijotangible.td_listado_doc_aft;
begin
for v_rec in 
  select distinct
  d.nrodoc,
  --nd.denominacion as documento,
  d.documentoprimario as documento,
  nop.denominacion as operacion,
  d.nombrepersona as usuario,
  d.nombrepersonaprobar as aprobadopor,
  --uc.nombreusuario as usuario,
  --ua.nombreusuario as aprobadopor,
  d.fechacontable,
  d.anno,
  (case when d.idestado = '1' then 'Elaboración'
  when d.idestado = '2' then 'Preparado'
  when d.idestado = '3' then 'Aprobado'
  when d.idestado = '5' then 'Anulado'
  when d.idestado = '6' then 'Cancelado' end) as estado,
  coalesce((select count(mrn.idmovregnumerico)
  from mod_logactivofijotangible.dat_movregnumerico mrn
  inner join mod_logistica.dat_movimiento m on mrn.idmovimiento = m.idmovimiento
  inner join mod_logistica.dat_documento d2 on m.iddocumento = d2.iddocumento
  where d2.iddocumento = d.iddocumento),0) as medios,
  --i.urllogo as icono,
  d.logo,
  COALESCE((select sum(mrna.valorcontable) + sum(mrna.valorcontablealternativo)
  from mod_logactivofijotangible.dat_movregnumerico mrn
  inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
  inner join mod_logistica.dat_movimiento m on mrn.idmovimiento = m.idmovimiento
  inner join mod_logistica.dat_documento d2 on m.iddocumento = d2.iddocumento
  where d2.iddocumento = d.iddocumento),0) as importe,

  COALESCE((select sum(mrna.depreciacionacumulada) + sum(mrna.depreciacionacumuladaalternativo)
  from mod_logactivofijotangible.dat_movregnumerico mrn
  inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
  inner join mod_logistica.dat_movimiento m on mrn.idmovimiento = m.idmovimiento
  inner join mod_logistica.dat_documento d2 on m.iddocumento = d2.iddocumento
  where d2.iddocumento = d.iddocumento),0) as depreciacion,
  m.iddocumento
  
  from mod_logistica.v_documento d
  
  left join mod_logistica.dat_movimiento m on d.iddocumento = m.iddocumento
  
  inner join mod_logactivofijotangible.dat_documentoactivo m2 ON m.iddocumento = m2.iddocumentoactivo
  /*inner join mod_datosmaestros.dat_documentoprim dd on d.iddoc = dd.iddoc
  inner join mod_datosmaestros.nom_docprim nd on dd.iddocumentos = nd.iddocumentos*/
  inner join mod_datosmaestros.nom_operacion nop on d.idoperacion = nop.idnomoperaciones
  left join mod_logistica.dat_producto p on m.idproducto = p.idproducto
  /*inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dd.idestructurasubsist*/
  
  --inner join mod_estructuracomp.nom_filaestruc f1 on f1.idfila = des.idestructuracomun 
  --left join mod_estructuracomp.dat_estructura de on de.idestructura = des.idestructuracomun
  --left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = des.idestructuracomun
  
  --left join mod_seguridad.seg_usuario uc on d.idusuario = uc.idusuario
  --left join mod_seguridad.seg_usuario ua on d.aprobadopor = ua.idusuario
  
  /*left join mod_logistica.conf_general i on i.idestructura = des.idestructuracomun*/
  
  inner join mod_estructuracomp.nom_filaestruc f on p.idestructura = f.idfila
  /*inner join mod_estructuracomp.v_dametodasestructuras v on v.idestructura = f.idfila
  left join mod_logactivofijotangible.dat_docalquiler docalquiler on d.iddocumento = docalquiler.iddocalquiler
  left join mod_logactivofijotangible.dat_docenviadoreparar docreparar on d.iddocumento = docreparar.iddocenviadoreparar
  left join mod_logactivofijotangible.dat_doctransfentidades docentidades on d.iddocumento = docentidades.iddoctranfentidades*/
  where /*d.iddoc = any (cast (p_idocs as numeric[]))*/ /*AND  nd.iddocumentos = 101 or nd.iddocumentos = 990000000019*/ /*or nd.iddocumentos = 990000000291*/
  d.idestado not in (5,10)
  and m2.tipo = 0
  and (d.aprobadopor = p_aprobadopor or p_aprobadopor is null)     
   and (case when p_desde is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd 
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = p.idproducto 
and dm.signo in ('+','-') limit 1)::character varying >= p_desde) else true end)
and (case when p_hasta is not null then 
((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento 
where dm.idproducto = p.idproducto and dm.signo in ('+','-') limit 1)::character varying <= p_hasta) else true end)
    and (d.idestado = p_idestado or p_idestado is null)
     and (d.creadopor = p_idusuario or p_idusuario is null)
      and (d.nrodoc::numeric = p_nrodoc or p_nrodoc is null)
       and (d.iddoc = p_tipodoc or p_tipodoc is null)
        and (d.idestructuracomun = p_idarearesp or p_idarearesp is null)
        and (d.idoperacion = p_idoperacion or p_idoperacion is null)
  and f.idfila in (select a.idfila from mod_estructuracomp.nom_filaestruc a 
  where a.parent_path <@ (select parent_path from mod_estructuracomp.nom_filaestruc where idfila = p_idestructura))
  ORDER BY m.iddocumento DESC
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

ALTER FUNCTION mod_logactivofijotangible.f_listado_doc_aft (p_idestructura numeric, p_idocs varchar, p_aprobadopor numeric, p_desde varchar, p_idestado numeric, p_idusuario numeric, p_nrodoc numeric, p_tipodoc numeric, p_hasta varchar, p_idarearesp numeric, p_idoperacion numeric)
  OWNER TO zeolides;