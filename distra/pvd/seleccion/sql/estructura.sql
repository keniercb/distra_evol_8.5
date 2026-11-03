-- Created By : ScriptSplitGenerador
-- Only Schema
SET statement_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE SCHEMA mod_seleccion;
COMMENT ON SCHEMA mod_seleccion IS 'Agrupa los datos del componente selección. Versión 2. (RRHH)';
CREATE SEQUENCE mod_seleccion.sec_compproceso_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_compproceso_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_compproceso".';
SET default_tablespace = '';
SET default_with_oids = false;
CREATE TABLE mod_seleccion.conf_compproceso (
    idcompproceso numeric(19,0) DEFAULT nextval('mod_seleccion.sec_compproceso_seq'::regclass) NOT NULL,
    idproceso numeric(19,0) NOT NULL,
    idestructura numeric(19,0) NOT NULL
);
COMMENT ON TABLE mod_seleccion.conf_compproceso IS 'Tabla que almacena la configuración para compartir el proceso de selección.';
COMMENT ON COLUMN mod_seleccion.conf_compproceso.idcompproceso IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_seleccion.conf_compproceso.idproceso IS 'Identificador del proceso de selección.';
COMMENT ON COLUMN mod_seleccion.conf_compproceso.idestructura IS 'Identificador de la estructura.';
CREATE SEQUENCE mod_seleccion.sec_comptecnica_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_comptecnica_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_comptecnica".';
CREATE TABLE mod_seleccion.conf_comptecnica (
    idcomptecnica numeric(19,0) DEFAULT nextval('mod_seleccion.sec_comptecnica_seq'::regclass) NOT NULL,
    idtecnica numeric(19,0) NOT NULL,
    idmodelo numeric(19,0) NOT NULL,
    idproceso numeric(19,0) NOT NULL
);
COMMENT ON TABLE mod_seleccion.conf_comptecnica IS 'Tabla que almacena la configuración para compartir los resultados de las técnicas por procesos de selección.';
COMMENT ON COLUMN mod_seleccion.conf_comptecnica.idcomptecnica IS 'Identificador de la relación entre la técnica y el proceso de selección.';
COMMENT ON COLUMN mod_seleccion.conf_comptecnica.idtecnica IS 'Identificador de la técnica de selección.';
COMMENT ON COLUMN mod_seleccion.conf_comptecnica.idmodelo IS 'Identificador del modelo de la tecnica por la cual se comparte los resultados.';
COMMENT ON COLUMN mod_seleccion.conf_comptecnica.idproceso IS 'Identificador del proceso de selección.';
CREATE SEQUENCE mod_seleccion.sec_tecnica_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_tecnica_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_tecnica".';
CREATE TABLE mod_seleccion.conf_tecnica (
    idtecnica numeric(19,0) DEFAULT nextval('mod_seleccion.sec_tecnica_seq'::regclass) NOT NULL,
    idplanilla numeric(19,0) NOT NULL
);
COMMENT ON TABLE mod_seleccion.conf_tecnica IS 'Almacena las planillas evaluativas que serán empleadas como técnicas de selección en los diferentes procesos.';
COMMENT ON COLUMN mod_seleccion.conf_tecnica.idtecnica IS 'Identificador de la técnica.';
COMMENT ON COLUMN mod_seleccion.conf_tecnica.idplanilla IS 'Identificador de la planilla evaluativa.';
CREATE SEQUENCE mod_seleccion.sec_candidato_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_candidato_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_candidato".';
CREATE TABLE mod_seleccion.dat_candidato (
    idcandidato numeric(19,0) DEFAULT nextval('mod_seleccion.sec_candidato_seq'::regclass) NOT NULL,
    idproceso numeric(19,0) NOT NULL,
    idpersona numeric(19,0) NOT NULL,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    idviareclutamiento numeric(19,0),
    observacion character varying,
    contratado numeric(1,0) DEFAULT 0 NOT NULL,
    idprocesoorigen numeric(19,0),
    idusuario numeric(19,0),
    numeroexpediente numeric(19,0)
);
COMMENT ON TABLE mod_seleccion.dat_candidato IS 'Almacena personas que son candidatos a los procesos.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.idcandidato IS 'Identificador del candidato.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.idproceso IS 'Identificador del proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.fdesde IS 'Fecha en que la persona inicia como candidato en el proceso.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.fhasta IS 'Fecha en que la persona deja de ser candidato del proceso.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.idviareclutamiento IS 'Identificador de la vía de reclutamiento.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.observacion IS 'Observaciones sobre el candidato detectadas durante el proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.contratado IS 'Determina si el candidato fue contratado o no: 1- contratado. 2- no contratado.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.idprocesoorigen IS 'Identificador del proceso origen en caso de provenir de otro proceso.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.idusuario IS 'Identificador del usuario que registra al candidato.';
COMMENT ON COLUMN mod_seleccion.dat_candidato.numeroexpediente IS 'Número del expediente.';
CREATE SEQUENCE mod_seleccion.sec_comitep_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_comitep_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_comite".';
CREATE TABLE mod_seleccion.dat_comite (
    idcomitep numeric(19,0) DEFAULT nextval('mod_seleccion.sec_comitep_seq'::regclass) NOT NULL,
    idcomite numeric(19,0) NOT NULL,
    estructura numeric(1,0) NOT NULL,
    idpersona numeric(19,0) NOT NULL
);
COMMENT ON TABLE mod_seleccion.dat_comite IS 'Almacena los datos del (los) comité de ingreso.';
COMMENT ON COLUMN mod_seleccion.dat_comite.idcomitep IS 'Identificador de los datos del comité.';
COMMENT ON COLUMN mod_seleccion.dat_comite.idcomite IS 'Identificador del comité. El valor que almecena es en dependencia del valor que toma el atributo (estructura), que determina si el comité es del nomenclador o de una estructura no formal.';
COMMENT ON COLUMN mod_seleccion.dat_comite.estructura IS 'Determina si la comisión está definida en el nomenclador o en estructura y composición. (0-> Nomenclador, 1-> Estructura).';
COMMENT ON COLUMN mod_seleccion.dat_comite.idpersona IS 'Identificador de la persona que integra la comisión.';
CREATE SEQUENCE mod_seleccion.sec_excluido_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_excluido_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_excluido".';
CREATE TABLE mod_seleccion.dat_excluido (
    idexcluido numeric(19,0) DEFAULT nextval('mod_seleccion.sec_excluido_seq'::regclass) NOT NULL,
    idcandidato numeric(19,0) NOT NULL,
    fexclusion date DEFAULT now() NOT NULL,
    idmotivoexclusion numeric(19,0),
    observexclusion character varying(500),
    freincorporacion date,
    idmotivoreincorporacion numeric(19,0),
    observreincorporacion character varying(500),
    tipo numeric(1,0) NOT NULL
);
COMMENT ON TABLE mod_seleccion.dat_excluido IS 'Tabla que almacena los datos relacionados con la exclusión de un candidato.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.idexcluido IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.idcandidato IS 'Identificador del candidato excluido.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.fexclusion IS 'Fecha de exclusión del candidato del proceso.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.idmotivoexclusion IS 'Identificador del motivo de exclusión del candidato del proceso.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.observexclusion IS 'Observación relacionada con la exclusión del candidato.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.freincorporacion IS 'Fecha en que se reincorpora el candidato al proceso.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.idmotivoreincorporacion IS 'Identificador del motivo de reincoporación del candidato al proceso.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.observreincorporacion IS 'Observación relacionada con la reincorporación del candidato al proceso.';
COMMENT ON COLUMN mod_seleccion.dat_excluido.tipo IS 'Determina el tipo de exclusión. 1->Excluido por el proceso, 2->Excluido por el usuario.';
CREATE SEQUENCE mod_seleccion.sec_indicadortecnica_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_indicadortecnica_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_indicadortecnica".';
CREATE TABLE mod_seleccion.dat_indicadortecnica (
    idindicadortecnica numeric(19,0) DEFAULT nextval('mod_seleccion.sec_indicadortecnica_seq'::regclass) NOT NULL,
    idresultadotecnica numeric(19,0) NOT NULL,
    idindicadorplanilla numeric(19,0) NOT NULL,
    resultado numeric(19,2),
    complemento character varying
);
COMMENT ON TABLE mod_seleccion.dat_indicadortecnica IS 'Almacena los resultados obtenidos en cada uno de los indicadores de la planilla evaluativa.';
COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.idindicadortecnica IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.idresultadotecnica IS 'Identificador del resultado de la técnica.';
COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.idindicadorplanilla IS 'Identificador del indicador de la planilla que responde a la técnica de selección.';
COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.resultado IS 'Resultado obtenido por el candidato en el indicador de la técnica (planilla).';
COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.complemento IS 'Complemento textual asociado al indicador.';
CREATE SEQUENCE mod_seleccion.sec_proceso_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_proceso_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_proceso".';
CREATE TABLE mod_seleccion.dat_proceso (
    idproceso numeric(19,0) DEFAULT nextval('mod_seleccion.sec_proceso_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    recurso numeric(19,0),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    idexpresion numeric(19,0),
    idestructura numeric(19,0) NOT NULL,
    contratar numeric(1,0) DEFAULT 2 NOT NULL,
    CONSTRAINT chk_contratar_proceso CHECK (((contratar = (1)::numeric) OR (contratar = (2)::numeric)))
);
COMMENT ON TABLE mod_seleccion.dat_proceso IS 'Almacena los datos básicos de un proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_proceso.idproceso IS 'Identificador del proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_proceso.denominacion IS 'Denominación del proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_proceso.recurso IS 'Determina la cantidad de recursos que se seleccionarán en el proceso.';
COMMENT ON COLUMN mod_seleccion.dat_proceso.fdesde IS 'Fecha en que inicia el proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_proceso.fhasta IS 'Fecha en que concluye el proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_proceso.idexpresion IS 'Identificador de la expersión matemática asociada al modelo de selección para el proceso.';
COMMENT ON COLUMN mod_seleccion.dat_proceso.idestructura IS 'Identificador de la estructura.';
COMMENT ON COLUMN mod_seleccion.dat_proceso.contratar IS 'Indicador de contratación. 1- Verdadero, 2- Falso.';
COMMENT ON CONSTRAINT chk_contratar_proceso ON mod_seleccion.dat_proceso IS 'Restricción sobre la(s) columna(s) "contratar".';
CREATE SEQUENCE mod_seleccion.sec_procesocargo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_procesocargo_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_procesocargo".';
CREATE TABLE mod_seleccion.dat_procesocargo (
    idprocesocargo numeric(19,0) DEFAULT nextval('mod_seleccion.sec_procesocargo_seq'::regclass) NOT NULL,
    idproceso numeric(19,0) NOT NULL,
    idcargo numeric(19,0) NOT NULL,
    homologo numeric(1,0)
);
COMMENT ON TABLE mod_seleccion.dat_procesocargo IS 'Almacena los cargos a los que responde el proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesocargo.idprocesocargo IS 'Identificador de la relación entre el proceso y el cargo.';
COMMENT ON COLUMN mod_seleccion.dat_procesocargo.idproceso IS 'Identificador del proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesocargo.idcargo IS 'Identificador del cargo.';
COMMENT ON COLUMN mod_seleccion.dat_procesocargo.homologo IS 'Determina si el cargo es de la homologación o de estructura (plantilla). 0-> EyC 1-> Homologación.';
CREATE SEQUENCE mod_seleccion.sec_procesocomite_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_procesocomite_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_procesocomite".';
CREATE TABLE mod_seleccion.dat_procesocomite (
    idprocesocomite numeric(19,0) DEFAULT nextval('mod_seleccion.sec_procesocomite_seq'::regclass) NOT NULL,
    idproceso numeric(19,0) NOT NULL,
    idcomision numeric(19,0) NOT NULL
);
COMMENT ON TABLE mod_seleccion.dat_procesocomite IS 'Almacena los comité de ingreso asociados a los procesos de selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesocomite.idprocesocomite IS 'Identificador de la relación entre el proceso y el comité de ingreso.';
COMMENT ON COLUMN mod_seleccion.dat_procesocomite.idproceso IS 'Identificador del proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesocomite.idcomision IS 'Identificador de la comisión.';
CREATE SEQUENCE mod_seleccion.sec_procesotecnica_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_procesotecnica_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_procesotecnica".';
CREATE TABLE mod_seleccion.dat_procesotecnica (
    idprocesotecnica numeric(19,0) DEFAULT nextval('mod_seleccion.sec_procesotecnica_seq'::regclass) NOT NULL,
    idproceso numeric(19,0) NOT NULL,
    idtecnica numeric(19,0) NOT NULL,
    idmodelo numeric(19,0),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    hito numeric(19,0) NOT NULL,
    condicion character varying(5),
    valor numeric(19,0),
    orden numeric(19,0),
    validez numeric(19,0),
    unidadtiempo numeric(19,0) DEFAULT 0
);
COMMENT ON TABLE mod_seleccion.dat_procesotecnica IS 'Almacena datos de las técnicas por proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idprocesotecnica IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idproceso IS 'Identificador del proceso de selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idtecnica IS 'Identificador de la técnica de selección (planilla evaluativa).';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idmodelo IS 'Identificador del modelo de la planilla evaluativa que responde a la técnica.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.fdesde IS 'Fecha en que inicia la vigencia de la técnica de selección en el proceso.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.fhasta IS 'Fecha en que concluye la vigencia de la técnica de selección en el proceso.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.hito IS 'Determina si la técnica en el proceso constituye un hito para la selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.condicion IS 'Condición por la que se comparará el valor del modelo con el resultado de la técnica.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.valor IS 'Valor que se emplerá para comparar con el resultado de la técnica de selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.orden IS 'Orden en que se deben aplicar las técnicas de selección. En caso de que tome valor nulo, no se tiene en cuenta ningún orden para ser aplicadas las mismas.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.validez IS 'Tiempo de validez del resultado de la técnica de selección.';
COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.unidadtiempo IS 'Almacena la unidad de tiempo del período de validez.
1-día. 2-mes. 3-año.';
CREATE SEQUENCE mod_seleccion.sec_responsable_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_responsable_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_responsable".';
CREATE TABLE mod_seleccion.dat_responsable (
    idresponsable numeric(19,0) DEFAULT nextval('mod_seleccion.sec_responsable_seq'::regclass) NOT NULL,
    idprocesotecnica numeric(19,0) NOT NULL,
    idcomisionpersona numeric(19,0) NOT NULL
);
COMMENT ON TABLE mod_seleccion.dat_responsable IS 'Almacena los datos de los responsables de las técnicas por procesos.';
COMMENT ON COLUMN mod_seleccion.dat_responsable.idresponsable IS 'Identificador del responsable de la técnica.';
COMMENT ON COLUMN mod_seleccion.dat_responsable.idprocesotecnica IS 'Identificador del proceso asociado a la técnica.';
COMMENT ON COLUMN mod_seleccion.dat_responsable.idcomisionpersona IS 'Identificador de la persona del comité de ingreso.';
CREATE SEQUENCE mod_seleccion.sec_resultadoseleccion_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_resultadoseleccion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_resultadoseleccion".';
CREATE TABLE mod_seleccion.dat_resultadoseleccion (
    idresultadoseleccion numeric(19,0) DEFAULT nextval('mod_seleccion.sec_resultadoseleccion_seq'::regclass) NOT NULL,
    idcandidato numeric(19,0) NOT NULL,
    faplicacion date DEFAULT now() NOT NULL,
    fseleccion date,
    seleccion numeric(1,0) DEFAULT 0 NOT NULL,
    ubicacion numeric(19,0),
    idusuario numeric(19,0)
);
COMMENT ON TABLE mod_seleccion.dat_resultadoseleccion IS 'Almacena los resultados de la selección de los candidatos por procesos.';
COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.idresultadoseleccion IS 'Identificador del resultado de la selección en el proceso.';
COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.idcandidato IS 'Identificador del candidato.';
COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.faplicacion IS 'Fecha en que se aplica el modelo matemático para el proceso.';
COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.fseleccion IS 'Fecha en que se selecciona el candidato.';
COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.seleccion IS 'Estado que se encuentra la persona en el proceso. 0-> Preseleccionado. 1-> Seleccionado. 2-> Excluido.';
COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.ubicacion IS 'Identificador de la estructura en la que se ubica el candidato seleccionado inicialmente.';
COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.idusuario IS 'Identificador del usuario que preselecciona o selecciona.';
CREATE SEQUENCE mod_seleccion.sec_resultadotecnica_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_resultadotecnica_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_resultadotecnica".';
CREATE TABLE mod_seleccion.dat_resultadotecnica (
    idresultadotecnica numeric(19,0) DEFAULT nextval('mod_seleccion.sec_resultadotecnica_seq'::regclass) NOT NULL,
    idprocesotecnica numeric(19,0) NOT NULL,
    idcandidato numeric(19,0) NOT NULL,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    resultado numeric(19,0),
    idusuario numeric(19,0)
);
COMMENT ON TABLE mod_seleccion.dat_resultadotecnica IS 'Almacena los resultados alcanzados por los candidatos en las diferentes técnicas.';
COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idresultadotecnica IS 'Identificador del resultado obtenido por el candidato en la técnica.';
COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idprocesotecnica IS 'Identificador del proceso asociado a la técnica.';
COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idcandidato IS 'Identificador del candidato.';
COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.fdesde IS 'Fecha en que se inicia la aplicación de la técnica de selección.';
COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.fhasta IS 'Fecha en que concluye la aplicación de la técnica.';
COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.resultado IS 'Valor del resultado de la técnica de selección.';
COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idusuario IS 'Identificador del usuario que evalúa la técnica.';
CREATE SEQUENCE mod_seleccion.sec_seguimiento_seq
    START WITH 22
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_seguimiento_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_seguimiento".';
CREATE TABLE mod_seleccion.dat_seguimiento (
    idseguimiento numeric(19,0) DEFAULT nextval('mod_seleccion.sec_seguimiento_seq'::regclass) NOT NULL,
    idcandidato numeric(19,0) NOT NULL,
    idmotivoseguimiento numeric(19,0) NOT NULL,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date
);
COMMENT ON TABLE mod_seleccion.dat_seguimiento IS 'Almacena los datos referentes al seguimiento de candidatos.';
COMMENT ON COLUMN mod_seleccion.dat_seguimiento.idseguimiento IS 'Almacena el identificador de la tabla.';
COMMENT ON COLUMN mod_seleccion.dat_seguimiento.idcandidato IS 'Almacena el identificador del candidato que se le esta dando seguimiento.';
COMMENT ON COLUMN mod_seleccion.dat_seguimiento.idmotivoseguimiento IS 'Almacena el identificador del motivo de seguimiento.';
COMMENT ON COLUMN mod_seleccion.dat_seguimiento.fdesde IS 'Almacena la fecha de inicio del seguimiento.';
COMMENT ON COLUMN mod_seleccion.dat_seguimiento.fhasta IS 'Almacena la fecha de fin del seguimiento.';
CREATE SEQUENCE mod_seleccion.sec_comite_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_comite_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_comite".';
CREATE TABLE mod_seleccion.nom_comite (
    idcomite numeric(19,0) DEFAULT nextval('mod_seleccion.sec_comite_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date
);
COMMENT ON TABLE mod_seleccion.nom_comite IS 'Almacena los comités de ingreso en caso de que no se empleen estructuras no formales.';
COMMENT ON COLUMN mod_seleccion.nom_comite.idcomite IS 'Identificador del comité de ingreso.';
COMMENT ON COLUMN mod_seleccion.nom_comite.denominacion IS 'Denominación de la comité de ingreso.';
COMMENT ON COLUMN mod_seleccion.nom_comite.descripcion IS 'Descripción de la comisión de selección.';
COMMENT ON COLUMN mod_seleccion.nom_comite.fdesde IS 'Fecha en que inicia la vigencia de la comisión de selección.';
COMMENT ON COLUMN mod_seleccion.nom_comite.fhasta IS 'Fecha en que concluye la vigencia de la comisión de selección.';
CREATE SEQUENCE mod_seleccion.sec_motivoexclusion_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_motivoexclusion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoexclusion".';
CREATE TABLE mod_seleccion.nom_motivoexclusion (
    idmotivoexclusion numeric(19,0) DEFAULT nextval('mod_seleccion.sec_motivoexclusion_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE mod_seleccion.nom_motivoexclusion IS 'Almacena los motivos de exclusión.';
COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.idmotivoexclusion IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.denominacion IS 'Denominación del motivo de exclusión.';
COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.descripcion IS 'Descripción del motivo de exclusión.';
COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.fdesde IS 'Fecha de entrada en vigor el valor nomenclado para el motivo de exclusión.';
COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.fhasta IS 'Fecha en la que concluye la vigencia del valor nomenclado para el motivo de exclusión.';
COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE mod_seleccion.sec_motivoreicorporacion_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_motivoreicorporacion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoreicorporacion".';
CREATE TABLE mod_seleccion.nom_motivoreicorporacion (
    idmotivoreicorporacion numeric(19,0) DEFAULT nextval('mod_seleccion.sec_motivoreicorporacion_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(255),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE mod_seleccion.nom_motivoreicorporacion IS 'Almacena los motivos de re-incorporación.';
COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.idmotivoreicorporacion IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.denominacion IS 'Denominación del motivo de re-incorporación.';
COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.descripcion IS 'Descipción del motivo de re-incorporación.';
COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.fdesde IS 'Fecha de entrada en vigor el valor nomenclado para el motivo de re-incorporación.';
COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.fhasta IS 'Fecha en la que concluye la vigencia del valor nomenclado para el motivo de re-incorporación.';
COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE mod_seleccion.sec_motivoseguimiento_seq
    START WITH 8
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_motivoseguimiento_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoseguimiento".';
CREATE TABLE mod_seleccion.nom_motivoseguimiento (
    idmotivoseguimiento numeric DEFAULT nextval('mod_seleccion.sec_motivoseguimiento_seq'::regclass) NOT NULL,
    denominacion character varying NOT NULL,
    descripcion character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE mod_seleccion.nom_motivoseguimiento IS 'Almacena los motivos de seguimiento de los candidatos.';
COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.idmotivoseguimiento IS 'Identificador del motivo de seguimiento.';
COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.denominacion IS 'Denominación del motivo de seguimiento';
COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.descripcion IS 'Descripción del motivo de seguimiento.';
COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.fdesde IS 'Fecha en que inicia la vigencia del motivo de seguimiento.';
COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.fhasta IS 'Fecha en que concluye la vigencia del motivo de seguimiento.';
COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';
CREATE SEQUENCE mod_seleccion.sec_viareclutamiento_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE mod_seleccion.sec_viareclutamiento_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_viareclutamiento".';
CREATE TABLE mod_seleccion.nom_viareclutamiento (
    idviareclutamiento numeric DEFAULT nextval('mod_seleccion.sec_viareclutamiento_seq'::regclass) NOT NULL,
    denominacion character varying NOT NULL,
    descripcion character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE mod_seleccion.nom_viareclutamiento IS 'Almacena las vías de reclutamiento de los candidatos.';
COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.idviareclutamiento IS 'Identificador de la vía de reclutamiento.';
COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.denominacion IS 'Denominación de la vía de reclutamiento.';
COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.descripcion IS 'Descripción de la vía de reclutamiento.';
COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.fdesde IS 'Fecha en que inicia la vigencia de la vía de reclutamiento.';
COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.fhasta IS 'Fecha en que concluye la vigencia de la vía de reclutamiento.';
COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.gestion IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';