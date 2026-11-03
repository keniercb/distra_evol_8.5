CREATE SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999
    CACHE 1;

ALTER SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
    OWNER TO zeolides;

COMMENT ON SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
    IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargofacultado".';

CREATE TABLE mod_estructuracomp.nom_cargofacultado
(
    idcargofacultado numeric(19,0) NOT NULL DEFAULT nextval('mod_estructuracomp.sec_cargofacultado_seq'::regclass),
    denominacion character varying(100) COLLATE pg_catalog."default" NOT NULL,
    abreviatura character varying(60) COLLATE pg_catalog."default",
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date,
    CONSTRAINT pk_cargofacultado PRIMARY KEY (idcargofacultado)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE mod_estructuracomp.nom_cargofacultado
    OWNER to zeolides;
COMMENT ON CONSTRAINT pk_cargofacultado ON mod_estructuracomp.nom_cargofacultado
    IS 'Identificador único para cada tupla de la tabla nom_cargofacultado.';