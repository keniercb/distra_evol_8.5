<?php
class NomSistema extends BaseNomSistema
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idsistema)
    {
        return Doctrine::getTable('NomSistema')->find($idsistema);
    }

    public function getSistemasActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*, ne.denominacion as vento')
            ->from('NomSistema ne')
            ->where('ne.fdesde <= now() and (now() <= ne.fhasta or ne.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getSistemas($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*')
            ->from('NomSistema ne')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("ne.denominacion ILIKE '%$filtro%' OR ne.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantSistemas($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.idsistema')
            ->from('NomSistema ne');
        if ($filtro) {
            $queryObj->addWhere("ne.denominacion ILIKE '%$filtro%' OR ne.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('ne.denominacion')
            ->from('NomSistema ne')
            ->where("UPPER(TRIM(ne.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}