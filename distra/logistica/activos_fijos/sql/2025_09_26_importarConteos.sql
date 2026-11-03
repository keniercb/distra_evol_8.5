CREATE SEQUENCE mod_logactivofijotangible.sec_tmpimportarconteo_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logactivofijotangible.sec_tmpimportarconteo_seq RESTART WITH 1000000001;

CREATE SEQUENCE mod_logactivofijotangible.sec_tmpimportarconteoelemento_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logactivofijotangible.sec_tmpimportarconteoelemento_seq RESTART WITH 1000000001;

CREATE TABLE mod_logactivofijotangible.tmp_importarconteo (
  id NUMERIC(19,0) DEFAULT nextval('mod_logactivofijotangible.sec_tmpimportarconteo_seq'::regclass) NOT NULL,
  codigo_entidad VARCHAR(50),
  tipo_documento NUMERIC(1,0),
  codigo_centrocosto VARCHAR(50),
  usuario VARCHAR(50),
  idarea NUMERIC(19,0),
  idcentrocosto NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT tmp_importarconteo_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logactivofijotangible.tmp_importarconteo.tipo_documento
IS '1 Movimiento de aft, 2 Control de utiles';

ALTER TABLE mod_logactivofijotangible.tmp_importarconteo
  OWNER TO zeolides;
  
CREATE TABLE mod_logactivofijotangible.tmp_importarconteoelemento (
  id NUMERIC(19,0) DEFAULT nextval('mod_logactivofijotangible.sec_tmpimportarconteoelemento_seq'::regclass) NOT NULL,
  idconteo NUMERIC(19,0),
  codigo_indicador VARCHAR(255),
  nroinventario VARCHAR(150),
  conteo VARCHAR(10),
  idregnumerico NUMERIC(19,0),
  CONSTRAINT tmp_importarconteoelemento_pkey PRIMARY KEY(id),
  CONSTRAINT tmp_importarconteoelemento_fk FOREIGN KEY (idconteo)
    REFERENCES mod_logactivofijotangible.tmp_importarconteo(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logactivofijotangible.tmp_importarconteoelemento
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_importarconteo (
  p_idconteo numeric
)
RETURNS void AS
$body$
DECLARE
  v_idestructuracomun numeric;
  v_iddoc numeric;
  v_iddocumento numeric;
  v_idajustesob numeric;
  v_idajustefalt numeric;	
  v_idespecialidad numeric;
  v_idperiodo record;
  v_idcentrocosto numeric;
  v_fecha date;
  v_registros record;
  v_datosimportar record;
  v_datosusuario record;
  v_idoperacionconteo numeric;
  v_idoperacionfalt numeric;
  v_idoperacionsob numeric;
  v_aft record;
  v_movaft record;
  v_cronologia numeric;
  v_idmovimiento numeric;
  v_idmovregnumerico numeric;
  v_color varchar;
  v_countsobrante numeric;
  v_countfaltante numeric;
BEGIN
	select max(d.cronologia) into v_cronologia from mod_logistica.dat_documento d;
	
    select ct.* into v_datosimportar from mod_logactivofijotangible.tmp_importarconteo ct where ct.id = p_idconteo;
    if v_datosimportar.idcentrocosto is null then
    	select cc.idcentrogrupo into v_idcentrocosto from mod_contabilidadcosto.nom_centrocosto cc where cc.concat = v_datosimportar.codigo_centrocosto limit 1;
    else
    	v_idcentrocosto := v_datosimportar.idcentrocosto;
    end if;
    
    if v_datosimportar.idestructuracomun is null then
  		select ve.idestructura into v_idestructuracomun from mod_estructuracomp.v_dametodasestructuras ve where ve.codigo = v_datosimportar.codigo_entidad limit 1;
    else 
    	v_idestructuracomun := v_datosimportar.idestructuracomun;
    end if;
    
    if v_datosimportar.tipo_documento = 1 then
    	v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'MMAFT' and des.idestructuracomun = v_idestructuracomun limit 1);
        
        v_idoperacionconteo := (select op.idnomoperaciones from mod_datosmaestros.nom_operacion op where op.codigooperacion = 'OPER_INV_PARCIAL' and op.idsubsistema = 11);
        v_idoperacionfalt := (select op.idnomoperaciones from mod_datosmaestros.nom_operacion op where op.codigooperacion = 'OPER_AJUSTE_FALTANTE' and op.idsubsistema = 11 limit 1);
        v_idoperacionsob := (select op.idnomoperaciones from mod_datosmaestros.nom_operacion op where op.codigooperacion = 'OPER_AJUSTE_SOBRANTE' and op.idsubsistema = 11 limit 1);
    else
    	v_iddoc := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        where ndp.abreviatura = 'cuhe' and des.idestructuracomun = v_idestructuracomun limit 1);
        
        v_idoperacionconteo := (select op.idnomoperaciones from mod_datosmaestros.nom_operacion op where op.codigooperacion = 'OPER_INV_PARCIAL_UH' and op.idsubsistema = 11);
        v_idoperacionfalt := (select op.idnomoperaciones from mod_datosmaestros.nom_operacion op where op.codigooperacion = 'OPER_AJUSTE_FALTA_UH' and op.idsubsistema = 11 limit 1);
        v_idoperacionsob := (select op.idnomoperaciones from mod_datosmaestros.nom_operacion op where op.codigooperacion = 'OPER_AJUSTE_SOBRA_UH' and op.idsubsistema = 11 limit 1);
    end if;
    
    select cue.idespecialidad, us.idusuario into v_datosusuario from mod_logistica.conf_usuarioespecialidad cue 
    inner join mod_seguridad.seg_usuario us on us.idusuario = cue.idusuario
    where us.nombreusuario = v_datosimportar.usuario limit 1;
    
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(11, v_idestructuracomun);
                  
    v_fecha := (select df.fecha from mod_datosmaestros.dat_fecha df
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
    where des.idsubsistema = 11 and des.idestructuracomun = v_idestructuracomun limit 1);
    
    --insertando documento de conteo
    v_cronologia := v_cronologia + 1;
    with documento AS (INSERT INTO mod_logistica.dat_documento
      (
        iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
        idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion,nrodoc
      )
      VALUES (
        v_iddoc, date_part('year', CAST(to_char(v_fecha, 'DD/MM/YYYY HH24:MI') as timestamp)),
        v_fecha,'Conteo generado desde aplicacion movil',v_cronologia,1,v_datosusuario.idusuario,2,v_idperiodo.idejercicioactual,
        v_datosimportar.idarea, v_idperiodo.idperiodoactual,
        (COALESCE((
          select max(dd.numeroref) from mod_logistica.dat_documento dd 
          inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dd.iddoc
          inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
          where dd.iddoc = v_iddoc
          and dd.idejercicio = v_idperiodo.idejercicioactual and es.idestructuracomun = v_idestructuracomun
        ),0)+1),1,v_idoperacionconteo,
        (COALESCE((
          select max(dd.nrodoc) from mod_logistica.dat_documento dd 
          inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dd.iddoc
          inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
          where dd.iddoc = v_iddoc
          and dd.idejercicio = v_idperiodo.idejercicioactual and es.idestructuracomun = v_idestructuracomun
        ),0)+1)
      ) returning iddocumento,iddoc,idejercicio,idestructuracomun),
      activo as (
      INSERT INTO 
        mod_logactivofijotangible.dat_documentoactivo
      (
        iddocumentoactivo,
        idcentrocosto,
        tipo,
        idareadestino,
        idresponsabledestino,
        idcentrocostodestino,
        masivo
      )
      select iddocumento, v_idcentrocosto, 0, null, null, null, 0 from documento returning iddocumentoactivo)
      INSERT INTO 
        mod_logactivofijotangible.dat_docinventarioparcial
      (
        iddocinventarioparcial,
        mensual,
        areas
      )
      select iddocumentoactivo, 0, v_datosimportar.idarea from activo 
      RETURNING iddocinventarioparcial into v_iddocumento;  
      
      for v_registros in (
      	select elm.* from mod_logactivofijotangible.tmp_importarconteoelemento elm where elm.idconteo = p_idconteo
      )loop
      		v_color := CASE v_registros.conteo
                WHEN 'contado' THEN 'negro'
                WHEN 'sobrante' THEN 'verde'
                ELSE 'rojo'
            END;
      		
      		select dp.idproducto, rn.idregnumerico,dp.cantidad,i.denominacion, i.codigo, dp.idelementogasto, dp.idelementogastoalt into v_aft FROM mod_logistica.dat_producto dp
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON ih.idindicador = dp.idindicador
            INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = ih.idindicador
            INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = dp.idproducto
            WHERE rn.idregnumerico = v_registros.idregnumerico;
            
            select dm.* into v_movaft from mod_logistica.dat_movimiento dm where dm.iddocumento = v_iddocumento and dm.idproducto = v_aft.idproducto;
            
            if v_movaft.idmovimiento is null then
            	INSERT INTO 
                  mod_logistica.dat_movimiento
                (
                  iddocumento,
                  idproducto,
                  cantidad,
                  cronologia,
                  idelementogasto,
                  idelementogastoalt
                )
                VALUES (
                  v_iddocumento,
                  v_aft.idproducto,
                  1,
                  v_cronologia,
                  v_aft.idelementogasto,
                  v_aft.idelementogastoalt
                ) returning idmovimiento into v_idmovimiento;	
            else 
            	update mod_logistica.dat_movimiento set cantidad = cantidad + 1 where idmovimiento = v_movaft.idmovimiento;
                v_idmovimiento := v_movaft.idmovimiento;
            end if;
            
            INSERT INTO 
              mod_logactivofijotangible.dat_movregnumerico
            (
              idregnumerico,
              idmovimiento
            )
            VALUES (
              v_aft.idregnumerico,
              v_idmovimiento
            ) returning idmovregnumerico into v_idmovregnumerico;
            
            INSERT INTO 
              mod_logactivofijotangible.dat_movregnumericoactivo
            (
              idmovregnumerico,
              idestatustecnico,
              idarearesp,
              idcentrocosto,
              idactividad,
              idtabla,
              valoradquisicion,
              depreciacionacumulada,
              tasafiscal,
              porcientorecuperacion,
              valorcontable,
              vidautil,
              fechaadq,
              idresponsable,
              recursoconsumido,
              cantidadrecursoconsumido,
              importe,
              nroinventario,
              arrendado,
              datos,
              idnaturaleza,
              idgruposubgrupo,
              denominacion,
              idgruposubgrupoold,
              actividad
            )
            (select v_idmovregnumerico, rna.idestatustecnico, rna.idarearesp, rna.idcentrocosto, rna.idactividad,
              rna.idtabla, rna.valoradquisicion, rna.depreciacionacumulada, rna.tasafiscal, rna.porcientorecuperacion, rna.valorcontable,
              rna.vidautil, rna.fechaadq, rna.idresponsable, rna.recursoconsumido, rna.cantidadrecursoconsumido, rna.importe,
              rna.nroinventario, rna.arrendado, rna.datos, rna.idnaturaleza, rna.idgruposubgrupo,
              rna.denominacion, rna.idgruposubgrupoold, rna.actividad from mod_logactivofijotangible.dat_regnumericoactivo rna
              where rna.idregnumerico = v_registros.idregnumerico);
            
            INSERT INTO 
              mod_logactivofijotangible.dat_movregnumericoinventario
            (
              idmovregnumerico,
              color
            )
            VALUES (
              v_idmovregnumerico,
              v_color
            );         
      end loop;
      
      v_countfaltante := (select count(id) from mod_logactivofijotangible.tmp_importarconteoelemento where idconteo = p_idconteo and conteo = 'faltante');
      v_countsobrante := (select count(id) from mod_logactivofijotangible.tmp_importarconteoelemento where idconteo = p_idconteo and conteo = 'sobrante');
      
      if v_countfaltante > 0 then
        
        with documento AS (INSERT INTO mod_logistica.dat_documento
        (
          iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
          idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
        )
        VALUES (
          v_iddoc, date_part('year', CAST(to_char(v_fecha, 'DD/MM/YYYY HH24:MI') as timestamp)),
          v_fecha,'Ajuste por faltante generado por conteo en aplicacion movil',0,1,v_datosusuario.idusuario,2,v_idperiodo.idejercicioactual,
          v_datosimportar.idarea, v_idperiodo.idperiodoactual,
          (COALESCE((
            select max(dd.numeroref) from mod_logistica.dat_documento dd 
            inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dd.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
            where dd.iddoc = v_iddoc
            and dd.idejercicio = v_idperiodo.idejercicioactual and es.idestructuracomun = v_idestructuracomun
          ),0)+1),1,v_idoperacionfalt
        ) returning iddocumento,iddoc,idejercicio,idestructuracomun)
        INSERT INTO 
          mod_logactivofijotangible.dat_documentoactivo
        (
          iddocumentoactivo,
          idcentrocosto,
          tipo,
          idareadestino,
          idresponsabledestino,
          idcentrocostodestino,
          masivo
        )
        select iddocumento, v_idcentrocosto, 0, null, null, null, 0 from documento returning iddocumentoactivo into v_iddocumento; 
        
        for v_registros in (
      	select elm.* from mod_logactivofijotangible.tmp_importarconteoelemento elm where elm.idconteo = p_idconteo and conteo = 'faltante'
        )loop	
              select dp.idproducto, rn.idregnumerico,dp.cantidad,i.denominacion, i.codigo, dp.idelementogasto, dp.idelementogastoalt into v_aft FROM mod_logistica.dat_producto dp
              INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON ih.idindicador = dp.idindicador
              INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = ih.idindicador
              INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = dp.idproducto
              WHERE rn.idregnumerico = v_registros.idregnumerico;
              
              select dm.* into v_movaft from mod_logistica.dat_movimiento dm where dm.iddocumento = v_iddocumento and dm.idproducto = v_aft.idproducto;
              
              if v_movaft.idmovimiento is null then
                  INSERT INTO 
                    mod_logistica.dat_movimiento
                  (
                    iddocumento,
                    idproducto,
                    cantidad,
                    cronologia,
                    idelementogasto,
                    idelementogastoalt
                  )
                  VALUES (
                    v_iddocumento,
                    v_aft.idproducto,
                    1,
                    0,
                    v_aft.idelementogasto,
                    v_aft.idelementogastoalt
                  ) returning idmovimiento into v_idmovimiento;	
              else 
                  update mod_logistica.dat_movimiento set cantidad = cantidad + 1 where idmovimiento = v_movaft.idmovimiento;
                  v_idmovimiento := v_movaft.idmovimiento;
              end if;
              
              INSERT INTO 
                mod_logactivofijotangible.dat_movregnumerico
              (
                idregnumerico,
                idmovimiento
              )
              VALUES (
                v_aft.idregnumerico,
                v_idmovimiento
              ) returning idmovregnumerico into v_idmovregnumerico;
              
              INSERT INTO 
                mod_logactivofijotangible.dat_movregnumericoactivo
              (
                idmovregnumerico,
                idestatustecnico,
                idarearesp,
                idcentrocosto,
                idactividad,
                idtabla,
                valoradquisicion,
                depreciacionacumulada,
                tasafiscal,
                porcientorecuperacion,
                valorcontable,
                vidautil,
                fechaadq,
                idresponsable,
                recursoconsumido,
                cantidadrecursoconsumido,
                importe,
                nroinventario,
                arrendado,
                datos,
                idnaturaleza,
                idgruposubgrupo,
                denominacion,
                idgruposubgrupoold,
                actividad
              )
              (select v_idmovregnumerico, rna.idestatustecnico, rna.idarearesp, rna.idcentrocosto, rna.idactividad,
                rna.idtabla, rna.valoradquisicion, rna.depreciacionacumulada, rna.tasafiscal, rna.porcientorecuperacion, rna.valorcontable,
                rna.vidautil, rna.fechaadq, rna.idresponsable, rna.recursoconsumido, rna.cantidadrecursoconsumido, rna.importe,
                rna.nroinventario, rna.arrendado, rna.datos, rna.idnaturaleza, rna.idgruposubgrupo,
                rna.denominacion, rna.idgruposubgrupoold, rna.actividad from mod_logactivofijotangible.dat_regnumericoactivo rna
                where rna.idregnumerico = v_registros.idregnumerico);
        end loop;
      end if;
      
      if v_countsobrante > 0 then
        
        with documento AS (INSERT INTO mod_logistica.dat_documento
        (
          iddoc,anno,fechacontable,observaciones,cronologia,version,idusuario,estado,idejercicio,
          idestructuracomun,idperiodo,numeroref,idespecialidad,idoperacion
        )
        VALUES (
          v_iddoc, date_part('year', CAST(to_char(v_fecha, 'DD/MM/YYYY HH24:MI') as timestamp)),
          v_fecha,'Ajuste por sobrante generado por conteo en aplicacion movil',0,1,v_datosusuario.idusuario,2,v_idperiodo.idejercicioactual,
          v_datosimportar.idarea, v_idperiodo.idperiodoactual,
          (COALESCE((
            select max(dd.numeroref) from mod_logistica.dat_documento dd 
            inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dd.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
            where dd.iddoc = v_iddoc
            and dd.idejercicio = v_idperiodo.idejercicioactual and es.idestructuracomun = v_idestructuracomun
          ),0)+1),1,v_idoperacionsob
        ) returning iddocumento,iddoc,idejercicio,idestructuracomun)
        INSERT INTO 
          mod_logactivofijotangible.dat_documentoactivo
        (
          iddocumentoactivo,
          idcentrocosto,
          tipo,
          idareadestino,
          idresponsabledestino,
          idcentrocostodestino,
          masivo
        )
        select iddocumento, v_idcentrocosto, 0, null, null, null, 0 from documento returning iddocumentoactivo into v_iddocumento; 
        
        for v_registros in (
      	select elm.* from mod_logactivofijotangible.tmp_importarconteoelemento elm where elm.idconteo = p_idconteo and conteo = 'sobrante'
        )loop	
              select dp.idproducto, rn.idregnumerico,dp.cantidad,i.denominacion, i.codigo, dp.idelementogasto, dp.idelementogastoalt into v_aft FROM mod_logistica.dat_producto dp
              INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON ih.idindicador = dp.idindicador
              INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = ih.idindicador
              INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = dp.idproducto
              WHERE rn.idregnumerico = v_registros.idregnumerico;
              
              select dm.* into v_movaft from mod_logistica.dat_movimiento dm where dm.iddocumento = v_iddocumento and dm.idproducto = v_aft.idproducto;
              
              if v_movaft.idmovimiento is null then
                  INSERT INTO 
                    mod_logistica.dat_movimiento
                  (
                    iddocumento,
                    idproducto,
                    cantidad,
                    cronologia,
                    idelementogasto,
                    idelementogastoalt
                  )
                  VALUES (
                    v_iddocumento,
                    v_aft.idproducto,
                    1,
                    0,
                    v_aft.idelementogasto,
                    v_aft.idelementogastoalt
                  ) returning idmovimiento into v_idmovimiento;	
              else 
                  update mod_logistica.dat_movimiento set cantidad = cantidad + 1 where idmovimiento = v_movaft.idmovimiento;
                  v_idmovimiento := v_movaft.idmovimiento;
              end if;
              
              INSERT INTO 
                mod_logactivofijotangible.dat_movregnumerico
              (
                idregnumerico,
                idmovimiento
              )
              VALUES (
                v_aft.idregnumerico,
                v_idmovimiento
              ) returning idmovregnumerico into v_idmovregnumerico;
              
              INSERT INTO 
                mod_logactivofijotangible.dat_movregnumericoactivo
              (
                idmovregnumerico,
                idestatustecnico,
                idarearesp,
                idcentrocosto,
                idactividad,
                idtabla,
                valoradquisicion,
                depreciacionacumulada,
                tasafiscal,
                porcientorecuperacion,
                valorcontable,
                vidautil,
                fechaadq,
                idresponsable,
                recursoconsumido,
                cantidadrecursoconsumido,
                importe,
                nroinventario,
                arrendado,
                datos,
                idnaturaleza,
                idgruposubgrupo,
                denominacion,
                idgruposubgrupoold,
                actividad
              )
              (select v_idmovregnumerico, rna.idestatustecnico, rna.idarearesp, rna.idcentrocosto, rna.idactividad,
                rna.idtabla, rna.valoradquisicion, rna.depreciacionacumulada, rna.tasafiscal, rna.porcientorecuperacion, rna.valorcontable,
                rna.vidautil, rna.fechaadq, rna.idresponsable, rna.recursoconsumido, rna.cantidadrecursoconsumido, rna.importe,
                rna.nroinventario, rna.arrendado, rna.datos, rna.idnaturaleza, rna.idgruposubgrupo,
                rna.denominacion, rna.idgruposubgrupoold, rna.actividad from mod_logactivofijotangible.dat_regnumericoactivo rna
                where rna.idregnumerico = v_registros.idregnumerico);
        end loop;
      end if;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logactivofijotangible.f_importarconteo (p_idconteo numeric)
  OWNER TO zeolides;
  


