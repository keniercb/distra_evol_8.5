--Eliminacion en cascada para que permita eliminar los registros numéricos incorrectos 
-- object recreation
ALTER TABLE mod_logactivofijotangible.dat_movregnumerico
  DROP CONSTRAINT fk_registronumerico_movregnumerico RESTRICT;

ALTER TABLE mod_logactivofijotangible.dat_movregnumerico
  ADD CONSTRAINT fk_registronumerico_movregnumerico FOREIGN KEY (idregnumerico)
    REFERENCES mod_logactivofijotangible.dat_registronumerico(idregnumerico)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;