ALTER TABLE IF EXISTS mod_logtaller.dat_material
  ADD COLUMN IF NOT EXISTS cancelado NUMERIC(25,6) DEFAULT 0;
  
ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividad
  ADD COLUMN IF NOT EXISTS cancelado NUMERIC(25,6) DEFAULT 0;  
  
  
CREATE TABLE IF NOT EXISTS mod_logtaller.dat_ordencancelacion (
  idordentrabajo NUMERIC(19,0) NOT NULL,
  motivo VARCHAR(255),
  idusuario NUMERIC(19,0),
  fecha DATE,
  CONSTRAINT dat_ordencancelacion_pkey PRIMARY KEY(idordentrabajo),
  CONSTRAINT dat_ordencancelacion_fk FOREIGN KEY (idordentrabajo)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_ordencancelacion
  ALTER COLUMN motivo SET STATISTICS 0;

ALTER TABLE mod_logtaller.dat_ordencancelacion
  OWNER TO zeolides;
  
-- FUNCTION: mod_logtaller.f_cancelarorden(numeric, character varying, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logtaller.f_cancelarorden(numeric, character varying, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logtaller.f_cancelarorden(
	p_idorden numeric,
	p_motivo character varying,
	p_idusuario numeric,
	p_tipodev numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_vales record;
  v_tipodev numeric;
  v_iddocdevolucion numeric;
  v_iddocumentodev numeric;
  v_productosdev record;
  v_periodoinvdev record;
  v_fechadev date;
  v_cronologia numeric;
  v_datosdocorigen record;
  v_datosorden record;
  v_idespecialidad numeric;
  v_cantidaddevolver numeric;
  v_estadoorden numeric;
  v_idoperaciondev numeric;
BEGIN
	v_estadoorden := (select d.estado from mod_logistica.dat_documento d where d.iddocumento = p_idorden);
    if v_estadoorden = 2 or v_estadoorden = 9 then
    	select est.idestructuracomun, d.nrodoc into v_datosorden from mod_logistica.dat_documento d 
        inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
        inner join mod_datosmaestros.dat_estructurasubsist est on est.idestructurasubsist = dp.idestructurasubsist
        where d.iddocumento = p_idorden;

        v_iddocdevolucion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'valedev' and des.idestructuracomun = v_datosorden.idestructuracomun limit 1);
        
        v_periodoinvdev = mod_logistica.f_obtenerejercicioactivo(10, v_datosorden.idestructuracomun);            
                    
        
        v_fechadev := (select df.fecha from mod_datosmaestros.dat_fecha df
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
            where des.idsubsistema = 10 and des.idestructuracomun = v_datosorden.idestructuracomun limit 1);
            
        select max(d.cronologia)+1 into v_cronologia from mod_logistica.dat_documento d;    
        
        v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                    where cue.idusuario = p_idusuario limit 1);
		
		v_idoperaciondev := (select CAST(vg.valor as NUMERIC) from mod_logistica.nom_variableglobal vg 
                where vg.nombre = 'OPER_DEV_OT' limit 1);

        CREATE TEMPORARY TABLE tem_productosdevolver (
            iddocumento NUMERIC(19,0),
            idoperacion numeric(19,0),
            iddeposito numeric(19,0),
            idcliente numeric(19,0),
            nrodoc numeric(19,0),
            idmovimiento NUMERIC(19,0),
            idproducto NUMERIC(19,0),
            idunidadmedida NUMERIC(19,0),
            idelementogasto NUMERIC(19,0),
            idclasificacion NUMERIC(19,0),
            preciocontable NUMERIC(25,6),
            devuelto NUMERIC(25,6),
            pendiente NUMERIC(25,6),
            cantidad NUMERIC(25,6)) ON COMMIT DROP;
            insert into tem_productosdevolver(
                iddocumento,
                idoperacion,
                iddeposito,
                idcliente,
                nrodoc,
                idmovimiento,
                idproducto,
                idunidadmedida,
                idelementogasto,
                idclasificacion,
                preciocontable,
                devuelto,
                pendiente,
                cantidad
            )
            (
                select d.iddocumento, d.idoperacion, d.idestructuracomun, dc.idcliente, d.nrodoc, dm.idmovimiento, dm.idproducto, dm.idunidadmedida, 
                dm.idelementogasto, dm.idclasificacion, dm.preciocontable,
                (coalesce(

                (SELECT SUM(m3.cantidad) FROM mod_logistica.dat_movimiento m3 
                                        INNER JOIN mod_logistica.dat_documento d2 ON d2.iddocumento = m3.iddocumento
                                              INNER JOIN mod_logistica.dat_documentopadre dp2 ON d2.iddocumento = dp2.iddocumento 
                                            WHERE d2.estado <> 7 AND d2.iddocumento <> d.iddocumento
                                          and dp2.idpadre = d.iddocumento 
                                          AND m3.idproducto = dm.idproducto)

                ,0))as devuelto,
                (coalesce(
                (SELECT SUM(m3.pendiente) FROM mod_logtaller.dat_material m3 
                                        INNER JOIN mod_logistica.dat_documento d2 ON d2.iddocumento = m3.idordentrabajo 
                                            WHERE d2.iddocumento = dp.idpadre 
                                          AND m3.idproducto = dm.idproducto)
                ,0))as pendiente,
                dm.cantidad
                from mod_logistica.dat_documento d
                inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento
                inner join mod_logistica.dat_documentopadre dp on dp.iddocumento = d.iddocumento
                inner join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = d.iddoc
                inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dpr.iddocumentos
                inner join mod_logistica.dat_movimiento dm on dm.iddocumento = d.iddocumento
                where dp.idpadre = p_idorden and ndp.abreviatura = 'valeLog' and d.estado = 4 
                and coalesce((SELECT (CASE WHEN pcto.iddocumento IS NOT NULL AND sum(pcto.cantidad) > sum(pcto.entregado) 
                            THEN 1 ELSE 0 END) FROM mod_logistica.dat_productocmplto pcto WHERE pcto.iddocumento = d.iddocumento 
                            GROUP BY pcto.iddocumento), 1) = 1
            );
        for v_vales in (
                    select distinct iddocumento, idoperacion, iddeposito, idcliente, nrodoc from tem_productosdevolver
                    group by iddocumento, idoperacion, iddeposito, idcliente, nrodoc
                ) loop
                    INSERT INTO mod_logistica.dat_documento
                    (
                      iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
                      idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion,nrodoc
                    )
                    VALUES (
                      v_iddocdevolucion, date_part('year', CAST(to_char(v_fechadev, 'DD/MM/YYYY HH24:MI') as timestamp)),
                      v_fechadev,'Devolviendo VE #. '||v_vales.nrodoc||'. Cancelando OT #'||v_datosorden.nrodoc
                      ,v_cronologia,1,p_idusuario,4,v_periodoinvdev.idejercicioactual,
                      v_vales.iddeposito, v_periodoinvdev.idperiodoactual,
                      (COALESCE((
                        select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdevolucion
                        and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_vales.iddeposito
                      ),0)+1),v_idespecialidad, v_idoperaciondev, (COALESCE((
                      select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdevolucion
                      and dd.idejercicio = v_periodoinvdev.idejercicioactual and dd.idestructuracomun = v_vales.iddeposito
                    ),0)+1)
                    ) returning iddocumento into v_iddocumentodev;
                    INSERT INTO mod_logistica.dat_documentocliente
                    (
                      iddocumento,idcliente,tipocliente
                    )
                    VALUES (v_iddocumentodev,v_vales.idcliente,2);
                    INSERT INTO 
                      mod_logistica.dat_documentopadre
                    (
                      iddocumento,idpadre
                    )
                    values (v_iddocumentodev, v_vales.iddocumento);
                    
                    for v_productosdev in (
                        select dm.preciocontable, dm.cantidad as cantdev, dm.devuelto, dm.pendiente,dm.idunidadmedida, dp.*, dp.cantidad as existencia 
                        from tem_productosdevolver dm
                        inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                        where dm.iddocumento = v_vales.iddocumento and (dm.cantidad-dm.devuelto) > 0 and dm.pendiente > 0
                    ) loop
                        raise notice 'pendiente %', v_productosdev.pendiente;
                        v_cantidaddevolver := 0;
                        if v_productosdev.cantdev-v_productosdev.devuelto <= v_productosdev.pendiente then
                            v_cantidaddevolver := v_productosdev.cantdev-v_productosdev.devuelto;
                        else
                            v_cantidaddevolver := v_productosdev.pendiente;
                        end if; 
                           
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
                          v_productosdev.preciocontable,
                          round(v_productosdev.preciocontable*v_productosdev.cantdev,2),
                          v_cantidaddevolver,
                          v_cronologia,
                          '+',
                          v_productosdev.idumedida,
                          v_productosdev.idelementogasto,
                          v_productosdev.idclasificacioncontable,
                          (v_productosdev.existencia+v_cantidaddevolver),
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
                    select v_productosdev.idproducto, v_vales.iddocumento, cantidad, cantidad, 0 from movimiento;   
                    
                    update mod_logistica.dat_producto as dp
                    set cantidad = dp.cantidad + v_cantidaddevolver,
                    precio = (round(dp.importe + (v_productosdev.preciocontable*v_cantidaddevolver),2))/(dp.cantidad+v_cantidaddevolver),
                    cronologia = v_cronologia,
                    importe = (round(dp.importe + (v_productosdev.preciocontable*v_cantidaddevolver), 2))     
                    where dp.idproducto = v_productosdev.idproducto;
                    
                    update tem_productosdevolver set pendiente = pendiente - v_cantidaddevolver 
                    where idproducto = v_productosdev.idproducto;
                    
                    update tem_productosdevolver set devuelto = devuelto + v_cantidaddevolver 
                    where idproducto = v_productosdev.idproducto and iddocumento = v_vales.iddocumento;
                    
              end loop;
                    
        end loop;
        
        update mod_logistica.dat_documento d
        set estado = (
        case when 
            coalesce((
                COALESCE((select sum(coalesce(m.facturado,0))+sum(coalesce(m.enproceso,0)) from mod_logtaller.dat_material m where m.idordentrabajo = p_idorden),0) + 
                coalesce((select sum(coalesce(oa.facturado,0))+sum(coalesce(oa.enproceso,0)) from mod_logtaller.dat_ordenactividad oa where oa.idordentrabajo = p_idorden),0)
                ),0) > 0
        then 17
        else 
            6
        end)
        where d.iddocumento = p_idorden;
        
        update mod_logtaller.dat_material m set cancelado = pendiente, pendiente = 0 where m.idordentrabajo = p_idorden;
        update mod_logtaller.dat_ordenactividad oa set cancelado = pendiente, pendiente = 0 where oa.idordentrabajo = p_idorden;
        
        insert into mod_logtaller.dat_ordencancelacion(idordentrabajo, motivo, idusuario, fecha)
        values (p_idorden, p_motivo, p_idusuario, now());
    end if;
END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_cancelarorden(numeric, character varying, numeric, numeric)
    OWNER TO zeolides;
