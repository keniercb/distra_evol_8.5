COMMENT ON COLUMN mod_fuerzatrabajo.conf_nromn.anno
IS 'Año en que se generó el número del movimiento de nómina.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fdeclaracion
IS 'Fecha en que el trabajador es declarado disponible.';

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  ALTER COLUMN fdeclaracion SET DEFAULT now();

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  ALTER COLUMN fdeclaracion SET NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.idinterrupcion
IS 'Identificador de la interrupción.';

-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_disponible0legof (
  iddisponible NUMERIC(19,0),
  idsituacionlaboralp NUMERIC(19,0),
  idmotivodisponibilidad NUMERIC(19,0),
  fdeclaracion DATE,
  fnotificacion DATE,
  idprocesodisponibilidad NUMERIC(19,0),
  fhasta DATE
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_disponible0legof (iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta)
SELECT iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta FROM mod_fuerzatrabajo.dat_disponible;

-- Drop the source table

DROP TABLE mod_fuerzatrabajo.dat_disponible CASCADE;

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
SELECT iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta FROM dat_disponible0legof;

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

DROP TABLE dat_disponible0legof CASCADE;

