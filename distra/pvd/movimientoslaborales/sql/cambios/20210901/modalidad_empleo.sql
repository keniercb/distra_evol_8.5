CREATE SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
    INCREMENT 1
    START 1
    MINVALUE 0
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
    OWNER TO zeolides;
COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
    IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_modalidadempleo.';

CREATE TABLE mod_fuerzatrabajo.nom_modalidadempleo
(
    idmodalidadempleo numeric(19,0) NOT NULL DEFAULT nextval('mod_fuerzatrabajo.sec_modalidadempleo_seq'::regclass),
    denominacion character varying(255) COLLATE pg_catalog."default" NOT NULL,
    descripcion character varying(500) COLLATE pg_catalog."default",
    fdesde date NOT NULL DEFAULT now(),
    fhasta date,
    gestion numeric(1,0) NOT NULL DEFAULT 1,
    CONSTRAINT pk_modalidadempleo PRIMARY KEY (idmodalidadempleo)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
ALTER TABLE mod_fuerzatrabajo.nom_modalidadempleo
    OWNER to zeolides;
COMMENT ON TABLE mod_fuerzatrabajo.nom_modalidadempleo
    IS 'Almacena los programas laborales.';
COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.idmodalidadempleo
    IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.denominacion
    IS 'Denominación de la modalidad de empleo.';
COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.descripcion
    IS 'Descripción de la modalidad de empleo.';
COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.fdesde
    IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.fhasta
    IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.gestion
    IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

ALTER TABLE mod_persona.dat_situacionlaboral
    ADD COLUMN idmodalidadempleo numeric(19,0);
COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idmodalidadempleo
    IS 'Identificador de la modalidad de empleo.';