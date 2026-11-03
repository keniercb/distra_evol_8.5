<?php
class DatEvaldominioevaluativo extends BaseDatEvaldominioevaluativo
 {
   public function setUp()
    {   parent::setUp();
         $this->hasOne('DatEvalplanillasevaluativas', array('local'=>'iddominioevaluativo','foreign'=>'iddominioevaluativo'));
         $this->hasMany('DatEvaldominioevaluativo', array('local'=>'idpadre','foreign'=>'iddominioevaluativo'));
         $this->hasOne('DatEvaldominioevaluativo', array('local'=>'iddominioevaluativo','foreign'=>'idpadre'));
         $this->hasMany('DatEvalrecursoevaluativo', array('local'=>'idrecursoevaluativo','foreign'=>'idrecursoevaluativo'));
         $this->hasOne('NomEvalindicadortexto', array('local'=>'iddominioevaluativo','foreign'=>'iddominioevaluativo'));

    }

   public function Buscar($iddominioevaluativo)
    {
        $query = new Doctrine_Query ( );
        $temp = $query ->from ( 'DatEvaldominioevaluativo e' )->where ( "e.iddominioevaluativo = ?", $iddominioevaluativo )->execute()->toArray ();
         return $temp;
    }

   public function GetTodos() {
          $query = new Doctrine_Query ();
          $result = $query->from('DatEvaldominioevaluativo')->execute ();
          return $result->toArray();

    }

    public function GetDominioEvaluativo($iddominio, $idrecurso) {
        try {
            $query = new Doctrine_Query ();
            $sqlWhere = "";
            if($iddominio == -1)
                $sqlWhere = "e.idrecursoevaluativo = $idrecurso and e.iddominioevaluativo = e.idpadre";
            else
                $sqlWhere = "e.idpadre=$iddominio and e.idrecursoevaluativo=$idrecurso and e.iddominioevaluativo <> e.idpadre";

            $result = $query->from ('DatEvaldominioevaluativo e')
                    ->where($sqlWhere)
                    ->Orderby('e.denom')
                    ->execute ();
            $arr = $result->toArray ();
            return $arr;
        } catch ( Doctrine_Exception $e ) {
                return $e;
        }
    }

    public function buscarDominioEvaluativo($denom, $idrecurso){
        $q = new Doctrine_Query ();
        $result = $q->from ('DatEvaldominioevaluativo e')
                    ->where("e.denom ilike '%$denom%' and e.idrecursoevaluativo = $idrecurso")
                    ->Orderby('e.denom')
                    ->execute ();
            $arr = $result->toArray ();
            return $arr;
    }

    public function GetMaxId() {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('MAX(iddominioevaluativo)')->from('DatEvaldominioevaluativo')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['MAX'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
    public function GetPorLimite($limite = 10,$inicio = 0)
    {
          $query = new Doctrine_Query ();
          $result = $query->from('DatEvaldominioevaluativo')->limit($limite)->offset($inicio)->execute ();
          return $result->toArray();

    }

	//Devuelve la cantidad total que tiene la tabla
	public function GetCantTotal() {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(iddominioevaluativo)')->from ('DatEvaldominioevaluativo')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}

    public function verificaruso($iddominio){
        $q = new Doctrine_Query();
        try {
            $result = $q->select('ded.iddominioevaluativo, dep.idplanilla as idplanilla')
            ->from('DatEvaldominioevaluativo ded')
            ->leftjoin('ded.DatEvalplanillasevaluativas dep')
            ->where("ded.iddominioevaluativo=?",$iddominio)
            ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            die($e);
        }
    }

}