ALTER TABLE mod_logfacturacion.dat_operacionsubsistema
  ADD COLUMN IF NOT EXISTS pagoexterior NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN IF NOT EXISTS pagoexterior NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_logfacturacion.dat_docfactura.pagoexterior
IS 'Indica si la factura es pagada desde el exterior';


ALTER TABLE mod_logfacturacion.dat_categoriapreciofactura
  ADD COLUMN IF NOT EXISTS noexterior NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_logfacturacion.dat_categoriapreciofactura.noexterior
IS 'Indica si el concepto no se paga desde el exterior solo para facturas que son pagadas desde el exterior';