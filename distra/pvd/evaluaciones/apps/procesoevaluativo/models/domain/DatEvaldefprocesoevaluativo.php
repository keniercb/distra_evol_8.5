<?php

class DatEvaldefprocesoevaluativo extends BaseDatEvaldefprocesoevaluativo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEvalplanillasevaluativas', array('local' => 'idplanilla', 'foreign' => 'idplanilla'));
        $this->hasOne('NomEvalperiodoevaluativo', array('local' => 'idperiodoevaluativo', 'foreign' => 'idperiodoevaluativo'));
        $this->hasOne('NomEvaltipoprocesoevaluativo', array('local' => 'idtipoprocesoevaluativo', 'foreign' => 'idtipoprocesoevaluativo'));
        $this->hasOne('DatEvalpreprocesoevaluativo', array('local' => 'iddefprocesoevaluativo', 'foreign' => 'iddefprocesoevaluativo'));
        $this->hasOne('DatProcesonotif', array('local' => 'iddefprocesoevaluativo', 'foreign' => 'iddefprocesoevaluativo'));
        $this->hasMany('DatEvaldefprocesoplanillas', array('local' => 'iddefprocesoevaluativo', 'foreign' => 'iddefprocesoevaluativo'));
        $this->hasMany('DatEvalescala', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasMany('DatNivelreclamacion', array('local' => 'iddefprocesoevaluativo', 'foreign' => 'iddefprocesoevaluativo'));
    }

    public function Buscar($iddefprocesoevaluativo)
    {
        $temp = $this->conn->getTable('DatEvaldefprocesoevaluativo')->find($iddefprocesoevaluativo);
        return $temp->toArray();
    }

    public function ExisteProcesoDefinido($denom)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvaldefprocesoevaluativo m')->where("m.denom = '$denom'")->execute();
        return $result->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvaldefprocesoevaluativo')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvaldefprocesoevaluativo')->limit($limite)->offset($inicio)->execute();

        return $result->toArray();
    }

    public function GetCantTotal()
    { //Devuelve la cantidad total que tiene la tabla
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('COUNT(iddefprocesoevaluativo)')->from('DatEvaldefprocesoevaluativo')->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function SearchPlanilla($idplanilla)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvaldefprocesoevaluativo')
            ->where("idplanilla = '$idplanilla'")
            ->execute();
        return $result->toArray();
    }

    public function ObtenerTodoDeTodos($inicio, $limite)
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('def.iddefprocesoevaluativo,def.idescala, def.denom, def.descripcion, tp.idtipoprocesoevaluativo as idtipoprocesoevaluativo,
				def.fechacomienzo, def.opinionevaluado, def.puedereclamar, p.idperiodoevaluativo as idperiodoevaluativo, p.periodo as periodo, tp.denom as tipoproceso, dpn.idprocesonotif as idprocesonotif, dpn.asunto as asunto, dpn.mensaje as mensaje, dpn.remitente as remitente, dee.denom as denomescala')
                ->from('DatEvaldefprocesoevaluativo def')
                ->innerJoin('def.NomEvalperiodoevaluativo p')
                ->innerJoin('def.NomEvaltipoprocesoevaluativo tp')
                ->leftJoin('def.DatProcesonotif dpn')
                ->leftJoin('def.DatEvalescala dee')
                ->orderBy('def.iddefprocesoevaluativo DESC')
                ->limit($limite)
                ->offset($inicio)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerTodoDeTodosFiltro($filtro, $start, $limit)
    {

        try {
            $query = new Doctrine_Query ();
            $result = $query->select('def.iddefprocesoevaluativo,def.idescala, def.denom, def.descripcion, tp.idtipoprocesoevaluativo as idtipoprocesoevaluativo,
				def.fechacomienzo, def.opinionevaluado, def.puedereclamar, p.idperiodoevaluativo as idperiodoevaluativo, p.periodo as periodo, tp.denom as tipoproceso,
				 dpn.idprocesonotif as idprocesonotif, dpn.asunto as asunto, dpn.mensaje as mensaje, dpn.remitente as remitente,dee.denom as denomescala')
                ->from('DatEvaldefprocesoevaluativo def')
                ->innerJoin('def.NomEvalperiodoevaluativo p')
                ->innerJoin('def.NomEvaltipoprocesoevaluativo tp')
                ->leftJoin('def.DatProcesonotif dpn')
                ->leftJoin('def.DatEvalescala dee')
                ->where("def.denom ILIKE '%$filtro%' AND def.idperiodoevaluativo = p.idperiodoevaluativo and def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo")
                ->orderBy('def.iddefprocesoevaluativo DESC')
                ->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCantTotalFiltro($filtro)
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('COUNT(iddefprocesoevaluativo)')
                ->from('DatEvaldefprocesoevaluativo')
                ->from('DatEvaldefprocesoevaluativo def')
                ->innerJoin('def.NomEvalperiodoevaluativo p')
                ->innerJoin('def.NomEvaltipoprocesoevaluativo tp')
                ->leftJoin('def.DatProcesonotif dpn')
                ->where("def.denom ILIKE '%$filtro%' AND def.idperiodoevaluativo = p.idperiodoevaluativo and def.idtipoprocesoevaluativo = tp.idtipoprocesoevaluativo")
                ->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerTodosIdPlanillas()
    {
        $query = new Doctrine_Query ();
        $result = $query->select('idplanilla')->from('DatEvaldefprocesoevaluativo')->execute();
        return $result->toArray();
    }

    public function getRecomendacionesNotSelected($inicio, $limite, $idtiporecomendacion, $iddefprocesoevaluativo)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalrecomendacion nom')->where("nom.idrecomendacion NOT IN (SELECT r.idrecomendacion FROM DatEvalprocesorecomendaciones r WHERE r.iddefprocesoevaluativo = '$iddefprocesoevaluativo') AND nom.idtiporecomendacion = '$idtiporecomendacion'")->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function getCantTotalRecomendacionesNotSelected()
    { //Devuelve la cantidad total que tiene la tabla
        try {
            $query = new Doctrine_Query($idtiporecomendacion, $iddefprocesoevaluativo);
            $sqlWhere = "e.idtiporecomendacion=$idtiporecomendacion";
            $result = $query->select('COUNT(idtiporecomendacion)')->from('NomEvalrecomendacion e')->where("nom.idrecomendacion NOT IN (SELECT r.idrecomendacion FROM DatEvalprocesorecomendaciones r WHERE r.iddefprocesoevaluativo = '$iddefprocesoevaluativo') AND nom.idtiporecomendacion = '$idtiporecomendacion'")->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ObtenerIdUltimaTupla()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvaldefprocesoevaluativo d')->orderBy('d.iddefprocesoevaluativo DESC')->execute();
        $lastIdObj = $result->toArray();
        return $lastIdObj[0]['iddefprocesoevaluativo'];
    }

    public function obtenerPlanillaByIdProceso($iddefprocesoevaluativo)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('propla.iddefprocesoplanillas, pla.idplanilla as idplanilla, pla.denom as text')
            ->from('DatEvaldefprocesoplanillas propla')
            ->innerJoin('propla.DatEvalplanillasevaluativas pla')
            ->where("propla.iddefprocesoevaluativo = {$iddefprocesoevaluativo}")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function getProcesosConPlanillaActiva()
    {
        $query = new Doctrine_Query ();
        $result = $query->select('dp.iddefprocesoevaluativo, dp.denom')
            ->from('DatEvaldefprocesoevaluativo dp')
            //->innerJoin('dp.DatEvaldefprocesoplanillas dpp')//Descomentarear (solo para probar)
            ->execute();
        return $result->toArray();
    }

    public function TipoProcesoEnUso($idtipoprocesoevaluativo)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('iddefprocesoevaluativo')
            ->from('DatEvaldefprocesoevaluativo')
            ->where('idtipoprocesoevaluativo = ?', $idtipoprocesoevaluativo)
            ->execute();
        return $result->toArray();
    }

}