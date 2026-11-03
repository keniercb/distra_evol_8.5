CREATE SEQUENCE IF NOT EXISTS mod_logpuntoventa.dat_pedidotienda_consecutivo_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.dat_pedidotienda_consecutivo_seq
    OWNER TO zeolides;

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_pedidotienda
    ADD COLUMN IF NOT EXISTS consecutivo bigint NOT NULL DEFAULT nextval('mod_logpuntoventa.dat_pedidotienda_consecutivo_seq'::regclass);
	
ALTER TABLE IF EXISTS mod_logpuntoventa.dat_pedidotienda
    ADD COLUMN IF NOT EXISTS identificador character varying(100) COLLATE pg_catalog."default";

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_pedidotienda
    ADD COLUMN IF NOT EXISTS infoventa text COLLATE pg_catalog."default";

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_pedidotienda
    ADD COLUMN IF NOT EXISTS infopago text COLLATE pg_catalog."default";	
	
ALTER TABLE IF EXISTS mod_logpuntoventa.dat_pedidotienda
    ADD COLUMN IF NOT EXISTS receiptnumber integer;	
	
ALTER TABLE IF EXISTS mod_logpuntoventa.nom_modopago
    ADD COLUMN IF NOT EXISTS codigocaja numeric(2,0);	

-- FUNCTION: mod_logpuntoventa.ft_generanropedido()

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.ft_generanropedido();

CREATE OR REPLACE FUNCTION mod_logpuntoventa.ft_generanropedido()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
  v_nropedido varchar;
BEGIN
  if NEW.nropedido is null then
    v_nropedido := 'PC'||
    				date_part('year', CAST(to_char(NEW.fechapedido, 'DD/MM/YYYY HH24:MI') as timestamp))||
                    date_part('month', CAST(to_char(NEW.fechapedido, 'DD/MM/YYYY HH24:MI') as timestamp))||
                    'I'||NEW.identificador||'N'||NEW.consecutivo;
  	NEW.nropedido = v_nropedido;
  end if;
  return new;
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.ft_generanropedido()
    OWNER TO zeolides;
	

CREATE TRIGGER dat_pedidotienda_trnropedido
  BEFORE INSERT 
  ON mod_logpuntoventa.dat_pedidotienda
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_logpuntoventa.ft_generanropedido();
	
	
	
-- FUNCTION: mod_logpuntoventa.f_procesarpedidosinfoventa(numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_procesarpedidosinfoventa(numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidosinfoventa(
	p_idpedido numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_lineinfo record;
  v_datosareaventa record;
  v_recindicador record;
  v_lineprod varchar[];
  v_codprod varchar;
  v_cantidadprod numeric;
  v_precioprod numeric;
  v_importeprod numeric;
  v_contadoroper integer;
  v_nombretabla varchar;
  v_sql varchar;
  v_sql2 varchar;
BEGIN
   delete from mod_logpuntoventa.dat_pedidoproducto where idpedidotienda = p_idpedido;
   v_nombretabla := 'tem_infoventas_'||p_idpedido;
   select av.* into v_datosareaventa from mod_logpuntoventa.dat_areaventa av
   inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idareaventa = av.idareaventa and pt.idpedidotienda = p_idpedido;
     
   v_sql := 'CREATE TEMPORARY TABLE '||v_nombretabla||' ON COMMIT DROP AS (
   		select
		regexp_split_to_table(
			pt.infoventa
			, ''\n'') as linea 
		from mod_logpuntoventa.dat_pedidotienda pt
	   where pt.idpedidotienda ='|| p_idpedido||'
   )';
   execute v_sql;
	--'||$$'{$$ ||v_rangofecha.startdate|| $$}'$$||' and '||$$'{$$ ||v_rangofecha.enddate|| $$}'$$||'
	v_sql2 := 'select iv.linea from '||v_nombretabla||' iv';
   for v_lineinfo in execute v_sql2 loop
   		select
		array_agg(t.fragmento) into v_lineprod from (
			select regexp_split_to_table(v_lineinfo.linea, ';') as fragmento
		) t;  
   		if v_lineprod[4]::numeric = 4 then
			v_codprod := v_lineprod[5];
			v_cantidadprod := REGEXP_REPLACE(v_lineprod[8],',','')::numeric;
			v_importeprod := REGEXP_REPLACE(v_lineprod[9],',','')::numeric;
			v_precioprod := REGEXP_REPLACE(v_lineprod[17],',','')::numeric;
			select ni.* into v_recindicador from mod_datosmaestros.nom_indicador ni
			inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
			where nih.codigobarra = v_codprod or ni.codigo = v_codprod limit 1;
			if v_recindicador.tipo = 1 then
			INSERT INTO mod_logpuntoventa.dat_pedidoproducto(
				idpedidotienda, codreferencia, idindicador, idproducto, 
				cantidad, precio, importe, idumedida, enproceso, procesado, 
				devuelto, devolver, cantidadreal, preciounitario, tipo
			)
				select 
				p_idpedido, ni.numeropieza, ni.idindicador, dp.idproducto, v_cantidadprod, v_precioprod, v_importeprod, coalesce(dp.idumedida, ni.idumedida),
				0,0,0,0,v_cantidadprod,v_precioprod, ni.tipo
				from mod_datosmaestros.nom_indicador ni 
				inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
				inner join (
					select dpp.idproducto, dpp.idindicador, dpp.idestructura, dpp.idumedida, (
						case when dpa.idproducto is null then 1 else 0 end
					) as activo from mod_logistica.dat_producto dpp
					left join mod_logistica.dat_productoinactivo dpa on dpa.idproducto = dpp.idproducto 
				) dp on dp.idindicador = ni.idindicador and dp.idestructura = v_datosareaventa.idestructuraop and dp.activo = 1
				where ni.codigo = v_codprod or nih.codigobarra = v_codprod;
				else 
					INSERT INTO mod_logpuntoventa.dat_pedidoproducto(
						idpedidotienda, codreferencia, idindicador, idproducto, 
						cantidad, precio, importe, idumedida, enproceso, procesado, 
						devuelto, devolver, cantidadreal, preciounitario, tipo
					)
						select 
						p_idpedido, ni.numeropieza, ni.idindicador, null, v_cantidadprod, v_precioprod, v_importeprod, ni.idumedida,
						0,0,0,0,v_cantidadprod,v_precioprod, ni.tipo
						from mod_datosmaestros.nom_indicador ni 
						inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
						where ni.idindicador = v_recindicador.idindicador;
				end if;
					elseif array_length(v_lineprod,1)::numeric = 8 
						and REGEXP_REPLACE(v_lineprod[1],'\''','')::numeric = 0 and v_lineprod[2]::numeric = 0 and v_lineprod[3]::numeric = 0 and v_lineprod[4]::numeric = 0 and v_lineprod[5]::numeric = 6 then
						v_contadoroper := v_lineprod[8]::numeric;
					end if;
					raise notice 'linea %', v_lineinfo.linea;
   end loop;
   update mod_logpuntoventa.dat_pedidotienda set receiptnumber = v_contadoroper where idpedidotienda = p_idpedido;
   return;
   commit;
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidosinfoventa(numeric)
    OWNER TO zeolides;


-- FUNCTION: mod_logpuntoventa.f_procesarpedidoscaja(numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_procesarpedidoscaja(numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidoscaja(
	p_idareaventa numeric,
	p_idestructuracomun numeric,
	p_idusuario numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
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
  v_servicios record;
  v_pedidostienda record;
  v_cronologia numeric;
  v_codigodeposito varchar;
  v_importe numeric;
  v_tipoventa numeric;
  v_infopago record;
  v_existepago record;
  v_lineinfopago varchar[];
  v_tipopago numeric;
  v_importepago numeric;
BEGIN
	v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'compventaLog' and des.idestructuracomun = p_idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);            
                
    select da.* into v_configtienda from mod_logpuntoventa.dat_areaventa da where da.idareaventa = p_idareaventa limit 1;
    
    v_codigodeposito := (select est.codigo from mod_estructuracomp.v_dametodasestructuras est where est.idestructura = v_configtienda.idestructuraop);
    
    v_fechafacturacion := (select da.fecha from mod_logistica.dat_estadoalmacen da where da.iddeposito = v_configtienda.idestructuraop limit 1);
    if v_fechafacturacion is null then
    	v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
    end if;
    --generando comprobante de venta por cada pedido
    select max(d.cronologia) into v_cronologia from mod_logistica.dat_documento d;
    if v_configtienda.tipoventa = 1 then 
    	for v_pedidostienda in (
        	select pt.* from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
            and pd.idpedidodocumento is null
        ) LOOP
        	v_cronologia := v_cronologia + 1;
            with documento AS (INSERT INTO mod_logistica.dat_documento
                (
                  iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                  idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion,nrodoc,aprobadopor
                )
                VALUES (
                  v_iddoc, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                  v_fechafacturacion,'Factura generada automaticamente: Pedido '||v_pedidostienda.nropedido,v_cronologia
                  ,1,p_idusuario,4,v_idperiodo.idejercicioactual,
                  v_configtienda.idestructuraop, v_idperiodo.idperiodoactual,
                  (COALESCE((
                    select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                    and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
                  ),0)+1),1,v_configtienda.idnomoperaciones,
                  (COALESCE((
                    select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                    and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
                  ),0)+1),p_idusuario
                ) returning iddocumento,iddoc,idejercicio,idestructuracomun,nrodoc),
                venta as (
                INSERT INTO 
                    mod_logpuntoventa.dat_ventas
                  (
                    idventas,
                    --idpersona,
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
                    idmoneda,
                    --importedevuelto,
                    --identrega,
                    nrofactura
                  )
                  select iddocumento,
                    --v_idpersona,
                    v_fechafacturacion,
                    (select sum(pp.importe) from mod_logpuntoventa.dat_pedidoproducto pp 
                    where pp.idpedidotienda = v_pedidostienda.idpedidotienda),
                    --?idcaja,
                    -3,
                    v_pedidostienda.idareaventa,
                    --?efectivo,
                    --?cambio,
                    --?fechaexpiracion,
                    --?nroventa,
                    1,
                    --?idcierreventa,
                    --?tipoventa,
                    --?vendedor,
                    v_configtienda.idmoneda,
                    --?importedevuelto,
                    --?identrega,
                    nrodoc||'.'||v_codigodeposito||'.'||date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp))
                    from documento returning idventas)--,
                    
                /*ventaorden as (
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
                    select v_pedidostienda.idreferencia, v_pedidostienda.nropedido,v_pedidostienda.fechapedido,v_pedidostienda.estado, idventas, 2 from venta 
                ),
                documentopedido as (
                    INSERT INTO mod_logpuntoventa.dat_pedidodocumento
                    (
                      idpedido,iddocumento,tipo
                    )
                    select v_pedidostienda.idpedidotienda, iddocumento, 4 from documento
                )*/
                INSERT INTO 
                    mod_logistica.dat_documentocliente
                  (
                    iddocumento,idcliente,tipocliente,idcondicionpago
                  )
                  select iddocumento, v_configtienda.idcliente, 1, v_configtienda.idcondicionpago from documento
                  RETURNING iddocumento into v_iddocumento;  
                
                for v_productos in (
                        select dp.precio, dp.cantidad as existencia, pp.cantidad as cantidadpedido,dp.idumedida, dp.*, pp.idproductopedido, pp.precio as preciopedido
                        from mod_logistica.dat_producto dp
                        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
                        where pp.idpedidotienda = v_pedidostienda.idpedidotienda and pp.tipo = 1
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
                              v_iddocumento,
                              v_productos.idproducto,
                              v_productos.precio,
                              round(v_productos.cantidadpedido*v_productos.precio,2),
                              v_productos.cantidadpedido,
                              v_cronologia,
                              '-',
                              v_productos.idumedida,
                              v_productos.idelementogasto,
                              v_productos.idclasificacioncontable,
                              (v_productos.existencia-v_productos.cantidadpedido),
                              (case when (v_productos.existencia-v_productos.cantidadpedido) > 0 
                                  then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadpedido),2))/(v_productos.existencia-v_productos.cantidadpedido)  
                              else 0 end),
                              (case when (v_productos.existencia-v_productos.cantidadpedido) > 0 
                                    then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadpedido), 2) )
                              else 0 end)
                            ) returning idmovimiento, preciocontable, idproducto
                        ), movmoneda as (
                            insert into mod_logistica.dat_movmoneda 
                          (
                              idmovimiento, idmoneda, precio
                          )
                          select idmovimiento, v_configtienda.idmoneda, v_productos.preciopedido from movimiento
                        )/*, cantidadcomp as (
                          INSERT INTO 
                            mod_logistica.dat_cantidadcomprometida
                          (
                            iddocumento,idproducto,idcliente,cantidad,estado
                          ) 
                          select v_iddocumento,idproducto,v_configtienda.idcliente,v_productos.cantidadpedido,1 from movimiento
                          RETURNING iddocumento
                        )*/
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
                    update mod_logistica.dat_producto as dp
                    set cantidad = dp.cantidad - v_productos.cantidadpedido,
                    precio = (case when (dp.cantidad-v_productos.cantidadpedido) > 0 
                              then (round(dp.importe - (dp.precio*v_productos.cantidadpedido),2))/(dp.cantidad-v_productos.cantidadpedido)  
                          else 0 end),
                    cronologia = v_cronologia,
                    importe = (case when (dp.cantidad-v_productos.cantidadpedido) > 0 
                                then (round(dp.importe - (dp.precio*v_productos.cantidadpedido), 2) )
                          else 0 end)     
                    where dp.idproducto = v_productos.idproducto;
                end loop;
				
				/*Servicios*/
				for v_servicios in (
                        select ni.idindicador, pp.cantidad as cantidadpedido,pp.idproductopedido, pp.precio as preciopedido
                        from mod_datosmaestros.nom_indicador ni
                        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idindicador = ni.idindicador
                        where pp.idpedidotienda = v_pedidostienda.idpedidotienda and pp.tipo = 2
                    ) loop
                        INSERT INTO 
                          mod_logpuntoventa.dat_ventaservicio
                        (
                          idindicador,
                          idventas,
                          cantidad,
                          precio,
                          importetotal
                        )
                        values (v_servicios.idindicador, v_iddocumento, v_servicios.cantidadpedido, v_servicios.preciopedido,
                         round(v_servicios.preciopedido*v_servicios.cantidadpedido,2));
                end loop;				
				/*Fin servicios*/
				
                update mod_logpuntoventa.dat_pedidotienda set estado = 5
                where idpedidotienda = v_pedidostienda.idpedidotienda;
				
				for v_infopago in (
					select t.fragmento from (
							select regexp_split_to_table(v_pedidostienda.infopago, '\n') as fragmento
						) t
					) loop
						select
							array_agg(t.fragmento) into v_lineinfopago from (
								select regexp_split_to_table(v_infopago.fragmento, ';') as fragmento
							) t;
						if v_lineinfopago[4]::numeric = 6 then
							v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocaja = v_lineinfopago[5]::numeric limit 1);
							v_importepago := v_lineinfopago[9]::numeric;
							if v_tipopago is not null then
								INSERT INTO mod_logpuntoventa.dat_desglosepago(
								iddocumento, idformapago, importe)
								VALUES (v_iddocumento, v_tipopago, v_importepago);
							end if;	
						end if;
				end loop;
        end loop;
    ELSE
    --generando comprobante de venta resumen de los pedidos pendientes a procesar
    /*v_idpersona := (
                select vc.idventacliente from mod_logpuntoventa.dat_ventacliente vc 
                where vc.numeroidentidad = '-'
            );*/
    v_cronologia := v_cronologia + 1;   
    v_importe := 0;
    /*if v_idpersona is null then
                
        INSERT INTO 
          mod_logpuntoventa.dat_ventacliente
        (
          numeroidentidad,
          nombre,
          telefono,
          direccion
        )
        VALUES (
          '-',
          '-',
          '-',
          ''
        ) returning idventacliente into v_idpersona;
    end if;*/
    
    with documento AS (INSERT INTO mod_logistica.dat_documento
    (
      iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
      idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion,nrodoc,aprobadopor
    )
    VALUES (
      v_iddoc, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
      v_fechafacturacion,'Comprobante de venta reumen',v_cronologia
      ,1,p_idusuario,4,v_idperiodo.idejercicioactual,
      v_configtienda.idestructuraop, v_idperiodo.idperiodoactual,
      (COALESCE((
        select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
        and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
      ),0)+1),1,v_configtienda.idnomoperaciones,
      (COALESCE((
        select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
        and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_configtienda.idestructuraop
      ),0)+1),p_idusuario
    ) returning iddocumento,iddoc,idejercicio,idestructuracomun,nrodoc),
    venta as (
    INSERT INTO 
        mod_logpuntoventa.dat_ventas
      (
        idventas,
        --idpersona,
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
        idmoneda,
        --importedevuelto,
        --identrega,
        nrofactura
      )
      select iddocumento,
        --v_idpersona,
        v_fechafacturacion,
        0,
        --?idcaja,
        -3,
        p_idareaventa,
        --?efectivo,
        --?cambio,
        --?fechaexpiracion,
        --?nroventa,
        1,
        --?idcierreventa,
        --?tipoventa,
        --?vendedor,
        v_configtienda.idmoneda,
        --?importedevuelto,
        --?identrega,
        nrodoc||'.'||v_codigodeposito||'.'||date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp))
        from documento returning idventas)--,
                    
    /*ventaorden as (
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
        select v_pedidostienda.idreferencia, v_pedidostienda.nropedido,v_pedidostienda.fechapedido,v_pedidostienda.estado, idventas, 2 from venta 
    ),*/
    /*documentopedido as (
        INSERT INTO mod_logpuntoventa.dat_pedidodocumento
        (
          idpedido,iddocumento,tipo
        )
        select v_pedidostienda.idpedidotienda, iddocumento, 4 from documento
    )*/
    INSERT INTO 
        mod_logistica.dat_documentocliente
      (
        iddocumento,idcliente,tipocliente,idcondicionpago
      )
      select iddocumento, v_configtienda.idcliente, 1, v_configtienda.idcondicionpago from documento
      RETURNING iddocumento into v_iddocumento;  
    
    
    for v_productos in (
        select DISTINCT dp.idproducto, dp.precio, dp.cantidad as existencia, sum(pp.cantidad) as cantidadpedido,dp.idumedida, pp.precio as preciopedido,
        dp.idelementogasto, dp.idclasificacioncontable, dp.importe
        from mod_logistica.dat_producto dp
        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idproducto = dp.idproducto
        where pp.idpedidotienda in (
        	select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
            and pd.idpedidodocumento is null
        ) and pp.tipo = 1
		group by dp.idproducto,pp.precio
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
              v_iddocumento,
              v_productos.idproducto,
              v_productos.precio,
              round(v_productos.cantidadpedido*v_productos.precio,2),
              v_productos.cantidadpedido,
              v_cronologia,
              '-',
              v_productos.idumedida,
              v_productos.idelementogasto,
              v_productos.idclasificacioncontable,
              (v_productos.existencia-v_productos.cantidadpedido),
              (case when (v_productos.existencia-v_productos.cantidadpedido) > 0 
                  then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadpedido),2))/(v_productos.existencia-v_productos.cantidadpedido)  
              else 0 end),
              (case when (v_productos.existencia-v_productos.cantidadpedido) > 0 
                    then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadpedido), 2) )
              else 0 end)
            ) returning idmovimiento, preciocontable, idproducto
        ), movmoneda as (
            insert into mod_logistica.dat_movmoneda 
          (
              idmovimiento, idmoneda, precio
          )
          select idmovimiento, v_configtienda.idmoneda, v_productos.preciopedido from movimiento
        )/*, cantidadcomp as (
          INSERT INTO 
            mod_logistica.dat_cantidadcomprometida
          (
            iddocumento,idproducto,idcliente,cantidad,estado
          ) 
          select v_iddocumento,idproducto,v_configtienda.idcliente,v_productos.cantidadpedido,1 from movimiento
          RETURNING iddocumento
        )*/
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
    update mod_logistica.dat_producto as dp
    set cantidad = dp.cantidad - v_productos.cantidadpedido,
    precio = (case when (dp.cantidad-v_productos.cantidadpedido) > 0 
              then (round(dp.importe - (dp.precio*v_productos.cantidadpedido),2))/(dp.cantidad-v_productos.cantidadpedido)  
          else 0 end),
    cronologia = v_cronologia,
    importe = (case when (dp.cantidad-v_productos.cantidadpedido) > 0 
                then (round(dp.importe - (dp.precio*v_productos.cantidadpedido), 2) )
          else 0 end)     
    where dp.idproducto = v_productos.idproducto;
    v_importe = v_importe + (round(v_productos.preciopedido*v_productos.cantidadpedido,2));
end loop;
	
	for v_servicios in (
			select ni.idindicador, sum(pp.cantidad) as cantidadpedido, pp.precio as preciopedido
			from mod_datosmaestros.nom_indicador ni
			inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idindicador = ni.idindicador
			where pp.idpedidotienda in (
        	select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
            and pd.idpedidodocumento is null
        ) and pp.tipo = 2
		group by ni.idindicador,pp.precio
		) loop
			INSERT INTO 
			  mod_logpuntoventa.dat_ventaservicio
			(
			  idindicador,
			  idventas,
			  cantidad,
			  precio,
			  importetotal
			)
			values (v_servicios.idindicador, v_iddocumento, v_servicios.cantidadpedido, v_servicios.preciopedido,
			 round(v_servicios.preciopedido*v_servicios.cantidadpedido,2));
			v_importe = v_importe + (round(v_servicios.preciopedido*v_servicios.cantidadpedido,2));		
	end loop;									
								
	update mod_logpuntoventa.dat_ventas set importe = v_importe where idventas = v_iddocumento;
	
	update mod_logpuntoventa.dat_pedidotienda set estado = 5
    where idpedidotienda in (
    	select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 1
            and pd.idpedidodocumento is null
    );
	
	INSERT INTO mod_logpuntoventa.dat_pedidodocumento
        (
          idpedido,iddocumento,tipo
        )
        select pt.idpedidotienda, v_iddocumento, 4 from mod_logpuntoventa.dat_pedidotienda pt
            left join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pt.fechapedido <= v_fechafacturacion and pt.estado = 5
            and pd.idpedidodocumento is null;
    
	for v_pedidostienda in (
        	select pt.* from mod_logpuntoventa.dat_pedidotienda pt
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda and pd.tipo = 4 
            where pt.idareaventa = p_idareaventa and pd.iddocumento = v_iddocumento
        ) LOOP
		for v_infopago in (
		select t.fragmento from (
				select regexp_split_to_table(v_pedidostienda.infopago, '\n') as fragmento
			) t
		) loop
			select
				array_agg(t.fragmento) into v_lineinfopago from (
					select regexp_split_to_table(v_infopago.fragmento, ';') as fragmento
				) t;
			if v_lineinfopago[4]::numeric = 6 then
				v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocaja = v_lineinfopago[5]::numeric limit 1);
				v_importepago := replace(v_lineinfopago[9], ',','')::numeric;
				if v_tipopago is not null then
					select dp.* into v_existepago from mod_logpuntoventa.dat_desglosepago dp where dp.iddocumento = v_iddocumento
					and dp.idformapago = v_tipopago;
					if v_existepago.idformapago is null then
						INSERT INTO mod_logpuntoventa.dat_desglosepago(
						iddocumento, idformapago, importe)
						VALUES (v_iddocumento, v_tipopago, v_importepago);
					else
						update mod_logpuntoventa.dat_desglosepago as dp
						set importe = dp.importe + v_importepago
						where dp.iddocumento = v_iddocumento
						and dp.idformapago = v_tipopago;
					end if;
				end if;	
			end if;
	end loop;
	end loop;
	
    end if;
    
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidoscaja(numeric, numeric, numeric)
    OWNER TO zeolides;


	
