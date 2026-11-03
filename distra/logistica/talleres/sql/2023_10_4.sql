CREATE SEQUENCE mod_logtaller.sec_nomubicaciontall_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1 OWNED BY NONE;

ALTER SEQUENCE mod_logtaller.sec_nomubicaciontall_seq RESTART WITH 1000000005;


CREATE SEQUENCE mod_logtaller.sec_datubicaciontallorden_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1 OWNED BY NONE;

ALTER SEQUENCE mod_logtaller.sec_datubicaciontallorden_seq RESTART WITH 1000762498;

CREATE SEQUENCE mod_logtaller.sec_datubicaciontallentidad_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1 OWNED BY NONE;

ALTER SEQUENCE mod_logtaller.sec_datubicaciontallentidad_seq RESTART WITH 1000000033;


CREATE TABLE mod_logtaller.nom_ubicaciontall (
  idubicaciontall NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_nomubicaciontall_seq'::regclass) NOT NULL,
  fechainicio DATE,
  fechafin DATE,
  denominacion VARCHAR(255),
  estado NUMERIC(1,0) DEFAULT 1 NOT NULL,
  inicial NUMERIC(1,0) DEFAULT 2,
  final NUMERIC(1,0) DEFAULT 2,
  CONSTRAINT ak_denominacion UNIQUE(denominacion),
  CONSTRAINT nom_ubicaciontall_pkey PRIMARY KEY(idubicaciontall)
) 
WITH (oids = false);

COMMENT ON CONSTRAINT ak_denominacion ON mod_logtaller.nom_ubicaciontall
IS 'Restricción sobre la columna denominación para que no se repitan los nombres de las ubicaciones.';

ALTER TABLE mod_logtaller.nom_ubicaciontall
  OWNER TO zeolides;

CREATE TABLE mod_logtaller.dat_ubicaciontallentidad (
  idubicaciontallentidad NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_datubicaciontallentidad_seq'::regclass) NOT NULL,
  idubicaciontall NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT dat_ubicaciontallentidad_pkey PRIMARY KEY(idubicaciontallentidad)
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_ubicaciontallentidad
  OWNER TO zeolides;

CREATE TABLE mod_logtaller.dat_ubicaciontallorden (
  idubicaciontallorden NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_datubicaciontallorden_seq'::regclass) NOT NULL,
  idubicaciontall NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  idordentrabajo NUMERIC(19,0),
  fechainicio DATE,
  fechafin DATE,
  estadia NUMERIC(19,0),
  eliminable NUMERIC(1,0) DEFAULT 1,
  CONSTRAINT dat_ubicaciontall_pkey PRIMARY KEY(idubicaciontallorden),
  CONSTRAINT fk_estructuracomun_ubicaciontall FOREIGN KEY (idestructuracomun)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_numubicaciontall_ubicaciontall FOREIGN KEY (idubicaciontall)
    REFERENCES mod_logtaller.nom_ubicaciontall(idubicaciontall)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_ordentrabajo_ubicaciontall FOREIGN KEY (idordentrabajo)
    REFERENCES mod_logtaller.dat_ordentrabajo(idordentrabajo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_ubicaciontallorden
  OWNER TO zeolides;
