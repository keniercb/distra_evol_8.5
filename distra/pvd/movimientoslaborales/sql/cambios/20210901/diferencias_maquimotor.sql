CREATE SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 8
  CACHE 1;
ALTER SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq RESTART WITH 9;
COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_modalidadempleo.';

DROP TRIGGER t_insertar_procedenciasocial ON mod_fuerzatrabajo.nom_procedenciasocial;

ALTER TABLE mod_fuerzatrabajo.nom_periodo
  DROP CONSTRAINT fk_tipoperiodo_periodo_idtipoperiodo RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  DROP CONSTRAINT fk_persona_reserva_idpersona RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  DROP CONSTRAINT fk_clasificacion_reserva_idclasificacion RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_procesodisponibilidad
  DROP CONSTRAINT fk_via_procesodisponibilidad_idvia RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  DROP CONSTRAINT fk_periodo_pedidocomposicion_idperiodo RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  DROP CONSTRAINT fk_pedido_pedidocomposicion_idpedido RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_pedido
  DROP CONSTRAINT fk_tipoperiodo_pedido_idtipoperiodo RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  DROP CONSTRAINT fk_situacionlaboral_interrupto_idsituacionlaboralp RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  DROP CONSTRAINT fk_interrupcion_interrupto_idinterrupcion RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_interrupcion
  DROP CONSTRAINT fk_motivointerrupcion_interrupcion_idmotivointerrupcion RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  DROP CONSTRAINT fk_situacionlaboral_disponible_idsituacionlaboralp RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  DROP CONSTRAINT fk_motivodisponibilidad_disponible_idmotivodisponibilidad RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_plantillatipocontrato
  DROP CONSTRAINT fk_tipocontrato_plantillatipocontrato_idtipocontrato RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_plantillatipocontrato
  DROP CONSTRAINT fk_plantilladoc_plantillatipocontrato_idplantilla RESTRICT;

ALTER TABLE mod_fuerzatrabajo.conf_conceptosalarialnomina
  DROP CONSTRAINT pk_idconceptosalarialnomina RESTRICT;

ALTER TABLE mod_fuerzatrabajo.conf_nromn
  ADD COLUMN anno NUMERIC(19,0) NOT NULL;
COMMENT ON COLUMN mod_fuerzatrabajo.conf_nromn.anno
IS 'Año en que se generó el número del movimiento de nómina.';

COMMENT ON TABLE mod_fuerzatrabajo.conf_niveles
IS 'Almacela la configuracion de los niveles educacionales de la persona que satisfacen cada nivel de preparacion del cargo.';
COMMENT ON COLUMN mod_fuerzatrabajo.conf_niveles.idconfnivel
IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_fuerzatrabajo.conf_niveles.idpreparacion
IS 'Identificador del nivel de preparacion del cargo.';
COMMENT ON COLUMN mod_fuerzatrabajo.conf_niveles.idniveleducacional
IS 'Identificador del nivel educacional de la persona.';

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

CREATE TABLE mod_fuerzatrabajo.dat_movnomina (
  idmovnomina NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_movimientonomina_seq'::regclass) NOT NULL,
  idsituacionlaboralactual NUMERIC(19,0) NOT NULL,
  contenido JSON,
  CONSTRAINT pk_idmovnomina PRIMARY KEY(idmovnomina)
) 
WITH (oids = false);
COMMENT ON TABLE mod_fuerzatrabajo.dat_movnomina
IS 'Almacena la información de los movimientos de nómina que se generen por baja y por movimiento o cambio de contrato.';
COMMENT ON COLUMN mod_fuerzatrabajo.dat_movnomina.idmovnomina
IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_fuerzatrabajo.dat_movnomina.idsituacionlaboralactual
IS 'Determina el identificador de la situación laboral que la persona ocupa antes de hacer efectivo el movimiento.';
COMMENT ON COLUMN mod_fuerzatrabajo.dat_movnomina.contenido
IS 'Determina el contenido con que se generó el reporte Movimiento de nómina por primera vez al relizarse dicha acción(baja o movimiento), con el objetivo de mostrar la misma  información cada vez que se vuelva a generar por ejemplo los elementos salariales del cargo que en el momento de la baja pudieron tener un valor y hoy otro.';

DROP TABLE mod_fuerzatrabajo.dat_pedidocomposicion;

DROP TABLE mod_fuerzatrabajo.dat_interrupto;

DROP TABLE mod_fuerzatrabajo.dat_procesodisponibilidad;

DROP TABLE mod_fuerzatrabajo.nom_periodo;

DROP TABLE mod_fuerzatrabajo.dat_pedido;

DROP TABLE mod_fuerzatrabajo.dat_interrupcion;

DROP TABLE mod_fuerzatrabajo.dat_disponible;

DROP TABLE mod_fuerzatrabajo.dat_reserva;

DROP TABLE mod_fuerzatrabajo.nom_via;

DROP TABLE mod_fuerzatrabajo.nom_tipoperiodo;

DROP TABLE mod_fuerzatrabajo.nom_motivointerrupcion;

DROP TABLE mod_fuerzatrabajo.nom_motivodisponibilidad;

DROP TABLE mod_fuerzatrabajo.dat_imputable;

DROP TABLE mod_fuerzatrabajo.nom_clasificacion;

DROP TABLE mod_fuerzatrabajo.dat_movimientonomina;

ALTER TABLE mod_fuerzatrabajo.nom_motivobaja
  DROP COLUMN bandera;

DROP TABLE mod_fuerzatrabajo.conf_docidentidadmn;

ALTER TABLE mod_fuerzatrabajo.conf_conceptosalarialnomina
  ADD CONSTRAINT pk_idconceptosalarialnomina 
    PRIMARY KEY (idconceptosalarialnomina) NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_plantillatipocontrato
  ADD CONSTRAINT fk_tipocontrato_plantillatipocontrato_idtipocontrato FOREIGN KEY (idtipocontrato)
    REFERENCES mod_fuerzatrabajo.nom_tipocontrato(idtipocontrato)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_plantillatipocontrato
  ADD CONSTRAINT fk_plantilladoc_plantillatipocontrato_idplantilla FOREIGN KEY (idplantilla)
    REFERENCES mod_rrhhmaestro.dat_plantilladoc(idplantilladoc)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_clasificacion_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_disponible_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_imputable_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_interrupcion_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_interrupto_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_motivodisponibilidad_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_motivointerrupcion_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_pedido_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_pedidocomposicion_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_periodo_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_reserva_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_tipoperiodo_seq;

DROP SEQUENCE IF EXISTS mod_fuerzatrabajo.sec_via_seq;

CREATE TRIGGER t_insertar_procedenciasocial
  BEFORE INSERT 
  ON mod_fuerzatrabajo.nom_procedenciasocial
FOR EACH ROW 
  EXECUTE PROCEDURE public.ft_procedenciasocial_insertar();

ALTER TABLE mod_persona.dat_situacionlaboral
    ADD COLUMN idmodalidadempleo numeric(19,0);
COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idmodalidadempleo
    IS 'Identificador de la modalidad de empleo.';