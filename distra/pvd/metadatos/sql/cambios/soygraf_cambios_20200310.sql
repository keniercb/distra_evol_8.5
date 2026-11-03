CREATE SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargofacultado".';

ALTER TABLE mod_estructuracomp.dat_cargo
  DROP CONSTRAINT dat_cargo_fk2 RESTRICT;

CREATE TABLE mod_estructuracomp.nom_cargofacultado (
  idcargofacultado NUMERIC(19,0) DEFAULT nextval('mod_estructuracomp.sec_cargofacultado_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  abreviatura VARCHAR(60),
  actual NUMERIC(1,0),
  visible NUMERIC(1,0),
  fechainicio DATE DEFAULT 'now'::text::date,
  fechafin DATE,
  CONSTRAINT pk_cargofacultado PRIMARY KEY(idcargofacultado)
) 
WITH (oids = false);

INSERT INTO mod_estructuracomp.nom_cargofacultado(idcargofacultado, denominacion, abreviatura, actual, visible, fechainicio)
    VALUES (0, 'Ninguno', 'N', 1, 1, '2019-02-11');

COMMENT ON CONSTRAINT pk_cargofacultado ON mod_estructuracomp.nom_cargofacultado
IS 'Identificador único para cada tupla de la tabla nom_cargofacultado.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN idicono NUMERIC(100,0) DEFAULT 0;

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.idicono
IS 'Identificador de la tabla nom_icono';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN correo VARCHAR(50);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.correo
IS 'Dirección de correo.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN objetosocial VARCHAR(255);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.objetosocial
IS 'Objeto social.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN fax VARCHAR(100);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.fax
IS 'Fax.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN iddpt NUMERIC(19,0);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.iddpt
IS 'Identificador de instrucción política territorial.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN telefono VARCHAR(100);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.telefono
IS 'Número de teléfono.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN funcioneslegales VARCHAR(255);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.funcioneslegales
IS 'Funciones legales.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN direccion VARCHAR(500);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.direccion
IS 'Dirección.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN codigonit VARCHAR(255);

ALTER TABLE mod_estructuracomp.dat_estructura
  ADD COLUMN codigonit VARCHAR(255);

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT dat_cargo_fk2 FOREIGN KEY (idfacultado)
    REFERENCES mod_estructuracomp.nom_cargofacultado(idcargofacultado)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

