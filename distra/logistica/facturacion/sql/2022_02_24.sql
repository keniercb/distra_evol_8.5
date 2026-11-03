 -- object recreation
DROP FUNCTION IF EXISTS mod_logfacturacion.f_listadofactura(p_idoperacion numeric, p_estado numeric, p_docorigen numeric, p_entregar numeric, p_tipodocumento varchar, p_creadopor numeric, p_fechainicio date, p_fechafin date, p_idestructura numeric, p_numeroref numeric, p_anno numeric, p_idestructuraop numeric, p_monedacontable numeric, p_monedaalternativa numeric, p_idperiodo numeric, p_idoperaciones varchar);

DROP TYPE IF EXISTS mod_logfacturacion.td_imprimirlistadofactura CASCADE;

CREATE TYPE mod_logfacturacion.td_imprimirlistadofactura AS (
  iddocumento NUMERIC(19,0),
  nrofactura VARCHAR(19),
  fechacontable DATE,
  entidad VARCHAR(255),
  estado VARCHAR(255),
  tipodocorigen VARCHAR(255),
  nrodocorigen VARCHAR(19),
  servicios NUMERIC(25,6),
  productos NUMERIC(25,6),
  nrodoc VARCHAR(255),
  deposito VARCHAR(255),
  logo TEXT,
  tipodoc VARCHAR(255),
  cliente VARCHAR(255),
  operacion VARCHAR(255),
  nrocontrol VARCHAR(255),
  fechaminima DATE,
  fechamaxima DATE,
  importecontable NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedacontable VARCHAR(30),
  monedaalternativa VARCHAR(30),
  peso NUMERIC(25,6),
  cronologia NUMERIC(19,0),
  centrocosto VARCHAR
);

ALTER TYPE mod_logfacturacion.td_imprimirlistadofactura
  OWNER TO zeolides;

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
  p_numeroref varchar,
  p_anno numeric,
  p_idestructuraop numeric,
  p_monedacontable numeric,
  p_monedaalternativa numeric,
  p_idperiodo numeric,
  p_idoperaciones varchar,
  p_centrocosto numeric
)
RETURNS SETOF mod_logfacturacion.td_imprimirlistadofactura AS
$body$
declare
all_rec mod_logfacturacion.td_imprimirlistadofactura;
v_idperiodo numeric;
v_ejercicio record;
begin
if p_idestructura is not null and p_fechainicio is null and p_fechafin is null 
and p_anno is null and p_idoperaciones is null and p_entregar is null then
v_ejercicio = mod_logistica.f_obtenerejercicioactivo(13, p_idestructura);
  v_idperiodo = v_ejercicio.idperiodoactual;
else v_idperiodo = null; end if;
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
(select array_to_string(array_agg(nop.denominacion),', ') from mod_datosmaestros.nom_operacion nop
  where (case when p_idoperaciones is not null then nop.idnomoperaciones = any(cast(p_idoperaciones as numeric[])) 
WHEN p_idoperacion is not null then nop.idnomoperaciones = p_idoperacion
else false end)) as operacion,
nc.nrocontrol,        
(select min(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logfacturacion.dat_docfactura ddisd on ddisd.idfactura = ddd.iddocumento 
where ddd.idestructuracomun = $9) as fechaminima,
(select max(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logfacturacion.dat_docfactura ddisd on ddisd.idfactura = ddd.iddocumento 
where ddd.idestructuracomun = $9) as fechamaxima,    
((select coalesce(sum(round(def.cantidad * dde.preciotarifa,2)),0) 
    from mod_logfacturacion.dat_elementosfactura def
    inner join mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
    where def.idfactura = dd.iddocumento and dde.idmoneda = p_monedacontable) +
    (select coalesce(sum(round(dmm.precio*(dm.cantidad-COALESCE((select mdev.cantidad from mod_logistica.dat_movimiento mdev
     where mdev.iddocumento in (select dev.iddocumento from mod_logistica.dat_documento dev
 inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
 inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = dev.iddoc
 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dprim.iddocumentos
 where ndp.abreviatura = 'valedev' and devp.idpadre = dd.iddocumento) and dm.idproducto = mdev.idproducto),0)),2)),0)
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
    where dm.iddocumento = dd.iddocumento and dmm.idmoneda = p_monedacontable ) +
    (select coalesce(-1 * sum(round(ddcp.valorcalculo,2)),0) 
    from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
    inner join mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
    where dcpf.idfactura = dd.iddocumento and ddcp.idmoneda = p_monedacontable and ddcp.concepto = '-') +
    (select coalesce(sum(round(ddcp.valorcalculo,2)),0)
    from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
    inner join mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
    where dcpf.idfactura = dd.iddocumento and ddcp.idmoneda = p_monedacontable and ddcp.concepto = '+')) as importecontable,   
/*(SELECT sum(fna.importealternativo) FROM mod_logfacturacion.f_modelofacturaprodimporte(dd.iddocumento,p_monedacontable,p_monedaalternativa) fna)*/0 as importealternativo,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,
(
  select  sum(mm.cantidad * coalesce(nni.peso,0))/1000
    from mod_logistica.dat_movimiento mm 
    inner join mod_logistica.dat_producto dpt on dpt.idproducto = mm.idproducto
    inner join mod_datosmaestros.nom_indicadorhoja nni on nni.idindicador = dpt.idindicador
    where mm.iddocumento = dd.iddocumento
),
dd.cronologia,
coalesce((SELECT cc.concat from mod_contabilidadcosto.nom_centrocosto cc where cc.idcentrogrupo = df.idcentrocosto),'') as centrocosto
from mod_logistica.dat_documento dd
inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
LEFT join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
LEFT join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
LEFT join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
LEFT join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
LEFT join mod_loginventario.conf_inventario ci on ci.idestructuracomun = desu.idestructuracomun
left join mod_estructuracomp.nom_filaestruc nf on nf.idfila = df.iddeposito 
left join mod_estructuracomp.dat_estructuraop deo on deo.idestructuraop = nf.idfila
LEFT join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_logistica.dat_documentocliente dc on dc.iddocumento = df.idfactura
left join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = df.idcliente
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
left join mod_logistica.conf_general i on i.idestructura = des.idestructura
/*left join mod_logfacturacion.dat_operacionsubsistema dos on dos.idsubsistema = df.idsubsistema
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dos.idnomoperaciones*/
left join mod_logfacturacion.dat_seriedocentidad dse on dse.idseriedocentidad = df.idseriedocentidad
left join mod_logfacturacion.nom_seriedocumento nsd on nsd.idseriedocumento = dse.idseriedocumento
left join mod_logfacturacion.dat_numerocontrol nc on nc.idnumerocontrol = df.idnumerocontrol
left join mod_logistica.dat_documentopadre ddpa on ddpa.iddocumento = dd.iddocumento
where /*dd.idestructuracomun = p_idestructura and*/ /*dd.idespecialidad = 1
--and */(case when p_idoperaciones is not null then dd.idoperacion = any(cast(p_idoperaciones as numeric[])) 
WHEN p_idoperacion is not null then dd.idoperacion = p_idoperacion
else true end)
--and (CASE WHEN p_idoperacion is null then true ELSE dd.idoperacion = p_idoperacion end)
and (CASE WHEN p_numeroref is null then true ELSE (CAST(dd.numeroref as varchar) = p_numeroref or cast(df.nrofactura as varchar) = p_numeroref or dd.observaciones ilike '%'||p_numeroref||'%') end)
and (CASE WHEN p_entregar is null then true ELSE dc.idcliente = p_entregar end)
and (CASE WHEN p_tipodocumento is null then true ELSE dd.iddoc = any(cast(p_tipodocumento as numeric[])) end)
and (CASE WHEN p_estado is null then dd.estado not in(7,5,6,8) ELSE dd.estado = p_estado end)
and (CASE WHEN p_anno is null then true ELSE dd.anno = p_anno end)
and (CASE WHEN p_creadopor is null then true ELSE su.idusuario = p_creadopor end)
and (CASE WHEN p_docorigen is null then true ELSE ddpa.idpadre = p_docorigen end)
and (CASE WHEN p_idestructuraop is null then true ELSE df.iddeposito = p_idestructuraop end)
and (CASE WHEN p_fechainicio is null then true ELSE dd.fechacontable >= p_fechainicio end)
and (CASE WHEN p_fechafin is null then true ELSE dd.fechacontable <= p_fechafin end)
and (CASE WHEN v_idperiodo is null then true ELSE dd.idperiodo = v_idperiodo end)
and (CASE WHEN p_centrocosto is null then true ELSE df.idcentrocosto = p_centrocosto end)
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

ALTER FUNCTION mod_logfacturacion.f_listadofactura (p_idoperacion numeric, p_estado numeric, p_docorigen numeric, p_entregar numeric, p_tipodocumento varchar, p_creadopor numeric, p_fechainicio date, p_fechafin date, p_idestructura numeric, p_numeroref varchar, p_anno numeric, p_idestructuraop numeric, p_monedacontable numeric, p_monedaalternativa numeric, p_idperiodo numeric, p_idoperaciones varchar, p_centrocosto numeric)
  OWNER TO zeolides;
  
  
 -- object recreation
DROP FUNCTION IF EXISTS mod_logfacturacion.f_ofertarealizada(p_idestructura numeric, p_idoperacion varchar, p_idestructuraop varchar, p_fechainicio date, p_fechafin date, p_creadopor numeric, p_estado varchar, p_entregar varchar, p_transportador varchar, p_indicador varchar, p_iddoc numeric, p_monedacontable numeric, p_monedaalternativa numeric, p_idserviciotaller varchar);

DROP TYPE IF EXISTS mod_logfacturacion.td_ofertarealizada CASCADE;

CREATE TYPE mod_logfacturacion.td_ofertarealizada AS (
  iddocumento NUMERIC(19,0),
  nrofactura NUMERIC(19,0),
  fechacontable DATE,
  entidad VARCHAR(255),
  estado VARCHAR(255),
  tipodocorigen VARCHAR(255),
  nrodocorigen VARCHAR(19),
  servicios NUMERIC(25,6),
  productos NUMERIC(25,6),
  nrodoc VARCHAR(255),
  deposito VARCHAR(255),
  logo TEXT,
  tipodoc VARCHAR(255),
  cliente VARCHAR(255),
  operacion VARCHAR(255),
  nrocontrol VARCHAR(255),
  fechaminima DATE,
  fechamaxima DATE,
  importecontable NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedacontable VARCHAR(30),
  monedaalternativa VARCHAR(30),
  peso NUMERIC(25,6),
  nrorden VARCHAR,
  centrocosto VARCHAR
);

ALTER TYPE mod_logfacturacion.td_ofertarealizada
  OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_ofertarealizada (
  p_idestructura numeric,
  p_idoperacion varchar,
  p_idestructuraop varchar,
  p_fechainicio date,
  p_fechafin date,
  p_creadopor numeric,
  p_estado varchar,
  p_entregar varchar,
  p_transportador varchar,
  p_indicador varchar,
  p_iddoc numeric,
  p_monedacontable numeric,
  p_monedaalternativa numeric,
  p_idserviciotaller varchar,
  p_centrocosto varchar
)
RETURNS SETOF mod_logfacturacion.td_ofertarealizada AS
$body$
DECLARE

all_rec mod_logfacturacion.td_ofertarealizada;

BEGIN

for all_rec in
    select
    distinct dd.iddocumento,
    dd.numeroref as referencia,
    dd.fechacontable,
    des.denominacion,
    case when dd.estado = 1 then 'Elaboraci�n'
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
     inner join mod_logfacturacion.dat_actividadesfactura daf on daf.idelementofactura = def.idelementofactura where def.idfactura = dd.iddocumento )) as servicios, 
     ((select count(def.idelementofactura) from mod_logfacturacion.dat_elementosfactura def 
     inner join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura
     where dpn.tipo = 1 and def.idfactura = dd.iddocumento)
     +(SELECT count (dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento)
     + (select count(def.idelementofactura) from mod_logfacturacion.dat_elementosfactura def 
     inner join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
     where  def.idfactura = dd.iddocumento)
     -
     (select count(mdev.idmovimiento) from mod_logistica.dat_movimiento mdev
     where mdev.iddocumento in (select dev.iddocumento from mod_logistica.dat_documento dev
 inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
 inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = dev.iddoc
 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dprim.iddocumentos
 where ndp.abreviatura = 'valedev' and devp.idpadre = dd.iddocumento))) as prodductos,
    
    (case when df.nrofactura is not null then btrim(concat(nsd.denominacion,'-',df.nrofactura), '-') end) as nrodocumento,
     deo.denominacion,
    i.urllogo as logo,
    ndp.denominacion as tipodoc,
    COALESCE(ncp.nombre,COALESCE(de.denominacion,''/*concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)*/)) as cliente,
    nop.denominacion as operacion,
    nc.nrocontrol,        
    (select min(ddd.fechacontable) 
    from mod_logistica.dat_documento ddd
    inner join mod_logfacturacion.dat_docfactura ddisd on ddisd.idfactura = ddd.iddocumento 
    where ddd.idestructuracomun = $1) as fechaminima,
    (select max(ddd.fechacontable) 
    from mod_logistica.dat_documento ddd
    inner join mod_logfacturacion.dat_docfactura ddisd on ddisd.idfactura = ddd.iddocumento 
    where ddd.idestructuracomun = $1) as fechamaxima,
    
    ((select coalesce(sum(def.cantidad * dde.preciotarifa),0) 
    from mod_logfacturacion.dat_elementosfactura def
    inner join mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
    where def.idfactura = dd.iddocumento and dde.idmoneda = $12) +
    (select coalesce(sum(dmm.precio*(dm.cantidad-COALESCE((select mdev.cantidad from mod_logistica.dat_movimiento mdev
     where mdev.iddocumento in (select dev.iddocumento from mod_logistica.dat_documento dev
 inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
 inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = dev.iddoc
 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dprim.iddocumentos
 where ndp.abreviatura = 'valedev' and devp.idpadre = dd.iddocumento) and dm.idproducto = mdev.idproducto),0))*(case when dmm.idmoneda = $12 then (
 case when dfm.idfactura is null or dfm.idmoneda is null then 1 else dfm.factorconvercion end
 ) else (
 coalesce(
 (select tsa.factordeconversion from mod_datosmaestros.dat_tasa tsa
 inner join mod_datosmaestros.dat_monedaentidad dme on dme.idmonedaentidad = tsa.idmonedacontable and dme.idmoneda = $12
 where tsa.idmoneda = dmm.idmoneda and tsa.idestructuracomun = dp.idestructuracomun and tsa.idtipotasa = (
 select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = dp.idestructuracomun limit 1
 ) limit 1)
 ,0)
 ) end)),0)
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
    left join mod_logfacturacion.dat_docfactura dfm on dfm.idfactura = dm.iddocumento
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
    where dm.iddocumento = dd.iddocumento and dmm.idmoneda = $12 ) +
    (select coalesce(-1 * sum(ddcp.valorcalculo),0) 
    from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
    inner join mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
    where dcpf.idfactura = dd.iddocumento and ddcp.idmoneda = $12 and ddcp.concepto = '-') +
    (select coalesce(sum(ddcp.valorcalculo),0)
    from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
    inner join mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
    where dcpf.idfactura = dd.iddocumento and ddcp.idmoneda = $12 and ddcp.concepto = '+')) as importecontable,
   
    ((select coalesce(sum(def.cantidad * dde.preciotarifa),0) 
    from mod_logfacturacion.dat_elementosfactura def
    inner join mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
    where def.idfactura = dd.iddocumento and dde.idmoneda = $13) +
    (select coalesce(sum(dmm.precio*(dm.cantidad-COALESCE((select mdev.cantidad from mod_logistica.dat_movimiento mdev
     where mdev.iddocumento in (select dev.iddocumento from mod_logistica.dat_documento dev
 inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
 inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = dev.iddoc
 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dprim.iddocumentos
 where ndp.abreviatura = 'valedev' and devp.idpadre = dd.iddocumento) and dm.idproducto = mdev.idproducto),0))),0)
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
    where dm.iddocumento = dd.iddocumento and dmm.idmoneda = $13 ) +
    (select coalesce(-1 * sum(ddcp.valorcalculo),0) 
    from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
    inner join mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
    where dcpf.idfactura = dd.iddocumento and ddcp.idmoneda = $13 and ddcp.concepto = '-') +
    (select coalesce(sum(ddcp.valorcalculo),0)
    from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
    inner join mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura
    where dcpf.idfactura = dd.iddocumento and ddcp.idmoneda = $13 and ddcp.concepto = '+')) as importealternativo,
    (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $12) as monedacontable,
    (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $13) as monedaalternativa,
    (
        select  sum(mm.cantidad * coalesce(nni.peso,0))/1000000
        from mod_logistica.dat_movimiento mm 
        inner join mod_logistica.dat_producto dpt on dpt.idproducto = mm.idproducto
        inner join mod_datosmaestros.nom_indicadorhoja nni on nni.idindicador = dpt.idindicador
        where mm.iddocumento = dd.iddocumento
    ),
    df.nrorden,
    coalesce((SELECT cc.concat from mod_contabilidadcosto.nom_centrocosto cc where cc.idcentrogrupo = df.idcentrocosto),'') as centrocosto
    from mod_logistica.dat_documento dd
    inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
    inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
    inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
    --inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
    inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = df.idfactura
    inner join mod_logistica.conf_general i on i.idestructura = des.idestructura    
    inner join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
--    left join mod_estructuracomp.v_dametodasestructuras nf on nf.idestructura = df.iddeposito 
    left join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = df.iddeposito
    inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = df.idcliente
    left join mod_estructuracomp.dat_estructura de on de.idestructura = ncp.idestructura
    --left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
    
    left join mod_logfacturacion.dat_seriedocentidad dse on dse.idseriedocentidad = df.idseriedocentidad
    left join mod_logfacturacion.nom_seriedocumento nsd on nsd.idseriedocumento = dse.idseriedocumento
    left join mod_logfacturacion.dat_numerocontrol nc on nc.idnumerocontrol = df.idnumerocontrol
    --left join mod_logistica.dat_documentopadre ddpa on ddpa.iddocumento = dd.iddocumento
    --left join mod_logtaller.dat_ordentrabajo ord on ord.idordentrabajo = ddpa.idpadre
    --left join mod_logtaller.dat_trabajoservicio dts on dts.idordentrabajo = ord.idordentrabajo
    where des.idestructura = p_idestructura and dd.iddoc = p_iddoc
    and (case when p_idoperacion is not null then nop.idnomoperaciones = any(cast(p_idoperacion as numeric[])) else true end)
    and (case when p_centrocosto is not null then df.idcentrocosto = any(cast(p_centrocosto as numeric[])) else true end) 
    and (case when p_idestructuraop is not null then df.iddeposito = any(cast(p_idestructuraop as numeric[])) else true end) 
    and (case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end) 
    and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end)
    and (case when p_creadopor is not null then (dd.idusuario = p_creadopor) else true end)
    and (case when p_estado is null then dd.estado in(4) else dd.estado = any(cast(p_estado as numeric[])) end)
    and (case when p_entregar is not null then dc.idcliente = any(cast(p_entregar as numeric[])) else true end)
    and (case when p_transportador is not null then df.idproveedor = any(cast(p_transportador as numeric[])) else true end)
  --  and (case when p_idserviciotaller is not null then dts.idservicio = any(cast(p_idserviciotaller as numeric[])) else true end)
    and (case when p_indicador is not null then (dd.iddocumento in(select adm.iddocumento from mod_logistica.dat_movimiento adm  left join mod_logistica.dat_producto adp on adp.idproducto = adm.idproducto
    where adm.iddocumento = dd.iddocumento and adp.idindicador = any(cast(p_indicador as numeric[]))) 
        or dd.iddocumento in(select def.idfactura from mod_logfacturacion.dat_elementosfactura def 
          left join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura
          left join mod_logfacturacion.dat_activosfactura daft on daft.idelementofactura = def.idelementofactura  
      where def.idfactura = dd.iddocumento and (dpsn.idindicador = any(cast(p_indicador as numeric[])) or daft.idindicador = any(cast(p_indicador as numeric[]))))) else true end)
 
  /*group by nop.denominacion,dd.numeroref,dd.fechacontable,des.denominacion,dd.estado,dd.iddocumento,df.nrofactura,nsd.denominacion,deo.denominacion,i.urllogo,ndp.denominacion,ncp.nombre,
  de.denominacion,dp.nombre,dp.snombre,dp.papel,dp.sapel,nc.nrocontrol*/   
  --order by nop.denominacion desc
  union
  select
    distinct dd.iddocumento,
    dd.numeroref as referencia,
    dd.fechacontable,
    des.denominacion,
    case when dd.estado = 1 then 'Elaboraci�n'
         when dd.estado = 2 then 'Preparado'
         when dd.estado = 3 then 'Aprobado'
         when dd.estado = 4 then 'Contabilizado'
         when dd.estado = 7 then 'Cancelado'
         else 'Sin estado' end as estado,
    '' as tipodocorigen,
    
    null as docorigen,
    
     0 as servicios, 
     ((SELECT count (dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento)) as prodductos,
    
    ''||dd.nrodoc as nrodocumento,
     deo.denominacion,
    i.urllogo as logo,
    ndp.denominacion as tipodoc,
    --COALESCE(ncp.nombre,COALESCE(de.denominacion,''/*concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)*/)) as cliente,
    (case when ndp.abreviatura = 'compventaLog' then (
    	select vc.numeroidentidad|| ' '||vc.nombre from mod_logpuntoventa.dat_ventacliente vc
        inner join mod_logpuntoventa.dat_ventas vent on vent.idpersona = vc.idventacliente
        where vent.idventas = dd.iddocumento
    ) else (
    	select vc.numeroidentidad|| ' '||vc.nombre from mod_logpuntoventa.dat_ventacliente vc
        inner join mod_logpuntoventa.dat_ventas vent on vent.idpersona = vc.idventacliente
        inner join mod_logpuntoventa.dat_devolucion dev on dev.idventas = vent.idventas
        where dev.iddevolucion = dd.iddocumento
    ) end) as cliente,
    nop.denominacion as operacion,
    null,        
    (select min(ddd.fechacontable) 
    from mod_logistica.dat_documento ddd
    where ddd.idestructuracomun = $1) as fechaminima,
    (select max(ddd.fechacontable) 
    from mod_logistica.dat_documento ddd
    where ddd.idestructuracomun = $1) as fechamaxima,
    
    (case when ndp.abreviatura = 'compventaLog' then 
    (select coalesce(round(sum(dmm.precio*dm.cantidad*coalesce(
   (select tsa.factordeconversion from mod_datosmaestros.dat_tasa tsa
   inner join mod_datosmaestros.dat_monedaentidad dme on dme.idmonedaentidad = tsa.idmonedacontable and dme.idmoneda = $12
   where tsa.idmoneda = dmm.idmoneda and tsa.idestructuracomun = des.idestructura and tsa.idtipotasa = (
   select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = des.idestructura limit 1
   ) limit 1)
   ,0)),2),0)
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
    where dm.iddocumento = dd.iddocumento and dmm.idmoneda <> $12) when ndp.abreviatura = 'compdevLog' then
    (-1*(select coalesce(round(sum(dmm.precio*dm.cantidad*coalesce(
   (select tsa.factordeconversion from mod_datosmaestros.dat_tasa tsa
   inner join mod_datosmaestros.dat_monedaentidad dme on dme.idmonedaentidad = tsa.idmonedacontable and dme.idmoneda = $12
   where tsa.idmoneda = dmm.idmoneda and tsa.idestructuracomun = des.idestructura and tsa.idtipotasa = (
   select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = des.idestructura limit 1
   ) limit 1)
   ,0)),2),0)
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
    where dm.iddocumento = dd.iddocumento and dmm.idmoneda <> $12))
    else (select coalesce(sum(dmm.precio*dm.cantidad),0)
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
    where dm.iddocumento = dd.iddocumento and dmm.idmoneda = $12 ) end) as importecontable,
    (case when ndp.abreviatura = 'compventaLog' then (select coalesce(sum(dmm.precio*dm.cantidad),0)
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
    where dm.iddocumento = dd.iddocumento and dmm.idmoneda <> $12 ) else (-1*(
    select sum(COALESCE(dmov.precioventa*dmov.cantidaddevolver,0)) from mod_logpuntoventa.dat_productodevolucion dmov
    where dmov.iddevolucion = dd.iddocumento
    ))end) as importealternativo,
    (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $12) as monedacontable,
    (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $13) as monedaalternativa,
    (
        select  sum(mm.cantidad * coalesce(nni.peso,0))/1000000
        from mod_logistica.dat_movimiento mm 
        inner join mod_logistica.dat_producto dpt on dpt.idproducto = mm.idproducto
        inner join mod_datosmaestros.nom_indicadorhoja nni on nni.idindicador = dpt.idindicador
        where mm.iddocumento = dd.iddocumento
    ),
    '' as nrorden,
    '' as centrocosto
    from mod_logistica.dat_documento dd
    inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
    inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
    --inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
    inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = dd.iddocumento
    inner join mod_logistica.conf_general i on i.idestructura = des.idestructura    
    inner join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
--    left join mod_estructuracomp.v_dametodasestructuras nf on nf.idestructura = df.iddeposito 
    left join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = dd.idestructuracomun
    inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dc.idcliente
    left join mod_estructuracomp.dat_estructura de on de.idestructura = ncp.idestructura
    --left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
    --left join mod_logistica.dat_documentopadre ddpa on ddpa.iddocumento = dd.iddocumento
    --left join mod_logtaller.dat_ordentrabajo ord on ord.idordentrabajo = ddpa.idpadre
    --left join mod_logtaller.dat_trabajoservicio dts on dts.idordentrabajo = ord.idordentrabajo
    where des.idestructura = p_idestructura and ndp.abreviatura in ('compventaLog', 'compdevLog')
    and (case when p_idoperacion is not null then nop.idnomoperaciones = any(cast(p_idoperacion as numeric[])) else true end) 
    and (case when p_idestructuraop is not null then dd.idestructuracomun = any(cast(p_idestructuraop as numeric[])) else true end) 
    and (case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end) 
    and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end)
    and (case when p_creadopor is not null then (dd.idusuario = p_creadopor) else true end)
    and (case when p_estado is null then dd.estado in(4) else dd.estado = any(cast(p_estado as numeric[])) end)
    and (case when p_entregar is not null then dc.idcliente = any(cast(p_entregar as numeric[])) else true end)
  --  and (case when p_idserviciotaller is not null then dts.idservicio = any(cast(p_idserviciotaller as numeric[])) else true end)
    and (case when p_indicador is not null then (dd.iddocumento in(select adm.iddocumento from mod_logistica.dat_movimiento adm  left join mod_logistica.dat_producto adp on adp.idproducto = adm.idproducto
    where adm.iddocumento = dd.iddocumento and adp.idindicador = any(cast(p_indicador as numeric[]))) 
        ) else true end)
 
  /*group by nop.denominacion,dd.numeroref,dd.fechacontable,des.denominacion,dd.estado,dd.iddocumento,df.nrofactura,nsd.denominacion,deo.denominacion,i.urllogo,ndp.denominacion,ncp.nombre,
  de.denominacion,dp.nombre,dp.snombre,dp.papel,dp.sapel,nc.nrocontrol*/   
  order by centrocosto, operacion desc
loop
return next all_rec;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION "mod_logfacturacion"."f_ofertarealizada"(p_idestructura numeric, p_idoperacion varchar, p_idestructuraop varchar, p_fechainicio date, p_fechafin date, p_creadopor numeric, p_estado varchar, p_entregar varchar, p_transportador varchar, p_indicador varchar, p_iddoc numeric, p_monedacontable numeric, p_monedaalternativa numeric, p_idserviciotaller varchar, p_centrocosto varchar)
  OWNER TO zeolides;