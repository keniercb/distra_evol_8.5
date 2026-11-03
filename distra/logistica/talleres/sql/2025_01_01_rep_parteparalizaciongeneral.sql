--------------- SQL ---------------

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ADD COLUMN idestructuracomun NUMERIC(19,0) NOT NULL;
  
--------------- SQL ---------------

CREATE OR REPLACE FUNCTION mod_logtaller.f_parte_general (
  p_idestructuras numeric [],
  p_idconfiguraciones numeric [],
  p_idusuario numeric
)
RETURNS void AS
$body$
DECLARE
  v_tipo numeric [ ];
  v_gruposubgrupo numeric [ ];
  v_marca numeric [ ];
  v_modelo numeric [ ];
  v_paralizados RECORD;
  v_paralizados_enbase RECORD;
  v_paralizados_enbase_rangos RECORD;
BEGIN
  --limpiar datos
  DELETE
  FROM mod_logtaller.rep_parteparalizaciongeneral
  WHERE idusuario = $3;

--por cada configuracion
  for i in 1..array_length($2, 1) :: integer
  loop
    v_tipo := (
    select array_agg(idtipo)
    from mod_logtaller.dat_reportetipo
    where idreporteparalizacion = $2 [ i ]);
    --
    v_gruposubgrupo := (
    select array_agg(idgruposubgrupo)
    from mod_logtaller.dat_reportegruposubgrupo
    where idreporteparalizacion = $2 [ i ]);
    --
    v_marca := (
    select array_agg(idmarca)
    from mod_logtaller.dat_reportemarca
    where idreporteparalizacion = $2 [ i ]);
    --
    v_modelo := (
    select array_agg(idmodelo)
    from mod_logtaller.dat_reportemodelo
    where idreporteparalizacion = $2 [ i ]);
    --

    insert into mod_logtaller.rep_parteparalizaciongeneral(idusuario, idconfiguracion, denoconfiguracion, agencia, idestructuracomun, total) (
--
    SELECT $3 as idusuario, $2 [ i ] as idconfiguracion, rp.denominacion as denoconfiguracion, vest.denominacion as agencia, p.idestructuracomun,
      count(rna.idregnumerico) as total
    FROM mod_logactivofijotangible.dat_regnumericoactivo rna
         INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idregnumerico = rna.idregnumerico
         INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn.idproducto
         INNER JOIN mod_datosmaestros.nom_indicadorhoja indh ON indh.idindicador = p.idindicador
         INNER JOIN mod_datosmaestros.nom_indicador ind ON ind.idindicador = indh.idindicador
         INNER JOIN mod_datosmaestros.nom_indicador ind2 ON ind2.idindicador = ind.idarbol
         INNER JOIN mod_estructuracomp.v_dametodasestructuras vest ON vest.idestructura = p.idestructuracomun
         INNER JOIN mod_logtaller.conf_reporteparalizacion rp ON rp.idreporteparalizacion = $2 [ i ]
    WHERE rna.idestadoperacion NOT IN (7) AND
          p.idestructuracomun = any ($1) AND
          (CASE WHEN v_tipo is null AND v_gruposubgrupo is null AND v_marca is null AND v_modelo is null THEN false ELSE true END) AND          
          (case
             when v_tipo is not null then ind2.idpadre = any (v_tipo)
             else true
           end)
          --
          and
          (case
             when v_gruposubgrupo is not null then rna.idgruposubgrupo = any (v_gruposubgrupo)
             else true
           end)
          --marca
          AND
          (case
             when v_marca is not null then (indh.idmarca = ANY (v_marca))
             else true
           end)
          --modelo
          AND
          (case
             when v_modelo is not null then (indh.idmodelo = ANY (v_modelo))
             else true
           end)
    GROUP BY p.idestructuracomun, vest.denominacion, rp.denominacion);

    FOR v_paralizados IN (
    SELECT p.idestructuracomun,
           count(rna.idregnumerico) as total
    FROM mod_logactivofijotangible.dat_regnumericoactivo rna
         INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idregnumerico = rna.idregnumerico
         INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn.idproducto
         INNER JOIN mod_datosmaestros.nom_indicadorhoja indh ON indh.idindicador = p.idindicador
         INNER JOIN mod_datosmaestros.nom_indicador ind ON ind.idindicador = indh.idindicador
         INNER JOIN mod_datosmaestros.nom_indicador ind2 ON ind2.idindicador = ind.idarbol
         INNER JOIN mod_logtaller.conf_reporteparalizacion rp ON rp.idreporteparalizacion = $2 [ i ]
    WHERE rna.idestadoperacion NOT IN (7) AND
          rna.idestadoperacion IN (5) AND
          p.idestructuracomun = any ($1) AND
          (case
             when v_tipo is not null then ind2.idpadre = any (v_tipo)
             else true
           end)
          --
          and
          (case
             when v_gruposubgrupo is not null then rna.idgruposubgrupo = any (v_gruposubgrupo)
             else true
           end)
          --marca
          AND
          (case
             when v_marca is not null then (indh.idmarca = ANY (v_marca))
             else true
           end)
          --modelo
          AND
          (case
             when v_modelo is not null then (indh.idmodelo = ANY (v_modelo))
             else true
           end)
    GROUP BY p.idestructuracomun,
                 rp.denominacion)
  LOOP
      UPDATE mod_logtaller.rep_parteparalizaciongeneral
      SET paralizados = v_paralizados.total,
          buenestado = total - v_paralizados.total
      WHERE idusuario = $3 AND
            idconfiguracion = $2 [ i ] AND
            idestructuracomun = v_paralizados.idestructuracomun;

  END LOOP;
  
  FOR v_paralizados_enbase IN (
    SELECT count(mo.idordentrabajo) as total,
           doc.idestructuracomun
    FROM mod_logtaller.dat_medioorden mo
         INNER JOIN mod_logtaller.dat_ordentrabajo ot ON ot.idordentrabajo = mo.idordentrabajo
         INNER JOIN mod_logistica.dat_documento doc ON mo.idordentrabajo = doc.iddocumento
         --
         INNER JOIN mod_datosmaestros.nom_indicador ind ON mo.idindicador = ind.idindicador
         INNER JOIN mod_datosmaestros.nom_indicador ind2 ON ind2.idindicador = ind.idarbol
         INNER JOIN mod_datosmaestros.nom_indicadorhoja indh ON ind.idindicador = indh.idindicador
         LEFT JOIN mod_datosmaestros.nom_marca marca ON marca.idmarca =
         (
           select m.idmarca
           FROM (
                  SELECT value
                  FROM json_array_elements(cast ((mo.dinamicos) as json)) as id
                ) d
                INNER JOIN mod_datosmaestros.nom_marca m ON m.denominacion = d.value::json ->> 'marca'
           WHERE d.value::json ->> 'marca' IS NOT NULL
           LIMIT 1
         )
         LEFT JOIN mod_datosmaestros.nom_modelo modelo ON modelo.idmodelo =
         (
           select m.idmodelo
           FROM (
                  SELECT value
                  FROM json_array_elements(cast ((mo.dinamicos) as json)) as id
                ) d
                INNER JOIN mod_datosmaestros.nom_modelo m ON m.denominacion = d.value::json ->> 'modelo'
           WHERE d.value::json ->> 'modelo' IS NOT NULL
           LIMIT 1
         )
         LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = mo.idproducto
         INNER JOIN mod_datosmaestros.nom_gruposubgrupo ng ON ng.idgruposubgrupo = rna.idgruposubgrupo
    where doc.estado in (1, 2) and
          doc.idestructuracomun = any ($1)
          --
          AND
          (case
             when v_tipo is not null then ind2.idpadre = any (v_tipo)
             else true
           end)
          --
          and
          (case
             when v_gruposubgrupo is not null then ng.idgruposubgrupo = any (v_gruposubgrupo)
             else true
           end)
          --marca
          AND
          (case
             when v_marca is not null then (marca.idmarca = ANY (v_marca))
             else true
           end)
          --modelo
          AND
          (case
             when v_modelo is not null then (modelo.idmodelo = ANY (v_modelo))
             else true
           end)
    GROUP BY doc.idestructuracomun)
  LOOP
      UPDATE mod_logtaller.rep_parteparalizaciongeneral
      SET paralizadosenbase = v_paralizados_enbase.total,
          paralizadosotrostalleres = paralizados - v_paralizados_enbase.total
      WHERE idusuario = $3 AND
            idconfiguracion = $2 [ i ] AND
            idestructuracomun = v_paralizados_enbase.idestructuracomun;

  END LOOP;
  
  FOR v_paralizados_enbase_rangos IN (SELECT sum(rangos.rango1_30) as rango1_30,
                                             sum(rangos.rango31_60) as rango31_60,
                                             sum(rangos.rango61_90) as rango61_90,
                                             sum(rangos.rango91_120) as rango91_120,
                                             sum(rangos.rango121_360) as rango121_360,
                                             sum(rangos.rango360) as rango360,
                                             rangos.idestructuracomun
                                      FROM (
                                             SELECT idordentrabajo,
                                                    idestructuracomun,
                                                    disparalizado,
                                                    CASE
                                                      WHEN disparalizado BETWEEN 0 AND 30 THEN 1
                                                      ELSE 0
                                                    END as rango1_30,
                                                    CASE
                                                      WHEN disparalizado BETWEEN 31 AND 60 THEN 1
                                                      ELSE 0
                                                    END as rango31_60,
                                                    CASE
                                                      WHEN disparalizado BETWEEN 61 AND 90 THEN 1
                                                      ELSE 0
                                                    END as rango61_90,
                                                    CASE
                                                      WHEN disparalizado BETWEEN 91 AND 120 THEN 1
                                                      ELSE 0
                                                    END as rango91_120,
                                                    CASE
                                                      WHEN disparalizado BETWEEN 121 AND 360 THEN 1
                                                      ELSE 0
                                                    END as rango121_360,
                                                    CASE
                                                      WHEN disparalizado > 360 THEN 1
                                                      ELSE 0
                                                    END as rango360
                                             FROM (
                                                    SELECT idordentrabajo,
                                                           idestructuracomun,
                                                           (
                                                             select extract(days
                                                             from (now() - paralizados.fechainicio))
                                                           ) as disparalizado
                                                    FROM (
                                                           SELECT mo.idordentrabajo,
                                                                  doc.idestructuracomun,
                                                                  ot.fechainicio
                                                           FROM mod_logtaller.dat_medioorden mo
                                                                INNER JOIN mod_logtaller.dat_ordentrabajo ot ON ot.idordentrabajo = mo.idordentrabajo
                                                                INNER JOIN mod_logistica.dat_documento doc ON mo.idordentrabajo = doc.iddocumento
                                                                --
                                                                INNER JOIN mod_datosmaestros.nom_indicador ind ON mo.idindicador = ind.idindicador
                                                                INNER JOIN mod_datosmaestros.nom_indicador ind2 ON ind2.idindicador = ind.idarbol
                                                                INNER JOIN mod_datosmaestros.nom_indicadorhoja indh ON ind.idindicador =
                                                                  indh.idindicador
                                                                LEFT JOIN mod_datosmaestros.nom_marca marca ON marca.idmarca =
                                                                (
                                                                  select m.idmarca
                                                                  FROM (
                                                                         SELECT value
                                                                         FROM json_array_elements(cast ((mo.dinamicos) as json)) as id
                                                                       ) d
                                                                       INNER JOIN mod_datosmaestros.nom_marca m ON m.denominacion = d.value::json ->>
                                                                         'marca'
                                                                  WHERE d.value::json ->> 'marca' IS NOT NULL
                                                                  LIMIT 1
                                                                )
                                                                LEFT JOIN mod_datosmaestros.nom_modelo modelo ON modelo.idmodelo =
                                                                (
                                                                  select m.idmodelo
                                                                  FROM (
                                                                         SELECT value
                                                                         FROM json_array_elements(cast ((mo.dinamicos) as json)) as id
                                                                       ) d
                                                                       INNER JOIN mod_datosmaestros.nom_modelo m ON m.denominacion = d.value::json ->>
                                                                         'modelo'
                                                                  WHERE d.value::json ->> 'modelo' IS NOT NULL
                                                                  LIMIT 1
                                                                )
                                                                LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico =
                                                                  mo.idproducto
                                                                INNER JOIN mod_datosmaestros.nom_gruposubgrupo ng ON ng.idgruposubgrupo =
                                                                  rna.idgruposubgrupo
                                                           where doc.estado in (1, 2) and
                                                                 doc.idestructuracomun = any ($1)
                                                                 --
                                                                 AND
                                                                 (case
                                                                    when v_tipo is not null then ind2.idpadre = any (v_tipo)
                                                                    else true
                                                                  end)
                                                                 --
                                                                 and
                                                                 (case
                                                                    when v_gruposubgrupo is not null then ng.idgruposubgrupo = any (v_gruposubgrupo)
                                                                    else true
                                                                  end)
                                                                 --marca
                                                                 AND
                                                                 (case
                                                                    when v_marca is not null then (marca.idmarca = ANY (v_marca))
                                                                    else true
                                                                  end)
                                                                 --modelo
                                                                 AND
                                                                 (case
                                                                    when v_modelo is not null then (modelo.idmodelo = ANY (v_modelo))
                                                                    else true
                                                                  end)
                                                                 
                                                         ) as paralizados
                                                  ) as diasparalizados
                                           ) as rangos
                                      GROUP BY rangos.idestructuracomun)
  LOOP
      UPDATE mod_logtaller.rep_parteparalizaciongeneral
      SET rango1_30 = v_paralizados_enbase_rangos.rango1_30,
          rango31_60 = v_paralizados_enbase_rangos.rango31_60,
          rango61_90 = v_paralizados_enbase_rangos.rango61_90,
          rango91_120 = v_paralizados_enbase_rangos.rango91_120,
          rango121_360 = v_paralizados_enbase_rangos.rango121_360,
          rango360 = v_paralizados_enbase_rangos.rango360,
          cdt =(CASE
                  WHEN total > 0 THEN buenestado / total
                  ELSE 0
                END)
          --            buenestado / total
      WHERE idusuario = $3 AND
            idconfiguracion = $2 [ i ] AND
            idestructuracomun = v_paralizados_enbase_rangos.idestructuracomun;

  END LOOP;
  
  end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;