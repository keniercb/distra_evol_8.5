<?php

class DatCartatecindustrialactividad extends BaseDatCartatecindustrialactividad {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatCartatecindustrial', array('local' => 'idcartatecindustrial', 'foreign' => 'idcartatecindustrial'));
        $this->hasMany('DatActividadentidadindustrial', array('local' => 'idactividadentidadindustrial', 'foreign' => 'idactividadentidadindustrial'));
    }

    public function listarActividadesCartatecnologica($params) {
        $AddWhere = " ";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'codigo') {
                    $AddWhere = $AddWhere . " AND act." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $AddWhere = $AddWhere . " AND upper(cti." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'estado' || $datos['field'] == 'idaprobacion') {
                    $AddWhere = $AddWhere . " AND act." . $datos['field'] . " = " . $datos['data']['value'];
                }
            }
        }//Fin de los filtros

        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET {$params['start']} LIMIT {$params['limit']} ";
        }

        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT 
                        ctiact.idcartatecindustrialactividad,
                        act.idactividad,
                        act.codigo,
                        act.denominacion,
                        act.descripcion,
                        act.estado,
                        act.idaprobacion,
                        count(*) OVER() as total
                      FROM 
                        mod_planifindustrial.dat_cartatecindustrialactividad ctiact
                        INNER JOIN mod_planificacion.nom_actividad act ON (act.idactividad = ctiact.idactividad)
                      WHERE ctiact.idcartatecindustrial = {$params['idcartatecindustrial']} $AddWhere
                    ORDER BY act.codigo $delimitando";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarActividadesAdicionarActividadesCartatecnologica($params, $idactividad) {
        $AddWhere = " ";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'codigo') {
                    $AddWhere = $AddWhere . " AND act." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $AddWhere = $AddWhere . " AND upper(cti." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                }
            }
        }//Fin de los filtros

        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET {$params['start']} LIMIT {$params['limit']} ";
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT act.idactividad,
                        act.codigo,
                        act.denominacion,
                        act.descripcion,
                        count(*) over() as total
                 FROM mod_planificacion.nom_actividad act
                 WHERE act.estado = 1 AND
                       act.idaprobacion = 4 AND
                       --act.nivel = 4 AND 
                       act.idactividad not in(
                                                                SELECT 
                                                                    ctiact.idactividad
                                                                FROM 
                                                                    mod_planifindustrial.dat_cartatecindustrialactividad ctiact
                                                                WHERE ctiact.idcartatecindustrial = {$params['idcartatecindustrial']}
                                                                ) 
                       $AddWhere 
                       ORDER BY act.codigo $delimitando";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function eliminarActividadesCartatecnologica($idactividades_lista) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE 
                    FROM mod_planifindustrial.dat_cartatecindustrialactividad 
                  WHERE 
                    idcartatecindustrialactividad IN($idactividades_lista)";
        $conn->execute($query);
        return 1;
    }

    public function obtenerIndicadoresxCarta($params) {
        $whereEjercicio = "";
        $joinEjercicio = "";
        if ($params['idejercicio']) {
            $whereEjercicio = "and n.idejercicio = {$params['idejercicio']}";
        } else {
            if ($params['idejerciciocontable']) {
                $joinEjercicio = "INNER JOIN mod_planificacion.nom_ejercicioplanificacion e ON  n.idejercicio= e.idejercicio";
                $whereEjercicio = "and e.idjerciciocontable = {$params['idejerciciocontable']}";
            } else {
                if (!$params['idejercicio']) {
                    $whereEjercicio = "and n.idejercicio = ( SELECT idejercicio
                                            FROM mod_planificacion.nom_ejercicioplanificacion
                                            WHERE actual = 1 )";
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT i.codigo,
                        i.denominacion,
                        ip.precio,
                        i.idnaturaleza,
                        i.idumedida,
                        COALESCE(sum(n.necesidad), 0) as cantidad,
                        COALESCE(sum(ip.precio * n.necesidad), 0) as importe
                 FROM mod_planifindustrial.dat_cartatecindustrial cti
                      INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctia ON (ctia.idcartatecindustrial = cti.idcartatecindustrial)
                      INNER JOIN mod_planificacion.nom_actividad a ON (ctia.idactividad = a.idactividad)
                      INNER JOIN mod_planificacion.dat_norma n ON a.idactividad = n.idactividad 
                          $joinEjercicio $whereEjercicio
                INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = n.idindicador)
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador and ip.nivelplanif = 1 and ip.idaprobacion = 4)
                where cti.idcartatecindustrial = {$params['idcartatecindustrial']}
                GROUP BY i.codigo,
                         i.denominacion,
                         ip.precio,
                         i.idnaturaleza,
                         i.idumedida
                ORDER BY i.codigo";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerCargosxCarta($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT ac.idcargo,
                        ac.cantidad,
                        ac.duracion,
                        COALESCE(sum(ac.cantidad), 0) as cantidad,
                        COALESCE(sum(ac.duracion), 0) as duracion
                 FROM mod_planifindustrial.dat_cartatecindustrial cti
                      INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctia ON (ctia.idcartatecindustrial = cti.idcartatecindustrial)
                      INNER JOIN mod_planificacion.nom_actividad a ON (ctia.idactividad = a.idactividad)
                      INNER JOIN mod_planificacion.dat_actividadcargo ac ON (ac.idactividad = a.idactividad)
                 WHERE cti.idcartatecindustrial = {$params['idcartatecindustrial']}
                GROUP BY ac.idcargo,
                    ac.cantidad,
                    ac.duracion";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerActivosxCarta($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT i.codigo,
                        i.denominacion,
                        COALESCE(sum(aaf.cantidad), 0) as cantidad
                 FROM mod_planifindustrial.dat_cartatecindustrial cti
                      INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctia ON (ctia.idcartatecindustrial = cti.idcartatecindustrial)
                      INNER JOIN mod_planificacion.nom_actividad a ON (ctia.idactividad = a.idactividad)
                      INNER JOIN mod_planificacion.dat_actividadactivofijo aaf ON (aaf.idactividad = a.idactividad)
                      INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = aaf.idindicador)
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador and ip.nivelplanif = 1 and ip.idaprobacion = 4)
                 WHERE cti.idcartatecindustrial = {$params['idcartatecindustrial']}
                GROUP BY i.codigo,
                    i.denominacion,
                    aaf.cantidad";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerIndicadorSalidaxCarta($alias, $query) {
        $query->addSelect('cti.idindicadorsalida');
        $query->leftJoin($alias . 'DatCartatecindustrial cti');
        return $query;
    }

}
