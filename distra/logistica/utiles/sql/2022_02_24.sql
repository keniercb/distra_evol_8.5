CREATE INDEX IF NOT EXISTS idx_producto_ubicacion_idp_idub
ON mod_logubicacion.dat_ubicacioncomprometida USING btree
(idubicacion ASC NULLS LAST, idproducto ASC NULLS LAST)
TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_producto_idproducto
ON mod_logubicacion.dat_ubicacioncomprometida USING btree
(idproducto ASC NULLS LAST)
TABLESPACE pg_default;