--mod_nomina.dat_cargosocupados
ALTER TABLE IF EXISTS mod_nomina.dat_cargosocupados DROP COLUMN IF EXISTS activa;
DROP TRIGGER IF EXISTS t_salvar_cargoanterior_historico ON mod_nomina.dat_cargosocupados;
DROP FUNCTION IF EXISTS mod_nomina.ft_salvar_cargoanterior_historico();

--mod_nomina.his_cargosocupados
ALTER TABLE IF EXISTS mod_nomina.his_cargosocupados DROP COLUMN IF EXISTS orden;