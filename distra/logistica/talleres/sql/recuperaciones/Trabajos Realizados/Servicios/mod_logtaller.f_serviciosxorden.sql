-- FUNCTION: mod_logtaller.f_serviciosxorden(date, date, character varying, character varying, character varying, character varying, numeric, numeric, character varying)

DROP FUNCTION IF EXISTS mod_logtaller.f_serviciosxorden(date, date, character varying, character varying, character varying, character varying, numeric, numeric, character varying);
--adicional
DROP FUNCTION IF EXISTS mod_logtaller.f_serviciosxorden(date, date, character varying, character varying, character varying, character varying, numeric, numeric);

DROP TYPE IF EXISTS mod_logtaller.td_serviciosxorden;

CREATE TYPE mod_logtaller.td_serviciosxorden AS
(
	nrdoc numeric(19,0),
	servicio character varying(255),
	entidad character varying(100),
	medio character varying(255),
	logo text,
	modelo character varying(255),
	marca character varying(255),
	atributoidentificador character varying(255)
);

ALTER TYPE mod_logtaller.td_serviciosxorden OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logtaller.f_serviciosxorden(
	fechainicio date,
	fechafin date,
	estados character varying,
	idmedios character varying,
	idtecnicos character varying,
	idservicios character varying,
	p_idestructuracomun numeric,
	p_idsubsistema numeric,
	p_arrayordenes character varying)
    RETURNS SETOF mod_logtaller.td_serviciosxorden 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

    DECLARE
    v_rec mod_logtaller.td_serviciosxorden;
    v_ejerciciocontable record;
    v_idejercicio numeric;

    BEGIN

        for v_rec in
            SELECT
            d.nrodoc,
            na.denominacion,
            e.denominacion,
            (select _ni.denominacion from mod_datosmaestros.nom_indicador _ni where _ni.idindicador = mo.idindicador),
            i.urllogo,
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
            inner join mod_logtaller.conf_actividad na on na.idactividad = ts.idservicio
            inner join mod_datosmaestros.dat_documentoprim r on r.iddoc = d.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = r.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = es.idestructuracomun
            inner join mod_logistica.conf_general i on i.idestructura = e.idestructura
            where d.estado = any(cast($3 as numeric[]))
                  	and d.idestructuracomun = $7
            		and (ts.idservicio = any(cast($6 as numeric[])) or $6 is null)
		            and (o.idtecnico = any(cast($5 as numeric[])) or $5 is null)
		            and (mo.idmedio = any(cast($4 as numeric[])) or $4 is null)
		            and (o.fechainicio >= cast($1 as date) or $1 is null)
		            and (o.fechafin    <= cast($2 as date) or $2 is null)
            group by  na.denominacion  ,e.denominacion ,mo.idindicador ,d.nrodoc,i.urllogo,nmo.denominacion, nma.denominacion, o.atributoidentificador
            order by na.denominacion
        loop
            return next v_rec;
        end loop;

    END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_serviciosxorden(date, date, character varying, character varying, character varying, character varying, numeric, numeric, character varying)
    OWNER TO zeolides;

--adicional
-- FUNCTION: mod_logtaller.f_serviciosxorden(date, date, character varying, character varying, character varying, character varying, numeric, numeric)

CREATE OR REPLACE FUNCTION mod_logtaller.f_serviciosxorden(
	fechainicio date,
	fechafin date,
	estados character varying,
	idmedios character varying,
	idtecnicos character varying,
	idservicios character varying,
	p_idestructuracomun numeric,
	p_idsubsistema numeric)
    RETURNS SETOF mod_logtaller.td_serviciosxorden 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

    DECLARE
    v_rec mod_logtaller.td_serviciosxorden;
    v_ejerciciocontable record;
    v_idejercicio numeric;

    BEGIN
        for v_rec in
            SELECT
            d.nrodoc,
            na.denominacion,
            e.denominacion,
            (select _ni.denominacion from mod_datosmaestros.nom_indicador _ni where _ni.idindicador = mo.idindicador),
            i.urllogo,
            nmo.denominacion as modelo,
            nma.denominacion as marca,
            o.atributoidentificador
            from mod_logistica.dat_documento d
            inner join mod_logtaller.dat_ordentrabajo o ON d.iddocumento = o.idordentrabajo
            inner join mod_logtaller.dat_medioorden mo ON o.idordentrabajo = mo.idordentrabajo
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = mo.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
            left join mod_datosmaestros.nom_marca nma on nma.idmarca = nih.idmarca
            left join mod_datosmaestros.nom_modelo nmo on nmo.idmodelo = nih.idmodelo
            inner join mod_logtaller.dat_trabajoservicio ts on ts.idordentrabajo = o.idordentrabajo
            inner join mod_logtaller.conf_actividad na on na.idactividad = ts.idservicio
            inner join mod_datosmaestros.dat_documentoprim r on r.iddoc = d.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = r.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = es.idestructuracomun
            inner join mod_logistica.conf_general i on i.idestructura = e.idestructura
            where d.estado = any(cast($3 as numeric[]))            
            and d.idestructuracomun = $7
            and (ts.idservicio = any(cast($6 as numeric[])) or $6 is null)
            and (o.idtecnico = any(cast($5 as numeric[])) or $5 is null)
            and (mo.idmedio = any(cast($4 as numeric[])) or $4 is null)
            and (o.fechainicio >= cast($1 as date) or $1 is null)
            and (o.fechafin <= cast($2 as date) or $2 is null)
            group by  na.denominacion  ,e.denominacion ,mo.idindicador ,d.nrodoc,i.urllogo,nmo.denominacion, nma.denominacion, o.atributoidentificador
            order by na.denominacion
        loop
            return next v_rec;
        end loop;

    END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_serviciosxorden(date, date, character varying, character varying, character varying, character varying, numeric, numeric)
    OWNER TO zeolides;
