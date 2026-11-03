ALTER TABLE mod_datosmaestros.nom_clientesproveedor
  ADD COLUMN mayorista NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_datosmaestros.nom_clientesproveedor.mayorista
IS 'Guarda si el cliente es mayorista o no';