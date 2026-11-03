CREATE TYPE mod_loginventario.td_recsubmovcombustible AS (
  entradacant NUMERIC(25,6),
  entradaimp NUMERIC(25,2),
  salidacant NUMERIC(25,6),
  salidaimp NUMERIC(25,2)
);

ALTER TYPE mod_loginventario.td_recsubmovcombustible
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.f_recsubmovcombustible (
  p_idproducto numeric,
  p_idoperaciones varchar,
  p_iddocs varchar,
  p_iddoc numeric,
  p_fechainicio date,
  p_fechafin date,
  p_idtipodocs varchar,
  p_idlote numeric,
  p_idnroserie numeric,
  p_idpartida numeric,
  p_idmonedacontable numeric,
  p_idmonedaalternativa numeric,
  p_codigo varchar
)
RETURNS SETOF mod_loginventario.td_recsubmovcombustible AS
$body$
declare 
v_rec mod_loginventario.td_recsubmovcombustible;
begin
for v_rec in
with q as (select 
(case when dm.signo ='+' then round(sum(dm.cantidad),6) else 0 end) as entradacant,
(case when dm.signo ='+' then round(sum(dm.importecontable),2) else 0 end) as entradaimp,  
(case when dm.signo ='-' then round(sum(dm.cantidad), 6) else 0 end) as salidacant, 
(case when dm.signo ='-' then round(sum(dm.importecontable),2) else 0 end) as salidaimp
from mod_logistica.dat_movimiento dm
inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento
left join mod_logistica.dat_movlote dml on dml.idmovimiento = dm.idmovimiento and p_idlote is not null
left join mod_logistica.dat_lote dl on dl.idproducto = dp.idproducto and p_idlote is not null
left join mod_loginventario.dat_movnroserie dmns on dmns.idmovimiento = dm.idmovimiento and p_idnroserie is not null
left join mod_loginventario.dat_movproductomunic dmpm on dmpm.idmovimiento = dm.idmovimiento and p_idpartida is not null
left join mod_loginventario.dat_movtransferenciamunic dmtm on dmtm.idmovimiento = dm.idmovimiento and p_idpartida is not null
left join mod_loginventario.dat_productomunic dpm on dpm.idproducto = dp.idproducto and p_idpartida is not null
left join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dd.idestructuracomun
left join mod_loginventario.dat_recepcion rec on rec.iddocumento = dd.iddocumento
where dd.cronologia > 0 
and (ni.codigo ilike '%' || p_codigo || '%' or ni.numeropieza ilike '%' || p_codigo || '%' or nih.codigoauxiliar ilike '%' || p_codigo || '%')
and (dm.signo in('+','-'))
and (case when p_idproducto is not null then dm.idproducto = p_idproducto else true end)
and (case when p_iddoc is not null then dd.iddoc <> p_iddoc else true end)
and ((dd.fechacontable >= p_fechainicio or p_fechainicio is null) and (dd.fechacontable <= p_fechafin or p_fechafin is null))
and (case when p_idtipodocs is not null then dd.iddoc = any(cast(p_idtipodocs as numeric[])) else true end)
and ndp.abreviatura <> 'cambioccontableLog' 
and dp.idestructuracomun not in (200530261)
group by dp.idproducto,dm.signo)
select sum(q.entradacant) as entradacant,sum(q.entradaimp) as entradaimp,
sum(q.salidacant) as salidacant,sum(q.salidaimp) as salidaimp  from q
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

ALTER FUNCTION mod_loginventario.f_recsubmovcombustible (p_idproducto numeric, p_idoperaciones varchar, p_iddocs varchar, p_iddoc numeric, p_fechainicio date, p_fechafin date, p_idtipodocs varchar, p_idlote numeric, p_idnroserie numeric, p_idpartida numeric, p_idmonedacontable numeric, p_idmonedaalternativa numeric, p_codigo varchar)
  OWNER TO zeolides;