
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listarregnumerico (
  p_idestructura numeric,
  p_idregnumerico varchar,
  p_idareas varchar,
  p_depreciacion varchar
)
RETURNS SETOF mod_logactivofijotangible.td_listarregnumerico AS
$body$
  DECLARE
  v_rec mod_logactivofijotangible.td_listarregnumerico;
    v_identificador varchar = '';
  v_sql1 varchar = '';
  BEGIN
    for v_rec in 
        select distinct 
        rna.idregnumerico,
        i.denominacion,
        modelo.denominacion as modelo,
        marca.denominacion as marca,
        eu.descripcion as ubicacion,
        rna.nroinventario,
        rna.valoradquisicion,
        rna.valorcontable,
        rna.vidautil,
        rna.tasafiscal,
        rna.depreciacionacumulada,
        rna.fechaadq,
        rna.fechaexpini,
        rna.fechaexpfin,
        rna.esbaja,
        rna.estaentidad,
        rnat.nromatricula as matricula,
        rnat.indicativo,
        rnat.nrocirculacion as numcirculacion,
        rnat.nromotor1 as numeromotor1,
        rnat.nromotor2 as numeromotor2,
        rna.cantidadrecursoconsumido as kilometraje,
        rnat.indiceconsumo,
        rnat.ficav,
        rnat.lot,
        rnat.capacidad as pax,
        tipcom.denominacion as tipocombustible,
        et.denominacion as estado,
        es.denominacion as entidad,
        deop.denominacion as arearesponsabilidad,
        cat.denominacion as categoria,   
        rn.nroserie,
        concat(pers.nombre || ' ' || pers.snombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
        nic.urllogo,
        i.codigo,
        rnat.vin,
        nc1.denominacion as colorprim,
        nc2.denominacion as colorsec,
        na.denominacion as actividad,
        rnat.combustibleasignado,        
        im.identificador,
        im.nombretabla, 
        im.denominacion as den,        
        rnat.vencimientolot,
        rnat.vencimientoficav,
        rnat.vencimientocirculacion,
        rnat.expedicioncirculacion,        
        rna.fechainicialgarantia,
        rna.fechafingarantia,
        rna.recursoconsumidomax,
        rna.recursoconsumido,
        rna.cantidadrecursoconsumido,
        rna.porcientorecuperacion
        from mod_logactivofijotangible.dat_regnumericoactivo rna
        inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = rna.idregnumerico
        left join mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rn.idregnumerico = rnat.idregnumerico
        left join mod_logactivofijotangible.nom_tipocombustible tipcom on rnat.idtipocombustible = tipcom.idtipocombustible
        left join mod_logactivofijotangible.nom_estatustecnico et on rna.idestatustecnico = et.idestatustecnico
        inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        inner join mod_datosmaestros.nom_indicador i on p.idindicador = i.idindicador
        inner join mod_logistica.dat_movimiento mv on p.idproducto = mv.idproducto
        inner join mod_logistica.dat_documento doc on mv.iddocumento = doc.iddocumento
        left join mod_logistica.nom_categoria cat on cat.idcategoria = rna.idcategoria
        left join mod_logubicacion.dat_estructuraubicacion eu on rna.idubicacion = eu.idestructuraubicacion
        inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = rna.idarearesp
        inner join mod_estructuracomp.nom_filaestruc f on f.idfila = deop.idestructura
        inner join mod_estructuracomp.v_dametodasestructuras es on f.idpadre = es.idestructura
        left join mod_logistica.conf_general nic on nic.idestructura = es.idestructura
        inner join mod_estructuracomp.nom_filaestruc fp on f.lft >= fp.lft and f.rgt <= fp.rgt and fp.idfila = $1
        left join mod_logactivofijotangible.dat_responsable resp on rna.idresponsable = resp.idresponsable
        left join mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        inner join mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
        left join mod_datosmaestros.nom_marca marca on ih.idmarca = marca.idmarca
        left join mod_datosmaestros.nom_modelo modelo on ih.idmodelo = modelo.idmodelo        
        left join mod_logactivofijotangible.nom_color nc1 on nc1.idcolor = rna.idcolorprim
        left join mod_logactivofijotangible.nom_color nc2 on nc2.idcolor = rna.idcolorsec
        inner join mod_logactivofijotangible.nom_actividad na on na.idactividad = rna.idactividad
        left join mod_logactivofijotangible.conf_identificadormedio im on im.idindicador = i.idindicador
        where doc.estado = 3  
        and(rna.idregnumerico = any(cast($2 as numeric[])) or $2 is null)
        and(rna.idarearesp = any(cast($3 as NUMERIC[])) or $3 is null)
        and((na.iddepreciacion = any(cast($4 as NUMERIC[])) and rna.idestadoperacion <> 7) or $4 is null)
        /*and p.idestructura in ( select idfila from mod_estructuracomp.nom_filaestruc where
        lft >= (select lft from mod_estructuracomp.nom_filaestruc where idfila = $1) and
        rgt <= (select rgt from mod_estructuracomp.nom_filaestruc where idfila = $1))*/

    loop
    
        if v_rec.nombretabla = 'dat_registronumerico' then
        v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_registronumerico rg where rg.idregnumerico = ' || v_rec.idregnumerico;
        execute v_sql1 into v_identificador;
        v_rec.identificador = v_rec.den || ': ' || v_identificador;
        end if;

        if v_rec.nombretabla = 'dat_regnumericoactivo' then
        v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_regnumericoactivo rg where rg.idregnumerico = ' || v_rec.idregnumerico;
        execute v_sql1 into v_identificador;
        v_rec.identificador = v_rec.den || ': ' || v_identificador;
        end if;

        if v_rec.nombretabla = 'dat_regnumericoactivotransp' then
        v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_regnumericoactivotransp rg where rg.idregnumerico = ' || v_rec.idregnumerico;
        execute v_sql1 into v_identificador;
        v_rec.identificador = v_rec.den || ': ' || v_identificador;
        end if;
        
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;


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
and i.idnaturaleza not in(-5,-8,-7)  
and ra.fechaadq is not null $$;


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
COST 100 ROWS 1000;