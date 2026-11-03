CREATE SEQUENCE mod_seleccion.sec_compproceso_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_compproceso_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_compproceso".';

CREATE SEQUENCE mod_seleccion.sec_excluido_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_excluido_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_excluido".';

CREATE SEQUENCE mod_seleccion.sec_motivoexclusion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_motivoexclusion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoexclusion".';

CREATE SEQUENCE mod_seleccion.sec_motivoreicorporacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_motivoreicorporacion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoreicorporacion".';

CREATE SEQUENCE mod_seleccion.sec_motivoseguimiento_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 8
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_motivoseguimiento_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_motivoseguimiento".';

CREATE SEQUENCE mod_seleccion.sec_seguimiento_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 22
  CACHE 1;

COMMENT ON SEQUENCE mod_seleccion.sec_seguimiento_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_seguimiento".';

COMMENT ON SCHEMA mod_seleccion
IS 'Agrupa los datos del componente selección. Versión 2. (RRHH)';

COMMENT ON SEQUENCE mod_seleccion.sec_candidato_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_candidato".';

COMMENT ON SEQUENCE mod_seleccion.sec_comite_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_comite".';

COMMENT ON SEQUENCE mod_seleccion.sec_comitep_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_comite".';

COMMENT ON SEQUENCE mod_seleccion.sec_comptecnica_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_comptecnica".';

COMMENT ON SEQUENCE mod_seleccion.sec_indicadortecnica_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_indicadortecnica".';

COMMENT ON SEQUENCE mod_seleccion.sec_proceso_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_proceso".';

COMMENT ON SEQUENCE mod_seleccion.sec_procesocargo_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_procesocargo".';

COMMENT ON SEQUENCE mod_seleccion.sec_procesocomite_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_procesocomite".';

COMMENT ON SEQUENCE mod_seleccion.sec_procesotecnica_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_procesotecnica".';

COMMENT ON SEQUENCE mod_seleccion.sec_responsable_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_responsable".';

COMMENT ON SEQUENCE mod_seleccion.sec_resultadoseleccion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_resultadoseleccion".';

COMMENT ON SEQUENCE mod_seleccion.sec_resultadotecnica_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_resultadotecnica".';

COMMENT ON SEQUENCE mod_seleccion.sec_tecnica_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_tecnica".';

COMMENT ON SEQUENCE mod_seleccion.sec_viareclutamiento_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_viareclutamiento".';

ALTER TABLE mod_seleccion.nom_comite
  OWNER TO zeolides;

COMMENT ON TABLE mod_seleccion.dat_comite
IS 'Almacena los datos del (los) comité de ingreso.';

ALTER TABLE mod_seleccion.dat_comite
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.dat_comite.idcomite
IS 'Identificador del comité. El valor que almecena es en dependencia del valor que toma el atributo (estructura), que determina si el comité es del nomenclador o de una estructura no formal.';

COMMENT ON COLUMN mod_seleccion.dat_comite.estructura
IS 'Determina si la comisión está definida en el nomenclador o en estructura y composición. (0-> Nomenclador, 1-> Estructura).';

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

COMMENT ON TABLE mod_seleccion.nom_motivoexclusion
IS 'Almacena los motivos de exclusión.';

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.idmotivoexclusion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.denominacion
IS 'Denominación del motivo de exclusión.';

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.descripcion
IS 'Descripción del motivo de exclusión.';

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.fdesde
IS 'Fecha de entrada en vigor el valor nomenclado para el motivo de exclusión.';

COMMENT ON COLUMN mod_seleccion.nom_motivoexclusion.fhasta
IS 'Fecha en la que concluye la vigencia del valor nomenclado para el motivo de exclusión.';

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

COMMENT ON TABLE mod_seleccion.nom_motivoreicorporacion
IS 'Almacena los motivos de re-incorporación.';

COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.idmotivoreicorporacion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.denominacion
IS 'Denominación del motivo de re-incorporación.';

COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.descripcion
IS 'Descipción del motivo de re-incorporación.';

COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.fdesde
IS 'Fecha de entrada en vigor el valor nomenclado para el motivo de re-incorporación.';

COMMENT ON COLUMN mod_seleccion.nom_motivoreicorporacion.fhasta
IS 'Fecha en la que concluye la vigencia del valor nomenclado para el motivo de re-incorporación.';

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

ALTER TABLE mod_seleccion.dat_proceso
  OWNER TO zeolides;

ALTER TABLE mod_seleccion.dat_proceso
  ADD COLUMN idestructura NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_seleccion.dat_proceso.idestructura
IS 'Identificador de la estructura.';

ALTER TABLE mod_seleccion.dat_proceso
  ADD COLUMN contratar NUMERIC(1,0) DEFAULT 2 NOT NULL;

COMMENT ON COLUMN mod_seleccion.dat_proceso.contratar
IS 'Indicador de contratación. 1- Verdadero, 2- Falso.';

ALTER TABLE mod_seleccion.conf_tecnica
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.conf_tecnica.idtecnica
IS 'Identificador de la técnica.';

COMMENT ON COLUMN mod_seleccion.conf_tecnica.idplanilla
IS 'Identificador de la planilla evaluativa.';

COMMENT ON TABLE mod_seleccion.nom_viareclutamiento
IS 'Almacena las vías de reclutamiento de los candidatos.';

ALTER TABLE mod_seleccion.nom_viareclutamiento
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.idviareclutamiento
IS 'Identificador de la vía de reclutamiento.';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.denominacion
IS 'Denominación de la vía de reclutamiento.';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.descripcion
IS 'Descripción de la vía de reclutamiento.';

COMMENT ON COLUMN mod_seleccion.nom_viareclutamiento.fdesde
IS 'Fecha en que inicia la vigencia de la vía de reclutamiento.';

ALTER TABLE mod_seleccion.nom_viareclutamiento
  ALTER COLUMN fdesde SET DEFAULT now();

ALTER TABLE mod_seleccion.nom_viareclutamiento
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1 NOT NULL;

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

ALTER TABLE mod_seleccion.dat_procesocargo
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.dat_procesocargo.homologo
IS 'Determina si el cargo es de la homologación o de estructura (plantilla). 0-> EyC 1-> Homologación.';

ALTER TABLE mod_seleccion.dat_procesocomite
  OWNER TO zeolides;

ALTER TABLE mod_seleccion.dat_procesocomite
  ADD COLUMN idcomision NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_seleccion.dat_procesocomite.idcomision
IS 'Identificador de la comisión.';

ALTER TABLE mod_seleccion.conf_comptecnica
  OWNER TO zeolides;

ALTER TABLE mod_seleccion.dat_procesotecnica
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idprocesotecnica
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.idtecnica
IS 'Identificador de la técnica de selección (planilla evaluativa).';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.hito
IS 'Determina si la técnica en el proceso constituye un hito para la selección.';

COMMENT ON COLUMN mod_seleccion.dat_procesotecnica.unidadtiempo
IS 'Almacena la unidad de tiempo del período de validez.
1-día. 2-mes. 3-año.';

COMMENT ON TABLE mod_seleccion.dat_candidato
IS 'Almacena personas que son candidatos a los procesos.';

ALTER TABLE mod_seleccion.dat_candidato
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.dat_candidato.contratado
IS 'Determina si el candidato fue contratado o no: 1- contratado. 2- no contratado.';

ALTER TABLE mod_seleccion.dat_candidato
  ADD COLUMN idprocesoorigen NUMERIC(19,0);

COMMENT ON COLUMN mod_seleccion.dat_candidato.idprocesoorigen
IS 'Identificador del proceso origen en caso de provenir de otro proceso.';

ALTER TABLE mod_seleccion.dat_candidato
  ADD COLUMN idusuario NUMERIC(19,0);

COMMENT ON COLUMN mod_seleccion.dat_candidato.idusuario
IS 'Identificador del usuario que registra al candidato.';

ALTER TABLE mod_seleccion.dat_candidato
  ADD COLUMN numeroexpediente NUMERIC(19,0);

COMMENT ON COLUMN mod_seleccion.dat_candidato.numeroexpediente
IS 'Número del expediente.';

ALTER TABLE mod_seleccion.dat_responsable
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.dat_responsable.idresponsable
IS 'Identificador del responsable de la técnica.';

COMMENT ON COLUMN mod_seleccion.dat_responsable.idprocesotecnica
IS 'Identificador del proceso asociado a la técnica.';

ALTER TABLE mod_seleccion.dat_responsable
  ADD COLUMN idcomisionpersona NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_seleccion.dat_responsable.idcomisionpersona
IS 'Identificador de la persona del comité de ingreso.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.seleccion
IS 'Estado que se encuentra la persona en el proceso. 0-> Preseleccionado. 1-> Seleccionado. 2-> Excluido.';

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD COLUMN idusuario NUMERIC(19,0);

COMMENT ON COLUMN mod_seleccion.dat_resultadoseleccion.idusuario
IS 'Identificador del usuario que preselecciona o selecciona.';

ALTER TABLE mod_seleccion.dat_resultadotecnica
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.dat_resultadotecnica.idprocesotecnica
IS 'Identificador del proceso asociado a la técnica.';

ALTER TABLE mod_seleccion.dat_resultadotecnica
  ADD COLUMN idusuario NUMERIC(19,0);

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
IS 'Almacena el identificador de la tabla.';

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

ALTER TABLE mod_seleccion.dat_indicadortecnica
  OWNER TO zeolides;

COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.idindicadortecnica
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.idresultadotecnica
IS 'Identificador del resultado de la técnica.';

COMMENT ON COLUMN mod_seleccion.dat_indicadortecnica.resultado
IS 'Resultado obtenido por el candidato en el indicador de la técnica (planilla).';

ALTER TABLE mod_seleccion.dat_indicadortecnica
  ALTER COLUMN resultado TYPE NUMERIC(19,2);

ALTER TABLE mod_seleccion.dat_responsable
  DROP COLUMN idcomitep;

ALTER TABLE mod_seleccion.dat_candidato
  DROP COLUMN excluido;

ALTER TABLE mod_seleccion.dat_procesocomite
  DROP COLUMN estructura;

ALTER TABLE mod_seleccion.dat_procesocomite
  DROP COLUMN idcomite;

ALTER TABLE mod_seleccion.nom_viareclutamiento
  ADD CONSTRAINT nom_viareclutamiento_pkey 
    PRIMARY KEY (idviareclutamiento) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.nom_comite
  ADD CONSTRAINT uk_comite_denominacion 
    UNIQUE (denominacion) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.nom_comite
  ADD CONSTRAINT pk_comision 
    PRIMARY KEY (idcomite) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadotecnica
  ADD CONSTRAINT uk_resultadotecnica_ 
    UNIQUE (idprocesotecnica, idcandidato, fdesde) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadotecnica
  ADD CONSTRAINT pk_resultadotecnica 
    PRIMARY KEY (idresultadotecnica) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD CONSTRAINT uk_resultadoseleccion_idcandidato 
    UNIQUE (idcandidato) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadoseleccion
  ADD CONSTRAINT pk_resultadoseleccion 
    PRIMARY KEY (idresultadoseleccion) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_responsable
  ADD CONSTRAINT uk_responsable_idprocesotecnica_idcomitep 
    UNIQUE (idprocesotecnica, idcomisionpersona) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_responsable
  ADD CONSTRAINT pk_responsable 
    PRIMARY KEY (idresponsable) NOT DEFERRABLE;

CREATE INDEX fki_k ON mod_seleccion.dat_procesotecnica
  USING btree (idtecnica);

ALTER TABLE mod_seleccion.dat_procesotecnica
  ADD CONSTRAINT dat_procesotecnica_pkey 
    PRIMARY KEY (idprocesotecnica) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_procesocomite
  ADD CONSTRAINT pk_procesocomite 
    PRIMARY KEY (idprocesocomite) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_procesocargo
  ADD CONSTRAINT uk_procesocargo_idproceso_idcargo_homologo 
    UNIQUE (idproceso, idcargo, homologo) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_procesocargo
  ADD CONSTRAINT pk_procesocargo 
    PRIMARY KEY (idprocesocargo) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_proceso
  ADD CONSTRAINT uk_proceso_denominacion 
    UNIQUE (denominacion) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_proceso
  ADD CONSTRAINT pk_proceso 
    PRIMARY KEY (idproceso) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_indicadortecnica
  ADD CONSTRAINT dat_indicadortecnica_pkey 
    PRIMARY KEY (idindicadortecnica) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_comite
  ADD CONSTRAINT uk_dcomite_idcomite_estructura_idpersona 
    UNIQUE (idcomite, estructura, idpersona) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_comite
  ADD CONSTRAINT pk_pcomision 
    PRIMARY KEY (idcomitep) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_candidato
  ADD CONSTRAINT pk_idcandidato 
    PRIMARY KEY (idcandidato) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.conf_tecnica
  ADD CONSTRAINT uk_tecnica_idplanilla 
    UNIQUE (idplanilla) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.conf_tecnica
  ADD CONSTRAINT conf_tecnica_pkey 
    PRIMARY KEY (idtecnica) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.conf_comptecnica
  ADD CONSTRAINT uk_comptecnica_idtecnica_idproceso 
    UNIQUE (idtecnica, idproceso) NOT DEFERRABLE;

ALTER TABLE mod_seleccion.conf_comptecnica
  ADD CONSTRAINT pk_comptecnica_idcomptecnica 
    PRIMARY KEY (idcomptecnica) NOT DEFERRABLE;

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
  ADD CONSTRAINT fk_procesotecnica_resultadotecnica FOREIGN KEY (idprocesotecnica)
    REFERENCES mod_seleccion.dat_procesotecnica(idprocesotecnica)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_resultadotecnica
  ADD CONSTRAINT fk_candidato_resultadotecnica FOREIGN KEY (idcandidato)
    REFERENCES mod_seleccion.dat_candidato(idcandidato)
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
  ADD CONSTRAINT fk_tecnica_procesotecnica FOREIGN KEY (idtecnica)
    REFERENCES mod_seleccion.conf_tecnica(idplanilla)
    MATCH FULL
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_procesotecnica
  ADD CONSTRAINT fk_proceso_procesotecnica FOREIGN KEY (idproceso)
    REFERENCES mod_seleccion.dat_proceso(idproceso)
    MATCH FULL
    ON DELETE CASCADE
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
  ADD CONSTRAINT fk_viareclutamiento_candidato FOREIGN KEY (idviareclutamiento)
    REFERENCES mod_seleccion.nom_viareclutamiento(idviareclutamiento)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_seleccion.dat_candidato
  ADD CONSTRAINT fk_proceso_candidato FOREIGN KEY (idproceso)
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

ALTER TABLE mod_seleccion.conf_comptecnica
  ADD CONSTRAINT fk_proceso_comptecnica FOREIGN KEY (idproceso)
    REFERENCES mod_seleccion.dat_proceso(idproceso)
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

ALTER TABLE mod_seleccion.dat_proceso
  ADD CONSTRAINT chk_contratar_proceso CHECK ((contratar = (1)::numeric) OR (contratar = (2)::numeric));

COMMENT ON CONSTRAINT chk_contratar_proceso ON mod_seleccion.dat_proceso
IS 'Restricción sobre la(s) columna(s) "contratar".';