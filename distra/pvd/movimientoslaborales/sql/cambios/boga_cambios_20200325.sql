ALTER TABLE mod_personaext.his_trayectorialaboral ADD COLUMN idsituacionlaboral numeric(19,0);
COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.idsituacionlaboral IS 'Identificador de la situacion laboral de la persona.';
ALTER TABLE mod_personaext.his_trayectorialaboral ADD COLUMN categocup character varying(255);