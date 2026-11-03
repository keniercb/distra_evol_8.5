ALTER TABLE mod_fuerzatrabajo.dat_movnomina
    ADD COLUMN fregistro date NOT NULL DEFAULT now();

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movnomina.fregistro
    IS 'Fecha en que se registra o actualiza el contenido del movimiento de nómina';