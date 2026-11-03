CREATE SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_estructuracomp.sec_cargofacultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargofacultado".';

ALTER TABLE mod_estructuracomp.dat_cargo
  DROP CONSTRAINT dat_cargo_fk2 RESTRICT;

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
COST 100;

COMMENT ON SEQUENCE mod_estructuracomp.dat_configpuertos_idconfigpuertos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_configpuertos".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_nivelcargo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_nivelcargo".';

COMMENT ON SEQUENCE mod_estructuracomp.sec_sector_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_sector".';

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

--<DATA>
INSERT INTO mod_estructuracomp.nom_cargofacultado(idcargofacultado, denominacion, abreviatura, actual, visible, fechainicio)
    VALUES (0,'Ninguno','N',1,1,'2019-02-11');
--</DATA>


ALTER TABLE mod_estructuracomp.dat_filacortada
  ADD COLUMN esraiz BOOLEAN DEFAULT false;

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

ALTER TABLE mod_estructuracomp.dat_estructura
  ADD COLUMN codigonit VARCHAR(255);

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT dat_cargo_fk2 FOREIGN KEY (idfacultado)
    REFERENCES mod_estructuracomp.nom_cargofacultado(idcargofacultado)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

