<?php

class DatEvalmodelo extends BaseDatEvalmodelo {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalhecho', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('NomEvalestado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('DatEvalplanillasevaluativas', array('local' => 'idplanilla', 'foreign' => 'idplanilla'));
        $this->hasMany('DatEvalescala', array('local' => 'idescala', 'foreign' => 'idescala'));
    }

    public function Buscar($idmodelo) {
        $temp = $this->conn->getTable('DatEvalmodelo')->find($idmodelo);
        return $temp->toArray();
    }

    public function getModeloById($idmodelo) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalmodelo')->where('idmodelo = ?', $idmodelo)->execute();
        return $result->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalmodelo')->execute();
        return $result->toArray();
    }

    public function GetByLimite($limit, $start) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalmodelo')
                ->limit($limit)
                ->offset($start)
                ->execute();
        return $result->toArray();
    }

    public function GetCantTotal() {
        try {
            $query = new Doctrine_Query ( );
            $result = $query->select('COUNT(idmodelo)')->from('DatEvalmodelo')->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetPorLimite($limite = 100, $inicio = 0) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalmodelo')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function ObtenerModeloByPlanilla($idplanilla) {
        //print_r($idplanilla);die;
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalmodelo m')->where("m.idplanilla  = '$idplanilla'  and m.idestado = '1'")->execute();

        return $result->toArray();
    }

    //Devuelve las modelos asociados a una planilla evaluativa
    public function getModelosPorPlanilla($idplanilla, $inicio, $limite) {
        try {
            $query = new Doctrine_Query ( );
            $result = $query->select('m.idmodelo, m.denom, m.descripcion,m.fechainicio,m.fechafin,e.idestado as idestado,e.denom as estado, m.idplanilla, es.denom as escala, m.idescala, m.idexpresionmatematica')
                            ->from('DatEvalmodelo m')
                            ->leftJoin('m.NomEvalestado e')
                            ->leftJoin('m.DatEvalescala es')
                            ->where('m.idplanilla = ?', $idplanilla)
                            ->limit($limite)
                            ->offset($inicio)
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    //Devuelve la cantidad de modelos total por planilla
    public function getCantidadModelosPorPlanilla($idplanilla) {
        $query = new Doctrine_Query ( );
        return $query->select('m.idmodelo, m.denom, m.descripcion,m.fechainicio,m.fechafin,e.denom as estado, m.idplanilla, es.denom as escala, m.idexpresionmatematica')
                        ->from('DatEvalmodelo m')
                        ->leftJoin('m.NomEvalestado e')
                        ->leftJoin('m.DatEvalescala es')
                        ->where('m.idplanilla = ?', $idplanilla)
                        ->count();
    }

    public function CantidadHechosPorModelo($idmodelo) {
        $query = new Doctrine_Query ( );
        return $query->select('ee.idhecho, ee.idmodelo, ee.idvalorescualitativos, nom.denom,ee.orden')
                        ->from('DatEvalhecho ee')
                        ->innerJoin('ee.NomEvalvalorescualitativos nom')
                        ->where('ee.idmodelo = ?', array($idmodelo))
                        ->count();
    }

    //Devuelve modelos de una misma denominaci�n
    public function ExisteModelo($denom, $idplanilla) {

        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalmodelo m')->where("m.denom = '$denom' and m.idplanilla ='$idplanilla'")->execute();
        return $result->toArray();
    }

    //Si el modelo est� activo o inactivo no se puede eliminar
    public function ModeloEnUso($idmodelo) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalmodelo m')->where("m.idmodelo='$idmodelo' and m.idestado != '0'")->execute();
        return $result->toArray();
    }

    public function getModelosActivosPorPlanilla($idplanilla) {
        try {
            $query = new Doctrine_Query ( );
            $result = $query->select('m.idmodelo, m.denom, m.descripcion, m.fechainicio, m.fechafin, e.denom as estado,
					m.idplanilla, es.denom as escala, m.idescala, m.idexpresionmatematica')
                    ->from('DatEvalmodelo m')
                    ->leftJoin('m.NomEvalestado e')
                    ->leftJoin('m.DatEvalescala es')
                    ->where("m.idplanilla = {$idplanilla} and e.idestado = 1")
                    ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function verifExiste($denom) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('DatEvalmodelo m')
                    ->where("m.denom=?", $denom)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}