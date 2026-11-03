ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  DROP CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina RESTRICT;

ALTER TABLE mod_nomina.dat_personaestructuranominacobrosypagos
  ALTER COLUMN importe TYPE NUMERIC(19,2);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idcampoliquidaobligacion NUMERIC(19,0);

COMMENT ON COLUMN mod_nomina.conf_conceptoscontables.idcampoliquidaobligacion
IS 'Campo de la estructura de nomina que liquida una obligacion';

ALTER TABLE mod_nomina.conf_vblesgblesregsaltmpserv
  ADD COLUMN anotaciones VARCHAR(255);

ALTER TABLE mod_nomina.his_vacacionespersona
  ALTER COLUMN ajusteimporte TYPE NUMERIC(19,2);

ALTER TABLE mod_nomina.his_vacacionespersona
  ALTER COLUMN ajustetiempo TYPE NUMERIC(19,2);

ALTER TABLE mod_nomina.conf_escalaelementosalarialpersona
  ADD CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona1 FOREIGN KEY (idconfconceptospdelementossalariales)
    REFERENCES mod_nomina.conf_conceptospdelementossalariales(idconfconceptospdelementossalariales)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_escalaelementosalarial
  ADD CONSTRAINT conf_escalaelementosalarial_fk2 FOREIGN KEY (idconfconceptospdelementossalariales)
    REFERENCES mod_nomina.conf_conceptospdelementossalariales(idconfconceptospdelementossalariales)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina CHECK (((vacacionesdiasimporte = (0)::numeric) OR (vacacionesdiasimporte = (1)::numeric)) OR (vacacionesdiasimporte = (2)::numeric));

COMMENT ON CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina ON mod_nomina.conf_estructuramodelosnomina
IS 'Restricción sobre la(s) columna(s) "vacacionesdiasimporte".';


--Cambiandole el estado a los reportes certificados porque ya este estado dejo de existir
UPDATE mod_nomina.dat_reportescertificaciones
   SET estado = 1
 WHERE  estado = 2;
 
--Funcion para actualizar en la tabla confcargopagoresultado el idarea del cargo
SELECT mod_nomina.f_asociar_area_cargo_pgxr(); 

--Para ponerle a los periodos que son mensuales
UPDATE mod_nomina.nom_periodopago
   SET tipoperiodo = 3;
   
 --Para ponerle a a las referencias que son por rangos de fecha  
   UPDATE mod_nomina.conf_estructuramodelosnomina
   SET tiporeferencia = 1
 WHERE idtipocampo = 4;
 
 --Para quitar las fechas de vencimiento en Asociar Personas a Centros de Costo.
 UPDATE mod_nomina.dat_cargosocupados
   SET fechavencimiento = null;

