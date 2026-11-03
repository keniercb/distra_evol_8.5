CREATE SEQUENCE IF NOT EXISTS mod_rrhhmaestro.sec_moduloentidad_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 999
    CACHE 1;

ALTER SEQUENCE mod_rrhhmaestro.sec_moduloentidad_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_rrhhmaestro.sec_moduloentidad_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_moduloentidad".';

CREATE TABLE IF NOT EXISTS mod_rrhhmaestro.dat_moduloentidad
(
    idmoduloentidad numeric(3,0) NOT NULL DEFAULT nextval('mod_rrhhmaestro.sec_moduloentidad_seq'::regclass),
    identificador character varying(50) COLLATE pg_catalog."default" NOT NULL,
    denominacion character varying(150) COLLATE pg_catalog."default" NOT NULL,
    cobroypago numeric(1,0) DEFAULT 0,
    apertura numeric(1,0) DEFAULT 0,
    parrafofiscal numeric(1,0) DEFAULT 0,
    fijaretencionesporpagar numeric(1,0) DEFAULT 1,
    sncsigerh numeric(1,0) DEFAULT 0,
    identidad numeric(19,0),
    CONSTRAINT pk_moduloentidad PRIMARY KEY (idmoduloentidad)
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_rrhhmaestro.dat_moduloentidad OWNER to zeolides;

ALTER TABLE IF EXISTS mod_rrhhmaestro.dat_moduloentidad DROP CONSTRAINT IF EXISTS ak_identificador_mod_entidad;
ALTER TABLE IF EXISTS mod_rrhhmaestro.dat_moduloentidad ADD CONSTRAINT ak_identificador_mod_entidad UNIQUE (identificador,identidad);
COMMENT ON CONSTRAINT ak_identificador_mod_entidad ON mod_rrhhmaestro.dat_moduloentidad IS 'Restricción de unicidad sobre las columnas "identificador" e "identidad".';

--carga inicial
--insert into mod_rrhhmaestro.dat_moduloentidad (select * from mod_rrhhmaestro.dat_modulo where identidad is not null);

--borrar
--delete from mod_rrhhmaestro.dat_modulo where identidad is not null;
--ALTER TABLE IF EXISTS mod_rrhhmaestro.dat_modulo DROP COLUMN IF EXISTS identidad;

ALTER TABLE IF EXISTS mod_rrhhmaestro.dat_modulo DROP CONSTRAINT IF EXISTS ak_identificador;
ALTER TABLE IF EXISTS mod_rrhhmaestro.dat_modulo ADD CONSTRAINT ak_identificador UNIQUE (identificador);
COMMENT ON CONSTRAINT ak_identificador ON mod_rrhhmaestro.dat_modulo IS 'Restricción de unicidad sobre la columna "identificador".';

/*Consulta para la vista*/
select idmoduloentidad, trim(identificador) as identificador, 
		denominacion, cobroypago, apertura, parrafofiscal, 
		fijaretencionesporpagar, sncsigerh, 1 as tabla
	from mod_rrhhmaestro.dat_moduloentidad
	where identidad = $p{identidad} -- identificador de la estructura con la configuración específica
union
select idmodulo, trim(identificador) as identificador, 
		denominacion, cobroypago, apertura, parrafofiscal, 
		fijaretencionesporpagar, sncsigerh, 2 as tabla
	from mod_rrhhmaestro.dat_modulo
	where trim(identificador) not in (select trim(identificador) as identificador
										from mod_rrhhmaestro.dat_moduloentidad
										where identidad = $p{identidad} -- identificador de la estructura con la configuración específica
                                        );
