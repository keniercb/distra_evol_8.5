ALTER TABLE mod_logpuntoventa.dat_cierreventa
  ALTER COLUMN total DROP DEFAULT;

ALTER TABLE mod_logpuntoventa.dat_cierreventa
  ALTER COLUMN total TYPE NUMERIC(25,2);

ALTER TABLE mod_logpuntoventa.dat_cierreventa
  ALTER COLUMN total SET DEFAULT 0;