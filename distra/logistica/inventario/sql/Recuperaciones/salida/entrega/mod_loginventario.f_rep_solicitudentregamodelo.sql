--13/05/2024 3:30 pm -- 04:10 pm 20 min
DROP FUNCTION IF EXISTS mod_loginventario.f_rep_solicitudentregamodelo(numeric);
DROP TYPE IF EXISTS mod_loginventario.td_rep_solicitudentregamodelo;
CREATE TYPE mod_loginventario.td_rep_solicitudentregamodelo AS
(
	iddocumento numeric(19,0),
	idestado numeric(2),
	logo character varying(255),
	entidad text,
	documentoprimario character varying(250),
	numerodocumento character varying,
	numeroref numeric(19,0),
	estado character varying(255),
	fechadocumento date,
	deposito text,
	codigoestructura character varying(20),
	centrocosto text,
	observaciones character varying(255),
	nombrepersona text,
	cargopersona character varying(100),
	nombrepersonaprobar text,	
	cargopersonaprobar character varying(100)
);

ALTER TYPE mod_loginventario.td_rep_solicitudentregamodelo OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_solicitudentregamodelo(
	p_iddocumento numeric
)
    RETURNS SETOF mod_loginventario.td_rep_solicitudentregamodelo
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
		dd.idestado,
		dd.logo,
		dd.entidad,
		dd.documentoprimario,
		dd.nrodoc as numerodocumento,
		dd.numeroref,
		dd.estado,
		dd.fechacontable as fechadocumento,
		dd.estructuracompleta as deposito,
		dd.codigoestructura,
		(ddc.codigo || ' - ' || ddc.nombre) as centrocosto,
		dd.observaciones,
		dd.nombrepersona as nombrepersona,
		dd.cargopersona as cargopersona,
		dd.nombrepersonaprobar as nombrepersonaprobar,
		dd.cargopersonaprobar as cargopersonaprobar
	from mod_logistica.v_documento dd
	inner join mod_logistica.v_documentocliente ddc on ddc.iddocumento = dd.iddocumento
	where dd.iddocumento = p_iddocumento
	limit 1
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_solicitudentregamodelo(numeric) OWNER TO zeolides;
