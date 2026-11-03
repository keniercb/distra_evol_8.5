CREATE SEQUENCE mod_logtaller.sec_nomcuadreproceso_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1 OWNED BY NONE;

ALTER SEQUENCE mod_logtaller.sec_nomcuadreproceso_seq RESTART WITH 1000000002;



CREATE SEQUENCE mod_logtaller.sec_datcuadreprocesoentidad_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1 OWNED BY NONE;

ALTER SEQUENCE mod_logtaller.sec_datcuadreprocesoentidad_seq RESTART WITH 1000000002;






CREATE TABLE mod_logtaller.nom_cuadreproceso (
  idcuadreproceso NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_nomcuadreproceso_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255),
  estado NUMERIC(1,0),
  fechainicio DATE,
  fechafin DATE,
  idcuenta NUMERIC(19,0),
  cuenta VARCHAR(255),
  CONSTRAINT nom_cuadreproceso_idcuadreproceso PRIMARY KEY(idcuadreproceso)
) 
WITH (oids = false);

COMMENT ON TABLE mod_logtaller.nom_cuadreproceso
IS 'Nomenclador de los cuadres de procesos';

COMMENT ON COLUMN mod_logtaller.nom_cuadreproceso.idcuadreproceso
IS 'Identificador de la tabla';

COMMENT ON COLUMN mod_logtaller.nom_cuadreproceso.denominacion
IS 'Denominacion del cuadre de proceso';

COMMENT ON COLUMN mod_logtaller.nom_cuadreproceso.estado
IS '1 Activo, 0 No activo';

COMMENT ON COLUMN mod_logtaller.nom_cuadreproceso.fechainicio
IS 'Fecha de inicio';

COMMENT ON COLUMN mod_logtaller.nom_cuadreproceso.fechafin
IS 'Fecha de fin';

COMMENT ON COLUMN mod_logtaller.nom_cuadreproceso.idcuenta
IS 'Identificador de la cuenta contable';

COMMENT ON COLUMN mod_logtaller.nom_cuadreproceso.cuenta
IS 'Denominacion de la cuenta contable';

ALTER TABLE mod_logtaller.nom_cuadreproceso
  OWNER TO zeolides;






CREATE TABLE mod_logtaller.dat_cuadreprocesoentidad (
  idcuadreprocesoentidad NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_datcuadreprocesoentidad_seq'::regclass) NOT NULL,
  idcuadreproceso NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT dat_cuadreprocesoentidad_idcuadreprocesoentidad PRIMARY KEY(idcuadreprocesoentidad),
  CONSTRAINT fk_cuadreprocesoentidad_cuadreproceso FOREIGN KEY (idcuadreproceso)
    REFERENCES mod_logtaller.nom_cuadreproceso(idcuadreproceso)
    MATCH FULL
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_cuadreprocesoentidad_filaestruc FOREIGN KEY (idestructuracomun)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    MATCH FULL
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_logtaller.dat_cuadreprocesoentidad
IS 'Relaciona los cuadres de procesos con la entidad';

COMMENT ON COLUMN mod_logtaller.dat_cuadreprocesoentidad.idcuadreprocesoentidad
IS 'Identificador de la tabla';

COMMENT ON COLUMN mod_logtaller.dat_cuadreprocesoentidad.idcuadreproceso
IS 'Llave foranea de nom_cuadreproceso';

COMMENT ON COLUMN mod_logtaller.dat_cuadreprocesoentidad.idestructuracomun
IS 'Identificador de la entidades.';