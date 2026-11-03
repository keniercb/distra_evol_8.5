CREATE SEQUENCE mod_estructuracomp.dat_configpuertos_idconfigpuertos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.dat_configpuertos_idconfigpuertos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_configpuertos".';

CREATE SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargofacultado".';

CREATE SEQUENCE mod_estructuracomp.sec_nivelcargo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 4
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.sec_nivelcargo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_nivelcargo".';

CREATE SEQUENCE mod_estructuracomp.sec_sector_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 3
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.sec_sector_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_sector".';

DROP TRIGGER t_actualizar ON mod_estructuracomp.nom_filaestruc;

COMMENT ON SCHEMA mod_estructuracomp
IS 'Almacena toda la información de estructura y composición. Versión 2. (RRHH)';

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_actualizar_orden (
  idreferencia varchar,
  tabla varchar
)
RETURNS boolean AS
$body$
DECLARE
 datarecord record;
 orden integer;
 temp character varying;
BEGIN
orden = 0;

 FOR datarecord in execute 'Select * ,'||idreferencia||' as id from mod_estructuracomp.'||$2||' order by '||$1
     LOOP
      orden = orden + 1; 
      execute 'Update mod_estructuracomp.'||$2||' set orden = '||orden||' where '||$1||' = '||datarecord.id; 
      Raise Notice 'Orden:%',orden;    
     END LOOP;
     
     RETURN TRUE;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_actualizar_orden_completo (
)
RETURNS boolean AS
$body$
DECLARE
    primerasfilas mod_estructuracomp.nom_filaestruc;
    contador INTEGER;
    
BEGIN
contador=0;
--Todas las filas que son raices 
 FOR primerasfilas IN SELECT * FROM mod_estructuracomp.nom_filaestruc  WHERE idfila=idpadre ORDER BY orden
  LOOP
  contador=contador+1;
      EXIT WHEN primerasfilas IS NULL;
      UPDATE mod_estructuracomp.nom_filaestruc  SET orden=contador  WHERE idfila=primerasfilas.idfila;
         PERFORM mod_estructuracomp.f_poner_orden_arbol(primerasfilas.idfila);
   END LOOP;

 RAISE NOTICE 'Orden reordenado correctamente.'; 
   
RETURN true;

END
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_actualizar_ordenunico (
  idfila numeric
)
RETURNS boolean AS
$body$
DECLARE
    fila mod_estructuracomp.nom_filaestruc;
    padre mod_estructuracomp.nom_filaestruc;
    ordenuniconew public.ltree;
    ordenltree public.ltree;
BEGIN



SELECT * INTO fila FROM mod_estructuracomp.nom_filaestruc f WHERE f.idfila=$1;
SELECT * INTO padre FROM mod_estructuracomp.nom_filaestruc f WHERE f.idfila=fila.idpadre;

--Si es una raiz
IF fila.idfila = padre.idfila THEN
  --Si el orden esta vacio lanzo una excepcion
    IF padre.orden IS NULL THEN
    RAISE EXCEPTION 'El orden de la fila % no existe',padre.idfila;
    ELSE
      ordenltree:=(SELECT mod_estructuracomp.f_dame_letra_dado_numero(padre.orden))::ltree;
     UPDATE mod_estructuracomp.nom_filaestruc as f SET ordenunico=ordenltree WHERE f.idfila=padre.idfila;
    END IF;
	
   ordenuniconew := public.text2ltree((SELECT mod_estructuracomp.f_dame_letra_dado_numero(fila.orden)));
ELSE
--Si no es una raiz
ordenuniconew := concat(padre.ordenunico ,'.', (SELECT mod_estructuracomp.f_dame_letra_dado_numero(fila.orden)))::public.ltree;
END IF;

UPDATE mod_estructuracomp.nom_filaestruc f1 SET  ordenunico = ordenuniconew  WHERE f1.idfila=fila.idfila;

RETURN true;

 
END
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_actualizar_ordenunico_arbol (
  idarbol numeric
)
RETURNS void AS
$body$
DECLARE
    hijos mod_estructuracomp.nom_filaestruc;
    padre mod_estructuracomp.nom_filaestruc;
    esHoja boolean;
BEGIN

SET search_path = public;
--Si no es hoja
esHoja :=(SELECT mod_estructuracomp.f_es_hoja($1));

  IF NOT esHoja THEN 
  --Actualizo el orden unico de la raiz
  PERFORM mod_estructuracomp.f_actualizar_ordenunico($1);
  
--Actualizo el cada hijo
  FOR hijos IN SELECT * FROM mod_estructuracomp.nom_filaestruc f WHERE f.idpadre=$1 ORDER BY f.orden
    LOOP
      EXIT WHEN hijos IS NULL;
	  --Si no es el mismo, para que no sea infinito
        IF hijos.idfila <> $1 THEN
         PERFORM mod_estructuracomp.f_actualizar_ordenunico_arbol(hijos.idfila);
        END IF;
     END LOOP;

   ELSE
 --Si es hoja solo actualizo su orden unico  
    PERFORM mod_estructuracomp.f_actualizar_ordenunico($1);
   END IF;
 
END
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_cambiar_orden_old (
  hijo numeric,
  paramorden numeric
)
RETURNS boolean AS
$body$
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
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_cancelar_proyecto (
  proyecto numeric
)
RETURNS boolean AS
$body$
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
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_copiar_estructura (
  idnodo numeric,
  idnodopadre numeric,
  proyecto numeric,
  cortar boolean
)
RETURNS boolean AS
$body$
DECLARE
  datosReales RECORD;
  datosNuevos RECORD;
  datos RECORD;
  nuevoId NUMERIC;
  nuevoOrden NUMERIC;
  nuevoPadre NUMERIC;
  idAnteriores NUMERIC[];
  idNuevos NUMERIC[];
  cantidad numeric = 0;
  cont integer ;
  contgeneral integer ;
  consulta text;
BEGIN
contgeneral:=1;

	SET search_path = mod_estructuracomp;


	SELECT * INTO datosReales FROM nom_filaestruc WHERE idfila = idnodo;
    
    --INSERTAR EL NODO A REUBICAR CON EL NUEVO ID Y ORDEN
    SELECT last_value  INTO nuevoId FROM mod_estructuracomp.sec_filaestruc_seq;
    SELECT MAX(orden) INTO nuevoOrden FROM nom_filaestruc WHERE idpadre = $2;
     IF nuevoOrden IS NULL THEN
           nuevoOrden=0;      
     END IF;
	nuevoId:=nuevoID+1;
	nuevoOrden:=nuevoOrden+1;

        idNuevos[contgeneral] := nuevoId;
        idAnteriores[contgeneral] := idnodo;

        IF(cortar) THEN
			INSERT INTO dat_filacortada
			VALUES (
			  nuevoId,
			  idnodo,
			  proyecto,
			  true
			);
		END IF;

	PERFORM f_nueva_fila(nuevoId,idnodopadre,datosReales.idconcepto,nuevoOrden,datosReales.fechafin,datosReales.dominiofila,datosReales.accesofila);	
	PERFORM f_duplicar_estructura(nuevoId, datosReales.idfila, datosReales.idconcepto, proyecto); 
    
    SELECT * INTO datosNuevos FROM nom_filaestruc WHERE idfila = nuevoId;
    
    -- INSERCION DE LOS NODOS RESTANTES HIJOS DEL QUE SE REUBICA     
    
    SELECT * INTO datosReales FROM nom_filaestruc WHERE idfila = idnodo;

	FOR datos IN (SELECT * FROM mod_estructuracomp.nom_filaestruc ff WHERE  ff.parent_path  operator (public.<@) datosReales.parent_path and ff.idfila<>datosReales.idfila and fechafin is null order by parent_path )
    LOOP
   
		SELECT last_value  INTO nuevoId FROM mod_estructuracomp.sec_filaestruc_seq;
		nuevoId:=nuevoId+1;
                contgeneral := contgeneral+1;
		idNuevos[contgeneral] := nuevoId;
		idAnteriores[contgeneral] := datos.idfila;
   

		IF(cortar) THEN
			INSERT INTO dat_filacortada
			VALUES (
			  nuevoId,
			  datos.idfila,
			  proyecto
			);
		END IF;

       cont :=1;
        LOOP
         EXIT WHEN idAnteriores[cont]= datos.idpadre;
        cont:=cont+1;
        END LOOP;
		
        nuevoPadre:= idNuevos[cont];

		PERFORM f_nueva_fila(nuevoId,nuevoPadre,datos.idconcepto,datos.orden,datos.fechafin,datos.dominiofila,datos.accesofila);
		PERFORM f_duplicar_estructura(nuevoId, datos.idfila, datos.idconcepto, proyecto);
	END LOOP;
	RETURN TRUE;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_deshacer_eliminar (
  proyecto numeric,
  lft numeric,
  rgt numeric
)
RETURNS boolean AS
$body$
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
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_duplicar_estructura (
  idnuevo numeric,
  idnodo numeric,
  concepto numeric,
  proyecto numeric
)
RETURNS boolean AS
$body$
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
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_eliminar_tree_fechafin (
  identificador numeric
)
RETURNS boolean AS
$body$
DECLARE
 rec record;
BEGIN
	SET search_path = 'mod_estructuracomp';	
	--Captura de los datos del elemento segun el identificador insertado	
	
	SELECT * INTO rec FROM nom_filaestruc WHERE idfila = $1;
        UPDATE nom_filaestruc SET fechafin = current_date WHERE parent_path operator(public.<@) rec.parent_path;
	--DELETE FROM nom_filaestruc WHERE parent_path operator(public.<@) rec.parent_path AND idfila in();
	
	RETURN true;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_eliminar_tree_fechafin_proyecto (
  identificador numeric,
  proyecto numeric
)
RETURNS boolean AS
$body$
DECLARE
 rec record;
BEGIN
	SET search_path = 'mod_estructuracomp';	
	--Captura de los datos del elemento segun el identificador insertado	
	
	SELECT * INTO rec FROM nom_filaestruc WHERE idfila = $1;
	
        UPDATE nom_filaestruc SET fechafin = current_date WHERE idfila = $1;
        DELETE FROM nom_filaestruc WHERE idfila = $1 AND idfila in ( SELECT idreferencia FROM mod_estructuracomp.dat_filacortada WHERE idproyecto=proyecto );
	
	
	RETURN true;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_merge_proyecto (
  ids numeric [],
  usser numeric
)
RETURNS boolean AS
$body$
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
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_mover_arbol (
  idnodo numeric,
  idnodopadreoriginal numeric,
  idnodopadrenuevo numeric,
  proyecto numeric
)
RETURNS boolean AS
$body$
declare

filas mod_estructuracomp.nom_filaestruc;
nuevoOrden NUMERIC;

BEGIN

--Si el preyecto es el real
 IF proyecto = 0  THEN
--Actualizo la fila con el nuevo idpadre
UPDATE mod_estructuracomp.nom_filaestruc  SET idpadre=idnodopadrenuevo  WHERE idfila=idnodo;

--Mando a actualizar el parent_path del arbol
PERFORM mod_estructuracomp.f_poner_parenth_path_arbol(idnodo);

--Obtengo el ultimo orden del nuevo arbol
nuevoOrden := (SELECT max(orden) FROM  mod_estructuracomp.nom_filaestruc WHERE idpadre=idnodopadrenuevo);

IF nuevoOrden IS NULL THEN
   nuevoOrden:=0;
END IF;

--Ultimo orden + 1
nuevoOrden:=nuevoOrden+1;

--Actualizo el orden del nodo dentro de ese arbol
UPDATE mod_estructuracomp.nom_filaestruc  SET orden=nuevoOrden  WHERE idfila=idnodo;

ELSE
--Si no es el preyecto real
PERFORM mod_estructuracomp.f_cortar_estructura(idnodo, idnodopadrenuevo, proyecto);

END IF;
  
 RETURN TRUE;

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_poner_en_vigor (
  proyecto numeric,
  usuario numeric
)
RETURNS boolean AS
$body$
DECLARE
  result boolean = true;
  datosReferencia record;
  valores record;
  dato record;
  referencia integer;
BEGIN
	SET search_path = 'mod_estructuracomp';
	SELECT idreferencia INTO referencia FROM dat_filacortada WHERE esraiz=true AND idproyecto = $1;

	-- ELIMINAR LAS ESTRUCTURAS MARCADAS PARA ELIMINACION ANTES DE CUALQUIER OTRO PROCESO
	-- PARA DISMINUIR EL RANGO DE CONSULTAS
	FOR valores IN (
			SELECT f.idfila, f.parent_path
			FROM nom_filaestruc f
			LEFT JOIN dat_estructura e ON (e.idestructura = f.idfila)
			LEFT JOIN dat_estructuraop op ON (op.idestructuraop = f.idfila)
			LEFT JOIN dat_cargo c ON (c.idcargo = f.idfila)
			LEFT JOIN dat_medio m ON (m.idmedio = f.idfila)
			WHERE (e.idproyecto  = $1 AND e.idestado  = 3) OR
			      (op.idproyecto = $1 AND op.idestado = 3) OR
			      (c.idproyecto  = $1 AND c.idestado  = 3) OR
			      (m.idproyecto  = $1 AND m.idestado  = 3)
			ORDER BY f.ordenunico ASC
		      )

	LOOP	

		PERFORM f_eliminar_tree_fechafin_proyecto(valores.idfila,$1);
	
	END LOOP;


	-- INSERTADOS Y MODIFICADOS DE DAT_ESTRUCTURA
	FOR valores IN (SELECT * FROM dat_estructura WHERE idproyecto = $1 AND idestado <> 0)
	LOOP
		IF (valores.idestado = 1) THEN
			SELECT * INTO datosReferencia FROM dat_filacortada WHERE idfila = valores.idestructura AND idproyecto = $1;
			IF(datosReferencia.idfila IS NOT NULL) THEN
			
				UPDATE nom_filaestruc SET idfila = datosReferencia.idreferencia WHERE idfila = valores.idestructura;
				UPDATE dat_estructura SET idestructura = datosReferencia.idreferencia WHERE idestructura = valores.idestructura;

				DELETE FROM dat_filacortada
				WHERE idfila = valores.idestructura AND idproyecto = $1;
			END IF;

                       UPDATE nom_filaestruc SET fechainicio = date('now') WHERE idfila = valores.idestructura and idfila <> datosReferencia.idreferencia;
                       
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
			
			UPDATE nom_filaestruc SET idfila = datosReferencia.idreferencia WHERE idfila = valores.idestructuraop;
		        UPDATE dat_estructuraop SET idestructuraop = datosReferencia.idreferencia WHERE idestructuraop = valores.idestructuraop;

				DELETE FROM dat_filacortada
				WHERE idfila = valores.idestructuraop AND idproyecto = $1;
			END IF;

			UPDATE nom_filaestruc SET fechainicio = date('now') WHERE idfila = valores.idestructuraop and idfila <> datosReferencia.idreferencia;

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
			
				UPDATE nom_filaestruc SET idfila = datosReferencia.idreferencia WHERE idfila = valores.idmedio;
				UPDATE dat_medio SET idmedio = datosReferencia.idreferencia WHERE idmedio = valores.idmedio;

				DELETE FROM dat_filacortada
				WHERE idfila = valores.idmedio AND idproyecto = $1;
			END IF;

			UPDATE nom_filaestruc SET fechainicio = date('now') WHERE idfila = valores.idmedio AND idfila <> datosReferencia.idreferencia;

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

	FOR valores IN (SELECT * FROM dat_cargo WHERE idproyecto = $1 AND idestado <> 0)
	LOOP
		IF (valores.idestado = 1) THEN
			SELECT * INTO datosReferencia FROM dat_filacortada WHERE idfila = valores.idcargo AND idproyecto = $1;
			IF(datosReferencia.idfila IS NOT NULL) THEN
			
				UPDATE nom_filaestruc SET idfila = datosReferencia.idreferencia WHERE idfila = valores.idcargo;
				UPDATE dat_cargo SET idcargo = datosReferencia.idreferencia WHERE idcargo = valores.idcargo;
				UPDATE dat_cargocivil SET idcargo = datosReferencia.idreferencia WHERE idcargo = valores.idcargo;
				UPDATE dat_cargomilitar SET idcargo = datosReferencia.idreferencia WHERE idcargo = valores.idcargo;

				DELETE FROM dat_filacortada
				WHERE idfila = valores.idcargo AND idproyecto = $1;
			END IF;

			UPDATE nom_filaestruc SET fechainicio = date('now') WHERE idfila = valores.idcargo AND idfila <> datosReferencia.idreferencia;

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

	PERFORM mod_estructuracomp.f_poner_parenth_path_arbol(referencia);

	RETURN TRUE;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_poner_orden_arbol (
  idarbol numeric
)
RETURNS void AS
$body$
DECLARE
    hijos mod_estructuracomp.nom_filaestruc;
    padre mod_estructuracomp.nom_filaestruc;
    contador NUMERIC;
BEGIN

SET search_path = public;
contador=1;

  
  FOR hijos IN SELECT * FROM mod_estructuracomp.nom_filaestruc f WHERE f.idpadre=$1 AND f.idpadre<>f.idfila ORDER BY f.orden
    LOOP
      EXIT WHEN hijos IS NULL;
	  --Si no es el mismo, para que no sea infinito
        IF hijos.idfila <> $1 THEN
         UPDATE mod_estructuracomp.nom_filaestruc  SET orden=contador  WHERE idfila=hijos.idfila;
         PERFORM mod_estructuracomp.f_poner_orden_arbol(hijos.idfila);
         contador=contador+1;
        END IF;
     END LOOP;

 
 
END
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_sustituiryconvertir (
  campo varchar
)
RETURNS varchar AS
$body$
BEGIN
     RETURN lower(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace
                (replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace
                (replace(replace(trim(trim(trim(trim(trim($1)))))
                ,'''', ' '),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U'),'Ñ', 'N'),'Ü', 'U')
                ,'À', 'A'),'È', 'E'),'Ì', 'I'),'Ò', 'O'),'Ù', 'U')
                ,'á', 'a'),'é', 'e'),'í', 'i'),'ó', 'o'),'ú', 'u')
                ,'à', 'a'),'è', 'e'),'ì', 'i'),'ò', 'o'),'ù', 'u'),'ü', 'u'),'ñ', 'n'));
END;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 5;

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_actualizar_orden_nom_filaestruc (
)
RETURNS trigger AS
$body$
DECLARE
BEGIN

  IF (NEW.orden <> OLD.orden) THEN 
    IF (NEW.idfila <> OLD.idfila) THEN
      PERFORM  mod_estructuracomp.f_actualizar_ordenunico_arbol(OLD.idfila);
    ELSE
      PERFORM  mod_estructuracomp.f_actualizar_ordenunico_arbol(NEW.idfila);
    END IF;
  END IF;

 RETURN NULL;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_insertar_fila (
)
RETURNS trigger AS
$body$
DECLARE
        padre_rec mod_estructuracomp.nom_filaestruc;
        path public.LTREE;
        miorden public.LTREE;
        miordennew varchar;
     BEGIN

        IF TG_OP = 'INSERT' THEN
				IF NEW.idpadre = null THEN
                  NEW.idpadre = NEW.idfila;
				  END IF;
               IF NEW.idpadre = NEW.idfila THEN
                  NEW.parent_path = (cast(NEW.idfila as varchar))::public.ltree;
                  
                  /*aqui*/ IF NEW.orden IS NOT NULL THEN
                        NEW.ordenunico = (SELECT mod_estructuracomp.f_dame_letra_dado_numero(NEW.orden))::public.ltree;
                         ELSE
                         RAISE EXCEPTION 'El orden no puede ser nulo';
                         END IF; /*aqui*/ 
                 
               END IF;
        	   IF NEW.idpadre <> NEW.idfila THEN
        			 select * into  padre_rec FROM mod_estructuracomp.nom_filaestruc WHERE idfila = NEW.idpadre;
                        SELECT parent_path FROM mod_estructuracomp.nom_filaestruc WHERE idfila = padre_rec.idfila INTO path;
                        SELECT ordenunico FROM mod_estructuracomp.nom_filaestruc WHERE idfila = padre_rec.idfila INTO miorden;

            		 IF path IS NOT NULL THEN
	               		NEW.parent_path = public.text2ltree(public.ltree2text(path)||'.'||NEW.idfila);
                         END IF;

                         IF miorden IS NOT NULL THEN
                         /*aqui*/  IF NEW.orden IS NOT NULL THEN
                         miordennew := (SELECT mod_estructuracomp.f_dame_letra_dado_numero(NEW.orden));
                         ELSE
                         RAISE EXCEPTION 'El orden no puede ser nulo';
                         END IF; /*aqui*/ 
	               		 NEW.ordenunico = public.text2ltree(public.ltree2text(miorden)||'.'||miordennew);
                         END IF;

         	   END IF;
         	   
         	   NEW.fechainicio = date('now');
        END IF;
        
	EXECUTE 'ALTER sequence mod_estructuracomp.sec_filaestruc_seq RESTART ' ||New.idfila + 1;

	RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_conceptocondicion (
)
RETURNS trigger AS
$body$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
	SELECT MAX(idconceptocondicion) INTO max_id FROM mod_estructuracomp.nom_conceptocondicion;
	SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_conceptocondicion_seq;
	
	RAISE NOTICE 'valor max_id %',max_id;
	RAISE NOTICE 'valor sec_cont %',sec_cont;	

	IF(sec_cont <> max_id)THEN
		EXECUTE 'ALTER sequence mod_estructuracomp.sec_conceptocondicion_seq RESTART ' ||max_id+1;
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_update_parent_path (
)
RETURNS trigger AS
$body$
    DECLARE
        path public.LTREE;
    BEGIN
        --SET search_path = 'mod_estructuracomp';
        IF NEW.idpadre = NEW.idhijo THEN
            NEW.parent_path = (cast(NEW.idhijo as varchar))::public.ltree;
            --NEW.parent_path = (NEW.idfila)::ltree;
        ELSEIF TG_OP = 'INSERT' OR OLD.idpadre != NEW.idpadre THEN
            SELECT parent_path FROM mod_estructuracomp.dat_subordinacion WHERE idhijo = NEW.idpadre INTO path;
            
            IF path IS NULL THEN
                RAISE EXCEPTION 'idpadre invalido %', NEW.idpadre;
            END IF;
            NEW.parent_path = public.text2ltree(public.ltree2text(path)||'.'||NEW.idhijo);
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

CREATE TABLE mod_estructuracomp.dat_configpuertos (
  idconfigpuertos INTEGER DEFAULT nextval('mod_estructuracomp.dat_configpuertos_idconfigpuertos_seq'::regclass) NOT NULL,
  idpadrefijo INTEGER,
  CONSTRAINT dat_configpuertos_pkey PRIMARY KEY(idconfigpuertos)
) 
WITH (oids = false);

ALTER SEQUENCE mod_estructuracomp.dat_configpuertos_idconfigpuertos_seq OWNED BY mod_estructuracomp.dat_configpuertos.idconfigpuertos;

CREATE TABLE mod_estructuracomp.nom_cargofacultado (
  idcargofacultado NUMERIC(19,0) DEFAULT nextval('mod_estructuracomp.sec_cargofacultado_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  abreviatura VARCHAR(60),
  actual NUMERIC(1,0),
  visible NUMERIC(1,0),
  fechainicio DATE DEFAULT 'now'::text::date,
  fechafin DATE,
  CONSTRAINT pk_cargofacultado PRIMARY KEY(idcargofacultado)
) 
WITH (oids = false);

COMMENT ON CONSTRAINT pk_cargofacultado ON mod_estructuracomp.nom_cargofacultado
IS 'Identificador único para cada tupla de la tabla nom_cargofacultado.';

CREATE TABLE mod_estructuracomp.nom_nivelcargo (
  idnivelcargo NUMERIC(9,0) DEFAULT nextval('mod_estructuracomp.sec_nivelcargo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  abreviatura VARCHAR(60),
  actual NUMERIC(1,0) DEFAULT 1 NOT NULL,
  visible NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT nom_nivelcargo_pkey PRIMARY KEY(idnivelcargo)
) 
WITH (oids = false);

CREATE TABLE mod_estructuracomp.nom_sector (
  idsector NUMERIC(9,0) DEFAULT nextval('mod_estructuracomp.sec_sector_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  abreviatura VARCHAR(60),
  actual NUMERIC(1,0) DEFAULT 1 NOT NULL,
  visible NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT nom_sector_pkey PRIMARY KEY(idsector)
) 
WITH (oids = false);

ALTER TABLE mod_estructuracomp.nom_cargo ADD COLUMN facultado numeric(1,0);
UPDATE mod_estructuracomp.nom_cargo SET facultado=0;
ALTER TABLE mod_estructuracomp.nom_cargo ALTER COLUMN facultado SET NOT NULL;
ALTER TABLE mod_estructuracomp.nom_cargo ALTER COLUMN facultado SET DEFAULT 0;

ALTER TABLE mod_estructuracomp.dat_filacortada
  ADD COLUMN esraiz BOOLEAN DEFAULT false;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ALTER COLUMN idfila SET DEFAULT nextval('mod_estructuracomp.sec_filaestruc_seq'::regclass);

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ALTER COLUMN idpadre DROP NOT NULL;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ALTER COLUMN oid DROP DEFAULT;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ALTER COLUMN oid TYPE OID;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ALTER COLUMN oid SET DEFAULT 0;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ADD COLUMN fechainicio DATE;

ALTER TABLE mod_estructuracomp.nom_organo
  SET WITH OIDS;

ALTER TABLE mod_estructuracomp.nom_organo
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

COMMENT ON CONSTRAINT fk_filaestruc_subordinacion_idhijo ON mod_estructuracomp.dat_subordinacion
IS 'Limitación referencial entre la  tabla (dat_subordinacion) y la tabla (nom_filaestruc) mediante el atributo (idhijo).';

COMMENT ON CONSTRAINT fk_filaestruc_subordinacion_idpadre ON mod_estructuracomp.dat_subordinacion
IS 'Limitación referencial entre la  tabla (dat_subordinacion) y la tabla (nom_filaestruc) mediante el atributo (idpadre).';

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD COLUMN idsector NUMERIC(9,0);

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD COLUMN decisorio NUMERIC(1,0);

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD COLUMN idnivelcargo NUMERIC(9,0);

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD COLUMN idfacultado NUMERIC(9,0);

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN idicono NUMERIC(100,0) DEFAULT 0;

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.idicono
IS 'Identificador de la tabla nom_icono';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN correo VARCHAR(50);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.correo
IS 'Dirección de correo.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN objetosocial VARCHAR(255);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.objetosocial
IS 'Objeto social.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN fax VARCHAR(100);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.fax
IS 'Fax.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN iddpt NUMERIC(19,0);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.iddpt
IS 'Identificador de instrucción política territorial.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN telefono VARCHAR(100);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.telefono
IS 'Número de teléfono.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN funcioneslegales VARCHAR(255);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.funcioneslegales
IS 'Funciones legales.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN direccion VARCHAR(500);

COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.direccion
IS 'Dirección.';

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ADD COLUMN codigonit VARCHAR(255);

COMMENT ON COLUMN mod_estructuracomp.dat_estructura.idicono
IS 'Identificador de la tabla nom_icono';

ALTER TABLE mod_estructuracomp.dat_estructura
  ALTER COLUMN idicono DROP DEFAULT;

ALTER TABLE mod_estructuracomp.dat_estructura
  ALTER COLUMN idicono TYPE NUMERIC(100,0);

ALTER TABLE mod_estructuracomp.dat_estructura
  ALTER COLUMN idicono SET DEFAULT 0;

ALTER TABLE mod_estructuracomp.dat_estructura ADD COLUMN idsector numeric(1,0);
UPDATE mod_estructuracomp.dat_estructura SET idsector=0;
ALTER TABLE mod_estructuracomp.dat_estructura ALTER COLUMN idsector SET NOT NULL;
ALTER TABLE mod_estructuracomp.dat_estructura ALTER COLUMN idsector SET DEFAULT 0;
  
ALTER TABLE mod_estructuracomp.dat_estructura
  ADD COLUMN codigonit VARCHAR(255);

ALTER TABLE mod_estructuracomp.nom_grado
  ADD CONSTRAINT fk_grado_icono FOREIGN KEY (idicono)
    REFERENCES mod_estructuracomp.nom_icono(idicono)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_grado_icono ON mod_estructuracomp.nom_grado
IS 'Limitación referencial entre la  tabla (nom_grado) y la tabla (nom_icono) mediante el atributo (idicono).';

ALTER TABLE mod_estructuracomp.nom_grado
  ADD CONSTRAINT fk_grado_categoriamilitar FOREIGN KEY (idcategoriamilitar)
    REFERENCES mod_estructuracomp.nom_categoriamilitar(idcategoriamilitar)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_grado_categoriamilitar ON mod_estructuracomp.nom_grado
IS 'Limitación referencial entre la  tabla (nom_grado) y la tabla (nom_categoriamilitar) mediante el atributo (idcategoriamilitar).';

ALTER TABLE mod_estructuracomp.nom_firma
  ADD CONSTRAINT nom_firma_fk1 FOREIGN KEY (iddominio)
    REFERENCES mod_estructuracomp.nom_dominio(iddominio)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_estructuracomp.nom_firma
  ADD CONSTRAINT nom_firma_fk FOREIGN KEY (idnomcargo)
    REFERENCES mod_estructuracomp.nom_cargo(idnomcargo)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ADD CONSTRAINT fk_filaestruc_filaestruc_idpadre FOREIGN KEY (idpadre)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_filaestruc_filaestruc_idpadre ON mod_estructuracomp.nom_filaestruc
IS 'Limitación referencial entre la  tabla (nom_concepto) y la tabla (nom_filaestruc) mediante el atributo (idpadre).';

ALTER TABLE mod_estructuracomp.nom_dominio
  ADD CONSTRAINT fk_dominio_dominio_idpadre FOREIGN KEY (idpadre)
    REFERENCES mod_estructuracomp.nom_dominio(iddominio)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_dominio_dominio_idpadre ON mod_estructuracomp.nom_dominio
IS 'Limitación referencial entre la  tabla nom_dominio y la tabla nom_dominio mediante el atributo iddominio. ';

ALTER TABLE mod_estructuracomp.nom_condicion
  ADD CONSTRAINT fk_grupocomplejidad_condicion FOREIGN KEY (idgrupocomplejidad)
    REFERENCES mod_estructuracomp.nom_grupocomplejidad(idgrupocomplejidad)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_grupocomplejidad_condicion ON mod_estructuracomp.nom_condicion
IS 'Limitación referencial entre la  tabla nom_grupocomplejidad y la tabla nom_condicion mediante el atributo idgrupocomplejidad.';

ALTER TABLE mod_estructuracomp.nom_condicion
  ADD CONSTRAINT fk_cargo_condicion FOREIGN KEY (idnomcargo)
    REFERENCES mod_estructuracomp.nom_cargo(idnomcargo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_cargo_condicion ON mod_estructuracomp.nom_condicion
IS 'Limitación referencial entre la  tabla �nom_cargo� y la tabla �nom_condicion� mediante el atributo �idnomcargo�.';

ALTER TABLE mod_estructuracomp.nom_conceptopropiedad
  ADD CONSTRAINT fk_propiedad_conceptoconceptopropiedad FOREIGN KEY (idpropiedad)
    REFERENCES mod_estructuracomp.nom_propiedad(idpropiedad)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_propiedad_conceptoconceptopropiedad ON mod_estructuracomp.nom_conceptopropiedad
IS 'Limitación referencial entre la  tabla (nom_propiedad) y la tabla (nom_conceptopropiedad) mediante el atributo (idpropiedad).';

ALTER TABLE mod_estructuracomp.nom_conceptopropiedad
  ADD CONSTRAINT fk_concepto_conceptoconceptopropiedad FOREIGN KEY (idconcepto)
    REFERENCES mod_estructuracomp.nom_concepto(idconcepto)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_concepto_conceptoconceptopropiedad ON mod_estructuracomp.nom_conceptopropiedad
IS 'Limitación referencial entre la  tabla (nom_concepto) y la tabla (nom_conceptopropiedad) mediante el atributo (idconcepto).';

ALTER TABLE mod_estructuracomp.nom_concepto
  ADD CONSTRAINT fk_concepto_icono FOREIGN KEY (idicono)
    REFERENCES mod_estructuracomp.nom_icono(idicono)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_concepto_icono ON mod_estructuracomp.nom_concepto
IS 'Limitación referencial entre la  tabla (nom_concepto) y la tabla (nom_icono) mediante el atributo (idicono).';

ALTER TABLE mod_estructuracomp.nom_categocup
  ADD CONSTRAINT fk_categoria_categocup FOREIGN KEY (idcategoria)
    REFERENCES mod_estructuracomp.nom_categoria(idcategoria)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_categoria_categocup ON mod_estructuracomp.nom_categocup
IS 'Limitación referencial entre la  tabla (nom_categoria) y la tabla (nom_categocup) mediante el atributo (idcategoria).';

ALTER TABLE mod_estructuracomp.nom_cargo
  ADD CONSTRAINT fk_grupocomplejidad_nomcargo FOREIGN KEY (idgrupocomplejidad)
    REFERENCES mod_estructuracomp.nom_grupocomplejidad(idgrupocomplejidad)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_grupocomplejidad_nomcargo ON mod_estructuracomp.nom_cargo
IS 'Limitación referencial entre la  tabla (nom_grupocomplejidad) y la tabla (nom_cargo) mediante el atributo (idgrupocomplejidad).';

ALTER TABLE mod_estructuracomp.dat_usuarioconcepto
  ADD CONSTRAINT fk_concepto_usuarioconcepto FOREIGN KEY (idconcepto)
    REFERENCES mod_estructuracomp.nom_concepto(idconcepto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_concepto_usuarioconcepto ON mod_estructuracomp.dat_usuarioconcepto
IS 'Limitación referencial entre la  tabla (nom_concepto) y la tabla (dat_usuarioconcepto) mediante el atributo (idconcepto).';

ALTER TABLE mod_estructuracomp.dat_proyectousuario
  ADD CONSTRAINT fk_proyecto_proyectousuario FOREIGN KEY (idproyecto)
    REFERENCES mod_estructuracomp.dat_proyecto(idproyecto)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_proyecto_proyectousuario ON mod_estructuracomp.dat_proyectousuario
IS 'Limitación referencial entre la tabla (dat_proyectousuario) y la tabla (dat_proyecto) mediante el atributo (idproyecto).';

ALTER TABLE mod_estructuracomp.dat_medio
  ADD CONSTRAINT fk_medio_icono FOREIGN KEY (idicono)
    REFERENCES mod_estructuracomp.nom_icono(idicono)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_medio_icono ON mod_estructuracomp.dat_medio
IS 'Limitación referencial entre la  tabla "dat_medio" y la tabla "nom_icono" mediante el atributo (idicono).';

ALTER TABLE mod_estructuracomp.dat_graficausuario
  ADD CONSTRAINT fk_grafica_graficausuario FOREIGN KEY (idgrafica)
    REFERENCES mod_estructuracomp.dat_grafica(idgrafica)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_grafica_graficausuario ON mod_estructuracomp.dat_graficausuario
IS 'Limitación referencial entre la  tabla (dat_grafica) y la tabla (dat_graficausuario) mediante el atributo (idgrafica).';

ALTER TABLE mod_estructuracomp.dat_estructura
  ADD CONSTRAINT fk_estructura_icono FOREIGN KEY (idicono)
    REFERENCES mod_estructuracomp.nom_icono(idicono)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_estructura_icono ON mod_estructuracomp.dat_estructura
IS 'Limitación referencial entre la  tabla "dat_estructura" y la tabla "nom_icono" mediante el atributo (idicono).';

ALTER TABLE mod_estructuracomp.dat_conceptocondicion
  ADD CONSTRAINT fk_usuarioconcepto_conceptocondicion FOREIGN KEY (idusuarioconcepto)
    REFERENCES mod_estructuracomp.dat_usuarioconcepto(idusuarioconcepto)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_usuarioconcepto_conceptocondicion ON mod_estructuracomp.dat_conceptocondicion
IS 'Limitación referencial entre la  tabla (dat_usuarioconcepto) y la tabla (dat_conceptocondicion) mediante el atributo (idusuarioconcepto).';

ALTER TABLE mod_estructuracomp.dat_conceptocondicion
  ADD CONSTRAINT fk_organo_conceptocondicion FOREIGN KEY (idorgano, idconcepto)
    REFERENCES mod_estructuracomp.nom_organo(idorgano, idconcepto)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_organo_conceptocondicion ON mod_estructuracomp.dat_conceptocondicion
IS 'Limitación referencial entre la  tabla (nom_organo) y la tabla (nom_conceptocondicion) mediante el atributo (idorgano)';

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT fk_salario_datcargo FOREIGN KEY (idsalario)
    REFERENCES mod_estructuracomp.nom_salario(idsalario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_salario_datcargo ON mod_estructuracomp.dat_cargo
IS 'Limitación referencial entre la  tabla (dat_cargo) y la tabla (nom_salario) mediante el atributo (idsalario).';

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT fk_nomcargo_datcargo FOREIGN KEY (idnomcargo)
    REFERENCES mod_estructuracomp.nom_cargo(idnomcargo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_nomcargo_datcargo ON mod_estructuracomp.dat_cargo
IS 'Limitación referencial entre la  tabla (dat_cargo) y la tabla (nom_cargo) mediante el atributo (idnomcargo).';

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT dat_cargo_fk2 FOREIGN KEY (idfacultado)
    REFERENCES mod_estructuracomp.nom_cargofacultado(idcargofacultado)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT dat_cargo_fk1 FOREIGN KEY (idnivelcargo)
    REFERENCES mod_estructuracomp.nom_nivelcargo(idnivelcargo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT dat_cargo_fk FOREIGN KEY (idsector)
    REFERENCES mod_estructuracomp.nom_sector(idsector)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

CREATE TRIGGER t_reiniciar_secuencia_conceptocondicion
  AFTER DELETE 
  ON mod_estructuracomp.dat_conceptocondicion
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_estructuracomp.ft_reiniciar_secuencia_conceptocondicion();