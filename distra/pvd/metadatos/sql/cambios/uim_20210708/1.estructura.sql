CREATE SEQUENCE mod_estructuracomp.dat_configpuertos_idconfigpuertos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.dat_configpuertos_idconfigpuertos_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_configpuertos".';

CREATE SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargofacultado".';

CREATE SEQUENCE mod_estructuracomp.sec_firma_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 99999999 START 6
  CACHE 1;

ALTER SEQUENCE mod_estructuracomp.sec_firma_seq RESTART WITH 14;

COMMENT ON SEQUENCE mod_estructuracomp.sec_firma_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_firma".';

CREATE SEQUENCE mod_estructuracomp.sec_nivelcargo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 4
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.sec_nivelcargo_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_nivelcargo".';

CREATE SEQUENCE mod_estructuracomp.sec_normajuridica_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999 START 4
  CACHE 1;

ALTER SEQUENCE mod_estructuracomp.sec_normajuridica_seq RESTART WITH 18;

COMMENT ON SEQUENCE mod_estructuracomp.sec_normajuridica_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_normajuridica".';

CREATE SEQUENCE mod_estructuracomp.sec_sector_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 3
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.sec_sector_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_sector".';

DROP TRIGGER parent_path_tgr ON mod_estructuracomp.nom_filaestruc;

ALTER TABLE mod_estructuracomp.dat_usuarioconcepto
  DROP CONSTRAINT fk_usuario_usuarioconcepto RESTRICT;

DROP INDEX mod_estructuracomp.parent_path_idx;

DROP INDEX mod_estructuracomp.idx_rgt_filaestruc;

DROP INDEX mod_estructuracomp.idx_lft_filaestruc;

COMMENT ON SCHEMA mod_estructuracomp
IS 'Almacena toda la información de estructura y composición. Versión 2. (RRHH)';

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_actualizar_actual_visible (
)
RETURNS boolean AS
$body$
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
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_estructuracomp.f_actualizar_actual_visible ()
  OWNER TO zeolides;

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

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_actualizar_parent_path_completo (
)
RETURNS boolean AS
$body$
DECLARE
    primerasfilas mod_estructuracomp.nom_filaestruc;
    padre mod_estructuracomp.nom_filaestruc;
    ordenuniconew public.ltree;
    ordenltree public.ltree;
BEGIN

--Todas las filas que son raices
 FOR primerasfilas IN SELECT * FROM mod_estructuracomp.nom_filaestruc  WHERE idfila=idpadre ORDER BY orden
  LOOP
      EXIT WHEN primerasfilas IS NULL;
         PERFORM mod_estructuracomp.f_poner_parenth_path_arbol(primerasfilas.idfila);
   END LOOP;

RETURN true;

END
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_cambiar_orden (
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
  parent_Padre public.ltree;

BEGIN
    SET search_path = mod_estructuracomp;

  SELECT * INTO datosHijo FROM mod_estructuracomp.nom_filaestruc WHERE idfila = hijo;
  padre:= datosHijo.idpadre;

  SELECT * INTO datosPadre FROM mod_estructuracomp.nom_filaestruc WHERE idfila = padre;
  -- RANGO DEL Padre

  parent_Padre:=  datosPadre.parent_path;

  IF paramOrden <> 0 THEN
    UPDATE mod_estructuracomp.nom_filaestruc SET orden = paramOrden, nivel=paramOrden WHERE idfila = hijo;

    IF datosPadre.idfila = hijo THEN
      UPDATE mod_estructuracomp.nom_filaestruc SET orden = orden + 1, nivel = orden+1 WHERE idfila <> hijo AND idpadre = idfila AND orden >= paramOrden;
    ELSE
      UPDATE mod_estructuracomp.nom_filaestruc SET orden = orden + 1, nivel = orden+1 WHERE idfila <> hijo AND idpadre = padre AND orden >= paramOrden;
    END IF;
      ELSE
    UPDATE mod_estructuracomp.nom_filaestruc SET orden = ((SELECT MAX(orden) FROM mod_estructuracomp.nom_filaestruc WHERE idpadre = padre)+1) WHERE idfila = hijo;
    UPDATE mod_estructuracomp.nom_filaestruc SET nivel = orden WHERE idfila = hijo;
  END IF;

  IF datosPadre.idfila = hijo THEN
    FOR datos IN (SELECT * FROM mod_estructuracomp.nom_filaestruc fila WHERE idfila = idpadre AND orden >= paramOrden and fechafin is NULL) LOOP

      parent_Padre:= datos.parent_path;
      Update mod_estructuracomp.nom_filaestruc ct
      SET nivel =
        ((
          SELECT CONCAT(fila.nivel,ct.orden)
          FROM mod_estructuracomp.nom_filaestruc fila
          WHERE fila.idfila = ct.idpadre
         )::NUMERIC
        )
      WHERE     ct.parent_path   operator(public.<@) parent_Padre;
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
    WHERE  ct.parent_path   operator(public.<@) parent_Padre;
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_copiar_estructura (
  idnodo numeric,
  idnodopadre numeric,
  proyecto numeric,
  cortar boolean,
  p_codigo varchar,
  p_denom varchar
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
  cantidad numeric = 0;
  consulta text;
BEGIN
    SET search_path = mod_estructuracomp;
    SELECT * INTO datosReales FROM nom_filaestruc WHERE idfila = idnodo;
   
    --INSERTAR EL NODO A REUBICAR CON EL NUEVO ID Y ORDEN
    SELECT last_value  INTO nuevoId FROM mod_estructuracomp.sec_filaestruc_seq;
    SELECT MAX(orden) INTO nuevoOrden FROM nom_filaestruc WHERE idpadre = $2;
    nuevoId:=nuevoID+1;
    nuevoOrden:=nuevoOrden+1;
    idAnteriores [idnodo] := nuevoId;
    PERFORM f_nueva_fila(nuevoId,idnodopadre,datosReales.idconcepto,nuevoOrden,datosReales.fechafin,datosReales.dominiofila,datosReales.accesofila);   
    PERFORM f_duplicar_estructura(nuevoId, datosReales.idfila, datosReales.idconcepto, proyecto,p_codigo, p_denom);
   
    SELECT * INTO datosNuevos FROM nom_filaestruc WHERE idfila = nuevoId;
   
    -- INSERCION DE LOS NODOS RESTANTES HIJOS DEL QUE SE REUBICA    
   
    SELECT * INTO datosReales FROM nom_filaestruc WHERE idfila = idnodo;
    FOR datos IN (SELECT * FROM mod_estructuracomp.nom_filaestruc ff WHERE  ff.parent_path  operator (public.<@) datosReales.parent_path and ff.idfila<>datosReales.idfila and fechafin is null order by parent_path )
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
        PERFORM f_nueva_fila(nuevoId,nuevoPadre,datos.idconcepto,datos.orden,datos.fechafin,datos.dominiofila,datos.accesofila);
        PERFORM f_duplicar_estructura(nuevoId, datos.idfila, datos.idconcepto, proyecto,p_codigo,p_denom);
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_cortar_estructura (
  idnodo numeric,
  idnodopadre numeric,
  proyecto numeric
)
RETURNS boolean AS
$body$
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
      FOR datos IN (SELECT * FROM nom_filaestruc WHERE parent_path operator (public.<@)  datosReales.parent_path ORDER BY datosReales)
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
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_dame_letra_dado_numero (
  numero numeric
)
RETURNS varchar AS
$body$
DECLARE
    letra varchar;
    cantLetra numeric;
    posLetra numeric;
    letras varchar[];
    letraFinal varchar;
BEGIN

   IF $1= 0 THEN
     RAISE EXCEPTION 'El orden no puede ser cero';
    END IF;

--26 letras
letras:='{a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z}';

cantLetra := ( SELECT trunc($1/26,0) );
posLetra := ( SELECT $1%26);



letraFinal :='';
    LOOP
      EXIT WHEN cantLetra=0;
       letraFinal := letraFinal || 'z';
       cantLetra := cantLetra-1;
     END LOOP;

     IF posLetra <> 0 THEN
     letraFinal := letraFinal || letras[posLetra];
     END IF;

    return letraFinal;

END
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_deshacer_eliminar (
  proyecto numeric,
  camino public.ltree
)
RETURNS boolean AS
$body$
DECLARE
 datosReales record;
 datos record;
BEGIN
  SET search_path = 'mod_estructuracomp';
  FOR datos IN (SELECT * FROM nom_filaestruc as f WHERE ((f.parent_path operator (public.<@) $2)))
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
        PERFORM f_deshacer_proyecto(datosReales.idfila, $1, 1, datos.idconcepto,true);
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_deshacer_proyecto (
  identificador numeric,
  proyecto numeric,
  estado numeric,
  concepto numeric,
  cortar boolean
)
RETURNS boolean AS
$body$
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
        PERFORM f_deshacer_eliminar(proyecto, datos.parent_path);
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
        SELECT parent_path INTO rec
        FROM nom_filaestruc f
        INNER JOIN dat_estructura e ON (f.idfila = e.idestructura)
        WHERE (f.idfila = $1 AND e.idproyecto = $2);

        PERFORM f_deshacer_eliminar($2, rec.parent_path);
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
            SELECT parent_path INTO rec
            FROM nom_filaestruc f
            INNER JOIN dat_cargo e ON (f.idfila = e.idcargo)
            WHERE (f.idfila = $1 AND e.idproyecto = $2);

            PERFORM f_deshacer_eliminar($2, rec.parent_path);
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
            SELECT parent_path INTO rec
            FROM nom_filaestruc f
            INNER JOIN dat_medio e ON (f.idfila = e.idmedio)
            WHERE (e.idmedio = $1 AND e.idproyecto = $2);

            PERFORM f_deshacer_eliminar($2, rec.parent_path);
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
            SELECT parent_path INTO rec
            FROM nom_filaestruc f
            INNER JOIN dat_estructuraop e ON (f.idfila = e.idestructuraop)
            WHERE (f.idfila = $1 AND e.idproyecto = $2);

            PERFORM f_deshacer_eliminar($2, rec.parent_path);
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_duplicar_estructura (
  idnuevo numeric,
  idnodo numeric,
  concepto numeric,
  proyecto numeric,
  p_codigo varchar,
  p_denom varchar
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
                      (SELECT(COALESCE(p_denom, datosReales.denominacion))),
                      --p_denom/*datosReales.denominacion*/,
                      datosReales.abreviatura,
                      datosReales.idproyecto,
                      (SELECT(COALESCE(p_codigo, datosReales.codigo))),
                      --p_codigo/*datosReales.codigo*/,
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_eliminar_por_proyecto (
  identificador numeric,
  proyecto numeric
)
RETURNS boolean AS
$body$
  DECLARE
    rec      RECORD;
    datos    RECORD;
    valores  RECORD;
    temporal RECORD;
  BEGIN
    SET search_path = 'mod_estructuracomp';
    SELECT parent_path INTO rec FROM nom_filaestruc WHERE idfila = $1;

    FOR datos IN (SELECT * FROM nom_filaestruc WHERE parent_path operator(public.<@) rec.parent_path ) LOOP
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
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_eliminar_tree (
  table_name varchar,
  campo varchar,
  identificador numeric
)
RETURNS boolean AS
$body$
DECLARE
 rec record;
 max_id numeric = 0;
 sec_cont numeric = 0;
BEGIN
  SET search_path = 'mod_estructuracomp';
  --Captura de los datos del elemento segun el identificador insertado

  EXECUTE 'SELECT * FROM '||$1||' WHERE '||$2||'='||$3 INTO rec;

  --Eliminacion del elemento requerido (CASCADE)
  EXECUTE 'DELETE FROM '||$1||' WHERE '||$2||'='||$3;

  --Reordenar los izquierdos y derechos del arbol
      SELECT MAX(idfila) INTO max_id FROM mod_estructuracomp.nom_filaestruc;
  SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_filaestruc_seq;
  IF(sec_cont <> max_id)THEN
    EXECUTE 'ALTER sequence mod_estructuracomp.sec_filaestruc_seq RESTART ' ||max_id + 1;
  END IF;
  RETURN true;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_eliminar_tree (
  identificador numeric
)
RETURNS boolean AS
$body$
DECLARE
 rec record;
BEGIN
  SET search_path = 'mod_estructuracomp'; 
  --Captura de los datos del elemento segun el identificador insertado  
  
  SELECT * INTO rec FROM nom_filaestruc WHERE idfila = identificador;

  --Eliminacion del elemento requerido (CASCADE)
  DELETE FROM nom_filaestruc WHERE idfila = identificador;

  --Reordenar los izquierdos y derechos del arbol
  IF ((rec.rgt - rec.lft ) = 1)THEN --Si es HOJA
    --Paso 1 Decrementar los izquierdos   
    UPDATE nom_filaestruc SET lft=lft -2 where lft> rec.lft;
    --Paso 2 Decrementar los derechos
    UPDATE nom_filaestruc SET rgt=rgt -2 where rgt> rec.rgt;  
  ELSE --Si no es hoja
    --Paso 1 Decrementar los izquierdos
    UPDATE nom_filaestruc SET lft=(lft - (rec.rgt - rec.lft))-1 where lft>rec.lft;
    --Paso 2 Decrementar los derechos 
    UPDATE nom_filaestruc SET rgt=(rgt - (rec.rgt - rec.lft))-1 where rgt>rec.rgt;
      
  END IF;
  RETURN true;
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_es_hoja (
  idarbol numeric
)
RETURNS boolean AS
$body$
DECLARE

    contador numeric;
BEGIN
contador:=(SELECT count(*) FROM mod_estructuracomp.nom_filaestruc WHERE idpadre=$1);

   IF contador>0 THEN
    RETURN false;
    ELSE
     RETURN true;
    END IF;

END
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_poner_orden_unico_por_nivel (
)
RETURNS boolean AS
$body$
declare
contador NUMERIC;
cant_nivel NUMERIC;

BEGIN

--Creo una columna nivel
--ALTER TABLE mod_estructuracomp.nom_filaestruc  ADD COLUMN nivel integer;
--Lleno la columna nivel
UPDATE mod_estructuracomp.nom_filaestruc SET nivel = public.nlevel(parent_path);

contador=1;

cant_nivel=(SELECT max(nivel) FROM mod_estructuracomp.nom_filaestruc);

  UPDATE mod_estructuracomp.nom_filaestruc nfe
  SET ordenunico = (CAST((SELECT mod_estructuracomp.f_dame_letra_dado_numero(orden)) AS VARCHAR))::public.ltree
  WHERE nfe.nivel = 1;

 LOOP
 contador= contador+1;

 UPDATE mod_estructuracomp.nom_filaestruc nfe
 SET ordenunico = public.text2ltree(public.ltree2text((SELECT nfe2.ordenunico
 FROM mod_estructuracomp.nom_filaestruc nfe2
 WHERE nfe2.idfila = nfe.idpadre))||'.'||(SELECT mod_estructuracomp.f_dame_letra_dado_numero(nfe.orden)))
 WHERE nfe.nivel = contador;

 EXIT WHEN contador = cant_nivel;

 END LOOP;
--Elimino la columna nivel
 --ALTER TABLE mod_estructuracomp.nom_filaestruc DROP COLUMN nivel;

  RAISE NOTICE 'Orden unico actualizado correctamente.';

 RETURN TRUE;

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_poner_parenth_path_arbol (
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
  PERFORM mod_estructuracomp.f_poner_parenth_path_fila($1);

--Actualizo el cada hijo
  FOR hijos IN SELECT * FROM mod_estructuracomp.nom_filaestruc f WHERE f.idpadre=$1 ORDER BY f.orden
    LOOP
      EXIT WHEN hijos IS NULL;
    --Si no es el mismo, para que no sea infinito
        IF hijos.idfila <> $1 THEN
         PERFORM mod_estructuracomp.f_poner_parenth_path_arbol(hijos.idfila);
        END IF;
     END LOOP;

   ELSE
 --Si es hoja solo actualizo su orden unico
    PERFORM mod_estructuracomp.f_poner_parenth_path_fila($1);
   END IF;

END
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_poner_parenth_path_fila (
  p_idfila numeric
)
RETURNS boolean AS
$body$
    DECLARE

        padre mod_estructuracomp.nom_filaestruc;
        fila mod_estructuracomp.nom_filaestruc;
        path public.LTREE;

     BEGIN

        --Información de la fila
        SELECT * INTO fila FROM mod_estructuracomp.nom_filaestruc f WHERE f.idfila=$1;

        --Información del padre de la fila
        SELECT * INTO padre FROM mod_estructuracomp.nom_filaestruc f WHERE f.idfila=fila.idpadre;
        --RAISE EXCEPTION 'hola %',padre.parent_path;

              --Si el parent_path del padre es null y no es una raiz lanzo un error
              IF padre.parent_path IS NULL AND fila.idfila <> fila.idpadre THEN

                RAISE EXCEPTION 'El parenth_path del padre de la fila % no puede ser nulo',fila.idfila;

               ELSE

                IF fila.idpadre = fila.idfila THEN

                  path = (cast(fila.idfila as varchar))::public.ltree;

                  ELSE

                  path = public.text2ltree(public.ltree2text(padre.parent_path)||'.'||fila.idfila);

                END IF;

               --Actualizo la fila con el parenth_path generado
               UPDATE mod_estructuracomp.nom_filaestruc  SET  parent_path=path  WHERE idfila=$1;

              END IF;

  RETURN true;
END;
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_cambiargrupo (
  idcargo integer,
  idgrupoold integer,
  idgrupocnew integer
)
RETURNS boolean AS
$body$
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_insertar_filaestruc (
)
RETURNS trigger AS
$body$
    DECLARE
        padre_rec mod_estructuracomp.nom_filaestruc;
        path public.LTREE;
    BEGIN

        IF TG_OP = 'INSERT' THEN
               IF NEW.idpadre = NEW.idfila THEN
                  NEW.parent_path = (cast(NEW.idfila as varchar))::public.ltree;
               END IF;
             IF NEW.idpadre <> NEW.idfila THEN
               select * into  padre_rec FROM mod_estructuracomp.nom_filaestruc WHERE idfila = NEW.idpadre;
             SELECT parent_path FROM mod_estructuracomp.nom_filaestruc WHERE idfila = NEW.idpadre INTO path;
                 IF path IS NOT NULL THEN
                      NEW.parent_path = public.text2ltree(public.ltree2text(path)||'.'||NEW.idfila);
                     END IF;

             END IF;
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

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_fila (
)
RETURNS boolean AS
$body$
DECLARE
max_id integer;
sec_cont integer;

BEGIN
  
  SELECT MAX(idfila) INTO max_id FROM mod_estructuracomp.nom_filaestruc;
  SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_filaestruc_seq;
  
  RAISE NOTICE 'valor max_id %',max_id;
  RAISE NOTICE 'valor sec_cont %',sec_cont; 

  IF(sec_cont <> max_id)THEN
    EXECUTE 'ALTER sequence mod_estructuracomp.sec_filaestruc_seq RESTART ' ||max_id+1;
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

COMMENT ON FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_fila()
IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_grado”.';

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_filaestruc (
)
RETURNS boolean AS
$body$
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
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_filaestruc()
IS 'Función trigger empleada para reiniciar la secuencia de la tabla nom_filaestruc.';

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_normajuridica (
)
RETURNS trigger AS
$body$
DECLARE
max_id integer;
sec_cont integer;

BEGIN

  SELECT MAX(idnormajuridica) INTO max_id FROM mod_estructuracomp.nom_normajuridica;
  SELECT last_value INTO sec_cont FROM mod_estructuracomp.sec_normajuridica_seq;

  RAISE NOTICE 'valor max_id %',max_id;
  RAISE NOTICE 'valor sec_cont %',sec_cont;

  IF(sec_cont <> max_id)THEN
    EXECUTE 'ALTER sequence mod_estructuracomp.sec_normajuridica_seq RESTART ' ||max_id+1;
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

COMMENT ON FUNCTION mod_estructuracomp.ft_reiniciar_secuencia_normajuridica()
IS 'Función trigger empleada para reiniciar la secuencia de la tabla “nom_normajuridica”.';

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

ALTER FUNCTION mod_estructuracomp.ft_update_parent_path ()
  OWNER TO zeolides;

COMMENT ON SEQUENCE mod_estructuracomp.sec_cargo_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_cargo".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_categocup_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_categocup".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_categoria_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_categoria".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_concepto_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_concepto".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_conceptopropiedad_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_conceptopropiedad".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_datsubordinacion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_subordinacion".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_dominio_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_dominio".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_escalasalarial_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_escalasalarial".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_filaestruc_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_filaestruc".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_grado_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_grado".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_grupocomplejidad_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_grupocomplejidad".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_icono_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_icono".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_nomsubordinacion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_subordinacion".';

ALTER SEQUENCE mod_estructuracomp.sec_preparacion_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999 START 1
  CACHE 1 NO CYCLE;

COMMENT ON SEQUENCE mod_estructuracomp.sec_preparacion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_preparacion".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_proyecto_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_proyecto".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_salario_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_salario".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_tipoescala_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoescala".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_tipomedio_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_tipomedio".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_usuarioconcepto_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_usuarioconcepto".';

CREATE TABLE mod_estructuracomp.aux_complemento (
  idcomplemento NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_complemento PRIMARY KEY(idcomplemento)
) 
WITH (oids = false);

COMMENT ON TABLE mod_estructuracomp.aux_complemento
IS 'Tabla nomencladora que almacena los conceptos asociados al complemento salarial en la entidad.';

COMMENT ON COLUMN mod_estructuracomp.aux_complemento.idcomplemento
IS 'Identificador del complemento.';

COMMENT ON CONSTRAINT pk_complemento ON mod_estructuracomp.aux_complemento
IS 'identificador unico para la tabla aux_complemento';

CREATE OR REPLACE FUNCTION mod_estructuracomp.f_tablaorganizacion (
  p_idestructura numeric [],
  p_idproyecto numeric,
  p_iddominio numeric
)
RETURNS SETOF mod_estructuracomp.td_tablaorganizacion AS
$body$
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
              WHEN c.idcategocup IS NOT NULL THEN (
      SELECT SUM(ca.cantidad)
      FROM mod_estructuracomp.nom_filaestruc f1
            INNER JOIN mod_estructuracomp.nom_filaestruc f2 ON f1.parent_path operator (public.@>) f2.parent_path
      INNER JOIN mod_estructuracomp.dat_cargo ca ON (ca.idcargo = f2.idfila AND CASE WHEN p_idproyecto = 0 THEN ca.idestado = 0 ELSE ((ca.idestado = 0 AND ca.modificado [p_idproyecto] = 0) OR (ca.idproyecto = p_idproyecto AND ca.idestado <> 3))  END )
      INNER JOIN mod_estructuracomp.dat_cargocivil cac ON (ca.idcargo = cac.idcargo AND cac.idproyecto = ca.idproyecto)
      WHERE f2.fechafin IS NULL AND f1.idfila = $1[v_i] AND f2.dominiofila [p_iddominio] = 1::bit AND cac.idcategocup = c.idcategocup
              )
                WHEN g.idgrado IS NOT NULL THEN (
      SELECT SUM(ca.cantidad)
      FROM mod_estructuracomp.nom_filaestruc f1
      INNER JOIN mod_estructuracomp.nom_filaestruc f2 ON f1.parent_path operator(public.@>) f2.parent_path
            INNER JOIN mod_estructuracomp.dat_cargo ca ON (ca.idcargo = f2.idfila AND CASE WHEN p_idproyecto = 0 THEN ca.idestado = 0 ELSE ((ca.idestado = 0 AND ca.modificado [p_idproyecto] = 0) OR (ca.idproyecto = p_idproyecto AND ca.idestado <> 3))  END )
      INNER JOIN mod_estructuracomp.dat_cargomilitar cam ON (ca.idcargo = cam.idcargo AND cam.idproyecto = ca.idproyecto)
      WHERE f2.fechafin IS NULL AND f1.idfila = $1[v_i] AND f2.dominiofila [p_iddominio] = 1::bit AND cam.idgrado = g.idgrado
              )
            END AS cantidad
        FROM mod_estructuracomp.nom_filaestruc p
        INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON p.parent_path operator(public.@>) nfe.parent_path
        LEFT JOIN mod_estructuracomp.dat_cargo cargo ON (cargo.idcargo = nfe.idfila AND CASE WHEN p_idproyecto = 0 THEN cargo.idestado = 0 ELSE ((cargo.idestado = 0 AND cargo.modificado [p_idproyecto] = 0) OR (cargo.idproyecto = p_idproyecto AND cargo.idestado <> 3))  END )
        LEFT JOIN mod_estructuracomp.dat_cargocivil cv ON (cargo.idcargo = cv.idcargo AND cv.idproyecto = cargo.idproyecto)
        LEFT JOIN mod_estructuracomp.nom_categocup c on c.idcategocup = cv.idcategocup
        LEFT JOIN mod_estructuracomp.dat_cargomilitar cm ON (cargo.idcargo = cm.idcargo AND cm.idproyecto = cargo.idproyecto)
        LEFT JOIN mod_estructuracomp.nom_grado g on g.idgrado = cm.idgrado

        WHERE p.idfila = $1[v_i]
        AND nfe.fechafin IS NULL AND nfe.dominiofila [p_iddominio] = 1::bit
        AND (c.idcategocup IS NOT NULL OR g.idgrado IS NOT NULL)
        AND cargo.temporal = 0
        group by c.idcategocup, g.idgrado
        ORDER by c.idcategocup, g.idgrado
    loop
      v_rec.id = v_res.id;
      v_rec.denominacion = v_res.denominacion;
        v_rec.cantidad = v_res.cantidad;
      v_rec.esgrado = v_res.esgrado;
        return next v_rec;
    end loop;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

CREATE TABLE mod_estructuracomp.dat_configpuertos (
  idconfigpuertos INTEGER DEFAULT nextval('mod_estructuracomp.dat_configpuertos_idconfigpuertos_seq'::regclass) NOT NULL,
  idpadrefijo INTEGER,
  CONSTRAINT dat_configpuertos_pkey PRIMARY KEY(idconfigpuertos)
) 
WITH (oids = false);

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

ALTER TABLE mod_estructuracomp.nom_categoria
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

ALTER TABLE mod_estructuracomp.nom_grupocomplejidad
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

CREATE TABLE mod_estructuracomp.nom_nivelcargo (
  idnivelcargo NUMERIC(9,0) DEFAULT nextval('mod_estructuracomp.sec_nivelcargo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  abreviatura VARCHAR(60),
  actual NUMERIC(1,0) DEFAULT 1 NOT NULL,
  visible NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT nom_nivelcargo_pkey PRIMARY KEY(idnivelcargo)
) 
WITH (oids = false);

ALTER TABLE mod_estructuracomp.nom_subordinacion
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

CREATE TABLE mod_estructuracomp.nom_normajuridica (
  idnormajuridica NUMERIC(19,0) DEFAULT nextval('mod_estructuracomp.sec_normajuridica_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  abreviatura VARCHAR(60),
  actual NUMERIC(1,0),
  visible NUMERIC(1,0),
  fechainicio DATE DEFAULT 'now'::text::date,
  fechafin DATE,
  CONSTRAINT pk_normajuridica PRIMARY KEY(idnormajuridica)
) 
WITH (oids = false);

COMMENT ON CONSTRAINT pk_normajuridica ON mod_estructuracomp.nom_normajuridica
IS 'Identificador único para cada tupla de la tabla nom_normajuridica.';


CREATE TRIGGER t_reiniciar_secuencia_normajuridica
  AFTER DELETE 
  ON mod_estructuracomp.nom_normajuridica
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_estructuracomp.ft_reiniciar_secuencia_normajuridica();

ALTER TABLE mod_estructuracomp.nom_preparacion
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

CREATE TABLE mod_estructuracomp.nom_sector (
  idsector NUMERIC(9,0) DEFAULT nextval('mod_estructuracomp.sec_sector_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  abreviatura VARCHAR(60),
  actual NUMERIC(1,0) DEFAULT 1 NOT NULL,
  visible NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT nom_sector_pkey PRIMARY KEY(idsector)
) 
WITH (oids = false);

ALTER TABLE mod_estructuracomp.nom_tipoescala
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

ALTER TABLE mod_estructuracomp.nom_tipomedio
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

ALTER TABLE mod_estructuracomp.nom_categocup
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

ALTER TABLE mod_estructuracomp.nom_grado
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

ALTER TABLE mod_estructuracomp.nom_cargo
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

ALTER TABLE mod_estructuracomp.dat_filacortada
  ADD COLUMN esraiz BOOLEAN DEFAULT false;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ALTER COLUMN oid DROP DEFAULT;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ALTER COLUMN oid TYPE OID;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ALTER COLUMN oid SET DEFAULT 0;

COMMENT ON COLUMN mod_estructuracomp.nom_filaestruc.parent_path
IS '';

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ADD COLUMN ordenunico public.ltree;

ALTER TABLE mod_estructuracomp.nom_filaestruc
  ADD COLUMN fechainicio DATE;

ALTER TABLE mod_estructuracomp.nom_organo
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

CREATE TABLE mod_estructuracomp.nom_firma (
  idfirma NUMERIC(19,0) DEFAULT nextval('mod_estructuracomp.sec_firma_seq'::regclass) NOT NULL,
  persona VARCHAR(255) NOT NULL,
  idnomcargo NUMERIC(19,0) DEFAULT 0 NOT NULL,
  iddominio NUMERIC(19,0) DEFAULT 1 NOT NULL,
  actual NUMERIC(1,0) DEFAULT 1 NOT NULL,
  visible NUMERIC(1,0) DEFAULT 1 NOT NULL,
  fechainicio DATE NOT NULL,
  fechafin DATE,
  CONSTRAINT nom_firma_pkey PRIMARY KEY(idfirma)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_estructuracomp.nom_firma.fechainicio
IS 'campo para la fecha de inicio';

COMMENT ON COLUMN mod_estructuracomp.nom_firma.fechafin
IS 'Campo para la fecha fin';

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD COLUMN idsector NUMERIC(9,0);

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD COLUMN decisorio NUMERIC(1,0);

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD COLUMN idnivelcargo NUMERIC(9,0);

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD COLUMN idfacultado NUMERIC(9,0);

ALTER TABLE mod_estructuracomp.dat_subordinacion
  ADD COLUMN parent_path public.ltree;

COMMENT ON COLUMN mod_estructuracomp.dat_subordinacion.parent_path
IS 'Representa la estructura representada por el tipo de dato ltree';

ALTER TABLE mod_estructuracomp.dat_estructura
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

ALTER TABLE mod_estructuracomp.dat_estructura
  ADD COLUMN idsector NUMERIC(9,0) DEFAULT 0 NOT NULL;

ALTER TABLE mod_estructuracomp.dat_estructura
  ADD COLUMN codigonit VARCHAR(255);

ALTER TABLE mod_estructuracomp.dat_estructuraop
  ALTER COLUMN abreviatura TYPE VARCHAR(60) COLLATE pg_catalog."default";

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

CREATE OR REPLACE VIEW mod_estructuracomp.v_dametodasestructuras (
    idestructura,
    codigo,
    denominacion,
    abreviatura,
    idconcepto,
    idorgano,
    direccion)
AS
 SELECT fila.idfila AS idestructura,
        CASE
            WHEN estructura.codigo::text <> ''::text THEN estructura.codigo
            WHEN estructuraop.codigo::text <> ''::text THEN estructuraop.codigo
            ELSE NULL::character varying(20)
        END AS codigo,
        CASE
            WHEN estructura.denominacion::text <> ''::text THEN estructura.denominacion
            WHEN estructuraop.denominacion::text <> ''::text THEN estructuraop.denominacion
            ELSE NULL::character varying
        END AS denominacion,
        CASE
            WHEN estructura.abreviatura::text <> ''::text THEN estructura.abreviatura
            WHEN estructuraop.abreviatura::text <> ''::text THEN estructuraop.abreviatura
            ELSE NULL::character varying
        END AS abreviatura,
        CASE
            WHEN estructura.idconcepto IS NOT NULL THEN estructura.idconcepto
            WHEN estructuraop.idconcepto IS NOT NULL THEN estructuraop.idconcepto
            ELSE NULL::numeric
        END AS idconcepto,
        CASE
            WHEN estructura.idorgano IS NOT NULL THEN estructura.idorgano
            WHEN estructuraop.idorgano IS NOT NULL THEN estructuraop.idorgano
            ELSE NULL::numeric
        END AS idorgano,
        CASE
            WHEN estructura.direccion::text <> ''::text THEN estructura.direccion
            ELSE NULL::character varying
        END AS direccion
   FROM mod_estructuracomp.nom_filaestruc fila
     JOIN mod_estructuracomp.nom_concepto nomeav ON fila.idconcepto = nomeav.idconcepto
     LEFT JOIN mod_estructuracomp.dat_estructura estructura ON estructura.idestructura = fila.idfila AND (estructura.idestado = 0::numeric OR estructura.idproyecto = 0::numeric)
     LEFT JOIN mod_estructuracomp.nom_organo orgest ON orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto
     LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop ON estructuraop.idestructuraop = fila.idfila AND (estructuraop.idestado = 0::numeric OR estructuraop.idproyecto = 0::numeric)
     LEFT JOIN mod_estructuracomp.nom_organo orgestop ON orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto
  WHERE fila.fechafin IS NULL AND (estructura.denominacion::text <> ''::text OR estructuraop.denominacion::text <> ''::text)
  ORDER BY fila.ordenunico;

CREATE INDEX parent_path_idx ON mod_estructuracomp.dat_subordinacion
  USING gist (parent_path public.gist_ltree_ops);

CREATE TRIGGER parent_path_tgr
  BEFORE INSERT OR UPDATE 
  ON mod_estructuracomp.dat_subordinacion
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_estructuracomp.ft_update_parent_path();

 CREATE TRIGGER t_actualizar
  AFTER UPDATE 
  ON mod_estructuracomp.nom_filaestruc
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_estructuracomp.ft_actualizar_orden_nom_filaestruc();

