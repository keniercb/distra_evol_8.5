DROP FUNCTION IF EXISTS mod_loginventario.f_modelotranfalmacenesproducto(numeric, numeric, numeric);
DROP TYPE IF EXISTS mod_loginventario.td_tranferenciaentrealmacenesproducto;


-- DROP TYPE IF EXISTS mod_loginventario.td_tranferenciaentrealmacenesproducto;

CREATE TYPE mod_loginventario.td_tranferenciaentrealmacenesproducto AS
(
	codprod character varying,
	denomprod character varying,
	um character varying,
	punitario numeric(25,6),
	cantpsum numeric(25,6),
	importepsum numeric(25,6),
	saldopsum numeric(25,6),
	cantprecep numeric(25,6),
	importeprecep numeric(25,6),
	saldoprecep numeric(25,6),
	numeropieza character varying,
	precioalternativo numeric(25,6),
	importealternativo numeric(25,6),
	monedaalternativa character varying,
	monedacontable character varying,
	precioalternativopadre numeric(25,6),
	importealternativopadre numeric(25,6),
	idproducto numeric(19,0),
	importecup numeric(25,2),
	importecuc numeric(25,2),
	ubicacion character varying(255)
);

ALTER TYPE mod_loginventario.td_tranferenciaentrealmacenesproducto OWNER TO zeolides;

-- DROP FUNCTION IF EXISTS mod_loginventario.f_modelotranfalmacenesproducto(numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelotranfalmacenesproducto(
	p_iddocumento numeric,
	p_monedaalternativa numeric,
	p_monedacontable numeric)
    RETURNS SETOF mod_loginventario.td_tranferenciaentrealmacenesproducto 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
all_rec mod_loginventario.td_tranferenciaentrealmacenesproducto;
begin
for all_rec in
select distinct
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denomprod,
dum.abreviaturaunidadmedida as um,
coalesce(dm.preciocontable,0) as punitario,
coalesce(dm.cantidad,0),    
coalesce(round(dm.cantidad*dm.preciocontable,2),0),
coalesce(dm.existenciaactual,0),      
coalesce(dm.cantidad,0) as cantprecep,
coalesce(round(dm.importecontable,2),0) as importeprecep,
coalesce(dm.existenciaactual,0) as saldoprecep,      
ni.numeropieza,
COALESCE(dm.precioalternativo,0),
COALESCE(round(dm.cantidad*dm.precioalternativo,2),0),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable,
COALESCE(dm.precioalternativo,0) as precioalternativo,
COALESCE(round(dm.cantidad*dm.precioalternativo,2),0) as importealternativo,
dp.idproducto,
round((select sum(round(ddmv.importecontable,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecup, 
round((select sum(round(ddmv.importealternativo,2)) from mod_logistica.dat_movimiento ddmv where ddmv.iddocumento = dm.iddocumento),2) as importecuc,
(
	select concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) 
    from mod_logubicacion.dat_ubicacionproducto up 
    inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
    left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre and eup2.idestructuraubicacion <> eup2.idpadre
    left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea and eup.idestructuraubicacion = eup.idpadre
    where up.idproducto = dp.idproducto limit 1
) as ubicacion  
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dp.idumedida
where dm.iddocumento = p_iddocumento
order by dp.idproducto
loop return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_modelotranfalmacenesproducto(numeric, numeric, numeric) OWNER TO zeolides;
