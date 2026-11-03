CREATE TYPE mod_loginventario.td_inventarioinmovilizado AS (
  idestructuraop NUMERIC(25,0),
  cantdocumentos NUMERIC(25,0),
  cantelaboracion NUMERIC(25,0),
  cantpreparado NUMERIC(25,0),
  aprobadosnocumplimentados NUMERIC(25,0),
  cantproductos NUMERIC(25,0),
  importeinmovilizado NUMERIC(25,6),
  importeinventario NUMERIC(25,6),
  porciento NUMERIC(25,2),
  deposito VARCHAR(255),
  iddeposito NUMERIC(25,0)
);

ALTER TYPE mod_loginventario.td_inventarioinmovilizado
  OWNER TO zeolides;



CCREATE OR REPLACE FUNCTION mod_loginventario.f_inventarioinmovilizado (
  p_iddeposito numeric [],
  p_idestructura numeric,
  p_idperiodo numeric
)
RETURNS SETOF mod_loginventario.td_inventarioinmovilizado AS
$body$
DECLARE

  v_rec mod_loginventario.td_inventarioinmovilizado;
  iddeposito numeric;

BEGIN
  CREATE temp table result of mod_loginventario.td_inventarioinmovilizado;

  if p_iddeposito is not null then

    for i in 1..array_upper(p_iddeposito, 1)

    LOOP
      insert into
        result(
        (
                 SELECT
                   distinct deop.idestructuraop as iddeposito,
                  
                  (
                     select
                       count(DISTINCT dpo.idorden)
                     FROM
                       mod_logdistribucion.dat_prodorden dpo
                       INNER JOIN mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
                       INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
                       INNER JOIN mod_logistica.dat_documento doc on doc.iddocumento = dpo.idorden
                       INNER JOIN mod_estructuracomp.dat_estructuraop deop ON deop.idproyecto = 0
                        and deop.idestructuraop = dp.idestructura
                     WHERE
                       (dpoc.pendiente = dpo.cantidad OR
                       dpoc.entregado < dpo.cantidad) AND
                       dp.idestructura = p_iddeposito[i] AND
                       doc.idperiodo IN (p_idperiodo) and
                       doc.estado in (1, 2, 3)
                        GROUP BY deop.idestructuraop 
        				ORDER BY deop.idestructuraop 
                   ) as cantdocumentos,
                   (
                     SELECT
                       count(DISTINCT ddist.iddistribucion)
                     FROM
                       mod_logistica.dat_documento doc
                       INNER JOIN mod_logdistribucion.dat_distribucion ddist on ddist.iddistribucion = doc.iddocumento
                       INNER JOIN mod_logdistribucion.dat_prodorden dpo ON dpo.idorden = ddist.iddistribucion
                       Inner JOIN mod_logistica.dat_producto p on p.idproducto = dpo.idproducto
                     where
                       dpo.cantidad > 0 and
                       doc.estado = 1 AND
                       doc.idperiodo IN (p_idperiodo) AND
                       p.idestructura = p_iddeposito[i]
                   ) as cantelaboracion,
                   (
                     SELECT
                       count(DISTINCT ddist.iddistribucion)
                     FROM
                       mod_logistica.dat_documento doc
                       INNER JOIN mod_logdistribucion.dat_distribucion ddist on ddist.iddistribucion = doc.iddocumento
                       INNER JOIN mod_logdistribucion.dat_prodorden dpo ON dpo.idorden = ddist.iddistribucion
                       Inner JOIN mod_logistica.dat_producto p on p.idproducto = dpo.idproducto
                     where
                       doc.estado = 2 AND
                       doc.idperiodo IN (p_idperiodo) AND
                       p.idestructura = p_iddeposito[i]
                   ) as cantpreparado,
                   (
                     SELECT
                       count(DISTINCT dpo.idorden)
                     FROM
                       mod_logdistribucion.dat_prodorden dpo
                       INNER JOIN mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
                       INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
                       INNER JOIN mod_logistica.dat_documento doc on doc.iddocumento = dpo.idorden
                     WHERE
                       (dpoc.pendiente = dpo.cantidad OR
                       dpoc.entregado < dpo.cantidad) AND
                       dp.idestructura = p_iddeposito[i] AND
                       doc.idperiodo IN (p_idperiodo) and
                       doc.estado in (3)
                   ) as aprobadosnocumplimentados,
                   (
                     SELECT
                       count(DISTINCT dpo.idproducto)
                     FROM
                       mod_logistica.dat_documento doc
                       INNER JOIN mod_logdistribucion.dat_distribucion ddist on ddist.iddistribucion = doc.iddocumento
                       INNER JOIN mod_logdistribucion.dat_prodorden dpo ON dpo.idorden = ddist.iddistribucion
                       Inner JOIN mod_logistica.dat_producto p on p.idproducto = dpo.idproducto
                     Where
                       p.idestructura = p_iddeposito[i]
                   ) as cantproductos,
                   (
                     SELECT
                       SUM(dp.precio * dpo.cantidad)
                     FROM
                       mod_logdistribucion.dat_prodorden dpo
                       INNER JOIN mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
                       INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
                       INNER JOIN mod_logistica.dat_documento doc on doc.iddocumento = dpo.idorden 
                       AND dp.idestructura = p_iddeposito[i] AND
                         doc.idperiodo IN (p_idperiodo) and doc.estado in (1, 2, 3)
                   ) as importeInmovilizado,
                   (
                     SELECT
                       SUM(dp.importe)
                     from
                       mod_logistica.dat_producto dp
                       inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dp.idestructura
                     WHERE
                       deop.idestructura= p_iddeposito[i]
                   ) as importeinventario,
                   
                   ((
                      SELECT
                        SUM(dp.precio * dpo.cantidad)
                      FROM
                        mod_logdistribucion.dat_prodorden dpo
                        INNER JOIN mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
                        INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
                        INNER JOIN mod_logistica.dat_documento doc on doc.iddocumento = dpo.idorden
                      WHERE
                        (dpoc.pendiente = dpo.cantidad OR
                        dpoc.entregado < dpo.cantidad) AND
                        dp.idestructura = p_iddeposito[i] AND
                        doc.idperiodo = 990000159 and
                        doc.estado in (1, 2, 3)
                   ) * 100 /
                   (
                     SELECT
                       SUM(dp.importe)
                     from
                       mod_logistica.dat_producto dp
                       inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dp.idestructura
                     WHERE
                       deop.idestructura  = p_iddeposito[i]
                   )) as porciento,
                   (Select vde.denominacion FROM mod_estructuracomp.v_dametodasestructuras vde Where vde.idestructura IN(p_iddeposito[i]))as deposito,
                    deop.idestructuraop as iddeposito
                 FROM
                       mod_logistica.dat_documento doc
                       INNER JOIN mod_logdistribucion.dat_distribucion ddist on ddist.iddistribucion = doc.iddocumento
                       INNER JOIN mod_logdistribucion.dat_prodorden dpo ON dpo.idorden = ddist.iddistribucion
                       Inner JOIN mod_logistica.dat_producto p on p.idproducto = dpo.idproducto
                       INNER JOIN mod_estructuracomp.dat_estructuraop deop ON deop.idproyecto = 0 and deop.idestructuraop = p.idestructura
                 WHERE
                    deop.idestructuraop = p_iddeposito[i]
                     and p.idestructuracomun IN (p_idestructura)
                     and doc.iddocumento > 0
                      and (
                     select
                       count(DISTINCT dpo.idorden)
                     FROM
                       mod_logdistribucion.dat_prodorden dpo
                       INNER JOIN mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
                       INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
                       INNER JOIN mod_logistica.dat_documento doc on doc.iddocumento = dpo.idorden
                       INNER JOIN mod_estructuracomp.dat_estructuraop deop ON deop.idproyecto = 0
                        and deop.idestructuraop = dp.idestructura
                     WHERE
                       (dpoc.pendiente = dpo.cantidad OR
                       dpoc.entregado < dpo.cantidad) AND
                       dp.idestructura = p_iddeposito[i] AND
                       doc.idperiodo IN (p_idperiodo) and
                       doc.estado in (1, 2, 3)
                        GROUP BY deop.idestructuraop 
        				ORDER BY deop.idestructuraop 
                   ) > 0
                 GROUP BY
                   deop.idestructuraop
                 ORDER BY
                   deop.idestructuraop
        )
        );

    END LOOP;

  End IF;

  return query (
  Select
    *
  from
    result);

drop table result;
         

    END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_inventarioinmovilizado (p_iddeposito numeric [], p_idestructura numeric, p_idperiodo numeric)
  OWNER TO zeolides;