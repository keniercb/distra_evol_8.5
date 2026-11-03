--
-- PostgreSQL database dump
--

-- Dumped from database version 9.1.1
-- Dumped by pg_dump version 9.1.1
-- Started on 2015-09-16 10:58:12

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 33 (class 2615 OID 196633)
-- Name: mod_estructuracomp; Type: SCHEMA; Schema: -; Owner: zeolides
--

CREATE SCHEMA mod_estructuracomp;




--
-- TOC entry 8293 (class 0 OID 0)
-- Dependencies: 33
-- Name: SCHEMA mod_estructuracomp; Type: COMMENT; Schema: -; Owner: zeolides
--

COMMENT ON SCHEMA mod_estructuracomp IS 'Almacena toda la información de estructura y composición. (E&C)';


SET search_path = mod_estructuracomp, pg_catalog;

--
-- TOC entry 6062 (class 1247 OID 196636)
-- Dependencies: 33 1705
-- Name: td_tablaorganizacion; Type: TYPE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TYPE td_tablaorganizacion AS (
	identidad numeric(19,0),
	id numeric(19,0),
	denominacion character varying(255),
	cantidad numeric(19,0),
	esgrado numeric(1,0)
);




--
-- TOC entry 2695 (class 1255 OID 196637)
-- Dependencies: 33 6725
-- Name: crear_dominiofila(numeric, bit[]); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION crear_dominiofila(iddominio numeric, dominiofila bit[]) RETURNS bit[]
    LANGUAGE plpgsql
    AS $_$
DECLARE
	subdominiofila bit[];
    cantidadelementos NUMERIC;
    numero integer;
BEGIN
    if( COALESCE(array_upper($2, 1),0) < $1)then
	cantidadelementos = $1 - COALESCE(array_upper($2, 1),0) - 1;
    FOR i IN 1 .. cantidadelementos LOOP
    	subdominiofila = array_append(subdominiofila, 0::bit);
    END LOOP; 
    	subdominiofila =  $2 || subdominiofila || array[1::bit];     
    else
    subdominiofila = $2;
     subdominiofila[$1] = 1::bit;
    end if;
                                              
    RETURN subdominiofila; 
END;
$_$;


--
-- TOC entry 2742 (class 1255 OID 409023)
-- Dependencies: 33 6725
-- Name: f_actualizar_actual_visible(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_actualizar_actual_visible() RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_fecha date = CURRENT_DATE;
BEGIN
    -- DESACTIVAR
	UPDATE mod_estructuracomp.nom_cargo SET actual = 0
    WHERE fechafin < v_fecha;
    UPDATE mod_estructuracomp.nom_categocup SET actual = 0
    WHERE fechafin < v_fecha;
    UPDATE mod_estructuracomp.nom_categoria SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_escalasalarial SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_grado SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_grupocomplejidad SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_organo SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_preparacion SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_salario SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_subordinacion SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_tipoescala SET actual = 0
    WHERE fechafin < v_fecha;
     UPDATE mod_estructuracomp.nom_tipomedio SET actual = 0
    WHERE fechafin < v_fecha;
	 UPDATE mod_estructuracomp.nom_firma SET actual = 0
    WHERE fechafin < v_fecha;

    -- ACTIVAR
	UPDATE mod_estructuracomp.nom_cargo SET actual = 1, visible = 1
    WHERE v_fecha BETWEEN fechainicio AND fechafin;
    UPDATE mod_estructuracomp.nom_categocup SET actual = 1, visible = 1
    WHERE v_fecha BETWEEN fechainicio AND fechafin;
    UPDATE mod_estructuracomp.nom_categoria SET actual = 1, visible = 1
     WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_escalasalarial SET actual = 1, visible = 1
     WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_grado SET actual = 1, visible = 1
     WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_grupocomplejidad SET actual = 1, visible = 1
    WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_organo SET actual = 1, visible = 1
     WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_preparacion SET actual = 1, visible = 1
    WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_salario SET actual = 1, visible = 1
     WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_subordinacion SET actual = 1, visible = 1
    WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_tipoescala SET actual = 1, visible = 1
    WHERE v_fecha BETWEEN fechainicio AND fechafin;
     UPDATE mod_estructuracomp.nom_tipomedio SET actual = 1, visible = 1
     WHERE v_fecha BETWEEN fechainicio AND fechafin;
	 UPDATE mod_estructuracomp.nom_firma SET actual = 1, visible = 1
     WHERE v_fecha BETWEEN fechainicio AND fechafin;
    
	

RETURN TRUE;
END;
$$;


--
-- TOC entry 2698 (class 1255 OID 196638)
-- Dependencies: 33 6725
-- Name: f_cambiar_orden(numeric, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_cambiar_orden(hijo numeric, paramorden numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  datosHijo record;  
  datosPadre record;
  datos record;
    
  padre numeric;  
    
  lftPadre numeric;  
  rgtPadre numeric;
  
BEGIN
    SET search_path = mod_estructuracomp;

	SELECT * INTO datosHijo FROM nom_filaestruc WHERE idfila = hijo;
	padre:= datosHijo.idpadre;
	
	SELECT * INTO datosPadre FROM nom_filaestruc WHERE idfila = padre;
	-- RANGO DEL Padre
	
	lftPadre:= datosPadre.lft;
	rgtPadre:= datosPadre.rgt;

	IF paramOrden <> 0 THEN 
		UPDATE nom_filaestruc SET orden = paramOrden, nivel=paramOrden WHERE idfila = hijo;

		IF datosPadre.idfila = hijo THEN
			UPDATE nom_filaestruc SET orden = orden + 1, nivel = orden+1 WHERE idfila <> hijo AND idpadre = idfila AND orden >= paramOrden;
		ELSE
			UPDATE nom_filaestruc SET orden = orden + 1, nivel = orden+1 WHERE idfila <> hijo AND idpadre = padre AND orden >= paramOrden;
		END IF;
	    ELSE
		UPDATE nom_filaestruc SET orden = ((SELECT MAX(orden) FROM nom_filaestruc WHERE idpadre = padre)+1) WHERE idfila = hijo;
		UPDATE nom_filaestruc SET nivel = orden WHERE idfila = hijo;
	END IF;

	IF datosPadre.idfila = hijo THEN
		FOR datos IN (SELECT * FROM nom_filaestruc fila WHERE idfila = idpadre AND orden >= paramOrden and fechafin is NULL) LOOP
			lftPadre:= datos.lft;
			rgtPadre:= datos.rgt;
			Update mod_estructuracomp.nom_filaestruc ct
			SET nivel = 
				((
					SELECT CONCAT(fila.nivel,ct.orden)
					FROM mod_estructuracomp.nom_filaestruc fila
					WHERE fila.idfila = ct.idpadre
				 )::NUMERIC
				)
			WHERE ct.lft > lftPadre and ct.rgt < rgtPadre; 
		END LOOP; 		
	ELSE
		Update mod_estructuracomp.nom_filaestruc ct
		SET nivel = 
			((
				SELECT CONCAT(fila.nivel,ct.orden)
				FROM mod_estructuracomp.nom_filaestruc fila
				WHERE fila.idfila = ct.idpadre
			 )::NUMERIC
			)
		WHERE ct.lft > lftPadre and ct.rgt < rgtPadre; 
	END IF;	                                             
    RETURN TRUE; 
END;
$$;


--
-- TOC entry 2797 (class 1255 OID 196639)
-- Dependencies: 33 6725
-- Name: f_cancelar_proyecto(numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_cancelar_proyecto(proyecto numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  dato record;
BEGIN
	SET search_path = 'mod_estructuracomp';
	FOR dato IN (	SELECT f.idfila, f.idconcepto
			FROM nom_filaestruc f
			LEFT JOIN dat_estructura e ON (e.idestructura = f.idfila)
			LEFT JOIN dat_estructuraop op ON (op.idestructuraop = f.idfila)
			LEFT JOIN dat_cargo c ON (c.idcargo = f.idfila)
			LEFT JOIN dat_medio m ON (m.idmedio = f.idfila)
			WHERE 	(
				 (e.idproyecto 	= proyecto AND e.idestado  = 1) OR
				 (op.idproyecto = proyecto AND op.idestado = 1) OR
				 (c.idproyecto  = proyecto AND c.idestado  = 1) OR
				 (m.idproyecto  = proyecto AND m.idestado  = 1)
				)
			AND f.idfila NOT IN (
				SELECT fila.idfila
				FROM nom_filaestruc fila
				LEFT JOIN dat_estructura est ON (est.idestructura = fila.idfila)
				LEFT JOIN dat_estructuraop stop ON (stop.idestructuraop = fila.idfila)
				LEFT JOIN dat_cargo car ON (car.idcargo = fila.idfila)
				LEFT JOIN dat_medio med ON (med.idmedio = fila.idfila)
				WHERE 	(
					 (est.idproyecto  <> proyecto AND est.idproyecto <> 0) OR
					 (stop.idproyecto <> proyecto AND stop.idproyecto <> 0) OR
					 (car.idproyecto  <> proyecto AND car.idproyecto <> 0) OR
					 (med.idproyecto  <> proyecto AND med.idproyecto <> 0)
					)

			)
		)
	LOOP
			PERFORM mod_estructuracomp.f_eliminar_tree('nom_filaestruc', 'idfila', dato.idfila);
	END LOOP;

	UPDATE dat_estructura
	SET modificado [proyecto]=0
	WHERE (modificado [proyecto]=1);

	UPDATE dat_estructuraop
	SET modificado [proyecto]=0
	WHERE (modificado [proyecto]=1);

	UPDATE dat_cargo
	SET modificado [proyecto]=0
	WHERE (modificado [proyecto]=1);

	UPDATE dat_medio
	SET modificado [proyecto]=0
	WHERE (modificado [proyecto]=1);

	UPDATE dat_proyecto
	SET idpadre = 0
	WHERE idpadre = proyecto;

RETURN TRUE;
END;$$;


--
-- TOC entry 2798 (class 1255 OID 196640)
-- Dependencies: 33 6725
-- Name: f_copiar_estructura(numeric, numeric, numeric, boolean); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_copiar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric, cortar boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  datosReales RECORD;
  datosNuevos RECORD;
  datos RECORD;
  nuevoId NUMERIC;
  nuevoOrden NUMERIC;
  nuevoPadre NUMERIC;
  idAnteriores NUMERIC[];
  cantidad numeric = 0;
  consulta text;
BEGIN
	SET search_path = mod_estructuracomp;

	SELECT * INTO datosReales FROM nom_filaestruc WHERE idfila = idnodo;
    
    --INSERTAR EL NODO A REUBICAR CON EL NUEVO ID Y ORDEN
    SELECT last_value  INTO nuevoId FROM mod_estructuracomp.sec_filaestruc_seq;
	SELECT MAX(orden) INTO nuevoOrden FROM nom_filaestruc WHERE lft >= datosReales.lft AND rgt <= datosReales.rgt;
	nuevoId:=nuevoID+1;
	nuevoOrden:=nuevoOrden+1;
	idAnteriores [idnodo] := nuevoId;
	PERFORM f_nueva_fila(nuevoId,idnodopadre,datosReales.idconcepto,nuevoOrden,datosReales.dominiofila,datosReales.accesofila);	
	PERFORM f_duplicar_estructura(nuevoId, datosReales.idfila, datosReales.idconcepto, proyecto); 
    
    SELECT * INTO datosNuevos FROM nom_filaestruc WHERE idfila = nuevoId;
    
    -- INSERCION DE LOS NODOS RESTANTES HIJOS DEL QUE SE REUBICA     
    
    SELECT * INTO datosReales FROM nom_filaestruc WHERE idfila = idnodo;
	FOR datos IN (SELECT * FROM mod_estructuracomp.nom_filaestruc WHERE  lft > datosReales.lft and rgt < datosReales.rgt  and fechafin is null order by lft )
    LOOP
		SELECT last_value  INTO nuevoId FROM mod_estructuracomp.sec_filaestruc_seq;
		nuevoId:=nuevoId+1;
		idAnteriores [datos.idfila] := nuevoId;

		IF(cortar) THEN
			INSERT INTO dat_filacortada
			VALUES (
			  nuevoId,
			  datos.idfila,
			  proyecto
			);
		END IF;
		
        nuevoPadre:=idAnteriores[datos.idpadre];
		PERFORM f_nueva_fila(nuevoId,nuevoPadre,datos.idconcepto,datos.orden,datos.dominiofila,datos.accesofila);
		PERFORM f_duplicar_estructura(nuevoId, datos.idfila, datos.idconcepto, proyecto);
	END LOOP;
	RETURN TRUE;
END;
$$;


--
-- TOC entry 2799 (class 1255 OID 196641)
-- Dependencies: 33 6725
-- Name: f_cortar_estructura(numeric, numeric, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_cortar_estructura(idnodo numeric, idnodopadre numeric, proyecto numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
	datosReferencia record;
	datosReales record;
	datos record;
BEGIN
	SET search_path = mod_estructuracomp;
	PERFORM f_copiar_estructura(idnodo, idnodopadre, proyecto, true);
	IF(proyecto <> 0::numeric)THEN
		PERFORM f_eliminar_por_proyecto(idnodo, proyecto);
	ELSE
		SELECT * INTO datosReferencia FROM dat_filacortada WHERE idreferencia = idnodo AND idproyecto = proyecto;
		PERFORM f_eliminar_tree('nom_filaestruc', 'idfila', idnodo);
		IF(datosReferencia.idfila IS NOT NULL)THEN
			SELECT * INTO datosReales FROM nom_filaestruc WHERE idfila = datosReferencia.idfila;
			FOR datos IN (SELECT * FROM nom_filaestruc WHERE lft >= datosReales.lft AND rgt <= datosReales.rgt ORDER BY lft)
			LOOP
				SELECT * INTO datosReferencia FROM dat_filacortada WHERE idfila = datos.idfila AND idproyecto = proyecto;
				UPDATE nom_filaestruc
				   SET idfila = datosReferencia.idreferencia
				WHERE idfila = datos.idfila;

				DELETE FROM dat_filacortada
				WHERE idfila = datos.idfila AND idproyecto = proyecto;
			END LOOP;
		END IF;
	END IF;
	RETURN TRUE;
END;
$$;


--
-- TOC entry 2800 (class 1255 OID 196642)
-- Dependencies: 33 6725
-- Name: f_deshacer_eliminar(numeric, numeric, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_deshacer_eliminar(proyecto numeric, lft numeric, rgt numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
DECLARE
 datosReales record;
 datos record;
BEGIN
	SET search_path = 'mod_estructuracomp';
	FOR datos IN (SELECT * FROM nom_filaestruc as f WHERE ((f.lft >= $2 AND f.rgt <= $3)))
	LOOP
			IF (datos.idconcepto <= 4::numeric) THEN
				DELETE FROM dat_estructura WHERE (idestructura = datos.idfila AND idproyecto = $1 AND idestado = 3);

				UPDATE dat_estructura
				SET modificado [$1]=0
				WHERE (idestructura = datos.idfila AND modificado [$1]= 1);
			ELSE
				IF (datos.idconcepto = 7::numeric) THEN
					DELETE FROM dat_cargo WHERE (idcargo = datos.idfila AND idproyecto = $1 AND idestado = 3);

					UPDATE dat_cargo
					SET modificado [$1]= 0
					WHERE (idcargo = datos.idfila AND modificado [$1]= 1);
				ELSE

					IF (datos.idconcepto = 9::numeric) THEN
						DELETE FROM dat_medio WHERE (idmedio = datos.idfila AND idproyecto = $1 AND idestado = 3);

						UPDATE dat_medio
						SET modificado [$1]= 0
						WHERE (idmedio = datos.idfila AND modificado [$1]= 1);

					ELSE
						DELETE FROM dat_estructuraop WHERE (idestructuraop = datos.idfila AND idproyecto = $1 AND idestado = 3);

						UPDATE dat_estructuraop
						SET modificado [$1]= 0
						WHERE (idestructuraop = datos.idfila AND modificado [$1]= 1);
					END IF;
				END IF;
			END IF;

			SELECT * INTO datosReales FROM dat_filacortada WHERE idreferencia = datos.idfila AND idproyecto = $1;
			IF(datosReales.idfila IS NOT NULL)THEN
				PERFORM f_deshacer_proyecto(datosReales.idfila, $1, cast(1 as numeric), datos.idconcepto,true);
				DELETE FROM dat_filacortada WHERE idproyecto = $1 AND idreferencia = datos.idfila;
			END IF;

	END LOOP;
	RETURN true;
END;
$_$;


--
-- TOC entry 2801 (class 1255 OID 196643)
-- Dependencies: 33 6725
-- Name: f_deshacer_proyecto(numeric, numeric, numeric, numeric, boolean); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_deshacer_proyecto(identificador numeric, proyecto numeric, estado numeric, concepto numeric, cortar boolean) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
DECLARE
 rec record;
 result boolean = FALSE;
 datosReferencia record;
 datos record;
 datosReales record;
BEGIN
	SET search_path = 'mod_estructuracomp';
	IF ($3 = 1) THEN
		IF (cortar) THEN
			SELECT * INTO datosReferencia FROM dat_filacortada WHERE idreferencia = identificador AND idproyecto = proyecto;
			IF(datosReferencia.idfila IS NOT NULL)THEN
				PERFORM f_eliminar_tree('nom_filaestruc', 'idfila', datosReferencia.idfila);
				DELETE FROM dat_filacortada WHERE idreferencia = identificador AND idproyecto = proyecto;
			END IF;
		ELSE
			SELECT * INTO datosReferencia FROM dat_filacortada WHERE idfila = identificador AND idproyecto = proyecto;
			PERFORM f_eliminar_tree('nom_filaestruc', 'idfila', $1);
			IF(datosReferencia.idfila IS NOT NULL)THEN
				SELECT * INTO datos FROM nom_filaestruc WHERE idfila = datosReferencia.idreferencia;
				DELETE FROM dat_filacortada WHERE idfila = identificador AND idproyecto = proyecto;
				PERFORM f_deshacer_eliminar(proyecto, datos.lft, datos.rgt);
			END IF;
		END IF;


	END IF;

	IF ($4 <= 4::numeric) THEN
		IF($3 = 2) THEN
			DELETE FROM dat_estructura WHERE (idestructura = $1 AND idproyecto = $2 AND idestado = 2);

			UPDATE dat_estructura
			SET modificado [$2]= 0
			WHERE (idestructura= $1 AND modificado [$2]= 1);

		ELSE
			IF($3 = 3) THEN
				SELECT rgt, lft INTO rec
				FROM nom_filaestruc f
				INNER JOIN dat_estructura e ON (f.idfila = e.idestructura)
				WHERE (f.idfila = $1 AND e.idproyecto = $2);

				PERFORM f_deshacer_eliminar($2, rec.lft, rec.rgt);
			END IF;
		END IF;
	ELSE
		IF ($4 = 7::numeric) THEN
				IF($3 = 2) THEN
					DELETE FROM dat_cargo WHERE (idcargo = $1 AND idproyecto = $2 AND idestado = 2);

					UPDATE dat_cargo
					SET modificado [$2]= 0
					WHERE (idcargo = $1 AND modificado [$2]= 1);
				ELSE
					IF($3 = 3) THEN
						SELECT rgt, lft INTO rec
						FROM nom_filaestruc f
						INNER JOIN dat_cargo e ON (f.idfila = e.idcargo)
						WHERE (f.idfila = $1 AND e.idproyecto = $2);

						PERFORM f_deshacer_eliminar($2, rec.lft, rec.rgt);
					END IF;
				END IF;
		ELSE
			IF ($4 = 9::numeric) THEN
				IF($3 = 2) THEN
					DELETE FROM dat_medio WHERE (idmedio = $1 AND idproyecto = $2 AND idestado = 2);

					UPDATE dat_medio
					SET modificado [$2]= 0
					WHERE (idmedio = $1 AND modificado [$2]= 1);
				ELSE
					IF($3 = 3) THEN
						SELECT rgt, lft INTO rec
						FROM nom_filaestruc f
						INNER JOIN dat_medio e ON (f.idfila = e.idmedio)
						WHERE (e.idmedio = $1 AND e.idproyecto = $2);

						PERFORM f_deshacer_eliminar($2, rec.lft, rec.rgt);
					END IF;
				END IF;
			ELSE
				IF($3 = 2) THEN
					DELETE FROM dat_estructuraop WHERE (idestructuraop = $1 AND idproyecto = $2 AND idestado = 2);

					UPDATE dat_estructuraop
					SET modificado [$2]= 0
					WHERE (idestructuraop = $1 AND modificado [$2]= 1);
				ELSE
					IF($3 = 3) THEN
						SELECT rgt, lft INTO rec
						FROM nom_filaestruc f
						INNER JOIN dat_estructuraop e ON (f.idfila = e.idestructuraop)
						WHERE (f.idfila = $1 AND e.idproyecto = $2);

						PERFORM f_deshacer_eliminar($2, rec.lft, rec.rgt);
					END IF;
				END IF;
			END IF;
		END IF;
	END IF;

	SELECT COUNT(f.idfila) as cantidad INTO rec
	FROM nom_filaestruc as f
	LEFT JOIN dat_estructura as e ON (f.idfila = e.idestructura)
	LEFT JOIN dat_estructuraop as op ON (f.idfila = op.idestructuraop)
	LEFT JOIN dat_medio as m ON (f.idfila = m.idmedio)
	LEFT JOIN dat_cargo as c ON (f.idfila = c.idcargo)
	WHERE (e.idproyecto = $2 OR op.idproyecto = $2 OR m.idproyecto = $2 OR c.idproyecto = $2);

	IF (rec.cantidad = 0) THEN
		UPDATE dat_proyecto
		SET modificado = 0
		WHERE (idproyecto = $2);
	END IF;

	RETURN true;
END;
$_$;


--
-- TOC entry 2802 (class 1255 OID 196644)
-- Dependencies: 33 6725
-- Name: f_duplicar_estructura(numeric, numeric, numeric, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_duplicar_estructura(idnuevo numeric, idnodo numeric, concepto numeric, proyecto numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  datosReales record;
  datosCivil record;
  datosMilitar record;
  proyectoCargo NUMERIC;
BEGIN
	SET search_path = mod_estructuracomp;
	IF(concepto <= 4 :: NUMERIC)THEN
		IF(proyecto <> 0)THEN
			SELECT * INTO datosReales FROM dat_estructura WHERE idestructura = idnodo AND ((idestado = 0 and modificado [proyecto] = 0) OR (idproyecto = proyecto));
			datosReales.idestado := 1;
		ELSE
			SELECT * INTO datosReales FROM dat_estructura WHERE idestructura = idnodo AND idestado = 0;
		END IF;

		IF(datosReales.idproyecto = 0 :: numeric AND proyecto <> 0)THEN
		 datosReales.idproyecto := proyecto;
		END IF;

		IF(datosReales.idestructura IS NOT NULL)THEN
			INSERT INTO dat_estructura
			(
				idestructura,
				idconcepto,
				idespecialidad,
				idorgano,
				denominacion,
				abreviatura,
				codigo,
				fax,
				telefono,
				iddpt,
				direccion,
				correo,
				objetosocial,
				funcioneslegales,
				idproyecto,
				idestado,
				idtipoescala,
				idicono
			)
			VALUES (
			  idNuevo,
			  datosReales.idconcepto,
			  datosReales.idespecialidad,
			  datosReales.idorgano,
			  datosReales.denominacion,
			  datosReales.abreviatura,
			  datosReales.codigo,
			  datosReales.fax,
			  datosReales.telefono,
			  datosReales.iddpt,
			  datosReales.direccion,
			  datosReales.correo,
			  datosReales.objetosocial,
			  datosReales.funcioneslegales,
			  datosReales.idproyecto,
			  datosReales.idestado,
			  datosReales.idtipoescala,
			  datosReales.idicono
			);
		END IF;

	ELSE
		IF(concepto = 7 :: NUMERIC)THEN
			IF(proyecto <> 0)THEN
				SELECT * INTO datosReales FROM dat_cargo WHERE idcargo = idnodo AND ((idestado = 0 and modificado [proyecto] = 0) OR (idproyecto = proyecto));
				datosReales.idestado := 1;
			ELSE
				SELECT * INTO datosReales FROM dat_cargo WHERE idcargo = idnodo AND idestado = 0;
			END IF;
			proyectoCargo:=datosReales.idproyecto;
			IF(datosReales.idproyecto = 0 :: numeric AND proyecto <> 0)THEN
			 datosReales.idproyecto := proyecto;
			END IF;
			IF(datosReales.idcargo IS NOT NULL) THEN
				INSERT INTO dat_cargo
				(
					idcargo,
					idpreparacion,
					idespecialidadpreparacion,
					idsalario,
					idnomcargo,
					cantidad,
					cantidadreal,
					idproyecto,
					idestado,
					idespecialidadempleo,
					temporal,
					directo,
                    idtipoescala
				)
				VALUES (
				  idNuevo,
				  datosReales.idpreparacion,
				  datosReales.idespecialidadpreparacion,
				  datosReales.idsalario,
				  datosReales.idnomcargo,
				  datosReales.cantidad,
				  datosReales.cantidadreal,
				  datosReales.idproyecto,
				  datosReales.idestado,
				  datosReales.idespecialidadempleo,
				  datosReales.temporal,
				  datosReales.directo,
                  datosReales.idtipoescala
				);

				SELECT * INTO datosCivil FROM dat_cargocivil WHERE idcargo = datosReales.idcargo AND idproyecto = proyectoCargo;
				
				IF(datosCivil.idcargo IS NOT NULL) THEN
					INSERT INTO dat_cargocivil
					(
						idcargo,
						idcategocup,
						idproyecto
					)
					VALUES (
					  idNuevo,
					  datosCivil.idcategocup,
					  datosReales.idproyecto
					);
				ELSE
					SELECT * INTO datosMilitar FROM dat_cargomilitar WHERE idcargo = datosReales.idcargo AND idproyecto = proyectoCargo;

					INSERT INTO dat_cargomilitar
					(
						idcargo,
						idgrado,
						idproyecto
					)
					VALUES (
					  idNuevo,
					  datosMilitar.idgrado,
					  datosReales.idproyecto
					);
				END IF;
			END IF;

		ELSE
			IF(concepto = 9 :: NUMERIC)THEN
				IF(proyecto <> 0)THEN
					SELECT * INTO datosReales FROM dat_medio WHERE idmedio = idnodo AND ((idestado = 0 and modificado [proyecto] = 0) OR (idproyecto = proyecto));
					datosReales.idestado := 1;
				ELSE
					SELECT * INTO datosReales FROM dat_medio WHERE idmedio = idnodo AND idestado = 0;
				END IF;

				IF(datosReales.idproyecto = 0 :: numeric AND proyecto <> 0)THEN
				 datosReales.idproyecto := proyecto;
				END IF;
				IF(datosReales.idmedio IS NOT NULL)THEN
					INSERT INTO dat_medio
					(
						idmedio,
						idtipomedio,
						idnommedio,
						cantidad,
						idestado,
						idproyecto,
						cantidadreal,
						idicono
					)
					VALUES (
					  idNuevo,
					  datosReales.idtipomedio,
					  datosReales.idnommedio,
					  datosReales.cantidad,
					  datosReales.idestado,
					  datosReales.idproyecto,
					  datosReales.cantidadreal,
					  datosReales.idicono
					);
				END IF;
			ELSE
				IF(proyecto <> 0)THEN
					SELECT * INTO datosReales FROM dat_estructuraop WHERE idestructuraop = idnodo AND ((idestado = 0 and modificado [proyecto] = 0) OR (idproyecto = proyecto));
					datosReales.idestado := 1;
				ELSE
					SELECT * INTO datosReales FROM dat_estructuraop WHERE idestructuraop = idnodo AND idestado = 0;
				END IF;

				IF(datosReales.idproyecto = 0 :: numeric AND proyecto <> 0)THEN
				 datosReales.idproyecto := proyecto;
				END IF;
				IF(datosReales.idestructuraop IS NOT NULL) THEN
					INSERT INTO dat_estructuraop(
						idestructuraop,
						idorgano,
						idconcepto,
						denominacion,
						abreviatura,
						idproyecto,
                        codigo,
						idestado)
					VALUES (
					  idNuevo,
					  datosReales.idorgano,
					  datosReales.idconcepto,
					  datosReales.denominacion,
					  datosReales.abreviatura,
					  datosReales.idproyecto,
					  datosReales.codigo,
					  datosReales.idestado
					);
				END IF;
			END IF;
		END IF;
	END IF;

	UPDATE dat_proyecto
	SET modificado=1
	WHERE idproyecto = 1;

	RETURN TRUE;
END;
$$;


--
-- TOC entry 2803 (class 1255 OID 196645)
-- Dependencies: 33 6725
-- Name: f_eliminar_por_proyecto(numeric, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_eliminar_por_proyecto(identificador numeric, proyecto numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
  DECLARE
    rec      RECORD;
    datos    RECORD;
    valores  RECORD;
    temporal RECORD;
  BEGIN
    SET search_path = 'mod_estructuracomp';
    SELECT rgt,lft INTO rec FROM nom_filaestruc WHERE idfila = $1;

    FOR datos IN (SELECT * FROM nom_filaestruc WHERE lft >= rec.lft AND rgt <= rec.rgt) LOOP
	--SI ES UNA ESTRUCTURA
      IF (datos.idconcepto <= 4 :: NUMERIC) THEN
	--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
        SELECT * INTO valores FROM dat_estructura WHERE idestructura = datos.idfila AND idproyecto = 0;

	IF (valores.idestructura IS NOT NULL) THEN
		--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
		valores.idproyecto := $2;
		valores.idestado := 3;

		--INSERTA LA NUEVA ESTRUCTURA
		INSERT INTO dat_estructura VALUES (
		  valores.idestructura,
		  valores.idconcepto,
		  valores.idespecialidad,
		  valores.idorgano,
		  valores.denominacion,
		  valores.abreviatura,
		  valores.codigo,
		  valores.fax,
		  valores.telefono,
		  valores.iddpt,
		  valores.direccion,
		  valores.correo,
		  valores.objetosocial,
		  valores.funcioneslegales,
		  valores.idproyecto,
		  valores.idestado,
		  valores.modificado,
		  valores.idtipoescala
		);

		--ACTUALIZA EL CAMPO MODIFICADO DE LA ESTRUCTURA ORIGINAL
		UPDATE dat_estructura SET modificado [$2]=1 WHERE (idestructura = datos.idfila AND idproyecto = 0);
	END IF;
      ELSE
	--SI ES UN CARGO
        IF (datos.idconcepto = 7 :: NUMERIC) THEN

	--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
          SELECT * INTO valores FROM dat_cargo WHERE idcargo = datos.idfila AND idproyecto = 0;

		IF (valores.idcargo IS NOT NULL) THEN
			--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
			  valores.idproyecto := $2;
			  valores.idestado := 3;
			--INSERTA EL NUEVO CARGO
			  INSERT INTO dat_cargo VALUES (
			    valores.idcargo,
			    valores.idpreparacion,
			    valores.idespecialidadpreparacion,
			    valores.idsalario,
			    valores.idnomcargo,
			    valores.cantidad,
			    valores.cantidadreal,
			    valores.idproyecto,
			    valores.idestado,
			    valores.modificado,
			    valores.idespecialidadempleo,
			    valores.temporal
			  );

			--ACTUALIZA EL CAMPO MODIFICADO DEL CARGO ORIGINAL
			  UPDATE dat_cargo
			  SET modificado [$2]=1
			  WHERE (idcargo = datos.idfila AND idproyecto = 0);

			--PARA LOS DATOS DEL CARGO CIVIL
			--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
			  SELECT *  INTO temporal FROM dat_cargocivil WHERE idcargo = valores.idcargo AND idproyecto = 0;

			  IF (temporal.idcargo IS NOT NULL) THEN
				--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
			    temporal.idproyecto := $2;

				--INSERTA EL NUEVO CARGO CIVIL
			    INSERT INTO dat_cargocivil VALUES (
			      temporal.idcargo,
			      temporal.idcategocup,
			      temporal.idproyecto
			    );
			  ELSE
			--PARA LOS DATOS DEL CARGO MILITAR
			--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
			    SELECT * INTO temporal FROM dat_cargomilitar WHERE idcargo = valores.idcargo AND idproyecto = 0;
			    temporal.idproyecto := $2;

			--INSERTA EL NUEVO CARGO MILITAR
			    INSERT INTO dat_cargomilitar VALUES (
			      temporal.idcargo,
			      temporal.idgrado,
			      temporal.idproyecto
			    );
			  END IF;
		END IF;
        ELSE
	--SI ES UN MEDIO
          IF (datos.idconcepto = 9 :: NUMERIC)
          THEN
	--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
            SELECT * INTO valores FROM dat_medio WHERE idmedio = datos.idfila AND idproyecto = 0;

	    IF (valores.idmedio IS NOT NULL) THEN
		--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
		    valores.idproyecto := $2;
		    valores.idestado := 3;

		--INSERTA EL NUEVO MEDIO
		    INSERT INTO dat_medio VALUES (
		      valores.idmedio,
		      valores.idtipomedio,
		      valores.idnommedio,
		      valores.cantidad,
		      valores.idestado,
		      valores.idproyecto,
		      valores.cantidadreal,
		      valores.modificado,
		      valores.idicono
		    );

		--ACTUALIZA EL CAMPO MODIFICADO DEL MEDIO ORIGINAL
		    UPDATE dat_medio
		    SET modificado [$2]=1
		    WHERE (idmedio = datos.idfila AND idproyecto = 0);
	    END IF;
	
          ELSE
	--SI ES UNA ESTRUCTURA INTERNA
	--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
            SELECT * INTO valores FROM dat_estructuraop WHERE idestructuraop = datos.idfila AND idproyecto = 0;

		IF (valores.idestructuraop IS NOT NULL) THEN
		--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
		    valores.idproyecto := $2;
		    valores.idestado := 3;

		--INSERTA LA NUEVA ESTRUCTURA INTERNA
		    INSERT INTO dat_estructuraop VALUES (
		      valores.idestructuraop,
		      valores.idorgano,
		      valores.idconcepto,
		      valores.denominacion,
		      valores.abreviatura,
		      valores.idproyecto,
		      valores.idestado,
		      valores.modificado

		    );

		--ACTUALIZA EL CAMPO MODIFICADO DE LA ESTRUCTURA INTERNA ORIGINAL
		    UPDATE dat_estructuraop
		    SET modificado [$2]=1
		    WHERE (idestructuraop = datos.idfila AND idproyecto = 0);
		  END IF;
		END IF;
        END IF;
      END IF;
    END LOOP;

    RETURN TRUE;
  END;
  $_$;


--
-- TOC entry 2804 (class 1255 OID 196646)
-- Dependencies: 33 6725
-- Name: f_eliminar_tree(character varying, character varying, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_eliminar_tree(table_name character varying, campo character varying, identificador numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
DECLARE
 rec record;
BEGIN
	SET search_path = 'mod_estructuracomp';	
	--Captura de los datos del elemento segun el identificador insertado	
	
	EXECUTE 'SELECT * FROM '||$1||' WHERE '||$2||'='||$3 INTO rec;

	--Eliminacion del elemento requerido (CASCADE)
	EXECUTE 'DELETE FROM '||$1||' WHERE '||$2||'='||$3;

	--Reordenar los izquierdos y derechos del arbol
	IF ((rec.rgt - rec.lft ) = 1)THEN --Si es HOJA
		--Paso 1 Decrementar los izquierdos		
		EXECUTE 'UPDATE '||$1||' SET lft=lft -2 where lft> '||rec.lft;
		--Paso 2 Decrementar los derechos
		EXECUTE 'UPDATE '||$1||' SET rgt=rgt -2 where rgt> '||rec.rgt;	
	ELSE --Si no es hoja
		--Paso 1 Decrementar los izquierdos
		EXECUTE 'UPDATE '||$1||' SET lft=(lft - ('||rec.rgt - rec.lft||'))-1 where lft>'||rec.lft;
		--Paso 2 Decrementar los derechos	
		EXECUTE 'UPDATE '||$1||' SET rgt=(rgt - ('||rec.rgt - rec.lft||'))-1 where rgt>'||rec.rgt;
      
	END IF;
	RETURN true;
END;
$_$;


--
-- TOC entry 2795 (class 1255 OID 196647)
-- Dependencies: 33 6725
-- Name: f_eliminar_tree_fechafin(numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_eliminar_tree_fechafin(identificador numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
DECLARE
 rec record;
BEGIN
	SET search_path = 'mod_estructuracomp';	
	--Captura de los datos del elemento segun el identificador insertado	
	
	SELECT * INTO rec FROM nom_filaestruc WHERE idfila = $1;
	UPDATE nom_filaestruc SET fechafin = current_date WHERE lft >=rec.lft AND rgt<=rec.rgt;
	
	RETURN true;
END;
$_$;


--
-- TOC entry 2796 (class 1255 OID 196648)
-- Dependencies: 33 6725
-- Name: f_merge_proyecto(numeric[], numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_merge_proyecto(ids numeric[], usser numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
  DECLARE
    rec      RECORD;
    valores  RECORD;
    temporal RECORD;
    data     RECORD;
    dens     RECORD;
    cantidad INTEGER;
    existen  INTEGER;
    inId     TEXT = '';
    denom    TEXT = '';
    descrip  TEXT = 'Union de los proyectos ';
    proyecto NUMERIC;
    i        NUMERIC;
  BEGIN
    SET search_path = 'mod_estructuracomp';
    cantidad := array_upper(ids, 1) :: INTEGER;
    FOR i IN 0 .. cantidad - 1 LOOP
      IF i < cantidad - 1
      THEN
        inId := inId || ids [i + 1] || ', ';
      ELSE
        inId := inId || ids [i + 1];
      END IF;
    END LOOP;
    cantidad := cantidad - 1;
    FOR dens IN EXECUTE
    'SELECT denominacion FROM dat_proyecto as p WHERE p.idproyecto IN (' || inId || ') AND idusuario = ' || usser
    LOOP
      IF cantidad > 0
      THEN
        denom := denom || dens.denominacion || '_';
      ELSE
        denom := denom || dens.denominacion;
      END IF;


      IF cantidad > 1
      THEN
        descrip := descrip || dens.denominacion || ', ';
      ELSE
        IF cantidad = 1
        THEN
          descrip := descrip || dens.denominacion || ' y ';
        ELSE
          descrip := descrip || dens.denominacion || '.';
        END IF;
      END IF;
      cantidad := cantidad - 1;
    END LOOP;

    INSERT INTO dat_proyecto (denominacion, descripcion, idusuario, modificado, fecha)
      VALUES (denom, descrip, usser, 1, CURRENT_DATE);
    SELECT
      p.idproyecto
    INTO proyecto
    FROM dat_proyecto AS p
    WHERE denominacion LIKE denom AND descripcion LIKE descrip AND idusuario = usser;

    FOR rec IN EXECUTE ('SELECT fila.idfila as id, fila.idconcepto,
					CASE
						WHEN estructura.idestructura IS NOT NULL THEN estructura.idproyecto
						WHEN estructuraop.idestructuraop IS NOT NULL THEN estructuraop.idproyecto
						WHEN cargo.idcargo IS NOT NULL THEN cargo.idproyecto
						WHEN medio.idmedio IS NOT NULL THEN medio.idproyecto
					END AS idp
				FROM nom_filaestruc as fila
				LEFT JOIN dat_estructura as estructura ON fila.idfila = estructura.idestructura
				LEFT JOIN dat_estructuraop as estructuraop ON fila.idfila = estructuraop.idestructuraop
				LEFT JOIN dat_cargo as cargo ON fila.idfila = cargo.idcargo
				LEFT JOIN dat_medio as medio ON fila.idfila = medio.idmedio
				WHERE 	(estructura.idproyecto 		IN (' || inId || ')) OR
					(estructuraop.idproyecto 	IN (' || inId || ')) OR
					(cargo.idproyecto 		IN (' || inId || ')) OR
					(medio.idproyecto 		IN (' || inId || '))
				ORDER BY idp ASC')
    LOOP

      IF (rec.idconcepto <= 4 :: NUMERIC)
      THEN
--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
        FOR valores IN EXECUTE (
          'SELECT * FROM dat_estructura WHERE idestructura = ' || rec.id || ' AND idproyecto IN (' || inId || ')')
        LOOP
--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO

          SELECT
            COUNT(est.idestructura)
          INTO existen
          FROM dat_estructura AS est
          WHERE est.idestructura = valores.idestructura AND est.idproyecto = proyecto;

          IF (existen = 0)
          THEN
            valores.idproyecto := proyecto;
--INSERTA LA NUEVA ESTRUCTURA
            INSERT INTO dat_estructura VALUES (
              valores.idestructura,
              valores.idconcepto,
              valores.idespecialidad,
              valores.idorgano,
              valores.denominacion,
              valores.abreviatura,
              valores.codigo,
              valores.fax,
              valores.telefono,
              valores.iddpt,
              valores.direccion,
              valores.correo,
              valores.objetosocial,
              valores.funcioneslegales,
              valores.idproyecto,
              valores.idestado,
              valores.modificado,
              valores.idtipoescala,
              valores.idicono
            );
          END IF;
        END LOOP;
      ELSE
--SI ES UN CARGO
        IF (rec.idconcepto = 7 :: NUMERIC)
        THEN
--PARA LOS DATOS DEL CARGO PADRE

--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
          FOR valores IN EXECUTE ('SELECT * FROM dat_cargo WHERE idcargo = ' || rec.id || ' AND idproyecto IN (' || inId
                                  || ')')
          LOOP
            SELECT
              COUNT(car.idcargo)
            INTO existen
            FROM dat_cargo AS car
            WHERE car.idcargo = valores.idcargo AND car.idproyecto = proyecto;

            IF existen = 0
            THEN
--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
              valores.idproyecto := proyecto;

--INSERTA EL NUEVO CARGO
              INSERT INTO dat_cargo VALUES (
                valores.idcargo,
                valores.idpreparacion,
                valores.idespecialidadpreparacion,
                valores.idsalario,
                valores.idnomcargo,
                valores.cantidad,
                valores.cantidadreal,
                valores.idproyecto,
                valores.idestado,
                valores.modificado,
                valores.idespecialidadempleo,
                valores.temporal,
                valores.directo
              );

--PARA LOS DATOS DEL CARGO CIVIL
--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
              FOR temporal IN EXECUTE (
                'SELECT * FROM dat_cargocivil WHERE idcargo = ' || rec.id || ' AND idproyecto IN (' || inId ||
                ')') LOOP temporal := temporal;
              END LOOP;

              IF (temporal.idcargo IS NOT NULL)
              THEN
--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
                temporal.idproyecto := proyecto;

--INSERTA EL NUEVO CARGO CIVIL
                INSERT INTO dat_cargocivil VALUES (
                  temporal.idcargo,
                  temporal.idcategocup,
                  temporal.idproyecto
                );
              ELSE
--PARA LOS DATOS DEL CARGO MILITAR
--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
                FOR temporal IN EXECUTE (
                  'SELECT * FROM dat_cargomilitar WHERE idcargo = ' || rec.id || ' AND idproyecto IN (' || inId ||
                  ')') LOOP temporal := temporal;
                END LOOP;
--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
                temporal.idproyecto := proyecto;

--INSERTA EL NUEVO CARGO MILITAR
                INSERT INTO dat_cargomilitar VALUES (
                  temporal.idcargo,
                  temporal.idgrado,
                  temporal.idproyecto
                );
              END IF;
            END IF;
          END LOOP;

        ELSE
--SI ES UN MEDIO
          IF (rec.idconcepto = 9 :: NUMERIC)
          THEN
--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
            FOR valores IN EXECUTE (
              'SELECT * FROM dat_medio WHERE idmedio = ' || rec.id || ' AND idproyecto IN (' || inId || ')')
            LOOP
              SELECT
                COUNT(med.idmedio)
              INTO existen
              FROM dat_medio AS med
              WHERE med.idmedio = valores.idmedio AND med.idproyecto = proyecto;

              IF existen = 0
              THEN
--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
                valores.idproyecto := proyecto;

--INSERTA EL NUEVO MEDIO
                INSERT INTO dat_medio VALUES (
                  valores.idmedio,
                  valores.idtipomedio,
                  valores.idnommedio,
                  valores.cantidad,
                  valores.idestado,
                  valores.idproyecto,
                  valores.cantidadreal,
                  valores.modificado,
                  valores.idicono
                );
              END IF;
            END LOOP;


          ELSE
--SI ES UNA ESTRUCTURA INTERNA
--BUSCA LOS DATOS DE LA ESTRUCTURA PIVOTE
            FOR valores IN EXECUTE (
              'SELECT * FROM dat_estructuraop WHERE idestructuraop = ' || rec.id || ' AND idproyecto IN (' || inId ||
              ')')
            LOOP
              SELECT
                COUNT(op.idestructuraop)
              INTO existen
              FROM dat_estructuraop AS op
              WHERE op.idestructuraop = valores.idestructuraop AND op.idproyecto = proyecto;

              IF existen = 0
              THEN
--ACTUALIZA EL CAMPO PARA EL PROYECTO Y EL ESTADO
                valores.idproyecto := proyecto;

--INSERTA LA NUEVA ESTRUCTURA INTERNA
                INSERT INTO dat_estructuraop VALUES (
                  valores.idestructuraop,
                  valores.idorgano,
                  valores.idconcepto,
                  valores.denominacion,
                  valores.abreviatura,
                  valores.idproyecto,
                  valores.idestado,
                  valores.modificado
                );
              END IF;
            END LOOP;
          END IF;
        END IF;
      END IF;
    END LOOP;

    EXECUTE ('UPDATE dat_proyecto
	SET idpadre = ' || proyecto || '
	WHERE (idproyecto IN (' || inId || '))');
    RETURN TRUE;
  END;
  $$;


--
-- TOC entry 2744 (class 1255 OID 300406)
-- Dependencies: 33 6725
-- Name: f_nueva_fila(numeric, numeric, numeric, numeric, bit[], bit[]); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_nueva_fila(id numeric, padre numeric, concepto numeric, orden numeric, dominio bit[], acceso bit[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
	SET search_path = mod_estructuracomp;
	
	INSERT INTO nom_filaestruc (
		idfila,
		idpadre,
		idconcepto,
		orden,
		dominiofila,
		accesofila
	)
	VALUES (
		id,
		padre,
		concepto,
		orden,
		dominio,
		acceso
	); 
	RETURN TRUE;
END;
$$;


--
-- TOC entry 2741 (class 1255 OID 242781)
-- Dependencies: 33 6725
-- Name: f_nueva_fila(numeric, numeric, numeric, numeric, date, bit[], bit[]); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_nueva_fila(id numeric, padre numeric, concepto numeric, orden numeric, fechaend date, dominio bit[], acceso bit[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
	SET search_path = mod_estructuracomp;
	
	INSERT INTO nom_filaestruc (
		idfila,
		idpadre,
		idconcepto,
		orden,
        fechafin,
		dominiofila,
		accesofila
	)
	VALUES (
		id,
		padre,
		concepto,
		orden,
        fechaend,
		dominio,
		acceso
	); 
	RETURN TRUE;
END;
$$;


--
-- TOC entry 2805 (class 1255 OID 196651)
-- Dependencies: 33 6725
-- Name: f_poner_en_vigor(numeric, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_poner_en_vigor(proyecto numeric, usuario numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
DECLARE
  result boolean = true;
  datosReferencia record;
  valores record;
  dato record;
BEGIN
	SET search_path = 'mod_estructuracomp';

	-- ELIMINAR LAS ESTRUCTURAS MARCADAS PARA ELIMINACION ANTES DE CUALQUIER OTRO PROCESO
	-- PARA DISMINUIR EL RANGO DE CONSULTAS
	FOR valores IN (
			SELECT f.idfila, f.rgt, f.lft
			FROM nom_filaestruc f
			LEFT JOIN dat_estructura e ON (e.idestructura = f.idfila)
			LEFT JOIN dat_estructuraop op ON (op.idestructuraop = f.idfila)
			LEFT JOIN dat_cargo c ON (c.idcargo = f.idfila)
			LEFT JOIN dat_medio m ON (m.idmedio = f.idfila)
			WHERE (e.idproyecto  = $1 AND e.idestado  = 3) OR
			      (op.idproyecto = $1 AND op.idestado = 3) OR
			      (c.idproyecto  = $1 AND c.idestado  = 3) OR
			      (m.idproyecto  = $1 AND m.idestado  = 3)
			ORDER BY f.idfila ASC
		      )

	LOOP	

		PERFORM f_eliminar_tree_fechafin(valores.idfila);
	
	
		/*--Eliminacion del elemento requerido (CASCADE)
		DELETE FROM nom_filaestruc WHERE idfila = valores.idfila;

		--Reordenar los izquierdos y derechos del arbol
		IF ((valores.rgt - valores.lft ) = 1)THEN --Si es HOJA
			--Paso 1 Decrementar los izquierdos
			EXECUTE 'UPDATE nom_filaestruc SET lft = lft -2 where lft > '||valores.lft;
			--Paso 2 Decrementar los derechos
			EXECUTE 'UPDATE nom_filaestruc SET rgt = rgt -2 where rgt > '||valores.rgt;
		ELSE --Si no es hoja
			--Paso 1 Decrementar los izquierdos
			EXECUTE 'UPDATE nom_filaestruc SET lft = (lft - ('||valores.rgt - valores.lft||'))-1 where lft > '||valores.lft;
			--Paso 2 Decrementar los derechos
			EXECUTE 'UPDATE nom_filaestruc SET rgt = (rgt - ('||valores.rgt - valores.lft||'))-1 where rgt > '||valores.rgt;

		END IF;*/
	END LOOP;


	-- INSERTADOS Y MODIFICADOS DE DAT_ESTRUCTURA
	FOR valores IN (SELECT * FROM dat_estructura WHERE idproyecto = $1 AND idestado <> 0)
	LOOP
		IF (valores.idestado = 1) THEN
			SELECT * INTO datosReferencia FROM dat_filacortada WHERE idfila = valores.idestructura AND idproyecto = $1;
			IF(datosReferencia.idfila IS NOT NULL) THEN
				UPDATE nom_filaestruc
				   SET idfila = datosReferencia.idreferencia
				WHERE idfila = valores.idestructura;

				DELETE FROM dat_filacortada
				WHERE idfila = valores.idestructura AND idproyecto = $1;
			END IF;

			UPDATE dat_estructura
			SET idproyecto = 0, idestado = 0, modificado [$1]=0
			WHERE (idproyecto = $1 AND idestado = 1) OR modificado [$1]=1;
		ELSE
			IF (valores.idestado = 2) THEN
				SELECT * INTO dato FROM dat_estructura
				WHERE (idestructura = valores.idestructura AND idproyecto = 0);

				valores.modificado := dato.modificado;
				valores.modificado[$1] := 0;

				DELETE FROM dat_estructura
				WHERE (idestructura = valores.idestructura AND idproyecto = 0);

				UPDATE dat_estructura
				SET idproyecto = 0, idestado = 0, modificado = valores.modificado
				WHERE (idestructura= valores.idestructura AND idproyecto = $1 AND idestado = 2);
			END IF;
		END IF;
	END LOOP;


	-- INSERTADOS Y MODIFICADOS DE DAT_ESTRUCTURAOP
	FOR valores IN (SELECT * FROM dat_estructuraop WHERE idproyecto = $1 AND idestado <> 0)
	LOOP
		IF (valores.idestado = 1) THEN
			SELECT * INTO datosReferencia FROM dat_filacortada WHERE idfila = valores.idestructuraop AND idproyecto = $1;
			IF(datosReferencia.idfila IS NOT NULL) THEN
				UPDATE nom_filaestruc
				   SET idfila = datosReferencia.idreferencia
				WHERE idfila = valores.idestructuraop;

				DELETE FROM dat_filacortada
				WHERE idfila = valores.idestructuraop AND idproyecto = $1;
			END IF;

			UPDATE dat_estructuraop
			SET idproyecto = 0, idestado = 0, modificado [$1]=0
			WHERE (idproyecto = $1 AND idestado = 1) OR modificado [$1]=1;
		ELSE
			IF (valores.idestado = 2) THEN
				SELECT * INTO dato FROM dat_estructuraop
				WHERE (idestructuraop = valores.idestructuraop AND idproyecto = 0);

				valores.modificado := dato.modificado;
				valores.modificado[$1] := 0;

				DELETE FROM dat_estructuraop
				WHERE (idestructuraop = valores.idestructuraop AND idproyecto = 0);

				UPDATE dat_estructuraop
				SET idproyecto = 0, idestado = 0, modificado = valores.modificado
				WHERE (idestructuraop= valores.idestructuraop AND idproyecto = $1 AND idestado = 2);
			END IF;
		END IF;
	END LOOP;

	-- INSERTADOS Y MODIFICADOS DE DAT_MEDIO
	FOR valores IN (SELECT * FROM dat_medio WHERE idproyecto = $1 AND idestado <> 0)
	LOOP
		IF (valores.idestado = 1) THEN
			SELECT * INTO datosReferencia FROM dat_filacortada WHERE idfila = valores.idmedio AND idproyecto = $1;
			IF(datosReferencia.idfila IS NOT NULL) THEN
				UPDATE nom_filaestruc
				   SET idfila = datosReferencia.idreferencia
				WHERE idfila = valores.idmedio;

				DELETE FROM dat_filacortada
				WHERE idfila = valores.idmedio AND idproyecto = $1;
			END IF;

			UPDATE dat_medio
			SET idproyecto = 0, idestado = 0, modificado [$1]=0
			WHERE (idproyecto = $1 AND idestado = 1) OR modificado [$1]=1;
		ELSE
			IF (valores.idestado = 2) THEN
				SELECT * INTO dato FROM dat_medio
				WHERE (idmedio = valores.idmedio AND idproyecto = 0);

				valores.modificado := dato.modificado;
				valores.modificado[$1] := 0;

				DELETE FROM dat_medio
				WHERE (idmedio = valores.idmedio AND idproyecto = 0);

				UPDATE dat_medio
				SET idproyecto = 0, idestado = 0, modificado = valores.modificado
				WHERE (idmedio= valores.idmedio AND idproyecto = $1 AND idestado = 2);
			END IF;
		END IF;
	END LOOP;

	/*ALTER TABLE dat_cargocivil
	DROP CONSTRAINT fk_cargo_cargocivil RESTRICT;

	ALTER TABLE dat_cargomilitar
	DROP CONSTRAINT fk_cargo_cargomilitar RESTRICT;*/

	FOR valores IN (SELECT * FROM dat_cargo WHERE idproyecto = $1 AND idestado <> 0)
	LOOP
		IF (valores.idestado = 1) THEN
			SELECT * INTO datosReferencia FROM dat_filacortada WHERE idfila = valores.idcargo AND idproyecto = $1;
			IF(datosReferencia.idfila IS NOT NULL) THEN
				UPDATE nom_filaestruc
				   SET idfila = datosReferencia.idreferencia
				WHERE idfila = valores.idcargo;

				DELETE FROM dat_filacortada
				WHERE idfila = valores.idcargo AND idproyecto = $1;
			END IF;

			UPDATE dat_cargo
			SET idproyecto = 0, idestado = 0, modificado [$1]=0
			WHERE (idproyecto = $1 AND idestado = 1) OR modificado [$1]=1;

		ELSE
			IF (valores.idestado = 2) THEN
				SELECT * INTO dato FROM dat_cargo
				WHERE (idcargo = valores.idcargo AND idproyecto = 0);

				valores.modificado := dato.modificado;
				valores.modificado[$1] := 0;

				DELETE FROM dat_cargo
				WHERE (idcargo = valores.idcargo AND idproyecto = 0);

				UPDATE dat_cargo
				SET idproyecto = 0, idestado = 0, modificado=valores.modificado
				WHERE (idcargo= valores.idcargo AND idproyecto = valores.idproyecto AND idestado = 2);
			END IF;
		END IF;
	END LOOP;


	UPDATE dat_proyecto
	SET aprobado = 1, modificado = 0, fechafin = date('now')
	WHERE idproyecto = $1 AND idusuario = $2;

	DELETE FROM dat_proyecto WHERE idpadre = $1;

	RETURN TRUE;
END;
$_$;


--
-- TOC entry 2806 (class 1255 OID 196652)
-- Dependencies: 33 6725 6119
-- Name: f_tablaorganizacion(numeric[], numeric, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_tablaorganizacion(p_idestructura numeric[], p_idproyecto numeric, p_iddominio numeric) RETURNS SETOF td_tablaorganizacion
    LANGUAGE plpgsql
    AS $_$
DECLARE
v_res record;
v_rec mod_estructuracomp.td_tablaorganizacion;
v_i numeric = 1;
BEGIN
SET search_path = mod_estructuracomp;

for v_i in 1 .. array_length($1, 1)
	loop
        v_rec.identidad = $1[v_i];
        for v_res in
        SELECT 
        	CASE 
                WHEN g.idgrado IS NOT NULL THEN 1 ELSE 0
            END AS esgrado,
        	CASE 
            	WHEN c.idcategocup IS NOT NULL THEN c.denominacion
                WHEN g.idgrado IS NOT NULL THEN g.denominacion
            END AS denominacion,
            CASE 
            	WHEN c.idcategocup IS NOT NULL THEN c.idcategocup
                WHEN g.idgrado IS NOT NULL THEN g.idgrado
            END AS id,
            CASE 
            	WHEN c.idcategocup IS NOT NULL THEN count (cv.*)
                WHEN g.idgrado IS NOT NULL THEN count (cm.*)
            END AS cantidad
        FROM mod_estructuracomp.nom_filaestruc p
        INNER JOIN mod_estructuracomp.nom_filaestruc nfe on p.lft <= nfe.lft and p.rgt >= nfe.rgt
        LEFT JOIN mod_estructuracomp.dat_cargo cargo ON (cargo.idcargo = nfe.idfila AND CASE WHEN p_idproyecto = 0 THEN cargo.idestado = 0 ELSE ((cargo.idestado = 0 AND cargo.modificado [p_idproyecto] = 0) OR (cargo.idproyecto = p_idproyecto AND cargo.idestado <> 3))  END )
        LEFT JOIN mod_estructuracomp.dat_cargocivil cv ON (cargo.idcargo = cv.idcargo AND cv.idproyecto = cargo.idproyecto) 
        LEFT JOIN mod_estructuracomp.nom_categocup c on c.idcategocup = cv.idcategocup
        LEFT JOIN mod_estructuracomp.dat_cargomilitar cm ON (cargo.idcargo = cm.idcargo AND cm.idproyecto = cargo.idproyecto) 
        LEFT JOIN mod_estructuracomp.nom_grado g on g.idgrado = cm.idgrado
        
        WHERE p.idfila = $1[v_i] 	--100002994 --100000003 
        AND nfe.dominiofila [p_iddominio] = 1::bit
        AND (c.idcategocup IS NOT NULL OR g.idgrado IS NOT NULL)        
        AND cargo.temporal = 0
        group by c.idcategocup, g.idgrado
        ORDER by c.idcategocup
    loop
    	v_rec.id = v_res.id;
    	v_rec.denominacion = v_res.denominacion;
        v_rec.cantidad = v_res.cantidad;
    	v_rec.esgrado = v_res.esgrado;
        return next v_rec;
    end loop;
end loop;     
END;
$_$;


--
-- TOC entry 2807 (class 1255 OID 196653)
-- Dependencies: 33 6725
-- Name: f_update_orden_grado(numeric, numeric); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION f_update_orden_grado(identificador numeric, jerarquia numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
    SET search_path = mod_estructuracomp;
     
	UPDATE nom_grado SET orden = orden + 1 WHERE orden >= jerarquia AND idgrado <> identificador;
                                              
    RETURN TRUE; 
END;
$$;


--
-- TOC entry 2808 (class 1255 OID 196654)
-- Dependencies: 33 6725
-- Name: ft_actualizar_orden_grado(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_actualizar_orden_grado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
       variable_record record;
BEGIN
     SET search_path = mod_estructuracomp;
     
	UPDATE nom_grado SET orden = orden + 1 WHERE orden >= NEW.orden AND idgrado <> NEW.idgrado;
	RETURN NEW;		
END;
$$;


--
-- TOC entry 2809 (class 1255 OID 196655)
-- Dependencies: 33 6725
-- Name: ft_actualizar_organo(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_actualizar_organo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
       cantidad numeric;
BEGIN
	SET search_path = mod_estructuracomp;

	SELECT COUNT(idorgano) INTO cantidad FROM nom_organo WHERE 
		(idorgano = NEW.idorgano AND idconcepto <> NEW.idconcepto) AND
		(denominacion NOT ILIKE (NEW.denominacion) AND abreviatura NOT ILIKE (NEW.abreviatura));

	IF (cantidad<>0) THEN
		UPDATE mod_estructuracomp.nom_organo
		SET denominacion=NEW.denominacion, abreviatura=NEW.abreviatura
		WHERE idorgano = NEW.idorgano AND idconcepto <> NEW.idconcepto;		
	END IF;
     
	RETURN NEW;			
END;
$$;


--
-- TOC entry 2746 (class 1255 OID 317615)
-- Dependencies: 33 6725
-- Name: ft_cambiargrupo(integer, integer, integer); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_cambiargrupo(idcargo integer, idgrupoold integer, idgrupocnew integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
DECLARE
  datarecord record;
  datasalario record;
  idsalary numeric = 0;
  escalatype numeric = 0;
BEGIN
  FOR datarecord IN (Select c.* from mod_estructuracomp.dat_cargo c 
  					inner join mod_estructuracomp.nom_salario s on (c.idsalario = s.idsalario)
                      where c.idnomcargo = $1 AND s.idgrupocomplejidad = $2)
  LOOP
  escalatype:= datarecord.idtipoescala;
  	SELECT * INTO datasalario FROM mod_estructuracomp.nom_escalasalarial es inner join mod_estructuracomp.nom_salario ss on (es.idsalario = ss.idsalario) where ss.idgrupocomplejidad = $3 and es.idtipoescala = escalatype;
   	IF(datasalario.idsalario is not null)THEN
	    idsalary:= datasalario.idsalario;
    ELSE
            idsalary:= 0;
    END IF;
    UPDATE mod_estructuracomp.dat_cargo cargo SET idsalario = idsalary where cargo.idcargo = datarecord.idcargo;
  END LOOP;
  RETURN TRUE;
END;
$_$;


--
-- TOC entry 2810 (class 1255 OID 196656)
-- Dependencies: 33 6725
-- Name: ft_eliminar_fila(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_eliminar_fila() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
  SET search_path = mod_estructuracomp;
IF ((OLD.rgt - OLD.lft ) = 1)THEN
    --Paso 1 Decrementar los izquierdos
  	Update nom_filaestruc set lft = lft - 2 where lft > OLD.lft;
    --Paso 2 Decrementar las derecha
  	Update nom_filaestruc set rgt = rgt - 2 where rgt > OLD.rgt;
   ELSE
     /* PARA CUANDO NO ES HOJA*/
     --Paso 1 Decrementar los izquierdos
     Update nom_filaestruc set lft = (lft -(OLD.rgt - OLD.lft))-1 where lft > OLD.lft;
    --Paso 2 Decrementar las derecha
     Update nom_filaestruc set rgt = (rgt - (OLD.rgt - OLD.lft))-1 where rgt > OLD.rgt;
      
  END IF;
  
 RETURN OLD;
END;
$$;


--
-- TOC entry 8378 (class 0 OID 0)
-- Dependencies: 2810
-- Name: FUNCTION ft_eliminar_fila(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_eliminar_fila() IS 'Función trigger empleada para eliminar una fila de la tabla “nom_filaestruc”.';


--
-- TOC entry 2811 (class 1255 OID 196657)
-- Dependencies: 33 6725
-- Name: ft_eliminar_nodo_dominio(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_eliminar_nodo_dominio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
       ancho BIGINT;
BEGIN
     SET search_path = mod_estructuracomp;
     ancho := OLD.rgt - OLD.lft + 1;
     UPDATE nom_dominio SET rgt = rgt - ancho WHERE rgt > OLD.rgt;
     UPDATE nom_dominio SET lft = lft - ancho WHERE lft > OLD.rgt;
     RETURN OLD;
     EXCEPTION WHEN foreign_key_violation THEN
         RETURN OLD;
END;
$$;


--
-- TOC entry 2812 (class 1255 OID 196658)
-- Dependencies: 33 6725
-- Name: ft_eliminar_proyecto(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_eliminar_proyecto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
BEGIN
	SET search_path = mod_estructuracomp;
	UPDATE dat_proyecto
	SET idpadre = 0
	WHERE (idpadre = OLD.idproyecto);

	UPDATE dat_estructura 
	SET modificado [OLD.idproyecto]=0 
	WHERE (modificado [OLD.idproyecto]=1);

	UPDATE dat_estructuraop 
	SET modificado [OLD.idproyecto]=0 
	WHERE (modificado [OLD.idproyecto]=1);

	UPDATE dat_cargo 
	SET modificado [OLD.idproyecto]=0 
	WHERE (modificado [OLD.idproyecto]=1);

	UPDATE dat_medio 
	SET modificado [OLD.idproyecto]=0 
	WHERE (modificado [OLD.idproyecto]=1);
	RETURN NEW;
END;
$$;


--
-- TOC entry 8381 (class 0 OID 0)
-- Dependencies: 2812
-- Name: FUNCTION ft_eliminar_proyecto(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_eliminar_proyecto() IS 'Función trigger empleada para actualizar los identificadores de los hijos de un proyecto determinado.';


--
-- TOC entry 2814 (class 1255 OID 196659)
-- Dependencies: 33 6725
-- Name: ft_insertar_fila(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_insertar_fila() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    padre_rec mod_estructuracomp.nom_filaestruc;
    padreRecord RECORD;
	derecha bigint;
	temporalrgt numeric;
	newOrden numeric;
    newNivel numeric;
BEGIN
	SET search_path = mod_estructuracomp;

	IF NEW.idpadre IS NULL THEN
		NEW.idpadre := NEW.idfila;
	END IF;
    
	SELECT * INTO padreRecord FROM nom_filaestruc WHERE idfila = New.idpadre;

	SELECT MAX(orden) INTO newOrden FROM nom_filaestruc WHERE idpadre = padreRecord.idfila;
		IF (newOrden > 0) THEN
			NEW.orden = newOrden+1;
        ELSE
            NEW.orden = 1;
        END IF;
    
	IF (newOrden > 0 OR padreRecord.nivel IS NOT NULL) THEN		
		NEW.nivel = (CONCAT(padreRecord.nivel,NEW.orden))::numeric;
	ELSE
		NEW.nivel = NEW.orden;
	END IF;

	IF NEW.lft is null THEN 
		IF NEW.idfila != NEW.idpadre THEN
		    SELECT * INTO  padre_rec FROM nom_filaestruc WHERE idfila = NEW.idpadre;
		    NEW.lft := padre_rec.rgt; -- (Paso 1 Ok)
				NEW.rgt := padre_rec.rgt + 1;-- (Paso 1 Ok)			
		    temporalrgt := padre_rec.rgt + 1;  
		    -- (Paso 2 Ok)
				UPDATE nom_filaestruc SET rgt = rgt + 2 WHERE idfila = NEW.idpadre; 
		    -- (Paso 3)      
		    UPDATE nom_filaestruc SET lft = lft + 2 WHERE lft >= temporalrgt;
		    UPDATE nom_filaestruc SET rgt = rgt + 2 WHERE rgt >= temporalrgt and idfila <> NEW.idpadre;
		    NEW.dominiofila = padre_rec.dominiofila;	
		ELSE
			derecha :=  MAX(rgt) FROM nom_filaestruc WHERE idfila = idpadre;
			IF derecha is not null THEN
				NEW.lft := derecha + 1;
				NEW.rgt := derecha + 2;
			ELSE
				NEW.lft := 1;
				NEW.rgt := 2;
			END IF;
		END IF;
	END IF;	
    
	EXECUTE 'ALTER sequence mod_estructuracomp.sec_filaestruc_seq RESTART ' ||New.idfila + 1;
    
	RETURN NEW;
END;
$$;


--
-- TOC entry 8383 (class 0 OID 0)
-- Dependencies: 2814
-- Name: FUNCTION ft_insertar_fila(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_insertar_fila() IS 'Función trigger empleada para insertar una fila de la tabla “nom_filaestruc”.';


--
-- TOC entry 2813 (class 1255 OID 196660)
-- Dependencies: 33 6725
-- Name: ft_insertar_nodo_dominio(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_insertar_nodo_dominio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
        derecha bigint;
BEGIN
        SET search_path = mod_estructuracomp;
        IF NEW.iddominio != NEW.idpadre THEN
       derecha :=  rgt FROM nom_dominio WHERE iddominio = NEW.idpadre;
       UPDATE nom_dominio SET rgt = rgt + 2 WHERE rgt >= derecha;
       UPDATE nom_dominio SET lft = lft + 2 WHERE lft > derecha;
       NEW.lft := derecha;
       NEW.rgt := derecha + 1;
    ELSE
        derecha :=  MAX(rgt) FROM nom_dominio WHERE iddominio = idpadre;
        IF derecha IS NOT NULL THEN
           NEW.lft := derecha + 1;
           NEW.rgt := derecha + 2;
        ELSE
            NEW.lft := 1;
            NEW.rgt := 2;
        END IF;
    END IF;
        RETURN NEW;
END;
$$;


--
-- TOC entry 2815 (class 1255 OID 196661)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_cargo(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_cargo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idnomcargo) INTO max_id FROM mod_estructuracomp.nom_cargo;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_cargo_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_cargo_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8386 (class 0 OID 0)
-- Dependencies: 2815
-- Name: FUNCTION ft_reiniciar_secuencia_cargo(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_cargo() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_cargo”.';


--
-- TOC entry 2816 (class 1255 OID 196662)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_categocup(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_categocup() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idcategocup) INTO max_id FROM mod_estructuracomp.nom_categocup;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_categocup_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_categocup_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8388 (class 0 OID 0)
-- Dependencies: 2816
-- Name: FUNCTION ft_reiniciar_secuencia_categocup(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_categocup() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_categocup”.';


--
-- TOC entry 2817 (class 1255 OID 196663)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_categoria(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_categoria() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  DECLARE
    max_id   INTEGER;
    sec_cont INTEGER;

  BEGIN

    SELECT
      MAX(idcategoria)
    INTO max_id
    FROM mod_estructuracomp.nom_categoria;
    SELECT
      last_value
    INTO sec_cont
    FROM mod_estructuracomp.sec_categoria_seq;

    RAISE NOTICE 'valor max_id %', max_id;
    RAISE NOTICE 'valor sec_cont %', sec_cont;

    IF (sec_cont <> max_id)
    THEN
      EXECUTE 'ALTER sequence mod_estructuracomp.sec_categoria_seq RESTART ' || max_id + 1;
    END IF;

    RETURN OLD;
  END;
  $$;


--
-- TOC entry 8390 (class 0 OID 0)
-- Dependencies: 2817
-- Name: FUNCTION ft_reiniciar_secuencia_categoria(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_categoria() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_categoria”.';


--
-- TOC entry 2818 (class 1255 OID 196664)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_concepto(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_concepto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idconcepto) INTO max_id FROM mod_estructuracomp.nom_concepto;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_concepto_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_concepto_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8392 (class 0 OID 0)
-- Dependencies: 2818
-- Name: FUNCTION ft_reiniciar_secuencia_concepto(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_concepto() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_concepto”.';


--
-- TOC entry 2745 (class 1255 OID 251291)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_conceptocondicion(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_conceptocondicion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idconceptocondicion) INTO max_id FROM mod_estructuracomp.dat_conceptocondicion;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_conceptocondicion_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_conceptocondicion_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 2819 (class 1255 OID 196665)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_conceptopropiedad(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_conceptopropiedad() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idconceptopropiedad) INTO max_id FROM mod_estructuracomp.nom_conceptopropiedad;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_conceptopropiedad_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_conceptopropiedad_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8395 (class 0 OID 0)
-- Dependencies: 2819
-- Name: FUNCTION ft_reiniciar_secuencia_conceptopropiedad(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_conceptopropiedad() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_conceptopropiedad”.';


--
-- TOC entry 2820 (class 1255 OID 196666)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_datsubordinacion(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_datsubordinacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idsubordinacion) INTO max_id FROM mod_estructuracomp.dat_subordinacion;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_datsubordinacion_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_datsubordinacion_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8397 (class 0 OID 0)
-- Dependencies: 2820
-- Name: FUNCTION ft_reiniciar_secuencia_datsubordinacion(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_datsubordinacion() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “dat_subordinacion”.';


--
-- TOC entry 2821 (class 1255 OID 196667)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_dominio(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_dominio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(iddominio) INTO max_id FROM mod_estructuracomp.nom_dominio;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_dominio_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_dominio_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8399 (class 0 OID 0)
-- Dependencies: 2821
-- Name: FUNCTION ft_reiniciar_secuencia_dominio(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_dominio() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_dominio”.';


--
-- TOC entry 2743 (class 1255 OID 317610)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_filaestruc(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_filaestruc() RETURNS boolean
    LANGUAGE plpgsql STRICT
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
 
 SELECT MAX(idfila) INTO max_id FROM mod_estructuracomp.nom_filaestruc;
 SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_filaestruc_seq;
 
 RAISE NOTICE 'valor max_id %',max_id;
 RAISE NOTICE 'valor sec_cont %',sec_cont; 

 --IF(sec_cont <> max_id)THEN
 EXECUTE 'ALTER sequence mod_estructuracomp.sec_filaestruc_seq RESTART ' ||max_id + 1;
 --END IF;
 
 RETURN TRUE;
END;
$$;


--
-- TOC entry 8401 (class 0 OID 0)
-- Dependencies: 2743
-- Name: FUNCTION ft_reiniciar_secuencia_filaestruc(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_filaestruc() IS 'Función trigger empleada para reiniciar la secuencia de la tabla nom_filaestruc.';


--
-- TOC entry 2822 (class 1255 OID 196668)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_grado(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_grado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idgrado) INTO max_id FROM mod_estructuracomp.nom_grado;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_grado_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_grado_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8403 (class 0 OID 0)
-- Dependencies: 2822
-- Name: FUNCTION ft_reiniciar_secuencia_grado(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_grado() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_grado”.';


--
-- TOC entry 2823 (class 1255 OID 196669)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_grupocomplejidad(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_grupocomplejidad() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idgrupocomplejidad) INTO max_id FROM mod_estructuracomp.nom_grupocomplejidad;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_grupocomplejidad_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_grupocomplejidad_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8405 (class 0 OID 0)
-- Dependencies: 2823
-- Name: FUNCTION ft_reiniciar_secuencia_grupocomplejidad(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_grupocomplejidad() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_grupocomplejidad”.';


--
-- TOC entry 2824 (class 1255 OID 196670)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_icono(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_icono() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idicono) INTO max_id FROM mod_estructuracomp.nom_icono;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_icono_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_icono_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8407 (class 0 OID 0)
-- Dependencies: 2824
-- Name: FUNCTION ft_reiniciar_secuencia_icono(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_icono() IS 'Función trigger empleada para reiniciar la secuencia de la tabla nom_icono.';


--
-- TOC entry 2825 (class 1255 OID 196671)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_medio(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_medio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idmedio) INTO max_id FROM mod_estructuracomp.nom_medio;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_medio_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_medio_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8409 (class 0 OID 0)
-- Dependencies: 2825
-- Name: FUNCTION ft_reiniciar_secuencia_medio(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_medio() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_medio”.';


--
-- TOC entry 2826 (class 1255 OID 196672)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_nomsubordinacion(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_nomsubordinacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idnomsubordinacion) INTO max_id FROM mod_estructuracomp.nom_subordinacion;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_salario_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_nomsubordinacion_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8411 (class 0 OID 0)
-- Dependencies: 2826
-- Name: FUNCTION ft_reiniciar_secuencia_nomsubordinacion(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_nomsubordinacion() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_subordinacion”.';


--
-- TOC entry 2827 (class 1255 OID 196673)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_preparacion(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_preparacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idpreparacion) INTO max_id FROM mod_estructuracomp.nom_preparacion;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_preparacion_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_preparacion_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8413 (class 0 OID 0)
-- Dependencies: 2827
-- Name: FUNCTION ft_reiniciar_secuencia_preparacion(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_preparacion() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_preparacion”.';


--
-- TOC entry 2829 (class 1255 OID 196674)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_proyecto(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_proyecto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idproyecto) INTO max_id FROM mod_estructuracomp.dat_proyecto;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_proyecto_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_proyecto_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8415 (class 0 OID 0)
-- Dependencies: 2829
-- Name: FUNCTION ft_reiniciar_secuencia_proyecto(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_proyecto() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “dat_proyecto”.';


--
-- TOC entry 2830 (class 1255 OID 196675)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_salario(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_salario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idsalario) INTO max_id FROM mod_estructuracomp.nom_salario;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_salario_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_salario_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8417 (class 0 OID 0)
-- Dependencies: 2830
-- Name: FUNCTION ft_reiniciar_secuencia_salario(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_salario() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_salario”.';


--
-- TOC entry 2831 (class 1255 OID 196676)
-- Dependencies: 33 6725
-- Name: ft_reiniciar_secuencia_tipomedio(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_reiniciar_secuencia_tipomedio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idtipomedio) INTO max_id FROM mod_estructuracomp.nom_tipomedio;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_tipomedio_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_tipomedio_seq RESTART ' ||max_id+1;
	END IF;
	
 RETURN OLD;
END;
$$;


--
-- TOC entry 8419 (class 0 OID 0)
-- Dependencies: 2831
-- Name: FUNCTION ft_reiniciar_secuencia_tipomedio(); Type: COMMENT; Schema: mod_estructuracomp; Owner: -
--

COMMENT ON FUNCTION ft_reiniciar_secuencia_tipomedio() IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_tipomedio”.';


--
-- TOC entry 2832 (class 1255 OID 196677)
-- Dependencies: 33 6725
-- Name: ft_trabajocargo(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_trabajocargo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
 datarecord record;

BEGIN
	SET search_path = mod_estructuracomp;
	NEW.modificado := '{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}';
	-- actualizar que se modifico la tupla actual por el proyecto de id 'idproyecto'    
	UPDATE  mod_estructuracomp.dat_cargo set modificado[NEW.idproyecto] = 1 WHERE idestado = 0 AND idcargo = NEW.idcargo;
	RETURN NEW;
END;
$$;


--
-- TOC entry 2833 (class 1255 OID 196678)
-- Dependencies: 33 6725
-- Name: ft_trabajoestructura(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_trabajoestructura() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	SET search_path = mod_estructuracomp;
	NEW.modificado := '{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}';
	-- actualizar que se modifico la tupla actual por el proyecto de id 'idproyecto'
	UPDATE  mod_estructuracomp.dat_estructura set modificado[NEW.idproyecto] = 1 WHERE idestado = 0 AND idestructura = NEW.idestructura;
	RETURN NEW;
END;
$$;


--
-- TOC entry 2828 (class 1255 OID 196679)
-- Dependencies: 33 6725
-- Name: ft_trabajoestructuraop(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_trabajoestructuraop() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	SET search_path = mod_estructuracomp;
	NEW.modificado := '{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}';
	-- actualizar que se modifico la tupla actual por el proyecto de id 'idproyecto'
	UPDATE  mod_estructuracomp.dat_estructuraop set modificado[NEW.idproyecto] = 1 WHERE idestado = 0 AND idestructuraop = NEW.idestructuraop;
	RETURN NEW;
END;
$$;


--
-- TOC entry 2724 (class 1255 OID 196680)
-- Dependencies: 33 6725
-- Name: ft_trabajomedio(); Type: FUNCTION; Schema: mod_estructuracomp; Owner: -
--

CREATE FUNCTION ft_trabajomedio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	SET search_path = mod_estructuracomp;
	NEW.modificado := '{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}';
	-- actualizar que se modifico la tupla actual por el proyecto de id 'idproyecto'
	UPDATE  mod_estructuracomp.dat_medio set modificado[NEW.idproyecto] = 1 WHERE idestado = 0 AND idmedio = NEW.idmedio;
	RETURN NEW;
END;
$$;




SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 2244 (class 1259 OID 259426)
-- Dependencies: 33
-- Name: aux_complemento; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE aux_complemento (
    idcomplemento numeric(19,0) NOT NULL
);




--
-- TOC entry 8360 (class 0 OID 0)
-- Dependencies: 2244
-- Name: TABLE aux_complemento; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE aux_complemento IS 'Tabla nomencladora que almacena los conceptos asociados al complemento salarial en la entidad.';


--
-- TOC entry 8361 (class 0 OID 0)
-- Dependencies: 2244
-- Name: COLUMN aux_complemento.idcomplemento; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN aux_complemento.idcomplemento IS 'Identificador del complemento.';


--
-- TOC entry 1706 (class 1259 OID 196681)
-- Dependencies: 8029 8030 8031 8032 8033 8034 33
-- Name: dat_cargo; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_cargo (
    idcargo numeric(19,0) NOT NULL,
    idpreparacion numeric(19,0) NOT NULL,
    idespecialidadpreparacion numeric(19,0) NOT NULL,
    idsalario numeric(19,0) NOT NULL,
    idnomcargo numeric(10,0) NOT NULL,
    cantidad numeric(19,0) NOT NULL,
    cantidadreal numeric(19,0),
    idproyecto numeric(19,0) DEFAULT 0 NOT NULL,
    idestado numeric(2,0) DEFAULT 0,
    modificado numeric(1,0)[] DEFAULT '{0}'::numeric[],
    idespecialidadempleo numeric(19,0) NOT NULL,
    temporal numeric(1,0) DEFAULT 0,
    directo numeric(1,0) DEFAULT 1,
    idtipoescala numeric(19,0) DEFAULT 0 NOT NULL
);




--
-- TOC entry 8363 (class 0 OID 0)
-- Dependencies: 1706
-- Name: TABLE dat_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_cargo IS 'Tabla que almacena los datos asociados a los cargos de los trabajadores.';


--
-- TOC entry 8364 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.idcargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.idcargo IS 'Identificador del cargo de la persona.';


--
-- TOC entry 8365 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.idpreparacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.idpreparacion IS 'Identificador de la preparación.';


--
-- TOC entry 8366 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.idespecialidadpreparacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.idespecialidadpreparacion IS 'Identificador de la especialidad de preparacion.';


--
-- TOC entry 8367 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.idsalario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.idsalario IS 'Identificador del salario.';


--
-- TOC entry 8368 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.idnomcargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.idnomcargo IS 'Identificador del nomenclador de cargo.';


--
-- TOC entry 8369 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.cantidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.cantidad IS 'Cantidad de cargos.';


--
-- TOC entry 8370 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.cantidadreal; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.cantidadreal IS 'Cantidad real de cargos. ';


--
-- TOC entry 8371 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.idproyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.idproyecto IS 'Identificador del proyecto.';


--
-- TOC entry 8372 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.idespecialidadempleo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.idespecialidadempleo IS 'Identificador de la especialidad de empleo.';


--
-- TOC entry 8373 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.temporal; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.temporal IS 'Estado del cargo si es temporal o no';


--
-- TOC entry 8374 (class 0 OID 0)
-- Dependencies: 1706
-- Name: COLUMN dat_cargo.directo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargo.directo IS 'Estado del cargo, permite conocer si es directo i indirecto.';


--
-- TOC entry 1707 (class 1259 OID 196692)
-- Dependencies: 8035 33
-- Name: dat_cargocivil; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_cargocivil (
    idcargo numeric(19,0) NOT NULL,
    idcategocup numeric(10,0) NOT NULL,
    idproyecto numeric(19,0) DEFAULT 0 NOT NULL
);




--
-- TOC entry 8376 (class 0 OID 0)
-- Dependencies: 1707
-- Name: TABLE dat_cargocivil; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_cargocivil IS 'Tabla que almacena los datos asociados a los cargos civiles.';


--
-- TOC entry 8377 (class 0 OID 0)
-- Dependencies: 1707
-- Name: COLUMN dat_cargocivil.idcargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargocivil.idcargo IS 'Identificador del cargo civil.';


--
-- TOC entry 8378 (class 0 OID 0)
-- Dependencies: 1707
-- Name: COLUMN dat_cargocivil.idcategocup; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargocivil.idcategocup IS 'Identificador de la categoría ocupacional.';


--
-- TOC entry 8379 (class 0 OID 0)
-- Dependencies: 1707
-- Name: COLUMN dat_cargocivil.idproyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargocivil.idproyecto IS 'Identificador del proyecto.';


--
-- TOC entry 1708 (class 1259 OID 196696)
-- Dependencies: 8036 33
-- Name: dat_cargomilitar; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_cargomilitar (
    idcargo numeric(19,0) NOT NULL,
    idgrado numeric(19,0) NOT NULL,
    idproyecto numeric(19,0) DEFAULT 0 NOT NULL
);




--
-- TOC entry 8381 (class 0 OID 0)
-- Dependencies: 1708
-- Name: TABLE dat_cargomilitar; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_cargomilitar IS 'Tabla que almacena los datos asociados a los cargos militares.';


--
-- TOC entry 8382 (class 0 OID 0)
-- Dependencies: 1708
-- Name: COLUMN dat_cargomilitar.idcargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargomilitar.idcargo IS 'Identificador del cargo militar.';


--
-- TOC entry 8383 (class 0 OID 0)
-- Dependencies: 1708
-- Name: COLUMN dat_cargomilitar.idgrado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargomilitar.idgrado IS 'Identificador del grado militar.';


--
-- TOC entry 8384 (class 0 OID 0)
-- Dependencies: 1708
-- Name: COLUMN dat_cargomilitar.idproyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_cargomilitar.idproyecto IS 'Identificador del proyecto.';


--
-- TOC entry 2242 (class 1259 OID 251197)
-- Dependencies: 33
-- Name: sec_conceptocondicion_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_conceptocondicion_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8386 (class 0 OID 0)
-- Dependencies: 2242
-- Name: SEQUENCE sec_conceptocondicion_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_conceptocondicion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_conceptocondicion".';


--
-- TOC entry 2243 (class 1259 OID 251275)
-- Dependencies: 8118 33
-- Name: dat_conceptocondicion; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_conceptocondicion (
    idconceptocondicion numeric(19,0) DEFAULT nextval('sec_conceptocondicion_seq'::regclass) NOT NULL,
    idusuarioconcepto numeric(19,0) NOT NULL,
    idorgano numeric(19,0) NOT NULL,
    idconcepto numeric(19,0) NOT NULL
);




--
-- TOC entry 8388 (class 0 OID 0)
-- Dependencies: 2243
-- Name: TABLE dat_conceptocondicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_conceptocondicion IS 'Tabla nomencladora que almacena las relaciones de los conceptos con las condiciones por tipos.';


--
-- TOC entry 8389 (class 0 OID 0)
-- Dependencies: 2243
-- Name: COLUMN dat_conceptocondicion.idconceptocondicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_conceptocondicion.idconceptocondicion IS 'Identificador de la propiedad.';


--
-- TOC entry 8390 (class 0 OID 0)
-- Dependencies: 2243
-- Name: COLUMN dat_conceptocondicion.idusuarioconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_conceptocondicion.idusuarioconcepto IS 'Identificador del la resticcion entre el usuario y el concepto.';


--
-- TOC entry 8391 (class 0 OID 0)
-- Dependencies: 2243
-- Name: COLUMN dat_conceptocondicion.idorgano; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_conceptocondicion.idorgano IS 'Identificador del tipo de organo.';


--
-- TOC entry 8392 (class 0 OID 0)
-- Dependencies: 2243
-- Name: COLUMN dat_conceptocondicion.idconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_conceptocondicion.idconcepto IS 'Identificador del concepto.';


--
-- TOC entry 1709 (class 1259 OID 196700)
-- Dependencies: 8037 8038 8039 8040 8041 33
-- Name: dat_estructura; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_estructura (
    idestructura numeric(19,0) NOT NULL,
    idconcepto numeric(19,0) NOT NULL,
    idespecialidad numeric(19,0) NOT NULL,
    idorgano numeric(19,0) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    codigo character varying(20),
    fax character varying(100),
    telefono character varying(100),
    iddpt numeric(19,0),
    direccion character varying(255),
    correo character varying(50),
    objetosocial character varying(255),
    funcioneslegales character varying(255),
    idproyecto numeric(10,0) DEFAULT 0 NOT NULL,
    idestado numeric(2,0) DEFAULT 0,
    modificado numeric(1,0)[] DEFAULT '{0}'::numeric[],
    idtipoescala numeric(19,0) DEFAULT 0,
    idicono numeric(100,0) DEFAULT 0
);




--
-- TOC entry 8394 (class 0 OID 0)
-- Dependencies: 1709
-- Name: TABLE dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_estructura IS 'Tabla que almacena los datos asociados a las estructuras externas.';


--
-- TOC entry 8395 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.idestructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.idestructura IS 'Identificador de la estructura.';


--
-- TOC entry 8396 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.idconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.idconcepto IS 'Identificador del concepto.';


--
-- TOC entry 8397 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.idespecialidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.idespecialidad IS 'Identificador de la especialidad.';


--
-- TOC entry 8398 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.idorgano; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.idorgano IS 'Identificador del órgano.';


--
-- TOC entry 8399 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.denominacion IS 'Denominación de la estructura.';


--
-- TOC entry 8400 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.abreviatura IS 'Abreviatura de la denominación de la estructura.';


--
-- TOC entry 8401 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.codigo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.codigo IS 'Código de la estructura.';


--
-- TOC entry 8402 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.fax; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.fax IS 'Fax.';


--
-- TOC entry 8403 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.telefono; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.telefono IS 'Número de teléfono.';


--
-- TOC entry 8404 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.iddpt; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.iddpt IS 'Identificador de instrucción política territorial.';


--
-- TOC entry 8405 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.direccion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.direccion IS 'Dirección.';


--
-- TOC entry 8406 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.correo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.correo IS 'Dirección de correo.';


--
-- TOC entry 8407 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.objetosocial; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.objetosocial IS 'Objeto social.';


--
-- TOC entry 8408 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.funcioneslegales; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.funcioneslegales IS 'Funciones legales.';


--
-- TOC entry 8409 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.idproyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.idproyecto IS 'Identificador del proyecto.';


--
-- TOC entry 8410 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.idtipoescala; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.idtipoescala IS 'Identificador del tipo de escala para las entidades u organizaciones en la estructura.';


--
-- TOC entry 8411 (class 0 OID 0)
-- Dependencies: 1709
-- Name: COLUMN dat_estructura.idicono; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructura.idicono IS 'Identificador de la tabla nom_icono';


--
-- TOC entry 1710 (class 1259 OID 196711)
-- Dependencies: 8042 8043 8044 33
-- Name: dat_estructuraop; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--


CREATE TABLE dat_estructuraop (
    idestructuraop numeric(19,0) NOT NULL,
    idorgano numeric(19,0) NOT NULL,
    idconcepto numeric(19,0) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    idproyecto numeric(10,0) DEFAULT 0 NOT NULL,
    idestado numeric(2,0) DEFAULT 0,
    modificado numeric(1,0)[] DEFAULT '{0}'::numeric[],
    codigo character varying(20),
	idespecialidad numeric(19,0) NOT NULL
);


ALTER TABLE mod_estructuracomp.dat_estructuraop OWNER TO zeolides;

--
-- TOC entry 8101 (class 0 OID 0)
-- Dependencies: 1710
-- Name: TABLE dat_estructuraop; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_estructuraop IS 'Tabla que almacena los datos asociados a las estructuras operacionales.';


--
-- TOC entry 8102 (class 0 OID 0)
-- Dependencies: 1710
-- Name: COLUMN dat_estructuraop.idestructuraop; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructuraop.idestructuraop IS 'Identificador de la estructura operativa.';


--
-- TOC entry 8103 (class 0 OID 0)
-- Dependencies: 1710
-- Name: COLUMN dat_estructuraop.idorgano; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructuraop.idorgano IS 'Identificador del órgano.';


--
-- TOC entry 8104 (class 0 OID 0)
-- Dependencies: 1710
-- Name: COLUMN dat_estructuraop.idconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructuraop.idconcepto IS 'Identificador del concepto.';


--
-- TOC entry 8105 (class 0 OID 0)
-- Dependencies: 1710
-- Name: COLUMN dat_estructuraop.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructuraop.denominacion IS 'Denominación de la estructura operativa.';


--
-- TOC entry 8106 (class 0 OID 0)
-- Dependencies: 1710
-- Name: COLUMN dat_estructuraop.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructuraop.abreviatura IS 'Abreviatura de la denominación de la estructura operativa.';


--
-- TOC entry 8107 (class 0 OID 0)
-- Dependencies: 1710
-- Name: COLUMN dat_estructuraop.idproyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructuraop.idproyecto IS 'Identificador del proyecto.';


--
-- TOC entry 8108 (class 0 OID 0)
-- Dependencies: 1710
-- Name: COLUMN dat_estructuraop.codigo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_estructuraop.codigo IS 'Representa el identificador único de una estructura no formal o área de responsabilidad';


--
-- TOC entry 1711 (class 1259 OID 196720)
-- Dependencies: 33
-- Name: dat_filacortada; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_filacortada (
    idfila numeric(19,0) NOT NULL,
    idreferencia numeric(19,0) NOT NULL,
    idproyecto numeric(19,0) NOT NULL
);




--
-- TOC entry 8421 (class 0 OID 0)
-- Dependencies: 1711
-- Name: TABLE dat_filacortada; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_filacortada IS 'Tabla que almacena los datos asociados a las estructuras que han sido cortadas por proyecto.';


--
-- TOC entry 8422 (class 0 OID 0)
-- Dependencies: 1711
-- Name: COLUMN dat_filacortada.idfila; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_filacortada.idfila IS 'Identificador de la estructura nueva.';


--
-- TOC entry 8423 (class 0 OID 0)
-- Dependencies: 1711
-- Name: COLUMN dat_filacortada.idreferencia; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_filacortada.idreferencia IS 'Identificador de la estructura anterior.';


--
-- TOC entry 8424 (class 0 OID 0)
-- Dependencies: 1711
-- Name: COLUMN dat_filacortada.idproyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_filacortada.idproyecto IS 'Identificador del proyecto en que se modificaron los valores.';


--
-- TOC entry 1712 (class 1259 OID 196723)
-- Dependencies: 33
-- Name: dat_grafica; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_grafica (
    idgrafica numeric(19,0) NOT NULL,
    denominacion character varying(100) NOT NULL,
    descripcion character varying(255),
    configuracion character varying NOT NULL
);




--
-- TOC entry 8426 (class 0 OID 0)
-- Dependencies: 1712
-- Name: TABLE dat_grafica; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_grafica IS 'Tabla que almacena los datos asociados a la configuración que será graficada.';


--
-- TOC entry 8427 (class 0 OID 0)
-- Dependencies: 1712
-- Name: COLUMN dat_grafica.idgrafica; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_grafica.idgrafica IS 'Identificador de la gráfica.';


--
-- TOC entry 8428 (class 0 OID 0)
-- Dependencies: 1712
-- Name: COLUMN dat_grafica.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_grafica.denominacion IS 'Denominación de la configuración a graficar.';


--
-- TOC entry 8429 (class 0 OID 0)
-- Dependencies: 1712
-- Name: COLUMN dat_grafica.descripcion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_grafica.descripcion IS 'Descripción del filtro.';


--
-- TOC entry 8430 (class 0 OID 0)
-- Dependencies: 1712
-- Name: COLUMN dat_grafica.configuracion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_grafica.configuracion IS 'Arreglo de valores por propiedades y concepto.';


--
-- TOC entry 1713 (class 1259 OID 196729)
-- Dependencies: 33
-- Name: dat_graficausuario; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_graficausuario (
    idgrafica numeric(19,0) NOT NULL,
    idusuario numeric(19,0) NOT NULL
);




--
-- TOC entry 8432 (class 0 OID 0)
-- Dependencies: 1713
-- Name: TABLE dat_graficausuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_graficausuario IS 'Tabla que almacena los datos asociados a las graficas que cargaran por defecto por usuario.';


--
-- TOC entry 8433 (class 0 OID 0)
-- Dependencies: 1713
-- Name: COLUMN dat_graficausuario.idgrafica; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_graficausuario.idgrafica IS 'Identificador de la gráfica.';


--
-- TOC entry 8434 (class 0 OID 0)
-- Dependencies: 1713
-- Name: COLUMN dat_graficausuario.idusuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_graficausuario.idusuario IS 'Identificador del usuario.';


--
-- TOC entry 1714 (class 1259 OID 196732)
-- Dependencies: 8045 8046 8047 8048 33
-- Name: dat_medio; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_medio (
    idmedio numeric(19,0) NOT NULL,
    idtipomedio numeric(19,0) NOT NULL,
    idnommedio numeric(19,0) NOT NULL,
    cantidad numeric(100,0),
    idestado numeric(2,0) DEFAULT 0,
    idproyecto numeric(10,0) DEFAULT 0 NOT NULL,
    cantidadreal numeric(100,0) DEFAULT 0,
    modificado numeric(1,0)[] DEFAULT '{0}'::numeric[],
    idicono numeric(19,0)
);




--
-- TOC entry 8436 (class 0 OID 0)
-- Dependencies: 1714
-- Name: TABLE dat_medio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_medio IS 'Tabla que almacena los datos asociados a los medios.';


--
-- TOC entry 8437 (class 0 OID 0)
-- Dependencies: 1714
-- Name: COLUMN dat_medio.idmedio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_medio.idmedio IS 'Identificador del medio.';


--
-- TOC entry 8438 (class 0 OID 0)
-- Dependencies: 1714
-- Name: COLUMN dat_medio.idtipomedio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_medio.idtipomedio IS 'Identificador del tipo de medio.';


--
-- TOC entry 8439 (class 0 OID 0)
-- Dependencies: 1714
-- Name: COLUMN dat_medio.idnommedio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_medio.idnommedio IS 'Identificador del nomenclador de medio.';


--
-- TOC entry 8440 (class 0 OID 0)
-- Dependencies: 1714
-- Name: COLUMN dat_medio.cantidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_medio.cantidad IS 'Cantidad de medios';


--
-- TOC entry 8441 (class 0 OID 0)
-- Dependencies: 1714
-- Name: COLUMN dat_medio.cantidadreal; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_medio.cantidadreal IS 'Cantidad real de medios';


--
-- TOC entry 8442 (class 0 OID 0)
-- Dependencies: 1714
-- Name: COLUMN dat_medio.idicono; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_medio.idicono IS 'Icono del medio.';


--
-- TOC entry 1715 (class 1259 OID 196742)
-- Dependencies: 33
-- Name: sec_proyecto_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_proyecto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8444 (class 0 OID 0)
-- Dependencies: 1715
-- Name: SEQUENCE sec_proyecto_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_proyecto_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “dat_proyecto”.';


--
-- TOC entry 1716 (class 1259 OID 196744)
-- Dependencies: 8049 8050 8051 8052 33
-- Name: dat_proyecto; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_proyecto (
    idproyecto numeric(19,0) DEFAULT nextval('sec_proyecto_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    descripcion character varying(255) NOT NULL,
    idusuario numeric(19,0),
    fecha date,
    modificado numeric(1,0) DEFAULT 0,
    idpadre numeric(19,0) DEFAULT 0,
    aprobado numeric(1,0) DEFAULT 0,
    fechafin date
);




--
-- TOC entry 8446 (class 0 OID 0)
-- Dependencies: 1716
-- Name: TABLE dat_proyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_proyecto IS 'Tabla nomencladora que almacena los proyectos de modificación de la estructura.';


--
-- TOC entry 8447 (class 0 OID 0)
-- Dependencies: 1716
-- Name: COLUMN dat_proyecto.idproyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyecto.idproyecto IS 'Identificador del proyecto.';


--
-- TOC entry 8448 (class 0 OID 0)
-- Dependencies: 1716
-- Name: COLUMN dat_proyecto.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyecto.denominacion IS 'Denominación del proyecto.';


--
-- TOC entry 8449 (class 0 OID 0)
-- Dependencies: 1716
-- Name: COLUMN dat_proyecto.descripcion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyecto.descripcion IS 'Descripción del proyecto.';


--
-- TOC entry 8450 (class 0 OID 0)
-- Dependencies: 1716
-- Name: COLUMN dat_proyecto.idusuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyecto.idusuario IS 'Identificador del usuario.';


--
-- TOC entry 8451 (class 0 OID 0)
-- Dependencies: 1716
-- Name: COLUMN dat_proyecto.fecha; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyecto.fecha IS 'Fecha de creación del proyecto.';


--
-- TOC entry 8452 (class 0 OID 0)
-- Dependencies: 1716
-- Name: COLUMN dat_proyecto.modificado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyecto.modificado IS 'Determina si el proyecto se encuentra aprobado.';


--
-- TOC entry 8453 (class 0 OID 0)
-- Dependencies: 1716
-- Name: COLUMN dat_proyecto.aprobado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyecto.aprobado IS 'Determina si el proyecto se encuentra aprobado.';


--
-- TOC entry 8454 (class 0 OID 0)
-- Dependencies: 1716
-- Name: COLUMN dat_proyecto.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyecto.fechafin IS 'Fecha de aprobación del proyecto.';


--
-- TOC entry 1717 (class 1259 OID 196751)
-- Dependencies: 8053 33
-- Name: dat_proyectousuario; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_proyectousuario (
    idproyecto numeric(19,0) NOT NULL,
    idusuario numeric(19,0) NOT NULL,
    idresponsable numeric(19,0) NOT NULL,
    nuevo numeric(1,0) DEFAULT 1 NOT NULL
);




--
-- TOC entry 8456 (class 0 OID 0)
-- Dependencies: 1717
-- Name: TABLE dat_proyectousuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_proyectousuario IS 'Tabla de datos que almacena los usuarios asignados a proyectos especificos.';


--
-- TOC entry 8457 (class 0 OID 0)
-- Dependencies: 1717
-- Name: COLUMN dat_proyectousuario.idproyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyectousuario.idproyecto IS 'Identificador del proyecto.';


--
-- TOC entry 8458 (class 0 OID 0)
-- Dependencies: 1717
-- Name: COLUMN dat_proyectousuario.idusuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyectousuario.idusuario IS 'Identificador del usuario asignado.';


--
-- TOC entry 8459 (class 0 OID 0)
-- Dependencies: 1717
-- Name: COLUMN dat_proyectousuario.idresponsable; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyectousuario.idresponsable IS 'Identificador del usuario que asigno el proyecto.';


--
-- TOC entry 8460 (class 0 OID 0)
-- Dependencies: 1717
-- Name: COLUMN dat_proyectousuario.nuevo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_proyectousuario.nuevo IS 'Especifica si el proyecto aun es nuevo.';


--
-- TOC entry 1718 (class 1259 OID 196755)
-- Dependencies: 33
-- Name: sec_datsubordinacion_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_datsubordinacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8462 (class 0 OID 0)
-- Dependencies: 1718
-- Name: SEQUENCE sec_datsubordinacion_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_datsubordinacion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “dat_subordinacion”.';


--
-- TOC entry 1719 (class 1259 OID 196757)
-- Dependencies: 8054 33
-- Name: dat_subordinacion; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_subordinacion (
    idsubordinacion numeric(19,0) DEFAULT nextval('sec_datsubordinacion_seq'::regclass) NOT NULL,
    idpadre numeric(19,0) NOT NULL,
    idhijo numeric(19,0) NOT NULL,
    idnomsubordinacion numeric(9,0) NOT NULL
);




--
-- TOC entry 8464 (class 0 OID 0)
-- Dependencies: 1719
-- Name: TABLE dat_subordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE dat_subordinacion IS 'Tabla que almacena los datos asociados a las subordinaciones entre estructuras internas.';


--
-- TOC entry 8465 (class 0 OID 0)
-- Dependencies: 1719
-- Name: COLUMN dat_subordinacion.idsubordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_subordinacion.idsubordinacion IS 'Identificador de la subordinación.';


--
-- TOC entry 8466 (class 0 OID 0)
-- Dependencies: 1719
-- Name: COLUMN dat_subordinacion.idpadre; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_subordinacion.idpadre IS 'Identificador del padre.';


--
-- TOC entry 8467 (class 0 OID 0)
-- Dependencies: 1719
-- Name: COLUMN dat_subordinacion.idhijo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_subordinacion.idhijo IS 'Identificador del hijo.';


--
-- TOC entry 8468 (class 0 OID 0)
-- Dependencies: 1719
-- Name: COLUMN dat_subordinacion.idnomsubordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_subordinacion.idnomsubordinacion IS 'Identificador del nomenclador de subordinación.';


--
-- TOC entry 1720 (class 1259 OID 196761)
-- Dependencies: 33
-- Name: sec_usuarioconcepto_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_usuarioconcepto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999
    CACHE 1;




--
-- TOC entry 8470 (class 0 OID 0)
-- Dependencies: 1720
-- Name: SEQUENCE sec_usuarioconcepto_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_usuarioconcepto_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_usuarioconcepto”.';


--
-- TOC entry 1721 (class 1259 OID 196763)
-- Dependencies: 8055 8056 8057 8058 8059 8060 8061 8062 33
-- Name: dat_usuarioconcepto; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_usuarioconcepto (
    idusuarioconcepto numeric(19,0) DEFAULT nextval('sec_usuarioconcepto_seq'::regclass) NOT NULL,
    idconcepto numeric(19,0) NOT NULL,
    idusuario numeric(19,0) NOT NULL,
    ver numeric(1,0) DEFAULT 0 NOT NULL,
    adicionar numeric(1,0) DEFAULT 0 NOT NULL,
    modificar numeric(1,0) DEFAULT 0 NOT NULL,
    eliminar numeric(1,0) DEFAULT 0 NOT NULL,
    editar numeric(1,0) DEFAULT 0 NOT NULL,
    deshacer numeric(1,0) DEFAULT 0 NOT NULL,
    tipo character varying(255) DEFAULT ''::character varying
);




--
-- TOC entry 8472 (class 0 OID 0)
-- Dependencies: 1721
-- Name: COLUMN dat_usuarioconcepto.idconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_usuarioconcepto.idconcepto IS 'Identificador del concepto.';


--
-- TOC entry 8473 (class 0 OID 0)
-- Dependencies: 1721
-- Name: COLUMN dat_usuarioconcepto.idusuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN dat_usuarioconcepto.idusuario IS 'Identificador del usuario.';


--
-- TOC entry 1722 (class 1259 OID 196773)
-- Dependencies: 33
-- Name: sec_cargo_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_cargo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8475 (class 0 OID 0)
-- Dependencies: 1722
-- Name: SEQUENCE sec_cargo_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_cargo_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_cargo”.';


--
-- TOC entry 1723 (class 1259 OID 196775)
-- Dependencies: 8063 8064 8065 8066 8067 33
-- Name: nom_cargo; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_cargo (
    idnomcargo numeric(10,0) DEFAULT nextval('sec_cargo_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    orden numeric(10,0),
    actual numeric(1,0) DEFAULT 0,
    visible numeric(1,0) DEFAULT 0,
    idgrupocomplejidad numeric(10,0) DEFAULT 0,
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8477 (class 0 OID 0)
-- Dependencies: 1723
-- Name: TABLE nom_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_cargo IS 'Tabla nomencladora que almacena los cargos en la entidad.';


--
-- TOC entry 8478 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.idnomcargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.idnomcargo IS 'Identificador del cargo';


--
-- TOC entry 8479 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.denominacion IS 'Denominación del cargo civil.';


--
-- TOC entry 8480 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.abreviatura IS 'Abreviatura de la denominación del cargo civil.';


--
-- TOC entry 8481 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.orden; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.orden IS 'Orden del cargo civil.';


--
-- TOC entry 8482 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.actual IS 'Determina si el cargo civil es actual o no.';


--
-- TOC entry 8483 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.visible IS 'Determina si el cargo civil está visible o no.';


--
-- TOC entry 8484 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.idgrupocomplejidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.idgrupocomplejidad IS 'Identificador del grupo de complejidad';


--
-- TOC entry 8485 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8486 (class 0 OID 0)
-- Dependencies: 1723
-- Name: COLUMN nom_cargo.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_cargo.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1724 (class 1259 OID 196782)
-- Dependencies: 33
-- Name: sec_categocup_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_categocup_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8488 (class 0 OID 0)
-- Dependencies: 1724
-- Name: SEQUENCE sec_categocup_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_categocup_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_categoria”.';


--
-- TOC entry 1725 (class 1259 OID 196784)
-- Dependencies: 8068 8069 8070 33
-- Name: nom_categocup; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_categocup (
    idcategocup numeric(10,0) DEFAULT nextval('sec_categocup_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    orden numeric(10,0),
    abreviatura character varying(10),
    actual numeric(1,0),
    visible numeric(1,0),
    idcategoria numeric(10,0) DEFAULT 0,
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8490 (class 0 OID 0)
-- Dependencies: 1725
-- Name: TABLE nom_categocup; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_categocup IS 'Tabla nomencladora que almacena los grupos categorías ocupacionales de un trabajador.';


--
-- TOC entry 8491 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.idcategocup; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.idcategocup IS 'Identificador de la categoría ocupacional.';


--
-- TOC entry 8492 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.denominacion IS 'Denominación del grupo categoría ocupacional del trabajador.';


--
-- TOC entry 8493 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.orden; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.orden IS 'Orden del grupo categoría ocupacional.';


--
-- TOC entry 8494 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.abreviatura IS 'Abreviatura del grupo categoría ocupacional.';


--
-- TOC entry 8495 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.actual IS 'Determina si el grupo categoría ocupacional es actual o no.';


--
-- TOC entry 8496 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.visible IS 'Determina si el grupo categoría ocupacional está visible o no.';


--
-- TOC entry 8497 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.idcategoria; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.idcategoria IS 'Identificador del grupo categoria al que pertenecen.';


--
-- TOC entry 8498 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8499 (class 0 OID 0)
-- Dependencies: 1725
-- Name: COLUMN nom_categocup.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categocup.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1726 (class 1259 OID 196789)
-- Dependencies: 33
-- Name: sec_categoria_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_categoria_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 1727 (class 1259 OID 196791)
-- Dependencies: 8071 8072 33
-- Name: nom_categoria; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_categoria (
    idcategoria numeric(10,0) DEFAULT nextval('sec_categoria_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    orden numeric(10,0),
    abreviatura character varying(10),
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8502 (class 0 OID 0)
-- Dependencies: 1727
-- Name: COLUMN nom_categoria.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categoria.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8503 (class 0 OID 0)
-- Dependencies: 1727
-- Name: COLUMN nom_categoria.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categoria.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1728 (class 1259 OID 196795)
-- Dependencies: 33
-- Name: nom_categoriamilitar; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_categoriamilitar (
    idcategoriamilitar numeric(1,0) NOT NULL,
    denominacion character varying(100) NOT NULL
);




--
-- TOC entry 8505 (class 0 OID 0)
-- Dependencies: 1728
-- Name: TABLE nom_categoriamilitar; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_categoriamilitar IS 'Tabla que almacena los datos asociados a las categorías militares.';


--
-- TOC entry 8506 (class 0 OID 0)
-- Dependencies: 1728
-- Name: COLUMN nom_categoriamilitar.idcategoriamilitar; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categoriamilitar.idcategoriamilitar IS 'Identificador de la categoría militar.';


--
-- TOC entry 8507 (class 0 OID 0)
-- Dependencies: 1728
-- Name: COLUMN nom_categoriamilitar.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_categoriamilitar.denominacion IS 'Denominación de la categoría militar.';


--
-- TOC entry 1729 (class 1259 OID 196798)
-- Dependencies: 33
-- Name: sec_concepto_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_concepto_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8509 (class 0 OID 0)
-- Dependencies: 1729
-- Name: SEQUENCE sec_concepto_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_concepto_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_concepto”.';


--
-- TOC entry 1730 (class 1259 OID 196800)
-- Dependencies: 8073 8074 8075 33
-- Name: nom_concepto; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_concepto (
    idconcepto numeric(19,0) DEFAULT nextval('sec_concepto_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    orden numeric(6,0),
    grafica numeric(1,0) DEFAULT 0 NOT NULL,
    idicono numeric(19,0) DEFAULT 0 NOT NULL
);




--
-- TOC entry 8511 (class 0 OID 0)
-- Dependencies: 1730
-- Name: TABLE nom_concepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_concepto IS 'Tabla nomencladora que almacena los conceptos.';


--
-- TOC entry 8512 (class 0 OID 0)
-- Dependencies: 1730
-- Name: COLUMN nom_concepto.idconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_concepto.idconcepto IS 'Identificador del concepto.';


--
-- TOC entry 8513 (class 0 OID 0)
-- Dependencies: 1730
-- Name: COLUMN nom_concepto.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_concepto.denominacion IS 'Denominación del concepto.';


--
-- TOC entry 8514 (class 0 OID 0)
-- Dependencies: 1730
-- Name: COLUMN nom_concepto.orden; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_concepto.orden IS 'Orden del concepto.';


--
-- TOC entry 8515 (class 0 OID 0)
-- Dependencies: 1730
-- Name: COLUMN nom_concepto.grafica; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_concepto.grafica IS 'Permite saber si el concepto es graficable.';


--
-- TOC entry 8516 (class 0 OID 0)
-- Dependencies: 1730
-- Name: COLUMN nom_concepto.idicono; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_concepto.idicono IS 'Identificador del icono.';


--
-- TOC entry 1731 (class 1259 OID 196806)
-- Dependencies: 33
-- Name: sec_conceptopropiedad_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_conceptopropiedad_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8518 (class 0 OID 0)
-- Dependencies: 1731
-- Name: SEQUENCE sec_conceptopropiedad_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_conceptopropiedad_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_conceptopropiedad”.';


--
-- TOC entry 1732 (class 1259 OID 196808)
-- Dependencies: 8076 33
-- Name: nom_conceptopropiedad; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_conceptopropiedad (
    idconceptopropiedad numeric(19,0) DEFAULT nextval('sec_conceptopropiedad_seq'::regclass) NOT NULL,
    idconcepto numeric(19,0) NOT NULL,
    idpropiedad numeric(19,0) NOT NULL
);




--
-- TOC entry 8520 (class 0 OID 0)
-- Dependencies: 1732
-- Name: TABLE nom_conceptopropiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_conceptopropiedad IS 'Tabla nomencladora que almacena las relaciones de los conceptos con las propiedades almacenadas.';


--
-- TOC entry 8521 (class 0 OID 0)
-- Dependencies: 1732
-- Name: COLUMN nom_conceptopropiedad.idconceptopropiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_conceptopropiedad.idconceptopropiedad IS 'Identificador del concepto propiedad.';


--
-- TOC entry 8522 (class 0 OID 0)
-- Dependencies: 1732
-- Name: COLUMN nom_conceptopropiedad.idconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_conceptopropiedad.idconcepto IS 'Identificador del concepto.';


--
-- TOC entry 8523 (class 0 OID 0)
-- Dependencies: 1732
-- Name: COLUMN nom_conceptopropiedad.idpropiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_conceptopropiedad.idpropiedad IS 'Identificador de la propiedad.';


--
-- TOC entry 1733 (class 1259 OID 196812)
-- Dependencies: 33
-- Name: nom_condicion; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_condicion (
    idnomcargo numeric(19,0) NOT NULL,
    idgrupocomplejidad numeric(19,0) NOT NULL
);




--
-- TOC entry 8525 (class 0 OID 0)
-- Dependencies: 1733
-- Name: TABLE nom_condicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_condicion IS 'Tabla nomencladora que almacena las condiciones de los cargos en relacion con los grupos de complejidad.';


--
-- TOC entry 8526 (class 0 OID 0)
-- Dependencies: 1733
-- Name: COLUMN nom_condicion.idnomcargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_condicion.idnomcargo IS 'Identificador del cargo.';


--
-- TOC entry 8527 (class 0 OID 0)
-- Dependencies: 1733
-- Name: COLUMN nom_condicion.idgrupocomplejidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_condicion.idgrupocomplejidad IS 'Identificador del grupo de complejidad.';


--
-- TOC entry 1734 (class 1259 OID 196815)
-- Dependencies: 33
-- Name: sec_dominio_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_dominio_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8529 (class 0 OID 0)
-- Dependencies: 1734
-- Name: SEQUENCE sec_dominio_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_dominio_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_dominio”.';


--
-- TOC entry 1735 (class 1259 OID 196817)
-- Dependencies: 8077 8078 33
-- Name: nom_dominio; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_dominio (
    iddominio numeric(19,0) DEFAULT nextval('sec_dominio_seq'::regclass) NOT NULL,
    idpadre numeric(8,0) NOT NULL,
    denominacion character varying(100) NOT NULL,
    dominiostring character varying(255),
    descripcion character varying(255),
    seguridad numeric(19,0) DEFAULT 0,
    dominio "bit"[],
    lft numeric(19,0) NOT NULL,
    rgt numeric(19,0) NOT NULL,
    dominiob numeric(1,0)
);




--
-- TOC entry 8531 (class 0 OID 0)
-- Dependencies: 1735
-- Name: TABLE nom_dominio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_dominio IS 'Tabla nomencladora que almacena los dominios de los usuarios y permisos.';


--
-- TOC entry 8532 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.iddominio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.iddominio IS 'Identificador del dominio.';


--
-- TOC entry 8533 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.idpadre; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.idpadre IS 'Identificador del dominio padre.';


--
-- TOC entry 8534 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.denominacion IS 'Denominación del dominio.';


--
-- TOC entry 8535 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.dominiostring; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.dominiostring IS 'Cadena del dominio.';


--
-- TOC entry 8536 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.descripcion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.descripcion IS 'Descripción del dominio.';


--
-- TOC entry 8537 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.seguridad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.seguridad IS 'Seguridad del dominio.';


--
-- TOC entry 8538 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.dominio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.dominio IS 'Dominio.';


--
-- TOC entry 8539 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.lft; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.lft IS 'Hijo izquierdo.';


--
-- TOC entry 8540 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.rgt; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.rgt IS 'Hijo derecho.';


--
-- TOC entry 8541 (class 0 OID 0)
-- Dependencies: 1735
-- Name: COLUMN nom_dominio.dominiob; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_dominio.dominiob IS 'Dominio binario.';


--
-- TOC entry 1736 (class 1259 OID 196825)
-- Dependencies: 33
-- Name: sec_escalasalarial_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_escalasalarial_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;



--
-- TOC entry 8543 (class 0 OID 0)
-- Dependencies: 1736
-- Name: SEQUENCE sec_escalasalarial_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_escalasalarial_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_escalasalarial”.';


--
-- TOC entry 1737 (class 1259 OID 196827)
-- Dependencies: 8079 8080 33
-- Name: nom_escalasalarial; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_escalasalarial (
    idescalasalarial numeric(19,0) DEFAULT nextval('sec_escalasalarial_seq'::regclass) NOT NULL,
    idtipoescala numeric(19,0) NOT NULL,
    idsalario numeric(19,0) NOT NULL,
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8545 (class 0 OID 0)
-- Dependencies: 1737
-- Name: TABLE nom_escalasalarial; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_escalasalarial IS 'Tabla nomencladora que almacena las diferentes escalas salariales de las estructuras.';


--
-- TOC entry 8546 (class 0 OID 0)
-- Dependencies: 1737
-- Name: COLUMN nom_escalasalarial.idescalasalarial; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_escalasalarial.idescalasalarial IS 'Identificador de la escala salarial.';


--
-- TOC entry 8547 (class 0 OID 0)
-- Dependencies: 1737
-- Name: COLUMN nom_escalasalarial.idtipoescala; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_escalasalarial.idtipoescala IS 'Identificador del tipo de escala.';


--
-- TOC entry 8548 (class 0 OID 0)
-- Dependencies: 1737
-- Name: COLUMN nom_escalasalarial.idsalario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_escalasalarial.idsalario IS 'Identificador del salario.';


--
-- TOC entry 8549 (class 0 OID 0)
-- Dependencies: 1737
-- Name: COLUMN nom_escalasalarial.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_escalasalarial.actual IS 'Determina si la escala salarial es actual o no.';


--
-- TOC entry 8550 (class 0 OID 0)
-- Dependencies: 1737
-- Name: COLUMN nom_escalasalarial.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_escalasalarial.visible IS 'Determina si la escala salarial es visible o no.';


--
-- TOC entry 8551 (class 0 OID 0)
-- Dependencies: 1737
-- Name: COLUMN nom_escalasalarial.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_escalasalarial.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8552 (class 0 OID 0)
-- Dependencies: 1737
-- Name: COLUMN nom_escalasalarial.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_escalasalarial.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1738 (class 1259 OID 196831)
-- Dependencies: 33
-- Name: nom_estado; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_estado (
    idestado numeric(2,0) NOT NULL,
    denominacion character varying(20)
);




--
-- TOC entry 1739 (class 1259 OID 196834)
-- Dependencies: 33
-- Name: sec_filaestruc_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_filaestruc_seq
    START WITH 100002973
    INCREMENT BY 1
    MINVALUE 100000000
    MAXVALUE 999999999
    CACHE 1;




--
-- TOC entry 8555 (class 0 OID 0)
-- Dependencies: 1739
-- Name: SEQUENCE sec_filaestruc_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_filaestruc_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_filaestruc”.';


--
-- TOC entry 1740 (class 1259 OID 196836)
-- Dependencies: 8081 8082 8083 8084 8085 8086 8087 8088 8089 8090 8091 33
-- Name: nom_filaestruc; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_filaestruc (
    idfila numeric(19,0) DEFAULT nextval('sec_filaestruc_seq'::regclass) NOT NULL,
    idpadre numeric(19,0),
    lft numeric(19,0),
    idconcepto numeric(19,0) NOT NULL,
    rgt numeric(19,0),
    orden numeric(19,0),
    dominiofila "bit"[] DEFAULT '{1}'::"bit"[] NOT NULL,
    accesofila "bit"[] DEFAULT '{0}'::"bit"[],
    fechafin date,
    nivel numeric DEFAULT 1,
    imagen character varying(255) DEFAULT 'point'::character varying,
    minscale integer DEFAULT 0,
    maxscale integer DEFAULT 0,
    latitud double precision DEFAULT 0,
    longitud double precision DEFAULT 0,
    wkb_geometry integer DEFAULT 0,
    oid oid DEFAULT 0
);




--
-- TOC entry 8557 (class 0 OID 0)
-- Dependencies: 1740
-- Name: TABLE nom_filaestruc; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_filaestruc IS 'Tabla nomencladora que almacena las filas con las que va a estar relacionado cada nomenclador de entidad atributo valor.';


--
-- TOC entry 8558 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.idfila; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.idfila IS 'Identificador de la fila estructural.';


--
-- TOC entry 8559 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.idpadre; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.idpadre IS 'Identificador de la fila estructural padre.';


--
-- TOC entry 8560 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.lft; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.lft IS 'Hijo izquierdo.';


--
-- TOC entry 8561 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.idconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.idconcepto IS 'Identificador de la estructura referencial.';


--
-- TOC entry 8562 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.rgt; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.rgt IS 'Hijo derecho.';


--
-- TOC entry 8563 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.orden; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.orden IS 'Orden de la fila estructural.';


--
-- TOC entry 8564 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.dominiofila; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.dominiofila IS 'Dominio de la fila estructural.';


--
-- TOC entry 8565 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.accesofila; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.accesofila IS 'Acceso a la fila.';


--
-- TOC entry 8566 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.fechafin IS 'Fecha fin del uso del nomenclador.';


--
-- TOC entry 8567 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.nivel; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.nivel IS 'nivel de la fila estructural.';


--
-- TOC entry 8568 (class 0 OID 0)
-- Dependencies: 1740
-- Name: COLUMN nom_filaestruc.oid; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_filaestruc.oid IS 'Identificador único del objeto.';


--
CREATE SEQUENCE sec_firma_seq
    START WITH 9
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999
    CACHE 1;
COMMENT ON SEQUENCE sec_firma_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_firma”.';
CREATE TABLE nom_firma (
    idfirma numeric(19,0) DEFAULT nextval('sec_firma_seq'::regclass) NOT NULL,
    persona character varying(255) NOT NULL,
    idnomcargo numeric(19,0) DEFAULT 0 NOT NULL,
    iddominio numeric(19,0) DEFAULT 1 NOT NULL,
    actual numeric(1,0) DEFAULT 1 NOT NULL,
    visible numeric(1,0) DEFAULT 1 NOT NULL,
    fechainicio date NOT NULL,
    fechafin date
);
COMMENT ON COLUMN nom_firma.fechainicio IS 'campo para la fecha de inicio';
COMMENT ON COLUMN nom_firma.fechafin IS 'Campo para la fecha fin';
-- TOC entry 1741 (class 1259 OID 196853)
-- Dependencies: 33
-- Name: sec_grado_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_grado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8570 (class 0 OID 0)
-- Dependencies: 1741
-- Name: SEQUENCE sec_grado_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_grado_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_grado”.';


--
-- TOC entry 1742 (class 1259 OID 196855)
-- Dependencies: 8092 8093 8094 8095 33
-- Name: nom_grado; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_grado (
    idgrado numeric(19,0) DEFAULT nextval('sec_grado_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    actual numeric(1,0),
    visible numeric(1,0),
    idicono numeric(19,0) DEFAULT 0 NOT NULL,
    orden numeric(3,0),
    idcategoriamilitar numeric(1,0) NOT NULL,
    marina numeric(1,0) DEFAULT 0 NOT NULL,
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8572 (class 0 OID 0)
-- Dependencies: 1742
-- Name: TABLE nom_grado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_grado IS 'Tabla nomencladora que almacena los diferentes grados.';


--
-- TOC entry 8573 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.idgrado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.idgrado IS 'Identificador del grado.';


--
-- TOC entry 8574 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.denominacion IS 'Denominación del grado.';


--
-- TOC entry 8575 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.abreviatura IS 'Abreviatura de la denominación del grado.';


--
-- TOC entry 8576 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.actual IS 'Determina si el nomenclador de grado es actual o no.';


--
-- TOC entry 8577 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.visible IS 'Determina si el nomenclador de grado es visible o no.';


--
-- TOC entry 8578 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.idicono; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.idicono IS 'Identificador del icono';


--
-- TOC entry 8579 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.orden; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.orden IS 'Jerarquía de los grados militares.';


--
-- TOC entry 8580 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.idcategoriamilitar; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.idcategoriamilitar IS 'Identificador de la categoría del grado militar.';


--
-- TOC entry 8581 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.marina; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.marina IS 'Permite conocer si el grado es marino o terrestre.';


--
-- TOC entry 8582 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8583 (class 0 OID 0)
-- Dependencies: 1742
-- Name: COLUMN nom_grado.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grado.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1743 (class 1259 OID 196861)
-- Dependencies: 33
-- Name: sec_grupocomplejidad_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_grupocomplejidad_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8585 (class 0 OID 0)
-- Dependencies: 1743
-- Name: SEQUENCE sec_grupocomplejidad_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_grupocomplejidad_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_grupocomplejidad”.';


--
-- TOC entry 1744 (class 1259 OID 196863)
-- Dependencies: 8096 8097 33
-- Name: nom_grupocomplejidad; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_grupocomplejidad (
    idgrupocomplejidad numeric(19,0) DEFAULT nextval('sec_grupocomplejidad_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8587 (class 0 OID 0)
-- Dependencies: 1744
-- Name: TABLE nom_grupocomplejidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_grupocomplejidad IS 'Tabla nomencladora que almacena los diferentes grupos de complejidad.';


--
-- TOC entry 8588 (class 0 OID 0)
-- Dependencies: 1744
-- Name: COLUMN nom_grupocomplejidad.idgrupocomplejidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grupocomplejidad.idgrupocomplejidad IS 'Identificador del grupo de complejidad.';


--
-- TOC entry 8589 (class 0 OID 0)
-- Dependencies: 1744
-- Name: COLUMN nom_grupocomplejidad.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grupocomplejidad.denominacion IS 'Denominación del grupo de complejidad.';


--
-- TOC entry 8590 (class 0 OID 0)
-- Dependencies: 1744
-- Name: COLUMN nom_grupocomplejidad.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grupocomplejidad.abreviatura IS 'Abreviatura de la denominación del grupo de complejidad.';


--
-- TOC entry 8591 (class 0 OID 0)
-- Dependencies: 1744
-- Name: COLUMN nom_grupocomplejidad.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grupocomplejidad.actual IS 'Determina si el nomenclador de grupo de complejidad es actual o no.';


--
-- TOC entry 8592 (class 0 OID 0)
-- Dependencies: 1744
-- Name: COLUMN nom_grupocomplejidad.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grupocomplejidad.visible IS 'Determina si el nomenclador de grupo de complejidad es visible o no.';


--
-- TOC entry 8593 (class 0 OID 0)
-- Dependencies: 1744
-- Name: COLUMN nom_grupocomplejidad.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grupocomplejidad.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8594 (class 0 OID 0)
-- Dependencies: 1744
-- Name: COLUMN nom_grupocomplejidad.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_grupocomplejidad.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1745 (class 1259 OID 196867)
-- Dependencies: 33
-- Name: sec_icono_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_icono_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1
    CYCLE;




--
-- TOC entry 8596 (class 0 OID 0)
-- Dependencies: 1745
-- Name: SEQUENCE sec_icono_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_icono_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_icono”.';


--
-- TOC entry 1746 (class 1259 OID 196869)
-- Dependencies: 8098 8099 8100 8101 8102 8103 33
-- Name: nom_icono; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_icono (
    idicono numeric(100,0) DEFAULT nextval('sec_icono_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    icono character varying,
    concepto numeric(1,0) DEFAULT 0,
    medio numeric(1,0) DEFAULT 0,
    grado numeric(1,0) DEFAULT 0,
    logo numeric(1,0) DEFAULT 0,
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8598 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.idicono; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.idicono IS 'Identificador de la tabla nom_icono';


--
-- TOC entry 8599 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.denominacion IS 'Denominacion del icono insertado.';


--
-- TOC entry 8600 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.icono; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.icono IS 'Guarda la imagen codificada.';


--
-- TOC entry 8601 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.concepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.concepto IS 'Especifica si el icono podra ser usado como icono del sistema para los conceptos.';


--
-- TOC entry 8602 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.medio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.medio IS 'Especifica si el icono podra ser usado como icono del sistema para los medios.';


--
-- TOC entry 8603 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.grado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.grado IS 'Especifica si el icono podra ser usado como icono del sistema para los grados militares.';


--
-- TOC entry 8604 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.logo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.logo IS 'Especifica si el icono podra ser usado como icono del sistema para los logos de las entidades.';


--
-- TOC entry 8605 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8606 (class 0 OID 0)
-- Dependencies: 1746
-- Name: COLUMN nom_icono.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_icono.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1747 (class 1259 OID 196880)
-- Dependencies: 8104 33
-- Name: nom_organo; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_organo (
    idorgano numeric(19,0) NOT NULL,
    idconcepto numeric(19,0) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    orden numeric(10,0) NOT NULL,
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8608 (class 0 OID 0)
-- Dependencies: 1747
-- Name: TABLE nom_organo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_organo IS 'Tabla nomencladora que almacena los órganos.';


--
-- TOC entry 8609 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.idorgano; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.idorgano IS 'Identificador del órgano.';


--
-- TOC entry 8610 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.idconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.idconcepto IS 'Identificador de la estructura referencial.';


--
-- TOC entry 8611 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.denominacion IS 'Denominación del órgano.';


--
-- TOC entry 8612 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.abreviatura IS 'Abreviatura de la denominación del órgano.';


--
-- TOC entry 8613 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.orden; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.orden IS 'Orden del órgano.';


--
-- TOC entry 8614 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.actual IS 'Determina si el órgano es actual o no.';


--
-- TOC entry 8615 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.visible IS 'Determina si el órgano está visible o no.';


--
-- TOC entry 8616 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8617 (class 0 OID 0)
-- Dependencies: 1747
-- Name: COLUMN nom_organo.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_organo.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1748 (class 1259 OID 196883)
-- Dependencies: 33
-- Name: sec_preparacion_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_preparacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;




--
-- TOC entry 8619 (class 0 OID 0)
-- Dependencies: 1748
-- Name: SEQUENCE sec_preparacion_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_preparacion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_preparacion”.';


--
-- TOC entry 1749 (class 1259 OID 196885)
-- Dependencies: 8105 8106 33
-- Name: nom_preparacion; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_preparacion (
    idpreparacion numeric(19,0) DEFAULT nextval('sec_preparacion_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8621 (class 0 OID 0)
-- Dependencies: 1749
-- Name: TABLE nom_preparacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_preparacion IS 'Tabla nomencladora que almacena los diferentes niveles de preparación del cargo.';


--
-- TOC entry 8622 (class 0 OID 0)
-- Dependencies: 1749
-- Name: COLUMN nom_preparacion.idpreparacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_preparacion.idpreparacion IS 'Identificador de la preparación.';


--
-- TOC entry 8623 (class 0 OID 0)
-- Dependencies: 1749
-- Name: COLUMN nom_preparacion.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_preparacion.denominacion IS 'Denominación de la preparación.';


--
-- TOC entry 8624 (class 0 OID 0)
-- Dependencies: 1749
-- Name: COLUMN nom_preparacion.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_preparacion.abreviatura IS 'Abreviatura de la denominación de la preparación.';


--
-- TOC entry 8625 (class 0 OID 0)
-- Dependencies: 1749
-- Name: COLUMN nom_preparacion.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_preparacion.actual IS 'Determina si la preparación es actual o no.';


--
-- TOC entry 8626 (class 0 OID 0)
-- Dependencies: 1749
-- Name: COLUMN nom_preparacion.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_preparacion.visible IS 'Determina si la preparación es visible o no.';


--
-- TOC entry 8627 (class 0 OID 0)
-- Dependencies: 1749
-- Name: COLUMN nom_preparacion.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_preparacion.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8628 (class 0 OID 0)
-- Dependencies: 1749
-- Name: COLUMN nom_preparacion.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_preparacion.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1750 (class 1259 OID 196889)
-- Dependencies: 33
-- Name: nom_propiedad; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_propiedad (
    idpropiedad numeric(9,0) NOT NULL,
    denominacion character varying(40) NOT NULL,
    referencia character varying(40) NOT NULL,
    identificador character varying(20)
);




--
-- TOC entry 8630 (class 0 OID 0)
-- Dependencies: 1750
-- Name: TABLE nom_propiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_propiedad IS 'Tabla nomencladora que almacena los datos de las propiedades de cada uno de los conceptos.';


--
-- TOC entry 8631 (class 0 OID 0)
-- Dependencies: 1750
-- Name: COLUMN nom_propiedad.idpropiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_propiedad.idpropiedad IS 'Identificador de la propiedad.';


--
-- TOC entry 8632 (class 0 OID 0)
-- Dependencies: 1750
-- Name: COLUMN nom_propiedad.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_propiedad.denominacion IS 'Denominación de la propiedad.';


--
-- TOC entry 8633 (class 0 OID 0)
-- Dependencies: 1750
-- Name: COLUMN nom_propiedad.referencia; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_propiedad.referencia IS 'Nombre de la tabla que contiene los valores de la propiedad.';


--
-- TOC entry 8634 (class 0 OID 0)
-- Dependencies: 1750
-- Name: COLUMN nom_propiedad.identificador; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_propiedad.identificador IS 'Identificador de la tabla que contiene los valores de la propiedad.';


--
-- TOC entry 1751 (class 1259 OID 196892)
-- Dependencies: 33
-- Name: nom_relacion; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_relacion (
    idrelacion numeric(19,0) NOT NULL,
    idpadre numeric(19,0) NOT NULL,
    idhijo numeric(19,0) NOT NULL
);




--
-- TOC entry 8636 (class 0 OID 0)
-- Dependencies: 1751
-- Name: TABLE nom_relacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_relacion IS 'Tabla nomencladora que almacena las diferentes jerarquías entre conceptos.';


--
-- TOC entry 8637 (class 0 OID 0)
-- Dependencies: 1751
-- Name: COLUMN nom_relacion.idrelacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_relacion.idrelacion IS 'Identificador de la relación.';


--
-- TOC entry 8638 (class 0 OID 0)
-- Dependencies: 1751
-- Name: COLUMN nom_relacion.idpadre; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_relacion.idpadre IS 'Identificador del padre.';


--
-- TOC entry 8639 (class 0 OID 0)
-- Dependencies: 1751
-- Name: COLUMN nom_relacion.idhijo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_relacion.idhijo IS 'Identificador del hijo.';


--
-- TOC entry 1752 (class 1259 OID 196895)
-- Dependencies: 33
-- Name: sec_salario_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_salario_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8641 (class 0 OID 0)
-- Dependencies: 1752
-- Name: SEQUENCE sec_salario_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_salario_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_salario”.';


--
-- TOC entry 1753 (class 1259 OID 196897)
-- Dependencies: 8107 8108 8109 8110 8111 33
-- Name: nom_salario; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_salario (
    idsalario numeric(19,0) DEFAULT nextval('sec_salario_seq'::regclass) NOT NULL,
    idgrupocomplejidad numeric(19,0) DEFAULT 0 NOT NULL,
    salario double precision,
    actual numeric(1,0) DEFAULT 1,
    visible numeric(1,0) DEFAULT 1,
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8643 (class 0 OID 0)
-- Dependencies: 1753
-- Name: TABLE nom_salario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_salario IS 'Tabla nomencladora que almacena los datos asociados al salario.';


--
-- TOC entry 8644 (class 0 OID 0)
-- Dependencies: 1753
-- Name: COLUMN nom_salario.idsalario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_salario.idsalario IS 'Identificador del salario.';


--
-- TOC entry 8645 (class 0 OID 0)
-- Dependencies: 1753
-- Name: COLUMN nom_salario.idgrupocomplejidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_salario.idgrupocomplejidad IS 'Identificador del grupo de complejidad.';


--
-- TOC entry 8646 (class 0 OID 0)
-- Dependencies: 1753
-- Name: COLUMN nom_salario.salario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_salario.salario IS 'Salario.';


--
-- TOC entry 8647 (class 0 OID 0)
-- Dependencies: 1753
-- Name: COLUMN nom_salario.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_salario.actual IS 'Determina si el salario es actual o no.';


--
-- TOC entry 8648 (class 0 OID 0)
-- Dependencies: 1753
-- Name: COLUMN nom_salario.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_salario.visible IS 'Determina si el salario es visible o no.';


--
-- TOC entry 8649 (class 0 OID 0)
-- Dependencies: 1753
-- Name: COLUMN nom_salario.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_salario.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8650 (class 0 OID 0)
-- Dependencies: 1753
-- Name: COLUMN nom_salario.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_salario.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1754 (class 1259 OID 196904)
-- Dependencies: 33
-- Name: sec_nomsubordinacion_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_nomsubordinacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8652 (class 0 OID 0)
-- Dependencies: 1754
-- Name: SEQUENCE sec_nomsubordinacion_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_nomsubordinacion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_subordinacion”.';


--
-- TOC entry 1755 (class 1259 OID 196906)
-- Dependencies: 8112 8113 33
-- Name: nom_subordinacion; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_subordinacion (
    idnomsubordinacion numeric(9,0) DEFAULT nextval('sec_nomsubordinacion_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8654 (class 0 OID 0)
-- Dependencies: 1755
-- Name: TABLE nom_subordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_subordinacion IS 'Tabla nomencladora que almacena los datos asociados a los nomencladores de las subordinaciones entre estructuras internas.';


--
-- TOC entry 8655 (class 0 OID 0)
-- Dependencies: 1755
-- Name: COLUMN nom_subordinacion.idnomsubordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_subordinacion.idnomsubordinacion IS 'Identificador del nomenclador de subordinación.';


--
-- TOC entry 8656 (class 0 OID 0)
-- Dependencies: 1755
-- Name: COLUMN nom_subordinacion.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_subordinacion.denominacion IS 'Denominación de la subordinación.';


--
-- TOC entry 8657 (class 0 OID 0)
-- Dependencies: 1755
-- Name: COLUMN nom_subordinacion.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_subordinacion.abreviatura IS 'Abreviatura de la denominación de la subordinación.';


--
-- TOC entry 8658 (class 0 OID 0)
-- Dependencies: 1755
-- Name: COLUMN nom_subordinacion.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_subordinacion.actual IS 'Determina si la subordinación es actual o no.';


--
-- TOC entry 8659 (class 0 OID 0)
-- Dependencies: 1755
-- Name: COLUMN nom_subordinacion.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_subordinacion.visible IS 'Determina si la subordinación es visible o no.';


--
-- TOC entry 8660 (class 0 OID 0)
-- Dependencies: 1755
-- Name: COLUMN nom_subordinacion.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_subordinacion.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8661 (class 0 OID 0)
-- Dependencies: 1755
-- Name: COLUMN nom_subordinacion.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_subordinacion.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1756 (class 1259 OID 196910)
-- Dependencies: 33
-- Name: sec_tipoescala_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_tipoescala_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8663 (class 0 OID 0)
-- Dependencies: 1756
-- Name: SEQUENCE sec_tipoescala_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_tipoescala_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_tipoescala”.';


--
-- TOC entry 1757 (class 1259 OID 196912)
-- Dependencies: 8114 8115 33
-- Name: nom_tipoescala; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_tipoescala (
    idtipoescala numeric(19,0) DEFAULT nextval('sec_tipoescala_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8665 (class 0 OID 0)
-- Dependencies: 1757
-- Name: TABLE nom_tipoescala; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_tipoescala IS 'Tabla nomencladora que almacena las diferentes escalas salariales de las estructuras.';


--
-- TOC entry 8666 (class 0 OID 0)
-- Dependencies: 1757
-- Name: COLUMN nom_tipoescala.idtipoescala; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipoescala.idtipoescala IS 'Identificador de la escala salarial.';


--
-- TOC entry 8667 (class 0 OID 0)
-- Dependencies: 1757
-- Name: COLUMN nom_tipoescala.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipoescala.denominacion IS 'Denominación de la preparación.';


--
-- TOC entry 8668 (class 0 OID 0)
-- Dependencies: 1757
-- Name: COLUMN nom_tipoescala.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipoescala.abreviatura IS 'Abreviatura de la denominación de la escala salarial.';


--
-- TOC entry 8669 (class 0 OID 0)
-- Dependencies: 1757
-- Name: COLUMN nom_tipoescala.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipoescala.actual IS 'Determina si la escala salarial es actual o no.';


--
-- TOC entry 8670 (class 0 OID 0)
-- Dependencies: 1757
-- Name: COLUMN nom_tipoescala.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipoescala.visible IS 'Determina si la escala salarial es visible o no.';


--
-- TOC entry 8671 (class 0 OID 0)
-- Dependencies: 1757
-- Name: COLUMN nom_tipoescala.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipoescala.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8672 (class 0 OID 0)
-- Dependencies: 1757
-- Name: COLUMN nom_tipoescala.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipoescala.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1758 (class 1259 OID 196916)
-- Dependencies: 33
-- Name: sec_tipomedio_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_tipomedio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8674 (class 0 OID 0)
-- Dependencies: 1758
-- Name: SEQUENCE sec_tipomedio_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_tipomedio_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_tipomedio”.';


--
-- TOC entry 1759 (class 1259 OID 196918)
-- Dependencies: 8116 8117 33
-- Name: nom_tipomedio; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_tipomedio (
    idtipomedio numeric(19,0) DEFAULT nextval('sec_tipomedio_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    abreviatura character varying(10),
    actual numeric(1,0),
    visible numeric(1,0),
    fechainicio date DEFAULT ('now'::text)::date,
    fechafin date
);




--
-- TOC entry 8676 (class 0 OID 0)
-- Dependencies: 1759
-- Name: TABLE nom_tipomedio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON TABLE nom_tipomedio IS 'Tabla nomencladora que almacena los datos asociados a los tipos de medios.';


--
-- TOC entry 8677 (class 0 OID 0)
-- Dependencies: 1759
-- Name: COLUMN nom_tipomedio.idtipomedio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipomedio.idtipomedio IS 'Identificador del tipo de medio.';


--
-- TOC entry 8678 (class 0 OID 0)
-- Dependencies: 1759
-- Name: COLUMN nom_tipomedio.denominacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipomedio.denominacion IS 'Denominación del tipo de medio.';


--
-- TOC entry 8679 (class 0 OID 0)
-- Dependencies: 1759
-- Name: COLUMN nom_tipomedio.abreviatura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipomedio.abreviatura IS 'Abreviatura de la denominación del tipo de medio.';


--
-- TOC entry 8680 (class 0 OID 0)
-- Dependencies: 1759
-- Name: COLUMN nom_tipomedio.actual; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipomedio.actual IS 'Determina si el tipo de medio es actual o no.';


--
-- TOC entry 8681 (class 0 OID 0)
-- Dependencies: 1759
-- Name: COLUMN nom_tipomedio.visible; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipomedio.visible IS 'Determina si el tipo de medio es visible o no.';


--
-- TOC entry 8682 (class 0 OID 0)
-- Dependencies: 1759
-- Name: COLUMN nom_tipomedio.fechainicio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipomedio.fechainicio IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 8683 (class 0 OID 0)
-- Dependencies: 1759
-- Name: COLUMN nom_tipomedio.fechafin; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN nom_tipomedio.fechafin IS 'Fecha de creacion del nomenclador';


--
-- TOC entry 1760 (class 1259 OID 196922)
-- Dependencies: 33
-- Name: sec_campoestruc_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_campoestruc_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8685 (class 0 OID 0)
-- Dependencies: 1760
-- Name: SEQUENCE sec_campoestruc_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_campoestruc_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_campoestruc”.';


--
-- TOC entry 1761 (class 1259 OID 196924)
-- Dependencies: 33
-- Name: sec_escala_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_escala_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8687 (class 0 OID 0)
-- Dependencies: 1761
-- Name: SEQUENCE sec_escala_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_escala_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_escala”.';


--
-- TOC entry 1762 (class 1259 OID 196926)
-- Dependencies: 33
-- Name: sec_medio_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE sec_medio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999
    CACHE 1;




--
-- TOC entry 8689 (class 0 OID 0)
-- Dependencies: 1762
-- Name: SEQUENCE sec_medio_seq; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON SEQUENCE sec_medio_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla “nom_medio”.
';





--
-- TOC entry 8282 (class 2620 OID 197086)
-- Dependencies: 1742 2757
-- Name: ft_actualizar_orden_grado; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER ft_actualizar_orden_grado AFTER INSERT ON nom_grado FOR EACH ROW EXECUTE PROCEDURE ft_actualizar_orden_grado();

ALTER TABLE nom_grado DISABLE TRIGGER ft_actualizar_orden_grado;


--
-- TOC entry 8284 (class 2620 OID 197087)
-- Dependencies: 1746 2773
-- Name: ft_reiniciar_secuencia_icono; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER ft_reiniciar_secuencia_icono AFTER DELETE ON nom_icono FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_icono();


--
-- TOC entry 8285 (class 2620 OID 197088)
-- Dependencies: 1747 2758
-- Name: t_actualizar; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_actualizar AFTER UPDATE ON nom_organo FOR EACH ROW EXECUTE PROCEDURE ft_actualizar_organo();


--
-- TOC entry 8278 (class 2620 OID 197089)
-- Dependencies: 1735 2760
-- Name: t_eliminar; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_eliminar AFTER DELETE ON nom_dominio FOR EACH ROW EXECUTE PROCEDURE ft_eliminar_nodo_dominio();


--
-- TOC entry 8270 (class 2620 OID 197090)
-- Dependencies: 1716 2761
-- Name: t_eliminar_proyecto; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_eliminar_proyecto AFTER DELETE ON dat_proyecto FOR EACH ROW EXECUTE PROCEDURE ft_eliminar_proyecto();


--
-- TOC entry 8281 (class 2620 OID 197091)
-- Dependencies: 1740 2763
-- Name: t_insertar; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_insertar BEFORE INSERT ON nom_filaestruc FOR EACH ROW EXECUTE PROCEDURE ft_insertar_fila();


--
-- TOC entry 8266 (class 2620 OID 197092)
-- Dependencies: 1706 2781
-- Name: t_insertar_dat_cargo; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_insertar_dat_cargo BEFORE INSERT ON dat_cargo FOR EACH ROW EXECUTE PROCEDURE ft_trabajocargo();


--
-- TOC entry 8279 (class 2620 OID 197093)
-- Dependencies: 1735 2762
-- Name: t_insertar_dominio; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_insertar_dominio BEFORE INSERT ON nom_dominio FOR EACH ROW EXECUTE PROCEDURE ft_insertar_nodo_dominio();


--
-- TOC entry 8267 (class 2620 OID 197094)
-- Dependencies: 1709 2782
-- Name: t_insertar_estructura; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_insertar_estructura BEFORE INSERT ON dat_estructura FOR EACH ROW EXECUTE PROCEDURE ft_trabajoestructura();


--
-- TOC entry 8268 (class 2620 OID 197095)
-- Dependencies: 1710 2777
-- Name: t_insertar_estructuraop; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_insertar_estructuraop BEFORE INSERT ON dat_estructuraop FOR EACH ROW EXECUTE PROCEDURE ft_trabajoestructuraop();


--
-- TOC entry 8269 (class 2620 OID 197096)
-- Dependencies: 1714 2721
-- Name: t_insertar_medio; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_insertar_medio BEFORE INSERT ON dat_medio FOR EACH ROW EXECUTE PROCEDURE ft_trabajomedio();


--
-- TOC entry 8273 (class 2620 OID 197097)
-- Dependencies: 1723 2764
-- Name: t_reiniciar_secuencia_cargo; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_cargo AFTER DELETE ON nom_cargo FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_cargo();


--
-- TOC entry 8274 (class 2620 OID 197098)
-- Dependencies: 1725 2765
-- Name: t_reiniciar_secuencia_categocup; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_categocup AFTER DELETE ON nom_categocup FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_categocup();


--
-- TOC entry 8275 (class 2620 OID 197099)
-- Dependencies: 1727 2766
-- Name: t_reiniciar_secuencia_categoria; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_categoria AFTER DELETE ON nom_categoria FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_categoria();


--
-- TOC entry 8276 (class 2620 OID 197100)
-- Dependencies: 1730 2767
-- Name: t_reiniciar_secuencia_concepto; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_concepto AFTER DELETE ON nom_concepto FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_concepto();


--
-- TOC entry 8290 (class 2620 OID 251292)
-- Dependencies: 2243 2741
-- Name: t_reiniciar_secuencia_conceptocondicion; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_conceptocondicion AFTER DELETE ON dat_conceptocondicion FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_conceptocondicion();


--
-- TOC entry 8277 (class 2620 OID 197101)
-- Dependencies: 1732 2768
-- Name: t_reiniciar_secuencia_conceptopropiedad; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_conceptopropiedad AFTER DELETE ON nom_conceptopropiedad FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_conceptopropiedad();


--
-- TOC entry 8272 (class 2620 OID 197102)
-- Dependencies: 1719 2769
-- Name: t_reiniciar_secuencia_datsubordinacion; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_datsubordinacion AFTER DELETE ON dat_subordinacion FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_datsubordinacion();


--
-- TOC entry 8280 (class 2620 OID 197103)
-- Dependencies: 1735 2770
-- Name: t_reiniciar_secuencia_dominio; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_dominio AFTER DELETE ON nom_dominio FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_dominio();


--
-- TOC entry 8283 (class 2620 OID 197104)
-- Dependencies: 1744 2772
-- Name: t_reiniciar_secuencia_grupocomplejidad; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_grupocomplejidad AFTER DELETE ON nom_grupocomplejidad FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_grupocomplejidad();


--
-- TOC entry 8288 (class 2620 OID 197105)
-- Dependencies: 1755 2775
-- Name: t_reiniciar_secuencia_nomsubordinacion; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_nomsubordinacion AFTER DELETE ON nom_subordinacion FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_nomsubordinacion();


--
-- TOC entry 8286 (class 2620 OID 197106)
-- Dependencies: 1749 2776
-- Name: t_reiniciar_secuencia_preparacion; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_preparacion AFTER DELETE ON nom_preparacion FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_preparacion();


--
-- TOC entry 8271 (class 2620 OID 197107)
-- Dependencies: 1716 2778
-- Name: t_reiniciar_secuencia_proyecto; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_proyecto AFTER DELETE ON dat_proyecto FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_proyecto();


--
-- TOC entry 8287 (class 2620 OID 197108)
-- Dependencies: 1753 2779
-- Name: t_reiniciar_secuencia_salario; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_salario AFTER DELETE ON nom_salario FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_salario();


--
-- TOC entry 8289 (class 2620 OID 197109)
-- Dependencies: 1759 2780
-- Name: t_reiniciar_secuencia_tipomedio; Type: TRIGGER; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE TRIGGER t_reiniciar_secuencia_tipomedio AFTER DELETE ON nom_tipomedio FOR EACH ROW EXECUTE PROCEDURE ft_reiniciar_secuencia_tipomedio();






--

