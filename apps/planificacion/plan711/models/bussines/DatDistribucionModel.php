<?php

class DatDistribucionModel extends ZendExt_Model {
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function MontoTotal($parametros){
        $result = DatDistribucion::MontoTotal($parametros);
        return $result;
    }
    
    public function listarDistribucion($parametros){
        $result = DatDistribucion::listarDistribucion($parametros);
        return $result;
    }
    
    public function  adicionarModificarDistr($paramestros, $distribuc){
        $result = DatDistribucion::adicionarModificarDistr($paramestros, $distribuc);
        return $result;
    }

}