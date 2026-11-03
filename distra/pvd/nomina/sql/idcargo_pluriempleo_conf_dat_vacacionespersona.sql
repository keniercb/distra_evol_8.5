ALTER TABLE IF EXISTS mod_nomina.conf_vacacionespersona
    ADD COLUMN IF NOT EXISTS idcargo numeric;
--update
update mod_nomina.conf_vacacionespersona
set idcargo = cargosocup.idcargo
from (SELECT 
	idcargosocupados, idpersona, idcargo, identidad
FROM mod_nomina.dat_cargosocupados) as cargosocup
where cargosocup.idpersona = mod_nomina.conf_vacacionespersona.idpersona
	and cargosocup.identidad = mod_nomina.conf_vacacionespersona.idestructura;


ALTER TABLE IF EXISTS mod_nomina.dat_vacacionespersona
    ADD COLUMN IF NOT EXISTS idcargo numeric;
--update
update mod_nomina.dat_vacacionespersona
set idcargo = cargosocup.idcargo
from (SELECT 
	idcargosocupados, idpersona, idcargo, identidad
    FROM mod_nomina.dat_cargosocupados) as cargosocup
where cargosocup.idpersona = mod_nomina.dat_vacacionespersona.idpersona
	and cargosocup.identidad = mod_nomina.dat_vacacionespersona.identidad;

ALTER TABLE IF EXISTS mod_nomina.dat_registrosalariotiemposervcio
    ADD COLUMN IF NOT EXISTS idcargo numeric;

--update
UPDATE mod_nomina.dat_registrosalariotiemposervcio
set idcargo = cargosocup.idcargo
from (SELECT 
	idcargosocupados, idpersona, idcargo, identidad FROM mod_nomina.dat_cargosocupados) as cargosocup
where cargosocup.idpersona = mod_nomina.dat_registrosalariotiemposervcio.idpersona
	and cargosocup.identidad = mod_nomina.dat_registrosalariotiemposervcio.idestructura;
