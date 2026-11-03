CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_utilesporresponsable (
  p_idestructuraop varchar,
  p_idnomoperaciones varchar,
  p_fechainicio date,
  p_fechafin date,
  p_alias varchar,
  p_codigo varchar,
  p_valor varchar,
  p_tipo numeric,
  p_ubicaciones varchar,
  p_responsable numeric,
  p_contabilidad numeric,
  p_exlcuirnaturaleza varchar
)
RETURNS SETOF mod_logactivofijotangible.td_utilesporresponsable AS
$body$
DECLARE
      v_rec mod_logactivofijotangible.td_utilesporresponsable;
BEGIN
for v_rec in
	select distinct
    count(*) as cantidad,
    drna.denominacion as producto,
    modelo.denominacion as modelo,
    marca.denominacion as marca,
    drna.valorcontable as valorcontable,    
    drna.valorcontablealternativo as valorcontablealternativo,
    net.denominacion as estado,
    deop.denominacion as arearesponsabilidad,
    deop.codigo as codigoarearesp,
    drna.depreciacionacumulada ,
    drna.depreciacionacumuladaalternativo ,    
    ni.numeropieza as codigoproveedor,
    ncc.descripcioncentrogrupo as centrocosto,
    drna.fechaadq as fechadoc,    
   (person.nombre||(case when person.snombre is not null then ' '||person.snombre ELSE ' ' END)
    ||' '||person.papel||' '|| person.sapel) as responsable
    
    from mod_logactivofijotangible.dat_registronumerico drn
    inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = drn.idregnumerico
    inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
    inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador
    left join mod_datosmaestros.nom_marca marca on nih.idmarca = marca.idmarca
    left join mod_datosmaestros.nom_modelo modelo on nih.idmodelo = modelo.idmodelo
    left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
    left join mod_logactivofijotangible.nom_estatustecnico net on net.idestatustecnico = drna.idestatustecnico
    
    
    left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = drna.idcentrocosto
    inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = drna.idarearesp --and deop.idproyecto = 0      
    INNER JOIN mod_logactivofijotangible.dat_responsable dresp on dresp.idresponsable = drna.idresponsable
    INNER JOIN mod_persona.dat_persona person on  dresp.idpersona =  person.idpersona
    
    where 
    	drna.idestadoperacion not in (0,7)
    and (drna.idarearesp = any(cast( $1 as numeric[])) OR $1 = '{}' )
    --and nat.idnaturaleza = -5 
    and nih.isuh = 1
    and drna.esbaja = 0 
    and (person.idpersona = $10 OR $10 IS NULL)
    and ((drna.fechaadq >= $3 OR $3 IS NULL) AND (drna.fechaadq <= $4 OR $4 IS NULL))
    GROUP BY 
      drna.denominacion,
      modelo.denominacion,
      marca.denominacion,
      drna.valorcontable,    
      drna.valorcontablealternativo,
      net.denominacion,
      deop.denominacion,
      deop.codigo,
      drna.depreciacionacumulada ,
      drna.depreciacionacumuladaalternativo ,
      ni.numeropieza,
      ncc.descripcioncentrogrupo,
      drna.fechaadq,
      person.nombre,
      person.snombre,
      person.papel,
      person.sapel
      
    
    ORDER BY  (person.nombre||(case when person.snombre is not null then ' '||person.snombre ELSE ' ' END)
    ||' '||person.papel||' '|| person.sapel),deop.denominacion,ncc.descripcioncentrogrupo	
    LOOP
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

ALTER FUNCTION mod_logactivofijotangible.f_utilesporresponsable (p_idestructuraop varchar, p_idnomoperaciones varchar, p_fechainicio date, p_fechafin date, p_alias varchar, p_codigo varchar, p_valor varchar, p_tipo numeric, p_ubicaciones varchar, p_responsable numeric, p_contabilidad numeric, p_exlcuirnaturaleza varchar)
  OWNER TO zeolides;