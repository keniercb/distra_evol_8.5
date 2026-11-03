DROP VIEW IF EXISTS mod_logistica.v_movimiento_hojainv;

CREATE OR REPLACE VIEW mod_logistica.v_movimiento_hojainv
 AS
 SELECT DISTINCT dp.idindicador,
    dp.idproducto,
    dm.idmovimiento,
    dm.iddocumento,
    dp.codigoproducto,
    dp.nombreproducto,
    dp.preciocontable,
    dp.cuentacontable,
    dum.abreviaturaunidadmedida AS unidadmedidamovimiento,
    COALESCE(dm.cantidad, 0::numeric) AS cantidadmovimiento,
    COALESCE(round(dm.preciocontable, 6), 0::numeric) AS preciocontablemovimiento,
    ( SELECT f_obtenerubicompleta.f_obtenerubicompleta
           FROM mod_loginventario.f_obtenerubicompleta(deup.idestructuraubicacion, deup.nivel) f_obtenerubicompleta(f_obtenerubicompleta)) AS ubicacioncompleta,
    dp.unidadmedidaproducto AS ubicacion
   FROM mod_logistica.dat_movimiento dm
     JOIN mod_logistica.v_producto dp ON dp.idproducto = dm.idproducto
     LEFT JOIN mod_datosmaestros.nom_unidadmedida dum ON dum.idunidadmedida = dm.idunidadmedida
     LEFT JOIN mod_logubicacion.dat_movubicacion dmu ON dm.idmovimiento = dmu.idmovimiento
     LEFT JOIN mod_logubicacion.dat_estructuraubicacion deup ON deup.idestructuraubicacion = dmu.idestructuraubicacion;

ALTER TABLE mod_logistica.v_movimiento_hojainv OWNER TO zeolides;
