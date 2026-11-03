<?php
class NomFrecuencia extends BaseNomFrecuencia
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idfrecuencia)
    {
        return Doctrine::getTable('NomFrecuencia')->find($idfrecuencia);
    }

    public function getFrecuenciasActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('e.*, e.denominacion as frecuencia')
            ->from('NomFrecuencia e')
            ->where('e.fdesde <= now() and (now() <= e.fhasta or e.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getFrecuencias($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('e.*')
            ->from('NomFrecuencia e')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("e.denominacion ILIKE '%$filtro%' OR e.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantFrecuencias($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('e.idfrecuencia')
            ->from('NomFrecuencia e');
        if ($filtro) {
            $queryObj->addWhere("e.denominacion ILIKE '%$filtro%' OR e.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('e.denominacion')
            ->from('NomFrecuencia e')
            ->where("UPPER(TRIM(e.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}