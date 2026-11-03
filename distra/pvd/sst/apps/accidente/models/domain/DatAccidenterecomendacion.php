<?php
class DatAccidenterecomendacion extends BaseDatAccidenterecomendacion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idaccidenterecomendacion)
    {
        return Doctrine::getTable('DatAccidenterecomendacion')->find($idaccidenterecomendacion);
    }

    public function getRecomendaciones($idaccidente, $filtro, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidenterecomendacion m')
            ->where("m.idaccidente = '$idaccidente'")
            ->orderBy('m.fregistro DESC');
        if ($filtro) {
            $queryObj->addWhere("m.recomendacion ilike '%$filtro%'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantRecomendaciones($idaccidente, $filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidenterecomendacion m')
            ->where("m.idaccidente = '$idaccidente'");
        if ($filtro) {
            $queryObj->addWhere("m.recomendacion ilike '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }
}