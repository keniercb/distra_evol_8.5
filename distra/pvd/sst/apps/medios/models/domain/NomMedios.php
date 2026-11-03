<?php
class NomMedios extends BaseNomMedios
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatMedios',
            array('local' => 'idmedio', 'foreign' => 'idmedio')
        );
    }

    public function getById($idmedio)
    {
        return Doctrine::getTable('NomMedios')->find($idmedio);
    }

    public function getMediosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.*, r.denominacion as medio')
            ->from('NomMedios r')
            ->where('r.fdesde <= now() and (now() <= r.fhasta or r.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getMedios($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.*')
            ->from('NomMedios r')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("r.denominacion ILIKE '%$filtro%' OR r.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantgetMedios($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.idmedio')
            ->from('NomMedios r');
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
            ->from('NomMedios r')
            ->where("UPPER(TRIM(r.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}