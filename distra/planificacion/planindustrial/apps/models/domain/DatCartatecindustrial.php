<?php

class DatCartatecindustrial extends BaseDatCartatecindustrial {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatCartatecindustrialactividad', array('local' => 'idcartatecindustrial', 'foreign' => 'idcartatecindustrial'));
        $this->hasMany('DatProduccionindustrial', array('local' => 'idproduccionindustrial', 'foreign' => 'idproduccionindustrial'));
    }

    public function listarCartatecnologica($params) {
        $AddWhere = " true ";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $AddWhere = $AddWhere . " AND upper(cti." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'denominacionindicador') {
                    $AddWhere = $AddWhere . " AND upper(ind.denominacion) LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'idumedida') {
                    $AddWhere = $AddWhere . " AND ind." . $datos['field'] . " = " . $datos['data']['value'];
                } else
                if ($datos['field'] == 'idaprobacion') {
                    $AddWhere = $AddWhere . " AND cti." . $datos['field'] . " = " . $datos['data']['value'];
                } else
                if ($datos['field'] == 'cantidad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $AddWhere = $AddWhere . " AND cti." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } else
                if ($datos['field'] == 'idcartatecindustrial') {
                    $AddWhere = $AddWhere . " AND cti." . $datos['field'] . " = " . $datos['data']['value'];
                }
                //idcartatecindustrial
            }
        }//Fin de los filtros

        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET {$params['start']} LIMIT {$params['limit']} ";
        }

        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT cti.idcartatecindustrial,
                            cti.denominacion,
                            cti.descripcion,
                            ind.denominacion as denominacionindicador,
                            cti.idindicadorsalida,
                            ind.idumedida,
                            cti.cantidad,
                            cti.idaprobacion,
                            count(*) OVER() as total
                     FROM mod_planifindustrial.dat_cartatecindustrial cti
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador = cti.idindicadorsalida)
                     WHERE $AddWhere
                    ORDER BY cti.idcartatecindustrial $delimitando";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarCartatecnologicaAdicionarProducciones($params) {
        $AddWhere = " ";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $AddWhere = $AddWhere . " AND upper(cti." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'denominacionindicador') {
                    $AddWhere = $AddWhere . " AND upper(ind.denominacion) LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'idumedida') {
                    $AddWhere = $AddWhere . " AND ind." . $datos['field'] . " = " . $datos['data']['value'];
                } else
                if ($datos['field'] == 'idaprobacion') {
                    $AddWhere = $AddWhere . " AND cti." . $datos['field'] . " = " . $datos['data']['value'];
                } else
                if ($datos['field'] == 'cantidad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $AddWhere = $AddWhere . " AND cti." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                }
            }
        }//Fin de los filtros

        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET {$params['start']} LIMIT {$params['limit']} ";
        }

        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT cti.idcartatecindustrial,
                            cti.denominacion,
                            cti.descripcion,
                            ind.denominacion as denominacionindicador,
                            cti.idindicadorsalida,
                            ind.idumedida,
                            cti.cantidad,
                            cti.idaprobacion,
                            count(*) OVER() as total
                     FROM mod_planifindustrial.dat_cartatecindustrial cti
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador = cti.idindicadorsalida)
                     WHERE cti.idaprobacion = 4 $AddWhere
                    ORDER BY cti.idcartatecindustrial $delimitando";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarIndicadoresAdicionarCartatecnologica($params) {
        $AddWhere = " ";
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $AddWhere = $AddWhere . " ind.codigo LIKE '{$datos['data']['value']}%'";
                } elseif ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion' || $datos['field'] == 'numeropieza') {
                    $AddWhere = $AddWhere . "upper(ind.{$datos['field']}) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'idumedida') {
                    $AddWhere = $AddWhere . "ind.idumedida = " . $datos['data']['value'] . " ";
                } elseif ($datos['field'] == 'precio' || $datos['field'] == 'precioventa') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $AddWhere = $AddWhere . "indp." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                }
            }
        }//Fin de los filtros

        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET {$params['start']} LIMIT {$params['limit']} ";
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT ind.idindicador,
                        ind.codigo,
                        ind.denominacion,
                        ind.descripcion,
                        ind.idumedida,
                        ind.numeropieza,
                        indp.precio,
                        indp.precioventa,
                        count(*) over() as total
                 FROM mod_datosmaestros.nom_indicador ind
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
                        indp.idindicador)
                 WHERE indp.nivelplanif = 1 AND
                       ind.estado = 1 AND
                       indp.idaprobacion = 4 /*AND
                       indp.precioventa > 0*/ $AddWhere 
                       $delimitando";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function eliminarCartatecnologica($idcartatecindustrial_lista) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE 
                    FROM mod_planifindustrial.dat_cartatecindustrial 
                  WHERE 
                    idcartatecindustrial IN($idcartatecindustrial_lista) AND idaprobacion = 1";
        $conn->execute($query);
        return 1;
    }

    public function aprobarCartatecnologica($idcartatecindustrial_lista, $params) {
        if ($params['idaprobacion'] == 1) {
            $idaprobacion_comprobar = "1";
        } else {
            $idaprobacion_comprobar = "4";
        }

        $conn = Doctrine_Manager::connection();
        $query = "UPDATE 
                    mod_planifindustrial.dat_cartatecindustrial 
                  SET 
                    idaprobacion = {$params['idaprobacion']}
                  WHERE 
                    idcartatecindustrial IN ($idcartatecindustrial_lista)
                  AND idaprobacion NOT IN ($idaprobacion_comprobar) ";
        $conn->execute($query);
        return 1;
    }

}
