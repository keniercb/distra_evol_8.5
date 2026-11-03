<?php
class NomModoformacion extends BaseNomModoformacion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idmodoformacion)
    {
        return Doctrine::getTable('NomModoformacion')->find($idmodoformacion);
    }

    public function getModosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*, m.denominacion as modoformacion')
            ->from('NomModoformacion m')
            ->where('m.fdesde <= now() and (now() <= m.fhasta or m.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getModos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('NomModoformacion m')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ILIKE '%$filtro%' OR m.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantModos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idmodoformacion')
            ->from('NomModoformacion m');
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ILIKE '%$filtro%' OR m.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomModoformacion m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}