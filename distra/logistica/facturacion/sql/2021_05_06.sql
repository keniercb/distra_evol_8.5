CREATE OR REPLACE FUNCTION mod_logfacturacion.f_subreportefacturas (
  p_idoperacion varchar,
  p_iddeposito numeric,
  p_iddocumentos varchar,
  p_monedacont numeric,
  p_monedaalt numeric,
  p_idestructura numeric
)
RETURNS SETOF mod_logfacturacion.td_subreportefacturas AS
$body$
	DECLARE

	v_rec mod_logfacturacion.td_subreportefacturas;

	BEGIN    

		for v_rec in              

        (
        SELECT df.nrofactura, dd.fechacontable,
      (select (nc.codigo || ' ' || nc.nombre) from mod_datosmaestros.nom_clientesproveedor nc
		where nc.idclientesproveedores = df.idcliente) as cliente, 
		(select sum(round(dmm1.precio * dm.cantidad,2)) from mod_logistica.dat_movmoneda dmm1
        inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmm1.idmovimiento
         where dm.iddocumento = df.idfactura and dmm1.idmoneda = p_monedacont) as importecontable, 
		(select sum(round(dmm1.precio * dm.cantidad,2)) from mod_logistica.dat_movmoneda dmm1
        inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmm1.idmovimiento
         where dm.iddocumento = df.idfactura and dmm1.idmoneda = p_monedaalt) as importealternativo,
         (select nc.direccion from mod_datosmaestros.nom_clientesproveedor nc
		where nc.idclientesproveedores = df.idcliente) as direccion,
        /*(select ncb.nrocuenta from mod_banco.nom_cuentabancaria ncb
         inner join mod_logfacturacion.conf_cuentafactura ccf on ccf.idcuenta = ncb.idcuentabancaria
         where ncb.idmoneda = p_monedacont and ccf.idestructuracomun = p_idestructura limit 1) as cuentacup,*/
         (select array_to_string(array_agg(dcc.numerocuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcc
         inner join mod_logfacturacion.dat_cuentafacturacliente dcfc on dcc.idcuentabancliente = dcfc.idcuentacliente and  dcfc.idfactura = df.idfactura
         where dcc.idmoneda = p_monedacont and dcc.idclienteproveedores = df.idcliente) as cuentacup,  
        /*(select ns.numero from mod_datosmaestros.nom_sucursal ns
         inner join mod_banco.nom_cuentabancaria ncb on ncb.idsucursal = ns.idsucursal
         inner join mod_logfacturacion.conf_cuentafactura ccf on ccf.idcuenta = ncb.idcuentabancaria
         where ncb.idmoneda = p_monedacont and ccf.idestructuracomun = p_idestructura limit 1) as sucursalcup,*/
         (select array_to_string(array_agg(ns.numero),', ') from mod_datosmaestros.nom_sucursal ns
         inner join mod_datosmaestros.dat_cuentabanccliente dcc on dcc.idsucursal = ns.idsucursal
         inner join mod_logfacturacion.dat_cuentafacturacliente dcfc on dcc.idcuentabancliente = dcfc.idcuentacliente and  dcfc.idfactura = df.idfactura
         where dcc.idmoneda = p_monedacont and dcc.idclienteproveedores = df.idcliente) as sucursalcup,
        /*(select ncb.nrocuenta from mod_banco.nom_cuentabancaria ncb
         inner join mod_logfacturacion.conf_cuentafactura ccf on ccf.idcuenta = ncb.idcuentabancaria
         where ncb.idmoneda = p_monedaalt and ccf.idestructuracomun = p_idestructura limit 1) as cuentacuc,*/
         (select array_to_string(array_agg(dcc.numerocuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcc
         inner join mod_logfacturacion.dat_cuentafacturacliente dcfc on dcc.idcuentabancliente = dcfc.idcuentacliente and  dcfc.idfactura = df.idfactura
         where dcc.idmoneda = p_monedaalt and dcc.idclienteproveedores = df.idcliente) as cuentacuc,  
        /*(select ns.numero from mod_datosmaestros.nom_sucursal ns
         inner join mod_banco.nom_cuentabancaria ncb on ncb.idsucursal = ns.idsucursal
         inner join mod_logfacturacion.conf_cuentafactura ccf on ccf.idcuenta = ncb.idcuentabancaria
         where ncb.idmoneda = p_monedaalt and ccf.idestructuracomun = p_idestructura limit 1) as sucursalcuc*/
         (select array_to_string(array_agg(ns.numero),', ') from mod_datosmaestros.nom_sucursal ns
         inner join mod_datosmaestros.dat_cuentabanccliente dcc on dcc.idsucursal = ns.idsucursal
         inner join mod_logfacturacion.dat_cuentafacturacliente dcfc on dcc.idcuentabancliente = dcfc.idcuentacliente and  dcfc.idfactura = df.idfactura
         where dcc.idmoneda = p_monedaalt and dcc.idclienteproveedores = df.idcliente) as sucursalcuc
        from  mod_logistica.dat_documento dd
        inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
        --inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = dd.iddocumento
        where (case when p_iddocumentos is not null then dd.iddocumento = any(cast(p_iddocumentos as numeric[])) else true end) group by df.nrofactura, dd.fechacontable, df.idcliente, df.idfactura order by df.nrofactura
        )

		loop

			return next v_rec;

		end loop;

	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;