CREATE SEQUENCE mod_fuerzatrabajo.sec_clasificacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 4
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_clasificacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_clasificacion".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_confmotivosbaja_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_confmotivosbaja_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_motivosbaja".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_confniveles_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_confniveles_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_niveles".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_imputable_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 2
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_imputable_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_imputable".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_interrupcion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 20
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_interrupcion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_interrupcion".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_motivobaja_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 22
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_motivobaja_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivobaja".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_movimientonomina_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_movimientonomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_movimientonomina".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_procedenciasocial_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999 START 4
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_procedenciasocial_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_procedenciasocial".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_procesodisponibilidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

CREATE SEQUENCE mod_fuerzatrabajo.sec_programalaboral_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 5
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_programalaboral_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_programalaboral.';

CREATE SEQUENCE mod_fuerzatrabajo.sec_suplemento_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_suplemento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_suplemento".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_via_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_via_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_viaaprobacion".';

ALTER TABLE mod_fuerzatrabajo.dat_plantillatipocontrato
  DROP CONSTRAINT fk_tipocontrato_plantillatipocontrato_idtipocontrato RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_plantillatipocontrato
  DROP CONSTRAINT fk_plantilladoc_plantillatipocontrato_idplantilla RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  DROP CONSTRAINT fk_pedido_pedidocomposicion_idpedido RESTRICT;

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  DROP CONSTRAINT fk_motivointerrupcion_interrupto_idmotivointerrupcion RESTRICT;

DROP INDEX mod_fuerzatrabajo.fki_motivointerrupcion_interrupto_idmotivointerrupcion;

ALTER TABLE mod_fuerzatrabajo.conf_conceptosalarialnomina
  DROP CONSTRAINT pk_idconceptosalarialnomina RESTRICT;

COMMENT ON SCHEMA mod_fuerzatrabajo
IS 'Agrupa los datos del componente fuerza de trabajo. Versión 1. (RRHH)
1- Gestión de la demanda de la fuerza laboral.
2- Gestión de los movimiento laborales en la(s) entidad(es).';

CREATE OR REPLACE FUNCTION mod_fuerzatrabajo.ft_modicarpedido (
)
RETURNS trigger AS
$body$
DECLARE
BEGIN
	NEW.modificado := 1;
    RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_fuerzatrabajo.ft_motivobaja_insertar (
)
RETURNS trigger AS
$body$
BEGIN
    SET search_path = mod_fuerzatrabajo;
    IF  (NEW.idpadre is null)THEN
    	 NEW.idpadre:= NEW.idmotivobaja;
    END IF;    
RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 10;

COMMENT ON FUNCTION mod_fuerzatrabajo.ft_motivobaja_insertar()
IS 'Actualiza la columna "idpadre" de la tabla (nom_motivobaja).';

CREATE OR REPLACE FUNCTION mod_fuerzatrabajo.ft_procedenciasocial_insertar (
)
RETURNS trigger AS
$body$
DECLARE

BEGIN
    SET search_path =  mod_fuerzatrabajo;
    IF (NEW.idpadre IS NULL)
    	THEN NEW.idpadre:= NEW.idprocedenciasocial;
    END IF;         	
RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_disponible_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_disponible".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_interrupto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_interrupto".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_motivodisponibilidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivodisponibilidad".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_motivointerrupcion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivointerrupcion".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_motivomovimiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivomovimiento".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_pedido_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_pedido".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_pedidocomposicion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_pedidocomposicion".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_periodo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_periodo".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_plantillatipocontrato_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_plantillatipocontrato".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_reserva_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_reserva".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_tipocontrato_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipocontrato".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_tipoperiodo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoperiodo".';

CREATE TABLE mod_fuerzatrabajo.conf_docidentidadmn (
  iddocidentidadmn NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idtipodocidentidad NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_docidentidadmn_pkey PRIMARY KEY(iddocidentidadmn)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.conf_docidentidadmn
IS 'Almacena la configuración del documento de identidad a emplear en el movimiento de nóminas.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_docidentidadmn.iddocidentidadmn
IS 'Identificador de la configuración.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_docidentidadmn.identidad
IS 'Identificador de la entidad para la que se establece la configuración.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_docidentidadmn.idtipodocidentidad
IS 'Identificador del tipo de documento de identidad a emplear por la entidad en el movimiento de nóminas.';

CREATE TABLE mod_fuerzatrabajo.conf_nromn (
  identidad NUMERIC(19,0) NOT NULL,
  nro NUMERIC(19,0) NOT NULL,
  anno NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_nromn_pkey PRIMARY KEY(identidad)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.conf_nromn
IS 'Almacena la configuración del número consecutivo del movimiento de nomina para una entidad';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_nromn.identidad
IS 'Identificador de la entidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_nromn.nro
IS 'Último número asignado al movimiento de nómina de la entidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_nromn.anno
IS 'Año en que se generó el número del movimiento de nómina.';

COMMENT ON TABLE mod_fuerzatrabajo.nom_conceptosalarial
IS 'Almacena los conceptos salariales.';

ALTER TABLE mod_fuerzatrabajo.nom_conceptosalarial
  ADD COLUMN reporte_registro_trabajadores NUMERIC(1,0) DEFAULT 0;

CREATE TABLE mod_fuerzatrabajo.nom_clasificacion (
  idclasificacion NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_clasificacion_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_clasificacion PRIMARY KEY(idclasificacion)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.nom_clasificacion
IS 'Tabla que almacena los tipos de periodos que se emplean en los pedidos de fuerza de trabajo.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_clasificacion.idclasificacion
IS 'Identificador de la clasificacion.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_clasificacion.denominacion
IS 'Denominación de la clasificacion.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_clasificacion.descripcion
IS 'Descripción de la clasificacion.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_clasificacion.fdesde
IS 'Fecha en que inicia la vigencia de la clasificacion.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_clasificacion.fhasta
IS 'Fecha en que concluye la vigencia de la clasificacion.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_clasificacion.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_fuerzatrabajo.conf_niveles (
  idconfnivel NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_confniveles_seq'::regclass) NOT NULL,
  idpreparacion NUMERIC(19,0) NOT NULL,
  idniveleducacional NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_idconfnivel PRIMARY KEY(idconfnivel)
) 
WITH (oids = false);

CREATE TABLE mod_fuerzatrabajo.dat_imputable (
  idimputable NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_imputable_seq'::regclass) NOT NULL,
  idinterrupcion NUMERIC(19,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_idimputable PRIMARY KEY(idimputable)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.dat_imputable
IS 'Almacena los imputables de una interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_imputable.idimputable
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_imputable.idinterrupcion
IS 'Identificador de la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_imputable.idpersona
IS 'Identificador de la persona imputable.';

CREATE TABLE mod_fuerzatrabajo.nom_motivobaja (
  idmotivobaja NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_motivobaja_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idpadre NUMERIC(19,0),
  bandera NUMERIC(19,0),
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_motivobaja PRIMARY KEY(idmotivobaja)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.nom_motivobaja
IS 'Almacena los motivos de baja.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.idmotivobaja
IS 'Identificador del motivo de baja.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.denominacion
IS 'Denominación del motivo de baja.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.descripcion
IS 'Descripción del motivo de baja.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.idpadre
IS 'Identificador del motivo de baja agrupador o padre.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.gestion
IS 'Determina si el registro es gestionable(1) o no(0).';

CREATE INDEX idx_idpadre_motivobaja ON mod_fuerzatrabajo.nom_motivobaja
  USING btree (idpadre);

COMMENT ON INDEX mod_fuerzatrabajo.idx_idpadre_motivobaja
IS 'Índice sobre la(s) columna(s) "idpadre" para agilizar la búsqueda de información.';

COMMENT ON CONSTRAINT pk_motivobaja ON mod_fuerzatrabajo.nom_motivobaja
IS 'LLave primaria para identificar la tupla.';

CREATE TRIGGER t_motivobaja_insertar
  BEFORE INSERT 
  ON mod_fuerzatrabajo.nom_motivobaja
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_fuerzatrabajo.ft_motivobaja_insertar();

COMMENT ON TRIGGER t_motivobaja_insertar ON mod_fuerzatrabajo.nom_motivobaja
IS 'Ejecuta la función "ft_motivobaja_insertar()".';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivodisponibilidad.fdesde
IS 'Fecha de entrada en vigor del motivo de disponibilidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivodisponibilidad.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

ALTER TABLE mod_fuerzatrabajo.nom_motivodisponibilidad
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivodisponibilidad.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

ALTER TABLE mod_fuerzatrabajo.nom_motivointerrupcion
  ALTER COLUMN denominacion TYPE VARCHAR(255) COLLATE pg_catalog."default";

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivointerrupcion.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivointerrupcion.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

ALTER TABLE mod_fuerzatrabajo.nom_motivointerrupcion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivointerrupcion.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON TABLE mod_fuerzatrabajo.nom_motivomovimiento
IS 'Almacena los motivos que conducen a movimientos de la ubicación laboral de la persona.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivomovimiento.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivomovimiento.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

ALTER TABLE mod_fuerzatrabajo.nom_motivomovimiento
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivomovimiento.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_fuerzatrabajo.dat_movimientonomina (
  idmovimientonomina NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_movimientonomina_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0),
  identidad NUMERIC(19,0),
  idcargo NUMERIC(19,0),
  fdesde DATE DEFAULT now() NOT NULL,
  consecutivo NUMERIC(19,0),
  CONSTRAINT pk_movimientonomina PRIMARY KEY(idmovimientonomina)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.dat_movimientonomina
IS 'Almacena los movimientos de una persona para su cargo en la entidad, retribuyendo al módulo de nómina y retribución salarial.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.idmovimientonomina
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.identidad
IS 'Identificador de la entidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.idcargo
IS 'Identificador del cargo.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.fdesde
IS 'Fecha de inicio del movimiento.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.consecutivo
IS 'Indicador consecutivo.';

CREATE TABLE mod_fuerzatrabajo.nom_procedenciasocial (
  idprocedenciasocial NUMERIC(3,0) DEFAULT nextval('mod_fuerzatrabajo.sec_procedenciasocial_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idpadre NUMERIC(19,0) NOT NULL,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_procedenciasocial PRIMARY KEY(idprocedenciasocial)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.nom_procedenciasocial
IS 'Almacena las procedencias sociales.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_procedenciasocial.idprocedenciasocial
IS 'Identificador de la procedencia social.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_procedenciasocial.denominacion
IS 'Denominación de la procedencia social.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_procedenciasocial.descripcion
IS 'Descripción de la procedencia social.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_procedenciasocial.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_procedenciasocial.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_procedenciasocial.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE INDEX fki_procedenciasocial_procedenciasocial_idprocedenciasocial ON mod_fuerzatrabajo.nom_procedenciasocial
  USING btree (idpadre);

COMMENT ON CONSTRAINT pk_procedenciasocial ON mod_fuerzatrabajo.nom_procedenciasocial
IS 'LLave primaria para identificar la tupla.';

CREATE TRIGGER t_insertar_procedenciasocial
  BEFORE INSERT 
  ON mod_fuerzatrabajo.nom_procedenciasocial
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_fuerzatrabajo.ft_procedenciasocial_insertar();

CREATE TABLE mod_fuerzatrabajo.nom_programalaboral (
  idprogramalaboral NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_programalaboral_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_programalaboral PRIMARY KEY(idprogramalaboral)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.nom_programalaboral
IS 'Almacena los programas laborales.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_programalaboral.idprogramalaboral
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_programalaboral.denominacion
IS 'Denominación del programa laboral.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_programalaboral.descripcion
IS 'Descripción del programa laboral.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_programalaboral.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_programalaboral.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_programalaboral.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_fuerzatrabajo.conf_suplemento (
  idsuplemento NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_suplemento_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idplantilla NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_suplemento_pkey PRIMARY KEY(idsuplemento)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.conf_suplemento
IS 'Almacena la configuración de la entidad y la plantilla del suplemento.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_suplemento.idsuplemento
IS 'Identificador del suplemento.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_suplemento.identidad
IS 'Identificador de la entidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_suplemento.idplantilla
IS 'Identificador de la plantilla del suplemento.';

ALTER TABLE mod_fuerzatrabajo.nom_tipocontrato
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_tipocontrato.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

ALTER TABLE mod_fuerzatrabajo.nom_tipoperiodo
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_tipoperiodo.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_fuerzatrabajo.nom_via (
  idvia NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_via_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  descripcion VARCHAR(245),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_idvia PRIMARY KEY(idvia)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.nom_via
IS 'Almacena las vias de aprobación de los procesos de disponibilidad.';

COMMENT ON TABLE mod_fuerzatrabajo.conf_conceptosalarialnomina
IS 'Almacena la configuración del concepto salarial del módulo de nómina y retribución salarial.';

ALTER TABLE mod_fuerzatrabajo.conf_conceptosalarialnomina
  ALTER COLUMN idconceptosalarial SET NOT NULL;

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  ADD COLUMN listo NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.listo
IS 'Determina si la persona se encuentra lista para tomar el cargo.
0-No listo
1-Listo';

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  ADD COLUMN observacion VARCHAR(255);

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  ADD COLUMN idclasificacion NUMERIC(19,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.idclasificacion
IS 'Identificador de la clasificacion.';

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  ADD COLUMN motivo VARCHAR(255);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.motivo
IS 'Motivo por el cual causa baja de la reserva.';

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  ADD COLUMN cargoprom VARCHAR(255);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.cargoprom
IS 'Cargo para el cual fue promovido.';

CREATE TABLE mod_fuerzatrabajo.conf_motivosbaja (
  idconfmotivobaja NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_confmotivosbaja_seq'::regclass) NOT NULL,
  idmotivobaja NUMERIC(19,0),
  motivoreporte VARCHAR(255) NOT NULL,
  CONSTRAINT pk_confmotivosbaja PRIMARY KEY(idconfmotivobaja)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_fuerzatrabajo.conf_motivosbaja.motivoreporte
IS 'Determina el motivo de baja a mostrar en el reporte.';

CREATE INDEX fki_motivobaja_confmotivobaja_idmotivobaja ON mod_fuerzatrabajo.conf_motivosbaja
  USING btree (idmotivobaja);

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  RENAME COLUMN fdesde TO fdeclaracion;

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  ADD COLUMN fnotificacion DATE;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fnotificacion
IS 'Fecha en la que se notifica al trabajador que se encuentra disponible.';

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  ADD COLUMN idprocesodisponibilidad NUMERIC(19,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.idprocesodisponibilidad
IS 'Identificador del proceso de disponibilidad';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_disponible.fhasta
IS 'Fecha en que termina la disponibilidad.';

CREATE TABLE mod_fuerzatrabajo.dat_interrupcion (
  idinterrupcion NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_interrupcion_seq'::regclass) NOT NULL,
  idmotivointerrupcion NUMERIC(19,0) NOT NULL,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  horas NUMERIC(4,0),
  observacion VARCHAR(255),
  idestructura NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_idinterrupcion PRIMARY KEY(idinterrupcion)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.dat_interrupcion
IS 'Almacena las interrupciones.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupcion.idinterrupcion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupcion.idmotivointerrupcion
IS 'Determina el motivo de interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupcion.fdesde
IS 'Determina la fecha desde que inicia la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupcion.fhasta
IS 'Determina la fecha en que finaliza la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupcion.horas
IS 'Determina la cantidad de horas que dura la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupcion.observacion
IS 'Determina las observaciones del periodo de interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupcion.idestructura
IS 'Determina la estructura donde ocurrió la interrupción.';

CREATE INDEX fki_motivointerrupcion_interrupcion_idmotivointerrupcion ON mod_fuerzatrabajo.dat_interrupcion
  USING btree (idmotivointerrupcion);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_plantillatipocontrato.idplantillatipocontrato
IS 'Identificador de la tabla.';

ALTER TABLE mod_fuerzatrabajo.nom_periodo
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_periodo.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_fuerzatrabajo.dat_procesodisponibilidad (
  idprocesodisponibilidad NUMERIC(19,0) DEFAULT nextval('mod_fuerzatrabajo.sec_procesodisponibilidad_seq'::regclass) NOT NULL,
  idvia NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  cantidadtrab NUMERIC(19,0) NOT NULL,
  faprobacion DATE DEFAULT now() NOT NULL,
  fcierre DATE,
  observaciones VARCHAR(255),
  CONSTRAINT pk_procesodisponibilidad PRIMARY KEY(idprocesodisponibilidad)
) 
WITH (oids = false);

COMMENT ON TABLE mod_fuerzatrabajo.dat_procesodisponibilidad
IS 'Almacena los procesos de disponibilidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_procesodisponibilidad.idprocesodisponibilidad
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_procesodisponibilidad.idvia
IS 'Identificador de la vía de aprobación del proceso de disponibilidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_procesodisponibilidad.idestructura
IS 'Identificador de la estructura(Organismo/OSDE/Entidad) para la que se aprueba el proceso de disponibilidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_procesodisponibilidad.cantidadtrab
IS 'Cantidad de trabajadores estimados a declarar disponibles.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_procesodisponibilidad.faprobacion
IS 'Fecha en que se aprueba el proceso de disponibilidad';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_procesodisponibilidad.fcierre
IS 'Fecha en que se cierra el proceso de disponibilidad';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_procesodisponibilidad.observaciones
IS 'Determina las observaciones que surjan durante el proceso.';

CREATE INDEX fki_via_procesodisponibilidad_idvia ON mod_fuerzatrabajo.dat_procesodisponibilidad
  USING btree (idvia);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.idinterrupto
IS 'Identificador de la tabla.';

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  ADD COLUMN idinterrupcion NUMERIC(19,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.idinterrupcion
IS 'Identificador de la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.fdesde
IS 'Fecha de inicio de la interrupción.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.fhasta
IS 'Fecha en que finaliza la interrupción.';

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  ADD COLUMN reubicado NUMERIC(1,0) DEFAULT 3 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.reubicado
IS 'Determina si el trabajador fue reubicado en labores para el restablecimiento del proceso de producción o de servicio.
1-Reubicado en labores de restablecimiento
2-Reubicado en otro cargo
3-Sin reubicar';

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  ADD COLUMN horas NUMERIC(4,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_interrupto.horas
IS 'Determina la cantidad de horas que dura la interrupción.';

COMMENT ON TABLE mod_fuerzatrabajo.dat_pedidocomposicion
IS 'Almacena los pedidos asociados al cargo o la especialidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.idpedidocomposicion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.bandera
IS 'Determina si la columna idcargoespecialidad contiene: 1->idcargo 2->idespecialidad 3->idespecilizacioncargo.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.idpedido
IS 'Identificador del pedido.';

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  ADD COLUMN directo NUMERIC(1,0) NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.directo
IS 'Determina el tipo de mano de obra: 0-> Indirecto, 1->Directo.';

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  ADD COLUMN idespecialidad NUMERIC(19,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.idespecialidad
IS 'Identificador de la especialidad de empleo.';

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  ADD COLUMN modificado NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.modificado
IS 'Determina si el pedido realizado fue modificado. 0-> No modificado, 1-> Modificado.';

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  DROP COLUMN idcargo;

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  DROP COLUMN idmotivointerrupcion;

CREATE INDEX fki_motivointerrupcion_interrupto_idmotivointerrupcion ON mod_fuerzatrabajo.dat_interrupto
  USING btree (idinterrupcion);

ALTER TABLE mod_fuerzatrabajo.conf_conceptosalarialnomina
  ADD CONSTRAINT pk_idconceptosalarialnomina 
    PRIMARY KEY (idconceptosalarialnomina, idconceptosalarial) NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.nom_procedenciasocial
  ADD CONSTRAINT fk_procedenciasocial_procedenciasocial_idprocedenciasocial FOREIGN KEY (idpadre)
    REFERENCES mod_fuerzatrabajo.nom_procedenciasocial(idprocedenciasocial)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.nom_motivobaja
  ADD CONSTRAINT fk_motivobaja_motivobaja_idpadre FOREIGN KEY (idpadre)
    REFERENCES mod_fuerzatrabajo.nom_motivobaja(idmotivobaja)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_motivobaja_motivobaja_idpadre ON mod_fuerzatrabajo.nom_motivobaja
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial de la estructura arbólea en la tabla. (nom_motivobaja).';

ALTER TABLE mod_fuerzatrabajo.dat_reserva
  ADD CONSTRAINT fk_clasificacion_reserva_idclasificacion FOREIGN KEY (idclasificacion)
    REFERENCES mod_fuerzatrabajo.nom_clasificacion(idclasificacion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_procesodisponibilidad
  ADD CONSTRAINT fk_via_procesodisponibilidad_idvia FOREIGN KEY (idvia)
    REFERENCES mod_fuerzatrabajo.nom_via(idvia)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_plantillatipocontrato
  ADD CONSTRAINT fk_tipocontrato_plantillatipocontrato_idtipocontrato FOREIGN KEY (idtipocontrato)
    REFERENCES mod_fuerzatrabajo.nom_tipocontrato(idtipocontrato)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_plantillatipocontrato
  ADD CONSTRAINT fk_plantilladoc_plantillatipocontrato_idplantilla FOREIGN KEY (idplantilla)
    REFERENCES mod_rrhhmaestro.dat_plantilladoc(idplantilladoc)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  ADD CONSTRAINT fk_pedido_pedidocomposicion_idpedido FOREIGN KEY (idpedido)
    REFERENCES mod_fuerzatrabajo.dat_pedido(idpedido)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  ADD CONSTRAINT fk_interrupcion_interrupto_idinterrupcion FOREIGN KEY (idinterrupcion)
    REFERENCES mod_fuerzatrabajo.dat_interrupcion(idinterrupcion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.dat_interrupcion
  ADD CONSTRAINT fk_motivointerrupcion_interrupcion_idmotivointerrupcion FOREIGN KEY (idmotivointerrupcion)
    REFERENCES mod_fuerzatrabajo.nom_motivointerrupcion(idmotivointerrupcion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.conf_motivosbaja
  ADD CONSTRAINT fk_motivobaja_confmotivobaja_idmotivobaja FOREIGN KEY (idmotivobaja)
    REFERENCES mod_fuerzatrabajo.nom_motivobaja(idmotivobaja)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_disponible0xfqjd (
  iddisponible NUMERIC(19,0),
  idsituacionlaboralp NUMERIC(19,0),
  idmotivodisponibilidad NUMERIC(19,0),
  fdeclaracion DATE,
  fnotificacion DATE,
  idprocesodisponibilidad NUMERIC(19,0),
  fhasta DATE
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_disponible0xfqjd (iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta) 
SELECT iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta FROM mod_fuerzatrabajo.dat_disponible;

-- Drop the source table

DROP TABLE mod_fuerzatrabajo.dat_disponible;

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
SELECT iddisponible, idsituacionlaboralp, idmotivodisponibilidad, fdeclaracion, fnotificacion, idprocesodisponibilidad, fhasta FROM dat_disponible0xfqjd;

-- Create indices, triggers and rules

CREATE INDEX fki_motivodisponibilidad_disponible_idmotivodisponibilidad ON mod_fuerzatrabajo.dat_disponible
  USING btree (idmotivodisponibilidad);

CREATE INDEX fki_situacionlaboral_disponible_idsituacionlaboralp ON mod_fuerzatrabajo.dat_disponible
  USING btree (idsituacionlaboralp);

-- Restore table's permissions

ALTER TABLE mod_fuerzatrabajo.dat_disponible
  OWNER TO zeolides;

-- Drop the temporary table

DROP TABLE dat_disponible0xfqjd;

CREATE TRIGGER t_modificarpedido
  BEFORE UPDATE 
  ON mod_fuerzatrabajo.dat_pedidocomposicion
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_fuerzatrabajo.ft_modicarpedido();

--Datos
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (1, 'ESTUDIANTE', 'Sin descripción.', '2016-05-10', NULL, 5, 1);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (2, 'DESEMPLEADO', 'Sin descripción.', '2017-09-19', NULL, 5, 1);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (3, 'AMA DE CASA', 'Sin descripción.', '2017-09-19', NULL, 5, 1);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (4, 'SECTOR ESTATAL', 'Sin descripción.', '2017-09-19', NULL, 5, 1);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (5, 'PROCEDENCIAS GENERALES', 'Sin descripción.', '2017-09-19', NULL, 5, 1);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (11, 'ESCUELA DE OFICIOS', 'Sin descripción.', '2017-09-19', NULL, 10, 0);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (6, 'PROCEDENCIAS PARA MENORES DE EDAD', 'Sin descripción.', '2017-09-19', NULL, 6, 1);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (12, 'TECNICO MEDIO DE LA ETP', 'Sin descripción.', '2017-09-19', NULL, 10, 0);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (10, 'GRADUADO DE ESPECIALIDADES DE', 'Sin descripción.', '2017-09-19', NULL, 6, 0);
INSERT INTO mod_fuerzatrabajo.nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (13, 'OBRERO CALIFICADO DE LA ETP', 'Sin descripción.', '2017-09-19', NULL, 10, 1);

INSERT INTO mod_fuerzatrabajo.nom_programalaboral (idprogramalaboral, denominacion, descripcion, fdesde, fhasta, gestion) VALUES (3, 'Vivienda', NULL, '2017-03-02', NULL, 1);
INSERT INTO mod_fuerzatrabajo.nom_programalaboral (idprogramalaboral, denominacion, descripcion, fdesde, fhasta, gestion) VALUES (4, 'Turismo', NULL, '2017-03-02', NULL, 1);
INSERT INTO mod_fuerzatrabajo.nom_programalaboral (idprogramalaboral, denominacion, descripcion, fdesde, fhasta, gestion) VALUES (5, 'Otras', NULL, '2017-03-02', NULL, 1);

ALTER FUNCTION mod_fuerzatrabajo.ft_modicarpedido ()
  OWNER TO zeolides;
ALTER FUNCTION mod_fuerzatrabajo.ft_motivobaja_insertar ()
  OWNER TO zeolides;
ALTER FUNCTION mod_fuerzatrabajo.ft_procedenciasocial_insertar ()
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.conf_docidentidadmn
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.conf_nromn
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.nom_clasificacion
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.conf_niveles
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.dat_imputable
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.nom_motivobaja
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.dat_movimientonomina
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.nom_procedenciasocial
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.nom_programalaboral
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.conf_suplemento
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.nom_via
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.conf_motivosbaja
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.dat_interrupcion
  OWNER TO zeolides;
ALTER TABLE mod_fuerzatrabajo.dat_procesodisponibilidad
  OWNER TO zeolides;
 --
CREATE LOCAL TEMPORARY TABLE dat_interrupto0meevb (
  idinterrupto NUMERIC(19,0),
  idsituacionlaboralp NUMERIC(19,0),
  idinterrupcion NUMERIC(19,0),
  fdesde DATE,
  fhasta DATE,
  reubicado NUMERIC(1,0),
  horas NUMERIC(4,0)
) ;

INSERT INTO dat_interrupto0meevb (idinterrupto, idsituacionlaboralp, idinterrupcion, fdesde, fhasta, reubicado, horas) 
SELECT idinterrupto, idsituacionlaboralp, idinterrupcion, fdesde, fhasta, reubicado, horas FROM mod_fuerzatrabajo.dat_interrupto;

DROP TABLE mod_fuerzatrabajo.dat_interrupto;

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

INSERT INTO mod_fuerzatrabajo.dat_interrupto (idinterrupto, idsituacionlaboralp, idinterrupcion, fdesde, fhasta, reubicado, horas) 
SELECT idinterrupto, idsituacionlaboralp, idinterrupcion, fdesde, fhasta, reubicado, horas FROM dat_interrupto0meevb;

CREATE INDEX fki_motivointerrupcion_interrupto_idmotivointerrupcion ON mod_fuerzatrabajo.dat_interrupto
  USING btree (idinterrupcion);

CREATE INDEX fki_situacionlaboral_interrupto_idsituacionlaboralp ON mod_fuerzatrabajo.dat_interrupto
  USING btree (idsituacionlaboralp);

ALTER TABLE mod_fuerzatrabajo.dat_interrupto
  OWNER TO zeolides;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_fuerzatrabajo.dat_interrupto TO zeolides;

DROP TABLE dat_interrupto0meevb;