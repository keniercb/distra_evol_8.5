<?php

class NomEvalrecomendacion extends BaseNomEvalrecomendacion {

    public function setUp() {
        parent::setUp();
        $this->hasMany('NomEvaltiporecomendacion', array('local' => 'idtiporecomendacion', 'foreign' => 'idtiporecomendacion'));
        $this->hasOne('DatEvalprocesorecomendaciones', array('local' => 'idrecomendacion', 'foreign' => 'idrecomendacion'));
    }

    public function Buscar($idrecursoevaluativo) {
        $temp = $this->conn->getTable('NomEvalrecomendacion')->find($idrecursoevaluativo);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalrecomendacion')->execute();
        return $result->toArray();
    }

    public function GetCantTotal() {//Devuelve la cantidad total que tiene la tabla
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('COUNT(idrecomendacion)')->from('NomEvalrecomendacion')->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetPorLimite($limite = 15, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalrecomendacion')->orderBy('idrecomendacion DESC')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function GetRecomendacionNoAsociadas($limite = 15, $inicio = 0) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('NomEvalrecomendacion e')->where('e.idrecomendacion NOT IN (SELECT prec.idrecomendacion FROM dat_evalprocesorecomendaciones prec (prec.idrecomendacion))')->limit($limite)->offset($inicio)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            print_r($result);
            die;
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCantTotalNoAsociadas() {
        try {
            $query = new Doctrine_Query ();
            $sqlWhere = "'e.idrecomendacion NOT IN (SELECT prec.idrecomendacion FROM dat_evalprocesorecomendaciones prec)";
            $result = $query->select('COUNT(idrecomendacion)')->from('NomEvalrecomendacion e')->where($sqlWhere)->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerRecomendacionDadoIdTipoSinLimite($idtiporecomendacion = 1) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('NomEvalrecomendacion e')->where('e.idtiporecomendacion = ?', $idtiporecomendacion)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerRecomendacionPorIdTipo($idtiporecomendacion = 1, $limite = 15, $inicio = 0) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('NomEvalrecomendacion e')->where('e.idtiporecomendacion = ?', $idtiporecomendacion)
                            ->orderBy('e.idrecomendacion DESC')->limit($limite)->offset($inicio)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function buscarRecomendacionPorIdTipo($filtro, $idtiporecomendacion = 1, $limite = 15, $inicio = 0) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('NomEvalrecomendacion e')
                    ->where("e.idtiporecomendacion = '$idtiporecomendacion' AND (e.denom ILIKE '%$filtro%' OR e.descripcion ILIKE '%$filtro%')")
                    ->orderBy('e.idrecomendacion DESC')
                    ->offset($inicio)
                    ->limit($limite)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCantTotalPorIdTipoFiltro($filtro, $idtiporecomendacion) {
        try {
            $query = new Doctrine_Query ();
            $sqlWhere = "e.idtiporecomendacion=$idtiporecomendacion AND (e.denom ILIKE '%$filtro%' OR e.descripcion ILIKE '%$filtro%')";
            $result = $query->select('COUNT(idrecomendacion)')->from('NomEvalrecomendacion e')->where($sqlWhere)->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCantTotalPorIdTipo($idtiporecomendacion) {
        try {
            $query = new Doctrine_Query ();
            $sqlWhere = "e.idtiporecomendacion=$idtiporecomendacion";
            $result = $query->select('COUNT(idrecomendacion)')->from('NomEvalrecomendacion e')->where($sqlWhere)->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ExisteDenomRecon($denom) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalrecomendacion e')
                ->where("e.denom = '$denom'")
                ->execute();
        return $result->toArray();
    }

    public function RecomendacionEnUso($idRec) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesorecomendaciones')
                ->where("idrecomendacion='$idRec'")
                ->execute();
        return $result->toArray();
    }

}

//fin clase
?>


