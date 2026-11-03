<?php

class DatMotivoModificacionModel extends ZendExt_Model {
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function AdicionarMotivo($paramestros){
        //Los motivos de modificacion tendran un identificador tipo
        //1--será para los planes
        //2--será para las distribuciones
        //3--para las solicitudes
        $nuevomotivo = new DatMotivoModificacion();
        $nuevomotivo->motivo = $paramestros['motivo'];
        $nuevomotivo->usuario = $paramestros['usuario'];
        if($paramestros['tipo']==1){
            $nuevomotivo->identificador = ''.$paramestros['tipo'].'/'.$paramestros['idejercicio'].'/'.$paramestros['idp711'];
        }
        if($paramestros['tipo']==2){
            $nuevomotivo->identificador = ''.$paramestros['tipo'].'/'.$paramestros['idejercicio'].'/'.$paramestros['identidad'];
        }
        if($paramestros['tipo']==3){
            $nuevomotivo->identificador = ''.$paramestros['tipo'].'/'.$paramestros['idsolicitud711'];
        }
        $nuevomotivo->save();
    }
    
    public function listarModif($paramestros) {
        $result= DatMotivoModificacion::listarModif($paramestros);
        return $result;
    }

}