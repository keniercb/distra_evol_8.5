CREATE OR REPLACE FUNCTION mod_estructuracomp.obtener_ancestro_concepto_3(p_idcargo bigint)
RETURNS SETOF mod_estructuracomp.nom_filaestruc AS $$
DECLARE
    v_existe_hoja boolean;
BEGIN
    -- Verificar si existe la hoja
    SELECT EXISTS(
        SELECT 1 
        FROM mod_estructuracomp.nom_filaestruc 
        WHERE idfila = p_idcargo
    ) INTO v_existe_hoja;
    
    IF NOT v_existe_hoja THEN
        RAISE EXCEPTION 'No existe el cargo con ID %', p_idcargo;
    END IF;
    
    -- Retornar el ancestro con concepto 3
    RETURN QUERY
    SELECT td.*
    FROM mod_estructuracomp.nom_filaestruc td
    INNER JOIN mod_estructuracomp.nom_filaestruc hoja ON hoja.idfila = p_idcargo
	INNER JOIN mod_estructuracomp.dat_estructura est ON est.idestructura = td.idfila and est.idproyecto = 0
    WHERE td.parent_path @> hoja.parent_path
      AND td.idconcepto = 3
      AND td.parent_path != hoja.parent_path
	  AND td.fechafin is null	
    ORDER BY nlevel(td.parent_path) DESC
    LIMIT 1;    
    -- Si no se encontró ningún ancestro, retornar conjunto vacío silenciosamente
    RETURN;
END;
$$ LANGUAGE plpgsql;

--select * from mod_estructuracomp.obtener_ancestro_concepto_3(200576454);