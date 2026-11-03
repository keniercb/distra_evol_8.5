CREATE OR REPLACE VIEW mod_logistica.v_importetotalmov
 AS
SELECT round(COALESCE(mm.importecontable, 0::numeric) + COALESCE(mm.importealternativo, 0::numeric), 2) AS importetotal,
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
