CREATE SEQUENCE IF NOT EXISTS mod_datosmaestros.sec_impproducto_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

GRANT SELECT, UPDATE, USAGE
  ON mod_datosmaestros.sec_impproducto_seq TO zeolides;
  
DROP TABLE IF EXISTS mod_datosmaestros.dat_impproducto;

CREATE TABLE IF NOT EXISTS mod_datosmaestros.dat_impproducto
(
    idimpproducto numeric(19,0) NOT NULL,
    idindicador numeric(19,0),
    codigoproducto character varying(255) COLLATE pg_catalog."default",
    descripcionproducto character varying(255) COLLATE pg_catalog."default",
    um character varying(255) COLLATE pg_catalog."default",
    naturaleza character varying(50) COLLATE pg_catalog."default",
    tipo numeric(1,0) DEFAULT 1,
    almacenamiento numeric(19,0) DEFAULT 1,
    utiloherramienta numeric(19,0),
    precio numeric(25,6) DEFAULT 0,
    formaalmacenamiento numeric(19,0),
    grupo character varying(255) COLLATE pg_catalog."default",
    marca character varying(255) COLLATE pg_catalog."default",
    modelo character varying(255) COLLATE pg_catalog."default",
    elementogasto character varying(255) COLLATE pg_catalog."default",
    elementogastoalternativo character varying(255) COLLATE pg_catalog."default",
    denominacionproducto character varying(255) COLLATE pg_catalog."default",
    codigoauxiliar character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT dat_impproducto_pkey PRIMARY KEY (idimpproducto)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_datosmaestros.dat_impproducto
    OWNER to zeolides;

GRANT ALL ON TABLE mod_datosmaestros.dat_impproducto TO zeolides;

COMMENT ON COLUMN mod_datosmaestros.dat_impproducto.almacenamiento
    IS '1- Almacenamiento, 2-Explotación, 3- Ambos';

COMMENT ON COLUMN mod_datosmaestros.dat_impproducto.utiloherramienta
    IS '1-Es util o herramienta, 2-No';

COMMENT ON COLUMN mod_datosmaestros.dat_impproducto.formaalmacenamiento
    IS 'lineal, lotes, serie';