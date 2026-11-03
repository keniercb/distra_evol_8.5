<?php

class NomCausanoevaluado extends BaseNomCausanoevaluado {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($idcausanoevaluado) {
        return $this->conn->getTable('NomCausanoevaluado')->find($idcausanoevaluado);
    }

        public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausanoevaluado')->execute();
        return $result->toArray();
    }

    public function GetCantTotal($filtro = '') {//Devuelve la cantidad total que tiene la tabla
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('COUNT(idcausanoevaluado)')->from('NomCausanoevaluado');
            if (!empty($filtro)) {
				$query->addWhere("denominacion ILIKE '%$filtro%' ");
			}
			$arr = $result->fetchArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetPorLimite($limite = 15, $inicio = 0, $filtro) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausanoevaluado')->orderBy('idcausanoevaluado DESC')->limit($limite)->offset($inicio);
		if (!empty($filtro)) {
            $query->addWhere("denominacion ILIKE '%$filtro%' ");
        }
        return $result->fetchArray();
    }
	
	public function existe($denominacion,$cambio) {
		if($cambio){
			$query = new Doctrine_Query ( );
			$result = $query->select('denominacion')
				->from('NomCausanoevaluado')
				->where('denominacion = ? ', $denominacion)
				->execute();			
			if(count($result->toArray())>0){
				return true;			
			}
			return false;
		}
		return false;
    }
}

?>