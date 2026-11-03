<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
class RecnominaporestructuraController extends ZendExt_Controller_Secure {
    
    public function init() {
        parent::init();
    }
    
    public function recnominaporestructuraAction() {
        $this->render();
    }
    public function obtenernominapersonaporestructuraAction() {
        $nodo 			= $this->_getParam('nodo');
        $idelaborarpago 			= $this->_getParam('idelaborarpago');
        
        
        $arrC = $this->integrator->metadatos->BuscarCargosXIdestructuraSinDominio($nodo);
        $arrCargos = array();
        foreach($arrC as $k => $c){
			$arrCargos[] = $c;
		}
		$objNominaDatos = new DatNominaDatos();
		$arrNominas = $objNominaDatos->obtenerDatosNominaPorElaborarPago($idelaborarpago);
		print_r($arrNominas);die;
       
    }
    
    public function exportarnominapersonaporestructuraAction() {
        $identidad 			= $this->_getParam('identidad');
        $idelaborarpago 	= $this->_getParam('idelaborarpago');
        $idtipopago 		 	= $this->_getParam('idtipopago');
        
       
    }
    
   

}
