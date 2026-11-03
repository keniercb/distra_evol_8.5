CREATE SEQUENCE mod_logproduccion.sec_conf_actividadcentrocosto_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 9999999999 START 1000000000
  CACHE 1;

CREATE TABLE mod_logproduccion.conf_actividadcentrocosto (
  idactcentrocosto NUMERIC(19,0) DEFAULT nextval('mod_logproduccion.sec_conf_actividadcentrocosto_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0),
  idcartatecindustrial NUMERIC(19,0),
  idcentrogrupo NUMERIC(19,0),
  idalmacen NUMERIC(19,0),
  idcartatecindustrialactividad NUMERIC(19,0),
  CONSTRAINT conf_actividadcentrocosto_pkey PRIMARY KEY(idactcentrocosto),
  CONSTRAINT conf_actividadcentrocosto_fk FOREIGN KEY (identidad)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT conf_actividadcentrocosto_fk1 FOREIGN KEY (idalmacen)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logproduccion.conf_actividadcentrocosto.identidad
IS 'Identificador de la entidad';

COMMENT ON COLUMN mod_logproduccion.conf_actividadcentrocosto.idcartatecindustrial
IS 'Identificador de la carta tecnológica';

COMMENT ON COLUMN mod_logproduccion.conf_actividadcentrocosto.idcentrogrupo
IS 'Identificador del centro de costo';

COMMENT ON COLUMN mod_logproduccion.conf_actividadcentrocosto.idalmacen
IS 'Identificador del area';

COMMENT ON COLUMN mod_logproduccion.conf_actividadcentrocosto.idcartatecindustrialactividad
IS 'Identificador de las actividades de la carta tecnológica';

ALTER TABLE mod_logproduccion.conf_actividadcentrocosto
  OWNER TO zeolides;