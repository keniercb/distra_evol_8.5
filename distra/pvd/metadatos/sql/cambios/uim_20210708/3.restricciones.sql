ALTER TABLE mod_estructuracomp.nom_cargo
  ADD CONSTRAINT fk_normajuridica_nom_cargo FOREIGN KEY (idnormajuridica)
    REFERENCES mod_estructuracomp.nom_normajuridica(idnormajuridica)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_normajuridica_nom_cargo ON mod_estructuracomp.nom_cargo
IS 'Limitación referencial entre la  tabla “nom_normajuridica” y la tabla “nom_cargo” mediante el atributo “idnormajuridica”.';

ALTER TABLE mod_estructuracomp.nom_firma
  ADD CONSTRAINT nom_firma_fk FOREIGN KEY (idnomcargo)
    REFERENCES mod_estructuracomp.nom_cargo(idnomcargo)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_estructuracomp.nom_firma
  ADD CONSTRAINT nom_firma_fk1 FOREIGN KEY (iddominio)
    REFERENCES mod_estructuracomp.nom_dominio(iddominio)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT dat_cargo_fk2 FOREIGN KEY (idfacultado)
    REFERENCES mod_estructuracomp.nom_cargofacultado(idcargofacultado)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT dat_cargo_fk1 FOREIGN KEY (idnivelcargo)
    REFERENCES mod_estructuracomp.nom_nivelcargo(idnivelcargo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_estructuracomp.dat_cargo
  ADD CONSTRAINT dat_cargo_fk FOREIGN KEY (idsector)
    REFERENCES mod_estructuracomp.nom_sector(idsector)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;