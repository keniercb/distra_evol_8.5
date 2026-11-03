--TYPE
DROP FUNCTION IF EXISTS mod_loginventario.f_rep_ajustemodelo(numeric);
DROP TYPE IF EXISTS mod_loginventario.td_rep_ajustemodelo;
CREATE TYPE mod_loginventario.td_rep_ajustemodelo AS
(
	iddocumento numeric,
	entidad text,
	deposito text,
	numerodocumento character varying,
	fechadocumento date,
	motivo character varying,
	especialidad character varying,
	observaciones character varying,
	documentoprimario character varying,
	codigoestructura character varying,
	idestado numeric,
	estado character varying,
	numeroref numeric,
	nombrepersona text,
	cargopersona character varying,
	nombrepersonaprobar text,
	cargopersonaprobar character varying,
	nombrepersonacontab text,
	cargopersonacontab character varying,
	logo character varying
);

ALTER TYPE mod_loginventario.td_rep_ajustemodelo OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_ajustemodelo(
	p_iddocumento numeric
)
    RETURNS SETOF mod_loginventario.td_rep_ajustemodelo
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
		dd.iddocumento,
		dd.entidad,
		dd.estructuracompleta as deposito,
		dd.nrodoc as numerodocumento,
		dd.fechacontable as fechadocumento,
		nop.denominacion as motivo,
		dd.especialidad,
		dd.observaciones,
		dd.documentoprimario,
		dd.codigoestructura,
		dd.idestado,
		dd.estado,
		dd.numeroref,
		dd.nombrepersona as nombrepersona,
		dd.cargopersona as cargopersona,
		dd.nombrepersonaprobar as nombrepersonaprobar,
		dd.cargopersonaprobar as cargopersonaprobar,
		(select a.nombre from mod_logistica.v_responsable a
			where a.idusuario = daj.contabilizadopor limit 1) as nombrepersonacontab,
		(select a.cargo from mod_logistica.v_responsable a
			where a.idusuario = daj.contabilizadopor limit 1) as cargopersonacontab,
		dd.logo
	from mod_logistica.v_documento dd
	inner join mod_loginventario.dat_ajuste daj on daj.idajuste = dd.iddocumento
	left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = daj.idoperacion
	where dd.iddocumento = p_iddocumento
	limit 1
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_ajustemodelo(numeric) OWNER TO zeolides;
