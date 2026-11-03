CREATE TYPE mod_logfacturacion.td_subreporteconceptos AS (
  denominacion VARCHAR,
  codigo VARCHAR,
  valorcup NUMERIC,
  valorcuc NUMERIC,
  ventamn NUMERIC,
  ventacuc NUMERIC
);

ALTER TYPE mod_logfacturacion.td_subreporteconceptos
  OWNER TO zeolides;
  
-- FUNCTION: mod_logfacturacion.fn_subreporteconceptos(numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logfacturacion.fn_subreporteconceptos(numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logfacturacion.fn_subreporteconceptos(
	p_iddocumento numeric,
	p_monedacontable numeric,
	p_monedaalternativa numeric)
    RETURNS SETOF mod_logfacturacion.td_subreporteconceptos 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
  all_record mod_logfacturacion.td_subreporteconceptos;
BEGIN
  for all_record in (
    select ncp.denominacion,ncp.codigo,
    (select round(COALESCE(ddes.valorcalculo,0),2) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddes
     where ddes.idcategoriafactura = dcp.idcategoriafactura and ddes.idmoneda = p_monedacontable) as valorcup,
    (select round(COALESCE(ddes.valorcalculo,0),2) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddes
     where ddes.idcategoriafactura = dcp.idcategoriafactura and ddes.idmoneda = p_monedaalternativa) as valorcuc,
     (COALESCE((select sum(round(dmm.importe,2)) from mod_logistica.dat_movmoneda dmm
     inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmm.idmovimiento
     where dm.iddocumento = p_iddocumento and dmm.idmoneda = p_monedacontable),0) +
     COALESCE((select sum(round(def.cantidad * dde.preciotarifa,2)) from mod_logfacturacion.dat_desgloselemento dde
     inner join mod_logfacturacion.dat_elementosfactura def on def.idelementofactura = dde.idelementofactura
     where dde.idmoneda = p_monedacontable and def.idfactura = p_iddocumento),0)) as ventamn,
     (COALESCE((select sum(round(dmm.importe,2)) from mod_logistica.dat_movmoneda dmm
     inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmm.idmovimiento
     where dm.iddocumento = p_iddocumento and dmm.idmoneda = p_monedaalternativa),0) +
     COALESCE((select sum(round(def.cantidad * dde.preciotarifa,2)) from mod_logfacturacion.dat_desgloselemento dde
     inner join mod_logfacturacion.dat_elementosfactura def on def.idelementofactura = dde.idelementofactura
     where dde.idmoneda = p_monedaalternativa and def.idfactura = p_iddocumento),0)) as ventacuc
    from mod_logfacturacion.dat_categoriapreciofactura dcp
    inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio
    where dcp.idfactura = p_iddocumento --and ncp.codigo is not null
  ) 
  loop
      return next all_record;
  end loop;
END;
$BODY$;

ALTER FUNCTION mod_logfacturacion.fn_subreporteconceptos(numeric, numeric, numeric)
    OWNER TO zeolides;
