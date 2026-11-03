<?php

class DatProduccionindustrial extends BaseDatProduccionindustrial {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatCartatecindustrial', array('local' => 'idcartatecindustrial', 'foreign' => 'idcartatecindustrial'));
        $this->hasMany('DatActividadentidadindustrial', array('local' => 'idactividadentidadindustrial', 'foreign' => 'idactividadentidadindustrial'));
    }

    public function listarProducciones($params) {
        $AddWhere = " ";
//        if (is_array($params['filtros'])) {
//            foreach ($params['filtros'] as $datos) {
//                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
//                    continue;
//                }
//                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
//                    $AddWhere = $AddWhere . " AND upper(cti." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
//                } else
//                if ($datos['field'] == 'denominacionindicador') {
//                    $AddWhere = $AddWhere . " AND upper(ind.denominacion) LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
//                } else
//                if ($datos['field'] == 'idumedida') {
//                    $AddWhere = $AddWhere . " AND ind." . $datos['field'] . " = " . $datos['data']['value'];
//                } else
//                if ($datos['field'] == 'idaprobacion') {
//                    $AddWhere = $AddWhere . " AND cti." . $datos['field'] . " = " . $datos['data']['value'];
//                } else
//                if ($datos['field'] == 'cantidad') {
//                    if ($datos['data']['comparison'] == 'lt') {
//                        $sqlSigno = "<";
//                    } else {
//                        if ($datos['data']['comparison'] == 'gt') {
//                            $sqlSigno = ">";
//                        } else {
//                            $sqlSigno = "=";
//                        }
//                    }
//                    $AddWhere = $AddWhere . " AND cti." . $datos['field'] . $sqlSigno . $datos['data']['value'];
//                }
//            }
//        }//Fin de los filtros

        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET {$params['start']} LIMIT {$params['limit']} ";
        }

        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT prod.idproduccionindustrial,
                            prod.idcartatecindustrial,
                            prod.denominacion,
                            cti.denominacion as denominacioncarta,
                            cti.descripcion,
                            cti.idindicadorsalida,
                            ind.denominacion as denominacionindicador,
                            ind.idumedida,
                            prod.valor,
                            prod.idaprobacion,
                            count(*) OVER() as total
                     FROM mod_planifindustrial.dat_produccionindustrial prod
                          INNER JOIN mod_planifindustrial.dat_cartatecindustrial cti ON (cti.idcartatecindustrial = prod.idcartatecindustrial)
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador = cti.idindicadorsalida)
                     WHERE prod.identidad = {$params['identidad']} AND
                           prod.idejercicio = {$params['idejercicio']} {$params['addWhereProduccion']}   $AddWhere
                     ORDER BY prod.idproduccionindustrial
                     $delimitando";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminarProducciones($idproduccionindustrial_lista) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE 
                    FROM mod_planifindustrial.dat_produccionindustrial 
                  WHERE 
                    idproduccionindustrial IN($idproduccionindustrial_lista) AND idaprobacion = 1";
        $conn->execute($query);
        return 1;
    }

    public function aprobarProducciones($idproduccionindustrial_lista, $params) {
        if ($params['idaprobacion'] == 1) {
            if ($params['rector'] == 'true') {
                $idaprobacion_comprobar = "1";
            } else {
                $idaprobacion_comprobar = "1,4";
            }
        } else {
            if ($params['rector'] == 'true') {
                $idaprobacion_comprobar = "4";
            } else {
                $idaprobacion_comprobar = "3,4";
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "UPDATE 
                    mod_planifindustrial.dat_produccionindustrial 
                  SET 
                    idaprobacion = {$params['idaprobacion']}
                  WHERE 
                    idproduccionindustrial IN ($idproduccionindustrial_lista)
                  AND idaprobacion NOT IN ($idaprobacion_comprobar) ";
        $conn->execute($query);
        return 1;
    }

    public function listarActividadesProduccion($params) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT ctiact.idcartatecindustrialactividad,
                            act.idactividad,
                            act.codigo,
                            act.denominacion,
                            act.descripcion,
                            act.estado,
                            act.idaprobacion,
                            CASE
                                WHEN COALESCE(pi.valor, 0.000000) = 0.000000 OR COALESCE(cti.cantidad, 0.000000) = 0.000000 THEN 0.000000
                                ELSE round(COALESCE((pi.valor / cti.cantidad), 0.00000), 6)
                              END as na,
                            count(*) OVER() as total
                     FROM mod_planifindustrial.dat_cartatecindustrial cti
                          INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctiact ON (cti.idcartatecindustrial = ctiact.idcartatecindustrial)
                          INNER JOIN mod_planificacion.nom_actividad act ON (act.idactividad = ctiact.idactividad)
                          INNER JOIN mod_planifindustrial.dat_produccionindustrial pi 
                          ON pi.idcartatecindustrial = cti.idcartatecindustrial and pi.idproduccionindustrial={$params['idproduccionindustrial']}
                     WHERE cti.idcartatecindustrial = {$params['idcartatecindustrial']}
                     ORDER BY act.codigo";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerIndicadoresxProduccion($params) {
        if (!$params['idejercicio']) {
            $params['idejercicio'] = " ( SELECT idejercicio
                                            FROM mod_planificacion.nom_ejercicioplanificacion
                                            WHERE actual = 1 ) ";
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT i.codigo,
                    i.denominacion,
                    ip.precio,
                    i.idnaturaleza,
                    i.idumedida,
                    COALESCE(sum(n.necesidad), 0) as cantidad,
                    COALESCE(sum(ip.precio * n.necesidad), 0) as importe,

                    CASE
                      WHEN COALESCE(pi.valor, 0.000000) = 0.000000 OR COALESCE(cti.cantidad, 0.000000) = 0.000000 THEN 0.000000
                      ELSE round(COALESCE((pi.valor / cti.cantidad), 0.00000)* COALESCE(sum(n.necesidad), 0.000000), 6)
                    END as demanda,
              CASE
                      WHEN COALESCE(pi.valor, 0.000000) = 0.000000 OR COALESCE(cti.cantidad, 0.000000) = 0.000000 THEN 0.000000
                      ELSE round(COALESCE((pi.valor / cti.cantidad), 0.00000)* COALESCE(sum(n.necesidad), 0.000000) * ip.precio , 6)
                    END as importedemanda

             FROM mod_planifindustrial.dat_cartatecindustrial cti
                  INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctia ON (ctia.idcartatecindustrial = cti.idcartatecindustrial)
                  INNER JOIN mod_planificacion.nom_actividad a ON (ctia.idactividad = a.idactividad)
                  INNER JOIN mod_planificacion.dat_norma n ON (a.idactividad = n.idactividad and n.idejercicio = {$params['idejercicio']})
                  INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = n.idindicador)
                  INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador and ip.nivelplanif = 1 and ip.idaprobacion = 4)
                  INNER JOIN mod_planifindustrial.dat_produccionindustrial pi ON pi.idcartatecindustrial = cti.idcartatecindustrial and pi.idproduccionindustrial={$params['idproduccionindustrial']}
             where cti.idcartatecindustrial = {$params['idcartatecindustrial']}
             GROUP BY i.codigo,
                      i.denominacion,
                      ip.precio,
                      i.idnaturaleza,
                      i.idumedida,pi.valor,cti.cantidad
             ORDER BY i.codigo";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
