
CREATE SEQUENCE IF NOT EXISTS mod_logproduccion.sec_precioporindicador_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 999999999999999999
    CACHE 1;

ALTER SEQUENCE mod_logproduccion.sec_precioporindicador_seq
    OWNER TO zeolides;


CREATE TABLE IF NOT EXISTS mod_logproduccion.dat_precioporindicador
(
    idprecioporindicador numeric(19,0) NOT NULL DEFAULT nextval('mod_logproduccion.sec_precioporindicador_seq'::regclass),
    identidad numeric(19,0) NOT NULL,
    idcartatecindustrial numeric(19,0) NOT NULL,
    idindicador numeric(19,0) NOT NULL,
    precio numeric(25,6) NOT NULL DEFAULT 0,
    CONSTRAINT dat_precioporindicador_pkey PRIMARY KEY (idprecioporindicador),
    CONSTRAINT dat_precioporindicador_idx UNIQUE (identidad, idcartatecindustrial, idindicador),
    CONSTRAINT dat_precioporindicador_fk FOREIGN KEY (identidad)
        REFERENCES mod_estructuracomp.nom_filaestruc (idfila) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT dat_precioporindicador_fk1 FOREIGN KEY (idcartatecindustrial)
        REFERENCES mod_planifindustrial.dat_cartatecindustrial (idcartatecindustrial) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT dat_precioporindicador_fk2 FOREIGN KEY (idindicador)
        REFERENCES mod_datosmaestros.nom_indicador (idindicador) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logproduccion.dat_precioporindicador
    OWNER to zeolides;

GRANT ALL ON TABLE mod_logproduccion.dat_precioporindicador TO zeolides;

COMMENT ON TABLE mod_logproduccion.dat_precioporindicador
    IS 'Tabla para desnormalizar los valores diferenciados del precio de los indicadores que vienen en la norma de las actividades de las cartas tecnológicas';

COMMENT ON COLUMN mod_logproduccion.dat_precioporindicador.idprecioporindicador
    IS 'Identificador de la tabla';
ALTER TABLE IF EXISTS mod_logproduccion.dat_precioporindicador
    ALTER COLUMN idprecioporindicador SET STATISTICS 0;

COMMENT ON COLUMN mod_logproduccion.dat_precioporindicador.identidad
    IS 'Identificador de la entidad logueada';
ALTER TABLE IF EXISTS mod_logproduccion.dat_precioporindicador
    ALTER COLUMN identidad SET STATISTICS 0;

COMMENT ON COLUMN mod_logproduccion.dat_precioporindicador.idcartatecindustrial
    IS 'Identificador de la carta tecnológica industrial';
ALTER TABLE IF EXISTS mod_logproduccion.dat_precioporindicador
    ALTER COLUMN idcartatecindustrial SET STATISTICS 0;

COMMENT ON COLUMN mod_logproduccion.dat_precioporindicador.idindicador
    IS 'Identificador del indicador de la actividad de la carta tecnológica';
ALTER TABLE IF EXISTS mod_logproduccion.dat_precioporindicador
    ALTER COLUMN idindicador SET STATISTICS 0;

COMMENT ON COLUMN mod_logproduccion.dat_precioporindicador.precio
    IS 'Valor del precio modificado o tomado directamente del indicador';
ALTER TABLE IF EXISTS mod_logproduccion.dat_precioporindicador
    ALTER COLUMN precio SET STATISTICS 0;
