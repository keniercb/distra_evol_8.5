<?php
class DatRgtarea extends BaseDatRgtarea
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idrgtarea)
    {
        return Doctrine::getTable('DatRgtarea')->find($idrgtarea);
    }

    public function getTareas($idreciengraduado, $filtro, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatRgtarea m')
            ->where("m.idreciengraduado = '$idreciengraduado'")
            ->orderBy('m.fregistro DESC');
        if ($filtro) {
            $queryObj->addWhere("m.tarea ilike '%$filtro%'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantTareas($idreciengraduado, $filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatRgtarea m')
            ->where("m.idreciengraduado = '$idreciengraduado'");
        if ($filtro) {
            $queryObj->addWhere("m.tarea ilike '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }
}