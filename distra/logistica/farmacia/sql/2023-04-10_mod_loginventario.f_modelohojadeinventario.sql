CREATE TYPE mod_loginventario.td_modelohojadeinventario AS (
  nrodoc VARCHAR,
  fechacreacion DATE,
  deposito VARCHAR,
  creadopor VARCHAR,
  nroajuste VARCHAR,
  aliasdoc VARCHAR,
  estado NUMERIC(2,0),
  numeroref NUMERIC(19,0),
  entidad VARCHAR,
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR,
  observaciones VARCHAR,
  logo VARCHAR,
  reup VARCHAR
);

ALTER TYPE mod_loginventario.td_modelohojadeinventario
  OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelohojadeinventario (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modelohojadeinventario AS
$body$
declare
  v_rec  mod_loginventario.td_modelohojadeinventario;
begin
for v_rec in
select distinct
cast(dd.nrodoc as varchar) as numerodocumento,
dd.fechacontable,
dd.estructuracompleta as deposito,
dd.nombrepersona as creadopor,
(select string_agg(cast(ddi.nrodoc as varchar),',') from mod_loginventario.dat_ajuste da
inner join mod_logistica.dat_documento ddi on ddi.iddocumento = da.idajuste
where da.idinventario = dd.iddocumento) as nroajuste,
dd.documentoprimario,
dd.idestado,
dd.numeroref,
(case when dd.entidad is not null then dd.entidad else dpr.estructura end),

dd.nombrepersona,
dd.cargopersona,
dd.nombrepersonaprobar,
dd.cargopersonaprobar,
dd.observaciones,
dd.logo,
''
from mod_logistica.v_documento dd
LEFT JOIN mod_logistica.v_documentoprimario dpr ON dpr.iddoc = dd.iddoc
where dd.iddocumento = p_iddocumento
limit 1
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

ALTER FUNCTION mod_loginventario.f_modelohojadeinventario (p_iddocumento numeric)
  OWNER TO zeolides;