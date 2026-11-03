<?php
class NomPeligro extends BaseNomPeligro
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idpeligro)
    {
        return Doctrine::getTable('NomPeligro')->find($idpeligro);
    }

    public function getPeligrosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*, ne.denominacion as vento')
            ->from('NomPeligro ne')
            ->where('ne.fdesde <= now() and (now() <= ne.fhasta or ne.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getPeligros($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*')
            ->from('NomPeligro ne')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("ne.denominacion ILIKE '%$filtro%' OR ne.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantPeligros($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.idpeligro')
            ->from('NomPeligro ne');
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
            ->from('NomPeligro ne')
            ->where("UPPER(TRIM(ne.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}