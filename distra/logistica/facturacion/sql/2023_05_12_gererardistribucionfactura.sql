CREATE OR REPLACE FUNCTION mod_logfacturacion.f_generardistribucionfactura (
  p_idoferta numeric,
  p_idusuario numeric,
  p_idestructuracomun numeric
)
RETURNS varchar AS
$body$
DECLARE
  v_respuesta varchar;
   v_iddocdistribucion numeric;
  v_iddocfacturacion numeric;
  v_iddocumento numeric;
  v_idfactura numeric;
  v_idespecialidad numeric;
  v_idperiododistribucion record;
  v_idperiodofacturacion record;
  v_fechadistribucion date;
  v_fechafacturacion date;
  v_idcliente numeric;
  v_idoperacionfactura numeric;
  v_producto record;
  v_iddeposito numeric;
  v_condicionpago record;
  v_idcuentacliente numeric;
  v_datosprecioventa record;
  v_idmovfactura numeric;
  v_precioventa numeric;
  v_margenAux numeric;
  v_referencia numeric;
  v_nrooferta varchar;
  v_reservadispprec record;

BEGIN
   v_iddocdistribucion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
    
    v_iddocfacturacion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'facturaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiododistribucion = mod_logistica.f_obtenerejercicioactivo(10, p_idestructuracomun);            
                
    v_fechadistribucion := (select df.fecha from mod_datosmaestros.dat_fecha df
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
    where des.idsubsistema = 10 and des.idestructuracomun = p_idestructuracomun limit 1);
    
    v_idoperacionfactura := (select dd.idoperacion from mod_logistica.dat_documento dd
    where dd.iddocumento = p_idoferta limit 1);
    
    v_nrooferta := (select coalesce(df.nroreal, cast(df.nrofactura as varchar)) from mod_logfacturacion.dat_docfactura df
    where df.idfactura = p_idoferta limit 1);
    
    v_idcliente := (select dc.idcliente from mod_logistica.dat_documentocliente dc
    where dc.iddocumento = p_idoferta limit 1);
    
    select pf.* into v_reservadispprec from mod_logfacturacion.dat_facturaprefactura pf
    where pf.idfactura = p_idoferta limit 1;
    
    --insertando distribucion
    INSERT INTO mod_logistica.dat_documento
      (
        iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
        idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
      )
      VALUES (
        v_iddocdistribucion, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
        v_fechadistribucion,'Distribucion generada a partir de oferta #'||v_nrooferta,0,1,p_idusuario,3,v_idperiododistribucion.idejercicioactual,
        p_idestructuracomun, v_idperiododistribucion.idperiodoactual,
        (COALESCE((
          select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
          and dd.idejercicio = v_idperiododistribucion.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
        ),0)+1),1,(COALESCE((
          select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
          and dd.idejercicio = v_idperiododistribucion.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
        ),0)+1),p_idusuario
      ) returning iddocumento into v_iddocumento;
      INSERT INTO mod_logdistribucion.dat_distribucion
      (
        iddistribucion,idestructuraop,tipodestino,tipodistribucion,salidaporfactura
      )
      VALUES (v_iddocumento,p_idestructuracomun,1,3,1);
      INSERT INTO mod_logistica.dat_documentocliente
      (
        iddocumento,idcliente,tipocliente
      )
      VALUES (v_iddocumento,v_idcliente,1);
      
      --insertando productos de la distribucion
      if v_reservadispprec.reservadisponible = 1 then
      		with prodorden AS (INSERT INTO 
                  mod_logdistribucion.dat_prodorden
                (
                  idproducto,idcliente,cantidad,idorden
                )
                (
                select DISTINCT def.idprod, v_idcliente,def.cantidad,v_iddocumento
                from mod_logfacturacion.dat_elementosfactura def
                where def.idfactura = p_idoferta
                ) RETURNING idprodorden, cantidad, idproducto)
                INSERT INTO 
                  mod_logdistribucion.dat_prodordencmpto
                (
                  idprodorden,enproceso,entregado,pendiente,cantidadoriginal
                )
                select idprodorden,cantidad, 0,0,cantidad from prodorden;
      ELSE
      		with prodorden AS (INSERT INTO 
                  mod_logdistribucion.dat_prodorden
                (
                  idproducto,idcliente,cantidad,idorden
                )
                (
                select DISTINCT def.idprod, v_idcliente,def.cantidad,v_iddocumento
                from mod_logfacturacion.dat_elementosfactura def
                where def.idfactura = p_idoferta
                ) RETURNING idprodorden, cantidad, idproducto),
                cantidadcomp as (
                  INSERT INTO 
                    mod_logistica.dat_cantidadcomprometida
                  (
                    iddocumento,idproducto,idcliente,cantidad,estado
                  ) 
                  select v_iddocumento,idproducto,v_idcliente,cantidad,1 from prodorden
                  RETURNING iddocumento
                )
                INSERT INTO 
                  mod_logdistribucion.dat_prodordencmpto
                (
                  idprodorden,enproceso,entregado,pendiente,cantidadoriginal
                )
                select idprodorden,cantidad, 0,0,cantidad from prodorden;
      end if;
      
      --relacion distribucion oferta
      INSERT INTO mod_logistica.dat_documentopadre
      (
        iddocumento,idpadre
      )
      VALUES (v_iddocumento,p_idoferta);
      
      --insertando factura
      
      select df.idcondicionpago as idterminodepago, df.dias as plazo into v_condicionpago 
      from mod_logfacturacion.dat_docfactura df
      where df.idfactura = p_idoferta limit 1;
            
      v_idcuentacliente := (select cbc.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente cbc 
      where cbc.idfactura = p_idoferta and cbc.idmoneda = 9900000000 limit 1);
            
            
      v_idperiodofacturacion = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);
      
      v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
            where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
      for v_iddeposito in (
      	select distinct dp.idestructura from mod_logistica.dat_producto dp
        inner join mod_logfacturacion.dat_elementosfactura def on def.idprod = dp.idproducto
        where def.idfactura = p_idoferta
      ) loop
      	with documento AS (INSERT INTO mod_logistica.dat_documento
                (
                  iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                  idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
                )
                VALUES (
                  v_iddocfacturacion, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                  v_fechafacturacion,'Factura generada a partir de oferta #'||v_nrooferta,0,1,p_idusuario,1,v_idperiodofacturacion.idejercicioactual,
                  p_idestructuracomun, v_idperiodofacturacion.idperiodoactual,
                  (COALESCE((
                    select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocfacturacion
                    and dd.idejercicio = v_idperiodofacturacion.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
                  ),0)+1),1,v_idoperacionfactura
                ) returning iddocumento,iddoc,idejercicio,idestructuracomun),
                factura as (
                INSERT INTO 
                  mod_logfacturacion.dat_docfactura
                  (
                    idfactura,idcliente,iddeposito,oferta,idsubsistema,idejercicio,
                    idestructuracomun,iddoc,nrorden,idcondicionpago,dias
                  )
                  select iddocumento,v_idcliente,v_iddeposito,0,10,idejercicio,idestructuracomun,
                  iddoc,v_nrooferta,v_condicionpago.idterminodepago,v_condicionpago.plazo from documento
                  returning idcliente, idfactura
                ),
                cuenta as (
                  INSERT INTO 
                    mod_logfacturacion.dat_cuentafacturacliente
                    (
                      idfactura,idcuentacliente
                    )
                    select idfactura, v_idcuentacliente from factura
                    returning idfactura
                ),
                documentocliente as (
                INSERT INTO 
                    mod_logistica.dat_documentocliente
                  (
                    iddocumento,idcliente,tipocliente,idcondicionpago
                  )
                  select idfactura, idcliente, 1, v_condicionpago.idterminodepago from factura
                  RETURNING iddocumento
                )
                INSERT INTO 
                  mod_logistica.dat_documentopadre
                (
                  iddocumento,idpadre
                )
                select iddocumento, v_iddocumento from documentocliente 
                RETURNING iddocumento into v_idfactura;
                
                for v_producto in (
                	select dp.idproducto, dp.precio, dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable,
                    dp.idindicador, dps.idtipoprecio, def.cantidad, def.preciotarifabase 
                    from mod_logistica.dat_producto dp
                    inner join mod_logfacturacion.dat_elementosfactura def on def.idprod = dp.idproducto
                    inner join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
                    where def.idfactura = p_idoferta and dp.idestructura = v_iddeposito
                ) LOOP
                    v_precioventa := 0;
                    v_referencia := 0;
                    INSERT INTO 
                          mod_logistica.dat_movimiento
                        (
                          iddocumento,idproducto,preciocontable,importecontable,cantidad,cronologia,signo,idunidadmedida,
                          idelementogasto,idclasificacion
                        )
                        VALUES (
                          v_idfactura,v_producto.idproducto,v_producto.precio,round(v_producto.precio*v_producto.cantidad),v_producto.cantidad,0,'-',
                          v_producto.idumedida,v_producto.idelementogasto,v_producto.idclasificacioncontable
                        ) returning idmovimiento into v_idmovfactura;
                    if v_producto.idtipoprecio <> -1 and v_producto.idtipoprecio <> -2 then
                    	for v_datosprecioventa in (
                            select distinct dp.idcuentadesgloseprecio, dm.preciopromedio, dmm.idmoneda, dp.concepto, dp.porciento, dp.valor
                             from mod_logfacturacion.dat_matrizprecio dm
                            inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm on dmm.idmatrizprecio = dm.idmatrizprecio
                            inner join mod_logfacturacion.dat_precio dp on dp.idmatrizpreciodualidadmonetaria = dmm.idmatrizpreciodualidadmonetaria
                            where dm.idindicador = v_producto.idindicador and dm.idtipoprecio = v_producto.idtipoprecio and dm.idestructuracomun = (
                                select conf.idpadrematriz from mod_logfacturacion.conf_configuracionfactura conf where conf.idestructuracomun = p_idestructuracomun limit 1
                            ) and dmm.idmoneda = 9900000000
                        ) LOOP
                            if v_referencia = 0 THEN
                                if v_datosprecioventa.preciopromedio = 1 then
                                   v_referencia := v_producto.precio;
                                end if;                
                                v_precioventa := v_referencia;
                            end if;
                            if v_datosprecioventa.porciento = 1 THEN
                                v_margenAux := (v_referencia*v_datosprecioventa.valor/100);
                                v_precioventa := v_precioventa + v_margenAux;
                            else
                                v_margenAux :=  v_datosprecioventa.valor;
                                v_precioventa := v_precioventa + v_datosprecioventa.valor;
                            end if;
                            INSERT INTO 
                                  mod_logfacturacion.dat_elementocategoria
                                (
                                  idcuentadesgloseprecio,
                                  valor,
                                  idindicador,
                                  idmovimiento,
                                  idmoneda,
                                  concepto
                                )
                                VALUES (
                                  v_datosprecioventa.idcuentadesgloseprecio,
                                  v_margenAux,
                                  v_producto.idindicador,
                                  v_idmovfactura,
                                  v_datosprecioventa.idmoneda,
                                  v_datosprecioventa.concepto
                                );
                        end loop;
                    elseif v_producto.idtipoprecio = -1 then
                    	v_precioventa := v_producto.precio;
                    	v_referencia := v_producto.precio;
                    else
                    	v_precioventa := v_producto.preciotarifabase;
                    	v_referencia := v_producto.preciotarifabase;    
                    end if;
                    with movmoneda as (
                        insert into mod_logistica.dat_movmoneda 
                        (
                            idmovimiento, idmoneda, precio
                        )
                        values (v_idmovfactura, 9900000000, v_precioventa)
                        returning idmovimiento
                    )
                    INSERT INTO 
                      mod_logfacturacion.dat_prodfactura
                    (
                      idmovimiento,idtipoprecio,preciobase,referencia
                    )
                    select idmovimiento, v_producto.idtipoprecio, v_precioventa, v_producto.precio from movmoneda;
                    
                    
                end loop;
      end loop;
   
   v_respuesta := (select array_to_string(array_agg(dd.numeroref),', ') from mod_logistica.dat_documento dd
   inner join mod_logistica.dat_documentopadre dp on dp.iddocumento = dd.iddocumento
   where dp.idpadre = v_iddocumento);
    
   return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logfacturacion.f_generardistribucionfactura (p_idoferta numeric, p_idusuario numeric, p_idestructuracomun numeric)
  OWNER TO zeolides;