CREATE TYPE mod_loginventario.td_recepcionconceptos AS (
  concepto VARCHAR,
  importecontable NUMERIC(25,6),
  importealt NUMERIC(25,6)
);


CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcionconceptos (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_recepcionconceptos AS
$body$
declare
all_rec mod_loginventario.td_recepcionconceptos;
begin
for all_rec in
select distinct
nctp.denominacion as conceptos,
coalesce (dcir.valormn, 0) as importecontable,
coalesce (dcir.valorcalculoalt, 0) as importeelt
from mod_logistica.dat_documento dd
left join mod_loginventario.dat_conceptoimporterecep dcir on dcir.iddocumento = dd.iddocumento
left join mod_logfacturacion.nom_categoriaprecio nctp on nctp.idcategoriaprecio = dcir.idconceptoimporte
where dd.iddocumento = $1
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;