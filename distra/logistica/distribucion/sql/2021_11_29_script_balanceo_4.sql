ALTER TABLE mod_logdistribucion.dat_docbalanceo
  ADD COLUMN fechacreacion DATE DEFAULT now();
ALTER TABLE mod_logdistribucion.dat_docbalanceo
  ADD COLUMN fechaaprobacion DATE;