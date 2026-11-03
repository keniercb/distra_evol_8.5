CREATE OR REPLACE VIEW mod_logtaller.v_ordentrabajo
 AS
 SELECT DISTINCT dd.iddocumento AS idordentrabajo,
    dd.nrodoc,
    dd.numeroref,
    dd.anno,
    dd.fechacontable,
    dd.estado,
    dd.observaciones,
    dd.codigoentidad,
    dd.entidad,
    COALESCE(vdc.nombre, ''::character varying) AS cliente,
    vp.nombre AS tecnico,
    dot.fechainicio,
    dot.fechafin,
    dot.dictamentecnico,
    dot.importe AS importecup,
    dot.importealternativo AS importecuc,
    dot.fechacierre,
        CASE
            WHEN dot.garantia = 1::numeric THEN 'Si'::text
            ELSE 'No'::text
        END AS garantia,
    dd.creadopor,
    dd.aprobadopor,
    sux.nombreusuario AS cerradopor,
    dd.idestado,
    dot.estadoorden,
    dd.idestructuracomun,
    dd.iddoc,
    dot.idagencia,
    dot.idcliente,
    dot.atributoidentificador AS identificador
   FROM mod_logistica.v_documento dd
     JOIN mod_logtaller.dat_ordentrabajo dot ON dot.idordentrabajo = dd.iddocumento
     LEFT JOIN mod_logistica.v_documentocliente vdc ON vdc.iddocumento = dd.iddocumento
     LEFT JOIN mod_logtaller.v_persona vp ON vp.idpersona = dot.idtecnico
     LEFT JOIN mod_seguridad.seg_usuario sux ON sux.idusuario = dot.cerradopor;

ALTER TABLE mod_logtaller.v_ordentrabajo
    OWNER TO zeolides;

DROP VIEW mod_logistica.v_documentopadre;

DROP VIEW mod_logtaller.v_ordentrabajo;

DROP VIEW mod_logistica.v_documento;

ALTER TABLE mod_logistica.dat_documento
  ALTER COLUMN observaciones TYPE VARCHAR COLLATE pg_catalog."default";
  
-- View: mod_logistica.v_documento

-- DROP VIEW mod_logistica.v_documento;

CREATE OR REPLACE VIEW mod_logistica.v_documento
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
            WHEN ci.idestructuracomun = ci.idpadre THEN
            CASE
                WHEN ci.esminfar = 0::numeric THEN dd.nrodoc::character varying
                WHEN ci.esminfar = 1::numeric THEN dd.nrodoc::character varying
                ELSE NULL::character varying
            END
            WHEN ci.idestructuracomun <> ci.idpadre THEN
            CASE
                WHEN ci.esminfar = 0::numeric THEN dd.nrodoc::character varying
                WHEN ci.esminfar = 1::numeric THEN btrim(concat(dd.nrodoc, '-', dpr.codigoestructura, '-', vde.codigo), '-'::text)::character varying
                ELSE NULL::character varying
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
    ( SELECT a.nombre
           FROM mod_logistica.v_responsable a
          WHERE a.idusuario = dd.idusuario
         LIMIT 1) AS nombrepersona,
    ( SELECT a.cargo
           FROM mod_logistica.v_responsable a
          WHERE a.idusuario = dd.idusuario
         LIMIT 1) AS cargopersona,
    ( SELECT a.nombre
           FROM mod_logistica.v_responsable a
          WHERE a.idusuario = dd.aprobadopor
         LIMIT 1) AS nombrepersonaprobar,
    ( SELECT a.cargo
           FROM mod_logistica.v_responsable a
          WHERE a.idusuario = dd.aprobadopor
         LIMIT 1) AS cargopersonaprobar,
    nop.codigooperacion,
    nop.denominacion AS operacion,
    vde.codigo AS codigoestructura,
    vde.denominacion AS estructura,
    vde.direccion AS direccionestructura,
    dpr.denominacion AS documentoprimario,
    dpr.abreviatura AS abreviaturadocumentoprimario,
    dpr.codigo AS codigocumentoprimario,
    dpr.concepto AS conceptodocumentoprimario,
    nes.denespecialidad AS especialidad,
    btrim(concat(vde.codigo, '-', vde.denominacion), '-'::text) AS estructuracompleta,
        CASE
            WHEN ci.idestructuracomun = ci.idpadre THEN
            CASE
                WHEN ci.esminfar = 0::numeric THEN btrim(concat(vde.codigo, '-', vde.denominacion), '-'::text)
                WHEN ci.esminfar = 1::numeric THEN vde.codigo::text
                ELSE NULL::text
            END
            WHEN ci.idestructuracomun <> ci.idpadre THEN
            CASE
                WHEN ci.esminfar = 0::numeric THEN btrim(concat(vde.codigo, '-', vde.denominacion), '-'::text)
                WHEN ci.esminfar = 1::numeric THEN (( SELECT dat_estructura.codigo
                   FROM mod_estructuracomp.dat_estructura
                  WHERE dat_estructura.idestructura = ci.idpadre
                 LIMIT 1))::text
                ELSE NULL::text
            END
            ELSE NULL::text
        END AS entidad,
    i.urllogo AS logo,
    vde.codigo AS direccion,
    vde.direccion AS codigoentidad,
    ''::character varying AS direccionentidad,
    ''::character varying AS nombrecliente,
    ''::text AS direccioncliente,
    ''::character varying(255) AS nombrecuentacliente,
    ''::character varying(255) AS numerocuentacliente,
    ''::character varying(255) AS direccionsucursalcliente,
    ''::character varying(100) AS numerosucursalcliente
   FROM mod_logistica.dat_documento dd
     JOIN mod_logistica.nom_estado ne ON dd.estado = ne.idestado
     JOIN mod_logistica.v_documentoprimario dpr ON dpr.iddoc = dd.iddoc
     JOIN mod_estructuracomp.v_dametodasestructuras vde ON vde.idestructura = dd.idestructuracomun
     LEFT JOIN mod_datosmaestros.nom_operacion nop ON nop.idnomoperaciones = dd.idoperacion
     LEFT JOIN mod_datosmaestros.nom_especialidad nes ON nes.idespecialidad = dd.idespecialidad
     LEFT JOIN mod_loginventario.conf_inventario ci ON ci.idestructuracomun = dpr.idestructura
     LEFT JOIN mod_logistica.conf_general i ON i.idestructura = dpr.idestructura;

ALTER TABLE mod_logistica.v_documento
    OWNER TO zeolides;

  


CREATE OR REPLACE VIEW mod_logistica.v_documentopadre
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
    dd.codigocumentoprimario,
    dd.estructuracompleta,
    dd.nombrecliente AS cliente,
    dd.entidad,
    dd.codigoentidad
   FROM mod_logistica.dat_documentopadre dp
     JOIN mod_logistica.v_documento dd ON dp.idpadre = dd.iddocumento;

ALTER TABLE mod_logistica.v_documentopadre
    OWNER TO zeolides;


	
CREATE OR REPLACE VIEW mod_logtaller.v_ordentrabajo
 AS
 SELECT DISTINCT dd.iddocumento AS idordentrabajo,
    dd.nrodoc,
    dd.numeroref,
    dd.anno,
    dd.fechacontable,
    dd.estado,
    dd.observaciones,
    dd.codigoentidad,
    dd.entidad,
    COALESCE(vdc.nombre, ''::character varying) AS cliente,
    vp.nombre AS tecnico,
    dot.fechainicio,
    dot.fechafin,
    dot.dictamentecnico,
    dot.importe AS importecup,
    dot.importealternativo AS importecuc,
    dot.fechacierre,
        CASE
            WHEN dot.garantia = 1::numeric THEN 'Si'::text
            ELSE 'No'::text
        END AS garantia,
    dd.creadopor,
    dd.aprobadopor,
    sux.nombreusuario AS cerradopor,
    dd.idestado,
    dot.estadoorden,
    dd.idestructuracomun,
    dd.iddoc,
    dot.idagencia,
    dot.idcliente,
    dot.atributoidentificador AS identificador
   FROM mod_logistica.v_documento dd
     JOIN mod_logtaller.dat_ordentrabajo dot ON dot.idordentrabajo = dd.iddocumento
     LEFT JOIN mod_logistica.v_documentocliente vdc ON vdc.iddocumento = dd.iddocumento
     LEFT JOIN mod_logtaller.v_persona vp ON vp.idpersona = dot.idtecnico
     LEFT JOIN mod_seguridad.seg_usuario sux ON sux.idusuario = dot.cerradopor;

ALTER TABLE mod_logtaller.v_ordentrabajo
    OWNER TO zeolides;

