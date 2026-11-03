CREATE OR REPLACE FUNCTION mod_loginventario.f_generarajustescero (
  p_idestructura numeric,
  p_iddeposito numeric,
  p_idusuario numeric,
  p_iddocs varchar
)
RETURNS void AS
$body$
DECLARE
  v_producto record;
  v_idespecialidad numeric;
  v_idperiodo record;
  v_iddoc numeric;
  v_iddocumentopos numeric;
  v_iddocumentoneg numeric;
  v_idproducto numeric;
  v_fecha date;
  v_negativo numeric;
  v_positivo numeric;
  v_operacionresta numeric;
  v_operacionsuma numeric;
BEGIN
	v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                    where cue.idusuario = p_idusuario limit 1);
    
    v_operacionresta := (select vg.valor from mod_logistica.nom_variableglobal vg 
                    where vg.nombre = 'OPER_AJUSTECERO_RESTA' limit 1);
    
    v_operacionsuma := (select vg.valor from mod_logistica.nom_variableglobal vg 
                    where vg.nombre = 'OPER_AJUSTECERO_SUMA' limit 1);                
        
    if v_operacionresta is not null and v_operacionsuma is not null then
    	v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, p_idestructura);
    
        v_negativo = 0;
        v_positivo = 0;

        v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'ajusteLog' and des.idestructuracomun = p_idestructura limit 1);
        
        v_fecha := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 10 and des.idestructuracomun = p_idestructura limit 1);
              	        
            raise notice 'iddoc ,%', v_iddoc;
            --generando ajuste con productos negativos      
            INSERT INTO 
              mod_logistica.dat_documento
            (
              iddoc,
              anno,
              fechacontable,
              observaciones,
              cronologia,
              version,
              idusuario,
              idoperacion,
              estado,
              idejercicio,
              idestructuracomun,
              idperiodo,
              numeroref,
              idespecialidad
            )
            VALUES (
              v_iddoc,
              date_part('year', CAST(to_char(v_fecha, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fecha,
              'AJUSTE A CERO',
              0,
              1,
              p_idusuario,
              v_operacionsuma,
              1,
              v_idperiodo.idejercicioactual,
              p_iddeposito,
              v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_iddeposito
              ),0)+1),
              v_idespecialidad
            ) returning iddocumento into v_iddocumentoneg;
            INSERT INTO 
              mod_loginventario.dat_ajuste
            (
              idajuste,
              version,
              idoperacion
            )
            VALUES (
              v_iddocumentoneg,
              1,
              v_operacionsuma
            );
            --generando ajuste con productos positivos      
            INSERT INTO 
              mod_logistica.dat_documento
            (
              iddoc,
              anno,
              fechacontable,
              observaciones,
              cronologia,
              version,
              idusuario,
              idoperacion,
              estado,
              idejercicio,
              idestructuracomun,
              idperiodo,
              numeroref,
              idespecialidad
            )
            VALUES (
              v_iddoc,
              date_part('year', CAST(to_char(v_fecha, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fecha,
              'AJUSTE A CERO',
              0,
              1,
              p_idusuario,
              v_operacionresta,
              1,
              v_idperiodo.idejercicioactual,
              p_iddeposito,
              v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoc
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = p_iddeposito
              ),0)+1),
              v_idespecialidad
            ) returning iddocumento into v_iddocumentopos;
            INSERT INTO 
              mod_loginventario.dat_ajuste
            (
              idajuste,
              version,
              idoperacion
            )
            VALUES (
              v_iddocumentopos,
              1,
              v_operacionresta
            );
            
            CREATE TEMPORARY TABLE tem_movimientosaux (
            iddeposito numeric(19,0),
            deposito VARCHAR,
            idproducto numeric(19,0),
            producto VARCHAR,
            idmovimiento numeric(19,0),
            cronologia numeric,
            cronologiaprod numeric,
            fechacontable date,
            estado numeric(1,0),
            tipodocumento VARCHAR,
            iddoc numeric(19,0),
            idnaturaleza numeric(19,0),
            naturaleza VARCHAR,
            idclasificacion numeric(19,0),
            clasificacioncontable VARCHAR,
            signo VARCHAR,
            importe numeric(25,2),
            importealt numeric(25,2),
            importetotal numeric(25,2),
            importetotalalt numeric(25,2),
            entidad VARCHAR,
            identidad numeric(19,0),
            logo VARCHAR) ON COMMIT DROP;
                insert into tem_movimientosaux(
                idmovimiento,
                iddeposito,
                idproducto,
                cronologia,
                cronologiaprod,
                fechacontable,
                estado,
                tipodocumento,
                iddoc,
                signo,
                importe,
                importealt,
                importetotal,
                importetotalalt
                )
                (SELECT distinct mm.idmovimiento, alm.idestructura AS iddeposito,
                 mm.idproducto,
                 dd.cronologia,
                 dp.cronologia AS cronologiaprod,
                 dd.fechacontable,
                 dd.estado,
                 ndp.abreviatura AS tipodocumento,
                 dd.iddoc,
                 mm.signo,
                 coalesce(mm.importecontable,0) AS importe,
                 coalesce(mm.importealternativo,0) AS importealt,
                 mm.importetotal,
                 mm.importetotalalt
          FROM mod_logistica.dat_movimiento mm
               JOIN mod_logistica.dat_producto dp ON mm.idproducto = dp.idproducto
               JOIN mod_logistica.dat_documento dd ON mm.iddocumento = dd.iddocumento
               JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc
               JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
               JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist
               JOIN mod_estructuracomp.v_dametodasestructuras ent ON ent.idestructura = des.idestructuracomun
               JOIN mod_estructuracomp.v_dametodasestructuras alm ON alm.idestructura = dp.idestructura
               JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
          WHERE dd.estado in (3, 4) AND
                ndp.abreviatura in ('aperturaLog', 'recepcionLog', 'valedev', 'ajusteLog', 'compdevLog', 'facturaLog', 'valeLog'
                  , 'transferenciaLog', 'compventaLog') AND
                dd.cronologia > 0 AND
                dp.cronologia > 0 and ent.idestructura = p_idestructura
                and alm.idestructura = p_iddeposito and dd.iddoc = ANY(CAST(p_iddocs as NUMERIC[])));
                  
            for v_producto in 
                  
            select p.idproducto, p.idumedida, p.idelementogasto, p.idclasificacioncontable,
            (
            coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosaux mm  
            WHERE mm.idproducto = p.idproducto 
            --AND mm.fechacontable <= p_fecha
            AND mm.estado in (3,4) and mm.signo = '+'),2),0)
            -coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosaux mm 
            WHERE mm.idproducto = p.idproducto 
            --AND (mm.fechacontable <= p_fechafin OR p_fechafin is null)
            AND mm.estado in (3,4) and mm.signo = '-'),2),0)
            -round(COALESCE(p.precio*p.cantidad,0), 2)) as diferencia 
            FROM mod_logistica.dat_producto p
             WHERE p.cronologia > 0 AND p.idestructuracomun = p_idestructura AND p.idestructura = p_iddeposito 
             and p.cantidad = 0 and (
            coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosaux mm  
            WHERE mm.idproducto = p.idproducto 
            --AND mm.fechacontable <= p_fecha
            AND mm.estado in (3,4) and mm.signo = '+'),2),0)
            -coalesce(round((select sum(coalesce(mm.importe,0)+coalesce(round(mm.importealt,2),0)) FROM tem_movimientosaux mm 
            WHERE mm.idproducto = p.idproducto 
            --AND (mm.fechacontable <= p_fechafin OR p_fechafin is null)
            AND mm.estado in (3,4) and mm.signo = '-'),2),0)
            -round(COALESCE(p.precio*p.cantidad,0), 2)) <> 0
                  
            loop
                if v_producto.diferencia < 0 then
                    v_negativo = 1;
                    INSERT INTO 
                      mod_logistica.dat_movimiento
                    (
                      iddocumento,
                      idproducto,
                      preciocontable,
                      importecontable,
                      cantidad,
                      cronologia,
                      importetotal,
                      signo,
                      idunidadmedida,
                      idelementogasto,
                      idclasificacion
                    )
                    VALUES (
                      v_iddocumentoneg,
                      v_producto.idproducto,
                      0,
                      v_producto.diferencia*-1,
                      0,
                      0,
                      0,
                      '+',
                      v_producto.idumedida,
                      v_producto.idelementogasto,
                      v_producto.idclasificacioncontable
                    );
                else 
                    v_positivo = 1;
                    INSERT INTO 
                      mod_logistica.dat_movimiento
                    (
                      iddocumento,
                      idproducto,
                      preciocontable,
                      importecontable,
                      cantidad,
                      cronologia,
                      importetotal,
                      signo,
                      idunidadmedida,
                      idelementogasto,
                      idclasificacion
                    )
                    VALUES (
                      v_iddocumentopos,
                      v_producto.idproducto,
                      0,
                      v_producto.diferencia,
                      0,
                      0,
                      0,
                      '-',
                      v_producto.idumedida,
                      v_producto.idelementogasto,
                      v_producto.idclasificacioncontable
                    );
                end if;              
                
            end loop;
            if v_negativo = 0 THEN
                delete from mod_logistica.dat_documento where iddocumento = v_iddocumentoneg;
            end if;
            
            if v_positivo = 0 THEN
                delete from mod_logistica.dat_documento where iddocumento = v_iddocumentopos;
            end if;
    end if;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.f_generarajustescero (p_idestructura numeric, p_iddeposito numeric, p_idusuario numeric, p_iddocs varchar)
  OWNER TO zeolides;