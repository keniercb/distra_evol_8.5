<?php

class DatActividadentidadsisplaninversiones extends DatActividadentidad {

    public function calcularImporteTotalN($parametros) {
        $modelo = new NomActividad();
        $nivel = $modelo->getNivel();
        $query = "--proyeccion de la planificacion
--ver detalles niveles
WITH
consulta AS (
(SELECT x.codigo,
        ((SUM(x.importegasto))) as importegasto,
        ((SUM(x.importeingreso))) as importeingreso
 FROM (
        SELECT a.codigo,
               COALESCE((
                          select (round(Coalesce(SUM((n.cantplanif / n.cantbase)* indp.precio) *(
                          COALESCE(aem.nivelactividadmanual,0) + 
                          COALESCE(aea.nivelactividadautomatico, 0) +
                          COALESCE(aep.nivelactividadproduccion, 0) + 
                          COALESCE(aee.nivelactividadelemento, 0) + 
                          COALESCE(SUM(aei.plan), 0)), 0) +(
                          
                          Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precio) *(
                          COALESCE(aem.nivelactividadmanual, 0) + 
                          COALESCE(aea.nivelactividadautomatico, 0) + 
                          COALESCE(aep.nivelactividadproduccion, 0)+ 
                          COALESCE(aee.nivelactividadelemento, 0) + 
                          COALESCE(SUM(aei.plan), 0)), 0)) * indp.flete / 100 +(
                          
                          Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precio) *(
                            COALESCE(aem.nivelactividadmanual, 0) + 
                            COALESCE(aea.nivelactividadautomatico, 0) + 
                            COALESCE(aep.nivelactividadproduccion, 0) + 
                            COALESCE(aee.nivelactividadelemento, 0) + 
                            COALESCE(SUM(aei.plan), 0)), 0)) * indp.contingencia / 100, 3) +(
                            
                            round(SUM((n.cantplanif / n.cantbase) * indp.precio) * 
                            COALESCE(ae.ajuste, 0) +(
                            
                            SUM((n.cantplanif /n.cantbase) * indp.precio) * 
                            COALESCE(ae.ajuste, 0)) * indp.flete / 100 +(
                            
                            SUM((n.cantplanif / n.cantbase) * indp.precio) * 
                            COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3))) as importefinal
                            
                          from mod_planificacion.dat_norma n
                               INNER JOIN mod_datosmaestros.nom_indicador ind 
                               ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                               ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                               LEFT JOIN mod_datosmaestros.dat_indicadormodelo im 
                               ON (indp.idindicador = im.idindicador)
                          where n.idactividad = a.idactividad AND
                                n.idejercicio = {$parametros['idejercicio']}  AND
                                m.tipoplan = 0 AND
                                im.idindicador is null
                          group by indp.flete,
                                   indp.contingencia), 0) as importegasto,
                                   
               COALESCE((
                          select (round(Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precioventa) *(
                          COALESCE(aem.nivelactividadmanual, 0) + 
                          COALESCE(aea.nivelactividadautomatico, 0) + 
                          COALESCE(aep.nivelactividadproduccion, 0) + 
                          COALESCE(aee.nivelactividadelemento, 0) + 
                          COALESCE(SUM(aei.plan), 0)), 0) +(
                          
                          Coalesce(SUM((n.cantplanif /n.cantbase) * indp.precioventa) *(
                          COALESCE(aem.nivelactividadmanual, 0) + 
                          COALESCE(aea.nivelactividadautomatico, 0) + 
                          COALESCE(aep.nivelactividadproduccion, 0) + 
                          COALESCE(aee.nivelactividadelemento, 0) + 
                          COALESCE(SUM(aei.plan), 0)), 0)) * indp.flete / 100 +(
                          
                          Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precioventa) *(
                          COALESCE(aem.nivelactividadmanual, 0) + 
                          COALESCE(aea.nivelactividadautomatico, 0) + 
                          COALESCE(aep.nivelactividadproduccion, 0) + 
                          COALESCE(aee.nivelactividadelemento, 0) + 
                          COALESCE(SUM(aei.plan), 0)), 0)) * indp.contingencia / 100, 3) +(
                          
                          round(SUM((n.cantplanif / n.cantbase) * indp.precioventa) *
                          COALESCE(ae.ajuste, 0) +(
                            
                          SUM((n.cantplanif / n.cantbase) * indp.precioventa) *
                          COALESCE(ae.ajuste, 0)) * indp.flete / 100 +(
                            
                          SUM((n.cantplanif / n.cantbase) * indp.precioventa) *
                          COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3))) as importefinal
                          
                          from mod_planificacion.dat_norma n
                               INNER JOIN mod_datosmaestros.nom_indicador ind 
                               ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                               ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                               LEFT JOIN mod_datosmaestros.dat_indicadormodelo im 
                               ON (ind.idindicador = im.idindicador)
                          where n.idactividad = a.idactividad AND
                                n.idejercicio = {$parametros['idejercicio']}  AND
                                m.tipoplan = 1 AND
                                im.idindicador is null
                          group by indp.flete,
                                   indp.contingencia), 0) as importeingreso
                                   
        FROM mod_planificacion.nom_actividad a
             LEFT JOIN mod_planificacion.dat_actividadentidad ae 
             ON (a.idactividad = ae.idactividad AND ae.idejercicio = {$parametros['idejercicio']}  AND ae.identidad IN ({$parametros['identidades']}))
             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem 
             ON (aem.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea 
             ON (aea.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep 
             ON (aep.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose  aei 
             ON (aei.idactividadentidad = ae.idactividadentidad AND aei.idejercicio = {$parametros['idejercicio']} )
             LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
             ON (aee.idactividadentidad = ae.idactividadentidad)
             INNER JOIN mod_planificacion.dat_actividadmodelo am 
             ON (a.idactividad = am.idactividad)
             INNER JOIN mod_planificacion.dat_modelo m 
             ON (m.idmodelo = am.idmodelo)
        WHERE m.idmodelo IN ({$parametros['planes']}) AND
              a.nivel = {$nivel} AND
              a.idaprobacion = 4 AND
              a.estado = 1 AND
              (ae.idaprobacion = 5 OR
              ae.idaprobacion = 4)
              GROUP BY a.codigo,aem.nivelactividadmanual,aee.nivelactividadelemento, aea.nivelactividadautomatico,aep.nivelactividadproduccion,ae.ajuste,a.idactividad,m.tipoplan
      ) as x
 GROUP BY x.codigo)),
consulta2 AS
(--esta es la de los ind directos
SELECT x.codigo,
       ((SUM(x.importegasto))) as importegasto,
       ((SUM(x.importeingreso))) as importeingreso
FROM (
       SELECT a.codigo,
              COALESCE((
                         select (round(Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precio) *(
                         COALESCE(aem.nivelactividadmanual, 0) + 
                         COALESCE(aea.nivelactividadautomatico, 0) +
                         COALESCE(aep.nivelactividadproduccion, 0) + 
                         COALESCE(aee.nivelactividadelemento, 0) + 
                         COALESCE(SUM(aei.plan), 0)), 0) +(
                         
                         Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precio) *(
                         COALESCE(aem.nivelactividadmanual, 0) + 
                         COALESCE(aea.nivelactividadautomatico, 0) + 
                         COALESCE(aep.nivelactividadproduccion, 0) + 
                         COALESCE(aee.nivelactividadelemento, 0) + 
                         COALESCE(SUM(aei.plan), 0)), 0)) * indp.flete / 100 +(
                         
                         Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precio) *(
                         COALESCE(aem.nivelactividadmanual, 0) + 
                         COALESCE(aea.nivelactividadautomatico, 0) + 
                         COALESCE(aep.nivelactividadproduccion, 0) + 
                         COALESCE(aee.nivelactividadelemento, 0) + 
                         COALESCE(SUM(aei.plan), 0)), 0)) * indp.contingencia / 100, 3) +(
                         
                         round(SUM((n.cantplanif / n.cantbase) * indp.precio)  * 
                         COALESCE(ae.ajuste, 0) +(
                         
                         SUM((n.cantplanif / n.cantbase) * indp.precio) * 
                         COALESCE(ae.ajuste, 0)) * indp.flete / 100 +(
                         
                         SUM((n.cantplanif / n.cantbase) * indp.precio) * 
                         COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3))) as importefinal
                         
                         from mod_planificacion.dat_norma n
                              INNER JOIN mod_datosmaestros.nom_indicador ind 
                              ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                              ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                              INNER JOIN mod_datosmaestros.dat_indicadormodelo im 
                              ON (ind.idindicador = im.idindicador)
                              INNER JOIN mod_planificacion.dat_modelo m 
                              ON (m.idmodelo = im.idmodelo)
                         where m.idmodelo IN ({$parametros['planes']}) AND
                               n.idactividad = a.idactividad AND
                               n.idejercicio = {$parametros['idejercicio']}  AND
                               m.tipoplan = 0
                         group by indp.flete,
                                  indp.contingencia), 0) as importegasto,
                                  
              COALESCE((
                         select (round(Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precioventa) *(
                         COALESCE(aem.nivelactividadmanual, 0) + 
                         COALESCE(aea.nivelactividadautomatico, 0) + 
                         COALESCE(aep.nivelactividadproduccion, 0) + 
                         COALESCE(aee.nivelactividadelemento, 0) + 
                         COALESCE(SUM(aei.plan), 0)), 0) +(
                         
                         Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precioventa) *(
                         COALESCE(aem.nivelactividadmanual, 0) + 
                         COALESCE(aea.nivelactividadautomatico, 0) + 
                         COALESCE(aep.nivelactividadproduccion, 0) + 
                         COALESCE(aee.nivelactividadelemento, 0) + 
                         COALESCE(SUM(aei.plan), 0)), 0)) * indp.flete / 100 +(
                         
                         Coalesce(SUM((n.cantplanif / n.cantbase) * indp.precioventa) *(
                         COALESCE(aem.nivelactividadmanual, 0) +
                         COALESCE(aea.nivelactividadautomatico, 0) + 
                         COALESCE(aep.nivelactividadproduccion, 0) + 
                         COALESCE(aee.nivelactividadelemento, 0) + 
                         COALESCE(SUM(aei.plan), 0)), 0)) * indp.contingencia / 100, 3) +(
                         
                         round(SUM((n.cantplanif / n.cantbase) *indp.precioventa) * 
                         COALESCE(ae.ajuste, 0) +(
                         
                         SUM((n.cantplanif / n.cantbase) * indp.precioventa) *
                         COALESCE(ae.ajuste, 0)) * indp.flete / 100 +(
                           
                         SUM((n.cantplanif / n.cantbase) * indp.precioventa) *
                         COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3))) as importefinal
                         
                         from mod_planificacion.dat_norma n
                              INNER JOIN mod_datosmaestros.nom_indicador ind 
                              ON (n.idindicador = ind.idindicador AND ind.estado = 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                              ON (n.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                              INNER JOIN mod_datosmaestros.dat_indicadormodelo im 
                              ON (ind.idindicador = im.idindicador)
                              INNER JOIN mod_planificacion.dat_modelo m 
                              ON (m.idmodelo = im.idmodelo)
                         where m.idmodelo IN ({$parametros['planes']}) AND
                               n.idactividad = a.idactividad AND
                               n.idejercicio = {$parametros['idejercicio']}  AND
                               m.tipoplan = 1
                         group by indp.flete,
                                  indp.contingencia), 0) as importeingreso
                                  
       FROM mod_planificacion.nom_actividad a
            LEFT JOIN mod_planificacion.dat_actividadentidad ae 
            ON (a.idactividad = ae.idactividad AND ae.idejercicio = {$parametros['idejercicio']}  AND ae.identidad IN ({$parametros['identidades']}))
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem 
            ON (aem.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea 
            ON (aea.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep 
            ON (aep.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei
            ON (aei.idactividadentidad = ae.idactividadentidad AND aei.idejercicio = {$parametros['idejercicio']} )
            LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
            ON (aee.idactividadentidad = ae.idactividadentidad)
            INNER JOIN mod_planificacion.dat_actividadmodelo am 
            ON (a.idactividad = am.idactividad)
       WHERE a.nivel = {$nivel} AND
             a.idaprobacion = 4 AND
             a.estado = 1 AND
             (ae.idaprobacion = 5 OR
             ae.idaprobacion = 4)
             GROUP BY a.codigo,aem.nivelactividadmanual,aee.nivelactividadelemento, aea.nivelactividadautomatico,aep.nivelactividadproduccion,ae.ajuste,a.idactividad
     ) as x
GROUP BY x.codigo)
                 SELECT DISTINCT ((sum(COALESCE(c.importegasto, 0) + COALESCE(q.importegasto, 0))) * {$parametros['porc']}) / 100 as importegasto,
                        ((sum(COALESCE(c.importeingreso, 0) + COALESCE(q.importeingreso, 0))) * {$parametros['porc']}) / 100 as importeingreso
                 from consulta c
                      RIGHT JOIN consulta2 q ON c.codigo = q.codigo";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarDetallesN($identidades, $idejercicio, $porciento, $modelos) {
        $modelo = new NomActividad();
        $nivel = $modelo->getNivel();
        $query = "--proyeccion de la planificacion
--ver detalles niveles
WITH consulta AS (
(SELECT x.idactividad as idactividad,
        x.codigo,
        x.denominacion,
        ((SUM(x.nivelactividad)) * $porciento) / 100 as cantidad,
        ((SUM(x.importegasto)) * $porciento) / 100 as importegasto,
        ((SUM(x.importeingreso)) * $porciento) / 100 as importeingreso
 FROM (
        SELECT a.idactividad as idactividad,
               a.codigo,
               a.denominacion,
               m.denominacion as plan,
               COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(
                 aem.nivelactividadmanual, 0) + COALESCE(
                 aep.nivelactividadproduccion, 0)+ COALESCE(aee.nivelactividadelemento, 0)+ COALESCE(SUM(aei.plan), 0) + COALESCE(
                           ae.ajuste, 0) as nivelactividad,
               COALESCE((
                          select (round(Coalesce(SUM((n.cantplanif / n.cantbase)
                            * indp.precio) *(COALESCE(
                            aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)
                            +(Coalesce(SUM
                            ((n.cantplanif / n.cantbase) * indp.precio) *(
                            COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)) * indp.flete
                            / 100
                             +(Coalesce(SUM((n.cantplanif / n.cantbase) *
                            indp.precio) *(COALESCE(
                            aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)) *
                            indp.contingencia / 100, 3)
                            +(round(SUM((
                            n.cantplanif / n.cantbase) * indp.precio) *
                            COALESCE(ae.ajuste, 0)
                             +(SUM((n.cantplanif /
                            n.cantbase) * indp.precio) * COALESCE(
                            ae.ajuste, 0)) * indp.flete / 100
                            +(SUM((
                            n.cantplanif / n.cantbase) * indp.precio) *
                            COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3
                            ))) as importefinal
                          from mod_planificacion.dat_norma n
                               INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                 (n.idindicador = ind.idindicador AND ind.estado
                                 = 1)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif
                                 indp ON (n.idindicador = indp.idindicador AND
                                 indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                               LEFT JOIN mod_datosmaestros.dat_indicadormodelo
                                 im ON (indp.idindicador = im.idindicador)
                          where n.idactividad = a.idactividad AND
                                n.idejercicio = $idejercicio AND
                                m.tipoplan = 0 AND
                                im.idindicador is null
                          group by indp.flete,
                                   indp.contingencia
               ), 0) as importegasto,
               COALESCE((
                          select (round(Coalesce(SUM((n.cantplanif / n.cantbase)
                            * indp.precioventa) *(COALESCE(
                            aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)
                            +(Coalesce(SUM
                            ((n.cantplanif / n.cantbase) * indp.precioventa) *(
                            COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)) * indp.flete
                            / 100
                             +(Coalesce(SUM((n.cantplanif / n.cantbase) *
                            indp.precioventa) *(COALESCE(
                            aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                            aep.nivelactividadproduccion, 0)), 0)) *
                            indp.contingencia / 100, 3)
                            +(round(SUM((
                            n.cantplanif / n.cantbase) * indp.precioventa) *
                            COALESCE(ae.ajuste, 0)
                             +(SUM((n.cantplanif /
                            n.cantbase) * indp.precioventa) * COALESCE(
                            ae.ajuste, 0)) * indp.flete / 100
                            +(SUM((
                            n.cantplanif / n.cantbase) * indp.precioventa) *
                            COALESCE(ae.ajuste, 0)) * indp.contingencia / 100, 3
                            ))) as importefinal
                          from mod_planificacion.dat_norma n
                               INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                 (n.idindicador = ind.idindicador AND ind.estado
                                 = 1)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif
                                 indp ON (n.idindicador = indp.idindicador AND
                                 indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                               LEFT JOIN mod_datosmaestros.dat_indicadormodelo
                                 im ON (ind.idindicador = im.idindicador)
                          where n.idactividad = a.idactividad AND
                                n.idejercicio = $idejercicio AND
                                m.tipoplan = 1 AND
                                im.idindicador is null
                          group by indp.flete,
                                   indp.contingencia
               ), 0) as importeingreso
        FROM mod_planificacion.nom_actividad a
             LEFT JOIN mod_planificacion.dat_actividadentidad ae ON (
               a.idactividad = ae.idactividad AND ae.idejercicio = $idejercicio AND
               ae.identidad IN ($identidades))
             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
               aem.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
               aea.idactividadentidad = ae.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
               aep.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei
              ON (aei.idactividadentidad = ae.idactividadentidad AND
              aei.idejercicio = $idejercicio )
                   LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee ON (
              aee.idactividadentidad = ae.idactividadentidad)
             INNER JOIN mod_planificacion.dat_actividadmodelo am ON (
               a.idactividad = am.idactividad)
             INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo =
               am.idmodelo)
        WHERE m.idmodelo IN ($modelos) AND
              a.nivel = {$nivel} AND
              a.idaprobacion = 4 AND
              a.estado = 1 AND
              (ae.idaprobacion = 5 OR
              ae.idaprobacion = 4)
              GROUP BY a.codigo,aem.nivelactividadmanual,aee.nivelactividadelemento, aea.nivelactividadautomatico,aep.nivelactividadproduccion,ae.ajuste,a.idactividad,m.tipoplan, m.denominacion
      ) as x
 GROUP BY x.idactividad,
          x.codigo,
          x.denominacion)),
consulta2 AS

(--esta es la de los ind directos
SELECT x.idactividad as idactividad,
       x.codigo,
       x.denominacion,

       ((SUM(x.nivelactividad)) * $porciento) / 100 as cantidad,
       ((SUM(x.importegasto)) * $porciento) / 100 as importegasto,
       ((SUM(x.importeingreso)) * $porciento) / 100 as importeingreso
FROM (
       SELECT a.idactividad as idactividad,
              a.codigo,
              a.denominacion,

              COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(
                aem.nivelactividadmanual, 0) + COALESCE(
                aep.nivelactividadproduccion, 0)+ COALESCE(
                           ae.ajuste, 0) + COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) as nivelactividad,
              COALESCE((
                         select (round(Coalesce(SUM((n.cantplanif / n.cantbase)
                           * indp.precio) *(COALESCE(aem.nivelactividadmanual, 0
                           ) + COALESCE(aea.nivelactividadautomatico, 0) +
                           COALESCE(aep.nivelactividadproduccion, 0)), 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + (
                           Coalesce(SUM((n.cantplanif / n.cantbase) *
                           indp.precio) *(COALESCE(aem.nivelactividadmanual, 0)
                           + COALESCE(aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) +
                           COALESCE(aep.nivelactividadproduccion, 0)), 0)) *
                           indp.flete / 100 +(Coalesce(SUM((n.cantplanif /
                           n.cantbase) * indp.precio) *(COALESCE(
                           aem.nivelactividadmanual, 0) + COALESCE(
                           aea.nivelactividadautomatico, 0) + COALESCE(
                           aep.nivelactividadproduccion, 0)), 0)) *
                           indp.contingencia / 100, 3) +(round(SUM((n.cantplanif
                           / n.cantbase) * indp.precio) * COALESCE(ae.ajuste, 0)
                           +(SUM((n.cantplanif / n.cantbase) * indp.precio) *
                           COALESCE(ae.ajuste, 0)) * indp.flete / 100 +(SUM((
                           n.cantplanif / n.cantbase) * indp.precio) * COALESCE(
                           ae.ajuste, 0)) * indp.contingencia / 100, 3))) as
                           importefinal
                         from mod_planificacion.dat_norma n
                              INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                (n.idindicador = ind.idindicador AND ind.estado
                                = 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif
                                indp ON (n.idindicador = indp.idindicador AND
                                indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                                INNER JOIN mod_datosmaestros.dat_indicadormodelo im
                                ON (ind.idindicador
                                = im.idindicador)
                                INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo =
              im.idmodelo)
                         where m.idmodelo IN ($modelos) AND
                          n.idactividad = a.idactividad AND
                               n.idejercicio = $idejercicio AND
                               m.tipoplan = 0
                         group by indp.flete,
                                  indp.contingencia
              ), 0) as importegasto,
              COALESCE((
                         select (round(Coalesce(SUM((n.cantplanif / n.cantbase)
                           * indp.precioventa) *(COALESCE(
                           aem.nivelactividadmanual, 0) + COALESCE(
                           aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                           aep.nivelactividadproduccion, 0)), 0) +(Coalesce(SUM(
                           (n.cantplanif / n.cantbase) * indp.precioventa) *(COALESCE
                           (aem.nivelactividadmanual, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                           aea.nivelactividadautomatico, 0) + COALESCE(
                           aep.nivelactividadproduccion, 0)), 0)) * indp.flete /
                           100 +(Coalesce(SUM((n.cantplanif / n.cantbase) *
                           indp.precioventa) *(COALESCE(
                           aem.nivelactividadmanual, 0) + COALESCE(
                           aea.nivelactividadautomatico, 0)+ COALESCE(aee.nivelactividadelemento, 0) + COALESCE(SUM(aei.plan), 0) + COALESCE(
                           aep.nivelactividadproduccion, 0)), 0)) *
                           indp.contingencia / 100, 3) +(round(SUM((n.cantplanif
                           / n.cantbase) * indp.precioventa) * COALESCE(
                           ae.ajuste, 0) +(SUM((n.cantplanif / n.cantbase) *
                           indp.precioventa) * COALESCE(ae.ajuste, 0)) *
                           indp.flete / 100 +(SUM((n.cantplanif / n.cantbase) *
                           indp.precioventa) * COALESCE(ae.ajuste, 0)) *
                           indp.contingencia / 100, 3))) as importefinal
                         from mod_planificacion.dat_norma n
                              INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                (n.idindicador = ind.idindicador AND ind.estado
                                = 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif
                                indp ON (n.idindicador = indp.idindicador AND
                                indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                              INNER JOIN mod_datosmaestros.dat_indicadormodelo im
                                ON (ind.idindicador
                                = im.idindicador)
                                INNER JOIN mod_planificacion.dat_modelo m ON (m.idmodelo =
              im.idmodelo)
                         where m.idmodelo IN ($modelos) AND
                         n.idactividad = a.idactividad AND
                               n.idejercicio = $idejercicio AND
                               m.tipoplan = 1
                         group by indp.flete,
                                  indp.contingencia
              ), 0) as importeingreso
       FROM mod_planificacion.nom_actividad a
            LEFT JOIN mod_planificacion.dat_actividadentidad ae ON (
              a.idactividad = ae.idactividad AND ae.idejercicio = $idejercicio AND
              ae.identidad IN ($identidades))
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
              aem.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
              aea.idactividadentidad = ae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
              aep.idactividadentidad = ae.idactividadentidad)

                LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei
              ON (aei.idactividadentidad = ae.idactividadentidad AND
              aei.idejercicio = $idejercicio )
                   LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee ON (
              aee.idactividadentidad = ae.idactividadentidad)
            INNER JOIN mod_planificacion.dat_actividadmodelo am ON (a.idactividad
              = am.idactividad)

       WHERE
             a.nivel = {$nivel} AND
             a.idaprobacion = 4 AND
             a.estado = 1 AND
             (ae.idaprobacion = 5 OR
             ae.idaprobacion = 4)
             GROUP BY a.codigo,aem.nivelactividadmanual,aee.nivelactividadelemento, aea.nivelactividadautomatico,aep.nivelactividadproduccion,ae.ajuste,a.idactividad
     ) as x
GROUP BY x.idactividad,
         x.codigo,
         x.denominacion)
    SELECT DISTINCT q.codigo,
                q.denominacion,
                sum(q.cantidad) as cantidad,
                sum(COALESCE(c.importegasto, 0) + COALESCE(q.importegasto, 0))
                  as importegasto,
                sum(COALESCE(c.importeingreso, 0) + COALESCE(q.importeingreso, 0
                  )) as importeingreso
         from consulta c
              RIGHT JOIN consulta2 q ON c.codigo = q.codigo
         GROUP BY q.codigo,
                  q.denominacion";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarDetallesNcont($identidades, $idejercicio, $modelos) {

        $modelo = new NomActividad();
        $nivel = $modelo->getNivel();
        $query = "WITH consulta AS ( (SELECT x.idactividad as idactividad,
                           x.codigo
                    FROM (
                           SELECT a.idactividad as idactividad,
                                  a.codigo
                           FROM mod_planificacion.nom_actividad a
                                LEFT JOIN mod_planificacion.dat_actividadentidad
                                  ae ON (a.idactividad = ae.idactividad AND
                                  ae.idejercicio = $idejercicio AND ae.identidad IN (
                                  $identidades))
                                LEFT JOIN
                                  mod_planificacion.dat_actividadentidadmanual
                                  aem ON (aem.idactividadentidad =
                                  ae.idactividadentidad)
                                LEFT JOIN
                                  mod_planificacion.dat_actividadentidadautomatico
                                  aea ON (aea.idactividadentidad =
                                  ae.idactividadentidad)
                                LEFT JOIN
                                  mod_planificacion.dat_actividadentidadproduccion
                                  aep ON (aep.idactividadentidad =
                                  ae.idactividadentidad)
                                   LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose
               aei ON (aei.idactividadentidad = ae.idactividadentidad AND
               aei.idejercicio = $idejercicio )
                   LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee ON (
              aee.idactividadentidad = ae.idactividadentidad)
                                              INNER JOIN mod_planificacion.dat_actividadmodelo
                                  am ON (a.idactividad = am.idactividad)
                                INNER JOIN mod_planificacion.dat_modelo m ON (
                                  m.idmodelo = am.idmodelo)
                           WHERE m.idmodelo IN ($modelos) AND
                                 a.nivel = {$nivel} AND
                                 a.idaprobacion = 4 AND
                                 a.estado = 1 AND
                                 (ae.idaprobacion = 5 OR
                                 ae.idaprobacion = 4)
                         ) as x
                    GROUP BY x.idactividad,
                             x.codigo)),
                              consulta2 AS (
                               --esta es la de los ind directos
                               SELECT x.idactividad as idactividad,
                                      x.codigo
                               FROM (
                                      SELECT a.idactividad as idactividad,
                                             a.codigo
                                      FROM mod_planificacion.nom_actividad a
                                           LEFT JOIN
                                             mod_planificacion.dat_actividadentidad
                                             ae ON (a.idactividad =
                                             ae.idactividad AND ae.idejercicio =
                                             $idejercicio AND ae.identidad IN ($identidades))
                                           LEFT JOIN
                                             mod_planificacion.dat_actividadentidadmanual
                                             aem ON (aem.idactividadentidad =
                                             ae.idactividadentidad)
                                           LEFT JOIN
                                             mod_planificacion.dat_actividadentidadautomatico
                                             aea ON (aea.idactividadentidad =
                                             ae.idactividadentidad)
                                           LEFT JOIN
                                             mod_planificacion.dat_actividadentidadproduccion
                                             aep ON (aep.idactividadentidad =
                                             ae.idactividadentidad)
                                              LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose
               aei ON (aei.idactividadentidad = ae.idactividadentidad AND
               aei.idejercicio = $idejercicio )
                   LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee ON (
              aee.idactividadentidad = ae.idactividadentidad)
                                           INNER JOIN
                                             mod_planificacion.dat_actividadmodelo
                                             am ON (a.idactividad =
                                             am.idactividad)
                                      WHERE a.nivel = {$nivel} AND
                                            a.idaprobacion = 4 AND
                                            a.estado = 1 AND
                                            (ae.idaprobacion = 5 OR
                                            ae.idaprobacion = 4)
                                    ) as x
                               GROUP BY x.idactividad,
                                        x.codigo)
                                  SELECT count(DISTINCT q.idactividad) as cont
                                  from consulta c
                                       RIGHT JOIN consulta2 q ON c.codigo =
                                         q.codigo
";

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

}
