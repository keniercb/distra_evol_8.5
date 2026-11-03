CREATE OR REPLACE FUNCTION mod_logactivofijotangible.fr_listaraftporoperacion (
  arrayidestructura varchar,
  arrayidoperacion varchar,
  "fechaInicio" varchar,
  "fechaFin" varchar,
  idestructura numeric
)
RETURNS SETOF mod_logactivofijotangible.tdr_listaraftoperacion AS
$body$
DECLARE

  v_rec mod_logactivofijotangible.tdr_listaraftoperacion;
  
BEGIN

	FOR v_rec IN
    	SELECT 
        	COALESCE(de.denominacion, deop.denominacion) as entidad,
        	de_area.denominacion as arearesponsabilidad,
            rna.denominacion as denomindicador,
            rna.nroinventario,
			et.denominacion as estado,
            oper.denominacion as operacion,
            d.fechacontable as fechadoc,
            d.nrodoc as nrodoc,
            comp.numerocomprobante
        FROM mod_logistica.dat_documento d
        INNER JOIN mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
        INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = m.idmovimiento
        INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
        INNER JOIN mod_logactivofijotangible.nom_estatustecnico et on et.idestatustecnico = mrna.idestatustecnico
		INNER JOIN mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = mrn.idregnumerico
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        INNER JOIN mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = d.idoperacion
		LEFT JOIN mod_contabilidad.dat_comprobante comp on comp.idcomprobante = d.idcomprobante
		-- Area
        INNER JOIN mod_estructuracomp.dat_estructuraop de_area on de_area.idestructuraop = d.idestructuracomun
        -- Entidad
        LEFT JOIN mod_estructuracomp.dat_estructura de on de.idestructura = $5
        LEFT JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = $5        
        WHERE 
        case when $3 is not null and $4 is null then ((d.fechacontable) >= cast($3 as DATE)) 
        when $4 is not null and $3 is null then ((d.fechacontable) <= cast($4 as DATE))  
        when $3 is not null and $4 is not null 
        	then(
                 (d.fechacontable) >= cast($3 as DATE) and        
         	(d.fechacontable) <= cast($4 as DATE)
      			) else true end 
                and 
           (d.idestructuracomun = any(cast($1 as numeric[]))) and
           (d.idoperacion = any(cast($2 as numeric[]))) and
            d.estado = 3
    LOOP
    	return next v_rec;
    END LOOP;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.fr_listaraftporoperacion (arrayidestructura varchar, arrayidoperacion varchar, "fechaInicio" varchar, "fechaFin" varchar, idestructura numeric)
  OWNER TO zeolides;