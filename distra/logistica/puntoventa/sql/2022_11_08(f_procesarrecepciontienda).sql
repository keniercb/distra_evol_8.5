CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarrecepciontienda (
  p_idrecepcion numeric,
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
  v_datosrecep record;
  v_idpersona numeric;
  v_datospersona record;
  v_productos record;
BEGIN
	--Inicializando parametros para adicionar distribucion general con los productos de los pedidos
    select dd.* into v_datosrecep from mod_logistica.dat_documento dd
    where dd.iddocumento = p_idrecepcion;
    
    v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'compventaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);            
                
    select da.* into v_configtienda from mod_logpuntoventa.dat_areaventa da where da.idestructuracomun = p_idestructuracomun
    and da.idestructuraop = v_datosrecep.idestructuracomun limit 1;
    
    v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
    
    select pt.* into v_datospersona from mod_logpuntoventa.dat_pedidotienda pt
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda
    where pd.iddocumento = p_idrecepcion limit 1;
    
    v_idpersona := (
    	select vc.idventacliente from mod_logpuntoventa.dat_ventacliente vc 
        where vc.numeroidentidad = v_datospersona.cibeneficiario limit 1
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
          v_datospersona.cibeneficiario,
          v_datospersona.beneficiario,
          v_datospersona.telbeneficiario,
          v_datospersona.dirbeneficiario
        ) returning idventacliente into v_idpersona;
    end if;
    
    with documento AS (INSERT INTO mod_logistica.dat_documento
        (
          iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
          idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
        )
        VALUES (
          v_iddoc, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
          v_fechafacturacion,'Factura generada tienda virtual: Pedido '||v_datospersona.nropedido,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
          v_datosrecep.idestructuracomun, v_idperiodo.idperiodoactual,
          (COALESCE((
            select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
            and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_datosrecep.idestructuracomun
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
            (select sum(pp.importe-(round(pp.precio*coalesce(pp.devuelto,0),2))) from mod_logpuntoventa.dat_pedidoproducto pp 
            where pp.idpedidotienda = v_datospersona.idpedidotienda),
            --?idcaja,
            -3,
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
            select idventas, v_datospersona.nropedido,v_datospersona.fechapedido,v_datospersona.estado, idventas, 1, v_datospersona.idareaventa, v_datospersona.idreferencia from venta 
        ),
        documentopedido as (
        	INSERT INTO mod_logpuntoventa.dat_pedidodocumento
            (
              idpedido,iddocumento,tipo
            )
            select v_datospersona.idpedidotienda, iddocumento, 4 from documento
        ),    
        documentocliente as (
        INSERT INTO 
            mod_logistica.dat_documentocliente
          (
            iddocumento,idcliente,tipocliente,idcondicionpago
          )
          select iddocumento, v_configtienda.idcliente, 1, 83 from documento
          RETURNING iddocumento
        )
        INSERT INTO 
          mod_logistica.dat_documentopadre
        (
          iddocumento,idpadre
        )
        select iddocumento, p_idrecepcion from documentocliente
        returning iddocumento into v_iddocumento;  
        
        for v_productos in (
            	select dp.precio, mrec.cantidad,dp.idumedida, dp.*, pp.precio as preciopedido
                from mod_logistica.dat_movimiento dm
                inner join mod_loginventario.dat_movrecepcion mrec on mrec.idmovimiento = dm.idmovimiento
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join (
                	select distinct ppp.idindicador, ppp.precio, ppp.idpedidotienda from mod_logpuntoventa.dat_pedidoproducto ppp
                ) pp on pp.idindicador = dp.idindicador
                inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento and pp.idpedidotienda = pd.idpedido
                where dm.iddocumento = p_idrecepcion
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
                      round(v_productos.cantidad*v_productos.precio,2),
                      v_productos.cantidad,
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
                  select v_iddocumento,idproducto,v_configtienda.idcliente,v_productos.cantidad,1 from movimiento
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
                select idproducto, v_iddocumento, v_productos.cantidad, v_productos.preciopedido,
                 round(v_productos.preciopedido*v_productos.cantidad,2) from movimiento;
            
        end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarrecepciontienda (p_idrecepcion numeric, p_idestructuracomun numeric, p_idusuario numeric, p_idejercicio numeric, p_idperiodo numeric)
  OWNER TO zeolides;