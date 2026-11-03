CREATE OR REPLACE FUNCTION mod_planificacion.f_generaruritiponomencladorxid (
  p_idtiponomenclador numeric
)
RETURNS void AS
$body$
DECLARE
BEGIN
--caracteres a ignorar ([ ]+)\/.*,:;
 UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, '(', '') WHERE idtiponomenclador = p_idtiponomenclador;

UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, ')', '') WHERE idtiponomenclador = p_idtiponomenclador;

UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, '[', '') WHERE idtiponomenclador = p_idtiponomenclador;

UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, ']', '') WHERE idtiponomenclador = p_idtiponomenclador;

UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, ' ', '') WHERE idtiponomenclador = p_idtiponomenclador;

UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, '+', '') WHERE idtiponomenclador = p_idtiponomenclador;

UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, '\','') WHERE idtiponomenclador = p_idtiponomenclador;

UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, '/','') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, '.','') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, '*','') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, ',','') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, ':','') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, ';','') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, 'á','a') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, 'é','e') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, 'í','i') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, 'ó','o') WHERE idtiponomenclador = p_idtiponomenclador;
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = replace (uritiponomenclador, 'ú','u') WHERE idtiponomenclador = p_idtiponomenclador;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;