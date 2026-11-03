CREATE SEQUENCE mod_datosmaestros.sec_periodoabierto_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_datosmaestros.sec_periodoabierto_seq RESTART WITH 1;

CREATE TABLE mod_datosmaestros.dat_periodoabierto (
  idperiodoabierto NUMERIC(19,0) DEFAULT nextval('mod_datosmaestros.sec_periodoabierto_seq'::regclass) NOT NULL,
  idperiodo NUMERIC(19,0) NOT NULL,
  idestructurasubsist NUMERIC(19,0) NOT NULL,
  idsubsistema NUMERIC(19,0) NOT NULL,
  observacionsolicitud VARCHAR NOT NULL,
  idusuariosolicitud NUMERIC(19,0) NOT NULL,
  fechasolicitud DATE DEFAULT now() NOT NULL,
  observacionaprobacion VARCHAR,
  idusuarioaprobacion NUMERIC(19,0),
  fechaaprobacion TIMESTAMP(0) WITHOUT TIME ZONE,
  idusuariocierre NUMERIC(19,0),
  fechacierre TIMESTAMP(0) WITHOUT TIME ZONE,
  estado NUMERIC(1,0) DEFAULT 0 NOT NULL,
  CONSTRAINT dat_periodoabierto_pkey PRIMARY KEY(idperiodoabierto),
  CONSTRAINT dat_periodoabierto_fk FOREIGN KEY (idestructurasubsist)
    REFERENCES mod_datosmaestros.dat_estructurasubsist(idestructurasubsist)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT dat_periodoabierto_fk1 FOREIGN KEY (idperiodo)
    REFERENCES mod_datosmaestros.dat_periodocontable(idperiodo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT dat_periodoabierto_fk2 FOREIGN KEY (idsubsistema)
    REFERENCES mod_datosmaestros.nom_subsistema(idsubsistema)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT dat_periodoabierto_fk3 FOREIGN KEY (idusuarioaprobacion)
    REFERENCES mod_seguridad.seg_usuario(idusuario)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT dat_periodoabierto_fk4 FOREIGN KEY (idusuariosolicitud)
    REFERENCES mod_seguridad.seg_usuario(idusuario)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT dat_periodoabierto_fk5 FOREIGN KEY (idusuariocierre)
    REFERENCES mod_seguridad.seg_usuario(idusuario)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_datosmaestros.dat_periodoabierto
  ALTER COLUMN idperiodoabierto SET STATISTICS 0;

ALTER TABLE mod_datosmaestros.dat_periodoabierto
  ALTER COLUMN idperiodo SET STATISTICS 0;

ALTER TABLE mod_datosmaestros.dat_periodoabierto
  ALTER COLUMN idestructurasubsist SET STATISTICS 0;

ALTER TABLE mod_datosmaestros.dat_periodoabierto
  ALTER COLUMN idsubsistema SET STATISTICS 0;

COMMENT ON TABLE mod_datosmaestros.dat_periodoabierto
IS 'Tabla de registro de las solicitudes para reabrir subsistemas, si se aprueba la solicitud luego se registra el usuario-fecha del que lo volvio a cerrar. Los comprobantes de un subsistema entre fechaaprobacion y fechacierre, fueron realizadas con el modulo reabierto';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.idperiodoabierto
IS 'Identificador de la tabla';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.idperiodo
IS 'Periodo contable';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.observacionsolicitud
IS 'Motivo de la solicitud';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.idusuariosolicitud
IS 'Usuario que solicita';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.fechasolicitud
IS 'Fecha de la solicitud';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.observacionaprobacion
IS 'Motivo o acuerdo por el que se aprueba/rechaza la peticion';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.idusuarioaprobacion
IS 'Usuario que aprueba o rechaza';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.fechaaprobacion
IS 'Fecha de aprobacion/rechazo';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.idusuariocierre
IS 'En caso de haberse aprobado... usuario que cerró de nuevo el periodo';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.fechacierre
IS 'En caso de haberse aprobado... fecha en la que se cerró de nuevo el periodo';

COMMENT ON COLUMN mod_datosmaestros.dat_periodoabierto.estado
IS '0-Pendiente (Solicitado), 1-Aprobado (Abierto), 2-Rechazado, 3-Cerrado';

ALTER TABLE mod_datosmaestros.dat_periodoabierto
  OWNER TO zeolides;