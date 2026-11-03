CREATE VIEW mod_loginventario.v_operaciones (
    clasificacion,
    documento,
    pase,
    signo,
    fecha,
    almacen,
    cd,
    importecup,
    importecuc,
    operacion,
    idestructura,
    idclasificacion)
AS
SELECT DISTINCT nc.denominacion AS clasificacion,
    dd.nrodoc AS documento,
        CASE
            WHEN dm.signo::text = '+'::text THEN 'debe'::text
            ELSE 'haber'::text
        END AS pase,
    dm.signo,
    dd.fechacontable AS fecha,
    v.denominacion AS almacen,
    COALESCE(dc.numerocomprobante::character varying, '-'::character varying) AS cd,
    sum(round(COALESCE(dm.cantidad * dm.preciocontable +
        COALESCE(dm.recargodescuento, 0::numeric), 0::numeric), 2)) AS importecup,
    sum(round(COALESCE(dm.cantidad * dm.precioalternativo +
        COALESCE(dm.recargodescuentoalt, 0::numeric), 0::numeric), 2)) AS importecuc,
    ndp.denominacion AS operacion,
    des.idestructuracomun AS idestructura,
    nc.idclasificacioncontable AS idclasificacion
FROM mod_logistica.dat_movimiento dm
     JOIN mod_logistica.dat_producto dp ON dp.idproducto = dm.idproducto
     JOIN mod_logistica.nom_clasificacioncontable nc ON
         nc.idclasificacioncontable = dm.idclasificacion
     JOIN mod_logistica.dat_documento dd ON dd.iddocumento = dm.iddocumento
     JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura =
         dd.idestructuracomun
     JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc
     JOIN mod_datosmaestros.dat_estructurasubsist des ON
         des.idestructurasubsist = ddp.idestructurasubsist
     JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
     LEFT JOIN mod_contabilidad.dat_comprobante dc ON dc.idcomprobante =
         dd.idcomprobante
WHERE (dd.estado = ANY (ARRAY[3::numeric, 4::numeric])) AND dd.cronologia > 0::numeric
GROUP BY nc.denominacion, dd.nrodoc, dm.signo, dd.fechacontable,
    v.denominacion, dd.iddocumento, dc.numerocomprobante, ndp.denominacion, dd.idcomprobante, des.idestructuracomun, nc.idclasificacioncontable
ORDER BY dm.signo, nc.denominacion, dd.fechacontable, v.denominacion;