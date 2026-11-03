-- Agregar columna identidad a la tabla existente
ALTER TABLE mod_nomina.his_vacacionespersona 
ADD COLUMN IF NOT EXISTS identidad numeric(19,0);
