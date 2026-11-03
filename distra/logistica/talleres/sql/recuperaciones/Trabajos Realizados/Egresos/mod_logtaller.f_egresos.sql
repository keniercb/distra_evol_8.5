DROP FUNCTION IF EXISTS mod_logtaller.f_egresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric);
						 --mod_logtaller.f_egresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric, character varying)
DROP TYPE IF EXISTS mod_logtaller.td_egresos;

CREATE TYPE mod_logtaller.td_egresos AS
(
	nrdoc numeric(19,0),
	fechainicio date,
	fechafin date,
	medio character varying(255),
	cliente character varying(255),
	nrofactura text,
	logo text,
	modelo character varying(255),
	marca character varying(255),
	atributoidentificador character varying(255),
	entidad character varying(255),
	prod character varying(255)
);

ALTER TYPE mod_logtaller.td_egresos OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logtaller.f_egresos(
	fechainicio date,
	fechafin date,
	estados character varying,
	idmedios character varying,
	idtecnicos character varying,
	idservicios character varying,
	p_idestructuracomun numeric,
	p_idsubsistema numeric)
    RETURNS SETOF mod_logtaller.td_egresos 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

    DECLARE
    v_rec mod_logtaller.td_egresos;
    v_ejerciciocontable record;
    v_idejercicio numeric;
    BEGIN

        for v_rec in
		with num_facturas as (select replace( (replace( (array_agg (ddf.nrofactura)::text), '{','' )), '}','' ) as nrofacturas, 
									docp.idpadre from mod_logfacturacion.dat_docfactura ddf
            					inner join mod_logistica.dat_documentopadre docp on docp.iddocumento = ddf.idfactura            
								group by docp.idpadre
	 							)		
            SELECT
            d.nrodoc,
            o.fechainicio,
            o.fechafin,            
            de.denominacion as medio,
            COALESCE(ncp.nombre,COALESCE(_de.denominacion,(dp.nombre || ' ' || dp.papel || ' ' ||dp.sapel))) as cliente,
 			nf.nrofacturas as nrofactura,
            i.urllogo,
            '' as modelo,
            '' as marca,
            o.atributoidentificador,
            de.denominacion as entidad,
            (select _ni.denominacion from mod_datosmaestros.nom_indicador _ni where _ni.idindicador = mo.idindicador) as prod
            FROM mod_logistica.dat_documento d            
			inner join mod_logtaller.dat_ordentrabajo o ON d.iddocumento = o.idordentrabajo
            inner join mod_logtaller.dat_medioorden mo ON o.idordentrabajo = mo.idordentrabajo
            inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = d.iddoc
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
            left join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = o.idcliente
            left join mod_estructuracomp.v_dametodasestructuras _de on _de.idestructura = ncp.idestructura
            left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona
            inner join mod_logistica.conf_general i on i.idestructura = de.idestructura
		    inner join num_facturas as nf on (nf.idpadre = d.iddocumento)
			where d.estado = 9            
          		and d.idestructuracomun = $7
            	and (o.idtecnico = any(cast($5 as numeric[])) or $5 is null)
            	and (mo.idmedio = any(cast($4 as numeric[])) or $4 is null) 
            	and ((o.fechainicio >= cast($1 as date) or $1 is null) and (o.fechafin <= cast($2 as date) or $2 is null))
            order by d.iddocumento
        loop
            return next v_rec;
        end loop;
    END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_egresos(date, date, character varying, character varying, character varying, character varying, numeric, numeric) OWNER TO zeolides;
