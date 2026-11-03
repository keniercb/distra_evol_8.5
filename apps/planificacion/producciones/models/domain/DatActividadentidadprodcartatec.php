<?php

class DatActividadentidadprodcartatec extends BaseDatActividadentidadprodcartatec {

    public function Setup() {
        parent::setUp();
    }

    public function buscarXEjercicio($identidad, $idactividad, $idejercicio, $conAsocManual = false, $conAsocAuto = false, $conAsocProd = false, $conAsocProdcartatec = false) {
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActividadentidad ae');
        if ($conAsocManual) {
            $queryBuscar->leftJoin('ae.DatActividadentidadmanual aem');
        }
        if ($conAsocAuto) {
            $queryBuscar->leftJoin('ae.DatActividadentidadautomatico aea');
        }
        if ($conAsocProd) {
            $queryBuscar->leftJoin('ae.DatActividadentidadproduccion aep');
        }
        if ($conAsocProdcartatec) {
            $queryBuscar->leftJoin('ae.DatActividadentidadprodcartatec aepct');
        }
        $queryBuscar->where("ae.identidad=? AND ae.idactividad=? AND ae.idejercicio=?", array($identidad, $idactividad, $idejercicio));
        $result = $queryBuscar->execute();
        return $result;
    }

    public function listarActividadesProduccion($params) {
        $addWhere = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " AND act." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $addWhere .= " AND upper(act." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else if ($datos['field'] == 'plazo' || $datos['field'] == 'duracion' /* || $datos['field'] == 'porciento'  || $datos['field'] == 'numero' */) {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $addWhere .= " AND ctact." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } else if ($datos['field'] == 'idetapa') {
                    $addWhere .= " AND ctact.idetapa = " . $datos['data']['value'] . " ";
                } else if ($datos['field'] == 'diacero') {
                    $addWhere .= " AND ctact." . $datos['field'] . " =" . $datos['data']['value'] . " ";
                } else if ($datos['field'] == 'nivelactividadproduccion') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $addWhere .= " AND actprod." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } else if ($datos ['field'] == 'fechainicio') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND actprod.fechainicio::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND actprod.fechainicio::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND actprod.fechainicio::date='{$fechafin}'";
                    }
                } else if ($datos ['field'] == 'fechafin') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND actprod.fechafin::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND actprod.fechafin::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND actprod.fechafin::date='{$fechafin}'";
                    }
                } else if ($datos['field'] == 'servicio') {
                    if ($datos['data']['value'] == 1)
                        $addWhere .= " AND serv.idservicio IS NOT NULL ";
                    else
                        $addWhere .= " AND serv.idservicio IS NULL ";
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT ctact.idcartatecnologicaactividad,
                        act.codigo,
                        act.denominacion,
                        act.descripcion,
                        ctact.plazo,
                        ctact.duracion,
                        ctact.idetapa,
                        ctact.diacero,
                        ctact.idcartatecnologicaactividad,
                        COALESCE(actprod.nivelactividadproduccion, 0) as nivelactividadproduccion,
                        actprod.fechainicio,
                        actprod.fechafin,
                        serv.idservicio as servicio,
                        actprod.idactividadentidadprodcartatec,
                        count(*) over() as total
                 FROM mod_spouam.dat_cartatecnologicaactividad ctact
                      INNER JOIN mod_spouam.dat_cartatecnologica ct ON (ct.idcartatecnologica =
                        ctact.idcartatecnologica)
                      INNER JOIN mod_spouam.dat_aplicacioncartatec prod ON (
                        ctact.idcartatecnologica = prod.idcartatecnologica)
                      INNER JOIN mod_planificacion.nom_actividad act ON (act.idactividad =
                        ctact.idactividad)
                      LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec actprod ON (
                        ctact.idcartatecnologicaactividad = actprod.idcartatecnologicaactividad
                        AND actprod.idaplicacioncartatec = prod.idaplicacioncartatec)
                      LEFT JOIN mod_spouam.dat_servicio serv ON (
                        ctact.idcartatecnologicaactividad = serv.idcartatecnologicaactividad AND
                        prod.idaplicacioncartatec = serv.idaplicacioncartatec)
                 WHERE prod.idaplicacioncartatec = {$params['idaplicacioncartatec']} {$addWhere}
                 ORDER BY ctact.plazo,act.codigo $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function eliminarNivelesProduccion($idaplicacioncartatec) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE FROM 
                    mod_spouam.dat_actividadentidadprodcartatec 
                  WHERE 
                    idaplicacioncartatec = $idaplicacioncartatec";
        $conn->execute($query);
    }

    public function obtenerNivelesProduccion($idproduccion) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    na.idactividadentidadprodcartatec,
                    na.nivelactividadproduccion,
                    na.idactividadentidadprodcartatec,
                    na.fechainicio,
                    na.fechafin,
                    na.idcartatecnologicaactividad,
                    ca.duracion
                  FROM  mod_spouam.dat_actividadentidadprodcartatec na
                       INNER JOIN mod_spouam.dat_cartatecnologicaactividad ca on (
                            ca.idcartatecnologicaactividad = na.idcartatecnologicaactividad)
                    where na.idaplicacioncartatec=$idproduccion";
        $res = $conn->execute($sql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function obtenerRecursos($idactividad, $na, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    idindicador,
                    necesidad * $na as cantidad
                  FROM 
                    mod_planificacion.dat_norma 
                    where idejercicio=$idejercicio and idactividad=$idactividad";
        $res = $conn->execute($sql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
