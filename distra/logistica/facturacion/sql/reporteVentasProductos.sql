DROP TYPE mod_logfacturacion.td_modeloventaproductos CASCADE;

CREATE TYPE mod_logfacturacion.td_modeloventaproductos AS (
  deposito VARCHAR(255),
  codigo VARCHAR(255),
  denominacion VARCHAR(255),
  importe NUMERIC(25,6),
  peso NUMERIC(19,2),
  cantidad NUMERIC(25,6),
  fecha DATE,
  idproducto NUMERIC(19,0),
  importealt NUMERIC(25,6),
  entidad VARCHAR,
  logo VARCHAR,
  costo NUMERIC(25,6)
);

ALTER TYPE mod_logfacturacion.td_modeloventaproductos
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modeloventaporproductos (
  p_idestructura numeric,
  p_fechainicio date,
  p_fechafin date,
  p_arrayidindicador varchar,
  p_arraydeposito varchar
)
RETURNS SETOF mod_logfacturacion.td_modeloventaproductos AS
$body$
DECLARE
v_rec mod_logfacturacion.td_modeloventaproductos;
BEGIN
for v_rec in 
SELECT (select de.denominacion from mod_estructuracomp.dat_estructuraop de where de.idestructuraop = ddf.iddeposito limit 1) as deposito,
       ni.numeropieza,
       ni.denominacion,
       sum(dmm.precio*dm.cantidad) as importe,
       sum(coalesce(n.peso*dm.cantidad,0)) as peso,
       sum(dm.cantidad) as cantidad,
       null as fecha,
       dprod.idproducto,
       0 as importealt,
       des.denominacion as entidad,
       cg.urllogo as logo,
       sum(dm.preciocontable*dm.cantidad) as costo
FROM mod_logistica.dat_producto dprod
inner join mod_logistica.dat_movimiento dm on dm.idproducto = dprod.idproducto
inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento and dmm.idmoneda = 9900000000
INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
INNER JOIN mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento
INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador
inner JOIN mod_datosmaestros.nom_indicadorhoja n on n.idindicador = ni.idindicador
left join mod_logistica.conf_general cg on cg.idestructura = dd.idestructuracomun
left JOIN mod_estructuracomp.v_dametodasestructuras des on des.idestructura = dd.idestructuracomun
WHERE dd.idestructuracomun = p_idestructura and dd.estado = 4
AND (case when p_arraydeposito is not null then ddf.iddeposito = any(cast(p_arraydeposito as NUMERIC[])) else true end)
AND (case when p_arrayidindicador is not null then ni.idindicador = any(cast(p_arrayidindicador as NUMERIC[])) else true end)
and (case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end) 
and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end)
group by ddf.iddeposito, ni.numeropieza, ni.denominacion, dprod.idproducto, des.denominacion, cg.urllogo
loop
return next v_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_modeloventaporproductos (p_idestructura numeric, p_fechainicio date, p_fechafin date, p_arrayidindicador varchar, p_arraydeposito varchar)
  OWNER TO zeolides;