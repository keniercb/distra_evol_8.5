<?php
class ConfEscala extends BaseConfEscala
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idescala)
    {
        return Doctrine::getTable('ConfEscala')->find($idescala);
    }

    public function getEscalasActivas($tipo)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('ConfEscala c')
            ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
        if (!empty($tipo)) {
            $queryObj->addWhere("c.tipo = '$tipo'");
        }
        return $queryObj->fetchArray();
    }

    public function getEscalas($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('ConfEscala c')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantEscalas($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idescala')
            ->from('ConfEscala c');
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
            ->from('ConfEscala c')
            ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}
