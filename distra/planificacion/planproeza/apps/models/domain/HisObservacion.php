<?php

class HisObservacion extends BaseHisObservacion {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatDemanda', array('local' => 'iddemanda', 'foreign' => 'iddemanda'));
    }

    public function listarObservaciones($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'observacion') {
                    $condiciones[] = "upper(obs." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'iddemanda' || $datos['field'] == 'idusuario') {
                    $condiciones[] = "obs." . $datos['field'] . " = " . $datos['data']['value'] . " ";
                } else if ($datos ['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $condiciones[] = " obs.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $condiciones[] = " obs.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $condiciones[] = "  obs.fecha::date='{$fecha}'";
                    }
                }
            }
        }
//Fin de los filtros
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = "AND " . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                obs.idobservacion,
                obs.iddemanda,
                obs.fecha,
                obs.idusuario,
                obs.observacion,
                count(*) OVER() as total
              FROM 
                mod_planproeza.his_observacion obs
                WHERE obs.iddemanda={$params['iddemanda']} $WHERE ORDER BY obs.fecha DESC $delimitando ";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function eliminarObservacionesDadoDemanda($param) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE FROM 
            mod_planproeza.his_observacion 
          WHERE 
            iddemanda={$param['iddemanda']}";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return 1;
    }

}
