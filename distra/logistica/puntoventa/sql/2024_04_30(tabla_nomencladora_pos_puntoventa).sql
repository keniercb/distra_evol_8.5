CREATE SEQUENCE mod_logpuntoventa.sec_nompos_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

ALTER TABLE mod_logpuntoventa.sec_nompos_seq
  OWNER TO zeolides;


CREATE TABLE mod_logpuntoventa.nom_pos(
  idpos NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_nompos_seq'::regclass) NOT NULL,
  codigo VARCHAR(12),
  denominacion VARCHAR(255),
  fechainicio DATE,
  fechafin DATE,
  estado NUMERIC(1,0) DEFAULT 1,
  idabo VARCHAR(12),
  chapilla VARCHAR(12),
  idtipocaja NUMERIC(19,0),
  CONSTRAINT pk_pos PRIMARY KEY(idpos),
  CONSTRAINT nom_pos_fk FOREIGN KEY (idtipocaja)
    REFERENCES mod_logpuntoventa.nom_tipocaja(idtipocaja)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_logpuntoventa.nom_pos
IS 'Tabla nomencladora que almacena los pos';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.idpos
IS 'Identificador único para los pos';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.codigo
IS 'Código para los pos';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.denominacion
IS 'Demominación de los pos';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.fechainicio
IS 'Fecha inicio para las cajas';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.fechafin
IS 'Fecha fin de las cajas';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.estado
IS '0 inactivo, 1 activo';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.idabo
IS 'Identificador del código de idabo';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.chapilla
IS 'Identificador de la chapilla del pos';

COMMENT ON COLUMN mod_logpuntoventa.nom_pos.idtipocaja
IS 'Identificador de la caja registradora del pos';

CREATE TRIGGER tg_adicionar_violacion
  AFTER INSERT OR UPDATE OR DELETE 
  ON mod_logpuntoventa.nom_pos
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_seguridad.ft_insertar_violacion();

CREATE TRIGGER tg_eliminar_pid
  AFTER INSERT OR UPDATE OR DELETE 
  ON mod_logpuntoventa.nom_pos
  
FOR EACH STATEMENT 
  EXECUTE PROCEDURE mod_seguridad.ft_eliminar_pid();

ALTER TABLE mod_logpuntoventa.nom_pos
  OWNER TO zeolides;
  
  
  
CREATE SEQUENCE mod_logpuntoventa.sec_datposentidad_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;


ALTER TABLE mod_logpuntoventa.sec_datposentidad_seq
  OWNER TO zeolides;
  
  
CREATE TABLE mod_logpuntoventa.dat_posentidad (
  idposentidad NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datposentidad_seq'::regclass) NOT NULL,
  idpos NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT pk_posentidad PRIMARY KEY(idposentidad),
  CONSTRAINT fk_filaestruc_datposentidad FOREIGN KEY (idestructuracomun)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    DEFERRABLE
    INITIALLY IMMEDIATE,
  CONSTRAINT fk_idpos_datposentidad FOREIGN KEY (idpos)
    REFERENCES mod_logpuntoventa.nom_pos(idpos)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_logpuntoventa.dat_posentidad
IS 'Tabla utilizada para almacenar la relación de los pos por entidad';

COMMENT ON COLUMN mod_logpuntoventa.dat_posentidad.idposentidad
IS 'Identificador único para los pos o entidades';

COMMENT ON COLUMN mod_logpuntoventa.dat_posentidad.idpos
IS 'Identificador para los pos';

COMMENT ON COLUMN mod_logpuntoventa.dat_posentidad.idestructuracomun
IS 'Identificador para las entidades';

CREATE TRIGGER tg_adicionar_violacion
  AFTER INSERT OR UPDATE OR DELETE 
  ON mod_logpuntoventa.dat_posentidad
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_seguridad.ft_insertar_violacion();

CREATE TRIGGER tg_eliminar_pid
  AFTER INSERT OR UPDATE OR DELETE 
  ON mod_logpuntoventa.dat_posentidad
  
FOR EACH STATEMENT 
  EXECUTE PROCEDURE mod_seguridad.ft_eliminar_pid();

ALTER TABLE mod_logpuntoventa.dat_posentidad
  OWNER TO zeolides;