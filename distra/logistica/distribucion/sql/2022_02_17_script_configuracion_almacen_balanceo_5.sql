CREATE TABLE mod_logdistribucion.conf_depositobalanceo (
  iddeposito NUMERIC(19,0) NOT NULL,
  PRIMARY KEY(iddeposito)
) 
WITH (oids = false);

COMMENT ON TABLE mod_logdistribucion.conf_depositobalanceo
IS 'Depósitos a excluir para realizar el balanceo';

COMMENT ON COLUMN mod_logdistribucion.conf_depositobalanceo.iddeposito
IS 'id deposito a excluir';

ALTER TABLE mod_logdistribucion.conf_depositobalanceo
  ADD CONSTRAINT dat_estructuraop_idestructuraop_key FOREIGN KEY (iddeposito)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;