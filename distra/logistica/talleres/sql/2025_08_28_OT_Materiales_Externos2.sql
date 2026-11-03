CREATE TABLE mod_logtaller.conf_materialterceros (
  idestructuracomun NUMERIC(19,0) NOT NULL,
  iddepositoentrada NUMERIC(19,0) NOT NULL,
  idoperacionentrada NUMERIC(19,0) NOT NULL,
  idoperacionsalida NUMERIC(19,0) NOT NULL,
  PRIMARY KEY(idestructuracomun)
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.conf_materialterceros
  ALTER COLUMN idestructuracomun SET STATISTICS 0;
  
  
CREATE OR REPLACE FUNCTION mod_logtaller.fn_procesarordentrabajo (
  p_idordentrabajo numeric,
  p_idusuario numeric
)
RETURNS mod_logtaller.td_respuestaprocesarorden AS
$body$
DECLARE
  v_respuesta mod_logtaller.td_respuestaprocesarorden;
  v_iddocdistribucion numeric;
  v_iddoctransferencia numeric;
  v_iddocrecepcion numeric;
  v_iddocumentodistribucion numeric;
  v_iddocumentovale numeric;
  v_transferencia record;
  v_iddocumentorecepcion numeric;
  v_iddocvaleentrega numeric;
  v_idespecialidad numeric;
  v_idperiodoorigen record;
  v_idperiododestino record;
  v_datosorden record;	
  v_entidades record; 
  v_fechainventarioorigen date;
  v_fechainventariodestino date;
  v_idoperaciontransferencia numeric;
  v_idoperacionrecepcion numeric;
  v_idoperacionvale numeric;
  v_depositosdistribucion record;
  v_producto record;
  v_productotransf record;
  v_cronologia numeric;
  v_iddepositorecepcion numeric;
  v_datosproducto record;
  v_idproductorecep numeric;
  v_idmovrecep numeric;
  v_cantidadrecep numeric;
  ids_documentos numeric[] := '{}';
BEGIN
  select max(d.cronologia) into v_cronologia from mod_logistica.dat_documento d;
  
  v_idoperaciontransferencia := (select CAST(vg.valor as NUMERIC) from mod_logistica.nom_variableglobal vg 
            where vg.nombre = 'OPRE_TRANS_OT' limit 1);	
  
  select dd.*, cl.idcliente as idcentrocosto into v_datosorden from mod_logistica.dat_documento dd
  inner join mod_logistica.dat_documentocliente cl on cl.iddocumento = dd.iddocumento and cl.tipocliente = 2
    where dd.iddocumento = p_idordentrabajo;
  v_idperiododestino = mod_logistica.f_obtenerejercicioactivo(10, v_datosorden.idestructuracomun);
  
  v_idoperacionvale := (select oe.idoperacionsalida from mod_logtaller.conf_materialterceros oe 
            where oe.idestructuracomun = v_datosorden.idestructuracomun limit 1);
            
  v_iddepositorecepcion := (select de.iddepositoentrada from mod_logtaller.conf_materialterceros de 
            where de.idestructuracomun = v_datosorden.idestructuracomun limit 1);
            
  v_idoperacionrecepcion := (select ore.idoperacionentrada from mod_logtaller.conf_materialterceros ore 
            where ore.idestructuracomun = v_datosorden.idestructuracomun limit 1);
  
  v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
  
  v_fechainventariodestino := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 10 and des.idestructuracomun = v_datosorden.idestructuracomun limit 1);
        
  v_iddocrecepcion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'recepcionLog' and des.idestructuracomun = v_datosorden.idestructuracomun limit 1);
    
  v_iddocvaleentrega := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'valeLog' and des.idestructuracomun = v_datosorden.idestructuracomun limit 1);

  for v_entidades in (
      select DISTINCT dm.idestructuracomun from mod_logtaller.dat_material dm 
      where dm.idordentrabajo = p_idordentrabajo and dm.transferido = 0 and dm.idestructuracomun <> v_datosorden.idestructuracomun
  ) loop
  		v_idperiodoorigen = mod_logistica.f_obtenerejercicioactivo(10, v_entidades.idestructuracomun);
        
        v_fechainventarioorigen := (select df.fecha from mod_datosmaestros.dat_fecha df
          inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
          where des.idsubsistema = 10 and des.idestructuracomun = v_entidades.idestructuracomun limit 1);
          
        v_iddocdistribucion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
          inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
          inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
          where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = v_entidades.idestructuracomun limit 1);
          
        v_iddoctransferencia := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
          inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
          inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
          where ndp.abreviatura = 'transferenciaLog' and des.idestructuracomun = v_entidades.idestructuracomun limit 1);
          
        --Insertando distribucion para transferencia
        
        INSERT INTO mod_logistica.dat_documento
          (
            iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
            idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor
          )
          VALUES (
            v_iddocdistribucion, date_part('year', CAST(to_char(v_fechainventarioorigen, 'DD/MM/YYYY HH24:MI') as timestamp)),
            v_fechainventarioorigen,'Distribucion para transferir materiales a la OT '|| v_datosorden.nrodoc,0,1,p_idusuario,3,v_idperiodoorigen.idejercicioactual,
            v_entidades.idestructuracomun, v_idperiodoorigen.idperiodoactual,
            (COALESCE((
              select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
              and dd.idejercicio = v_idperiodoorigen.idejercicioactual and dd.idestructuracomun = v_entidades.idestructuracomun
            ),0)+1),1,(COALESCE((
              select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
              and dd.idejercicio = v_idperiodoorigen.idejercicioactual and dd.idestructuracomun = v_entidades.idestructuracomun
            ),0)+1),p_idusuario
          ) returning iddocumento into v_iddocumentodistribucion;
          INSERT INTO mod_logdistribucion.dat_distribucion
          (
            iddistribucion,idestructuraop,tipodestino,tipodistribucion,salidaporfactura
          )
          VALUES (v_iddocumentodistribucion,v_entidades.idestructuracomun,3,3,0);
          INSERT INTO mod_logistica.dat_documentocliente
          (
            iddocumento,idcliente,tipocliente,idestructura
          )
          VALUES (v_iddocumentodistribucion,v_datosorden.idestructuracomun,3,v_datosorden.idestructuracomun);
          --insertando productos de la distribucion
          with prodorden AS (INSERT INTO 
            mod_logdistribucion.dat_prodorden
          (
            idproducto,idcliente,cantidad,idorden
          )
          (
          select DISTINCT dm.idproductoentidad, v_datosorden.idestructuracomun,dm.cantidad,v_iddocumentodistribucion
              from mod_logtaller.dat_material dm
              where dm.idordentrabajo = p_idordentrabajo and dm.transferido = 0 and dm.idestructuracomun = v_entidades.idestructuracomun
          --group by pp.idproducto
          ) RETURNING idprodorden, cantidad, idproducto)
          INSERT INTO 
            mod_logdistribucion.dat_prodordencmpto
          (
            idprodorden,enproceso,entregado,pendiente,cantidadoriginal
          )
          select idprodorden,0, cantidad,0,cantidad from prodorden;
          
          
            
          --insertando transferencia
          for v_depositosdistribucion in (
              select DISTINCT dm.iddeposito from mod_logtaller.dat_material dm 
              where dm.idordentrabajo = p_idordentrabajo and dm.transferido = 0 and dm.idestructuracomun = v_entidades.idestructuracomun
          ) loop
               v_cronologia := v_cronologia + 1;
                INSERT INTO mod_logistica.dat_documento
              (
                iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                idestructuracomun,idperiodo,numeroref,idespecialidad,nrodoc,aprobadopor, idoperacion
              )
              VALUES (
                v_iddoctransferencia, date_part('year', CAST(to_char(v_fechainventarioorigen, 'DD/MM/YYYY HH24:MI') as timestamp)),
                v_fechainventarioorigen,'Transferencia para materiales a la OT '|| v_datosorden.nrodoc,v_cronologia,1,p_idusuario,4,v_idperiodoorigen.idejercicioactual,
                v_depositosdistribucion.iddeposito, v_idperiodoorigen.idperiodoactual,
                (COALESCE((
                  select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoctransferencia
                  and dd.idejercicio = v_idperiodoorigen.idejercicioactual and dd.idestructuracomun = v_depositosdistribucion.iddeposito
                ),0)+1),1,(COALESCE((
                  select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoctransferencia
                  and dd.idejercicio = v_idperiodoorigen.idejercicioactual and dd.idestructuracomun = v_depositosdistribucion.iddeposito
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
                VALUES (v_transferencia.iddocumento,v_datosorden.idestructuracomun,3);
                
                INSERT INTO 
                  mod_logistica.dat_documentopadre
                (
                  iddocumento,idpadre
                )
                values (v_transferencia.iddocumento, v_iddocumentodistribucion); 
              --insertando productos de la distribucion
              for v_producto in (
                  select dpo.cantidad, dpo.idproducto, dp.precio, dp.cantidad as existencia, dp.importe,
                  dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable
                   from mod_logdistribucion.dat_prodorden dpo
                  inner join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
                  where dpo.idorden = v_iddocumentodistribucion and dp.idestructura = v_depositosdistribucion.iddeposito
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
              
              --insertando recepcion de la transferencia
              v_cronologia := v_cronologia + 1;
              INSERT INTO mod_logistica.dat_documento
              (
                iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                idestructuracomun,idperiodo,nrodoc,numeroref,idespecialidad,idoperacion,aprobadopor
              )
              VALUES (
                v_iddocrecepcion, date_part('year', CAST(to_char(v_fechainventariodestino, 'DD/MM/YYYY HH24:MI') as timestamp)),
                v_fechainventariodestino,'Recepcion generada para materiales de OT '||v_datosorden.nrodoc,v_cronologia,1,p_idusuario,4,v_idperiododestino.idejercicioactual,
                v_iddepositorecepcion, v_idperiododestino.idperiodoactual,
                (COALESCE((
                  select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocrecepcion
                  and dd.idejercicio = v_idperiododestino.idejercicioactual and dd.idestructuracomun = v_iddepositorecepcion
                ),0)+1),
                (COALESCE((
                  select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocrecepcion
                  and dd.idejercicio = v_idperiododestino.idejercicioactual and dd.idestructuracomun = v_iddepositorecepcion
                ),0)+1),v_idespecialidad, v_idoperacionrecepcion, p_idusuario
              ) returning iddocumento into v_iddocumentorecepcion;
              INSERT INTO 
                mod_loginventario.dat_recepcion
              (
                iddocumento,nrodocorigen,fechadocorigen
              )
              VALUES (
                v_iddocumentorecepcion, v_transferencia.nrodoc, v_fechainventariodestino
              );
              INSERT INTO mod_logistica.dat_documentocliente
              (
                iddocumento,idcliente,tipocliente
              )
              VALUES (v_iddocumentorecepcion,v_entidades.idestructuracomun,3);
              INSERT INTO 
                mod_logistica.dat_documentopadre
              (
                iddocumento,idpadre
              )
              values (v_iddocumentorecepcion, v_transferencia.iddocumento);
              --productos de la recepcion
              for v_productotransf in (
                  select dm.preciocontable, dm.cantidad,dm.idunidadmedida, dp.*
                  from mod_logistica.dat_movimiento dm
                  inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                  where dm.iddocumento = v_transferencia.iddocumento
              ) loop
                  --buscar indicador para crear tarjeta si no existe
                  select dpd.* into v_datosproducto from mod_logistica.dat_producto dpd
                  where dpd.idestructura = v_iddepositorecepcion and dpd.idindicador = v_productotransf.idindicador;
                  --insertar movimientos de la recepcion
                  if v_datosproducto.idproducto is not null then
                      v_idproductorecep := v_datosproducto.idproducto;
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
                          v_iddocumentorecepcion,
                          v_datosproducto.idproducto,
                          v_productotransf.preciocontable,
                          round(v_productotransf.preciocontable*v_productotransf.cantidad,2),
                          v_productotransf.cantidad,
                          v_cronologia,
                          '+',
                          v_datosproducto.idumedida,
                          v_datosproducto.idelementogasto,
                          v_datosproducto.idclasificacioncontable,
                          (v_datosproducto.cantidad+v_productotransf.cantidad),
                          (case when (v_datosproducto.cantidad+v_productotransf.cantidad) > 0 
                              then (round(v_datosproducto.importe + (v_productotransf.preciocontable*v_productotransf.cantidad),2))/(v_datosproducto.cantidad+v_productotransf.cantidad)  
                          else 0 end),
                          (case when (v_datosproducto.cantidad+v_productotransf.cantidad) > 0 
                                then (round(v_datosproducto.importe + (v_productotransf.preciocontable*v_productotransf.cantidad), 2) )
                          else 0 end)
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
                    INSERT INTO mod_logistica.dat_producto (
                      idestructura, idumedida, idindicador, idclasificacioncontable,
                      cronologia, cantidad, importe, precio, idestructuracomun,
                      idmarca, idmodelo, idelementogasto
                    )
                    VALUES (
                      v_iddepositorecepcion, v_productotransf.idunidadmedida, v_productotransf.idindicador,
                      v_productotransf.idclasificacioncontable, v_cronologia, v_productotransf.cantidad, round(v_productotransf.cantidad*v_productotransf.preciocontable, 2),
                      (round((v_productotransf.preciocontable*v_productotransf.cantidad),2))/(v_productotransf.cantidad),
                      v_datosorden.idestructuracomun, v_productotransf.idmarca,
                      v_productotransf.idmodelo, v_productotransf.idelementogasto
                    )
                    RETURNING idproducto INTO v_idproductorecep;
                    
                    INSERT INTO mod_logistica.dat_movimiento (
                      iddocumento, idproducto, preciocontable, importecontable,
                      cantidad, cronologia, signo, idunidadmedida,
                      idelementogasto, idclasificacion, existenciaactual,
                      preciopromedio,importetotal
                    )
                    VALUES (
                      v_iddocumentorecepcion, v_idproductorecep, v_productotransf.preciocontable, round(v_productotransf.cantidad*v_productotransf.preciocontable, 2),
                      v_productotransf.cantidad, v_cronologia, '+',
                      v_datosproducto.idumedida, v_datosproducto.idelementogasto,
                      v_datosproducto.idclasificacioncontable, v_productotransf.cantidad, 
                      (round((v_productotransf.preciocontable*v_productotransf.cantidad),2))/(v_productotransf.cantidad),
                      round(v_productotransf.cantidad*v_productotransf.preciocontable, 2)
                    )
                    RETURNING idmovimiento, cantidad INTO v_idmovrecep, v_cantidadrecep;
                    
                    INSERT INTO mod_loginventario.dat_movrecepcion (
                      idmovimiento, cantidad
                    )
                    VALUES (
                      v_idmovrecep, v_cantidadrecep
                    );
                  end if;
                  update mod_logtaller.dat_material as m set transferido = 1, idproducto = v_idproductorecep, iddeposito = v_iddepositorecepcion
                  where m.idproductoentidad = v_productotransf.idproducto and m.idordentrabajo = v_datosorden.iddocumento; 
              end loop;
              ids_documentos := array_append(ids_documentos, v_iddocumentorecepcion);
          end loop;
  end loop;
  --insertando vale de salida
  v_cronologia := v_cronologia + 1;
  with valesalida as (INSERT INTO mod_logistica.dat_documento
    (
      iddoc,anno,fechacontable,observaciones,cronologia,idusuario,estado,idejercicio,
      idestructuracomun,idperiodo,numeroref,nrodoc,idespecialidad,
      idoperacion,aprobadopor,idbloqueousuario
    )
    VALUES (
      v_iddocvaleentrega, date_part('year', CAST(to_char(v_fechainventariodestino, 'DD/MM/YYYY HH24:MI') as timestamp)),
      v_fechainventariodestino,'Documento generado a partir de la OT #'||v_datosorden.nrodoc||' con fecha '||v_datosorden.fechacontable||'.',
      v_cronologia,p_idusuario,4,v_idperiododestino.idejercicioactual,v_iddepositorecepcion, v_idperiododestino.idperiodoactual,
      (COALESCE((
        select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocvaleentrega
        and dd.idejercicio = v_idperiododestino.idejercicioactual and dd.idestructuracomun = v_iddepositorecepcion
      ),0)+1),
      (COALESCE((
        select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocvaleentrega
        and dd.idejercicio = v_idperiododestino.idejercicioactual and dd.idestructuracomun = v_iddepositorecepcion
      ),0)+1),v_idespecialidad,v_idoperacionvale,p_idusuario,p_idusuario

    ) returning iddocumento,iddoc,idejercicio,observaciones),
    entrega as (INSERT INTO 
        mod_logistica.dat_entrega
      (
        iddocumento,observacion,origen
      )
      select iddocumento, observaciones,4 from valesalida
      returning iddocumento),
    documentoclientevale as (INSERT INTO
        mod_logistica.dat_documentocliente
      (
        iddocumento,idcliente,tipocliente
      )
      select iddocumento, v_datosorden.idcentrocosto,2 from valesalida
      returning iddocumento)  
              
    INSERT INTO 
      mod_logistica.dat_documentopadre
    (
      iddocumento,idpadre
    )
    select iddocumento, v_datosorden.iddocumento from valesalida
    returning iddocumento into v_iddocumentovale;
    
    --insertando productos al vale
    for v_producto in (
        select sum(dm.cantidad) as cantidad, dm.idproducto, dp.precio, dp.cantidad as existencia, dp.importe,
        dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable
         from mod_logistica.dat_movimiento dm
        inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
        where dm.iddocumento in (SELECT unnest(ids_documentos))
        group by dm.idproducto, dp.precio, dp.cantidad, dp.importe,
        dp.idumedida, dp.idelementogasto, dp.idclasificacioncontable
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
              v_iddocumentovale,
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
        select idmovimiento, cantidad, cantidad, v_iddocumentovale from movimiento;   
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
  v_respuesta.codmsg = 1;
  v_respuesta.msg = 'ok';
  return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logtaller.fn_procesarordentrabajo (p_idordentrabajo numeric, p_idusuario numeric)
  OWNER TO postgres;