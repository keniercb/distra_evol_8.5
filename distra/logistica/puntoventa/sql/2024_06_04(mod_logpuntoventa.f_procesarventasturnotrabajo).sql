CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarventasturnotrabajo (
  p_idturnotrabajo numeric,
  p_idestructuraop numeric,
  p_idestructuracomun numeric,
  p_idusuario numeric
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
  v_producto numeric; 
  v_idproducto numeric; 
  v_idpersona numeric;
  v_datospersona record;
  v_productos record;
  v_operacionesturno record;
  v_cronologia numeric;
  v_codigodeposito varchar;
  v_importe numeric;
  v_tipoventa numeric;
  v_infopago record;
  v_lineinfopago varchar[];
  v_tipopago numeric;
  v_importepago numeric;
BEGIN
    CREATE TEMPORARY TABLE tem_ventasprocesar(
      idventacombustible NUMERIC(19,0)) ON COMMIT DROP;
      
	CREATE TEMPORARY TABLE tem_productossinexistencia(
      idproducto NUMERIC(19,0)) ON COMMIT DROP; v_iddoc :=(
    select ddp.iddoc
    from mod_datosmaestros.dat_documentoprim ddp
         inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
         inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'compventaLog' and
          des.idestructuracomun = p_idestructuracomun
    limit 1);
    
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(13, p_idestructuracomun);            
                
    select da.* into v_configtienda from mod_logpuntoventa.dat_areaventa da where da.idestructuracomun = p_idestructuracomun and da.idestructuraop = p_idestructuraop limit 1;
    
    v_codigodeposito := (select est.codigo from mod_estructuracomp.v_dametodasestructuras est where est.idestructura = v_configtienda.idestructuraop);
    
    v_fechafacturacion := (select da.fecha from mod_logistica.dat_estadoalmacen da where da.iddeposito = v_configtienda.idestructuraop limit 1);
    if v_fechafacturacion is null then
    	v_fechafacturacion := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 13 and des.idestructuracomun = p_idestructuracomun limit 1);
    end if;
     --insertando ventas que tienen los productos con existencias a procesar
     insert into tem_productossinexistencia(idproducto) (
               select distinct pp.idproducto
               from mod_logcombustible.dat_ventacombustible pp
               where pp.idventacombustible in (
                          select dvc.idventacombustible
                          from mod_logcombustible.dat_ventacombustible dvc
                               inner join mod_logcombustible.dat_turnotrabajo dtt on dtt.idturnotrabajo = dvc.idturnotrabajo
                          where dtt.idestructuraop = p_idestructuraop 
                          /*and dtt.fechacreacion <= v_fechafacturacion*/
                          and dvc.idturnotrabajo = p_idturnotrabajo and dvc.idestado = 1
                     )
               group by pp.idproducto
               having sum(pp.cantidadlitros) >
                      (
                        select dp.cantidad
                        from mod_logistica.dat_producto dp
                        where dp.idproducto = pp.idproducto
                      )
                  );
    insert into tem_ventasprocesar(idventacombustible) (
                  select 
                  dvc.idventacombustible
                  from mod_logcombustible.dat_ventacombustible dvc
                  inner join mod_logcombustible.dat_turnotrabajo dtt on dtt.idturnotrabajo = dvc.idturnotrabajo
                  where dvc.idestado = 1 /*and dtt.fechacreacion <= v_fechafacturacion*/
                  and dtt.idestructuraop = p_idestructuraop and
                  dvc.idventacombustible not in (
                         select distinct pt1.idventacombustible
                         from mod_logcombustible.dat_ventacombustible pt1
                              inner join mod_logcombustible.dat_turnotrabajo pp1 on
                                pp1.idturnotrabajo = pt1.idturnotrabajo
                         where pt1.idturnotrabajo = p_idturnotrabajo and pt1.idestado = 1 
                         /*and pp1.fechacreacion <= v_fechafacturacion*/ and                                                                                           pt1.idestado = 1 and
                         pt1.idproducto in (
                             select tp.idproducto
                             from tem_productossinexistencia tp
                         )
                      )
                  );              
     
    --generando comprobante de venta de las operaciones de venta del cliente
    select max(d.cronologia) into v_cronologia from mod_logistica.dat_documento d;
    if v_configtienda.tipoventa = 1 then 
    	for v_operacionesturno in (
         select distinct vc.idcliente, tt.idestructuraop, tt.nrodoc
          from mod_logcombustible.dat_ventacombustible vc
          inner join tem_ventasprocesar vp on vp.idventacombustible = vc.idventacombustible
          left join mod_logcombustible.dat_turnotrabajo tt on tt.idturnotrabajo = vc.idturnotrabajo
          where tt.idestructuraop = p_idestructuraop and vc.idproducto is not null
        ) LOOP
        	v_cronologia := v_cronologia + 1;
            with documento AS (INSERT INTO mod_logistica.dat_documento
                (
                  iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                  idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion,nrodoc,aprobadopor
                )
                VALUES (
                  v_iddoc, date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp)),
                  v_fechafacturacion,'Factura generada automaticamente: Turno de trabajo '||v_operacionesturno.nrodoc,v_cronologia
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
                    --?v_idpersona,
                    v_fechafacturacion,
                    
                    (select sum(vc.importeoperacion) from mod_logcombustible.dat_ventacombustible vc 
                    where vc.idcliente = v_operacionesturno.idcliente and vc.idturnotrabajo = p_idturnotrabajo),                    
                    --?idtipocaja,
                    v_configtienda.idmodopago,
                    v_configtienda.idareaventa,
                    --?efectivo,
                    --?cambio,
                    --?fechaexpiracion,
                    --nroventa,
                    1,
                    --?idcierreventa,
                    --?tipoventa,
                    --?vendedor,
                    v_configtienda.idmoneda,
                    --?importedevuelto,
                    --?identrega,
                    nrodoc||'.'||v_codigodeposito||'.'||date_part('year', CAST(to_char(v_fechafacturacion, 'DD/MM/YYYY HH24:MI') as timestamp))
                    from documento returning idventas)
               
                INSERT INTO 
                    mod_logistica.dat_documentocliente
                  (
                    iddocumento,idcliente,tipocliente,idcondicionpago
                  )
                  select iddocumento, v_operacionesturno.idcliente, 1, v_configtienda.idcondicionpago 
                  from documento RETURNING iddocumento 
                  into v_iddocumento;  
                
                for v_productos in (
                        /*select dp.precio, 
                        dp.cantidad as existencia, 
                        v.cantidadlitros as cantidadlitros,
                        dp.idumedida, 
                        dp.*, 
                        v.idproducto as idproductoventa, 
                        v.precioservicio as preciooperacion
                        from mod_logistica.dat_producto dp
                        inner join mod_logcombustible.dat_ventacombustible v on v.idproducto = dp.idproducto
                        where v.idcliente = v_operacionesturno.idcliente and v.idturnotrabajo = p_idturnotrabajo*/
                         select distinct dp.precio,
                        dp.cantidad as existencia, 
                        sum(v.cantidadlitros) as cantidadlitros,
                        v.idcliente,
                        dp.idumedida, 
                        dp.idproducto,
                        dp.idelementogasto,
                        dp.importe,
                        dp.idclasificacioncontable,
                        v.idproducto as idproductoventa, 
                        v.precioservicio as preciooperacion
                        from mod_logistica.dat_producto dp
                        inner join mod_logcombustible.dat_ventacombustible v on v.idproducto = dp.idproducto
                        where v.idcliente = v_operacionesturno.idcliente and v.idturnotrabajo = p_idturnotrabajo 
                        group by v.idcliente, v.idproducto, dp.cantidad,  dp.idproducto, dp.idumedida, v.precioservicio) 
                  loop
                    
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
                              round(v_productos.cantidadlitros*v_productos.precio,2),
                              v_productos.cantidadlitros,
                              v_cronologia,
                              '-',
                              v_productos.idumedida,
                              v_productos.idelementogasto,
                              v_productos.idclasificacioncontable,
                              (v_productos.existencia-v_productos.cantidadlitros),
                              (case when (v_productos.existencia-v_productos.cantidadlitros) > 0 
                                  then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadlitros),2))/(v_productos.existencia-v_productos.cantidadlitros)  
                              else 0 end),
                              (case when (v_productos.existencia-v_productos.cantidadlitros) > 0 
                                    then (round(v_productos.importe - (v_productos.precio*v_productos.cantidadlitros), 2) )
                              else 0 end)
                            ) returning idmovimiento, preciocontable, idproducto
                        ), movmoneda as (
                            insert into mod_logistica.dat_movmoneda 
                          (
                              idmovimiento, idmoneda, precio
                          )
                          select idmovimiento, v_configtienda.idmoneda, v_productos.preciooperacion from movimiento
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
                        select idproducto, 
                                v_iddocumento, 
                                v_productos.cantidadlitros, v_productos.preciooperacion,
                                round(v_productos.preciooperacion*v_productos.cantidadlitros,2) 
                        from movimiento;
                    update mod_logistica.dat_producto as dp
                    set cantidad = dp.cantidad - v_productos.cantidadlitros,
                    precio = (case when (dp.cantidad-v_productos.cantidadlitros) > 0 
                              then (round(dp.importe - (dp.precio*v_productos.cantidadlitros),2))/(dp.cantidad-v_productos.cantidadlitros)  
                          else 0 end),
                    cronologia = v_cronologia,
                    importe = (case when (dp.cantidad-v_productos.cantidadlitros) > 0 
                                then (round(dp.importe - (dp.precio*v_productos.cantidadlitros), 2) )
                          else 0 end)     
                    where dp.idproducto = v_productos.idproducto;
                end loop;
                
                update mod_logcombustible.dat_ventacombustible
                set idestado = 2
                where idcliente = v_operacionesturno.idcliente and idturnotrabajo = p_idturnotrabajo;						
        end loop;
    end if;    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_procesarventasturnotrabajo (p_idturnotrabajo numeric, p_idestructuraop numeric, p_idestructuracomun numeric, p_idusuario numeric)
  OWNER TO zeolides;