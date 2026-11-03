/*2022_02_25*/
ALTER TABLE mod_logfarmacia.conf_cuadrobasico
  RENAME COLUMN idcodificador TO idproducto;
  
  ALTER TABLE mod_logfarmacia.dat_registrotarjeta
  RENAME COLUMN idcodificadorcambio TO idproductocambio;
  
ALTER TABLE mod_logfarmacia.dat_tarjetamedicamento
  ADD COLUMN idpaciente NUMERIC(19,0);
  
ALTER TABLE mod_logfarmacia.dat_tarjetamedicamento
  ADD COLUMN consultoriomedico VARCHAR(255,0);
  
ALTER TABLE mod_logfarmacia.dat_tarjetamedicamento
  ADD COLUMN area VARCHAR(255,0);
  
ALTER TABLE mod_logfarmacia.dat_tarjetamedicamento
  ADD CONSTRAINT dat_tarjetamedicamento_ventacliente_fk FOREIGN KEY (idpaciente)
    REFERENCES mod_logpuntoventa.dat_ventacliente(idventacliente)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;
	
/*2022_03_15*/
ALTER TABLE mod_logfarmacia.dat_rotacionlote
  ADD CONSTRAINT fk_rotacionlote_estructuraop_iddestino FOREIGN KEY (iddestino)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;
    
ALTER TABLE mod_logfarmacia.dat_rotacionlote
  ADD CONSTRAINT fk_rotacionlote_estructuraop_idorigen FOREIGN KEY (idorigen)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/*2022_03_16*/
ALTER TABLE mod_logfarmacia.dat_rotacionproductolote
  RENAME COLUMN idcodificador TO idproducto;
  
  
ALTER TABLE mod_logfarmacia.dat_rotacioncodificador
  RENAME COLUMN idcodificador TO idproducto;