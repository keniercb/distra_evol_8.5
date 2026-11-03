--  NUEVA FUNCIÓN DE BALANCE CONTABLE PARA CUANDO CAMBIE EL GRUPO
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