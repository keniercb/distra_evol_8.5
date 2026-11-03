-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_disponible0ptccq (
  iddisponible NUMERIC(19,0),
  idsituacionlaboralp NUMERIC(19,0),
  idmotivodisponibilidad NUMERIC(19,0),
  fdeclaracion DATE,
  fnotificacion DATE,
  idprocesodisponibilidad NUMERIC(19,0),
  fhasta DATE
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_disponible0ptccq (iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta)
SELECT iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta FROM mod_fuerzatrabajo.dat_disponible;

-- Drop the source table

DROP TABLE mod_fuerzatrabajo.dat_disponible cascade;

-- Create the destination table

CREATE TABLE mod_fuerzatrabajo.dat_disponible (
  iddisponible NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_disponible_seq'::regclass) NOT NULL,
  idsituacionlaboralp NUMERIC(19,0) NOT NULL,
  idmotivodisponibilidad NUMERIC(19,0),
  fdeclaracion DATE DEFAULT now() NOT NULL,
  fnotificacion DATE,
  idprocesodisponibilidad NUMERIC(19,0),
  fhasta DATE,
  CONSTRAINT pk_iddisponible PRIMARY KEY(iddisponible),
  CONSTRAINT fk_motivodisponibilidad_disponible_idmotivodisponibilidad FOREIGN KEY (idmotivodisponibilidad)
    REFERENCES mod_fuerzatrabajo.nom_motivodisponibilidad(idmotivodisponibilidad)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_situacionlaboral_disponible_idsituacionlaboralp FOREIGN KEY (idsituacionlaboralp)
    REFERENCES mod_persona.dat_situacionlaboral(idsituacionlaboralp)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.dat_disponible
IS 'Almacena los trabajadores que han sido declarados disponibles.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.iddisponible
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.idsituacionlaboralp
IS 'Identificador de la situación laboral del trabajador que fue declarado disponible.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.idmotivodisponibilidad
IS 'Identificador del motivo por el cual el trabajador fue declarado disponible.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fdeclaracion
IS 'Fecha en que el trabajador es declarado disponible.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fnotificacion
IS 'Fecha en la que se notifica al trabajador que se encuentra disponible.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.idprocesodisponibilidad
IS 'Identificador del proceso de disponibilidad';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fhasta
IS 'Fecha en que termina la disponibilidad.';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_fuerzatrabajo.dat_disponible (iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta)
SELECT iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta FROM dat_disponible0ptccq;

-- Create indices, triggers and rules

CREATE INDEX fki_motivodisponibilidad_disponible_idmotivodisponibilidad ON mod_fuerzatrabajo.dat_disponible
  USING btree (idmotivodisponibilidad);

CREATE INDEX fki_situacionlaboral_disponible_idsituacionlaboralp ON mod_fuerzatrabajo.dat_disponible
  USING btree (idsituacionlaboralp);

-- Restore table's permissions

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  OWNER TO zeolides;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_fuerzatrabajo.dat_disponible TO zeolides;


-- Drop the temporary table

DROP TABLE dat_disponible0ptccq cascade;

-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_interrupto0vvuda (
  idinterrupto NUMERIC(19,0),
  idsituacionlaboralp NUMERIC(19,0),
  idinterrupcion NUMERIC(19,0),
  fdesde DATE,
  fhasta DATE,
  reubicado NUMERIC(1,0),
  horas NUMERIC(4,0)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_interrupto0vvuda (idinterrupto, idsituacionlaboralp, idinterrupcion, fdesde, fhasta, reubicado, horas)
SELECT idinterrupto, idsituacionlaboralp, idinterrupcion, fdesde, fhasta, reubicado, horas FROM mod_fuerzatrabajo.dat_interrupto;

-- Drop the source table

DROP TABLE mod_fuerzatrabajo.dat_interrupto cascade;

-- Create the destination table

CREATE TABLE mod_fuerzatrabajo.dat_interrupto (
  idinterrupto NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_interrupto_seq'::regclass) NOT NULL,
  idsituacionlaboralp NUMERIC(19,0) NOT NULL,
  idinterrupcion NUMERIC(19,0),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  reubicado NUMERIC(1,0) DEFAULT 3 NOT NULL,
  horas NUMERIC(4,0),
  CONSTRAINT pk_idinterrupto PRIMARY KEY(idinterrupto),
  CONSTRAINT fk_interrupcion_interrupto_idinterrupcion FOREIGN KEY (idinterrupcion)
    REFERENCES mod_fuerzatrabajo.dat_interrupcion(idinterrupcion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_situacionlaboral_interrupto_idsituacionlaboralp FOREIGN KEY (idsituacionlaboralp)
    REFERENCES mod_persona.dat_situacionlaboral(idsituacionlaboralp)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.dat_interrupto
IS 'Almacena los trabajadores que han sido victima de cualquier evento que paralice el proceso productivo o de servicio.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.idinterrupto
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.idsituacionlaboralp
IS 'Identificador de la situación laboral del trabajador que fue declarado interrupto.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.idinterrupcion
IS 'Identificador de la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.fdesde
IS 'Fecha de inicio de la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.fhasta
IS 'Fecha en que finaliza la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.reubicado
IS 'Determina si el trabajador fue reubicado en labores para el restablecimiento del proceso de producción o de servicio.
1-Reubicado en labores de restablecimiento
2-Reubicado en otro cargo
3-Sin reubicar';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.horas
IS 'Determina la cantidad de horas que dura la interrupción.';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_fuerzatrabajo.dat_interrupto (idinterrupto, idsituacionlaboralp, idinterrupcion, fdesde, fhasta, reubicado, horas)
SELECT idinterrupto, idsituacionlaboralp, idinterrupcion, fdesde, fhasta, reubicado, horas FROM dat_interrupto0vvuda;

-- Create indices, triggers and rules

CREATE INDEX fki_motivointerrupcion_interrupto_idmotivointerrupcion ON mod_fuerzatrabajo.dat_interrupto
  USING btree (idinterrupcion);

CREATE INDEX fki_situacionlaboral_interrupto_idsituacionlaboralp ON mod_fuerzatrabajo.dat_interrupto
  USING btree (idsituacionlaboralp);

-- Restore table's permissions

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  OWNER TO zeolides;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_fuerzatrabajo.dat_interrupto TO zeolides;

-- Drop the temporary table

DROP TABLE dat_interrupto0vvuda cascade;

SELECT mod_persona.f_reiniciarsecuencias('mod_fuerzatrabajo');