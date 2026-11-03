INSERT INTO 
  mod_logistica.nom_variableglobal
(
  nombre,
  valor
)
VALUES (
  'farmacia',
  '0'
);

CREATE TABLE mod_loginventario.dat_transfinterna (
  idtransfinterna NUMERIC(19,0) NOT NULL,
  devolucion NUMERIC(1,0) DEFAULT 0 NOT NULL,
  iddeposorigen NUMERIC(19,0),
  iddeposdestino NUMERIC(19,0),
  idconcepretenido NUMERIC(19,0),
  idmotivodevolucion NUMERIC(19,0),
  idtipotransfinterna NUMERIC(19,0),
  idoperacionorigen NUMERIC(19,0),
  CONSTRAINT dat_transfinterna_pkey PRIMARY KEY(idtransfinterna),
  CONSTRAINT dat_transfinterna_fk FOREIGN KEY (idtransfinterna)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT dat_transfinterna_fk1 FOREIGN KEY (iddeposorigen)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_transfinterna_fk2 FOREIGN KEY (iddeposdestino)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  /*CONSTRAINT dat_transfinterna_fk3 FOREIGN KEY (idconcepretenido)
    REFERENCES mod_loginventario.nom_conceptorete(idconceptorete)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_transfinterna_fk4 FOREIGN KEY (idtipotransfinterna)
    REFERENCES mod_loginventario.nom_tipotransfinterna(idtipotransfinterna)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,*/
  CONSTRAINT dat_transfinterna_fk5 FOREIGN KEY (idoperacionorigen)
    REFERENCES mod_datosmaestros.nom_operacion(idnomoperaciones)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE/*,
  CONSTRAINT fk_motivodevolucion_transfinterna FOREIGN KEY (idmotivodevolucion)
    REFERENCES mod_loginventario.nom_motivodevolucion(idmotivodevolucion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE*/
)
WITH (oids = false);

COMMENT ON COLUMN mod_loginventario.dat_transfinterna.devolucion
IS '1 en caso de ser una devolucion, 0 en caso de ser falso.';

COMMENT ON COLUMN mod_loginventario.dat_transfinterna.iddeposorigen
IS 'Almacena el depósito origen.';

COMMENT ON COLUMN mod_loginventario.dat_transfinterna.iddeposdestino
IS 'Almacena el depósito destino.';

COMMENT ON COLUMN mod_loginventario.dat_transfinterna.idconcepretenido
IS 'Almacena el concepto de retenido';

COMMENT ON COLUMN mod_loginventario.dat_transfinterna.idmotivodevolucion
IS 'Almacena el motivo de devolución';

COMMENT ON COLUMN mod_loginventario.dat_transfinterna.idtipotransfinterna
IS 'Almacena el tipo de transferancia';

COMMENT ON COLUMN mod_loginventario.dat_transfinterna.idoperacionorigen
IS 'Id de la operacion por la cual se va a generar la transferencia.';

ALTER TABLE mod_loginventario.dat_transfinterna
  OWNER TO zeolides;

CREATE SEQUENCE mod_loginventario.sec_dadprodtransfinterna_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

CREATE TABLE mod_loginventario.dat_prodtransfinterna (
  idprodtransfinterna NUMERIC(19,0) DEFAULT nextval('mod_loginventario.sec_dadprodtransfinterna_seq'::regclass) NOT NULL,
  idtransfinterna NUMERIC(19,0),
  idproducto NUMERIC(19,0),
  cantidad NUMERIC(25,6) DEFAULT 0,
  CONSTRAINT datprodtransfinterna_pkey PRIMARY KEY(idprodtransfinterna),
  CONSTRAINT dat_prodtransfinterna_fk FOREIGN KEY (idtransfinterna)
    REFERENCES mod_loginventario.dat_transfinterna(idtransfinterna)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT dat_prodtransfinterna_fk1 FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);

COMMENT ON COLUMN mod_loginventario.dat_prodtransfinterna.idprodtransfinterna
IS 'Identificador de la tabla';

COMMENT ON COLUMN mod_loginventario.dat_prodtransfinterna.idtransfinterna
IS 'Identificador de la transferancia interna';

COMMENT ON COLUMN mod_loginventario.dat_prodtransfinterna.idproducto
IS 'Identificador del producto.';

COMMENT ON COLUMN mod_loginventario.dat_prodtransfinterna.cantidad
IS 'Cantidad a transferir del producto';

ALTER TABLE mod_loginventario.dat_prodtransfinterna
  OWNER TO zeolides;

CREATE SEQUENCE mod_loginventario.sec_dattransfinternalote_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

CREATE OR REPLACE FUNCTION mod_loginventario.f_aprobartransfinterna (
  p_iddocumento numeric,
  p_idusuario numeric,
  p_cronologia numeric = 1
)
RETURNS void AS
$body$
DECLARE
  v_iddocdistribucion numeric;
  v_iddoctransferencia numeric;
  v_iddocrecepcion numeric;
  v_iddocumentodist numeric;
  v_iddocumentotransf numeric;
  v_iddocumentorecep numeric;
  v_idespecialidad numeric;
  v_proddestino record;
  v_cronologia numeric;

  v_idmoneda numeric;
  v_idperiodo record;
  v_fechainventario date;
  v_allrec record;
  v_recdata record;
  v_reclote record;
  v_idproducto numeric;
  v_idlote numeric;
  v_movimiento record;
BEGIN

    select ti.iddeposorigen as origen, ti.iddeposdestino as destino,d.idestructuracomun,
    d.nrodoc,d.numeroref,d.fechacontable as fecha,d.iddocumento into v_recdata
    from mod_loginventario.dat_transfinterna ti
    inner join mod_logistica.dat_documento d on d.iddocumento = ti.idtransfinterna
    where ti.idtransfinterna = p_iddocumento;

    v_idmoneda := (select idmoneda from mod_datosmaestros.dat_monedaentidad
    where idestructuracomun = v_recdata.idestructuracomun and tipomoneda = 0 limit 1);

    v_iddocdistribucion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = v_recdata.idestructuracomun limit 1);

    v_iddoctransferencia := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'transferenciaLog' and des.idestructuracomun = v_recdata.idestructuracomun limit 1);

    v_iddocrecepcion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'recepcionLog' and des.idestructuracomun = v_recdata.idestructuracomun limit 1);

    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue
                where cue.idusuario = p_idusuario limit 1);

    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, v_recdata.idestructuracomun);


    v_fechainventario := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 10 and des.idestructuracomun = v_recdata.idestructuracomun limit 1);

    select max(d.cronologia)+1 into v_cronologia from mod_logistica.dat_documento d;

    with documento AS (INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,idusuario,
              estado,idejercicio,idestructuracomun,idperiodo,numeroref,
              nrodoc,idespecialidad,aprobadopor,idbloqueousuario
            )
            VALUES (
              v_iddocdistribucion, date_part('year', CAST(to_char(v_fechainventario, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechainventario,'Documento generado a partir de la Transferencia interna #'||v_recdata.nrodoc||' con fecha '||v_recdata.fecha||'.',
              0,p_idusuario,3,v_idperiodo.idejercicioactual,v_recdata.idestructuracomun, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.idestructuracomun
              ),0)+1),
              (COALESCE((
                select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.idestructuracomun
              ),0)+1),v_idespecialidad,p_idusuario,p_idusuario
            ) returning iddocumento,iddoc,idejercicio,idestructuracomun,nrodoc),
            distribucion as (
            INSERT INTO
              mod_logdistribucion.dat_distribucion
            (
              iddistribucion,
              idestructuraop,
              tipodestino,
              tipodistribucion
            )
              select iddocumento,v_recdata.idestructuracomun,3,3 from documento
              returning iddistribucion
            ),
            documentocliente as (
            INSERT INTO
                mod_logistica.dat_documentocliente
              (
                iddocumento,idcliente,tipocliente
              )
              select iddocumento, v_recdata.destino,3 from documento
              RETURNING iddocumento
            )
            INSERT INTO
              mod_logistica.dat_documentopadre
            (
              iddocumento,idpadre
            )
            select iddocumento, v_recdata.iddocumento from documentocliente
            returning iddocumento into v_iddocumentodist;

	with transferencia as (INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,nrodoc,idespecialidad,
              idoperacion,aprobadopor,idbloqueousuario
            )
            VALUES (
              v_iddoctransferencia, date_part('year', CAST(to_char(v_fechainventario, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechainventario,'Documento generado a partir de la Distribución #'||(
              select nrodoc from mod_logistica.dat_documento where iddocumento = v_iddocumentodist
              )||' con fecha '||v_fechainventario||'.',
              v_cronologia,p_idusuario,4,v_idperiodo.idejercicioactual,v_recdata.origen, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoctransferencia
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.origen
              ),0)+1),
              (COALESCE((
                select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoctransferencia
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.origen
              ),0)+1),v_idespecialidad,null,p_idusuario,p_idusuario
            ) returning iddocumento,iddoc,idejercicio,observaciones),
            entrega as (INSERT INTO
                mod_logistica.dat_entrega
              (
                iddocumento,observacion,iddestino,origen
              )
              select iddocumento, observaciones,2,1 from transferencia
              returning iddocumento),
            documentoclientetranf as (INSERT INTO
                mod_logistica.dat_documentocliente
              (
                iddocumento,idcliente,tipocliente
              )
              select iddocumento, v_recdata.destino,3 from transferencia
              returning iddocumento)

            INSERT INTO
              mod_logistica.dat_documentopadre
            (
              iddocumento,idpadre
            )
            select iddocumento, v_iddocumentodist from transferencia
            returning iddocumento into v_iddocumentotransf;

    --raise notice 'v %',v_iddocumentotransf;

	with recepcion as (INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,nrodoc,idespecialidad,
              idoperacion,aprobadopor,idbloqueousuario
            )
            VALUES (
              v_iddocrecepcion, date_part('year', CAST(to_char(v_fechainventario, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechainventario,'Documento generado a partir de la Transferencia #'||(
              select nrodoc from mod_logistica.dat_documento where iddocumento = v_iddocumentotransf
              )||' con fecha '||v_fechainventario||'.',
              v_cronologia+1,p_idusuario,4,v_idperiodo.idejercicioactual,v_recdata.destino, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocrecepcion
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.destino
              ),0)+1),
              (COALESCE((
                select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocrecepcion
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.destino
              ),0)+1),v_idespecialidad,NULL,p_idusuario,p_idusuario--(select valor::numeric from mod_logistica.nom_variableglobal where nombre = 'OPRE_REC_TRANS_INT')
            ) returning iddocumento,iddoc,idejercicio,observaciones),
            docrecepcion as (INSERT INTO mod_loginventario.dat_recepcion
              (
                iddocumento,nrodocorigen,fechadocorigen,idcondicionpago
              )
              select iddocumento, (select nrodoc from mod_logistica.dat_documento where iddocumento = v_iddocumentotransf),
              (select fechacontable from mod_logistica.dat_documento where iddocumento = v_iddocumentotransf),null from recepcion
              returning iddocumento),
            documentoclienterecep as (INSERT INTO
                mod_logistica.dat_documentocliente
              (
                iddocumento,idcliente,tipocliente
              )
              select iddocumento, v_recdata.origen,3 from recepcion
              returning iddocumento)

            INSERT INTO
              mod_logistica.dat_documentopadre
            (
              iddocumento,idpadre
            )
            select iddocumento, v_iddocumentotransf from recepcion
            returning iddocumento into v_iddocumentorecep;


    for v_allrec in select pti.idproducto, p.idproducto as proddestino, po.precio,po.idumedida,
    					po.idelementogasto, po.idclasificacioncontable,po.cantidad as existencia,
    					pti.cantidad as cantidad,count(til.idtransfinternalote) as tienelote
                  from  mod_loginventario.dat_prodtransfinterna pti
                  inner join mod_logistica.dat_producto po on po.idproducto = pti.idproducto
                  left join mod_logistica.dat_producto p on p.idindicador = po.idindicador
                  			and p.idestructura = v_recdata.destino
                  left join mod_loginventario.dat_transfinternalote til on til.idproducto = pti.idproducto
                            and til.idtransfinterna = pti.idtransfinterna
                  where pti.idtransfinterna = p_iddocumento
                  group by  pti.idproducto, p.idproducto, po.precio, pti.cantidad,po.idumedida,
    					po.idelementogasto, po.idclasificacioncontable,po.cantidad
    loop
    	v_proddestino := v_allrec;

        with proorden as (
              INSERT INTO
                mod_logdistribucion.dat_prodorden
              (
                idproducto,idcliente,cantidad,idorden
              )
              VALUES (
                v_allrec.idproducto,v_recdata.destino,v_allrec.cantidad,v_iddocumentodist
              )returning idprodorden,idproducto
            ), proordencmpto as (
                INSERT INTO
                  mod_logdistribucion.dat_prodordencmpto
                (
                  idprodorden,enproceso,entregado,pendiente,cantidadoriginal
                )
              select idprodorden, 0, v_allrec.cantidad,0,v_allrec.cantidad from proorden
            ), prodordenlote as (
                INSERT INTO
                  mod_logdistribucion.dat_prodordenlote
                (
                  idprodordenlote,idproducto,idlote,cantidad
                )
                SELECT pd.idprodorden,pd.idproducto,lt.idlote,lt.cantpasar from proorden pd
                inner join mod_loginventario.dat_transfinternalote lt on lt.idproducto = pd.idproducto
                and lt.idtransfinterna = p_iddocumento
                --where idproducto = v_allrec.idproducto and idtransfinterna = p_iddocumento
            )
            INSERT INTO
              mod_logistica.dat_cantidadcomprometida
            (
              iddocumento,idproducto,idcliente,cantidad,estado
            )
            VALUES(v_iddocumentodist,v_allrec.idproducto,v_recdata.destino,v_allrec.cantidad,2);

		with movimientoSalida as (
              INSERT INTO
                mod_logistica.dat_movimiento
              (
                iddocumento,idproducto,preciocontable,importecontable,cantidad,
                cronologia,signo,idunidadmedida,idelementogasto,idclasificacion
              )
              VALUES (
                v_iddocumentotransf,v_allrec.idproducto,v_allrec.precio,
                round(v_allrec.cantidad*v_allrec.precio,2),v_allrec.cantidad,
                (select cronologia from mod_logistica.dat_documento where iddocumento = v_iddocumentotransf),
                '-',v_allrec.idumedida,v_allrec.idelementogasto,v_allrec.idclasificacioncontable
              ) returning idmovimiento, preciocontable, idproducto, cantidad, cronologia
          ), movmoneda as (
              insert into mod_logistica.dat_movmoneda
            (
                idmovimiento, idmoneda, precio
            )
            select idmovimiento, v_idmoneda, preciocontable from movimientoSalida
          ), movlote as (INSERT INTO
              mod_logistica.dat_movlote
            (
              idlote,idmovimiento,cantidad,idubicacion
            )
            SELECT pl.idlote,mv.idmovimiento,pl.cantidad, -1 from movimientoSalida mv
            inner join mod_logdistribucion.dat_prodorden po on po.idproducto = mv.idproducto
            		and po.idorden = v_iddocumentodist
            inner join mod_logdistribucion.dat_prodordenlote pl on pl.idprodordenlote = po.idprodorden
            and pl.idprodordenlote = po.idprodorden
          )
            update mod_logistica.dat_producto as dp
            set cantidad = dp.cantidad - ms.cantidad,cronologia = ms.cronologia,
            precio = (case when (dp.cantidad-ms.cantidad) > 0
                  then (round(dp.importe - (dp.precio*ms.cantidad),2))/(dp.cantidad-ms.cantidad)
              else 0 end),
            importe = (case when (dp.cantidad-ms.cantidad) > 0
                    then (round(dp.importe - (dp.precio*ms.cantidad), 2) )
              else 0 end)
            from movimientoSalida ms
            where dp.idproducto = ms.idproducto
            returning ms.idmovimiento, dp.cantidad, dp.precio, dp.importe into v_movimiento;

            update mod_logistica.dat_movimiento
            set existenciaactual=v_movimiento.cantidad ,preciopromedio=v_movimiento.precio,
            importetotal=v_movimiento.importe
            where idmovimiento = v_movimiento.idmovimiento;
            --falta actualizar la rebajar la existencia de los lotes

      if v_proddestino.proddestino is null then
      		INSERT INTO
              mod_logistica.dat_producto
            (
              idestructura,idumedida,idindicador,idclasificacioncontable,
              cronologia,precio,cantidad,importe,idestructuracomun,
              idmarca,idmodelo,idelementogasto
            )
            SELECT v_recdata.destino, mv.idunidadmedida,p.idindicador,mv.idclasificacion,
            (select cronologia from mod_logistica.dat_documento where iddocumento = v_iddocumentorecep) as cronologia,
            0, 0, 0, p.idestructuracomun,p.idmarca, p.idmodelo, p.idelementogasto
            FROM mod_logistica.dat_movimiento mv
            INNER JOIN mod_logistica.dat_producto p ON p.idproducto = mv.idproducto
            WHERE mv.iddocumento = v_iddocumentotransf
            and mv.idproducto = v_proddestino.idproducto
            returning idproducto as proddestino,precio,idumedida,idelementogasto,
            	idclasificacioncontable,cantidad,v_proddestino.idproducto as idproducto,cronologia
                into v_proddestino;
      end if;

		with movimientoEntrada as (
              INSERT INTO
                mod_logistica.dat_movimiento
              (
                iddocumento,idproducto,preciocontable,importecontable,cantidad,
                cronologia,signo,idunidadmedida,idelementogasto,idclasificacion
              )
        	  SELECT v_iddocumentorecep,v_proddestino.proddestino,preciocontable,importecontable,cantidad,
                (select cronologia from mod_logistica.dat_documento where iddocumento = v_iddocumentorecep),
                '+',idunidadmedida,idelementogasto,idclasificacion
                FROM mod_logistica.dat_movimiento WHERE iddocumento = v_iddocumentotransf
              and idproducto = v_proddestino.idproducto
              returning idmovimiento, preciocontable, idproducto, cantidad, cronologia
          ), movmoneda as (
              insert into mod_logistica.dat_movmoneda
            (
                idmovimiento, idmoneda, precio
            )
            select idmovimiento, v_idmoneda, preciocontable from movimientoEntrada
          )--Falta adicionar el nuevo lote
          /*, movlote as (INSERT INTO
              mod_logistica.dat_movlote
            (
              idlote,idmovimiento,cantidad,idubicacion
            )-- tengo que crear un idlote nuevo para el producto nuevo
            SELECT pl.idlote,mv.idmovimiento,pl.cantidad, -1 from movimientoEntrada mv
            inner join mod_logdistribucion.dat_prodorden po on po.idproducto = v_proddestino.idproducto
            		and po.idorden = v_iddocumentodist
            inner join mod_logdistribucion.dat_prodordenlote pl on pl.idprodordenlote = po.idprodorden
            and pl.idprodordenlote = po.idprodorden
          )*/
            update mod_logistica.dat_producto as dp
            set cantidad = dp.cantidad + ms.cantidad,cronologia = ms.cronologia,
            precio = (round(dp.importe + (ms.preciocontable*ms.cantidad),2))/(dp.cantidad+ms.cantidad),
            importe = (round(dp.importe + (ms.preciocontable*ms.cantidad), 2))
            from movimientoEntrada ms
            where dp.idproducto = ms.idproducto
            returning ms.idmovimiento, dp.cantidad, dp.precio, dp.importe into v_movimiento;

            update mod_logistica.dat_movimiento
            set existenciaactual=v_movimiento.cantidad ,preciopromedio=v_movimiento.precio,
            importetotal=v_movimiento.importe
            where idmovimiento = v_movimiento.idmovimiento;


    end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.f_aprobartransfinterna (p_iddocumento numeric, p_idusuario numeric, p_cronologia numeric)
  OWNER TO zeolides;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_loginventario.dat_prodtransfinterna TO zeolides;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_loginventario.dat_transfinterna TO zeolides;
/*GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_loginventario.dat_transfinternalote TO zeolides;  */
ALTER SEQUENCE mod_loginventario.sec_dadprodtransfinterna_seq
  OWNER TO zeolides;
ALTER SEQUENCE mod_loginventario.sec_dattransfinternalote_seq
  OWNER TO zeolides;

 /*
INSERT INTO
  mod_logistica.nom_variableglobal
(
  nombre,
  valor
)
VALUES (
  'farmacia',
  '0'
);*/

ALTER TABLE mod_loginventario.dat_transfinterna
  ADD COLUMN idoperaciondestino NUMERIC(19,0);

COMMENT ON COLUMN mod_loginventario.dat_transfinterna.idoperaciondestino
IS 'Id de la operacion por la cual se va a generar la recepcion.';

ALTER TABLE mod_loginventario.dat_transfinterna
  ADD CONSTRAINT dat_transfinterna_fk4 FOREIGN KEY (idoperaciondestino)
    REFERENCES mod_datosmaestros.nom_operacion(idnomoperaciones)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;