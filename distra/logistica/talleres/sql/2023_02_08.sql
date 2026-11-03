ALTER TABLE IF EXISTS mod_logtaller.conf_servicioarea
    ADD CONSTRAINT fk_confserarea_idactividad FOREIGN KEY (idservicio)
    REFERENCES mod_logtaller.conf_actividad (idactividad) MATCH SIMPLE
    ON UPDATE NO ACTION
   ON DELETE CASCADE;

----------

CREATE SEQUENCE IF NOT EXISTS mod_logtaller.sec_bonificacionpenalizacion_seq
    INCREMENT 1
    START 90000000000
    MINVALUE 90000000000
    MAXVALUE 99999999999
    CACHE 1;

CREATE TABLE IF NOT EXISTS mod_logtaller.dat_bonificacionpenalizacion
(
    idbonificacionpenalizacion numeric(19,0) NOT NULL DEFAULT nextval('mod_logtaller.sec_bonificacionpenalizacion_seq'::regclass),
    idtrabajooperarios numeric(19,0) NOT NULL,
    idestado numeric(1,0) NOT NULL DEFAULT 1,
    idtipobonpen numeric(2,0) NOT NULL,
    idbonpen numeric(1,0) NOT NULL,
    bonpen numeric(19,2) NOT NULL,
    importebase numeric(19,2) NOT NULL,
    observacion character varying(255) COLLATE pg_catalog."default",
    observacioncancel character varying(255) COLLATE pg_catalog."default",
    iduser numeric(19,0),
    idusercancel numeric(19,0),
    fechacreadosistema timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT dat_bonificacionpenalizacion_pkey PRIMARY KEY (idbonificacionpenalizacion),
    CONSTRAINT fk_bonpen_idtrabajooperarios FOREIGN KEY (idtrabajooperarios)
    REFERENCES mod_logtaller.dat_trabajooperarios (idtrabajooperarios) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    )
    WITH (
        OIDS = FALSE
        )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logtaller.dat_bonificacionpenalizacion
    OWNER to zeolides;

COMMENT ON COLUMN mod_logtaller.dat_bonificacionpenalizacion.idbonpen
    IS '0-bonificacion, 1-penalizacion';

COMMENT ON COLUMN mod_logtaller.dat_bonificacionpenalizacion.idtipobonpen
    IS '0-porciento, 1-agrego, 2-fijo';

--------------

COMMENT ON COLUMN mod_logtaller.dat_trabajooperarios.importecobrar
    IS 'importe final del trabajador';

ALTER TABLE IF EXISTS mod_logtaller.dat_trabajooperarios
    ADD COLUMN IF NOT EXISTS importebase numeric(19, 2);

COMMENT ON COLUMN mod_logtaller.dat_trabajooperarios.importebase
    IS 'importe q representa el total en el momento en q se le aplico una bonificacion/penalizacion.';

---------------

CREATE SEQUENCE IF NOT EXISTS mod_logtaller.sec_trabajooperariosaprobado_seq
    INCREMENT 1
    START 90000000000
    MINVALUE 90000000000
    MAXVALUE 99999999999
    CACHE 1;

CREATE TABLE IF NOT EXISTS mod_logtaller.dat_trabajooperariosaprobado
(
    idaprobado numeric(19,0) NOT NULL DEFAULT nextval('mod_logtaller.sec_trabajooperariosaprobado_seq'::regclass),
    idtrabajooperarios numeric(19,0) NOT NULL,
    idusuario numeric(19,0),
    operacion numeric(1,0) NOT NULL DEFAULT 1,
    fechasistema timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT dat_trabajooperariosaprobado_pkey PRIMARY KEY (idaprobado),
    CONSTRAINT fk_trabajooperariosaprobado_idtrabajooperarios FOREIGN KEY (idtrabajooperarios)
    REFERENCES mod_logtaller.dat_trabajooperarios (idtrabajooperarios) MATCH SIMPLE
     ON UPDATE NO ACTION
     ON DELETE NO ACTION
    )
     WITH (
         OIDS = FALSE
         )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logtaller.dat_trabajooperariosaprobado
    OWNER to zeolides;

COMMENT ON COLUMN mod_logtaller.dat_trabajooperariosaprobado.operacion
    IS '1-aprobado, 2-desaprobado';