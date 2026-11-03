CREATE OR REPLACE FUNCTION mod_planificacion.f_generaruridatosnomencladorxid (
  p_iddatosnomenclador numeric
)
RETURNS void AS
$body$
DECLARE
BEGIN
--caracteres a ignorar ([ ]+)\/.*,:;
 UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, '(', '') WHERE iddatosnomenclador = p_iddatosnomenclador;

UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, ')', '') WHERE iddatosnomenclador = p_iddatosnomenclador;

UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, '[', '') WHERE iddatosnomenclador = p_iddatosnomenclador;

UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, ']', '') WHERE iddatosnomenclador = p_iddatosnomenclador;

UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, ' ', '') WHERE iddatosnomenclador = p_iddatosnomenclador;

UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, '+', '') WHERE iddatosnomenclador = p_iddatosnomenclador;

UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, '\','') WHERE iddatosnomenclador = p_iddatosnomenclador;

UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, '/','') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, '.','') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, '*','') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, ',','') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, ':','') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, ';','') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, 'á','a') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, 'é','e') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, 'í','i') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, 'ó','o') WHERE iddatosnomenclador = p_iddatosnomenclador;
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = replace (uridatosnomenclador, 'ú','u') WHERE iddatosnomenclador = p_iddatosnomenclador;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;