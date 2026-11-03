CREATE SEQUENCE mod_seleccion.sec_candidato_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_candidato_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_candidato".';

CREATE SEQUENCE mod_seleccion.sec_comite_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_comite_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_comite".';

CREATE SEQUENCE mod_seleccion.sec_comitep_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_comitep_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_comite".';

CREATE SEQUENCE mod_seleccion.sec_compproceso_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_compproceso_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_compproceso".';

CREATE SEQUENCE mod_seleccion.sec_comptecnica_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_comptecnica_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_comptecnica".';

CREATE SEQUENCE mod_seleccion.sec_excluido_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_excluido_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_excluido".';

CREATE SEQUENCE mod_seleccion.sec_indicadortecnica_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_indicadortecnica_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_indicadortecnica".';

CREATE SEQUENCE mod_seleccion.sec_motivoexclusion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_motivoexclusion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoexclusion".';

CREATE SEQUENCE mod_seleccion.sec_motivoreicorporacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_motivoreicorporacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoreicorporacion".';

CREATE SEQUENCE mod_seleccion.sec_motivoseguimiento_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 8
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_motivoseguimiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoseguimiento".';

CREATE SEQUENCE mod_seleccion.sec_proceso_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_proceso_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_proceso".';

CREATE SEQUENCE mod_seleccion.sec_procesocargo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_procesocargo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_procesocargo".';

CREATE SEQUENCE mod_seleccion.sec_procesocomite_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_procesocomite_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_procesocomite".';

CREATE SEQUENCE mod_seleccion.sec_procesotecnica_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_procesotecnica_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_procesotecnica".';

CREATE SEQUENCE mod_seleccion.sec_responsable_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_responsable_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_responsable".';

CREATE SEQUENCE mod_seleccion.sec_resultadoseleccion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_resultadoseleccion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_resultadoseleccion".';

CREATE SEQUENCE mod_seleccion.sec_resultadotecnica_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_resultadotecnica_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_resultadotecnica".';

CREATE SEQUENCE mod_seleccion.sec_seguimiento_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 22
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_seguimiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_seguimiento".';

CREATE SEQUENCE mod_seleccion.sec_tecnica_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_tecnica_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_tecnica".';

CREATE SEQUENCE mod_seleccion.sec_viareclutamiento_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_viareclutamiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_viareclutamiento".';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  DROP CONSTRAINT pk_resultadoseleccion RESTRICT;

COMMENT ON SCHEMA mod_seleccion
IS 'Agrupa los datos del componente selección. Versión 2. (RRHH)';

CREATE TABLE mod_seleccion.nom_comite (
  idcomite NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_comite_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  CONSTRAINT pk_comision PRIMARY KEY(idcomite),
  CONSTRAINT uk_comite_denominacion UNIQUE(denominacion)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.nom_comite
IS 'Almacena los comités de ingreso en caso de que no se empleen estructuras no formales.';

COMMENT ON COLUMN mod_seleccion.nom_comite.idcomite
IS 'Identificador del comité de ingreso.';

COMMENT ON COLUMN mod_seleccion.nom_comite.denominacion
IS 'Denominación de la comité de ingreso.';

COMMENT ON COLUMN mod_seleccion.nom_comite.descripcion
IS 'Descripción de la comisión de selección.';

COMMENT ON COLUMN mod_seleccion.nom_comite.fdesde
IS 'Fecha en que inicia la vigencia de la comisión de selección.';

COMMENT ON COLUMN mod_seleccion.nom_comite.fhasta
IS 'Fecha en que concluye la vigencia de la comisión de selección.';

CREATE TABLE mod_seleccion.dat_comite (
  idcomitep NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_comitep_seq'::regclass) NOT NULL,
  idcomite NUMERIC(19,0) NOT NULL,
  estructura NUMERIC(1,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_pcomision PRIMARY KEY(idcomitep),
  CONSTRAINT uk_dcomite_idcomite_estructura_idpersona UNIQUE(idcomite, estructura, idpersona)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_comite
IS 'Almacena los datos de los comités de ingreso.';

COMMENT ON COLUMN mod_seleccion.dat_comite.idcomitep
IS 'Identificador de los datos del comité.';

COMMENT ON COLUMN mod_seleccion.dat_comite.idcomite
IS 'Identificador del comité. El valor que almecena es en dependencia del valor que toma el atributo "estructura", que determina si el comité es del nomenclador o de una estructura no formal.';

COMMENT ON COLUMN mod_seleccion.dat_comite.estructura
IS 'Determina si la comisión está definida en el nomenclador o en estructura y composición. (0-> Nomenclador, 1-> Estructura)';

COMMENT ON COLUMN mod_seleccion.dat_comite.idpersona
IS 'Identificador de la persona que integra la comisión.';

CREATE TABLE mod_seleccion.nom_motivoexclusion (
  idmotivoexclusion NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_motivoexclusion_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT nom_motivoexclusion_pkey PRIMARY KEY(idmotivoexclusion)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.idmotivoexclusion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.denominacion
IS 'Denominación del motivo de exclusión.';

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.descripcion
IS 'Descripción del motivo de exclusión.';

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_seleccion.nom_motivoreicorporacion (
  idmotivoreicorporacion NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_motivoreicorporacion_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT nom_motivoreicorporacion_pkey PRIMARY KEY(idmotivoreicorporacion)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_seleccion.nom_motivoseguimiento (
  idmotivoseguimiento NUMERIC DEFAULT nextval('mod_seleccion.sec_motivoseguimiento_seq'::regclass) NOT NULL,
  denominacion VARCHAR NOT NULL,
  descripcion VARCHAR,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT nom_motivoseguimiento_pkey PRIMARY KEY(idmotivoseguimiento)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.nom_motivoseguimiento
IS 'Almacena los motivos de seguimiento de los candidatos.';

COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.idmotivoseguimiento
IS 'Identificador del motivo de seguimiento.';

COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.denominacion
IS 'Denominación del motivo de seguimiento';

COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.descripcion
IS 'Descripción del motivo de seguimiento.';

COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.fdesde
IS 'Fecha en que inicia la vigencia del motivo de seguimiento.';

COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.fhasta
IS 'Fecha en que concluye la vigencia del motivo de seguimiento.';

COMMENT ON COLUMN mod_seleccion.nom_motivoseguimiento.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_seleccion.dat_proceso (
  idproceso NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_proceso_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  recurso NUMERIC(19,0),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idexpresion NUMERIC(19,0),
  idestructura NUMERIC(19,0) NOT NULL,
  contratar NUMERIC(1,0) DEFAULT 2 NOT NULL,
  CONSTRAINT pk_proceso PRIMARY KEY(idproceso),
  CONSTRAINT uk_proceso_denominacion UNIQUE(denominacion),
  CONSTRAINT chk_contratar_proceso CHECK ((contratar = (1)::numeric) OR (contratar = (2)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_proceso
IS 'Almacena los datos básicos de un proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_proceso.idproceso
IS 'Identificador del proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_proceso.denominacion
IS 'Denominación del proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_proceso.recurso
IS 'Determina la cantidad de recursos que se seleccionarán en el proceso.';

COMMENT ON COLUMN mod_seleccion.dat_proceso.fdesde
IS 'Fecha en que inicia el proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_proceso.fhasta
IS 'Fecha en que concluye el proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_proceso.idexpresion
IS 'Identificador de la expersión matemática asociada al modelo de selección para el proceso.';

COMMENT ON COLUMN mod_seleccion.dat_proceso.idestructura
IS 'Identificador de la estructura.';

COMMENT ON COLUMN mod_seleccion.dat_proceso.contratar
IS 'Indicador de contratación. 1- Verdadero, 2- Falso.';

COMMENT ON CONSTRAINT chk_contratar_proceso ON mod_seleccion.dat_proceso
IS 'Restricción sobre la(s) columna(s) "contratar".';

CREATE TABLE mod_seleccion.conf_tecnica (
  idtecnica NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_tecnica_seq'::regclass) NOT NULL,
  idplanilla NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_tecnica_pkey PRIMARY KEY(idtecnica),
  CONSTRAINT uk_tecnica_idplanilla UNIQUE(idplanilla)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.conf_tecnica
IS 'Almacena las planillas evaluativas que serán empleadas como técnicas de selección en los diferentes procesos.';

COMMENT ON COLUMN mod_seleccion.conf_tecnica.idtecnica
IS 'Identificador de la técnica.';

COMMENT ON COLUMN mod_seleccion.conf_tecnica.idplanilla
IS 'Identificador de la planilla evaluativa.';

CREATE TABLE mod_seleccion.nom_viareclutamiento (
  idviareclutamiento NUMERIC DEFAULT nextval('mod_seleccion.sec_viareclutamiento_seq'::regclass) NOT NULL,
  denominacion VARCHAR NOT NULL,
  descripcion VARCHAR,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT nom_viareclutamiento_pkey PRIMARY KEY(idviareclutamiento)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.nom_viareclutamiento
IS 'Almacena las vías de reclutamiento de los candidatos.';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.idviareclutamiento
IS 'Identificador de la vía de reclutamiento.';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.denominacion
IS 'Denominación de la vía de reclutamiento';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.descripcion
IS 'Descripción de la vía de reclutamiento.';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.fdesde
IS 'Fecha en que inicia la vigencia de la vía de reclutamiento.';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.fhasta
IS 'Fecha en que concluye la vigencia de la vía de reclutamiento.';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

CREATE TABLE mod_seleccion.dat_excluido (
  idexcluido NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_excluido_seq'::regclass) NOT NULL,
  idcandidato NUMERIC(19,0) NOT NULL,
  fexclusion DATE DEFAULT now() NOT NULL,
  idmotivoexclusion NUMERIC(19,0),
  observexclusion VARCHAR(500),
  freincorporacion DATE,
  idmotivoreincorporacion NUMERIC(19,0),
  observreincorporacion VARCHAR(500),
  tipo NUMERIC(1,0) NOT NULL,
  CONSTRAINT dat_excluido_pkey PRIMARY KEY(idexcluido)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_excluido
IS 'Tabla que almacena los datos relacionados con la exclusión de un candidato.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.idexcluido
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.idcandidato
IS 'Identificador del candidato excluido.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.fexclusion
IS 'Fecha de exclusión del candidato del proceso.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.idmotivoexclusion
IS 'Identificador del motivo de exclusión del candidato del proceso.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.observexclusion
IS 'Observación relacionada con la exclusión del candidato.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.freincorporacion
IS 'Fecha en que se reincorpora el candidato al proceso.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.idmotivoreincorporacion
IS 'Identificador del motivo de reincoporación del candidato al proceso.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.observreincorporacion
IS 'Observación relacionada con la reincorporación del candidato al proceso.';

COMMENT ON COLUMN mod_seleccion.dat_excluido.tipo
IS 'Determina el tipo de exclusión. 1->Excluido por el proceso, 2->Excluido por el usuario.';

CREATE INDEX fki_motivoexclusion_exclusion_idmotivoexclusion ON mod_seleccion.dat_excluido
  USING btree (idmotivoexclusion);

CREATE TABLE mod_seleccion.conf_compproceso (
  idcompproceso NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_compproceso_seq'::regclass) NOT NULL,
  idproceso NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_compproceso_idcompproceso PRIMARY KEY(idcompproceso)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.conf_compproceso
IS 'Tabla que almacena la configuración para compartir el proceso de selección.';

COMMENT ON COLUMN mod_seleccion.conf_compproceso.idcompproceso
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_seleccion.conf_compproceso.idproceso
IS 'Identificador del proceso de selección.';

COMMENT ON COLUMN mod_seleccion.conf_compproceso.idestructura
IS 'Identificador de la estructura.';

CREATE TABLE mod_seleccion.dat_procesocargo (
  idprocesocargo NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_procesocargo_seq'::regclass) NOT NULL,
  idproceso NUMERIC(19,0) NOT NULL,
  idcargo NUMERIC(19,0) NOT NULL,
  homologo NUMERIC(1,0),
  CONSTRAINT pk_procesocargo PRIMARY KEY(idprocesocargo),
  CONSTRAINT uk_procesocargo_idproceso_idcargo_homologo UNIQUE(idproceso, idcargo, homologo)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_procesocargo
IS 'Almacena los cargos a los que responde el proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesocargo.idprocesocargo
IS 'Identificador de la relación entre el proceso y el cargo.';

COMMENT ON COLUMN mod_seleccion.dat_procesocargo.idproceso
IS 'Identificador del proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesocargo.idcargo
IS 'Identificador del cargo.';

COMMENT ON COLUMN mod_seleccion.dat_procesocargo.homologo
IS 'Determina si el cargo es de la homologación o de estructura(plantilla). 0-> EyC 1-> Homologación.';

CREATE TABLE mod_seleccion.dat_procesocomite (
  idprocesocomite NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_procesocomite_seq'::regclass) NOT NULL,
  idproceso NUMERIC(19,0) NOT NULL,
  idcomision NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_procesocomite PRIMARY KEY(idprocesocomite)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_procesocomite
IS 'Almacena los comité de ingreso asociados a los procesos de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesocomite.idprocesocomite
IS 'Identificador de la relación entre el proceso y el comité de ingreso.';

COMMENT ON COLUMN mod_seleccion.dat_procesocomite.idproceso
IS 'Identificador del proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesocomite.idcomision
IS 'Identificador de la comisión.';

CREATE TABLE mod_seleccion.conf_comptecnica (
  idcomptecnica NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_comptecnica_seq'::regclass) NOT NULL,
  idtecnica NUMERIC(19,0) NOT NULL,
  idmodelo NUMERIC(19,0) NOT NULL,
  idproceso NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_comptecnica_idcomptecnica PRIMARY KEY(idcomptecnica),
  CONSTRAINT uk_comptecnica_idtecnica_idproceso UNIQUE(idtecnica, idproceso)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.conf_comptecnica
IS 'Tabla que almacena la configuración para compartir los resultados de las técnicas por procesos de selección.';

COMMENT ON COLUMN mod_seleccion.conf_comptecnica.idcomptecnica
IS 'Identificador de la relación entre la técnica y el proceso de selección.';

COMMENT ON COLUMN mod_seleccion.conf_comptecnica.idtecnica
IS 'Identificador de la técnica de selección.';

COMMENT ON COLUMN mod_seleccion.conf_comptecnica.idmodelo
IS 'Identificador del modelo de la tecnica por la cual se comparte los resultados.';

COMMENT ON COLUMN mod_seleccion.conf_comptecnica.idproceso
IS 'Identificador del proceso de selección.';

CREATE TABLE mod_seleccion.dat_procesotecnica (
  idprocesotecnica NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_procesotecnica_seq'::regclass) NOT NULL,
  idproceso NUMERIC(19,0) NOT NULL,
  idtecnica NUMERIC(19,0) NOT NULL,
  idmodelo NUMERIC(19,0),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  hito NUMERIC(19,0) NOT NULL,
  condicion VARCHAR(5),
  valor NUMERIC(19,0),
  orden NUMERIC(19,0),
  validez NUMERIC(19,0),
  unidadtiempo NUMERIC(19,0) DEFAULT 0,
  CONSTRAINT dat_procesotecnica_pkey PRIMARY KEY(idprocesotecnica)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_procesotecnica
IS 'Almacena datos de las técnicas por proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idprocesotecnica
IS 'Identificador de la relación entre el proceso de selección y la técnica de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idproceso
IS 'Identificador del proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idtecnica
IS 'Identificador de la técnica de selección (Planilla evaluativa).';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idmodelo
IS 'Identificador del modelo de la planilla evaluativa que responde a la técnica.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.fdesde
IS 'Fecha en que inicia la vigencia de la técnica de selección en el proceso.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.fhasta
IS 'Fecha en que concluye la vigencia de la técnica de selección en el proceso.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.hito
IS 'Determina si la tecnica en el proceso constituye un hito para la selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.condicion
IS 'Condición por la que se comparará el valor del modelo con el resultado de la técnica.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.valor
IS 'Valor que se emplerá para comparar con el resultado de la técnica de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.orden
IS 'Orden en que se deben aplicar las técnicas de selección. En caso de que tome valor nulo, no se tiene en cuenta ningÃºn orden para ser aplicadas las mismas.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.validez
IS 'Tiempo de validez del resultado de la técnica de selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.unidadtiempo
IS 'Almacena la unidad de tiempo del período de validez.
1-día
2-mes
3-año';

CREATE INDEX fki_k ON mod_seleccion.dat_procesotecnica
  USING btree (idtecnica);

CREATE TABLE mod_seleccion.dat_candidato (
  idcandidato NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_candidato_seq'::regclass) NOT NULL,
  idproceso NUMERIC(19,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idviareclutamiento NUMERIC(19,0),
  observacion VARCHAR,
  contratado NUMERIC(1,0) DEFAULT 0 NOT NULL,
  idprocesoorigen NUMERIC(19,0),
  idusuario NUMERIC(19,0),
  numeroexpediente NUMERIC(19,0),
  CONSTRAINT pk_idcandidato PRIMARY KEY(idcandidato)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_candidato
IS 'Almacena personas que son cadidatos a los procesos.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.idcandidato
IS 'Identificador del candidato.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.idproceso
IS 'Identificador del proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.fdesde
IS 'Fecha en que la persona inicia como candidato en el proceso.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.fhasta
IS 'Fecha en que la persona deja de ser candidato del proceso.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.idviareclutamiento
IS 'Identificador de la vía de reclutamiento.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.observacion
IS 'Observaciones sobre el candidato detectadas durante el proceso de selección.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.contratado
IS 'Determina si el candidato fue contratado o no:
 1- contratado
 2- no contratado';

COMMENT ON COLUMN mod_seleccion.dat_candidato.idprocesoorigen
IS 'Identificador del proceso origen en caso de provenir de otro proceso.';

COMMENT ON COLUMN mod_seleccion.dat_candidato.idusuario
IS 'Identificador del usuario que registra al candidato';

CREATE TABLE mod_seleccion.dat_responsable (
  idresponsable NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_responsable_seq'::regclass) NOT NULL,
  idprocesotecnica NUMERIC(19,0) NOT NULL,
  idcomisionpersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_responsable PRIMARY KEY(idresponsable),
  CONSTRAINT uk_responsable_idprocesotecnica_idcomitep UNIQUE(idprocesotecnica, idcomisionpersona)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_responsable
IS 'Almacena los datos de los responsables de las técnicas por procesos.';

COMMENT ON COLUMN mod_seleccion.dat_responsable.idresponsable
IS 'Identificador del responsable de la técnica';

COMMENT ON COLUMN mod_seleccion.dat_responsable.idprocesotecnica
IS 'Identificador de la relación Proceso-Técnica.';

COMMENT ON COLUMN mod_seleccion.dat_responsable.idcomisionpersona
IS 'Identificador de la persona del comité de ingreso.';

COMMENT ON TABLE mod_seleccion.dat_resultadoseleccion
IS 'Almacena los resultados de la selección de los candidatos por procesos.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD COLUMN idresultadoseleccion NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_resultadoseleccion_seq'::regclass) NOT NULL;

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.idresultadoseleccion
IS 'Identificador del resultado de la selección en el proceso.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD COLUMN idcandidato NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.idcandidato
IS 'Identificador del candidato.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD COLUMN faplicacion DATE DEFAULT now() NOT NULL;

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.faplicacion
IS 'Fecha en que se aplica el modelo matemático para el proceso.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD COLUMN fseleccion DATE;

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.fseleccion
IS 'Fecha en que se selecciona el candidato.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD COLUMN seleccion NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.seleccion
IS 'Estado que se encuentra la persona en el proceso. 0-> Preseleccionado 1-> Seleccionado 2-> Excluido';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD COLUMN ubicacion NUMERIC(19,0);

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.ubicacion
IS 'Identificador de la estructura en la que se ubica el candidato seleccionado inicialmente.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD COLUMN idusuario NUMERIC(19,0);

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.idusuario
IS 'Identificador del usuario que preselecciona o selecciona.';

CREATE TABLE mod_seleccion.dat_resultadotecnica (
  idresultadotecnica NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_resultadotecnica_seq'::regclass) NOT NULL,
  idprocesotecnica NUMERIC(19,0) NOT NULL,
  idcandidato NUMERIC(19,0) NOT NULL,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  resultado NUMERIC(19,0),
  idusuario NUMERIC(19,0),
  CONSTRAINT pk_resultadotecnica PRIMARY KEY(idresultadotecnica),
  CONSTRAINT uk_resultadotecnica_ UNIQUE(idprocesotecnica, idcandidato, fdesde)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_resultadotecnica
IS 'Almacena los resultados alcanzados por los candidatos en las diferentes técnicas.';

COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idresultadotecnica
IS 'Identificador del resultado obtenido por el candidato en la técnica.';

COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idprocesotecnica
IS 'Identificador de la relación Proceso-Técnica';

COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idcandidato
IS 'Identificador del candidato.';

COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.fdesde
IS 'Fecha en que se inicia la aplicación de la técnica de selección.';

COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.fhasta
IS 'Fecha en que concluye la aplicación de la técnica.';

COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.resultado
IS 'Valor del resultado de la técnica de selección.';

COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idusuario
IS 'Identificador del usuario que evalúa la técnica.';

CREATE TABLE mod_seleccion.dat_seguimiento (
  idseguimiento NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_seguimiento_seq'::regclass) NOT NULL,
  idcandidato NUMERIC(19,0) NOT NULL,
  idmotivoseguimiento NUMERIC(19,0) NOT NULL,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  CONSTRAINT pk_seguimiento PRIMARY KEY(idseguimiento)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_seguimiento
IS 'Almacena los datos referentes al seguimiento de candidatos.';

COMMENT ON COLUMN mod_seleccion.dat_seguimiento.idseguimiento
IS 'Almacena el identificadorde la tabla.';

COMMENT ON COLUMN mod_seleccion.dat_seguimiento.idcandidato
IS 'Almacena el identificador del candidato que se le esta dando seguimiento.';

COMMENT ON COLUMN mod_seleccion.dat_seguimiento.idmotivoseguimiento
IS 'Almacena el identificador del motivo de seguimiento.';

COMMENT ON COLUMN mod_seleccion.dat_seguimiento.fdesde
IS 'Almacena la fecha de inicio del seguimiento.';

COMMENT ON COLUMN mod_seleccion.dat_seguimiento.fhasta
IS 'Almacena la fecha de fin del seguimiento.';

CREATE INDEX fki_candidato_seguimiento_idcandidato ON mod_seleccion.dat_seguimiento
  USING btree (idcandidato);

CREATE TABLE mod_seleccion.dat_indicadortecnica (
  idindicadortecnica NUMERIC(19,0) DEFAULT nextval('mod_seleccion.sec_indicadortecnica_seq'::regclass) NOT NULL,
  idresultadotecnica NUMERIC(19,0) NOT NULL,
  idindicadorplanilla NUMERIC(19,0) NOT NULL,
  resultado NUMERIC(19,2),
  complemento VARCHAR,
  CONSTRAINT dat_indicadortecnica_pkey PRIMARY KEY(idindicadortecnica)
) 
WITH (oids = false);

COMMENT ON TABLE mod_seleccion.dat_indicadortecnica
IS 'Almacena los resultados obtenidos en cada uno de los indicadores de la planilla evaluativa.';

COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.idindicadortecnica
IS 'Identificador de la relación Proceso-Técnica-Candidato-Indicador.';

COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.idresultadotecnica
IS 'Identificador de la relación Proceso-Técnica-Candidato.';

COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.idindicadorplanilla
IS 'Identificador del indicador de la planilla que responde a la técnica de selección.';

COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.resultado
IS 'Resultado obtenido por el candidato en el indicador de la técnica(planilla).';

COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.complemento
IS 'Complemento textual asociado al indicador.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD CONSTRAINT uk_resultadoseleccion_idcandidato 
    UNIQUE (idcandidato) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD CONSTRAINT pk_resultadoseleccion 
    PRIMARY KEY (idresultadoseleccion) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_seguimiento
  ADD CONSTRAINT fk_candidato_seguimiento_idcandidato FOREIGN KEY (idcandidato)
    REFERENCES mod_seleccion.dat_candidato(idcandidato)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_seguimiento
  ADD CONSTRAINT fk_motivoseguimiento_seguimiento_idmotivoseguimiento FOREIGN KEY (idmotivoseguimiento)
    REFERENCES mod_seleccion.nom_motivoseguimiento(idmotivoseguimiento)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadotecnica
  ADD CONSTRAINT fk_candidato_resultadotecnica FOREIGN KEY (idcandidato)
    REFERENCES mod_seleccion.dat_candidato(idcandidato)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadotecnica
  ADD CONSTRAINT fk_procesotecnica_resultadotecnica FOREIGN KEY (idprocesotecnica)
    REFERENCES mod_seleccion.dat_procesotecnica(idprocesotecnica)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD CONSTRAINT fk_candidato_resultadoseleccion FOREIGN KEY (idcandidato)
    REFERENCES mod_seleccion.dat_candidato(idcandidato)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_responsable
  ADD CONSTRAINT fk_procesotecnica_responsable FOREIGN KEY (idprocesotecnica)
    REFERENCES mod_seleccion.dat_procesotecnica(idprocesotecnica)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_procesotecnica
  ADD CONSTRAINT fk_proceso_procesotecnica FOREIGN KEY (idproceso)
    REFERENCES mod_seleccion.dat_proceso(idproceso)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_procesotecnica
  ADD CONSTRAINT fk_tecnica_procesotecnica FOREIGN KEY (idtecnica)
    REFERENCES mod_seleccion.conf_tecnica(idplanilla)
    MATCH FULL
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_procesocomite
  ADD CONSTRAINT fk_proceso_procesocomite FOREIGN KEY (idproceso)
    REFERENCES mod_seleccion.dat_proceso(idproceso)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_procesocargo
  ADD CONSTRAINT fk_proceso_procesocargo FOREIGN KEY (idproceso)
    REFERENCES mod_seleccion.dat_proceso(idproceso)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_indicadortecnica
  ADD CONSTRAINT fk_resultadotecnica_indicadortecnica FOREIGN KEY (idresultadotecnica)
    REFERENCES mod_seleccion.dat_resultadotecnica(idresultadotecnica)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_excluido
  ADD CONSTRAINT fk_motivoexclusion_exclusion_idmotivoexclusion FOREIGN KEY (idmotivoexclusion)
    REFERENCES mod_seleccion.nom_motivoexclusion(idmotivoexclusion)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_excluido
  ADD CONSTRAINT fk_motivoreincorporacion_exclusion_idmotivoreincorporacion FOREIGN KEY (idmotivoreincorporacion)
    REFERENCES mod_seleccion.nom_motivoreicorporacion(idmotivoreicorporacion)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_candidato
  ADD CONSTRAINT fk_proceso_candidato FOREIGN KEY (idproceso)
    REFERENCES mod_seleccion.dat_proceso(idproceso)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_candidato
  ADD CONSTRAINT fk_viareclutamiento_candidato FOREIGN KEY (idviareclutamiento)
    REFERENCES mod_seleccion.nom_viareclutamiento(idviareclutamiento)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.conf_comptecnica
  ADD CONSTRAINT fk_proceso_comptecnica FOREIGN KEY (idproceso)
    REFERENCES mod_seleccion.dat_proceso(idproceso)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.conf_comptecnica
  ADD CONSTRAINT fk_tecnica_comptecnica FOREIGN KEY (idtecnica)
    REFERENCES mod_seleccion.conf_tecnica(idplanilla)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.conf_compproceso
  ADD CONSTRAINT fk_idproceso_compproceso FOREIGN KEY (idproceso)
    REFERENCES mod_seleccion.dat_proceso(idproceso)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;