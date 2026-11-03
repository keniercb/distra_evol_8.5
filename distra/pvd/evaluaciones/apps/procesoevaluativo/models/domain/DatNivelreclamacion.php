<?php

class DatNivelreclamacion extends BaseDatNivelreclamacion {

    public function setUp() {
        parent::setUp();
		$this->hasOne('DatEvaldefprocesoevaluativo', array(
             'local' =>   'iddefprocesoevaluativo',
             'foreign' => 'iddefprocesoevaluativo'));
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatNivelreclamacion')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite, $inicio,$iddefprocesoevaluativo) {
        $query = Doctrine_Query::create()
				->from('DatNivelreclamacion')
                ->orderBy('nivel')
                ->limit($limite)
                ->offset($inicio);

			if(!empty($iddefprocesoevaluativo)){
				$query->addWhere('iddefprocesoevaluativo =?',$iddefprocesoevaluativo);
			}

			return $query->fetchArray();
    }

    public function getNiveles($idperiodoproceso){
        $query = Doctrine_Query::create()
            ->select('nr.*')
            ->from('DatNivelreclamacion nr')
            ->innerJoin('nr.DatEvaldefprocesoevaluativo dp')
            ->innerJoin('dp.DatEvalpreprocesoevaluativo prep')
            ->innerJoin('prep.DatPeriodoproceso per')
            ->orderBy('nivel');

        if(!empty($idperiodoproceso)){
            $query->addWhere('per.idperiodoproceso = ?',$idperiodoproceso);
        }

        return $query->fetchArray();
    }
	 public function CantNivel($iddefprocesoevaluativo){
	  $sql = " SELECT COUNT(n.idnivelreclamacion)            
			  FROM
			  mod_evaluaciones.dat_nivelreclamacion n
			  WHERE n.iddefprocesoevaluativo = {$iddefprocesoevaluativo}";

			  $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchOne($sql);

        return $result;
    }
}