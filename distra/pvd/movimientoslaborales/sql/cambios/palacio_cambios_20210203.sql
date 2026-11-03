ALTER TABLE mod_fuerzatrabajo.dat_reserva
    ADD COLUMN idclasificacion numeric(19,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.idclasificacion
    IS 'Identificador de la clasificacion.';

ALTER TABLE mod_fuerzatrabajo.dat_reserva
    ADD COLUMN motivo character varying(255) COLLATE pg_catalog."default";

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.motivo
    IS 'Motivo por el cual causa baja de la reserva.';
	
ALTER TABLE mod_fuerzatrabajo.dat_reserva
    ADD COLUMN cargoprom character varying(255) COLLATE pg_catalog."default";

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.cargoprom
    IS 'Cargo para el cual fue promovido.';