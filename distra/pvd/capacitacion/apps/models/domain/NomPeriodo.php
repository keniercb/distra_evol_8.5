<?php
class NomPeriodo extends BaseNomPeriodo
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idperiodo)
    {
        return Doctrine::getTable('NomPeriodo')->find($idperiodo);
    }

    public function getPeriodosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomPeriodo c');
        return $queryObj->fetchArray();
    }

    public function getPeriodos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomPeriodo c')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantPeriodos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idPeriodo')
            ->from('NomPeriodo c');
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('c.denominacion')
            ->from('NomPeriodo c')
            ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}