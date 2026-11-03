DROP FUNCTION mod_loginventario.f_modelorecepcion(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcion (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_recepcion AS
$body$
declare
all_rec mod_loginventario.td_recepcion;
begin
for all_rec in
SELECT DISTINCT
dd.iddocumento,
--dd.entidad,
(case when dd.entidad is not null then dd.entidad else dpr.estructura end),
dd.estructuracompleta as deposito,
dd.nrodoc as numerodocumento,
dd.fechacontable as fechadocumento,
nop.denominacion as operacion,
dr.nrodocorigen,
vdp.fechacontable as fechareclamacion,
vdp.nrodoc as nroreclamacion,
dr.nrocontrato,
ddt.manifiesto,
ddt.partida,
ddt.casilla,
ddt.embarque,
ddt.cliente as entidadtransportadora,
ddt.nombreconductor,
ddt.ciconductor,
ddt.cartaporte,
ddt.matricula,
dd.logo,
dr.fechacontrato,
dd.observaciones,
ddc.nombre as suministrador,
dd.documentoprimario,
dd.codigoentidad as reeup,
dd.codigoestructura as codigoop,
ddc.codigo as codigosuministrador,
dd.estado,
(CASE WHEN vdp.documentoprimario is null then ( CASE WHEN dd.numeroref is not null then dd.numeroref::varchar else dd.nrodoc end) else vdp.documentoprimario end) as documentoprimarioorigen,
(case when vdp.numeroref is not null then vdp.numeroref else dd.numeroref end) as numeroref,
dr.fechadocorigen as fechadocorigen,
dr.cantbulto,
dr.tipobulto,
dd.nombrepersona,
dd.cargopersona,
dd.nombrepersonaprobar,
dd.cargopersonaprobar,
dd.registrarcantidad

FROM mod_logistica.v_documento dd
INNER JOIN mod_loginventario.dat_recepcion dr on dr.iddocumento = dd.iddocumento
INNER JOIN mod_logistica.v_documentocliente ddc on ddc.iddocumento = dd.iddocumento
LEFT JOIN mod_logistica.v_documentotransporte ddt on ddt.iddocumento = dd.iddocumento
LEFT JOIN mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
LEFT JOIN mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
LEFT JOIN mod_logistica.v_documento vdp ON ddp.iddocumento = vdp.iddocumento
LEFT JOIN mod_logistica.v_documentoprimario dpr ON dpr.iddoc = dd.iddoc

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

ALTER FUNCTION mod_loginventario.f_modelorecepcion (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric)
  OWNER TO zeolides;
  
  
  
  
  
  
  
  

 DROP FUNCTION mod_loginventario.f_modelorecepcionproducto(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);
 
 DROP TYPE mod_loginventario.td_recepcionproducto;
  
 CREATE TYPE mod_loginventario.td_recepcionproducto AS (
  codigo VARCHAR,
  categoria VARCHAR,
  codigoproveedor VARCHAR,
  nombreproducto VARCHAR,
  unidadmedida VARCHAR,
  cantidadproducto NUMERIC(25,6),
  preciocontable NUMERIC(25,6),
  importetotal NUMERIC(25,6),
  saldo NUMERIC(25,6),
  recargodescuento NUMERIC(19,6),
  preciounitariototal NUMERIC(19,6),
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedaalternativa VARCHAR,
  monedacontable VARCHAR,
  cantidadporfactura NUMERIC(25,6),
  idmovimiento NUMERIC(19,0),
  importecup NUMERIC(25,6),
  importecuc NUMERIC(25,6),
  precioventa NUMERIC(25,6),
  lineaproducto VARCHAR
);

ALTER TYPE mod_loginventario.td_recepcionproducto
  OWNER TO zeolides;
  
  CREATE OR REPLACE FUNCTION mod_loginventario.f_modelorecepcionproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_recepcionproducto AS
$body$
declare
all_rec mod_loginventario.td_recepcionproducto;
begin
for all_rec in
select distinct
dm.codigoproducto,
dm.categoria,
ni.numeropieza,
dm.nombreproducto,
dm.unidadmedidamovimiento,
dm.cantidadmovimiento,
dm.preciocontablemovimiento,
dm.importetotalmovimiento,
dm.existenciaactualmovimiento,
dm.recargodescuentomovimiento,
dm.preciounitariototalmovimiento,
dm.precioalternativomovimiento,
dm.importetotalaltmovimiento,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
dmr.cantidad as cantidadporfactura,
dm.idmovimiento,
dm.importetotalcup,
dm.importetotalcuc,
ccb.precioventa as precioventa,
dm.naturaleza as lineaproducto
FROM mod_logistica.v_movimiento dm
INNER JOIN mod_logfarmacia.conf_cuadrobasico ccb ON ccb.idindicador = dm.idindicador
LEFT JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dm.idindicador
LEFT JOIN mod_loginventario.dat_movrecepcion dmr ON dmr.idmovimiento = dm.idmovimiento
WHERE dm.iddocumento = p_iddocumento 
ORDER BY dm.nombreproducto
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelorecepcionproducto (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric)
  OWNER TO zeolides;

 
  
  
  
  
  