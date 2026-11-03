/*5. inicio/inventario/salidas/gestionar documentos de salida: 
	tipo de documentos: transferencia y vale salida/ imprimir modelo(dos reportes ak)
*/
DROP FUNCTION IF EXISTS mod_loginventario.f_modelovalentregaproducto(numeric, numeric, numeric);
--TYPE
DROP TYPE IF EXISTS mod_loginventario.td_modelovalentregaproducto;
CREATE TYPE mod_loginventario.td_modelovalentregaproducto AS
(
	numeropieza character varying,
	denominacionproducto character varying,
	um character varying,
	disponible numeric(25,6),
	precio numeric(25,6),
	importe numeric(25,6),
	existencia numeric(25,6),
	codigoproveedor character varying,
	precioalternativo numeric(25,6),
	importealternativo numeric(25,6),
	monedaalternativa character varying,
	monedacontable character varying,
	categoria character varying,
	importecup numeric(25,2),
	importecuc numeric(25,2),
	ubicacion character varying(255),
	codigoproducto_ord character varying,
	denomproducto_ord character varying,
	ordeninsercion_ord numeric,
	codigofabricante_ord character varying,
	naturalezaprod_ord character varying,
	ordenproducto numeric(1)
);

ALTER TYPE mod_loginventario.td_modelovalentregaproducto OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_modelovalentregaproducto(
	p_iddocumento numeric,
	p_monedaalternativa numeric,
	p_monedacontable numeric)
    RETURNS SETOF mod_loginventario.td_modelovalentregaproducto 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
  all_rec mod_loginventario.td_modelovalentregaproducto;
begin
for all_rec in
select distinct
coalesce(ni.numeropieza,ni.codigo) as numeropieza,--codigo
ni.denominacion,
num.abreviaturaunidadmedida as unidadmedida,
coalesce(dm.cantidad,0) as disponible,
coalesce(dm.preciocontable,0) as precio,
coalesce(round(dm.importecontable,2),0) as importe,
coalesce(dm.existenciaactual,0) as existencia,
ni.numeropieza as codigoproveedor,
coalesce(dm.precioalternativo,0),
coalesce(round(dm.importealternativo,2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = null) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
nca.denominacion,
round((select sum(round(ddmv.importecontable,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecup, 
round((select sum(round(ddmv.importealternativo,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecuc,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion,	
			case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto_ord,
			case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto_ord,
			case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion_ord,
			case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante_ord,
			case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod_ord,
			conf.ordenproducto

from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logistica.nom_categoria nca on nca.idcategoria = dp.idcategoria
left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = dp.idestructuracomun
left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
where dm.iddocumento = p_iddocumento
order by 
		case when conf.ordenproducto = 1 then ni.codigo end,
		case when conf.ordenproducto = 2 then ni.denominacion end,
		case when conf.ordenproducto = 3 then dm.idmovimiento end,
		case when conf.ordenproducto = 4 then ni.numeropieza end,
		case when conf.ordenproducto = 5 then nat.denominacion end
loop return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelovalentregaproducto(numeric, numeric, numeric) OWNER TO zeolides;
