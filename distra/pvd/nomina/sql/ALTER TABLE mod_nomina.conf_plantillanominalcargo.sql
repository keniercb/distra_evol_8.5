ALTER TABLE IF EXISTS mod_nomina.conf_plantillanominalcargo
    ADD COLUMN IF NOT EXISTS parent_path ltree;
ALTER TABLE IF EXISTS mod_nomina.conf_plantillanominalcargo
    ADD COLUMN IF NOT EXISTS ordenunico ltree;

UPDATE mod_nomina.conf_plantillanominalcargo t1
SET parent_path = t2.parent_path,
	ordenunico = t2.ordenunico
FROM (SELECT idfila, parent_path, ordenunico FROM mod_estructuracomp.nom_filaestruc where idconcepto = 7 ) t2
WHERE t1.idcargo = t2.idfila;

CREATE OR REPLACE FUNCTION mod_nomina.ft_actualizar_path_orden_cargo_plantilla()
RETURNS TRIGGER AS
$$
BEGIN
    -- Verificar si ordenunico es NULL y actualizar desde nom_filaestruc
    IF NEW.ordenunico IS NULL OR NEW.parent_path IS NULL THEN
        UPDATE mod_nomina.conf_plantillanominalcargo
        SET 
            parent_path = COALESCE(NEW.parent_path, fe.parent_path),
            ordenunico = COALESCE(NEW.ordenunico, fe.ordenunico)
        FROM mod_estructuracomp.nom_filaestruc fe
        WHERE fe.idfila = NEW.idcargo
        AND conf_plantillanominalcargo.idplantillanominalcargo = NEW.idplantillanominalcargo;
    END IF;
    
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Eliminar el trigger existente si es necesario
DROP TRIGGER IF EXISTS tr_actualizar_path_orden_cargo ON mod_nomina.conf_plantillanominalcargo;

-- Crear el nuevo trigger
CREATE TRIGGER tr_actualizar_path_orden_cargo
    AFTER INSERT
    ON mod_nomina.conf_plantillanominalcargo
    FOR EACH ROW
    EXECUTE FUNCTION mod_nomina.ft_actualizar_path_orden_cargo_plantilla();
