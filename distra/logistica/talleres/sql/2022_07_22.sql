CREATE TYPE mod_logtaller.td_ordenfactura AS (
  iddocumento NUMERIC(19,0),
  nrodoc NUMERIC(19,0),
  cliente VARCHAR(255),
  fechacierre DATE,
  importe NUMERIC(19,2),
  nocomprobante NUMERIC(19,0),
  nofactura NUMERIC(19,0),
  servicios VARCHAR(255)
);

CREATE OR REPLACE FUNCTION mod_logtaller.f_ordenfactura (
  p_fechainicio date,
  p_fechafin date,
  tiporeporte numeric
)
RETURNS SETOF mod_logtaller.td_ordenfactura AS
$body$
    DECLARE

    v_rec mod_logtaller.td_ordenfactura;
	v_idoperacioninterna numeric(19,0);
	
    BEGIN
    v_idoperacioninterna := -1;
	select nv.valor::numeric(19,0) into v_idoperacioninterna
    from mod_logistica.nom_variableglobal nv                       
    where nv.nombre = 'OPER_TALL_INTERNO'
    limit 1;
    
    
    if tiporeporte = 1 then 
    	for v_rec in
           SELECT
        d.iddocumento,   
        d.nrodoc ,
        cp.codigo ||' '|| cp.nombre as cliente,
        ot.fechacierre, 
        (coalesce((SELECT sum(coalesce(dm.importecup,0) + coalesce(dm.importecuc,0)) FROM mod_logtaller.dat_material dm where dm.idordentrabajo = d.iddocumento),0) 
        + coalesce((SELECT sum(coalesce(da.costo,0) + coalesce(da.importealternativo,0)) FROM mod_logtaller.dat_ordenactividad da where da.idordentrabajo = d.iddocumento),0)) as importe,
      	null as nocomprobante,
        null as nofactura,
        act.denominacion as servicio 
        from mod_logistica.dat_documento d 
        inner join mod_logtaller.dat_ordentrabajo ot on ot.idordentrabajo = d.iddocumento
        inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento and dc.tipocliente=1
        inner join mod_datosmaestros.nom_clientesproveedor cp on cp.idclientesproveedores = dc.idcliente
        inner join mod_logtaller.dat_trabajoservicio s on s.idordentrabajo = d.iddocumento
        inner join mod_logtaller.conf_actividad act on act.idactividad=s.idservicio 
        WHERE d.estado = 9  and (case when d.idoperacion is not null then d.idoperacion = v_idoperacioninterna else true end) 
        and (case when p_fechainicio is not null then ot.fechacierre >= p_fechainicio else true end)
        and (case when p_fechafin is not null then ot.fechacierre <= p_fechafin else true end) 
        
        group by d.iddocumento, d.nrodoc, cp.codigo ||' '|| cp.nombre, act.denominacion, ot.fechacierre 
        loop
            return next v_rec;
        end loop;
    elseif tiporeporte = 2 then
    for v_rec in
           SELECT
        d.iddocumento,   
        d.nrodoc ,
        cp.codigo ||' '|| cp.nombre as cliente,
        ot.fechacierre, 
        (coalesce((SELECT sum(coalesce(dm.importecup,0) + coalesce(dm.importecuc,0)) FROM mod_logtaller.dat_material dm where dm.idordentrabajo = d.iddocumento),0) 
        + coalesce((SELECT sum(coalesce(da.costo,0) + coalesce(da.importealternativo,0)) FROM mod_logtaller.dat_ordenactividad da where da.idordentrabajo = d.iddocumento),0)) as importe,
      	null as nocomprobante,
        null as nofactura,
         act.denominacion as servicio 
        from mod_logistica.dat_documento d 
        inner join mod_logtaller.dat_ordentrabajo ot on ot.idordentrabajo = d.iddocumento
        inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento and dc.tipocliente=1
        inner join mod_datosmaestros.nom_clientesproveedor cp on cp.idclientesproveedores = dc.idcliente
        inner join mod_logtaller.dat_trabajoservicio s on s.idordentrabajo = d.iddocumento
        inner join mod_logtaller.conf_actividad act on act.idactividad=s.idservicio 
        WHERE d.estado = 9 and (case when d.idoperacion is not null then d.idoperacion <> v_idoperacioninterna else true end)
        and (case when p_fechainicio is not null then ot.fechacierre >= p_fechainicio else true end)
        and (case when p_fechafin is not null then ot.fechacierre <= p_fechafin else true end) 
        group by d.iddocumento, d.nrodoc, cp.codigo ||' '|| cp.nombre, act.denominacion, ot.fechacierre   
        loop
            return next v_rec;
        end loop;
    elseif tiporeporte = 3 then
    for v_rec in
            SELECT
        d.iddocumento,   
        d.nrodoc ,
        cp.codigo ||' '|| cp.nombre as cliente,
        ot.fechacierre, 
        (coalesce((SELECT sum(coalesce(dm.importecup,0) + coalesce(dm.importecuc,0)) FROM mod_logtaller.dat_material dm where dm.idordentrabajo = d.iddocumento),0) 
        + coalesce((SELECT sum(coalesce(da.costo,0) + coalesce(da.importealternativo,0)) FROM mod_logtaller.dat_ordenactividad da where da.idordentrabajo = d.iddocumento),0)) as importe,
      	null as nocomprobante,
        null as nofactura,
         act.denominacion as servicio 
        from mod_logistica.dat_documento d 
        inner join mod_logtaller.dat_ordentrabajo ot on ot.idordentrabajo = d.iddocumento
        inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento and dc.tipocliente=1
        inner join mod_datosmaestros.nom_clientesproveedor cp on cp.idclientesproveedores = dc.idcliente
        inner join mod_logtaller.dat_trabajoservicio s on s.idordentrabajo = d.iddocumento
        inner join mod_logtaller.conf_actividad act on act.idactividad=s.idservicio 
        inner join mod_logistica.dat_documentopadre dp on dp.idpadre = d.iddocumento 
        inner join mod_logistica.dat_documento dd on dd.iddocumento = dp.iddocumento
        inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
        WHERE d.estado = 9 and (dd.estado = 7 )
        and (case when p_fechainicio is not null then ot.fechacierre >= p_fechainicio else true end)
        and (case when p_fechafin is not null then ot.fechacierre <= p_fechafin else true end)
        group by d.iddocumento, d.nrodoc, cp.codigo ||' '|| cp.nombre, act.denominacion, ot.fechacierre  
        loop
            return next v_rec;
        end loop;
    elseif tiporeporte = 4 then
    for v_rec in
         SELECT
        d.iddocumento,   
        d.nrodoc ,
        cp.codigo ||' '|| cp.nombre as cliente,
        ot.fechacierre, 
        (coalesce((SELECT sum(coalesce(dm.importecup,0) + coalesce(dm.importecuc,0)) FROM mod_logtaller.dat_material dm where dm.idordentrabajo = d.iddocumento),0) 
        + coalesce((SELECT sum(coalesce(da.costo,0) + coalesce(da.importealternativo,0)) FROM mod_logtaller.dat_ordenactividad da where da.idordentrabajo = d.iddocumento),0)) as importe,
      	dcmp.numerocomprobante  as nocomprobante,
        null as nofactura,
         act.denominacion as servicio 
        from mod_logistica.dat_documento d 
        inner join mod_logtaller.dat_ordentrabajo ot on ot.idordentrabajo = d.iddocumento
        inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento and dc.tipocliente=1
        inner join mod_datosmaestros.nom_clientesproveedor cp on cp.idclientesproveedores = dc.idcliente
        inner join mod_logtaller.dat_trabajoservicio s on s.idordentrabajo = d.iddocumento
        inner join mod_logtaller.conf_actividad act on act.idactividad=s.idservicio 
        inner join mod_contabilidad.dat_comprobante dcmp on dcmp.idcomprobante = d.idcomprobante
        WHERE d.estado = 9 
        and (case when p_fechainicio is not null then ot.fechacierre >= p_fechainicio else true end)
        and (case when p_fechafin is not null then ot.fechacierre <= p_fechafin else true end)
        group by d.iddocumento, d.nrodoc, cp.codigo ||' '|| cp.nombre, act.denominacion, ot.fechacierre,dcmp.numerocomprobante    
        loop
            return next v_rec;
        end loop;
    elseif tiporeporte = 5 then 
    for v_rec in
         SELECT
        d.iddocumento,   
        d.nrodoc ,
        cp.codigo ||' '|| cp.nombre as cliente,
        ot.fechacierre, 
        (coalesce((SELECT sum(coalesce(dm.importecup,0) + coalesce(dm.importecuc,0)) FROM mod_logtaller.dat_material dm where dm.idordentrabajo = d.iddocumento),0) 
        + coalesce((SELECT sum(coalesce(da.costo,0) + coalesce(da.importealternativo,0)) FROM mod_logtaller.dat_ordenactividad da where da.idordentrabajo = d.iddocumento),0)) as importe,
      	dcmp.numerocomprobante as nocomprobante,
        df.nrofactura as nofactura,
         act.denominacion as servicio 
        from mod_logistica.dat_documento d 
        inner join mod_logtaller.dat_ordentrabajo ot on ot.idordentrabajo = d.iddocumento
        inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento and dc.tipocliente=1
        inner join mod_datosmaestros.nom_clientesproveedor cp on cp.idclientesproveedores = dc.idcliente
        inner join mod_logtaller.dat_trabajoservicio s on s.idordentrabajo = d.iddocumento
        inner join mod_logtaller.conf_actividad act on act.idactividad=s.idservicio 
        inner join mod_logistica.dat_documentopadre dp on dp.idpadre = d.iddocumento 
        inner join mod_logistica.dat_documento dd on dd.iddocumento = dp.iddocumento
        inner join mod_contabilidad.dat_comprobante dcmp on dcmp.idcomprobante = dd.idcomprobante
        inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
        WHERE d.estado = 9  and (d.idcomprobante is null)
        and (case when p_fechainicio is not null then ot.fechacierre >= p_fechainicio else true end)
        and (case when p_fechafin is not null then ot.fechacierre <= p_fechafin else true end)
        group by d.iddocumento, d.nrodoc, cp.codigo ||' '|| cp.nombre, act.denominacion, ot.fechacierre,dcmp.numerocomprobante,df.nrofactura     
        loop
            return next v_rec;
        end loop;
    end if;
   

        
    END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;
