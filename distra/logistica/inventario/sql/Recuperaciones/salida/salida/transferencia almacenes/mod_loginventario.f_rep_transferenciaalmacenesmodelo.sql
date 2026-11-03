--TYPE
DROP FUNCTION IF EXISTS mod_loginventario.f_rep_transferenciaalmacenesmodelo(numeric);
DROP TYPE IF EXISTS mod_loginventario.td_rep_transferenciaalmacenesmodelo;
CREATE TYPE mod_loginventario.td_rep_transferenciaalmacenesmodelo AS
(
	iddocumento numeric(19,0),
	entidad text,
	reeup character varying(20),
	documentoprimario character varying(250),
	numerodocumento character varying,
	fechadocumento date,
	logo character varying(255),
	almsum text,
	dirsum character varying,
	codsum character varying(20),
	almrecep character varying,
	direcep text,
	codrecep character varying,
	idestado numeric(2),
	estado character varying(255),
	entidadtransp character varying,
	direntidadtransp character varying(255),
	casilla numeric(19),
	ciconductor character varying(20),
	chapa character varying(10),
	cartaporte numeric(19),
	nrodocorigen character varying,
	aliasdocorigen character varying(250),
	fechadocorigen date,
	nombreconductor character varying(100),
	nombrepersona text,
	cargopersona character varying(100),
	nombrepersonaprobar text,
	cargopersonaprobar character varying(100),
	operacion character varying(255),
	observaciones character varying(255)
);

ALTER TYPE mod_loginventario.td_rep_transferenciaalmacenesmodelo OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_loginventario.f_rep_transferenciaalmacenesmodelo(
	p_iddocumento numeric
)
    RETURNS SETOF mod_loginventario.td_rep_transferenciaalmacenesmodelo
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
		dd.codigoentidad as reeup,
		dd.documentoprimario,
		dd.nrodoc as numerodocumento,
		dd.fechacontable as fechadocumento,
		dd.logo,
		dd.estructuracompleta as almsum,
		dd.direccionestructura as dirsum,
		dd.codigoestructura as codsum,
		ddc.nombre as almrecep,
		ddc.direccion as direcep,
		ddc.codigo as codrecep,
		dd.idestado,
		dd.estado,
		ddt.cliente as entidadtransp,
		ddt.direccion as direntidadtransp,
		ddt.casilla,
		ddt.ciconductor,
		ddt.matricula as chapa,
		ddt.cartaporte,
		ddo.nrodoc as nrodocorigen,
		ddo.documentoprimario as aliasdocorigen,
		ddo.fechacontable as fechadocorigen,
		ddt.nombreconductor,
		dd.nombrepersona,
		dd.cargopersona,
		dd.nombrepersonaprobar,
		dd.cargopersonaprobar,
		nop.denominacion as operacion,
		dd.observaciones
	from mod_logistica.v_documento dd
	inner join mod_logistica.dat_documentopadre ddpad on ddpad.iddocumento = dd.iddocumento
	inner join mod_logistica.v_documento ddo on ddo.iddocumento = ddpad.idpadre
	inner join mod_logistica.v_documentocliente ddc on ddc.iddocumento = dd.iddocumento
	left join mod_logistica.v_documentotransporte ddt on ddt.iddocumento = dd.iddocumento
	left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
	where dd.iddocumento = p_iddocumento
	limit 1
 );
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_rep_transferenciaalmacenesmodelo(numeric) OWNER TO zeolides;
--llamada
--select * from mod_loginventario.f_rep_transferenciaalmacenesmodelo($P{iddocumento});
