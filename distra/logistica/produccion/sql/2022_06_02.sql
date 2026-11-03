ALTER TABLE mod_logproduccion.dat_ordenmateriales
  ADD CONSTRAINT dat_ordenmateriales_idx 
    UNIQUE (idordenproduccion, idindicador) NOT DEFERRABLE; 