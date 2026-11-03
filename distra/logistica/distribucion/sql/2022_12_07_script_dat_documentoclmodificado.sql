ALTER TABLE mod_logistica.dat_documentocl
  RENAME COLUMN idproducto TO idindicador;
  
  ALTER TABLE mod_logistica.dat_documentocl
  ADD COLUMN idproducto NUMERIC(19,0);
  
  
  -- object recreation
ALTER TABLE mod_logistica.dat_documentocl
  DROP CONSTRAINT dat_documentocl_fk RESTRICT;

ALTER TABLE mod_logistica.dat_documentocl
  ADD CONSTRAINT dat_documentocl_fk FOREIGN KEY (iddocumento)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;