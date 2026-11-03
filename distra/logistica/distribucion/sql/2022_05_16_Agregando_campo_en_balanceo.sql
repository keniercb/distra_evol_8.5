ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD COLUMN iddocdistribucion NUMERIC(19,0);

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD CONSTRAINT dat_prodbalanceodistribuir_fk2 FOREIGN KEY (iddocdistribucion)
    REFERENCES mod_logdistribucion.dat_distribucion(iddistribucion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;