ALTER TABLE IF EXISTS mod_datosmaestros.nom_naturaleza
    ADD COLUMN IF NOT EXISTS parent_path ltree;
ALTER TABLE IF EXISTS mod_datosmaestros.nom_naturaleza
    ADD COLUMN IF NOT EXISTS orden numeric(19,0);

--orden

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_poner_orden_arbol(
	idarbol numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    hijos mod_datosmaestros.nom_naturaleza;
    padre mod_datosmaestros.nom_naturaleza;
    contador NUMERIC;
BEGIN

SET search_path = public;
contador=1;
  
  FOR hijos IN SELECT * FROM mod_datosmaestros.nom_naturaleza f WHERE f.idpadre=$1 AND f.idpadre<>f.idnaturaleza ORDER BY f.orden
    LOOP
      EXIT WHEN hijos IS NULL;
	  --Si no es el mismo, para que no sea infinito
        IF hijos.idnaturaleza <> $1 THEN
         UPDATE mod_datosmaestros.nom_naturaleza  SET orden=contador  WHERE idnaturaleza=hijos.idnaturaleza;
         PERFORM mod_datosmaestros.f_poner_orden_arbol(hijos.idnaturaleza);
         contador=contador+1;
        END IF;
     END LOOP; 
END
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_poner_orden_arbol(numeric)
    OWNER TO zeolides;


CREATE OR REPLACE FUNCTION mod_datosmaestros.f_actualizar_orden_completo(
	)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    primerasfilas mod_datosmaestros.nom_naturaleza;
    contador INTEGER;
    
BEGIN
contador=0;
--Todas las filas que son raices 
 FOR primerasfilas IN SELECT * FROM mod_datosmaestros.nom_naturaleza  WHERE idnaturaleza=idpadre ORDER BY orden
  LOOP
  contador=contador+1;
      EXIT WHEN primerasfilas IS NULL;
      UPDATE mod_datosmaestros.nom_naturaleza  SET orden=contador  WHERE idnaturaleza=primerasfilas.idnaturaleza;
         PERFORM mod_datosmaestros.f_poner_orden_arbol(primerasfilas.idnaturaleza);
   END LOOP;

 RAISE NOTICE 'Orden reordenado correctamente.'; 
   
RETURN true;

END
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_actualizar_orden_completo()
    OWNER TO zeolides;

--parent_path

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_poner_parenth_path_naturaleza(
	p_idnaturaleza numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
    DECLARE
    
        padre mod_datosmaestros.nom_naturaleza;
        nat mod_datosmaestros.nom_naturaleza;
        path public.LTREE;
        
     BEGIN     
        --Información de la nat
        SELECT * INTO nat FROM mod_datosmaestros.nom_naturaleza f WHERE f.idnaturaleza=$1;        
        --Información del padre de la nat
        SELECT * INTO padre FROM mod_datosmaestros.nom_naturaleza f WHERE f.idnaturaleza=nat.idpadre;     
              --Si el parent_path del padre es null y no es una raiz lanzo un error
              IF padre.parent_path IS NULL AND nat.idnaturaleza <> nat.idpadre THEN --true, false              
                RAISE EXCEPTION 'El parenth_path del padre de la nat % no puede ser nulo',nat.idnaturaleza;                
               ELSE  
                IF nat.idpadre = nat.idnaturaleza THEN				   
                  path = (cast(nat.idnaturaleza as varchar))::public.ltree;                  
                ELSE
                  path = public.text2ltree(public.ltree2text(padre.parent_path)||'.'||nat.idnaturaleza);                  
                END IF;                
               --Actualizo la nat con el parenth_path generado
               UPDATE mod_datosmaestros.nom_naturaleza  SET  parent_path=path  WHERE idnaturaleza=$1;               
              END IF;
	RETURN true;
END;
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_poner_parenth_path_naturaleza(numeric)
    OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_es_hoja(
	idarbol numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
   
    contador numeric;
BEGIN
contador:=(SELECT count(*) FROM mod_datosmaestros.nom_naturaleza WHERE idpadre=$1);

   IF contador>0 THEN 
    RETURN false;
   ELSE
    RETURN true;
   END IF;
 
END
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_es_hoja(numeric)
    OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_poner_parenth_path_arbol(
	idarbol numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    hijos mod_datosmaestros.nom_naturaleza;
    padre mod_datosmaestros.nom_naturaleza;
    esHoja boolean;
BEGIN

SET search_path = public;
--Si no es hoja
esHoja :=(SELECT mod_datosmaestros.f_es_hoja($1));

  IF NOT esHoja THEN 
  --Actualizo el orden unico de la raiz
  PERFORM mod_datosmaestros.f_poner_parenth_path_naturaleza($1);
  
--Actualizo el cada hijo
  FOR hijos IN SELECT * FROM mod_datosmaestros.nom_naturaleza f WHERE f.idpadre=$1 ORDER BY f.orden
    LOOP
      EXIT WHEN hijos IS NULL;
	  --Si no es el mismo, para que no sea infinito
        IF hijos.idnaturaleza <> $1 THEN
         PERFORM mod_datosmaestros.f_poner_parenth_path_arbol(hijos.idnaturaleza);
        END IF;
     END LOOP;

   ELSE
 --Si es hoja solo actualizo su orden unico  
    PERFORM mod_datosmaestros.f_poner_parenth_path_naturaleza($1);
   END IF;
 
END
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_poner_parenth_path_arbol(numeric)
    OWNER TO zeolides;
CREATE OR REPLACE FUNCTION mod_datosmaestros.f_actualizar_parent_path_completo(
	)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    primerasfilas mod_datosmaestros.nom_naturaleza;
    padre mod_datosmaestros.nom_naturaleza;
    ordenuniconew public.ltree;
    ordenltree public.ltree;
BEGIN

--Todas las filas que son raices 
 FOR primerasfilas IN SELECT * FROM mod_datosmaestros.nom_naturaleza  WHERE idnaturaleza=idpadre 
	AND idnaturaleza > 0
	ORDER BY orden
  LOOP
      EXIT WHEN primerasfilas IS NULL;
         PERFORM mod_datosmaestros.f_poner_parenth_path_arbol(primerasfilas.idnaturaleza);
   END LOOP;
     
RETURN true;

END
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_actualizar_parent_path_completo() OWNER TO zeolides;

select * from mod_datosmaestros.f_actualizar_orden_completo();
select * from mod_datosmaestros.f_actualizar_parent_path_completo();
