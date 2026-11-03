--Definiendo los tipos de nomenclador de carga del sistema
UPDATE
  mod_planificacion.nom_tiponomenclador
SET
  configsistema = 1
WHERE
  uritiponomenclador = 'mes';