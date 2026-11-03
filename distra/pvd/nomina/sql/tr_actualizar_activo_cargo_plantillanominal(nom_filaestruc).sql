
CREATE OR REPLACE VIEW mod_estructuracomp.v_get_cargos_eliminados
AS
SELECT nfe.idfila AS idcargo,
nfe.idconcepto,
nc.denominacion,
dc.cantidad,
dc.cantidadreal
FROM mod_estructuracomp.nom_filaestruc nfe
JOIN mod_estructuracomp.nom_concepto nomeav ON nfe.idconcepto = nomeav.idconcepto
JOIN mod_estructuracomp.dat_cargo dc ON nfe.idfila = dc.idcargo AND dc.idproyecto = 0::numeric
JOIN mod_estructuracomp.nom_cargo nc ON nc.idnomcargo = dc.idnomcargo
WHERE nfe.fechafin IS NOT NULL OR nc.fechafin IS NOT NULL;

ALTER TABLE mod_estructuracomp.v_get_cargos_eliminados OWNER TO zeolides;
UPDATE mod_nomina.conf_plantillanominalcargo
SET activo = false
WHERE idcargo IN (
SELECT idcargo
FROM mod_estructuracomp.v_get_cargos_eliminados
);

-- Función para el trigger
CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_actualizar_activo_cargo_plantillanominal()
RETURNS TRIGGER AS $$
BEGIN
-- Si se está actualizando y fechafin cambia a NOT NULL con conceptos 7 o 10
IF (TG_OP = 'UPDATE') THEN
-- Verificar si fechafin cambió de NULL a NOT NULL
IF (OLD.fechafin IS NULL AND NEW.fechafin IS NOT NULL)
AND NEW.idconcepto IN (7, 10) THEN

UPDATE mod_nomina.conf_plantillanominalcargo
SET activo = false
WHERE idcargo = NEW.idfila
AND activo = true; -- Solo actualizar si está activo

-- Si se está quitando la fecha de fin (de NOT NULL a NULL)
ELSIF (OLD.fechafin IS NOT NULL AND NEW.fechafin IS NULL)
AND NEW.idconcepto IN (7, 10) THEN

UPDATE mod_nomina.conf_plantillanominalcargo
SET activo = true
WHERE idcargo = NEW.idfila
AND activo = false; -- Solo actualizar si está inactivo
END IF;

-- Para inserciones nuevas
ELSIF (TG_OP = 'INSERT') THEN
IF NEW.fechafin IS NOT NULL AND NEW.idconcepto IN (7, 10) THEN
UPDATE mod_nomina.conf_plantillanominalcargo
SET activo = false
WHERE idcargo = NEW.idfila
AND activo = true;
END IF;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
CREATE TRIGGER tr_actualizar_activo_cargo_plantillanominal
AFTER INSERT OR UPDATE OF fechafin, idconcepto
ON mod_estructuracomp.nom_filaestruc
FOR EACH ROW
EXECUTE FUNCTION mod_estructuracomp.ft_actualizar_activo_cargo_plantillanominal();