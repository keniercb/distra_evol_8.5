-- FUNCTION: mod_logtaller.f_valeinventario(date, date, numeric, numeric, numeric)

DROP FUNCTION IF EXISTS mod_logtaller.f_valeinventario(date, date, numeric, numeric, numeric);
DROP TYPE IF EXISTS mod_logtaller.td_valeinventario;

CREATE TYPE mod_logtaller.td_valeinventario AS
(
	entidad character varying(255),
	nroorden numeric(19,0),
	fechacontable date,
	nrovale character varying(255),
	logo text,
	cantidad numeric(25,6),
	pieza character varying(255),
	idcliente numeric(19,0),
	nombre_clienteproveedor character varying(255)
);

ALTER TYPE mod_logtaller.td_valeinventario OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logtaller.f_valeinventario(
	p_fechainicio date,
	p_fechafin date,
	p_idestructuracomun numeric,
	p_idsubsistema numeric,
	b_inventario numeric)
    RETURNS SETOF mod_logtaller.td_valeinventario 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    declare

    v_rec mod_logtaller.td_valeinventario;
    v_ejerciciocontable record;
    v_idejercicio numeric;

    begin

    if $3 is not null and $4 is not null then
    v_ejerciciocontable = mod_logistica.f_obtenerejercicioactivo($4, $3);
    v_idejercicio = v_ejerciciocontable.idejercicioactual;
    else
    v_idejercicio = null;
    end if;

    if $5 = 1 then
    for v_rec in
	    select
	    des.denominacion as entidad,
	    dd.nrodoc as nroorden,
	    dd.fechacontable,
	    ddh.nrodoc as nrovale,
	    i.urllogo,
	    dmh.cantidad,
	    ni.denominacion as pieza,
	    dot.idcliente,
		ncp.nombre as nombre_clienteproveedor
	    from mod_logistica.dat_documento ddh
	    inner join mod_logistica.dat_documentopadre ddpa on ddpa.iddocumento = ddh.iddocumento
	    inner join mod_logistica.dat_documento dd on dd.iddocumento = ddpa.idpadre
	    inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
	    inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
	    inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
	    inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
	    inner join mod_logistica.conf_general i on i.idestructura = des.idestructura
	    inner join mod_logistica.dat_movimiento dmh on ddh.iddocumento = dmh.iddocumento
	    inner join mod_logistica.dat_producto dprodh on dprodh.idproducto = dmh.idproducto
	    left join mod_datosmaestros.nom_indicador ni on dprodh.idindicador = ni.idindicador
		left join mod_datosmaestros.nom_clientesproveedor as ncp on (ncp.idclientesproveedores = dot.idcliente)    	
	    where dd.estado in(2)
	    and ddh.estado in(4)
	    and dd.idejercicio = v_idejercicio
	    and ((dd.fechacontable >= $1 or $1 is null) and (dd.fechacontable <= $2 or $2 is null))
	    group by dd.iddocumento,ddh.nrodoc,dd.nrodoc,ni.denominacion, dmh.cantidad, des.denominacion, dd.fechacontable,i.urllogo,
			dot.idcliente, ncp.nombre
	    order by dd.iddocumento
    loop
    	return next v_rec;
    end loop;
    end if;

    if $5 = 2 then
    for v_rec in
	    select
	    des.denominacion as entidad,
	    dd.nrodoc as nroorden,
	    dd.fechacontable,
	    mat.nrosvales as nrovale,
	    i.urllogo,
	    mat.cantidadreal,
	    (select ni.denominacion from mod_datosmaestros.nom_indicador ni where ni.idindicador = mat.idindicador) as pieza,
	    dot.idcliente,
		ncp.nombre as nombre_clienteproveedor
	    from mod_logistica.dat_documento dd
	    inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
	    inner join mod_logtaller.dat_material mat on mat.idordentrabajo = dot.idordentrabajo
	    inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
	    inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
	    inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
	    inner join mod_logistica.conf_general i on i.idestructura = des.idestructura
		left join mod_datosmaestros.nom_clientesproveedor as ncp on (ncp.idclientesproveedores = dot.idcliente)
	    where mat.nrosvales is not null
	    and dd.estado in (2)
	    and (dd.idejercicio = v_idejercicio or v_idejercicio is null)
	    and (dd.fechacontable >= $1 or $1 is null)
	    and (dd.fechacontable <= $2 or $2 is null)
	    group by dd.iddocumento,des.denominacion, dd.nrodoc, dd.fechacontable, mat.nrosvales, i.urllogo,mat.cantidadreal,mat.idindicador,
			dot.idcliente, ncp.nombre
	    order by dd.iddocumento
    loop
    	return next v_rec;
    end loop;
    end if;
    end;
    
$BODY$;

ALTER FUNCTION mod_logtaller.f_valeinventario(date, date, numeric, numeric, numeric) OWNER TO zeolides;
