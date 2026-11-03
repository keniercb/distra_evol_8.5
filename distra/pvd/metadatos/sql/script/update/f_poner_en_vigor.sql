CREATE OR REPLACE FUNCTION mod_estructuracomp.f_poner_en_vigor(
	proyecto numeric,
	usuario numeric)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
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

	FOR valores IN (SELECT * FROM dat_elementoproyecto WHERE idproyecto = $1)
	LOOP
		/*
		UPDATE nom_filaestruc SET orden = valores.orden
		WHERE idfila = valores.idfila;
		*/
		perform mod_estructuracomp.f_cambiar_orden(valores.idfila, valores.orden);
		
	END LOOP;

	UPDATE mod_estructuracomp.dat_proyecto
	SET aprobado = 1, modificado = 0, fechafin = date('now')
	WHERE idproyecto = $1 AND idusuario = $2;

	DELETE FROM mod_estructuracomp.dat_proyecto WHERE idpadre = $1;

	PERFORM mod_estructuracomp.f_poner_parenth_path_arbol(referencia);

	RETURN TRUE;
END;
$BODY$;

ALTER FUNCTION mod_estructuracomp.f_poner_en_vigor(numeric, numeric)
    OWNER TO zeolides;

GRANT EXECUTE ON FUNCTION mod_estructuracomp.f_poner_en_vigor(numeric, numeric) TO zeolides;

REVOKE ALL ON FUNCTION mod_estructuracomp.f_poner_en_vigor(numeric, numeric) FROM PUBLIC;
