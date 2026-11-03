<?php
class DatElementosReportesCertificacionesModel extends ZendExt_Model {

    public function DatElementosReportesCertificacionesModel() {
        parent::ZendExt_Model();
    }

    private function buscarElementoRepetido($arr, $id){
        foreach ($arr as $k => $v) {
            if($v['idelemento'] == $id)
                return true;
        }
        return false;        
    }
    
    public function adicionarElementosReportesCertificaciones($arregloElementos, $idreportescertificaciones, $aprobado) {

        $objERC = new DatElementosReportesCertificaciones();        
        $rElRepetidos = $objERC->devolverElementosqueCoinciden($idreportescertificaciones, $arregloElementos);

        $arrElementos = array();
        if(count($rElRepetidos) > 0){
            foreach($arregloElementos as $i => $e){
                if(!$this->buscarElementoRepetido($rElRepetidos, $e)){
                    $arrElementos[] = $e;
                }
            }
        }else{
          $arrElementos = $arregloElementos;
        }
        unset($arregloElementos);
        $arrIdsEl = array();
        foreach($arrElementos as $i => $e){
            $objE = new DatElementosReportesCertificaciones();
            $objE->idreportescertificaciones = $idreportescertificaciones;
            $objE->idelemento = $e;
            $objE->aprobado = $aprobado;
            $objE->save();
            $arrIdsEl[] = $objE->idelementosreportescertificaciones;
        }
        unset($arrElementos);
        if(count($arrIdsEl) > 0){
            $objRC = Doctrine::getTable('DatReportesCertificaciones')->find($idreportescertificaciones);
            $variables = $objRC->obtenerDatosConfVariables($objRC->idconfreportescertificaciones, 1);
            $objVERC = new DatVariablesElementosReportesCertificacionesModel();
            $objVERC->adicionarVariablesElementosReportesCertificaciones($arrIdsEl, $variables);
        }
        return true;
        
    }

    public function modificararrElementosReportesCertificaciones($idreportescertificaciones, $arregloObjDatos) {
			foreach($arregloObjDatos as $i => $o){
				$objEl = Doctrine::getTable('DatElementosReportesCertificaciones')->find($o->idelementosreportescertificaciones);
				$objEl->aprobado = ($o->aprobado == false ? 0 : 1);
				$objEl->save();
			}
			return true;
    }

    public function eliminarElementosReportesCertificaciones($idreportescertificaciones, $arrIdsElem) {
       $mg = Doctrine_Manager::getInstance();
       $conn = $mg->getCurrentConnection();
       $conn->beginTransaction();
       $r = Doctrine_Query::create()
                ->from('DatElementosReportesCertificaciones')
                ->whereIn('idelementosreportescertificaciones', $arrIdsElem)
                ->execute();
       
       $r->delete();
       $conn->commit();
       return true;
    }


}
