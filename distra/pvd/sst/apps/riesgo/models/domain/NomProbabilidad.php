<?php
class NomProbabilidad extends BaseNomProbabilidad
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idprobabilidad)
    {
        return Doctrine::getTable('NomProbabilidad')->find($idprobabilidad);
    }

    public function getProbabilidadesActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('p.*, p.denominacion as probabilidad')
            ->from('NomProbabilidad p')
            ->where('p.fdesde <= now() and (now() <= p.fhasta or p.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getProbabilidades($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('p.*')
            ->from('NomProbabilidad p')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("p.denominacion ILIKE '%$filtro%' OR p.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantProbabilidades($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('p.idprobabilidad')
            ->from('NomProbabilidad p');
        if ($filtro) {
            $queryObj->addWhere("p.denominacion ILIKE '%$filtro%' OR p.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('p.denominacion')
            ->from('NomProbabilidad p')
            ->where("UPPER(TRIM(p.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}