ALTER TABLE mod_logfarmacia.conf_cuadrobasico
  RENAME COLUMN idcodificador TO idproducto;

  ALTER TABLE mod_logfarmacia.conf_cuadrobasico
  ADD CONSTRAINT conf_cuadrobasico_fk2 FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;