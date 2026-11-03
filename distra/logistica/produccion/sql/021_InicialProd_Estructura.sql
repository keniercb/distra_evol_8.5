ALTER TABLE mod_logproduccion.dat_ordenmateriales
  ALTER COLUMN idindicador SET NOT NULL;
  
ALTER TABLE mod_logproduccion.dat_ordenmateriales
  DROP COLUMN solicitada;

ALTER TABLE mod_logproduccion.dat_ordenmateriales
  DROP COLUMN entregada; 
  
ALTER TABLE mod_logproduccion.dat_ordenmateriales
  RENAME COLUMN idproducto TO idindicador;

ALTER TABLE mod_logproduccion.dat_ordenmateriales
  DROP CONSTRAINT dat_ordenmateriales_fk1 RESTRICT;

ALTER TABLE mod_logproduccion.dat_ordenmateriales
  ADD CONSTRAINT dat_ordenmateriales_fk1 FOREIGN KEY (idindicador)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    MATCH FULL
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logproduccion.dat_ordenproduccion
  RENAME COLUMN idcentrocosto TO idcentrogrupo;

ALTER TABLE mod_logproduccion.dat_gasto
  ADD COLUMN precio NUMERIC(25,6);