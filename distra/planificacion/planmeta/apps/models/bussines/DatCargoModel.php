<?php

class DatCargoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function insertardatCargo($datCargo) {
        $datCargo->save();
    }

    public function modificardatCargo($datCargo) {
        $datCargo->save();
    }

    public function eliminardatCargo($datCargo) {
        $datCargo->delete();
    }

    public function adicionar_cargo($params) {
        $fechaActual = date("d-m-Y H:i:s");
        foreach ($params['cargos'] as $cargo) {


            $nuevocargo = new DatActividadcargo();
            $nuevocargo->idactividad = $params['idactividad'];
            $nuevocargo->idcargo = $cargo->idnomcargo;
            $nuevocargo->cantidad = 1;
            $nuevocargo->duracion = 1;
            $nuevocargo->idusuario = $params['idusuario'];
            $nuevocargo->fecha = $fechaActual;
            $nuevocargo->save();
        }
        return true;
    }

    public function modificar_cargo($params) {
        $fechaActual = date("d-m-Y H:i:s");
        foreach ($params['cargos'] as $key => $cargo) {

            $viejocargo = Doctrine::getTable('DatActividadcargo')->findByDql("idactividad = {$params['idactividad']} AND  idcargo={$cargo->idcargo}");

            $viejocargo[0]->cantidad = $cargo->cantidad;
            $viejocargo[0]->duracion = $cargo->duracion;
            $viejocargo[0]->fecha = $fechaActual;
            $viejocargo[0]->idusuario = $params['idusuario'];
            $viejocargo[0]->save();
        }
        return true;
    }

    public function eliminarvarios_cargos($params) {
        $query = Doctrine_Query::create();
        $query->delete('DatActividadcargo')
                ->from('DatActividadcargo')
                ->addWhere('idactividad = ?', $params['idactividad'])
                ->whereIn('idcargo', $params['cargos']);
        $query->execute();
        return true;
    }

    public function listarCargos($params) {
        return DatActividadcargo::listarCargos($params);
    }

    public function listarCargosAddCargos($params) {
        $denomcargo = "";
        $filtroVisible = "";
        $filtroAbreviatura = "";
        $filtroActual = "";

        foreach ($params['filtros'] as $key => $value) {
            if ($value['field'] == "denominacion") {
                $denomcargo = $value['data']['value'];
            }
            if ($value['field'] == "abreviatura") {
                $filtroAbreviatura = $value['data']['value'];
            }
            if ($value['field'] == "actual") {
                $filtroActual = $value['data']['value'];
            }
            if ($value['field'] == "visible") {
                $filtroVisible = $value['data']['value'];
            }
        }
        $cargosactividad = self::listarCargos(array('idactividad' => $params['idactividad'], 'start' => 0));
        $idcargos = array();
//        
//        Esta version es para codigo
        $idcargos = array_map(function ($each) {

        return $each['idcargo'];

        }, $cargosactividad);
        //$idcargos = array_column($cargosactividad, 'idcargo');

        $cargosNoRelacionados = array();
        foreach ($params['cargos'] as $key => $value) {
            $pos = array_search($value['idnomcargo'], $idcargos);
            if ($pos === FALSE) {
                $cargosNoRelacionados[] = $value;
            }
        }


        $cargosFiltrados = array();
        $flagFilter = false;
        if ($filtroVisible != "" || $filtroActual != "" || $denomcargo != "" || $filtroAbreviatura != "") {
            $flagFilter = true;
            foreach ($cargosNoRelacionados as $key => $value) {
                if (($filtroVisible == "" || $value['visible'] === $filtroVisible) && ($filtroActual == "" || $value['actual'] === $filtroActual) && ($denomcargo == "" || stripos($value['denominacion'], $denomcargo) !== FALSE) && ($filtroAbreviatura == "" || stripos($value['abreviatura'], $filtroAbreviatura) !== FALSE)) {
                    $cargosFiltrados[] = $value;
                }
            }
        }
        if (empty($cargosFiltrados) && $flagFilter == false) {
            $cargosFiltrados = $cargosNoRelacionados;
        }

        return $cargosFiltrados;
    }

}
