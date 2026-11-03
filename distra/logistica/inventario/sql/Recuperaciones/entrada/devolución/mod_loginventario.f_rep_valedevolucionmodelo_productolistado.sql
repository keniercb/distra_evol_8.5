--/ValeDevolucionModelo_files/ProductoListado
--TYPE
DROP FUNCTION IF EXISTS mod_loginventario.f_rep_valedevolucionmodelo_productolistado(numeric,numeric,numeric,numeric);
DROP TYPE IF EXISTS mod_loginventario.td_rep_valedevolucionmodelo_productolistado;
CREATE TYPE mod_loginventario.td_rep_valedevolucionmodelo_productolistado AS
(
	codigoproducto character varying,
	nombreproducto character varying,
	unidadmedidamovimiento character varying,
	existencia numeric,
	preciounitariototalmovimiento numeric,
	cantidadmovimiento numeric,
	importetotalmovimiento numeric,
	monedacontable character varying
);

ALTER TYPE mod_loginventario.td_rep_valedevolucionmodelo_productolistado OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_valedevolucionmodelo_productolistado(
	p_monedaalternativa numeric,
	p_monedacontable numeric,
	p_idestructura numeric,
	p_iddocumento numeric	
)
    RETURNS SETOF mod_loginventario.td_rep_valedevolucionmodelo_productolistado
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare

begin

return query
 (
	select distinct dp.codigoproducto,--1
					dp.nombreproducto,--2
	 				dum.abreviaturaunidadmedida as unidadmedidamovimiento,--3
					dp.existencia,--7
					coalesce(round(dm.preciocontable, 6), 0::numeric) as preciounitariototalmovimiento,--5
					coalesce(dm.cantidad, 0::numeric) as cantidadmovimiento,--4
					coalesce(round(dm.importecontable, 2), 0::numeric) as importetotalmovimiento,--6
			  		(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable/*$P{monedacontable}*/) as monedacontable
	from mod_logistica.dat_movimiento dm
	inner join mod_logistica.v_producto dp on dp.idproducto = dm.idproducto
	left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
	where dm.iddocumento = p_iddocumento--$P{iddocumento}
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_valedevolucionmodelo_productolistado(numeric,numeric,numeric,numeric) OWNER TO zeolides;
--llamada
--select * from mod_loginventario.f_rep_valedevolucionmodelo_productolistado($P{monedaalternativa}, $P{monedacontable}, $P{idestructura}, $P{iddocumento});