--/SolicitudEntregaModelo_files/ProductoListado
--TYPE
--/SolicitudEntregaModelo_files/ProductoListado
--TYPE
DROP FUNCTION IF EXISTS mod_loginventario.f_rep_solicitudentregamodelo_productolistado(numeric,numeric,numeric);
DROP TYPE IF EXISTS mod_loginventario.td_rep_solicitudentregamodelo_productolistado;
CREATE TYPE mod_loginventario.td_rep_solicitudentregamodelo_productolistado AS
(
	codigoproducto character varying(255),
	nombreproducto character varying,
	unidadmedida character varying(50), 
	categoria character varying(255),
	preciocontable numeric,
	cantidadproducto numeric,
	importeparcial numeric,
	precioalternativo numeric,
	importealternativo numeric,	
	monedaalternativa character varying(30),
	monedacontable character varying(30),
	nrodocorigen numeric(19),
	tipodoc character varying,
	codigoproducto_ord character varying,
	denomproducto_ord character varying,
	ordeninsercion_ord numeric,
	codigofabricante_ord character varying,
	naturalezaprod_ord character varying,
	ordenproducto numeric(1)
);

ALTER TYPE mod_loginventario.td_rep_solicitudentregamodelo_productolistado OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_solicitudentregamodelo_productolistado(
	p_monedaalternativa numeric,
	p_monedacontable numeric,
	p_iddocumento numeric	
)
    RETURNS SETOF mod_loginventario.td_rep_solicitudentregamodelo_productolistado
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
			dm.nombreproducto,
			dm.unidadmedidamovimiento as unidadmedida,
			dm.categoria,
			dm.preciounitariototalmovimiento as preciocontable,
			dm.cantidadmovimiento as cantidadproducto,
			dm.importetotalmovimiento as importeparcial,
			dm.precioalternativomovimiento as precioalternativo,
			dm.importetotalaltmovimiento as importealternativo,
			(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,
			(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
	        dd.nrodoc as nrodocorigen,
	        (case when dp.idpadre is not null then ndp.denominacion else '-' end) as tipoDoc,
	
			case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto_ord,
			case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto_ord,
			case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion_ord,
			case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante_ord,
			case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod_ord,
			conf.ordenproducto
	
	from mod_logistica.v_movimiento dm
	left join mod_logistica.dat_documentopadre dp on dp.iddocumento = dm.iddocumento
	left join mod_logistica.dat_documento dd on dd.iddocumento = dp.idpadre
	left join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
	left join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos

	left join mod_logistica.dat_producto pr on pr.idproducto = dm.idproducto
	left join mod_datosmaestros.nom_indicador ni on ni.idindicador = pr.idindicador
	left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = pr.idestructuracomun
	left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
	
	where dm.iddocumento = p_iddocumento

	order by 
			case when conf.ordenproducto = 1 then ni.codigo end,
			case when conf.ordenproducto = 2 then ni.denominacion end,
			case when conf.ordenproducto = 3 then dm.idmovimiento end,
			case when conf.ordenproducto = 4 then ni.numeropieza end,
			case when conf.ordenproducto = 5 then nat.denominacion end
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_solicitudentregamodelo_productolistado(numeric,numeric, numeric) OWNER TO zeolides;
COMMENT ON FUNCTION mod_loginventario.f_rep_solicitudentregamodelo_productolistado(numeric, numeric, numeric) IS 'Consulta del servidor UNE(12).';
