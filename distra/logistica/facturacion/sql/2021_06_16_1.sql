CREATE OR REPLACE VIEW mod_estructuracomp.v_dametodasestructuras(
    idestructura,
    codigo,
    denominacion,
    abreviatura,
    idconcepto,
    idorgano,
    direccion,
    codigonit,
    correo)
AS
  SELECT fila.idfila AS idestructura,
         CASE
           WHEN estructura.codigo::text <> ''::text THEN estructura.codigo
           WHEN estructuraop.codigo::text <> ''::text THEN estructuraop.codigo
           ELSE NULL::character varying (20)
         END AS codigo,
         CASE
           WHEN estructura.denominacion::text <> ''::text THEN
             estructura.denominacion
           WHEN estructuraop.denominacion::text <> ''::text THEN
             estructuraop.denominacion
           ELSE NULL::character varying
         END AS denominacion,
         CASE
           WHEN estructura.abreviatura::text <> ''::text THEN
             estructura.abreviatura
           WHEN estructuraop.abreviatura::text <> ''::text THEN
             estructuraop.abreviatura
           ELSE NULL::character varying
         END AS abreviatura,
         CASE
           WHEN estructura.idconcepto IS NOT NULL THEN estructura.idconcepto
           WHEN estructuraop.idconcepto IS NOT NULL THEN estructuraop.idconcepto
           ELSE NULL::numeric
         END AS idconcepto,
         CASE
           WHEN estructura.idorgano IS NOT NULL THEN estructura.idorgano
           WHEN estructuraop.idorgano IS NOT NULL THEN estructuraop.idorgano
           ELSE NULL::numeric
         END AS idorgano,
         CASE
           WHEN estructura.direccion::text <> ''::text THEN estructura.direccion
           WHEN estructuraop.direccion::text <> ''::text THEN
             estructuraop.direccion
           ELSE NULL::character varying
         END AS direccion,
         CASE
           WHEN estructura.codigonit::text <> ''::text THEN estructura.codigonit
           WHEN estructuraop.codigonit::text <> ''::text THEN
             estructuraop.codigonit
           ELSE NULL::character varying
         END AS codigonit,
         CASE
           WHEN estructura.correo::text <> ''::text THEN estructura.correo
           WHEN estructuraop.correo::text <> ''::text THEN estructuraop.correo
           ELSE NULL::character varying
         END AS correo
  FROM mod_estructuracomp.nom_filaestruc fila
       JOIN mod_estructuracomp.nom_concepto nomeav ON fila.idconcepto =
         nomeav.idconcepto
       LEFT JOIN mod_estructuracomp.dat_estructura estructura ON
         estructura.idestructura = fila.idfila AND (estructura.idestado = 0::
         numeric OR estructura.idproyecto = 0::numeric)
       LEFT JOIN mod_estructuracomp.nom_organo orgest ON orgest.idorgano =
         estructura.idorgano AND orgest.idconcepto = fila.idconcepto
       LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop ON
         estructuraop.idestructuraop = fila.idfila AND (estructuraop.idestado =
         0::numeric OR estructuraop.idproyecto = 0::numeric)
       LEFT JOIN mod_estructuracomp.nom_organo orgestop ON orgestop.idorgano =
         estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto
  WHERE fila.fechafin IS NULL AND
        (estructura.denominacion::text <> ''::text OR
        estructuraop.denominacion::text <> ''::text)
  ORDER BY fila.ordenunico;

DROP FUNCTION mod_logfacturacion.f_modelofacturacab(p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric, p_idestructura numeric);

DROP TYPE mod_logfacturacion.td_modelofactura;

CREATE TYPE mod_logfacturacion.td_modelofactura AS (
  folio VARCHAR,
  nrofactura VARCHAR,
  fechacontable DATE,
  fechavencimiento DATE,
  formapago VARCHAR,
  proveedor VARCHAR,
  dirproveedor VARCHAR,
  codigoproveedor VARCHAR,
  nitproveedor VARCHAR,
  registrocomercialcupproveedor VARCHAR,
  registrocomercialcucproveedor VARCHAR,
  cuentabancariacupproveedor VARCHAR,
  cuentabancariacucproveedor VARCHAR,
  titularcup VARCHAR,
  titularcuc VARCHAR,
  comprador VARCHAR,
  cicomprador VARCHAR,
  cliente VARCHAR,
  dircliente VARCHAR,
  codigocliente VARCHAR,
  nitcliente VARCHAR,
  registrocomercialcupcliente VARCHAR,
  registrocomercialcuccliente VARCHAR,
  cuentabancariacupcliente VARCHAR,
  cuentabancariacuccliente VARCHAR,
  observaciones VARCHAR,
  subtotalcup NUMERIC(25,2),
  subtotalcuc NUMERIC(25,2),
  recargocup NUMERIC(25,2),
  recargocuc NUMERIC(25,2),
  matriculaserie VARCHAR,
  orgtransp VARCHAR,
  conductor VARCHAR,
  ciconductor VARCHAR,
  licenciaconductor VARCHAR,
  chapa VARCHAR,
  cartaporte VARCHAR(50),
  fechaconductor DATE,
  recdes NUMERIC(25,6),
  entregadopor VARCHAR,
  fechaentregadopor DATE,
  recibidopor VARCHAR,
  cirecibidopor VARCHAR,
  fecharecibidopor DATE,
  facturadopor VARCHAR,
  fechafacturadopor DATE,
  otop VARCHAR,
  contabilizadopor VARCHAR,
  fechacontabilizadopor DATE,
  entidad VARCHAR,
  numerocontrato VARCHAR,
  fechacontrato DATE,
  telefono VARCHAR,
  one VARCHAR(12),
  ciudad VARCHAR,
  logo VARCHAR,
  vendedor VARCHAR,
  bultos NUMERIC,
  sellos VARCHAR,
  contenedor VARCHAR,
  licencia VARCHAR,
  cargofacturadopor VARCHAR,
  cargocontabilizadopor VARCHAR,
  sucursalcup VARCHAR,
  sucursalcuc VARCHAR,
  deposito VARCHAR,
  fechaotop VARCHAR,
  moneda VARCHAR,
  nroreferencia VARCHAR,
  estado NUMERIC,
  descuentocup NUMERIC,
  descuentocuc NUMERIC,
  correo VARCHAR,
  sucursalprovcup VARCHAR,
  operacion VARCHAR,
  denomviatransp VARCHAR
);

ALTER TYPE mod_logfacturacion.td_modelofactura
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modelofacturacab (
  p_iddocumento numeric,
  p_monedacontable numeric,
  p_monedalternativa numeric,
  p_idestructura numeric
)
RETURNS SETOF mod_logfacturacion.td_modelofactura AS
$body$
declare
all_rec mod_logfacturacion.td_modelofactura;
v_rec record;
v_recdes numeric = 0;
begin
for all_rec in
select 
'-' as nrofactura,
(case when ddf.oferta = 0 then btrim(concat(nsd.denominacion,'-',ddf.nrofactura),'-') else btrim(concat('',dd.numeroref),'-') end) as nrofactura,
dd.fechacontable,
ddf.fechavencimiento as fechavencimiento,  
(select ntp.nombre from mod_datosmaestros.nom_terminosdepago ntp where ntp.idterminodepago = ddf.idcondicionpago) as formapago,      
de.denominacion as proveedor,
de.direccion as dirproveedor,
de.codigo as codigoproveedor,        
 (coalesce(de.codigonit,'           ')||'  NIRC:'|| '') as nitproveedor,
 '' as registrocomercialcupproveedor,
 '' as registrocomercialcucproveedor,
(select array_to_string(array_agg(ncb.nrocuenta),', ') from mod_banco.nom_cuentabancaria ncb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = ncb.idbanco  
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = ncb.idsucursal
  where ncb.idcuentabancaria in (select dcf1.idcuenta from mod_logfacturacion.conf_cuentafactura dcf1
where dcf1.idestructuracomun = de.idestructura and ncb.idmoneda = $2) and ncb.idestructuracomun = de.idestructura) as cuentabancariacupproveedor,

(select array_to_string(array_agg(ncb.nrocuenta),', ') from mod_banco.nom_cuentabancaria ncb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = ncb.idbanco  
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = ncb.idsucursal
  where ncb.idcuentabancaria in (select dcf1.idcuenta from mod_logfacturacion.conf_cuentafactura dcf1
where dcf1.idestructuracomun = de.idestructura and ncb.idmoneda = $3) and ncb.idestructuracomun = de.idestructura) as cuentabancariacucproveedor,

(select array_to_string(array_agg(ncb.nombrecuentabancaria),', ') from mod_banco.nom_cuentabancaria ncb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = ncb.idbanco  
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = ncb.idsucursal
  where ncb.idcuentabancaria in (select dcf1.idcuenta from mod_logfacturacion.conf_cuentafactura dcf1
where dcf1.idestructuracomun = $4) and ncb.idestructuracomun = de.idestructura and ncb.idmoneda = $2) as titularcup,

(select array_to_string(array_agg(ncb.nombrecuentabancaria),', ') from mod_banco.nom_cuentabancaria ncb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = ncb.idbanco  
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = ncb.idsucursal
  where ncb.idcuentabancaria in (select dcf1.idcuenta from mod_logfacturacion.conf_cuentafactura dcf1
where dcf1.idestructuracomun = $4) and ncb.idestructuracomun = de.idestructura and ncb.idmoneda = $3) as titularcuc,
(select c.nombre from mod_datosmaestros.nom_contacto c where c.idcontacto = ddf.idcontacto) as comprador,
(select c.numeroidentidad from mod_datosmaestros.nom_contacto c where c.idcontacto = ddf.idcontacto) as cicomprador,
(select coalesce(ncp.nombre,de.denominacion) from mod_datosmaestros.nom_clientesproveedor ncp 
    left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
    where ncp.idclientesproveedores = ddc.idcliente) as cliente,
(select coalesce(ncp.direccion,de.direccion)
  from mod_datosmaestros.nom_clientesproveedor ncp 
  left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
  where ncp.idclientesproveedores = ddc.idcliente) as dircliente,
(select coalesce(ncp.codigo,de.codigo)
  from mod_datosmaestros.nom_clientesproveedor ncp 
  left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
  where ncp.idclientesproveedores = ddc.idcliente) ||'  NIT:'|| '' as codigocliente,
 COALESCE((select ncp.codigonit
  from mod_datosmaestros.nom_clientesproveedor ncp 
  where ncp.idclientesproveedores = ddc.idcliente), '           ')||'  NIRC:'|| '' as nitcliente, 
 (select array_to_string(array_agg(dcb.nombrecuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
  where dcb.idcuentabancliente in (select dcc1.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc1
  inner join  mod_datosmaestros.dat_cuentabanccliente cbc1 on cbc1.idcuentabancliente = dcc1.idcuentacliente
where dcc1.idfactura = p_iddocumento  and cbc1.idmoneda = p_monedacontable)) as registrocomercialcupcliente,
 (select array_to_string(array_agg(dcb.nombrecuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
  where dcb.idcuentabancliente in (select dcc1.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc1
  inner join  mod_datosmaestros.dat_cuentabanccliente cbc1 on cbc1.idcuentabancliente = dcc1.idcuentacliente
where dcc1.idfactura = p_iddocumento  and cbc1.idmoneda = p_monedalternativa)) as registrocomercialcuccliente,
(select array_to_string(array_agg(dcb.numerocuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
  left join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
  where dcb.idcuentabancliente in (select dcc1.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc1
  inner join  mod_datosmaestros.dat_cuentabanccliente cbc1 on cbc1.idcuentabancliente = dcc1.idcuentacliente
where dcc1.idfactura = p_iddocumento  and cbc1.idmoneda = p_monedacontable)) as cuentabancariacupcliente,
(select array_to_string(array_agg(dcb.numerocuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
  left join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
  where dcb.idcuentabancliente in (select dcc1.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc1
  inner join  mod_datosmaestros.dat_cuentabanccliente cbc1 on cbc1.idcuentabancliente = dcc1.idcuentacliente
where dcc1.idfactura = p_iddocumento  and cbc1.idmoneda = p_monedalternativa)) as cuentabancariacuccliente,
dd.observaciones as observaciones,
 COALESCE(ddf.importecontable,0) as subtotalcup,
 COALESCE(ddf.importealt,0) as subtotalcuc,
 round(COALESCE((SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '+') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as recargo
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedacontable),0),2) as recargocup,
 round(COALESCE((SELECT 
 sum(CASE
  WHEN (ddcpf.concepto = '+') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as recargo
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpr on ncpr.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedalternativa),0),2) as recargocuc,
 (SELECT dot.atributoidentificador
FROM mod_logtaller.dat_ordentrabajo dot 
INNER JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = dot.idordentrabajo
WHERE ddp.iddocumento = dd.iddocumento
 ) as matriculaserie,
(case when ddf.tiporgtransp = 0 then (select coalesce(ncp.nombre,de.denominacion) 
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
where ncp.idclientesproveedores = ddf.idproveedor)             
when ddf.tiporgtransp = 1 then (select de.denominacion from mod_estructuracomp.v_dametodasestructuras de where de.idestructura = ddf.idproveedor)
end) as orgtransp,
 ddft.nombrechofer as conductor,
 ddft.identidadchofer as ciconductor,
 ddft.licencia as licenciaconductor,
ddft.matriculavehiculo as chapa,
ddft.cartaporte,
ddft.fechachofer as fechaconductor,
v_recdes as recdes, 
(select dpf.nombreentregadopor from mod_logistica.dat_piefirmadocumento dpf where dpf.iddocumento = $1) as entregadopor,
null as fechaentregadopor,
'' as recibidopor,
null as cirecibidopor,
null as fecharecibidopor,
(select dpf.nombrefacturadopor from mod_logistica.dat_piefirmadocumento dpf where dpf.iddocumento = $1) as facturadopor,
dd.fechacontable as fechafacturadopor,
(SELECT ( '' || ddd.nrodoc )
FROM mod_logistica.dat_documento ddd 
INNER JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = ddd.iddocumento
WHERE ddp.iddocumento = dd.iddocumento
 ) as otop,
(select dpf.nombrecontabilizadopor from mod_logistica.dat_piefirmadocumento dpf where dpf.iddocumento = $1) as contabilizadopor,
null as fechacontabilizadopor,
(SELECT es.denominacion FROM mod_estructuracomp.v_dametodasestructuras es WHERE es.idestructura = p_idestructura) as entidad
,
(case when ddfc.idcontrato is not null then (select dc.numerocontrato from mod_crmcontratacion.dat_contrato dc where dc.idcontrato = ddfc.idcontrato) else ddfc.numero end) as numerocontrato,
(case when ddfc.idcontrato is not null then (select dc.fechafirma from mod_crmcontratacion.dat_contrato dc where dc.idcontrato = ddfc.idcontrato) else ddfc.fecha end) as fechacontrato,

/*aqui lo del telefono y otros para suchel-------------------*/
    (select ncp.telefono from mod_datosmaestros.nom_clientesproveedor ncp where ncp.idclientesproveedores = ddc.idcliente) as telefonocliente,
    'ONE: '||coalesce((select di.denominacion from mod_datosmaestros.nom_clientesproveedor ncp 
    inner join mod_crmclienteproveedor.dat_identificador di on di.idclienteproveedor = ncp.idclientesproveedores
     inner join mod_crmclienteproveedor.nom_tipocodigo ntc on ntc.idtipocodigo =di.idtipocodigo
    where ncp.idclientesproveedores = ddc.idcliente and ntc.denominacion ='ONE'),'') as one,
    (select dpt.denominacion from mod_datosmaestros.nom_dpt dpt
inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.dpa = dpt.iddpt where ncp.idclientesproveedores = ddc.idcliente) as ciudad,
i.urllogo as logo,
(select per.nombre||' '||per.papel||' '||per.sapel from mod_persona.dat_persona per where per.idpersona = ddf.idvendedor) as vendedor,
ddft.bultos,
ddft.sellos,
ddft.contenedor,
ddft.licencia,
(select dpf.cargofacturadopor from mod_logistica.dat_piefirmadocumento dpf where dpf.iddocumento = $1) as cargofacturadopor,
--(select dpf.cargoentregadopor from mod_logistica.dat_piefirmadocumento dpf where dpf.iddocumento = $1) as cargoentregadopor,
(select dpf.cargocontabilizadopor from mod_logistica.dat_piefirmadocumento dpf where dpf.iddocumento = $1) as cargocontabilizadopor,
(select array_to_string(array_agg(distinct ns.numero),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
  where dcb.idcuentabancliente in (select dcc.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc
  inner join  mod_datosmaestros.dat_cuentabanccliente cbc1 on cbc1.idcuentabancliente = dcc.idcuentacliente
where dcc.idfactura = $1 and cbc1.idmoneda = $2)) as sucursalcup,
(select array_to_string(array_agg(distinct ns.numero),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
  where dcb.idcuentabancliente in (select dcc.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc
    inner join  mod_datosmaestros.dat_cuentabanccliente cbc1 on cbc1.idcuentabancliente = dcc.idcuentacliente
where dcc.idfactura = $1 and cbc1.idmoneda = $3)) as sucursalcuc,
(case when ddf.iddeposito is null then '' else (select dop.codigo from mod_estructuracomp.dat_estructuraop dop where dop.idestructuraop = ddf.iddeposito) end) as deposito,
(SELECT (ddd.fechacontable )
FROM mod_logistica.dat_documento ddd 
INNER JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = ddd.iddocumento
WHERE ddp.iddocumento = dd.iddocumento
 ) as fechaotop,
nm.codigoiso,dd.numeroref, dd.estado,
round(COALESCE((SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '-') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as descuento
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedacontable),0),2) as descuentocup, 
round(COALESCE((SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '-') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as descuento
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedalternativa),0),2) as descuentocuc,
de.correo,
(select array_to_string(array_agg(ns.numero),', ') from mod_banco.nom_cuentabancaria ncb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = ncb.idbanco  
  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = ncb.idsucursal
  where ncb.idcuentabancaria in (select dcf1.idcuenta from mod_logfacturacion.conf_cuentafactura dcf1
where dcf1.idestructuracomun = $4) and ncb.idestructuracomun = de.idestructura and ncb.idmoneda = $2) as sucursalprovcup,
nop.denominacion as operacion,
(case when ddft.viatransporte = 1 then 'Casilla:'
when ddft.viatransporte = 2 then 'Embarque:'
when ddft.viatransporte = 3 then 'Gu�a a�rea:'
else 'Chapa:' end) as denomviatransp
    /*-------------------*/
from mod_logistica.dat_documento dd
inner join mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento
left join mod_logfacturacion.dat_seriedocentidad dse on ddf.idseriedocentidad = dse.idseriedocentidad
left join mod_logfacturacion.nom_seriedocumento nsd on nsd.idseriedocumento = dse.idseriedocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
left join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento 
left join mod_logfacturacion.dat_docfacturatransportacion ddft on ddft.idfactura = dd.iddocumento
left join mod_logfacturacion.dat_facturacontrato ddfc on ddfc.idfactura = ddf.idfactura
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
left join mod_datosmaestros.nom_moneda nm on nm.idmoneda = ddf.idmoneda
where dd.iddocumento = $1
loop
return next all_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_modelofacturacab (p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric, p_idestructura numeric)
  OWNER TO zeolides;