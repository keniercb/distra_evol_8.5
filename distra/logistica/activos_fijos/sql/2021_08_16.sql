CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listdepactivos (
  p_idestructura numeric,
  p_fechainicio date,
  p_fechafin date
)
RETURNS SETOF mod_logactivofijotangible.td_listdepactivos AS
$body$
  DECLARE
  v_rec mod_logactivofijotangible.td_listdepactivos;
  v_sql varchar = '';
  BEGIN
  if p_idestructura is null then p_idestructura = -1;end if;
  if p_fechainicio is null then p_fechainicio = '01/01/2001';end if;
  if p_fechafin is null then p_fechafin = '01/01/2099';end if;
 
  v_sql=  $$select DISTINCT
 ra.idregnumerico,
 nc.codigocentrogrupo,
 ra.nroinventario,
 (COALESCE(ra.valorcontable, 0) + COALESCE(ra.valorcontablealternativo, 0)) as valor,
 ra.fechaadq,
 ra.tasafiscal,
 --ra.depreciacionacumulada as depreciacion,

 --ra.depreciacionacumuladaalternativo as depreciacioncuc,   
 
 sq.depre_cup as depreciacion,
 sq.depre_cuc as depreciacioncuc,

 (select d.fechacontable
   from mod_logistica.dat_documento d
   inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
   inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
   inner join mod_logactivofijotangible.dat_registronumerico r2 on r2.idproducto = p.idproducto
   inner join mod_logactivofijotangible.dat_regnumericoactivo ra2 on ra2.idregnumerico = r2.idregnumerico
   where
   ra2.idestadoperacion = 7
   and ra2.idregnumerico =  r.idregnumerico
   and d.cronologia > 0
   order by d.cronologia desc
   limit 1
 ) as fechabaja,
 (select
 cf.urllogo
 from mod_logistica.conf_general cf
 where cf.idestructura = $$||$1||$$
 limit 1
 ) AS logo,
coalesce (e.denominacion, eo.denominacion) as entidad,
coalesce (e.codigo, eo.codigo) as codigentidad,
concat(ncuenta.concatcta,' ',ncuenta.descripcion) as cuenta,
i.denominacion

from mod_logactivofijotangible.dat_registronumerico r
inner join mod_logactivofijotangible.dat_regnumericoactivo ra on ra.idregnumerico = r.idregnumerico
inner join mod_logistica.dat_producto p on p.idproducto = r.idproducto
left join mod_contabilidadcosto.nom_centrocosto nc on nc.idcentrogrupo = ra.idcentrocosto
left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura  = $$||p_idestructura||$$
left join mod_estructuracomp.v_dametodasestructuras eo on eo.idestructura = $$||p_idestructura||$$
inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih on i.idindicador = nih.idindicador
left join mod_logactivofijotangible.conf_gruposcuentas cfggrupos on nih.idgruposubgrupo = cfggrupos.idgruposubgrupo
left join mod_contabilidad.nom_cuenta ncuenta on cfggrupos.idcuentaactivo = ncuenta.idcuenta

inner join (select mr.idregnumerico as id, sum(mra.depreciacionacumulada) as depre, sum(mra.depreciacionacumuladaalternativo) as deprecuc,
                sum(mra.depreciacion) as depre_cup,
                sum(mra.depreciacioncuc) as depre_cuc
                FROM mod_logistica.dat_documento dc
                --inner join mod_logactivofijotangible.dat_documentoactivo dca on dca.iddocumentoactivo = dc.iddocumento
                inner join mod_logistica.dat_movimiento m on m.iddocumento = dc.iddocumento
                inner join mod_logactivofijotangible.dat_movregnumerico mr on mr.idmovimiento = m.idmovimiento
                inner join mod_logactivofijotangible.dat_movregnumericoactivo mra on mra.idmovregnumerico = mr.idmovregnumerico
                inner join  mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dc.idoperacion
                               
                where nop.codigooperacion = 'OPER_DEPRECIACION'
                and dc.fechacontable >= $$ ||$$'$$ || p_fechainicio || $$'$$ || $$::date$$  || $$
                and dc.fechacontable <= $$ ||$$'$$ || p_fechafin || $$'$$ || $$::date$$  || $$
                and dc.idestructuracomun = $$ ||$$'$$ || p_idestructura || $$'$$ || $$::numeric$$  || $$
                group by mr.idregnumerico
                )sq on sq.id = r.idregnumerico

where
ra.idestadoperacion <> 0  
and i.idnaturaleza not in(-5,-8,-7) $$;
--and ra.fechaadq is not null $$;


v_sql = v_sql || ' order by cuenta, i.denominacion, ra.nroinventario';
raise notice '%',v_sql;
    for v_rec in execute v_sql using p_idestructura, p_fechainicio, p_fechafin
 
    
    loop  
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

ALTER FUNCTION mod_logactivofijotangible.f_listdepactivos (p_idestructura numeric, p_fechainicio date, p_fechafin date)
  OWNER TO zeolides;