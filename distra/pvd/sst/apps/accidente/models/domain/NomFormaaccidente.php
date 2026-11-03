<?php
class NomFormaaccidente extends BaseNomFormaaccidente
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idformaaccidente)
    {
        return Doctrine::getTable('NomFormaaccidente')->find($idformaaccidente);
    }

    public function getFormasActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('fa.*, fa.denominacion as formaaccidente')
            ->from('NomFormaaccidente fa')
            ->where('fa.fdesde <= now() and (now() <= fa.fhasta or fa.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getFormas($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('fa.*')
            ->from('NomFormaaccidente fa')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("fa.denominacion ILIKE '%$filtro%' OR fa.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantFormas($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('fa.idformaaccidente')
            ->from('NomFormaaccidente fa');
        if ($filtro) {
            $queryObj->addWhere("fa.denominacion ILIKE '%$filtro%' OR fa.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('fa.denominacion')
            ->from('NomFormaaccidente fa')
            ->where("UPPER(TRIM(fa.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}