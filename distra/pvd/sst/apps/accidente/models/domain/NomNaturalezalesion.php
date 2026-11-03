<?php
class NomNaturalezalesion extends BaseNomNaturalezalesion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idnaturalezalesion)
    {
        return Doctrine::getTable('NomNaturalezalesion')->find($idnaturalezalesion);
    }

    public function getNaturalezasActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('nl.*, nl.denominacion as naturalezalesion')
            ->from('NomNaturalezalesion nl')
            ->where('nl.fdesde <= now() and (now() <= nl.fhasta or nl.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getNaturalezas($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('nl.*')
            ->from('NomNaturalezalesion nl')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("nl.denominacion ILIKE '%$filtro%' OR nl.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantNaturalezas($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('nl.idnaturalezalesion')
            ->from('NomNaturalezalesion nl');
        if ($filtro) {
            $queryObj->addWhere("nl.denominacion ILIKE '%$filtro%' OR nl.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('nl.denominacion')
            ->from('NomNaturalezalesion nl')
            ->where("UPPER(TRIM(nl.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}