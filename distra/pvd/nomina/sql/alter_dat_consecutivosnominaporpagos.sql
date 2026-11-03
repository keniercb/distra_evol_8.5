ALTER TABLE IF EXISTS mod_nomina.dat_consecutivosnominaporpagos
    ADD CONSTRAINT uk_consecutivo_anno UNIQUE (consecutivo, anno);
