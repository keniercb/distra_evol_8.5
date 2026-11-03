<?php
class NomRecurso extends BaseNomRecurso
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idrecurso)
    {
        return Doctrine::getTable('NomRecurso')->find($idrecurso);
    }

    public function getRecursosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.*, r.denominacion as recurso')
            ->from('NomRecurso r')
            ->where('r.fdesde <= now() and (now() <= r.fhasta or r.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getRecursos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.*')
            ->from('NomRecurso r')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("r.denominacion ILIKE '%$filtro%' OR r.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantRecursos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.idrecurso')
            ->from('NomRecurso r');
        if ($filtro) {
            $queryObj->addWhere("r.denominacion ILIKE '%$filtro%' OR r.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('r.denominacion')
            ->from('NomRecurso r')
            ->where("UPPER(TRIM(r.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}