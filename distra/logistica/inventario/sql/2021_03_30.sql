
ALTER TYPE mod_loginventario.td_informediferencias
  ALTER ATTRIBUTE nrodocpadre TYPE VARCHAR;


CREATE OR REPLACE FUNCTION mod_loginventario.f_modelodiferencia (
  p_iddocumento numeric,
  p_monedaalternativa numeric,
  p_monedacontable numeric
)
RETURNS SETOF mod_loginventario.td_informediferencias AS
$body$
declare
all_rec mod_loginventario.td_informediferencias;

begin 

for all_rec in
select distinct
i.urllogo,
ndp.denominacion as aliadoc,
(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(deh.codigo,'-',deh.denominacion),'-') when ci.esminfar = 1 then deh.codigo end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then btrim(concat(deh.codigo,'-',deh.denominacion),'-') when ci.esminfar = 1 then (select codigo from mod_estructuracomp.v_dametodasestructuras where idestructura = ci.idpadre limit 1) end)
end) as entidad,

deh.codigo as reeup,

(case when ci.idestructuracomun = ci.idpadre then (case when ci.esminfar = 0 then cast(ddh.nrodoc as varchar) when ci.esminfar = 1 then cast(ddh.nrodoc as varchar) end)
     when ci.idestructuracomun <> ci.idpadre then (case when ci.esminfar = 0 then cast(ddh.nrodoc as varchar) when ci.esminfar = 1 then btrim(concat(ddh.nrodoc,'-',deh.codigo,'-',deop.codigo),'-') end)
end) as numerodocumento,

ddh.fechacontable,
btrim(concat(deop.codigo,'-',deop.denominacion ),'-') as deposito,
(select COALESCE(ncp.nombre,COALESCE(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)))
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ncp.idclientesproveedores = ddco.idcliente) as sum,
(select COALESCE(ncp.direccion,de.direccion)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ncp.idclientesproveedores = ddco.idcliente) as dirsum,
ndpo.denominacion as aliadocorigen,
ddo.fechacontable as fechaorigen,
dr.nrocontrato as contratorecep,
ddh.observaciones as obsum,
  (select COALESCE(ncp.nombre,de.denominacion)
  from mod_datosmaestros.nom_clientesproveedor ncp left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
  where ncp.idclientesproveedores = ddt.idorganizacion) as entransp,
  
  (select COALESCE(ncp.direccion,de.direccion)
  from mod_datosmaestros.nom_clientesproveedor ncp left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
  where ncp.idclientesproveedores = ddt.idorganizacion) as dirtransp,
  
  (select COALESCE(ncp.codigo,de.codigo)
  from mod_datosmaestros.nom_clientesproveedor ncp left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
  where ncp.idclientesproveedores = ddt.idorganizacion) as reeuptransp,
ddt.nombreconductor as conductor,
ddt.ciconductor as ci,
ddt.matricula as chapa,
ddt.cartaporte as cartaporte,
(case when drr.viatransporte = 1 then 'Ferroviario'
      when drr.viatransporte = 2 then 'Marítimo'
      when drr.viatransporte = 3 then 'Aérea'
      when drr.viatransporte = 4 then 'Terrestre'
end)as via,
ddo.observaciones as obsrecep,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END) as codprod,
nc.denominacion as catprod,
ni.denominacion as prod,
num.abreviaturaunidadmedida as um,
(case when dmd.signo = '1' then dmd.cantidaddiferencia else 0 end) as sobrante,
(case when dmd.signo = '2' then dmd.cantidaddiferencia else 0 end) as faltante,
coalesce((dmd.cantidaddiferencia * dm.preciocontable),0) as importesobfalt,
coalesce(dmd.preciodiferencia,0),
round(coalesce(dmd.importediferencia,0),2),
COALESCE((select sum(dmdc.cantidaddiferencia) from mod_loginventario.dat_movdiferenciacalidad dmdc where dmdc.idmovimiento = dm.idmovimiento),0) as otros, 
COALESCE((select (sum(dmdc.cantidaddiferencia)* dm.preciocontable) from mod_loginventario.dat_movdiferenciacalidad dmdc where dmdc.idmovimiento = dm.idmovimiento),0) as importeotros,
--coalesce(dm.preciocontable,0) as punitario,
--coalesce(md.preciodiferencia) as punitario,
(case when (md.preciodiferencia > 0) then md.preciodiferencia else coalesce(dm.preciocontable,0) END) as punitario, 
--coalesce(dm.importecontable,0) as importe,
--coalesce(md.importediferencia,0) as importe,
(case when (md.importediferencia > 0) then round(md.importediferencia, 2) else round(COALESCE(dm.importecontable,0), 2) END) as importe, 
(case when cio.idestructuracomun = cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then cast(ddo.nrodoc as varchar) end)
     when cio.idestructuracomun <> cio.idpadre then (case when cio.esminfar = 0 then cast(ddo.nrodoc as varchar) when cio.esminfar = 1 then btrim(concat(ddo.nrodoc,'-',deo.codigo,'-',deopo.codigo),'-') end)
end) as nrodoco,

(select COALESCE(ncp.codigo,de.codigo)
from mod_datosmaestros.nom_clientesproveedor ncp 
left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona 
where ncp.idclientesproveedores = ddco.idcliente) as reuupsum,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END),
--COALESCE(dm.precioalternativo,0),
--COALESCE(md.preciodiferenciaalt,0),
(case when (md.preciodiferenciaalt > 0) then md.preciodiferenciaalt else COALESCE(dm.precioalternativo,0) END),
--COALESCE(dm.importealternativo,0),
--COALESCE(md.importediferenciaalt,0),
(case when (md.importediferenciaalt > 0) then round(md.importediferenciaalt,2) else round(COALESCE(dm.importealternativo,0),2) END),
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedaalternativa,           
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedacontable,
(select dcb.numerocuenta from mod_datosmaestros.dat_cuentabanccliente dcb 
inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dcb.idclienteproveedores
where ncp.idclientesproveedores = ddco.idcliente and dcb.predeterminado = 1) as numerocuenta,
(select ns.numero from mod_datosmaestros.nom_sucursal ns
inner join mod_datosmaestros.dat_cuentabanccliente dcb on dcb.idsucursal = ns.idsucursal
inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dcb.idclienteproveedores
where ncp.idclientesproveedores = ddco.idcliente and dcb.predeterminado = 1) as numerosucursal,
dr.nrodocorigen,
deh.direccion,
ddh.estado,
ddo.numeroref,
dr.fechacontrato as fechacontratorecep,
dr.fechadocorigen as fechadocorigenrecep,
dr.nrodocorigen as nrodocorigenrecep,
nop.denominacion as denomoperrecep,
ddt.casilla,
dr.cantbulto,
(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = ddh.idusuario) as nombrepersona,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = ddh.idusuario) as cargopersona,

(select btrim(concat(b.nombre,' ',b.snombre,' ',b.papel,' ',b.sapel))
from mod_seguridad.seg_usuario a 
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
where a.idusuario = ddh.aprobadopor) as nombrepersonaprobar,

(select f.denominacion from mod_seguridad.seg_usuario a
inner join mod_persona.dat_persona b on b.idpersona = a.idpersona
inner join mod_persona.dat_personaentidad c on c.idpersona = b.idpersona and (c.fhasta > now() or c.fhasta is null )
inner join mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
inner join mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
inner join mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
where a.idusuario = ddh.aprobadopor) as cargopersonaprobar

from mod_logistica.dat_documento ddh
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = ddh.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ddh.idestructuracomun
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
inner join mod_loginventario.conf_inventario ci on ci.idestructuracomun = des.idestructuracomun
inner join mod_estructuracomp.v_dametodasestructuras deh on deh.idestructura = des.idestructuracomun
inner join mod_logistica.conf_general i on i.idestructura = deh.idestructura
inner join mod_logistica.dat_documentopadre ddpad on ddpad.iddocumento = ddh.iddocumento
inner join mod_logistica.dat_documento ddo on ddo.iddocumento = ddpad.idpadre
inner join mod_logistica.dat_documentocliente ddco on ddco.iddocumento = ddo.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddpo on ddpo.iddoc = ddo.iddoc
inner join mod_datosmaestros.nom_docprim ndpo on ndpo.iddocumentos = ddpo.iddocumentos
inner join mod_loginventario.dat_reclamacion drr on drr.iddocumento = ddh.iddocumento
inner join mod_loginventario.dat_recepcion dr on dr.iddocumento = drr.idrecepcion
inner join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = ddo.idoperacion
left join mod_logistica.dat_documentotransporte ddt on ddt.iddocumento = ddo.iddocumento
left join mod_logistica.dat_movimiento dm on ddh.iddocumento = dm.iddocumento
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida
left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_loginventario.dat_movdiferencia dmd on dmd.idmovimiento = dm.idmovimiento
left join mod_datosmaestros.dat_estructurasubsist deso on deso.idestructurasubsist = ddpo.idestructurasubsist
left join mod_estructuracomp.v_dametodasestructuras deo on deo.idestructura = deso.idestructuracomun
left join mod_loginventario.conf_inventario cio on cio.idestructuracomun = deso.idestructuracomun
left join mod_estructuracomp.dat_estructuraop deopo on deopo.idestructuraop = ddo.idestructuracomun
left join mod_loginventario.dat_movdiferencia md on md.idmovimiento = dm.idmovimiento
where ddh.iddocumento = $1
loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

CREATE OR REPLACE VIEW mod_loginventario.v_ejerciciocontable(
    idejercicio,
    inicio,
    fin)
AS
  SELECT ec.idejercicio,
         ec.inicio,
         ec.fin
  FROM mod_datosmaestros.dat_ejerciciocontable ec;

  CREATE OR REPLACE VIEW mod_loginventario.v_contable_producto(
    idestructuracomun,
    idcuenta,
    idcuentaalt)
AS
  SELECT DISTINCT dp.idestructuracomun,
         nct.idcuenta,
         nct.idcuentaalt
  FROM mod_logistica.nom_clasificacioncontable nct
       JOIN mod_logistica.dat_producto dp USING (idclasificacioncontable);

CREATE OR REPLACE VIEW mod_loginventario.v_balancecontable_movimiento(
    idestructuracomun,
    idcuenta,
    importecontable,
    signo,
    fechacontable)
AS
  SELECT dp.idestructuracomun,
         nc.idcuenta,
         dm.importecontable,
         dm.signo,
         dd.fechacontable
  FROM mod_logistica.dat_producto dp
       JOIN mod_logistica.dat_movimiento dm USING (idproducto)
       JOIN mod_logistica.nom_clasificacioncontable nc ON
         nc.idclasificacioncontable = dm.idclasificacion
       JOIN mod_logistica.dat_documento dd USING (iddocumento)
  WHERE (dd.estado = ANY (ARRAY [ 3::numeric, 4::numeric ])) AND
        dd.idcomprobante IS NOT NULL AND
        dd.idcomprobante <> 2::numeric;



CREATE OR REPLACE FUNCTION mod_loginventario.f_balancecontable (
  p_idestructura numeric,
  p_fecha date
)
RETURNS SETOF mod_loginventario.td_balanceinv AS
$body$
DECLARE
  v_result mod_loginventario.td_balanceinv;
  v_fecha date;
  v_ejercicio record;
BEGIN
   if p_fecha is not null THEN
	v_fecha := p_fecha;
   ELSE
    v_fecha := now();
   END if;
   select * into  v_ejercicio
	from mod_loginventario.v_ejerciciocontable ec
				where v_fecha between ec.inicio and ec.fin  limit 1;

 	FOR v_result IN (
       SELECT
         q.idcuenta,
         q.concatctax,
         q.valorinv,
         q.saldo,
         q.valorinv - q.saldo as diff,
         '' as logo
       FROM
        (
       SELECT sq.idcuenta,
              sq.concatctax,
              round((round(coalesce((
                                      select sum(vbm.importecontable) as importecontable
                                      from mod_loginventario.v_balancecontable_movimiento vbm
                                      where vbm.idcuenta = sq.idcuenta and
                                            vbm.signo = '+' and
                                            vbm.fechacontable <= v_fecha and
                                            vbm.idestructuracomun = p_idestructura
              ), 0), 2) - round(coalesce((
                                      select sum(vbm.importecontable) as importecontable
                                      from mod_loginventario.v_balancecontable_movimiento vbm
                                      where vbm.idcuenta = sq.idcuenta and
                                            vbm.signo = '-' and
                                            vbm.fechacontable <= v_fecha and
                                            vbm.idestructuracomun = p_idestructura
              ), 0), 2)), 2) as valorinv,
             coalesce((select sum(rp.saldomb) as saldo from mod_contabilidad.res_centroelem_saldo rp
							inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
                            where rp.idcuenta = sq.idcuenta and rp.fechaemision between v_ejercicio.inicio and v_ejercicio.fin
							and eec.idestructuracomun = p_idestructura and rp.fechaemision <= v_fecha limit 1),0) as saldo
       from (
              SELECT distinct vcp.idcuenta,
                     nc.concatctax
              from mod_loginventario.v_contable_producto vcp
       		  JOIN mod_contabilidad.nom_cuenta nc ON nc.idcuenta = vcp.idcuenta
              where vcp.idestructuracomun = p_idestructura
            ) sq
       order by sq.concatctax
     ) as q

    ) LOOP
      return next v_result;
    END LOOP;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_balancecontable (p_idestructura numeric, p_fecha date)
  OWNER TO zeolides;
