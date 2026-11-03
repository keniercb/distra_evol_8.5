--/AjusteModelo_files/ProductoListado
--TYPE
DROP FUNCTION IF EXISTS mod_loginventario.f_rep_ajustemodelo_productolistado(numeric,numeric,numeric);
DROP TYPE IF EXISTS mod_loginventario.td_rep_ajustemodelo_productolistado;
CREATE TYPE mod_loginventario.td_rep_ajustemodelo_productolistado AS
(
	codigoproducto character varying,
	categoria character varying,
	nombreproducto character varying,
	unidadmedidamovimiento character varying, 
	cantidadproducto numeric,
	preciocontablemovimiento numeric,
	importemovimiento numeric,
	precioalternativomovimiento numeric,
	importealtmovimiento numeric,
	monedaalternativa character varying,
	monedacontable character varying,
	cuenta character varying,
	cuentaalt character varying,	
	existencia numeric,
	existenciainventario numeric
);

ALTER TYPE mod_loginventario.td_rep_ajustemodelo_productolistado OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_ajustemodelo_productolistado(
	p_monedaalternativa numeric,
	p_monedacontable numeric,
	p_iddocumento numeric	
)
    RETURNS SETOF mod_loginventario.td_rep_ajustemodelo_productolistado
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare

begin

return query
 (
	select distinct
		dm.codigoproducto,
		dm.categoria,
		dm.nombreproducto,
		dm.unidadmedidamovimiento,
		coalesce(dm.cantidadmovimiento,0) as cantidadproducto,
		coalesce(dm.preciocontablemovimiento,0) as preciocontablemovimiento,
		(case when nop.codigooperacion in ('OPER_INV_IMPORTE_MAS','OPER_INV_IMPORTE_MEN') then
		 			coalesce(dm.importetotalmovimiento,0)
			else coalesce(ROUND(dm.cantidadmovimiento * dm.preciocontablemovimiento,2),0)
		end) as importemovimiento,
		coalesce(dm.precioalternativomovimiento,0) as precioalternativomovimiento,
		coalesce(dm.importetotalaltmovimiento,0) as importealtmovimiento,
		(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,
		(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
		dm.cuentacontable as cuenta,
		dm.cuentaalternativa as cuentaalt,
		coalesce(dm.existencia,0) as existencia,
		( case when nop.codigooperacion in ('OPER_INV_SOBRANTE') then coalesce(dm.existencia,0) + coalesce(dm.cantidadmovimiento,0)
		       when nop.codigooperacion in ('OPER_INV_FALTANTE','OPER_INV_ROTURA','OPER_INV_MERMA') then coalesce(dm.existencia,0) - coalesce(dm.cantidadmovimiento,0)
		       else coalesce(dm.existencia,0)
		       end) as existenciainventario
	from mod_loginventario.dat_ajuste daj
	left join mod_logistica.v_movimiento dm on daj.idajuste = dm.iddocumento
	left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = daj.idoperacion
	where daj.idajuste = p_iddocumento
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_ajustemodelo_productolistado(numeric,numeric,numeric) OWNER TO zeolides;
COMMENT ON FUNCTION mod_loginventario.f_rep_ajustemodelo_productolistado(numeric, numeric, numeric) IS 'Consulta del servidor UNE(12).';
