DROP TYPE mod_logactivofijotangible.td_imprimirconteo CASCADE;

CREATE TYPE mod_logactivofijotangible.td_imprimirconteo AS (
  organismo VARCHAR(255),
  empresa VARCHAR(255),
  unidad VARCHAR(255),
  area VARCHAR(255),
  codigo VARCHAR(255),
  denominacion VARCHAR(255),
  valorcup NUMERIC(19,6),
  valorcuc NUMERIC(19,6),
  cantidad NUMERIC(9,0),
  conteosi VARCHAR(255),
  conteono VARCHAR(255),
  observacion VARCHAR(255),
  inventario VARCHAR(255),
  urllogo TEXT,
  codigoentidad VARCHAR(255)
);

ALTER TYPE mod_logactivofijotangible.td_imprimirconteo
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_imprimirconteo (
  iddocumento numeric,
  ordenadopor numeric = 1
)
RETURNS SETOF mod_logactivofijotangible.td_imprimirconteo AS
$body$
DECLARE
  v_rec mod_logactivofijotangible.td_imprimirconteo;
BEGIN
	
    for v_rec in
    	select 
        	'' as organismo, 
	        COALESCE(de.denominacion, '') as empresa,
            COALESCE(deop.denominacion, '') as unidad,
            COALESCE(deop_area.denominacion, de_area.denominacion) as area,
            COALESCE(i.numeropieza, i.codigo) as codigo,
            i.denominacion as denominacion,
            mrna.valorcontable as valorcup, 
            mrna.valorcontablealternativo as valorcuc,
            1 as cantidad,
            '' as conteosi,
            '' as conteono,
            '' as observacion,
            mrna.nroinventario as inventario
            
        from mod_logistica.dat_documento d
        
        inner join mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = d.iddoc
        inner join mod_datosmaestros.dat_estructurasubsist subsist on subsist.idestructurasubsist = dprim.idestructurasubsist and subsist.idsubsistema = 11
        inner join mod_estructuracomp.nom_filaestruc fila on fila.idfila = subsist.idestructuracomun
        
        left join mod_estructuracomp.dat_estructura de on de.idestructura = fila.idfila and de.idproyecto = 0
        left join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = fila.idfila and deop.idproyecto = 0
        
        left join mod_estructuracomp.dat_estructura de_area on de_area.idestructura = d.idestructuracomun and de_area.idproyecto = 0
        left join mod_estructuracomp.dat_estructuraop deop_area on deop_area.idestructuraop = d.idestructuracomun and deop_area.idproyecto = 0
        
        inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
        inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
        inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        
        inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = m.idmovimiento
        inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
        
        
        where d.iddocumento = $1 
    LOOP
    	return next v_rec;
    END LOOP;
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_imprimirconteo (iddocumento numeric, ordenadopor numeric)
  OWNER TO zeolides;