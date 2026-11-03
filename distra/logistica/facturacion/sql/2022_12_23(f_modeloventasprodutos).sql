CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modeloventaporproductos(
	p_idestructura character varying,
	p_fechainicio date,
	p_fechafin date,
	p_arrayidindicador character varying,
	p_arraydeposito character varying,
	p_arrayservicio character varying,
	p_reporte numeric,
	p_arraycliente character varying,
	p_idorganismo character varying)
    RETURNS SETOF mod_logfacturacion.td_modeloventaproductos 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
v_rec mod_logfacturacion.td_modeloventaproductos;
BEGIN
if p_reporte = 1 then
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
       sum(dm.preciocontable*dm.cantidad) as costo,
       (case when p_arraycliente is not null then (ncp.codigo || ' ' || ncp.nombre) else '' end) as cliente
FROM mod_logistica.dat_producto dprod
inner join mod_logistica.dat_movimiento dm on dm.idproducto = dprod.idproducto
inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento and dmm.idmoneda = 9900000000
INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
INNER JOIN mod_logistica.dat_documentocliente dcc on dcc.iddocumento = dd.iddocumento
INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dcc.idcliente
INNER JOIN mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento
INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador
inner JOIN mod_datosmaestros.nom_indicadorhoja n on n.idindicador = ni.idindicador
left join mod_logistica.conf_general cg on cg.idestructura = dd.idestructuracomun
left JOIN mod_estructuracomp.v_dametodasestructuras des on des.idestructura = dd.idestructuracomun
WHERE dd.idestructuracomun = any (cast(p_idestructura as numeric[])) and dd.estado = 4
AND (case when p_arraydeposito is not null then ddf.iddeposito = any(cast(p_arraydeposito as NUMERIC[])) else true end)
AND (case when p_arrayidindicador is not null then ni.idindicador = any(cast(p_arrayidindicador as NUMERIC[])) else true end)
and (case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end)
and (case when p_idorganismo is not null then ncp.idorganismo = any(cast(p_idorganismo as numeric[])) else true end)
and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end)
AND (case when p_arraycliente is not null then dcc.idcliente = any(cast(p_arraycliente as NUMERIC[])) else true end)

group by ddf.iddeposito, ni.numeropieza, ni.denominacion, dprod.idproducto, des.denominacion, cg.urllogo, cliente

UNION 

SELECT 'Sin Deposito' as deposito,
       ni.numeropieza,
       ni.denominacion,
       sum(dmm.preciotarifa*dprod.cantidad) as importe,
       sum(coalesce(n.peso*dprod.cantidad,0)) as peso,
       sum(dprod.cantidad) as cantidad,
       null as fecha,
       dm.idindicador,
       0 as importealt,
       des.denominacion as entidad,
       cg.urllogo as logo,
       sum(dmm.preciotarifa*dprod.cantidad) as costo,
       (case when p_arraycliente is not null then (ncp.codigo || ' ' || ncp.nombre) else '' end) as cliente
FROM mod_logfacturacion.dat_elementosfactura dprod
inner join mod_logfacturacion.dat_prodservnomenclador dm on dm.idelementofactura = dprod.idelementofactura
inner join mod_logfacturacion.dat_desgloselemento dmm on dmm.idelementofactura = dm.idelementofactura and dmm.idmoneda = 9900000000
INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = dprod.idfactura
INNER JOIN mod_logistica.dat_documentocliente dcc on dcc.iddocumento = dd.iddocumento
INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dcc.idcliente
INNER JOIN mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento
INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dm.idindicador
inner JOIN mod_datosmaestros.nom_indicadorhoja n on n.idindicador = ni.idindicador
left join mod_logistica.conf_general cg on cg.idestructura = dd.idestructuracomun
left JOIN mod_estructuracomp.v_dametodasestructuras des on des.idestructura = dd.idestructuracomun
WHERE dd.idestructuracomun = any (cast(p_idestructura as numeric[])) and dd.estado = 4
AND dm.tipo = 1
AND (case when p_arrayidindicador is not null then ni.idindicador = any(cast(p_arrayidindicador as NUMERIC[])) else true end)
and (case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end)
and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end)
and (case when p_idorganismo is not null then ncp.idorganismo = any(cast(p_idorganismo as numeric[])) else true end)
AND (case when p_arraycliente is not null then dcc.idcliente = any(cast(p_arraycliente as NUMERIC[])) else true end)
group by ni.numeropieza, ni.denominacion, dm.idindicador, des.denominacion, cg.urllogo, cliente

order by entidad, cliente, deposito
loop
return next v_rec;
end loop;
else
for v_rec in
SELECT 'Servicios' as deposito,
       ni.numeropieza,
       ni.denominacion,
       sum(dmm.preciotarifa*dprod.cantidad) as importe,
       sum(coalesce(n.peso*dprod.cantidad,0)) as peso,
       sum(dprod.cantidad) as cantidad,
       null as fecha,
       dm.idindicador,
       0 as importealt,
       des.denominacion as entidad,
       cg.urllogo as logo,
       sum(dmm.preciotarifa*dprod.cantidad) as costo,
       (case when p_arraycliente is not null then (ncp.codigo || ' ' || ncp.nombre) else '' end) as cliente
FROM mod_logfacturacion.dat_elementosfactura dprod
inner join mod_logfacturacion.dat_prodservnomenclador dm on dm.idelementofactura = dprod.idelementofactura
inner join mod_logfacturacion.dat_desgloselemento dmm on dmm.idelementofactura = dm.idelementofactura and dmm.idmoneda = 9900000000
INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = dprod.idfactura
INNER JOIN mod_logistica.dat_documentocliente dcc on dcc.iddocumento = dd.iddocumento
INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dcc.idcliente
INNER JOIN mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento
INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dm.idindicador
inner JOIN mod_datosmaestros.nom_indicadorhoja n on n.idindicador = ni.idindicador
left join mod_logistica.conf_general cg on cg.idestructura = dd.idestructuracomun
left JOIN mod_estructuracomp.v_dametodasestructuras des on des.idestructura = dd.idestructuracomun
WHERE dd.idestructuracomun = any (cast(p_idestructura as numeric[])) and dd.estado = 4
AND dm.tipo = 2
AND (case when p_arrayservicio is not null then ni.idindicador = any(cast(p_arrayservicio as NUMERIC[])) else true end)
and (case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end)
and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end)
and (case when p_idorganismo is not null then ncp.idorganismo = any(cast(p_idorganismo as numeric[])) else true end)
AND (case when p_arraycliente is not null then dcc.idcliente = any(cast(p_arraycliente as NUMERIC[])) else true end)
group by ni.numeropieza, ni.denominacion, dm.idindicador, des.denominacion, cg.urllogo, cliente
order by entidad, cliente
loop
return next v_rec;
end loop;
end if;
end;
$BODY$;

ALTER FUNCTION mod_logfacturacion.f_modeloventaporproductos(character varying, date, date, character varying, character varying, character varying, numeric, character varying, character varying)
    OWNER TO zeolides;