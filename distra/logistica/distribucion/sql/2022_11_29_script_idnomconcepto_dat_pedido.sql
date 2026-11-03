ALTER TABLE mod_logdistribucion.dat_pedido
  ADD COLUMN idnomconcepto NUMERIC(19,0);

COMMENT ON COLUMN mod_logdistribucion.dat_pedido.idnomconcepto
IS 'Identificador del tipo de pedido en el nomenclador de Conceptos';