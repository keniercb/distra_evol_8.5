<?php
class DatEvalindicadoresevaluacionModel extends ZendExt_Model {
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEvalindicadoresevaluacion $DatEvalindicadoresevaluacion) {
		$DatEvalindicadoresevaluacion->save ();
	}
	
	public function Actualizar(DatEvalindicadoresevaluacion $DatEvalindicadoresevaluacion) {
		$DatEvalindicadoresevaluacion->save ();
	}
	
	public function getPersonaEvaluacion($idersonaevaluacion){
		return $DatEvalindicadoresevaluacion = Doctrine::getTable('DatEvalindicadoresevaluacion')->find($idersonaevaluacion);		
	}
		
	public function Eliminar($idersonaevaluacion) {		
        $DatEvalindicadoresevaluacion =$this->getPersonaEvaluacion($idersonaevaluacion);
		$DatEvalindicadoresevaluacion->delete ();
	}
	
	public function existeIndicadoresEvaluacion($idpersonaevaluacion, $idindicadorplanilla){
		$existe = DatEvalindicadoresevaluacion::getIndicadorEvaluacion($idpersonaevaluacion, $idindicadorplanilla);
		if ($existe)
			return true;
		return false;
	}
	//Devuelve un objeto de tipo Doctrine Table
	public function obtenerIndicadorEvaluacion($idpersonaevaluacion, $idindicadorplanilla){
		$varAux = DatEvalindicadoresevaluacion::obtenerIndicadorEvaluacion($idpersonaevaluacion, $idindicadorplanilla);
		return $varAux;
	}
	//Devuelve un array con los valores
	public function getIndicadorEvaluacion($idpersonaevaluacion, $idindicadorplanilla){
		$varAux = DatEvalindicadoresevaluacion::getIndicadorEvaluacion($idpersonaevaluacion, $idindicadorplanilla);
		return $varAux;
	}

    public function eliminarPorPeriodoInd($idpersonaevaluacion)
    {
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('DatEvalindicadoresevaluacion')
                ->where('idpersonaevaluacion = ?', $idpersonaevaluacion)
                ->execute();
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {
                $r->exception = 1;
                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }
	
	
	

}

