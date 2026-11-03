/*
COMMENT ON SEQUENCE mod_rrhhmaestro.conf_mapeocategocup_idmapeocategocup_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_mapeocategocup".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_cargocomision_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargocomision".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_comision_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_comision".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_comisionmiembro_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_comisionmiembro".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_conf_idoneidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_idoneidad".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_escala_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_escala".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_escalacualitativa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_escalacualitativa".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_escalanumerica_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_escalanumerica".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_notificacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_notificacion".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_periodovacaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_periodovacaciones".';

COMMENT ON SEQUENCE mod_rrhhmaestro.sec_valorcualitativo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_valorcualitativo".';

COMMENT ON TABLE mod_rrhhmaestro.nom_periodovacaciones
IS 'Entidad de perÃ­odos de vacaciones.';

COMMENT ON COLUMN mod_rrhhmaestro.nom_periodovacaciones.descripcion
IS 'DescripciÃ³n del nomenclador.';

*/

ALTER TABLE mod_nomina.conf_pagosporresultado DROP CONSTRAINT ak_tipopago;
ALTER TABLE mod_nomina.conf_pagosporresultado DROP CONSTRAINT fk_tipopago_pagosporresultado;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  DROP CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina RESTRICT;

ALTER TABLE mod_nomina.nom_areascargos
  DROP CONSTRAINT pk_areascargos RESTRICT;

COMMENT ON SEQUENCE mod_nomina.sec_camposreportecorreo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_camposreportecorreo".';

COMMENT ON SEQUENCE mod_nomina.sec_camposreportecorreoentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_camposreportecorreoentidad".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personaestructuranominacobrosypagos".';

COMMENT ON SEQUENCE mod_nomina.sec_periodosdestajo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_periodosdestajo".';

ALTER TABLE mod_nomina.nom_areascargos
  ALTER COLUMN idcargo SET NOT NULL;

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT pk_idarea_cargo 
    PRIMARY KEY (idarea, idcargo) NOT DEFERRABLE;

CREATE INDEX idx_variableselementosreportescertificaciones_valor ON mod_nomina.dat_variableselementosreportescertificaciones
  USING btree (valor);

CREATE INDEX idx_variableselementosreportescertificaciones_idvariableselemen ON mod_nomina.dat_variableselementosreportescertificaciones
  USING btree (idvariableselementosreportescertificaciones);

CREATE INDEX idx_reportescertificaciones_idreportescertificaciones ON mod_nomina.dat_reportescertificaciones
  USING btree (idreportescertificaciones);

CREATE INDEX idx_dat_registrosalariotiemposervcio_idtiponomina ON mod_nomina.dat_registrosalariotiemposervcio
  USING btree (idtiponomina);

CREATE INDEX idx_dat_registrosalariotiemposervcio_idpersona ON mod_nomina.dat_registrosalariotiemposervcio
  USING btree (idpersona);

CREATE INDEX idx_dat_registrosalariotiemposervcio_idmes ON mod_nomina.dat_registrosalariotiemposervcio
  USING btree (idmes);

CREATE INDEX idx_dat_registrosalariotiemposervcio_idestructura ON mod_nomina.dat_registrosalariotiemposervcio
  USING btree (idestructura);

CREATE INDEX idx_dat_registrosalariotiemposervcio_idconfregistsalartiempserv ON mod_nomina.dat_registrosalariotiemposervcio
  USING btree (idconfregistsalartiempservc);

CREATE INDEX idx_dat_registrosalariotiemposervcio_diasacumulados ON mod_nomina.dat_registrosalariotiemposervcio
  USING btree (idmes);

CREATE INDEX idx_dat_personaselaborarpagos_idreportescertificaciones ON mod_nomina.dat_personaselaborarpagos
  USING btree (idreportescertificaciones);

CREATE INDEX idx_dat_personaselaborarpagos_idpersona ON mod_nomina.dat_personaselaborarpagos
  USING btree (idpersona);

CREATE INDEX idx_dat_personaselaborarpagos_idelaborarpagos ON mod_nomina.dat_personaselaborarpagos
  USING btree (idelaborarpagos);

CREATE INDEX idx_dat_personaselaborarpagos_idcausaexclusion ON mod_nomina.dat_personaselaborarpagos
  USING btree (idcausaexclusion);

CREATE INDEX idx_dat_personaelaborarpagoscargosocupados_idpersonaelaborarpag ON mod_nomina.dat_personaelaborarpagoscargosocupados
  USING btree (idpersonaelaborarpagos);

CREATE INDEX idx_dat_personaelaborarpagoscargosocupados_idcargosocupados ON mod_nomina.dat_personaelaborarpagoscargosocupados
  USING btree (idcargosocupados);

CREATE INDEX idx_dat_nominadatos_idnomina ON mod_nomina.dat_nominadatos
  USING btree (idnomina);

CREATE INDEX idx_dat_nominadatos_estructura ON mod_nomina.dat_nominadatos
  USING btree (estructura);

CREATE INDEX idx_dat_nominadatos_campos ON mod_nomina.dat_nominadatos
  USING btree (campos);

CREATE INDEX idx_dat_nominaaprobacioncertificacion_operacionpermiso ON mod_nomina.dat_nominaaprobacioncertificacion
  USING btree (operacionpermiso);

CREATE INDEX idx_dat_nominaaprobacioncertificacion_idnomina ON mod_nomina.dat_nominaaprobacioncertificacion
  USING btree (idnomina);

CREATE INDEX idx_dat_nominaaprobacioncertificacion_idcompartimentacionnomina ON mod_nomina.dat_nominaaprobacioncertificacion
  USING btree (idcompartimentacionnomina);

CREATE INDEX idx_dat_nominaaprobacioncertificacion_fechaoperacion ON mod_nomina.dat_nominaaprobacioncertificacion
  USING btree (fechaoperacion);

CREATE INDEX idx_nomina_numeronomina ON mod_nomina.dat_nomina
  USING btree (numeronomina);

CREATE INDEX idx_nomina_idplantillanominal ON mod_nomina.dat_nomina
  USING btree (idplantillanominal);

CREATE INDEX idx_nomina_idelaborarpago ON mod_nomina.dat_nomina
  USING btree (idelaborarpago);

CREATE INDEX idx_nomina_idconfmodelonomina ON mod_nomina.dat_nomina
  USING btree (idconfmodelonomina);

CREATE INDEX idx_nomina_aprobada ON mod_nomina.dat_nomina
  USING btree (aprobada);

CREATE INDEX "idx_ dat_elementosreportescertificaciones_idreportescertificaci" ON mod_nomina.dat_elementosreportescertificaciones
  USING btree (idreportescertificaciones);

CREATE INDEX "idx_ dat_elementosreportescertificaciones_idelementosreportesce" ON mod_nomina.dat_elementosreportescertificaciones
  USING btree (idelementosreportescertificaciones);

CREATE INDEX "idx_ dat_elementosreportescertificaciones_idelemento" ON mod_nomina.dat_elementosreportescertificaciones
  USING btree (idelemento);

CREATE INDEX "idx_ dat_elementosreportescertificaciones_idcargo" ON mod_nomina.dat_elementosreportescertificaciones
  USING btree (idcargo);

CREATE INDEX "idx_ dat_elementosreportescertificaciones_aprobado" ON mod_nomina.dat_elementosreportescertificaciones
  USING btree (aprobado);

CREATE INDEX idx_elaborarpagos_idelaborarpagos ON mod_nomina.dat_elaborarpagos
  USING btree (idelaborarpagos);

CREATE INDEX "idx_ dat_descuentosaplicadosporpersona_idpersona" ON mod_nomina.dat_descuentosaplicadosporpersona
  USING btree (idpersona);

CREATE INDEX "idx_ dat_descuentosaplicadosporpersona_idelaborarpagos" ON mod_nomina.dat_descuentosaplicadosporpersona
  USING btree (idelaborarpagos);

CREATE INDEX "idx_ dat_descuentosaplicadosporpersona_iddescuentosaplicadospor" ON mod_nomina.dat_descuentosaplicadosporpersona
  USING btree (iddescuentosaplicadosporpersona);

CREATE INDEX "idx_ dat_descuentosaplicadosporpersona_idconceptopercepciondesc" ON mod_nomina.dat_descuentosaplicadosporpersona
  USING btree (idconceptopercepciondescuento);

CREATE INDEX idx_cargosocupados_idpersona_identidad ON mod_nomina.dat_cargosocupados
  USING btree (idpersona, identidad);

CREATE INDEX fki_cargo_plantilla_estructura ON mod_nomina.conf_plantillanominalcargo
  USING btree (idcargo);

CREATE INDEX idx_plantillanominal_idplantillanominal ON mod_nomina.conf_plantillanominal
  USING btree (idplantillanominal);

CREATE INDEX idx_nomina_tipo ON mod_nomina.conf_conceptospdelementossalariales
  USING btree (tipo);

CREATE INDEX idx_nomina_idtarifa ON mod_nomina.conf_conceptospdelementossalariales
  USING btree (idtarifa);

CREATE INDEX idx_nomina_idelementosalarialpersona ON mod_nomina.conf_conceptospdelementossalariales
  USING btree (idelementosalarialpersona);

CREATE INDEX idx_nomina_idconceptopercepciondescuento ON mod_nomina.conf_conceptospdelementossalariales
  USING btree (idconceptopercepciondescuento);

CREATE INDEX idx_nomina_idcargosocupados ON mod_nomina.conf_conceptospdelementossalariales
  USING btree (idcargosocupados);

CREATE INDEX idx_nomina_fechainicio ON mod_nomina.conf_conceptospdelementossalariales
  USING btree (fechainicio);

ALTER TABLE mod_nomina.dat_cargosocupados
  ADD CONSTRAINT fk_filaestruc_cargosocupados_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_cargospagoporresultado
  ADD CONSTRAINT fk_idarea_idcargo FOREIGN KEY (idarea, idcargo)
    REFERENCES mod_nomina.nom_areascargos(idarea, idcargo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina CHECK (((vacacionesdiasimporte = (0)::numeric) OR (vacacionesdiasimporte = (1)::numeric)) OR (vacacionesdiasimporte = (2)::numeric));

COMMENT ON CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina ON mod_nomina.conf_estructuramodelosnomina
IS 'Restricción sobre la(s) columna(s) "vacacionesdiasimporte".';

--Cambiandole el estado a los reportes certificados porque ya este estado dejo de existir
UPDATE mod_nomina.dat_reportescertificaciones
   SET estado = 1
 WHERE  estado = 2;
 
--Funcion para actualizar en la tabla confcargopagoresultado el idarea del cargo
SELECT mod_nomina.f_asociar_area_cargo_pgxr(); 

--Para ponerle a los periodos que son mensuales
UPDATE mod_nomina.nom_periodopago
   SET tipoperiodo = 3;
   
 --Para ponerle a a las referencias que son por rangos de fecha  
   UPDATE mod_nomina.conf_estructuramodelosnomina
   SET tiporeferencia = 1
 WHERE idtipocampo = 4;
 
 --Para quitar las fechas de vencimiento en Asociar Personas a Centros de Costo.
 UPDATE mod_nomina.dat_cargosocupados
   SET fechavencimiento = null;