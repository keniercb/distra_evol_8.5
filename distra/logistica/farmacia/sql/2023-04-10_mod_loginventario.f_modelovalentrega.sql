
CREATE TYPE mod_loginventario.td_modelovaleentrega AS (
  almacen VARCHAR,
  nrodoc VARCHAR,
  fechacreacion DATE,
  reeup VARCHAR,
  aliasdoc VARCHAR,
  estado NUMERIC(2,0),
  denomestado VARCHAR,
  deposito VARCHAR,
  centrocosto VARCHAR,
  logo TEXT,
  nrodocorigen VARCHAR,
  fechadocumento DATE,
  denominacion VARCHAR,
  numeroref NUMERIC(19,0),
  observaciones VARCHAR,
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR,
  operacion VARCHAR
);

ALTER TYPE mod_loginventario.td_modeloapertura
  OWNER TO zeolides;



CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovalentrega (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modelovaleentrega AS
$body$
declare
  all_rec mod_loginventario.td_modelovaleentrega;
begin
for all_rec in
select distinct
(case when dd.entidad is not null then dd.entidad else de.denominacion end) as entidad,
dd.nrodoc as numerodocumento,
dd.fechacontable as fechadocumento,
dd.codigoentidad as reeup,
dd.documentoprimario,
dd.idestado,
dd.estado,
dd.estructuracompleta as deposito,
ddc.nombre as centrocosto,
dd.logo,
_dd.nrodoc as numerodocumentopadre,
_dd.fechacontable as fechadocumentopadre,
_dd.documentoprimario as documentoprimariopadre,
_dd.numeroref as numerorefpadre,
dd.observaciones,
dd.nombrepersona,
dd.cargopersona,
dd.nombrepersonaprobar,
dd.cargopersonaprobar,
no.denominacion as operacion
from mod_logistica.v_documento dd
left join mod_logistica.dat_documentopadre dpdre on dpdre.iddocumento = dd.iddocumento
LEFT join mod_logistica.v_documento _dd on _dd.iddocumento = dpdre.idpadre
inner join mod_logistica.v_documentocliente ddc on ddc.iddocumento = dd.iddocumento
left join mod_datosmaestros.nom_operacion no on no.idnomoperaciones = dd.idoperacion
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
WHERE dd.iddocumento = p_iddocumento
LIMIT 1
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelovalentrega (p_iddocumento numeric)
  OWNER TO zeolides;