ALTER TABLE mod_logfacturacion.dat_elementosfactura
  ADD COLUMN idexterno VARCHAR(20);
  
ALTER TABLE mod_logfacturacion.dat_prodservicios
  ADD COLUMN idcentrocosto NUMERIC(19,0);

ALTER TABLE mod_logfacturacion.dat_prodservicios
  ADD COLUMN idestructuracomun NUMERIC(19,0);
  
ALTER TABLE mod_logfacturacion.dat_prodservicios
  ADD COLUMN matricula varchar(10);

ALTER TABLE mod_logfacturacion.dat_prodservicios
  ADD COLUMN indicativo varchar(20);
  
ALTER TABLE mod_logfacturacion.dat_prodservicios
  ADD COLUMN nroinventario varchar(20);
  
ALTER TABLE mod_logfacturacion.dat_prodservicios
  ADD COLUMN centrocosto varchar;
  
ALTER TABLE mod_logfacturacion.dat_prodservicios
  ADD COLUMN entidad varchar;
  
ALTER TABLE mod_logfacturacion.dat_desglosemonedaprodserv
  ADD COLUMN descuento NUMERIC(25,6);