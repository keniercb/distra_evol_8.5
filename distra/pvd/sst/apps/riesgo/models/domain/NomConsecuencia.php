<?php
class NomConsecuencia extends BaseNomConsecuencia
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idconsecuencia)
    {
        return Doctrine::getTable('NomConsecuencia')->find($idconsecuencia);
    }

    public function getConsecuenciasActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*, ne.denominacion as vento')
            ->from('NomConsecuencia ne')
            ->where('ne.fdesde <= now() and (now() <= ne.fhasta or ne.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getConsecuencias($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*')
            ->from('NomConsecuencia ne')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("ne.denominacion ILIKE '%$filtro%' OR ne.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantConsecuencias($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.idconsecuencia')
            ->from('NomConsecuencia ne');
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
            ->from('NomConsecuencia ne')
            ->where("UPPER(TRIM(ne.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}