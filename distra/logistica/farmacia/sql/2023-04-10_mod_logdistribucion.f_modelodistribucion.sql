
DROP TYPE mod_logdistribucion.td_modelodistribucion;

CREATE TYPE mod_logdistribucion.td_modelodistribucion AS (
  entidad VARCHAR,
  nrodoc NUMERIC(19,0),
  fechacontable DATE,
  observaciones VARCHAR,
  logo TEXT,
  reeup VARCHAR,
  aliasdoc VARCHAR,
  estado NUMERIC(2,0),
  suministrador VARCHAR,
  especialidad VARCHAR,
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR,
  denominventario VARCHAR(255),
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedaalternativa VARCHAR,
  monedacontable VARCHAR,
  farmacia NUMERIC(1,0)
);

ALTER TYPE mod_logdistribucion.td_modelodistribucion
  OWNER TO zeolides;
  
  
  
CREATE OR REPLACE FUNCTION mod_logdistribucion.f_modelodistribucion (
  p_iddocumento numeric
)
RETURNS SETOF mod_logdistribucion.td_modelodistribucion AS
$body$
declare
 all_rec mod_logdistribucion.td_modelodistribucion;
begin
 for all_rec in
select DISTINCT
btrim(concat(dd.nrodoc,'-',de.codigo,'-',de.denominacion),'-'),
dd.nrodoc,
dd.fechacontable,
dd.observaciones,
i.urllogo,
de.codigo as reuup,
ndp.denominacion,
dd.estado,
(select btrim((array_to_string(array_agg
(distinct (case when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun <> ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre
),'-',
(select denominacion from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun)
),'-')) 

when dp.idestructuracomun = ci.idestructuracomun and ci.idestructuracomun = ci.idpadre then (btrim(concat((
select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = dp.idestructuracomun
),'-',
(select denominacion from mod_estructuracomp.dat_estructuraop where idestructuraop = dp.idestructura)
),'-')) 
end)) ,',')) ,',')
from mod_logdistribucion.dat_prodorden dpo 
left join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto 
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = dp.idestructuracomun 
where dpo.idorden = dd.iddocumento) as suministrador,

btrim((select array_to_string(array_agg(ne.denespecialidad ),',')
from mod_datosmaestros.nom_especialidad ne
inner join mod_logistica.conf_usuarioespecialidad cu on cu.idespecialidad = ne.idespecialidad
where cu.idusuario = dd.idusuario),',') as especialidad,
(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.idusuario) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.idusuario  limit 1) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.aprobadopor) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar,
(select btrim(concat(a.codigo,'-',a.denominacion),'-') 
from mod_estructuracomp.v_dametodasestructuras a 
inner join mod_loginventario.conf_inventario ci on ci.idpadre = a.idestructura
where ci.idpadre = des.idestructuracomun) as denominventario,
(CASE WHEN (SELECT cb.idcuadrobasico FROM mod_logfarmacia.conf_cuadrobasico cb limit 1) IS NOT NULL THEN 1 ELSE 0 END) AS farmacia
from mod_logistica.dat_documento dd 
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_logdistribucion.dat_distribucion ddis on ddis.iddistribucion = dd.iddocumento
left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logdistribucion.f_modelodistribucion (p_iddocumento numeric)
  OWNER TO zeolides;