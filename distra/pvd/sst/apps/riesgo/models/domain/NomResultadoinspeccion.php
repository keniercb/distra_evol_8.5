<?php
class NomResultadoinspeccion extends BaseNomResultadoinspeccion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idresultadoinspeccion)
    {
        return Doctrine::getTable('NomResultadoinspeccion')->find($idresultadoinspeccion);
    }

    public function getResultadoInspeccionActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('nri.*, nri.denominacion as resultadoinspeccion')
            ->from('NomResultadoinspeccion nri')
            ->where('nri.fdesde <= now() and (now() <= nri.fhasta or nri.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getResultadoInspeccion($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('nri.*')
            ->from('NomResultadoinspeccion nri')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("nri.denominacion ILIKE '%$filtro%' OR nri.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantResultadoInspeccion($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('nri.idresultadoinspeccion')
            ->from('NomResultadoinspeccion nri');
        if ($filtro) {
            $queryObj->addWhere("nri.denominacion ILIKE '%$filtro%' OR nri.descripcion ILIKE '%$filtro%'");
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