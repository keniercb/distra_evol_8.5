ALTER TABLE mod_logactivofijotangible.dat_docprestamo
  ADD COLUMN carnet VARCHAR(50);

COMMENT ON COLUMN mod_logactivofijotangible.dat_docprestamo.carnet
IS 'Numero de carnet de la persona a la que se le prestan los medios';

ALTER TABLE mod_logactivofijotangible.dat_docprestamo
  ADD COLUMN telefono VARCHAR(25);

COMMENT ON COLUMN mod_logactivofijotangible.dat_docprestamo.telefono
IS 'Numero de telefono de la persona a la que se le prestan los medios';

ALTER TABLE mod_logactivofijotangible.dat_docprestamo
  ADD COLUMN direccion VARCHAR(250);

COMMENT ON COLUMN mod_logactivofijotangible.dat_docprestamo.direccion
IS 'Direccion de la persona a la que se le prestan los medios';