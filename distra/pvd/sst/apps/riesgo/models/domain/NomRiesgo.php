<?php
class NomRiesgo extends BaseNomRiesgo
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idnriesgo)
    {
        return Doctrine::getTable('NomRiesgo')->find($idnriesgo);
    }

    public function getRiesgosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.*, r.denominacion as riesgo')
            ->from('NomRiesgo r')
            ->where('r.fdesde <= now() and (now() <= r.fhasta or r.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getRiesgos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.*')
            ->from('NomRiesgo r')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("r.denominacion ILIKE '%$filtro%' OR r.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantRiesgos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.idnriesgo')
            ->from('NomRiesgo r');
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
            ->from('NomRiesgo r')
            ->where("UPPER(TRIM(r.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}