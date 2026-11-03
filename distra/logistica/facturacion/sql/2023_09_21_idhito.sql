ALTER TABLE IF EXISTS mod_logfacturacion.dat_elementosfactura
    ADD COLUMN IF NOT EXISTS idhito numeric(19,0);