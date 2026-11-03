<?php
class NomTipoaccion extends BaseNomTipoaccion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idtipoaccion)
    {
        return Doctrine::getTable('NomTipoaccion')->find($idtipoaccion);
    }

    public function getTiposAccionActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomTipoaccion c')
            ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getTiposAccion($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomTipoaccion c')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantTiposAccion($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idtipoaccion')
            ->from('NomTipoaccion c');
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
            ->from('NomTipoaccion c')
            ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}