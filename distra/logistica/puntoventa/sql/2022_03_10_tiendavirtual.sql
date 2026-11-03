CREATE SEQUENCE IF NOT EXISTS mod_logfacturacion.sec_datdespachofactura_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logfacturacion.sec_datdespachoproducto_seq
  INCREMENT 1 MINVALUE 1000000
  MAXVALUE 1099999999 START 1000001
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logfacturacion.sec_datdespachotienda_seq
  INCREMENT 1 MINVALUE 1000000
  MAXVALUE 1099999999 START 1000001
  CACHE 1;
  
CREATE TABLE IF NOT EXISTS mod_logfacturacion.dat_despachotienda (
  iddespachotienda NUMERIC(19,0) DEFAULT nextval('mod_logfacturacion.sec_datdespachotienda_seq'::regclass) NOT NULL,
  nroreferencia NUMERIC(19,0),
  fecha DATE,
  idestructuracomun NUMERIC(19,0),
  iddeposito NUMERIC(19,0),
  idusuario NUMERIC(19,0),
  idaprobado NUMERIC(19,0),
  estado NUMERIC(1,0) DEFAULT 1,
  nrodespacho NUMERIC(10,0),
  CONSTRAINT dat_despachotienda_pkey PRIMARY KEY(iddespachotienda)
) 
WITH (oids = false);

ALTER TABLE mod_logfacturacion.dat_despachotienda
  OWNER TO zeolides;
  
CREATE TABLE IF NOT EXISTS mod_logfacturacion.dat_despachofactura (
  iddespachofactura NUMERIC(19,0) DEFAULT nextval('mod_logfacturacion.sec_datdespachofactura_seq'::regclass) NOT NULL,
  iddespachotienda NUMERIC(19,0),
  idfactura NUMERIC(19,0),
  CONSTRAINT dat_despachofactura_pkey PRIMARY KEY(iddespachofactura),
  CONSTRAINT dat_despachofactura_fk FOREIGN KEY (iddespachotienda)
    REFERENCES mod_logfacturacion.dat_despachotienda(iddespachotienda)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logfacturacion.dat_despachofactura
  OWNER TO zeolides;
  
CREATE TABLE IF NOT EXISTS mod_logfacturacion.dat_despachoproducto (
  iddespachoproducto NUMERIC(19,0) DEFAULT nextval('mod_logfacturacion.sec_datdespachoproducto_seq'::regclass) NOT NULL,
  iddespachotienda NUMERIC(19,0),
  idindicador NUMERIC(19,0),
  cantidad NUMERIC(25,6),
  despachado NUMERIC(25,6),
  CONSTRAINT dat_despachoproducto_pkey PRIMARY KEY(iddespachoproducto),
  CONSTRAINT dat_despachoproducto_fk FOREIGN KEY (iddespachotienda)
    REFERENCES mod_logfacturacion.dat_despachotienda(iddespachotienda)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logfacturacion.dat_despachoproducto
  OWNER TO zeolides;
  
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_actualizarprecioventa (
  p_iddocumento numeric,
  p_idtipoprecio numeric
)
RETURNS void AS
$body$
DECLARE
v_precioventa numeric;
v_referencia numeric;
v_margenAux numeric;
v_movimientos record;
v_datosprecioventa record;
BEGIN

for v_movimientos in (
    select mov.idmovimiento, prd.idindicador, dpf.idtipoprecio, dd.idestructuracomun,
    mov.preciocontable, mov.cantidad 
    from mod_logistica.dat_movimiento mov
    inner join mod_logistica.dat_producto prd on prd.idproducto = mov.idproducto
    inner join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = mov.idmovimiento
    inner join mod_logistica.dat_documento dd on dd.iddocumento = mov.iddocumento
    where mov.iddocumento = p_iddocumento
) LOOP
	v_precioventa := 0;
	v_referencia := 0;
	for v_datosprecioventa in (
        select dm.preciopromedio, dmm.idmoneda, dp.idcuentadesgloseprecio, dp.concepto, dp.porciento, dp.valor
         from mod_logfacturacion.dat_matrizprecio dm
        inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm on dmm.idmatrizprecio = dm.idmatrizprecio
        inner join mod_logfacturacion.dat_precio dp on dp.idmatrizpreciodualidadmonetaria = dmm.idmatrizpreciodualidadmonetaria
        where dm.idindicador = v_movimientos.idindicador and dm.idtipoprecio = p_idtipoprecio and dm.idestructuracomun = (
            select conf.idpadrematriz from mod_logfacturacion.conf_configuracionfactura conf where conf.idestructuracomun = v_movimientos.idestructuracomun limit 1
        ) and dmm.idmoneda = 9900000000
    ) LOOP
        if v_referencia = 0 THEN
            if v_datosprecioventa.preciopromedio = 1 then
               v_referencia := v_movimientos.preciocontable;
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
        update mod_logfacturacion.dat_elementocategoria
        set valor = v_margenAux
        where idmovimiento = v_movimientos.idmovimiento and idcuentadesgloseprecio = v_datosprecioventa.idcuentadesgloseprecio;
    end loop;
    update mod_logistica.dat_movmoneda
    set precio = v_precioventa,
    importe = round(v_precioventa*v_movimientos.cantidad,2)
    where idmovimiento = v_movimientos.idmovimiento and idmoneda = 9900000000;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_actualizarprecioventa (p_iddocumento numeric, p_idtipoprecio numeric)
  OWNER TO zeolides;  
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_aprobardespachotienda (
  p_iddespacho numeric,
  p_idusuario numeric
)
RETURNS void AS
$body$
DECLARE
  v_facturas record;
  v_iddespacho numeric;
  v_cronologia numeric;
  v_fechafacturacion date;
  
  v_iddocRecep numeric;
  v_idrecepcion numeric;
  v_idespecialidad numeric;
  v_idcentroentrega numeric;
  v_idoperacionrecepcion numeric;
  v_idperiodo record;
  v_fecharecepcion date;
  v_depositoentrega numeric;
  v_nrofactura varchar;
  v_datosproducto record;
  v_productos record;
  v_iddocTV numeric;
  v_idestructuracomun numeric;
BEGIN
		CREATE TEMPORARY TABLE tem_despachocmpto (
        iddespachoproducto NUMERIC(19,0),
        cantidad NUMERIC(25,6)) ON COMMIT DROP;
        insert into tem_despachocmpto(iddespachoproducto, cantidad)
        (select iddespachoproducto, despachado from mod_logfacturacion.dat_despachoproducto where iddespachotienda = p_iddespacho);
        
        select dt.idestructuracomun into v_idestructuracomun from mod_logfacturacion.dat_despachotienda dt
        where dt.iddespachotienda = p_iddespacho limit 1;
        
        v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and des.idestructuracomun = v_idestructuracomun limit 1);
        
        
        v_iddocTV := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'transTiendaLog' and des.idestructuracomun = v_idestructuracomun limit 1);
        
	    for v_facturas in (
        	select df.*, ff.idcliente, ff.idestructuracomun, pt.nropedido from mod_logfacturacion.dat_despachofactura df
            inner join mod_logfacturacion.dat_docfactura ff on ff.idfactura = df.idfactura
            inner join mod_logpuntoventa.dat_pedidodocumento dpd on dpd.iddocumento = ff.idfactura and dpd.tipo = 2
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = dpd.idpedido
            where df.iddespachotienda = p_iddespacho
        ) loop
        	v_cronologia := (select max(dd.cronologia) from mod_logistica.dat_documento dd);
            
            update mod_logistica.dat_documento as d
            set estado = 4, fechacontable = v_fechafacturacion,
            aprobadopor = p_idusuario,
            cronologia = v_cronologia + 1,
            nrodoc = (COALESCE((
              select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = d.iddoc
              and dd.idejercicio = d.idejercicio and dd.idestructuracomun = d.idestructuracomun
            ),0)+1)
            where iddocumento = v_facturas.idfactura;
             
            update mod_logfacturacion.dat_docfactura as df
            set nrofactura = (COALESCE((
              select max(dff.nrofactura) from mod_logfacturacion.dat_docfactura dff 
              where dff.iddoc = df.iddoc and dff.idejercicio = df.idejercicio and dff.idestructuracomun = df.idestructuracomun
            ),0)+1),
            fechavencimiento = v_fechafacturacion + CAST(df.dias||' days' AS INTERVAL)
            where idfactura = v_facturas.idfactura returning nrofactura into v_nrofactura;
        
        	update mod_logistica.dat_movimiento as mov
            set cantidad = (case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
            then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            importecontable = dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            preciocontable = dp.precio,
            existenciaactual = dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
            then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            preciopromedio = (case when (dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)) > 0 
                then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
                then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)),2))/(dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
                then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end))  
            else 0 end),
            importetotal = (case when (dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
            then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)) > 0 
                  then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
                  then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)), 2) )
            else 0 end),
            idclasificacion = dp.idclasificacioncontable
            from mod_logistica.dat_producto dp
            inner join mod_logfacturacion.dat_despachoproducto desp on desp.idindicador = dp.idindicador 
            inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
            inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idindicador = dp.idindicador
            where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto;
            
            update mod_logistica.dat_movimiento set cronologia = v_cronologia where iddocumento = v_facturas.idfactura;
            
            update mod_logistica.dat_producto as dp
            set cantidad = dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            precio = (case when (dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)) > 0 
                then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
                then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)),2))/(dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end))  
            else 0 end),
            cronologia = v_cronologia,
            importe = (case when (dp.cantidad-(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)) > 0 
                  then (round(dp.importe - (dp.precio*(case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)), 2) )
            else 0 end)
            from mod_logistica.dat_movimiento mov
            inner join mod_logistica.dat_producto dp1 on dp1.idproducto = mov.idproducto
            inner join mod_logfacturacion.dat_despachoproducto desp on desp.idindicador = dp1.idindicador 
            inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
            inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idindicador = dp1.idindicador
            where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto;
            
            PERFORM mod_logpuntoventa.f_actualizardisponibletienda(v_iddocTV, v_facturas.idfactura);
			PERFORM mod_logpuntoventa.f_actualizarprecioventa(v_facturas.idfactura, v_datosareaventa.idtipoprecioagencia);
            
            update mod_logdistribucion.dat_prodordencmpto as prod
            set entregado = entregado + (case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0))
             then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end),
            pendiente = pendiente - (case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)
            from mod_logistica.dat_producto dp
            inner join mod_logfacturacion.dat_despachoproducto desp on desp.idindicador = dp.idindicador 
            inner join tem_despachocmpto tempdesp on tempdesp.iddespachoproducto = desp.iddespachoproducto
            inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
            inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = mov.iddocumento
            inner join mod_logistica.dat_documentopadre dpa on dpa.iddocumento = mov.iddocumento
            inner join mod_logdistribucion.dat_prodorden dprod on dprod.idorden = dpa.idpadre and dprod.idproducto = mov.idproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
            inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idindicador = dp.idindicador
            where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto and tempdesp.iddespachoproducto = desp.iddespachoproducto
            and dprod.idcliente = ddc.idcliente and prod.idprodorden = dprod.idprodorden;
            
            --insertar movimientos de ubicacion
            
            --fin insertar movimientos ubicacion          
            
            update tem_despachocmpto as tempdesp
            set cantidad = tempdesp.cantidad - (case when tempdesp.cantidad >= (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
            then (pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) else tempdesp.cantidad end)
            from mod_logistica.dat_producto dp
            inner join mod_logfacturacion.dat_despachoproducto desp on desp.idindicador = dp.idindicador 
            inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = v_facturas.idfactura
            inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idindicador = dp.idindicador
            where mov.iddocumento = v_facturas.idfactura and dp.idproducto = mov.idproducto and tempdesp.iddespachoproducto = desp.iddespachoproducto;
        	
            --creando recepcion en el destino
            v_idcentroentrega := (select nc.idestructura from mod_datosmaestros.nom_clientesproveedor nc
          	where nc.idclientesproveedores = v_facturas.idcliente limit 1);
            
            v_depositoentrega := (select dce.iddeposito from mod_logpuntoventa.dat_centroentregaalmacen dce
            where dce.idestructura = v_idcentroentrega);
            
            v_iddocRecep := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
            inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
            where ndp.abreviatura = 'recepcionLog' and des.idestructuracomun = v_idcentroentrega limit 1);
             
            v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                        where cue.idusuario = p_idusuario limit 1);
            
            v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, v_idcentroentrega);            
                        
            v_fecharecepcion := (select df.fecha from mod_datosmaestros.dat_fecha df
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
            where des.idsubsistema = 10 and des.idestructuracomun = v_idcentroentrega limit 1);
            
            v_idoperacionrecepcion := (select CAST(vg.valor as NUMERIC) from mod_logistica.nom_variableglobal vg 
            where vg.nombre = 'OPRE_REC_FAC' limit 1);
            
            INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
            )
            VALUES (
              v_iddocRecep, date_part('year', CAST(to_char(v_fecharecepcion, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fecharecepcion,'Recepcion generada de tienda virtual. Pedido '||v_facturas.nropedido,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
              v_depositoentrega, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocRecep
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_depositoentrega
              ),0)+1),v_idespecialidad, v_idoperacionrecepcion
            ) returning iddocumento into v_idrecepcion;
            INSERT INTO 
              mod_loginventario.dat_recepcion
            (
              iddocumento,nrodocorigen,fechadocorigen
            )
            VALUES (
              v_idrecepcion, v_nrofactura, v_fechafacturacion
            );
            INSERT INTO mod_logistica.dat_documentocliente
            (
              iddocumento,idcliente,tipocliente
            )
            VALUES (v_idrecepcion,(select nc.idclientesproveedores from mod_datosmaestros.nom_clientesproveedor nc
          	where nc.idestructura = v_facturas.idestructuracomun limit 1),1);
            INSERT INTO mod_logpuntoventa.dat_pedidodocumento
            (
              idpedido,iddocumento,tipo
            )
            (select pdd.idpedido, v_idrecepcion, 3 
            from mod_logpuntoventa.dat_pedidotienda pt
            inner join mod_logpuntoventa.dat_pedidodocumento pdd on pdd.idpedido = pt.idpedidotienda
            where pdd.iddocumento = v_facturas.idfactura
            );
            INSERT INTO 
              mod_logistica.dat_documentopadre
            (
              iddocumento,idpadre
            )
            values (v_idrecepcion, v_facturas.idfactura); 
            
            for v_productos in (
            	select dm.preciocontable, dmm.precio as preciofactura, dm.cantidad,dm.idunidadmedida, dp.*, pp.idproductopedido 
                from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento and dmm.idmoneda = 9900000000
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
                inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento and pp.idpedidotienda = pd.idpedido
                where dm.iddocumento = v_facturas.idfactura
            ) loop
            	--buscar indicador para crear tarjeta si no existe
            	select dpd.* into v_datosproducto from mod_logistica.dat_producto dpd
                where dpd.idestructura = v_depositoentrega and dpd.idindicador = v_productos.idindicador;
            	--insertar movimientos de la recepcion
                if v_datosproducto.idproducto is not null then
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
                        v_idrecepcion,
                        v_datosproducto.idproducto,
                        v_productos.preciofactura,
                        0,
                        v_productos.cantidad,
                        0,
                        '+',
                        v_datosproducto.idumedida,
                        v_datosproducto.idelementogasto,
                        v_datosproducto.idclasificacioncontable
                      ) returning idmovimiento, cantidad
                  )
                  INSERT INTO 
                    mod_loginventario.dat_movrecepcion
                  (
                    idmovimiento,
                    cantidad
                  )
                  select idmovimiento, cantidad from movimiento;
                else
                  with producto as (
                  	INSERT INTO 
                      mod_logistica.dat_producto
                    (
                      idestructura,
                      idumedida,
                      idindicador,
                      idclasificacioncontable,
                      cronologia,
                      cantidad,
                      importe,
                      idestructuracomun,
                      idmarca,
                      idmodelo,
                      idelementogasto
                    )
                    VALUES (
                      v_depositoentrega,
                      v_productos.idunidadmedida,
                      v_productos.idindicador,
                      v_productos.idclasificacioncontable,
                      0,
                      0,
                      0,
                      v_idcentroentrega,
                      v_productos.idmarca,
                      v_productos.idmodelo,
                      v_productos.idelementogasto
                    ) returning idproducto                      
                  ), movimiento as (
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
                      select v_idrecepcion, idproducto, v_productos.preciofactura,0,
                      v_productos.cantidad, 0, '+', v_datosproducto.idumedida, v_datosproducto.idelementogasto,
                      v_datosproducto.idclasificacioncontable from producto
                      returning idmovimiento, cantidad
                  )
                  INSERT INTO 
                    mod_loginventario.dat_movrecepcion
                  (
                    idmovimiento,
                    cantidad
                  )
                  select idmovimiento, cantidad from movimiento;
                end if;
                update mod_logpuntoventa.dat_pedidoproducto as ppp
                set enproceso = ppp.enproceso - v_productos.cantidad,
                procesado = procesado + v_productos.cantidad
                where ppp.idproductopedido = v_productos.idproductopedido;
            end loop;
            
        end loop;
        update mod_logfacturacion.dat_despachotienda 
        set estado = 3 where iddespachotienda = p_iddespacho;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logfacturacion.f_aprobardespachotienda (p_iddespacho numeric, p_idusuario numeric)
  OWNER TO zeolides;
  
DROP TYPE IF EXISTS mod_logfacturacion.td_productosordentienda CASCADE;
  
CREATE TYPE mod_logfacturacion.td_productosordentienda AS (
  codigo VARCHAR,
  denominacion VARCHAR,
  cantidad NUMERIC(25,6),
  iddeposito NUMERIC(19,0),
  deposito VARCHAR,
  logo VARCHAR,
  entidad VARCHAR,
  codigoentidad VARCHAR,
  um VARCHAR,
  importecontable NUMERIC(25,2),
  importealternativo NUMERIC(25,2),
  peso NUMERIC(25,2),
  nrodespacho NUMERIC,
  fechadespacho DATE,
  despachado NUMERIC(25,6),
  estado NUMERIC
);

ALTER TYPE mod_logfacturacion.td_productosordentienda
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_despachotienda (
  p_iddespacho numeric,
  p_monedacont numeric,
  p_monedaalt numeric
)
RETURNS SETOF mod_logfacturacion.td_productosordentienda AS
$body$
	DECLARE



	v_rec mod_logfacturacion.td_productosordentienda;



	BEGIN    



		for v_rec in              



        (

        SELECT ni.numeropieza as codigo, ni.denominacion, dm.cantidad as cantidad,

        dt.iddeposito, (select deo.codigo|| ' ' ||deo.denominacion from mod_estructuracomp.dat_estructuraop deo where deo.idestructuraop = dt.iddeposito) as deposito ,

        (select cg.urllogo from mod_logistica.conf_general cg where cg.idestructura = dt.idestructuracomun limit 1),

        (SELECT es.denominacion FROM mod_estructuracomp.v_dametodasestructuras es WHERE es.idestructura = dt.idestructuracomun) as entidad,

        (SELECT es.codigo FROM mod_estructuracomp.v_dametodasestructuras es WHERE es.idestructura = dt.idestructuracomun) as codigoentidad,

        (select um.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida um where um.idunidadmedida = dp.idumedida) as um,

        0 as importecontable,

        0 as importealternativo,

        (dm.cantidad*COALESCE(nih.peso,0)/1000) as peso,
        dt.nrodespacho, dt.fecha, coalesce(dm.despachado,0),
        
        dt.estado        

        from mod_logfacturacion.dat_despachoproducto dm
	
		inner join mod_logfacturacion.dat_despachotienda dt on dt.iddespachotienda = dm.iddespachotienda
    
        inner join mod_logistica.dat_producto dp on dp.idindicador = dm.idindicador and dp.idestructura = dt.iddeposito

        inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador

        inner join mod_datosmaestros.nom_indicadorhoja nih on ni.idindicador = nih.idindicador        

        where dt.iddespachotienda = p_iddespacho
         --group by dt.idestructuracomun,dt.iddeposito,dt.nrodespacho, dt.fecha, ni.numeropieza, ni.denominacion, dp.idumedida,nih.peso, dm.cantidad
		order by ni.numeropieza
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
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_despachotienda (p_iddespacho numeric, p_monedacont numeric, p_monedaalt numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_generardespachotienda (
  p_idusuario numeric,
  p_idestructuracomun numeric,
  p_iddeposito numeric
)
RETURNS numeric AS
$body$
DECLARE
  v_facturas record;
  v_iddespacho numeric;
  v_countproductos numeric;
BEGIN
	--Inicializando despacho
    select count(DISTINCT pp.idindicador) into v_countproductos
        from mod_logpuntoventa.dat_pedidoproducto pp
        where pp.idpedidotienda in (
        	select pd.idpedido from mod_logistica.dat_documento dd
            inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
            left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
            where dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null
        ) and (coalesce(pp.enproceso,0)-coalesce(pp.devolver,0)-coalesce(pp.devuelto,0)) > 0;
    if v_countproductos > 0 then 
    	INSERT INTO 
          mod_logfacturacion.dat_despachotienda
        (
          nrodespacho,
          nroreferencia,
          fecha,
          idestructuracomun,
          iddeposito,
          idusuario
        )
        VALUES (
        (COALESCE((
                select max(des.nrodespacho) from mod_logfacturacion.dat_despachotienda des 
                where des.iddeposito = p_iddeposito
              ),0)+1),
          (COALESCE((
                select max(des.nroreferencia) from mod_logfacturacion.dat_despachotienda des 
                where des.iddeposito = p_iddeposito
              ),0)+1),
          now(),
          p_idestructuracomun,
          p_iddeposito,
          p_idusuario
        ) returning iddespachotienda into v_iddespacho;
        
        INSERT INTO 
          mod_logfacturacion.dat_despachoproducto
        (
          idindicador,
          iddespachotienda,
          cantidad,
          despachado
        )
        select DISTINCT pp.idindicador, v_iddespacho, sum(pp.cantidad-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) as cantidad, 0
        from mod_logpuntoventa.dat_pedidoproducto pp
        where pp.idpedidotienda in (
        	select pd.idpedido from mod_logistica.dat_documento dd
            inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
            left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
            where dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null
        ) and (coalesce(pp.enproceso,0)-coalesce(pp.devolver,0)-coalesce(pp.devuelto,0)) > 0 
        group by pp.idindicador;
		
    
    for v_facturas in (
    	select dd.* from mod_logistica.dat_documento dd
        inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
        inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
        left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
        where dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null
    ) loop
    	INSERT INTO 
          mod_logfacturacion.dat_despachofactura
        (
          iddespachotienda,
          idfactura
        )
        VALUES (
          v_iddespacho,
          v_facturas.iddocumento
        );
    end loop;
   end if;
   return v_iddespacho;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logfacturacion.f_generardespachotienda (p_idusuario numeric, p_idestructuracomun numeric, p_iddeposito numeric)
  OWNER TO zeolides;
  
--FIN FACTURACION

--INICIO PUNTO VENTA

CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_datareaventacorriente_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_datcentroentregaalmacen_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_datpedidodevolucion_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_datpedidodocumento_seq
  INCREMENT 1 MINVALUE 1000
  MAXVALUE 1099999999 START 1001
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_datpedidoproducto_seq
  INCREMENT 1 MINVALUE 1000
  MAXVALUE 1099999999 START 1000
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_datpedidoproductodev_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_datpedidotienda_seq
  INCREMENT 1 MINVALUE 1000
  MAXVALUE 1099999999 START 1000
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.sec_nomdescuento_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;
  
CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_areaventacorriente (
  idareacorriente NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datareaventacorriente_seq'::regclass) NOT NULL,
  idareaventa NUMERIC(19,0),
  iddeposito NUMERIC(19,0),
  CONSTRAINT dat_areaventacorriente_pkey PRIMARY KEY(idareacorriente)
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_areaventacorriente
  OWNER TO zeolides;
  
CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_centroentregaalmacen (
  idcentroentregaalmacen NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datcentroentregaalmacen_seq'::regclass) NOT NULL,
  idareaventa NUMERIC(19,0),
  idestructura NUMERIC(19,0),
  iddeposito NUMERIC(19,0),
  CONSTRAINT dat_centroentregaalmacen_pkey PRIMARY KEY(idcentroentregaalmacen)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logpuntoventa.dat_centroentregaalmacen.idareaventa
IS 'Guarda el identificador del area de venta';

COMMENT ON COLUMN mod_logpuntoventa.dat_centroentregaalmacen.idestructura
IS 'Guarda el id de las entidades que son centro entrega';

COMMENT ON COLUMN mod_logpuntoventa.dat_centroentregaalmacen.iddeposito
IS 'Guarda los almacenes de venta de los centros de entrega';

ALTER TABLE mod_logpuntoventa.dat_centroentregaalmacen
  OWNER TO zeolides;
  
CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_pedidotienda (
  idpedidotienda NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datpedidotienda_seq'::regclass) NOT NULL,
  nropedido VARCHAR(20) NOT NULL,
  beneficiario VARCHAR(50),
  dirbeneficiario VARCHAR(255),
  remitente VARCHAR(50),
  dirremitente VARCHAR(255),
  fechapedido DATE,
  estado NUMERIC(2,0),
  idestructuracomun NUMERIC(19,0),
  codigoregion VARCHAR(10),
  idareaventa NUMERIC(19,0),
  cibeneficiario VARCHAR(15),
  ciremitente VARCHAR(15),
  telbeneficiario VARCHAR(50),
  telremitente VARCHAR(50),
  idusuario NUMERIC(19,0),
  idreferencia NUMERIC(10,0),
  metodopago VARCHAR(50),
  idtransaccion VARCHAR(50),
  idopcomercio VARCHAR(20),
  CONSTRAINT dat_pedidotienda_nropedido_key UNIQUE(nropedido),
  CONSTRAINT dat_pedidotienda_pkey PRIMARY KEY(idpedidotienda)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logpuntoventa.dat_pedidotienda.idreferencia
IS 'Identificador del pedido de la tienda virtual';

ALTER TABLE mod_logpuntoventa.dat_pedidotienda
  OWNER TO zeolides;  

CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_pedidodocumento (
  idpedidodocumento NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datpedidodocumento_seq'::regclass) NOT NULL,
  idpedido NUMERIC(19,0),
  iddocumento NUMERIC(19,0),
  tipo NUMERIC(1,0),
  CONSTRAINT dat_pedidodocumento_pkey PRIMARY KEY(idpedidodocumento),
  CONSTRAINT dat_pedidodocumento_fk FOREIGN KEY (idpedido)
    REFERENCES mod_logpuntoventa.dat_pedidotienda(idpedidotienda)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_pedidodocumento
  ALTER COLUMN tipo SET STATISTICS 0;

COMMENT ON COLUMN mod_logpuntoventa.dat_pedidodocumento.tipo
IS 'tipo de documento, 1 distribucion, 2 factura, 3 recepcion, 4 comprobante venta';

ALTER TABLE mod_logpuntoventa.dat_pedidodocumento
  OWNER TO zeolides;
  
CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_pedidoproducto (
  idproductopedido NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datpedidoproducto_seq'::regclass) NOT NULL,
  idpedidotienda NUMERIC(19,0) NOT NULL,
  codreferencia VARCHAR(50),
  idindicador NUMERIC(19,0),
  idproducto NUMERIC(19,0),
  cantidad NUMERIC(25,6),
  precio NUMERIC(25,6),
  importe NUMERIC(25,2),
  idumedida NUMERIC(19,0),
  enproceso NUMERIC(25,6),
  procesado NUMERIC(25,6),
  devuelto NUMERIC(25,6) DEFAULT 0,
  devolver NUMERIC(25,6) DEFAULT 0,
  CONSTRAINT dat_pedidoproducto_pkey PRIMARY KEY(idproductopedido),
  CONSTRAINT dat_pedidoproducto_fk FOREIGN KEY (idpedidotienda)
    REFERENCES mod_logpuntoventa.dat_pedidotienda(idpedidotienda)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_pedidoproducto
  OWNER TO zeolides;
  
CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_pedidoproductodev (
  idpedidoproductodev NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datpedidoproductodev_seq'::regclass) NOT NULL,
  idpedidodevolucion NUMERIC(19,0),
  idproductopedido NUMERIC(19,0),
  cantidad NUMERIC(25,6),
  importe NUMERIC(25,2),
  CONSTRAINT dat_pedidoproductodev_pkey PRIMARY KEY(idpedidoproductodev)
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_pedidoproductodev
  OWNER TO zeolides;
  

  
CREATE TABLE IF NOT EXISTS mod_logpuntoventa.dat_pedidotiendadevolucion (
  idpedidodevolucion NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datpedidodevolucion_seq'::regclass) NOT NULL,
  idpedidotienda NUMERIC(19,0),
  importe NUMERIC(25,2),
  fecha DATE DEFAULT now(),
  idusuario NUMERIC(19,0),
  refund_response TEXT,
  idareaventa NUMERIC(19,0),
  anno NUMERIC(4,0) DEFAULT date_part('year'::text, to_char(now(), 'DD/MM/YYYY HH24:MI'::text)::timestamp without time zone),
  numero NUMERIC(6,0),
  descripcion VARCHAR(255),
  commercerefundid VARCHAR(12),
  porcientodesc NUMERIC(5,2) DEFAULT 0,
  valordesc NUMERIC(25,2) DEFAULT 0,
  CONSTRAINT dat_pedidodevolucion_pkey PRIMARY KEY(idpedidodevolucion)
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_pedidotiendadevolucion
  OWNER TO zeolides;
  
CREATE TABLE IF NOT EXISTS mod_logpuntoventa.nom_descuento (
  iddescuento NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_nomdescuento_seq'::regclass) NOT NULL,
  codigo VARCHAR(255),
  denominacion VARCHAR(255),
  fechainicio DATE,
  fechafin DATE,
  estado NUMERIC(1,0) DEFAULT 1,
  porciento NUMERIC(5,2),
  CONSTRAINT pk_descuento PRIMARY KEY(iddescuento)
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.nom_descuento
  OWNER TO zeolides;
  
ALTER TABLE mod_logpuntoventa.dat_infoconexion
  ADD COLUMN IF NOT EXISTS consumerkey VARCHAR(150);
  
ALTER TABLE mod_logpuntoventa.dat_infoconexion
  ADD COLUMN IF NOT EXISTS consumersecret VARCHAR(150);
  
ALTER TABLE mod_logpuntoventa.dat_ventaorden
  ADD COLUMN IF NOT EXISTS tiendavirtual NUMERIC(1,0) DEFAULT 0;
  
ALTER TABLE mod_logpuntoventa.dat_naturalezaagrupacion
  ADD COLUMN IF NOT EXISTS idreferencia NUMERIC(10,0);
  
ALTER TABLE mod_logpuntoventa.dat_areaventanaturaleza
  ADD COLUMN IF NOT EXISTS idreferencia NUMERIC(10,0);
  
ALTER TABLE mod_logpuntoventa.dat_areaventa
  ADD COLUMN IF NOT EXISTS usuarioez VARCHAR(20);
  
ALTER TABLE mod_logpuntoventa.dat_areaventa
  ADD COLUMN IF NOT EXISTS idtipoprecioagencia NUMERIC(19,0);
  
ALTER TABLE mod_loginventario.dat_reclamacion
  ADD COLUMN IF NOT EXISTS tiporeclamacion NUMERIC(1,0) DEFAULT 1;

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
      where d.iddoc = p_iddoc and cc.idproducto = v_rec.idproducto
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
      end if;
      
    end loop;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_actualizardisponibletienda (p_iddoc numeric, p_iddocumentos numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_devolverpedidostienda (
  p_idpedidotienda numeric,
  p_idusuario numeric,
  p_idestructuracomun numeric,
  p_areaventa numeric
)
RETURNS void AS
$body$
DECLARE
  v_iddoc numeric;
  v_iddocumento numeric;
  v_transferencia record;
  v_idrecepcion numeric;
  v_idespecialidad numeric;
  v_idperiodo record;
  v_fechadistribucion date;
  v_fechatransferencia date;
  v_idcliente numeric;
  v_datospedido record;
  v_idoperaciontransferencia numeric;
  v_datosareaventa record;
  v_rec record;
  v_reccomp record;
  v_cant numeric;
  v_iddocTV numeric;
  v_iddocRecep numeric;
  v_idproducto numeric;
  v_cancelacion record;
  v_facturapedido numeric;
  v_producto record;
  v_productotransf record; 
  v_datosproducto record;
  v_cronologia numeric;
  v_numerotransferencia numeric;
BEGIN
	--Inicializando parametros para adicionar distribucion general con los productos de los pedidos
    v_iddocTV := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'transTiendaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
    
    v_idoperaciontransferencia := (select CAST(vg.valor as NUMERIC) from mod_logistica.nom_variableglobal vg 
            where vg.nombre = 'OPRE_REC_TRANS_INT' limit 1);
            
    select pd.iddocumento into v_facturapedido from mod_logpuntoventa.dat_pedidodocumento pd where pd.idpedido = p_idpedidotienda
    and pd.tipo = 2 limit 1;
    
    select pt.* into v_datospedido from mod_logpuntoventa.dat_pedidotienda pt where pt.idpedidotienda = p_idpedidotienda;
    
    v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, p_idestructuracomun);            
                
    v_fechadistribucion := (select df.fecha from mod_datosmaestros.dat_fecha df
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
    where des.idsubsistema = 10 and des.idestructuracomun = p_idestructuracomun limit 1);
    
    /*v_idoperacionfactura := (select dop.idnomoperaciones from mod_logfacturacion.dat_operacionsubsistema dop 
    where dop.idestructura = p_idestructuracomun and dop.tiendavirtual = 1 limit 1);
    
    v_iddepositoorigen := (select da.idestructuraop from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa);*/
    
    select da.* into v_datosareaventa from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa;
    
    v_idoperaciontransferencia := 990000005928;
    
    --v_iddepositoorigen := v_datosareaventa.idestructuraop;
    
    raise notice 'iddoc ,%', v_iddoc ; 
    raise notice 'idespecialidad ,%', v_idespecialidad ;
    raise notice 'fechadist ,%', v_fechadistribucion ; 
    --Insertando distribucion
    v_idcliente := (select nc.iddeposito from mod_logpuntoventa.dat_areaventacorriente nc
      where nc.idareaventa = p_areaventa limit 1);
    INSERT INTO mod_logistica.dat_documento
    (
      iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
      idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
    )
    VALUES (
      v_iddoc, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
      v_fechadistribucion,'Distribucion para devolucion de pedido '|| v_datospedido.nropedido,0,1,p_idusuario,3,v_idperiodo.idejercicioactual,
      p_idestructuracomun, v_idperiodo.idperiodoactual,
      (COALESCE((
        select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
        and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
      ),0)+1),1,(COALESCE((
        select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
        and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
      ),0)+1),p_idusuario
    ) returning iddocumento into v_iddocumento;
    INSERT INTO mod_logdistribucion.dat_distribucion
    (
      iddistribucion,idestructuraop,tipodestino,tipodistribucion,salidaporfactura
    )
    VALUES (v_iddocumento,p_idestructuracomun,3,3,0);
    INSERT INTO mod_logistica.dat_documentocliente
    (
      iddocumento,idcliente,tipocliente,idestructura
    )
    VALUES (v_iddocumento,v_idcliente,3,p_idestructuracomun);
    --insertando productos de la distribucion
    with prodorden AS (INSERT INTO 
      mod_logdistribucion.dat_prodorden
    (
      idproducto,idcliente,cantidad,idorden
    )
    (
    select DISTINCT pp.idproducto, v_idcliente,pp.devolver,v_iddocumento
    from mod_logpuntoventa.dat_pedidoproducto pp
    where coalesce(pp.devolver,0) > 0 and pp.idpedidotienda = p_idpedidotienda
    --group by pp.idproducto
    ) RETURNING idprodorden, cantidad, idproducto),
    cantidadcomp as (
      INSERT INTO 
        mod_logistica.dat_cantidadcomprometida
      (
        iddocumento,idproducto,idcliente,cantidad,estado
      ) 
      select v_iddocumento,idproducto,v_idcliente,cantidad,2 from prodorden
      RETURNING iddocumento
    )
    INSERT INTO 
      mod_logdistribucion.dat_prodordencmpto
    (
      idprodorden,enproceso,entregado,pendiente,cantidadoriginal
    )
    select idprodorden,0, cantidad,0,cantidad from prodorden;
    --rebajar disponible reservado en la transferencia virtual
    for v_rec in (select DISTINCT pp.idproducto,pp.devolver as cantidad,
    pord.idprodorden, pp.cantidad as cantpedida, pp.devuelto
    from mod_logpuntoventa.dat_pedidoproducto pp
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pp.idpedidotienda
    inner join mod_logdistribucion.dat_prodorden pord on pord.idorden = pd.iddocumento
    where pp.idpedidotienda = p_idpedidotienda and pp.devolver > 0
    and pd.tipo = 1 and pord.idproducto = pp.idproducto) loop
    
    for v_reccomp in SELECT cc.*
      FROM mod_logistica.dat_cantidadcomprometida cc
      inner join mod_logistica.dat_documento d on d.iddocumento = cc.iddocumento
      where d.iddoc = v_iddocTV and cc.idproducto = v_rec.idproducto
      order by d.fechacontable asc loop

      if v_idproducto is null or v_idproducto <> v_rec.idproducto then
          v_cant = v_rec.cantidad;
          v_idproducto = v_rec.idproducto;
      end if;
      
      if v_reccomp.cantidad >= v_cant and v_cant > 0 then
          UPDATE mod_logistica.dat_cantidadcomprometida 
            SET cantidad = cantidad - v_cant --, estado = 2
          WHERE 
  			idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
          v_cant = 0;
          CONTINUE;
      else if v_reccomp.cantidad < v_cant and v_cant > 0 then
          v_cant = v_cant - v_reccomp.cantidad;          
          UPDATE mod_logistica.dat_cantidadcomprometida 
            SET cantidad = 0, estado = 2
          WHERE 
  			idcantidadcomprometida = v_reccomp.idcantidadcomprometida;
          CONTINUE;
      end if;
          --v_cant = v_rec.cantidad - v_rec.vendida;
      end if;
    end loop;
    update mod_logdistribucion.dat_prodorden set cantidad = cantidad - v_rec.cantidad 
    where idprodorden = v_rec.idprodorden;
    update mod_logdistribucion.dat_prodordencmpto set cantidadoriginal = cantidadoriginal - v_rec.cantidad,
    pendiente = pendiente - v_rec.cantidad where idprodorden = v_rec.idprodorden;
    INSERT INTO 
      mod_logdistribucion.dat_cancelacion
    (
      idprodorden,cantidad,motivo,idusuario,estado,idaprobado,fecha
    )
    VALUES (v_rec.idprodorden,v_rec.cantidad,'Devolucion de pedido '||v_datospedido.nropedido,
      p_idusuario,2,p_idusuario,now()
    );
    --ojo probando update
    /*update mod_logfacturacion.dat_despachoproducto as desp
    set cantidad = desp.cantidad - v_rec.cantidad,
    despachado = (CASE when coalesce(desp.cantidad-v_rec.cantidad,0) >= desp.despachado then desp.despachado - 0 else desp.despachado - v_rec.cantidad end)
    from mod_logfacturacion.dat_despachofactura df
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = df.idfactura
    inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = p_idpedidotienda
    where pd.idpedido = p_idpedidotienda and df.iddespachotienda = desp.iddespachotienda
    and pp.idproducto = v_rec.idproducto and pp.idindicador = desp.idindicador;*/
    
    update mod_logfacturacion.dat_despachoproducto as dprod 
    set cantidad = (select sum(pp.cantidad-COALESCE(pp.procesado,0)-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento
    inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idindicador = dp.idindicador
    where dm.iddocumento in (select def.idfactura 
    from mod_logfacturacion.dat_despachofactura def
    where def.iddespachotienda = (select def1.iddespachotienda from mod_logfacturacion.dat_despachofactura def1
    inner join mod_logpuntoventa.dat_pedidodocumento pd1 on pd1.iddocumento = def1.idfactura
    where pd1.idpedido = p_idpedidotienda))  and pd.tipo = 2 and dp.idindicador = dprod.idindicador),
    despachado = (CASE when coalesce((select sum(pp.cantidad-COALESCE(pp.procesado,0)-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
    from mod_logistica.dat_movimiento dm
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento
    inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idindicador = dp.idindicador
    where dm.iddocumento in (select def.idfactura 
    from mod_logfacturacion.dat_despachofactura def
    where def.iddespachotienda = (select def1.iddespachotienda from mod_logfacturacion.dat_despachofactura def1
    inner join mod_logpuntoventa.dat_pedidodocumento pd1 on pd1.iddocumento = def1.idfactura
    where pd1.idpedido = p_idpedidotienda)) and pd.tipo = 2 and dp.idindicador = dprod.idindicador),0) >= dprod.despachado then dprod.despachado - 0 else dprod.despachado - v_rec.cantidad end)
    from mod_logfacturacion.dat_despachotienda dt
    inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = dt.iddespachotienda
    inner join mod_logpuntoventa.dat_pedidodocumento pd1 on pd1.iddocumento = df.idfactura
    where dt.iddespachotienda = dprod.iddespachotienda and dt.iddespachotienda = (select def1.iddespachotienda from mod_logfacturacion.dat_despachofactura def1
    inner join mod_logpuntoventa.dat_pedidodocumento pd1 on pd1.iddocumento = def1.idfactura
    where pd1.idpedido = p_idpedidotienda);
    --fin ojo
    delete from mod_logfacturacion.dat_despachoproducto desp
    where desp.iddespachoproducto in (
    	select desp1.iddespachoproducto from mod_logfacturacion.dat_despachoproducto desp1 
        inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = desp1.iddespachotienda
        inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = df.idfactura
    	inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido
        where pp.idpedidotienda = p_idpedidotienda and desp1.cantidad = 0
    );
    
    delete from mod_logistica.dat_movimiento dm
    where dm.iddocumento = v_facturapedido and dm.idproducto = v_rec.idproducto and v_rec.cantpedida = v_rec.devuelto + v_rec.cantidad;
    update mod_logpuntoventa.dat_pedidoproducto set devuelto = devuelto + v_rec.cantidad, devolver = 0 
    where idpedidotienda = p_idpedidotienda and idproducto = v_rec.idproducto
	and devolver > 0;
end loop;
delete from mod_logfacturacion.dat_despachotienda dt
where dt.iddespachotienda in (
	select dt1.iddespachotienda from mod_logfacturacion.dat_despachotienda dt1
    inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = dt1.iddespachotienda
    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = df.idfactura
    where pd.idpedido = p_idpedidotienda and (
    	select count(desp.iddespachoproducto) from mod_logfacturacion.dat_despachoproducto desp
        where desp.iddespachotienda = dt1.iddespachotienda
    ) = 0
);

delete from mod_logistica.dat_documento d where d.iddocumento = v_facturapedido and (select count(dm.idmovimiento) 
from mod_logistica.dat_movimiento dm where dm.iddocumento = v_facturapedido) = 0;
--creando tranferencia hacia almacen corriente
v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
where ndp.abreviatura = 'transferenciaLog' and des.idestructuracomun = p_idestructuracomun limit 1);

select max(d.cronologia) into v_cronologia from mod_logistica.dat_documento d;

INSERT INTO mod_logistica.dat_documento
  (
    iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
    idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor, idoperacion
  )
  VALUES (
    v_iddoc, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
    v_fechadistribucion,'Transferencia para almacen corriente por devolucion de pedido '|| v_datospedido.nropedido,v_cronologia,1,p_idusuario,4,v_idperiodo.idejercicioactual,
    v_datosareaventa.idestructuraop, v_idperiodo.idperiodoactual,
    (COALESCE((
      select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
      and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_datosareaventa.idestructuraop
    ),0)+1),1,(COALESCE((
      select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
      and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_datosareaventa.idestructuraop
    ),0)+1),p_idusuario, v_idoperaciontransferencia
  ) returning iddocumento, nrodoc into v_transferencia;
  INSERT INTO 
    mod_logistica.dat_entrega
  (
    iddocumento,
    version,
    iddestino,
    origen
  )
  VALUES (
    v_transferencia.iddocumento,
    0,3,1
  );
  INSERT INTO mod_logistica.dat_documentocliente
    (
      iddocumento,idcliente,tipocliente
    )
    VALUES (v_transferencia.iddocumento,v_idcliente,3);
    
    INSERT INTO 
      mod_logistica.dat_documentopadre
    (
      iddocumento,idpadre
    )
    values (v_transferencia.iddocumento, v_iddocumento); 
  --insertando productos de la distribucion
  for v_producto in (
      select dpo.cantidad, dpo.idproducto, dp.precio, dp.cantidad as existencia, dp.importe,
      dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable
       from mod_logdistribucion.dat_prodorden dpo
      inner join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
      where dpo.idorden = v_iddocumento 
  ) LOOP
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
            idclasificacion,
            existenciaactual,
            preciopromedio,
            importetotal
          )
          VALUES (
            v_transferencia.iddocumento,
            v_producto.idproducto,
            v_producto.precio,
            round(v_producto.precio*v_producto.cantidad,2),
            v_producto.cantidad,
            v_cronologia,
            '-',
            v_producto.idumedida,
            v_producto.idelementogasto,
            v_producto.idclasificacioncontable,
            (v_producto.existencia-v_producto.cantidad),
            (case when (v_producto.existencia-v_producto.cantidad) > 0 
                then (round(v_producto.importe - (v_producto.precio*v_producto.cantidad),2))/(v_producto.existencia-v_producto.cantidad)  
            else 0 end),
            (case when (v_producto.existencia-v_producto.cantidad) > 0 
                  then (round(v_producto.importe - (v_producto.precio*v_producto.cantidad), 2) )
            else 0 end)
          ) returning idmovimiento, cantidad
      )
      INSERT INTO 
        mod_loginventario.dat_moventrega
      (
        idmovimiento,
        ordenado,
        pendiente,
        iddocorigen
      )
      select idmovimiento, cantidad, cantidad, v_transferencia.iddocumento from movimiento;   
      update mod_logistica.dat_producto as dp
      set cantidad = dp.cantidad - v_producto.cantidad,
      precio = (case when (dp.cantidad-v_producto.cantidad) > 0 
                then (round(dp.importe - (dp.precio*v_producto.cantidad),2))/(dp.cantidad-v_producto.cantidad)  
            else 0 end),
      cronologia = v_cronologia,
      importe = (case when (dp.cantidad-v_producto.cantidad) > 0 
                  then (round(dp.importe - (dp.precio*v_producto.cantidad), 2) )
            else 0 end)     
      where dp.idproducto = v_producto.idproducto;             
  end loop;  
  
  --creando recepcion en elaboracion a partir de la transferencia
  
  v_iddocRecep := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
  inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
  inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
  where ndp.abreviatura = 'recepcionLog' and des.idestructuracomun = p_idestructuracomun limit 1);
  
  INSERT INTO mod_logistica.dat_documento
  (
    iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
    idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
  )
  VALUES (
    v_iddocRecep, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
    v_fechadistribucion,'Recepcion generada devolucion pedido '||v_datospedido.nropedido,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
    v_idcliente, v_idperiodo.idperiodoactual,
    (COALESCE((
      select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocRecep
      and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_idcliente
    ),0)+1),v_idespecialidad, v_idoperaciontransferencia
  ) returning iddocumento into v_idrecepcion;
  INSERT INTO 
    mod_loginventario.dat_recepcion
  (
    iddocumento,nrodocorigen,fechadocorigen
  )
  VALUES (
    v_idrecepcion, v_transferencia.nrodoc, v_fechadistribucion
  );
  INSERT INTO mod_logistica.dat_documentocliente
  (
    iddocumento,idcliente,tipocliente
  )
  VALUES (v_idrecepcion,v_datosareaventa.idestructuraop,3);
  INSERT INTO 
    mod_logistica.dat_documentopadre
  (
    iddocumento,idpadre
  )
  values (v_idrecepcion, v_transferencia.iddocumento);
  --productos de la recepcion
  for v_productotransf in (
      select dm.preciocontable, dm.cantidad,dm.idunidadmedida, dp.*
      from mod_logistica.dat_movimiento dm
      inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
      where dm.iddocumento = v_transferencia.iddocumento
  ) loop
      --buscar indicador para crear tarjeta si no existe
      select dpd.* into v_datosproducto from mod_logistica.dat_producto dpd
      where dpd.idestructura = v_idcliente and dpd.idindicador = v_productotransf.idindicador;
      --insertar movimientos de la recepcion
      if v_datosproducto.idproducto is not null then
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
              v_idrecepcion,
              v_datosproducto.idproducto,
              v_productotransf.preciocontable,
              0,
              v_productotransf.cantidad,
              0,
              '+',
              v_datosproducto.idumedida,
              v_datosproducto.idelementogasto,
              v_datosproducto.idclasificacioncontable
            ) returning idmovimiento, cantidad
        )
        INSERT INTO 
          mod_loginventario.dat_movrecepcion
        (
          idmovimiento,
          cantidad
        )
        select idmovimiento, cantidad from movimiento;
      else
        with producto as (
          INSERT INTO 
            mod_logistica.dat_producto
          (
            idestructura,
            idumedida,
            idindicador,
            idclasificacioncontable,
            cronologia,
            cantidad,
            importe,
            idestructuracomun,
            idmarca,
            idmodelo,
            idelementogasto
          )
          VALUES (
            v_idcliente,
            v_productotransf.idunidadmedida,
            v_productotransf.idindicador,
            v_productotransf.idclasificacioncontable,
            0,
            0,
            0,
            p_idestructuracomun,
            v_productotransf.idmarca,
            v_productotransf.idmodelo,
            v_productotransf.idelementogasto
          ) returning idproducto                      
        ), movimiento as (
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
            select v_idrecepcion, idproducto, v_productotransf.preciocontable,0,
            v_productotransf.cantidad, 0, '+', v_datosproducto.idumedida, v_datosproducto.idelementogasto,
            v_datosproducto.idclasificacioncontable from producto
            returning idmovimiento, cantidad
        )
        INSERT INTO 
          mod_loginventario.dat_movrecepcion
        (
          idmovimiento,
          cantidad
        )
        select idmovimiento, cantidad from movimiento;
      end if;
      
  end loop;
  
    --cancelar cantidad en la distribucion resumen del pedido(ok)
    
    --eliminar de la factura que responde al pedido el producto si se queda en cero y si es total eliminar la factura(ok)
    
    --actualizar cantidad devuelta en el pedido(ok)
    
    --actualizar cantidad despachada y cantidad del despacho en caso de no estar aprobado el despacho
    
    --crear transferencia al almacen corriente (ok)
    
    --rebajar existencia de los productos en almacen de tienda(ok)
    
    --crear recepcion en elaboracion en el almacen corriente(ok)
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_devolverpedidostienda (p_idpedidotienda numeric, p_idusuario numeric, p_idestructuracomun numeric, p_areaventa numeric)
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
  v_iddoc numeric;
  v_iddocumento numeric;
  v_idfactura numeric;
  v_idespecialidad numeric;
  v_idperiodo record;
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
    v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, p_idestructuracomun);            
                
    v_fechadistribucion := (select df.fecha from mod_datosmaestros.dat_fecha df
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
    where des.idsubsistema = 10 and des.idestructuracomun = p_idestructuracomun limit 1);
    
    /*v_idoperacionfactura := (select dop.idnomoperaciones from mod_logfacturacion.dat_operacionsubsistema dop 
    where dop.idestructura = p_idestructuracomun and dop.tiendavirtual = 1 limit 1);
    
    v_iddepositoorigen := (select da.idestructuraop from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa);*/
    
    select da.* into v_datosareaventa from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_areaventa;
    
    v_idoperacionfactura := v_datosareaventa.idnomoperaciones;
    
    v_iddepositoorigen := v_datosareaventa.idestructuraop;
    
    raise notice 'iddoc ,%', v_iddoc ; 
    raise notice 'idespecialidad ,%', v_idespecialidad ;
    raise notice 'fechadist ,%', v_fechadistribucion ; 
    --Insertando distribucion
    for v_centroentrega in (
    	select distinct cent.idestructura from mod_logpuntoventa.dat_centroentregaalmacen cent
        where cent.idareaventa = p_areaventa
    ) loop
    	v_idcliente := (select nc.idclientesproveedores from mod_datosmaestros.nom_clientesproveedor nc
          where nc.idestructura = v_centroentrega.idestructura limit 1);
    	INSERT INTO mod_logistica.dat_documento
        (
          iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
          idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
        )
        VALUES (
          v_iddoc, date_part('year', CAST(to_char(v_fechadistribucion, 'DD/MM/YYYY HH24:MI') as timestamp)),
          v_fechadistribucion,'Distribucion generada de tienda virtual',0,1,p_idusuario,3,v_idperiodo.idejercicioactual,
          p_idestructuracomun, v_idperiodo.idperiodoactual,
          (COALESCE((
            select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
            and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
          ),0)+1),1,(COALESCE((
            select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
            and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
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
        with prodorden AS (INSERT INTO 
          mod_logdistribucion.dat_prodorden
        (
          idproducto,idcliente,cantidad,idorden
        )
        (
        select DISTINCT pp.idproducto, v_idcliente,sum(pp.cantidad) as cantidad,v_iddocumento
        from mod_logpuntoventa.dat_pedidoproducto pp
        where (pp.cantidad - coalesce(pp.enproceso,0) - coalesce(pp.procesado,0)) > 0
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
        
        --Insertando relacion de los pedidos y la distribucion
        INSERT INTO mod_logpuntoventa.dat_pedidodocumento
        (
          idpedido,iddocumento,tipo
        )
        (select pt.idpedidotienda, v_iddocumento, 1 from mod_logpuntoventa.dat_pedidotienda pt
        	--where
        );
        --inertando facturas
        select cc.idterminodepago, ntp.plazo into v_condicionpago from mod_datosmaestros.dat_clienteproveedorcobropago cc
        inner join mod_datosmaestros.nom_terminosdepago ntp on ntp.idterminodepago = cc.idterminodepago
        where cc.idclienteproveedor = v_idcliente and cc.clasificacion = 2 and cc.idmoneda = 9900000000 limit 1;
        
        v_idcuentacliente := (select cbc.idcuentabancliente from mod_datosmaestros.dat_cuentabanccliente cbc 
        where cbc.idclienteproveedores = v_idcliente and cbc.idmoneda = 9900000000 limit 1);
        
        v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'facturaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
        
        v_idperiodo = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);
        
        v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
        for v_pedidos in (
        	select pt.*, pd.* from mod_logpuntoventa.dat_pedidodocumento pd
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
            where pd.iddocumento = v_iddocumento and (
            	select sum(coalesce(ppp.cantidad,0)-coalesce(ppp.enproceso,0)-coalesce(ppp.procesado,0)) 
                from mod_logpuntoventa.dat_pedidoproducto ppp where ppp.idpedidotienda = pt.idpedidotienda
            ) > 0
        ) loop
        
        	with documento AS (INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
            )
            VALUES (
              v_iddoc, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechafacturacion,'Factura generada tienda virtual. Pedido '||v_pedidos.nropedido,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
              p_idestructuracomun, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_idestructuracomun
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
                inner join mod_logistica.dat_producto dp on dp.idindicador = pp.idindicador
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
                	select dm.preciopromedio, dmm.idmoneda, dp.idcuentadesgloseprecio, dp.concepto, dp.porciento, dp.valor
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
            	/*with movimiento as (
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
                      v_idfactura,
                      v_producto.idproducto,
                      v_producto.precio,
                      0,
                      0,
                      0,
                      '-',
                      v_producto.idumedida,
                      v_producto.idelementogasto,
                      v_producto.idclasificacioncontable
                    ) returning idmovimiento, preciocontable
                ), movmoneda as (
                	insert into mod_logistica.dat_movmoneda 
                    (
                    	idmovimiento, idmoneda, precio
                    )
                    select idmovimiento, 9900000000, preciocontable from movimiento
                    returning idmovimiento
                )
                INSERT INTO 
                  mod_logfacturacion.dat_prodfactura
                (
                  idmovimiento,
                  idtipoprecio,
                  preciobase,
                  referencia
                )
                select idmovimiento, v_datosareaventa.idtipoprecioagencia, , preciocontable from movimiento;*/
                update mod_logpuntoventa.dat_pedidoproducto
                set enproceso = cantidad - coalesce(procesado,0)
                where idproductopedido = v_producto.idproductopedido;
                
            end loop;
            INSERT INTO mod_logpuntoventa.dat_pedidodocumento
            (
              idpedido,iddocumento,tipo
            )
            VALUES(v_pedidos.idpedidotienda, v_idfactura, 2);
            update mod_logpuntoventa.dat_pedidotienda
            set estado = 3 where idpedidotienda = v_pedidos.idpedidotienda;
        end loop;
    end loop;  
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidostienda (p_idusuario numeric, p_idejercicio numeric, p_idperiodo numeric, p_idestructuracomun numeric, p_areaventa numeric)
  OWNER TO zeolides;
  
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
            (select sum(pp.importe) from mod_logpuntoventa.dat_pedidoproducto pp 
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
              tiendavirtual
            )
            select v_datospersona.idreferencia, v_datospersona.nropedido,v_datospersona.fechapedido,v_datospersona.estado, idventas, 1 from venta 
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
            	select dp.precio, mrec.cantidad,dp.idumedida, dp.*, pp.idproductopedido, pp.precio as preciopedido
                from mod_logistica.dat_movimiento dm
                inner join mod_loginventario.dat_movrecepcion mrec on mrec.idmovimiento = dm.idmovimiento
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idindicador = dp.idindicador
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
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarrecepciontienda (p_idrecepcion numeric, p_idestructuracomun numeric, p_idusuario numeric, p_idejercicio numeric, p_idperiodo numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarrecepciontiendadev (
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
  v_countproductos numeric;
  v_iddocdevolucion numeric;
  v_fechadev date;
  v_iddocumentodev numeric;
  v_periodoinvdev record;
  v_datosfacturadev record;
  v_productosdev record;
  v_cronologia numeric;
  v_idalmacencorriente numeric;
  v_iddistribucion numeric;
  v_datosareaventa record;
  v_idoperaciontransferencia numeric;
  v_transferencia record;
  v_iddocRecep numeric;
  v_idrecepcion numeric;
  v_productotransf record;
  v_datosproducto record;
BEGIN

	v_countproductos := (select count(dm.idmovimiento)
                from mod_logistica.dat_movimiento dm
                inner join mod_loginventario.dat_movrecepcion mrec on mrec.idmovimiento = dm.idmovimiento
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idindicador = dp.idindicador
                inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento and pp.idpedidotienda = pd.idpedido
                where dm.iddocumento = p_idrecepcion and dm.cantidad > 0);
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
    
    if v_countproductos > 0 then 
    	v_idpersona := (
    	select vc.idventacliente from mod_logpuntoventa.dat_ventacliente vc 
        where vc.numeroidentidad = v_datospersona.cibeneficiario
        );
        
        if v_idpersona is null then
            
            INSERT INTO 
              mod_logpuntoventa.dat_ventacliente
            (
              numeroidentidad,nombre,telefono,direccion
            )
            VALUES (
              v_datospersona.cibeneficiario,v_datospersona.beneficiario,v_datospersona.telbeneficiario,
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
              v_fechafacturacion,'Factura generada tienda virtual. Pedido '||v_datospersona.nropedido,0,1,p_idusuario,1,v_idperiodo.idejercicioactual,
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
                idventas,idpersona,fechaventa,importe,idpago,idareaventa,estado,idmoneda
              )
              select iddocumento,v_idpersona,v_fechafacturacion,
                (select sum(pp.importe) from mod_logpuntoventa.dat_pedidoproducto pp 
                where pp.idpedidotienda = v_datospersona.idpedidotienda),-2,v_configtienda.idareaventa,
                1,v_configtienda.idmoneda
                from documento returning idventas),
            ventaorden as (
                INSERT INTO 
                  mod_logpuntoventa.dat_ventaorden
                (
                  idorden,nroorden,fechaorden,estadoorden,idventas
                )
                select v_datospersona.idreferencia, v_datospersona.nropedido,v_datospersona.fechapedido,v_datospersona.estado, idventas from venta 
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
                    select dp.precio, dm.cantidad,dp.idumedida, dp.*, pp.idproductopedido, pp.precio as preciopedido
                    from mod_logistica.dat_movimiento dm
                    inner join mod_loginventario.dat_movrecepcion mrec on mrec.idmovimiento = dm.idmovimiento
                    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                    inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idindicador = dp.idindicador
                    inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento and pp.idpedidotienda = pd.idpedido
                    where dm.iddocumento = p_idrecepcion and dm.cantidad > 0
                ) loop
                
                with movimiento as (
                        INSERT INTO 
                          mod_logistica.dat_movimiento
                        (
                          iddocumento,idproducto,preciocontable,importecontable,cantidad,
                          cronologia,signo,idunidadmedida,idelementogasto,idclasificacion
                        )
                        VALUES (
                          v_iddocumento,v_productos.idproducto,v_productos.precio,
                          round(v_productos.cantidad*v_productos.precio,2),v_productos.cantidad,
                          0,'-',v_productos.idumedida,v_productos.idelementogasto,
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
                      idproducto,idventas,cantidad,precio,importetotal
                    )
                    select idproducto, v_iddocumento, v_productos.cantidad, v_productos.preciopedido,
                     round(v_productos.preciopedido*v_productos.cantidad,2) from movimiento;
                
            end loop;
    end if;
    --crear devolucion de factura que genero la recepcion
    v_iddocdevolucion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'valedev' and des.idestructuracomun = v_datospersona.idestructuracomun limit 1);
    
    v_periodoinvdev = mod_logistica.f_obtenerejercicioactivo(10, v_datospersona.idestructuracomun);            
                
    
    v_fechadev := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 10 and des.idestructuracomun = v_datospersona.idestructuracomun limit 1);
    
    select df.nrofactura, d.idoperacion, df.iddeposito, d.numeroref, df.idfactura, df.idcliente
     into v_datosfacturadev from mod_logistica.dat_documento d
    inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento
    inner join mod_logistica.dat_documentopadre dp on dp.idpadre = d.iddocumento
    inner join mod_logfacturacion.dat_docfactura df on df.idfactura = d.iddocumento
    where dp.iddocumento = p_idrecepcion;
    
    select max(d.cronologia)+1 into v_cronologia from mod_logistica.dat_documento d;    
    
    INSERT INTO mod_logistica.dat_documento
      (
        iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
        idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion,nrodoc
      )
      VALUES (
        v_iddocdevolucion, date_part('year', CAST(to_char(v_fechadev, 'DD/MM/YYYY HH24:MI') as timestamp)),
        v_fechadev,'Devolucion factura nro. '||v_datosfacturadev.nrofactura||' devolviendo pedido '||v_datospersona.nropedido
        ,v_cronologia,1,p_idusuario,4,v_periodoinvdev.idejercicioactual,
        v_datosfacturadev.iddeposito, v_periodoinvdev.idperiodoactual,
        (COALESCE((
          select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdevolucion
          and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_datosfacturadev.iddeposito
        ),0)+1),v_idespecialidad, v_datosfacturadev.idoperacion, (COALESCE((
        select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdevolucion
        and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_datosfacturadev.iddeposito
      ),0)+1)
      ) returning iddocumento into v_iddocumentodev;
      INSERT INTO mod_logistica.dat_documentocliente
      (
        iddocumento,idcliente,tipocliente
      )
      VALUES (v_iddocumentodev,v_datosfacturadev.idcliente,1);
      INSERT INTO 
        mod_logistica.dat_documentopadre
      (
        iddocumento,idpadre
      )
      values (v_iddocumentodev, v_datosfacturadev.idfactura);
      
      for v_productosdev in (
            	select dm.preciocontable, (mre.cantidad - dmr.cantidad) as cantdev,dm.idunidadmedida, dp.*, dp.cantidad as existencia 
                from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_logistica.dat_producto dpr on dpr.idindicador = dp.idindicador
                inner join mod_logistica.dat_movimiento dmr on dmr.idproducto = dpr.idproducto
                inner join mod_loginventario.dat_movrecepcion mre on mre.idmovimiento = dmr.idmovimiento
                where dm.iddocumento = v_datosfacturadev.idfactura and dmr.iddocumento = p_idrecepcion 
                and dmr.cantidad < mre.cantidad
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
                  idclasificacion,
                  existenciaactual,
                  preciopromedio,
                  importetotal
                )
                VALUES (
                  v_iddocumentodev,
                  v_productosdev.idproducto,
                  v_productosdev.precio,
                  round(v_productosdev.precio*v_productosdev.cantdev,2),
                  v_productosdev.cantdev,
                  v_cronologia,
                  '+',
                  v_productosdev.idumedida,
                  v_productosdev.idelementogasto,
                  v_productosdev.idclasificacioncontable,
                  (v_productosdev.existencia+v_productosdev.cantdev),
                  /*(case when (v_producto.existencia-v_producto.cantidad) > 0 
                      then (round(v_producto.importe - (v_producto.precio*v_producto.cantidad),2))/(v_producto.existencia-v_producto.cantidad)  
                  else 0 end)*/0,
                  /*(case when (v_producto.existencia-v_producto.cantidad) > 0 
                        then (round(v_producto.importe - (v_producto.precio*v_producto.cantidad), 2) )
                  else 0 end)*/0
                ) returning idmovimiento, cantidad
            )
            INSERT INTO 
              mod_logistica.dat_productocmplto
            (
              idproducto,iddocumento,cantidad,entregado,pendiente
            )
            select v_productosdev.idproducto, v_datosfacturadev.idfactura, cantidad, cantidad, 0 from movimiento;   
            
            update mod_logistica.dat_producto as dp
            set cantidad = dp.cantidad + v_productosdev.cantdev,
            precio = (round(dp.importe + (dp.precio*v_productosdev.cantdev),2))/(dp.cantidad+v_productosdev.cantdev),
            cronologia = v_cronologia,
            importe = (round(dp.importe + (dp.precio*v_productosdev.cantdev), 2))     
            where dp.idproducto = v_productosdev.idproducto;
      end loop;
    --crear distribucion para transferir al corriente
    v_idalmacencorriente := (select nc.iddeposito from mod_logpuntoventa.dat_areaventacorriente nc
      where nc.idareaventa = v_datospersona.idareaventa limit 1);
    
    v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = v_datospersona.idestructuracomun limit 1);  
    
    v_idoperaciontransferencia := 990000005928;  
    
    INSERT INTO mod_logistica.dat_documento
    (
      iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
      idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
    )
    VALUES (
      v_iddoc, date_part('year', CAST(to_char(v_fechadev, 'DD/MM/YYYY HH24:MI') as timestamp)),
      v_fechadev,'Distribucion para devolucion de pedido '|| v_datospersona.nropedido,0,1,p_idusuario,3,v_periodoinvdev.idejercicioactual,
      v_datospersona.idestructuracomun, v_periodoinvdev.idperiodoactual,
      (COALESCE((
        select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
        and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_datospersona.idestructuracomun
      ),0)+1),1,(COALESCE((
        select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
        and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_datospersona.idestructuracomun
      ),0)+1),p_idusuario
    ) returning iddocumento into v_iddistribucion;
    INSERT INTO mod_logdistribucion.dat_distribucion
    (
      iddistribucion,idestructuraop,tipodestino,tipodistribucion,salidaporfactura
    )
    VALUES (v_iddistribucion,v_datospersona.idestructuracomun,3,3,0);
    INSERT INTO mod_logistica.dat_documentocliente
    (
      iddocumento,idcliente,tipocliente,idestructura
    )
    VALUES (v_iddistribucion,v_idalmacencorriente,3,v_datospersona.idestructuracomun);
    --insertando productos de la distribucion
    with prodorden AS (INSERT INTO 
      mod_logdistribucion.dat_prodorden
    (
      idproducto,idcliente,cantidad,idorden
    )
    (
    select DISTINCT pp.idproducto, v_idalmacencorriente,pp.cantidad,v_iddistribucion
    from mod_logistica.dat_movimiento pp
    where pp.iddocumento = v_iddocumentodev
    --group by pp.idproducto
    ) RETURNING idprodorden, cantidad, idproducto)/*,
    cantidadcomp as (
      INSERT INTO 
        mod_logistica.dat_cantidadcomprometida
      (
        iddocumento,idproducto,idcliente,cantidad,estado
      ) 
      select v_iddocumento,idproducto,v_idcliente,cantidad,2 from prodorden
      RETURNING iddocumento
    )*/
    INSERT INTO 
      mod_logdistribucion.dat_prodordencmpto
    (
      idprodorden,enproceso,entregado,pendiente,cantidadoriginal
    )
    select idprodorden,0, cantidad,0,cantidad from prodorden;
    --transferencia al corriente
    select da.* into v_datosareaventa from mod_logpuntoventa.dat_areaventa da where da.idareaventa = v_datospersona.idareaventa;
    
    v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'transferenciaLog' and des.idestructuracomun = v_datospersona.idestructuracomun limit 1);
    
    INSERT INTO mod_logistica.dat_documento
  (
    iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
    idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor, idoperacion
  )
  VALUES (
    v_iddoc, date_part('year', CAST(to_char(v_fechadev, 'DD/MM/YYYY HH24:MI') as timestamp)),
    v_fechadev,'Transferencia para almacen corriente por devolucion de pedido '|| v_datospersona.nropedido,v_cronologia+1,1,p_idusuario,4,v_periodoinvdev.idejercicioactual,
    v_datosareaventa.idestructuraop, v_periodoinvdev.idperiodoactual,
    (COALESCE((
      select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
      and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_datosareaventa.idestructuraop
    ),0)+1),1,(COALESCE((
      select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
      and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_datosareaventa.idestructuraop
    ),0)+1),p_idusuario, v_idoperaciontransferencia
  ) returning iddocumento, nrodoc into v_transferencia;
  INSERT INTO 
    mod_logistica.dat_entrega
  (
    iddocumento,
    version,
    iddestino,
    origen
  )
  VALUES (
    v_transferencia.iddocumento,
    0,3,1
  );
  INSERT INTO mod_logistica.dat_documentocliente
    (
      iddocumento,idcliente,tipocliente
    )
    VALUES (v_transferencia.iddocumento,v_idalmacencorriente,3);
    
    INSERT INTO 
      mod_logistica.dat_documentopadre
    (
      iddocumento,idpadre
    )
    values (v_transferencia.iddocumento, v_iddistribucion);
    for v_productos in (
      select dpo.cantidad, dpo.idproducto, dp.precio, dp.cantidad as existencia, dp.importe,
      dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable
       from mod_logdistribucion.dat_prodorden dpo
      inner join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
      where dpo.idorden = v_iddistribucion 
    ) LOOP
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
              idclasificacion,
              existenciaactual,
              preciopromedio,
              importetotal
            )
            VALUES (
              v_transferencia.iddocumento,
              v_productos.idproducto,
              v_productos.precio,
              round(v_productos.precio*v_productos.cantidad,2),
              v_productos.cantidad,
              v_cronologia+1,
              '-',
              v_productos.idumedida,
              v_productos.idelementogasto,
              v_productos.idclasificacioncontable,
              (v_productos.existencia-v_productos.cantidad),
              (case when (v_productos.existencia-v_productos.cantidad) > 0 
                  then (round(v_productos.importe - (v_productos.precio*v_productos.cantidad),2))/(v_productos.existencia-v_productos.cantidad)  
              else 0 end),
              (case when (v_productos.existencia-v_productos.cantidad) > 0 
                    then (round(v_productos.importe - (v_productos.precio*v_productos.cantidad), 2) )
              else 0 end)
            ) returning idmovimiento, cantidad
        )
        INSERT INTO 
          mod_loginventario.dat_moventrega
        (
          idmovimiento,
          ordenado,
          pendiente,
          iddocorigen
        )
        select idmovimiento, cantidad, cantidad, v_transferencia.iddocumento from movimiento;   
        update mod_logistica.dat_producto as dp
        set cantidad = dp.cantidad - v_productos.cantidad,
        precio = (case when (dp.cantidad-v_productos.cantidad) > 0 
                  then (round(dp.importe - (dp.precio*v_productos.cantidad),2))/(dp.cantidad-v_productos.cantidad)  
              else 0 end),
        cronologia = v_cronologia+1,
        importe = (case when (dp.cantidad-v_productos.cantidad) > 0 
                    then (round(dp.importe - (dp.precio*v_productos.cantidad), 2) )
              else 0 end)     
        where dp.idproducto = v_productos.idproducto; 
        
        update mod_logpuntoventa.dat_pedidoproducto set devuelto = devuelto + v_productos.cantidad 
        where idpedidotienda = v_datospersona.idpedidotienda and idproducto = v_productos.idproducto;            
    end loop; 
    --recepcion en elaboracion en el corriente
    v_iddocRecep := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'recepcionLog' and des.idestructuracomun = v_datospersona.idestructuracomun limit 1);
    
    INSERT INTO mod_logistica.dat_documento
    (
      iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
      idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
    )
    VALUES (
      v_iddocRecep, date_part('year', CAST(to_char(v_fechadev, 'DD/MM/YYYY HH24:MI') as timestamp)),
      v_fechadev,'Recepcion generada devolucion pedido '||v_datospersona.nropedido,0,1,p_idusuario,1,v_periodoinvdev.idejercicioactual,
      v_idalmacencorriente, v_periodoinvdev.idperiodoactual,
      (COALESCE((
        select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocRecep
        and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_idalmacencorriente
      ),0)+1),v_idespecialidad, v_idoperaciontransferencia
    ) returning iddocumento into v_idrecepcion;
    INSERT INTO 
      mod_loginventario.dat_recepcion
    (
      iddocumento,nrodocorigen,fechadocorigen
    )
    VALUES (
      v_idrecepcion, v_transferencia.nrodoc, v_fechadev
    );
    INSERT INTO mod_logistica.dat_documentocliente
    (
      iddocumento,idcliente,tipocliente
    )
    VALUES (v_idrecepcion,v_datosareaventa.idestructuraop,3);
    INSERT INTO 
      mod_logistica.dat_documentopadre
    (
      iddocumento,idpadre
    )
    values (v_idrecepcion, v_transferencia.iddocumento);
    --productos de la recepcion
    for v_productotransf in (
        select dm.preciocontable, dm.cantidad,dm.idunidadmedida, dp.*
        from mod_logistica.dat_movimiento dm
        inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
        where dm.iddocumento = v_transferencia.iddocumento
    ) loop
        --buscar indicador para crear tarjeta si no existe
        select dpd.* into v_datosproducto from mod_logistica.dat_producto dpd
        where dpd.idestructura = v_idalmacencorriente and dpd.idindicador = v_productotransf.idindicador;
        --insertar movimientos de la recepcion
        if v_datosproducto.idproducto is not null then
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
                v_idrecepcion,
                v_datosproducto.idproducto,
                v_productotransf.preciocontable,
                0,
                v_productotransf.cantidad,
                0,
                '+',
                v_datosproducto.idumedida,
                v_datosproducto.idelementogasto,
                v_datosproducto.idclasificacioncontable
              ) returning idmovimiento, cantidad
          )
          INSERT INTO 
            mod_loginventario.dat_movrecepcion
          (
            idmovimiento,
            cantidad
          )
          select idmovimiento, cantidad from movimiento;
        else
          with producto as (
            INSERT INTO 
              mod_logistica.dat_producto
            (
              idestructura,
              idumedida,
              idindicador,
              idclasificacioncontable,
              cronologia,
              cantidad,
              importe,
              idestructuracomun,
              idmarca,
              idmodelo,
              idelementogasto
            )
            VALUES (
              v_idalmacencorriente,
              v_productotransf.idunidadmedida,
              v_productotransf.idindicador,
              v_productotransf.idclasificacioncontable,
              0,
              0,
              0,
              v_datospersona.idestructuracomun,
              v_productotransf.idmarca,
              v_productotransf.idmodelo,
              v_productotransf.idelementogasto
            ) returning idproducto                      
          ), movimiento as (
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
              select v_idrecepcion, idproducto, v_productotransf.preciocontable,0,
              v_productotransf.cantidad, 0, '+', v_datosproducto.idumedida, v_datosproducto.idelementogasto,
              v_datosproducto.idclasificacioncontable from producto
              returning idmovimiento, cantidad
          )
          INSERT INTO 
            mod_loginventario.dat_movrecepcion
          (
            idmovimiento,
            cantidad
          )
          select idmovimiento, cantidad from movimiento;
        end if;
        
    end loop;
    --actualizar devuelto del pedido
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarrecepciontiendadev (p_idrecepcion numeric, p_idestructuracomun numeric, p_idusuario numeric, p_idejercicio numeric, p_idperiodo numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_productosventa (
  p_idestructura numeric,
  p_idnaturaleza numeric,
  p_disponibilidad numeric,
  p_existencia numeric,
  p_criterio varchar,
  p_idmonedacontable numeric,
  p_idmonedaalternativa numeric,
  p_idmonedaventa numeric,
  p_idmarca numeric,
  p_idmodelo numeric,
  p_limit numeric,
  p_start numeric,
  p_criterioavan numeric,
  p_connumeropieza numeric,
  p_idnaturalezapadre numeric,
  p_precio numeric = 0
)
RETURNS SETOF mod_logpuntoventa.td_productosventa AS
$body$
declare
all_rec mod_logpuntoventa.td_productosventa;
begin
for all_rec in
select dp.idindicador,num.abreviaturaunidadmedida as um,dp.idproducto,
(COALESCE(ni.numeropieza,ni.codigo)||' - '||coalesce(nih.descripcionventa,substring(ni.denominacion,0,30))) as text,
dp.cantidad -(select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto) as disponible,
dp.cantidad as existencia,dp.precio as preciocontable,dp.precioalternativo as precioalternativo,dp.importe as importetotalcup,
dp.importealternativo as importetotalcuc,num.decimales,nn.denominacion as naturaleza,
(case when nih.tipocontrol = 2 then 1 else 0 end) as tienelote,
(case when nih.tipocontrol = 3 then 1 else 0 end) as equipo,
(case when p_idmonedacontable is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) else '' end) as monedacontable,
(case when p_idmonedaalternativa is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaalternativa) else '' end) as monedaalternativa,
(case when p_idmonedaventa is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaventa) else '' end) as monedaventa,
nma.denominacion||' - '||nmo.denominacion as marcamodelo,
(select 'data:image/jpg;base64,'||imag.imagen from mod_datosmaestros.dat_imagenindicador dim
inner join mod_logistica.nom_imagen imag on imag.idimagen = dim.idimagen
where dim.idindicador = ni.idindicador limit 1) as imagen,
count(*) OVER() as total,ni.numeropieza as referencia,coalesce(nih.descripcionventa,substring(ni.denominacion,0,30)),
ni.denominacion,ni.descripcion,nn.idnaturaleza,pv.preciobase,pv.precio,
coalesce((select sum(cantidad) from mod_logpuntoventa.dat_ventaproducto where idproducto = dp.idproducto),0) as vendida,
coalesce((select sum(importetotal) from mod_logpuntoventa.dat_ventaproducto where idproducto = dp.idproducto),0) as total,
coalesce(dp.cantidad-coalesce(
	(select sum(COALESCE(dpped.enproceso,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
    and dpped.enproceso > 0)
,0),0)-(dp.cantidad-coalesce((select sum(cc.cantidad) from mod_logistica.dat_cantidadcomprometida cc where cc.idproducto = dp.idproducto and cc.estado = 1),0)),
(select natv.idreferencia from mod_logpuntoventa.dat_areaventanaturaleza natv where natv.idareaventa = pv.idareaventa
and natv.idnaturaleza = nn.idnaturaleza limit 1) as idcategoriapadre
from mod_logistica.dat_producto dp
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dp.idestructura
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logpuntoventa.dat_productoareaventa pv on pv.idproducto = dp.idproducto
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dp.idumedida
left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador
left join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza
left join mod_datosmaestros.nom_especialidad ne on ne.idespecialidad = ni.idespecialidad
left join mod_datosmaestros.nom_marca nma on nih.idmarca = nma.idmarca
left join mod_datosmaestros.nom_modelo nmo on nih.idmodelo = nmo.idmodelo
--left join mod_datosmaestros.nom_imagenindicador nii on nii.idimagen = ni.idindicador
where dp.cronologia > 0 and dp.idestructura = p_idestructura

and (case when p_criterio is not null then (ni.denominacion ilike '%' || p_criterio || '%' or ni.numeropieza ilike '%' || p_criterio || '%' or ni.codigo ilike '%' || p_criterio || '%') else
true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else true end)
and(case when p_idmarca is not null then nih.idmarca = p_idmarca else true end)
and(case when p_idmodelo is not null then nih.idmodelo = p_idmodelo else true end)
and(case when p_disponibilidad = 1 then (dp.cantidad -(select coalesce(sum(cantidad),0)
from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)) > 0 else true end)
and(case when p_existencia = 1 then dp.cantidad > 0 else true end)
and(case when p_connumeropieza is not null then ni.numeropieza is not null else true end)
and(case when p_idnaturalezapadre is not null then ni.idnaturaleza =any(
select idnaturaleza from mod_logpuntoventa.dat_naturalezaventa where idpadre = p_idnaturalezapadre
)else true end)
and(case when p_precio = 1 then pv.precio > 0 else true end)

group by dp.idindicador,ni.codigo,ni.numeropieza,ni.denominacion,ni.descripcion,num.abreviaturaunidadmedida,dp.cantidad,dp.idproducto,nih.tipocontrol,nih.descripcionventa,imagen,
nc.denominacion,num.decimales,deop.denominacion,deop.codigo,nn.idnaturaleza,nn.denominacion,deop.idestructura,ne.denespecialidad,nma.idmarca,nmo.idmodelo,nma.denominacion,nmo.denominacion,
pv.preciobase,pv.precio,pv.cantidadentienda,pv.idareaventa

order by (coalesce(dp.cantidad-coalesce(
	(select sum(COALESCE(dpped.enproceso,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
    and dpped.enproceso > 0)
,0),0)-(dp.cantidad-coalesce((select sum(cc.cantidad) from mod_logistica.dat_cantidadcomprometida cc where cc.idproducto = dp.idproducto and cc.estado = 1),0))), text
offset p_start limit p_limit
loop
--raise exception '%', all_rec;
return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logpuntoventa.f_productosventa (p_idestructura numeric, p_idnaturaleza numeric, p_disponibilidad numeric, p_existencia numeric, p_criterio varchar, p_idmonedacontable numeric, p_idmonedaalternativa numeric, p_idmonedaventa numeric, p_idmarca numeric, p_idmodelo numeric, p_limit numeric, p_start numeric, p_criterioavan numeric, p_connumeropieza numeric, p_idnaturalezapadre numeric, p_precio numeric)
  OWNER TO zeolides;
  
DROP TYPE IF EXISTS mod_logfacturacion.td_subreportefacturastienda CASCADE;
  
CREATE TYPE mod_logfacturacion.td_subreportefacturastienda AS (
  nrofactura VARCHAR,
  fechacontable DATE,
  cliente VARCHAR,
  importecontable NUMERIC,
  importealternativo NUMERIC,
  direccion VARCHAR,
  cuentacup VARCHAR,
  sucursalcup VARCHAR,
  cuentacuc VARCHAR,
  sucursalcuc VARCHAR,
  numeroref NUMERIC,
  estado NUMERIC
);

ALTER TYPE mod_logfacturacion.td_subreportefacturastienda
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_subreportefacturastienda (
  p_iddespacho numeric,
  p_monedacont numeric
)
RETURNS SETOF mod_logfacturacion.td_subreportefacturastienda AS
$body$
	DECLARE

	v_rec mod_logfacturacion.td_subreportefacturastienda;

	BEGIN    

		for v_rec in              

        (
        SELECT df.nrofactura, dd.fechacontable,
      (select (nc.codigo || ' ' || nc.nombre) from mod_datosmaestros.nom_clientesproveedor nc
		where nc.idclientesproveedores = df.idcliente) as cliente, 
		(select sum(round(dmm1.precio * dm.cantidad,2)) from mod_logistica.dat_movmoneda dmm1
        inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmm1.idmovimiento
         where dm.iddocumento = df.idfactura and dmm1.idmoneda = p_monedacont) as importecontable, 
		0 as importealternativo,
         (select nc.direccion from mod_datosmaestros.nom_clientesproveedor nc
		where nc.idclientesproveedores = df.idcliente) as direccion,
        (select ncb.nrocuenta from mod_banco.nom_cuentabancaria ncb
         inner join mod_logfacturacion.conf_cuentafactura ccf on ccf.idcuenta = ncb.idcuentabancaria
         where ncb.idmoneda = p_monedacont limit 1) as cuentacup,
        (select ns.numero from mod_datosmaestros.nom_sucursal ns
         inner join mod_banco.nom_cuentabancaria ncb on ncb.idsucursal = ns.idsucursal
         inner join mod_logfacturacion.conf_cuentafactura ccf on ccf.idcuenta = ncb.idcuentabancaria
         where ncb.idmoneda = p_monedacont limit 1) as sucursalcup,
        '' as cuentacuc,
        '' as sucursalcuc,
        dd.numeroref,
        dest.estado
        from  mod_logistica.dat_documento dd
        inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
        inner join mod_logfacturacion.dat_despachofactura desf on desf.idfactura = dd.iddocumento
        inner join mod_logfacturacion.dat_despachotienda dest on dest.iddespachotienda = desf.iddespachotienda
        where dest.iddespachotienda = p_iddespacho
        --inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = dd.iddocumento
        /*where dd.iddocumento in (
         select desf.idfactura from mod_logfacturacion.dat_despachofactura desf where desf.iddespachotienda = p_iddespacho
        )*/
        
         group by df.nrofactura, dd.numeroref, dd.fechacontable, df.idcliente, df.idfactura, dest.estado order by df.nrofactura
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
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_subreportefacturastienda (p_iddespacho numeric, p_monedacont numeric)
  OWNER TO zeolides;