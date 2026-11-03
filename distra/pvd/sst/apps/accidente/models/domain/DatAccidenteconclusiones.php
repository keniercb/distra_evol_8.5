<?php
class DatAccidenteconclusiones extends BaseDatAccidenteconclusion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idaccidenteconclusion)
    {
        return Doctrine::getTable('DatAccidenteconclusiones')->find($idaccidenteconclusion);
    }

    public function getConclusiones($idaccidente, $filtro, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidenteconclusiones m')
            ->where("m.idaccidente = '$idaccidente'")
            ->orderBy('m.fregistro DESC');
        if ($filtro) {
            $queryObj->addWhere("m.conclusion ilike '%$filtro%'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantConclusiones($idaccidente, $filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidenteconclusiones m')
            ->where("m.idaccidente = '$idaccidente'");
        if ($filtro) {
            $queryObj->addWhere("m.conclusion ilike '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }
}