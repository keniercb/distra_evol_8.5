<?php

class DatEvalcomisionevaluacion extends BaseDatEvalcomisionevaluacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatEvalpreprocesoevaluativo', array('local' => 'idpreprocesoevaluativo', 'foreign' => 'idpreprocesoevaluativo'));
        $this->hasMany('DatEvalpersonascomision', array('local' => 'idcomisionevaluacion', 'foreign' => 'idcomisionevaluacion'));
    }

    public function Buscar($idcomisionevaluacion)
    {
        $temp = Doctrine::getTable('DatEvalcomisionevaluacion')->find($idcomisionevaluacion);
        return $temp;
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalcomisionevaluacion')->execute();
        return $result->toArray();

    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalcomisionevaluacion')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function getComisionesXProceso($idpreprocesoevaluativo, $idestructura, $limit = 10, $start = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalcomisionevaluacion ce')
            ->where("ce.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and ce.idestructura = {$idestructura}")
            ->limit($limit)
            ->offset($start)->execute();
        return $result->toArray();
    }

    public function cantComisionesXProceso($idpreprocesoevaluativo, $idestructura, $limit = 10, $start = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('ce.idcomisionevaluacion')
            ->from('DatEvalcomisionevaluacion ce')
            ->where("ce.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and ce.idestructura = {$idestructura}")
            ->count();
        return $result;
    }

    public function existeComision($denom, $idpreprocesoevaluativo, $idestructura)
    {

        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalcomisionevaluacion ce')
            ->where("ce.denom = '$denom' and ce.idestructura = {$idestructura} and ce.idpreprocesoevaluativo = {$idpreprocesoevaluativo}")
            ->execute()->toArray();
        if ($result)
            return true;
        return false;
    }

    public function getComisionesNoAsocidas($idpreprocesoevaluativo, $iddefprocesoevaluativo, $idestructura, $limit = 10, $start = 0)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT ce.idcomisionevaluacion, ce.denom
			FROM mod_evaluaciones.dat_evalcomisionevaluacion ce
			INNER JOIN mod_evaluaciones.dat_evalpersonascomision pce ON(ce.idcomisionevaluacion = pce.idcomisionevaluacion)
			WHERE
				ce.idcomisionevaluacion NOT IN 
				(SELECT pce.idcomisionevaluacion FROM mod_evaluaciones.dat_evalprocesocomisionevaluacion pce WHERE pce.idpreprocesoevaluativo = {$idpreprocesoevaluativo})
				AND ce.iddefprocesoevaluativo = {$iddefprocesoevaluativo} AND ce.idestructura = {$idestructura} 
				LIMIT {$limit} OFFSET {$start}";
        return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCantComisionesNoAsocidas($idpreprocesoevaluativo, $iddefprocesoevaluativo, $idestructura)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT COUNT(ce.idcomisionevaluacion) as cantidad
			FROM mod_evaluaciones.dat_evalcomisionevaluacion ce
			WHERE
				ce.idcomisionevaluacion NOT IN 
				(SELECT pce.idcomisionevaluacion FROM mod_evaluaciones.dat_evalprocesocomisionevaluacion pce WHERE pce.idpreprocesoevaluativo = {$idpreprocesoevaluativo})
				AND ce.iddefprocesoevaluativo = {$iddefprocesoevaluativo} AND ce.idestructura = {$idestructura}";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['cantidad'];
    }

}//fin clase
?>


