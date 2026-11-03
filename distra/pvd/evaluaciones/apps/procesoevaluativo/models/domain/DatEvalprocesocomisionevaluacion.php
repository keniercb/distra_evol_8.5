<?php
class DatEvalprocesocomisionevaluacion extends BaseDatEvalprocesocomisionevaluacion
 {
   public function setUp()
    {   parent::setUp();
         $this->hasMany('DatEvalcomisionevaluacion', array('local'=>'idcomisionevaluacion','foreign'=>'idcomisionevaluacion'));
         $this->hasOne('DatEvalprocesoevaluadores', array('local'=>'idprocesocomisionevaluacion','foreign'=>'idprocesocomisionevaluacion'));
    }

   public function Buscar($idprocesocomisionevaluacion)
    {
          $temp = $this->conn->getTable('DatEvalprocesocomisionevaluacion')->find($idprocesocomisionevaluacion);
           return $temp->toArray();
    }

   public function GetTodos()
    {
          $query = new Doctrine_Query ();
          $result = $query->from('DatEvalprocesocomisionevaluacion e')->execute ();
          return $result->toArray();
    }

	public function GetTodosDadoPreProceso($idpreproceso)
    {
          $query = new Doctrine_Query ();
          $result = $query->from('DatEvalprocesocomisionevaluacion e')->where('e.idpreprocesoevaluativo = ?', $idpreproceso)->execute ();
          return $result->toArray();
    }

   public function GetPorLimite($limite = 10,$inicio = 0)
    {
		$query = new Doctrine_Query ();
		$result = $query->from('DatEvalprocesocomisionevaluacion')->limit($limite = 10)->offset($inicio = 0)->execute ();
		return $result->toArray();
	}
	
	public function getComisionesAsociadas($idpreprocesoevaluativo, $idestructura, $limit = 10, $start = 0){
		$query = new Doctrine_Query ();
		$result = $query->select('pce.idprocesocomisionevaluacion, pce.idcomisionevaluacion, ce.denom as denom')
				->from('DatEvalprocesocomisionevaluacion pce')
				->innerJoin('pce.DatEvalcomisionevaluacion ce')
				->where("pce.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and pce.idestructura = {$idestructura}")
				->limit($limit)
				->offset($start)
				->execute();
		return $result->toArray();
	}
	
	public function getCantComisionesAsociadas($idpreprocesoevaluativo, $idestructura){
		$query = new Doctrine_Query ();
		$result = $query->select('pce.idprocesocomisionevaluacion, pce.idcomisionevaluacion, ce.denom as denom')
				->from('DatEvalprocesocomisionevaluacion pce')
				->innerJoin('pce.DatEvalcomisionevaluacion ce')
				->where("pce.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and pce.idestructura = {$idestructura}")
				->count();
		return $result;
	}
	
	public function getComisionesAsociadasCombo($idpreprocesoevaluativo, $idestructura){
		$query = new Doctrine_Query ();
		$result = $query->select('pce.idprocesocomisionevaluacion, pce.idcomisionevaluacion, ce.denom as denom')
				->from('DatEvalprocesocomisionevaluacion pce')
				->innerJoin('pce.DatEvalcomisionevaluacion ce')
				->where("pce.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and pce.idestructura = {$idestructura}")
				->execute();
		return $result->toArray();
	}
	
}//fin clase
?>


