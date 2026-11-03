<?php

class IntegracionServices extends ZendExt_Model {

    public function VerificarIntegracionModulos($parametros){

        $objIntegracionModel = new CmpIntegracionModel();
        $arrayDatos = $objIntegracionModel->VerificarIntegracionModulos($parametros);

        return $arrayDatos;

    }


    public function CargarAreasNegocio($parametros){

        $objSistemasModel = new CmpSistemasModel();
        $arrayAreasNegocio = $objSistemasModel->CargarAreasNegocio($parametros);

        return $arrayAreasNegocio;

    }
    
}

