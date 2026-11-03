 ALTER TABLE mod_logproduccion.dat_gasto
  ADD COLUMN idnorma NUMERIC(19,0);

ALTER TABLE mod_logproduccion.dat_gasto
  ADD CONSTRAINT dat_gasto_fk2 FOREIGN KEY (idnorma)
    REFERENCES mod_planificacion.dat_norma(idnorma)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;