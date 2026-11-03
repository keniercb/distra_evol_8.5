ALTER TABLE mod_integracionreporte.dat_reporte
  ADD COLUMN idclasificacion NUMERIC(19,0);
  
  ALTER TABLE mod_integracionreporte.dat_reporte
  ADD CONSTRAINT fk_clasificacionreporte_reporte FOREIGN KEY (idclasificacion)
    REFERENCES mod_integracionreporte.nom_clasificacionreporte(idclasificacion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;