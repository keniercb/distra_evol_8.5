ALTER TABLE mod_logpuntoventa.dat_naturalezaventa
  DROP CONSTRAINT dat_naturalezaventa_pkey RESTRICT;
  
/*ALTER TABLE mod_logpuntoventa.dat_naturalezaventa
  ADD CONSTRAINT dat_naturalezaventa_idx 
    UNIQUE (idnaturaleza, idpadre) NOT DEFERRABLE;
*/
	
ALTER TABLE mod_logpuntoventa.dat_naturalezaventa
  ADD COLUMN idnaturalezaventa NUMERIC(19,0);

COMMENT ON COLUMN mod_logpuntoventa.dat_naturalezaventa.idnaturalezaventa
IS 'Identificador de la tabla';
	
CREATE SEQUENCE mod_logpuntoventa.sec_datnaturalezaventa_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_datnaturalezaventa_seq RESTART WITH 1000000000;

ALTER TABLE mod_logpuntoventa.dat_naturalezaventa
  ALTER COLUMN idnaturalezaventa SET DEFAULT nextval('mod_logpuntoventa.sec_datnaturalezaventa_seq'::regclass);
  
---- poner script para reordenar las columnas -------


-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_naturalezaventa0gyqdd (
  idnaturaleza NUMERIC(19,0),
  idtiempogarantia NUMERIC(19,0),
  limitecantidad NUMERIC(19,0),
  idtiempolimite NUMERIC(19,0),
  idpadre NUMERIC(19,0),
  idnaturalezaventa NUMERIC(19,0)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_naturalezaventa0gyqdd (idnaturaleza, idtiempogarantia, limitecantidad, idtiempolimite, idpadre, idnaturalezaventa)
SELECT idnaturaleza, idtiempogarantia, limitecantidad, idtiempolimite, idpadre, idnaturalezaventa FROM mod_logpuntoventa.dat_naturalezaventa;

-- Drop the source table

DROP TABLE mod_logpuntoventa.dat_naturalezaventa;

-- Create the destination table

CREATE TABLE mod_logpuntoventa.dat_naturalezaventa (
  idnaturalezaventa NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datnaturalezaventa_seq'::regclass),
  idnaturaleza NUMERIC(19,0) NOT NULL,
  idtiempogarantia NUMERIC(19,0),
  limitecantidad NUMERIC(19,0),
  idtiempolimite NUMERIC(19,0),
  idpadre NUMERIC(19,0),
  --CONSTRAINT dat_naturalezaventa_idx UNIQUE(idnaturaleza, idpadre),
  CONSTRAINT dat_naturalezaventa_pkey PRIMARY KEY(idnaturalezaventa),
  CONSTRAINT dat_naturalezaventa_fk FOREIGN KEY (idtiempogarantia)
    REFERENCES mod_logpuntoventa.nom_tiempo(idtiempo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_naturalezaventa_fk1 FOREIGN KEY (idtiempolimite)
    REFERENCES mod_logpuntoventa.nom_tiempo(idtiempo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_naturalezaventa_fk2 FOREIGN KEY (idnaturaleza)
    REFERENCES mod_datosmaestros.nom_naturaleza(idnaturaleza)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_naturalezaventa_fk3 FOREIGN KEY (idpadre)
    REFERENCES mod_logpuntoventa.dat_naturalezaagrupacion(idnaturalezaagrupacion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logpuntoventa.dat_naturalezaventa.idnaturalezaventa
IS 'Identificador de la tabla';

COMMENT ON COLUMN mod_logpuntoventa.dat_naturalezaventa.idnaturaleza
IS 'Identificador de la naturaleza viene del nomenclador';

COMMENT ON COLUMN mod_logpuntoventa.dat_naturalezaventa.idtiempogarantia
IS 'Identificador del tiempo de garantia';

COMMENT ON COLUMN mod_logpuntoventa.dat_naturalezaventa.limitecantidad
IS 'Limite de cantidad permitida que puede comprar un usuario en un tiempo determinado';

COMMENT ON COLUMN mod_logpuntoventa.dat_naturalezaventa.idtiempolimite
IS 'Identificador del tiempo limite de cantidad';

COMMENT ON COLUMN mod_logpuntoventa.dat_naturalezaventa.idpadre
IS 'Id de la agrupacion a la que pertenece';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_logpuntoventa.dat_naturalezaventa (idnaturaleza, idtiempogarantia, limitecantidad, idtiempolimite, idpadre)
SELECT idnaturaleza, idtiempogarantia, limitecantidad, idtiempolimite, idpadre FROM dat_naturalezaventa0gyqdd;

-- Restore table's permissions

ALTER TABLE mod_logpuntoventa.dat_naturalezaventa
  OWNER TO zeolides;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_logpuntoventa.dat_naturalezaventa TO zeolides;
-----------------------------------------  
  
ALTER TABLE mod_logpuntoventa.dat_naturalezaventa
  ALTER COLUMN idnaturalezaventa SET NOT NULL;

ALTER TABLE mod_logpuntoventa.dat_naturalezaventa
  ADD PRIMARY KEY (idnaturalezaventa);
  
GRANT SELECT, UPDATE, USAGE
  ON mod_logpuntoventa.sec_datnaturalezaventa_seq TO zeolides;