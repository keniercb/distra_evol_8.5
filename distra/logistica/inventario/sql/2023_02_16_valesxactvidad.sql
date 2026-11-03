ALTER TABLE mod_loginventario.dat_moventrega
  ADD COLUMN idordenactividad NUMERIC(19,0);
  
ALTER TABLE mod_loginventario.dat_moventrega
  ADD CONSTRAINT dat_moventrega_fk FOREIGN KEY (idordenactividad)
    REFERENCES mod_logtaller.dat_ordenactividad(idordenactividad)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;
	
CREATE TABLE mod_loginventario.dat_movdevolucion (
  idmovimiento NUMERIC(19,0) NOT NULL,
  cantidad NUMERIC(25,6),
  idordenactividad NUMERIC(19,0),
  PRIMARY KEY(idmovimiento)
) 
WITH (oids = false);

ALTER TABLE mod_loginventario.dat_movdevolucion
  ADD CONSTRAINT dat_movdevolucion_fk FOREIGN KEY (idmovimiento)
    REFERENCES mod_logistica.dat_movimiento(idmovimiento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_loginventario.dat_movdevolucion
  ADD CONSTRAINT dat_movdevolucion_fk1 FOREIGN KEY (idordenactividad)
    REFERENCES mod_logtaller.dat_ordenactividad(idordenactividad)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;
