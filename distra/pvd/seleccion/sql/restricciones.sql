-- Created By : ScriptSplitGenerador
-- Only Restrictions
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
ALTER TABLE ONLY mod_seleccion.conf_tecnica
    ADD CONSTRAINT conf_tecnica_pkey PRIMARY KEY (idtecnica);
ALTER TABLE ONLY mod_seleccion.dat_excluido
    ADD CONSTRAINT dat_excluido_pkey PRIMARY KEY (idexcluido);
ALTER TABLE ONLY mod_seleccion.dat_indicadortecnica
    ADD CONSTRAINT dat_indicadortecnica_pkey PRIMARY KEY (idindicadortecnica);
ALTER TABLE ONLY mod_seleccion.dat_procesotecnica
    ADD CONSTRAINT dat_procesotecnica_pkey PRIMARY KEY (idprocesotecnica);
ALTER TABLE ONLY mod_seleccion.nom_motivoexclusion
    ADD CONSTRAINT nom_motivoexclusion_pkey PRIMARY KEY (idmotivoexclusion);
ALTER TABLE ONLY mod_seleccion.nom_motivoreicorporacion
    ADD CONSTRAINT nom_motivoreicorporacion_pkey PRIMARY KEY (idmotivoreicorporacion);
ALTER TABLE ONLY mod_seleccion.nom_motivoseguimiento
    ADD CONSTRAINT nom_motivoseguimiento_pkey PRIMARY KEY (idmotivoseguimiento);
ALTER TABLE ONLY mod_seleccion.nom_viareclutamiento
    ADD CONSTRAINT nom_viareclutamiento_pkey PRIMARY KEY (idviareclutamiento);
ALTER TABLE ONLY mod_seleccion.nom_comite
    ADD CONSTRAINT pk_comision PRIMARY KEY (idcomite);
ALTER TABLE ONLY mod_seleccion.conf_compproceso
    ADD CONSTRAINT pk_compproceso_idcompproceso PRIMARY KEY (idcompproceso);
ALTER TABLE ONLY mod_seleccion.conf_comptecnica
    ADD CONSTRAINT pk_comptecnica_idcomptecnica PRIMARY KEY (idcomptecnica);
ALTER TABLE ONLY mod_seleccion.dat_candidato
    ADD CONSTRAINT pk_idcandidato PRIMARY KEY (idcandidato);
ALTER TABLE ONLY mod_seleccion.dat_comite
    ADD CONSTRAINT pk_pcomision PRIMARY KEY (idcomitep);
ALTER TABLE ONLY mod_seleccion.dat_proceso
    ADD CONSTRAINT pk_proceso PRIMARY KEY (idproceso);
ALTER TABLE ONLY mod_seleccion.dat_procesocargo
    ADD CONSTRAINT pk_procesocargo PRIMARY KEY (idprocesocargo);
ALTER TABLE ONLY mod_seleccion.dat_procesocomite
    ADD CONSTRAINT pk_procesocomite PRIMARY KEY (idprocesocomite);
ALTER TABLE ONLY mod_seleccion.dat_responsable
    ADD CONSTRAINT pk_responsable PRIMARY KEY (idresponsable);
ALTER TABLE ONLY mod_seleccion.dat_resultadoseleccion
    ADD CONSTRAINT pk_resultadoseleccion PRIMARY KEY (idresultadoseleccion);
ALTER TABLE ONLY mod_seleccion.dat_resultadotecnica
    ADD CONSTRAINT pk_resultadotecnica PRIMARY KEY (idresultadotecnica);
ALTER TABLE ONLY mod_seleccion.dat_seguimiento
    ADD CONSTRAINT pk_seguimiento PRIMARY KEY (idseguimiento);
ALTER TABLE ONLY mod_seleccion.nom_comite
    ADD CONSTRAINT uk_comite_denominacion UNIQUE (denominacion);
ALTER TABLE ONLY mod_seleccion.conf_comptecnica
    ADD CONSTRAINT uk_comptecnica_idtecnica_idproceso UNIQUE (idtecnica, idproceso);
ALTER TABLE ONLY mod_seleccion.dat_comite
    ADD CONSTRAINT uk_dcomite_idcomite_estructura_idpersona UNIQUE (idcomite, estructura, idpersona);
ALTER TABLE ONLY mod_seleccion.dat_proceso
    ADD CONSTRAINT uk_proceso_denominacion UNIQUE (denominacion);
ALTER TABLE ONLY mod_seleccion.dat_procesocargo
    ADD CONSTRAINT uk_procesocargo_idproceso_idcargo_homologo UNIQUE (idproceso, idcargo, homologo);
ALTER TABLE ONLY mod_seleccion.dat_responsable
    ADD CONSTRAINT uk_responsable_idprocesotecnica_idcomitep UNIQUE (idprocesotecnica, idcomisionpersona);
ALTER TABLE ONLY mod_seleccion.dat_resultadoseleccion
    ADD CONSTRAINT uk_resultadoseleccion_idcandidato UNIQUE (idcandidato);
ALTER TABLE ONLY mod_seleccion.dat_resultadotecnica
    ADD CONSTRAINT uk_resultadotecnica_ UNIQUE (idprocesotecnica, idcandidato, fdesde);
ALTER TABLE ONLY mod_seleccion.conf_tecnica
    ADD CONSTRAINT uk_tecnica_idplanilla UNIQUE (idplanilla);
CREATE INDEX fki_candidato_seguimiento_idcandidato ON mod_seleccion.dat_seguimiento USING btree (idcandidato);
CREATE INDEX fki_k ON mod_seleccion.dat_procesotecnica USING btree (idtecnica);
CREATE INDEX fki_motivoexclusion_exclusion_idmotivoexclusion ON mod_seleccion.dat_excluido USING btree (idmotivoexclusion);
ALTER TABLE ONLY mod_seleccion.dat_resultadoseleccion
    ADD CONSTRAINT fk_candidato_resultadoseleccion FOREIGN KEY (idcandidato) REFERENCES mod_seleccion.dat_candidato(idcandidato) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_resultadotecnica
    ADD CONSTRAINT fk_candidato_resultadotecnica FOREIGN KEY (idcandidato) REFERENCES mod_seleccion.dat_candidato(idcandidato) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_seguimiento
    ADD CONSTRAINT fk_candidato_seguimiento_idcandidato FOREIGN KEY (idcandidato) REFERENCES mod_seleccion.dat_candidato(idcandidato) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.conf_compproceso
    ADD CONSTRAINT fk_idproceso_compproceso FOREIGN KEY (idproceso) REFERENCES mod_seleccion.dat_proceso(idproceso) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_excluido
    ADD CONSTRAINT fk_motivoexclusion_exclusion_idmotivoexclusion FOREIGN KEY (idmotivoexclusion) REFERENCES mod_seleccion.nom_motivoexclusion(idmotivoexclusion) ON DELETE RESTRICT;
ALTER TABLE ONLY mod_seleccion.dat_excluido
    ADD CONSTRAINT fk_motivoreincorporacion_exclusion_idmotivoreincorporacion FOREIGN KEY (idmotivoreincorporacion) REFERENCES mod_seleccion.nom_motivoreicorporacion(idmotivoreicorporacion) ON DELETE RESTRICT;
ALTER TABLE ONLY mod_seleccion.dat_seguimiento
    ADD CONSTRAINT fk_motivoseguimiento_seguimiento_idmotivoseguimiento FOREIGN KEY (idmotivoseguimiento) REFERENCES mod_seleccion.nom_motivoseguimiento(idmotivoseguimiento);
ALTER TABLE ONLY mod_seleccion.dat_candidato
    ADD CONSTRAINT fk_proceso_candidato FOREIGN KEY (idproceso) REFERENCES mod_seleccion.dat_proceso(idproceso) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.conf_comptecnica
    ADD CONSTRAINT fk_proceso_comptecnica FOREIGN KEY (idproceso) REFERENCES mod_seleccion.dat_proceso(idproceso) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_procesocargo
    ADD CONSTRAINT fk_proceso_procesocargo FOREIGN KEY (idproceso) REFERENCES mod_seleccion.dat_proceso(idproceso) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_procesocomite
    ADD CONSTRAINT fk_proceso_procesocomite FOREIGN KEY (idproceso) REFERENCES mod_seleccion.dat_proceso(idproceso) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_procesotecnica
    ADD CONSTRAINT fk_proceso_procesotecnica FOREIGN KEY (idproceso) REFERENCES mod_seleccion.dat_proceso(idproceso) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_responsable
    ADD CONSTRAINT fk_procesotecnica_responsable FOREIGN KEY (idprocesotecnica) REFERENCES mod_seleccion.dat_procesotecnica(idprocesotecnica) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_resultadotecnica
    ADD CONSTRAINT fk_procesotecnica_resultadotecnica FOREIGN KEY (idprocesotecnica) REFERENCES mod_seleccion.dat_procesotecnica(idprocesotecnica) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_indicadortecnica
    ADD CONSTRAINT fk_resultadotecnica_indicadortecnica FOREIGN KEY (idresultadotecnica) REFERENCES mod_seleccion.dat_resultadotecnica(idresultadotecnica) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.conf_comptecnica
    ADD CONSTRAINT fk_tecnica_comptecnica FOREIGN KEY (idtecnica) REFERENCES mod_seleccion.conf_tecnica(idplanilla) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY mod_seleccion.dat_procesotecnica
    ADD CONSTRAINT fk_tecnica_procesotecnica FOREIGN KEY (idtecnica) REFERENCES mod_seleccion.conf_tecnica(idplanilla) MATCH FULL ON DELETE RESTRICT;
ALTER TABLE ONLY mod_seleccion.dat_candidato
    ADD CONSTRAINT fk_viareclutamiento_candidato FOREIGN KEY (idviareclutamiento) REFERENCES mod_seleccion.nom_viareclutamiento(idviareclutamiento);