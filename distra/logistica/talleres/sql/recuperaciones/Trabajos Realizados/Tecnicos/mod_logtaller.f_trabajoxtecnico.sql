-- FUNCTION: mod_logtaller.f_trabajoxtecnico(date, date, character varying, character varying, character varying, numeric, numeric, character varying)

DROP FUNCTION IF EXISTS mod_logtaller.f_trabajoxtecnico(date, date, character varying, character varying, character varying, numeric, numeric, character varying);
--alternativa
DROP FUNCTION IF EXISTS mod_logtaller.f_trabajoxtecnico(date, date, character varying, character varying, character varying, numeric, numeric);

DROP TYPE IF EXISTS mod_logtaller.td_trabajoxtecnico;

CREATE TYPE mod_logtaller.td_trabajoxtecnico AS
(
	nrdoc numeric(19,0),
	entidad character varying(100),
	fechainicio date,
	fechafin date,
	tecnico character varying(255),
	tiempoplanificado numeric(25,6),
	tiemporeal numeric(25,6),
	actividad character varying(255),
	logo text,
	preciocup numeric(25,6),
	importecup numeric(19,2),
	precioalternativo numeric(25,6),
	importealternativo numeric(19,2)
);

ALTER TYPE mod_logtaller.td_trabajoxtecnico OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logtaller.f_trabajoxtecnico(
	fechainicio date,
	fechafin date,
	idmedios character varying,
	idtecnicos character varying,
	idservicios character varying,
	p_idestructuracomun numeric,
	p_idsubsistema numeric,
	p_estados character varying)
    RETURNS SETOF mod_logtaller.td_trabajoxtecnico 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    DECLARE
    v_rec mod_logtaller.td_trabajoxtecnico;
    BEGIN

        for v_rec in 
            SELECT d.nrodoc,e.denominacion,coalesce(o.fechacierre,d.fechacontable),o.fechafin,
            		COALESCE((select concat(a.nombre, ' ', a.snombre , ' ' , a.papel , ' ' , a.sapel) 
            					from mod_persona.dat_persona a where a.idpersona = oa.idresponsable),'SIN OPERARIO') as tecnico,
             		coalesce(oa.tiempoplanificado,0),coalesce(oa.tiemporeal,0),
             		coalesce(ind.numeropieza,ind.codigo)||' '||oa.denominacion as actividad,i.urllogo,
		
             		(case when d.estado = 2 or d.estado = 1 then oa.precio
             				else coalesce( (select desg.preciotarifa from mod_logfacturacion.dat_desgloselemento desg
             									inner join mod_logfacturacion.dat_elementosfactura delef using(idelementofactura)
             									inner join mod_logfacturacion.dat_prodservnomenclador dpsn using(idelementofactura)
             									inner join mod_logistica.dat_documento d4 on d4.iddocumento = delef.idfactura
             									inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = d4.iddocumento
             									where desg.idmoneda = 9900000000 and dpsn.idindicador = ind.idindicador and ddp.idpadre = o.idordentrabajo limit 1)
             		, 0) end) as preciocup,
		
             		(case when d.estado = 2 or d.estado = 1 then oa.tiemporeal*oa.precio else
             				coalesce((select desg.preciotarifa*delef.cantidad from mod_logfacturacion.dat_desgloselemento desg
             							inner join mod_logfacturacion.dat_elementosfactura delef using(idelementofactura)
             							inner join mod_logfacturacion.dat_prodservnomenclador dpsn using(idelementofactura)
             							inner join mod_logistica.dat_documento d4 on d4.iddocumento = delef.idfactura
             							inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = d4.iddocumento
            							where desg.idmoneda = 9900000000 and dpsn.idindicador = ind.idindicador and ddp.idpadre = o.idordentrabajo limit 1),
             		0) end) as importecup, 
		
             		coalesce(oa.precioalternativo,0), coalesce(oa.importealternativo,0)
            from mod_logistica.dat_documento d
            inner join mod_logtaller.dat_ordentrabajo o ON o.idordentrabajo = d.iddocumento
            left join mod_logistica.dat_documentopadre dp on dp.idpadre = d.iddocumento
            left join mod_logfacturacion.dat_docfactura df on df.idfactura = dp.iddocumento
            left join mod_logistica.dat_documento dd on dd.iddocumento = df.idfactura
            inner join mod_logtaller.dat_medioorden mo on mo.idordentrabajo = o.idordentrabajo
            left join mod_persona.dat_persona p on p.idpersona = o.idtecnico
            inner join mod_logtaller.dat_ordenactividad oa on oa.idordentrabajo = o.idordentrabajo
            inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = oa.idindicador
            left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ind.idumedida
            inner join mod_datosmaestros.dat_documentoprim r on r.iddoc = d.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = r.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = es.idestructuracomun
            inner join mod_logistica.conf_general i on i.idestructura = e.idestructura             
			where d.idestructuracomun = $6    
            	and (oa.idresponsable = any(cast($4 as numeric[]))or $4 is null) 
            	and(e.idestructura = $6 or $6 is null)            
            	and (mo.idmedio = any(cast($3 as numeric[]))or $3 is null)  
            	and (case	when $8 = '{9}' then (o.fechacierre >= cast($1 as date) or $1 is null)
            				when $8 = '{4}' then (dd.fechacontable >= cast($1 as date) or $1 is null)
             		else (o.fechainicio >= cast($1 as date) or $1 is null) end)  
            	and (case 	when $8 = '{9}' then (o.fechacierre <= cast($2 as date) or $2 is null)
            				when $8 = '{4}' then (dd.fechacontable <= cast($2 as date) or $2 is null)
             		else (o.fechainicio <= cast($2 as date) or $2 is null) end) 
            	and ((case when $8 = '{4}' then d.estado = 9 else d.estado = any(cast($8 as numeric[])) end) or $8 is null) 
            	and (case when $8 = '{4}' then dd.idcomprobante is not null and dd.estado = 4 else true end)
            group by e.denominacion,o.fechacierre,oa.idresponsable,p.nombre ,o.fechainicio ,o.fechafin ,
            d.nrodoc ,p.papel ,p.sapel ,oa.tiempoplanificado ,oa.tiemporeal, oa.denominacion ,
            i.urllogo,d.iddocumento,um.abreviaturaunidadmedida,ind.numeropieza,ind.codigo,
            oa.precio,oa.costo, oa.precioalternativo, oa.importealternativo, o.idtipoprecio, ind.idnaturaleza,o.idcliente,
            ind.idindicador, o.idordentrabajo
            order by oa.idresponsable, d.nrodoc
        loop
            return next v_rec;
        end loop;

    END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_trabajoxtecnico(date, date, character varying, character varying, character varying, numeric, numeric, character varying) OWNER TO zeolides;

--alternativa
-- FUNCTION: mod_logtaller.f_trabajoxtecnico(date, date, character varying, character varying, character varying, numeric, numeric)

CREATE OR REPLACE FUNCTION mod_logtaller.f_trabajoxtecnico(
	fechainicio date,
	fechafin date,
	idmedios character varying,
	idtecnicos character varying,
	idservicios character varying,
	p_idestructuracomun numeric,
	p_idsubsistema numeric)
    RETURNS SETOF mod_logtaller.td_trabajoxtecnico 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

    DECLARE
    v_rec mod_logtaller.td_trabajoxtecnico;

    BEGIN
        for v_rec in 
            SELECT
            d.nrodoc,
            e.denominacion,
            o.fechainicio,
            o.fechafin,
            (select concat(a.nombre, ' ', a.snombre , ' ' , a.papel , ' ' , a.sapel) from mod_persona.dat_persona a where a.idpersona = oa.idresponsable) as tecnico,
            oa.tiempoplanificado,
            oa.tiemporeal,
            oa.denominacion as actividad,
            i.urllogo
            FROM mod_logistica.dat_documento d
            inner JOIN mod_logtaller.dat_ordentrabajo o ON o.idordentrabajo = d.iddocumento
            inner join mod_logtaller.dat_medioorden mo on mo.idordentrabajo = o.idordentrabajo
            inner join mod_persona.dat_persona p on p.idpersona = o.idtecnico
            inner join mod_logtaller.dat_ordenactividad oa on oa.idordentrabajo = o.idordentrabajo
            inner join mod_logtaller.dat_trabajoservicio ts on ts.idordentrabajo = o.idordentrabajo
            inner join mod_datosmaestros.dat_documentoprim r on r.iddoc = d.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = r.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = es.idestructuracomun
            inner join mod_logistica.conf_general i on i.idestructura = e.idestructura            
            where (ts.idservicio = any(cast($5 as numeric[])) or $5 is null)  
	            and d.idestructuracomun = $6          
		        and (oa.idresponsable = any(cast($4 as numeric[]))or $4 is null) 
	            and(e.idestructura = $6 or $6 is null)   
    	        and (mo.idmedio = any(cast($3 as numeric[]))or $3 is null)           
        	    and (o.fechainicio >= cast($1 as date) or $1 is null)           
            	and (o.fechafin    <= cast($2 as date) or $2 is null)
            group by e.denominacion ,oa.idresponsable,p.nombre ,o.fechainicio ,o.fechafin ,d.nrodoc ,p.papel ,p.sapel ,oa.tiempoplanificado ,oa.tiemporeal, oa.denominacion ,i.urllogo,d.iddocumento
            order by d.iddocumento
        loop
            return next v_rec;
        end loop;

    END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_trabajoxtecnico(date, date, character varying, character varying, character varying, numeric, numeric) OWNER TO zeolides;
