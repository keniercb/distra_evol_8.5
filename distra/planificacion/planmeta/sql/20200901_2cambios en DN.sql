--Eliminando campo color
ALTER TABLE mod_planificacion.nom_datosnomenclador
  DROP COLUMN color;

--Poniendo todas las uris en minuscula
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = lower(uridatosnomenclador);

--Eliminando campo configsistema
ALTER TABLE mod_planificacion.nom_datosnomenclador
  DROP COLUMN configsistema;

--Creando campo activacion
ALTER TABLE mod_planificacion.nom_datosnomenclador
  ADD COLUMN activacion NUMERIC(1,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_planificacion.nom_datosnomenclador.activacion
IS 'Determina si el dato nomenclador será usado o no en el sistema.';


--Creando campo valor por defecto
ALTER TABLE mod_planificacion.nom_datosnomenclador
  ADD COLUMN valordefecto NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_planificacion.nom_datosnomenclador.valordefecto
IS 'Define si el dato nomenclador será tomado como valor por defecto.';

--Creando campo orden
ALTER TABLE mod_planificacion.nom_datosnomenclador
  ADD COLUMN orden NUMERIC(4,0) DEFAULT 9999 NOT NULL;

COMMENT ON COLUMN mod_planificacion.nom_datosnomenclador.orden
IS 'Determina el orden de los datos nomencladores dentro de su correspondiente tiponomenclador.';

--Creando la uri a los datos que la tienen en null
--este  dio error de llave ak duplicada ver cual dato se debe eliminar pq no tiene sentido este duplicado
UPDATE mod_planificacion.nom_datosnomenclador
SET uridatosnomenclador = lower(denominacion)
WHERE uridatosnomenclador is null;

--Llenando el campo valor por defecto
UPDATE mod_planificacion.nom_datosnomenclador
SET valordefecto = 1
WHERE uridatosnomenclador = '-';

--Poniendo como not null el campo uridatosnomenclador
ALTER TABLE mod_planificacion.nom_datosnomenclador
  ALTER COLUMN uridatosnomenclador SET NOT NULL;
  
--Poniendo a las dependencias de la tabla delete restringido
ALTER TABLE mod_planificacion.conf_tiempoxnomenclador
  DROP CONSTRAINT fk_datosnomenclador_tiempoxnomenclador RESTRICT;

ALTER TABLE mod_planificacion.conf_tiempoxnomenclador
  ADD CONSTRAINT fk_datosnomenclador_tiempoxnomenclador FOREIGN KEY (iddatosnomenclador)
    REFERENCES mod_planificacion.nom_datosnomenclador(iddatosnomenclador)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;
	
--Poniendole valor por defecto al comportamiento por entidad rector balance, entidad rectora
UPDATE 
  mod_planificacion.nom_datosnomenclador 
SET 
  valordefecto = 1
WHERE 
  uridatosnomenclador = 'rectorbalance';
  
--Poniendole valor por defecto al estado del ejercicio, elaboracion
UPDATE 
  mod_planificacion.nom_datosnomenclador 
SET 
  valordefecto = 1
WHERE 
  uridatosnomenclador = 'elaboracion';
  
--Poniendole valor por defecto a la relacion con actividades, compartida
UPDATE 
  mod_planificacion.nom_datosnomenclador 
SET 
  valordefecto = 1
WHERE 
  uridatosnomenclador = 'compartida';
  
--Poniendole valor por defecto al estado de la importacion, validado ok
UPDATE 
  mod_planificacion.nom_datosnomenclador 
SET 
  valordefecto = 1
WHERE 
  uridatosnomenclador = 'ok';

--Poniendole valor por defecto a la clasificacion del plan, planmaterial
UPDATE 
  mod_planificacion.nom_datosnomenclador 
SET 
  valordefecto = 1
WHERE 
  uridatosnomenclador = 'planmaterial';

