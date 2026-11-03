<?php

class Analisisplanificacion {

    private $nivel;

    public function __construct() {
        $this->nivel = NomActividad::getNivel();
    }

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
                               (sum(((n.necesidad) *(COALESCE(
                               aem.nivelactividadmanual, 0))) * ip.precio) + sum(((n.cantplanif /
                                n.cantbase) *(COALESCE(aea.nivelactividadautomatico, 0))) * ip.precio))
                                 + sum((n.necesidad) * ae.ajuste * ip.precio) as
                                  importenorma
                        FROM mod_planificacion.dat_actividadentidad ae
                             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                              ae.idactividadentidad = aem.idactividadentidad
                             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                              ae.idactividadentidad = aea.idactividadentidad
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
                               ((sum((COALESCE(s.cantidad, 0)) *(COALESCE(aem.nivelactividadmanual
                               , 0)) * ip.precio)) +(sum((COALESCE(s.cantidad, 0)) *(COALESCE(
                               aea.nivelactividadautomatico, 0)) * ip.precio)) +(sum((COALESCE(
                               s.cantidad, 0)) * ae.ajuste * ip.precio))) as importesalida
                        FROM mod_planificacion.dat_actividadentidad ae
                             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                              ae.idactividadentidad = aem.idactividadentidad
                             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                              ae.idactividadentidad = aea.idactividadentidad
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
                       -- ORDER BY (v.importenorma - COALESCE(vs.importesalida, 0))--, v.actividad 
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
                                (sum(((n.necesidad) *(COALESCE(
                                aem.nivelactividadmanual, 0))) * ip.precio) + sum(((n.cantplanif /
                                 n.cantbase) *(COALESCE(aea.nivelactividadautomatico, 0))) *
                        ip.precio))
                                  + sum((n.necesidad) * ae.ajuste * ip.precio) as
                                   importenorma
                        FROM mod_planificacion.dat_actividadentidad ae
                               INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                                ae.idactividad
                                 LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                               ae.idactividadentidad = aem.idactividadentidad
                              LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                               ae.idactividadentidad = aea.idactividadentidad
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
                                ((sum((COALESCE(s.cantidad, 0)) *(COALESCE(aem.nivelactividadmanual
                                , 0)) * ip.precio)) +(sum((COALESCE(s.cantidad, 0)) *(COALESCE(
                                aea.nivelactividadautomatico, 0)) * ip.precio)) +(sum((COALESCE(
                                s.cantidad, 0)) * ae.ajuste * ip.precio))) as importesalida
                        FROM mod_planificacion.dat_actividadentidad ae
                               INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                                ae.idactividad
                                 LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                               ae.idactividadentidad = aem.idactividadentidad
                              LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                               ae.idactividadentidad = aea.idactividadentidad
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
                               round(((sum(COALESCE(aem.nivelactividadmanual,0)) + sum(COALESCE(
                               aea.nivelactividadautomatico,0)))+sum(COALESCE(ae.ajuste,0))), 6) as total
                        FROM mod_planificacion.dat_actividadentidad ae
                             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                              ae.idactividadentidad = aem.idactividadentidad
                             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                              ae.idactividadentidad = aea.idactividadentidad
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
                          v.nivelauto,v.total
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
                           round(((sum(COALESCE(aem.nivelactividadmanual, 0)) + sum(COALESCE( 
                             aea.nivelactividadautomatico, 0))) + sum(COALESCE(ae.ajuste, 0))), 6) 
                             as total 
                    FROM mod_planificacion.dat_actividadentidad ae 
                         LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON 
                           ae.idactividadentidad = aem.idactividadentidad 
                         LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON 
                           ae.idactividadentidad = aea.idactividadentidad 
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
                    SELECT a.denominacion as actividad,
                           round(sum((n.necesidad) * ae.ajuste * ip.precio), 3) as
                            importeajuste,
                           round(sum(((n.necesidad) *(COALESCE(
                           aem.nivelactividadmanual, 0))) * ip.precio), 3) as importenivelmanual,
                           round(sum(((n.necesidad) *(COALESCE(
                           aea.nivelactividadautomatico, 0))) * ip.precio), 3) as importenivelauto,
                           round((sum(((n.necesidad) *(COALESCE(
                           aem.nivelactividadmanual, 0))) * ip.precio) + sum(((n.cantplanif /
                            n.cantbase) *(COALESCE(aea.nivelactividadautomatico, 0))) * ip.precio))
                             + sum((n.necesidad) * ae.ajuste * ip.precio), 3) as total
                    FROM mod_planificacion.dat_actividadentidad ae
                         LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                          ae.idactividadentidad = aem.idactividadentidad
                         LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                          ae.idactividadentidad = aea.idactividadentidad
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
                           v.total
                    FROM valioso v
                    WHERE v.total <> 0
                    ORDER BY v.total $orden OFFSET $start LIMIT $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar Calculo. Relación ingresos-gastos
    public function calculoRIngreso($identidad, $idejercicio, $parametros) {
        //ejercicio actual
        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH consulta AS (
                        SELECT CASE
                        WHEN mod.tipoplan=0 THEN ((bc.importe) + (((bc.importe)*ip.flete)/100) + (((bc.importe)*ip.contingencia)/100))
                        ELSE 0
                        END as gastos,
                        CASE
                        WHEN mod.tipoplan=1 THEN  ((bc.importe) + (((bc.importe)*ip.flete)/100) + (((bc.importe)*ip.contingencia)/100))
                        ELSE 0
                        END as ingresos
                        FROM    mod_planificacion.dat_basescalculo bc
                        INNER JOIN mod_planificacion.dat_modelo mod ON bc.idmodelo=mod.idmodelo
                        INNER JOIN mod_datosmaestros.nom_indicador ind
                        ON bc.idindicador=ind.idindicador
                        INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                        ON ip.idindicador=ind.idindicador          
                        WHERE idejercicio = $idejercicio AND
                        bc.identidad IN ($identidad)AND
                        ip.nivelplanif = 1 AND
                        ip.idaprobacion = 4
                        $addwhere
                        GROUP BY
                        bc.precio, bc.importe, mod.tipoplan,
                        ip.flete, ip.contingencia)
                        SELECT COALESCE(round(sum(c.gastos), 3),0) as gastos,
                        COALESCE(round(sum(c.ingresos),3),0) as ingresos,
                        CASE
                                            WHEN sum(c.ingresos)> 0 THEN COALESCE(round((sum(c.gastos)/sum(c.ingresos)), 3), 0)
                                            ELSE 0
                                        END as gastos_peso,
                       COALESCE( round((sum(c.ingresos)*0.048),3),0) as aporte
                        from consulta c";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        $data->gastos = $result[0]['gastos'];
        $data->ingresos = $result[0]['ingresos'];
        $data->gastos_peso = $result[0]['gastos_peso'];
        $data->aporte = $result[0]['aporte'];

        $var = ($data->ingresos - $data->gastos) * 0.6;

        $sqlQueryCap = "WITH consulta AS (SELECT sum(COALESCE(aem.nivelactividadmanual, 0) + COALESCE( 
                        aea.nivelactividadautomatico, 0) + COALESCE( 
                        aep.nivelactividadproduccion, 0)) as capacidad, 
                              ae.identidad 
                       FROM mod_planificacion.dat_actividadentidad ae 
                            INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad = 
                              a.idactividad 
                            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON 
                              ae.idactividadentidad = aem.idactividadentidad 
                            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON 
                              ae.idactividadentidad = aea.idactividadentidad 
                            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON 
                              ae.idactividadentidad = aep.idactividadentidad 
                       where ae.identidad IN ($identidad) AND 
                             ae.idejercicio = $idejercicio AND 
                             (a.codigo = '001050107001' OR 
                             a.codigo = '001050107002')              
                       GROUP BY ae.identidad)
                          SELECT round($var/(sum(c.capacidad))/12, 3) as capacidad,
                              sum(c.capacidad) as personas,
                              round({$data->ingresos}/(sum(c.capacidad)*8*18*245),3) as indice
                          from consulta c";
        $result = $conn->execute($sqlQueryCap)->fetchAll(PDO::FETCH_ASSOC);
        $data->capacidad = $result[0]['capacidad'];
        $data->personas = $result[0]['personas'];
        $data->indice = $result[0]['indice'];

        return $data;
    }

    //Datos para graficar Calculo. Relación ingresos-gastos. XETID [Encadenamiento]
    public function calculoEncadenamiento($identidad, $idejercicio, $parametros) {
        //ejercicio actual
        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $sqlQueryGastos = "WITH consulta AS (
                            SELECT CASE
                                     WHEN mod.tipoplan = 0 THEN ((bc.importe) +(((
                                       bc.importe) * ip.flete) / 100) +(((bc.importe
                                       ) * ip.contingencia) / 100))
                                     ELSE 0
                                   END as gastos
                            FROM mod_planificacion.dat_basescalculo bc
                                 INNER JOIN mod_planificacion.dat_modelo mod ON
                                   bc.idmodelo = mod.idmodelo
                                 INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                   bc.idindicador = ind.idindicador
                                 INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                                   ON ip.idindicador = ind.idindicador
                            WHERE idejercicio = $idejercicio AND
                                  bc.identidad IN ($identidad) AND
                                  ip.nivelplanif = 1 AND
                                  ip.idaprobacion = 4
                                  $addwhere
                            GROUP BY bc.precio,
                                     bc.importe,
                                     mod.tipoplan,
                                     ip.flete,
                                     ip.contingencia)

                            SELECT COALESCE(round(sum(c.gastos), 3),0) as gastos
                            from consulta c";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQueryGastos)->fetchAll(PDO::FETCH_ASSOC);
        $data->gastos = $result[0]['gastos'];

        $sqlQueryIngresosUno = "WITH consultaingreso AS (SELECT COALESCE(((bc.importe) + bc.importeflete +
                                        bc.importecontingencia), 0) as ingreso
                                      FROM mod_planificacion.dat_basescalculo bc
                                           INNER JOIN mod_planificacion.dat_modelo mod ON
                                             bc.idmodelo = mod.idmodelo
                                           INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                             bc.idindicador = ind.idindicador
                                           INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                                             ON ip.idindicador = ind.idindicador
                                           INNER JOIN
                                             mod_datosmaestros.dat_indicadorcentrobalance icb ON
                                             icb.idindicador = ind.idindicador
                                           INNER JOIN
                                             mod_planificacion.dat_entidaddatosnomenclador edn
                                             ON icb.identidaddatosnomenclador =
                                             edn.identidaddatosnomenclador
                                           INNER JOIN mod_estructuracomp.nom_filaestruc f ON
                                             edn.identidad = f.idfila
                                           LEFT JOIN mod_estructuracomp.dat_estructuraop eop ON
                                             f.idfila = eop.idestructuraop
                                           LEFT JOIN mod_estructuracomp.dat_estructura e ON
                                             f.idfila = e.idestructura
                                      WHERE idejercicio = $idejercicio AND
                                            bc.identidad IN ($identidad) AND 
                                            (eop.denominacion = 'DIRECCIÓN ECONÓMICA' OR
                                            e.denominacion = 'DIRECCIÓN ECONÓMICA' OR
                                            eop.denominacion = 'DIRECCIÓN División Servicios Internos a la Producción'  OR
                                            e.denominacion = 'DIRECCIÓN División Servicios Internos a la Producción'
                                            )
                                            AND
                                            ip.nivelplanif = 1 AND
                                            ip.idaprobacion = 4 AND
                                            mod.tipoplan = 1 AND
                                            ind.estado = 1
                                            $addwhere
                                      GROUP BY bc.precio,
                                               bc.importe,
                                               mod.tipoplan,
                                               bc.importeflete,
                                               bc.importecontingencia)
                                                 SELECT COALESCE(round(sum(ci.ingreso), 3), 0) as ingresos
                                                 from consultaingreso ci";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQueryIngresosUno)->fetchAll(PDO::FETCH_ASSOC);
        $ingresosUno = $result[0]['ingresos'];

        $sqlQueryIngresos = "WITH consultaingreso AS (SELECT COALESCE(((bc.importe) + bc.importeflete +
                                    bc.importecontingencia), 0) as ingreso
                                 FROM mod_planificacion.dat_basescalculo bc
                                      INNER JOIN mod_planificacion.dat_modelo mod ON
                                        bc.idmodelo = mod.idmodelo
                                      INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                        bc.idindicador = ind.idindicador
                                      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                                        ON ip.idindicador = ind.idindicador
                                      INNER JOIN
                                        mod_datosmaestros.dat_indicadorcentrobalance icb ON
                                        icb.idindicador = ind.idindicador
                                      INNER JOIN
                                        mod_planificacion.dat_entidaddatosnomenclador edn
                                        ON icb.identidaddatosnomenclador =
                                        edn.identidaddatosnomenclador
                                 WHERE idejercicio = $idejercicio  AND 
                                     edn.identidad IN ($identidad) AND
                                       ip.nivelplanif = 1 AND
                                       ip.idaprobacion = 4 AND
                                       mod.tipoplan = 1 AND
                                       ind.estado = 1
                                       $addwhere
                                 GROUP BY bc.precio,
                                          bc.importe,
                                          mod.tipoplan,
                                          bc.importeflete,
                                          bc.importecontingencia)
                                            SELECT COALESCE(round(sum(ci.ingreso)+{$ingresosUno}, 3), 0) as ingresos,
                                                   CASE
                                                       WHEN (sum(ci.ingreso)+{$ingresosUno}) > 0 THEN COALESCE(round({$data->gastos} / (sum(ci.ingreso)+{$ingresosUno}), 3), 0)
                                                       ELSE 0
                                                   END as gastos_peso,
                                                   COALESCE(round(((sum(ci.ingreso)+{$ingresosUno}) * 0.048), 3), 0) as aportes
                                            from consultaingreso ci";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQueryIngresos)->fetchAll(PDO::FETCH_ASSOC);
        $data->ingresos = $result[0]['ingresos'];
        $data->aportes = $result[0]['aportes'];
        $data->gastos_peso = $result[0]['gastos_peso'];

        $var = (double) (($data->ingresos - $data->gastos) * 0.6);
        //$var2 = ($data->importe[0]['ingreso'] * 0.048);
        $sqlQueryCap = "WITH consulta AS (SELECT sum(COALESCE(aem.nivelactividadmanual, 0) + COALESCE( 
                            aea.nivelactividadautomatico, 0) + COALESCE( 
                            aep.nivelactividadproduccion, 0)) as capacidad, 
                                  ae.identidad 
                           FROM mod_planificacion.dat_actividadentidad ae 
                                INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad = 
                                  a.idactividad 
                                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON 
                                  ae.idactividadentidad = aem.idactividadentidad 
                                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON 
                                  ae.idactividadentidad = aea.idactividadentidad 
                                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON 
                                  ae.idactividadentidad = aep.idactividadentidad 
                           where ae.identidad IN ($identidad) AND 
                                 ae.idejercicio = $idejercicio AND 
                                 (a.codigo = '001050107001' OR 
                                 a.codigo = '001050107002')              
                           GROUP BY ae.identidad)
                              SELECT round($var/(sum(c.capacidad))/12, 3) as capacidad,
                                                sum(c.capacidad) as personas,
                              round({$data->ingresos}/(sum(c.capacidad)*8*18*245),3) as indice
                              from consulta c";
        $result = $conn->execute($sqlQueryCap)->fetchAll(PDO::FETCH_ASSOC);
        $data->capacidad = $result[0]['capacidad'];
        $data->indice = $result[0]['indice'];
        $data->personas = $result[0]['personas'];

        return $data;
    }

    //Datos para graficar Calculo. Planes por entidad
    public function calculoPlanesPorEntidad($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];

        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $idejercicio = $parametros['idejercicio'];

        $conn = Doctrine_Manager::connection();
        $sql = "WITH consulta AS (
                    SELECT SUM((bc.importe) + (bc.importeflete) + (bc.importecontingencia)) as importe,
                           COALESCE(mod.denominacion,'No definido') as denominacion
                    FROM mod_planificacion.dat_basescalculo bc
                         LEFT JOIN mod_planificacion.dat_modelo mod ON bc.idmodelo =
                           mod.idmodelo
                         INNER JOIN mod_datosmaestros.nom_indicador ind ON bc.idindicador
                           = ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                           ip.idindicador = ind.idindicador
                    WHERE idejercicio = $idejercicio AND
                          bc.identidad IN ($entidades) AND
                          ip.nivelplanif = 1 AND
                          ip.idaprobacion = 4
                          $addwhere
                    GROUP BY bc.importeflete, bc.importecontingencia, mod.denominacion)

                    SELECT round(sum(c.importe), 3) as importe,
                           c.denominacion as denomplan
                    FROM consulta c
                    GROUP BY c.denominacion
                    ORDER BY importe DESC";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Plan - Normalizados y directos
    public function vieneBaseplan($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $select = " CASE
                            WHEN p.generadobasesplan = 0 THEN 
                            sum((p.precio *(p.cantidad+p.ajuste)) + 
                            (((p.precio * (p.cantidad+p.ajuste))*ip.flete)/100)+
                            (((p.precio * (p.cantidad+p.ajuste))*ip.contingencia)/100) )
                            ELSE 0
                          END as directoplan,
                          CASE
                            WHEN p.generadobasesplan = 1 THEN 
                            sum((p.precio *(p.cantidad+p.ajuste)) + 
                            (((p.precio * (p.cantidad+p.ajuste))*ip.flete)/100)+
                            (((p.precio * (p.cantidad+p.ajuste))*ip.contingencia)/100) )
                            ELSE 0
                          END as baseplan,";
        } else
            $select = " CASE
                            WHEN p.generadobasesplan = 0 THEN 
                            sum((p.precio *(p.cantidad+p.ajuste)))
                            ELSE 0
                          END as directoplan,
                          CASE
                            WHEN p.generadobasesplan = 1 THEN 
                            sum((p.precio *(p.cantidad+p.ajuste)))
                            ELSE 0
                          END as baseplan,";
        //fin del select
        $sqlQuery = " WITH consulta AS (
                                        SELECT $select
                                               sum(p.importe) as total
                                        FROM mod_planificacion.dat_planificacion p
                                             INNER JOIN mod_planificacion.dat_entidadmodelo em ON em.identidadmodelo =
                                              p.identidadmodelo
                                               INNER JOIN mod_datosmaestros.nom_indicador ind ON ind.idindicador=p.idindicador
                                               INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ind.idindicador=ip.idindicador
                                               INNER JOIN mod_planificacion.dat_modelo mod 
                                             ON em.idmodelo = mod.idmodelo
                                             $innerJoinFiltros
                                        WHERE idejercicio = $idejercicio AND
                                              em.identidad IN ($identidad)
                                                  and mod.tipoplan={$parametros['uri']}
                                                      $filtros
                                        GROUP BY p.generadobasesplan)

                                        SELECT round(sum(c.directoplan), 3) as directoplan,
                                               round(sum(c.baseplan), 3) as baseplan
                                        from consulta c";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Plan - Balance financiero
    public function balanceFinanciero($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //
        //ejercicio actual        
        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "
                        SELECT          round(sum(p.importe),3) as importe,
                                        round((SUM(p.ajuste*p.precio)),3) as importeajuste,
                                        round(((sum(p.precio*(p.cantidad+p.ajuste)*ip.flete)
                                         )/100),3) as importeflete,
                                        round(((sum(p.precio*(p.cantidad+p.ajuste) *ip.contingencia)
                                        )/100),3) as importecontingencia,
                                         round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                         (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                         SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100),3)  as total
                        FROM mod_planificacion.dat_planificacion p
                             INNER JOIN mod_datosmaestros.nom_indicador ind 
                             ON p.idindicador = ind.idindicador
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                             ON ip.idindicador = ind.idindicador
                             INNER JOIN mod_planificacion.dat_entidadmodelo em 
                             ON em.identidadmodelo = p.identidadmodelo
                             INNER JOIN mod_planificacion.dat_modelo mod 
                             ON em.idmodelo = mod.idmodelo
                              $innerJoinFiltros
                        WHERE idejercicio = $idejercicio AND
                              em.identidad IN ($identidad)
                              and mod.tipoplan=0 AND
                              ip.nivelplanif = 1 AND
                              ip.idaprobacion = 4
                              $filtros
                              $addwhere";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function utilidad($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //ejercicio actual 
        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH consulta AS (
                        SELECT CASE
                                 WHEN mod.tipoplan=0 THEN
                                 (p.precio*SUM((p.cantidad+p.ajuste))) +
                                         (((p.precio*SUM((p.cantidad+p.ajuste)))*ip.flete)/100) + (((p.precio*
                                         SUM((p.cantidad+p.ajuste)))*ip.contingencia)/100)
                                 ELSE 0
                               END as gastos,
                               CASE
                                 WHEN mod.tipoplan=1 THEN  (p.precio*SUM((p.cantidad+p.ajuste)))
                                 ELSE 0
                               END as ingreso
                        FROM    mod_planificacion.dat_planificacion p
                                INNER JOIN mod_planificacion.dat_entidadmodelo em 
                                ON em.identidadmodelo = p.identidadmodelo
                                INNER JOIN mod_planificacion.dat_modelo mod 
                                ON em.idmodelo= mod.idmodelo
                                INNER JOIN mod_datosmaestros.nom_indicador ind 
                                ON p.idindicador=ind.idindicador
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                                ON ip.idindicador=ind.idindicador
                                $innerJoinFiltros
                        WHERE idejercicio = $idejercicio AND
                              em.identidad IN ($identidad)AND
                               ip.nivelplanif = 1 AND
                               ip.idaprobacion = 4
                               $filtros
                               $addwhere
                        GROUP BY
                        p.precio,mod.tipoplan,
                        ip.flete,
                        ip.contingencia)

                        SELECT round(sum(c.gastos), 3) as gastos,
                               round(sum(c.ingreso),3) as ingreso,
                               round((sum(c.ingreso)-sum(c.gastos)),3) as utilidad
                        from consulta c";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Plan - Mas demandados
    public function masValiososxVia($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH valioso AS (
                            SELECT
                              p.idindicador,
                              ind.denominacion as indicador,
                              CASE
                                     WHEN v.uriviaadquisicion = 'importacion directa' THEN round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                             (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                             SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100),3)
                                     ELSE 0
                                   END as importaciondirecta,
                                   CASE
                                     WHEN v.uriviaadquisicion = 'sustitucionimportaciones' THEN round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                             (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                             SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100),3)
                                     ELSE 0
                                   END as sustitucionimportaciones,
                                          CASE
                                     WHEN v.uriviaadquisicion = 'oace' THEN round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                             (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                             SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100),3)
                                     ELSE 0
                                   END as oace,
                             round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                             (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                             SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100),3) as total
                            FROM
                              mod_planificacion.dat_planificacion p
                              INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador=ind.idindicador
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador=ind.idindicador
                              INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion ivia ON p.idindicador=ivia.idindicador
                              INNER JOIN mod_datosmaestros.nom_viaadquisicion v ON v.idviaadquisicion=ivia.idviaadquisicion
                              INNER JOIN mod_planificacion.dat_entidadmodelo em ON em.identidadmodelo =
                                  p.identidadmodelo
                              INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                              $innerJoinFiltros
                            WHERE
                            idejercicio = $idejercicio AND
                            em.identidad IN ($identidad)
                                AND
                                  ip.nivelplanif = 1 AND
                                   ip.idaprobacion = 4 AND
                                    mod.tipoplan = 0
                                    $filtros
                                   $addwhere
                             GROUP BY
                             v.uriviaadquisicion,p.idindicador,ind.denominacion)

                             SELECT v.idindicador,v.indicador,v.importaciondirecta,
                              v.sustitucionimportaciones,v.oace, v.total
                              FROM valioso v
                              WHERE v.total <> 0
                             ORDER BY v.total $orden
                                 OFFSET $start
                             Limit $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function masValiososxViaTotal($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH valioso AS (
                        SELECT
                          p.idindicador,
                         round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                         (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                         SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100),3) as total
                        FROM
                          mod_planificacion.dat_planificacion p
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador=ind.idindicador
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador=ind.idindicador
                          INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion ivia ON p.idindicador=ivia.idindicador
                          INNER JOIN mod_datosmaestros.nom_viaadquisicion v ON v.idviaadquisicion=ivia.idviaadquisicion
                          INNER JOIN mod_planificacion.dat_entidadmodelo em ON em.identidadmodelo =
                              p.identidadmodelo
                          INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                          $innerJoinFiltros
                        WHERE
                        idejercicio = $idejercicio AND
                        em.identidad IN ($identidad)AND
                              ip.nivelplanif = 1 AND
                               ip.idaprobacion = 4 AND mod.tipoplan = 0
                               $filtros
                               $addwhere
                         GROUP BY
                        p.idindicador)

                         SELECT count(v.idindicador)
                          FROM valioso v
                          WHERE v.total <> 0";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Plan - Mas valiosos
    public function masValiosos($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = " WITH valioso AS (SELECT p.idindicador,
                         ind.denominacion as indicador,
                         round(sum(p.importe +((p.importe * ip.flete) / 100) +((
                           p.importe * ip.contingencia) / 100)), 3) as importe,
                         round((SUM(p.ajuste * p.precio)) +(((SUM(p.ajuste *
                           p.precio * ip.flete))) / 100) +(((SUM(p.ajuste *
                           p.precio * ip.contingencia))) / 100), 3) as
                           importeajuste,
                         round(((sum(p.precio *(p.cantidad + p.ajuste) *
                           ip.flete)) / 100), 3) as importeflete,
                         round(((sum(p.precio *(p.cantidad + p.ajuste) *
                           ip.contingencia)) / 100), 3) as importecontingencia,
                         round((sum(p.importe +((p.importe * ip.flete) / 100) +(
                           (p.importe * ip.contingencia) / 100))) +((SUM(
                           p.ajuste * p.precio)) +(((SUM(p.ajuste * p.precio *
                           ip.flete))) / 100) +(((SUM(p.ajuste * p.precio *
                           ip.contingencia))) / 100)) +(((sum(p.precio *(
                           p.cantidad + p.ajuste) * ip.flete)) / 100)) +(((sum(
                           p.precio *(p.cantidad + p.ajuste) * ip.contingencia))
                           / 100)), 3) as total
                  FROM mod_planificacion.dat_planificacion p
                       INNER JOIN mod_datosmaestros.nom_indicador ind ON
                         p.idindicador = ind.idindicador
                       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                         ip.idindicador = ind.idindicador
                       INNER JOIN mod_planificacion.dat_entidadmodelo em ON
                         em.identidadmodelo = p.identidadmodelo
                         INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                         $innerJoinFiltros
                  WHERE idejercicio = $idejercicio AND
                        em.identidad IN ($identidad)
                            AND
                                ip.nivelplanif = 1 AND
                                 ip.idaprobacion = 4
                                 AND mod.tipoplan = 0
                                 $filtros
                                 $addwhere
                           GROUP BY p.idindicador, ind.denominacion)
                           SELECT v.idindicador,
                                  v.indicador,
                                  v.importe,
                                  v.importeajuste,
                                  v.importeflete,
                                  v.importecontingencia,
                                  v.total
                           FROM valioso v
                           WHERE v.total <> 0
                           ORDER BY v.total $orden
                               OFFSET $start
                           Limit $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function masValiososTotal($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $sqlQuery = "WITH valioso AS (SELECT p.idindicador,
                            ind.denominacion as indicador,
                            round((sum(p.importe +((p.importe * ip.flete) / 100) +((p.importe * ip.contingencia) / 100)))
                           +((SUM(p.ajuste * p.precio)) +(((SUM(p.ajuste * p.precio * ip.flete))) / 100) 
                           +(((SUM(p.ajuste * p.precio * ip.contingencia))) / 100)) 
                           +(((sum(p.precio *(p.cantidad + p.ajuste) * ip.flete)) / 100)) 
                           +(((sum(p.precio *(p.cantidad + p.ajuste) * ip.contingencia)) / 100)), 3) as total
                     FROM mod_planificacion.dat_planificacion p
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
                          INNER JOIN mod_planificacion.dat_entidadmodelo em ON em.identidadmodelo = p.identidadmodelo
                          INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                            $innerJoinFiltros
                     WHERE idejercicio = $idejercicio AND
                           em.identidad IN ($identidad) AND
                           ip.nivelplanif = 1 AND
                            ip.idaprobacion = 4
                            AND mod.tipoplan = 0
                            $filtros
                            $addwhere
                                       GROUP BY p.idindicador,
                                                ind.denominacion)

                       SELECT count(v.idindicador)
                       FROM valioso v
                       WHERE v.total <> 0";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Plan - Resumen por CB
    public function graficaResumenCB($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
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
        $sql = "WITH consulta AS (SELECT DISTINCT entidaddn.identidad as cb,
                         CASE
                           WHEN mod.tipoplan = 0 THEN (p.precio * SUM((
                             p.cantidad + p.ajuste))) +(((p.precio * SUM((
                             p.cantidad + p.ajuste))) * ip.flete) / 100) +(((
                             p.precio * SUM((p.cantidad + p.ajuste))) *
                             ip.contingencia) / 100)
                           ELSE 0
                         END as gastos,
                         CASE
                           WHEN mod.tipoplan = 1 THEN (p.precio * SUM((
                             p.cantidad + p.ajuste))) 
                           ELSE 0
                         END as ingreso
                  from mod_planificacion.dat_planificacion p
                       LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador
                         entidaddn on entidaddn.identidaddatosnomenclador =
                         p.idcentrobalance
                       LEFT JOIN mod_planificacion.dat_entidadmodelo
                         entidadmodelo on entidadmodelo.identidadmodelo =
                         p.identidadmodelo
                       LEFT JOIN mod_planificacion.dat_modelo mod on
                         mod.idmodelo = entidadmodelo.idmodelo
                       LEFT JOIN mod_datosmaestros.nom_indicador ind on
                         ind.idindicador = p.idindicador
                       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip on
                         ind.idindicador = ip.idindicador
                         $innerJoinFiltros
                  WHERE ip.idaprobacion = 4 AND
                        ip.nivelplanif = 1 and
                        p.idejercicio = {$parametros['idejercicio']} AND
                        entidadmodelo.identidad IN ($entidades)
                            $filtros
                        $addwhere
                  GROUP BY mod.tipoplan,
                           ip.flete,
                           ip.contingencia,
                           p.precio,
                           entidaddn.identidad)        
         
                            SELECT c.cb,
                                   round(sum(c.gastos), 3) as gastos,
                                   round(sum(c.ingreso), 3) as ingreso
                            from consulta c
                            WHERE gastos<> 0 OR ingreso<> 0
                            GROUP BY c.cb order by gastos, ingreso {$parametros['orden']}
                        OFFSET {$parametros['start']}
                    Limit {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaResumenCBTotal($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
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
        $sql = "WITH consulta AS (SELECT DISTINCT entidaddn.identidad as cb,
                            CASE
                              WHEN mod.tipoplan = 0 THEN (p.precio * SUM((p.cantidad + p.ajuste))) 
                              +(((p.precio * SUM((p.cantidad + p.ajuste))) * ip.flete) / 100) 
                              +(((p.precio * SUM((p.cantidad + p.ajuste))) * ip.contingencia) / 100)
                              ELSE 0
                            END as gastos,
                            CASE
                              WHEN mod.tipoplan = 1 THEN (p.precio * SUM((p.cantidad + p.ajuste))) 
                              +(((p.precio * SUM((p.cantidad + p.ajuste))) * ip.flete) / 100) 
                              +(((p.precio * SUM((p.cantidad + p.ajuste))) * ip.contingencia) / 100)
                              ELSE 0
                            END as ingreso
                     from mod_planificacion.dat_planificacion p
                          LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador
                            entidaddn on entidaddn.identidaddatosnomenclador = p.idcentrobalance
                          LEFT JOIN mod_planificacion.dat_entidadmodelo
                            entidadmodelo on entidadmodelo.identidadmodelo =   p.identidadmodelo
                          LEFT JOIN mod_planificacion.dat_modelo mod on  mod.idmodelo = entidadmodelo.idmodelo
                          LEFT JOIN mod_datosmaestros.nom_indicador
                              ind on ind.idindicador = p.idindicador
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif                        
                              ip on  ind.idindicador = ip.idindicador
                            $innerJoinFiltros
                     WHERE ip.idaprobacion = 4 AND
                           ip.nivelplanif = 1 and
                           p.idejercicio = {$parametros['idejercicio']} AND
                           entidadmodelo.identidad IN ($entidades) 
                               $filtros
                           $addwhere
                      GROUP BY mod.tipoplan,
                               ip.flete,
                               ip.contingencia,
                               p.precio,
                               entidaddn.identidad)
             SELECT count(DISTINCT c.cb)
             from consulta c
             WHERE gastos <> 0 OR
                   ingreso <> 0";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Plan - Resumen por Entidad
    public function graficaResumenEntidad($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        if ($parametros['identidad'] != $identrectora[0]['identidad'])
            $condcb = " AND entidaddn.identidad = {$parametros['identidad']}";
        else
            $condcb = " ";

        $conn = Doctrine_Manager::connection();
        $sql = "WITH consulta AS (SELECT DISTINCT entidadmodelo.identidad as od,
                                        CASE
                                          WHEN mod.tipoplan = 0 THEN (p.precio * SUM((
                                            p.cantidad + p.ajuste))) +(((p.precio * SUM((
                                            p.cantidad + p.ajuste))) * ip.flete) / 100) +(((
                                            p.precio * SUM((p.cantidad + p.ajuste))) *
                                            ip.contingencia) / 100)
                                          ELSE 0
                                        END as gastos,
                                        CASE
                                          WHEN mod.tipoplan = 1 THEN (p.precio * SUM((
                                            p.cantidad + p.ajuste)))
                                          ELSE 0
                                        END as ingreso
                                 from mod_planificacion.dat_planificacion p
                                      LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador
                                        entidaddn on entidaddn.identidaddatosnomenclador =
                                        p.idcentrobalance
                                      LEFT JOIN mod_planificacion.dat_entidadmodelo
                                        entidadmodelo on entidadmodelo.identidadmodelo =
                                        p.identidadmodelo
                                      LEFT JOIN mod_planificacion.dat_modelo mod on
                                        mod.idmodelo = entidadmodelo.idmodelo
                                      LEFT JOIN mod_datosmaestros.nom_indicador ind on
                                        ind.idindicador = p.idindicador
                                      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip on
                                        ind.idindicador = ip.idindicador
                                        $innerJoinFiltros
                                 WHERE ip.idaprobacion = 4 AND
                                       ip.nivelplanif = 1 and
                                       p.idejercicio = {$parametros['idejercicio']} 
                                           $filtros
                                       $condcb --este filtro es de cb
                                       $addwhere
                                 GROUP BY mod.tipoplan,
                                          ip.flete,
                                          ip.contingencia,
                                          entidadmodelo.identidad,
                                          p.precio)      
               SELECT c.od,
                      round(sum(c.gastos), 3) as gastos,
                      round(sum(c.ingreso), 3) as ingreso
               from consulta c
               WHERE gastos<> 0 OR ingreso<> 0
               GROUP BY c.od order by gastos, ingreso {$parametros['orden']}
                    OFFSET {$parametros['start']}
                Limit {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Carga-Capacidad
    public function calcularCargaCapacidad($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "
                    WITH carga AS (
                    SELECT COALESCE(sum(bc.necesidad), 0) as carga,
                           identidad
                    FROM mod_planificacion.dat_basescalculo bc
                         INNER JOIN mod_datosmaestros.nom_indicador i ON bc.idindicador =
                           i.idindicador
                    where identidad IN ({$parametros['identidades']}) AND
                          idejercicio = {$parametros['idejercicio']} AND
                          (i.denominacion = 'HORAS/HOMBRE' OR  i.codigo LIKE '0101040001')
                    GROUP BY identidad),
                          capacidad AS
                          (SELECT sum(COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                            aea.nivelactividadautomatico, 0) + COALESCE(
                            aep.nivelactividadproduccion, 0))*8*245 as capacidad,
                                  ae.identidad
                           FROM mod_planificacion.dat_actividadentidad ae
                                INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad =
                                  a.idactividad
                                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                                  ae.idactividadentidad = aem.idactividadentidad
                                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                                  ae.idactividadentidad = aea.idactividadentidad
                                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON
                                  ae.idactividadentidad = aep.idactividadentidad
                           where ae.identidad IN ({$parametros['identidades']}) AND
                                 ae.idejercicio = {$parametros['idejercicio']} AND
                                 (a.codigo = '001050107001' OR
                                 a.codigo = '001050107002')
                           GROUP BY ae.identidad)
                    SELECT sum(c.carga) as carga,
                           sum(cp.capacidad) as capacidad ,
                            sum(cp.capacidad) - sum(c.carga)  as diferencia
                    FROM carga c
                         INNER JOIN capacidad cp ON c.identidad = cp.identidad";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaResumenEntidadTotal($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        if ($parametros['identidad'] != $identrectora[0]['identidad'])
            $condcb = " AND entidaddn.identidad = {$parametros['identidad']}";
        else
            $condcb = " ";

        $conn = Doctrine_Manager::connection();
        $sql = "WITH consulta AS (SELECT DISTINCT entidadmodelo.identidad as od,
                         CASE
                           WHEN mod.tipoplan = 0 THEN (p.precio * SUM((
                             p.cantidad + p.ajuste))) +(((p.precio * SUM((
                             p.cantidad + p.ajuste))) * ip.flete) / 100) +(((
                             p.precio * SUM((p.cantidad + p.ajuste))) *
                             ip.contingencia) / 100)
                           ELSE 0
                         END as gastos,
                         CASE
                           WHEN mod.tipoplan = 1 THEN (p.precio * SUM((
                             p.cantidad + p.ajuste))) +(((p.precio * SUM((
                             p.cantidad + p.ajuste))) * ip.flete) / 100) +(((
                             p.precio * SUM((p.cantidad + p.ajuste))) *
                             ip.contingencia) / 100)
                           ELSE 0
                         END as ingreso
                  from mod_planificacion.dat_planificacion p
                       LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador
                         entidaddn on entidaddn.identidaddatosnomenclador =
                         p.idcentrobalance
                       LEFT JOIN mod_planificacion.dat_entidadmodelo
                         entidadmodelo on entidadmodelo.identidadmodelo =
                         p.identidadmodelo
                       LEFT JOIN mod_planificacion.dat_modelo mod on
                         mod.idmodelo = entidadmodelo.idmodelo
                       LEFT JOIN mod_datosmaestros.nom_indicador ind on
                         ind.idindicador = p.idindicador
                       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip on
                         ind.idindicador = ip.idindicador $innerJoinFiltros
                  WHERE ip.idaprobacion = 4 AND
                        ip.nivelplanif = 1 and
                        p.idejercicio = {$parametros ['idejercicio'] } $condcb
                          $filtros $addwhere
                  GROUP BY mod.tipoplan,
                           ip.flete,
                           ip.contingencia,
                           entidadmodelo.identidad,
                           p.precio)
SELECT count(DISTINCT c.od)
from consulta c
WHERE gastos <> 0 OR
      ingreso <> 0";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //BM - CTE-necesidad
    public function diferenciaBalanceCantidad($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $sqlQuery = "WITH valioso AS (
                        SELECT ind.idindicador,
                               ind.denominacion as indicador,
                               round(SUM(p.cantidad + p.ajuste),6) as necesidad,
                               round(COALESCE(ae.coberturatotalestimada, 0),6) as cte,
                               round((SUM(p.cantidad + p.ajuste))- COALESCE(ae.coberturatotalestimada, 0),6) as diferencia
                        FROM mod_planificacion.dat_planificacion p
                             INNER JOIN mod_datosmaestros.nom_indicador ind on p.idindicador =
                              ind.idindicador
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador =
                              ipnif.idindicador
                             INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =
                              em.identidadmodelo
                             LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
                              ae.idindicador AND ae.identidad IN ($identidad) AND ae.idejercicio = $idejercicio)
                             LEFT JOIN mod_planificacion.dat_odcte odcte on (ind.idindicador =
                              odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
                               odcte.idmodelo AND odcte.idejercicio = $idejercicio)
                              INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                              $innerJoinFiltros
                        WHERE em.identidad IN ($identidad) AND
                              ipnif.nivelplanif = 1 AND
                              ipnif.idaprobacion = 4 AND
                              p.cantidad > 0 AND      
                              p.idejercicio = $idejercicio  AND mod.tipoplan =0 $addwhere
                                  $filtros
                        Group by ind.idindicador,
                                 ae.coberturatotalestimada
                        )
                        SELECT v.indicador,v.necesidad,
                          v.cte,v.diferencia
                          FROM valioso v
                          WHERE v.necesidad <> 0 OR v.cte<> 0
                         ORDER BY v.diferencia $orden
                             OFFSET $start
                         Limit $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function diferenciaBalanceCantidadTotal($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $sqlQuery = "WITH valioso AS (
                    SELECT ind.idindicador,
                           round(SUM(p.cantidad + p.ajuste),6) as necesidad,
                           round(COALESCE(ae.coberturatotalestimada, 0),6) as cte
                    FROM mod_planificacion.dat_planificacion p
                         INNER JOIN mod_datosmaestros.nom_indicador ind on p.idindicador =
                          ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador =
                          ipnif.idindicador
                         INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =
                          em.identidadmodelo
                         LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
                          ae.idindicador AND ae.identidad IN ($identidad) AND ae.idejercicio = $idejercicio)
                         LEFT JOIN mod_planificacion.dat_odcte odcte on (ind.idindicador =
                          odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
                           odcte.idmodelo AND odcte.idejercicio = $idejercicio)
                                INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                                $innerJoinFiltros
                    WHERE em.identidad IN ($identidad) AND
                          ipnif.nivelplanif = 1 AND
                          ipnif.idaprobacion = 4 AND
                          p.cantidad > 0 AND
                          p.idejercicio = $idejercicio AND mod.tipoplan =0 $addwhere
                              $filtros
                    Group by ind.idindicador,
                             ae.coberturatotalestimada
                    )
                    SELECT count(v.idindicador)
                      FROM valioso v 
                      WHERE v.necesidad <> 0 OR v.cte<> 0";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function diferenciaBalanceImporte($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH valioso AS (SELECT ind.idindicador,
                        ind.denominacion as indicador,
                        round((SUM(p.precio *(p.cantidad + p.ajuste))) +(((SUM(
                          p.precio *(p.cantidad + p.ajuste) * ipnif.flete))) /
                          100) +(((SUM(p.precio *(p.cantidad + p.ajuste) *
                          ipnif.contingencia))) / 100), 3) as importenecesidad,
                        round(sum((COALESCE(ae.coberturatotalestimada, 0) * p.precio
                          )), 3) as importecte,
                        round(((SUM(p.precio *(p.cantidad + p.ajuste))) +(((SUM(
                          p.precio *(p.cantidad + p.ajuste) * ipnif.flete))) /
                          100) +(((SUM(p.precio *(p.cantidad + p.ajuste) *
                          ipnif.contingencia))) / 100)) -sum((COALESCE(ae.coberturatotalestimada, 0) * p.precio
                          )), 3) as
                          diferencia
                 FROM mod_planificacion.dat_planificacion p
                      INNER JOIN mod_datosmaestros.nom_indicador ind on
                        p.idindicador = ind.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on
                        ind.idindicador = ipnif.idindicador
                      INNER JOIN mod_planificacion.dat_entidadmodelo em on
                        p.identidadmodelo = em.identidadmodelo
                      LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (
                        p.idindicador = ae.idindicador AND ae.identidad IN ($identidad) AND ae.idejercicio = $idejercicio)
                      LEFT JOIN mod_planificacion.dat_odcte odcte on (
                        ind.idindicador = odcte.idindicador AND odcte.identidad =
                        em.identidad AND em.idmodelo = odcte.idmodelo AND
                        odcte.idejercicio = $idejercicio)
                      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                      $innerJoinFiltros
                 WHERE em.identidad IN ($identidad) AND
                       ipnif.nivelplanif = 1 AND
                       ipnif.idaprobacion = 4 AND
                       p.cantidad > 0 AND
                       p.idejercicio = $idejercicio AND mod.tipoplan =0
                           $filtros
                       $addwhere
                 Group by ind.idindicador,
                          ae.coberturatotalestimada)SELECT v.indicador,
                                          v.importenecesidad,
                                          v.importecte,
                                          v.diferencia
                                   FROM valioso v
                                   WHERE v.importenecesidad <> 0 OR v.importecte<> 0
                                   ORDER BY v.diferencia $orden
                                       OFFSET $start
                                   Limit $limit";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //BM - CPE-demanda
    public function demandaBalanceCantidad($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH valioso AS (
                        SELECT ind.idindicador,
                               ind.denominacion as indicador,
                               round(SUM(p.cantidad + p.ajuste),6) as necesidad,
                               round(COALESCE(SUM(cpe),0),6) as cpe,
                               round((SUM(p.cantidad + p.ajuste))- COALESCE(SUM(cpe),0),6) as demanda
                        FROM mod_planificacion.dat_planificacion p
                             INNER JOIN mod_datosmaestros.nom_indicador ind on p.idindicador =
                              ind.idindicador
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador =
                              ipnif.idindicador
                             INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =
                              em.identidadmodelo
                             LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
                              ae.idindicador AND ae.identidad IN ($identidad) AND ae.idejercicio = $idejercicio)
                             LEFT JOIN mod_planificacion.dat_odcte odcte on (ind.idindicador =
                              odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
                               odcte.idmodelo AND odcte.idejercicio = $idejercicio)
                                    INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                                    $innerJoinFiltros
                        WHERE em.identidad IN ($identidad) AND
                              ipnif.nivelplanif = 1 AND
                              ipnif.idaprobacion = 4 AND
                              p.cantidad > 0 AND
                              p.idejercicio = $idejercicio AND mod.tipoplan =0 $filtros $addwhere
                        Group by ind.idindicador
                        )
                        SELECT v.indicador,v.necesidad,
                          v.cpe,v.demanda
                          FROM valioso v
                            WHERE v.necesidad <> 0 OR v.cpe<> 0
                         ORDER BY v.demanda $orden
                             OFFSET $start
                         Limit $limit";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function demandaBalanceCantidadTotal($identidad, $idejercicio, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH valioso AS (
                        SELECT ind.idindicador,
                               round(SUM(p.cantidad + p.ajuste),6) as necesidad,
                               round(COALESCE(SUM(cpe),0),6) as cpe
                        FROM mod_planificacion.dat_planificacion p
                             INNER JOIN mod_datosmaestros.nom_indicador ind on p.idindicador =
                              ind.idindicador
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador =
                              ipnif.idindicador
                             INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =
                              em.identidadmodelo
                             LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
                              ae.idindicador AND ae.identidad IN ($identidad) AND ae.idejercicio = $idejercicio)
                             LEFT JOIN mod_planificacion.dat_odcte odcte on (ind.idindicador =
                              odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
                               odcte.idmodelo AND odcte.idejercicio = $idejercicio)
                                    INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                                    $innerJoinFiltros
                        WHERE em.identidad IN ($identidad) AND
                              ipnif.nivelplanif = 1 AND
                              ipnif.idaprobacion = 4 AND
                              p.cantidad > 0 AND
                              p.idejercicio = $idejercicio AND mod.tipoplan =0 $filtros
                                        $addwhere
                        Group by ind.idindicador
                        )
                        SELECT count(v.idindicador)
                          FROM valioso v 
                          WHERE v.necesidad <> 0 OR v.cpe<> 0";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function demandaBalanceImporte($identidad, $idejercicio, $orden, $start, $limit, $parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $sqlQuery = "WITH valioso AS (SELECT ind.idindicador,
                        ind.denominacion as indicador,
                        round((SUM(p.precio *(p.cantidad + p.ajuste))) +(((SUM(
                          p.precio *(p.cantidad + p.ajuste) * ipnif.flete))) /
                          100) +(((SUM(p.precio *(p.cantidad + p.ajuste) *
                          ipnif.contingencia))) / 100), 3) as importenecesidad,
                        round((COALESCE(SUM(cpe * p.precio), 0)), 3) as
                          importecpe,
                        round(((SUM(p.precio *(p.cantidad + p.ajuste))) +(((SUM(
                          p.precio *(p.cantidad + p.ajuste) * ipnif.flete))) /
                          100) +(((SUM(p.precio *(p.cantidad + p.ajuste) *
                          ipnif.contingencia))) / 100)) -(COALESCE(SUM(cpe *
                          p.precio), 0)), 3) as importedemanda
                 FROM mod_planificacion.dat_planificacion p
                      INNER JOIN mod_datosmaestros.nom_indicador ind on
                        p.idindicador = ind.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on
                        ind.idindicador = ipnif.idindicador
                      INNER JOIN mod_planificacion.dat_entidadmodelo em on
                        p.identidadmodelo = em.identidadmodelo
                      LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (
                        p.idindicador = ae.idindicador AND ae.identidad IN (
                        $identidad) AND ae.idejercicio = $idejercicio)
                      LEFT JOIN mod_planificacion.dat_odcte odcte on (
                        ind.idindicador = odcte.idindicador AND odcte.identidad =
                        em.identidad AND em.idmodelo = odcte.idmodelo AND
                        odcte.idejercicio = $idejercicio)
                       INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                       $innerJoinFiltros
                 WHERE em.identidad IN ($identidad) AND
                       ipnif.nivelplanif = 1 AND
                       ipnif.idaprobacion = 4 AND
                       p.cantidad > 0 AND
                       p.idejercicio = $idejercicio AND mod.tipoplan =0
                           $filtros
                       $addwhere
                 Group by ind.idindicador,
                          ae.coberturatotalestimada)SELECT v.indicador,
                                          v.importenecesidad,
                                          v.importecpe,
                                          v.importedemanda
                                   FROM valioso v
                                   WHERE v.importenecesidad <> 0 OR v.importecpe<> 0
                                   ORDER BY v.importedemanda $orden
                                    OFFSET $start
                                Limit $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab CEPlan - global * entidad
    public function graficaEjecucionglobalxentidad($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                    round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                     (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                     SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100),3) as importeplan,

                                     round((SUM(p.precio*(COALESCE (ce.cantidadreal,0)))) +
                                     (((SUM(p.precio*(COALESCE (ce.cantidadreal,0))*ip.flete)))/100) + (((
                                     SUM(p.precio*(COALESCE (ce.cantidadreal,0))*ip.contingencia)))/100), 3) as importeejecutado,

                      round(((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                     (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                     SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100))- ((SUM(p.precio*(COALESCE (ce.cantidadreal,0)))) +
                                     (((SUM(p.precio*(COALESCE (ce.cantidadreal,0))*ip.flete)))/100) + (((
                                     SUM(p.precio*(COALESCE (ce.cantidadreal,0))*ip.contingencia)))/100)), 3) as importependiente
                    FROM
                      mod_planificacion.dat_planificacion p
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
                      INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo=em.identidadmodelo
                      LEFT JOIN mod_planificacion.dat_controlejecucionplan ce ON p.idplanificacion=ce.idplanificacion
                      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                      $innerJoinFiltros
                    where
                      em.identidad IN($entidades)AND
                      p.idejercicio={$parametros['idejercicio']}   AND
                      ip.nivelplanif = 1 AND
                      ip.idaprobacion = 4 AND
                      p.idaprobaciondemanda = 4  AND 
                      mod.tipoplan =0 
                      $filtros
                      $addwhere";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Grafica ejecucion global x entidad (Ingreso/Gasto)
    public function graficaEjecucionglobalxentidadIngresoGasto($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "
                WITH consulta AS (
                SELECT CASE
                         WHEN mod.tipoplan=0  THEN (p.precio*SUM((COALESCE (ce.cantidadreal,0)))) +
                                 (((p.precio*SUM((COALESCE (ce.cantidadreal,0))))*ip.flete)/100) + (((p.precio*
                                 SUM((COALESCE (ce.cantidadreal,0))))*ip.contingencia)/100)
                         ELSE 0
                       END as gastos,
                       CASE
                         WHEN mod.tipoplan=1  THEN (p.precio*SUM((COALESCE (ce.cantidadreal,0)))) 
                         ELSE 0
                       END as ingreso
                FROM mod_planificacion.dat_planificacion p
                     INNER JOIN mod_planificacion.dat_entidadmodelo em ON em.identidadmodelo =
                      p.identidadmodelo
                      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo= mod.idmodelo
                                INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
                        INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
                LEFT JOIN mod_planificacion.dat_controlejecucionplan ce ON p.idplanificacion=ce.idplanificacion
                $innerJoinFiltros
                WHERE  em.identidad IN($entidades)AND
                  p.idejercicio={$parametros['idejercicio']}   AND
                  ip.nivelplanif = 1 AND
                  ip.idaprobacion = 4 AND
                  p.idaprobaciondemanda = 4
                  $filtros
                  $addwhere

                GROUP BY p.precio,mod.tipoplan,
                ip.flete,
                ip.contingencia)

                SELECT round(sum(c.gastos),3) as gastos,
                       round(sum(c.ingreso),3) as ingreso,
                       round((sum(c.ingreso)-sum(c.gastos)),3) as diferencia
                from consulta c";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    //Datos para graficar el tab CEPlan - global * entidad * plan
    public function graficaEjecucionglobalxentidadxClasifplan($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $select = "(ip.precio*SUM((d.cantidadreal))) +
                        (((ip.precio*SUM((d.cantidadreal)))*ip.flete)/100) + (((ip.precio*
                        SUM((d.cantidadreal)))*ip.contingencia)/100)";
            $selectAdentro = "round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                                        (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                                        SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100), 3) as importeplan,

                              round(COALESCE((SUM(p.precio*(ce.cantidadreal))) +
                                        (((SUM(p.precio*(ce.cantidadreal)*ip.flete)))/100) + (((
                                        SUM(p.precio*(ce.cantidadreal)*ip.contingencia)))/100),0),3) as
                               importeejecutado,
                               round((((SUM(p.precio*(ce.cantidadreal))) +
                                        (((SUM(p.precio*(ce.cantidadreal)*ip.flete)))/100) + (((
                                        SUM(p.precio*(ce.cantidadreal)*ip.contingencia)))/100)) + COALESCE(
                              sum(d.sustituciones), 0) + COALESCE(sum(a.adiciones), 0)),3) as
                               importetotalejecutado";
        } else {
            $select = "(ip.precio*SUM((d.cantidadreal)))";
            $selectAdentro = "round((SUM(p.precio*(p.cantidad+p.ajuste))) , 3) as importeplan,
                          round(COALESCE((SUM(p.precio*(ce.cantidadreal))) ,0),3) as  importeejecutado,
                          round(((SUM(p.precio*(ce.cantidadreal)))  + COALESCE(
                            sum(d.sustituciones), 0) + COALESCE(sum(a.adiciones), 0)),3) as
                         importetotalejecutado";
        }
        //fin del select
        $conn = Doctrine_Manager::connection();
        $sql = "WITH desviacionsust AS (
                                    SELECT $select as sustituciones,
                                           d.identidadmodelo
                                    FROM mod_planificacion.dat_desviacionplan d
                                         INNER JOIN mod_planificacion.dat_desviacionplanxsustitucion s ON
                                          d.iddesviacionplan = s.iddesviacionplan
                                         INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
                                          ind.idindicador
                                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                                          ind.idindicador
                                         INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
                                          em.identidadmodelo
                                         INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                                         $innerJoinFiltros
                                    where ip.nivelplanif = 1 AND
                                          ip.idaprobacion = 4 AND
                                          d.idejercicio = {$parametros['idejercicio']} AND
                                          mod.tipoplan={$parametros['uri']}
                                           $filtros
                                          $addwhere
                                    GROUP BY d.identidadmodelo, ip.precio,ip.contingencia,ip.flete),
                                      desviacionadicion AS (
                                      SELECT $select  as adiciones,
                                             d.identidadmodelo
                                      FROM mod_planificacion.dat_desviacionplan d
                                           LEFT JOIN mod_planificacion.dat_desviacionplanxsustitucion s ON
                                            d.iddesviacionplan = s.iddesviacionplan
                                           INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
                                            ind.idindicador
                                           INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                                            ind.idindicador
                                           INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
                                            em.identidadmodelo
                                           INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo   
                                           $innerJoinFiltros
                                      where s.iddesviacionplan is null AND
                                            ip.nivelplanif = 1 AND
                                            ip.idaprobacion = 4 AND
                                            d.idejercicio = {$parametros['idejercicio']} AND
                                             mod.tipoplan={$parametros['uri']} 
                                             $filtros
                                            $addwhere
                                      GROUP BY d.identidadmodelo, ip.precio,ip.contingencia,ip.flete)
                                      SELECT mod.denominacion as plan, 
                                      round(COALESCE(sum(d.sustituciones), 0),3) as importesustitucion,
                                      round(COALESCE(sum(a.adiciones), 0),3) as importeadicion,
                                           $selectAdentro
                                    FROM mod_planificacion.dat_planificacion p
                                         INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
                                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
                                         INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
                                          em.identidadmodelo
                                         INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                                         LEFT JOIN mod_planificacion.dat_controlejecucionplan ce ON
                                          p.idplanificacion = ce.idplanificacion
                                         LEFT JOIN desviacionsust d ON (em.identidadmodelo = d.identidadmodelo)
                                         LEFT JOIN desviacionadicion a ON (em.identidadmodelo = a.identidadmodelo)
                                         $innerJoinFiltros
                                    where em.identidad IN ($entidades) AND
                                          p.idejercicio = {$parametros['idejercicio']} AND
                                          ip.nivelplanif = 1 AND
                                          ip.idaprobacion = 4 AND
                                          p.idaprobaciondemanda = 4 AND
                                           mod.tipoplan={$parametros['uri']}
                                            $filtros
                                          $addwhere
                                    GROUP BY mod.denominacion 
                                    ORDER BY importetotalejecutado {$parametros['orden']}
                                        OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadxClasifplanTotal($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  count( DISTINCT mod.idmodelo)
                    FROM mod_planificacion.dat_planificacion p
                          INNER JOIN mod_datosmaestros.nom_indicador ind 
                          ON p.idindicador = ind.idindicador
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                          ON ip.idindicador = ind.idindicador
                          INNER JOIN mod_planificacion.dat_entidadmodelo em 
                          ON p.identidadmodelo = em.identidadmodelo
                          INNER JOIN mod_planificacion.dat_modelo mod 
                          ON em.idmodelo = mod.idmodelo
                          LEFT JOIN mod_planificacion.dat_controlejecucionplan ce 
                          ON p.idplanificacion = ce.idplanificacion
                          $innerJoinFiltros
                    where em.identidad IN($entidades) AND
                           p.idejercicio = {$parametros['idejercicio']} AND
                           ip.nivelplanif = 1 AND
                           ip.idaprobacion = 4 AND
                           p.idaprobaciondemanda = 4 AND
                           mod.tipoplan={$parametros['uri']}
                           $filtros
                           $addwhere";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Datos para graficar el tab CEPlan - trimestre
    public function graficaEjecucionglobalxentidadejecutadoxtrimestre($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $varconst = "(p.precio*SUM(COALESCE(ce.cantidadreal, 0))) +
                            (((p.precio*SUM(COALESCE(ce.cantidadreal, 0)))*ip.flete)/100) + (((p.precio*
                            SUM(COALESCE(ce.cantidadreal, 0)))*ip.contingencia)/100)";
        } else
            $varconst = "(p.precio*SUM(COALESCE(ce.cantidadreal, 0)))";
        //fin del select

        $conn = Doctrine_Manager::connection();
        $sql = "--ejecutado por trimestre
                    WITH
                    ejecutado AS (
                    SELECT
                            CASE
                             WHEN EXTRACT (QUARTER FROM ce.fechareal) =1 THEN $varconst
                             ELSE 0
                           END as ejecutadotrimestre1,
                                   CASE
                             WHEN EXTRACT (QUARTER FROM ce.fechareal) =2 THEN $varconst
                             ELSE 0
                           END as ejecutadotrimestre2,
                                   CASE
                             WHEN EXTRACT (QUARTER FROM ce.fechareal) =3 THEN $varconst
                             ELSE 0
                           END as ejecutadotrimestre3,
                                   CASE
                             WHEN EXTRACT (QUARTER FROM ce.fechareal) =4 THEN $varconst
                             ELSE 0
                           END as ejecutadotrimestre4

                    FROM mod_planificacion.dat_planificacion p
                         INNER JOIN mod_datosmaestros.nom_indicador ind 
                         ON p.idindicador = ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                         ON ip.idindicador = ind.idindicador
                         INNER JOIN mod_planificacion.dat_entidadmodelo em 
                         ON p.identidadmodelo = em.identidadmodelo
                         LEFT JOIN mod_planificacion.dat_controlejecucionplan ce
                         ON p.idplanificacion = ce.idplanificacion
                         INNER JOIN mod_planificacion.dat_modelo mod 
                         ON em.idmodelo = mod.idmodelo
                        $innerJoinFiltros
                    where em.identidad IN ($entidades) AND
                          p.idejercicio = {$parametros['idejercicio']} AND
                          ip.nivelplanif = 1 AND
                          ip.idaprobacion = 4 AND
                          p.idaprobaciondemanda = 4
                          $filtros
                          $addwhere AND
                          mod.tipoplan={$parametros['uri']}
                          {$parametros['addcondicion']}
                    GROUP BY ce.fechareal,p.precio,
                    ip.flete,
                    ip.contingencia
                    )
                    SELECT round(sum(e.ejecutadotrimestre1),3) as ejecutadotrimestre1,
                    round(sum(e.ejecutadotrimestre2),3) as ejecutadotrimestre2,
                    round(sum(e.ejecutadotrimestre3),3) as ejecutadotrimestre3,
                    round(sum(e.ejecutadotrimestre4),3) as ejecutadotrimestre4
                    FROM ejecutado e ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadadicionadoxtrimestre($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                            (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                            SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100)";
        } else
            $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0)))";
        //fin del select

        $conn = Doctrine_Manager::connection();

        $sql = "--adiciones por trimestre
                        WITH
                        adiciones AS (
                        SELECT

                                         CASE
                                 WHEN EXTRACT (QUARTER FROM d.fechareal) =1 THEN $varconst
                                 ELSE 0
                               END as adiciontrimestre1,
                                       CASE
                                 WHEN EXTRACT (QUARTER FROM d.fechareal) =2 THEN $varconst
                                 ELSE 0
                               END as adiciontrimestre2,
                                       CASE
                                 WHEN EXTRACT (QUARTER FROM d.fechareal) =3 THEN $varconst
                                 ELSE 0
                               END as adiciontrimestre3,
                                       CASE
                                 WHEN EXTRACT (QUARTER FROM d.fechareal) =4 THEN $varconst
                                 ELSE 0
                               END as adiciontrimestre4

                          FROM mod_planificacion.dat_desviacionplan d
                               LEFT JOIN mod_planificacion.dat_desviacionplanxsustitucion s 
                               ON d.iddesviacionplan = s.iddesviacionplan
                               INNER JOIN mod_planificacion.dat_entidadmodelo em 
                               ON d.identidadmodelo = em.identidadmodelo
                               INNER JOIN mod_datosmaestros.nom_indicador ind 
                               ON d.idindicador = ind.idindicador
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                               ON ip.idindicador = ind.idindicador
                               INNER JOIN mod_planificacion.dat_modelo mod 
                               ON em.idmodelo = mod.idmodelo
                               $innerJoinFiltros
                          where s.iddesviacionplan is null AND
                                em.identidad IN ($entidades) AND
                                ip.nivelplanif = 1 AND
                                ip.idaprobacion = 4 AND
                                d.idejercicio = {$parametros['idejercicio']} AND
                                mod.tipoplan={$parametros['uri']}
                                $filtros
                                $addwhere
                                {$parametros['addcondicion']}
                          GROUP BY d.fechareal, ip.precio,
                        ip.flete,
                        ip.contingencia)

                        SELECT round(sum(e.adiciontrimestre1),3) as adiciontrimestre1,
                        round(sum(e.adiciontrimestre2),3) as adiciontrimestre2,
                        round(sum(e.adiciontrimestre3),3) as adiciontrimestre3,
                        round(sum(e.adiciontrimestre4),3) as adiciontrimestre4
                        FROM adiciones e ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadplanificadoxtrimestre($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $varconst = "round((p.precio*SUM((pf.cantidad))) + 
                        (((p.precio*SUM((pf.cantidad)))*ip.flete)/100) + (((p.precio* 
                        SUM((pf.cantidad)))*ip.contingencia)/100),3)";
        } else
            $varconst = "round((p.precio*SUM((pf.cantidad))) ,3)";
        //fin del select

        $conn = Doctrine_Manager::connection();
        $sql = "WITH 
                        ejecutado AS ( 
                        SELECT  
                                CASE 
                                 WHEN EXTRACT (QUARTER FROM pf.fechafin) =1 THEN   $varconst
                                 ELSE 0 
                               END as plantrimestre1, 
                                       CASE 
                                 WHEN EXTRACT (QUARTER FROM pf.fechafin) =2 THEN $varconst
                                 ELSE 0 
                               END as plantrimestre2, 
                                       CASE 
                                 WHEN EXTRACT (QUARTER FROM pf.fechafin) =3 THEN $varconst  
                                 ELSE 0 
                               END as plantrimestre3, 
                                       CASE 
                                 WHEN EXTRACT (QUARTER FROM pf.fechafin) =4 THEN $varconst 
                                 ELSE 0 
                               END as plantrimestre4 

                        FROM mod_planificacion.dat_planificacion p 
                             INNER JOIN mod_planificacion.dat_planificacionporfecha pf 
                             ON p.idplanificacion=pf.idplanificacion 
                             INNER JOIN mod_datosmaestros.nom_indicador ind 
                             ON p.idindicador = ind.idindicador 
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                             ON ip.idindicador =  ind.idindicador 
                             INNER JOIN mod_planificacion.dat_entidadmodelo em 
                             ON p.identidadmodelo = em.identidadmodelo 
                             LEFT JOIN mod_planificacion.dat_controlejecucionplan ce 
                             ON p.idplanificacion = ce.idplanificacion 
                            INNER JOIN mod_planificacion.dat_modelo mod 
                            ON em.idmodelo = mod.idmodelo 
                            $innerJoinFiltros
                        where em.identidad IN ($entidades) AND 
                              p.idejercicio = {$parametros['idejercicio']} AND 
                              ip.nivelplanif = 1 AND 
                              ip.idaprobacion = 4 AND 
                              p.idaprobaciondemanda = 4 
                              AND mod.tipoplan={$parametros['uri']}
                              $filtros
                              $addwhere
                              {$parametros['addcondicion']}

                        GROUP BY pf.fechafin,p.precio, 
                        ip.flete, 
                        ip.contingencia 
                        ) 

                        SELECT round(sum(e.plantrimestre1),3) as plantrimestre1, 
                        round(sum(e.plantrimestre2),3) as plantrimestre2, 
                        round(sum(e.plantrimestre3),3) as plantrimestre3, 
                        round(sum(e.plantrimestre4),3) as plantrimestre4 
                        FROM ejecutado e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadsustituirxtrimestre($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                            (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                            SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100)";
        } else
            $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0)))";
        //fin del select

        $conn = Doctrine_Manager::connection();
        $sql = "--adiciones por trimestre
                    WITH
                    sustituciones AS (
                    SELECT CASE
                             WHEN EXTRACT(QUARTER
                    FROM d.fechareal) = 1 THEN $varconst
                             ELSE 0
                           END as sustituciontrimestre1,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM d.fechareal) = 2 THEN $varconst
                           ELSE 0
                         END as sustituciontrimestre2,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM d.fechareal) = 3 THEN $varconst
                           ELSE 0
                         END as sustituciontrimestre3,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM d.fechareal) = 4 THEN $varconst
                           ELSE 0
                         END as sustituciontrimestre4
                    FROM mod_planificacion.dat_desviacionplan d
                         INNER JOIN mod_planificacion.dat_desviacionplanxsustitucion s 
                         ON d.iddesviacionplan = s.iddesviacionplan
                         INNER JOIN mod_planificacion.dat_entidadmodelo em 
                         ON d.identidadmodelo = em.identidadmodelo
                         INNER JOIN mod_datosmaestros.nom_indicador ind 
                         ON d.idindicador = ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                         ON ip.idindicador = ind.idindicador
                         INNER JOIN mod_planificacion.dat_modelo mod 
                         ON em.idmodelo = mod.idmodelo
                         $innerJoinFiltros
                    where em.identidad IN ($entidades) AND
                          ip.nivelplanif = 1 AND
                          ip.idaprobacion = 4 AND
                          d.idejercicio = {$parametros['idejercicio']} AND
                          mod.tipoplan={$parametros['uri']}
                          $addwhere
                          $filtros
                          {$parametros['addcondicion']}
                    GROUP BY d.fechareal,ip.precio,
                    ip.flete,
                    ip.contingencia)

                    SELECT round(sum(e.sustituciontrimestre1),3) as sustituciontrimestre1,
                           round(sum(e.sustituciontrimestre2),3) as sustituciontrimestre2,
                           round(sum(e.sustituciontrimestre3),3) as sustituciontrimestre3,
                           round(sum(e.sustituciontrimestre4),3) as sustituciontrimestre4
                    FROM sustituciones e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab CEPlan - mes
    public function graficaEjecucionglobalxentidadejecutadoxmeses($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $varconst = "(p.precio*SUM(COALESCE(ce.cantidadreal, 0))) +
                            (((p.precio*SUM(COALESCE(ce.cantidadreal, 0)))*ip.flete)/100) + (((p.precio*
                            SUM(COALESCE(ce.cantidadreal, 0)))*ip.contingencia)/100)";
        } else
            $varconst = "(p.precio*SUM(COALESCE(ce.cantidadreal, 0)))";
        //fin del select

        $conn = Doctrine_Manager::connection();
        $sql = "--ejecutado por meses
                    WITH
                    ejecutado AS (
                    SELECT CASE
                             WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 1 THEN $varconst
                             ELSE 0
                           END as ejecutadoenero,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 2 THEN $varconst
                           ELSE 0
                         END as ejecutadofebrero,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 3 THEN $varconst
                           ELSE 0
                         END as ejecutadomarzo,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 4 THEN $varconst
                           ELSE 0
                         END as ejecutadoabril,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 5 THEN $varconst
                           ELSE 0
                         END as ejecutadomayo,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 6 THEN $varconst
                           ELSE 0
                         END as ejecutadojunio,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 7 THEN $varconst
                           ELSE 0
                         END as ejecutadojulio,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 8 THEN $varconst
                           ELSE 0
                         END as ejecutadoagosto,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 9 THEN $varconst
                           ELSE 0
                         END as ejecutadoseptiembre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 10 THEN $varconst
                           ELSE 0
                         END as ejecutadooctubre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 11 THEN $varconst
                           ELSE 0
                         END as ejecutadonoviembre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 12 THEN $varconst
                           ELSE 0
                         END as ejecutadodiciembre
                    FROM mod_planificacion.dat_planificacion p
                         INNER JOIN mod_datosmaestros.nom_indicador ind 
                         ON p.idindicador = ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                         ON ip.idindicador = ind.idindicador
                         INNER JOIN mod_planificacion.dat_entidadmodelo em 
                         ON p.identidadmodelo = em.identidadmodelo
                         LEFT JOIN mod_planificacion.dat_controlejecucionplan ce 
                         ON p.idplanificacion = ce.idplanificacion
                         INNER JOIN mod_planificacion.dat_modelo mod 
                         ON em.idmodelo = mod.idmodelo
                         $innerJoinFiltros
                    where em.identidad IN ($entidades) AND
                          p.idejercicio = {$parametros['idejercicio']} AND
                          ip.nivelplanif = 1 AND
                          ip.idaprobacion = 4 AND
                          p.idaprobaciondemanda = 4 AND
                          mod.tipoplan={$parametros['uri']}
                          $filtros
                          $addwhere
                    GROUP BY ce.fechareal,p.precio,
                    ip.flete,
                    ip.contingencia)

                    SELECT round(sum(e.ejecutadoenero), 3) as ejecutadoenero,
                           round(sum(e.ejecutadofebrero), 3) as ejecutadofebrero,
                           round(sum(e.ejecutadomarzo) , 3) as ejecutadomarzo,
                           round(sum(e.ejecutadoabril) , 3) as ejecutadoabril,
                           round(sum(e.ejecutadomayo) , 3) as ejecutadomayo,
                           round(sum(e.ejecutadojunio) , 3) as ejecutadojunio,
                           round(sum(e.ejecutadojulio) , 3) as ejecutadojulio,
                           round(sum(e.ejecutadoagosto) , 3) as ejecutadoagosto,
                           round(sum(e.ejecutadoseptiembre) , 3) as ejecutadoseptiembre,
                           round(sum(e.ejecutadooctubre) , 3) as ejecutadooctubre,
                           round(sum(e.ejecutadonoviembre) , 3) as ejecutadonoviembre,
                           round(sum(e.ejecutadodiciembre), 3) as ejecutadodiciembre
                    FROM ejecutado e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadadicionadoxmeses($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                            (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                            SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100)";
        } else
            $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0)))";
        //fin del select

        $conn = Doctrine_Manager::connection();
        $sql = "--adiciones por meses
                        WITH
                        adiciones AS (
                        SELECT CASE
                                 WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 1 THEN $varconst
                                 ELSE 0
                               END as adicionenero,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 2 THEN $varconst
                               ELSE 0
                             END as adicionfebrero,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 3 THEN $varconst
                               ELSE 0
                             END as adicionmarzo,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 4 THEN $varconst
                               ELSE 0
                             END as adicionabril,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 5 THEN $varconst
                               ELSE 0
                             END as adicionmayo,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 6 THEN $varconst
                               ELSE 0
                             END as adicionjunio,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 7 THEN $varconst
                               ELSE 0
                             END as adicionjulio,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 8 THEN $varconst
                               ELSE 0
                             END as adicionagosto,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 9 THEN $varconst
                               ELSE 0
                             END as adicionseptiembre,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 10 THEN $varconst
                               ELSE 0
                             END as adicionoctubre,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 11 THEN $varconst
                               ELSE 0
                             END as adicionnoviembre,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM d.fechareal) = 12 THEN $varconst
                               ELSE 0
                             END as adiciondiciembre
                        FROM mod_planificacion.dat_desviacionplan d
                             LEFT JOIN mod_planificacion.dat_desviacionplanxsustitucion s 
                             ON d.iddesviacionplan = s.iddesviacionplan
                             INNER JOIN mod_planificacion.dat_entidadmodelo em 
                             ON d.identidadmodelo = em.identidadmodelo
                             INNER JOIN mod_datosmaestros.nom_indicador ind 
                             ON d.idindicador = ind.idindicador
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                             ON ip.idindicador = ind.idindicador
                             INNER JOIN mod_planificacion.dat_modelo mod 
                             ON em.idmodelo = mod.idmodelo
                             $innerJoinFiltros
                        where s.iddesviacionplan is null AND
                              em.identidad IN ($entidades) AND
                              ip.nivelplanif = 1 AND
                              ip.idaprobacion = 4 AND
                              d.idejercicio = {$parametros['idejercicio']}
                              AND  mod.tipoplan={$parametros['uri']}
                              $filtros
                              $addwhere
                        GROUP BY d.fechareal, ip.precio,
                        ip.flete,
                        ip.contingencia)

                        SELECT round(sum(e.adicionenero),3) as adicionenero,
                               round(sum(e.adicionfebrero),3) as adicionfebrero,
                               round(sum(e.adicionmarzo) ,3) as adicionmarzo,
                               round(sum(e.adicionabril),3) as adicionabril,
                               round(sum(e.adicionmayo),3) as adicionmayo,
                               round(sum(e.adicionjunio),3) as adicionjunio,
                               round(sum(e.adicionjulio),3) as adicionjulio,
                               round(sum(e.adicionagosto),3) as adicionagosto,
                               round(sum(e.adicionseptiembre),3) as adicionseptiembre,
                               round(sum(e.adicionoctubre),3) as adicionoctubre,
                               round(sum(e.adicionnoviembre),3) as adicionnoviembre,
                               round(sum(e.adiciondiciembre),3) as adiciondiciembre
                        FROM adiciones e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadsustituirxmeses($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                            (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                            SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100)";
        } else
            $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0)))";
        //fin del select

        $conn = Doctrine_Manager::connection();
        $sql = "--sustituciones por meses
                    WITH
                    sustituciones AS (
                    SELECT CASE
                             WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 1 THEN $varconst
                             ELSE 0
                           END as sustitucionenero,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 2 THEN $varconst
                           ELSE 0
                         END as sustitucionfebrero,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 3 THEN $varconst
                           ELSE 0
                         END as sustitucionmarzo,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 4 THEN $varconst
                           ELSE 0
                         END as sustitucionabril,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 5 THEN $varconst
                           ELSE 0
                         END as sustitucionmayo,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 6 THEN $varconst
                           ELSE 0
                         END as sustitucionjunio,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 7 THEN $varconst
                           ELSE 0
                         END as sustitucionjulio,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 8 THEN $varconst
                           ELSE 0
                         END as sustitucionagosto,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 9 THEN $varconst
                           ELSE 0
                         END as sustitucionseptiembre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 10 THEN $varconst
                           ELSE 0
                         END as sustitucionoctubre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 11 THEN $varconst
                           ELSE 0
                         END as sustitucionnoviembre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM d.fechareal) = 12 THEN $varconst
                           ELSE 0
                         END as sustituciondiciembre
                    FROM mod_planificacion.dat_desviacionplan d
                         INNER JOIN mod_planificacion.dat_desviacionplanxsustitucion s ON
                          d.iddesviacionplan = s.iddesviacionplan
                         INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
                          em.identidadmodelo
                         INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
                          ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                          ind.idindicador
                          INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                          $innerJoinFiltros
                    where em.identidad IN ($entidades) AND
                          ip.nivelplanif = 1 AND
                          ip.idaprobacion = 4 AND
                          d.idejercicio = {$parametros['idejercicio']} AND
                           mod.tipoplan={$parametros['uri']}
                           $filtros
                          $addwhere
                    GROUP BY d.fechareal, ip.precio,
                    ip.flete,
                    ip.contingencia)

                    SELECT round(sum(e.sustitucionenero),3) as sustitucionenero,
                           round(sum(e.sustitucionfebrero),3) as sustitucionfebrero,
                           round(sum(e.sustitucionmarzo),3) as sustitucionmarzo,
                           round(sum(e.sustitucionabril),3) as sustitucionabril,
                           round(sum(e.sustitucionmayo),3) as sustitucionmayo,
                           round(sum(e.sustitucionjunio),3) as sustitucionjunio,
                           round(sum(e.sustitucionjulio),3) as sustitucionjulio,
                           round(sum(e.sustitucionagosto),3) as sustitucionagosto,
                           round(sum(e.sustitucionseptiembre),3) as sustitucionseptiembre,
                           round(sum(e.sustitucionoctubre),3) as sustitucionoctubre,
                           round(sum(e.sustitucionnoviembre),3) as sustitucionnoviembre,
                           round(sum(e.sustituciondiciembre),3) as sustituciondiciembre
                    FROM sustituciones e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadplanxmeses($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $varconst = "round((p.precio*SUM((pf.cantidad))) + 
                            (((p.precio*SUM((pf.cantidad)))*ip.flete)/100) + (((p.precio* 
                            SUM((pf.cantidad)))*ip.contingencia)/100),3)";
        } else
            $varconst = "round((p.precio*SUM((pf.cantidad))),3)";
        //fin del select
        $conn = Doctrine_Manager::connection();
        $sql = "--plan por meses 
                WITH 
                plan AS ( 
                SELECT CASE 
                         WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 1 THEN $varconst  
                         ELSE 0 
                       END as planenero, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 2 THEN $varconst
                       ELSE 0 
                     END as planfebrero, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 3 THEN $varconst 
                       ELSE 0 
                     END as planmarzo, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 4 THEN $varconst 
                       ELSE 0 
                     END as planabril, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 5 THEN $varconst  
                       ELSE 0 
                     END as planmayo, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 6 THEN $varconst  
                       ELSE 0 
                     END as planjunio, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 7 THEN $varconst 
                       ELSE 0 
                     END as planjulio, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 8 THEN $varconst  
                       ELSE 0 
                     END as planagosto, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 9 THEN $varconst
                       ELSE 0 
                     END as planseptiembre, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 10 THEN $varconst
                       ELSE 0 
                     END as planoctubre, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 11 THEN $varconst 
                       ELSE 0 
                     END as plannoviembre, 
                     CASE 
                       WHEN EXTRACT(MONTH 
                FROM pf.fechafin) = 12 THEN $varconst  
                       ELSE 0 
                     END as plandiciembre 
                FROM mod_planificacion.dat_planificacion p 
                     INNER JOIN mod_planificacion.dat_planificacionporfecha pf 
                     ON p.idplanificacion=pf.idplanificacion 
                     INNER JOIN mod_datosmaestros.nom_indicador ind 
                     ON p.idindicador = ind.idindicador 
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                     ON ip.idindicador =  ind.idindicador 
                     INNER JOIN mod_planificacion.dat_entidadmodelo em 
                     ON p.identidadmodelo = em.identidadmodelo      
                     INNER JOIN mod_planificacion.dat_modelo mod 
                     ON em.idmodelo = mod.idmodelo 
                     $innerJoinFiltros
                where em.identidad IN ($entidades) AND 
                      p.idejercicio = {$parametros['idejercicio']} AND 
                      ip.nivelplanif = 1 AND 
                      ip.idaprobacion = 4 AND 
                      p.idaprobaciondemanda = 4 AND 
                      mod.tipoplan={$parametros['uri']}
                      $filtros
                      $addwhere
                GROUP BY pf.fechafin,p.precio, 
                ip.flete, 
                ip.contingencia) 

                SELECT round(sum(e.planenero), 3) as planenero, 
                       round(sum(e.planfebrero), 3) as planfebrero, 
                       round(sum(e.planmarzo) , 3) as planmarzo, 
                       round(sum(e.planabril) , 3) as planabril, 
                       round(sum(e.planmayo) , 3) as planmayo, 
                       round(sum(e.planjunio) , 3) as planjunio, 
                       round(sum(e.planjulio) , 3) as planjulio, 
                       round(sum(e.planagosto) , 3) as planagosto, 
                       round(sum(e.planseptiembre) , 3) as planseptiembre, 
                       round(sum(e.planoctubre) , 3) as planoctubre, 
                       round(sum(e.plannoviembre) , 3) as plannoviembre, 
                       round(sum(e.plandiciembre), 3) as plandiciembre 
                FROM plan e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab CEPlan - mas valiosos
    public function graficaEjecucionMasValiosos($parametros) {

        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $select = "round((SUM(p.precio*(p.cantidad+p.ajuste))) +
                       (((SUM(p.precio*(p.cantidad+p.ajuste)*ip.flete)))/100) + (((
                       SUM(p.precio*(p.cantidad+p.ajuste)*ip.contingencia)))/100),3) as importeplan,

                        round((SUM(p.precio*COALESCE(ce.cantidadreal, 0))) +
                        (((SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.flete)))/100) + (((
                        SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.contingencia)))/100),3) as importeejecutado";
        } else
            $select = "round((SUM(p.precio*(p.cantidad+p.ajuste))),3) as importeplan,
                       round((SUM(p.precio*COALESCE(ce.cantidadreal, 0))) ,3) as importeejecutado";
        //fin del select

        $conn = Doctrine_Manager::connection();
        $sql = "WITH consulta AS
                    (SELECT ind.idindicador,
                            ind.denominacion,
                             $select
                     FROM mod_planificacion.dat_planificacion p
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
                           ind.idindicador
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                           ind.idindicador
                          INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
                           em.identidadmodelo
                          LEFT JOIN mod_planificacion.dat_controlejecucionplan ce ON
                           p.idplanificacion = ce.idplanificacion
                           INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                           $innerJoinFiltros
                     where em.identidad IN ($entidades) AND
                           p.idejercicio = {$parametros['idejercicio']} AND
                           ip.nivelplanif = 1 AND
                           ip.idaprobacion = 4 AND
                           p.idaprobaciondemanda = 4
                           AND mod.tipoplan = {$parametros['uri']}
                           $filtros
                           $addwhere
                     GROUP BY ind.idindicador,
                              ind.denominacion)

                    SELECT c.idindicador,
                           c.denominacion,
                           c.importeplan,
                           c.importeejecutado
                    from consulta c
                    ORDER BY c.importeejecutado, c.importeplan {$parametros['orden']}
                    OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionMasValiososTotal($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count(DISTINCT ind.idindicador)
                    FROM mod_planificacion.dat_planificacion p
                         INNER JOIN mod_datosmaestros.nom_indicador ind 
                         ON p.idindicador = ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                         ON ip.idindicador =  ind.idindicador
                         INNER JOIN mod_planificacion.dat_entidadmodelo em 
                         ON p.identidadmodelo = em.identidadmodelo
                         LEFT JOIN mod_planificacion.dat_controlejecucionplan ce 
                         ON p.idplanificacion = ce.idplanificacion
                         INNER JOIN mod_planificacion.dat_modelo mod 
                         ON em.idmodelo = mod.idmodelo
                         $innerJoinFiltros
                  where   em.identidad IN($entidades) AND
                          p.idejercicio = {$parametros['idejercicio']} AND
                          ip.nivelplanif = 1 AND
                          ip.idaprobacion = 4 AND
                          p.idaprobaciondemanda = 4
                          AND mod.tipoplan = {$parametros['uri']}
                          $filtros
                          $addwhere";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Datos para graficar el tab CEPlan - mas valiosos fuera de plan
    public function graficaIndicadoresFueraPlanMasValiosos($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        //select segun gasto/ingreso
        if ($parametros['uri'] == 0) {
            $select = "round((ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                        (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                        SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100), 3) as adiciones";
        } else
            $select = "round((ip.precio*SUM(COALESCE(d.cantidadreal, 0))), 3) as adiciones";

        $conn = Doctrine_Manager::connection();
        $sql = "  SELECT ind.idindicador,
                    ind.denominacion,
                    $select
                  FROM mod_planificacion.dat_desviacionplan d
                       LEFT JOIN mod_planificacion.dat_desviacionplanxsustitucion s 
                       ON d.iddesviacionplan = s.iddesviacionplan
                       INNER JOIN mod_datosmaestros.nom_indicador ind 
                       ON d.idindicador = ind.idindicador
                       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                       ON ip.idindicador = ind.idindicador
                       INNER JOIN mod_planificacion.dat_entidadmodelo em 
                       ON d.identidadmodelo = em.identidadmodelo
                       INNER JOIN mod_planificacion.dat_modelo mod 
                       ON em.idmodelo = mod.idmodelo
                       $innerJoinFiltros
                   where s.iddesviacionplan is null AND
                         ip.nivelplanif = 1 AND
                         ip.idaprobacion = 4 AND
                         d.idejercicio = {$parametros['idejercicio']} AND
                         em.identidad IN ($entidades)
                         AND mod.tipoplan = {$parametros['uri']}
                         $filtros
                         $addwhere
                   GROUP BY ind.idindicador, 
                            ip.precio,
                            ip.flete,
                            ip.contingencia
                   ORDER BY adiciones {$parametros['orden']}
                   OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaIndicadoresFueraPlanMasValiososTotal($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count(ind.idindicador)
                    FROM mod_planificacion.dat_desviacionplan d
                         LEFT JOIN mod_planificacion.dat_desviacionplanxsustitucion s 
                         ON d.iddesviacionplan = s.iddesviacionplan
                         INNER JOIN mod_datosmaestros.nom_indicador ind 
                         ON d.idindicador = ind.idindicador
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                         ON ip.idindicador = ind.idindicador
                         INNER JOIN mod_planificacion.dat_entidadmodelo em 
                         ON d.identidadmodelo =  em.identidadmodelo
                         INNER JOIN mod_planificacion.dat_modelo mod 
                         ON em.idmodelo = mod.idmodelo
                         $innerJoinFiltros
                    where s.iddesviacionplan is null AND
                          ip.nivelplanif = 1 AND
                          ip.idaprobacion = 4 AND
                          d.idejercicio = {$parametros['idejercicio']} AND
                          em.identidad IN($entidades) AND 
                          mod.tipoplan = {$parametros['uri']}
                          $filtros
                          $addwhere";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Datos para graficar el tab CEPlan - mas y menos ejecutados
    public function graficaIndicadoresMasEjecutados($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = " --los indicadores mas ejecutados (por cantidad)
                WITH consulta AS
                (SELECT ind.idindicador,
                        ind.denominacion,
                        round(sum((cantidad + ajuste)),6) as plan,
                        round(COALESCE(sum(ce.cantidadreal), 0),6) as  ejecutado
                 FROM mod_planificacion.dat_planificacion p
                        INNER JOIN mod_datosmaestros.nom_indicador ind 
                        ON p.idindicador = ind.idindicador
                        INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                        ON ip.idindicador = ind.idindicador
                        INNER JOIN mod_planificacion.dat_entidadmodelo em 
                        ON p.identidadmodelo = em.identidadmodelo
                        LEFT JOIN mod_planificacion.dat_controlejecucionplan ce 
                        ON p.idplanificacion = ce.idplanificacion
                        INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                        $innerJoinFiltros
                 where em.identidad IN ($entidades) AND
                       p.idejercicio = {$parametros['idejercicio']} AND
                       ip.nivelplanif = 1 AND
                       ip.idaprobacion = 4 AND
                       p.idaprobaciondemanda = 4
                       AND mod.tipoplan = {$parametros['uri']}
                       $filtros
                       $addwhere
                 GROUP BY ind.idindicador,
                          ind.denominacion)

                SELECT c.idindicador,
                       c.denominacion,
                       c.plan,
                       c.ejecutado
                from consulta c
                ORDER BY c.ejecutado {$parametros['orden']}
                OFFSET {$parametros['start']} LIMIT {$parametros['limit']} ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaIndicadoresMasEjecutadosTotal($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  count(DISTINCT ind.idindicador)
                FROM mod_planificacion.dat_planificacion p
                    INNER JOIN mod_datosmaestros.nom_indicador ind 
                    ON p.idindicador = ind.idindicador
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif ip 
                    ON ip.idindicador = ind.idindicador
                    INNER JOIN mod_planificacion.dat_entidadmodelo em 
                    ON p.identidadmodelo = em.identidadmodelo
                    LEFT JOIN mod_planificacion.dat_controlejecucionplan ce 
                    ON p.idplanificacion = ce.idplanificacion
                    INNER JOIN mod_planificacion.dat_modelo mod 
                    ON em.idmodelo = mod.idmodelo
                    $innerJoinFiltros
                where em.identidad IN($entidades) AND
                    p.idejercicio = {$parametros['idejercicio']} AND
                    ip.nivelplanif = 1 AND
                    ip.idaprobacion = 4 AND
                    p.idaprobaciondemanda = 4
                    AND mod.tipoplan = {$parametros['uri']}        
                    $filtros
                    $addwhere";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Datos para graficar el tab CEPlan - ejecutados * VA
    public function graficaEjecucionglobalxentidadxVA($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        //entidades y ejercicio actual
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "--Ejecucion por VA x planes de gastos
                        WITH desviacionsust AS (
                        SELECT
                        (ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                                         (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                                         SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100) as sustituciones,
                               d.identidadmodelo
                        FROM mod_planificacion.dat_desviacionplan d
                             INNER JOIN mod_planificacion.dat_desviacionplanxsustitucion s ON
                              d.iddesviacionplan = s.iddesviacionplan
                             INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
                              ind.idindicador
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                              ind.idindicador
                        where ip.nivelplanif = 1 AND
                              ip.idaprobacion = 4 AND
                              d.idejercicio = {$parametros['idejercicio']}
                              $addwhere
                        GROUP BY d.identidadmodelo,ip.precio,
                        ip.flete,
                        ip.contingencia),
                          desviacionadicion AS (
                          SELECT
                          (ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                                         (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                                         SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100) as adiciones,
                                 d.identidadmodelo
                          FROM mod_planificacion.dat_desviacionplan d
                               LEFT JOIN mod_planificacion.dat_desviacionplanxsustitucion s ON
                                d.iddesviacionplan = s.iddesviacionplan
                               INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
                                ind.idindicador
                               INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                                ind.idindicador
                          where s.iddesviacionplan is null AND
                                ip.nivelplanif = 1 AND
                                ip.idaprobacion = 4 AND
                                d.idejercicio = {$parametros['idejercicio']}
                                $addwhere
                          GROUP BY d.identidadmodelo,ip.precio,
                        ip.flete,
                        ip.contingencia)
                        SELECT via.denominacion as viaadquisicion,
                              round((SUM((p.cantidad+p.ajuste)*p.precio))+
                                         (((SUM((p.cantidad+p.ajuste)*p.precio*ip.flete)))/100) + (((
                                         SUM((p.cantidad+p.ajuste)*p.precio*ip.contingencia)))/100),3) as importeplan,
                                round((SUM(p.precio*COALESCE(ce.cantidadreal, 0))) +
                                         (((SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.flete)))/100) + (((
                                         SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.contingencia)))/100),3)  as
                                importeejecutado,
                              round( COALESCE(sum(d.sustituciones), 0),3) as importesustitucion,
                              round( COALESCE(sum(a.adiciones), 0),3) as importeadicion,
                               round((((SUM(p.precio*COALESCE(ce.cantidadreal, 0))) +
                                         (((SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.flete)))/100) + (((
                                         SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.contingencia)))/100)) + COALESCE(
                               sum(d.sustituciones), 0) + COALESCE(sum(a.adiciones), 0)),3) as
                                importetotalejecutado
                        FROM mod_planificacion.dat_planificacion p
                             INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
                              ind.idindicador
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                              ind.idindicador
                             INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON
                              ip.idindicador = iv.idindicador
                             INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON iv.idviaadquisicion
                              = via.idviaadquisicion
                             INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
                              em.identidadmodelo
                             INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
                             LEFT JOIN mod_planificacion.dat_controlejecucionplan ce ON
                              p.idplanificacion = ce.idplanificacion
                             LEFT JOIN desviacionsust d ON (em.identidadmodelo = d.identidadmodelo)
                             LEFT JOIN desviacionadicion a ON (em.identidadmodelo = a.identidadmodelo)
                             $innerJoinFiltros
                        where em.identidad IN ($entidades) AND
                              p.idejercicio = {$parametros['idejercicio']} AND
                              ip.nivelplanif = 1 AND
                              ip.idaprobacion = 4 AND
                              p.idaprobaciondemanda = 4 AND
                              mod.tipoplan=0
                              $filtros
                              $addwhere
                        GROUP BY via.denominacion order by importetotalejecutado {$parametros['orden']}
                            OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadxVATotal($parametros) {
        //implementando filtros
        $filt = self::filtrar($parametros);
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
        $sql = "SELECT count(DISTINCT via.idviaadquisicion)
                FROM mod_planificacion.dat_planificacion p
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
                        ind.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                ip.idindicador =
                        ind.idindicador
                      INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON
                        ip.idindicador = iv.idindicador
                      INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON
                iv.idviaadquisicion
                        = via.idviaadquisicion
                      INNER JOIN mod_planificacion.dat_entidadmodelo em ON
                p.identidadmodelo =
                        em.identidadmodelo
                      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo =
                mod.idmodelo
                      LEFT JOIN mod_planificacion.dat_controlejecucionplan ce ON
                        p.idplanificacion = ce.idplanificacion
                        $innerJoinFiltros
                where em.identidad IN ($entidades) AND
                       p.idejercicio = {$parametros['idejercicio']} AND
                       ip.nivelplanif = 1 AND
                       ip.idaprobacion = 4 AND
                       p.idaprobaciondemanda = 4 AND
                       mod.tipoplan = 0 
                       $filtros
                       $addwhere";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Datos para graficar el tab CE - NA - global * entidad
    public function graficaEjecucionglobalxentidadAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT round(sum(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                aea.nivelactividadautomatico, 0)) +
                COALESCE(aep.nivelactividadproduccion, 0) +
                  COALESCE(ae.ajuste,0))),6) as nivel,
                       round(sum(COALESCE(ce.nivelactividadreal, 0)),6) as nivelejecutado,
                       round((sum(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                        aea.nivelactividadautomatico, 0)) +
                COALESCE(aep.nivelactividadproduccion
                        , 0) + COALESCE(ae.ajuste,0)))) -(sum(COALESCE(ce.nivelactividadreal, 0))),6) as
                         pendiente
                FROM mod_planificacion.dat_actividadentidad ae
                      LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                      ae.idactividadentidad = aem.idactividadentidad)
                      LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                      ae.idactividadentidad = aea.idactividadentidad)
                      LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                      aep.idactividadentidad = ae.idactividadentidad)
                      LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
                       ae.idactividadentidad = ce.idactividadentidad
                       $innerJoinFiltros
                where ae.identidad IN ($entidades) AND
                       ae.idejercicio = {$parametros['idejercicio']}
                           $filtros";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadejecutadoxtrimestreAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--NA ejecutado por trimestre
                    WITH
                    ejecutado AS (
                    SELECT CASE
                             WHEN EXTRACT(QUARTER
                    FROM ce.fechareal) = 1 THEN COALESCE(sum((COALESCE(ce.nivelactividadreal, 0))),0)
                             ELSE 0
                           END as ejecutadotrimestre1,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM ce.fechareal) = 2 THEN COALESCE(sum((COALESCE(ce.nivelactividadreal, 0))),0)
                           ELSE 0
                         END as ejecutadotrimestre2,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM ce.fechareal) = 3 THEN COALESCE(sum((COALESCE(ce.nivelactividadreal, 0))),0)
                           ELSE 0
                         END as ejecutadotrimestre3,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM ce.fechareal) = 4 THEN COALESCE(sum((COALESCE(ce.nivelactividadreal, 0))),0)
                           ELSE 0
                         END as ejecutadotrimestre4
                    FROM mod_planificacion.dat_actividadentidad ae
                         LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
                          ae.idactividadentidad = ce.idactividadentidad
                          $innerJoinFiltros
                    where ae.identidad IN ($entidades) AND
                          ae.idejercicio = {$parametros['idejercicio']}
                              $filtros
                    GROUP BY ce.fechareal)
                    SELECT round(sum(e.ejecutadotrimestre1),6) as ejecutadotrimestre1,
                           round(sum(e.ejecutadotrimestre2),6) as ejecutadotrimestre2,
                           round(sum(e.ejecutadotrimestre3),6) as ejecutadotrimestre3,
                           round(sum(e.ejecutadotrimestre4),6) as ejecutadotrimestre4
                    FROM ejecutado e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadadicionadoxtrimestreAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--adiciones por trimestre
                    WITH
                    adiciones AS (
                    SELECT CASE
                             WHEN EXTRACT(QUARTER
                    FROM dna.fechareal) = 1 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                             ELSE 0
                           END as adiciontrimestre1,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM dna.fechareal) = 2 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                           ELSE 0
                         END as adiciontrimestre2,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM dna.fechareal) = 3 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                           ELSE 0
                         END as adiciontrimestre3,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM dna.fechareal) = 4 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                           ELSE 0
                         END as adiciontrimestre4
                    FROM mod_planificacion.dat_desviacionnivelactividad dna
                         LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
                          ON dna.iddesviacionnivelactividad = dnas.iddesviacionnivelactividad
                         INNER JOIN mod_planificacion.dat_actividadentidad ae ON
                          dna.idactividadentidad = ae.idactividadentidad
                          $innerJoinFiltros
                    where ae.identidad IN ($entidades) AND
                          dnas.iddesviacionnivelactividad is null AND
                          ae.idejercicio = {$parametros['idejercicio']}
                              $filtros
                    GROUP BY dna.fechareal)

                    SELECT round(sum(e.adiciontrimestre1),6) as adiciontrimestre1,
                           round(sum(e.adiciontrimestre2),6) as adiciontrimestre2,
                           round(sum(e.adiciontrimestre3),6) as adiciontrimestre3,
                           round(sum(e.adiciontrimestre4),6) as adiciontrimestre4
                    FROM adiciones e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadsustituirxtrimestreAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--sustituciones por trimestre
                    WITH
                    sustituciones AS (
                    SELECT CASE
                             WHEN EXTRACT(QUARTER
                    FROM dna.fechareal) = 1 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                             ELSE 0
                           END as sustituciontrimestre1,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM dna.fechareal) = 2 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                           ELSE 0
                         END as sustituciontrimestre2,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM dna.fechareal) = 3 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                           ELSE 0
                         END as sustituciontrimestre3,
                         CASE
                           WHEN EXTRACT(QUARTER
                    FROM dna.fechareal) = 4 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                           ELSE 0
                         END as sustituciontrimestre4
                    FROM mod_planificacion.dat_desviacionnivelactividad dna
                         LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
                          ON dna.iddesviacionnivelactividad = dnas.iddesviacionnivelactividad
                         INNER JOIN mod_planificacion.dat_actividadentidad ae ON
                          dna.idactividadentidad = ae.idactividadentidad
                          $innerJoinFiltros
                    where ae.identidad IN ($entidades) AND
                          ae.idejercicio = {$parametros['idejercicio']}
                              $filtros
                    GROUP BY dna.fechareal)

                    SELECT round(sum(e.sustituciontrimestre1),6) as sustituciontrimestre1,
                           round(sum(e.sustituciontrimestre2),6) as sustituciontrimestre2,
                           round(sum(e.sustituciontrimestre3),6) as sustituciontrimestre3,
                           round(sum(e.sustituciontrimestre4),6) as sustituciontrimestre4
                    FROM sustituciones e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadplanifxtrimestreAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "WITH
                ejecutado AS (
                SELECT CASE
                         WHEN EXTRACT(QUARTER
                FROM ce.fechafin) = 1 THEN COALESCE(sum((COALESCE(ce.nivelactividad, 0))),0)
                         ELSE 0
                       END as ejecutadotrimestre1,
                     CASE
                       WHEN EXTRACT(QUARTER
                FROM ce.fechafin) = 2 THEN COALESCE(sum((COALESCE(ce.nivelactividad, 0))),0)
                       ELSE 0
                     END as ejecutadotrimestre2,
                     CASE
                       WHEN EXTRACT(QUARTER
                FROM ce.fechafin) = 3 THEN COALESCE(sum((COALESCE(ce.nivelactividad, 0))),0)
                       ELSE 0
                     END as ejecutadotrimestre3,
                     CASE
                       WHEN EXTRACT(QUARTER
                FROM ce.fechafin) = 4 THEN COALESCE(sum((COALESCE(ce.nivelactividad, 0))),0)
                       ELSE 0
                     END as ejecutadotrimestre4

                FROM mod_planificacion.dat_nivelactividadporfecha ce 
                     INNER JOIN mod_planificacion.dat_actividadentidad ae ON 
                      ae.idactividadentidad = ce.idactividadentidad 
                      $innerJoinFiltros      
                where ae.identidad IN ($entidades) AND
                      ae.idejercicio = {$parametros['idejercicio']}
                      $filtros          
                GROUP BY ce.fechafin)
                SELECT round(sum(e.ejecutadotrimestre1),6) as plantrimestre1,
                       round(sum(e.ejecutadotrimestre2),6) as plantrimestre2,
                       round(sum(e.ejecutadotrimestre3),6) as plantrimestre3,
                       round(sum(e.ejecutadotrimestre4),6) as plantrimestre4
                FROM ejecutado e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab CE - NA - mes
    public function graficaEjecucionglobalxentidadejecutadoxmesesAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "--ejecutado por meses
                    WITH
                    ejecutado AS (
                    SELECT CASE
                             WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 1 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                             ELSE 0
                           END as ejecutadoenero,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 2 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadofebrero,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 3 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadomarzo,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 4 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadoabril,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 5 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadomayo,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 6 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadojunio,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 7 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadojulio,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 8 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadoagosto,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 9 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadoseptiembre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 10 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadooctubre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 11 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadonoviembre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM ce.fechareal) = 12 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
                           ELSE 0
                         END as ejecutadodiciembre
                    FROM mod_planificacion.dat_controlejecucionnivelactividad ce
                         INNER JOIN mod_planificacion.dat_actividadentidad ae ON
                          ae.idactividadentidad = ce.idactividadentidad
                          $innerJoinFiltros
                    where ae.identidad IN ($entidades) AND
                          ae.idejercicio = {$parametros['idejercicio']}
                              $filtros
                    GROUP BY ce.fechareal)
                    SELECT round(sum(e.ejecutadoenero),6) as ejecutadoenero,
                           round(sum(e.ejecutadofebrero),6) as ejecutadofebrero,
                           round(sum(e.ejecutadomarzo),6) as ejecutadomarzo,
                           round(sum(e.ejecutadoabril),6) as ejecutadoabril,
                           round(sum(e.ejecutadomayo),6) as ejecutadomayo,
                           round(sum(e.ejecutadojunio),6) as ejecutadojunio,
                           round(sum(e.ejecutadojulio),6) as ejecutadojulio,
                           round(sum(e.ejecutadoagosto),6) as ejecutadoagosto,
                           round(sum(e.ejecutadoseptiembre),6) as ejecutadoseptiembre,
                           round(sum(e.ejecutadooctubre),6) as ejecutadooctubre,
                           round(sum(e.ejecutadonoviembre),6) as ejecutadonoviembre,
                           round(sum(e.ejecutadodiciembre),6) as ejecutadodiciembre
                    FROM ejecutado e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadadicionadoxmesesAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "--adiciones por meses
                        WITH
                        adiciones AS (
                        SELECT CASE
                                 WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 1 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                                 ELSE 0
                               END as adicionenero,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 2 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionfebrero,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 3 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionmarzo,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 4 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionabril,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 5 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionmayo,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 6 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionjunio,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 7 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionjulio,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 8 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionagosto,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 9 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionseptiembre,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 10 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionoctubre,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 11 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adicionnoviembre,
                             CASE
                               WHEN EXTRACT(MONTH
                        FROM dna.fechareal) = 12 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
                               ELSE 0
                             END as adiciondiciembre
                        FROM mod_planificacion.dat_desviacionnivelactividad dna
                             LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
                              ON dna.iddesviacionnivelactividad = dnas.iddesviacionnivelactividad
                             INNER JOIN mod_planificacion.dat_actividadentidad ae ON
                              dna.idactividadentidad = ae.idactividadentidad
                              $innerJoinFiltros
                        where dnas.iddesviacionnivelactividad is null AND
                              ae.identidad IN ($entidades) AND
                              ae.idejercicio = {$parametros['idejercicio']}
                                  $filtros
                        GROUP BY dna.fechareal)

                        SELECT round(COALESCE(sum(e.adicionenero), 0),6) as adicionenero,
                               round(COALESCE(sum(e.adicionfebrero), 0),6) as adicionfebrero,
                               round(COALESCE(sum(e.adicionmarzo), 0),6) as adicionmarzo,
                               round(COALESCE(sum(e.adicionabril), 0),6) as adicionabril,
                               round(COALESCE(sum(e.adicionmayo), 0),6) as adicionmayo,
                               round(COALESCE(sum(e.adicionjunio), 0),6) as adicionjunio,
                               round(COALESCE(sum(e.adicionjulio), 0),6) as adicionjulio,
                               round(COALESCE(sum(e.adicionagosto), 0),6) as adicionagosto,
                               round(COALESCE(sum(e.adicionseptiembre), 0),6) as adicionseptiembre,
                               round(COALESCE(sum(e.adicionoctubre), 0),6) as adicionoctubre,
                               round(COALESCE(sum(e.adicionnoviembre), 0),6) as adicionnoviembre,
                               round(COALESCE(sum(e.adiciondiciembre), 0),6) as adiciondiciembre
                        FROM adiciones e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadsustituirxmesesAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "--sustituciones por meses
                    WITH
                    sustituciones AS (
                    SELECT CASE
                             WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 1 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                             ELSE 0
                           END as sustitucionenero,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 2 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionfebrero,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 3 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionmarzo,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 4 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionabril,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 5 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionmayo,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 6 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionjunio,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 7 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionjulio,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 8 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionagosto,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 9 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionseptiembre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 10 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionoctubre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 11 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustitucionnoviembre,
                         CASE
                           WHEN EXTRACT(MONTH
                    FROM dna.fechareal) = 12 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
                           ELSE 0
                         END as sustituciondiciembre
                    FROM mod_planificacion.dat_desviacionnivelactividad dna
                         INNER JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
                          ON dna.iddesviacionnivelactividad = dnas.iddesviacionnivelactividad
                         INNER JOIN mod_planificacion.dat_actividadentidad ae ON
                          dna.idactividadentidad = ae.idactividadentidad
                          $innerJoinFiltros
                    where ae.identidad IN ($entidades) AND
                          ae.idejercicio = {$parametros['idejercicio']}
                              $filtros
                    GROUP BY dna.fechareal)
                    SELECT round(COALESCE(sum(e.sustitucionenero),0),6) as sustitucionenero,
                           round(COALESCE(sum(e.sustitucionfebrero),0),6) as sustitucionfebrero,
                           round(COALESCE(sum(e.sustitucionmarzo),0),6) as sustitucionmarzo,
                           round(COALESCE(sum(e.sustitucionabril),0),6) as sustitucionabril,
                           round(COALESCE(sum(e.sustitucionmayo),0),6) as sustitucionmayo,
                           round(COALESCE(sum(e.sustitucionjunio),0),6) as sustitucionjunio,
                           round(COALESCE(sum(e.sustitucionjulio),0),6) as sustitucionjulio,
                           round(COALESCE(sum(e.sustitucionagosto),0),6) as sustitucionagosto,
                           round(COALESCE(sum(e.sustitucionseptiembre),0),6) as sustitucionseptiembre,
                           round(COALESCE(sum(e.sustitucionoctubre),0),6) as sustitucionoctubre,
                           round(COALESCE(sum(e.sustitucionnoviembre),0),6) as sustitucionnoviembre,
                           round(COALESCE(sum(e.sustituciondiciembre),0),6) as sustituciondiciembre
                    FROM sustituciones e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadplanxmesesAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA_AE($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "--nivel por meses 
                    WITH 
                    nivel AS ( 
                    SELECT CASE 
                             WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 1 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                             ELSE 0 
                           END as nivelenero, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 2 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as nivelfebrero, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 3 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as nivelmarzo, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 4 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as nivelabril, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 5 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as nivelmayo, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 6 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as niveljunio, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 7 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as niveljulio, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 8 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as nivelagosto, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 9 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as nivelseptiembre, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 10 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as niveloctubre, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 11 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as nivelnoviembre, 
                         CASE 
                           WHEN EXTRACT(MONTH 
                    FROM ce.fechafin) = 12 THEN COALESCE(sum(COALESCE(ce.nivelactividad, 0)), 0) 
                           ELSE 0 
                         END as niveldiciembre 
                    FROM mod_planificacion.dat_nivelactividadporfecha ce 
                         INNER JOIN mod_planificacion.dat_actividadentidad ae ON 
                          ae.idactividadentidad = ce.idactividadentidad 
                          $innerJoinFiltros      
                    where ae.identidad IN ($entidades) AND 
                          ae.idejercicio = {$parametros['idejercicio']} 
                              $filtros
                    GROUP BY ce.fechafin)  
                    SELECT round(sum(e.nivelenero),6) as planenero, 
                           round(sum(e.nivelfebrero),6) as planfebrero, 
                           round(sum(e.nivelmarzo),6) as planmarzo, 
                           round(sum(e.nivelabril),6) as planabril, 
                           round(sum(e.nivelmayo),6) as planmayo, 
                           round(sum(e.niveljunio),6) as planjunio, 
                           round(sum(e.niveljulio),6) as planjulio, 
                           round(sum(e.nivelagosto),6) as planagosto, 
                           round(sum(e.nivelseptiembre),6) as planseptiembre, 
                           round(sum(e.niveloctubre),6) as planoctubre, 
                           round(sum(e.nivelnoviembre),6) as plannoviembre, 
                           round(sum(e.niveldiciembre),6) as plandiciembre 
                    FROM nivel e";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab CE - NA - mas valiosas
    public function graficaEjecucionMasValiososAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
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
                               round(sum((n.necesidad) * ip.precio *((COALESCE(
                               aem.nivelactividadmanual, 0) + COALESCE(aea.nivelactividadautomatico, 0))
                                + COALESCE(aep.nivelactividadproduccion, 0) + ae.ajuste)),3) as
                                 importeplan,
                               round(sum((COALESCE(ce.nivelactividadreal, 0)) * ip.precio),3) as importeejecutado
                        FROM mod_planificacion.dat_actividadentidad ae
                             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                             ae.idactividadentidad = aem.idactividadentidad)
                             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                             ae.idactividadentidad = aea.idactividadentidad)
                             LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                             aep.idactividadentidad = ae.idactividadentidad)
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
                              a.nivel = {$this->nivel} AND
                              a.idaprobacion = 4 AND
                              a.estado = 1 AND
                              ip.nivelplanif = 1 AND
                              ip.idaprobacion = 4 AND
							  ae.idejercicio = {$parametros['idejercicio']} AND
                              n.idejercicio = {$parametros['idejercicio']} $filtros $addwhere
                        GROUP BY a.idactividad,
                                 a.denominacion)
                        SELECT c.idactividad,
                               c.denominacion,
                               c.importeplan,
                               c.importeejecutado
                        from consulta c
                        ORDER BY c.importeejecutado {$parametros['orden']}
                            OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionMasValiososActTotal($parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
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
        $sql = "SELECT count(DISTINCT a.idactividad)
                    FROM mod_planificacion.dat_actividadentidad ae
                          LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                          ae.idactividadentidad = aem.idactividadentidad)
                          LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                          ae.idactividadentidad = aea.idactividadentidad)
                          LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                          aep.idactividadentidad = ae.idactividadentidad)
                          INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                           ae.idactividad
                          INNER JOIN mod_planificacion.dat_norma n ON a.idactividad =
                    n.idactividad
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON n.idindicador =
                           ind.idindicador
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                    ip.idindicador =
                           ind.idindicador
                          LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
                           ae.idactividadentidad = ce.idactividadentidad
                           $innerJoinFiltros
                    where ae.identidad IN
                    ($entidades) AND
                           a.nivel = {$this->nivel} AND
                           a.idaprobacion = 4 AND
                           a.estado = 1 AND
                           ip.nivelplanif = 1 AND
                           ip.idaprobacion = 4 AND
                           n.idejercicio = {$parametros['idejercicio']} $filtros $addwhere";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function graficaIndicadoresFueraPlanMasValiososAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--Actividades mas valiosos(adiciones)
                    SELECT a.idactividad,
                           a.denominacion,
                           round(COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0),6) as
                            adiciones
                    FROM mod_planificacion.dat_desviacionnivelactividad dna
                         LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
                          ON dna.iddesviacionnivelactividad = dnas.iddesviacionnivelactividad
                         INNER JOIN mod_planificacion.dat_actividadentidad ae ON
                          dna.idactividadentidad = ae.idactividadentidad

                          INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                          ae.idactividad
                          $innerJoinFiltros
                          where ae.identidad IN
                  ($entidades) AND
                          dnas.iddesviacionnivelactividad is null AND
                          a.nivel = {$this->nivel} AND
                          a.idaprobacion = 4 AND
                          a.estado = 1 AND
                          ae.idejercicio =  {$parametros['idejercicio']}
                              $filtros
                    GROUP BY a.idactividad
                    ORDER BY adiciones {$parametros['orden']}
                      OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaIndicadoresFueraPlanMasValiososActTotal($parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count(DISTINCT a.idactividad)
                    FROM mod_planificacion.dat_desviacionnivelactividad dna
                         LEFT JOIN
                 mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
                          ON dna.iddesviacionnivelactividad = dnas.iddesviacionnivelactividad
                         INNER JOIN mod_planificacion.dat_actividadentidad ae ON
                          dna.idactividadentidad = ae.idactividadentidad

                          INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                          ae.idactividad
                          $innerJoinFiltros
                          where ae.identidad IN
                 ($entidades) AND
                          dnas.iddesviacionnivelactividad is null AND
                          a.nivel = {$this->nivel} AND
                          a.idaprobacion = 4 AND
                          a.estado = 1 AND
                          ae.idejercicio =  {$parametros['idejercicio']} 
                          $filtros";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Datos para graficar el tab CE - NA - mas ejecutadas
    public function graficaIndicadoresMasEjecutadosAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
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
                               round(sum(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                               aea.nivelactividadautomatico, 0)) + COALESCE(aep.nivelactividadproduccion
                               , 0) + ae.ajuste)),6) as plan,
                               round(sum((COALESCE(ce.nivelactividadreal, 0))),6) as ejecutado
                        FROM mod_planificacion.dat_actividadentidad ae
                             LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                             ae.idactividadentidad = aem.idactividadentidad)
                             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                             ae.idactividadentidad = aea.idactividadentidad)
                             LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                             aep.idactividadentidad = ae.idactividadentidad)
                             INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                              ae.idactividad
                             LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
                              ae.idactividadentidad = ce.idactividadentidad
                              $innerJoinFiltros
                         where ae.identidad IN
                        ($entidades) AND
                              ae.idejercicio = {$parametros['idejercicio']}
                              AND
                              a.nivel = {$this->nivel} AND
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
                        where (c.plan<> 0 OR  c.ejecutado <> 0)
                        ORDER BY c.ejecutado, c.plan {$parametros['orden']}
                            OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaIndicadoresMasEjecutadosActTotal($parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count( DISTINCT a.idactividad)
                    FROM mod_planificacion.dat_actividadentidad ae
                          LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                          ae.idactividadentidad = aem.idactividadentidad)
                          LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                          ae.idactividadentidad = aea.idactividadentidad)
                          LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                          aep.idactividadentidad = ae.idactividadentidad)      
                          INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                           ae.idactividad
                          LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
                           ae.idactividadentidad = ce.idactividadentidad
                           $innerJoinFiltros
                      where ae.identidad IN
                    ($entidades) AND
                           ae.idejercicio = {$parametros['idejercicio']}
                           AND
                           a.nivel = {$this->nivel} AND
                           a.idaprobacion = 4 AND
                           a.estado = 1
                           $filtros";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Datos para graficar el tab CE - NA - total * entidad
    public function graficaEjecucionglobalxentidadxAct($parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros

        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "WITH
                    desviacionsust AS (SELECT COALESCE(sum(dna.nivelactividadrealxdesviacion), 0) as
                     sustituciones, dna.idactividadentidad
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
                           round(sum(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                           aea.nivelactividadautomatico, 0)) + COALESCE(aep.nivelactividadproduccion
                           , 0) + ae.ajuste)) ,6) as nivel,
                           round(COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0),6) as nivelejecutado,
                           round(COALESCE(sum(d.sustituciones), 0),6) as sustitucion,
                           round(COALESCE(sum(ad.adiciones), 0),6) as adicion,
                           round(((COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)) +(COALESCE(sum(
                           d.sustituciones), 0)) +(COALESCE(sum(ad.adiciones), 0))),6) as totalejecutado
                    FROM mod_planificacion.dat_actividadentidad ae
                         LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                         ae.idactividadentidad = aem.idactividadentidad)
                         LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                         ae.idactividadentidad = aea.idactividadentidad)
                         LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                         aep.idactividadentidad = ae.idactividadentidad)
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
                          a.nivel = {$this->nivel} AND
                          a.idaprobacion = 4 AND
                          a.estado = 1 
                          $filtros
                          GROUP BY a.idactividad
                          order by totalejecutado {$parametros['orden']}
                        OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function graficaEjecucionglobalxentidadxActTotal($parametros) {
        //implementando filtros
        $filt = self::filtrarNA($parametros);
        $filtros = $filt[0];
        $innerJoinFiltros = $filt[1];
        //fin filtros
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count( DISTINCT a.idactividad)
                    FROM mod_planificacion.dat_actividadentidad ae
                          LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                          ae.idactividadentidad = aem.idactividadentidad)
                          LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                          ae.idactividadentidad = aea.idactividadentidad)
                          LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                          aep.idactividadentidad = ae.idactividadentidad)
                          LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividad ce ON
                           ae.idactividadentidad = ce.idactividadentidad
                          INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad =
                           a.idactividad
                           $innerJoinFiltros
                    where ae.identidad IN ($entidades) AND
                           ae.idejercicio = {$parametros['idejercicio']} AND
                           a.nivel = {$this->nivel} AND
                           a.idaprobacion = 4 AND
                           a.estado = 1
                           $filtros";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Datos para graficar el tab Linea de tiempo actividades LT
    public function graficaLineaTiempo($parametros) {
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = " SELECT naf.nivelactividad as valor,  
                    naf.fechainicio, 
                    naf.fechafin, 
                    a.denominacion 
                    FROM mod_planificacion.dat_nivelactividadporfecha naf 
                         inner join mod_planificacion.dat_actividadentidad ae  
                         on (ae.idactividadentidad = naf.idactividadentidad and ae.idejercicio = {$parametros['idejercicio']}) 
                         inner join mod_planificacion.nom_actividad a  
                         on (a.idactividad =ae.idactividad) 
                         where ae.identidad IN($entidades) and a.idactividad=203
                         order by naf.fechainicio 
                         OFFSET 0
                         Limit 5";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab Linea de tiempo indicadores LT
    public function graficaLineaTiempoIndicadores($parametros) {
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  
                    i.denominacion, 
                    ipf.cantidad as valor, 
                    ipf.fechainicio, 
                    ipf.fechafin 
                  FROM  
                    mod_planificacion.dat_planificacionporfecha ipf 
                    inner join mod_planificacion.dat_planificacion p on(ipf.idplanificacion= p.idplanificacion and p.idejercicio = {$parametros['idejercicio']}) 
                    inner join mod_datosmaestros.nom_indicador i on (p.idindicador=i.idindicador) 
                    inner join mod_planificacion.dat_entidadmodelo em on (p.identidadmodelo=em.identidadmodelo) 
                    where em.identidad IN($entidades) order by ipf.fechainicio";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Datos para graficar el tab Histograma
    public function graficaHistograma($parametros) {
        //entidades
        $entidades = implode(',', $parametros['identidad']);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT entidaddn.identidad as identidad, 
                        sum((ip.precio * (( 
                                         p.cantidad + p.ajuste))) +(((ip.precio * (( 
                                         p.cantidad + p.ajuste))) * ip.flete) / 100) +((( 
                                         ip.precio * ((p.cantidad + p.ajuste))) * 
                                         ip.contingencia) / 100)) as valor 
                        FROM mod_planificacion.dat_planificacion p 
                             inner join mod_planificacion.dat_entidadmodelo em  
                             on (p.identidadmodelo = em.identidadmodelo) 
                             inner join mod_planificacion.dat_modelo m  
                             ON (m.idmodelo = em.idmodelo) 
                             inner join mod_datosmaestros.nom_indicador i  
                             ON (i.idindicador = p.idindicador) 
                             inner join mod_datosmaestros.nom_indicadorplanif ip 
                             ON (i.idindicador = ip.idindicador) 
                             inner join mod_datosmaestros.dat_indicadorcentrobalance icb  
                             on (i.idindicador = icb.idindicador) 
                             inner JOIN mod_planificacion.dat_entidaddatosnomenclador entidaddn  
                             on (entidaddn.identidaddatosnomenclador = icb.identidaddatosnomenclador) 
                        where p.idejercicio = {$parametros['idejercicio']} and 
                              m.tipoplan = 0 and em.identidad IN($entidades) 
                              and i.estado = 1 
                              and ip.idaprobacion = 4 
                              group by entidaddn.identidad
                              order by valor";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function residuos($identidad, $idejercicio, $orden, $start, $limit) {
        $sqlQuery = "WITH valioso AS (SELECT p.idindicador,
                                ind.denominacion as indicador,
                                round((sum(p.importe +((p.importe * ip.flete) / 100) +(
                                  (p.importe * ip.contingencia) / 100))) +((SUM(
                                  p.ajuste * p.precio)) +(((SUM(p.ajuste * p.precio *
                                  ip.flete))) / 100) +(((SUM(p.ajuste * p.precio *
                                  ip.contingencia))) / 100)) +(((sum(p.precio *(
                                  p.cantidad + p.ajuste) * ip.flete)) / 100)) +(((sum(
                                  p.precio *(p.cantidad + p.ajuste) * ip.contingencia))
                                  / 100)), 3) as total
                         FROM mod_planificacion.dat_planificacion p
                              INNER JOIN mod_datosmaestros.nom_indicador ind ON
                                p.idindicador = ind.idindicador
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                                ip.idindicador = ind.idindicador
                              INNER JOIN mod_planificacion.dat_entidadmodelo em ON
                                em.identidadmodelo = p.identidadmodelo
                                INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo

                         WHERE idejercicio = $idejercicio AND
                               em.identidad IN ($identidad) AND 
                                mod.uriruta like '%Tratamiento de Residuos'
                                   AND
                               ip.nivelplanif = 1 AND
                                ip.idaprobacion = 4
                                           GROUP BY p.idindicador,
                                                    ind.denominacion)
                               SELECT v.idindicador,
                                      v.indicador,      
                                      v.total
                               FROM valioso v
                               WHERE v.total <> 0
                               ORDER BY v.total $orden
                                  OFFSET $start LIMIT $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function residuosTotal($identidad, $idejercicio) {
        $sqlQuery = "WITH valioso AS (SELECT p.idindicador,
                         ind.denominacion as indicador,
                         round((sum(p.importe +((p.importe * ip.flete) / 100) +(
                           (p.importe * ip.contingencia) / 100))) +((SUM(
                           p.ajuste * p.precio)) +(((SUM(p.ajuste * p.precio *
                           ip.flete))) / 100) +(((SUM(p.ajuste * p.precio *
                           ip.contingencia))) / 100)) +(((sum(p.precio *(
                           p.cantidad + p.ajuste) * ip.flete)) / 100)) +(((sum(
                           p.precio *(p.cantidad + p.ajuste) * ip.contingencia))
                           / 100)), 3) as total
                  FROM mod_planificacion.dat_planificacion p
                       INNER JOIN mod_datosmaestros.nom_indicador ind ON
                         p.idindicador = ind.idindicador
                       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
                         ip.idindicador = ind.idindicador
                       INNER JOIN mod_planificacion.dat_entidadmodelo em ON
                         em.identidadmodelo = p.identidadmodelo
                         INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo                         
                  WHERE idejercicio = $idejercicio AND
                        em.identidad IN ($identidad) AND 
                         mod.uriruta like '%Tratamiento de Residuos'  AND
                        ip.nivelplanif = 1 AND
                         ip.idaprobacion = 4
                                    GROUP BY p.idindicador,
                                             ind.denominacion)
                   SELECT  count(v.indicador)
                   FROM valioso v
                   WHERE v.total <> 0";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function filtrar($parametros) {
        $filtros = "";
        $innerJoinFiltros = "";

        if ($parametros['idPlan']) {
            $filtros .= " AND mod.idmodelo IN({$parametros['idPlan']})";
        }
        if ($parametros['idCB']) {
            $innerJoinFiltros .= " INNER JOIN  mod_datosmaestros.dat_indicadorcentrobalance icb
                                   on (icb.idindicador = ind.idindicador)";
            $filtros .= " AND icb.identidaddatosnomenclador IN({$parametros['idCB']})";
        }
        if ($parametros['idVA'] || $parametros['idOS']) {
            $innerJoinFiltros .= " INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva 
                         ON iva.idindicador = ind.idindicador";
            if ($parametros['idVA'])
                $filtros .= " AND iva.idviaadquisicion IN({$parametros['idVA']})";
        }
        if ($parametros['idOS']) {
            $innerJoinFiltros .= " INNER JOIN  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivaos
                                 on (iva.idindicador = ivaos.idindicador AND iva.idviaadquisicion = ivaos.idviaadquisicion)";
            $filtros .= " AND ivaos.idorganosatisface IN({$parametros['idOS']})";
        }
        if ($parametros['idUM']) {
            $innerJoinFiltros .= " INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                                   ON (um.idunidadmedida = ind.idumedida)";
            $filtros .= " AND um.idunidadmedida IN({$parametros['idUM']})";
        }
        if ($parametros['codigoInd']) {
            $aux = str_replace(",", "'", $parametros['codigoInd']);
            $filtros .= " AND ind.codigo in('$aux')";
        }
        $data[0] = $filtros;
        $data[1] = $innerJoinFiltros;
        return $data;
    }

    public function filtrarNA($parametros) {
        $filtros = "";
        $innerJoinFiltros = "";
        if ($parametros['idPlan']) {
            $innerJoinFiltros .= " INNER JOIN mod_planificacion.dat_actividadmodelo am 
                                  ON am.idactividad = a.idactividad";
            $filtros .= " AND am.idmodelo IN ({$parametros['idPlan']})";
        }
        if ($parametros['idEsp']) {
            $innerJoinFiltros .= " INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON aec.idactividad = a.idactividad";
            $filtros .= " AND aec.idespecialidad IN({$parametros['idEsp']})";
        }
        $data[0] = $filtros;
        $data[1] = $innerJoinFiltros;
        return $data;
    }

    public function filtrarNA_addwhere($parametros) {
        $filtros = "";
        $innerJoinFiltros = "";
        if ($parametros['idPlan']) {
            $innerJoinFiltros .= " INNER JOIN mod_planificacion.dat_actividadmodelo am 
                                  ON am.idactividad = a.idactividad";
            $filtros .= " AND am.idmodelo IN ({$parametros['idPlan']})";
        }
        if ($parametros['idEsp']) {
            $innerJoinFiltros .= " INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON (aec.idactividad =
                                    a.idactividad AND aec.idespecialidad IN({$parametros['idEsp']}))";
        }
        $data[0] = $filtros;
        $data[1] = $innerJoinFiltros;
        return $data;
    }

    public function filtrarNA_AE($parametros) {
        $filtros = "";
        $innerJoinFiltros = "";
        if ($parametros['idPlan']) {
            $innerJoinFiltros .= " INNER JOIN mod_planificacion.dat_actividadmodelo am 
                                  ON am.idactividad = ae.idactividad";
            $filtros .= " AND am.idmodelo IN ({$parametros['idPlan']})";
        }
        if ($parametros['idEsp']) {
            $innerJoinFiltros .= " INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON aec.idactividad = ae.idactividad";
            $filtros .= " AND aec.idespecialidad IN({$parametros['idEsp']})";
        }
        $data[0] = $filtros;
        $data[1] = $innerJoinFiltros;
        return $data;
    }

    public function listarCodigoInd($params) {
        $sqlQueryCount = "select count(i.codigo)
                 from mod_datosmaestros.nom_indicador i
                      inner join mod_datosmaestros.nom_indicadorplanif ip on (ip.idindicador =
                        i.idindicador)
                 where ip.idaprobacion = 4 AND
                       ip.nivelplanif = 1";
        $conn = Doctrine_Manager::connection();
        $total = $conn->execute($sqlQueryCount)->fetchAll(PDO::FETCH_COLUMN);
        $result->total = $total[0];
        if (!isset($params['start']))
            $params['start'] = 0;
        if (!isset($params['limit']))
            $params['limit'] = 10;
        $sqlQuery = "select i.codigo,
                        i.idindicador
                 from mod_datosmaestros.nom_indicador i
                      inner join mod_datosmaestros.nom_indicadorplanif ip on (ip.idindicador =
                        i.idindicador)
                 where ip.idaprobacion = 4 AND
                       ip.nivelplanif = 1 
                       order by i.codigo
                       offset {$params['start']}
                       limit {$params['limit']}";
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
