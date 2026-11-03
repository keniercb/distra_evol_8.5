ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivotransp
  ADD CONSTRAINT dat_regnumericoactivotransp_fk FOREIGN KEY (idtipocombustible)
    REFERENCES mod_logactivofijotangible.nom_tipocombustible(idtipocombustible)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;