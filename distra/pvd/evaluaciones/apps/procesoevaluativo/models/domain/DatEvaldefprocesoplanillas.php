<?php

class DatEvaldefprocesoplanillas extends BaseDatEvaldefprocesoplanillas
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEvaldefprocesoevaluativo',
            array('local' => 'iddefprocesoevaluativo', 'foreign' => 'iddefprocesoevaluativo')
        );
        $this->hasOne('DatEvalplanillasevaluativas', array('local' => 'idplanilla', 'foreign' => 'idplanilla'));
        $this->hasMany(
            'DatEvalprocesoevaluados', array('local' => 'idprocesoplanilla', 'foreign' => 'idprocesoplanilla')
        );
        $this->hasMany(
            'DatEstructurapersona', array('local' => 'idprocesoplanilla', 'foreign' => 'idprocesoplanilla')
        );
    }

    public function findByProcesoPlanilla($iddefprocesoevaluativo, $idplanilla)
    {
        $query = new Doctrine_Query();

        return $query->from('DatEvaldefprocesoplanillas')
            ->where("iddefprocesoevaluativo = $iddefprocesoevaluativo and idplanilla = $idplanilla")
            ->execute();
    }

    public function getDatEvaldefprocesoplanillas($iddefprocesoevaluativo, $idplanilla)
    {
        return Doctrine::getTable('DatEvaldefprocesoplanillas')->findByDql(
            "iddefprocesoevaluativo = $iddefprocesoevaluativo and idplanilla = $idplanilla"
        );
    }

    public function ExisteProcesoPlanilla($iddefprocesoevaluativo, $idplanilla)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvaldefprocesoplanillas m')
            ->where("m.iddefprocesoevaluativo = {$iddefprocesoevaluativo} and m.idplanilla ={$idplanilla}")
            ->execute();

        return $result->toArray();
    }

    public function obtenerPlanillaAsociadasProceso($iddefprocesoevaluativo)
    {
        $query = new Doctrine_Query ();
        $result = $query->select(
            'def.idprocesoplanilla, def.idmodelo, def.iddefprocesoevaluativo, def.idplanilla, pla.denom as planilla, pla.descripcion as descripcion, m.denom as denommodelo'
        )
            ->from('DatEvaldefprocesoplanillas def')
            ->innerJoin('def.DatEvalplanillasevaluativas pla')
            ->innerJoin('pla.DatEvalmodelo m')
            ->where("def.iddefprocesoevaluativo = {$iddefprocesoevaluativo}")
            ->orderBy('def.iddefprocesoevaluativo, def.idplanilla , def.idmodelo DESC')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        return $result;
    }

    public function existePlanillaProceso($idplanilla)
    {
        $query = Doctrine_Query::create();

        return $query->select('iddefprocesoevaluativo')
            ->from('DatEvaldefprocesoplanillas')
            ->where('idplanilla = ?', $idplanilla)
            ->fetchArray();
    }

}