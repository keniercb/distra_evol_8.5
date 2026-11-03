CREATE SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_modalidadempleo.';

ALTER TABLE mod_fuerzatrabajo.conf_nromn
  ADD COLUMN anno NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.conf_nromn.anno
IS 'Año en que se generó el número del movimiento de nómina.';

CREATE TABLE mod_fuerzatrabajo.nom_modalidadempleo (
  idmodalidadempleo NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_modalidadempleo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_modalidadempleo PRIMARY KEY(idmodalidadempleo)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.nom_modalidadempleo
IS 'Almacena los programas laborales.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.idmodalidadempleo
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.denominacion
IS 'Denominación de la modalidad de empleo.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.descripcion
IS 'Descripción de la modalidad de empleo.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_modalidadempleo.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

ALTER TABLE mod_fuerzatrabajo.nom_motivobaja
  ADD COLUMN fluctuacion NUMERIC(19,0) DEFAULT 2;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.fluctuacion
IS 'Determina si la causa de la baja influye o no en la fluctuación laboral.
1-si
0-no';

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  ADD COLUMN motivo VARCHAR(255);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.motivo
IS 'Motivo por el cual causa baja de la reserva.';

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  ADD COLUMN cargoprom VARCHAR(255);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.cargoprom
IS 'Cargo para el cual fue promovido.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fdeclaracion
IS 'Fecha en que el trabajador es declarado disponible.';

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  ALTER COLUMN fdeclaracion SET DEFAULT now();

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  ALTER COLUMN fdeclaracion SET NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.idinterrupcion
IS 'Identificador de la interrupción.';

ALTER TABLE mod_fuerzatrabajo.nom_motivobaja
  DROP COLUMN bandera;



-----------------------------------------------------
ALTER TABLE mod_persona.dat_situacionlaboral
    ADD COLUMN nromn numeric(19,0);

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.nromn
    IS 'Número que se genera en el movimiento de nómina.';

ALTER TABLE mod_persona.dat_situacionlaboral
    ADD COLUMN idmodalidadempleo numeric(19,0);

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idmodalidadempleo
    IS 'Identificador de la modalidad de empleo.';

ALTER TABLE mod_persona.dat_situacionlaboral
    ADD CONSTRAINT fk_modalidadempleo_sitlaboral_idmodalidadempleo FOREIGN KEY (idmodalidadempleo)
    REFERENCES mod_fuerzatrabajo.nom_modalidadempleo (idmodalidadempleo) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;