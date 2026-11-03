<?php
class NomNivelriesgo extends BaseNomNivelriesgo
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idnivelriesgo)
    {
        return Doctrine::getTable('NomNivelriesgo')->find($idnivelriesgo);
    }

    public function getNivelesActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('n.*, n.denominacion as nivelriesgo')
            ->from('NomNivelriesgo n')
            ->where('n.fdesde <= now() and (now() <= n.fhasta or n.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getNiveles($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('n.*')
            ->from('NomNivelriesgo n')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("n.denominacion ILIKE '%$filtro%' OR n.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantNiveles($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('n.idnivelriesgo')
            ->from('NomNivelriesgo n');
        if ($filtro) {
            $queryObj->addWhere("n.denominacion ILIKE '%$filtro%' OR n.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('n.denominacion')
            ->from('NomNivelriesgo n')
            ->where("UPPER(TRIM(n.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}