<?php

class HisObservacioncontrol extends BaseHisObservacioncontrol {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatDemandatiempo', array('local' => 'iddemandatiempo', 'foreign' => 'iddemandatiempo'));
    }

    public function listarObservacionesControl($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'observacion') {
                    $condiciones[] = "upper(obs." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else if ($datos['field'] == 'identidad') {
                    $condiciones[] = " obs.identidad =" . $datos['data']['value'];
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
        $whereXTipo = "";
        //si es empresa o rector buscar las observaciones de sus entidades hijas
        if ($params['tipo'] == 2 || $params['tipo'] == 3) {
            $whereXTipo = "AND obs.identidad IN ({$params['entidades']}) AND obs.iddemanda={$params['iddemanda']}";
        } elseif ($params['tipo'] == 1) {
            //si es taller
            $whereXTipo = "AND obs.iddemandatiempo={$params['iddemandatiempo']} ";
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                obs.idobservacioncontrol,
                obs.iddemandatiempo,
                obs.identidad,
                obs.fecha,
                obs.idusuario,
                obs.observacion,
                count(*) OVER() as total
              FROM 
                mod_planproeza.his_observacioncontrol obs
                WHERE 
                obs.idmes = {$params['idmes']} $whereXTipo
                $WHERE ORDER BY obs.fecha DESC $delimitando ";
//        print_r($query);die;
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarObservacionesReportes($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                obs.idobservacioncontrol,
                obs.iddemandatiempo,
                obs.identidad,
                obs.fecha,
                obs.idusuario,
                obs.observacion,
                obs.idmes,
                dn.denominacion as mes,
                count(*) OVER() as total
              FROM 
                mod_planproeza.his_observacioncontrol obs
                INNER JOIN mod_planificacion.nom_datosnomenclador dn 
                ON(dn.iddatosnomenclador=obs.idmes)
                WHERE obs.iddemanda={$params['iddemanda']}
                AND LOWER(dn.uridatosnomenclador) IN({$params['urimes']})
                ORDER BY obs.idmes";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
