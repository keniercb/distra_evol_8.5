
INSERT INTO 
  mod_logistica.nom_variableglobal
(
  nombre,
  valor,
  id,
  activo,
  ambito,
  datatype
)
VALUES (
  'OPRE_REC_FAC711',
  1,
  (select max(id)+1 from mod_logistica.nom_variableglobal),
  1,
  1,
  2
);

CREATE TABLE mod_loginventario.dat_recepcionsolicitud (
  iddocumento NUMERIC(19,0) NOT NULL,
  idsolicitudpadre NUMERIC(19,0),
  PRIMARY KEY(iddocumento)
) 
WITH (oids = false);

ALTER TABLE mod_loginventario.dat_recepcionsolicitud
  ADD CONSTRAINT dat_recepcionsolicitud_fk FOREIGN KEY (iddocumento)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;