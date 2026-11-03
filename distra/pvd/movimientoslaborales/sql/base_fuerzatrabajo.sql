--<Schema>
-- Created By : ScriptSplitGenerador
-- Code: http://10.12.170.129:9880/ch_fuerzatrabajo/trunk/lineabase
-- Only Schema
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
CREATE SCHEMA mod_fuerzatrabajo;
COMMENT ON SCHEMA mod_fuerzatrabajo IS 'Agrupa los datos del componente fuerza de trabajo. Versión 1. (RRHH)
1- Gestión de la demanda de la fuerza laboral.
2- Gestión de los movimiento laborales en la(s) entidad(es).';
SET search_path = mod_fuerzatrabajo, pg_catalog;
CREATE FUNCTION ft_modicarpedido() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
	NEW.modificado := 1;
    RETURN NEW;
END;
$$;
CREATE FUNCTION ft_motivobaja_insertar() RETURNS trigger
    LANGUAGE plpgsql COST 10
    AS $$BEGIN
    SET search_path = mod_fuerzatrabajo;
    IF  (NEW.idpadre is null)THEN
    	 NEW.idpadre:= NEW.idmotivobaja;
    END IF;    
RETURN NEW;
END;
$$;
COMMENT ON FUNCTION ft_motivobaja_insertar() IS 'Actualiza la columna "idpadre" de la tabla (nom_motivobaja).';
CREATE FUNCTION ft_motivomovimiento_insertar() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	rec mod_fuerzatrabajo.nom_motivomovimiento;
BEGIN
    SET search_path =  mod_fuerzatrabajo;
    IF (NEW.idpadre IS NULL)
    	THEN NEW.idpadre:= NEW.idmotivomovimiento;
    END IF;         	
RETURN NEW;
END;
$$;
CREATE FUNCTION ft_procedenciasocial_insertar() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	rec mod_fuerzatrabajo.nom_procedenciasocial;
BEGIN
    SET search_path =  mod_fuerzatrabajo;
    IF (NEW.idpadre IS NULL)
    	THEN NEW.idpadre:= NEW.idprocedenciasocial;
    END IF;         	
RETURN NEW;
END;
$$;
SET default_tablespace = '';
SET default_with_oids = false;
CREATE TABLE conf_conceptosalarialnomina (
    idconceptosalarialnomina numeric(19,0) NOT NULL,
    idconceptosalarial numeric(2,0) NOT NULL
);
COMMENT ON TABLE conf_conceptosalarialnomina IS 'Almacena la configuración del concepto salarial del módulo de nómina y retribución salarial.';
COMMENT ON COLUMN conf_conceptosalarialnomina.idconceptosalarialnomina IS 'Identificador del concepto salarial que viene de nomina.';
COMMENT ON COLUMN conf_conceptosalarialnomina.idconceptosalarial IS 'Identificador del concepto salarial fijo.';
CREATE TABLE conf_docidentidadmn (
    iddocidentidadmn numeric(19,0) NOT NULL,
    identidad numeric(19,0) NOT NULL,
    idtipodocidentidad numeric(19,0) NOT NULL
);
COMMENT ON TABLE conf_docidentidadmn IS 'Almacena la configuración del documento de identidad a emplear en el movimiento de nóminas.';
COMMENT ON COLUMN conf_docidentidadmn.iddocidentidadmn IS 'Identificador de la configuración.';
COMMENT ON COLUMN conf_docidentidadmn.identidad IS 'Identificador de la entidad para la que se establece la configuración.';
COMMENT ON COLUMN conf_docidentidadmn.idtipodocidentidad IS 'Identificador del tipo de documento de identidad a emplear por la entidad en el movimiento de nóminas.';
CREATE TABLE conf_entidad (
    idestructura numeric(19,0) NOT NULL,
    identidad numeric(19,0) NOT NULL
);
COMMENT ON TABLE conf_entidad IS 'Almacena la configuración de las Unidades Empresariales de Base.';
COMMENT ON COLUMN conf_entidad.idestructura IS 'Identificador de la estructura que se comportará como una Unidad Empresarial de Base (UEB).';
COMMENT ON COLUMN conf_entidad.identidad IS 'Identificador de la entidad a la que se subordina la estructura seleccionada como UEB.';
CREATE SEQUENCE sec_confmotivosbaja_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_confmotivosbaja_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_motivosbaja".';
CREATE TABLE conf_motivosbaja (
    idconfmotivobaja numeric(19,0) DEFAULT nextval('sec_confmotivosbaja_seq'::regclass) NOT NULL,
    idmotivobaja numeric(19,0),
    motivoreporte character varying(255) NOT NULL
);
COMMENT ON COLUMN conf_motivosbaja.motivoreporte IS 'Determina el motivo de baja a mostrar en el reporte.';
CREATE SEQUENCE sec_confniveles_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_confniveles_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_niveles".';
CREATE TABLE conf_niveles (
    idconfnivel numeric(19,0) DEFAULT nextval('sec_confniveles_seq'::regclass) NOT NULL,
    idpreparacion numeric(19,0) NOT NULL,
    idniveleducacional numeric(19,0) NOT NULL
);
CREATE TABLE conf_nromn (
    identidad numeric(19,0) NOT NULL,
    nro numeric(19,0) NOT NULL,
    anno numeric(19,0) NOT NULL
);
COMMENT ON TABLE conf_nromn IS 'Almacena la configuración del número consecutivo del movimiento de nomina para una entidad';
COMMENT ON COLUMN conf_nromn.identidad IS 'Identificador de la entidad.';
COMMENT ON COLUMN conf_nromn.nro IS 'Último número asignado al movimiento de nómina de la entidad.';
COMMENT ON COLUMN conf_nromn.anno IS 'Año en que se generó el número del movimiento de nómina.';
CREATE SEQUENCE sec_suplemento_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_suplemento_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_suplemento".';
CREATE TABLE conf_suplemento (
    idsuplemento numeric(19,0) DEFAULT nextval('sec_suplemento_seq'::regclass) NOT NULL,
    identidad numeric(19,0) NOT NULL,
    idplantilla numeric(19,0) NOT NULL
);
COMMENT ON TABLE conf_suplemento IS 'Almacena la configuración de la entidad y la plantilla del suplemento.';
COMMENT ON COLUMN conf_suplemento.idsuplemento IS 'Identificador del suplemento.';
COMMENT ON COLUMN conf_suplemento.identidad IS 'Identificador de la entidad.';
COMMENT ON COLUMN conf_suplemento.idplantilla IS 'Identificador de la plantilla del suplemento.';
CREATE SEQUENCE sec_disponible_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_disponible_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_disponible".';
CREATE TABLE dat_disponible (
    iddisponible numeric(19,0) DEFAULT nextval('sec_disponible_seq'::regclass) NOT NULL,
    idsituacionlaboralp numeric(19,0) NOT NULL,
    idmotivodisponibilidad numeric(19,0),
    fdeclaracion date DEFAULT now() NOT NULL,
    fnotificacion date,
    idprocesodisponibilidad numeric(19,0),
    fhasta date
);
COMMENT ON TABLE dat_disponible IS 'Almacena los trabajadores que han sido declarados disponibles.';
COMMENT ON COLUMN dat_disponible.iddisponible IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_disponible.idsituacionlaboralp IS 'Identificador de la situación laboral del trabajador que fue declarado disponible.';
COMMENT ON COLUMN dat_disponible.idmotivodisponibilidad IS 'Identificador del motivo por el cual el trabajador fue declarado disponible.';
COMMENT ON COLUMN dat_disponible.fdeclaracion IS 'Fecha en que el trabajador es declarado disponible.';
COMMENT ON COLUMN dat_disponible.fnotificacion IS 'Fecha en la que se notifica al trabajador que se encuentra disponible.';
COMMENT ON COLUMN dat_disponible.idprocesodisponibilidad IS 'Identificador del proceso de disponibilidad';
COMMENT ON COLUMN dat_disponible.fhasta IS 'Fecha en que termina la disponibilidad.';
CREATE SEQUENCE sec_imputable_seq
    START WITH 2
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_imputable_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_imputable".';
CREATE TABLE dat_imputable (
    idimputable numeric(19,0) DEFAULT nextval('sec_imputable_seq'::regclass) NOT NULL,
    idinterrupcion numeric(19,0) NOT NULL,
    idpersona numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_imputable IS 'Almacena los imputables de una interrupción.';
COMMENT ON COLUMN dat_imputable.idimputable IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_imputable.idinterrupcion IS 'Identificador de la interrupción.';
COMMENT ON COLUMN dat_imputable.idpersona IS 'Identificador de la persona imputable.';
CREATE SEQUENCE sec_interrupcion_seq
    START WITH 20
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_interrupcion_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_interrupcion".';
CREATE TABLE dat_interrupcion (
    idinterrupcion numeric(19,0) DEFAULT nextval('sec_interrupcion_seq'::regclass) NOT NULL,
    idmotivointerrupcion numeric(19,0) NOT NULL,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    horas numeric(4,0),
    observacion character varying(255),
    idestructura numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_interrupcion IS 'Almacena las interrupciones.';
COMMENT ON COLUMN dat_interrupcion.idinterrupcion IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_interrupcion.idmotivointerrupcion IS 'Determina el motivo de interrupción.';
COMMENT ON COLUMN dat_interrupcion.fdesde IS 'Determina la fecha desde que inicia la interrupción.';
COMMENT ON COLUMN dat_interrupcion.fhasta IS 'Determina la fecha en que finaliza la interrupción.';
COMMENT ON COLUMN dat_interrupcion.horas IS 'Determina la cantidad de horas que dura la interrupción.';
COMMENT ON COLUMN dat_interrupcion.observacion IS 'Determina las observaciones del periodo de interrupción.';
COMMENT ON COLUMN dat_interrupcion.idestructura IS 'Determina la estructura donde ocurrió la interrupción.';
CREATE SEQUENCE sec_interrupto_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_interrupto_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_interrupto".';
CREATE TABLE dat_interrupto (
    idinterrupto numeric(19,0) DEFAULT nextval('sec_interrupto_seq'::regclass) NOT NULL,
    idsituacionlaboralp numeric(19,0) NOT NULL,
    idinterrupcion numeric(19,0),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    reubicado numeric(1,0) DEFAULT 3 NOT NULL,
    horas numeric(4,0)
);
COMMENT ON TABLE dat_interrupto IS 'Almacena los trabajadores que han sido victima de cualquier evento que paralice el proceso productivo o de servicio.';
COMMENT ON COLUMN dat_interrupto.idinterrupto IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_interrupto.idsituacionlaboralp IS 'Identificador de la situación laboral del trabajador que fue declarado interrupto.';
COMMENT ON COLUMN dat_interrupto.idinterrupcion IS 'Identificador de la interrupción.';
COMMENT ON COLUMN dat_interrupto.fdesde IS 'Fecha de inicio de la interrupción.';
COMMENT ON COLUMN dat_interrupto.fhasta IS 'Fecha en que finaliza la interrupción.';
COMMENT ON COLUMN dat_interrupto.reubicado IS 'Determina si el trabajador fue reubicado en labores para el restablecimiento del proceso de producción o de servicio.
1-Reubicado en labores de restablecimiento
2-Reubicado en otro cargo
3-Sin reubicar';
COMMENT ON COLUMN dat_interrupto.horas IS 'Determina la cantidad de horas que dura la interrupción.';
CREATE SEQUENCE sec_movimientonomina_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_movimientonomina_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_movimientonomina".';
CREATE TABLE dat_movimientonomina (
    idmovimientonomina numeric(19,0) DEFAULT nextval('sec_movimientonomina_seq'::regclass) NOT NULL,
    idpersona numeric(19,0),
    identidad numeric(19,0),
    idcargo numeric(19,0),
    fdesde date DEFAULT now() NOT NULL,
    consecutivo numeric(19,0)
);
COMMENT ON TABLE dat_movimientonomina IS 'Almacena los movimientos de una persona para su cargo en la entidad, retribuyendo al módulo de nómina y retribución salarial.';
COMMENT ON COLUMN dat_movimientonomina.idmovimientonomina IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_movimientonomina.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN dat_movimientonomina.identidad IS 'Identificador de la entidad.';
COMMENT ON COLUMN dat_movimientonomina.idcargo IS 'Identificador del cargo.';
COMMENT ON COLUMN dat_movimientonomina.fdesde IS 'Fecha de inicio del movimiento.';
COMMENT ON COLUMN dat_movimientonomina.consecutivo IS 'Indicador consecutivo.';
CREATE SEQUENCE sec_pedido_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_pedido_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_pedido".';
CREATE TABLE dat_pedido (
    idpedido numeric DEFAULT nextval('sec_pedido_seq'::regclass) NOT NULL,
    idtipoperiodo numeric NOT NULL,
    idestructura numeric NOT NULL,
    fpedido date DEFAULT now() NOT NULL
);
COMMENT ON TABLE dat_pedido IS 'Almacena los pedidos fuerza de trabajo.';
COMMENT ON COLUMN dat_pedido.idpedido IS 'Identificador del pedido.';
COMMENT ON COLUMN dat_pedido.idtipoperiodo IS 'Identificador del tipo de periodo al que corresponde el pedido.';
COMMENT ON COLUMN dat_pedido.idestructura IS 'Identificador de la estructura que realiza el pedido.';
COMMENT ON COLUMN dat_pedido.fpedido IS 'Fecha en que se realiza el pedido.';
CREATE SEQUENCE sec_pedidocomposicion_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_pedidocomposicion_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_pedidocomposicion".';
CREATE TABLE dat_pedidocomposicion (
    idpedidocomposicion numeric(19,0) DEFAULT nextval('sec_pedidocomposicion_seq'::regclass) NOT NULL,
    idperiodo numeric(19,0) NOT NULL,
    idcargoespecialidad numeric(19,0) NOT NULL,
    bandera numeric(1,0) DEFAULT 1 NOT NULL,
    cantidad numeric(19,0) DEFAULT 0 NOT NULL,
    idpedido numeric(19,0) NOT NULL,
    directo numeric(1,0) NOT NULL,
    idespecialidad numeric(19,0),
    modificado numeric(1,0) DEFAULT 0 NOT NULL
);
COMMENT ON TABLE dat_pedidocomposicion IS 'Almacena los pedidos asociados al cargo o la especialidad.';
COMMENT ON COLUMN dat_pedidocomposicion.idpedidocomposicion IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_pedidocomposicion.idperiodo IS 'Identificador del periodo en que se realiza el pedido.';
COMMENT ON COLUMN dat_pedidocomposicion.idcargoespecialidad IS 'Almacena el identificador del cargo o el de la especialidad.';
COMMENT ON COLUMN dat_pedidocomposicion.bandera IS 'Determina si la columna idcargoespecialidad contiene: 1->idcargo 2->idespecialidad 3->idespecilizacioncargo.';
COMMENT ON COLUMN dat_pedidocomposicion.cantidad IS 'Determina la cantidad de personas que se necesitan para el cargo o especialidad.';
COMMENT ON COLUMN dat_pedidocomposicion.idpedido IS 'Identificador del pedido.';
COMMENT ON COLUMN dat_pedidocomposicion.directo IS 'Determina el tipo de mano de obra: 0-> Indirecto, 1->Directo.';
COMMENT ON COLUMN dat_pedidocomposicion.idespecialidad IS 'Identificador de la especialidad de empleo.';
COMMENT ON COLUMN dat_pedidocomposicion.modificado IS 'Determina si el pedido realizado fue modificado. 0-> No modificado, 1-> Modificado.';
CREATE SEQUENCE sec_plantillatipocontrato_seq
    START WITH 12
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_plantillatipocontrato_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_plantillatipocontrato".';
CREATE TABLE dat_plantillatipocontrato (
    idplantillatipocontrato numeric(19,0) DEFAULT nextval('sec_plantillatipocontrato_seq'::regclass) NOT NULL,
    idtipocontrato numeric(19,0) NOT NULL,
    idplantilla numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_plantillatipocontrato IS 'Determina la relación entre el tipo de contrato con las plantillas que tiene asociadas.';
COMMENT ON COLUMN dat_plantillatipocontrato.idplantillatipocontrato IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_plantillatipocontrato.idtipocontrato IS 'Identificador del tipo de contrato.';
COMMENT ON COLUMN dat_plantillatipocontrato.idplantilla IS 'Identificador de la plantilla que posee el tipo de contrato.';
CREATE SEQUENCE sec_procesodisponibilidad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
CREATE TABLE dat_procesodisponibilidad (
    idprocesodisponibilidad numeric(19,0) DEFAULT nextval('sec_procesodisponibilidad_seq'::regclass) NOT NULL,
    idvia numeric(19,0) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    cantidadtrab numeric(19,0) NOT NULL,
    faprobacion date DEFAULT now() NOT NULL,
    fcierre date,
    observaciones character varying(255)
);
COMMENT ON TABLE dat_procesodisponibilidad IS 'Almacena los procesos de disponibilidad.';
COMMENT ON COLUMN dat_procesodisponibilidad.idprocesodisponibilidad IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_procesodisponibilidad.idvia IS 'Identificador de la vía de aprobación del proceso de disponibilidad.';
COMMENT ON COLUMN dat_procesodisponibilidad.idestructura IS 'Identificador de la estructura(Organismo/OSDE/Entidad) para la que se aprueba el proceso de disponibilidad.';
COMMENT ON COLUMN dat_procesodisponibilidad.cantidadtrab IS 'Cantidad de trabajadores estimados a declarar disponibles.';
COMMENT ON COLUMN dat_procesodisponibilidad.faprobacion IS 'Fecha en que se aprueba el proceso de disponibilidad';
COMMENT ON COLUMN dat_procesodisponibilidad.fcierre IS 'Fecha en que se cierra el proceso de disponibilidad';
COMMENT ON COLUMN dat_procesodisponibilidad.observaciones IS 'Determina las observaciones que surjan durante el proceso.';
CREATE SEQUENCE sec_reserva_seq
    START WITH 14
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_reserva_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_reserva".';
CREATE TABLE dat_reserva (
    idreserva numeric(19,0) DEFAULT nextval('sec_reserva_seq'::regclass) NOT NULL,
    idcargo numeric(19,0) NOT NULL,
    idpersona numeric(19,0) NOT NULL,
    reserva numeric(1,0) DEFAULT 1 NOT NULL,
    preparacion numeric(1,0) DEFAULT 1 NOT NULL,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    fregistro date DEFAULT now() NOT NULL,
    listo numeric(1,0) DEFAULT 0 NOT NULL,
    observacion character varying(255),
    idclasificacion numeric(19,0),
    motivo character varying(255),
    cargoprom character varying(255)
);
COMMENT ON TABLE dat_reserva IS 'Almacena las reservas(personas) de los cargos de cuadros de la entidad.';
COMMENT ON COLUMN dat_reserva.idreserva IS 'Identificador de la reserva.';
COMMENT ON COLUMN dat_reserva.idcargo IS 'Identificador del cargo.';
COMMENT ON COLUMN dat_reserva.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN dat_reserva.reserva IS 'Determina si la persona es reserva(1) o sustituto(2).';
COMMENT ON COLUMN dat_reserva.preparacion IS 'Determina si la persona requiere preparación.
1-> No requiere preparación.
2-> Requiere preparación.';
COMMENT ON COLUMN dat_reserva.fdesde IS 'Fecha de inicio como reserva.';
COMMENT ON COLUMN dat_reserva.fhasta IS 'Fecha hasta que la persona fue reserva de un cargo.';
COMMENT ON COLUMN dat_reserva.fregistro IS 'Fecha en que se registran los datos.';
COMMENT ON COLUMN dat_reserva.listo IS 'Determina si la persona se encuentra lista para tomar el cargo.
0-No listo
1-Listo';
COMMENT ON COLUMN dat_reserva.idclasificacion IS 'Identificador de la clasificacion.';
COMMENT ON COLUMN dat_reserva.motivo IS 'Motivo por el cual causa baja de la reserva.';
COMMENT ON COLUMN dat_reserva.cargoprom IS 'Cargo para el cual fue promovido.';
CREATE SEQUENCE sec_clasificacion_seq
    START WITH 4
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_clasificacion_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_clasificacion".';
CREATE TABLE nom_clasificacion (
    idclasificacion numeric(19,0) DEFAULT nextval('sec_clasificacion_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(255),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_clasificacion IS 'Tabla que almacena los tipos de periodos que se emplean en los pedidos de fuerza de trabajo.';
COMMENT ON COLUMN nom_clasificacion.idclasificacion IS 'Identificador de la clasificacion.';
COMMENT ON COLUMN nom_clasificacion.denominacion IS 'Denominación de la clasificacion.';
COMMENT ON COLUMN nom_clasificacion.descripcion IS 'Descripción de la clasificacion.';
COMMENT ON COLUMN nom_clasificacion.fdesde IS 'Fecha en que inicia la vigencia de la clasificacion.';
COMMENT ON COLUMN nom_clasificacion.fhasta IS 'Fecha en que concluye la vigencia de la clasificacion.';
COMMENT ON COLUMN nom_clasificacion.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE TABLE nom_conceptosalarial (
    idconceptosalarial numeric(2,0) NOT NULL,
    denominacion character varying(250) NOT NULL,
    reporte_registro_trabajadores numeric(1,0) DEFAULT 0
);
COMMENT ON TABLE nom_conceptosalarial IS 'Almacena los conceptos salariales.';
COMMENT ON COLUMN nom_conceptosalarial.idconceptosalarial IS 'Identificador de la tabla';
COMMENT ON COLUMN nom_conceptosalarial.denominacion IS 'Denominación del concepto salarial.';
CREATE SEQUENCE sec_motivobaja_seq
    START WITH 22
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_motivobaja_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivobaja".';
CREATE TABLE nom_motivobaja (
    idmotivobaja numeric(19,0) DEFAULT nextval('sec_motivobaja_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500) DEFAULT 'Sin descripción.'::character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    idpadre numeric(19,0),
    bandera numeric(19,0),
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_motivobaja IS 'Almacena los motivos de baja.';
COMMENT ON COLUMN nom_motivobaja.idmotivobaja IS 'Identificador del motivo de baja.';
COMMENT ON COLUMN nom_motivobaja.denominacion IS 'Denominación del motivo de baja.';
COMMENT ON COLUMN nom_motivobaja.descripcion IS 'Descripción del motivo de baja.';
COMMENT ON COLUMN nom_motivobaja.fdesde IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN nom_motivobaja.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_motivobaja.idpadre IS 'Identificador del motivo de baja agrupador o padre.';
COMMENT ON COLUMN nom_motivobaja.gestion IS 'Determina si el registro es gestionable(1) o no(0).';
CREATE SEQUENCE sec_motivodisponibilidad_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_motivodisponibilidad_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivodisponibilidad".';
CREATE TABLE nom_motivodisponibilidad (
    denominacion character varying(100) NOT NULL,
    idmotivodisponibilidad numeric(19,0) DEFAULT nextval('sec_motivodisponibilidad_seq'::regclass) NOT NULL,
    descripcion character varying(245),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_motivodisponibilidad IS 'Almacena los motivos por los cuales se puede declarar disponibilidad laboral.';
COMMENT ON COLUMN nom_motivodisponibilidad.denominacion IS 'Almacena la denominación del motivo de disponibilidad.';
COMMENT ON COLUMN nom_motivodisponibilidad.idmotivodisponibilidad IS 'Almacena el identificador de la tabla.';
COMMENT ON COLUMN nom_motivodisponibilidad.descripcion IS 'Almacena la descripción del motivo de la disponibilidad.';
COMMENT ON COLUMN nom_motivodisponibilidad.fdesde IS 'Fecha de entrada en vigor del motivo de disponibilidad.';
COMMENT ON COLUMN nom_motivodisponibilidad.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_motivodisponibilidad.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE sec_motivointerrupcion_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_motivointerrupcion_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivointerrupcion".';
CREATE TABLE nom_motivointerrupcion (
    denominacion character varying(255) NOT NULL,
    idmotivointerrupcion numeric(19,0) DEFAULT nextval('sec_motivointerrupcion_seq'::regclass) NOT NULL,
    descripcion character varying(245),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_motivointerrupcion IS 'Almacena los motivos por los cuales se puede declarar interrupción laboral.';
COMMENT ON COLUMN nom_motivointerrupcion.denominacion IS 'Almacena la denominación del motivo de interrupción.';
COMMENT ON COLUMN nom_motivointerrupcion.idmotivointerrupcion IS 'Almacena el identificador de la tabla.';
COMMENT ON COLUMN nom_motivointerrupcion.descripcion IS 'Almacena la descripción del motivo de la interrupción.';
COMMENT ON COLUMN nom_motivointerrupcion.fdesde IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN nom_motivointerrupcion.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_motivointerrupcion.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE sec_motivomovimiento_seq
    START WITH 63
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_motivomovimiento_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivomovimiento".';
CREATE TABLE nom_motivomovimiento (
    idmotivomovimiento numeric(19,0) DEFAULT nextval('sec_motivomovimiento_seq'::regclass) NOT NULL,
    denominacion character varying(256) NOT NULL,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    descripcion character varying(256),
    idpadre numeric(19,0) NOT NULL,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_motivomovimiento IS 'Almacena los motivos que conducen a movimientos de la ubicación laboral de la persona.';
COMMENT ON COLUMN nom_motivomovimiento.denominacion IS 'Almacena la denominacion del motivo de movimiento';
COMMENT ON COLUMN nom_motivomovimiento.fdesde IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN nom_motivomovimiento.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_motivomovimiento.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE sec_periodo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_periodo_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_periodo".';
CREATE TABLE nom_periodo (
    idperiodo numeric(19,0) DEFAULT nextval('sec_periodo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(255),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    idtipoperiodo numeric(19,0) NOT NULL,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_periodo IS 'Almacena los periodos en los que se gestionará la demanda de la fuerza de trabajo.';
COMMENT ON COLUMN nom_periodo.idperiodo IS 'Identificador del periodo.';
COMMENT ON COLUMN nom_periodo.denominacion IS 'Denominación del periodo.';
COMMENT ON COLUMN nom_periodo.descripcion IS 'Descripción del periodo.';
COMMENT ON COLUMN nom_periodo.fdesde IS 'Fecha en que inicia la vigencia del periodo.';
COMMENT ON COLUMN nom_periodo.fhasta IS 'Fecha en que concluye la vigencia del periodo.';
COMMENT ON COLUMN nom_periodo.idtipoperiodo IS 'Identificador del tipo de periodo.';
COMMENT ON COLUMN nom_periodo.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE sec_procedenciasocial_seq
    START WITH 4
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999
    CACHE 1;
COMMENT ON SEQUENCE sec_procedenciasocial_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_procedenciasocial".';
CREATE TABLE nom_procedenciasocial (
    idprocedenciasocial numeric(3,0) DEFAULT nextval('sec_procedenciasocial_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500) DEFAULT 'Sin descripción.'::character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    idpadre numeric(19,0) NOT NULL,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_procedenciasocial IS 'Almacena las procedencias sociales.';
COMMENT ON COLUMN nom_procedenciasocial.idprocedenciasocial IS 'Identificador de la procedencia social.';
COMMENT ON COLUMN nom_procedenciasocial.denominacion IS 'Denominación de la procedencia social.';
COMMENT ON COLUMN nom_procedenciasocial.descripcion IS 'Descripción de la procedencia social.';
COMMENT ON COLUMN nom_procedenciasocial.fdesde IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN nom_procedenciasocial.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_procedenciasocial.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE sec_programalaboral_seq
    START WITH 5
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_programalaboral_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_programalaboral.';
CREATE TABLE nom_programalaboral (
    idprogramalaboral numeric(19,0) DEFAULT nextval('sec_programalaboral_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_programalaboral IS 'Almacena los programas laborales.';
COMMENT ON COLUMN nom_programalaboral.idprogramalaboral IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_programalaboral.denominacion IS 'Denominación del programa laboral.';
COMMENT ON COLUMN nom_programalaboral.descripcion IS 'Descripción del programa laboral.';
COMMENT ON COLUMN nom_programalaboral.fdesde IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN nom_programalaboral.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_programalaboral.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE sec_tipocontrato_seq
    START WITH 9
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_tipocontrato_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipocontrato".';
CREATE TABLE nom_tipocontrato (
    idtipocontrato numeric(19,0) DEFAULT nextval('sec_tipocontrato_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    plantilla numeric(1,0) DEFAULT 0 NOT NULL,
    determinado numeric(1,0),
    descripcion character varying,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_tipocontrato IS 'Almacena los tipos de contratos que emplea RRHH para formalizar la relación trabajador-entidad.';
COMMENT ON COLUMN nom_tipocontrato.idtipocontrato IS 'Identificador del tipo de contrato.';
COMMENT ON COLUMN nom_tipocontrato.denominacion IS 'Denominación del tipo de contrato.';
COMMENT ON COLUMN nom_tipocontrato.plantilla IS 'Determina si tiene plantilla:
1- si  
0- no.';
COMMENT ON COLUMN nom_tipocontrato.determinado IS 'Determina si el tipo de contrato requiere un periodo de validez definido. 0 -> periodo indeterminado. 1 -> periodo determinado.';
COMMENT ON COLUMN nom_tipocontrato.descripcion IS 'Descripción del tipo de contrato.';
COMMENT ON COLUMN nom_tipocontrato.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE sec_tipoperiodo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_tipoperiodo_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoperiodo".';
CREATE TABLE nom_tipoperiodo (
    idtipoperiodo numeric(19,0) DEFAULT nextval('sec_tipoperiodo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(255),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    cantpedidos numeric(5,0) DEFAULT 1 NOT NULL,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_tipoperiodo IS 'Tabla que almacena los tipos de periodos que se emplean en los pedidos de fuerza de trabajo.';
COMMENT ON COLUMN nom_tipoperiodo.idtipoperiodo IS 'Identificador del tipo de periodo.';
COMMENT ON COLUMN nom_tipoperiodo.denominacion IS 'Denominación del tipo de periodo.';
COMMENT ON COLUMN nom_tipoperiodo.descripcion IS 'Descripción del tipo de periodo.';
COMMENT ON COLUMN nom_tipoperiodo.fdesde IS 'Fecha en que inicia la vigencia del tipo de periodo.';
COMMENT ON COLUMN nom_tipoperiodo.fhasta IS 'Fecha en que concluye la vigencia del tipo de periodo.';
COMMENT ON COLUMN nom_tipoperiodo.cantpedidos IS 'Cantidad de pedidos que se pueden realizar a partir del periodo que se demanda.';
COMMENT ON COLUMN nom_tipoperiodo.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE sec_via_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_via_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_viaaprobacion".';
CREATE TABLE nom_via (
    idvia numeric(19,0) DEFAULT nextval('sec_via_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    descripcion character varying(245),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE nom_via IS 'Almacena las vias de aprobación de los procesos de disponibilidad.';
--</Schema>

--<Data>
-- Created By : ScriptSplitGenerador
-- Code: http://10.12.170.129:9880/ch_fuerzatrabajo/trunk/lineabase
-- Only Data
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = mod_fuerzatrabajo, pg_catalog;
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (19, 5);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (34, 5);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (51, 5);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (53, 5);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (107, 7);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (110, 10);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (111, 1);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (114, 6);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (113, 3);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (112, 4);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (116, 9);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (115, 8);
INSERT INTO conf_conceptosalarialnomina (idconceptosalarialnomina, idconceptosalarial) VALUES (115, 2);
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (6, NULL, 'Privación de libertad');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (7, NULL, 'Paso a formas no estatales');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (2, 2, 'Jubilación');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (1, 8, 'Salarial');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (3, 3, 'Fallecimiento');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (10, 11, 'Salida del país');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (9, 6, 'Sanción administrativa');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (8, 15, 'Proceso de disponibilidad');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (5, 10, 'Invalidez parcial');
INSERT INTO conf_motivosbaja (idconfmotivobaja, idmotivobaja, motivoreporte) VALUES (4, 10, 'Invalidez total');
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (1, 11, 2022);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (2, 11, 2023);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (3, 9, 2023);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (4, 9, 2022);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (5, 9, 2021);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (6, 1, 2023);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (7, 7, 2022);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (8, 7, 2023);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (9, 7, 2021);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (10, 15, 2019);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (11, 15, 2020);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (12, 15, 2021);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (13, 15, 0);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (14, 15, 2022);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (15, 15, 2023);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (16, 10, 2019);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (17, 10, 2020);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (18, 10, 2021);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (19, 10, 0);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (20, 10, 2022);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (21, 10, 2023);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (22, 0, 2019);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (23, 0, 2020);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (24, 0, 2021);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (25, 0, 0);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (26, 0, 2022);
INSERT INTO conf_niveles (idconfnivel, idpreparacion, idniveleducacional) VALUES (27, 0, 2023);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (7, 'Perfeccionamiento', 0);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (9, 'Plus salarial', 0);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (10, 'Idoneidad', 0);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (6, 'Tecnico', 0);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (8, 'Encargado de almacen', 0);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (1, 'CLA', 1);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (2, 'Turnos nocturnos o mixtos', 1);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (3, 'Maestria o doctorado', 1);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (4, 'Años de servicio', 1);
INSERT INTO nom_conceptosalarial (idconceptosalarial, denominacion, reporte_registro_trabajadores) VALUES (5, 'Otros', 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (1, 'SOLICITUD PROPIA', 'Sin descripción.', '2016-05-10', NULL, 1, 1, 0);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (6, 'SANCIÓN LABORAL', 'Sin descripción.', '2016-05-10', NULL, 6, NULL, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (7, 'INDISCIPLINA', 'Sin descripción.', '2016-05-10', NULL, 7, 1, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (10, 'ENFERMEDAD', 'Sin descripción.', '2018-01-24', NULL, 10, NULL, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (11, 'SALIDA DEL PAIS', 'Sin descripción.', '2018-09-07', NULL, 11, NULL, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (2, 'JUBILACIÓN', 'Sin descripción.', '2016-05-10', NULL, 2, NULL, 0);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (3, 'FALLECIMIENTO', 'Sin descripción.', '2016-05-10', NULL, 3, NULL, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (5, 'MOVIMIENTO INTERNO', 'Sin descripción.', '2016-05-10', NULL, 5, 2, 0);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (15, 'REDUCCIÓN DE PLANTILLA', 'Sin descripción.', '2018-09-07', NULL, 15, NULL, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (12, 'LIBERACIÓN', 'Sin descripción.', '2018-09-07', NULL, 12, NULL, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (13, 'NO IDONEO', 'Sin descripción.', '2016-05-10', NULL, 13, NULL, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (9, 'OTRAS', 'Sin descripción.', '2016-05-10', NULL, 9, NULL, 1);
INSERT INTO nom_motivobaja (idmotivobaja, denominacion, descripcion, fdesde, fhasta, idpadre, bandera, gestion) VALUES (8, 'POR MOTIVO SALARIAL', 'Sin descripción.', '2016-05-10', NULL, 8, 1, 1);
INSERT INTO nom_motivodisponibilidad (denominacion, idmotivodisponibilidad, descripcion, fdesde, fhasta, gestion) VALUES ('Reducción de plantilla', 1, '', '2015-10-20', NULL, 0);
INSERT INTO nom_motivodisponibilidad (denominacion, idmotivodisponibilidad, descripcion, fdesde, fhasta, gestion) VALUES ('Desintegración de la entidad', 2, '', '2015-10-20', NULL, 1);
INSERT INTO nom_motivodisponibilidad (denominacion, idmotivodisponibilidad, descripcion, fdesde, fhasta, gestion) VALUES ('Fusión de la entidad', 3, '', '2015-10-20', NULL, 0);
INSERT INTO nom_motivointerrupcion (denominacion, idmotivointerrupcion, descripcion, fdesde, fhasta, gestion) VALUES ('Deterioro de equipo', 1, NULL, '2015-10-10', NULL, 1);
INSERT INTO nom_motivointerrupcion (denominacion, idmotivointerrupcion, descripcion, fdesde, fhasta, gestion) VALUES ('Otro', 4, 'otro', '2016-02-03', NULL, 0);
INSERT INTO nom_motivointerrupcion (denominacion, idmotivointerrupcion, descripcion, fdesde, fhasta, gestion) VALUES ('cambios', 9, '', '2018-01-24', '2018-01-31', 1);
INSERT INTO nom_motivomovimiento (idmotivomovimiento, denominacion, fdesde, fhasta, descripcion, idpadre, gestion) VALUES (63, 'Promoción', '2016-03-04', NULL, 'sdfsdgfsdfgdsfg', 61, 1);
INSERT INTO nom_motivomovimiento (idmotivomovimiento, denominacion, fdesde, fhasta, descripcion, idpadre, gestion) VALUES (61, 'Motivos de la entidad', '2016-03-04', NULL, '', 61, 1);
INSERT INTO nom_motivomovimiento (idmotivomovimiento, denominacion, fdesde, fhasta, descripcion, idpadre, gestion) VALUES (62, 'Democión', '2016-03-04', NULL, '', 61, 1);
INSERT INTO nom_motivomovimiento (idmotivomovimiento, denominacion, fdesde, fhasta, descripcion, idpadre, gestion) VALUES (66, 'Incapacidad', '2016-03-15', NULL, '', 65, 0);
INSERT INTO nom_motivomovimiento (idmotivomovimiento, denominacion, fdesde, fhasta, descripcion, idpadre, gestion) VALUES (65, 'Motivos personales', '2016-03-15', NULL, 'motivos', 65, 0);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (1, 'ESTUDIANTE', 'Sin descripción.', '2016-05-10', NULL, 5, 1);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (2, 'DESEMPLEADO', 'Sin descripción.', '2017-09-19', NULL, 5, 1);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (3, 'AMA DE CASA', 'Sin descripción.', '2017-09-19', NULL, 5, 1);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (4, 'SECTOR ESTATAL', 'Sin descripción.', '2017-09-19', NULL, 5, 1);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (5, 'PROCEDENCIAS GENERALES', 'Sin descripción.', '2017-09-19', NULL, 5, 1);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (11, 'ESCUELA DE OFICIOS', 'Sin descripción.', '2017-09-19', NULL, 10, 0);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (6, 'PROCEDENCIAS PARA MENORES DE EDAD', 'Sin descripción.', '2017-09-19', NULL, 6, 1);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (12, 'TECNICO MEDIO DE LA ETP', 'Sin descripción.', '2017-09-19', NULL, 10, 0);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (10, 'GRADUADO DE ESPECIALIDADES DE', 'Sin descripción.', '2017-09-19', NULL, 6, 0);
INSERT INTO nom_procedenciasocial (idprocedenciasocial, denominacion, descripcion, fdesde, fhasta, idpadre, gestion) VALUES (13, 'OBRERO CALIFICADO DE LA ETP', 'Sin descripción.', '2017-09-19', NULL, 10, 1);
INSERT INTO nom_programalaboral (idprogramalaboral, denominacion, descripcion, fdesde, fhasta, gestion) VALUES (3, 'Vivienda', NULL, '2017-03-02', NULL, 1);
INSERT INTO nom_programalaboral (idprogramalaboral, denominacion, descripcion, fdesde, fhasta, gestion) VALUES (4, 'Turismo', NULL, '2017-03-02', NULL, 1);
INSERT INTO nom_programalaboral (idprogramalaboral, denominacion, descripcion, fdesde, fhasta, gestion) VALUES (5, 'Otras', NULL, '2017-03-02', NULL, 1);
INSERT INTO nom_tipocontrato (idtipocontrato, denominacion, plantilla, determinado, descripcion, gestion) VALUES (17, 'Contrato verbal', 0, 1, 'Este tipo de contrato no genera documento y requiere fecha de terminación', 1);
INSERT INTO nom_tipocontrato (idtipocontrato, denominacion, plantilla, determinado, descripcion, gestion) VALUES (24, 'Contrato de designación', 0, 0, '', 1);
INSERT INTO nom_tipocontrato (idtipocontrato, denominacion, plantilla, determinado, descripcion, gestion) VALUES (5, 'Contrato determinado', 1, 1, 'Este tipo de contrato requiere fecha fin', 1);
INSERT INTO nom_tipocontrato (idtipocontrato, denominacion, plantilla, determinado, descripcion, gestion) VALUES (8, 'Contrato por periodo a prueba', 1, 1, 'A prueba', 1);
INSERT INTO nom_tipocontrato (idtipocontrato, denominacion, plantilla, determinado, descripcion, gestion) VALUES (20, 'Designación', 0, 0, '', 1);
INSERT INTO nom_tipocontrato (idtipocontrato, denominacion, plantilla, determinado, descripcion, gestion) VALUES (23, 'Contrato de nombramiento', 0, 0, '', 1);
INSERT INTO nom_tipocontrato (idtipocontrato, denominacion, plantilla, determinado, descripcion, gestion) VALUES (6, 'Contrato indeterminado', 1, 0, 'No requiere fecha de terminación.', 1);
SELECT pg_catalog.setval('sec_clasificacion_seq', 4, false);
SELECT pg_catalog.setval('sec_confmotivosbaja_seq', 10, true);
SELECT pg_catalog.setval('sec_confniveles_seq', 27, true);
SELECT pg_catalog.setval('sec_disponible_seq', 0, true);
SELECT pg_catalog.setval('sec_imputable_seq', 2, false);
SELECT pg_catalog.setval('sec_interrupcion_seq', 20, false);
SELECT pg_catalog.setval('sec_interrupto_seq', 0, true);
SELECT pg_catalog.setval('sec_motivobaja_seq', 15, true);
SELECT pg_catalog.setval('sec_motivodisponibilidad_seq', 3, true);
SELECT pg_catalog.setval('sec_motivointerrupcion_seq', 9, true);
SELECT pg_catalog.setval('sec_motivomovimiento_seq', 66, true);
SELECT pg_catalog.setval('sec_movimientonomina_seq', 0, true);
SELECT pg_catalog.setval('sec_pedido_seq', 0, true);
SELECT pg_catalog.setval('sec_pedidocomposicion_seq', 0, true);
SELECT pg_catalog.setval('sec_periodo_seq', 0, true);
SELECT pg_catalog.setval('sec_plantillatipocontrato_seq', 0, true);
SELECT pg_catalog.setval('sec_procedenciasocial_seq', 13, true);
SELECT pg_catalog.setval('sec_procesodisponibilidad_seq', 1, false);
SELECT pg_catalog.setval('sec_programalaboral_seq', 5, true);
SELECT pg_catalog.setval('sec_reserva_seq', 0, true);
SELECT pg_catalog.setval('sec_suplemento_seq', 0, true);
SELECT pg_catalog.setval('sec_tipocontrato_seq', 24, true);
SELECT pg_catalog.setval('sec_tipoperiodo_seq', 0, true);
SELECT pg_catalog.setval('sec_via_seq', 1, false);
--</Data>

--<Restrictions>
-- Created By : ScriptSplitGenerador
-- Code: http://10.12.170.129:9880/ch_fuerzatrabajo/trunk/lineabase
-- Only Restrictions
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = mod_fuerzatrabajo, pg_catalog;
ALTER TABLE ONLY conf_docidentidadmn
    ADD CONSTRAINT conf_docidentidadmn_pkey PRIMARY KEY (iddocidentidadmn);
ALTER TABLE ONLY conf_nromn
    ADD CONSTRAINT conf_nromn_pkey PRIMARY KEY (identidad);
ALTER TABLE ONLY conf_suplemento
    ADD CONSTRAINT conf_suplemento_pkey PRIMARY KEY (idsuplemento);
ALTER TABLE ONLY dat_pedido
    ADD CONSTRAINT dat_pedido_pkey PRIMARY KEY (idpedido);
ALTER TABLE ONLY nom_clasificacion
    ADD CONSTRAINT pk_clasificacion PRIMARY KEY (idclasificacion);
ALTER TABLE ONLY conf_motivosbaja
    ADD CONSTRAINT pk_confmotivosbaja PRIMARY KEY (idconfmotivobaja);
ALTER TABLE ONLY conf_entidad
    ADD CONSTRAINT pk_entidad PRIMARY KEY (idestructura, identidad);
ALTER TABLE ONLY nom_conceptosalarial
    ADD CONSTRAINT pk_idconceptosalarial PRIMARY KEY (idconceptosalarial);
ALTER TABLE ONLY conf_conceptosalarialnomina
    ADD CONSTRAINT pk_idconceptosalarialnomina PRIMARY KEY (idconceptosalarialnomina, idconceptosalarial);
ALTER TABLE ONLY conf_niveles
    ADD CONSTRAINT pk_idconfnivel PRIMARY KEY (idconfnivel);
ALTER TABLE ONLY dat_disponible
    ADD CONSTRAINT pk_iddisponible PRIMARY KEY (iddisponible);
ALTER TABLE ONLY dat_imputable
    ADD CONSTRAINT pk_idimputable PRIMARY KEY (idimputable);
ALTER TABLE ONLY dat_interrupcion
    ADD CONSTRAINT pk_idinterrupcion PRIMARY KEY (idinterrupcion);
ALTER TABLE ONLY dat_interrupto
    ADD CONSTRAINT pk_idinterrupto PRIMARY KEY (idinterrupto);
ALTER TABLE ONLY nom_motivodisponibilidad
    ADD CONSTRAINT pk_idmotivodisponibilidad PRIMARY KEY (idmotivodisponibilidad);
ALTER TABLE ONLY nom_motivointerrupcion
    ADD CONSTRAINT pk_idmotivointerrupcion PRIMARY KEY (idmotivointerrupcion);
ALTER TABLE ONLY dat_pedidocomposicion
    ADD CONSTRAINT pk_idpedidocomposicion PRIMARY KEY (idpedidocomposicion);
ALTER TABLE ONLY dat_plantillatipocontrato
    ADD CONSTRAINT pk_idplantillatipocontrato PRIMARY KEY (idplantillatipocontrato);
ALTER TABLE ONLY nom_via
    ADD CONSTRAINT pk_idvia PRIMARY KEY (idvia);
ALTER TABLE ONLY nom_motivobaja
    ADD CONSTRAINT pk_motivobaja PRIMARY KEY (idmotivobaja);
COMMENT ON CONSTRAINT pk_motivobaja ON nom_motivobaja IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY nom_motivomovimiento
    ADD CONSTRAINT pk_motivomovimiento PRIMARY KEY (idmotivomovimiento);
ALTER TABLE ONLY dat_movimientonomina
    ADD CONSTRAINT pk_movimientonomina PRIMARY KEY (idmovimientonomina);
ALTER TABLE ONLY nom_periodo
    ADD CONSTRAINT pk_periodo PRIMARY KEY (idperiodo);
ALTER TABLE ONLY nom_procedenciasocial
    ADD CONSTRAINT pk_procedenciasocial PRIMARY KEY (idprocedenciasocial);
COMMENT ON CONSTRAINT pk_procedenciasocial ON nom_procedenciasocial IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY dat_procesodisponibilidad
    ADD CONSTRAINT pk_procesodisponibilidad PRIMARY KEY (idprocesodisponibilidad);
ALTER TABLE ONLY nom_programalaboral
    ADD CONSTRAINT pk_programalaboral PRIMARY KEY (idprogramalaboral);
ALTER TABLE ONLY dat_reserva
    ADD CONSTRAINT pk_reserva PRIMARY KEY (idreserva);
ALTER TABLE ONLY nom_tipocontrato
    ADD CONSTRAINT pk_tipocontrato PRIMARY KEY (idtipocontrato);
COMMENT ON CONSTRAINT pk_tipocontrato ON nom_tipocontrato IS 'LLave primaria para la identificar la tupla.';
ALTER TABLE ONLY nom_tipoperiodo
    ADD CONSTRAINT pk_tipoperiodo PRIMARY KEY (idtipoperiodo);
CREATE INDEX fki_conceptosalarial_conceptosalarialnomina_idconceptosalarial ON conf_conceptosalarialnomina USING btree (idconceptosalarial);
CREATE INDEX fki_motivobaja_confmotivobaja_idmotivobaja ON conf_motivosbaja USING btree (idmotivobaja);
CREATE INDEX fki_motivodisponibilidad_disponible_idmotivodisponibilidad ON dat_disponible USING btree (idmotivodisponibilidad);
CREATE INDEX fki_motivointerrupcion_interrupcion_idmotivointerrupcion ON dat_interrupcion USING btree (idmotivointerrupcion);
CREATE INDEX fki_motivointerrupcion_interrupto_idmotivointerrupcion ON dat_interrupto USING btree (idinterrupcion);
CREATE INDEX fki_motivomovimiento_motivomovimiento_idmotivomovimiento ON nom_motivomovimiento USING btree (idpadre);
CREATE INDEX fki_pedido_pedidocomposicion_idpedido ON dat_pedidocomposicion USING btree (idpedido);
CREATE INDEX fki_plantilla_plantillatipocontrato_idplantilla ON dat_plantillatipocontrato USING btree (idplantilla);
CREATE INDEX fki_procedenciasocial_procedenciasocial_idprocedenciasocial ON nom_procedenciasocial USING btree (idpadre);
CREATE INDEX fki_situacionlaboral_disponible_idsituacionlaboralp ON dat_disponible USING btree (idsituacionlaboralp);
CREATE INDEX fki_situacionlaboral_interrupto_idsituacionlaboralp ON dat_interrupto USING btree (idsituacionlaboralp);
CREATE INDEX fki_tipocontrato_plantillatipocontrato_idtipocontrato ON dat_plantillatipocontrato USING btree (idtipocontrato);
CREATE INDEX fki_via_procesodisponibilidad_idvia ON dat_procesodisponibilidad USING btree (idvia);
CREATE INDEX idx_idpadre_motivobaja ON nom_motivobaja USING btree (idpadre);
COMMENT ON INDEX idx_idpadre_motivobaja IS 'Ã?ndice sobre la(s) columna(s) "idpadre" para agilizar la bÃºsqueda de informaciÃ³n.';
CREATE INDEX idx_idplantillatc ON nom_tipocontrato USING btree (plantilla);
CREATE TRIGGER t_insertar_motivomovimiento BEFORE INSERT ON nom_motivomovimiento FOR EACH ROW EXECUTE PROCEDURE ft_motivomovimiento_insertar();
CREATE TRIGGER t_insertar_procedenciasocial BEFORE INSERT ON nom_procedenciasocial FOR EACH ROW EXECUTE PROCEDURE ft_procedenciasocial_insertar();
CREATE TRIGGER t_modificarpedido BEFORE UPDATE ON dat_pedidocomposicion FOR EACH ROW EXECUTE PROCEDURE ft_modicarpedido();
CREATE TRIGGER t_motivobaja_insertar BEFORE INSERT ON nom_motivobaja FOR EACH ROW EXECUTE PROCEDURE ft_motivobaja_insertar();
COMMENT ON TRIGGER t_motivobaja_insertar ON nom_motivobaja IS 'Ejecuta la funciÃ³n "ft_motivobaja_insertar()".';
ALTER TABLE ONLY dat_reserva
    ADD CONSTRAINT fk_clasificacion_reserva_idclasificacion FOREIGN KEY (idclasificacion) REFERENCES nom_clasificacion(idclasificacion);
ALTER TABLE ONLY conf_conceptosalarialnomina
    ADD CONSTRAINT fk_conceptosalarial_conceptosalarialnomina_idconceptosalarial FOREIGN KEY (idconceptosalarial) REFERENCES nom_conceptosalarial(idconceptosalarial) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_interrupto
    ADD CONSTRAINT fk_interrupcion_interrupto_idinterrupcion FOREIGN KEY (idinterrupcion) REFERENCES dat_interrupcion(idinterrupcion) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY conf_motivosbaja
    ADD CONSTRAINT fk_motivobaja_confmotivobaja_idmotivobaja FOREIGN KEY (idmotivobaja) REFERENCES nom_motivobaja(idmotivobaja) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_motivobaja
    ADD CONSTRAINT fk_motivobaja_motivobaja_idpadre FOREIGN KEY (idpadre) REFERENCES nom_motivobaja(idmotivobaja) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_motivobaja_motivobaja_idpadre ON nom_motivobaja IS 'LLave forÃ¡nea para identificar la relaciÃ³n y garantizar la integridad referencial de la estructura arbÃ³lea en la tabla. (nom_motivobaja).';
ALTER TABLE ONLY dat_disponible
    ADD CONSTRAINT fk_motivodisponibilidad_disponible_idmotivodisponibilidad FOREIGN KEY (idmotivodisponibilidad) REFERENCES nom_motivodisponibilidad(idmotivodisponibilidad);
ALTER TABLE ONLY dat_interrupcion
    ADD CONSTRAINT fk_motivointerrupcion_interrupcion_idmotivointerrupcion FOREIGN KEY (idmotivointerrupcion) REFERENCES nom_motivointerrupcion(idmotivointerrupcion);
ALTER TABLE ONLY nom_motivomovimiento
    ADD CONSTRAINT fk_motivomovimiento_motivomovimiento_idmotivomovimiento FOREIGN KEY (idpadre) REFERENCES nom_motivomovimiento(idmotivomovimiento) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_pedidocomposicion
    ADD CONSTRAINT fk_pedido_pedidocomposicion_idpedido FOREIGN KEY (idpedido) REFERENCES dat_pedido(idpedido) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_pedidocomposicion
    ADD CONSTRAINT fk_periodo_pedidocomposicion_idperiodo FOREIGN KEY (idperiodo) REFERENCES nom_periodo(idperiodo) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY nom_procedenciasocial
    ADD CONSTRAINT fk_procedenciasocial_procedenciasocial_idprocedenciasocial FOREIGN KEY (idpadre) REFERENCES nom_procedenciasocial(idprocedenciasocial) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_plantillatipocontrato
    ADD CONSTRAINT fk_tipocontrato_plantillatipocontrato_idtipocontrato FOREIGN KEY (idtipocontrato) REFERENCES nom_tipocontrato(idtipocontrato) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_pedido
    ADD CONSTRAINT fk_tipoperiodo_pedido_idtipoperiodo FOREIGN KEY (idtipoperiodo) REFERENCES nom_tipoperiodo(idtipoperiodo) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY nom_periodo
    ADD CONSTRAINT fk_tipoperiodo_periodo_idtipoperiodo FOREIGN KEY (idtipoperiodo) REFERENCES nom_tipoperiodo(idtipoperiodo) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_procesodisponibilidad
    ADD CONSTRAINT fk_via_procesodisponibilidad_idvia FOREIGN KEY (idvia) REFERENCES nom_via(idvia);
--</Restrictions>

--<Dependents>
ALTER TABLE ONLY dat_reserva
    ADD CONSTRAINT fk_persona_reserva_idpersona FOREIGN KEY (idpersona) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_plantillatipocontrato
    ADD CONSTRAINT fk_plantilladoc_plantillatipocontrato_idplantilla FOREIGN KEY (idplantilla) REFERENCES mod_rrhhmaestro.dat_plantilladoc(idplantilladoc) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_disponible
    ADD CONSTRAINT fk_situacionlaboral_disponible_idsituacionlaboralp FOREIGN KEY (idsituacionlaboralp) REFERENCES mod_persona.dat_situacionlaboral(idsituacionlaboralp) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_interrupto
    ADD CONSTRAINT fk_situacionlaboral_interrupto_idsituacionlaboralp FOREIGN KEY (idsituacionlaboralp) REFERENCES mod_persona.dat_situacionlaboral(idsituacionlaboralp) ON UPDATE CASCADE ON DELETE CASCADE;
--</Dependents>