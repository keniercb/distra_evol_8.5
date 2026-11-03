DROP VIEW mod_logistica.v_documento CASCADE;
CREATE OR REPLACE VIEW mod_logistica.v_documento(
    iddocumento,
    iddoc,
    creadopor,
    aprobadopor,
    idoperacion,
    idejercicio,
    idestructuracomun,
    idperiodo,
    idcomprobante,
    nrodoc,
    numeroref,
    anno,
    fechacontable,
    observaciones,
    cronologia,
    idestado,
    estado,
    nombrepersona,
    cargopersona,
    nombrepersonaprobar,
    cargopersonaprobar,
    codigoestructura,
    estructura,
    direccionestructura,
    documentoprimario,
    abreviaturadocumentoprimario,
    entidad,
    codigoentidad,
    direccionentidad,
    logo,
    estructuracompleta)
AS
  SELECT dd.iddocumento,
         dd.iddoc,
         dd.idusuario AS creadopor,
         dd.aprobadopor,
         dd.idoperacion,
         dd.idejercicio,
         dd.idestructuracomun,
         dd.idperiodo,
         dd.idcomprobante,
         CASE
           WHEN ci.idestructuracomun = ci.idpadre THEN CASE
                                                         WHEN ci.esminfar = 0::
                                                           numeric THEN
                                                           dd.nrodoc::character
                                                           varying
                                                         WHEN ci.esminfar = 1::
                                                           numeric THEN
                                                           dd.nrodoc::character
                                                           varying
                                                         ELSE NULL::character
                                                           varying
                                                       END
           WHEN ci.idestructuracomun <> ci.idpadre THEN CASE
                                                          WHEN ci.esminfar = 0::
                                                            numeric THEN
                                                            dd.nrodoc::character
                                                            varying
                                                          WHEN ci.esminfar = 1::
                                                            numeric THEN btrim(
                                                            concat(dd.nrodoc,
                                                            '-',

                                                           dpr.codigoestructura,
                                                           '-', vde.codigo), '-'
                                                           ::text)::character
                                                           varying
                                                          ELSE NULL::character
                                                            varying
                                                        END
           ELSE NULL::character varying
         END AS nrodoc,
         dd.numeroref,
         dd.anno,
         dd.fechacontable,
         dd.observaciones,
         dd.cronologia,
         dd.estado AS idestado,
         ne.denominacion AS estado,
         (
           SELECT a.nombre
           FROM mod_logistica.v_responsable a
           WHERE a.idusuario = dd.idusuario
           LIMIT 1
         ) AS nombrepersona,
         (
           SELECT a.cargo
           FROM mod_logistica.v_responsable a
           WHERE a.idusuario = dd.idusuario
           LIMIT 1
         ) AS cargopersona,
         (
           SELECT a.nombre
           FROM mod_logistica.v_responsable a
           WHERE a.idusuario = dd.aprobadopor
           LIMIT 1
         ) AS nombrepersonaprobar,
         (
           SELECT a.cargo
           FROM mod_logistica.v_responsable a
           WHERE a.idusuario = dd.aprobadopor
           LIMIT 1
         ) AS cargopersonaprobar,
         vde.codigo AS codigoestructura,
         vde.denominacion AS estructura,
         vde.direccion AS direccionestructura,
         dpr.denominacion AS documentoprimario,
         dpr.abreviatura AS abreviaturadocumentoprimario,
         CASE
           WHEN ci.idestructuracomun = ci.idpadre THEN CASE
                                                         WHEN ci.esminfar = 0::
                                                           numeric THEN btrim(
                                                           concat(
                                                           dpr.codigoestructura,
                                                           '-', dpr.estructura),
                                                           '-'::text)
                                                         WHEN ci.esminfar = 1::
                                                           numeric THEN
                                                           dpr.codigoestructura
                                                           ::text
                                                         ELSE NULL::text
                                                       END
           WHEN ci.idestructuracomun <> ci.idpadre THEN CASE
                                                          WHEN ci.esminfar = 0::
                                                            numeric THEN btrim(
                                                            concat(

                                                            dpr.codigoestructura,
                                                            '-', dpr.estructura
                                                            ), '-'::text)
                                                          WHEN ci.esminfar = 1::
                                                            numeric THEN ((
                                                                            SELECT
                                                                              _vde.codigo
                                                                            FROM
                                                                              mod_estructuracomp.v_dametodasestructuras
                                                                              _vde
                                                                            WHERE
                                                                              _vde.idestructura
                                                                              =
                                                                              ci.idpadre
                                                                            LIMIT
                                                                              1
         ))::text
                                                          ELSE NULL::text
                                                        END
           ELSE NULL::text
         END AS entidad,
         dpr.codigoestructura AS codigoentidad,
         dpr.direccionestructura AS direccionentidad,
         i.urllogo AS logo,
         btrim(concat(vde.codigo, '-', vde.denominacion), '-'::text) AS
           estructuracompleta,
         nes.denespecialidad AS especialidad
  FROM mod_logistica.dat_documento dd
       JOIN mod_logistica.nom_estado ne ON dd.estado = ne.idestado
       JOIN mod_logistica.v_documentoprimario dpr ON dpr.iddoc = dd.iddoc
       JOIN mod_estructuracomp.v_dametodasestructuras vde ON vde.idestructura =
         dd.idestructuracomun
       LEFT JOIN mod_datosmaestros.nom_especialidad nes ON nes.idespecialidad =
         dd.idespecialidad
       LEFT JOIN mod_loginventario.conf_inventario ci ON ci.idestructuracomun =
         dpr.idestructura
       LEFT JOIN mod_logistica.conf_general i ON i.idestructura =
         dpr.idestructura;
   -- object recreation
--DROP VIEW mod_logistica.v_documentopadre;

CREATE VIEW mod_logistica.v_documentopadre(
    iddocumento,
    iddocumentopadre,
    idpadre,
    creadopor,
    aprobadopor,
    idestructuracomun,
    numerodocumento,
    numeroref,
    fechadocumento,
    codigoestructura,
    estructura,
    direccionestructura,
    documentoprimario,
    abreviaturadocumentoprimario,
    estructuracompleta,
    entidad,
    codigoentidad)
AS
  SELECT dp.iddocumento,
         dp.iddocumentopadre,
         dp.idpadre,
         dd.creadopor,
          dd.aprobadopor,
          dd.idestructuracomun,
          dd.nrodoc AS numerodocumento,
          dd.numeroref,
          dd.fechacontable AS fechadocumento,
          dd.codigoestructura,
          dd.estructura,
          dd.direccionestructura,
          dd.documentoprimario,
          dd.abreviaturadocumentoprimario,
          dd.estructuracompleta as estructuracompleta,
          dd.entidad,
          dd.codigoentidad
  FROM mod_logistica.dat_documentopadre dp
       JOIN mod_logistica.v_documento dd ON dp.idpadre = dd.iddocumento;