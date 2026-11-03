CREATE VIEW mod_logfacturacion.rpt_facturacion_abc (
    idproducto,
    codigo,
    producto,
    idlineaproducto,
    lineaproducto,
    uindad_medida,
    cantidad,
    precio_cup,
    importe_cup,
    precio_cuc,
    importe_cuc,
    padre,
    cliente,
    ueb,
    idestructura,
    fecha,
    nrofac,
    iddeposito,
    deposito,
    codigodeposito,
    idindicador,
    abreviatura)
AS
SELECT COALESCE(dp.idproducto, elm.idprod) AS idproducto,
    i.numeropieza AS codigo,
    i.denominacion AS producto,
    i.idnaturaleza AS idlineaproducto,
    nn.denominacion AS lineaproducto,
    umm.abreviaturaunidadmedida AS uindad_medida,
    (COALESCE(dm.cantidad, 0::numeric) + COALESCE(elm.cantidad,
        0::numeric))::numeric(25,6) AS cantidad,
    (
    SELECT dmm1.precio
    FROM mod_logistica.dat_movmoneda dmm1
    WHERE dmm1.idmovimiento = dm.idmovimiento AND dmm1.idmoneda =
        '9900000000'::bigint::numeric
    ) AS precio_cup,
        CASE
            WHEN dm.idmovimiento IS NOT NULL THEN COALESCE(round((
    SELECT dmm1.precio * dm.cantidad
    FROM mod_logistica.dat_movmoneda dmm1
    WHERE dmm1.idmovimiento = dm.idmovimiento AND dmm1.idmoneda =
        '9900000000'::bigint::numeric
    ), 2), 0::numeric)
            ELSE COALESCE(round((
    SELECT desg1.preciotarifa * dele1.cantidad
    FROM mod_logfacturacion.dat_elementosfactura dele1
                 JOIN mod_logfacturacion.dat_desgloselemento desg1 ON
                     desg1.idelementofactura = dele1.idelementofactura
    WHERE dele1.idelementofactura = elm.idelementofactura AND desg1.idmoneda =
        '9900000000'::bigint::numeric
    ), 2), 0::numeric)
        END AS importe_cup,
    COALESCE((
    SELECT dmm1.precio
    FROM mod_logistica.dat_movmoneda dmm1
    WHERE dmm1.idmovimiento = dm.idmovimiento AND dmm1.idmoneda <>
        '9900000000'::bigint::numeric
    ), 0::numeric) AS precio_cuc,
        CASE
            WHEN dm.idmovimiento IS NOT NULL THEN COALESCE(round((
    SELECT dmm1.precio * dm.cantidad
    FROM mod_logistica.dat_movmoneda dmm1
    WHERE dmm1.idmovimiento = dm.idmovimiento AND dmm1.idmoneda <>
        '9900000000'::bigint::numeric
    ), 2), 0::numeric)
            ELSE COALESCE(round((
    SELECT desg1.preciotarifa * dele1.cantidad
    FROM mod_logfacturacion.dat_elementosfactura dele1
                 JOIN mod_logfacturacion.dat_desgloselemento desg1 ON
                     desg1.idelementofactura = dele1.idelementofactura
    WHERE dele1.idelementofactura = elm.idelementofactura AND desg1.idmoneda <>
        '9900000000'::bigint::numeric
    ), 2), 0::numeric)
        END AS importe_cuc,
    COALESCE(nccp.nombre, ''::character varying) AS padre,
    COALESCE(ncc.nombre, ''::character varying) AS cliente,
    v.denominacion AS ueb,
    v.idestructura,
    dd.fechacontable AS fecha,
        CASE
            WHEN df.idfactura IS NULL THEN dd.nrodoc
            ELSE df.nrofactura
        END AS nrofac,
        CASE
            WHEN df.idfactura IS NULL THEN dd.idestructuracomun
            ELSE
            CASE
                WHEN df.iddeposito IS NULL THEN dp1.idestructura
                ELSE dp.idestructura
            END
        END AS iddeposito,
        CASE
            WHEN df.idfactura IS NULL THEN deop1.denominacion
            ELSE
            CASE
                WHEN deop.denominacion IS NULL THEN deop2.denominacion
                ELSE deop.denominacion
            END
        END AS deposito,
        CASE
            WHEN df.idfactura IS NULL THEN deop1.codigo
            ELSE
            CASE
                WHEN deop.codigo IS NULL THEN deop2.codigo
                ELSE deop.codigo
            END
        END AS codigodeposito,
    i.idindicador,
    ndp.abreviatura
FROM mod_logistica.dat_documento dd
     LEFT JOIN mod_logfacturacion.dat_docfactura df ON dd.iddocumento = df.idfactura
     LEFT JOIN mod_logistica.dat_documentopadre dpp ON dpp.iddocumento = df.idfactura
     JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc
     JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
     LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = dd.iddocumento
     LEFT JOIN mod_logfacturacion.dat_elementosfactura elm ON elm.idfactura =
         df.idfactura
     LEFT JOIN mod_logfacturacion.dat_prodservnomenclador sn ON
         sn.idelementofactura = elm.idelementofactura
     LEFT JOIN mod_logistica.dat_producto dp ON dp.idproducto = dm.idproducto
     LEFT JOIN mod_logistica.dat_producto dp1 ON dp1.idproducto = elm.idprod
     JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dp.idindicador
         OR i.idindicador = sn.idindicador
     JOIN mod_datosmaestros.nom_naturaleza nn ON nn.idnaturaleza = i.idnaturaleza
     LEFT JOIN mod_datosmaestros.nom_clientesproveedor ncc ON
         ncc.idclientesproveedores = df.idcliente
     LEFT JOIN mod_datosmaestros.nom_unidadmedida umm ON umm.idunidadmedida =
         dp.idumedida
     JOIN mod_datosmaestros.dat_documentoprim dprim ON dprim.iddoc = dd.iddoc
     JOIN mod_datosmaestros.dat_estructurasubsist dest ON
         dest.idestructurasubsist = dprim.idestructurasubsist
     LEFT JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura =
         dest.idestructuracomun
     LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON deop.idestructuraop
         = dp.idestructura
     LEFT JOIN mod_estructuracomp.dat_estructuraop deop2 ON
         deop2.idestructuraop = dp1.idestructura
     LEFT JOIN mod_estructuracomp.dat_estructuraop deop1 ON
         deop1.idestructuraop = dd.idestructuracomun
     LEFT JOIN mod_datosmaestros.nom_clientesproveedor nccp ON ncc.idpadre =
         nccp.idclientesproveedores
WHERE dd.estado = 4::numeric AND (ndp.abreviatura::text = ANY
    (ARRAY['facturaLog'::character varying::text, 'compventaLog'::character varying::text])) AND
        CASE
            WHEN sn.idelementofactura IS NOT NULL THEN sn.tipo = 1::numeric
            ELSE true
        END
ORDER BY dd.fechacontable DESC, v.idestructura, dp.idproducto;

ALTER VIEW mod_logfacturacion.rpt_facturacion_abc
  OWNER TO zeolides;