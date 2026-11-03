CREATE SEQUENCE mod_planificacion.sec_controldemanda_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 1999999999999999999 START 1
  CACHE 1;

CREATE TABLE mod_planificacion.dat_controldemanda (
  idcontroldemanda NUMERIC(19,0) DEFAULT nextval('mod_planificacion.sec_controldemanda_seq'::regclass) NOT NULL,
  idejercicio NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idindicador NUMERIC(19,0) NOT NULL,
  idunidadmedida NUMERIC(19,0) NOT NULL,
  viasadquisicion VARCHAR(255),
  organossatisface VARCHAR(255),
  precio NUMERIC(19,3) DEFAULT 0 NOT NULL,
  cantidad NUMERIC(19,3) DEFAULT 0 NOT NULL,
  idaprobacion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  puntualizacion NUMERIC(1,0) DEFAULT 0 NOT NULL,
  adicionado NUMERIC(1,0) DEFAULT 0 NOT NULL,
  CONSTRAINT dat_controldemanda_pkey PRIMARY KEY(idcontroldemanda),
  CONSTRAINT fk_controldemanda_aprobacion FOREIGN KEY (idaprobacion)
    REFERENCES mod_planificacion.nom_aprobacion(idaprobacion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_controldemanda_ejercicio FOREIGN KEY (idejercicio)
    REFERENCES mod_planificacion.nom_ejercicioplanificacion(idejercicio)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_controldemanda_entidad FOREIGN KEY (identidad)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_controldemanda_indicador FOREIGN KEY (idindicador)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_controldemanda_unidadmedida FOREIGN KEY (idunidadmedida)
    REFERENCES mod_datosmaestros.nom_unidadmedida(idunidadmedida)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_planificacion.dat_controldemanda
  ALTER COLUMN precio SET STATISTICS 0;

ALTER TABLE mod_planificacion.dat_controldemanda
  ALTER COLUMN cantidad SET STATISTICS 0;

COMMENT ON TABLE mod_planificacion.dat_controldemanda
IS 'Tabla que almacena el control de la demanda por indicadores y ejercicios que resulte del balance material';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.idejercicio
IS 'Registra el identificador del ejercicio para el cual se realiza el control.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.identidad
IS 'Registra la entidad a la que pertenece la ejecución. Puede ser el id de la entidad CB o el id de la entidad OD, dependiendo de la configuración del componente.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.idindicador
IS 'Registra el identificador del indicador a controlar.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.idunidadmedida
IS 'Registra el id de la unidad de medidad del indicador en el momento de la planificación.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.viasadquisicion
IS 'Registra la denominación de las vías de adquisición del indicador en el momento de la planificación.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.organossatisface
IS 'Registra la denominación de los órganos que satisfacen del indicador en el momento de la planificación.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.precio
IS 'Actualización del precio del indicador en la planificación.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.cantidad
IS 'Actualización de la demanda saliente de BM.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.idaprobacion
IS 'Nivel de aprobación del plan aprobado.';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.puntualizacion
IS 'Registra si la planificación del indicador ha sido modificada.(0-no modificada, 1-modificada)';

COMMENT ON COLUMN mod_planificacion.dat_controldemanda.adicionado
IS 'Si el indicador es de la planificación o fue adicionado en la ejecución.';

CREATE SEQUENCE mod_planificacion.sec_controldemandafecha_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 1999999999999999999 START 1
  CACHE 1;
  
CREATE TABLE mod_planificacion.dat_controldemandafecha (
  idcontroldemandafecha NUMERIC(19,0) DEFAULT nextval('mod_planificacion.sec_controldemandafecha_seq'::regclass) NOT NULL,
  idcontroldemanda NUMERIC(19,0) NOT NULL,
  cantidadcontratada NUMERIC(19,3) DEFAULT 0 NOT NULL,
  preciocontratacion NUMERIC(19,3) DEFAULT 0 NOT NULL,
  cantidadejecutada NUMERIC(19,3) DEFAULT 0 NOT NULL,
  precioejecucion NUMERIC(19,3) DEFAULT 0 NOT NULL,
  iddatosnomenclador NUMERIC(19,0) NOT NULL,
  idaprobacionejecucion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT dat_controldemandafecha_pkey PRIMARY KEY(idcontroldemandafecha),
  CONSTRAINT fk_aprobacion_controldemandafecha_idaprobacion FOREIGN KEY (idaprobacionejecucion)
    REFERENCES mod_planificacion.nom_aprobacion(idaprobacion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_controldemandafecha_controldemanda FOREIGN KEY (idcontroldemanda)
    REFERENCES mod_planificacion.dat_controldemanda(idcontroldemanda)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_datosnomenclador_controldemandafecha_iddatosnomenclador FOREIGN KEY (iddatosnomenclador)
    REFERENCES mod_planificacion.nom_datosnomenclador(iddatosnomenclador)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_planificacion.dat_controldemandafecha
  ALTER COLUMN idcontroldemandafecha SET STATISTICS 0;

ALTER TABLE mod_planificacion.dat_controldemandafecha
  ALTER COLUMN idcontroldemanda SET STATISTICS 0;

ALTER TABLE mod_planificacion.dat_controldemandafecha
  ALTER COLUMN cantidadcontratada SET STATISTICS 0;

ALTER TABLE mod_planificacion.dat_controldemandafecha
  ALTER COLUMN preciocontratacion SET STATISTICS 0;

ALTER TABLE mod_planificacion.dat_controldemandafecha
  ALTER COLUMN precioejecucion SET STATISTICS 0;

COMMENT ON COLUMN mod_planificacion.dat_controldemandafecha.idcontroldemanda
IS 'Registra el identificador del control de la demanda.';

COMMENT ON COLUMN mod_planificacion.dat_controldemandafecha.cantidadcontratada
IS 'Regitra la cantidad de la demanda del indicador contratada.';

COMMENT ON COLUMN mod_planificacion.dat_controldemandafecha.preciocontratacion
IS 'Registra el precio al que se contrata el producto.';

COMMENT ON COLUMN mod_planificacion.dat_controldemandafecha.cantidadejecutada
IS 'Registra la cantidad ejecutada del producto.';

COMMENT ON COLUMN mod_planificacion.dat_controldemandafecha.precioejecucion
IS 'Registra el precio al que se ejecuta el producto.';

COMMENT ON COLUMN mod_planificacion.dat_controldemandafecha.iddatosnomenclador
IS 'Mes en que se registra la información.';

COMMENT ON COLUMN mod_planificacion.dat_controldemandafecha.idaprobacionejecucion
IS 'Aprobación de las contrataciones y ejecuciones.';

CREATE UNIQUE INDEX ak_controldemandafecha_idcontroldemanda_iddatosnomenclador ON mod_planificacion.dat_controldemandafecha
  USING btree (idcontroldemanda, iddatosnomenclador);  