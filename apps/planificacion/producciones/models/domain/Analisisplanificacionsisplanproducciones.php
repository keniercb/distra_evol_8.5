<?php

class Analisisplanificacionsisplanproducciones extends Analisisplanificacion {

    //Actividad - Niveles de actividad
    public function diferenciaNormaSalida($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = self::filtrarNA_addwhere($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = " WITH
                        valioso AS (
                        SELECT a.denominacion as actividad,
                               a.idactividad,
                              (sum(((n.necesidad) *(COALESCE(aem.nivelactividadmanual, 0))) *
                                ip.precio) + sum(((n.necesidad) *(COALESCE(
                                aea.nivelactividadautomatico, 0))) * ip.precio) + sum(((n.necesidad) *
                                (COALESCE(aect.nivelactividadproduccion, 0))) * ip.precio)) + sum((
                                n.necesidad) * ae.ajuste * ip.precio) as importenorma
                        FROM mod_planificacion.dat_actividadentidad ae
                             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                              ae.idactividadentidad = aem.idactividadentidad
                             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                              ae.idactividadentidad = aea.idactividadentidad
                              LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec aect ON (
                              aect.idactividadentidad = ae.idactividadentidad)
                             INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                              ae.idactividad
                             INNER JOIN mod_planificacion.dat_norma n ON a.idactividad = n.idactividad
                             INNER JOIN mod_datosmaestros.nom_indicador ind ON (n.idindicador =
                              ind.idindicador)
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                              ind.idindicador
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
                                 a.idactividad),
                        valiososalida AS (
                        SELECT a.denominacion as actividad,
                               a.idactividad,
                               ((sum((COALESCE(s.cantidad, 0)) *(COALESCE(
                                 aem.nivelactividadmanual, 0)) * ip.precio)) +(
                                 sum((COALESCE(s.cantidad, 0)) *(COALESCE(
                                 aea.nivelactividadautomatico, 0)) * ip.precio))
                                 +(sum((COALESCE(s.cantidad, 0)) *(COALESCE(
                                 aect.nivelactividadproduccion, 0)) * ip.precio)
                                 ) +(sum((COALESCE(s.cantidad, 0)) * ae.ajuste *
                                 ip.precio))) as importesalida
                        FROM mod_planificacion.dat_actividadentidad ae
                             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                              ae.idactividadentidad = aem.idactividadentidad
                             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                              ae.idactividadentidad = aea.idactividadentidad
                              LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec aect ON (
                                aect.idactividadentidad = ae.idactividadentidad)
                             INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                              ae.idactividad
                             INNER JOIN mod_planificacion.dat_salida s ON a.idactividad = s.idactividad
                             INNER JOIN mod_datosmaestros.nom_indicador ind ON s.idindicador =
                              ind.idindicador
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                              ind.idindicador
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
                                 a.idactividad)

                        SELECT DISTINCT v.actividad,
                               round(v.importenorma,3)as importenorma,
                               round(COALESCE(vs.importesalida, 0),3) as importesalida,
                               round((v.importenorma - COALESCE(vs.importesalida, 0)), 3) as diferencia
                        FROM valioso v
                             LEFT JOIN valiososalida vs ON (v.idactividad = vs.idactividad)
                             where importenorma<>0 OR importesalida<>0
                       ORDER BY diferencia
                $orden
                            OFFSET $start LIMIT $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function diferenciaNormaSalidaTotal($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrarNA_addwhere($parametros);
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
                        SELECT  a.idactividad,
                                (sum(((n.necesidad) *(COALESCE(aem.nivelactividadmanual, 0))) *
                                ip.precio) + sum(((n.necesidad) *(COALESCE(
                                aea.nivelactividadautomatico, 0))) * ip.precio) + sum(((n.necesidad) *
                                (COALESCE(aect.nivelactividadproduccion, 0))) * ip.precio)) + sum((
                                n.necesidad) * ae.ajuste * ip.precio) as importenorma
                        FROM mod_planificacion.dat_actividadentidad ae
                               INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                                ae.idactividad
                                 LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                               ae.idactividadentidad = aem.idactividadentidad
                              LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                               ae.idactividadentidad = aea.idactividadentidad
                               LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec aect ON (
                                aect.idactividadentidad = ae.idactividadentidad)
                               INNER JOIN mod_planificacion.dat_norma n ON a.idactividad =
                        n.idactividad
                               INNER JOIN mod_datosmaestros.nom_indicador ind ON (n.idindicador =
                                ind.idindicador)
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                        ip.idindicador =
                                ind.idindicador
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
                                   a.idactividad),
                        valiososalida AS (
                        SELECT
                                 a.idactividad,
                                 ((sum((COALESCE(s.cantidad, 0)) *(COALESCE(
                                 aem.nivelactividadmanual, 0)) * ip.precio)) +(
                                 sum((COALESCE(s.cantidad, 0)) *(COALESCE(
                                 aea.nivelactividadautomatico, 0)) * ip.precio))
                                 +(sum((COALESCE(s.cantidad, 0)) *(COALESCE(
                                 aect.nivelactividadproduccion, 0)) * ip.precio)
                                 ) +(sum((COALESCE(s.cantidad, 0)) * ae.ajuste *
                                 ip.precio))) as importesalida
                        FROM mod_planificacion.dat_actividadentidad ae
                               INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                                ae.idactividad
                                 LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                               ae.idactividadentidad = aem.idactividadentidad
                              LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                               ae.idactividadentidad = aea.idactividadentidad
                               LEFT JOIN
                               mod_spouam.dat_actividadentidadprodcartatec aect
                               ON (aect.idactividadentidad =
                               ae.idactividadentidad)
                               INNER JOIN mod_planificacion.dat_salida s ON a.idactividad =
                        s.idactividad
                               INNER JOIN mod_datosmaestros.nom_indicador ind ON s.idindicador =
                                ind.idindicador
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                        ip.idindicador =
                                ind.idindicador
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
                                   a.idactividad)
                        SELECT count(v.idactividad)
                        FROM valioso v
                               LEFT JOIN valiososalida vs ON (v.idactividad = vs.idactividad)
                               where importenorma<>0 OR importesalida<>0";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Niveles de actividad
    public function nivelesMasAltos($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $sqlQuery = "WITH valioso AS (
                        SELECT a.denominacion as actividad,
                               round(sum(ae.ajuste), 6) as ajuste ,
                               round(sum(COALESCE(aem.nivelactividadmanual,0)),6) as nivelmanual,
                               round(sum(COALESCE(aea.nivelactividadautomatico,0)),6) as nivelauto,
                               round(sum(COALESCE(aect.nivelactividadproduccion, 0)),6) as nivelcarta,
                               round(((sum(COALESCE(aem.nivelactividadmanual,0)) + sum(COALESCE(
                               aea.nivelactividadautomatico,0))+sum(COALESCE(aect.nivelactividadproduccion, 0)))+sum(COALESCE(ae.ajuste,0))), 6) as total
                        FROM mod_planificacion.dat_actividadentidad ae
                             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                              ae.idactividadentidad = aem.idactividadentidad
                             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                              ae.idactividadentidad = aea.idactividadentidad
                             LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec aect ON (
        					 aect.idactividadentidad = ae.idactividadentidad)
                             INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                              ae.idactividad
                              $innerJoinFiltros
                        WHERE idejercicio = $idejercicio AND
                            a.idaprobacion = 4 AND
                              a.estado = 1 AND
                              ae.identidad IN ($identidad)
                                  $filtros
                        GROUP BY  a.denominacion)
                        SELECT v.actividad,v.ajuste,v.nivelmanual,
                          v.nivelauto,v.nivelcarta,v.total
                          FROM valioso v
                          WHERE v.total <>0
                         ORDER BY v.total $orden
                            OFFSET $start LIMIT $limit";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function nivelesMasAltosTotal($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $sqlQuery = "WITH valioso AS ( 
                    SELECT a.idactividad, 
                            round(((sum(COALESCE(aem.nivelactividadmanual,0)) + sum(COALESCE(
                               aea.nivelactividadautomatico,0))+sum(COALESCE(aect.nivelactividadproduccion, 0)))+sum(COALESCE(ae.ajuste,0))), 6) as total
                    FROM mod_planificacion.dat_actividadentidad ae 
                         LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON 
                           ae.idactividadentidad = aem.idactividadentidad 
                         LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON 
                           ae.idactividadentidad = aea.idactividadentidad 
                            LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec aect ON (
        					 aect.idactividadentidad = ae.idactividadentidad)
                         INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad = 
                           ae.idactividad 
                           $innerJoinFiltros
                    WHERE idejercicio = $idejercicio AND 
                        a.idaprobacion = 4 AND
                          a.estado = 1 AND
                          ae.identidad IN ($identidad) 
                              $filtros
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
        $filt = self::filtrarNA($parametros);
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
                    SELECT  a.denominacion as actividad,
                           round(sum((n.necesidad) * ae.ajuste * ip.precio), 3)
                             as importeajuste,
                           round(sum(((n.necesidad) *(COALESCE(
                             aem.nivelactividadmanual, 0))) * ip.precio), 3) as
                             importenivelmanual,
                           round(sum(((n.necesidad) *(COALESCE(
                             aea.nivelactividadautomatico, 0))) * ip.precio), 3)
                             as importenivelauto,
                           round(sum(((n.necesidad) *(COALESCE(
                             aect.nivelactividadproduccion, 0))) * ip.precio), 3
                             ) as importenivelcarta,
                           round((sum(((n.necesidad) *(COALESCE(
                             aem.nivelactividadmanual, 0))) * ip.precio) + sum((
                             (n.cantplanif / n.cantbase) *(COALESCE(
                             aea.nivelactividadautomatico, 0))) * ip.precio) +
                             sum(((n.necesidad) *(COALESCE(
                             aect.nivelactividadproduccion, 0))) * ip.precio)) +
                             sum((n.necesidad) * ae.ajuste * ip.precio), 3) as
                             total
                    FROM mod_planificacion.dat_actividadentidad ae
                         LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                          ae.idactividadentidad = aem.idactividadentidad
                         LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                          ae.idactividadentidad = aea.idactividadentidad
                          LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec aect ON (
        					 aect.idactividadentidad = ae.idactividadentidad)
                         INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                          ae.idactividad
                         INNER JOIN mod_planificacion.dat_norma n ON a.idactividad = n.idactividad
                         INNER JOIN mod_datosmaestros.nom_indicador ind ON n.idindicador =
                          ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                          ind.idindicador
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
                    GROUP BY a.denominacion)
                    SELECT v.actividad,
                           v.importeajuste,
                           v.importenivelmanual,
                           v.importenivelauto,
                           v.importenivelcarta,
                           v.total
                    FROM valioso v
                    WHERE v.total <> 0
                    ORDER BY v.total $orden OFFSET $start LIMIT $limit";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function nivelesOcupacionInfraestructura($identidad, $idejercicio, $fechaini, $fechafin, $variable) {

        $sqlQuery = "WITH capacidad AS 
                    (SELECT vc.idvariablecontrol,
                            COALESCE(sum(vce.valor), 0) as capacidad
                     FROM mod_spouam.dat_variablecontrol vc
                          INNER JOIN mod_spouam.dat_variablecontrolentidad vce ON
                            vce.idvariablecontrol = vc.idvariablecontrol
                     WHERE vc.idvariablecontrol = $variable AND
                           vce.identidad IN ($identidad)
                     GROUP by vc.idvariablecontrol)
                    SELECT ct.idindicador,
                           i.codigo,
                           i.denominacion,
                           c.capacidad,
                           COALESCE(sum(aect.nivelactividadproduccion), 0) as ocupacion       
                    FROM mod_spouam.dat_aplicacioncartatec p
                         INNER JOIN mod_spouam.dat_cartatecnologica ct ON p.idcartatecnologica =
                           ct.idcartatecnologica
                         INNER JOIN mod_spouam.dat_actividadentidadprodcartatec aect ON
                           p.idaplicacioncartatec = aect.idaplicacioncartatec
                         INNER JOIN mod_datosmaestros.nom_indicador i ON ct.idindicador =
                           i.idindicador
                         INNER JOIN capacidad c ON c.idvariablecontrol = ct.idvariablecontrol
                    WHERE 
                          p.identidad IN ($identidad) AND
                          (p.idaprobacion = 3 OR
                          p.idaprobacion = 4) AND
                          p.idejercicio = $idejercicio AND
                          ct.idvariablecontrol = $variable
                    GROUP BY ct.idindicador,
                             i.codigo,
                             i.denominacion,
                             c.capacidad";
        /* p.fechainicio >= $fechaini AND
          p.fechafin <= $fechafin AND */
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficarProduccionMensualPorProducto($identidad, $idejercicio) {

        $sqlQuery = "WITH datos AS (                           
SELECT ct.idindicador,
       i.codigo,
       i.denominacion,
       um.abreviaturaunidadmedida as um,
       CASE
         WHEN EXTRACT(MONTH
FROM p.fecha) = 1 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
         ELSE 0
       END as produccionenero,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 2 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionfebrero,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 3 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionmarzo,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 4 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionabril,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 5 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionmayo,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 6 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionjunio,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 7 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionjulio,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 8 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionagosto,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 9 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionseptiembre,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 10 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionoctubre,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 11 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as produccionnoviembre,
     CASE
       WHEN EXTRACT(MONTH
FROM p.fecha) = 12 THEN COALESCE(p.productividadest, 0) * COALESCE(
  p.nivelactividad, 0)
       ELSE 0
     END as producciondiciembre
FROM mod_spouam.dat_aplicacioncartatec p
     INNER JOIN mod_spouam.dat_cartatecnologica ct ON p.idcartatecnologica =
       ct.idcartatecnologica
     INNER JOIN mod_datosmaestros.nom_indicador i ON ct.idindicador =
       i.idindicador
     INNER JOIN mod_datosmaestros.nom_unidadmedida um ON um.idunidadmedida =
       i.idumedida
WHERE p.identidad IN ($identidad) AND
      (p.idaprobacion = 3 OR
      p.idaprobacion = 4) AND
      p.idejercicio = $idejercicio
GROUP BY ct.idindicador,
         i.codigo,
         i.denominacion,
         p.fecha,
         um.abreviaturaunidadmedida,
         p.productividadest,
         p.nivelactividad)
         SELECT d.idindicador,
                d.codigo,
                d.denominacion,
                d.um as abreviaturaunidadmedida,
                sum(d.produccionenero) AS produccionenero,
                sum(d.produccionfebrero) AS produccionfebrero,
                sum(d.produccionmarzo) AS produccionmarzo,
                sum(d.produccionabril) AS produccionabril,
                sum(d.produccionmayo) AS produccionmayo,
                sum(d.produccionjunio) AS produccionjunio,
                sum(d.produccionjulio) AS produccionjulio,
                sum(d.produccionagosto) AS produccionagosto,
                sum(d.produccionseptiembre) AS produccionseptiembre,
                sum(d.produccionoctubre) AS produccionoctubre,
                sum(d.produccionnoviembre) AS produccionnoviembre,
                sum(d.producciondiciembre) AS producciondiciembre
         FROM datos d
         GROUP BY d.idindicador,
                  d.codigo,
                  d.denominacion,d.um ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficarProduccionPorEtapas($params) {
        $sqlQuery = "
            SELECT * FROM crosstab
                    (
                      'SELECT DISTINCT p.idaplicacioncartatec,
                                        ct.denominacion,
                                               dn.iddatosnomenclador,
                                               
                                               to_char(( select min(np.fechainicio) 
                                               from mod_spouam.dat_actividadentidadprodcartatec np 
                                             INNER JOIN mod_spouam.dat_cartatecnologicaactividad cas
                                             ON (np.idcartatecnologicaactividad = cas.idcartatecnologicaactividad)
                                               where p.idaplicacioncartatec=np.idaplicacioncartatec
                                                     and cas.idetapa=ca.idetapa)::date,''DD/MM/YYYY'')
                                                ||''_''||
                                                          to_char(( select max(np.fechafin) 
                                               from mod_spouam.dat_actividadentidadprodcartatec np 
                                             INNER JOIN mod_spouam.dat_cartatecnologicaactividad cas
                                             ON (np.idcartatecnologicaactividad = cas.idcartatecnologicaactividad)
                                               where p.idaplicacioncartatec=np.idaplicacioncartatec
                                                     and cas.idetapa=ca.idetapa)::date,''DD/MM/YYYY'') 
                                                            as fecha
                                                            
                                        FROM mod_spouam.dat_aplicacioncartatec p
                                             INNER JOIN mod_spouam.dat_cartatecnologica ct 
                                             ON (p.idcartatecnologica = ct.idcartatecnologica)
                                             INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca
                                             ON (ct.idcartatecnologica = ca.idcartatecnologica)
                                             INNER JOIN mod_planificacion.nom_datosnomenclador dn
                                             ON (ca.idetapa = dn.iddatosnomenclador)
                                            
                                        where p.identidad in ({$params['identidad']}) and
                                              (p.idaprobacion = 3 or p.idaprobacion = 4) and
                                              EXTRACT(YEAR FROM p.fechainicio) <= {$params['denomejercicio']} and EXTRACT(YEAR FROM p.fechafin) >= {$params['denomejercicio']}
                                              order by 
                                                        p.idaplicacioncartatec, dn.iddatosnomenclador',
                      'SELECT DISTINCT dn.iddatosnomenclador 
                          FROM mod_spouam.dat_aplicacioncartatec p
                               INNER JOIN mod_spouam.dat_cartatecnologica ct 
                               ON (p.idcartatecnologica = ct.idcartatecnologica)
                               INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca
                               ON (ct.idcartatecnologica = ca.idcartatecnologica)
                               INNER JOIN mod_planificacion.nom_datosnomenclador dn
                               ON (ca.idetapa = dn.iddatosnomenclador)    
                          where p.identidad in ({$params['identidad']}) and
                                (p.idaprobacion = 3 or p.idaprobacion = 4) and
                                EXTRACT(YEAR FROM p.fechainicio) <= {$params['denomejercicio']} and EXTRACT(YEAR FROM p.fechafin) >= {$params['denomejercicio']}
                           ORDER BY dn.iddatosnomenclador'
                    )
                    AS
                    (      idaplicacioncartatec NUMERIC,
                           denominacion text
                           {$params['idcolumnas']}
                    )";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEtapasProducciones($params) {
        $sqlQuery = "SELECT DISTINCT dn.iddatosnomenclador,dn.denominacion 
                          FROM mod_spouam.dat_aplicacioncartatec p
                               INNER JOIN mod_spouam.dat_cartatecnologica ct 
                               ON (p.idcartatecnologica = ct.idcartatecnologica)
                               INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca
                               ON (ct.idcartatecnologica = ca.idcartatecnologica)
                               INNER JOIN mod_planificacion.nom_datosnomenclador dn
                               ON (ca.idetapa = dn.iddatosnomenclador)    
                          where p.identidad in ({$params['identidad']}) and
                                (p.idaprobacion = 3 or p.idaprobacion = 4) and
                                EXTRACT(YEAR FROM p.fechainicio) <= {$params['denomejercicio']} and EXTRACT(YEAR FROM p.fechafin) >= {$params['denomejercicio']}
                           ORDER BY dn.iddatosnomenclador";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function listarProduccionesPorMes($params) {
        $sqlQuery = "
            SELECT * FROM crosstab
                (
                  'SELECT i.codigo, i.denominacion, i.idumedida,
                   (SELECT t.iddatosnomenclador
                    FROM
                      mod_planificacion.conf_tiempoxnomenclador t
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn
                      ON(dn.iddatosnomenclador=t.iddatosnomenclador)
                        INNER JOIN mod_planificacion.nom_tiponomenclador tn
                      ON(tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador = ''MES'')
                      WHERE np.fechafin BETWEEN t.fechainicio and t.fechafin AND t.idejercicio={$params['idejercicio']}) as iddatosnomenclador,
                                          COALESCE(p.nivelactividad*c.valorrendimiento*ca.porciento/100,0) as cantidad
                    
                  FROM                  
                  mod_spouam.dat_aplicacioncartatec p
                  INNER JOIN  mod_spouam.dat_cartatecnologica c
                     ON(p.idcartatecnologica=c.idcartatecnologica)
                     INNER JOIN  mod_spouam.dat_actividadentidadprodcartatec np
                     ON(p.idaplicacioncartatec=np.idaplicacioncartatec and np.fechafin BETWEEN ''01/01/{$params['denomejercicio']}'' and ''31/12/{$params['denomejercicio']}'')
                    INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca
                    ON(np.idcartatecnologicaactividad=ca.idcartatecnologicaactividad)
                    INNER JOIN mod_datosmaestros.nom_indicador i
                    ON(i.idindicador=c.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                    ON(ip.idindicador=i.idindicador and ip.nivelplanif=1 and ip.idaprobacion=4)                          
                           where p.identidad in ({$params['identidad']})
                           and (p.idaprobacion = 3 or p.idaprobacion = 4)
                           and ca.porciento > 0
                    ORDER BY i.codigo,
                    iddatosnomenclador',
                      'SELECT dn.iddatosnomenclador
                                from mod_planificacion.nom_datosnomenclador dn
                                     INNER JOIN mod_planificacion.nom_tiponomenclador tn
                                     ON (tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador =''MES'')
                                     where dn.uridatosnomenclador<>''-''
                                     order by dn.iddatosnomenclador'
                    )
                    AS
                    (codigo text, denominacion text, idumedida NUMERIC {$params['columnas']})";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarRecursosPorMes($params) {
        $sqlQuery = "
            SELECT * FROM crosstab
                    (
                      'SELECT i.codigo, i.denominacion, i.idumedida,                  
                   (SELECT
                      t.iddatosnomenclador
                    FROM
                      mod_planificacion.conf_tiempoxnomenclador t
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn
                      ON(dn.iddatosnomenclador=t.iddatosnomenclador)
                        INNER JOIN mod_planificacion.nom_tiponomenclador tn
                      ON(tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador = ''MES'')
                      WHERE np.fechainicio BETWEEN t.fechainicio and t.fechafin AND t.idejercicio={$params['idejercicio']}) as iddatosnomenclador,                      
                       COALESCE(sum(n.necesidad), 0) as cantidad
                    
                  FROM
                  mod_spouam.dat_aplicacioncartatec p
                     INNER JOIN  mod_spouam.dat_actividadentidadprodcartatec np
                     ON(p.idaplicacioncartatec=np.idaplicacioncartatec)
                    INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca
                    ON(np.idcartatecnologicaactividad=ca.idcartatecnologicaactividad)
                    INNER JOIN mod_planificacion.dat_actividadentidad ae
                    ON(np.idactividadentidad=ae.idactividadentidad and ae.idejercicio={$params['idejercicio']})
                    INNER JOIN mod_planificacion.nom_actividad a
                    ON(ae.idactividad=a.idactividad)
                    INNER JOIN mod_planificacion.dat_norma n
                    ON(n.idejercicio={$params['idejercicio']} and n.idactividad=a.idactividad)
                    INNER JOIN mod_datosmaestros.nom_indicador i
                    ON(i.idindicador=n.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                    ON(ip.idindicador=i.idindicador and ip.nivelplanif=1 and ip.idaprobacion=4)
                    where p.identidad in ({$params['identidad']}) and
                          (p.idaprobacion = 3 or p.idaprobacion = 4)                          
                    GROUP BY i.codigo,
                            i.denominacion,
                            i.idumedida,
                            (SELECT
                      t.iddatosnomenclador
                    FROM
                      mod_planificacion.conf_tiempoxnomenclador t
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn
                      ON(dn.iddatosnomenclador=t.iddatosnomenclador)
                        INNER JOIN mod_planificacion.nom_tiponomenclador tn
                      ON(tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador = ''MES'')
                      WHERE np.fechainicio BETWEEN t.fechainicio and t.fechafin AND t.idejercicio={$params['idejercicio']})
                    ORDER BY i.codigo, (SELECT
                      t.iddatosnomenclador
                    FROM
                      mod_planificacion.conf_tiempoxnomenclador t
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn
                      ON(dn.iddatosnomenclador=t.iddatosnomenclador)
                        INNER JOIN mod_planificacion.nom_tiponomenclador tn
                      ON(tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador = ''MES'')
                      WHERE np.fechainicio BETWEEN t.fechainicio and t.fechafin AND t.idejercicio={$params['idejercicio']})',
                      'SELECT dn.iddatosnomenclador
                                from mod_planificacion.nom_datosnomenclador dn
                                     INNER JOIN mod_planificacion.nom_tiponomenclador tn
                                     ON (tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador =''MES'')
                                     where dn.uridatosnomenclador<>''-''
                                     order by dn.iddatosnomenclador'
                    )
                    AS
                    (     codigo text, denominacion text, idumedida NUMERIC {$params['columnas']})";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function campoXcultivo($params) {

        $sqlQuery = "SELECT * FROM crosstab
                    ('SELECT i.codigo,
                             i.denominacion,
                             mesesfechas.iddatosnomenclador,
                             COALESCE(p.nivelactividad) as cantidad
                      FROM mod_spouam.dat_aplicacioncartatec p
                           INNER JOIN mod_spouam.dat_cartatecnologica c ON (p.idcartatecnologica = c.idcartatecnologica AND c.idvariablecontrol = {$params['idvariable']})
                           INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = c.idindicador)
                           INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador and ip.nivelplanif = 1 and ip.idaprobacion = 4),

                           (SELECT t.iddatosnomenclador,
                                    t.fechainicio,
                                    t.fechafin
                             FROM mod_planificacion.conf_tiempoxnomenclador t
                                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = t.iddatosnomenclador)
                                  INNER JOIN mod_planificacion.nom_tiponomenclador tn ON (tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador = ''MES'')
                             WHERE t.idejercicio = {$params['idejercicio']}
                             order by t.iddatosnomenclador ) as mesesfechas
                           --
                      where p.identidad in ({$params['identidad']})
                            and EXTRACT(YEAR FROM p.fechainicio) <= {$params['idejercicioRaw']}
                            and EXTRACT(YEAR FROM p.fechafin) >= {$params['idejercicioRaw']}
                            and mesesfechas.fechainicio BETWEEN p.fechainicio
                            and p.fechafin
                      ORDER BY i.codigo
                              ,mesesfechas.iddatosnomenclador',
                      'SELECT dn.iddatosnomenclador
                                from mod_planificacion.nom_datosnomenclador dn
                                     INNER JOIN mod_planificacion.nom_tiponomenclador tn
                                     ON (tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador =''MES'')
                                     where dn.uridatosnomenclador <>''-''
                                     order by dn.iddatosnomenclador')AS
                    ( codigo text,denominacion text {$params['idmeses']})";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function capacidadcampoVC($params) {
        $sqlQuery = "SELECT vc.denominacion,
                            vce.valor
                            FROM mod_spouam.dat_variablecontrol vc
                            INNER JOIN mod_spouam.dat_variablecontrolentidad vce
                            ON (vce.idvariablecontrol = vc.idvariablecontrol)
                            WHERE vce.identidad = {$params['identidad']}
                            AND vc.idvariablecontrol = {$params['idvariable']}
                            AND vc.idvariablecontrol <> vc.idpadre";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data[0];
    }

    public function nomencladorMES() {

        $sqlQuery = "SELECT dn.iddatosnomenclador, dn.denominacion
                                from mod_planificacion.nom_datosnomenclador dn
                                     INNER JOIN mod_planificacion.nom_tiponomenclador tn
                                     ON (tn.idtiponomenclador = dn.idtiponomenclador and tn.uritiponomenclador ='MES')
                                     where dn.uridatosnomenclador<>'-'
                                     order by dn.iddatosnomenclador";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
