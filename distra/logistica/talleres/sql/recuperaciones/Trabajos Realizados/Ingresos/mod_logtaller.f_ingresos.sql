-- FUNCTION: mod_logtaller.f_ingresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric, character varying)

DROP FUNCTION IF EXISTS mod_logtaller.f_ingresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric, character varying);
--alternativa
DROP FUNCTION IF EXISTS mod_logtaller.f_ingresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric);

DROP TYPE IF EXISTS mod_logtaller.td_ingresos;

CREATE TYPE mod_logtaller.td_ingresos AS
(
	nrdoc numeric(19,0),
	entidad character varying(100),
	fechainicio date,
	fechafin date,
	medio character varying(255),
	motivo character varying(255),
	fechaentrada date,
	cliente character varying(255),
	logo text,
	modelo character varying(255),
	marca character varying(255),
	atributoidentificador character varying(255),
	estadia character varying(100)
);

ALTER TYPE mod_logtaller.td_ingresos OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logtaller.f_ingresos(
	fechainicio date,
	fechafin date,
	estados character varying,
	idmedios character varying,
	idtecnicos character varying,
	idservicios character varying,
	p_idestructuracomun numeric,
	p_idsubsistema numeric,
	p_centrocosto character varying)
    RETURNS SETOF mod_logtaller.td_ingresos 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

    DECLARE
    v_rec mod_logtaller.td_ingresos;
    
    BEGIN
        for v_rec in
            SELECT distinct d.nrodoc, e.denominacion, o.fechainicio
	            ,o.fechafin
		        ,(select _ni.denominacion from mod_datosmaestros.nom_indicador _ni where _ni.idindicador = mo.idindicador)
			    ,o.fallascliente
	            ,o.fechainicio
	            ,COALESCE(ncp.codigo||' '||ncp.nombre,COALESCE(de.denominacion,(dp.nombre || ' ' || dp.papel || ' ' ||dp.sapel)))
	            ,i.urllogo,
	            nmo.denominacion as modelo,
	            nma.denominacion as marca,
	            o.atributoidentificador
				, EXTRACT(DAY from now()::timestamp - o.fechainicio::timestamp) 
            FROM mod_logistica.dat_documento d
            INNER JOIN mod_logtaller.dat_ordentrabajo o ON d.iddocumento = o.idordentrabajo
            INNER JOIN mod_logistica.dat_documentocliente dc ON d.iddocumento = dc.iddocumento
            INNER JOIN mod_logtaller.dat_medioorden mo ON o.idordentrabajo = mo.idordentrabajo
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = mo.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
            left join mod_datosmaestros.nom_marca nma on nma.idmarca = nih.idmarca
            left join mod_datosmaestros.nom_modelo nmo on nmo.idmodelo = nih.idmodelo
            inner join mod_logtaller.dat_trabajoservicio ts on ts.idordentrabajo = o.idordentrabajo
            inner join mod_datosmaestros.dat_documentoprim r on r.iddoc = d.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = r.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = es.idestructuracomun
            INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = o.idcliente
            left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
            left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
            inner join mod_logistica.conf_general i on i.idestructura = e.idestructura
            where d.estado in (1,2)
            	and d.idestructuracomun = $7
	            and (ts.idservicio = any(cast($6 as numeric[])) or $6 is null)
	            and (o.idtecnico = any(cast($5 as numeric[])) or $5 is null)
	            and (mo.idmedio = any(cast($4 as numeric[])) or $4 is null)
	            and ((o.fechainicio >= cast($1 as date) or $1 is null) and 
    		        (o.fechafin <= cast($2 as date) or $2 is null))
				and (dc.idcliente = cast($9 as numeric) or $9 is null)
            order by o.fechainicio asc
        loop
            return next v_rec;
        end loop;
    END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_ingresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric, character varying) OWNER TO zeolides;

--alternativa
-- FUNCTION: mod_logtaller.f_ingresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric)

CREATE OR REPLACE FUNCTION mod_logtaller.f_ingresos(
	fechainicio date,
	fechafin date,
	estados character varying,
	idmedios character varying,
	idtecnicos character varying,
	idservicios character varying,
	p_idestructuracomun numeric,
	p_idsubsistema numeric)
    RETURNS SETOF mod_logtaller.td_ingresos 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

    DECLARE
    v_rec mod_logtaller.td_ingresos;

    BEGIN
        for v_rec in
            SELECT d.nrodoc, e.denominacion
	            ,o.fechainicio
	            ,o.fechafin
	            ,(select _ni.denominacion from mod_datosmaestros.nom_indicador _ni where _ni.idindicador = mo.idindicador)
	            ,o.fallascliente
	            ,d.fechacontable
	            ,COALESCE(ncp.nombre,COALESCE(de.denominacion,(dp.nombre || ' ' || dp.papel || ' ' ||dp.sapel)))
	            ,i.urllogo,
	            nmo.denominacion as modelo,
	            nma.denominacion as marca,
	            o.atributoidentificador
            FROM mod_logistica.dat_documento d
            INNER JOIN mod_logtaller.dat_ordentrabajo o ON d.iddocumento = o.idordentrabajo
            INNER JOIN mod_logtaller.dat_medioorden mo ON o.idordentrabajo = mo.idordentrabajo
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = mo.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
            left join mod_datosmaestros.nom_marca nma on nma.idmarca = nih.idmarca
            left join mod_datosmaestros.nom_modelo nmo on nmo.idmodelo = nih.idmodelo
            inner join mod_logtaller.dat_trabajoservicio ts on ts.idordentrabajo = o.idordentrabajo
            inner join mod_datosmaestros.dat_documentoprim r on r.iddoc = d.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = r.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = es.idestructuracomun
            INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = o.idcliente
            left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
            left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
            inner join mod_logistica.conf_general i on i.idestructura = e.idestructura
            where d.estado = 2
	            and d.idestructuracomun = $7
	            and (ts.idservicio = any(cast($6 as numeric[])) or $6 is null)
	            and (o.idtecnico = any(cast($5 as numeric[])) or $5 is null)
	            and (mo.idmedio = any(cast($4 as numeric[])) or $4 is null)
	            and ((o.fechainicio >= cast($1 as date) or $1 is null) and (o.fechafin <= cast($2 as date) or $2 is null))
        loop
            return next v_rec;
        end loop;

    END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_ingresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric) OWNER TO zeolides;
