CREATE OR REPLACE FUNCTION mod_loginventario.f_mercanciatransito (
  estructuradest varchar,
  estructuraorig varchar,
  p_fechainicio date,
  p_fechafin date,
  p_start numeric,
  p_limit numeric,
  p_diferencia boolean
)
RETURNS SETOF mod_loginventario.td_mercanciatransito AS
$body$
    DECLARE

    v_rec mod_loginventario.td_mercanciatransito;

    BEGIN
        	for v_rec in
    select count(*) OVER() as total,estt.denominacion,
        ndp.denominacion as tipodocumento,
         COALESCE(df.nrofactura, dd.nrodoc) nrodocorigen,
         COALESCE(dd.observaciones) obs,
         
         COALESCE(dd.fechacontable) fhdocorigen,
         COALESCE(com.numerocomprobante) comprob, /*COALESCE(ctc.) comprob,*/
        (case when dd.estado = 4 then 'Contabilizado' when dd.estado = 2 then 'Preparado' when dd.estado = 1 then 'Elaboracion' else 'Otro' end) as estado,
        (case when df.idfactura is null then
        (select sum(dm.importecontable) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento)
        else
        (select sum(round(dmm.precio*dm.cantidad,2)) from mod_logistica.dat_movimiento dm
        inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
        where dm.iddocumento = dd.iddocumento and dmm.idmoneda = 9900000000)
        end) as importe_doc,
        (select sum(dm.importecontable) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento) as Imp_contable,
        coalesce(ncp.descripcion, estd.denominacion) as ueb,
        coalesce(dd1.nrodoc, dd1.numeroref) as doc_destino,
        coalesce(dd1.fechacontable) as fechdoc_destino,
        coalesce(dd1.idcomprobante, dd1.numeroref) as doc_destino_COMPR,
        (case when dd1.estado = 4 then 'Contabilizado' when dd1.estado = 2 then 'Preparado' when dd1.estado = 1 then 'Elaboracion' else 'Otro' end) as estadodest,
        COALESCE((select sum(dm.importecontable) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd1.iddocumento),0) as importe_dest,
        ((case when df.idfactura is null then
        (select sum(dm.importecontable) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento)
        else
        (select sum(round(dmm.precio*dm.cantidad,2)) from mod_logistica.dat_movimiento dm
        inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
        where dm.iddocumento = dd.iddocumento and dmm.idmoneda = 9900000000)
        end) - COALESCE((select sum(dm.importecontable) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd1.iddocumento),0)) as diferencia,
        dd1.nrodoc as distpadre,
        dd1.fechacontable as fechadistpadre
        from mod_logistica.dat_documento dd
        inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
        inner join mod_estructuracomp.v_dametodasestructuras estt on estt.idestructura = des.idestructuracomun
        inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
        left join mod_contabilidad.dat_comprobante com on com.idcomprobante = dd.idcomprobante
        left join mod_estructuracomp.v_dametodasestructuras estd on estd.idestructura = ddc.idcliente
        left join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = ddc.idcliente
        left join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
        left join mod_logistica.dat_documentopadre dp on dp.idpadre = dd.iddocumento
        left join mod_logistica.dat_documento dd1 on dd1.iddocumento = dp.iddocumento
        where ndp.abreviatura in ('facturaLog', 'transferenciaLog') and dd.estado = 4
        and (case when estructuraorig is not null then estt.idestructura = any(cast(estructuraorig as numeric[])) else true end )
        and (case when estructuradest is null then (
        	(case when ncp.idclientesproveedores is null then ddc.idcliente in (
            	select vdm.idestructura
                from mod_estructuracomp.nom_filaestruc f
                inner join mod_estructuracomp.v_dametodasestructuras vdm on f.idfila = vdm.idestructura

                where  (vdm.idconcepto = 3 or (vdm.idconcepto = 5 and vdm.idorgano = -2))
            ) else ncp.idestructura in (
            	select vdm.idestructura
                from mod_estructuracomp.nom_filaestruc f
                inner join mod_estructuracomp.v_dametodasestructuras vdm on f.idfila = vdm.idestructura

                where  (vdm.idconcepto = 3 or (vdm.idconcepto = 5 and vdm.idorgano = -2))
            ) end)
        ) else (
        	(case when ncp.idclientesproveedores is null then ddc.idcliente = any(cast(estructuradest as numeric[]))  else ncp.idestructura = any(cast(estructuradest as numeric[])) end)
        ) end)

        and (case when p_fechainicio is not null then dd.fechacontable >= p_fechainicio else true end)
        and (case when p_fechafin is not null then dd.fechacontable <= p_fechafin else true end)
        and (case when p_diferencia is true then (
    	((case when df.idfactura is null then
        (select sum(dm.importecontable) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd.iddocumento)
        else
        (select sum(round(dmm.precio*dm.cantidad,2)) from mod_logistica.dat_movimiento dm
        inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
        where dm.iddocumento = dd.iddocumento and dmm.idmoneda = 9900000000)
        end) - COALESCE((select sum(dm.importecontable) from mod_logistica.dat_movimiento dm where dm.iddocumento = dd1.iddocumento),0)) <> 0)else true end)

        limit p_limit
        offset p_start
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

ALTER FUNCTION mod_loginventario.f_mercanciatransito (estructuradest varchar, estructuraorig varchar, p_fechainicio date, p_fechafin date, p_start numeric, p_limit numeric, p_diferencia boolean)
  OWNER TO zeolides;