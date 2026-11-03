<?php 
class DatEvaldefprocesoevaluativoModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvaldefprocesoevaluativo $DatEvaldefprocesoevaluativo) 
    { 
            $DatEvaldefprocesoevaluativo->save();
    } 
 
   public function Actualizar(DatEvaldefprocesoevaluativo $DatEvaldefprocesoevaluativo) 
    { 
            $DatEvaldefprocesoevaluativo->save();
    } 
 
   public function Eliminar($DatEvaldefprocesoevaluativo) 
    { 
            $DatEvaldefprocesoevaluativo->delete();
    } 
	
	public function ExisteProcesoDefinido($denom) {
		$existe = DatEvaldefprocesoevaluativo::ExisteProcesoDefinido ( $denom );
		if ($existe)
			return true; 
			return false;
	}
 }

