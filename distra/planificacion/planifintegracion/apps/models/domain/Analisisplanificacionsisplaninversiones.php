<?php

class Analisisplanificacionsisplaninversiones extends Analisisplanificacion {
    /*     * ****Actividad - Niveles de actividad******************* */

    public function diferenciaNormaSalida($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA_addwhere($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH

valioso AS (SELECT a.denominacion as actividad,
                   a.idactividad,
                   
                    Coalesce(SUM((n.cantplanif / n.cantbase) * ip.precio) *
                    (COALESCE(aem.nivelactividadmanual, 0) + 
                    COALESCE(aea.nivelactividadautomatico, 0) + 
                    COALESCE(aee.nivelactividadelemento,0) + 
                    COALESCE(SUM(aei.plan),0) +
                    COALESCE(ae.ajuste, 0)), 0)  as importenorma
                     
            FROM mod_planificacion.dat_actividadentidad ae
                 LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                   ae.idactividadentidad = aem.idactividadentidad
                 LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                   ON ae.idactividadentidad = aea.idactividadentidad
                 LEFT JOIN
                   mod_planifinversiones.dat_inversnivelactividaddesglose aei ON
                   (aei.idactividadentidad = ae.idactividadentidad AND
                   aei.idejercicio = $idejercicio)
                       LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
                 INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                   ae.idactividad
                 INNER JOIN mod_planificacion.dat_norma n ON a.idactividad =
                   n.idactividad
                 INNER JOIN mod_datosmaestros.nom_indicador ind ON n.idindicador
                   = ind.idindicador
                 INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                   ip.idindicador = ind.idindicador
                   $innerJoinFiltros
            WHERE ae.idejercicio = $idejercicio AND
                  n.idejercicio = $idejercicio AND
                  ip.nivelplanif = 1 AND
                  ip.idaprobacion = 4 AND
                  a.idaprobacion = 4 AND
                  a.estado = 1 AND
                  ae.identidad IN ($identidad)
                  $filtros
                  $addwhere
            GROUP BY a.denominacion,
                     a.idactividad,
                     aem.nivelactividadmanual,
                     aee.nivelactividadelemento,
                     aea.nivelactividadautomatico,
                     ae.ajuste),

             valiososalida AS (SELECT a.denominacion as actividad,
                                      a.idactividad,
                                      
                                      Coalesce(SUM((COALESCE(s.cantidad, 0)) * ip.precio) *
                                      (COALESCE(aem.nivelactividadmanual, 0) + 
                                       COALESCE(aea.nivelactividadautomatico, 0) + 
                                       COALESCE(aee.nivelactividadelemento,0) +
                                       COALESCE(ae.ajuste, 0) +
                                       COALESCE(SUM(aei.plan), 0)), 0) as importesalida
                                        
                               FROM mod_planificacion.dat_actividadentidad ae
                                    LEFT JOIN
                                      mod_planificacion.dat_actividadentidadmanual
                                      aem ON ae.idactividadentidad =
                                      aem.idactividadentidad
                                    LEFT JOIN
                                      mod_planificacion.dat_actividadentidadautomatico
                                      aea ON ae.idactividadentidad =
                                      aea.idactividadentidad
                                    LEFT JOIN
                                      mod_planifinversiones.dat_inversnivelactividaddesglose
                                      aei ON (aei.idactividadentidad =
                                      ae.idactividadentidad AND aei.idejercicio
                                      = $idejercicio)
                                          LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
                                    INNER JOIN mod_planificacion.nom_actividad a
                                      ON a.idactividad = ae.idactividad
                                    INNER JOIN mod_planificacion.dat_salida s ON
                                      a.idactividad = s.idactividad
                                    INNER JOIN mod_datosmaestros.nom_indicador
                                      ind ON s.idindicador = ind.idindicador
                                    INNER JOIN
                                      mod_datosmaestros.nom_indicadorplanif ip
                                      ON ip.idindicador = ind.idindicador
                                      $innerJoinFiltros
                               WHERE ae.idejercicio = $idejercicio AND
                                     ip.nivelplanif = 1 AND
                                     ip.idaprobacion = 4 AND
                                     a.idaprobacion = 4 AND
                                     a.estado = 1 AND
                                     ae.identidad IN ($identidad)
                                     $filtros
                                     $addwhere
                               GROUP BY a.denominacion,
                                        a.idactividad,
                                        aem.nivelactividadmanual,
                                        aee.nivelactividadelemento,
                                        aea.nivelactividadautomatico,
                                        ae.ajuste)
            SELECT v.actividad,
                   round(v.importenorma, 3) as importenorma,
                   round(COALESCE(vs.importesalida, 0), 3) as importesalida,
                   round((v.importenorma - COALESCE(vs.importesalida, 0)), 3) as
                     diferencia
            FROM valioso v
                 LEFT JOIN valiososalida vs ON (v.idactividad = vs.idactividad)
            where importenorma <> 0 OR
                  importesalida <> 0
            ORDER BY (v.importenorma - COALESCE(vs.importesalida, 0)) $orden
              OFFSET $start
            LIMIT $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function diferenciaNormaSalidaTotal($identidad, $idejercicio, $parametros) {

        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA_addwhere($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "--RELACION VALOR DE LA NORMA VS VALOR DE LA SALIDA GLOBAL POR ENTIDAD
--(10 MEJOR DIFERENCIA

WITH

valioso AS (
SELECT a.denominacion as actividad,
                   a.idactividad,
                   
                   Coalesce(SUM((n.cantplanif / n.cantbase) * ip.precio) *
                   (COALESCE(aem.nivelactividadmanual, 0) + 
                   	COALESCE(aea.nivelactividadautomatico, 0) + 
                   	COALESCE(aee.nivelactividadelemento,0) + 
                   	COALESCE(ae.ajuste, 0) +
                   	COALESCE(SUM(aei.plan),0)), 0)  as importenorma
        
FROM mod_planificacion.dat_actividadentidad ae
       INNER JOIN mod_planificacion.nom_actividad a ON 
       a.idactividad = ae.idactividad
       LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
       ae.idactividadentidad = aem.idactividadentidad
       LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
       ae.idactividadentidad = aea.idactividadentidad
       LEFT JOIN
                                      mod_planifinversiones.dat_inversnivelactividaddesglose
                                      aei ON (aei.idactividadentidad =
                                      ae.idactividadentidad AND aei.idejercicio
                                      = $idejercicio)
                                          LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
       INNER JOIN mod_planificacion.dat_norma n 
       ON a.idactividad =n.idactividad
       INNER JOIN mod_datosmaestros.nom_indicador ind ON 
       (n.idindicador =ind.idindicador)
       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
       ip.idindicador = ind.idindicador
       $innerJoinFiltros
           
WHERE ae.idejercicio = $idejercicio AND
      n.idejercicio = $idejercicio AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      a.idaprobacion = 4 AND
      a.estado = 1 AND
      ae.identidad IN ($identidad)
      $filtros
      $addwhere
          
GROUP BY a.denominacion,
         a.idactividad,
                                        aem.nivelactividadmanual,
                                        aee.nivelactividadelemento,
                                        aea.nivelactividadautomatico,
                                        ae.ajuste),
valiososalida AS (
SELECT a.denominacion as actividad,
                                      a.idactividad,
                                      
                                      Coalesce(SUM((COALESCE(s.cantidad, 0)) *ip.precio) *
                                      (COALESCE(aem.nivelactividadmanual, 0) + 
                                      	COALESCE(aea.nivelactividadautomatico, 0) + 
                                      	COALESCE(aee.nivelactividadelemento,0) +
                                      	COALESCE(ae.ajuste, 0) +
                                      	COALESCE(SUM(aei.plan), 0)), 0)  as importesalida
        
FROM mod_planificacion.dat_actividadentidad ae
       INNER JOIN mod_planificacion.nom_actividad a ON 
       a.idactividad = ae.idactividad
       LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
       ae.idactividadentidad = aem.idactividadentidad
       LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
       ae.idactividadentidad = aea.idactividadentidad
       LEFT JOIN
                                      mod_planifinversiones.dat_inversnivelactividaddesglose
                                      aei ON (aei.idactividadentidad =
                                      ae.idactividadentidad AND aei.idejercicio
                                      = $idejercicio)
                                          LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
       INNER JOIN mod_planificacion.dat_salida s ON 
       a.idactividad = s.idactividad
       INNER JOIN mod_datosmaestros.nom_indicador ind ON 
       s.idindicador = ind.idindicador
       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
       ip.idindicador = ind.idindicador
       $innerJoinFiltros        
WHERE ae.idejercicio = $idejercicio AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      a.idaprobacion = 4 AND
      a.estado = 1 AND
      ae.identidad IN($identidad)
      $filtros
      $addwhere
GROUP BY a.denominacion,
         a.idactividad,
                                        aem.nivelactividadmanual,
                                        aee.nivelactividadelemento,
                                        aea.nivelactividadautomatico,
                                        ae.ajuste)

SELECT count(v.idactividad)
FROM valioso v
       LEFT JOIN valiososalida vs ON (v.idactividad = vs.idactividad)
       where importenorma<>0 OR importesalida<>0";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    /*     * ****Niveles de actividad******************* */

    public function nivelesMasAltos($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $sqlQuery = "WITH valioso AS (
SELECT a.denominacion as actividad,
       round(sum(ae.ajuste), 6) as ajuste,
       round(sum(COALESCE(aem.nivelactividadmanual, 0)), 6) as nivelmanual,
       round(sum(COALESCE(aea.nivelactividadautomatico, 0)), 6) as nivelauto,
       round((COALESCE(SUM(aei.plan), 0)), 6) as nivelinv,
       round(sum(COALESCE(aee.nivelactividadelemento, 0)), 6) as nivelproyecto,
       
round(((sum(COALESCE(aem.nivelactividadmanual, 0)) +  
	sum(COALESCE(aee.nivelactividadelemento, 0)) + 
        sum(COALESCE(aea.nivelactividadautomatico, 0))) + 
        COALESCE(SUM(aei.plan), 0) + 
        sum(COALESCE(ae.ajuste, 0))), 6) as total
         
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
       ae.idactividadentidad = aem.idactividadentidad
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
       ae.idactividadentidad = aea.idactividadentidad
        LEFT JOIN  mod_planifinversiones.dat_inversnivelactividaddesglose aei ON
                   (aei.idactividadentidad = ae.idactividadentidad AND
                   aei.idejercicio = $idejercicio)
                       LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
     INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
       ae.idactividad $innerJoinFiltros
WHERE ae.idejercicio = $idejercicio AND
      a.idaprobacion = 4 AND
      a.estado = 1 AND
      ae.identidad IN ($identidad) $filtros
GROUP BY a.denominacion,
         ae.idactespcomportamiento)
SELECT v.actividad,
       v.ajuste,
       v.nivelmanual,
       v.nivelproyecto,
       v.nivelauto,
       v.nivelinv,
       v.total
FROM valioso v
WHERE v.total <> 0
ORDER BY v.total $orden OFFSET $start
LIMIT $limit";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function nivelesMasAltosTotal($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        $sqlQuery = "WITH valioso AS (
SELECT a.idactividad,

round(((sum(COALESCE(aem.nivelactividadmanual, 0)) +  
		sum(COALESCE(aee.nivelactividadelemento, 0)) + 
        sum(COALESCE(aea.nivelactividadautomatico, 0)))  + 
        COALESCE(SUM(aei.plan), 0) + 
        sum(COALESCE(ae.ajuste, 0))), 6) as total
         
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
       ae.idactividadentidad = aem.idactividadentidad
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
       ae.idactividadentidad = aea.idactividadentidad
        LEFT JOIN  mod_planifinversiones.dat_inversnivelactividaddesglose aei ON
                   (aei.idactividadentidad = ae.idactividadentidad AND
                   aei.idejercicio = $idejercicio)
                       LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
     INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
       ae.idactividad $innerJoinFiltros
WHERE ae.idejercicio = $idejercicio AND
      a.idaprobacion = 4 AND
      a.estado = 1 AND
      ae.identidad IN ($identidad) $filtros
GROUP BY a.idactividad)
SELECT count(v.idactividad) 
FROM valioso v 
WHERE v.total <> 0";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function nivelesMasValiosos($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "
WITH valioso AS (
SELECT a.denominacion as actividad,
       round(sum((n.cantplanif / n.cantbase) * ae.ajuste * ip.precio), 3) as
         importeajuste,
         
       round(sum(((n.cantplanif / n.cantbase) *(COALESCE(
         aem.nivelactividadmanual, 0))) * ip.precio), 3) as importenivelmanual,
         
       round(sum(((n.cantplanif / n.cantbase) *(COALESCE(
         aee.nivelactividadelemento, 0))) * ip.precio), 3) as importenivelproyecto,
         
       round(sum(((n.cantplanif / n.cantbase) *(COALESCE(
         aea.nivelactividadautomatico, 0))) * ip.precio), 3) as importenivelauto
  ,
       Coalesce(SUM((n.cantplanif / n.cantbase) * ip.precio) *(COALESCE(SUM(
         aei.plan), 0)), 0) as importenivelinv,
         
           Coalesce(SUM((n.cantplanif / n.cantbase) * ip.precio) *
           (COALESCE(aem.nivelactividadmanual, 0) + 
           	COALESCE(aea.nivelactividadautomatico, 0) + 
           	COALESCE(aee.nivelactividadelemento,0)+ 
            COALESCE(ae.ajuste, 0) +
           	COALESCE(SUM(aei.plan),0)), 0)  as total
                     
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
     ae.idactividadentidad = aem.idactividadentidad
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
     ae.idactividadentidad = aea.idactividadentidad
      LEFT JOIN   mod_planifinversiones.dat_inversnivelactividaddesglose aei ON
                   (aei.idactividadentidad = ae.idactividadentidad AND
                   aei.idejercicio = $idejercicio)
                       LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
     INNER JOIN mod_planificacion.nom_actividad a ON 
     a.idactividad = ae.idactividad
     INNER JOIN mod_planificacion.dat_norma n ON 
     a.idactividad = n.idactividad
     INNER JOIN mod_datosmaestros.nom_indicador ind ON 
     n.idindicador = ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON 
     ip.idindicador = ind.idindicador
     $innerJoinFiltros
WHERE ae.idejercicio = $idejercicio AND
      n.idejercicio = $idejercicio AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      a.idaprobacion = 4 AND
      a.estado = 1 AND
      ae.identidad IN ($identidad)
      $filtros
      $addwhere
GROUP BY a.denominacion,
                     a.idactividad,
                     aem.nivelactividadmanual,
                     aee.nivelactividadelemento,
                     aea.nivelactividadautomatico,
                     ae.ajuste)
SELECT v.actividad,
       v.importeajuste,
       v.importenivelmanual,
       v.importenivelproyecto,
       v.importenivelauto,
       v.importenivelinv,
       v.total
FROM valioso v
WHERE v.total <> 0
ORDER BY v.total $orden OFFSET $start LIMIT $limit";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab CE - NA - global * entidad
    public function graficaEjecucionglobalxentidadAct($parametros) {
        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT round(sum(((COALESCE(aem.nivelactividadmanual, 0) + 
			COALESCE(aee.nivelactividadelemento,0) + 
            COALESCE(aea.nivelactividadautomatico, 0)) + 
            COALESCE(aep.nivelactividadproduccion, 0) +
  			(ae.ajuste))) + 
            (COALESCE(SUM(aei.plan), 0)), 6) as nivel,
  
   round(sum(COALESCE(
  ce.nivelactividadreal, 0)), 6) as nivelejecutado, 
  
    round((sum((
    COALESCE(aem.nivelactividadmanual, 0) + 
    COALESCE(aee.nivelactividadelemento, 0) + 
    COALESCE(aea.nivelactividadautomatico, 0) +
    COALESCE(aep.nivelactividadproduccion, 0)  + ae.ajuste))
    +(COALESCE(SUM(aei.plan), 0)) -
    (sum(COALESCE(ce.nivelactividadreal, 0)))), 6) as  pendiente
         
FROM mod_planificacion.dat_actividadentidad ae
      LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
      ae.idactividadentidad = aem.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
      ae.idactividadentidad = aea.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
      aep.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei ON (
       aei.idactividadentidad = ae.idactividadentidad AND aei.idejercicio = {$parametros['idejercicio']})
           LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
       ae.idactividadentidad = ce.idactividadentidad
       $innerJoinFiltros
where ae.identidad IN ($entidades) AND
       ae.idejercicio = {$parametros['idejercicio']}
           $filtros
      ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    //Datos para graficar el tab CE - NA - mas valiosas
    public function graficaEjecucionMasValiososAct($parametros) {
        $nivel = NomActividad::getNivel();
        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        $entidades = implode(',', $parametros['identidad']);

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "--ejecucion NA los mas valiosos
WITH consulta AS
(
SELECT a.idactividad,
       a.denominacion,
       
round(sum((n.cantplanif / n.cantbase) * ip.precio *
((COALESCE(aem.nivelactividadmanual, 0) + 
  COALESCE(aee.nivelactividadelemento, 0) + 
  COALESCE(aea.nivelactividadautomatico, 0)) + 
  COALESCE(aep.nivelactividadproduccion, 0) + ae.ajuste)) +
  (COALESCE(SUM(aei.plan), 0)), 3) as importeplan,
         
       round(sum((COALESCE(ce.nivelactividadreal, 0)) * ip.precio), 3) as
         importeejecutado
       
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
     ae.idactividadentidad = aem.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
     ae.idactividadentidad = aea.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
     aep.idactividadentidad = ae.idactividadentidad)

     LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei ON (
       aei.idactividadentidad = ae.idactividadentidad AND aei.idejercicio = {$parametros['idejercicio']})
           
LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)

     INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
      ae.idactividad
     INNER JOIN mod_planificacion.dat_norma n ON a.idactividad = n.idactividad
     INNER JOIN mod_datosmaestros.nom_indicador ind ON n.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
     LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
      ae.idactividadentidad = ce.idactividadentidad
      $innerJoinFiltros
where ae.identidad IN
($entidades) AND
      a.nivel = {$nivel} AND
      a.idaprobacion = 4 AND
      a.estado = 1 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      n.idejercicio = {$parametros['idejercicio']} $filtros $addwhere
GROUP BY a.idactividad,
         a.denominacion)

SELECT c.idactividad,
       c.denominacion,
       c.importeplan,
       c.importeejecutado
from consulta c
ORDER BY c.importeejecutado {$parametros['orden']}
    OFFSET {$parametros['start']} LIMIT {$parametros['limit']}
      ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab CE - NA - mas ejecutadas
    public function graficaIndicadoresMasEjecutadosAct($parametros) {
        $nivel = NomActividad::getNivel();

        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--los NA mas ejecutados
WITH consulta AS
(
SELECT a.idactividad,
       a.denominacion,
       
        round(sum(((COALESCE(aem.nivelactividadmanual, 0) + 
        COALESCE(aee.nivelactividadelemento, 0) + 
        COALESCE(aea.nivelactividadautomatico, 0)) + 
        COALESCE(aep.nivelactividadproduccion, 0) + ae.ajuste)) +
        (COALESCE(SUM(aei.plan), 0)), 6) as plan,
         
       round(sum((COALESCE(ce.nivelactividadreal, 0))), 6) as ejecutado
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
     ae.idactividadentidad = aem.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
     ae.idactividadentidad = aea.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
     aep.idactividadentidad = ae.idactividadentidad)

     LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei ON (
       aei.idactividadentidad = ae.idactividadentidad AND aei.idejercicio = {$parametros['idejercicio']})
           LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
     INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
      ae.idactividad
     LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
      ae.idactividadentidad = ce.idactividadentidad
      $innerJoinFiltros
 where ae.identidad IN
($entidades) AND
      ae.idejercicio = {$parametros['idejercicio']}
      AND
      a.nivel = {$nivel} AND
      a.idaprobacion = 4 AND
      a.estado = 1
      $filtros
GROUP BY a.idactividad,
         a.denominacion)

SELECT c.idactividad,
       c.denominacion,
       c.plan,
       c.ejecutado
from consulta c
ORDER BY c.ejecutado, c.plan {$parametros['orden']}
    OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";


        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab CE - NA - total * entidad
    public function graficaEjecucionglobalxentidadxAct($parametros) {
        $nivel = NomActividad::getNivel();
        //implementando filtros
        $filt = Analisisplanificacion::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "WITH
desviacionsust AS (SELECT COALESCE(sum(dna.nivelactividadrealxdesviacion), 0) as
 sustituciones,
                          dna.idactividadentidad
                   FROM mod_planificacion.dat_desviacionnivelactividad dna
                        LEFT JOIN
                         mod_planificacion.dat_desviacionnivelactividadxsustitucion
                          dnas ON dna.iddesviacionnivelactividad =
                           dnas.iddesviacionnivelactividad
                   GROUP BY dna.idactividadentidad),
  desviacionadicion AS (
  SELECT COALESCE(sum(dna.nivelactividadrealxdesviacion), 0) as adiciones,
         dna.idactividadentidad
  FROM mod_planificacion.dat_desviacionnivelactividad dna
       LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
        ON dna.iddesviacionnivelactividad = dnas.iddesviacionnivelactividad
  where dnas.iddesviacionnivelactividad is null
  GROUP BY dna.idactividadentidad)
SELECT a.idactividad,
       a.denominacion,
       
       round(sum(((
       COALESCE(aem.nivelactividadmanual, 0) + 
       COALESCE(aee.nivelactividadelemento, 0)+
       COALESCE(aea.nivelactividadautomatico, 0)) + 
       COALESCE(aep.nivelactividadproduccion, 0) + ae.ajuste)) +
       (COALESCE(SUM(aei.plan), 0)), 6) as nivel,
         
       round(COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0), 6) as
         nivelejecutado,
       round(COALESCE(sum(d.sustituciones), 0), 6) as sustitucion,
       round(COALESCE(sum(ad.adiciones), 0), 6) as adicion,
       round(((COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)) +(COALESCE(
         sum(d.sustituciones), 0)) +(COALESCE(sum(ad.adiciones), 0))), 6) as
         totalejecutado
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
     ae.idactividadentidad = aem.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
     ae.idactividadentidad = aea.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
     aep.idactividadentidad = ae.idactividadentidad)

     LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei ON (
       aei.idactividadentidad = ae.idactividadentidad AND aei.idejercicio = {$parametros['idejercicio']})
           LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
        ON (aee.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
      ae.idactividadentidad = ce.idactividadentidad
     INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad =
      a.idactividad
     LEFT JOIN desviacionsust d ON (ae.idactividadentidad = d.idactividadentidad
     )
     LEFT JOIN desviacionadicion ad ON (ae.idactividadentidad =
      ad.idactividadentidad)
      $innerJoinFiltros
where ae.identidad IN ($entidades) AND
      ae.idejercicio = {$parametros['idejercicio']} AND
      a.nivel = {$nivel} AND
      a.idaprobacion = 4 AND
      a.estado = 1 
      $filtros
      GROUP BY a.idactividad
      order by totalejecutado {$parametros['orden']}
    OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
