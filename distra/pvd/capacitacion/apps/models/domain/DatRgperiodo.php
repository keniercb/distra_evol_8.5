<?php
class DatRgperiodo extends BaseDatRgperiodo
{
    public function setUp()
    {
        $this->hasMany(
            'DatEvalrg', array('local' => 'idrgperiodo', 'foreign' => 'idrgperiodo')
        );
        parent::setUp();
    }

    public function getById($idrgperiodo)
    {
        return Doctrine::getTable('DatRgperiodo')->find($idrgperiodo);
    }

    public function getPeriodos($idreciengraduado, $filtro, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatRgperiodo m')
            ->where("m.idreciengraduado = '$idreciengraduado'")
            ->orderBy('m.fdesde DESC');
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ilike '%$filtro%'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)
                ->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantPeriodos($idreciengraduado, $filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatRgperiodo m')
            ->where("m.idreciengraduado = '$idreciengraduado'");
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ilike '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function getPeriodosEval($idreciengraduado)
    {

        $queryObj = Doctrine_Query::create()
            ->select('prg.*, prg.denominacion as periodo, e.*, irg.*, ind.*')
            ->from('DatRgperiodo prg')
            ->innerJoin('prg.DatEvalrg e')
            ->innerJoin('e.DatRgindicador irg')
            ->innerJoin('irg.NomIndicadoramedir ind')
            ->where("prg.idreciengraduado = '$idreciengraduado'")
            ->orderBy('prg.fdesde ASC');
        return $queryObj->fetchArray();
    }
}
