<?php
class NomAseguramiento extends BaseNomAseguramiento
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatAccionaseguramiento',
            array('local' => 'idaseguramiento', 'foreign' => 'idaseguramiento')
        );
    }

    public function getById($idaseguramiento)
    {
        return Doctrine::getTable('NomAseguramiento')->find($idaseguramiento);
    }

    public function getAseguramientosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomAseguramiento c')
            ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getAseguramientos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomAseguramiento c')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantAseguramientos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idaseguramiento')
            ->from('NomAseguramiento c');
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('c.denominacion')
            ->from('NomAseguramiento c')
            ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}