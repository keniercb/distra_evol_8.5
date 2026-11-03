-- FUNCTION: mod_persona.f_for_cleaning_schema(character varying)

-- DROP FUNCTION IF EXISTS mod_persona.f_for_cleaning_schema(character varying);

CREATE OR REPLACE FUNCTION mod_persona.f_for_cleaning_schema(
	esquema character varying)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
r boolean;
v_tablas record;
BEGIN
r := false;
IF ($1 NOT IN ('mod_utiles','mod_personaproyecto','mod_reccomplejas2'))THEN
	FOR v_tablas IN (SELECT table_name FROM information_schema.tables WHERE table_schema LIKE $1 AND table_type LIKE 'BASE TABLE' ORDER BY table_name DESC) LOOP
	IF ( ($1 LIKE 'mod_evaluaciones' AND ((v_tablas.table_name LIKE 'dat_evaldominioevaluativo') OR (v_tablas.table_name LIKE 'dat_evalescala')
	                                  OR (v_tablas.table_name LIKE 'dat_evalescalarangonumerico') OR (v_tablas.table_name LIKE 'dat_evalescalavalorescualitativos')
	                                  OR (v_tablas.table_name LIKE 'dat_evalindicadoresevaluar') OR (v_tablas.table_name LIKE 'dat_evalindicadoresplanilla')
	                                  OR (v_tablas.table_name LIKE 'dat_evalmodelo') OR (v_tablas.table_name LIKE 'dat_evalplanillasevaluativas')
	                                  OR (v_tablas.table_name LIKE 'dat_evalrecursoevaluativo') OR (v_tablas.table_name LIKE 'nom_%')
	                                ))
	    OR ($1 LIKE 'mod_persona' AND ((v_tablas.table_name LIKE 'dat_nomenclador') OR (v_tablas.table_name LIKE 'dat_persona')
	                                    OR (v_tablas.table_name LIKE 'nom_%')))
	    OR ($1 LIKE 'mod_personaext' AND ((v_tablas.table_name LIKE 'nom_%')))                           
	    OR ($1 LIKE 'mod_fuerzatrabajo' AND v_tablas.table_name LIKE 'nom_%')
	    OR ($1 LIKE 'mod_rrhhmaestro' AND ((v_tablas.table_name LIKE 'nom_dominio')))
	    OR ($1 LIKE 'mod_nomina' AND (
						v_tablas.table_name LIKE 'nom_%'
						OR v_tablas.table_name LIKE 'conf_causasreporteausencia'
						OR v_tablas.table_name LIKE 'conf_calendario'
						OR v_tablas.table_name LIKE 'conf_conceptoscontables' 
						OR v_tablas.table_name LIKE 'conf_conceptoscontablesentidad' 
						OR v_tablas.table_name LIKE 'conf_conceptosgeneralesnomina'
						OR v_tablas.table_name LIKE 'conf_conceptospdformasysistemaspago'						 
						OR v_tablas.table_name LIKE 'conf_conceptosportiposysistemaspago'						
						OR v_tablas.table_name LIKE 'conf_condicionesretenciones'
						OR v_tablas.table_name LIKE 'conf_estructuramodelosnomina'
						OR v_tablas.table_name LIKE 'conf_estructuramodelosnominaentidad'
						OR v_tablas.table_name LIKE 'conf_modelonomina'
						OR v_tablas.table_name LIKE 'conf_modelonominacategoria'
						OR v_tablas.table_name LIKE 'conf_periodostipospago'
						OR v_tablas.table_name LIKE 'conf_registsalartiempservc'
						OR v_tablas.table_name LIKE 'conf_tiporeportescertificaciones'						
						OR v_tablas.table_name LIKE 'conf_variableglobalvalor'						
						OR v_tablas.table_name LIKE 'conf_variablestiporeportescertificaciones'						
						OR v_tablas.table_name LIKE 'dat_conceptoscontableselementosgasto'
						OR v_tablas.table_name LIKE 'dat_datosmodelonominaconceptos'
						OR v_tablas.table_name LIKE 'dat_variableauxconceptospdformasysistemaspago'			
					)
	       )
	    OR ($1 LIKE 'mod_seleccion' AND (v_tablas.table_name LIKE 'nom_comite' OR v_tablas.table_name LIKE 'nom_motivoexclusion'
	                                     OR v_tablas.table_name LIKE 'nom_motivoreicorporacion' OR v_tablas.table_name LIKE 'nom_motivoseguimiento'
	                                     OR v_tablas.table_name LIKE 'nom_viareclutamiento'))
	    OR ($1 LIKE 'mod_regimentrabajo' AND (v_tablas.table_name LIKE 'conf_habcontrolacceso' OR v_tablas.table_name LIKE 'conf_horasextras'
	                                     OR v_tablas.table_name LIKE 'conf_habilitarhorarioentradasalida' OR v_tablas.table_name LIKE 'nom_causa'
	                                     OR v_tablas.table_name LIKE 'nom_tipodedia'))	                                     	         
	    
	   )THEN
	        RAISE NOTICE '**********************************************************************************************************************';
		RAISE NOTICE '*** AVISO: Tabla % descartada en el vaciado del esquema %. (((¡¡¡CONTENIDO PROTEGIDO!!!))) ***',v_tablas.table_name,$1;
		RAISE NOTICE '**********************************************************************************************************************';
	ELSE
		EXECUTE 'TRUNCATE TABLE ' ||$1||'.'||v_tablas.table_name||' CASCADE;';
		r := true;
	END IF;
	END LOOP;
END IF;
PERFORM * FROM mod_persona.f_reiniciarsecuencias($1);
RETURN r;
END;
$BODY$;

ALTER FUNCTION mod_persona.f_for_cleaning_schema(character varying)
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_persona.f_for_cleaning_schema(character varying)
    IS 'TRUNCATE TABLE mod_agendareunion.nom_causales CASCADE;';
