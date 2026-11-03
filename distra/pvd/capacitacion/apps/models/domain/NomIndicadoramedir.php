<?php
class NomIndicadoramedir extends BaseNomIndicadoramedir
{
    public function setUp()
    {
        $this->hasOne(
            'DatRgindicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        parent::setUp();
    }

    public function getById($idindicador)
    {
        return Doctrine::getTable('NomIndicadoramedir')->find($idindicador);
    }

    public function getIndicadoresActivos($identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('i.*')
            ->from('NomIndicadoramedir i')
            ->where("i.identidad = '$identidad' AND i.fdesde <= now() and (now() <= i.fhasta or i.fhasta is null)");
        return $queryObj->fetchArray();
    }

    public function getIndicadores($filtro, $start, $limit, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('i.*')
            ->from('NomIndicadoramedir i')
            ->where("i.identidad = '$identidad'")
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("i.denominacion ILIKE '%$filtro%' OR i.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantIndicadores($filtro, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('i.idindicador')
            ->from('NomIndicadoramedir i')
            ->where("i.identidad = '$identidad'");
        if ($filtro) {
            $queryObj->addWhere("i.denominacion ILIKE '%$filtro%' OR i.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion, $identidad)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('i.denominacion')
            ->from('NomIndicadoramedir i')
            ->where("i.identidad = '$identidad' AND UPPER(TRIM(i.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}