<?php

class DatFlujotrabajoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function cargarFlujotrabajo($param) {
        return DatFlujotrabajo::cargarFlujosTrab($param);
    }
    
    public function salvarFlujo($parametros){
         DatFlujotrabajo::insertarNuevoFlujo($parametros);
    }
    
    public function cargarFlujos($parametros){
          $obj = new DatFlujotrabajo();
          $resulta = $obj->devolverFlujos($parametros);
        $resultados['data'] = $resulta['datos'];
        $resultados['cant'] = $resulta['cantidad'];
        return $resultados;
    }
    
    public function setFlujos($parametros){
        DatFlujotrabajo::setFlujo($parametros);
    }
    
    public function eliminarFlujos($parametros){
      return DatFlujotrabajo::deleteFlujo($parametros);
    }
    
    
}
