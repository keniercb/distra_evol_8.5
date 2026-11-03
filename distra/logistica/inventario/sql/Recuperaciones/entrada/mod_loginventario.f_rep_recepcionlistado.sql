--TYPE
DROP FUNCTION IF EXISTS mod_loginventario.f_rep_recepcionlistado(numeric, numeric, numeric, numeric, numeric, numeric, character varying, text, text, numeric);
DROP TYPE IF EXISTS mod_loginventario.td_rep_recepcionlistado;
CREATE TYPE mod_loginventario.td_rep_recepcionlistado AS
(
	numerodocumento character varying,
	numeroref numeric,
	fechacontable date,
	estado character varying,
	codigodeposito character varying,
	deposito text,
	productos bigint,
	creadopor text,
	aprobadopor text,
	entidad text,
	logo character varying,
	proveedor character varying,
	tipodocumento character varying,
	fechaminima text,
	fechamaxima text,
	estadodeposito text,
	importecontable numeric,
	importealternativo numeric
);

ALTER TYPE mod_loginventario.td_rep_recepcionlistado OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_recepcionlistado(
	p_iddeposito numeric,
	p_idestructura numeric,
	p_idestado numeric,
	p_creadopor numeric,
	p_contabilizadopor numeric,
	p_tipodocumento numeric,
	p_docorigen character varying,
	p_fechainicio text,
	p_fechafin text,
	p_idsuministrador numeric
)
    RETURNS SETOF mod_loginventario.td_rep_recepcionlistado
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare

begin

return query
 (
	select
		dd.nrodoc as numerodocumento,
		dd.numeroref,
		dd.fechacontable,
		dd.estado,
		dd.codigoestructura as codigodeposito,
		dd.estructuracompleta as deposito,
		(select count (*) from mod_logistica.dat_movimiento m where m.iddocumento = dd.iddocumento) as productos,
		dd.nombrepersona as creadopor,
		dd.nombrepersonaprobar as aprobadopor,
		dd.entidad as entidad,
		dd.logo,
		ddc.nombre as proveedor,
		dd.documentoprimario as tipodocumento,
		null as fechaminima,
		null as fechamaxima,
		(case when (select dea.estado from mod_logistica.dat_estadoalmacen dea where dea.iddeposito = dd.idestructuracomun) = 1 then 'Abierto' else 'Cerrado' end) as estadodeposito,
		(select coalesce(sum(dm.importecontable),0) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento) as importecontable,
		(select coalesce(sum(dm1.importealternativo),0) from mod_logistica.dat_movimiento dm1 where dm1.iddocumento = dd.iddocumento) as importealternativo
	from mod_logistica.v_documento dd
	inner join mod_loginventario.dat_recepcion dr on dd.iddocumento = dr.iddocumento
	left join mod_logistica.v_cierre_subsistema dc on dd.idestructurasubsist = dc.idestructurasubsist and dc.idperiodo = dd.idperiodo
	left join mod_logistica.v_documentocliente ddc ON ddc.iddocumento = dd.iddocumento
	left join mod_contabilidad.dat_comprobante dcp on dcp.idcomprobante = dd.idcomprobante
	where dd.idestructuracomun = p_iddeposito and dd.identidad = p_idestructura
	and (case when p_idestado is not null then dd.idestado = p_idestado else dd.idestado in (1,2,3,4) end)
	and (case when p_creadopor is not null then dd.creadopor = p_creadopor else true end)
	and (case when p_contabilizadopor is not null then dd.aprobadopor = p_contabilizadopor else true end)
	and (case when p_tipodocumento is not null then dd.idoperacion = p_tipodocumento else true end)
	and (case when p_docorigen is not null then dr.nrodocorigen = p_docorigen else true end)
	and (case when p_fechainicio is not null then dd.fechacontable >= cast( p_fechainicio as date) else true end)
	and (case when p_fechafin is not null then dd.fechacontable <= cast( p_fechafin as date) else true end)
	and (case when p_idsuministrador is not null then ddc.idclienteproveedores = p_idsuministrador else true end)
	order by dd.iddocumento desc
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_recepcionlistado(numeric, numeric, numeric, numeric, numeric, numeric, character varying, text, text, numeric) OWNER TO zeolides;
