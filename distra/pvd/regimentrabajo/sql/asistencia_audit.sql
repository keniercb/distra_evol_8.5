DROP TABLE IF EXISTS public.asistencia_audit;
CREATE TABLE IF NOT EXISTS public.asistencia_audit
(
    operacion "char" NOT NULL,
    momento timestamp without time zone NOT NULL,
    usuario text COLLATE pg_catalog."default" NOT NULL,
    ipcliente inet,
    valoranterior json,
    idasistencia numeric(19,0),
    fechahoraentrada timestamp without time zone,
    idcausa numeric(19,0),
    fdesde date,
    fhasta date,
    hrsdescontadas character varying(8) COLLATE pg_catalog."default",
    idpersona numeric(19,0),
    fechahorasalida timestamp without time zone,
    fecharegistro date ,
    observacion character varying(500) COLLATE pg_catalog."default",
    idpadre numeric(19,0),
    horasextras character varying(8) COLLATE pg_catalog."default",
    idpersonacontrola numeric(19,0),
    actualizado numeric(1,0) DEFAULT 0,
    fhabilitado numeric(1,0) DEFAULT 0,
    hferiadas character varying(8) COLLATE pg_catalog."default",
    idcargo numeric(19,0),
    idpersonamodifica numeric(19,0),
    certificado numeric(1,0) DEFAULT 0,
    idpersonacertifica numeric(19,0),
    hrstrabajadas character varying(10) COLLATE pg_catalog."default" DEFAULT '00:00:00'::character varying,
    idgrupodescanso numeric(19,0),
    idturnotrabajo numeric(19,0),
    aprobado numeric(1,0),
    idpersonaaprueba numeric(19,0),
    certificadocontinuado numeric(1,0) DEFAULT 0,
    origen numeric(1,0) DEFAULT 0,
    estado numeric(1,0) DEFAULT 1
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.asistencia_audit OWNER to zeolides;

--función trigger mod_regimentrabajo.ft_auditar_borrarasistencia()
DROP TRIGGER IF EXISTS t_audit_borrarasistencia ON mod_regimentrabajo.dat_asistencia;
DROP TRIGGER IF EXISTS t_truncate ON mod_regimentrabajo.dat_asistencia;
DROP FUNCTION IF EXISTS mod_regimentrabajo.ft_auditar_borrarasistencia();

CREATE OR REPLACE FUNCTION mod_regimentrabajo.ft_auditar_borrarasistencia()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE

BEGIN
    IF (TG_OP = 'DELETE') THEN
		insert into public.asistencia_audit
		select 'D', now(), getpgusername(), inet_client_addr(), row_to_json(OLD), o.* from old_table o;
    END IF;
	 IF (TG_OP = 'TRUNCATE') THEN
		insert into public.asistencia_audit
		select 'T', now(), getpgusername(), inet_client_addr(), row_to_json(OLD), o.* from mod_regimentrabajo.dat_asistencia o;
    END IF; 
  RETURN NULL;
END;
$BODY$;

ALTER FUNCTION mod_regimentrabajo.ft_auditar_borrarasistencia() OWNER TO zeolides;
GRANT EXECUTE ON FUNCTION mod_regimentrabajo.ft_auditar_borrarasistencia() TO PUBLIC;
GRANT EXECUTE ON FUNCTION mod_regimentrabajo.ft_auditar_borrarasistencia() TO zeolides;

CREATE TRIGGER t_truncate
    BEFORE TRUNCATE
    ON mod_regimentrabajo.dat_asistencia
    FOR EACH STATEMENT
    EXECUTE FUNCTION mod_regimentrabajo.ft_auditar_borrarasistencia();

CREATE TRIGGER t_audit_borrarasistencia
    AFTER DELETE
    ON mod_regimentrabajo.dat_asistencia
    REFERENCING OLD TABLE AS old_table
    FOR EACH STATEMENT
    EXECUTE FUNCTION mod_regimentrabajo.ft_auditar_borrarasistencia();

--recuperar asistencia
/*

INSERT INTO mod_regimentrabajo.dat_asistencia(
	idasistencia, fechahoraentrada, idcausa, fdesde, fhasta, hrsdescontadas, idpersona, fechahorasalida, fecharegistro, observacion, idpadre, horasextras, idpersonacontrola, actualizado, fhabilitado, hferiadas, idcargo, idpersonamodifica, certificado, idpersonacertifica, hrstrabajadas, idgrupodescanso, idturnotrabajo, aprobado, idpersonaaprueba, certificadocontinuado, origen, estado)
	(SELECT idasistencia, fechahoraentrada, idcausa, fdesde, fhasta, hrsdescontadas, idpersona, fechahorasalida, fecharegistro, observacion, idpadre, horasextras, idpersonacontrola, actualizado, fhabilitado, hferiadas, idcargo, idpersonamodifica, certificado, idpersonacertifica, hrstrabajadas, idgrupodescanso, idturnotrabajo, aprobado, idpersonaaprueba, certificadocontinuado, origen, estado
	FROM public.asistencia_audit
	order by momento desc
) on conflict do nothing;

*/
