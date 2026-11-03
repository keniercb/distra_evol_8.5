CREATE OR REPLACE FUNCTION mod_logfacturacion.f_listadofactura (
  p_idoperacion numeric,
  p_estado numeric,
  p_docorigen numeric,
  p_entregar numeric,
  p_tipodocumento varchar,
  p_creadopor numeric,
  p_fechainicio date,
  p_fechafin date,
  p_idestructura numeric,
  p_numeroref numeric,
  p_anno numeric,
  p_idestructuraop numeric,
  p_monedacontable numeric,
  p_monedaalternativa numeric,
  p_idperiodo numeric
)
RETURNS SETOF mod_logfacturacion.td_imprimirlistadofactura AS
$body$
declare
all_rec mod_logfacturacion.td_imprimirlistadofactura;
begin
for all_rec in
select DISTINCT dd.iddocumento,
cast(dd.numeroref as varchar) as referencia,
dd.fechacontable,

btrim(concat(des.codigo,'-',des.denominacion),'-') as entidad,

case when dd.estado = 1 then 'Elaboración'
     when dd.estado = 2 then 'Preparado'
     when dd.estado = 3 then 'Aprobado'
     when dd.estado = 4 then 'Contabilizado'
     when dd.estado = 7 then 'Cancelado'
     else 'Sin estado' end as estado,
(select nd.denominacion 
from mod_logistica.dat_documento dd1 
inner join mod_logistica.dat_documentopadre dp on dp.idpadre = dd1.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.nom_docprim nd on nd.iddocumentos = ddp1.iddocumentos 
where dp.iddocumento = dd.iddocumento /*and (dp.denominacion = $5 or $5 is null)*/ limit 1) as tipodocorigen,
    
(select coalesce( (select string_agg(cast((case when (btrim(concat(nsd1.denominacion,'-',ddf.nrofactura), '-') <> '') then btrim(concat(nsd1.denominacion,'-',ddf.nrofactura), '-') end) as varchar),',')) --btrim(concat(nsd1.denominacion,'-',ddf.nrofactura), '-')
,(select string_agg(cast(dd2.nrodoc as varchar),','))) 
from mod_logistica.dat_documento dd2 
inner join mod_logistica.dat_documentopadre dp1 on dp1.idpadre = dd2.iddocumento
left join mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dp1.idpadre
left join mod_logfacturacion.dat_seriedocentidad dsd1 on  dsd1.idseriedocentidad = ddf.idseriedocentidad
left join mod_logfacturacion.nom_seriedocumento nsd1 on nsd1.idseriedocumento = dsd1.idseriedocumento
where dp1.iddocumento = dd.iddocumento) as docorigen,
    
( (select count(def.idelementofactura) from mod_logfacturacion.dat_elementosfactura def 
 inner join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura
 where dpn.tipo = 2 and def.idfactura = dd.iddocumento)
 +(select count(def.idelementofactura) from mod_logfacturacion.dat_elementosfactura def
 inner join mod_logfacturacion.dat_actividadesfactura daf on daf.idelementofactura = def.idelementofactura where def.idfactura = dd.iddocumento ))as servicios,
      
((select count(def.idelementofactura) from mod_logfacturacion.dat_elementosfactura def 
 inner join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura
 where dpn.tipo = 1 and def.idfactura = dd.iddocumento)
 +(SELECT count (dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento)
 + (select count(def.idelementofactura) from mod_logfacturacion.dat_elementosfactura def 
 inner join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
 where  def.idfactura = dd.iddocumento) )as prodductos,
    
(case when df.idseriedocentidad is not null then btrim(concat(nsd.denominacion,'-',df.nrofactura), '-') else CAST(df.nrofactura as varchar) end) as nrodocumento,
 deo.denominacion,
i.urllogo as logo,
ndp.denominacion as tipodoc,
COALESCE(ncp.nombre,COALESCE(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente,
nop.denominacion as operacion,
nc.nrocontrol,        
(select min(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logfacturacion.dat_docfactura ddisd on ddisd.idfactura = ddd.iddocumento 
where ddd.idestructuracomun = $9) as fechaminima,
(select max(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logfacturacion.dat_docfactura ddisd on ddisd.idfactura = ddd.iddocumento 
where ddd.idestructuracomun = $9) as fechamaxima,    
(SELECT sum(fnc.importe) FROM mod_logfacturacion.f_modelofacturaprodimporte(dd.iddocumento,p_monedacontable,p_monedaalternativa) fnc) as importecontable,   
(SELECT sum(fna.importealternativo) FROM mod_logfacturacion.f_modelofacturaprodimporte(dd.iddocumento,p_monedacontable,p_monedaalternativa) fna) as importealternativo,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,
(
  select  sum(mm.cantidad * coalesce(nni.peso,0))/1000
    from mod_logistica.dat_movimiento mm 
    inner join mod_logistica.dat_producto dpt on dpt.idproducto = mm.idproducto
    inner join mod_datosmaestros.nom_indicadorhoja nni on nni.idindicador = dpt.idindicador
    where mm.iddocumento = dd.iddocumento
),
dd.cronologia
from mod_logistica.dat_documento dd
INNER join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
INNER join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
INNER join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
INNER join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
INNER JOIN mod_datosmaestros.dat_fecha fe on desu.idestructurasubsist = fe.idestructurasubsist 
LEFT join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
LEFT join mod_loginventario.conf_inventario ci on ci.idestructuracomun = desu.idestructuracomun
LEFT join mod_estructuracomp.nom_filaestruc nf on nf.idfila = df.iddeposito 
LEFT join mod_estructuracomp.dat_estructuraop deo on deo.idestructuraop = nf.idfila
LEFT join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
LEFT join mod_logistica.dat_documentocliente dc on dc.iddocumento = df.idfactura
LEFT join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = df.idcliente
LEFT join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
LEFT join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
LEFT join mod_logistica.conf_general i on i.idestructura = des.idestructura
LEFT join mod_logfacturacion.dat_operacionsubsistema dos on dos.idsubsistema = df.idsubsistema
LEFT join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dos.idnomoperaciones
LEFT join mod_logfacturacion.dat_seriedocentidad dse on dse.idseriedocentidad = df.idseriedocentidad
LEFT join mod_logfacturacion.nom_seriedocumento nsd on nsd.idseriedocumento = dse.idseriedocumento
LEFT join mod_logfacturacion.dat_numerocontrol nc on nc.idnumerocontrol = df.idnumerocontrol
LEFT join mod_logistica.dat_documentopadre ddpa on ddpa.iddocumento = dd.iddocumento
where /*dd.idestructuracomun = p_idestructura and*/ --dd.idespecialidad = 1 and 
 EXTRACT(MONTH FROM dd.fechacontable)  = EXTRACT(MONTH FROM fe.fecha)
AND (CASE WHEN p_idoperacion is null then true ELSE nop.idnomoperaciones = p_idoperacion end)
and (CASE WHEN p_numeroref is null then true ELSE dd.numeroref = p_numeroref end)
and (CASE WHEN p_entregar is null then true ELSE dc.idcliente = p_entregar end)
and (CASE WHEN p_tipodocumento is null then true ELSE dd.iddoc = any(cast(p_tipodocumento as numeric[])) end)
and (CASE WHEN p_estado is null then dd.estado in(1,2,3,4) ELSE dd.estado = p_estado end)
and (CASE WHEN p_anno is null then true ELSE dd.anno = p_anno end)
and (CASE WHEN p_creadopor is null then true ELSE su.idusuario = p_creadopor end)
and (CASE WHEN p_docorigen is null then true ELSE ddpa.idpadre = p_docorigen end)
and (CASE WHEN p_idestructuraop is null then true ELSE df.iddeposito = p_idestructuraop end)
and (CASE WHEN p_fechainicio is null then true ELSE dd.fechacontable >= p_fechainicio end)
and (CASE WHEN p_fechafin is null then true ELSE dd.fechacontable <= p_fechafin end)
ORDER BY dd.cronologia
loop
return next all_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_listadofactura (p_idoperacion numeric, p_estado numeric, p_docorigen numeric, p_entregar numeric, p_tipodocumento varchar, p_creadopor numeric, p_fechainicio date, p_fechafin date, p_idestructura numeric, p_numeroref numeric, p_anno numeric, p_idestructuraop numeric, p_monedacontable numeric, p_monedaalternativa numeric, p_idperiodo numeric)
  OWNER TO zeolides;