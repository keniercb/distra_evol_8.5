ALTER TABLE mod_logactivofijotangible.dat_registronumerico
  DROP CONSTRAINT IF EXISTS fk_producto_registronumerico RESTRICT;

ALTER TABLE mod_logactivofijotangible.dat_registronumerico
  ADD CONSTRAINT fk_producto_registronumerico FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    MATCH FULL
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

-- object recreation
ALTER TABLE mod_logactivofijotangible.dat_movregnumerico
  DROP CONSTRAINT IF EXISTS fk_registronumerico_movregnumerico RESTRICT;

ALTER TABLE mod_logactivofijotangible.dat_movregnumerico
  ADD CONSTRAINT fk_registronumerico_movregnumerico FOREIGN KEY (idregnumerico)
    REFERENCES mod_logactivofijotangible.dat_registronumerico(idregnumerico)
    MATCH FULL
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

-- object recreation
ALTER TABLE mod_logactivofijotangible.dat_registronumerico
  DROP CONSTRAINT IF EXISTS fk_producto_registronumerico RESTRICT;

ALTER TABLE mod_logactivofijotangible.dat_registronumerico
  ADD CONSTRAINT fk_producto_registronumerico FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    MATCH FULL
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;
    