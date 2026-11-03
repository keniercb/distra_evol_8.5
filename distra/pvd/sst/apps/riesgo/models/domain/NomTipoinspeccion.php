<?php
class NomTipoinspeccion extends BaseNomTipoinspeccion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idtipoinspeccion)
    {
        return Doctrine::getTable('NomTipoinspeccion')->find($idtipoinspeccion);
    }

    public function getTipoInspeccionActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('nti.*, nti.denominacion as tipoinspeccion')
            ->from('NomTipoinspeccion nti')
            ->where('nti.fdesde <= now() and (now() <= nti.fhasta or nti.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getTipoInspeccion($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('nti.*')
            ->from('NomTipoinspeccion nti')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("nti.denominacion ILIKE '%$filtro%' OR nti.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantTipoInspeccion($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('nti.idtipoinspeccion')
            ->from('NomTipoinspeccion nti');
        if ($filtro) {
            $queryObj->addWhere("nti.denominacion ILIKE '%$filtro%' OR nti.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('nti.denominacion')
            ->from('NomTipoinspeccion nti')
            ->where("UPPER(TRIM(nti.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}