CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_imprimirconteoutiles (
  iddocumento numeric,
  ordenadopor numeric = 1
)
RETURNS SETOF mod_logactivofijotangible.td_imprimirconteoutiles AS
$body$
DECLARE
  v_rec mod_logactivofijotangible.td_imprimirconteoutiles;
BEGIN
	
    for v_rec in
    	select 
        	'' as organismo, 
	        COALESCE(de.denominacion, '') as empresa,
            COALESCE(deop.denominacion, '') as unidad,
            COALESCE(deop_area.denominacion, de_area.denominacion) as area,
            COALESCE(i.numeropieza, i.codigo) as codigo,
            i.denominacion as denominacion,
            sum(mrna.valorcontable) as valorcup, 
            sum(mrna.valorcontablealternativo) as valorcuc,
            count(i.idindicador) as cantidad,
            '' as conteosi,
            '' as conteono,
            '' as observacion
            --deop_area.idestructuraop as idarea
            
        from mod_logistica.dat_documento d
        
        inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = d.iddoc
        inner join mod_datosmaestros.dat_estructurasubsist subsist on subsist.idestructurasubsist = dprim.idestructurasubsist and subsist.idsubsistema = 11
        inner join mod_estructuracomp.nom_filaestruc fila on fila.idfila = subsist.idestructuracomun
        
          
        inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
        inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
        inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        
        inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = m.idmovimiento
        inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
        
        left join mod_estructuracomp.dat_estructura de on de.idestructura = fila.idfila and de.idproyecto = 0
        left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = fila.idfila and deop.idproyecto = 0
        
        left join mod_estructuracomp.dat_estructura de_area on de_area.idestructura = d.idestructuracomun and de_area.idproyecto = 0
        left join mod_estructuracomp.dat_estructuraop deop_area on deop_area.idestructuraop = p.idestructura and deop_area.idproyecto = 0
        

        
        
        where d.iddocumento = $1 
        group by de.denominacion, deop.denominacion, deop_area.denominacion, de_area.denominacion, i.denominacion, i.numeropieza, i.codigo, i.idindicador
        order by deop_area.denominacion, i.codigo
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

ALTER FUNCTION mod_logactivofijotangible.f_imprimirconteoutiles (iddocumento numeric, ordenadopor numeric)
  OWNER TO zeolides;