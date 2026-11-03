ALTER TABLE IF EXISTS mod_logfacturacion.nom_tipoprecio
    ADD COLUMN IF NOT EXISTS es_publico numeric(1, 0) DEFAULT 0;
COMMENT ON COLUMN mod_logfacturacion.nom_tipoprecio.es_publico
    IS 'Indicador de identificación del tipo de precio definido como público.';
ALTER TABLE IF EXISTS mod_logfacturacion.nom_tipoprecio
    ADD CONSTRAINT chk_es_publico CHECK (es_publico in (0,1))
    NOT VALID;
COMMENT ON CONSTRAINT chk_es_publico ON mod_logfacturacion.nom_tipoprecio
    IS 'Deficinion del dominio de valores válidos.';
