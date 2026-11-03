DELETE FROM mod_logistica.dat_cantidadcomprometida
WHERE iddocumento IN (
	SELECT cc1.iddocumento
    FROM mod_logistica.dat_cantidadcomprometida cc1
    LEFT JOIN mod_logistica.dat_documento d on d.iddocumento = cc1.iddocumento
    WHERE d.iddocumento IS NULL
);

ALTER TABLE mod_logistica.dat_cantidadcomprometida DROP CONSTRAINT IF EXISTS dat_cantidadcomprometida_fk;

ALTER TABLE mod_logistica.dat_cantidadcomprometida
  ADD CONSTRAINT dat_cantidadcomprometida_fk FOREIGN KEY (iddocumento)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;