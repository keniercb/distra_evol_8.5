--Para quitar las fechas de vencimiento en Asociar Personas a Centros de Costo.
 UPDATE mod_nomina.dat_cargosocupados
   SET fechavencimiento = null; 
   
--Para aumentarle el tamaño a  textoformula en conf_estructuramodelosnomina
 ALTER TABLE mod_nomina.conf_estructuramodelosnomina ALTER COLUMN textoformula TYPE character varying;
 
---2 lugares decimales para los ajustes de las bajas
ALTER TABLE mod_nomina.his_vacacionespersonabaja ALTER COLUMN ajusteimporte TYPE NUMERIC(19,2);
ALTER TABLE mod_nomina.his_vacacionespersonabaja ALTER COLUMN ajustetiempo TYPE NUMERIC(19,2);