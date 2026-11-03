CREATE SEQUENCE IF NOT EXISTS mod_logistica.sec_piefirmadefectodocumento_seq
    INCREMENT 1
    START 90000000000
    MINVALUE 90000000000
    MAXVALUE 99999999999
    CACHE 1;

CREATE TABLE IF NOT EXISTS mod_logistica.dat_piefirmadefectodocumento
(
    idpiefirmadef numeric(19) NOT NULL DEFAULT nextval('mod_logistica.sec_piefirmadefectodocumento_seq'::regclass),
    idestructura numeric(19) NOT NULL,
    idfuncionalidad numeric(19) NOT NULL,
    denominacion character varying(255) NOT NULL,
    valor text,
    PRIMARY KEY (idpiefirmadef)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS mod_logistica.dat_piefirmadefectodocumento
    OWNER to zeolides;


ALTER TABLE IF EXISTS mod_logistica.dat_piefirmadocumento
    ADD COLUMN IF NOT EXISTS nombrerevisadopor character varying(255);

ALTER TABLE IF EXISTS mod_logistica.dat_piefirmadocumento
    ADD COLUMN IF NOT EXISTS cargorevisadopor character varying(255);

ALTER TABLE IF EXISTS mod_logistica.dat_piefirmadocumento
    ADD COLUMN IF NOT EXISTS cirevisadopor character varying(11);