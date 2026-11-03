--consulta
/*
SELECT distinct
dd.iddocumento,
dd.entidad,
dd.estructuracompleta as deposito,
dd.nrodoc as numerodocumento,
dd.fechacontable as fechadocumento,
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
dd.logo,
dp.documentoprimario as documentoprimariopadre,
dp.fechadocumento as fechadocumentopadre,
dp.numerodocumento as numerodocumentopadre,
dp.numeroref as numerorefpadre,
ddc.nombre AS entregado
FROM mod_logistica.v_documento dd
 LEFT JOIN mod_logistica.v_documentopadre dp ON dp.iddocumento =
   dd.iddocumento
LEFT JOIN mod_logistica.v_documentocliente ddc ON ddc.iddocumento =
         dd.iddocumento
WHERE dd.iddocumento = $P{iddocumento}
LIMIT 1
*/

--TYPE
DROP FUNCTION IF EXISTS mod_loginventario.f_rep_valedevolucionmodelo(numeric);
DROP TYPE IF EXISTS mod_loginventario.td_rep_valedevolucionmodelo;
CREATE TYPE mod_loginventario.td_rep_valedevolucionmodelo AS
(
	iddocumento numeric,
	entidad text,
	deposito text,
	numerodocumento character varying,
	fechadocumento date,
	observaciones character varying,
	documentoprimario character varying,
	logo character varying,	
	documentoprimariopadre character varying,
	fechadocumentopadre date,
	numerodocumentopadre character varying,
	numerorefpadre numeric,
	entregado character varying
);

ALTER TYPE mod_loginventario.td_rep_valedevolucionmodelo OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_valedevolucionmodelo(
	p_iddocumento numeric
)
    RETURNS SETOF mod_loginventario.td_rep_valedevolucionmodelo
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
		dd.entidad,--Entidad
		dd.estructuracompleta as deposito,--Depósito
		dd.nrodoc as numerodocumento,--N.º
		dd.fechacontable as fechadocumento,--Fecha
		dd.observaciones,--Observaciones
		dd.documentoprimario,--Título
		dd.logo,--Logo
		dp.documentoprimario as documentoprimariopadre,--Doc. origen
		dp.fechadocumento as fechadocumentopadre,--Fecha doc. origen
		dp.numerodocumento as numerodocumentopadre,--N.º doc. origen
		dp.numeroref as numerorefpadre,--N.º doc. origen
		ddc.nombre AS entregado--Devuelto por
	from mod_logistica.v_documento dd
	left join mod_logistica.v_documentopadre dp ON dp.iddocumento = dd.iddocumento
	left join mod_logistica.v_documentocliente ddc ON ddc.iddocumento = dd.iddocumento
	where dd.iddocumento = p_iddocumento
	limit 1	 
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_valedevolucionmodelo(numeric) OWNER TO zeolides;
--llamada
--select * from mod_loginventario.f_rep_valedevolucionmodelo($P{iddocumento})
