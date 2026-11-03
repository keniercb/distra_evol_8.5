CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_datventaservicio_seq
  INCREMENT 1 MINVALUE 1000
  MAXVALUE 1099999999 START 1000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_datventaservicio_seq RESTART WITH 1000;

CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_ventaservicio (
  idventaservicio NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datventaservicio_seq'::regclass) NOT NULL,
  idindicador NUMERIC(19,0),
  codigo VARCHAR(255),
  denominacion VARCHAR(255),	
  idventas NUMERIC(19,0),
  cantidad NUMERIC(25,6),
  descuento NUMERIC(25,6) DEFAULT 0,
  recargo NUMERIC(25,6) DEFAULT 0,
  precio NUMERIC(25,6) DEFAULT 0,
  importetotal NUMERIC(19,2) DEFAULT 0,
  cantidaddev NUMERIC(25,6) DEFAULT 0,
  CONSTRAINT pk_ventaservicio PRIMARY KEY(idventaservicio),
  CONSTRAINT fk_indicador_ventaservicio FOREIGN KEY (idindicador)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_ventas_ventaservicio FOREIGN KEY (idventas)
    REFERENCES mod_logpuntoventa.dat_ventas(idventas)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  ALTER COLUMN idventaservicio SET STATISTICS 0;

ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  ALTER COLUMN idindicador SET STATISTICS 0;

ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  ALTER COLUMN idventas SET STATISTICS 0;

COMMENT ON TABLE mod_logpuntoventa.dat_ventaservicio
IS 'Tabla utilizada para almacenar las ventas por servicios';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.idventaservicio
IS 'Identificador único para las ventas por servicios';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.idindicador
IS 'Identificador para el servicio';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.idventas
IS 'Identificador para las ventas';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.cantidad
IS 'Cantidad del servicio';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.descuento
IS 'Descuento aplicado al servicio';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.recargo
IS 'Recargo aplicado al servicio';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.precio
IS 'Precio de venta de la operacion';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.importetotal
IS 'Importe total de la operacion';

COMMENT ON COLUMN mod_logpuntoventa.dat_ventaservicio.cantidaddev
IS 'Cantidad devuelta del servicio';

CREATE INDEX dat_ventaservicio_idindicador ON mod_logpuntoventa.dat_ventaservicio
  USING btree (idindicador);

CREATE INDEX idx_ventasservicio ON mod_logpuntoventa.dat_ventaservicio
  USING btree (idventas);

ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  CLUSTER ON idx_ventasservicio;

ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  OWNER TO zeolides;