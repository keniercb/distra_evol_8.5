DROP FUNCTION IF EXISTS mod_loginventario.f_listarinformerecepcion(numeric, numeric, numeric, character varying, numeric, numeric, date, date, numeric);
DROP TYPE IF EXISTS mod_loginventario.td_listarinformerecepcion;

CREATE TYPE mod_loginventario.td_listarinformerecepcion AS
(
	iddocumento numeric(19,0),
	nrodoc character varying,
	fechacreacion date,
	estado character varying,
	entidad character varying,
	deposito character varying,
	proveedor text,
	cantidadprod numeric(19,0),
	creadopor character varying,
	aprobadopor character varying,
	logo text,
	fechaminima date,
	fechamaxima date,
	codigodeposito character varying,
	estadodeposito character varying,
	numeroref numeric(19,0),
	importe numeric(25,2)
);

ALTER TYPE mod_loginventario.td_listarinformerecepcion OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_listarinformerecepcion(
	p_idestructuraop numeric,
	p_estado numeric,
	p_tipodocumento numeric,
	p_docorigen character varying,
	p_creadopor numeric,
	p_contabilizadopor numeric,
	p_fechainicio date,
	p_fechafin date,
	p_idestructura numeric)
    RETURNS SETOF mod_loginventario.td_listarinformerecepcion 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
all_rec mod_loginventario.td_listarinformerecepcion;
periodo_ejercicio record;
begin

	select dc.idperiodoactual, dc.idejercicioactual into periodo_ejercicio from mod_datosmaestros.dat_estructurasubsist as desub
	inner join mod_datosmaestros.dat_cierre as dc on (dc.idestructurasubsist = desub.idestructurasubsist)
	where idestructuracomun = p_idestructura
		and idsubsistema = 10;
	
for all_rec in
select 
	dd.iddocumento, 
	dd.nrodoc::character varying as numerodocumento, 
	dd.fechacontable,
	case 	when dd.estado = 1 then 'Elaboración'
			when dd.estado = 2 then 'Preparado'
			when dd.estado = 4 then 'Contabilizado'
			when dd.estado = 7 then 'Cancelado'
			when dd.estado = 13 then 'Preelaborado'
	else '' end::character varying as estado,
	de.denominacion as entidad,
	ves.denominacion as deposito,
	(select concat(ncp.codigo,'-',ncp.nombre) 
		from mod_datosmaestros.nom_clientesproveedor ncp
		where ncp.idclientesproveedores = ddc.idcliente) as proveedor,
	(select count (*) from mod_logistica.dat_movimiento m where m.iddocumento = dd.iddocumento) as cantidadprod,
	coalesce(su.nombreusuario,'-') as creadopor,
	coalesce(su1.nombreusuario,'-') as aprobadopor,
	i.urllogo,
	(select min(ddd.fechacontable) 
		from mod_logistica.dat_documento ddd
		inner join mod_loginventario.dat_recepcion ddisd on ddisd.iddocumento = ddd.iddocumento 
		where ddd.idestructuracomun = ves.idestructura) as fechaminima,
	(select max(ddd.fechacontable) 
		from mod_logistica.dat_documento ddd
		inner join mod_loginventario.dat_recepcion ddisd on ddisd.iddocumento = ddd.iddocumento 
		where ddd.idestructuracomun = ves.idestructura) as fechamaxima,
		ves.codigo,
	(case when (select dea.estado from mod_logistica.dat_estadoalmacen dea where dea.iddeposito = ves.idestructura) = 1 
		then 'Abierto' else 'Cerrado' end) as estadoop,
	dd.numeroref,
	(select sum(m.importecontable) from mod_logistica.dat_movimiento m where m.iddocumento = dd.iddocumento) as importe
from mod_logistica.dat_documento dd
inner join mod_estructuracomp.v_dametodasestructuras ves on ves.idestructura = dd.idestructuracomun
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
inner join mod_loginventario.dat_recepcion dr on dd.iddocumento = dr.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_datosmaestros.dat_cierre dc on dc.idestructurasubsist = des.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = de.idestructura
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_logistica.dat_documentopadre ddpad on dd.iddocumento = ddpad.iddocumento 
left join mod_logistica.dat_documentotransporte ddt on dd.iddocumento = ddt.iddocumento
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where 
	dd.estado in(1,2,4,13)
	and (dd.estado = $2 or $2 is null) 
	and (dd.idestructuracomun = $1 and de.idestructura = $9)
	and (dd.idoperacion = $3 or $3 is null) 
	and (dr.nrodocorigen = $4 or $4 is null)
	and (su.idusuario = $5 or $5 is null)
	and (su1.idusuario = $6 or $6 is null)
	and ((dd.fechacontable >= $7 or $7 is null) and (dd.fechacontable <= $8 or $8 is null))
	and (case when (p_fechainicio is null and p_fechafin is null) then (dd.idperiodo = periodo_ejercicio.idperiodoactual and dd.idejercicio = periodo_ejercicio.idejercicioactual) else true end)
	and ($2 is null or $3 is null or $4 is null or $5 is null or $6 is null or $7 is null or $8 is null)
order by dd.iddocumento desc
loop
return next all_rec;
end loop;

end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_listarinformerecepcion(numeric, numeric, numeric, character varying, numeric, numeric, date, date, numeric) OWNER TO zeolides;
