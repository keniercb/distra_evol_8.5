DROP FUNCTION IF EXISTS mod_loginventario.f_rep_modelodistribucion_productolistado(numeric,numeric, numeric);
DROP TYPE IF EXISTS mod_logdistribucion.td_modelodistribucion_productolistado;
--TYPE
CREATE TYPE mod_logdistribucion.td_modelodistribucion_productolistado AS
(
	codigoproducto character varying(255),
	nombreproducto character varying,
	cantidad numeric(25,6),
	unidadmedidaproducto character varying(255),
	categoria character varying(255),
	preciocontable numeric(25,6),
	importe numeric,
	cantdespachado numeric(25,6),
	catparcial numeric,
	preciocuc numeric(25,6),
	importecuc numeric,
	deposito character varying,
	entregar character varying,
	direccion text,
	cuentabancaria character varying(255),
	numerosucursal character varying(100),
	tipocliente numeric(1),
	ubicacioncompleta text,
	idprodorden numeric(19),
	monedaalternativa character varying(30),
	monedacontable character varying(30)	
);
ALTER TYPE mod_logdistribucion.td_modelodistribucion_productolistado OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_modelodistribucion_productolistado(
	p_monedaalternativa numeric,
	p_monedacontable numeric,
	p_iddocumento numeric
)
    RETURNS SETOF mod_logdistribucion.td_modelodistribucion_productolistado
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
		dpo.codigoproducto,
		dpo.nombreproducto,
		dpo.cantidadordenada as cantidad,
		dpo.unidadmedidaproducto,
		dpo.categoria,
		dpo.preciocontable,
		coalesce(dpo.preciocontable * dpo.cantidadordenada,0) as importe,
		dpo.entregado  as cantdespachado,
		(dpo.cantidadoriginal - dpo.entregado) as catparcial,
		dpo.precioalternativo as preciocuc,
		coalesce(dpo.precioalternativo * dpo.cantidadordenada,0) as importecuc,
		dpo.deposito as deposito,
		ddc.nombre as entregar,
		ddc.direccion as direccion,
		(select ddc1.numerocuenta from mod_logistica.v_documentocliente ddc1 where ddc1.iddocumento = dpo.idorden and ddc1.idcliente = dpo.idcliente limit 1) cuentabancaria,
		(select ddc1.numerosucursal from mod_logistica.v_documentocliente ddc1 where ddc1.iddocumento = dpo.idorden and ddc1.idcliente = dpo.idcliente limit 1) as numerosucursal,
		ddc.tipocliente as tipocliente,
		dpo.ubicacioncompleta as ubicacioncompleta,
		dpo.idprodorden,
		(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,
		(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable
	from mod_logistica.v_prodorden dpo
	inner join mod_logistica.v_documentocliente ddc on ddc.iddocumento = dpo.idorden and ddc.idcliente = dpo.idcliente
	where dpo.idorden = p_iddocumento
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_modelodistribucion_productolistado(numeric,numeric, numeric) OWNER TO zeolides;
COMMENT ON FUNCTION mod_loginventario.f_rep_modelodistribucion_productolistado(numeric, numeric, numeric) IS 'Consulta del servidor (14).';
