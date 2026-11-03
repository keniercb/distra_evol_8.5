CREATE OR REPLACE FUNCTION public.ft_entregarpedido (
)
RETURNS trigger AS
$body$
DECLARE
  v_productos record;
BEGIN
  if NEW.estado = 5 then
    update mod_logpuntoventa.dat_pedidoproducto set procesado = coalesce(procesado,0) + coalesce(enproceso,0),
    enproceso = 0
    where idpedidotienda = NEW.idpedidotienda;
  end if;
  return new;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION public.ft_entregarpedido ()
  OWNER TO postgres;


CREATE TRIGGER dat_pedidotienda_tr
  AFTER UPDATE OF estado 
  ON mod_logpuntoventa.dat_pedidotienda
  
FOR EACH ROW 
  EXECUTE PROCEDURE public.ft_entregarpedido();
  
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidomismaentidad (
  p_areaventa numeric,
  p_idestructuracomun numeric,
  p_idusuario numeric,
  p_idejercicio numeric,
  p_idperiodo numeric
)
RETURNS void AS
$body$
DECLARE
  v_iddoc numeric;
  v_iddocumento numeric;
  v_idespecialidad numeric;
  v_idperiodo record;
  v_fechafacturacion date;
  v_configtienda record;
  v_idpersona numeric;
  v_productos record;
  v_pedidos record;
  v_configTiendaOrigen record;
  v_iddocTV numeric;
BEGIN
	
    v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'compventaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
    
    v_iddocTV := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'transTiendaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);            
                
    select da.* into v_configtienda from mod_logpuntoventa.dat_areaventa da where da.idestructuracomun = p_idestructuracomun
    and da.idareaventa = p_areaventa limit 1;
    
    v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
    
    for v_pedidos in (
    	select pt.* from mod_logpuntoventa.dat_pedidotienda pt
                      where pt.idareaventa = p_areaventa and pt.estado = 2 and pt.id_state in (
                  select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                  inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                  and cea.idestructura = p_idestructuracomun and cea.idareaventa = p_areaventa
                  )
    ) loop 
        v_idpersona := (
            select vc.idventacliente from mod_logpuntoventa.dat_ventacliente vc 
            where vc.numeroidentidad = v_pedidos.cibeneficiario limit 1
        );
        
        if v_idpersona is null then
            
            INSERT INTO 
              mod_logpuntoventa.dat_ventacliente
            (
              numeroidentidad,
              nombre,
              telefono,
              direccion/*,
              correo,
              fechainscripcion,
              idprovincia,
              provincia,
              idmunicipio,
              municipio,
              tipo,
              idexterno*/
            )
            VALUES (
              v_pedidos.cibeneficiario,
              v_pedidos.beneficiario,
              v_pedidos.telbeneficiario,
              v_pedidos.dirbeneficiario
            ) returning idventacliente into v_idpersona;
        end if;
        
        with documento AS (INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
            )
            VALUES (
              v_iddoc, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechafacturacion,'Factura generada tienda virtual: Pedido '||v_pedidos.nropedido,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
              v_configtienda.idestructuraop, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
              ),0)+1),1,v_configtienda.idnomoperaciones
            ) returning iddocumento,iddoc,idejercicio,idestructuracomun),
            venta as (
            INSERT INTO 
                mod_logpuntoventa.dat_ventas
              (
                idventas,
                idpersona,
                fechaventa,
                importe,
                --idcaja,
                idpago,
                idareaventa,
                --efectivo,
                --cambio,
                --fechaexpiracion,
                --nroventa,
                estado,
                --idcierreventa,
                --tipoventa,
                --vendedor,
                idmoneda--,
                --importedevuelto,
                --identrega,
                --nrofactura
              )
              select iddocumento,
                v_idpersona,
                v_fechafacturacion,
                (select sum(round(pp.precio*pp.cantidad,2))/*sum(pp.importe-(round(pp.precio*coalesce(pp.devuelto,0),2)))*/ from mod_logpuntoventa.dat_pedidoproducto pp 
                where pp.idpedidotienda = v_pedidos.idpedidotienda),
                --?idcaja,
                v_configtienda.idmodopago/*-3*/,
                v_configtienda.idareaventa,
                --?efectivo,
                --?cambio,
                --?fechaexpiracion,
                --?nroventa,
                1,
                --?idcierreventa,
                --?tipoventa,
                --?vendedor,
                v_configtienda.idmoneda
                --?importedevuelto,
                --?identrega,
                --?nrofactura
                from documento returning idventas),
                
            ventaorden as (
                INSERT INTO 
                  mod_logpuntoventa.dat_ventaorden
                (
                  idorden,
                  nroorden,
                  --pago,
                  --envio,
                  fechaorden,
                  estadoorden,
                  idventas,
                  tiendavirtual,
                  idareaventaorigen,
                  idreferencia
                )
                select idventas, v_pedidos.nropedido,v_pedidos.fechapedido,v_pedidos.estado, idventas, 1, v_pedidos.idareaventa, v_pedidos.idreferencia from venta 
            ),
            documentopedido as (
                INSERT INTO mod_logpuntoventa.dat_pedidodocumento
                (
                  idpedido,iddocumento,tipo
                )
                select v_pedidos.idpedidotienda, iddocumento, 4 from documento
            )
            INSERT INTO 
                mod_logistica.dat_documentocliente
              (
                iddocumento,idcliente,tipocliente,idcondicionpago
              )
              select iddocumento, v_configtienda.idcliente, 1, v_configtienda.idcondicionpago from documento
              RETURNING iddocumento into v_iddocumento; 
            
            for v_productos in (
                    select dp.precio, pp.idproductopedido, (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) as cantidad,
                    dp.idumedida, dp.*, pp.precio as preciopedido, (pp.cantidad - pp.devuelto) as cantidadpedido
                    from mod_logpuntoventa.dat_pedidoproducto pp
                          inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
                          where pp.idpedidotienda = v_pedidos.idpedidotienda
                          and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0
                ) loop
                
                with movimiento as (
                        INSERT INTO 
                          mod_logistica.dat_movimiento
                        (
                          iddocumento,
                          idproducto,
                          preciocontable,
                          importecontable,
                          cantidad,
                          cronologia,
                          signo,
                          idunidadmedida,
                          idelementogasto,
                          idclasificacion
                        )
                        VALUES (
                          v_iddocumento,
                          v_productos.idproducto,
                          v_productos.precio,
                          round(v_productos.cantidadpedido*v_productos.precio,2),
                          v_productos.cantidadpedido,
                          0,
                          '-',
                          v_productos.idumedida,
                          v_productos.idelementogasto,
                          v_productos.idclasificacioncontable
                        ) returning idmovimiento, preciocontable, idproducto
                    ), movmoneda as (
                        insert into mod_logistica.dat_movmoneda 
                      (
                          idmovimiento, idmoneda, precio
                      )
                      select idmovimiento, v_configtienda.idmoneda, v_productos.preciopedido from movimiento
                    ), cantidadcomp as (
                      INSERT INTO 
                        mod_logistica.dat_cantidadcomprometida
                      (
                        iddocumento,idproducto,idcliente,cantidad,estado
                      ) 
                      select v_iddocumento,idproducto,v_configtienda.idcliente,v_productos.cantidadpedido,1 from movimiento
                      RETURNING iddocumento
                    )
                    INSERT INTO 
                      mod_logpuntoventa.dat_ventaproducto
                    (
                      idproducto,
                      idventas,
                      cantidad,
                      precio,
                      importetotal
                    )
                    select idproducto, v_iddocumento, v_productos.cantidadpedido, v_productos.preciopedido,
                     round(v_productos.preciopedido*v_productos.cantidadpedido,2) from movimiento;
                
                update mod_logpuntoventa.dat_pedidoproducto
                          set enproceso = enproceso + coalesce(v_productos.cantidadpedido,0) 
                          where idproductopedido = v_productos.idproductopedido;
            end loop;
            PERFORM mod_logpuntoventa.f_actualizardisponibletienda(v_iddocTV, v_iddocumento);
    end LOOP;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidomismaentidad (p_areaventa numeric, p_idestructuracomun numeric, p_idusuario numeric, p_idejercicio numeric, p_idperiodo numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_actualizardisponibletienda (
  p_iddoc numeric,
  p_iddocumentos numeric
)
RETURNS void AS
$body$
DECLARE
v_rec record;
v_cant numeric;
v_reccomp record;
v_idproducto numeric;
BEGIN
for v_rec in (select v.idproducto,sum(v.cantidad) as cantidad from mod_logistica.dat_movimiento v 
    where v.iddocumento = p_iddocumentos group by v.idproducto) loop
    
    for v_reccomp in SELECT cc.*
      FROM mod_logistica.dat_cantidadcomprometida cc
      inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
      where d.iddoc = p_iddoc and cc.idproducto = v_rec.idproducto and cc.estado = 1
      order by d.fechacontable asc loop
     
          --raise notice 'v_reccomp%',v_reccomp;
          --raise notice 'v_idproducto%',v_idproducto;
          --raise notice 'v_rec.idproducto%',v_rec.idproducto;

      if v_idproducto is null or v_idproducto <> v_rec.idproducto then
          v_cant = v_rec.cantidad;
          v_idproducto = v_rec.idproducto;
      end if;
          --raise notice 'v_idproducto%',v_idproducto;
          --raise notice 'v_cant%',v_cant;
      
      if v_reccomp.cantidad >= v_cant and v_cant > 0 then
          --raise notice 'aqui 1%',v_reccomp.cantidad;
          UPDATE mod_logistica.dat_cantidadcomprometida 
            SET cantidad = cantidad - v_cant --, estado = 2
          WHERE 
  			idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
          v_cant = 0;
          CONTINUE;
      elseif v_reccomp.cantidad < v_cant and v_cant > 0 then
          v_cant = v_cant - v_reccomp.cantidad;          
          --raise notice 'dos 1%',v_reccomp.cantidad;
          UPDATE mod_logistica.dat_cantidadcomprometida 
            SET cantidad = 0, estado = 2
          WHERE 
  			idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
          CONTINUE;
      --end if;
          --v_cant = v_rec.cantidad - v_rec.vendida;
      end if;
      
    end loop;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_actualizardisponibletienda (p_iddoc numeric, p_iddocumentos numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidostienda (
  p_idusuario numeric,
  p_idejercicio numeric,
  p_idperiodo numeric,
  p_idestructuracomun numeric,
  p_areaventa numeric
)
RETURNS void AS
$body$
DECLARE
  v_iddocdistribucion numeric;
  v_iddocfacturacion numeric;
  v_iddocumento numeric;
  v_idfactura numeric;
  v_idespecialidad numeric;
  v_idperiododistribucion record;
  v_idperiodofacturacion record;
  v_fechadistribucion date;
  v_fechafacturacion date;
  v_centroentrega record;
  v_idcliente numeric;
  v_pedidos record;
  v_idoperacionfactura numeric;
  v_producto record;
  v_iddepositoorigen numeric;
  v_condicionpago record;
  v_idcuentacliente numeric;
  v_datosareaventa record;
  v_datosprecioventa record;
  v_idmovfactura numeric;
  v_precioventa numeric;
  v_margenAux numeric;
  v_referencia numeric;
BEGIN
	--Inicializando parametros para adicionar distribucion general con los productos de los pedidos
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
    
    /*v_idoperacionfactura := (select dop.idnomoperaciones from mod_logfacturacion.dat_operacionsubsistema dop 
    where dop.idestructura = p_idestructuracomun and dop.tiendavirtual = 1 limit 1);
    
    v_iddepositoorigen := (select da.idestructuraop from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa);*/
    
    select da.*, di.tipo into v_datosareaventa from mod_logpuntoventa.dat_areaventa da 
    inner join mod_logpuntoventa.dat_infoconexion di on di.idinfoconexion = da.idinfoconexion
    where da.idareaventa = p_areaventa;
    
    v_idoperacionfactura := v_datosareaventa.idnomoperaciones;
    
    v_iddepositoorigen := v_datosareaventa.idestructuraop;
    
    raise notice 'idespecialidad ,%', v_idespecialidad ;
    raise notice 'fechadist ,%', v_fechadistribucion ; 
    --Insertando distribucion
    for v_centroentrega in (
    	select distinct cent.idestructura from mod_logpuntoventa.dat_centroentregaalmacen cent
        inner join mod_logpuntoventa.dat_almacenregion ar on ar.idestructura = cent.iddeposito
        inner join mod_logpuntoventa.dat_pedidotienda pt on pt.id_state = ar.id_state
        where cent.idareaventa = p_areaventa and pt.estado = 2
    ) loop
    	
        if v_datosareaventa.tipoventa = 2 then
        	if v_centroentrega.idestructura = p_idestructuracomun THEN
        		PERFORM mod_logpuntoventa.f_procesarpedidomismaentidad(p_areaventa,v_centroentrega.idestructura,p_idusuario,p_idejercicio, p_idperiodo);
        	else
                v_idcliente := (select nc.idclientesproveedores from mod_datosmaestros.nom_clientesproveedor nc
                                where nc.idestructura = v_centroentrega.idestructura limit 1);
                INSERT INTO mod_logistica.dat_documento
                (
                  iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                  idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
                )
                VALUES (
                  v_iddocdistribucion, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                  v_fechadistribucion,'Distribucion generada de tienda virtual',0,1,p_idusuario,3,v_idperiododistribucion.idejercicioactual,
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
                VALUES (v_iddocumento,p_idestructuracomun,1,7,1);
                INSERT INTO mod_logistica.dat_documentocliente
                (
                  iddocumento,idcliente,tipocliente
                )
                VALUES (v_iddocumento,v_idcliente,1);
                --insertando productos de la distribucion
                if v_datosareaventa.tipo = 'ps' or v_datosareaventa.tipo = 'gjt' then 
                      with prodorden AS (INSERT INTO 
                        mod_logdistribucion.dat_prodorden
                      (
                        idproducto,idcliente,cantidad,idorden
                      )
                      (
                      select DISTINCT pp.idproducto, v_idcliente,sum(pp.cantidad) as cantidad,v_iddocumento
                      from mod_logpuntoventa.dat_pedidoproducto pp
                      inner join mod_logpuntoventa.dat_pedidotienda ptt on ptt.idpedidotienda = pp.idpedidotienda
                      where ptt.idareaventa = p_areaventa and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0
                      and ptt.estado = 2 and ptt.id_state in (
                      select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                      inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                      and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                      )
                      group by pp.idproducto
                      ) RETURNING idprodorden, cantidad, idproducto)
                      INSERT INTO 
                        mod_logdistribucion.dat_prodordencmpto
                      (
                        idprodorden,enproceso,entregado,pendiente,cantidadoriginal
                      )
                      select idprodorden,0, 0,cantidad,cantidad from prodorden;
                  else 
                      with prodorden AS (INSERT INTO 
                        mod_logdistribucion.dat_prodorden
                      (
                        idproducto,idcliente,cantidad,idorden
                      )
                      (
                      select DISTINCT pp.idproducto, v_idcliente,sum(pp.cantidad) as cantidad,v_iddocumento
                      from mod_logpuntoventa.dat_pedidoproducto pp
                      inner join mod_logpuntoventa.dat_pedidotienda ptt on ptt.idpedidotienda = pp.idpedidotienda
                      where ptt.idareaventa = p_areaventa and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0
                      and ptt.estado = 2 and ptt.id_state in (
                      select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                      inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                      and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                      )
                      group by pp.idproducto
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
                      select idprodorden,0, 0,cantidad,cantidad from prodorden;
                  end if;
                  
                  --Insertando relacion de los pedidos y la distribucion
                  INSERT INTO mod_logpuntoventa.dat_pedidodocumento
                  (
                    idpedido,iddocumento,tipo
                  )
                  (select pt.idpedidotienda, v_iddocumento, 1 from mod_logpuntoventa.dat_pedidotienda pt
                      where pt.idareaventa = p_areaventa and pt.estado = 2 and pt.id_state in (
                  select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                  inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                  and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                  )
                  );
                  --inertando facturas
                  select cc.idterminodepago, ntp.plazo into v_condicionpago from mod_datosmaestros.dat_clienteproveedorcobropago cc
                  inner join mod_datosmaestros.nom_terminosdepago ntp on ntp.idterminodepago = cc.idterminodepago
                  where cc.idclienteproveedor = v_idcliente and cc.clasificacion = 2 and cc.idmoneda = 9900000000 limit 1;
                  
                  v_idcuentacliente := (select cbc.idcuentabancliente from mod_datosmaestros.dat_cuentabanccliente cbc 
                  where cbc.idclienteproveedores = v_idcliente and cbc.idmoneda = 9900000000 limit 1);
                  
                  
                  v_idperiodofacturacion = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);
                  
                  v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
                  inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
                  where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
                  
                  --Insertando factura resumen
                  with documento AS (INSERT INTO mod_logistica.dat_documento
                      (
                        iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                        idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
                      )
                      VALUES (
                        v_iddocfacturacion, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                        v_fechafacturacion,'Factura generada tienda virtual. Resumen',0,1,p_idusuario,1,v_idperiodofacturacion.idejercicioactual,
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
                        select iddocumento,v_idcliente,v_iddepositoorigen,0,10,idejercicio,idestructuracomun,
                        iddoc,null,v_condicionpago.idterminodepago,v_condicionpago.plazo from documento
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
                  --insertando productos a factura resumen
                  for v_producto in (
                          select distinct dp.idproducto, dp.precio, dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable,
                          dp.idindicador
                           from mod_logpuntoventa.dat_pedidoproducto pp
                          inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
                          where pp.idpedidotienda in (
                          	--pedidos pendientes
                              select pt.idpedidotienda from mod_logpuntoventa.dat_pedidodocumento pd
                                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
                                where pt.idareaventa = p_areaventa and pt.estado = 2 and pd.iddocumento = v_iddocumento and (
                                    select sum(coalesce(ppp.cantidad,0)-coalesce(ppp.enproceso,0)-coalesce(ppp.procesado,0)) 
                                    from mod_logpuntoventa.dat_pedidoproducto ppp where ppp.idpedidotienda = pt.idpedidotienda
                                ) > 0 and pt.id_state in (
                                select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                                inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                                and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                              )
                          ) and dp.idestructura = v_iddepositoorigen
                          and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0 
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
                                v_idfactura,v_producto.idproducto,v_producto.precio,0,0,0,'-',
                                v_producto.idumedida,v_producto.idelementogasto,v_producto.idclasificacioncontable
                              ) returning idmovimiento into v_idmovfactura;
                          for v_datosprecioventa in (
                              select distinct dp.idcuentadesgloseprecio, dm.preciopromedio, dmm.idmoneda, dp.concepto, dp.porciento, dp.valor
                               from mod_logfacturacion.dat_matrizprecio dm
                              inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm on dmm.idmatrizprecio = dm.idmatrizprecio
                              inner join mod_logfacturacion.dat_precio dp on dp.idmatrizpreciodualidadmonetaria = dmm.idmatrizpreciodualidadmonetaria
                              where dm.idindicador = v_producto.idindicador and dm.idtipoprecio = v_datosareaventa.idtipoprecioagencia and dm.idestructuracomun = (
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
                          select idmovimiento, v_datosareaventa.idtipoprecioagencia, v_precioventa, v_producto.precio from movmoneda;
                          update mod_logpuntoventa.dat_pedidoproducto
                          set enproceso = cantidad - coalesce(procesado,0)
                          where idproductopedido in (
                                select pp.idproductopedido
                               from mod_logpuntoventa.dat_pedidoproducto pp
                              inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
                              where pp.idpedidotienda in (
                                --pedidos pendientes
                                  select pt.idpedidotienda from mod_logpuntoventa.dat_pedidodocumento pd
                                    inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
                                    where pt.idareaventa = p_areaventa and pt.estado = 2 and pd.iddocumento = v_iddocumento and (
                                        select sum(coalesce(ppp.cantidad,0)-coalesce(ppp.enproceso,0)-coalesce(ppp.procesado,0)) 
                                        from mod_logpuntoventa.dat_pedidoproducto ppp where ppp.idpedidotienda = pt.idpedidotienda
                                    ) > 0 and pt.id_state in (
                                    select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                                    inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                                    and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                                  )
                              ) and dp.idestructura = v_iddepositoorigen
                              and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0
                          );
                          
                      end loop;
                  
                  
                  
                  
                  for v_pedidos in (
                      select pt.*, pd.* from mod_logpuntoventa.dat_pedidodocumento pd
                      inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
                      where pt.idareaventa = p_areaventa and pt.estado = 2 and pd.iddocumento = v_iddocumento and pt.id_state in (
                      select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                      inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                      and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                      )
                  ) loop                 
                      --insertando relacion pedidos factura resumen
                      
                      INSERT INTO mod_logpuntoventa.dat_pedidodocumento
                      (
                        idpedido,iddocumento,tipo
                      )
                      VALUES(v_pedidos.idpedidotienda, v_idfactura, 2);
                  end loop;
              end if;
        else
        	if v_centroentrega.idestructura = p_idestructuracomun THEN
        		PERFORM mod_logpuntoventa.f_procesarpedidomismaentidad(p_areaventa,v_centroentrega.idestructura,p_idusuario,p_idejercicio, p_idperiodo);
        	else
                v_idcliente := (select nc.idclientesproveedores from mod_datosmaestros.nom_clientesproveedor nc
                                where nc.idestructura = v_centroentrega.idestructura limit 1);
                INSERT INTO mod_logistica.dat_documento
                (
                  iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                  idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
                )
                VALUES (
                  v_iddocdistribucion, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                  v_fechadistribucion,'Distribucion generada de tienda virtual',0,1,p_idusuario,3,v_idperiododistribucion.idejercicioactual,
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
                VALUES (v_iddocumento,p_idestructuracomun,1,7,1);
                INSERT INTO mod_logistica.dat_documentocliente
                (
                  iddocumento,idcliente,tipocliente
                )
                VALUES (v_iddocumento,v_idcliente,1);
                --insertando productos de la distribucion
                if v_datosareaventa.tipo = 'ps' or v_datosareaventa.tipo = 'gjt' then 
                      with prodorden AS (INSERT INTO 
                        mod_logdistribucion.dat_prodorden
                      (
                        idproducto,idcliente,cantidad,idorden
                      )
                      (
                      select DISTINCT pp.idproducto, v_idcliente,sum(pp.cantidad) as cantidad,v_iddocumento
                      from mod_logpuntoventa.dat_pedidoproducto pp
                      inner join mod_logpuntoventa.dat_pedidotienda ptt on ptt.idpedidotienda = pp.idpedidotienda
                      where ptt.idareaventa = p_areaventa and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0
                      and ptt.estado = 2 and ptt.id_state in (
                      select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                      inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                      and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                      )
                      group by pp.idproducto
                      ) RETURNING idprodorden, cantidad, idproducto)/*,
                      cantidadcomp as (
                        INSERT INTO 
                          mod_logistica.dat_cantidadcomprometida
                        (
                          iddocumento,idproducto,idcliente,cantidad,estado
                        ) 
                        select v_iddocumento,idproducto,v_idcliente,cantidad,1 from prodorden
                        RETURNING iddocumento
                      )*/
                      INSERT INTO 
                        mod_logdistribucion.dat_prodordencmpto
                      (
                        idprodorden,enproceso,entregado,pendiente,cantidadoriginal
                      )
                      select idprodorden,0, 0,cantidad,cantidad from prodorden;
                  else 
                      with prodorden AS (INSERT INTO 
                        mod_logdistribucion.dat_prodorden
                      (
                        idproducto,idcliente,cantidad,idorden
                      )
                      (
                      select DISTINCT pp.idproducto, v_idcliente,sum(pp.cantidad) as cantidad,v_iddocumento
                      from mod_logpuntoventa.dat_pedidoproducto pp
                      inner join mod_logpuntoventa.dat_pedidotienda ptt on ptt.idpedidotienda = pp.idpedidotienda
                      where ptt.idareaventa = p_areaventa and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0
                      and ptt.estado = 2 and ptt.id_state in (
                      select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                      inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                      and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                      )
                      group by pp.idproducto
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
                      select idprodorden,0, 0,cantidad,cantidad from prodorden;
                  end if;
                  
                  --Insertando relacion de los pedidos y la distribucion
                  INSERT INTO mod_logpuntoventa.dat_pedidodocumento
                  (
                    idpedido,iddocumento,tipo
                  )
                  (select pt.idpedidotienda, v_iddocumento, 1 from mod_logpuntoventa.dat_pedidotienda pt
                      where pt.idareaventa = p_areaventa and pt.estado = 2 and pt.id_state in (
                  select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                  inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                  and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                  )
                  );
                  --inertando facturas
                  select cc.idterminodepago, ntp.plazo into v_condicionpago from mod_datosmaestros.dat_clienteproveedorcobropago cc
                  inner join mod_datosmaestros.nom_terminosdepago ntp on ntp.idterminodepago = cc.idterminodepago
                  where cc.idclienteproveedor = v_idcliente and cc.clasificacion = 2 and cc.idmoneda = 9900000000 limit 1;
                  
                  v_idcuentacliente := (select cbc.idcuentabancliente from mod_datosmaestros.dat_cuentabanccliente cbc 
                  where cbc.idclienteproveedores = v_idcliente and cbc.idmoneda = 9900000000 limit 1);
                  
                  
                  v_idperiodofacturacion = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);
                  
                  v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
                  inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
                  where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
                  for v_pedidos in (
                      select pt.*, pd.* from mod_logpuntoventa.dat_pedidodocumento pd
                      inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
                      where pt.idareaventa = p_areaventa and pt.estado = 2 and pd.iddocumento = v_iddocumento and (
                          select sum(coalesce(ppp.cantidad,0)-coalesce(ppp.enproceso,0)-coalesce(ppp.procesado,0)) 
                          from mod_logpuntoventa.dat_pedidoproducto ppp where ppp.idpedidotienda = pt.idpedidotienda
                      ) > 0 and pt.id_state in (
                      select alr.id_state from mod_logpuntoventa.dat_almacenregion alr
                      inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = alr.idestructura
                      and cea.idestructura = v_centroentrega.idestructura and cea.idareaventa = p_areaventa
                      )
                  ) loop
                  
                      with documento AS (INSERT INTO mod_logistica.dat_documento
                      (
                        iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                        idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
                      )
                      VALUES (
                        v_iddocfacturacion, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                        v_fechafacturacion,'Factura generada tienda virtual. Pedido '||v_pedidos.nropedido,0,1,p_idusuario,1,v_idperiodofacturacion.idejercicioactual,
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
                        select iddocumento,v_idcliente,v_iddepositoorigen,0,10,idejercicio,idestructuracomun,
                        iddoc,v_pedidos.nropedido,v_condicionpago.idterminodepago,v_condicionpago.plazo from documento
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
                      --insertando productos a la factura
                      for v_producto in (
                          select pp.idproductopedido, dp.idproducto, dp.precio, dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable,
                          dp.idindicador
                           from mod_logpuntoventa.dat_pedidoproducto pp
                          inner join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
                          where pp.idpedidotienda = v_pedidos.idpedidotienda and dp.idestructura = v_iddepositoorigen
                          and (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0 
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
                                v_idfactura,v_producto.idproducto,v_producto.precio,0,0,0,'-',
                                v_producto.idumedida,v_producto.idelementogasto,v_producto.idclasificacioncontable
                              ) returning idmovimiento into v_idmovfactura;
                          for v_datosprecioventa in (
                              select distinct dp.idcuentadesgloseprecio, dm.preciopromedio, dmm.idmoneda, dp.concepto, dp.porciento, dp.valor
                               from mod_logfacturacion.dat_matrizprecio dm
                              inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm on dmm.idmatrizprecio = dm.idmatrizprecio
                              inner join mod_logfacturacion.dat_precio dp on dp.idmatrizpreciodualidadmonetaria = dmm.idmatrizpreciodualidadmonetaria
                              where dm.idindicador = v_producto.idindicador and dm.idtipoprecio = v_datosareaventa.idtipoprecioagencia and dm.idestructuracomun = (
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
                          select idmovimiento, v_datosareaventa.idtipoprecioagencia, v_precioventa, v_producto.precio from movmoneda;
                          update mod_logpuntoventa.dat_pedidoproducto
                          set enproceso = cantidad - coalesce(procesado,0)
                          where idproductopedido = v_producto.idproductopedido;
                          
                      end loop;
                      INSERT INTO mod_logpuntoventa.dat_pedidodocumento
                      (
                        idpedido,iddocumento,tipo
                      )
                      VALUES(v_pedidos.idpedidotienda, v_idfactura, 2);
                  end loop;
              end if;
        end if;
    	
    end loop;  
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidostienda (p_idusuario numeric, p_idejercicio numeric, p_idperiodo numeric, p_idestructuracomun numeric, p_areaventa numeric)
  OWNER TO zeolides;