<?php
class NomValorcualitativo extends BaseNomValorcualitativo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatEscalacualitativa',
            array('local' => 'idvalorcualitativo', 'foreign' => 'idvalorcualitativo')
        );
    }

    public function getById($idvalorcualitativo)
    {
        return Doctrine::getTable('NomValorcualitativo')->find($idvalorcualitativo);
    }

    public function getValoresActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomValorcualitativo c')
            ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getValores($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomValorcualitativo c');
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        if ($limit) {
            $queryObj->limit($limit)->offset($start);
        }
        return $queryObj->fetchArray();
    }

    public function cantValores($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idvalorcualitativo')
            ->from('NomValorcualitativo c');
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
            ->from('NomValorcualitativo c')
            ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}
