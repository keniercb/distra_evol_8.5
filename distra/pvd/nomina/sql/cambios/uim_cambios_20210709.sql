CREATE SEQUENCE mod_nomina.sec_afiliacionpolitica_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 13
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_afiliacionpolitica_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_afiliacionpolitica".';

CREATE SEQUENCE mod_nomina.sec_agrupadorareas_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 18
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_agrupadorareas_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "sec_agrupadorareas_seq".';

CREATE SEQUENCE mod_nomina.sec_ajustevacacionespersona_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_ajustevacacionespersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_ajustevacacionespersona".';

CREATE SEQUENCE mod_nomina.sec_areascargos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_areascargos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_areascargos".';

CREATE SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 147
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_asociacioncuentascontables".';

CREATE SEQUENCE mod_nomina.sec_billetes_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 21
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_billetes_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_billetes".';

CREATE SEQUENCE mod_nomina.sec_camposreportecorreo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_camposreportecorreo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_camposreportecorreo".';

CREATE SEQUENCE mod_nomina.sec_camposreportecorreoentidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_camposreportecorreoentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_camposreportecorreoentidad".';

CREATE SEQUENCE mod_nomina.sec_cargoscertificacionincremento_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_cargoscertificacionincremento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_cargoscertificacionincremento".';

CREATE SEQUENCE mod_nomina.sec_causasreporteausencia_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_causasreporteausencia_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_causasreporteausencia".';

CREATE SEQUENCE mod_nomina.sec_cierreperiodos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_cierreperiodos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_cierreperiodosnomina".';

CREATE SEQUENCE mod_nomina.sec_comprobantenomina_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_comprobantenomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_comprobantenomina".';

CREATE SEQUENCE mod_nomina.sec_comprobantenominacentrocosto_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_comprobantenominacentrocosto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_comprobantenominacentroscosto".';

CREATE SEQUENCE mod_nomina.sec_conceptoelaborarpago_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_conceptoelaborarpago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_conceptoelaborarpago".';

CREATE SEQUENCE mod_nomina.sec_conceptospdsituacionesservicio_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_conceptospdsituacionesservicio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptospdsituacionesservicio".';

CREATE SEQUENCE mod_nomina.sec_conf_conceptoscontablesentidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 99999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_conf_conceptoscontablesentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptoscontablesentidad".';

CREATE SEQUENCE mod_nomina.sec_conf_cuentaaperturapersona_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_conf_cuentaaperturapersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_cuentasaperturapersona".';

CREATE SEQUENCE mod_nomina.sec_conf_exportacionbanco_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_conf_exportacionbanco_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_exportacionbanco".';

CREATE SEQUENCE mod_nomina.sec_conf_exportacionbancoficheroentidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 28
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_conf_exportacionbancoficheroentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_exportacionbancoficheroentidad".';

CREATE SEQUENCE mod_nomina.sec_confnivelactiveconom_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_confnivelactiveconom_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_nivelactiveconom".';

CREATE SEQUENCE mod_nomina.sec_convenio_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 15
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_convenio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_convenio".';

CREATE SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personaestructuranominacobrosypagos".';

CREATE SEQUENCE mod_nomina.sec_datcargoincrementomensual_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_datcargoincrementomensual_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_cargoincrementomensual".';

CREATE SEQUENCE mod_nomina.sec_datelaborarpagoreferencia_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 15
  CACHE 1;

CREATE SEQUENCE mod_nomina.sec_datoscertificadoselaborarpago_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 0
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_datoscertificadoselaborarpago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_datoscertificadoselaborarpago".';

CREATE SEQUENCE mod_nomina.sec_descuentosaplicadosporpersona_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_descuentosaplicadosporpersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_descuentosaplicadosporpersona".';

CREATE SEQUENCE mod_nomina.sec_desgloseperiodos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_desgloseperiodos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_desgloseperiodos".';

CREATE SEQUENCE mod_nomina.sec_especialidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_especialidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_especialidad".';

CREATE SEQUENCE mod_nomina.sec_estructuramodelosnominaentidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_estructuramodelosnominaentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_estructuramodelosnominaentidad".';

CREATE SEQUENCE mod_nomina.sec_fechascierreperiodos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_fechascierreperiodos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_fechascierreperiodos".';

CREATE SEQUENCE mod_nomina.sec_formulasareasmontos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 18
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_formulasareasmontos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "sec_formulasareasmontos_seq".';

CREATE SEQUENCE mod_nomina.sec_his_datretencionpersona_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_his_datretencionpersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_datretencionpersona".';

CREATE SEQUENCE mod_nomina.sec_his_operacionretencionpersona_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_his_operacionretencionpersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_operacionretencionpersona".';

CREATE SEQUENCE mod_nomina.sec_hiscargoincrementomensual_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_hiscargoincrementomensual_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_cargoincrementomensual".';

CREATE SEQUENCE mod_nomina.sec_hiscargoscertificacionincremento_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_hiscargoscertificacionincremento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_cargoscertificacionincremento".';

CREATE SEQUENCE mod_nomina.sec_hiscertificacionannoservc_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_hiscertificacionannoservc_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_certificacionannoservc".';

CREATE SEQUENCE mod_nomina.sec_hispersonacertificacionincremento_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_hispersonacertificacionincremento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_personacertificacionincremento".';

CREATE SEQUENCE mod_nomina.sec_hispersonasnocertificadasannosresvicio_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_hispersonasnocertificadasannosresvicio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_personasnocertificadasannosresvicio".';

CREATE SEQUENCE mod_nomina.sec_iddependencia_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_iddependencia_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_tipopagodependencia".';

CREATE SEQUENCE mod_nomina.sec_modeloconveniocolectivo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 67
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_modeloconveniocolectivo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_modeloconveniocolectivo".';

CREATE SEQUENCE mod_nomina.sec_modeloconvenioindividual_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 44
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_modeloconvenioindividual_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_modeloconvenioindividual".';

CREATE SEQUENCE mod_nomina.sec_nivelactiveconom_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_nivelactiveconom_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_nivelactiveconom".';

CREATE SEQUENCE mod_nomina.sec_obra_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_obra_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_obra".';

CREATE SEQUENCE mod_nomina.sec_pagoporresultadofechas_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 18
  CACHE 1;

CREATE SEQUENCE mod_nomina.sec_partidagastoespecialidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_partidagastoespecialidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_partidagasto".';

CREATE SEQUENCE mod_nomina.sec_periodosdestajo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 16
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_periodosdestajo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_periodosdestajo".';

CREATE SEQUENCE mod_nomina.sec_periodostipospago_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_periodostipospago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_periodostipospago".';

CREATE SEQUENCE mod_nomina.sec_personabaja_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_personabaja_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_personabaja".';

CREATE SEQUENCE mod_nomina.sec_personacertificacionincremento_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_personacertificacionincremento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_personacertificacionincremento".';

CREATE SEQUENCE mod_nomina.sec_personasnocertificadasannosresvicio_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_personasnocertificadasannosresvicio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_personasnocertificadasannosresvicio".';

CREATE SEQUENCE mod_nomina.sec_reintegropersona_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 0
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_reintegropersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_reintegropersona".';

CREATE SEQUENCE mod_nomina.sec_retencionesaplicadasporpersona_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_retencionesaplicadasporpersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_retencionesaplicadasporpersona".';

CREATE SEQUENCE mod_nomina.sec_salarioescala_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 19
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_salarioescala_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_salarioescala".';

CREATE SEQUENCE mod_nomina.sec_seg_compartcargocategoria_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_seg_compartcargocategoria_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_compartcargocategoria".';

CREATE SEQUENCE mod_nomina.sec_tipopartidagasto_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_tipopartidagasto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipopartidagasto".';

CREATE SEQUENCE mod_nomina.sec_trazacertificacionannoservc_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_trazacertificacionannoservc_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_trazacertificacionannoservc".';

CREATE SEQUENCE mod_nomina.sec_vacacionespersonabaja_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_vacacionespersonabaja_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_vacacionespersonabaja".';

ALTER TABLE mod_nomina.his_vacacionespersona
  DROP CONSTRAINT his_vacacionespersona_fk2 RESTRICT;

ALTER TABLE mod_nomina.his_vacacionespersona
  DROP CONSTRAINT his_vacacionespersona_fk1 RESTRICT;

ALTER TABLE mod_nomina.his_retencionpersona
  DROP CONSTRAINT his_retencionpersona_dat_retencionpersona_fk1 RESTRICT;

ALTER TABLE mod_nomina.his_retencionpersona
  DROP CONSTRAINT his_retencionpersona_dat_nomina_fk1 RESTRICT;

ALTER TABLE mod_nomina.conf_plantillanominal
  DROP CONSTRAINT fk_areas_plantillanominal RESTRICT;

ALTER TABLE mod_nomina.conf_personacdgocontable
  DROP CONSTRAINT fk_persona_personacdgocontable RESTRICT;

ALTER TABLE mod_nomina.conf_escalaelementosalarialpersona
  DROP CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona RESTRICT;

ALTER TABLE mod_nomina.conf_escalaelementosalarial
  DROP CONSTRAINT conf_escalaelementosalarial_fk1 RESTRICT;

COMMENT ON SCHEMA mod_nomina
IS 'Agrupa los datos del componente nómina. Versión 1. (RRHH)';

CREATE OR REPLACE FUNCTION mod_nomina.f_asociar_area_cargo_pgxr (
)
RETURNS boolean AS
$body$
DECLARE
 vr_respuesta boolean;
 cant_cargospagoporresultado numeric;
 vr_a record;

BEGIN
SELECT count(*) into cant_cargospagoporresultado FROM mod_nomina.conf_cargospagoporresultado;
IF(cant_cargospagoporresultado > 0) THEN
	for vr_a in (SELECT idarea, idcargo FROM mod_nomina.nom_areascargos
				WHERE idcargo in (SELECT distinct idcargo FROM mod_nomina.conf_cargospagoporresultado)) loop
		IF(vr_a.idcargo IS NOT NULL) THEN
			RAISE NOTICE 'Asignando el área: % con el cargo: % en la tabla mod_nomina.conf_cargospagoporresultado.',vr_a.idarea,vr_a.idcargo;
			UPDATE mod_nomina.conf_cargospagoporresultado
			SET idarea=vr_a.idarea
			WHERE idcargo=vr_a.idcargo and idarea is null;
			vr_respuesta := 't';
		ELSE
			RAISE NOTICE 'La tabla mod_nomina.nom_areascargos "NO" contiene datos que procesar.';
			vr_respuesta := 'f';
		END IF;
	end loop;
ELSE
RAISE NOTICE 'La tabla mod_nomina.conf_cargospagoporresultado "NO" contiene datos que procesar.';
vr_respuesta := 'f';
END IF;
return vr_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_buscar_persona_cargo (
  idp numeric,
  idc numeric
)
RETURNS boolean AS
$body$
DECLARE
 v_id numeric (19,0);
 v_existe boolean := 'f';
BEGIN
      IF(idp IS NOT NULL and idc IS NOT NULL)THEN
            SELECT idpersona INTO v_id FROM mod_nomina.dat_cargosocupados WHERE idpersona = $1 and idcargo = $2;
            IF (v_id IS NOT NULL)THEN
                v_existe := 't';
            END IF;   
      END IF;
      RETURN v_existe;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_conceptospercdesc_cargainicial (
)
RETURNS boolean AS
$body$
DECLARE
 v_respuesta boolean := 'f';
 v_elementosalarialcargo record;
 v_conceptopdtarifa record;
 v_elementosalarialconceptarif numeric;
 v_cont integer :=0;
 v_cantconcepttarif integer;
BEGIN
SELECT count(*) into v_cantconcepttarif FROM mod_nomina.nom_conceptopdtarifa;
for v_elementosalarialcargo in (select esc.idelementosalarialcargo from mod_nomina.conf_elementosalarialcargo as esc) loop
IF(v_elementosalarialcargo IS NOT NULL) THEN
   SELECT count(idelementosalarialcargo) INTO v_elementosalarialconceptarif FROM mod_nomina.conf_conceptospdelementossalariales WHERE idelementosalarialcargo = v_elementosalarialcargo.idelementosalarialcargo;
   if (v_elementosalarialconceptarif = 0) then
       v_cont := 0;
       for v_conceptopdtarifa in (SELECT idconceptopercepciondescuento, idtarifa FROM mod_nomina.nom_conceptopdtarifa
                                  order by idconceptopercepciondescuento) loop
       if (v_conceptopdtarifa is not null) then
           if (v_cont < v_cantconcepttarif) then
               INSERT INTO mod_nomina.conf_conceptospdelementossalariales(idconceptopercepciondescuento, idtarifa, idelementosalarialcargo)
               VALUES (v_conceptopdtarifa.idconceptopercepciondescuento, v_conceptopdtarifa.idtarifa, v_elementosalarialcargo.idelementosalarialcargo);
               v_cont:=v_cont+1;
           else
               raise notice 'Cantidad insertados: %',v_cont;
           end if;
       else
           raise notice 'No existen conceptos de percepción y descuento asociados a tarifas, verifique que existen tuplas en mod_nomina.nom_conceptopdtarifa.';
           return v_respuesta;
       end if;
       end loop;
   else
       raise notice 'El elemento % tiene asociados al menos un concepto con tarifa anterior al proceso.',v_elementosalarialconceptarif;
   end if;
   raise notice 'Cantidad de conceptos: % , para el elemento % .',v_cont,v_elementosalarialcargo.idelementosalarialcargo;
ELSE
raise notice 'No existen elementos salariales al cargo, verifique que existen tuplas en mod_nomina.conf_elementosalarialcargo.';
END IF;
   v_respuesta := 't';
end loop;
return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_del_elementosalarialsituacionservicio (
  idcargoocup numeric
)
RETURNS void AS
$body$
BEGIN
      IF(idcargoocup IS NOT NULL)THEN
         --UPDATE mod_nomina.conf_elementosalarialsituacionservicio SET fechafin=now()::date WHERE idcargoocupado=idcargoocup;
         EXECUTE 'DELETE FROM mod_nomina.conf_elementosalarialsituacionservicio WHERE idcargoocupado = '||idcargoocup||';';
      END IF;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_elementossalariales_cargainicial (
)
RETURNS boolean AS
$body$
DECLARE
 v_respuesta boolean := 'f';
 v_cargoestruct record;
 v_cargoselementos numeric;
 old_sistpago numeric;
 v_insert integer := 0;
 v_exist integer := 0;
BEGIN

for v_cargoestruct in (select c.idcargo,s.salario as importe,ge.idgrupocomplejidad as idgrupoescala,
c.idtipoescala as idescalasueldocargo from mod_estructuracomp.dat_cargo as c
inner join mod_estructuracomp.nom_cargo as nc on (c.idnomcargo = nc.idnomcargo)
inner join mod_estructuracomp.nom_salario as s on (s.idsalario = c.idsalario)
inner join mod_estructuracomp.nom_grupocomplejidad as ge on (s.idgrupocomplejidad = ge.idgrupocomplejidad)
inner join mod_estructuracomp.nom_tipoescala as te on (te.idtipoescala = c.idtipoescala)) loop
IF(v_cargoestruct IS NOT NULL) THEN
SELECT idcargo INTO v_cargoselementos FROM mod_nomina.conf_elementosalarialcargo as ceac
WHERE ceac.idcargo = v_cargoestruct.idcargo;
IF (v_cargoselementos IS NULL) THEN
raise notice 'Cargo estructura: % NO existe en nomina.',v_cargoestruct.idcargo;
--Insertar
INSERT INTO mod_nomina.conf_elementosalarialcargo(
idsistemapago, idperiodopago, idgrupoescala, idsectorsalarial, idescalasueldocargo,
importe, idcargo, tiposalarioescala)
    VALUES (12, 7, v_cargoestruct.idgrupoescala, 0, v_cargoestruct.idescalasueldocargo,
            v_cargoestruct.importe, v_cargoestruct.idcargo, 0);
v_insert := v_insert+1;
ELSE
raise notice 'Cargo % CONFIGURADO en nomina.',v_cargoestruct.idcargo;
SELECT idsistemapago INTO old_sistpago FROM mod_nomina.conf_elementosalarialcargo WHERE idcargo = v_cargoestruct.idcargo;
raise notice 'Sistema de pago cambiado de % a %.',old_sistpago,12;
UPDATE mod_nomina.conf_elementosalarialcargo SET idsistemapago=12 where idcargo = v_cargoestruct.idcargo;
v_exist := v_exist+1;
END IF;
   v_respuesta := 't';
END IF;
end loop;
raise notice 'Cantidad de cargos insertados: % , cantidad existentes: % .',v_insert,v_exist;
return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_escalaelemetossalariales_cargainicial (
)
RETURNS boolean AS
$body$
DECLARE
 v_respuesta boolean := 'f';
 v_cargo record;
 v_importe integer :=0;
 v_elementosalarialconceptarif record;
 v_cont integer :=0;
 v_cantconcepttarif integer;
BEGIN
for v_cargo in (SELECT c.idcargo, n.denominacion, cc.idcategocup,et.idescalatarifa, et.valorescalar, et.importe, cpdes.idconfconceptospdelementossalariales
                       FROM mod_estructuracomp.nom_cargo as n
				inner join mod_estructuracomp.dat_cargo as c on (n.idnomcargo = c.idnomcargo)
				inner join mod_estructuracomp.dat_cargocivil as cc on (c.idcargo = cc.idcargo)
				inner join mod_nomina.conf_elementosalarialcargo as esc on (c.idcargo = esc.idcargo)
				inner join mod_nomina.conf_conceptospdelementossalariales as cpdes on (esc.idelementosalarialcargo = cpdes.idelementosalarialcargo)
				inner join mod_nomina.nom_conceptopdtarifa as cpdt on (cpdes.idconceptopercepciondescuento = cpdt.idconceptopercepciondescuento )
				inner join mod_nomina.nom_escalatarifa as et on (cpdt.idconceptopdtarifa = et.idconceptopdtarifa)
			where et.idescalatarifa=311and cc.idcategocup =6) loop
if(v_cargo.importe is null )then
              v_cargo.importe:=0.00;
          end if;
IF(v_cargo IS NOT NULL) THEN
   SELECT idconfconceptospdelementossalariales into v_elementosalarialconceptarif FROM mod_nomina.conf_escalaelementosalarial WHERE idconfconceptospdelementossalariales = v_cargo.idconfconceptospdelementossalariales;
   if (v_elementosalarialconceptarif is null) then

            INSERT INTO mod_nomina.conf_escalaelementosalarial(idescalatarifa, idconfconceptospdelementossalariales, importe)
            VALUES (v_cargo.idescalatarifa, v_cargo.idconfconceptospdelementossalariales, v_cargo.importe);
             v_cont:=v_cont+1;
        else
          raise notice 'YA EXISTE LA ESCALA ASOCIADA AL CONCEPTO';
        end if;
    else
  raise notice 'No hay cargos con categoria de cuadros';
end if;
end loop;
raise notice 'Cantidad de escalas: %.',v_cont;
v_respuesta := 't';
   return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_escalaelemetossalarialespersona_cargainicial (
)
RETURNS boolean AS
$body$
/*--Tarifa de Almuerzo
cpdes.idconceptopercepciondescuento=133
*/
DECLARE
 v_respuesta boolean := 'f';
 v_cargo record;
 v_importe integer :=0;
 v_elementosalarialpersona record;
 v_cont integer :=0;
 v_cantconcepttarif integer;
BEGIN
for v_cargo in (SELECT n.idcargo, n.idpersona,  n.identidad, cpdes.idconfconceptospdelementossalariales
                       FROM mod_nomina.dat_cargosocupados as n
				inner join mod_nomina.conf_elementosalarialcargo as esc on (n.idcargo = esc.idcargo)
				inner join mod_nomina.conf_conceptospdelementossalariales as cpdes on (esc.idelementosalarialcargo = cpdes.idelementosalarialcargo)
			where cpdes.idconceptopercepciondescuento=133 and n.identidad = '200530666') loop
 
IF(v_cargo IS NOT NULL) THEN
   SELECT idconfescalaelementosalarialpersona into v_elementosalarialpersona FROM mod_nomina.conf_escalaelementosalarialpersona WHERE idconfconceptospdelementossalariales = v_cargo.idconfconceptospdelementossalariales;
   if (v_elementosalarialpersona is null) then
      
            INSERT INTO mod_nomina.conf_escalaelementosalarialpersona(idescalatarifa, idconfconceptospdelementossalariales, importe,fechainicio,idpersona)
            VALUES (63, v_cargo.idconfconceptospdelementossalariales, 0.60,now(),v_cargo.idpersona);
             v_cont:=v_cont+1;
        else
          raise notice 'YA EXISTE LA ESCALA ASOCIADA AL CONCEPTO';
        end if;
    else
  raise notice 'No hay cargos asociados a centro de costos';
end if;
end loop;
raise notice 'Cantidad de escalas: %.',v_cont;
v_respuesta := 't';
   return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_ordenar_variablestiporeportescertificaciones (
)
RETURNS boolean AS
$body$
DECLARE
 v_respuesta boolean := 'f';
 v_variables record;
 v_reportes record;
 v_cont numeric := 1;
BEGIN
for v_reportes in (SELECT distinct idconfreportescertificaciones FROM mod_nomina.conf_variablestiporeportescertificaciones order by idconfreportescertificaciones) loop
if(v_reportes.idconfreportescertificaciones is not null )then
	for v_variables in (SELECT idvariablesconfreportescertificaciones 
	                    FROM mod_nomina.conf_variablestiporeportescertificaciones 
	                    WHERE idconfreportescertificaciones = v_reportes.idconfreportescertificaciones order by idvariablesconfreportescertificaciones) loop
		UPDATE mod_nomina.conf_variablestiporeportescertificaciones
			SET orden=v_cont WHERE idvariablesconfreportescertificaciones = v_variables.idvariablesconfreportescertificaciones;
		v_cont:=v_cont+1;
	end loop;
end if;
v_cont:=1;
end loop;
v_respuesta := 't';
return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.ft_del_last_idp_ide (
)
RETURNS trigger AS
$body$
DECLARE
      v_cargoocupado record;
BEGIN
     IF (TG_OP = 'DELETE') THEN
-- Al eliminar de la tabla "dat_cargosocupados"
	SELECT OLD.idpersona||''||OLD.identidad AS denom, count(OLD.idpersona||''||OLD.identidad) AS cant
	INTO v_cargoocupado FROM mod_nomina.dat_cargosocupados
	WHERE (OLD.idpersona||''||OLD.identidad = idpersona||''||identidad::text)
	GROUP BY OLD.idpersona||''||OLD.identidad;
	--RAISE EXCEPTION 'denom: % , cant: %',v_cargoocupado.denom,v_cargoocupado.cant;
-- 1- Verificar si es la última ocurrencia del par "idpersona,identidad"
	IF (v_cargoocupado.cant = 1) THEN
--    1.1- V: Eliminar en "dat_retencionpersona" --FK (CASCADE)--> "his_retencionpersona"
	   DELETE FROM mod_nomina.dat_retencionpersona WHERE v_cargoocupado.denom = idpersona||''||identidad::text;
--	   V: Eliminar en "conf_vacacionespersona" , "dat_vacacionespersona" --FK (CASCADE)--> "his_vacacionespersona"
	   DELETE FROM mod_nomina.conf_vacacionespersona WHERE v_cargoocupado.denom = idpersona||''||idestructura::text;
	   DELETE FROM mod_nomina.dat_vacacionespersona WHERE v_cargoocupado.denom = idpersona||''||identidad::text;
--         V: Eliminar en "dat_registrosalariotiemposervcio"
	   DELETE FROM mod_nomina.dat_registrosalariotiemposervcio WHERE v_cargoocupado.denom = idpersona||''||idestructura::text;
	   RETURN OLD;
	ELSE
	    RAISE NOTICE '%',v_cargoocupado.denom;
	    --DELETE FROM mod_nomina.dat_cargosocupados WHERE idcargosocupados = OLD.idcargosocupados;
	END IF;
     /*
        SELECT cast(OLD.idcargosocupados as numeric) INTO v_idcargoocupado
        FROM mod_nomina.dat_cargosocupados
        WHERE NEW.idsituacionlaboral IS NULL AND OLD.idsituacionlaboral IS NOT NULL;
        PERFORM mod_nomina.f_del_elementosalarialsituacionservicio(v_idcargoocupado);
        --RAISE EXCEPTION '%',v_idcargoocupado;*/
      END IF;
      RETURN OLD;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.ft_upd_elementosalarialsituacionservicio (
)
RETURNS trigger AS
$body$
DECLARE
      v_idcargoocupado numeric(19,0);
BEGIN
     IF (TG_OP = 'UPDATE') THEN
        SELECT cast(OLD.idcargosocupados as numeric) INTO v_idcargoocupado
        FROM mod_nomina.dat_cargosocupados
        WHERE NEW.idsituacionlaboral IS NULL AND OLD.idsituacionlaboral IS NOT NULL;
        PERFORM mod_nomina.f_del_elementosalarialsituacionservicio(v_idcargoocupado);
        --RAISE EXCEPTION '%',v_idcargoocupado;
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

COMMENT ON SEQUENCE mod_nomina.dat_variablespersonaselaborarpagos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_variablespersonaselaborarpagos".';

COMMENT ON SEQUENCE mod_nomina.sec_areas_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_areas".';

COMMENT ON SEQUENCE mod_nomina.sec_calculopagoporresultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_calculopagoporresultado".';

COMMENT ON SEQUENCE mod_nomina.sec_calendario_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_calendario".';

COMMENT ON SEQUENCE mod_nomina.sec_cargospagoporresultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_cargospagoporresultado".';

COMMENT ON SEQUENCE mod_nomina.sec_causaexclusion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_causaexclusion".';

COMMENT ON SEQUENCE mod_nomina.sec_certificacionannoservc_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_certificacionannoservc".';

COMMENT ON SEQUENCE mod_nomina.sec_conceptopdtarifa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_conceptopdtarifa".';

COMMENT ON SEQUENCE mod_nomina.sec_conceptopdxestructura_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptopdxestructura".';

COMMENT ON SEQUENCE mod_nomina.sec_conceptopercepciondescuento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_conceptopercepciondescuento".';

COMMENT ON SEQUENCE mod_nomina.sec_conceptoretribucionmonetaria_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_conceptoretribucionmonetaria".';

COMMENT ON SEQUENCE mod_nomina.sec_conceptoscontables_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptoscontables".';

COMMENT ON SEQUENCE mod_nomina.sec_conceptoscontableselementosgasto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_conceptoscontableselementosgasto".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_cargostipopago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_cargostipopago".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_conceptosgeneralesnomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptosgeneralesnomina".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_conceptospdelementossalariales_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptospdelementossalariales".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_conceptospdformasysistemaspago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptospdformasysistemaspago".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_conceptosportiposysistemaspago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptosportiposysistemaspago".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_conceptpelementsalarialessituacionservicio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptpelementsalarialessituacionservicio".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_condicionesretenciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_condicionesretenciones".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_escalaelementosalarial_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_escalaelementosalarial".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_tiporeportescetificaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_tiporeportescertificaciones".';

COMMENT ON SEQUENCE mod_nomina.sec_conf_variablestiporeportescetificaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_variablestiporeportescertificaciones".';

COMMENT ON SEQUENCE mod_nomina.sec_confmodelonomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_modelonomina".';

COMMENT ON SEQUENCE mod_nomina.sec_confmodelonominacategoria_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_modelonominacategoria".';

COMMENT ON SEQUENCE mod_nomina.sec_contabilizacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_contabilizacion".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_cargosocupados_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_cargosocupados".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_elaborarpagos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_elaborarpagos".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_elementosreportescertificaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_elementosreportescertificaciones".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_nomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_nomina".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_nominaaprobacioncertificacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_nominaaprobacioncertificacion".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_nominadatos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_nominadatos".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_personaelaborarpagoscargosocupados_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personaelaborarpagoscargosocupados".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_personaselaborarpagos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personaselaborarpagos".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_registrosalariotiemposervicio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_registrosalariotiemposervcio".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_reportescertificaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_reportescertificaciones".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_vacacionespersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_vacacionespersona".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_variableauxconceptospdformasysistemaspago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_variableauxconceptospdformasysistemaspago".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_variablescondicionesretenciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_variablescondicionesretenciones".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_variableselementosreportescertificaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_variableselementosreportescertificaciones".';

COMMENT ON SEQUENCE mod_nomina.sec_dat_variablesformulavacacionesvariables_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_variablesformulavacacionesvariables".';

COMMENT ON SEQUENCE mod_nomina.sec_datosmodelonominaconceptos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_datosmodelonominaconceptos".';

COMMENT ON SEQUENCE mod_nomina.sec_datossbc_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_datossbc".';

COMMENT ON SEQUENCE mod_nomina.sec_dependenciaestructuraescalar_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_dependenciaestructuraescalar".';

COMMENT ON SEQUENCE mod_nomina.sec_desaprobarnominatraza_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_desaprobarnominatraza".';

COMMENT ON SEQUENCE mod_nomina.sec_elementosalarialcargo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_elementosalarialcargo".';

COMMENT ON SEQUENCE mod_nomina.sec_elementosalarialcargosituacionservicio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_elementosalarialsituacionservicio".';

COMMENT ON SEQUENCE mod_nomina.sec_escalaelementosalarialpersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_escalaelementosalarialpersona".';

COMMENT ON SEQUENCE mod_nomina.sec_escalaelementosalarialsituacionservicio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_escalaelementosalarialsituacionservicio".';

COMMENT ON SEQUENCE mod_nomina.sec_escalatarifa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_escalatarifa".';

COMMENT ON SEQUENCE mod_nomina.sec_estructuraescalar_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_estructuraescalar".';

COMMENT ON SEQUENCE mod_nomina.sec_estructuramodelosnomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_estructuramodelosnomina".';

COMMENT ON SEQUENCE mod_nomina.sec_formapago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_formapago".';

COMMENT ON SEQUENCE mod_nomina.sec_grupoescala_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_grupoescala".';

COMMENT ON SEQUENCE mod_nomina.sec_his_elementosreportescertificaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_elementosreportescertificaciones".';

COMMENT ON SEQUENCE mod_nomina.sec_his_retencionpersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_retencionpersona".';

COMMENT ON SEQUENCE mod_nomina.sec_his_vacacionespersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_vacacionespersona".';

COMMENT ON SEQUENCE mod_nomina.sec_his_variableselementosreportescertificaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_variableselementosreportescertificaciones".';

COMMENT ON SEQUENCE mod_nomina.sec_hiscargosocupados_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_cargosocupados".';

COMMENT ON SEQUENCE mod_nomina.sec_indicadorespagoporresultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_indicadorespagoporresultado".';

COMMENT ON SEQUENCE mod_nomina.sec_mes_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_mes".';

COMMENT ON SEQUENCE mod_nomina.sec_nom_nomencladoresnomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_nomencladores".';

COMMENT ON SEQUENCE mod_nomina.sec_nom_nomencladoresreferencia_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_nomencladorreferencia".';

COMMENT ON SEQUENCE mod_nomina.sec_nom_valornomencladoresreferencia_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_valoresnomencladorreferencia".';

COMMENT ON SEQUENCE mod_nomina.sec_pagosporresultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_pagosporresultadofechas".';

COMMENT ON SEQUENCE mod_nomina.sec_pagosporresultadoarea_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_pagosporresultadoarea".';

COMMENT ON SEQUENCE mod_nomina.sec_pagosporresultadoperiodopago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_pagosporresultadoperiodopago".';

COMMENT ON SEQUENCE mod_nomina.sec_periodopago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_periodopago".';

COMMENT ON SEQUENCE mod_nomina.sec_periodovacaciones_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_periodovacaciones".';

COMMENT ON SEQUENCE mod_nomina.sec_personacdgocontable_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_personacdgocontable".';

COMMENT ON SEQUENCE mod_nomina.sec_plantillanominal_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_plantillanominal".';

COMMENT ON SEQUENCE mod_nomina.sec_plantillanominalcargo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_plantillanominalcargo".';

COMMENT ON SEQUENCE mod_nomina.sec_registsalartiempservc_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_registsalartiempservc".';

COMMENT ON SEQUENCE mod_nomina.sec_reportecertificacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_reportecertificacion".';

COMMENT ON SEQUENCE mod_nomina.sec_retencionpersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_retencionpersona".';

COMMENT ON SEQUENCE mod_nomina.sec_salarioespecifico_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_salarioespecifico".';

COMMENT ON SEQUENCE mod_nomina.sec_sectorsalarial_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_sectorsalarial".';

COMMENT ON SEQUENCE mod_nomina.sec_seg_compartimentacioncargoportiponomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_compartimentacioncargoportiponomina".';

COMMENT ON SEQUENCE mod_nomina.sec_seg_compartimentacionnomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_compartimentacionnomina".';

COMMENT ON SEQUENCE mod_nomina.sec_sistemapago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_sistemapago".';

COMMENT ON SEQUENCE mod_nomina.sec_situacionlaboral_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_situacionlaboral".';

COMMENT ON SEQUENCE mod_nomina.sec_suerdoporcargo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_suerdoporcargoespecifico".';

COMMENT ON SEQUENCE mod_nomina.sec_tarifa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tarifa".';

COMMENT ON SEQUENCE mod_nomina.sec_tipoconceptopercepciondescuento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoconceptopercepciondescuento".';

COMMENT ON SEQUENCE mod_nomina.sec_tiponomina_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tiponomina".';

COMMENT ON SEQUENCE mod_nomina.sec_tipopago_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipopago".';

COMMENT ON SEQUENCE mod_nomina.sec_tiporetencion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tiporetencion".';

ALTER SEQUENCE mod_nomina.sec_vacacionespersona_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1 NO CYCLE;

COMMENT ON SEQUENCE mod_nomina.sec_vacacionespersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_vacacionespersona".';

COMMENT ON SEQUENCE mod_nomina.sec_variableauxiliarformula_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_variableauxiliarformula".';

COMMENT ON SEQUENCE mod_nomina.sec_variableglobal_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_variableglobal".';

COMMENT ON SEQUENCE mod_nomina.sec_variableglobalvalor_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_variableglobalvalor".';

COMMENT ON SEQUENCE mod_nomina.sec_vblesgblesregsaltmpserv_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_vblesgblesregsaltmpserv".';

CREATE TABLE mod_nomina.temp_datos (
  idconfconceptosportiposysistemaspago NUMERIC(19,0),
  idtipopago NUMERIC(19,0),
  idsistemapago NUMERIC(19,0),
  idconceptopercepciondescuento NUMERIC(19,0),
  identidad NUMERIC(19,0)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_afiliacionpolitica (
  idconfafiliacion NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_afiliacionpolitica_seq'::regclass) NOT NULL,
  idafiliacion NUMERIC(19,0) DEFAULT 0 NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  tipospagos VARCHAR(255) NOT NULL,
  idformula NUMERIC(19,0) NOT NULL,
  idformuladevengadototal NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_idconfafiliacion PRIMARY KEY(idconfafiliacion)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.conf_afiliacionpolitica
IS 'Almacena las afiliaciones.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.idconfafiliacion
IS 'Identificador de la tupla.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.idafiliacion
IS 'Identificador de la afiliacion.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.denominacion
IS 'Denominación de la afiliacion.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.tipospagos
IS 'Identificador de los tipos de pago.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.idformula
IS 'Identificador la formula.';

CREATE TABLE mod_nomina.conf_agrupadorareas (
  idagrupador NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_agrupadorareas_seq'::regclass) NOT NULL,
  idpagoporresultado NUMERIC(19,0) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  idformula NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_idagrupador PRIMARY KEY(idagrupador)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.nom_areas
  ADD COLUMN idestructura NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_areas
  ADD COLUMN orden NUMERIC(8,0);

ALTER TABLE mod_nomina.nom_areas
  ADD COLUMN composicion NUMERIC(1,0);

ALTER TABLE mod_nomina.nom_areas
  ADD COLUMN multipleseleccioncargos NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_nomina.nom_areas.multipleseleccioncargos
IS 'Columna para definir si se puede asociar a las plantillas nominales cargos asociados en otras plantillas: 1-Si 0-No';

CREATE TABLE mod_nomina.conf_asociacioncuentascontables (
  idasociacioncuentascont NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_asociacioncuentascontables_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idtiponomina NUMERIC(19,0) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  cuentasdeudoras VARCHAR(255) NOT NULL,
  cuentasacreedoras TEXT,
  CONSTRAINT pk_idasociacioncuentascont PRIMARY KEY(idasociacioncuentascont)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.conf_asociacioncuentascontables
IS 'Almacena las asociaciones de las cuentas contables.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.idasociacioncuentascont
IS 'Identificador de la tupla.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.identidad
IS ' Identificador de la entidad.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.idtiponomina
IS ' Identificador del tipo de nomina.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.cuentasdeudoras
IS 'Identificador de la cuenta deudora.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.cuentasacreedoras
IS 'Identificadores de los las cuentas acreedoras.';

CREATE TABLE mod_nomina.nom_billetes (
  idbillete NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_billetes_seq'::regclass) NOT NULL,
  denominacion NUMERIC(12,2) NOT NULL,
  orden NUMERIC(2,0) NOT NULL,
  activo NUMERIC(1,0) NOT NULL,
  idmoneda NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_billetes PRIMARY KEY(idbillete)
) 
WITH (oids = false);

CREATE INDEX idx_idmoneda ON mod_nomina.nom_billetes
  USING btree (idmoneda);

CREATE TABLE mod_nomina.conf_camposreportecorreo (
  idcamporeportecorreo NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_camposreportecorreo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  idformula NUMERIC(19,0) NOT NULL,
  orden NUMERIC(19,0),
  descripcion VARCHAR(255),
  mostrarvacaciones NUMERIC(1,0),
  mostrarsnc NUMERIC(1,0),
  estotal NUMERIC(1,0),
  CONSTRAINT pk_idcamporeportecorreo PRIMARY KEY(idcamporeportecorreo)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_camposreportecorreoentidad (
  idcamporeportecorreoentidad NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_camposreportecorreoentidad_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idcamporeportecorreo NUMERIC(19,0),
  CONSTRAINT pk_idcamporeportecorreoentidad PRIMARY KEY(idcamporeportecorreoentidad)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_camposreportecorreoentidad
  ALTER COLUMN idcamporeportecorreo SET STATISTICS 0;

CREATE TABLE mod_nomina.conf_cargoscertificacionincremento (
  idcargoscertificacionincremento NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_cargoscertificacionincremento_seq'::regclass) NOT NULL,
  idcargo NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_idcargoscertificacionincremento PRIMARY KEY(idcargoscertificacionincremento)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_certificacionannoservc
  ALTER COLUMN annosservc TYPE NUMERIC(4,0);

ALTER TABLE mod_nomina.conf_certificacionannoservc
  ADD COLUMN mesesservicio NUMERIC(2,0);

ALTER TABLE mod_nomina.conf_certificacionannoservc
  ADD COLUMN antuguedad VARCHAR(10);

ALTER TABLE mod_nomina.conf_certificacionannoservc
  ADD COLUMN annosserventidad VARCHAR(10);

ALTER TABLE mod_nomina.conf_certificacionannoservc
  ADD COLUMN reporteantiguedad BOOLEAN;

ALTER TABLE mod_nomina.nom_conceptoretribucionmonetaria
  ADD COLUMN idparrafofiscal NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_conceptoretribucionmonetaria
  ADD COLUMN idclienteproveedorcobropago NUMERIC(19,0);

CREATE TABLE mod_nomina.conf_conceptospdsituacionesservicio (
  idconceptospdsituacionesservicio NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_conceptospdsituacionesservicio_seq'::regclass) NOT NULL,
  idsituacionservicio NUMERIC(19,0) NOT NULL,
  idconceptopercepciondescuento NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_conceptospdsituacionesservicio_pkey PRIMARY KEY(idconceptospdsituacionesservicio)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_cuentasaperturapersona (
  idcuentaaperturapersona NUMERIC DEFAULT nextval('mod_nomina.sec_conf_cuentaaperturapersona_seq'::regclass) NOT NULL,
  idcuenta NUMERIC,
  idestructura NUMERIC,
  descripcion VARCHAR(255),
  tipoapertura NUMERIC(2,0),
  CONSTRAINT pk_cuentadesglosepersona PRIMARY KEY(idcuentaaperturapersona)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_exportacionbanco (
  idconfexportaciondbfbanco NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_conf_exportacionbanco_seq'::regclass) NOT NULL,
  idbanco NUMERIC(19,0) NOT NULL,
  tipocampo VARCHAR(255) NOT NULL,
  denomcampo VARCHAR(255) NOT NULL,
  tipodato NUMERIC(19,0) NOT NULL,
  longitudvalor NUMERIC(19,0) NOT NULL,
  tipofichero NUMERIC(19,0) NOT NULL,
  lugaresdecimales NUMERIC(19,0) DEFAULT 0 NOT NULL,
  identidad NUMERIC(19,0) DEFAULT 0 NOT NULL,
  orden NUMERIC(19,0) DEFAULT 1,
  idconfexportaciondbfbancoficheroentidad NUMERIC(19,0) DEFAULT 0,
  CONSTRAINT pk_confexportaciondbfbanco PRIMARY KEY(idconfexportaciondbfbanco)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_exportacionbancoficheroentidad (
  idconfexportaciondbfbancoficheroentidad NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_conf_exportacionbancoficheroentidad_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) DEFAULT 0 NOT NULL,
  fichero VARCHAR(255),
  CONSTRAINT pk_confexportaciondbfbancofichero PRIMARY KEY(idconfexportaciondbfbancoficheroentidad)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ALTER COLUMN idconfreportescertificaciones DROP DEFAULT;

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ALTER COLUMN idconfreportescertificaciones TYPE NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ALTER COLUMN idconfreportescertificaciones SET DEFAULT nextval('mod_nomina.sec_conf_tiporeportescetificaciones_seq'::regclass);

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ADD COLUMN mesessnc NUMERIC(2,0);

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ADD COLUMN tiposeleccionpersonas NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ADD COLUMN cargoprincipal NUMERIC(1,0) DEFAULT 1;

COMMENT ON COLUMN mod_nomina.conf_tiporeportescertificaciones.cargoprincipal
IS 'Columna para definir si se va a gestionar las personas solo por el cargo principal o por el cargo principal y ademas el  cargo pluriempleado';

CREATE TABLE mod_nomina.dat_convenio (
  idconvenio NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_convenio_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  fechainicio DATE,
  fechafin DATE,
  descripcion VARCHAR(255),
  identidad NUMERIC(19,0) DEFAULT 0 NOT NULL,
  numeroconvenio NUMERIC(19,0) DEFAULT 0 NOT NULL,
  porcientoejecucion NUMERIC(5,2),
  salario NUMERIC(19,2),
  penalizacion NUMERIC(3,0),
  definido NUMERIC(1,0) DEFAULT 0,
  aprobado NUMERIC(1,0) DEFAULT 0 NOT NULL,
  idobra NUMERIC(19,0),
  horas NUMERIC(19,2),
  CONSTRAINT dat_convenio_pkey PRIMARY KEY(idconvenio),
  CONSTRAINT chk_aprobado CHECK ((aprobado = (0)::numeric) OR (aprobado = (1)::numeric))
) 
WITH (oids = false);

ALTER TABLE mod_nomina.dat_cargosocupados
  ADD COLUMN idcentrocosto NUMERIC DEFAULT 0 NOT NULL;

ALTER INDEX mod_nomina.dat_cargosocupados_pkey
  RENAME TO pk_cargosocupados;

CREATE TABLE mod_nomina.dat_personaestructuranominacobrosypagos (
  idpersonaestructuranominacobrosypagos NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0),
  idestructuramodelodomina NUMERIC(19,0),
  iddocumentoobligacion NUMERIC(19,0),
  idcuenta NUMERIC(19,0),
  estado NUMERIC(1,0),
  importe NUMERIC(19,2),
  CONSTRAINT pk_personaestructuranominacobrosypagos PRIMARY KEY(idpersonaestructuranominacobrosypagos)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.dat_vacacionespersona
  ALTER COLUMN tiempoacumuladoinicial TYPE NUMERIC(19,4);

ALTER TABLE mod_nomina.dat_vacacionespersona
  ALTER COLUMN importeacumuladoinicial TYPE NUMERIC(19,4);

CREATE TABLE mod_nomina.dat_cargoincrementomensual (
  idcargoincrementomensual NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_datcargoincrementomensual_seq'::regclass) NOT NULL,
  idcargo NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_dcargoincrementomensual PRIMARY KEY(idcargoincrementomensual)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.dat_elaborarpagosreferencia (
  idelaborarpagos NUMERIC(19,0) NOT NULL,
  idelaborarpagosreferenciados NUMERIC(19,0) NOT NULL,
  idelaborarpagosreferencia NUMERIC DEFAULT nextval('mod_nomina.sec_datelaborarpagoreferencia_seq'::regclass) NOT NULL,
  CONSTRAINT pk_idelaborarpagosreferencia PRIMARY KEY(idelaborarpagosreferencia)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.nom_especialidad (
  idespecialidad NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_especialidad_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  fechainicio DATE NOT NULL,
  fechafin DATE,
  CONSTRAINT pk_especialidad PRIMARY KEY(idespecialidad)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.nom_especialidad
IS 'Almacena las especialidades.';

COMMENT ON COLUMN mod_nomina.nom_especialidad.idespecialidad
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_nomina.nom_especialidad.denominacion
IS 'Denominación de la especialidad.';

COMMENT ON COLUMN mod_nomina.nom_especialidad.descripcion
IS 'Descripción de la especialidad.';

COMMENT ON COLUMN mod_nomina.nom_especialidad.fechainicio
IS 'Fecha de inicio de uso de la especialidad.';

COMMENT ON COLUMN mod_nomina.nom_especialidad.fechafin
IS 'Fecha de fin de uso de la especialidad.';

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ALTER COLUMN textoformula TYPE VARCHAR COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN acumulaliquida NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN controldatosnomina NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN esconceptopagosalario NUMERIC(1,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN escampopersona VARCHAR(30);

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN valoresnegativos NUMERIC(1,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN descuento NUMERIC(1,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN incluirconcepto NUMERIC(1,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN vacacionesdiasimporte NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_nomina.conf_estructuramodelosnomina.vacacionesdiasimporte
IS '0- no acumula, 1- días, 2-importe.';

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN ordenreporte NUMERIC(3,0);

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN sc_4_06 NUMERIC(1,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN sc_4_01 NUMERIC(1,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN correo NUMERIC(1,0) DEFAULT 1;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN talonario NUMERIC(1,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN periodobusquedareferencianomina NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN comportamientocorreo NUMERIC(1,0) DEFAULT 1;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN descripcion VARCHAR(255);

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN sumapluriempleo NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN tiporeferencia NUMERIC(1,0);

COMMENT ON COLUMN mod_nomina.conf_estructuramodelosnomina.tiporeferencia
IS '1. Referencias por rangos de fechas
2. Referencias especificas de los periodos de pago';

CREATE TABLE mod_nomina.dat_fechascierreperiodos (
  idfechascierre NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_fechascierreperiodos_seq'::regclass) NOT NULL,
  fechacierre DATE NOT NULL,
  estado NUMERIC(1,0) DEFAULT 1 NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  personascaja VARCHAR,
  personascajero VARCHAR,
  montocajacup NUMERIC(10,2) NOT NULL,
  montocajacuc NUMERIC(10,2) NOT NULL,
  montocajerocup NUMERIC(10,2) NOT NULL,
  montocajerocuc NUMERIC(10,2) NOT NULL,
  estadobancocup NUMERIC(1,0) DEFAULT 1 NOT NULL,
  estadocajacup NUMERIC(1,0) DEFAULT 1 NOT NULL,
  estadobancocuc NUMERIC(1,0) DEFAULT 1,
  estadocajacuc NUMERIC(1,0) DEFAULT 1,
  CONSTRAINT pk_fechascierreperiodos PRIMARY KEY(idfechascierre),
  CONSTRAINT chk_estado CHECK ((estado = (1)::numeric) OR (estado = (2)::numeric))
) 
WITH (oids = false);

CREATE TABLE mod_nomina.his_cargoincrementomensual (
  idhiscargoincrementomensual NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_hiscargoincrementomensual_seq'::regclass) NOT NULL,
  idcargo NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  fecha DATE DEFAULT now() NOT NULL,
  CONSTRAINT pk_hcargoincrementomensual PRIMARY KEY(idhiscargoincrementomensual)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.his_cargoscertificacionincremento (
  idhiscargoscertificacionincremento NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_hiscargoscertificacionincremento_seq'::regclass) NOT NULL,
  idcargo NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  fdesde DATE DEFAULT now() NOT NULL,
  CONSTRAINT pk_hiscargoscertificacionincremento PRIMARY KEY(idhiscargoscertificacionincremento)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.his_certificacionannoservc (
  idcertificacionannoservch NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_hiscertificacionannoservc_seq'::regclass) NOT NULL,
  faltaentidad DATE DEFAULT now() NOT NULL,
  annosservc NUMERIC(4,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  mesesservicio NUMERIC(2,0),
  antuguedad VARCHAR(10),
  fecha DATE DEFAULT now() NOT NULL,
  annosserventidad NUMERIC(3,0),
  mesesserventidad NUMERIC(3,1),
  incremento NUMERIC(2,1),
  annosserventidadincremental NUMERIC(3,0),
  mesesserventidadincremental NUMERIC(3,1),
  CONSTRAINT pk_certificacionannoservch PRIMARY KEY(idcertificacionannoservch)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_nomina.his_certificacionannoservc.idcertificacionannoservch
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_nomina.his_certificacionannoservc.faltaentidad
IS 'Fecha de alta de la persona en la entidad.';

COMMENT ON COLUMN mod_nomina.his_certificacionannoservc.annosservc
IS 'Años de servicio, con posible presición de meses. Ej: 3,10 (tres años y diez meses).';

COMMENT ON COLUMN mod_nomina.his_certificacionannoservc.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_nomina.his_certificacionannoservc.identidad
IS 'Identificador de la entidad.';

COMMENT ON COLUMN mod_nomina.his_certificacionannoservc.mesesservicio
IS 'Meses de servicio en la entidad.';

COMMENT ON COLUMN mod_nomina.his_certificacionannoservc.antuguedad
IS 'Antiguedad general,con posible presición de meses. Ej: 3,10 (tres años y diez meses).';

COMMENT ON COLUMN mod_nomina.his_certificacionannoservc.fecha
IS 'Fecha en que se añadió al histórico.';

CREATE INDEX fki_his_certificacionannoservc ON mod_nomina.his_certificacionannoservc
  USING btree (idcertificacionannoservch);

CREATE TABLE mod_nomina.his_personacertificacionincremento (
  idhispersonacertificacionincremento NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_hispersonacertificacionincremento_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  incremento NUMERIC(2,1),
  fdesde DATE DEFAULT now() NOT NULL,
  fecha DATE NOT NULL,
  annosserventidadincremental NUMERIC(3,0),
  mesesserventidadincremental NUMERIC(3,1),
  CONSTRAINT pk_hispersonacertificacionincremento PRIMARY KEY(idhispersonacertificacionincremento)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_personasnocertificadasannosresvicio (
  idspersonasnocertificadasannosservicio NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_hispersonasnocertificadasannosresvicio_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  fechanocertificacion DATE DEFAULT now() NOT NULL,
  incremento NUMERIC(2,1) NOT NULL,
  CONSTRAINT pk_personasnocertificadasannosservicio PRIMARY KEY(idspersonasnocertificadasannosservicio)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.nom_nivelactiveconom (
  idnivelactiveconom NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_nivelactiveconom_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  fechainicio DATE NOT NULL,
  fechafin DATE,
  CONSTRAINT pk_partidagasto PRIMARY KEY(idnivelactiveconom)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.nom_nivelactiveconom
IS 'Almacena los niveles de actividad económica.';

COMMENT ON COLUMN mod_nomina.nom_nivelactiveconom.idnivelactiveconom
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_nomina.nom_nivelactiveconom.denominacion
IS 'Denominación de la partida de gasto.';

COMMENT ON COLUMN mod_nomina.nom_nivelactiveconom.descripcion
IS 'Descripción de la partida de gasto.';

COMMENT ON COLUMN mod_nomina.nom_nivelactiveconom.fechainicio
IS 'Fecha de inicio de uso de la partida de gasto.';

COMMENT ON COLUMN mod_nomina.nom_nivelactiveconom.fechafin
IS 'Fecha de fin de uso de la partida de gasto.';

CREATE TABLE mod_nomina.nom_obra (
  idobra NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_obra_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255),
  descripcion VARCHAR(500),
  fechainicio DATE NOT NULL,
  fechafin DATE,
  CONSTRAINT pk_obra PRIMARY KEY(idobra)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.nom_periodopago
  ADD COLUMN cantperiodo NUMERIC(2,0);

COMMENT ON COLUMN mod_nomina.nom_periodopago.cantperiodo
IS 'Cantidad de períodos.';

ALTER TABLE mod_nomina.nom_periodopago
  ADD COLUMN tipoperiodo NUMERIC(2,0) DEFAULT 0;

CREATE TABLE mod_nomina.dat_periodosdestajo (
  idperiodosdestajo NUMERIC(3,0) DEFAULT nextval('mod_nomina.sec_periodosdestajo_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idpagoresultado NUMERIC(19,0) NOT NULL,
  fechainicio DATE NOT NULL,
  fechafin DATE,
  CONSTRAINT pk_periodosdestajo PRIMARY KEY(idperiodosdestajo)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.his_personabaja (
  idpersonabaja NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_personabaja_seq'::regclass) NOT NULL,
  tiempoacumuladoinicial NUMERIC(19,4),
  importeacumuladoinicial NUMERIC(19,4),
  idpersona NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idplantillanominal NUMERIC(19,0),
  idcodigocontable NUMERIC(19,0),
  CONSTRAINT pk_hpersonabaja PRIMARY KEY(idpersonabaja)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_personacdgocontable
  ALTER COLUMN cdgocontable TYPE VARCHAR COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.conf_personacdgocontable
  ALTER COLUMN cdgocontable SET STORAGE EXTENDED;

ALTER TABLE mod_nomina.conf_personacdgocontable
  ALTER COLUMN cdgocontable DROP NOT NULL;

CREATE TABLE mod_nomina.conf_personacertificacionincremento (
  idpersonacertificacionincremento NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_personacertificacionincremento_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  incremento NUMERIC(2,1),
  fecha DATE DEFAULT now() NOT NULL,
  annosserventidadincremental NUMERIC(3,0),
  mesesserventidadincremental NUMERIC(3,1),
  CONSTRAINT pk_personacertificacionincremento PRIMARY KEY(idpersonacertificacionincremento)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.his_personasnocertificadasannosresvicio (
  idhispersonasnocertificadasannosservicio NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_personasnocertificadasannosresvicio_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  fechanocertificacion DATE DEFAULT now() NOT NULL,
  incremento NUMERIC(2,1) NOT NULL,
  CONSTRAINT pk_hispersonasnocertificadasannosservicio PRIMARY KEY(idhispersonasnocertificadasannosservicio)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_plantillanominal
  ADD COLUMN esbrigada NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_plantillanominal
  ADD COLUMN orden NUMERIC(19,0) DEFAULT 0;

CREATE TABLE mod_nomina.seg_compartcargocategoria (
  idcompartcargocategoria NUMERIC DEFAULT nextval('mod_nomina.sec_seg_compartcargocategoria_seq'::regclass) NOT NULL,
  idcargo NUMERIC(19,0) NOT NULL,
  idcategoria NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_compartcargocategoria PRIMARY KEY(idcompartcargocategoria)
) 
WITH (oids = false);

CREATE INDEX idx_idcategoria_compartcargocategoria ON mod_nomina.seg_compartcargocategoria
  USING btree (idcategoria);

ALTER TABLE mod_nomina.nom_tiponomina
  ALTER COLUMN acumulavacaciones SET DEFAULT 1;

ALTER TABLE mod_nomina.nom_tiponomina
  ADD COLUMN operacioncontablecuentasporcobrar NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_tiponomina
  ADD COLUMN acumulasnc NUMERIC(1,0) DEFAULT 2;

ALTER TABLE mod_nomina.nom_tiponomina
  ADD COLUMN reintegro NUMERIC(1,0) DEFAULT 2 NOT NULL;

CREATE TABLE mod_nomina.nom_tipopartidagasto (
  idtipopartidagasto NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_tipopartidagasto_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  fechainicio DATE NOT NULL,
  fechafin DATE,
  CONSTRAINT pk_tipopartidagasto PRIMARY KEY(idtipopartidagasto)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.nom_tipopartidagasto
IS 'Almacena los tipos de partida de gasto.';

COMMENT ON COLUMN mod_nomina.nom_tipopartidagasto.idtipopartidagasto
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_nomina.nom_tipopartidagasto.denominacion
IS 'Denominación del tipo de partida de gasto.';

COMMENT ON COLUMN mod_nomina.nom_tipopartidagasto.descripcion
IS 'Descripción del tipo de partida de gasto.';

COMMENT ON COLUMN mod_nomina.nom_tipopartidagasto.fechainicio
IS 'Fecha de inicio de uso del tipo de partida de gasto.';

COMMENT ON COLUMN mod_nomina.nom_tipopartidagasto.fechafin
IS 'Fecha de fin de uso del tipo de partida de gasto.';

ALTER TABLE mod_nomina.nom_tiporetencion
  ADD COLUMN orden NUMERIC(2,0);

ALTER TABLE mod_nomina.nom_tiporetencion
  ADD COLUMN tienelimitemaximo NUMERIC(1,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.nom_tiporetencion
  ADD COLUMN cuentacontable NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_tiporetencion
  ADD COLUMN cobrosypagos NUMERIC(1,0) DEFAULT 0;

CREATE TABLE mod_nomina.conf_vacacionespersona (
  idvacacionespersona NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_vacacionespersona_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_vacacionespersona PRIMARY KEY(idvacacionespersona)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.conf_vacacionespersona
IS 'Almacena la validación del submayor de vacaciones.';

COMMENT ON COLUMN mod_nomina.conf_vacacionespersona.idvacacionespersona
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_nomina.conf_vacacionespersona.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_nomina.conf_vacacionespersona.idestructura
IS 'Identificador de la estructura.';

CREATE TABLE mod_nomina.his_vacacionespersonabaja (
  idhisvacacionespersonabaja NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_vacacionespersonabaja_seq'::regclass) NOT NULL,
  idpersonabaja NUMERIC(19,0) NOT NULL,
  idnomina NUMERIC(19,0) NOT NULL,
  tipooperacion NUMERIC(19,0) DEFAULT 1 NOT NULL,
  fechaoperacion DATE NOT NULL,
  tiempoacumulado NUMERIC(19,2) NOT NULL,
  importeacumulado NUMERIC(19,2) NOT NULL,
  saldoentiempo NUMERIC(19,2) NOT NULL,
  saldoenimporte NUMERIC(19,2) NOT NULL,
  ajusteimporte NUMERIC(19,2),
  ajustetiempo NUMERIC(19,2),
  tipoajuste NUMERIC(1,0),
  observaciones VARCHAR(255),
  periodo VARCHAR(20),
  CONSTRAINT pk_vacacionespersonabaja PRIMARY KEY(idhisvacacionespersonabaja)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.nom_variableglobal
  ADD COLUMN calculosubsidio NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_nomina.nom_variableglobal.calculosubsidio
IS 'Identificador del tipo de reporte, 0- Todos, 1- subsidio, 2- Lic maternidad';

CREATE TABLE mod_nomina.conf_formulasareasmontos (
  idformulaareamonto NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_formulasareasmontos_seq'::regclass) NOT NULL,
  idagrupadorarea NUMERIC(19,0) NOT NULL,
  idarea NUMERIC(19,0) NOT NULL,
  idformula NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_idformulaareamonto PRIMARY KEY(idformulaareamonto)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.nom_areascargos (
  idareacargos NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_areascargos_seq'::regclass) NOT NULL,
  idarea NUMERIC(19,0) NOT NULL,
  idcargo NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_idarea_cargo PRIMARY KEY(idarea, idcargo)
) 
WITH (oids = false);

CREATE INDEX idx_areascargos ON mod_nomina.nom_areascargos
  USING btree (idcargo);

CREATE INDEX idx_idarea_areascargos ON mod_nomina.nom_areascargos
  USING btree (idarea);

CREATE INDEX idx_idcargo_areascargos ON mod_nomina.nom_areascargos
  USING btree (idcargo);

CREATE TABLE mod_nomina.seg_trazacertificacionannoservc (
  idtrazacertificacionannoservc NUMERIC DEFAULT nextval('mod_nomina.sec_trazacertificacionannoservc_seq'::regclass) NOT NULL,
  idcertificacionannoservc NUMERIC(19,0) NOT NULL,
  idusuario NUMERIC(19,0) NOT NULL,
  annosajuste NUMERIC(3,0) DEFAULT 0 NOT NULL,
  mesesajuste NUMERIC(2,0) DEFAULT 0 NOT NULL,
  fecha DATE DEFAULT now() NOT NULL,
  CONSTRAINT pk_trazacertificacionannoservc PRIMARY KEY(idtrazacertificacionannoservc)
) 
WITH (oids = false);

CREATE INDEX idx_idcertificacionannoservc_trazacertificacionannoservc ON mod_nomina.seg_trazacertificacionannoservc
  USING btree (idcertificacionannoservc);

ALTER TABLE mod_nomina.dat_reportescertificaciones
  ADD COLUMN descripcion VARCHAR(255);

ALTER TABLE mod_nomina.dat_reportescertificaciones
  ADD COLUMN datos TEXT;

ALTER TABLE mod_nomina.his_reportecertificacion
  ADD COLUMN descripcion VARCHAR(255);

ALTER TABLE mod_nomina.nom_tipopago
  ADD COLUMN ultimopagoenperiodo NUMERIC DEFAULT 0;

ALTER TABLE mod_nomina.nom_tipopago
  ADD COLUMN idconfreportescertificaciones NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_tipopago
  ADD COLUMN sepagaadelantado NUMERIC DEFAULT 0;

ALTER TABLE mod_nomina.nom_tipopago
  ADD COLUMN consecutivonomina NUMERIC(19,0) DEFAULT 0;

ALTER TABLE mod_nomina.nom_tipopago
  ADD COLUMN pagoxresultadosdestajo NUMERIC(1,0) DEFAULT 1;

ALTER TABLE mod_nomina.nom_tipopago
  ADD COLUMN orden NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_tipopago
  ALTER COLUMN orden SET STATISTICS 0;

CREATE TABLE mod_nomina.dat_modeloconveniocolectivo (
  idmodeloconveniocolectivo NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_modeloconveniocolectivo_seq'::regclass) NOT NULL,
  grupoescala VARCHAR(255) NOT NULL,
  tarifamn NUMERIC(3,2),
  htrabajadas DOUBLE PRECISION,
  cpl DOUBLE PRECISION,
  sbc DOUBLE PRECISION,
  salarioapagar DOUBLE PRECISION,
  idpersona NUMERIC(19,0),
  idconvenio NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_modeloconveniocolectivo PRIMARY KEY(idmodeloconveniocolectivo)
) 
WITH (oids = false);

CREATE INDEX fki_convenio_modconvcolect_idconvenio ON mod_nomina.dat_modeloconveniocolectivo
  USING btree (idconvenio);

CREATE TABLE mod_nomina.dat_modeloconvenioindividual (
  idmodeloconvenioindividual NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_modeloconvenioindividual_seq'::regclass) NOT NULL,
  grupoescala VARCHAR(255) NOT NULL,
  tarifamn NUMERIC(3,2),
  porcientoejecutado DOUBLE PRECISION,
  salariocreado DOUBLE PRECISION,
  sbc DOUBLE PRECISION,
  cdsmn DOUBLE PRECISION,
  salarioapagar DOUBLE PRECISION,
  idpersona NUMERIC(19,0),
  idconvenio NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_modeloconvenioindividual PRIMARY KEY(idmodeloconvenioindividual)
) 
WITH (oids = false);

CREATE INDEX fki_convenio_modconvindiv_idconvenio ON mod_nomina.dat_modeloconvenioindividual
  USING btree (idconvenio);

CREATE INDEX fki_persona_modconvindiv_idpersona ON mod_nomina.dat_modeloconvenioindividual
  USING btree (idpersona);

CREATE TABLE mod_nomina.conf_estructuramodelosnominaentidad (
  idestructuramodelosnominaentidad NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_estructuramodelosnominaentidad_seq'::regclass) NOT NULL,
  idestructuramodelodomina NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_estrucmodelonoment PRIMARY KEY(idestructuramodelosnominaentidad)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idpartidagasto NUMERIC(19,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN mostrardescuento NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idparrafofiscal NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idclienteproveedorcobropago NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idtienecobrospagos NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idtipocobrospagos NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idtipointegracioncobrospagos NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN cuentacontable NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN liquidacobrosypagos NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idcampoliquidaobligacion NUMERIC(19,0);

COMMENT ON COLUMN mod_nomina.conf_conceptoscontables.idcampoliquidaobligacion
IS 'Campo de la estructura de nomina que liquida una obligacion';

ALTER TABLE mod_nomina.dat_datosmodelonominaconceptos
  ALTER COLUMN idconcepto TYPE VARCHAR(255) COLLATE pg_catalog."default";

CREATE TABLE mod_nomina.dat_reintegropersona (
  idreintegropersona NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_reintegropersona_seq'::regclass) NOT NULL,
  fecha DATE DEFAULT now() NOT NULL,
  operacion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  importe NUMERIC(10,2) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  idtiponomina NUMERIC(19,0) NOT NULL,
  tipomoneda VARCHAR(10),
  idfechacierre NUMERIC(19,0),
  idelaborarpagos NUMERIC,
  idcuenta NUMERIC(19,0),
  iddocumentoobligacion NUMERIC(19,0),
  CONSTRAINT pk_reintegropersona PRIMARY KEY(idreintegropersona),
  CONSTRAINT chk_operacion_reintegropersona CHECK ((operacion = (1)::numeric) OR (operacion = (2)::numeric))
) 
WITH (oids = false);

CREATE INDEX fki_idfechacierre ON mod_nomina.dat_reintegropersona
  USING btree (idfechacierre);

ALTER TABLE mod_nomina.conf_calendario
  SET WITH OIDS;

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN min NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN max NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN calculable NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN idexpresionmatematica NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN descripcion VARCHAR;

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN mesessnc NUMERIC(2,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN orden NUMERIC(10,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN calculablehistoriconominasreportes NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN idexpresionmatematicahistoriconominasreportes NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN tiposnomina VARCHAR(500);

COMMENT ON COLUMN mod_nomina.conf_plantillanominalcargo.idcargo
IS 'Identificador del cargo de estructura y composición.';

ALTER TABLE mod_nomina.nom_salarioescala
  ADD COLUMN idsalarioescala NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_salarioescala_seq'::regclass) NOT NULL;

ALTER TABLE mod_nomina.nom_conceptopercepciondescuento
  ADD COLUMN esdescuentoaplicarunaves NUMERIC DEFAULT 0;

ALTER TABLE mod_nomina.nom_conceptopercepciondescuento
  ADD COLUMN formulaaplicardescuentounaves NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_condicionesretenciones
  ALTER COLUMN formulacumpleretenciones SET NOT NULL;

CREATE TABLE mod_nomina.conf_nivelactiveconom (
  idnivelactiveconom NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_confnivelactiveconom_seq'::regclass) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  idtiponomina NUMERIC(19,0) NOT NULL,
  idcentrogrupo NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_nivelactiveconom PRIMARY KEY(idnivelactiveconom)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.conf_nivelactiveconom
IS 'Entidad para relacionar los modelos de nóminas con sus categorías.';

CREATE TABLE mod_nomina.dat_partidagasto (
  idpartidagastoespecialidad NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_partidagastoespecialidad_seq'::regclass) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  idtiponomina NUMERIC(3,0) NOT NULL,
  cantpersonas NUMERIC(5,0) DEFAULT 0 NOT NULL,
  valor NUMERIC(8,2) DEFAULT 0 NOT NULL,
  cajacajero NUMERIC(1,0) DEFAULT 0 NOT NULL,
  idespecialidad NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_partidagastoespecialidad PRIMARY KEY(idpartidagastoespecialidad)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.dat_partidagasto
IS 'Almacena las partidas de gasto con la especialidad.';

COMMENT ON COLUMN mod_nomina.dat_partidagasto.idpartidagastoespecialidad
IS 'Identificador de la tabla.';

ALTER TABLE mod_nomina.conf_registsalartiempservc
  ADD COLUMN expresionmatemimportdevengado NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_retencionpersona
  ADD COLUMN activo NUMERIC(1,0) DEFAULT 1 NOT NULL;

ALTER TABLE mod_nomina.dat_retencionpersona
  ADD COLUMN idcomprobante NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_retencionpersona
  ADD COLUMN iddocumentoobligacion NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_retencionpersona
  ADD COLUMN idcuenta NUMERIC(19,0);

CREATE TABLE mod_nomina.his_datretencionpersona (
  idhisdatretencionpersona NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_his_datretencionpersona_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idtiporetencion NUMERIC(3,0) NOT NULL,
  saldoinicial NUMERIC(19,2),
  mensualidad NUMERIC(19,2),
  ultmensualidad NUMERIC(19,2),
  refdocumentoacredita VARCHAR(255),
  fechadocumento DATE,
  fechainicio DATE NOT NULL,
  fechafin DATE,
  prioridad NUMERIC,
  CONSTRAINT pk_hisdatretencionpersona PRIMARY KEY(idhisdatretencionpersona)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.his_datretencionpersona
IS 'Entidad para registrar las retenciones asociadas a una persona.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.idhisdatretencionpersona
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.identidad
IS 'Identificador de la entidad.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.idtiporetencion
IS 'Identificador del tipo de retención.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.saldoinicial
IS 'Saldo inicial de la retención.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.mensualidad
IS 'Mensualidad que se abonará.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.ultmensualidad
IS 'Importe de la última mensualidad que se abonará.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.refdocumentoacredita
IS 'Referencia del documento que certifica esa retención.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.fechadocumento
IS 'Fecha del documento que certifica la retención.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.fechainicio
IS 'Fecha de inicio de la retención.';

COMMENT ON COLUMN mod_nomina.his_datretencionpersona.fechafin
IS 'Fecha de fin de la retención.';

ALTER TABLE mod_nomina.dat_elementosreportescertificaciones
  ADD COLUMN idcargo NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_elaborarpagos
  ADD COLUMN idcomprobanteoperaciones NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_elaborarpagos
  ADD COLUMN numerocomprobanteoperaciones NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_elaborarpagos
  ADD COLUMN idcomprobantecancelacion NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_elaborarpagos
  ADD COLUMN numerocomprobantecancelacion NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_elaborarpagos
  ADD COLUMN idcomprobantecuentasporcobrar NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_elaborarpagos
  ADD COLUMN numerocomprobantecuentaxcobrar NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_elaborarpagos
  ADD COLUMN descripcion VARCHAR(500);

COMMENT ON COLUMN mod_nomina.dat_elaborarpagos.descripcion
IS 'Descripción.';

CREATE TABLE mod_nomina.conf_tipopagodependencia (
  iddependencia NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_iddependencia_seq'::regclass) NOT NULL,
  idtipopago NUMERIC(3,0) NOT NULL,
  idtipopagodepencia NUMERIC(3,0) NOT NULL,
  CONSTRAINT pk_tipopagodependencia PRIMARY KEY(iddependencia)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_periodostipospago (
  idperiodostipospago NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_periodostipospago_seq'::regclass) NOT NULL,
  idperiodopago NUMERIC(3,0) NOT NULL,
  idtipopago NUMERIC(3,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_periodostipospago PRIMARY KEY(idperiodostipospago)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_nomina.conf_periodostipospago.idperiodostipospago
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_nomina.conf_periodostipospago.idperiodopago
IS 'Identificador del período de pago.';

COMMENT ON COLUMN mod_nomina.conf_periodostipospago.idtipopago
IS 'Identificador del tipo de pago.';

COMMENT ON COLUMN mod_nomina.conf_periodostipospago.idestructura
IS 'Identificador de la estructura.';

CREATE TABLE mod_nomina.conf_tipospagosconsecutivosnomina (
  idtipopago NUMERIC(19,0) NOT NULL,
  tiposgeneranconsecutivos VARCHAR(255),
  CONSTRAINT pk_tipospagosconsecutivosnomina PRIMARY KEY(idtipopago)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_conceptoscontablesentidad (
  idconceptocontableentidad NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_conf_conceptoscontablesentidad_seq'::regclass) NOT NULL,
  idconceptocontable NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  obligacion VARCHAR(50),
  CONSTRAINT pk_conceptocontbentidad PRIMARY KEY(idconceptocontableentidad)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_conceptosgeneralesnomina
  ADD COLUMN calcularpluriempleo NUMERIC(1,0) NOT NULL;

ALTER TABLE mod_nomina.conf_conceptosgeneralesnomina
  ADD COLUMN calcularperiodomensual NUMERIC(1,0) NOT NULL;

ALTER TABLE mod_nomina.conf_conceptosgeneralesnomina
  ADD COLUMN lugaresdecimales NUMERIC(1,0) DEFAULT 2 NOT NULL;

ALTER TABLE mod_nomina.conf_elementosalarialcargo
  ADD COLUMN tiposalarioescala NUMERIC(1,0) DEFAULT 0 NOT NULL;

CREATE TABLE mod_nomina.conf_causasreporteausencia (
  idcausasreporteausencia NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_causasreporteausencia_seq'::regclass) NOT NULL,
  idcausa VARCHAR NOT NULL,
  idvariablesconfreportescertificaciones NUMERIC(19,0) NOT NULL,
  idconfreportescertificaciones NUMERIC NOT NULL,
  horasdias NUMERIC(1,0),
  CONSTRAINT pk_causasreporteausencia PRIMARY KEY(idcausasreporteausencia)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.nom_conceptopdtarifa
  ALTER COLUMN importe TYPE VARCHAR(19) COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.nom_conceptopdtarifa
  ALTER COLUMN importe SET STORAGE EXTENDED;

CREATE TABLE mod_nomina.conf_reporteconceptoselementossalariales (
  idconfconceptoselementossalariales NUMERIC NOT NULL,
  idconceptopd NUMERIC,
  CONSTRAINT pk_idconfconceptoselementossalariales PRIMARY KEY(idconfconceptoselementossalariales)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
  ALTER COLUMN diasacumulados TYPE NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
  ADD COLUMN idconfregistsalartiempservc NUMERIC(19,0);

COMMENT ON COLUMN mod_nomina.dat_registrosalariotiemposervcio.idconfregistsalartiempservc
IS 'Identificador de la configuración del registro salarial en tiempo de servicio.';

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
  ADD COLUMN salariodevengadoreporte NUMERIC(19,2);

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
  ADD COLUMN registrotiponominamanual NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_vblesgblesregsaltmpserv
  ADD COLUMN anotaciones VARCHAR(255);

CREATE TABLE mod_nomina.dat_cierreperiodosnomina (
  idcierreperiodo NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_cierreperiodos_seq'::regclass) NOT NULL,
  idfechascierre NUMERIC(19,0) NOT NULL,
  idelaborarpagos NUMERIC(19,0) NOT NULL,
  personascaja VARCHAR,
  personascajero VARCHAR,
  CONSTRAINT pk_cierreperiodos PRIMARY KEY(idcierreperiodo)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.dat_comprobantenomina (
  idcomprobantenomina NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_comprobantenomina_seq'::regclass) NOT NULL,
  idsubsistema NUMERIC(19,0),
  idtipocomprobante NUMERIC(19,0),
  fechacontable DATE,
  idoperacion NUMERIC(19,0),
  operacion VARCHAR(255),
  numerodocumento NUMERIC(19,0),
  iddocumento NUMERIC(19,0),
  concatcta VARCHAR(255),
  idcuenta NUMERIC(19,0),
  cuenta VARCHAR(255),
  idnaturaleza NUMERIC(19,0),
  contabilidadadicional NUMERIC(19,0),
  debitocredito NUMERIC(19,0),
  idmoneda NUMERIC(19,0),
  moneda NUMERIC(19,0),
  idtasa NUMERIC(19,0),
  compra NUMERIC(19,0),
  factordeconversion NUMERIC(19,0),
  importe NUMERIC(19,2),
  importemb NUMERIC(19,2),
  importemo NUMERIC(19,2),
  porciento NUMERIC(19,0),
  idelaborarpagos NUMERIC(19,0),
  idpersona NUMERIC(19,0),
  direccion VARCHAR,
  nombreapellidos VARCHAR(255),
  denomcuenta VARCHAR,
  ci VARCHAR,
  refretenciones VARCHAR,
  abreviaturaret VARCHAR(100),
  CONSTRAINT pk_comprobantenomina PRIMARY KEY(idcomprobantenomina)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.dat_comprobantenominacentroscosto (
  idcomprobantenominacentrocosto NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_comprobantenominacentrocosto_seq'::regclass) NOT NULL,
  idcuenta NUMERIC(19,0),
  cuenta VARCHAR(255),
  denomcuenta VARCHAR(255),
  debitocredito NUMERIC(1,0),
  centrocosto NUMERIC(19,0),
  idelaborarpagos NUMERIC(19,0),
  importe NUMERIC(19,2),
  CONSTRAINT pk_comprobantenominacentrocosto PRIMARY KEY(idcomprobantenominacentrocosto)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.dat_conceptoelaborarpago (
  idconceptoelaborarpago NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_conceptoelaborarpago_seq'::regclass) NOT NULL,
  monto NUMERIC(19,2) NOT NULL,
  idelaborarpagos NUMERIC(19,0) NOT NULL,
  idestructuramodelodomina NUMERIC(19,0) NOT NULL,
  desglosecentcosto VARCHAR,
  CONSTRAINT pk_conceptoelaborarpago PRIMARY KEY(idconceptoelaborarpago)
) 
WITH (oids = false);

CREATE INDEX idx_conceptoelaborarpago_idelaborarpagos ON mod_nomina.dat_conceptoelaborarpago
  USING btree (idelaborarpagos);

CREATE TABLE mod_nomina.dat_datoscertificadoselaborarpago (
  iddatoscertificadoselaborarpago NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_datoscertificadoselaborarpago_seq'::regclass) NOT NULL,
  datoscetificados TEXT NOT NULL,
  idelaborarpagos NUMERIC(19,0) NOT NULL,
  CONSTRAINT dat_datoscertificadoselaborarpago_pkey PRIMARY KEY(iddatoscertificadoselaborarpago)
) 
WITH (oids = true);

CREATE TABLE mod_nomina.dat_consecutivosnominaporpagos (
  idelaborarpagos NUMERIC NOT NULL,
  consecutivo NUMERIC,
  anno NUMERIC,
  CONSTRAINT pk_consecutivonominaporpagos PRIMARY KEY(idelaborarpagos)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.dat_descuentosaplicadosporpersona (
  iddescuentosaplicadosporpersona NUMERIC DEFAULT nextval('mod_nomina.sec_descuentosaplicadosporpersona_seq'::regclass) NOT NULL,
  idelaborarpagos NUMERIC NOT NULL,
  idpersona NUMERIC NOT NULL,
  idconceptopercepciondescuento NUMERIC NOT NULL,
  CONSTRAINT pk_descuentosaplicadosporpersona PRIMARY KEY(iddescuentosaplicadosporpersona)
) 
WITH (oids = false);

CREATE INDEX "idx_ dat_descuentosaplicadosporpersona_idconceptopercepciondesc" ON mod_nomina.dat_descuentosaplicadosporpersona
  USING btree (idconceptopercepciondescuento);

CREATE INDEX "idx_ dat_descuentosaplicadosporpersona_iddescuentosaplicadospor" ON mod_nomina.dat_descuentosaplicadosporpersona
  USING btree (iddescuentosaplicadosporpersona);

CREATE INDEX "idx_ dat_descuentosaplicadosporpersona_idelaborarpagos" ON mod_nomina.dat_descuentosaplicadosporpersona
  USING btree (idelaborarpagos);

CREATE INDEX "idx_ dat_descuentosaplicadosporpersona_idpersona" ON mod_nomina.dat_descuentosaplicadosporpersona
  USING btree (idpersona);

CREATE TABLE mod_nomina.dat_retencionesaplicadasporpersona (
  idretencionesaplicadasporpersona NUMERIC DEFAULT nextval('mod_nomina.sec_retencionesaplicadasporpersona_seq'::regclass) NOT NULL,
  idelaborarpagos NUMERIC NOT NULL,
  idpersona NUMERIC NOT NULL,
  idtiporetencion NUMERIC NOT NULL,
  CONSTRAINT pk_retencionesaplicadasporpersona PRIMARY KEY(idretencionesaplicadasporpersona)
) 
WITH (oids = false);

CREATE INDEX fki_idelaborarpagos_retencionesaaplicarporpersona ON mod_nomina.dat_retencionesaplicadasporpersona
  USING btree (idelaborarpagos);

CREATE INDEX fki_idpersona_retencionesaaplicarporpersona ON mod_nomina.dat_retencionesaplicadasporpersona
  USING btree (idpersona);

CREATE INDEX fki_idtiporetencion_retencionesaaplicarporpersona ON mod_nomina.dat_retencionesaplicadasporpersona
  USING btree (idtiporetencion);

ALTER TABLE mod_nomina.dat_nomina
  ADD COLUMN acumuladasnc NUMERIC DEFAULT 0;

ALTER TABLE mod_nomina.dat_nomina
  ADD COLUMN actualizada NUMERIC;

CREATE TABLE mod_nomina.conf_pagosporresultadofechas (
  idpagoporresultadofechas NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_pagosporresultado_seq'::regclass) NOT NULL,
  idpagoporresultado NUMERIC(19,0) NOT NULL,
  fechainicio DATE,
  fechafin DATE,
  identidad NUMERIC(19,0),
  CONSTRAINT pk_pagosporresultadofechas PRIMARY KEY(idpagoporresultadofechas)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.conf_pagosporresultadofechas
IS 'Almacena la configuración del tipo de pago y la clase que lo implementa.';

COMMENT ON COLUMN mod_nomina.conf_pagosporresultadofechas.idpagoporresultadofechas
IS 'Identificador de la tupla';

ALTER TABLE mod_nomina.conf_pagosporresultadoarea
  ALTER COLUMN monto TYPE NUMERIC(19,2);

ALTER TABLE mod_nomina.conf_cargospagoporresultado
  ADD COLUMN idarea NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN tipocampo NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN expresionmatematicaindicador NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN expresionmatematicaformula NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN idestructuramodelonomina NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN tipovalor NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN lugaresdecimales NUMERIC(2,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN obligatorio NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN recalculable NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN resultadofinal NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN sumadestajo NUMERIC(1,0) DEFAULT 0;

CREATE TABLE mod_nomina.conf_desgloseperiodos (
  iddesgloseperiodos NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_desgloseperiodos_seq'::regclass) NOT NULL,
  idperiodostipospago NUMERIC(19,0) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE NOT NULL,
  CONSTRAINT pk_desgloseperiodos PRIMARY KEY(iddesgloseperiodos)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.nom_estructuraescalar
  ADD COLUMN lugaresdecimales NUMERIC(1,0);

ALTER TABLE mod_nomina.his_retencionpersona
  ALTER COLUMN fechaoperacion SET DEFAULT now();

ALTER TABLE mod_nomina.his_vacacionespersona
  ADD COLUMN ajusteimporte NUMERIC(19,2);

ALTER TABLE mod_nomina.his_vacacionespersona
  ADD COLUMN ajustetiempo NUMERIC(19,2);

ALTER TABLE mod_nomina.his_vacacionespersona
  ADD COLUMN tipoajuste NUMERIC(1,0);

ALTER TABLE mod_nomina.his_vacacionespersona
  ADD COLUMN observaciones VARCHAR(255);

ALTER TABLE mod_nomina.his_vacacionespersona
  ADD COLUMN periodo VARCHAR(20);

CREATE TABLE mod_nomina.his_operacionretencionpersona (
  idhisoperacionretencionpersona NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_his_operacionretencionpersona_seq'::regclass) NOT NULL,
  idhisdatretencionpersona NUMERIC(19,0) NOT NULL,
  idnomina NUMERIC(19,0) NOT NULL,
  idcomprobanteacredita NUMERIC(19,0),
  idcomprobantependiente NUMERIC(19,0),
  retenido NUMERIC(19,2),
  saldodeladeudo NUMERIC(19,2),
  retencionpendiente NUMERIC(19,2),
  saldodeladeudopendiente NUMERIC(19,2),
  fechaoperacion DATE,
  fechacomprobantependiente DATE,
  CONSTRAINT pk_hisoperacionretencionpersona PRIMARY KEY(idhisoperacionretencionpersona)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_nomina.nom_escalatarifa.importe
IS 'Importe en caso que la forma de cálculo sea un importe fijo.';

ALTER TABLE mod_nomina.nom_escalatarifa
  ALTER COLUMN importe TYPE NUMERIC(19,6);

CREATE TABLE mod_nomina.his_ajustevacacionespersona (
  idajustevacacionespersona NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_ajustevacacionespersona_seq'::regclass) NOT NULL,
  ajusteimporte NUMERIC(19,0),
  ajustetiempo NUMERIC(19,0),
  tipoajuste NUMERIC(1,0),
  idhisvacacionespersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_ajustevacacionespersona PRIMARY KEY(idajustevacacionespersona)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_escalaelementosalarialpersona
  ADD COLUMN idpersona NUMERIC(19,0);

CREATE INDEX idx_idtiponomina_compartimentacioncargoportiponomi ON mod_nomina.seg_compartimentacioncargoportiponomina
  USING btree (idtiponomina);

CREATE INDEX idx_idcompartimentacionnomina_compartimentacioncargoportiponomi ON mod_nomina.seg_compartimentacioncargoportiponomina
  USING btree (idcompartimentacionnomina);

CREATE INDEX idx_idnivelconfiguracion_variableglobal ON mod_nomina.nom_variableglobal
  USING btree (idnivelconfiguracion);

CREATE INDEX idx_idvariablesconfreportescertificaciones_variableauxiliarform ON mod_nomina.nom_variableauxiliarformula
  USING btree (idvariablesconfreportescertificaciones);

CREATE INDEX idx_idtipoentrada_variableauxiliarformula ON mod_nomina.nom_variableauxiliarformula
  USING btree (idtipoentrada);

CREATE INDEX idx_idconfreportescertificaciones_variableauxiliarformula ON mod_nomina.nom_variableauxiliarformula
  USING btree (idconfreportescertificaciones);

CREATE INDEX idx_idnomencladorreferencia_valoresnomencladorreferencia ON mod_nomina.nom_valoresnomencladorreferencia
  USING btree (idnomencladorreferencia);

CREATE INDEX idx_idconfreportescertificaciones_tipopago ON mod_nomina.nom_tipopago
  USING btree (idconfreportescertificaciones);

CREATE INDEX idx_idformapago_sistemapago ON mod_nomina.nom_sistemapago
  USING btree (idformapago);

CREATE INDEX idx_idsectorsalarial_salarioespecifico ON mod_nomina.nom_salarioespecifico
  USING btree (idsectorsalarial);

CREATE INDEX idx_idsectorsalarial_salarioescala ON mod_nomina.nom_salarioescala
  USING btree (idsectorsalarial);

CREATE INDEX idx_idgrupoescala_salarioescala ON mod_nomina.nom_salarioescala
  USING btree (idgrupoescala);

CREATE INDEX idx_idvariablesconfreportescertificaciones_estructuraescalar ON mod_nomina.nom_estructuraescalar
  USING btree (idvariablesconfreportescertificaciones);

CREATE INDEX idx_idtipoentrada_estructuraescalar ON mod_nomina.nom_estructuraescalar
  USING btree (idtipoentrada);

CREATE INDEX idx_idtipocampo_estructuraescalar ON mod_nomina.nom_estructuraescalar
  USING btree (idtipocampo);

CREATE INDEX idx_idnomencladorreferencia_estructuraescalar ON mod_nomina.nom_estructuraescalar
  USING btree (idnomencladorreferencia);

CREATE INDEX idx_idconfreportescertificaciones_estructuraescalar ON mod_nomina.nom_estructuraescalar
  USING btree (idconfreportescertificaciones);

CREATE INDEX idx_idconceptopdtarifa_estructuraescalar ON mod_nomina.nom_estructuraescalar
  USING btree (idconceptopdtarifa);

CREATE INDEX idx_idoperadorcomparacion_escalatarifa ON mod_nomina.nom_escalatarifa
  USING btree (idoperadorcomparacion);

CREATE INDEX idx_idformacalculo_escalatarifa ON mod_nomina.nom_escalatarifa
  USING btree (idformacalculo);

CREATE INDEX idx_idestructuraescalar_escalatarifa ON mod_nomina.nom_escalatarifa
  USING btree (idestructuraescalar);

CREATE INDEX idx_idconceptopdtarifa_escalatarifa ON mod_nomina.nom_escalatarifa
  USING btree (idconceptopdtarifa);

CREATE INDEX "idx_idestructuraescalaradyacente_dependenciaestructuraescalar;" ON mod_nomina.nom_dependenciaestructuraescalar
  USING btree (idestructuraescalaradyacente);

CREATE INDEX idx_idestructuraescalar_dependenciaestructuraescalar ON mod_nomina.nom_dependenciaestructuraescalar
  USING btree (idestructuraescalar);

CREATE INDEX idx_idconceptopdtarifa_dependenciaestructuraescalar ON mod_nomina.nom_dependenciaestructuraescalar
  USING btree (idconceptopdtarifa);

CREATE INDEX idx_idtipoconceptopd_conceptopercepciondescuento ON mod_nomina.nom_conceptopercepciondescuento
  USING btree (idtipoconceptopd);

CREATE INDEX idx_idtarifa_conceptopdtarifa ON mod_nomina.nom_conceptopdtarifa
  USING btree (idtarifa);

CREATE INDEX idx_idformacalulo_conceptopdtarifa ON mod_nomina.nom_conceptopdtarifa
  USING btree (idformacalculo);

CREATE INDEX idx_idconceptopercepciondescuento_conceptopdtarifa ON mod_nomina.nom_conceptopdtarifa
  USING btree (idconceptopercepciondescuento);

CREATE INDEX idx_idestructura_areas ON mod_nomina.nom_areas
  USING btree (idestructura);

CREATE INDEX idx_variableselementosreportescertificaciones_valor ON mod_nomina.dat_variableselementosreportescertificaciones
  USING btree (valor);

CREATE INDEX idx_variableselementosreportescertificaciones_idvariableselemen ON mod_nomina.dat_variableselementosreportescertificaciones
  USING btree (idvariableselementosreportescertificaciones);

CREATE INDEX idx_reportescertificaciones_idreportescertificaciones ON mod_nomina.dat_reportescertificaciones
  USING btree (idreportescertificaciones);

CREATE INDEX idx_idregistsalartiempservc ON mod_nomina.dat_registrosalariotiemposervcio
  USING btree (idconfregistsalartiempservc);

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

CREATE INDEX idx_idpersona_cargosocupados ON mod_nomina.dat_cargosocupados
  USING btree (idpersona);

CREATE INDEX idx_cargosocupados_idpersona_identidad ON mod_nomina.dat_cargosocupados
  USING btree (idpersona, identidad);

CREATE INDEX idx_cargosocupados ON mod_nomina.dat_cargosocupados
  USING btree (idcargo);

CREATE INDEX idx_idfilacargo ON mod_nomina.conf_plantillanominalcargo
  USING btree (idcargo);

CREATE INDEX fki_cargo_plantilla_estructura ON mod_nomina.conf_plantillanominalcargo
  USING btree (idcargo);

CREATE INDEX idx_plantillanominal_idplantillanominal ON mod_nomina.conf_plantillanominal
  USING btree (idplantillanominal);

CREATE INDEX idx_idconfconceptospdelementossalariales ON mod_nomina.conf_escalaelementosalarial
  USING btree (idconfconceptospdelementossalariales);

ALTER TABLE mod_nomina.conf_escalaelementosalarial
  CLUSTER ON idx_idconfconceptospdelementossalariales;

CREATE INDEX idx_cargo ON mod_nomina.conf_elementosalarialcargo
  USING btree (idcargo);

ALTER TABLE mod_nomina.conf_elementosalarialcargo
  CLUSTER ON idx_cargo;

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

CREATE INDEX idx_idelementosalarialcargo ON mod_nomina.conf_conceptospdelementossalariales
  USING btree (idelementosalarialcargo);

ALTER TABLE mod_nomina.conf_conceptospdelementossalariales
  CLUSTER ON idx_idelementosalarialcargo;

ALTER TABLE mod_nomina.seg_trazacertificacionannoservc
  ADD CONSTRAINT fk_certificacionannoservc_trazacertificacionannoservc FOREIGN KEY (idcertificacionannoservc)
    REFERENCES mod_nomina.conf_certificacionannoservc(idcertificacionannoservc)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.seg_compartcargocategoria
  ADD CONSTRAINT fk_categoria_compartcargocategoria FOREIGN KEY (idcategoria)
    REFERENCES mod_personaext.dat_categoria(idcategoria)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.nom_tipopago
  ADD CONSTRAINT fk_tiporeportescertificaciones_tipopago FOREIGN KEY (idconfreportescertificaciones)
    REFERENCES mod_nomina.conf_tiporeportescertificaciones(idconfreportescertificaciones)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.nom_billetes
  ADD CONSTRAINT fk_moneda_billetes_idmoneda FOREIGN KEY (idmoneda)
    REFERENCES mod_datosmaestros.nom_moneda(idmoneda)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT fk_cargo_area_estructura FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT fk_filaestruc_areascargos_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT fk_idarea_areascargos FOREIGN KEY (idarea)
    REFERENCES mod_nomina.nom_areas(idarea)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.his_vacacionespersona
  ADD CONSTRAINT fk_nomina_hisvacacionespersona_idnomina FOREIGN KEY (idnomina)
    REFERENCES mod_nomina.dat_nomina(idnomina)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.his_vacacionespersona
  ADD CONSTRAINT fk_dvacacionespersona_hvacacionespersona FOREIGN KEY (idvacacionespersona)
    REFERENCES mod_nomina.dat_vacacionespersona(idvacacionespersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.his_retencionpersona
  ADD CONSTRAINT fk_nomina_hidretencionpersona_idnomina FOREIGN KEY (idnomina)
    REFERENCES mod_nomina.dat_nomina(idnomina)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.his_retencionpersona
  ADD CONSTRAINT fk_dretencionpersona_hretencionpersona FOREIGN KEY (idretencionpersona)
    REFERENCES mod_nomina.dat_retencionpersona(idretencionpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.his_operacionretencionpersona
  ADD CONSTRAINT fk_dretencionpersona_hretencionpersona FOREIGN KEY (idhisdatretencionpersona)
    REFERENCES mod_nomina.his_datretencionpersona(idhisdatretencionpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.his_operacionretencionpersona
  ADD CONSTRAINT his_operacionretencionpersona_dat_nomina_fk1 FOREIGN KEY (idnomina)
    REFERENCES mod_nomina.dat_nomina(idnomina)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.his_datretencionpersona
  ADD CONSTRAINT fk_tiporetencion_retencionpersona FOREIGN KEY (idtiporetencion)
    REFERENCES mod_nomina.nom_tiporetencion(idtiporetencion)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.his_ajustevacacionespersona
  ADD CONSTRAINT fk_vacacionespersona_ajustevacacionespersona FOREIGN KEY (idhisvacacionespersona)
    REFERENCES mod_nomina.his_vacacionespersona(idhisvacacionespersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_retencionesaplicadasporpersona
  ADD CONSTRAINT fk_idelaborarpagos_retencionesaaplicarporpersona FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.dat_retencionesaplicadasporpersona
  ADD CONSTRAINT fk_idpersona_retencionesaaplicarporpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.dat_retencionesaplicadasporpersona
  ADD CONSTRAINT fk_idtiporetencion_retencionesaaplicarporpersona FOREIGN KEY (idtiporetencion)
    REFERENCES mod_nomina.nom_tiporetencion(idtiporetencion)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.dat_reintegropersona
  ADD CONSTRAINT fk_idfechacierre FOREIGN KEY (idfechacierre)
    REFERENCES mod_nomina.dat_fechascierreperiodos(idfechascierre)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_reintegropersona
  ADD CONSTRAINT fk_persona_reintegropersona_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
  ADD CONSTRAINT fk_registsalartiempservc_registrosalariotiemposervcio FOREIGN KEY (idconfregistsalartiempservc)
    REFERENCES mod_nomina.conf_registsalartiempservc(idregistsalartiempservc)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_partidagasto
  ADD CONSTRAINT fk_especialidad_partgastoespec_idespecialidad FOREIGN KEY (idespecialidad)
    REFERENCES mod_nomina.nom_especialidad(idespecialidad)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_partidagasto
  ADD CONSTRAINT fk_tiponomina_partgastoespec_idtiponomina FOREIGN KEY (idtiponomina)
    REFERENCES mod_nomina.nom_tiponomina(idtiponomina)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_modeloconvenioindividual
  ADD CONSTRAINT fk_convenio_modconvindiv_idconvenio FOREIGN KEY (idconvenio)
    REFERENCES mod_nomina.dat_convenio(idconvenio)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_modeloconveniocolectivo
  ADD CONSTRAINT fk_convenio_modconvcolect_idconvenio FOREIGN KEY (idconvenio)
    REFERENCES mod_nomina.dat_convenio(idconvenio)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_descuentosaplicadosporpersona
  ADD CONSTRAINT fk_idconceptopercepciondescuento_descuentosaplicadosporpersona FOREIGN KEY (idconceptopercepciondescuento)
    REFERENCES mod_nomina.nom_conceptopercepciondescuento(idconceptopercepciondescuento)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.dat_descuentosaplicadosporpersona
  ADD CONSTRAINT fk_idelaborarpagos_descuentosaplicadosporpersona FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.dat_descuentosaplicadosporpersona
  ADD CONSTRAINT fk_idpersona_descuentosaplicadosporpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.dat_datoscertificadoselaborarpago
  ADD CONSTRAINT fk_idelaborarpago FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_consecutivosnominaporpagos
  ADD CONSTRAINT fk_idelaborarpagos_consecutivonomina FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.dat_conceptoelaborarpago
  ADD CONSTRAINT fk_elaborarpagos_conceptoelaborarpago_idelaborarpagos FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_conceptoelaborarpago
  ADD CONSTRAINT fk_estrucmodnom_conceptoelaborarpago_idestructuramodelodomina FOREIGN KEY (idestructuramodelodomina)
    REFERENCES mod_nomina.conf_estructuramodelosnomina(idestructuramodelodomina)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_comprobantenominacentroscosto
  ADD CONSTRAINT fk_elaborarpagos_comprobantenominacentrocosto FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_comprobantenomina
  ADD CONSTRAINT fk_elaborarpagos_comprobantenomina FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_cierreperiodosnomina
  ADD CONSTRAINT fk_elaborarpagos_cierreperiodos_idelaborarpagos FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_cierreperiodosnomina
  ADD CONSTRAINT fk_fechascierreperiodos_cierreperiodos_idfechascierre FOREIGN KEY (idfechascierre)
    REFERENCES mod_nomina.dat_fechascierreperiodos(idfechascierre)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.dat_cargosocupados
  ADD CONSTRAINT fk_filaestruc_cargosocupados_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_tipospagosconsecutivosnomina
  ADD CONSTRAINT fk_tipospagos_consecutivosnomina FOREIGN KEY (idtipopago)
    REFERENCES mod_nomina.nom_tipopago(idtipopago)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.conf_tipopagodependencia
  ADD CONSTRAINT fk_idtipopago_idtipopagodependencia FOREIGN KEY (idtipopago)
    REFERENCES mod_nomina.nom_tipopago(idtipopago)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_tipopagodependencia
  ADD CONSTRAINT fk_idtipopago_idtipopagodependenciadepen FOREIGN KEY (idtipopagodepencia)
    REFERENCES mod_nomina.nom_tipopago(idtipopago)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_reporteconceptoselementossalariales
  ADD CONSTRAINT fk_idconceptopd FOREIGN KEY (idconceptopd)
    REFERENCES mod_nomina.nom_conceptopercepciondescuento(idconceptopercepciondescuento)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

ALTER TABLE mod_nomina.conf_periodostipospago
  ADD CONSTRAINT fk_periodopago_periodopagostipopago_idperiodopago FOREIGN KEY (idperiodopago)
    REFERENCES mod_nomina.nom_periodopago(idperiodopago)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_periodostipospago
  ADD CONSTRAINT fk_tipopago_periodopagostipopago_idtipopago FOREIGN KEY (idtipopago)
    REFERENCES mod_nomina.nom_tipopago(idtipopago)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_pagosporresultadofechas
  ADD CONSTRAINT fk_pagoporresultado FOREIGN KEY (idpagoporresultado)
    REFERENCES mod_nomina.conf_pagosporresultado(idpagoporresultado)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_nivelactiveconom
  ADD CONSTRAINT fk_tiponomina_nivelactiveconom FOREIGN KEY (idtiponomina)
    REFERENCES mod_nomina.nom_tiponomina(idtiponomina)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_formulasareasmontos
  ADD CONSTRAINT fk_idagrupadorarea FOREIGN KEY (idagrupadorarea)
    REFERENCES mod_nomina.conf_agrupadorareas(idagrupador)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_estructuramodelosnominaentidad
  ADD CONSTRAINT fk_estrucmodnomin_estrucmodnominest_idestrucmodnomin FOREIGN KEY (idestructuramodelodomina)
    REFERENCES mod_nomina.conf_estructuramodelosnomina(idestructuramodelodomina)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_escalaelementosalarialpersona
  ADD CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona1 FOREIGN KEY (idconfconceptospdelementossalariales)
    REFERENCES mod_nomina.conf_conceptospdelementossalariales(idconfconceptospdelementossalariales)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_escalaelementosalarial
  ADD CONSTRAINT conf_escalaelementosalarial_fk2 FOREIGN KEY (idconfconceptospdelementossalariales)
    REFERENCES mod_nomina.conf_conceptospdelementossalariales(idconfconceptospdelementossalariales)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_desgloseperiodos
  ADD CONSTRAINT fk_periodopagostipopago_desgloseperiodos_idperiodostipospago FOREIGN KEY (idperiodostipospago)
    REFERENCES mod_nomina.conf_periodostipospago(idperiodostipospago)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_conceptoscontablesentidad
  ADD CONSTRAINT fk_conceptocontable FOREIGN KEY (idconceptocontable)
    REFERENCES mod_nomina.conf_conceptoscontables(idconceptoscontables)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_causasreporteausencia
  ADD CONSTRAINT fk_tiporeportescertific_causasreporteausencia_idconfreportescer FOREIGN KEY (idconfreportescertificaciones)
    REFERENCES mod_nomina.conf_tiporeportescertificaciones(idconfreportescertificaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_causasreporteausencia
  ADD CONSTRAINT fk_variablestiporeportes_causasreporteausencia_idvariablestipor FOREIGN KEY (idvariablesconfreportescertificaciones)
    REFERENCES mod_nomina.conf_variablestiporeportescertificaciones(idvariablesconfreportescertificaciones)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_cargospagoporresultado
  ADD CONSTRAINT fk_idarea_idcargo FOREIGN KEY (idarea, idcargo)
    REFERENCES mod_nomina.nom_areascargos(idarea, idcargo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina CHECK ((vacacionesdiasimporte = (0)::numeric) OR (vacacionesdiasimporte = (1)::numeric) OR (vacacionesdiasimporte = (2)::numeric));

COMMENT ON CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina ON mod_nomina.conf_estructuramodelosnomina
IS 'Restricción sobre la(s) columna(s) "vacacionesdiasimporte".';

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD CONSTRAINT chk_calculable_variabtiporepcert CHECK ((calculable = (0)::numeric) OR (calculable = (1)::numeric));

COMMENT ON CONSTRAINT chk_calculable_variabtiporepcert ON mod_nomina.conf_variablestiporeportescertificaciones
IS 'Restricción sobre la(s) columna(s) "calculable".';

-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_cargosocupados0amlys (
  idcargosocupados NUMERIC,
  idpersona NUMERIC,
  idcargo NUMERIC,
  identidad NUMERIC,
  fecharegistro DATE,
  fechaaplicacion DATE,
  fechavencimiento DATE,
  observaciones TEXT,
  idsituacionlaboral NUMERIC,
  idcajacajero NUMERIC,
  idcentrocosto NUMERIC,
  idpersonacuentabancariamn NUMERIC,
  idpersonacuentabancariacuc NUMERIC,
  numerocontable NUMERIC(19,0),
  idplantillanominal NUMERIC
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_cargosocupados0amlys (idcargosocupados, idpersona, idcargo, identidad, fecharegistro, fechaaplicacion, fechavencimiento, observaciones, idsituacionlaboral, idcajacajero, idcentrocosto, idpersonacuentabancariamn, idpersonacuentabancariacuc, numerocontable, idplantillanominal)
SELECT idcargosocupados, idpersona, idcargo, identidad, fecharegistro, fechaaplicacion, fechavencimiento, observaciones, idsituacionlaboral, idcajacajero, idcentrocosto, idpersonacuentabancariamn, idpersonacuentabancariacuc, numerocontable, idplantillanominal FROM mod_nomina.dat_cargosocupados;

-- Drop the source table

DROP TABLE mod_nomina.dat_cargosocupados;

-- Create the destination table

CREATE TABLE mod_nomina.dat_cargosocupados (
  idcargosocupados NUMERIC DEFAULT nextval('mod_nomina.sec_dat_cargosocupados_seq'::regclass) NOT NULL,
  idpersona NUMERIC NOT NULL,
  idcargo NUMERIC,
  identidad NUMERIC NOT NULL,
  fecharegistro DATE DEFAULT now() NOT NULL,
  fechaaplicacion DATE DEFAULT now() NOT NULL,
  fechavencimiento DATE,
  observaciones TEXT,
  idsituacionlaboral NUMERIC,
  idcajacajero NUMERIC DEFAULT 1 NOT NULL,
  idcentrocosto NUMERIC DEFAULT 0 NOT NULL,
  idpersonacuentabancariamn NUMERIC,
  idpersonacuentabancariacuc NUMERIC,
  numerocontable NUMERIC(19,0),
  idplantillanominal NUMERIC,
  CONSTRAINT pk_cargosocupados PRIMARY KEY(idcargosocupados),
  CONSTRAINT fk_filaestruc_cargosocupados_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

-- Copy the temporary table's data to the destination table

INSERT INTO mod_nomina.dat_cargosocupados (idcargosocupados, idpersona, idcargo, identidad, fecharegistro, fechaaplicacion, fechavencimiento, observaciones, idsituacionlaboral, idcajacajero, idcentrocosto, idpersonacuentabancariamn, idpersonacuentabancariacuc, numerocontable, idplantillanominal)
SELECT idcargosocupados, idpersona, idcargo, identidad, fecharegistro, fechaaplicacion, fechavencimiento, observaciones, idsituacionlaboral, idcajacajero, idcentrocosto, idpersonacuentabancariamn, idpersonacuentabancariacuc, numerocontable, idplantillanominal FROM dat_cargosocupados0amlys;

-- Create indices, triggers and rules

CREATE INDEX "fki_fkSituacionlaboralCargosocupados" ON mod_nomina.dat_cargosocupados
  USING btree (idsituacionlaboral);

CREATE INDEX idx_cargosocupados ON mod_nomina.dat_cargosocupados
  USING btree (idcargo);

CREATE INDEX idx_cargosocupados_idpersona_identidad ON mod_nomina.dat_cargosocupados
  USING btree (idpersona, identidad);

CREATE INDEX idx_idpersona_cargosocupados ON mod_nomina.dat_cargosocupados
  USING btree (idpersona);

CREATE TRIGGER t_del_last_idp_ide
  BEFORE DELETE 
  ON mod_nomina.dat_cargosocupados
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_nomina.ft_del_last_idp_ide();

CREATE TRIGGER t_upd_idsituacionlaboral
  AFTER UPDATE OF idsituacionlaboral 
  ON mod_nomina.dat_cargosocupados
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_nomina.ft_upd_elementosalarialsituacionservicio();

-- Restore table's permissions

ALTER TABLE mod_nomina.dat_cargosocupados
  OWNER TO zeolides;



-- Drop the temporary table

DROP TABLE dat_cargosocupados0amlys;

CREATE TRIGGER t_del_last_idp_ide
  BEFORE DELETE 
  ON mod_nomina.dat_cargosocupados
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_nomina.ft_del_last_idp_ide();

CREATE TRIGGER t_upd_idsituacionlaboral
  AFTER UPDATE OF idsituacionlaboral 
  ON mod_nomina.dat_cargosocupados
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_nomina.ft_upd_elementosalarialsituacionservicio();

ALTER TABLE mod_nomina.dat_retencionpersona
  ADD CONSTRAINT chk_activo_retencionpersona CHECK ((activo = (0)::numeric) OR (activo = (1)::numeric));

COMMENT ON CONSTRAINT chk_activo_retencionpersona ON mod_nomina.dat_retencionpersona
IS 'Restricción sobre la(s) columna(s) "activo".';

-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE nom_tiponomina0palnr (
  idtiponomina NUMERIC(3,0),
  denominacion VARCHAR(100),
  fechainicio DATE,
  fechafin DATE,
  descripcion VARCHAR(255),
  acumulavacaciones NUMERIC(1,0),
  liquidavacaciones NUMERIC(1,0),
  tipomoneda VARCHAR,
  operacioncontable NUMERIC(19,0),
  operacioncontablecuentasporcobrar NUMERIC(19,0),
  acumulasnc NUMERIC(1,0),
  reintegro NUMERIC(1,0)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO nom_tiponomina0palnr (idtiponomina, denominacion, fechainicio, fechafin, descripcion, acumulavacaciones, liquidavacaciones, tipomoneda, operacioncontable, operacioncontablecuentasporcobrar, acumulasnc, reintegro)
SELECT idtiponomina, denominacion, fechainicio, fechafin, descripcion, acumulavacaciones, liquidavacaciones, tipomoneda, operacioncontable, operacioncontablecuentasporcobrar, acumulasnc, reintegro FROM mod_nomina.nom_tiponomina;

-- Drop the source table

DROP TABLE mod_nomina.nom_tiponomina;

-- Create the destination table

CREATE TABLE mod_nomina.nom_tiponomina (
  idtiponomina NUMERIC(3,0) DEFAULT nextval('mod_nomina.sec_tiponomina_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  fechainicio DATE NOT NULL,
  fechafin DATE,
  descripcion VARCHAR(255),
  acumulavacaciones NUMERIC(1,0) DEFAULT 1,
  liquidavacaciones NUMERIC(1,0) DEFAULT 2 NOT NULL,
  tipomoneda VARCHAR DEFAULT 0,
  operacioncontable NUMERIC(19,0),
  operacioncontablecuentasporcobrar NUMERIC(19,0),
  acumulasnc NUMERIC(1,0) DEFAULT 2,
  reintegro NUMERIC(1,0) DEFAULT 2 NOT NULL,
  CONSTRAINT pk_tiponomina PRIMARY KEY(idtiponomina)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.nom_tiponomina
IS 'Entidad tipo nomina.';

COMMENT ON COLUMN mod_nomina.nom_tiponomina.idtiponomina
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_nomina.nom_tiponomina.denominacion
IS 'DenominaciÃ³n del tipo de nÃ³mina.';

COMMENT ON COLUMN mod_nomina.nom_tiponomina.fechainicio
IS 'Fecha de inicio de uso del tipo de nÃ³mina.';

COMMENT ON COLUMN mod_nomina.nom_tiponomina.fechafin
IS 'Fecha de fin de uso del tipo de nÃ³mina.';

COMMENT ON COLUMN mod_nomina.nom_tiponomina.descripcion
IS 'DescripciÃ³n del tipo de nÃ³mina.';

COMMENT ON COLUMN mod_nomina.nom_tiponomina.acumulavacaciones
IS 'Define si el tipo de nÃ³mina acumula vacaciones.';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_nomina.nom_tiponomina (idtiponomina, denominacion, fechainicio, fechafin, descripcion, acumulavacaciones, liquidavacaciones, tipomoneda, operacioncontable, operacioncontablecuentasporcobrar, acumulasnc, reintegro)
SELECT idtiponomina, denominacion, fechainicio, fechafin, descripcion, acumulavacaciones, liquidavacaciones, tipomoneda, operacioncontable, operacioncontablecuentasporcobrar, acumulasnc, reintegro FROM nom_tiponomina0palnr;

-- Restore table's permissions

ALTER TABLE mod_nomina.nom_tiponomina
  OWNER TO zeolides;



-- Drop the temporary table

DROP TABLE nom_tiponomina0palnr;

