DROP FUNCTION mod_loginventario.f_modeloapertura(p_iddocumento numeric);
DROP TYPE mod_loginventario.td_modeloapertura;

CREATE TYPE mod_loginventario.td_modeloapertura AS (
  almacen VARCHAR,
  nrodoc VARCHAR,
  fechacreacion DATE,
  deposito VARCHAR,
  aprobadopor VARCHAR,
  observaciones VARCHAR,
  logo TEXT,
  reeup VARCHAR,
  aliasdoc VARCHAR,
  estado NUMERIC(2,0),
  numeroref NUMERIC(19,0),
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR
);

ALTER TYPE mod_loginventario.td_modeloapertura
  OWNER TO zeolides;
  
  
CREATE OR REPLACE FUNCTION mod_loginventario.f_modeloapertura (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modeloapertura AS
$body$
declare
  all_rec mod_loginventario.td_modeloapertura;
begin
for all_rec in
select distinct
(case when de.idestructura is not null then btrim(de.denominacion,'-') else btrim(deopa.denominacion,'-') end),
cast(dd.nrodoc as varchar) as numerodocumento,
dd.fechacontable,
btrim(concat(deop.codigo,'-',deop.denominacion),'-'),
dpf.nombreaprobadopor as aprobadopor,
dd.observaciones,
i.urllogo as icono,
coalesce(de.codigo, deopa.codigo),
ddp.sigla,
dd.estado,
dd.numeroref,
dpf.nombrecreadopor as nombrepersona,
dpf.cargocreadopor as cargopersona,
dpf.nombreaprobadopor as nombrepersonaprobar,
dpf.cargoaprobadopor as cargopersonaprobar
from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopa on deopa.idestructuraop = des.idestructuracomun
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos 
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
left join mod_logistica.dat_piefirmadocumento dpf on dpf.iddocumento = dd.iddocumento
left join mod_logistica.conf_general i on (i.idestructura = de.idestructura OR i.idestructura = deopa.idestructuraop)
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

ALTER FUNCTION mod_loginventario.f_modeloapertura (p_iddocumento numeric)
  OWNER TO zeolides; 