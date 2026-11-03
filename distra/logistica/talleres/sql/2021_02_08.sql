  ALTER TABLE mod_logtaller.dat_ordentrabajo
  ADD COLUMN nombreresponsable VARCHAR(255);

  ALTER TABLE mod_logtaller.dat_ordentrabajo
  ADD COLUMN idcarnetresponsable NUMERIC(11,0);

  ALTER TABLE mod_logtaller.dat_ordentrabajo
  ADD COLUMN telefonoresponsable NUMERIC(19,0);


ALTER TABLE mod_logtaller.dat_ordentrabajo
  ADD COLUMN textocorreoresponsable VARCHAR(255);