CREATE OR REPLACE VIEW mod_logistica.v_producto(
    idindicador,
    idnaturaleza,
    idpais,
    idmarca,
    idmodelo,
    idespecialidad,
    codigo,
    numeropieza,
    codigoproducto,
    nombreproducto,
    marca,
    modelo,
    pais,
    naturaleza,
    especialidad,
    producto,
    tienelote,
    equipo,
    municion,
    idproducto,
    disponible,
    existencia,
    preciocontable,
    precioalternativo,
    importetotalcup,
    importetotalcuc,
    minimo,
    maximo,
    cuentacontable,
    cuentaalternativa,
    categoria,
    deposito,
    codeposito,
    entidad,
    ubicacion,
    cronologia,
    idclasificacioncontable,
    ubicacioncompleta,
    idumedida)
AS
  SELECT ni.idindicador,
         ni.idnaturaleza,
         ni.idpais,
         ni.idmarca,
         ni.idmodelo,
         ni.idespecialidad,
         ni.codigo,
         ni.numeropieza,
         ni.codigoproducto,
         ni.nombreproducto,
         ni.marca,
         ni.modelo,
         ni.pais,
         ni.naturaleza,
         ni.especialidad,
         ni.producto,
         ni.tienelote,
         ni.equipo,
         ni.municion,
         dp.idproducto,
         dp.cantidad -((
                         SELECT COALESCE(sum(dat_cantidadcomprometida.cantidad),
                           0::numeric) AS "coalesce"
                         FROM mod_logistica.dat_cantidadcomprometida
                         WHERE dat_cantidadcomprometida.estado = 1::numeric AND
                               dat_cantidadcomprometida.idproducto =
                                 dp.idproducto
         )) AS disponible,
         dp.cantidad AS existencia,
         dp.precio AS preciocontable,
         dp.precioalternativo,
         dp.importe AS importetotalcup,
         dp.importealternativo AS importetotalcuc,
         dp.minimo,
         dp.maximo,
         (
           SELECT nc1.concatcta
           FROM mod_contabilidad.nom_cuenta nc1
                JOIN mod_logistica.nom_clasificacioncontable ncc ON ncc.idcuenta
                  = nc1.idcuenta
           WHERE ncc.idclasificacioncontable = dp.idclasificacioncontable
         ) AS cuentacontable,
         (
           SELECT nc1.concatcta
           FROM mod_contabilidad.nom_cuenta nc1
                JOIN mod_logistica.nom_clasificacioncontable ncc ON
                  ncc.idcuentaalt = nc1.idcuenta
           WHERE ncc.idclasificacioncontable = dp.idclasificacioncontable
         ) AS cuentaalternativa,
         nc.denominacion AS categoria,
         deop.denominacion AS deposito,
         deop.codigo AS codeposito,
         dte.denominacion AS entidad,
         (
           SELECT concat(eup.descripcion, ' ', eup2.descripcion, ' ',
             eu.descripcion) AS concat
           FROM mod_logubicacion.dat_ubicacionproducto up
                JOIN mod_logubicacion.dat_estructuraubicacion eu ON
                  eu.idestructuraubicacion = up.idubicacion
                LEFT JOIN mod_logubicacion.dat_estructuraubicacion eup2 ON
                  eup2.idestructuraubicacion = eu.idpadre AND
                  eup2.idestructuraubicacion <> eup2.idpadre
                LEFT JOIN mod_logubicacion.dat_estructuraubicacion eup ON
                  eup.idarea = eu.idarea AND eup.idestructuraubicacion =
                  eup.idpadre
           WHERE up.idproducto = dp.idproducto
           LIMIT 1
         ) AS ubicacion,
         dp.cronologia,
         dp.idclasificacioncontable,
         (
           SELECT f_obtenerubicompleta.f_obtenerubicompleta
           FROM mod_loginventario.f_obtenerubicompleta(
             deup.idestructuraubicacion, deup.nivel) f_obtenerubicompleta(
             f_obtenerubicompleta)
         ) AS ubicacioncompleta,
         dp.idumedida
  FROM mod_logistica.dat_producto dp
       JOIN mod_estructuracomp.v_dametodasestructuras deop ON deop.idestructura
         = dp.idestructura
       JOIN mod_estructuracomp.v_dametodasestructuras dte ON dte.idestructura =
         dp.idestructuracomun
       LEFT JOIN mod_logistica.v_indicador ni ON ni.idindicador = dp.idindicador
       LEFT JOIN mod_logistica.nom_categoria nc ON nc.idcategoria =
         dp.idcategoria
       LEFT JOIN mod_logubicacion.dat_ubicacionproducto dup ON dup.idproducto =
         dp.idproducto
       LEFT JOIN mod_logubicacion.dat_estructuraubicacion deup ON
         deup.idestructuraubicacion = dup.idubicacion;
		 
CREATE OR REPLACE VIEW mod_logistica.v_movimiento(
    idindicador,
    idnaturaleza,
    idpais,
    idmarca,
    idmodelo,
    idespecialidad,
    codigo,
    numeropieza,
    codigoproducto,
    nombreproducto,
    marca,
    modelo,
    pais,
    naturaleza,
    especialidad,
    producto,
    tienelote,
    equipo,
    municion,
    idproducto,
    disponible,
    existencia,
    preciocontable,
    precioalternativo,
    importetotalcup,
    importetotalcuc,
    minimo,
    maximo,
    cuentacontable,
    cuentaalternativa,
    categoria,
    deposito,
    codeposito,
    entidad,
    ubicacion,
    idmovimiento,
    iddocumento,
    idunidadmedida,
    unidadmedidamovimiento,
    cantidadmovimiento,
    preciocontablemovimiento,
    importetotalmovimiento,
    existenciaactualmovimiento,
    recargodescuentomovimiento,
    preciounitariototalmovimiento,
    precioalternativomovimiento,
    importetotalaltmovimiento,
    signo,
    cronologia,
    ubicacioncompleta)
AS
  SELECT DISTINCT dp.idindicador,
         dp.idnaturaleza,
         dp.idpais,
         dp.idmarca,
         dp.idmodelo,
         dp.idespecialidad,
         dp.codigo,
         dp.numeropieza,
         dp.codigoproducto,
         dp.nombreproducto,
         dp.marca,
         dp.modelo,
         dp.pais,
         dp.naturaleza,
         dp.especialidad,
         dp.producto,
         dp.tienelote,
         dp.equipo,
         dp.municion,
         dp.idproducto,
         dp.disponible,
         dp.existencia,
         dp.preciocontable,
         dp.precioalternativo,
         dp.importetotalcup,
         dp.importetotalcuc,
         dp.minimo,
         dp.maximo,
         dp.cuentacontable,
         dp.cuentaalternativa,
         dp.categoria,
         dp.deposito,
         dp.codeposito,
         dp.entidad,
         dp.ubicacion,
         dm.idmovimiento,
         dm.iddocumento,
         dm.idunidadmedida,
         dum.abreviaturaunidadmedida AS unidadmedidamovimiento,
         COALESCE(dm.cantidad, 0::numeric) AS cantidadmovimiento,
         COALESCE(round(dm.preciocontable, 6), 0::numeric) AS
           preciocontablemovimiento,
         COALESCE(round(dm.preciocontable * dm.cantidad, 2), 0::numeric) AS
           importetotalmovimiento,
         dm.existenciaactual AS existenciaactualmovimiento,
         COALESCE(round(dm.recargodescuento, 2), 0::numeric) AS
           recargodescuentomovimiento,
         COALESCE(round(dm.preciocontable, 6), 0::numeric) AS
           preciounitariototalmovimiento,
         COALESCE(round(dm.precioalternativo, 6), 0::numeric) AS
           precioalternativomovimiento,
         COALESCE(round(dm.precioalternativo * dm.cantidad, 2), 0::numeric) AS
           importetotalaltmovimiento,
         dm.signo,
         dm.cronologia,
         dp.ubicacioncompleta
  FROM mod_logistica.dat_movimiento dm
       LEFT JOIN mod_datosmaestros.nom_unidadmedida dum ON dum.idunidadmedida =
         dm.idunidadmedida
       LEFT JOIN mod_logistica.v_producto dp ON dp.idproducto = dm.idproducto;