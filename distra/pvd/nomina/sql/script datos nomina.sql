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
 
 