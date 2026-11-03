--Poniendo en 0 la configsistema de todos los tipos nomenclador
UPDATE mod_planificacion.nom_tiponomenclador
SET configsistema = 0;

--Definiendo los tipos de nomenclador de carga del sistema
UPDATE
  mod_planificacion.nom_tiponomenclador
SET
  configsistema = 1
WHERE
  uritiponomenclador = 'estadosejercicio' OR
  uritiponomenclador = 'estadoimportar' OR
  uritiponomenclador = 'Comportamientodeentidad' OR
  uritiponomenclador = 'Comportamientodeactividades' OR
  uritiponomenclador = 'tipodeplan' OR
  uritiponomenclador = 'TRIMESTRE' OR
  uritiponomenclador = 'MES' OR
  uritiponomenclador = 'SEMESTRE';

--Poniendo todas las uris en minuscula
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = lower(uritiponomenclador);

--Eliminando campo color
ALTER TABLE mod_planificacion.nom_tiponomenclador
  DROP COLUMN color;

--Actualizando comentario a campo existente
COMMENT ON COLUMN mod_planificacion.nom_tiponomenclador.configsistema
IS 'Atributo para identificar si el nomenclador es de configuración del sistema.';

--Poniendo 100 caracteres a la denominacion
--si estaba asi es porque en algun momento hizo falta en algun cliente, probar cuando corra en cada uno
ALTER TABLE mod_planificacion.nom_tiponomenclador
  ALTER COLUMN denominacion TYPE VARCHAR(100) COLLATE pg_catalog."default";
  
--Creando la uri a los que la tengan en null
UPDATE mod_planificacion.nom_tiponomenclador
SET uritiponomenclador = lower(denominacion)
WHERE uritiponomenclador is null;

--Poniendo not null al campo uritiponomenclador
ALTER TABLE mod_planificacion.nom_tiponomenclador
  ALTER COLUMN uritiponomenclador SET NOT NULL;


--Poniendo a las dependencias de la tabla delete restringido
--------------- SQL ---------------

ALTER TABLE mod_planificacion.conf_asociarsubtipobalanceaft
  DROP CONSTRAINT fk_nomtiponomenclador_conf_asociarsubtipobalanceaft_idtiponomen RESTRICT;

ALTER TABLE mod_planificacion.conf_asociarsubtipobalanceaft
  ADD CONSTRAINT fk_nomtiponomenclador_asociarsubtipobalanceaft FOREIGN KEY (idtiponomenclador)
    REFERENCES mod_planificacion.nom_tiponomenclador(idtiponomenclador)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;
	
	--------------- SQL ---------------

ALTER TABLE mod_planificacion.dat_conftiponomesp
  DROP CONSTRAINT fk_tiponomenclador_conftiponomesp RESTRICT;

ALTER TABLE mod_planificacion.dat_conftiponomesp
  ADD CONSTRAINT fk_tiponomenclador_conftiponomesp FOREIGN KEY (idtiponomenclador)
    REFERENCES mod_planificacion.nom_tiponomenclador(idtiponomenclador)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;
	--------------- SQL ---------------

ALTER TABLE mod_planificacion.dat_desglosetiponomenclador
  DROP CONSTRAINT fk_tiponomenclador_desglosetiponomenclador RESTRICT;

ALTER TABLE mod_planificacion.dat_desglosetiponomenclador
  ADD CONSTRAINT fk_tiponomenclador_desglosetiponomenclador FOREIGN KEY (idtiponomenclador)
    REFERENCES mod_planificacion.nom_tiponomenclador(idtiponomenclador)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;
	--------------- SQL ---------------

ALTER TABLE mod_planificacion.dat_rectortiponomesp
  DROP CONSTRAINT fk_tiponomenclador_rectortiponomesp RESTRICT;

ALTER TABLE mod_planificacion.dat_rectortiponomesp
  ADD CONSTRAINT fk_tiponomenclador_rectortiponomesp FOREIGN KEY (idtiponomenclador)
    REFERENCES mod_planificacion.nom_tiponomenclador(idtiponomenclador)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

