ALTER TABLE mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN idnaturaleza NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN idgruposubgrupo NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN denominacion VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN idnaturaleza NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN idgruposubgrupo NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN denominacion VARCHAR(255);
