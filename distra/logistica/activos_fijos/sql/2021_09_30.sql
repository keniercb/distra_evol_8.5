ALTER TABLE mod_logactivofijotangible.dat_movregnumericoinventario
  ADD CONSTRAINT dat_movregnumericoinventario_fk FOREIGN KEY (idmovregnumerico)
    REFERENCES mod_logactivofijotangible.dat_movregnumerico(idmovregnumerico)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logactivofijotangible.dat_movregnumericoinventario
  ALTER COLUMN idmovregnumerico SET NOT NULL;

ALTER TABLE mod_logactivofijotangible.dat_movregnumericoinventario
  ADD PRIMARY KEY (idmovregnumerico);