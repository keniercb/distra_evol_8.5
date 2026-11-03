--Opción 1:
UPDATE mod_nomina.dat_retencionpersona AS rp
SET numerocomprobante = c.numerocomprobante
FROM mod_contabilidad.dat_comprobante AS c
WHERE rp.idcomprobante = c.idcomprobante
  AND rp.identidad = ? -- Reemplaza ? con el valor de identidad
  AND EXISTS (
    SELECT 1 
    FROM mod_nomina.nom_tiporetencion tr 
    WHERE tr.idtiporetencion = rp.idtiporetencion 
      AND tr.cobrosypagos = 1
  );



--Opción 2:
  --nota: Antes de ejecutar la actualización, es recomendable realizar una consulta de selección para verificar los registros que se actualizarán. Esto te permitirá asegurarte de que los datos son correctos y evitar actualizaciones no deseadas.
  -- 1. Primero verifica los registros que se actualizarán
SELECT 
    rp.idretencionpersona,
    rp.identidad,
    rp.idcomprobante,
    rp.numerocomprobante AS actual,
    c.numerocomprobante AS nuevo,
    tr.denominacion,
    tr.cobrosypagos
FROM mod_nomina.dat_retencionpersona rp
JOIN mod_contabilidad.dat_comprobante c ON rp.idcomprobante = c.idcomprobante
JOIN mod_nomina.nom_tiporetencion tr ON rp.idtiporetencion = tr.idtiporetencion
WHERE rp.identidad = ? -- Reemplaza con tu valor
  AND tr.cobrosypagos = 1
  AND rp.idcomprobante IS NOT NULL;

-- 2. Ejecuta la actualización si los datos son correctos
UPDATE mod_nomina.dat_retencionpersona rp
SET numerocomprobante = c.numerocomprobante
FROM mod_contabilidad.dat_comprobante c
JOIN mod_nomina.nom_tiporetencion tr ON tr.idtiporetencion = rp.idtiporetencion
WHERE rp.idcomprobante = c.idcomprobante
  AND rp.identidad = ? -- Mismo valor que arriba
  AND tr.cobrosypagos = 1;