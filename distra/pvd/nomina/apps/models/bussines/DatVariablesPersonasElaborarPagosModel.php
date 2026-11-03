<?php
class DatVariablesPersonasElaborarPagosModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function DatVariablesPersonasElaborarPagosModel() {
        parent::ZendExt_Model();
    }
 
    public function adicionarVariables($variables, $origenvariable, $idpersonaelaborarpagos, $idcargosocupados) {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $pos = 0;
        $coleccion = new Doctrine_Collection('DatVariablesPersonasElaborarPagos');
		foreach ($variables as $i => $v) {
			$coleccion[$pos]->origenvariable = $origenvariable;
			$coleccion[$pos]->idpersonaelaborarpagos = $idpersonaelaborarpagos;
			switch($origenvariable){
				case 1 : {
					$coleccion[$pos]->idconceptopercepciondescuento = $v;
					$coleccion[$pos]->idvariableauxconceptospdformasysistemaspago = null;
					$coleccion[$pos]->idvariableauxiliarformula = null;
					break;
				}
				case 2 : {
					$coleccion[$pos]->idconceptopercepciondescuento = null;
					$coleccion[$pos]->idvariableauxconceptospdformasysistemaspago = $v;
					$coleccion[$pos]->idvariableauxiliarformula = null;
					break;
				}
				case 3 : {
					$coleccion[$pos]->idconceptopercepciondescuento = null;
					$coleccion[$pos]->idvariableauxconceptospdformasysistemaspago = null;
					$coleccion[$pos]->idvariableauxiliarformula = $v;
					break;
				}
			}
			$coleccion[$pos]->idcargosocupados = $idcargosocupados;
			
			$pos++;
		}
        $coleccion->save();
        $conn->commit();
		return true;
    }

    
    public function guardarValoresVariables($arrVariablesValor) {
		$mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
       foreach($arrVariablesValor as $i => $v){	   
			$obj = Doctrine::getTable('DatVariablesPersonasElaborarPagos')->find($v->idvariablespersonaelaborarpagos);
			$obj->valor = $v->valor;
			$obj->save();
       }
       $conn->commit();
       return true;
    }
    
}
