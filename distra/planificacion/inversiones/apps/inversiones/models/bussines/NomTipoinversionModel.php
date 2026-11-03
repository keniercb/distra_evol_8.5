<?php

class NomTipoinversionModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function obtenerArrayIdDatosClaNom($param) {

        $datos = NomTipoinversion::listarprincipal($param);
        return $datos;
    }

    public function mismadenominacion($param) {
        $denomExiste = NomTipoinversion::denomExistente($param);
        return (count($denomExiste) > 0) ? true : false;
    }


    /*public function cargarDocPrimarios($estructura) {
        //$datos = NomTipoinversion::cargarDocPrimarios($param);

        $idsubsistema = 30;
        //$estructura = $this->global->Estructura->idestructura;

        //print_r($estructura);die;
        $datos = $this->integrator->datosmaestros->documentosPorSubsistemaEntidad($idsubsistema, $estructura, array());
        return $datos;
    }*/

    public function adicionarClasificacionInv($params) {
        /* 		if($params['idtipoinversion']!=""){
          $objdatonomenclador->idtipoinversion = $params['idtipoinversion'];
          } */

        $objdatonomenclador = new NomTipoinversion();

        $objdatonomenclador->idformatoetapa = $params['idformatoetapa'];
        $objdatonomenclador->denominacion = $params['denominacion'];

        if (!NomTipoinversion::denomExistente($params['denominacion'])) {
           NomTipoinversion::adicionartipodeinversion($objdatonomenclador);
            return true;
        }else{
            return false;
        }
    }

    public function eliminarTipoInversion($inversiones) {
        $model = new NomTipoinversion();
        $result = $model->eliminarTipoInversion($inversiones);
    }


    public function guardarDocumentoTipoInversion($params) {

        $model = new NomTipoinversion();
        $idTiposInv = $params['idTiposInversion'];
        $iddoc = $params['iddocumento'];

        foreach($idTiposInv as $tipo){

            $result = $model->ActualizarTipoInversion($iddoc,$tipo);
        }
        return $result;
    }

}

