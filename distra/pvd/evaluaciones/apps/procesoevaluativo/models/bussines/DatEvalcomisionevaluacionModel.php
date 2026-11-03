<?php 
class DatEvalcomisionevaluacionModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalcomisionevaluacion $DatEvalcomisionevaluacion) 
    { 
            $DatEvalcomisionevaluacion->save();
    } 
 
   public function Actualizar(DatEvalcomisionevaluacion $DatEvalcomisionevaluacion) 
    { 
            $DatEvalcomisionevaluacion->save();
    } 
 
	public function Eliminar($idcomisionevaluacion){
		$objComision = Doctrine::getTable('DatEvalcomisionevaluacion')->find($idcomisionevaluacion);
		$objComision->delete();
	}
	
	public function comisionEnUso($idcomisionevaluacion){
		$query = new Doctrine_Query ( );
		$result = $query->from ('DatEvalprocesocomisionevaluacion ce')->where ("ce.idcomisionevaluacion=$idcomisionevaluacion" )->execute();
		$result = $result->toArray ();
		if($result)
			return true;
		return false;
	}
	
	
 }

