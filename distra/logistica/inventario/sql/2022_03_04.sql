ALTER TABLE mod_logistica.dat_entrega
  ADD COLUMN iddocorigen NUMERIC(19,0);

COMMENT ON COLUMN mod_logistica.dat_entrega.iddocorigen
IS 'Identificador para el documento origen';


ALTER TABLE mod_logistica.dat_entrega
  ADD COLUMN nrodocorigen NUMERIC(19,0);

COMMENT ON COLUMN mod_logistica.dat_entrega.nrodocorigen
IS 'Determina el numero del documento de origen';