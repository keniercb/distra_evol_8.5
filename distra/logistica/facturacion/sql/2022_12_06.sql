CREATE TYPE mod_logfacturacion.td_ventasprogramas AS (
  logo VARCHAR,
  codigo_prod VARCHAR,
  denominacion_prod VARCHAR,
  um VARCHAR,
  entidad VARCHAR,
  uf NUMERIC(25,6),
  valor NUMERIC(25,2),
  ufmes NUMERIC(25,6),
  valormes NUMERIC(25,2),
  organismo VARCHAR,
  idproducto NUMERIC,
  idorganismo NUMERIC,
  importe NUMERIC(25,2)
);

ALTER TYPE mod_logfacturacion.td_ventasprogramas
  OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_ventasprogramas (
  p_idestructura numeric,
  p_fechainicio date,
  p_fechafin date,
  p_productos varchar,
  p_organismos varchar,
  p_centrocostos varchar,
  p_operaciones varchar,
  p_depositos varchar
)
RETURNS SETOF mod_logfacturacion.td_ventasprogramas AS
$body$
DECLARE

	v_rec mod_logfacturacion.td_ventasprogramas;
    v_ejercicio record;
    v_idperiodo numeric;
    v_idejercicio numeric;
    v_fecha record;
    v_fechamin date;
    v_fechamax date;

	BEGIN
    	v_ejercicio = mod_logistica.f_obtenerejercicioactivo(13, p_idestructura);
  		v_idperiodo = v_ejercicio.idperiodoactual;
		v_idejercicio = v_ejercicio.idejercicioactual;
        select p.inicio, p.fin into v_fecha from mod_datosmaestros.dat_periodocontable p where p.idperiodo = v_idperiodo;
        v_fechamin = v_fecha.inicio;
        v_fechamax = v_fecha.fin;
                
		for v_rec in           

        (
      	SELECT cg.urllogo as logo,
        ni.numeropieza, 
        ni.denominacion,
       um.abreviaturaunidadmedida,
       des.denominacion as entidad,
       coalesce(sum(coalesce(dm.cantidad,0)),0) as uf,
       sum(coalesce(dmm.precio*dm.cantidad,0)) as importe,
       coalesce((select sum(coalesce(movm.cantidad,0)) from mod_logistica.dat_movimiento movm
       inner join mod_logistica.dat_documento ddm on ddm.iddocumento = movm.iddocumento
       inner join mod_logfacturacion.dat_docfactura dfm on dfm.idfactura = ddm.iddocumento
       INNER JOIN mod_logistica.dat_documentocliente dccm on dccm.iddocumento = ddm.iddocumento
        INNER JOIN mod_datosmaestros.nom_clientesproveedor ncpm on ncpm.idclientesproveedores = dccm.idcliente
       where movm.idproducto = dprod.idproducto and ddm.estado = 4 and ddm.fechacontable >= v_fechamin 
       and ncpm.idorganismo = ncp.idorganismo and ddm.fechacontable <= v_fechamax),0) as ufmes,
       coalesce((select sum(round(movm.cantidad*monm.precio,2)) from mod_logistica.dat_movimiento movm
       inner join mod_logistica.dat_movmoneda monm on monm.idmovimiento = movm.idmovimiento and monm.idmoneda = 9900000000
       inner join mod_logistica.dat_documento ddm on ddm.iddocumento = movm.iddocumento
       INNER JOIN mod_logistica.dat_documentocliente dccm on dccm.iddocumento = ddm.iddocumento
        INNER JOIN mod_datosmaestros.nom_clientesproveedor ncpm on ncpm.idclientesproveedores = dccm.idcliente
       where movm.idproducto = dprod.idproducto and ddm.estado = 4 and ddm.fechacontable >= v_fechamin 
       and ncpm.idorganismo = ncp.idorganismo and ddm.fechacontable <= v_fechamax),0) as valormes,
       (Select (org.codigo || ' ' || org.nombre) FROM mod_crmclienteproveedor.nom_organismo org where org.idorganismo = ncp.idorganismo) as organismo,
       dprod.idproducto,
       ncp.idorganismo       
        FROM mod_logistica.dat_producto dprod
        inner join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = dprod.idumedida
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
        WHERE dd.idejercicio = v_idejercicio and dd.idestructuracomun = p_idestructura and dd.estado = 4     
        and (case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end)
        and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end)
        AND (case when p_productos is not null then ni.idindicador = any(cast(p_productos as numeric[])) else true end)
        AND (case when p_organismos is not null then ncp.idorganismo = any(cast(p_organismos as numeric[])) else true end)           
        group by ni.numeropieza, ni.denominacion, um.abreviaturaunidadmedida, dprod.idproducto, des.denominacion, cg.urllogo, ncp.idorganismo
        order by ncp.idorganismo
        )
		loop        
			return next v_rec;
		end loop;
	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_ventasprogramas (p_idestructura numeric, p_fechainicio date, p_fechafin date, p_productos varchar, p_organismos varchar, p_centrocostos varchar, p_operaciones varchar, p_depositos varchar)
  OWNER TO zeolides;