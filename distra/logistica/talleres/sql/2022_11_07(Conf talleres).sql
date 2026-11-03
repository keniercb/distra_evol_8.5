ALTER TABLE mod_logtaller.conf_servicioarea
  ADD COLUMN contratoobligatorio NUMERIC(1,0);
  


ALTER TABLE mod_logtaller.dat_material
  ADD COLUMN idoperacionm NUMERIC(1,0) DEFAULT 0;