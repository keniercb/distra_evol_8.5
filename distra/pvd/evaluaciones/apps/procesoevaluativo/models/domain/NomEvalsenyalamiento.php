<?php

class NomEvalsenyalamiento extends BaseNomEvalsenyalamiento {

    public function setUp() {
        parent::setUp();
        $this->hasMany('NomEvaltiposenyalamiento', array('local' => 'idtiposenyalamiento', 'foreign' => 'idtiposenyalamiento'));
        $this->hasOne('DatEvalprocesoresenyalamiento', array('local' => 'idsenyalamiento', 'foreign' => 'idsenyalamiento'));
    }

    public function Buscar($idsenyalamiento) {
        $temp = $this->conn->getTable('NomEvalsenyalamiento')->find($idsenyalamiento);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalsenyalamiento')->execute();
        return $result->toArray();
    }

    public function GetCantTotal() {//Devuelve la cantidad total que tiene la tabla
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('COUNT(idsenyalamiento)')->from('NomEvalsenyalamiento')->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetPorLimite($limite = 15, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalsenyalamiento')->orderBy('idsenyalamiento DESC')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function GetSenyalamientoPorIdTipo($idtiposenyalamiento = 1, $limite = 15, $inicio = 0) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('NomEvalsenyalamiento e')->where('e.idtiposenyalamiento = ?', $idtiposenyalamiento)
                            ->orderBy('e.idsenyalamiento DESC')->limit($limite)->offset($inicio)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            $arr = $result;
            return $arr;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function filtrarSenyalamientoPorIdTipo($filtro, $idtiposenyalamiento = 1, $limite = 15, $inicio = 0) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('NomEvalsenyalamiento e')
                            ->where("e.idtiposenyalamiento = '$idtiposenyalamiento' AND (e.denom ILIKE '%$filtro%' OR e.descripcion ILIKE '%$filtro%')")
                            ->orderBy('e.idsenyalamiento DESC')->limit($limite)->offset($inicio)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            $arr = $result;
            return $arr;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function cantidadTotalPorIdTipoFiltro($filtro, $idtiposenyalamiento) {
        try {
            $query = new Doctrine_Query ();
            $sqlWhere = "e.idtiposenyalamiento = '$idtiposenyalamiento' AND (e.denom ILIKE '%$filtro%' OR e.descripcion ILIKE '%$filtro%')";
            $result = $query->select('COUNT(idtiposenyalamiento)')
                    ->from('NomEvalsenyalamiento e')
                    ->where($sqlWhere)
                    ->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCantTotalPorIdTipo($idtiposenyalamiento) {
        try {
            $query = new Doctrine_Query ();
            $sqlWhere = "e.idtiposenyalamiento=$idtiposenyalamiento";
            $result = $query->select('COUNT(idtiposenyalamiento)')->from('NomEvalsenyalamiento e')->where($sqlWhere)->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerSenyalamientoDadoIdTipoSinLimite($idtiposenyalamiento = 1) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('NomEvalsenyalamiento e')->where('e.idtiposenyalamiento = ?', $idtiposenyalamiento)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ExisteDenomSenya($id, $denom) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalsenyalamiento e')
                ->where("e.idtiposenyalamiento = {$id} AND e.denom = '$denom'")
                ->execute();
        return $result->toArray();
    }

    public function ExisteDenomSenyaMod($id, $denom) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalsenyalamiento e')
                ->where("e.idsenyalamiento <> '$id' and e.denom = '$denom' ")
                ->execute();
        return $result->toArray();
    }

    public function SenyalamientoEnUso($idSen) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoresenyalamiento')
                ->where("idsenyalamiento='$idSen'")
                ->execute();
        return $result->toArray();
    }

}

//fin clase
?>


