<?php

class ConfTiempoxnomenclador extends BaseConfTiempoxnomenclador {

    public function setUp() {
        parent::setUp();
    }

    public function existeConfRangoFechas($params) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT count (dn.iddatosnomenclador)
                     FROM mod_plancentral.dat_categoriatiponomenclador ctn
                          INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (
                            ctn.idtiponomenclador = dn.idtiponomenclador)
                             INNER JOIN mod_plancentral.conf_tiempoxnomenclador t ON (
                            ctn.idejercicio=t.idejercicio and t.iddatosnomenclador=dn.iddatosnomenclador)
                     where ctn.idcategoria = {$params['idcategoria']} and
                           ctn.idejercicio = {$params['idejercicio']} and
                           dn.denominacion != '-'";
        $result = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function cargarTiposNomencladorEjercicioCategoria($params) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = " SELECT DISTINCT ctn.idtiponomenclador,
                                tn.denominacion
                         FROM mod_plancentral.dat_categoriatiponomenclador ctn
                              INNER JOIN mod_planificacion.nom_tiponomenclador tn ON (
                                ctn.idtiponomenclador = tn.idtiponomenclador)
                         where ctn.idejercicio = {$params['idejercicio']}";
        $result = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarRangoFechaEjercicioNomenclador($params) {
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $WHERE = "";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {

                if ($datos['field'] == 'denominacion') {
                    $WHERE .= " AND upper(dn.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'fechainicio') {
                    $fechainicio = explode('/', $datos ['data']['value']);
                    $fechainicio = $fechainicio[1] . '/' . $fechainicio[0] . '/' . $fechainicio[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $WHERE .= "AND  f.fechainicio::date<'{$fechainicio}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $WHERE .= "AND  f.fechainicio::date>'{$fechainicio}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $WHERE .= "AND  f.fechainicio::date='{$fechainicio}'";
                    }
                } elseif ($datos ['field'] == 'fechafin') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $WHERE .= "AND  f.fechafin::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $WHERE .= "AND  f.fechafin::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $WHERE .= "AND  f.fechafin::date='{$fechafin}'";
                    }
                }
            }
        }//Fin de los filtros
        $conn = Doctrine_Manager::connection();
        $sqlQuery = " SELECT dn.iddatosnomenclador,
                       dn.denominacion,
                       f.fechafin,
                       f.fechainicio,
                       f.idtiempoxnomenclador,
                       count(*) OVER () AS total
                FROM mod_planificacion.nom_tiponomenclador tn
                     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (
                       tn.idtiponomenclador = dn.idtiponomenclador)
                     LEFT JOIN mod_plancentral.conf_tiempoxnomenclador f ON (
                       dn.iddatosnomenclador = f.iddatosnomenclador AND f.idejercicio = {$params['idejercicio']})
                WHERE tn.idtiponomenclador = {$params['idtiponomenclador']} AND
                      dn.denominacion <> '-' $WHERE
                ORDER BY dn.iddatosnomenclador $delimitando";
        $result = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function verificarExisteTiempoNom($iddatosnom, $idejercicio) {
        $objConfTiempoNom = Doctrine::getTable('ConfTiempoxnomenclador')
                ->findByDql(
                "iddatosnomenclador = $iddatosnom AND idejercicio = $idejercicio "
        );
        return $objConfTiempoNom->toArray();
    }

    public function eliminarConfiguracionTiempoEjercicio($idejercicio) {
        $sqlQuery = "DELETE FROM
                        mod_planificacion.conf_tiempoxnomenclador
                      WHERE
                        idejercicio = $idejercicio";
        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
    }

    public function obtenerFechaFin($params) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT t.fechafin
                             FROM mod_planificacion.conf_tiempoxnomenclador t
                     where t.idejercicio = {$params['idejercicio']} and
                                t.iddatosnomenclador = {$params['idmes']}";
        $result = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

}

?>
