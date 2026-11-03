<?php

include_once (Zend_Registry::get('config')->dir_aplication . '/planmeta/lib/PHPExcel/Classes/PHPExcel.php');
include_once (Zend_Registry::get('config')->dir_aplication . '/planmeta/lib/PHPExcel/PHPExcel/Classes/PHPExcel/IOFactory.php');

class HisTrazasinversionesModel extends ZendExt_Model {

    public function getTrazasInversiones($params) {
        return HisTrazasinversiones::getTrazasInversiones($params);
    }
    
    public function seveTrazasInversiones($componente, $accion, $param, $idInversion, $des, $user,$denom,$inversion,$idestructura) {
        return HisTrazasinversiones::seveTrazasInversiones($componente, $accion, $param, $idInversion, $des, $user,$denom,$inversion,$idestructura);
    }

    
        public function cargarAccionesTraza() {
        $datos = HisTrazasinversiones::listarAccionesTraza();
        return $datos;
    }
    
    
}