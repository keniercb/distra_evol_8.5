<?php
class NomEvento extends BaseNomEvento
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idevento)
    {
        return Doctrine::getTable('NomEvento')->find($idevento);
    }

    public function getEventosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*, ne.denominacion as vento')
            ->from('NomEvento ne')
            ->where('ne.fdesde <= now() and (now() <= ne.fhasta or ne.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getEventos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*')
            ->from('NomEvento ne')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("ne.denominacion ILIKE '%$filtro%' OR ne.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantEventos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.idevento')
            ->from('NomEvento ne');
        if ($filtro) {
            $queryObj->addWhere("ne.denominacion ILIKE '%$filtro%' OR ne.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('ne.denominacion')
            ->from('NomEvento ne')
            ->where("UPPER(TRIM(ne.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}