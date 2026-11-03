--------------- SQL ---------------

CREATE OR REPLACE FUNCTION mod_logtaller.f_parte (
  p_idestructuras numeric [],
  p_idconfiguraciones numeric [],
  p_idusuario numeric,
  p_cliente numeric []
)
RETURNS void AS
$body$
DECLARE
  v_tipo numeric [ ];
  v_gruposubgrupo numeric [ ];
  v_marca numeric [ ];
  v_modelo numeric [ ];

BEGIN
  --limpiar datos

  DELETE
  FROM mod_logtaller.rep_parteparalizacion
  WHERE idusuario = $3;

  for i in 1..array_length($2, 1) :: integer
  loop
    v_tipo := (
    select array_agg(idtipo)
    from mod_logtaller.dat_reportetipo
    where idreporteparalizacion = $2 [ i ]);
    v_gruposubgrupo := (
    select array_agg(idgruposubgrupo)
    from mod_logtaller.dat_reportegruposubgrupo
    where idreporteparalizacion = $2 [ i ]);
    v_marca := (
    select array_agg(idmarca)
    from mod_logtaller.dat_reportemarca
    where idreporteparalizacion = $2 [ i ]);
    v_modelo := (
    select array_agg(idmodelo)
    from mod_logtaller.dat_reportemodelo
    where idreporteparalizacion = $2 [ i ]);
    --

    insert into mod_logtaller.rep_parteparalizacion(idordentrabajo, idusuario, idconfiguracion, agencia, nroorden, ubicacion, cliente, matricula,
      marca, modelo, fechainicio, diasparalizado, indicativo, dictamentecnico, fechafin, sobreestadia, importepiezas, importeactividad, nropedido,
      fechapedido, observaciones, denoconfiguracion, garantia)
                --
                (with costematerial as (
                                         select idordentrabajo,
                                                sum(importecup) as costopiezas
                                         from mod_logtaller.dat_material
                                         group by idordentrabajo
                ),
                --
                costoactividad as (
                                    select doa.idordentrabajo,
                                           sum(costo) as costoactividad
                                    from mod_logtaller.dat_ordenactividad doa
                                    group by 1
                )
    SELECT mo.idordentrabajo, $3 as idusuario, $2 [ i ] as idconfiguracion, vest.denominacion as agencia, doc.nrodoc, ub.denominacion as ubicacion,
           --
           CASE
             WHEN cp.codigonit IS NULL THEN cp.codigo || ' ' || cp.nombre
             ELSE cp.codigonit || ' ' || cp.nombre
           END as cliente,
           --
           (
             select d.value::json -> 'nromatricula'
             from (
                    SELECT value
                    FROM json_array_elements(cast (mo.dinamicos as json))
                  ) d
             WHERE d.value::json -> 'nromatricula' IS NOT NULL
             LIMIT 1
           ) as matricula,
           --
           (
             select d.value::json -> 'marca'
             from (
                    SELECT value
                    FROM json_array_elements(cast (mo.dinamicos as json))
                  ) d
             WHERE d.value::json -> 'marca' IS NOT NULL
             LIMIT 1
           ) as marca,
           --
           (
             select d.value::json -> 'modelo'
             from (
                    SELECT value
                    FROM json_array_elements(cast (mo.dinamicos as json))
                  ) d
             WHERE d.value::json -> 'modelo' IS NOT NULL
             LIMIT 1
           ) as modelo,
           --
           ot.fechainicio, (
                             select extract(days
                             from (now() - ot.fechainicio))
           ) as disparalizado, rnat.indicativo, ot.dictamentecnico, ot.fechafin, (
                                                                                   select extract(days
                                                                                   from (now() - ot.fechafin))
           ) as sobreestadia, COALESCE(cm.costopiezas, 0) as importepiezas, COALESCE(ca.costoactividad, 0) as importeactividad,
           --
           (
             select array_to_string(array
                    (
                      select dc.nrodoc
                      from mod_logistica.dat_documentopadre daddy
                           inner join mod_logistica.dat_documento dc on dc.iddocumento = daddy.iddocumento
                           left join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dc.iddoc
                      where daddy.idpadre = mo.idordentrabajo and
                            ddp.sigla like 'pedido'
                    ), '', '')
           ) as nropedido, 'null' as fechapedido, doco.observaciones, rp.denominacion as tipomedio, ot.garantia
    FROM mod_logtaller.dat_medioorden mo
         INNER JOIN mod_logtaller.dat_ordentrabajo ot ON ot.idordentrabajo = mo.idordentrabajo
         INNER JOIN mod_logtaller.nom_ubicaciontall ub ON ub.idubicaciontall = ot.ubicacionactual
         INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores = ot.idcliente
         INNER JOIN mod_logistica.dat_documento doc ON mo.idordentrabajo = doc.iddocumento
         LEFT JOIN mod_logistica.dat_docobservaciones doco ON doco.iddocumento = doc.iddocumento
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
         LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp rnat ON rnat.idregnumerico = rna.idregnumerico
         LEFT JOIN mod_datosmaestros.nom_gruposubgrupo ng ON ng.idgruposubgrupo = rna.idgruposubgrupo
         INNER JOIN mod_estructuracomp.v_dametodasestructuras vest ON vest.idestructura = doc.idestructuracomun
         LEFT JOIN costematerial as cm on cm.idordentrabajo = mo.idordentrabajo
         LEFT JOIN costoactividad as ca on ca.idordentrabajo = mo.idordentrabajo
         INNER JOIN mod_logtaller.conf_reporteparalizacion rp ON rp.idreporteparalizacion = $2 [ i ]
    where doc.estado in (1, 2) and
          doc.idestructuracomun = any ($1) AND
          cp.idclientesproveedores = ANY ($4) AND
          (case
             when v_tipo is not null then ind2.idpadre = any (v_tipo)
             else true
           end) and
          (case
             when v_gruposubgrupo is not null then ng.idgruposubgrupo = any (v_gruposubgrupo)
             else true
           end) AND
          (case
             when v_marca is not null then (marca.idmarca = ANY (v_marca))
             else true
           end) AND
          (case
             when v_modelo is not null then (modelo.idmodelo = ANY (v_modelo))
             else true
           end));
  end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;