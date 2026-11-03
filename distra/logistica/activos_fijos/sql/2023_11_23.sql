--Scripts del importar de registros numéricos
ALTER TABLE mod_logactivofijotangible.dat_importartmptransp
  ADD COLUMN cantpersonapie NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_importartmptransp
  ADD COLUMN cantpersonasentado NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_importartmptransp
  ADD COLUMN normacombustible NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_importartmptransp
  ADD COLUMN idgps VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_importartmptransp
  ADD COLUMN idcategoriatransp NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_importartmptransp
  ADD COLUMN endeposito NUMERIC(19,0);
  ALTER TABLE mod_logactivofijotangible.dat_importartmptransp
  ADD COLUMN tipocombustible VARCHAR(255);
  ALTER TABLE mod_logactivofijotangible.dat_importartmptransp

  ADD COLUMN nrochasis NUMERIC(19,0);
  ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN colorsec VARCHAR(255);
  ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN denomestadotecnico VARCHAR(255);
  ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN vidautil NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN tasafiscal NUMERIC(25,6);
ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN porcientorecuperacion NUMERIC(3,0);
ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN categoria VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN denomarearesp VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN actividad VARCHAR(255);
  ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN colorprim VARCHAR(255);
  ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN denominacion VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN gruposubgrupo VARCHAR(255);
  ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN naturaleza VARCHAR(255);
  ALTER TABLE mod_logactivofijotangible.dat_importartmp
  ADD COLUMN valorresidual NUMERIC(19,0);

ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN actividad VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN colorprim VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN colorsec VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN denomestadotecnico VARCHAR(255);

ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN categoria VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN denomarearesp VARCHAR(255);
  ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN valorresidual NUMERIC(19,0);
  ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ALTER COLUMN valoradquisicion DROP DEFAULT;
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ALTER COLUMN valoradquisicion TYPE NUMERIC(25,6);
ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ALTER COLUMN valoradquisicion SET DEFAULT 0;
  ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN actividad VARCHAR(255);

ALTER TABLE mod_logactivofijotangible.dat_movregnumericoactivotransp
  ADD COLUMN tipocombustible VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_movregnumericoactivotransp
  ADD COLUMN nrochasis NUMERIC(19,0);
ALTER TABLE mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN actividad VARCHAR(255);
ALTER TABLE mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN actividad VARCHAR(255);

ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivotransp
  ADD COLUMN tipocombustible VARCHAR(255);