CREATE OR REPLACE VIEW mod_logistica.v_importetotalmov
 AS
SELECT round(COALESCE(mm.importecontable, 0::numeric) + COALESCE(mm.importealternativo, 0::numeric), 2) AS importetotal,
       round(COALESCE(mm.importecontable, 0::numeric), 2) AS importemb,
       round(COALESCE(mm.importealternativo, 0::numeric), 2) AS importema,
       mm.signo,
       mm.idclasificacion,
       dd.fechacontable,
       dp.idestructuracomun
FROM mod_logistica.dat_movimiento mm
         JOIN mod_logistica.dat_producto dp ON mm.idproducto = dp.idproducto
         JOIN mod_logistica.dat_documento dd ON mm.iddocumento = dd.iddocumento
WHERE mm.idclasificacion IS NOT NULL AND dd.idcomprobante IS NOT NULL AND (dd.estado = ANY (ARRAY[3::numeric, 4::numeric])) AND dd.cronologia > 0::numeric;

ALTER TABLE mod_logistica.v_importetotalmov
    OWNER TO zeolides;

COMMENT ON COLUMN mod_logistica.v_importetotalmov.fechacontable
    IS 'Fecha en que se hizo el documento.';

COMMENT ON COLUMN mod_logistica.v_importetotalmov.idestructuracomun
    IS 'Este campo almacena el id de la estructura por la que se lleva la contabilidad del producto.';