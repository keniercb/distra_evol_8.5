ALTER TABLE IF EXISTS mod_logfarmacia.dat_tarjetamedicamento DROP CONSTRAINT IF EXISTS chk_consultoriomedico;

ALTER TABLE IF EXISTS mod_logfarmacia.dat_tarjetamedicamento
    ADD CONSTRAINT chk_consultoriomedico CHECK (consultoriomedico::text !~~ '0%'::text)
    NOT VALID;
