DROP TYPE mod_loginventario.td_solicitudentrega CASCADE;
CREATE TYPE mod_loginventario.td_solicitudentrega AS (
  entidad VARCHAR,
  deposito VARCHAR,
  numerodocumento VARCHAR,
  fechadocumento DATE,
  centrocosto VARCHAR,
  logo TEXT,
  reeup VARCHAR,
  aliasdoc VARCHAR,
  estado NUMERIC(2,0),
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR,
  observaciones VARCHAR
);

ALTER TYPE mod_loginventario.td_solicitudentrega
  OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_loginventario.f_modelosolicitudentrega (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_solicitudentrega AS
$body$
declare
all_rec mod_loginventario.td_solicitudentrega;
begin 
for all_rec in
select distinct 
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,

btrim(concat(deop.codigo,'-',deop.denominacion),'-'),

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable as fechadocumento,
btrim(concat(ncc.codigocentrogrupo,'-', ncc.descripcioncentrogrupo),'-'),
i.urllogo,
de.codigo,
ndp.denominacion,
dd.estado,
(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.idusuario) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.idusuario) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.aprobadopor) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor) as cargopersonaprobar,
dd.observaciones
from mod_logistica.dat_documento dd 
inner join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dpr.iddocumentos
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dpr.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dd.idestructuracomun
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = nf.idfila
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = ddc.idcliente
left join mod_logistica.dat_movimiento dm on dd.iddocumento = dm.iddocumento
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;


 CREATE OR REPLACE VIEW mod_logistica.v_persona (
    idpersona,
    nombre,
    idpersonaentidad,
    identidad,
    numero,
    serie,
    principal)
AS
SELECT b.idpersona,
    btrim(concat(b.nombre, ' ', b.snombre, ' ', b.papel, ' ', b.sapel)) AS nombre,
    c.idpersonaentidad,
    c.identidad,
    i.numero,
    i.serie,
    i.principal
FROM mod_persona.dat_persona b
   JOIN mod_persona.dat_personaentidad c ON c.idpersona = b.idpersona AND
       (c.fhasta > now() OR c.fhasta IS NULL)
   LEFT JOIN mod_persona.dat_docidentidad i ON i.idpersona = b.idpersona AND
       i.principal = 1::numeric;

ALTER VIEW mod_logistica.v_persona
  OWNER TO zeolides;

CREATE OR REPLACE VIEW mod_logistica.v_obtenercliente (
    idcliente,
    cliente,
    direccion,
    codigo,
    registrado,
    codigocontable,
    codigonit,
    telefono,
    correo,
    nombrecuenta,
    numerocuenta,
    predeterminado,
    numerosucursal,
    direccionsucursal)
AS
SELECT a.idclientesproveedores AS idcliente,
    COALESCE(
        CASE
            WHEN a.nombre::text <> ''::text THEN a.nombre
            ELSE NULL::character varying
        END,
        CASE
            WHEN a.registrado = 0::numeric THEN a.nombre
            ELSE c.nombre::character varying
        END) AS cliente,
    a.direccion,
    a.codigo,
    a.registrado,
    a.codigocontable,
    a.codigonit,
    a.telefono,
    a.correo,
    d.nombrecuenta,
    d.numerocuenta,
    d.predeterminado,
    s.numero AS numerosucursal,
    s.direccion AS direccionsucursal
FROM mod_datosmaestros.nom_clientesproveedor a
     LEFT JOIN mod_estructuracomp.v_dametodasestructuras b ON a.idestructura =
         b.idestructura
     LEFT JOIN mod_logistica.v_persona c ON c.idpersona = a.idpersona
     LEFT JOIN mod_datosmaestros.dat_cuentabanccliente d ON
         a.idclientesproveedores = d.idclienteproveedores AND d.predeterminado = 1::numeric
     JOIN mod_datosmaestros.nom_sucursal s ON d.idsucursal = s.idsucursal;

ALTER VIEW mod_logistica.v_obtenercliente
  OWNER TO zeolides;
 
  CREATE OR REPLACE VIEW mod_logistica.v_empleado (
    idpersona,
    nombre,
    idcargo,
    cargo)
AS
SELECT b.idpersona,
    b.nombre,
    e.idcargo,
    f.denominacion AS cargo
FROM mod_logistica.v_persona b
   JOIN mod_persona.dat_situacionlaboral d ON d.idpersonaentidad =
       b.idpersonaentidad AND (d.fhasta > now() OR d.fhasta IS NULL)
   JOIN mod_estructuracomp.dat_cargo e ON e.idcargo = d.idcargo
   JOIN mod_estructuracomp.nom_cargo f ON f.idnomcargo = e.idnomcargo;

ALTER VIEW mod_logistica.v_empleado
  OWNER TO zeolides;

CREATE OR REPLACE VIEW mod_logistica.v_responsable (
    idusuario,
    idpersona,
    nombre,
    idcargo,
    cargo)
AS
SELECT a.idusuario,
    b.idpersona,
        CASE
            WHEN b.idpersona IS NOT NULL THEN b.nombre
            ELSE a.nombreusuario
        END AS nombre,
    b.idcargo,
    b.cargo
FROM mod_seguridad.seg_usuario a
   JOIN mod_logistica.v_empleado b ON b.idpersona = a.idpersona;

ALTER VIEW mod_logistica.v_responsable
  OWNER TO zeolides;
  CREATE OR REPLACE VIEW mod_logistica.v_documentocliente (
    iddocumento,
    iddocumentocliente,
    idcliente,
    idclienteproveedores,
    idestructura,
    idcentrogrupo,
    tipocliente,
    codigo,
    nombre,
    direccion,
    nombrecuenta,
    numerocuenta,
    direccionsucursal,
    numerosucursal)
AS

SELECT DISTINCT ddc.iddocumento,
    ddc.iddocumentocliente,
    ddc.idcliente,
    voc.idcliente AS idclienteproveedores,
    deo.idestructura,
    ncc.idcentrogrupo,
    ddc.tipocliente,
        CASE
            WHEN ddc.tipocliente = 1::numeric THEN voc.codigo
            WHEN ddc.tipocliente = 3::numeric THEN deo.codigo
            ELSE ncc.codigocentrogrupo
        END AS codigo,
        CASE
            WHEN ddc.tipocliente = 1::numeric THEN voc.cliente
            WHEN ddc.tipocliente = 3::numeric THEN deo.denominacion
            ELSE ncc.descripcioncentrogrupo
        END AS nombre,
        CASE
            WHEN ddc.tipocliente = 1::numeric THEN voc.direccion::text
            WHEN ddc.tipocliente = 3::numeric THEN deo.direccion::text
            ELSE ''::text
        END AS direccion,
    voc.nombrecuenta,
    voc.numerocuenta,
    voc.direccionsucursal,
    voc.numerosucursal
FROM mod_logistica.dat_documentocliente ddc
     LEFT JOIN mod_estructuracomp.v_dametodasestructuras deo ON ddc.idcliente =
         deo.idestructura
     LEFT JOIN mod_logistica.v_obtenercliente voc ON voc.idcliente = ddc.idcliente
     LEFT JOIN mod_contabilidadcosto.nom_centrocosto ncc ON ncc.idcentrogrupo =
         ddc.idcliente
WHERE ddc.idcliente IS NOT NULL;

ALTER VIEW mod_logistica.v_documentocliente
  OWNER TO zeolides;
 
CREATE OR REPLACE VIEW mod_logistica.v_documentoprimario(
    iddoc,
    iddocumentos,
    idestructurasubsist,
    sigla,
    idgestordocumental,
    idespaciotrabajo,
    denominacion,
    concepto,
    abreviatura,
    codigo,
    idsubsistema,
    idestado,
    aperturado,
    contabiliza,
    idestructuracomun,
    cierra,
    idestructura,
    codigoestructura,
    estructura,
    abreviaturaestructura,
    idconcepto,
    idorgano,
    direccionestructura)
AS
SELECT dpr.iddoc,
         dpr.iddocumentos,
         dpr.idestructurasubsist,
         dpr.sigla,
         dpr.idgestordocumental,
         dpr.idespaciotrabajo,
         ndp.denominacion,
         ndp.concepto,
         ndp.abreviatura,
         ndp.codigo,
         des.idsubsistema,
         des.idestado,
         des.aperturado,
         des.contabiliza,
         des.idestructuracomun,
         des.cierra,
         de.idestructura,
         de.codigo AS codigoestructura,
         de.denominacion AS estructura,
         de.abreviatura AS abreviaturaestructura,
         de.idconcepto,
         de.idorgano,
         de.direccion AS direccionestructura
  FROM mod_datosmaestros.dat_documentoprim dpr
       JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos =
         dpr.iddocumentos
       JOIN mod_datosmaestros.dat_estructurasubsist des ON
         des.idestructurasubsist = dpr.idestructurasubsist
       JOIN mod_estructuracomp.v_dametodasestructuras de ON de.idestructura =
         des.idestructuracomun;
   
ALTER VIEW mod_logistica.v_documentoprimario
  OWNER TO zeolides;
  
CREATE OR REPLACE VIEW mod_logistica.v_documento (
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
    codigooperacion,
    operacion,
    codigoestructura,
    estructura,
    direccionestructura,
    documentoprimario,
    abreviaturadocumentoprimario,
    codigocumentoprimario,
    conceptodocumentoprimario,
    especialidad,
    estructuracompleta,
    entidad,
    logo,
    direccion,
    codigoentidad,
    direccionentidad,
    nombrecliente,
    direccioncliente,
    nombrecuentacliente,
    numerocuentacliente,
    direccionsucursalcliente,
    numerosucursalcliente)
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
                WHEN ci.esminfar = 1::numeric THEN btrim(concat(dd.nrodoc, '-',
                    dpr.codigoestructura, '-', vde.codigo), '-'::text)::character varying
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
                WHEN ci.esminfar = 0::numeric THEN btrim(concat(vde.codigo,
                    '-', vde.denominacion), '-'::text)
                WHEN ci.esminfar = 1::numeric THEN vde.codigo::text
                ELSE NULL::text
            END
            WHEN ci.idestructuracomun <> ci.idpadre THEN
            CASE
                WHEN ci.esminfar = 0::numeric THEN btrim(concat(vde.codigo,
                    '-', vde.denominacion), '-'::text)
                WHEN ci.esminfar = 1::numeric THEN ((
    SELECT dat_estructura.codigo
    FROM mod_estructuracomp.dat_estructura
    WHERE dat_estructura.idestructura = ci.idpadre
    LIMIT 1
    ))::text
                ELSE NULL::text
            END
            ELSE NULL::text
        END AS entidad,
    i.urllogo AS logo,
    vde.codigo AS direccion,
    vde.direccion AS codigoentidad,
    ddc.codigo AS direccionentidad,
    ddc.nombre AS nombrecliente,
    ddc.direccion AS direccioncliente,
    ddc.nombrecuenta AS nombrecuentacliente,
    ddc.numerocuenta AS numerocuentacliente,
    ddc.direccionsucursal AS direccionsucursalcliente,
    ddc.numerosucursal AS numerosucursalcliente
FROM mod_logistica.dat_documento dd
     JOIN mod_logistica.nom_estado ne ON dd.estado = ne.idestado
     JOIN mod_logistica.v_documentoprimario dpr ON dpr.iddoc = dd.iddoc
     JOIN mod_estructuracomp.v_dametodasestructuras vde ON vde.idestructura =
         dd.idestructuracomun
     LEFT JOIN mod_datosmaestros.nom_operacion nop ON nop.idnomoperaciones =
         dd.idoperacion
     LEFT JOIN mod_datosmaestros.nom_especialidad nes ON nes.idespecialidad =
         dd.idespecialidad
     LEFT JOIN mod_loginventario.conf_inventario ci ON ci.idestructuracomun =
         vde.idestructura
     LEFT JOIN mod_logistica.conf_general i ON i.idestructura = vde.idestructura
     LEFT JOIN mod_logistica.v_documentocliente ddc ON ddc.iddocumento =
         ddc.iddocumento;
ALTER VIEW mod_logistica.v_documento
  OWNER TO zeolides;
   -- object recreation
--DROP VIEW mod_logistica.v_documentopadre;

CREATE OR REPLACE VIEW mod_logistica.v_documentopadre(
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
    codigocumentoprimario,
    estructuracompleta,
    cliente,
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
          dd.codigocumentoprimario,
          dd.estructuracompleta as estructuracompleta,
          dd.nombrecliente as cliente,
          dd.entidad,
          dd.codigoentidad
  FROM mod_logistica.dat_documentopadre dp
       JOIN mod_logistica.v_documento dd ON dp.idpadre = dd.iddocumento;
CREATE OR REPLACE VIEW mod_logistica.v_documentotransporte(
    iddocumentotransporte,
    iddocumento,
    idorganizacion,
    nombreconductor,
    ciconductor,
    matricula,
    cartaporte,
    casilla,
    embarque,
    manifiesto,
    partida,
    nombrecomprador,
    cargo,
    cicomprador,
    viatransporte,
    cliente,
    direccion,
    telefono,
    correo,
    codigo,
    codigonit)
AS
  SELECT DISTINCT t.iddocumentotransporte,
         t.iddocumento,
         t.idorganizacion,
         t.nombreconductor,
         t.ciconductor,
         t.matricula,
         t.cartaporte,
         t.casilla,
         t.embarque,
         t.manifiesto,
         t.partida,
         t.nombrecomprador,
         t.cargo,
         t.cicomprador,
         t.viatransporte,
         voc.cliente,
         voc.direccion,
         voc.telefono,
         voc.correo,
         voc.codigo,
         voc.codigonit,
         (case when t.viatransporte = 1 then 'Ferroviario'
                when t.viatransporte = 2 then 'Marítimo'
                when t.viatransporte = 3 then 'Aérea'
                when t.viatransporte = 4 then 'Terrestre'
          end) as viatransportedenominacion
  FROM mod_logistica.dat_documentotransporte t
       LEFT JOIN mod_logistica.v_obtenercliente voc ON voc.idcliente =
         t.idorganizacion
  WHERE t.idorganizacion IS NOT NULL;

ALTER VIEW mod_logistica.v_documentotransporte
  OWNER TO zeolides;
  
  
  
  CREATE OR REPLACE VIEW mod_logistica.v_indicador (
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
    municion)
AS
SELECT DISTINCT ni.idindicador,
    nn.idnaturaleza,
    np.idpais,
    nma.idmarca,
    nmo.idmodelo,
    ne.idespecialidad,
    ni.codigo,
    ni.numeropieza,
        CASE
            WHEN ni.numeropieza IS NULL OR ni.numeropieza::text = ''::text THEN
                ni.codigo
            ELSE ni.numeropieza
        END AS codigoproducto,
    ni.denominacion AS nombreproducto,
    nma.denominacion AS marca,
    nmo.denominacion AS modelo,
    np.nombrepais AS pais,
    nn.denominacion AS naturaleza,
    ne.denespecialidad AS especialidad,
        CASE
            WHEN nih.tipocontrol = 1::numeric THEN 1
            ELSE 0
        END AS producto,
        CASE
            WHEN nih.tipocontrol = 2::numeric THEN 1
            ELSE 0
        END AS tienelote,
        CASE
            WHEN nih.tipocontrol = 3::numeric THEN 1
            ELSE 0
        END AS equipo,
        CASE
            WHEN nih.tipocontrol = 4::numeric THEN 1
            ELSE 0
        END AS municion
FROM mod_datosmaestros.nom_indicador ni
   LEFT JOIN mod_datosmaestros.nom_indicadorhoja nih ON nih.idindicador = ni.idindicador
   LEFT JOIN mod_datosmaestros.nom_pais np ON np.idpais = ni.idpais
   LEFT JOIN mod_datosmaestros.nom_naturaleza nn ON nn.idnaturaleza = ni.idnaturaleza
   LEFT JOIN mod_datosmaestros.nom_especialidad ne ON ne.idespecialidad =
       ni.idespecialidad
   LEFT JOIN mod_datosmaestros.nom_marca nma ON nih.idmarca = nma.idmarca
   LEFT JOIN mod_datosmaestros.nom_modelo nmo ON nih.idmodelo = nmo.idmodelo;

ALTER VIEW mod_logistica.v_indicador
  OWNER TO zeolides;
  
  
  
 CREATE OR REPLACE VIEW mod_logistica.v_producto (
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
    cronologia)
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
    dp.cantidad - ((
    SELECT COALESCE(sum(dat_cantidadcomprometida.cantidad), 0::numeric) AS "coalesce"
    FROM mod_logistica.dat_cantidadcomprometida
    WHERE dat_cantidadcomprometida.estado = 1::numeric AND
        dat_cantidadcomprometida.idproducto = dp.idproducto
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
      JOIN mod_logistica.nom_clasificacioncontable ncc ON ncc.idcuenta = nc1.idcuenta
    WHERE ncc.idclasificacioncontable = dp.idclasificacioncontable
    ) AS cuentacontable,
    (
    SELECT nc1.concatcta
    FROM mod_contabilidad.nom_cuenta nc1
      JOIN mod_logistica.nom_clasificacioncontable ncc ON ncc.idcuentaalt = nc1.idcuenta
    WHERE ncc.idclasificacioncontable = dp.idclasificacioncontable
    ) AS cuentaalternativa,
    nc.denominacion AS categoria,
    deop.denominacion AS deposito,
    deop.codigo AS codeposito,
    dte.denominacion AS entidad,
    (
    SELECT concat(eup.descripcion, ' ', eup2.descripcion, ' ', eu.descripcion) AS concat
    FROM mod_logubicacion.dat_ubicacionproducto up
      JOIN mod_logubicacion.dat_estructuraubicacion eu ON
          eu.idestructuraubicacion = up.idubicacion
   LEFT JOIN mod_logubicacion.dat_estructuraubicacion eup2 ON
       eup2.idestructuraubicacion = eu.idpadre AND eup2.idestructuraubicacion <> eup2.idpadre
   LEFT JOIN mod_logubicacion.dat_estructuraubicacion eup ON eup.idarea =
       eu.idarea AND eup.idestructuraubicacion = eup.idpadre
    WHERE up.idproducto = dp.idproducto
    LIMIT 1
    ) AS ubicacion,
    dp.cronologia
FROM mod_logistica.dat_producto dp
   JOIN mod_estructuracomp.v_dametodasestructuras deop ON deop.idestructura =
       dp.idestructura
   JOIN mod_estructuracomp.v_dametodasestructuras dte ON dte.idestructura =
       dp.idestructuracomun
   LEFT JOIN mod_logistica.v_indicador ni ON ni.idindicador = dp.idindicador
   LEFT JOIN mod_logistica.nom_categoria nc ON nc.idcategoria = dp.idcategoria;

ALTER VIEW mod_logistica.v_producto
  OWNER TO zeolides; 
  
  
  
  
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
    cronologia)
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
         COALESCE(round(dm.preciocontable * dm.cantidad + COALESCE(
           dm.recargodescuento, 0::numeric), 2), 0::numeric) AS
           importetotalmovimiento,
         dm.existenciaactual AS existenciaactualmovimiento,
         COALESCE(round(dm.recargodescuento, 2), 0::numeric) AS
           recargodescuentomovimiento,
         COALESCE(round(dm.preciocontable, 6), 0::numeric) + COALESCE(round(
           dm.recargodescuento / CASE
                                   WHEN dm.cantidad = 0::numeric THEN 1::numeric
                                   ELSE dm.cantidad
                                 END, 6), 0::numeric) AS
                                   preciounitariototalmovimiento,
         COALESCE(round(dm.precioalternativo, 6), 0::numeric) AS
           precioalternativomovimiento,
         COALESCE(round(dm.precioalternativo * dm.cantidad +
           dm.recargodescuentoalt, 2), 0::numeric) AS importetotalaltmovimiento,
         dm.signo,
         dm.cronologia
  FROM mod_logistica.dat_movimiento dm
       LEFT JOIN mod_datosmaestros.nom_unidadmedida dum ON dum.idunidadmedida =
         dm.idunidadmedida
       LEFT JOIN mod_logistica.v_producto dp ON dp.idproducto = dm.idproducto;


	   
CREATE OR REPLACE VIEW mod_logistica.v_prodorden (
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
    idprodorden,
    idorden,
    cancelar,
    cantidadordenada,
    idcliente,
    idprodorigen,
    motivo)
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
    dm.idprodorden,
    dm.idorden,
    dm.cancelar,
    dm.cantidad AS cantidadordenada,
    dm.idcliente,
    dm.idprodorigen,
    dm.motivo
FROM mod_logdistribucion.dat_prodorden dm
   LEFT JOIN mod_logistica.v_producto dp ON dp.idproducto = dm.idproducto;

ALTER VIEW mod_logistica.v_prodorden
  OWNER TO zeolides;
  
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
    codigooperacion,
    operacion,
    codigoestructura,
    estructura,
    direccionestructura,
    documentoprimario,
    abreviaturadocumentoprimario,
    codigocumentoprimario,
    conceptodocumentoprimario,
    especialidad,
    estructuracompleta,
    entidad,
    logo,
    direccion,
    codigoentidad,
    direccionentidad,
    nombrecliente,
    direccioncliente,
    nombrecuentacliente,
    numerocuentacliente,
    direccionsucursalcliente,
    numerosucursalcliente)
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
         btrim(concat(vde.codigo, '-', vde.denominacion), '-'::text) AS
           estructuracompleta,
         CASE
           WHEN ci.idestructuracomun = ci.idpadre THEN CASE
                                                         WHEN ci.esminfar = 0::
                                                           numeric THEN btrim(
                                                           concat(vde.codigo,
                                                           '-', vde.denominacion
                                                           ), '-'::text)
                                                         WHEN ci.esminfar = 1::
                                                           numeric THEN
                                                           vde.codigo::text
                                                         ELSE NULL::text
                                                       END
           WHEN ci.idestructuracomun <> ci.idpadre THEN CASE
                                                          WHEN ci.esminfar = 0::
                                                            numeric THEN btrim(
                                                            concat(vde.codigo,
                                                            '-',
                                                            vde.denominacion),
                                                            '-'::text)
                                                          WHEN ci.esminfar = 1::
                                                            numeric THEN ((
                                                                            SELECT
                                                                              dat_estructura.codigo
                                                                            FROM
                                                                              mod_estructuracomp.dat_estructura
                                                                            WHERE
                                                                              dat_estructura.idestructura
                                                                              =
                                                                              ci.idpadre
                                                                            LIMIT
                                                                              1
         ))::text
                                                          ELSE NULL::text
                                                        END
           ELSE NULL::text
         END AS entidad,
         i.urllogo AS logo,
         vde.codigo AS direccion,
         vde.direccion AS codigoentidad,
         ddc.codigo AS direccionentidad,
         ddc.nombre AS nombrecliente,
         ddc.direccion AS direccioncliente,
         ddc.nombrecuenta AS nombrecuentacliente,
         ddc.numerocuenta AS numerocuentacliente,
         ddc.direccionsucursal AS direccionsucursalcliente,
         ddc.numerosucursal AS numerosucursalcliente
  FROM mod_logistica.dat_documento dd
       JOIN mod_logistica.nom_estado ne ON dd.estado = ne.idestado
       JOIN mod_logistica.v_documentoprimario dpr ON dpr.iddoc = dd.iddoc
       JOIN mod_estructuracomp.v_dametodasestructuras vde ON vde.idestructura =
         dpr.idestructuracomun
       LEFT JOIN mod_datosmaestros.nom_operacion nop ON nop.idnomoperaciones =
         dd.idoperacion
       LEFT JOIN mod_datosmaestros.nom_especialidad nes ON nes.idespecialidad =
         dd.idespecialidad
       LEFT JOIN mod_loginventario.conf_inventario ci ON ci.idestructuracomun =
         vde.idestructura
       LEFT JOIN mod_logistica.conf_general i ON i.idestructura =
         vde.idestructura
       LEFT JOIN mod_logistica.v_documentocliente ddc ON ddc.iddocumento =
         ddc.iddocumento;
		 
	DROP TYPE mod_loginventario.td_modelohojadeinventario CASCADE;
CREATE TYPE mod_loginventario.td_modelohojadeinventario AS (
  nrodoc VARCHAR,
  fechacreacion DATE,
  deposito VARCHAR,
  creadopor VARCHAR,
  nroajuste VARCHAR,
  aliasdoc VARCHAR,
  estado NUMERIC(2,0),
  numeroref NUMERIC(19,0),
  entidad VARCHAR,
  nombrepersona VARCHAR,
  cargopersona VARCHAR,
  nombrepersonaprobar VARCHAR,
  cargopersonaprobar VARCHAR,
  observaciones VARCHAR,
  logo VARCHAR,
  reup VARCHAR
);

ALTER TYPE mod_loginventario.td_modelohojadeinventario
  OWNER TO zeolides;
  
DROP TYPE mod_loginventario.td_modelohojadeinventarioproducto CASCADE;
  CREATE TYPE mod_loginventario.td_modelohojadeinventarioproducto AS (
  idubicacion NUMERIC(19,0),
  ubicacion VARCHAR,
  ubicacioncompleta TEXT,
  idproducto NUMERIC(19,0),
  codigo VARCHAR,
  denomprod VARCHAR,
  um VARCHAR,
  cantidadubicada NUMERIC(25,6),
  existencia NUMERIC(25,6),
  cantfaltantes NUMERIC(19,0),
  valorfaltantes NUMERIC(25,6),
  cantsobrante NUMERIC(19,0),
  valorsobrante NUMERIC(25,6),
  precio NUMERIC(19,6),
  numeropieza VARCHAR,
  conteo NUMERIC(19,0),
  importecontable NUMERIC(25,6),
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  cuenta VARCHAR,
  cuentaalt VARCHAR,
  importeexistencia NUMERIC(25,6),
  preciopromedioalternativo NUMERIC(25,6),
  idclasificacioncontable NUMERIC(19,0),
  idmovimiento NUMERIC(19,0),
  monedaalternativa VARCHAR(50),
  monedacontable VARCHAR(50)
);

ALTER TYPE mod_loginventario.td_modelohojadeinventarioproducto
  OWNER TO zeolides;
CREATE OR REPLACE FUNCTION mod_loginventario.f_modelohojadeinventario (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modelohojadeinventario AS
$body$
declare
  v_rec  mod_loginventario.td_modelohojadeinventario;
begin
for v_rec in
select distinct
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,
dd.fechacontable,
btrim(concat(deop.codigo,'-',deop.denominacion),'-') as deposito,
su.nombreusuario as creadopor,
(select string_agg(cast(ddi.nrodoc as varchar),',') from mod_loginventario.dat_ajuste da
inner join mod_logistica.dat_documento ddi on ddi.iddocumento = da.idajuste
where da.idinventario = dd.iddocumento) as nroajuste,
ndp.denominacion,
dd.estado,
dd.numeroref,
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(coalesce(de.codigo, deop1.codigo),'-',coalesce(de.denominacion, deop1.denominacion)),'-') when ci.esminfar = 1 then coalesce(de.codigo, deop1.codigo) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(coalesce(de.codigo, deop1.codigo),'-',coalesce(de.denominacion, deop1.denominacion)),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.dat_estructura where idestructura = ci.idpadre limit 1) end)
end) as entidad,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.idusuario limit 1) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.idusuario limit 1) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.aprobadopor limit 1) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar,
dd.observaciones,
i.urllogo,
''
from mod_logistica.dat_documento dd
inner join mod_loginventario.dat_inventario di on di.idinventario = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_estructuracomp.dat_estructura de on de.idestructura = des.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deop1 on deop1.idestructuraop = des.idestructuracomun
left join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
where dd.iddocumento = p_iddocumento
limit 1
loop 
return next v_rec; 
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelohojadeinventario (p_iddocumento numeric)
  OWNER TO zeolides;
  
    
  CREATE OR REPLACE FUNCTION mod_loginventario.f_modelohojadeinventarioproducto (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_modelohojadeinventarioproducto AS
$body$
declare
  v_rec mod_loginventario.td_modelohojadeinventarioproducto;
begin
for v_rec in
select distinct
dup.idubicacion as idubicacion,
deup.descripcion as ubicacion,
(select * from mod_loginventario.f_obtenerubicompleta(deup.idestructuraubicacion,deup.nivel)) as ubicacioncompleta,
dp.idproducto,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
ni.denominacion as denomprod,
dum.abreviaturaunidadmedida as um,
coalesce(dup.cantidad,0) as cantidadubicada,
dp.cantidad as existencia,
(case when dm.cantidad < dm.existenciaactual then dm.existenciaactual - dm.cantidad end) as cantidadfaltante,
(case when dm.cantidad < dm.existenciaactual then dm.preciopromedio * (dm.existenciaactual - dm.cantidad) end) as valorfaltantes,
(case when dm.cantidad > dm.existenciaactual then dm.cantidad - dm.existenciaactual end) as cantidadsobrante,
(case when dm.cantidad > dm.existenciaactual then dm.preciopromedio * (dm.cantidad - dm.existenciaactual) end) as valorsobrante,
dp.precio,
ni.numeropieza,
dm.cantidad as conteo,
coalesce(dm.importecontable,0),
coalesce(dm.precioalternativo,0),0,
(select nc.concatcta from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuenta,
(select nc.concatcta from mod_contabilidad.nom_cuenta nc 
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta 
where ncc.idclasificacioncontable = dp.idclasificacioncontable) as cuentaalt,
round((coalesce(dp.cantidad,0) * coalesce(dp.precio,0)),2) as importe,
dp.precioalternativo as preciopromedioalternativo,  
dp.idclasificacioncontable, 
dm.idmovimiento,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedaalternativa) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_monedacontable) as monedacontable
from mod_logistica.dat_movimiento dm
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = ni.idumedida
left join mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dp.idproducto
left join mod_logubicacion.dat_estructuraubicacion deup on deup.idestructuraubicacion = dup.idubicacion
where dm.iddocumento = p_iddocumento
--order by dp.idclasificacioncontable,dm.idmovimiento
order by ni.numeropieza, dp.idclasificacioncontable
loop return next v_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelohojadeinventarioproducto (p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric)
  OWNER TO zeolides;
  
	CREATE OR REPLACE FUNCTION mod_loginventario.f_modelohojadeinventario (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_modelohojadeinventario AS
$body$
declare
  v_rec  mod_loginventario.td_modelohojadeinventario;
begin
for v_rec in
select distinct
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,
dd.fechacontable,
btrim(concat(deop.codigo,'-',deop.denominacion),'-') as deposito,
su.nombreusuario as creadopor,
(select string_agg(cast(ddi.nrodoc as varchar),',') from mod_loginventario.dat_ajuste da
inner join mod_logistica.dat_documento ddi on ddi.iddocumento = da.idajuste
where da.idinventario = dd.iddocumento) as nroajuste,
ndp.denominacion,
dd.estado,
dd.numeroref,
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(coalesce(de.codigo, deop1.codigo),'-',coalesce(de.denominacion, deop1.denominacion)),'-') when ci.esminfar = 1 then coalesce(de.codigo, deop1.codigo) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(coalesce(de.codigo, deop1.codigo),'-',coalesce(de.denominacion, deop1.denominacion)),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.dat_estructura where idestructura = ci.idpadre limit 1) end)
end) as entidad,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.idusuario limit 1) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.idusuario limit 1) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = dd.aprobadopor limit 1) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = dd.aprobadopor limit 1) as cargopersonaprobar,
dd.observaciones,
i.urllogo,
''
from mod_logistica.dat_documento dd
inner join mod_loginventario.dat_inventario di on di.idinventario = dd.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_estructuracomp.dat_estructura de on de.idestructura = des.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deop1 on deop1.idestructuraop = des.idestructuracomun
left join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_logistica.conf_general i on i.idestructura = des.idestructuracomun
where dd.iddocumento = p_iddocumento
limit 1
loop 
return next v_rec; 
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modelohojadeinventario (p_iddocumento numeric)
  OWNER TO zeolides;	 
		 
		 
CREATE OR REPLACE FUNCTION mod_loginventario.f_listarhojainventario (
  p_idestructuraop numeric,
  p_estado numeric,
  p_contabilizadopor numeric,
  p_creadopor numeric,
  p_fechainicio date,
  p_fechafin date,
  p_tipoinventario numeric,
  p_idestructura numeric
)
RETURNS SETOF mod_loginventario.td_listarhojainventario AS
$body$
declare
  all_rec mod_loginventario.td_listarhojainventario;
begin
for all_rec in
select
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then cast(dd.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(dd.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(dd.nrodoc,'-',de.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

dd.fechacontable,
case when dd.estado = 1 then 'Elaboración'
     when dd.estado = 2 then 'Preparado'
     when dd.estado = 3 then 'Aprobado'
else null end as estado,

case when di.tipoinventario = 1 then 'Inventario diario'
     when di.tipoinventario = 2 then 'Inventario mensual'
     when di.tipoinventario = 3 then 'Inventario parcial'
     when di.tipoinventario = 4 then 'Inventario general'
else null end as tipoinventario,

btrim(concat(deop.codigo,'-',deop.denominacion),'-'),
su.nombreusuario as creadopor,
su1.nombreusuario as aprobadopor,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then de.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(de.codigo,'-',de.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,

(select count(*) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento)as cantidad,

i.urllogo,

(select min(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_datosmaestros.dat_documentoprim dddp on dddp.iddoc = ddd.iddoc
inner join mod_datosmaestros.nom_docprim dndp on dndp.iddocumentos = dddp.iddocumentos 
where ddd.idestructuracomun = $1 and dndp.abreviatura = 'inventariogLog') as fechaminima,

(select max(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_datosmaestros.dat_documentoprim dddp on dddp.iddoc = ddd.iddoc
inner join mod_datosmaestros.nom_docprim dndp on dndp.iddocumentos = dddp.iddocumentos 
where ddd.idestructuracomun = $1 and dndp.abreviatura = 'inventariogLog') as fechamaxima,
deop.codigo,
(case when (select dea.estado
from mod_estructuracomp.nom_filaestruc nf
inner join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = nf.idfila
where nf.idfila = deop.idestructuraop) = 1 then 'Abierto' else 'Cerrado' end) as estadoop,
dd.numeroref
from mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
inner join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_logistica.conf_general i on i.idestructura = des.idestructuracomun
left join mod_loginventario.dat_inventario di on di.idinventario = dd.iddocumento
where ndp.abreviatura = 'inventariogLog' 
and dd.idestructuracomun = $1 and de.idestructura = $8
and dd.estado in(1,2,3)
and (dd.estado = $2 or $2 is null)
and (su.idusuario = $4 or $4 is null)
and (su1.idusuario = $3 or $3 is null)
and ((dd.fechacontable >= $5 or $5 is null) and (dd.fechacontable <= $6 or $6 is null))
and (di.tipoinventario = $7 or $7 is null)
order by dd.iddocumento desc

loop
  return next all_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;		 