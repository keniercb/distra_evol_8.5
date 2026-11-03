-- Esquema mod_fuerzatrabajo
CREATE TABLE IF NOT EXISTS mod_fuerzatrabajo.dat_movnomina
(
    idmovnomina numeric(19,0) NOT NULL DEFAULT nextval('mod_fuerzatrabajo.sec_movimientonomina_seq'::regclass),
    idsituacionlaboralactual numeric(19,0) NOT NULL,
    contenido json,
    CONSTRAINT pk_idmovnomina PRIMARY KEY (idmovnomina)
)

ALTER TABLE IF EXISTS mod_fuerzatrabajo.dat_movnomina
    OWNER to zeolides;

COMMENT ON TABLE mod_fuerzatrabajo.dat_movnomina
    IS 'Almacena la información de los movimientos de nómina que se generen por baja y por movimiento o cambio de contrato.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movnomina.idmovnomina
    IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movnomina.idsituacionlaboralactual
    IS 'Determina el identificador de la situación laboral que la persona ocupa antes de hacer efectivo el movimiento.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movnomina.contenido
    IS 'Determina el contenido con que se generó el reporte Movimiento de nómina por primera vez al relizarse dicha acción(baja o movimiento), con el objetivo de mostrar la misma  información cada vez que se vuelva a generar por ejemplo los elementos salariales del cargo que en el momento de la baja pudieron tener un valor y hoy otro.';

CREATE SEQUENCE IF NOT EXISTS mod_fuerzatrabajo.sec_trasladoueb_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE mod_fuerzatrabajo.sec_trasladoueb_seq
    OWNER TO zeolides;

CREATE TABLE IF NOT EXISTS mod_fuerzatrabajo.dat_trasladoueb
(
    idtraslado bigint NOT NULL DEFAULT nextval('mod_fuerzatrabajo.sec_trasladoueb_seq'::regclass),
    idpersona numeric(19,0) NOT NULL,
    idsituacionlaboral numeric(19,0) NOT NULL,
    idueb numeric(19,0) NOT NULL,
    CONSTRAINT dat_trasladoueb_pkey PRIMARY KEY (idtraslado)
)

ALTER TABLE IF EXISTS mod_fuerzatrabajo.dat_trasladoueb
    OWNER to zeolides;

COMMENT ON TABLE mod_fuerzatrabajo.dat_trasladoueb
    IS 'Almacena los traslados entre las unidades básicas.';

CREATE SEQUENCE IF NOT EXISTS mod_fuerzatrabajo.sec_modalidadempleo_seq
    INCREMENT 1
    START 1
    MINVALUE 0
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
    OWNER TO zeolides;

CREATE TABLE IF NOT EXISTS mod_fuerzatrabajo.nom_modalidadempleo
(
    idmodalidadempleo numeric(19,0) NOT NULL DEFAULT nextval('mod_fuerzatrabajo.sec_modalidadempleo_seq'::regclass),
    denominacion character varying(255) COLLATE pg_catalog."default" NOT NULL,
    descripcion character varying(500) COLLATE pg_catalog."default",
    fdesde date NOT NULL DEFAULT now(),
    fhasta date,
    gestion numeric(1,0) NOT NULL DEFAULT 1,
    CONSTRAINT pk_modalidadempleo PRIMARY KEY (idmodalidadempleo)
)

ALTER TABLE IF EXISTS mod_fuerzatrabajo.nom_modalidadempleo
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

ALTER TABLE IF EXISTS mod_fuerzatrabajo.nom_motivobaja
    ADD COLUMN fluctuacion numeric(19,0) DEFAULT 2;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.fluctuacion
    IS 'Determina si la causa de la baja influye o no en la fluctuación laboral.
1-si
0-no';

-- Esquema: mod_persona
ALTER TABLE IF EXISTS mod_persona.dat_situacionlaboral
    ADD COLUMN nromn numeric(19,0);

ALTER TABLE IF EXISTS mod_persona.dat_situacionlaboral
    ADD COLUMN idmodalidadempleo numeric(19,0);

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idmodalidadempleo
    IS 'Identificador de la modalidad de empleo.';

ALTER TABLE IF EXISTS mod_persona.dat_situacionlaboral
    ADD CONSTRAINT fk_modalidadempleo_sitlaboral_idmodalidadempleo FOREIGN KEY (idmodalidadempleo)
    REFERENCES mod_fuerzatrabajo.nom_modalidadempleo (idmodalidadempleo) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;