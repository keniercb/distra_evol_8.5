ALTER TABLE IF EXISTS mod_logtaller.dat_ubicaciontallorden DROP CONSTRAINT IF EXISTS fk_ordentrabajo_ubicaciontall;

ALTER TABLE mod_logtaller.dat_ubicaciontallorden
  ADD CONSTRAINT fk_ordentrabajo_ubicaciontall FOREIGN KEY (idordentrabajo)
    REFERENCES mod_logtaller.dat_ordentrabajo(idordentrabajo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

INSERT INTO 
  mod_logistica.nom_variableglobal
(
  nombre,
  valor
)
VALUES (
  'usarubicaciontall',
  0
);

UPDATE 
  mod_logistica.nom_variableglobal 
SET 
  valor = 1
WHERE 
  nombre ilike ('usarubicaciontall')
;

ALTER TABLE mod_logtaller.dat_ordentrabajo
  ADD COLUMN ubicacionactual NUMERIC(19,0);

COMMENT ON COLUMN mod_logtaller.dat_ordentrabajo.ubicacionactual
IS 'Id del nomenclador de la ubicacion actual de la orden';
