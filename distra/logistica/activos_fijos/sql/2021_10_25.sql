CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_valoresareas (
  idestructura numeric,
  tiposregistros numeric = 3
)
RETURNS SETOF mod_logactivofijotangible.td_valoresareas AS
$body$
DECLARE
  v_rec mod_logactivofijotangible.td_valoresareas;
BEGIN
  
for v_rec in
select
 
sub.area, 
sub.valorcontable, 
sub.valorcontablealternativo, 
sub.depreciacionacumulada, 
sub.depreciacionacumuladaalternativo,
sub.tipo,
sub.cantidad

from (
	select 
	COALESCE(op.denominacion, estr.denominacion) as area, 
	sum(rna.valorcontable) as valorcontable , 
	sum(rna.valorcontablealternativo) as valorcontablealternativo, 
	sum(rna.depreciacionacumulada) as depreciacionacumulada , 
	sum(rna.depreciacionacumuladaalternativo) as depreciacionacumuladaalternativo,
    (case when op.denominacion is not null then 'area' else 'entidad' end) as tipo,
    count(rn.idregnumerico) as cantidad

  from mod_logactivofijotangible.dat_registronumerico rn
  inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
  inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto

  
  inner join mod_estructuracomp.nom_filaestruc nfe on nfe.idfila = rna.idarearesp
  left join mod_estructuracomp.dat_estructura estr on estr.idestructura = nfe.idfila
  left join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = nfe.idfila
  inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = p.idindicador

  where 
  p.idestructuracomun = $1
  and op.idproyecto = 0
  and rna.idestadoperacion not in (0, 7)
  and (
  	case when $2 = 1 then ih.explotacion = 1 else true end
  )
  and (
  	case when $2 = 1 then ih.isuh = 0
    	when $2 = 2 then ih.isuh = 1
        else true 
    end
   ) 
  
  group by nfe.idfila, op.denominacion , estr.denominacion
  
) as sub

UNION select 
	'TOTAL' as area,
	sum(rna.valorcontable) as valorcontable , 
	sum(rna.valorcontablealternativo) as valorcontablealternativo, 
	sum(rna.depreciacionacumulada) as depreciacionacumulada , 
	sum(rna.depreciacionacumuladaalternativo) as depreciacionacumuladaalternativo,
    'total' as tipo,
    count(rn.idregnumerico) as cantidad

  from mod_logactivofijotangible.dat_registronumerico rn
  inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
  inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto

  inner join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = rna.idarearesp
  inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = p.idindicador
  where 
  p.idestructuracomun = $1
  and rna.idestadoperacion not in (0, 7)
  and op.idproyecto = 0
  and (
  	case when $2 = 1 then ih.explotacion = 1 else true end
  )
  and (
  	case when $2 = 1 then ih.isuh = 0 
    	when $2 = 2 then ih.isuh = 1
        else true 
    end
   )
  
  order by tipo, area
 LOOP 
  return next v_rec;
 end loop; 
  
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
--PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_valoresareas (idestructura numeric, tiposregistros numeric)
  OWNER TO zeolides;