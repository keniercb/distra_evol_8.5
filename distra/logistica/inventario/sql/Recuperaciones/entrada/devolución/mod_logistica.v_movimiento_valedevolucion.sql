CREATE OR REPLACE VIEW mod_logistica.v_movimiento_valedevolucion
 AS
 SELECT DISTINCT dp.idindicador,
    dm.idproducto,
    dm.iddocumento,
    dm.idmovimiento,
        CASE
            WHEN ni.numeropieza IS NULL OR ni.numeropieza::text = ''::text THEN ni.codigo
            ELSE ni.numeropieza
        END AS codigoproducto,
    ni.denominacion AS nombreproducto,
    dp.cantidad AS existencia,
    dum.abreviaturaunidadmedida AS unidadmedidamovimiento,
    COALESCE(dm.cantidad, 0::numeric) AS cantidadmovimiento,
    COALESCE(round(dm.importecontable, 2), 0::numeric) AS importetotalmovimiento,
    COALESCE(round(dm.preciocontable, 6), 0::numeric) AS preciounitariototalmovimiento,
    dum.denominacionunidadmedida AS unidadmedidaproducto
   FROM mod_logistica.dat_movimiento dm
     JOIN mod_logistica.dat_producto dp ON dp.idproducto = dm.idproducto
     JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
     LEFT JOIN mod_datosmaestros.nom_unidadmedida dum ON dum.idunidadmedida = dm.idunidadmedida
     LEFT JOIN mod_logubicacion.dat_movubicacion dmu ON dm.idmovimiento = dmu.idmovimiento
     LEFT JOIN mod_logubicacion.dat_estructuraubicacion deup ON deup.idestructuraubicacion = dmu.idestructuraubicacion;

ALTER TABLE mod_logistica.v_movimiento_valedevolucion OWNER TO zeolides;
