ALTER TYPE mod_logfacturacion.td_modelofactura
  ADD ATTRIBUTE monedaprod VARCHAR;
  
ALTER TYPE mod_logfacturacion.td_modelofacturaprod
  ADD ATTRIBUTE monedafactura VARCHAR;  

ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN idmonedaprod NUMERIC(19,0);
  
ALTER TABLE mod_logfacturacion.dat_docfactura
  ADD COLUMN idmonedaserv NUMERIC(19,0);  
  
ALTER TABLE mod_logfacturacion.conf_configuracionfactura
  ADD COLUMN utilizartasa NUMERIC(1,0) DEFAULT 0;    
  
ALTER TABLE mod_logfacturacion.dat_cuentafacturacliente
  ADD COLUMN numerocuenta VARCHAR(50);  

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modelofacturacabdual (
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
(case when ddf.oferta = 0 or ddf.oferta is null then btrim(concat(nsd.denominacion,'-',ddf.nrofactura),'-') else btrim(concat('',COALESCE(ddf.nroreal,COALESCE(CAST(dd.nrodoc as varchar),CAST(dd.numeroref as varchar)))),'-') end) as nrofactura,
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
COALESCE((select array_to_string(array_agg(dcb.numerocuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
  left join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
  where dcb.idcuentabancliente in (select dcc1.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc1
  inner join  mod_datosmaestros.dat_cuentabanccliente cbc1 on cbc1.idcuentabancliente = dcc1.idcuentacliente
where dcc1.idfactura = p_iddocumento  and cbc1.idmoneda = p_monedacontable)),
	(select array_to_string(array_agg(dcc1.numerocuenta),', ') from mod_logfacturacion.dat_cuentafacturacliente dcc1
    where dcc1.idfactura = p_iddocumento)
) as cuentabancariacupcliente,
(select array_to_string(array_agg(dcb.numerocuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
  left join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
  where dcb.idcuentabancliente in (select dcc1.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc1
  inner join  mod_datosmaestros.dat_cuentabanccliente cbc1 on cbc1.idcuentabancliente = dcc1.idcuentacliente
where dcc1.idfactura = p_iddocumento  and cbc1.idmoneda = p_monedalternativa)) as cuentabancariacuccliente,
dd.observaciones as observaciones,
 COALESCE(ddf.importecontable,0) as subtotalcup,
 COALESCE(ddf.importealt,0) as subtotalcuc,
 round(COALESCE((case when ddf.idmoneda is null and ddf.idmonedaprod is null then
 (SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '+') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as recargo
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedacontable)
else 
((SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '+') THEN v_recdes + (case when ddf.idmoneda is not null and ddcpf.porciento = 1 then
    	coalesce(round(ddcpf.valorcalculo,2),0)*COALESCE(ddf.factorconvercion,1)
    else
    	coalesce(ddcpf.valorcalculo,0)
    end)
  ELSE 0 END)as recargo
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedacontable and ((ddcpf.idmonedacategoria is null and ddf.idmoneda is null) or ddcpf.idmonedacategoria = p_monedacontable)
)+COALESCE((SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '+') THEN v_recdes + (round(ddcpf.valorcalculo,2)*(case when ddcpf.porciento = 1 then COALESCE(ddf.factorconvercion,1) else 1 end))
  ELSE 0 END) as recargo
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda <> p_monedacontable and ((ddcpf.idmonedacategoria is not null and ddf.idmonedaprod is not null) and ddcpf.idmonedacategoria = p_monedacontable)
),0))
end),0),2) as recargocup,
 round(COALESCE((case when ddf.idmoneda is not null then
 (SELECT 
 sum(CASE
  WHEN (ddcpf.concepto = '+') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as recargo
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpr on ncpr.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and (ddcpf.idmonedacategoria is null or ddcpf.idmonedacategoria = ddf.idmoneda) and ddf.idmoneda is not null)
when ddf.idmonedaprod is not null then
(SELECT 
 sum(CASE
  WHEN (ddcpf.concepto = '+') THEN v_recdes + (round(ddcpf.valorcalculo,2)/(case when ddcpf.porciento = 1 and ddcpf.idmoneda = p_monedacontable then COALESCE(ddf.factorconvercion,1) else 1 end))
  ELSE 0 END)as recargo
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpr on ncpr.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ((
ddcpf.idmonedacategoria is null and ddcpf.idmoneda = ddf.idmonedaprod
) or ddcpf.idmonedacategoria = ddf.idmonedaprod) and ddf.idmonedaprod is not null)
else
0
end),0),2) as recargocuc,
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
(case when ddf.iddeposito is null then '' else (select dop.codigo from mod_estructuracomp.dat_estructuraop dop where dop.idestructuraop = ddf.iddeposito limit 1) end) as deposito,
(SELECT (ddd.fechacontable )
FROM mod_logistica.dat_documento ddd 
INNER JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = ddd.iddocumento
WHERE ddp.iddocumento = dd.iddocumento
 ) as fechaotop,
coalesce(nm.codigoiso, (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2)),dd.numeroref, dd.estado,
round(COALESCE((case when ddf.idmoneda is not null then
(SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '-') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as descuento
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedacontable and ddcpf.idmonedacategoria is null)
else
(SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '-') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as descuento
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedacontable)
end),0),2) as descuentocup, 
round(COALESCE((case when ddf.idmoneda is not null then
(SELECT 
 sum(CASE
    WHEN (ddcpf.concepto = '-') THEN v_recdes + ddcpf.valorcalculo
  ELSE 0 END)as descuento
from mod_logfacturacion.dat_categoriapreciofactura dcpf
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
--left join mod_logfacturacion.nom_categoriaprecio ncpc on ncpc.idcategoriaprecio =  dcpf.idcategoriaprecio
where dcpf.idfactura = ddf.idfactura and ddcpf.idmoneda = p_monedalternativa and ddcpf.idmonedacategoria is not null)
else
0
end),0),2) as descuentocuc,
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
else 'Chapa:' end) as denomviatransp,
(select sum(ddcp.valorcalculo) from mod_logfacturacion.dat_categoriapreciofactura dcp
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp on ddcp.idcategoriafactura = dcp.idcategoriafactura
where dcp.idfactura = $1 and dcp.codigo = 'CL') as totalcl,
(select array_to_string(array_agg(distinct dcp.cuenta),', ') from mod_logfacturacion.dat_categoriapreciofactura dcp
inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp on ddcp.idcategoriafactura = dcp.idcategoriafactura
where dcp.idfactura = $1 and dcp.codigo = 'CL' and ddcp.valorcalculo > 0) as cuentacl,
(select nmp.codigoiso from mod_datosmaestros.nom_moneda nmp where nmp.idmoneda = ddf.idmonedaprod)
    /*-------------------*/
from mod_logistica.dat_documento dd
inner join mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento
left join mod_logfacturacion.dat_seriedocentidad dse on ddf.idseriedocentidad = dse.idseriedocentidad
left join mod_logfacturacion.nom_seriedocumento nsd on nsd.idseriedocumento = dse.idseriedocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
--left join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
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
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_modelofacturacabdual (p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric, p_idestructura numeric)
  OWNER TO zeolides;
  
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modelofacturaproddual (
  p_iddocumento numeric,
  p_monedacontable numeric,
  p_monedalternativa numeric
)
RETURNS SETOF mod_logfacturacion.td_modelofacturaprod AS
$body$
DECLARE

	v_rec mod_logfacturacion.td_modelofacturaprod;
    v_conf numeric;
    v_diferencia numeric;
	BEGIN    
    
    	v_conf := (select cf.listarmcomercial from mod_logfacturacion.conf_configuracionfactura cf 
        		  where cf.idestructuracomun = (select df.idestructuracomun from mod_logfacturacion.dat_docfactura df where df.idfactura = $1 limit 1) limit 1);
                  
		if v_conf = 1 then
        	for v_rec in              

            (select DISTINCT 

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            (case when def.idunidadmedida is null then num.abreviaturaunidadmedida else (
            	select uma.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uma where uma.idunidadmedida = def.idunidadmedida
            ) end) as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2) 
            from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select (dde.preciotarifa- (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2)) * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3) from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select (dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3))* def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            (CASE WHEN dpn.tipo = 1 THEN 'Partes, Piezas o Componentes' ELSE 'Servicios Asociados' END) as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	 COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro,
            ni.idindicador,
            (case when def.minutosactividad > 0 then (SELECT make_interval(0,0,0,0,0,CAST(def.minutosactividad as integer))) else null end) as tiempo
			
            from mod_logfacturacion.dat_elementosfactura def
            left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador		
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = def.idelementofactura
            where def.idfactura = $1)
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Servicios Asociados' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
			0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            null, null, null,null
            from mod_logfacturacion.dat_elementosfactura def 

            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad

            where def.idfactura = $1)

            union

            (select

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,
             
            (case when (
                select count(*) from mod_logfacturacion.dat_elementocategoria dec11 where dec11.idmovimiento = dm.idmovimiento
            ) = 0 then (select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) 
             else 
            (select dmm1.preciocontable from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento) end) as precio,
             
            (case when (
                select count(*) from mod_logfacturacion.dat_elementocategoria dec11 where dec11.idmovimiento = dm.idmovimiento
            ) = 0 then round((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2),2) 
             else 
            round((select dmm1.preciocontable * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),2) end) as importe, 
            /*(case when dpf.idtipoprecio is not null and coalesce((select coalesce(dmp.preciopromedio,0) from mod_logfacturacion.dat_matrizprecio dmp 
                                                                  where dmp.idestructuracomun = (select from mod_logfacturacion.dat_docfactura) 
                                                        and dmp.idindicador = ni.idindicador and dmp.idtipoprecio = dpf.idtipoprecio limit 1),0) <> 1)*/
            --(select dmm1.preciocontable from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento) as precio,

            --round((select dmm1.preciocontable * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),2) as importe,
            COALESCE((select dmm1.precioalternativo from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),0) as precioalternativo,
            COALESCE((select dmm1.precioalternativo * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Partes, Piezas o Componentes' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dm.idmovimiento as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            coalesce(dprod.cantidad,0) as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro,
            ni.idindicador,null
            
            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
            
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = dm.idmovimiento
            
            where dm.iddocumento = $1)
            union
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            (COALESCE((select sum(round(dec1.valor*dm1.cantidad,2)) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2 and dm1.iddocumento = $1/*dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)*/),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2 and dm1.idfactura = $1),0)) as precio,

            (COALESCE((select sum(round(dec1.valor*dm1.cantidad,2)) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2  and dm1.iddocumento = $1/*dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)*/),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2  and dm1.idfactura = $1),0)) as importe,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3),0)) as precioalternativo,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3),0)) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'y' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dcd.idcuentadesgloseprecio as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem, null, null , null, null         

            from mod_logfacturacion.dat_elementocategoria dec
            inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dec.idmovimiento
            inner join mod_logfacturacion.dat_cuentadesgloseprecio dcd on dcd.idcuentadesgloseprecio = dec.idcuentadesgloseprecio
            --inner join mod_logfacturacion.dat_categoriaprecioentidad dce on dce.idcategoriaprecioentidad = dcd.idcategoriaprecioentidad
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcd.idcategoriaprecio        
            where dm.iddocumento = $1)
            union
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0) as precio,

            round(COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0),2) as importe,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as precioalternativo,

            COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'Z' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            null as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp11 on ddcp11.idmonedacategoria = mmo.idmoneda
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddcp11.idcategoriafactura = dcp.idcategoriafactura limit 1)
                ,
                	COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        inner join mod_logfacturacion.dat_categoriapreciofactura dcp11 on dcp11.idfactura = ddfm.idfactura
                        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp11 on ddcp11.idcategoriafactura = dcp11.idcategoriafactura
                        where ddfm.idfactura = p_iddocumento and dcp11.idcategoriafactura = dcp.idcategoriafactura 
                        and ddcp11.idmonedacategoria is null limit 1)
                    ,
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                    )
                )
            ) as monedaitem,
            null, null, null, null
            

            from mod_logfacturacion.dat_categoriapreciofactura dcp
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio        
            where dcp.idfactura = $1)

            loop
                v_diferencia = 0;
                if v_rec.codigo = '-' and v_rec.identificador is not null then
                    v_diferencia := (select coalesce((
                    coalesce((select sum(round(coalesce(mm.precio*dm.cantidad,0),2)+round(coalesce(des.preciotarifa*de.cantidad,0),2)) from mod_logistica.dat_documento dd
                    left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                    left join mod_logfacturacion.dat_elementosfactura de on de.idfactura = dd.iddocumento
                    left join mod_logistica.dat_movmoneda mm on mm.idmovimiento = dm.idmovimiento and mm.idmoneda = 9900000000
                    left join mod_logfacturacion.dat_desgloselemento des on des.idelementofactura = de.idelementofactura and des.idmoneda = 9900000000
                    inner join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento or ec.idelementofactura = de.idelementofactura
                    where dd.iddocumento = $1 and ec.idcuentadesgloseprecio = v_rec.identificador),0)
                    -
                    coalesce((select sum(round(coalesce(dm.preciocontable*dm.cantidad,0),2)/*+round(coalesce(dm.preciocontable*dm.cantidad,0),2)*/)
                              +sum(round(ec.valor*dm.cantidad,2)) from mod_logistica.dat_documento dd
                    left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                    left join mod_logfacturacion.dat_elementosfactura de on de.idfactura = dd.iddocumento
                    left join mod_logistica.dat_movmoneda mm on mm.idmovimiento = dm.idmovimiento and mm.idmoneda = 9900000000
                    left join mod_logfacturacion.dat_desgloselemento des on des.idelementofactura = de.idelementofactura and des.idmoneda = 9900000000
                    inner join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento or ec.idelementofactura = de.idelementofactura
                    where dd.iddocumento = $1 and ec.idcuentadesgloseprecio = v_rec.identificador),0)),0));
                    
                    v_rec.precio = v_rec.precio + v_diferencia;
                    v_rec.importe = v_rec.importe + v_diferencia;
                end if;
                v_rec.monedafactura := (select COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                ));
                if v_rec.importe > 0 then
                	return next v_rec;
                end if;    
            end loop;
        else
        	for v_rec in              

            (select DISTINCT 

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            (case when def.idunidadmedida is null then num.abreviaturaunidadmedida else (
            	select uma.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uma where uma.idunidadmedida = def.idunidadmedida
            ) end) as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            (CASE WHEN dpn.tipo = 1 THEN 'Partes, Piezas o Componentes' ELSE 'Servicios Asociados' END) as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                    ,
                        (CASE WHEN dpn.tipo = 1 THEN 
                        COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                        ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable))
                        ELSE (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable) END)
                        
                    ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro,
            ni.idindicador,
            (case when def.minutosactividad > 0 then (SELECT make_interval(0,0,0,0,0,CAST(def.minutosactividad as integer))) else null end) as tiempo        

            from mod_logfacturacion.dat_elementosfactura def
            left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador		
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = def.idelementofactura
            
            where def.idfactura = $1)
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            '' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
            ,
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
            ) as monedaitem, null, null, null, null
            from mod_logfacturacion.dat_elementosfactura def 

            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad

            where def.idfactura = $1)

            union

            (select

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,

            (select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) as precio,

            round((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2),2) as importe,
            COALESCE((select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as precioalternativo,
            COALESCE((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Partes, Piezas o Componentes' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dm.idmovimiento as identificador,
            0 as estado,
            coalesce(dprod.cantidad,0) as existencia,
            COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
            ,
                COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmonedaprod = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
                ,(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro,
            ni.idindicador,null

            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
            
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idmovimiento = dm.idmovimiento

            where dm.iddocumento = $1)

            loop
				v_rec.monedafactura := (select COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                ));
                return next v_rec;

            end loop;
        end if;
		

	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

COMMENT ON FUNCTION mod_logfacturacion.f_modelofacturaproddual(p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric)
IS 'ees';

ALTER FUNCTION mod_logfacturacion.f_modelofacturaproddual (p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric)
  OWNER TO zeolides;