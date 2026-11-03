CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_desglosepago
(
    id serial NOT NULL,
    iddocumento numeric(19,0) NOT NULL,
    idformapago numeric(19,0) NOT NULL,
    importe numeric(25,2),
    CONSTRAINT dat_desglosepago_pk PRIMARY KEY (id),
    CONSTRAINT dat_desglosepago_formapago_fk FOREIGN KEY (idformapago)
        REFERENCES mod_logpuntoventa.nom_modopago (idmodopago) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT dat_desglosepago_iddocumento_fk FOREIGN KEY (iddocumento)
        REFERENCES mod_logistica.dat_documento (iddocumento) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_desglosepago
    OWNER to zeolides;

INSERT INTO mod_logistica.nom_variableglobal(
	nombre, valor,  activo, ambito, datatype)
	VALUES ('DESGLOSE_VENTA', 'false', 1, 1, 2);