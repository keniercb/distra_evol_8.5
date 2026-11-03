-- Table: mod_nomina.conf_variablestipogago_acumliq

-- DROP TABLE IF EXISTS mod_nomina.conf_variablestipogago_acumliq;

CREATE TABLE IF NOT EXISTS mod_nomina.conf_variablestipogago_acumliq
(
    denominacion character varying(255) COLLATE pg_catalog."default",
    acumulaliquida numeric(1,0),
    idtiponomina numeric(19,0),
    idtipopago numeric(19,0),
    idestructura numeric(19,0),
    CONSTRAINT ak_restriccion UNIQUE (acumulaliquida, idtiponomina, idtipopago, idestructura)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_nomina.conf_variablestipogago_acumliq OWNER to zeolides;
