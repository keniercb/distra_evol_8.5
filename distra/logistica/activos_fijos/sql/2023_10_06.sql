--Script para añadir campos a regnumericoactivo y movregnumerico


ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN IF NOT EXISTS idnaturaleza NUMERIC(19,0);
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN IF NOT EXISTS idgruposubgrupo NUMERIC(19,0);
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_movregnumericoactivo
  ADD COLUMN IF NOT EXISTS denominacion VARCHAR(255);



ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN IF NOT EXISTS idnaturaleza NUMERIC(19,0);
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN idgruposubgrupo NUMERIC(19,0);
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN IF NOT EXISTS denominacion VARCHAR(255);


--Script para actualizar los valores grupo,denominacion,naturaleza
UPDATE 
mod_logactivofijotangible.dat_regnumericoactivo a
SET idgruposubgrupo = b.idgruposubgrupo,
    denominacion = b.denominacion,
    idnaturaleza = b.idnaturaleza
from (
  SELECT ih.idgruposubgrupo, rn.idregnumerico, i.denominacion, i.idnaturaleza
  FROM mod_logactivofijotangible.dat_registronumerico rn 
  inner join mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto 
  inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
  inner join mod_datosmaestros.nom_indicadorhoja ih ON ih.idindicador = i.idindicador
) b
WHERE 
a.idregnumerico = b.idregnumerico


--Script nueva funcion de balance contable
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_balancecontbaleaft (
  p_idestructura numeric,
  p_idejercicioactual numeric
)
RETURNS SETOF mod_logactivofijotangible.td_balancecontbaleaft AS
$body$
DECLARE
 v_rec mod_logactivofijotangible.td_balancecontbaleaft;
 v_subsist_aft_aperturado numeric := 0;
 v_recejercicio record;
BEGIN

  select COALESCE(esubsist.aperturado, 0) into v_subsist_aft_aperturado
  from mod_datosmaestros.dat_estructurasubsist esubsist
  where esubsist.idsubsistema = 11 and esubsist.idestructuracomun = p_idestructura;

  select ec.fin, ec.inicio into v_recejercicio from mod_datosmaestros.dat_ejerciciocontable ec
  inner join mod_datosmaestros.dat_cierre dc on dc.idejercicioactual = ec.idejercicio
  inner join mod_datosmaestros.dat_estructurasubsist ees on ees.idestructurasubsist = dc.idestructurasubsist
  where ees.idestructuracomun = p_idestructura and ees.idsubsistema = 11;
  -- Para cuando el sistema ya esta aperturado
  IF(v_subsist_aft_aperturado = 1) THEN
    for v_rec in

        select q.concatcta, 
        COALESCE(q.saldo,0) as saldo, 
        COALESCE(sum(q.valor),0) as valor 
        
        from (
            /*select nca.concatcta, abs(sum(rp.debito - rp.credito)) as saldo, squery.valor                      
            from mod_contabilidad.nom_cuenta nca
            left join mod_contabilidad.res_resumen_pase rp on rp.idcuenta = nca.idcuenta  and rp.idestructuracomun = p_idestructura
            and rp.idejercicio = p_idejercicioactual*/
           
            
              select nca.concatcta, 
              sum(rp.saldomb) as saldo, squery.valor
              from mod_contabilidad.nom_cuenta nca
              INNER join mod_contabilidad.res_centroelem_saldo rp on rp.idcuenta = nca.idcuenta
              inner join mod_contabilidad.dat_estructurae dee on dee.idestructurae = rp.idestructurae  
                
              inner join 
              (select
              cg.idcuentaactivo as idcuenta,nc.concatcta, sum(rna.valorcontable) as valor
              from mod_logistica.dat_producto dp
              inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
               inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
              --inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
             -- inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
              inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
              inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
              inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = rna.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo            
              inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentaactivo
              where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
              and rna.idestadoperacion not in (7, 0)
              group by cg.idcuentaactivo,nc.concatcta
                            
              union 
                            
              select
              cg.idcuentaactivoalternativa as idcuenta ,nc.concatcta, sum(round(rna.valorcontablealternativo,2)) as valor
              from mod_logistica.dat_producto dp
              inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
             -- inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
              --inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
              inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
              inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
              inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = rna.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo 
              inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentaactivoalternativa                      
              where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
              and rna.idestadoperacion not in (7, 0)
              group by cg.idcuentaactivoalternativa,nc.concatcta
                            
              union 
                            
              select
              cg.idcuentadepreciacion as idcuenta ,nc.concatcta, sum(round(rna.depreciacionacumulada,2)) as valor
              from mod_logistica.dat_producto dp
              inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
              --inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
              --inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
              inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
              inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
              inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = rna.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo 
              inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentadepreciacion
              where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
              and rna.idestadoperacion not in (7, 0)
              group by cg.idcuentadepreciacion,nc.concatcta
                            
              union 
                            
              select
              cg.idcuentadepreciacionalternativa as idcuenta ,nc.concatcta, sum(round(rna.depreciacionacumuladaalternativo,2)) as valor
              from mod_logistica.dat_producto dp
              inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
              inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
              --inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
              --inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
              inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
              inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
              inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = rna.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo 
              inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentadepreciacionalternativa
              where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
              and rna.idestadoperacion not in (7, 0)
              group by cg.idcuentadepreciacionalternativa,nc.concatcta
                            
            ) squery on squery.idcuenta = nca.idcuenta 
          where 
          
          dee.idestructuracomun = p_idestructura
          and 
          rp.fechaemision BETWEEN v_recejercicio.inicio and v_recejercicio.fin/*<= (
              select decont.fin from mod_datosmaestros.dat_ejerciciocontable decont 
              where decont.idejercicio = p_idejercicioactual
          )*/ and   
          nca.idcuenta in (
             select cgc.idcuentaactivo from mod_logactivofijotangible.conf_gruposcuentas cgc
             union 
             select cgc1.idcuentaactivoalternativa from mod_logactivofijotangible.conf_gruposcuentas cgc1
             union                                                                                       
             select cgc2.idcuentadepreciacion from mod_logactivofijotangible.conf_gruposcuentas cgc2
             union
             select cgc3.idcuentadepreciacionalternativa from mod_logactivofijotangible.conf_gruposcuentas cgc3
          )
          group by nca.concatcta,squery.valor
          
          order by nca.concatcta
        
        ) q group by q.concatcta, q.saldo order by q.concatcta

    LOOP
        return next v_rec;
    END LOOP;
  
  ELSE
  -- Para cuando el sistema no esta aperturado, y tiene un solo movimiento por activo
    for v_rec in

        select q.concatcta, 
        COALESCE(
        --round(
        q.saldo
        --,2)
        ,0) as saldo, 
        COALESCE(
        --round(
        sum(q.valor)
        --,2)
        ,0) as valor from ( 
        
          /*select nca.concatcta, abs(sum(rp.debito - rp.credito)) as saldo, squery.valor                      
            from mod_contabilidad.nom_cuenta nca
            left join mod_contabilidad.res_resumen_pase rp on rp.idcuenta = nca.idcuenta  and rp.idestructuracomun = p_idestructura
            and rp.idejercicio = p_idejercicioactual*/
            
            select nca.concatcta, 
              sum(rp.saldomb) as saldo, squery.valor
              from mod_contabilidad.nom_cuenta nca
              INNER join mod_contabilidad.res_centroelem_saldo rp on rp.idcuenta = nca.idcuenta
              inner join mod_contabilidad.dat_estructurae dee on dee.idestructurae = rp.idestructurae
            
            inner join 
            (select
            cg.idcuentaactivo as idcuenta,nc.concatcta, sum(rna.valorcontable) as valor
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            --inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
            --inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
            inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = rna.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo 
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentaactivo
            --inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
            where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
            and rna.idestadoperacion not in (7) and rna.esbaja = 0
            group by cg.idcuentaactivo,nc.concatcta
                          
            union 
                          
            select
            cg.idcuentaactivoalternativa as idcuenta ,nc.concatcta, sum(rna.valorcontablealternativo) as valor
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            --inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
            --inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
            inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = rna.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo 
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentaactivoalternativa
            --inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico                      
            where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
            and rna.idestadoperacion not in (7) and rna.esbaja = 0
            group by cg.idcuentaactivoalternativa,nc.concatcta
                          
            union 
                          
            select
            cg.idcuentadepreciacion as idcuenta ,nc.concatcta, sum(rna.depreciacionacumulada) as valor
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            --inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
            --inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
            inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = rna.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo 
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentadepreciacion
            --inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
            where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
            and rna.idestadoperacion not in (7) and rna.esbaja = 0
            group by cg.idcuentadepreciacion,nc.concatcta
                          
            union 
                          
            select
            cg.idcuentadepreciacionalternativa as idcuenta ,nc.concatcta, sum(rna.depreciacionacumuladaalternativo) as valor
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dp.idindicador
            --inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = ih.idgruposubgrupo
            --inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo
            inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            inner join mod_datosmaestros.nom_gruposubgrupo ng on ng.idgruposubgrupo = rna.idgruposubgrupo
              inner join mod_logactivofijotangible.conf_gruposcuentas cg on cg.idgruposubgrupo = ng.idgruposubgrupo 
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cg.idcuentadepreciacionalternativa
            --inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
            where cg.idestructura = p_idestructura and dp.idestructuracomun = p_idestructura and rna.esbaja = 0
            and rna.idestadoperacion not in (7) and rna.esbaja = 0
            group by cg.idcuentadepreciacionalternativa,nc.concatcta
                          
          ) squery on squery.idcuenta = nca.idcuenta 
        where --squery.valor > 0 and
        dee.idestructuracomun = p_idestructura
          and 
          rp.fechaemision BETWEEN v_recejercicio.inicio and v_recejercicio.fin
          and
         
        nca.idcuenta in (
           select cgc.idcuentaactivo from mod_logactivofijotangible.conf_gruposcuentas cgc
           union 
           select cgc1.idcuentaactivoalternativa from mod_logactivofijotangible.conf_gruposcuentas cgc1
           union                                                                                       
           select cgc2.idcuentadepreciacion from mod_logactivofijotangible.conf_gruposcuentas cgc2
           union
           select cgc3.idcuentadepreciacionalternativa from mod_logactivofijotangible.conf_gruposcuentas cgc3
        )
        group by nca.concatcta,squery.valor order by nca.concatcta 
        ) q group by q.concatcta, q.saldo order by q.concatcta
  
    LOOP
        return next v_rec;
    END LOOP;
  
  END IF;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;





--Script eliinacion del idregnumerico en cascada
-- object recreation
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_movregnumerico
  DROP CONSTRAINT IF EXISTS fk_registronumerico_movregnumerico RESTRICT;

ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_movregnumerico
  ADD CONSTRAINT IF NOT EXISTS fk_registronumerico_movregnumerico FOREIGN KEY (idregnumerico)
    REFERENCES mod_logactivofijotangible.dat_registronumerico(idregnumerico)
    MATCH FULL
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;



--Script nuevos campos en dat importar temp
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_importartmp
  ADD COLUMN IF NOT EXISTS naturaleza VARCHAR(255);
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_importartmp
  ADD COLUMN IF NOT EXISTS gruposubgrupo VARCHAR(255);
ALTER TABLE IF EXISTS mod_logactivofijotangible.dat_importartmp
  ADD COLUMN IF NOT EXISTS denominacion VARCHAR(255);






--Reportes
--control de uh en uso por trabajador

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
    (person.nombre || ' ' || person.papel || ' ' || person.sapel) as responsable
    
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
    LEFT JOIN mod_persona.dat_persona person on person.idpersona = $10 
    
    where 
    	drna.idestadoperacion not in (0,7)
    and (drna.idarearesp = any(cast( $1 as numeric[])) OR $1 = '{}' )
    --and nat.idnaturaleza = -5 
    and nih.isuh = 1
    and drna.esbaja = 0 
    and (dresp.idpersona = $10 OR $10 IS NULL)
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
      person.papel,
      person.sapel
      
    
    ORDER BY deop.denominacion,ncc.descripcioncentrogrupo	
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

--Listado de activos modificados
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listarmodificados (
  p_fechainicio date,
  p_fechafin date,
  p_idarearesp varchar,
  p_tablas varchar,
  p_campo varchar,
  p_andor numeric
)
RETURNS SETOF mod_logactivofijotangible.td_listarmodificados AS
$body$
DECLARE
v_sql varchar = '';
v_sql1 varchar = '';
v_identificador varchar = '';
v_condicion varchar = ' and ';
v_rec mod_logactivofijotangible.td_listarmodificados;

v_tabla varchar[];
v_campo varchar[];

BEGIN
v_tabla := string_to_array($4, ',');
v_campo := string_to_array($5, ',');

raise notice'%',v_campo;
if $6 = 1 then v_condicion = ' and '; else v_condicion = ' or '; end if;

v_sql = '
select distinct
/*rna.idarearesp, rna.idregnumerico
, case when rna.idarearesp = any(cast(''' || $3 || ''' as numeric[])) then 1 else 0 end as esta
, mrat.nromatricula*/

case when rna.idarearesp = any(cast(''' || $3 || ''' as numeric[])) then 1 else 0 end as esta,
rna.idregnumerico,
rna.denominacion as producto,
modelo.denominacion as modelo,
marca.denominacion as marca,
rna.nroinventario as nroinventario,
rna.valorcontable as valorcontable,
net.denominacion as estado,
cfg.urllogo as logo,
deop.denominacion as arearesponsabilidad,
drn.nroserie,    
rna.depreciacionacumulada ,
rna.vidautil,
rna.porcientorecuperacion ,
rna.fechaexpini,
rna.fechaexpfin,
rna.fechaadq,
rna.tasafiscal,
rna.valoradquisicion,
rna.asignado ,
rna.esmodulo,
rna.annofabricacion,
rna.recursoconsumido,
rna.cantidadrecursoconsumido,  
rna.recursoconsumidomax,
rna.fechainicialgarantia,
rna.fechafingarantia,    
nc1.denominacion as colorprim,
nc2.denominacion as colorsec,
na.denominacion as actividad,
cat.denominacion as categoria,
tipcom.denominacion as tipocombustible,    
rnat.nrocirculacion,
rnat.nromatricula,
rnat.nromotor1,
rnat.nromotor2,
rnat.indiceconsumo,
rnat.indicativo,
rnat.nollaveencendido,
rnat.capacidad,
rnat.vin,
rnat.ficav,
rnat.lot,
rnat.combustibleasignado,
rnat.vencimientolot,
rnat.vencimientoficav,
rnat.vencimientocirculacion,
rnat.expedicioncirculacion,    
im.nombretabla,
im.denominacion as den,
im.tipo as tipoconf,
de.denominacion as estructura,
im.identificador

from mod_logistica.dat_documento d
inner join mod_logistica.dat_movimiento m on d.iddocumento = m.iddocumento
inner join mod_logactivofijotangible.dat_movregnumerico mr on mr.idmovimiento = m.idmovimiento
inner join mod_logactivofijotangible.dat_movregnumericoactivo mra on mra.idmovregnumerico = mr.idmovregnumerico
inner join mod_logactivofijotangible.dat_movregnumericoactivotransp mrat on mrat.idmovregnumerico = mr.idmovregnumerico
inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = mr.idregnumerico
left join mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rnat.idregnumerico = rna.idregnumerico
inner join mod_logistica.dat_producto dp on dp.idproducto = m.idproducto
inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idproducto = dp.idproducto and drn.idregnumerico = mr.idregnumerico
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador
left join mod_datosmaestros.nom_marca marca on nih.idmarca = marca.idmarca
left join mod_datosmaestros.nom_modelo modelo on nih.idmodelo = modelo.idmodelo
left join mod_logactivofijotangible.nom_estatustecnico net on net.idestatustecnico = rna.idestatustecnico
inner join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = dp.idestructuracomun
inner join mod_logistica.conf_general cfg on cfg.idestructura = de.idestructura    
left join mod_logactivofijotangible.nom_color nc1 on nc1.idcolor = rna.idcolorprim
left join mod_logactivofijotangible.nom_color nc2 on nc2.idcolor = rna.idcolorsec
left join mod_logactivofijotangible.nom_actividad na on na.idactividad = rna.idactividad
left join mod_logactivofijotangible.nom_tipocombustible tipcom on rnat.idtipocombustible = tipcom.idtipocombustible
left join mod_logistica.nom_categoria cat on cat.idcategoria = rna.idcategoria
left join mod_logactivofijotangible.conf_identificadormedio im on im.idindicador = ni.idindicador
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dp.idestructura
where mra.idarearesp = any(cast(''' || $3 || ''' as numeric[])) ';

if $1 is not null then v_sql = v_sql || ' and d.fechacontable >= ''' || $1 || ''''; end if;
if $2 is not null then v_sql = v_sql || ' and d.fechacontable <= ''' || $2 || ''''; end if;

for i in 1 .. array_upper (v_tabla, 1)
loop
if i = 1 then v_sql = v_sql || ' and '; else v_sql = v_sql || v_condicion; end if;

if v_tabla[i] in ('dat_movregnumericoactivo', 'dat_movregnumericoactivotransp') then
    v_sql = v_sql || '(select count(*) from (select distinct t.' || v_campo[i] || ' from mod_logactivofijotangible.' || v_tabla[i] || ' t
    inner join mod_logactivofijotangible.dat_movregnumerico mr1 on t.idmovregnumerico = mr1.idmovregnumerico
    where mr1.idregnumerico = mr.idregnumerico
    )q) > 1';
else
    v_sql = v_sql || '(select count(*) from (select distinct mr1.' || v_campo[i] || ' from mod_logactivofijotangible.dat_movregnumerico mr1
    where mr1.idregnumerico = mr.idregnumerico
    )q) > 1';
end if;

end loop;

--raise notice 'v_sql %', v_sql;


for v_rec in execute v_sql
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
    
     if v_rec.tipoconf = 2 then 
    v_sql1 = 'select ' || split_part(v_rec.identificador,'.',3) || ' from '|| split_part(v_rec.identificador,'.',1)|| '.'|| split_part(v_rec.identificador,'.',2)||' rg where rg.idregnumerico = ' || v_rec.idregnumerico;
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
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_listarmodificados (p_fechainicio date, p_fechafin date, p_idarearesp varchar, p_tablas varchar, p_campo varchar, p_andor numeric)
  OWNER TO zeolides;


--listado de activos por responsable

 CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listaraftoperacion (
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
RETURNS SETOF mod_logactivofijotangible.td_listaraftoperacion AS
$body$
declare
    v_datos record;
    v_rec mod_logactivofijotangible.td_listaraftoperacion;

    v_sql varchar = '';

    p_alias varchar[]:= string_to_array($5,',');

    p_codigo varchar[]:= string_to_array($6,',');

    p_valor varchar[]:= string_to_array($7,',');

    v_cont integer:= array_length(p_codigo,1);

    i integer :=1;

    v_alias varchar;

    v_select varchar='';

    v_joins varchar='';

    v_condinicial varchar='';

    v_cond varchar='';

    v_datatype varchar='';

    v_identificador varchar = '';
    v_sql1 varchar = ''; 
    begin



    if $1 is not null then v_condinicial = v_condinicial || ' and drna.idarearesp = any(cast( ' || $$'$$ || $1 || $$'$$  ||' as numeric[])) ';end if;

if $11 is not null then
    v_joins = v_joins || ' left join mod_logactivofijotangible.conf_gruposcuentas cfggrupos on nih.idgruposubgrupo = cfggrupos.idgruposubgrupo and cfggrupos.idestructura = dp.idestructuracomun
    left join mod_contabilidad.nom_cuenta ncuenta on cfggrupos.idcuentaactivo = ncuenta.idcuenta ';
    v_select :=$$ ,concat(ncuenta.concatcta,' ',ncuenta.descripcion) as cuenta $$;
    end if;
    
    if $2 is not null then 
        v_condinicial = v_condinicial || ' and nop.idnomoperaciones = any(cast( ' || $$'$$ || $2 || $$'$$  ||' as numeric[])) ';
    
     	v_select :=' ,nop.denominacion as operacion,    
    			ndp.denominacion as tipodocumento,
                dd.fechacontable as fechadoc
                  ';                            
    end if;
    


    if $3 is not null then v_condinicial = v_condinicial || ' and (dd.fechacontable >= ' || $$'$$ || $3 || $$'$$ || $$::date$$ ||' ) ';end if;

    if $4 is not null then v_condinicial = v_condinicial || ' and (dd.fechacontable <= ' || $$'$$ || $4 || $$'$$ || $$::date$$ ||' ) ';end if;
    --if $8 is not null then v_condinicial = v_condinicial || ' and nat.idnaturaleza = -5 and drna.esbaja = 0';end if; 
    if $8 is not null then v_condinicial = v_condinicial || ' and nih.isuh = 1 and drna.esbaja = 0';end if; 
    if $9 is not null then v_condinicial = v_condinicial || ' and drna.idubicacion = any(cast( ' || $$'$$ || $9 || $$'$$  ||' as numeric[])) ';end if;
    if $12 is not null then v_condinicial = v_condinicial || ' and nat.idnaturaleza != all(cast( ' || $$'$$ || $12 || $$'$$  ||' as numeric[])) ';end if;
    if $12 is not null and -5 = any(cast($12 as numeric[])) then v_condinicial = v_condinicial || ' and nih.isuh = 0 ';end if;
    if $10 is not null then
    v_joins = v_joins || ' INNER JOIN mod_logactivofijotangible.dat_responsable dresp on dresp.idresponsable = drna.idresponsable
    						LEFT JOIN mod_persona.dat_persona person on person.idpersona = '|| $10;
    v_condinicial = v_condinicial || ' and dresp.idpersona =  ' || $10 ;
   
    end if;

    


    if (select 'OPER_BAJA' = any(p_alias)) then
    	v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docbajaventa OPER_BAJA on OPER_BAJA.iddocbajaventa = dd.iddocumento left join mod_logactivofijotangible.nom_destinofinal ndf on ndf.iddestinofinal = OPER_BAJA.iddestinofinal ';
    	v_select :=' ,ndf.denominacion as destinofinal ';
    end if;


    if (select 'OPER_BAJA_DESARME' = any(p_alias)) then
    	v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docbajadesarme OPER_BAJA_DESARME on OPER_BAJA_DESARME.iddocbajadesarme = dd.iddocumento left join mod_logactivofijotangible.nom_destinofinal ndfd on ndfd.iddestinofinal = OPER_BAJA_DESARME.iddestinofinal ';
    	v_select :=' ,ndfd.denominacion as destinofinal ';
    end if;       
    
    
    	

    
    


    if (select 'OPER_ALQUILER' = any(p_alias)) then
    v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docalquiler OPER_ALQUILER on OPER_ALQUILER.iddocalquiler = dd.iddocumento ';
    end if;



    if (select 'OPER_COMPRA' = any(p_alias)) then
    v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docaltacompra OPER_COMPRA on OPER_COMPRA.iddocaltacompra = dd.iddocumento ';
    end if;


    if (select 'OPER_REPGENERAL' = any(p_alias)) then
    v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docenviadoreparar OPER_REPGENERAL on OPER_REPGENERAL.iddocenviadoreparar = dd.iddocumento ';
    end if;



    if (select 'OPER_PRESTAMO' = any(p_alias)) then
    v_joins = v_joins || ' left join mod_logactivofijotangible.dat_docprestamo OPER_PRESTAMO on OPER_PRESTAMO.iddocprestamo = dd.iddocumento ';
    end if;


    if (select 'OPER_TRASLADO' = any(p_alias)) then
    v_joins = v_joins || ' left join mod_logactivofijotangible.dat_doctransfentidades OPER_TRASLADO on OPER_TRASLADO.iddoctranfentidades = dd.iddocumento ';
    end if;



    while i<= v_cont

    loop

    if ((select 'OPER_BAJA' = (p_alias[i]))) then v_alias = 'OPER_BAJA';end if;

    if ((select 'OPER_ALQUILER' = (p_alias[i]))) then v_alias = 'OPER_ALQUILER';end if;

    if ((select 'OPER_COMPRA' = (p_alias[i]))) then v_alias = 'OPER_COMPRA';end if;

    if ((select 'OPER_BAJA_DESARME' = (p_alias[i]))) then v_alias = 'OPER_BAJA_DESARME';end if;

    if ((select 'OPER_REPGENERAL' = (p_alias[i]))) then v_alias = 'OPER_REPGENERAL';end if;

    if ((select 'OPER_PRESTAMO' = (p_alias[i]))) then v_alias = 'OPER_PRESTAMO';end if;

    if ((select 'OPER_TRASLADO' = (p_alias[i]))) then v_alias = 'OPER_TRASLADO';end if;



    if (SELECT p_valor[i]::varchar ~ '^[0-9]+$') then v_datatype=' = ' || p_valor[i]::varchar; else v_datatype= ' ~~* '|| $$'%$$ || p_valor[i] || $$%'$$ ;end if;

    v_cond = v_cond || ' and (' || v_alias || '.' || p_codigo[i] || v_datatype ||' ) ';

    i= i + 1;

    end loop;

    v_sql = $$select distinct
    drn.idregnumerico,
    drna.denominacion as producto,
    modelo.denominacion as modelo,
    marca.denominacion as marca,
    drna.nroinventario as nroinventario,
    drna.valorcontable as valorcontable,    
    drna.valorcontablealternativo as valorcontablealternativo,
    net.denominacion as estado,
    deop.denominacion as arearesponsabilidad,
    deop.codigo as codigoarearesp,
    drn.nroserie ,
    drna.depreciacionacumulada ,
    drna.depreciacionacumuladaalternativo ,
    drna.vidautil,
    drna.porcientorecuperacion ,
    drna.fechaexpini,
    drna.fechaexpfin,
    drna.fechaadq,
    (select d.fechacontable
 from mod_logistica.dat_documento d
 inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
 inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
 inner join mod_logactivofijotangible.dat_registronumerico r2 on r2.idproducto = p.idproducto
 inner join mod_logactivofijotangible.dat_regnumericoactivo ra2 on ra2.idregnumerico = r2.idregnumerico
 where
 ra2.idestadoperacion = 7
 and ra2.idregnumerico =  drna.idregnumerico
 and d.cronologia > 0
 order by d.cronologia desc
 limit 1
 ) as fechabaja,
    drna.tasafiscal,
    drna.valoradquisicion,
    drna.asignado ,
    drna.esmodulo,
    drna.annofabricacion,
    drna.recursoconsumido,
    drna.cantidadrecursoconsumido,
    drna.recursoconsumidomax,
    drna.fechainicialgarantia,
    drna.fechafingarantia,
    nc1.denominacion as colorprim,
    nc2.denominacion as colorsec,
    na.denominacion as actividad,
    cat.denominacion as categoria,
    tipcom.denominacion as tipocombustible,
    t.nrocirculacion,
    t.nromatricula,
    t.nromotor1,
    t.nromotor2,
    t.indiceconsumo,
    t.indicativo,
    t.nollaveencendido,
    t.capacidad,
    t.vin,
    t.ficav,
    t.lot,
    t.combustibleasignado,
    t.vencimientolot,
    t.vencimientoficav,
    t.vencimientocirculacion,
    t.expedicioncirculacion ,
    im.identificador,
    '' as valoridentificador,
    im.nombretabla,
    im.denominacion as den,
    im.tipo as tipoconf,     
    ubi.descripcion as ubicacion,
    ni.numeropieza as codigoproveedor,
    ncc.descripcioncentrogrupo as centrocosto
    $$

    ||v_select||'


    from mod_logactivofijotangible.dat_registronumerico drn

    inner join mod_logactivofijotangible.dat_movregnumerico dmrn on dmrn.idregnumerico = drn.idregnumerico

    inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = drn.idregnumerico

    left join mod_logactivofijotangible.dat_regnumericoactivotransp t on t.idregnumerico = drna.idregnumerico

    inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmrn.idmovimiento

    inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento

    inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto

    inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador

    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador

    inner join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion

    left join mod_datosmaestros.nom_marca marca on nih.idmarca = marca.idmarca


    left join mod_datosmaestros.nom_modelo modelo on nih.idmodelo = modelo.idmodelo
    left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza

    left join mod_logactivofijotangible.nom_estatustecnico net on net.idestatustecnico = drna.idestatustecnico

    inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc

    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos

  

    left join mod_logactivofijotangible.nom_color nc1 on nc1.idcolor = drna.idcolorprim
    left join mod_logactivofijotangible.nom_color nc2 on nc2.idcolor = drna.idcolorsec
    left join mod_logactivofijotangible.nom_actividad na on na.idactividad = drna.idactividad
    left join mod_logactivofijotangible.nom_tipocombustible tipcom on t.idtipocombustible = tipcom.idtipocombustible
    left join mod_logistica.nom_categoria cat on cat.idcategoria = drna.idcategoria
    left join mod_logubicacion.dat_estructuraubicacion ubi on ubi.idestructuraubicacion = drna.idubicacion
    left join mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = drna.idcentrocosto

    left join mod_logactivofijotangible.conf_identificadormedio im on im.idindicador = ni.idindicador

    inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = drna.idarearesp and deop.idproyecto = 0 ' || v_joins

   || ' where dd.estado in(3) and drna.esbaja = 0'

    || v_condinicial

    || v_cond || ' ORDER BY deop.denominacion,ubi.descripcion,ncc.descripcioncentrogrupo';


    for v_rec in execute v_sql

    loop
    if v_rec.nombretabla = 'dat_registronumerico' then
    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_registronumerico rg where rg.idregnumerico = ' || v_rec.idregnumerico;
    execute v_sql1 into v_identificador;
    v_rec.identificador = v_rec.den || ': ' || v_identificador;
    v_rec.valoridentificador = v_identificador;
    end if;


    if v_rec.nombretabla = 'dat_regnumericoactivo' then
    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_regnumericoactivo rg where rg.idregnumerico = ' || v_rec.idregnumerico;
    execute v_sql1 into v_identificador;
    v_rec.identificador = v_rec.den || ': ' || v_identificador;
    v_rec.valoridentificador = v_identificador;
    end if;

    if v_rec.nombretabla = 'dat_regnumericoactivotransp' then
    v_sql1 = 'select ' || v_rec.identificador || ' from mod_logactivofijotangible.dat_regnumericoactivotransp rg where rg.idregnumerico = ' || v_rec.idregnumerico;
    execute v_sql1 into v_identificador;
    v_rec.identificador = v_rec.den || ': ' || v_identificador;
    v_rec.valoridentificador = v_identificador;
    end if;

    if v_rec.tipoconf = 2 then
    v_sql1 = 'select ' || split_part(v_rec.identificador,'.',3) || ' from '|| split_part(v_rec.identificador,'.',1)|| '.'|| split_part(v_rec.identificador,'.',2)||' rg where rg.idregnumerico = ' || v_rec.idregnumerico;
    execute v_sql1 into v_identificador;
    v_rec.identificador = v_rec.den || ': ' || v_identificador;
    v_rec.valoridentificador = v_identificador;
    end if;

    return next v_rec;
    end loop;
    end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_listaraftoperacion (p_idestructuraop varchar, p_idnomoperaciones varchar, p_fechainicio date, p_fechafin date, p_alias varchar, p_codigo varchar, p_valor varchar, p_tipo numeric, p_ubicaciones varchar, p_responsable numeric, p_contabilidad numeric, p_exlcuirnaturaleza varchar)
  OWNER TO zeolides;

--modelo registro depreciacion

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
ra.denominacion

from mod_logactivofijotangible.dat_registronumerico r
inner join mod_logactivofijotangible.dat_regnumericoactivo ra on ra.idregnumerico = r.idregnumerico
inner join mod_logistica.dat_producto p on p.idproducto = r.idproducto
left join mod_contabilidadcosto.nom_centrocosto nc on nc.idcentrogrupo = ra.idcentrocosto
left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura  = $$||p_idestructura||$$
left join mod_estructuracomp.v_dametodasestructuras eo on eo.idestructura = $$||p_idestructura||$$
inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih on i.idindicador = nih.idindicador
left join mod_logactivofijotangible.conf_gruposcuentas cfggrupos on nih.idgruposubgrupo = cfggrupos.idgruposubgrupo and cfggrupos.idestructura = $$||p_idestructura||$$
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
                and dc.estado = 3
                and dc.fechacontable >= $$ ||$$'$$ || p_fechainicio || $$'$$ || $$::date$$  || $$
                and dc.fechacontable <= $$ ||$$'$$ || p_fechafin || $$'$$ || $$::date$$  || $$
                and dc.idestructuracomun = $$ ||$$'$$ || p_idestructura || $$'$$ || $$::numeric$$  || $$
                group by mr.idregnumerico
                )sq on sq.id = r.idregnumerico

where
ra.idestadoperacion <> 0  
and i.idnaturaleza not in(-5,-8,-7) $$;
--and ra.fechaadq is not null $$;


v_sql = v_sql || ' order by cuenta, ra.denominacion, ra.nroinventario';
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


--Reporte listado de activos por operacion


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
        	(TO_CHAR(d.fechacontable, 'dd/mm/yyyy') >= TO_CHAR($3::DATE, 'dd/mm/yyyy') or $3 is null) and        
            (TO_CHAR(d.fechacontable, 'dd/mm/yyyy') <= TO_CHAR($4::DATE, 'dd/mm/yyyy') or $4 is null) and
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