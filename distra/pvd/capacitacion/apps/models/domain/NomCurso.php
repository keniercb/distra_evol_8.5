<?php
class NomCurso extends BaseNomCurso
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idcurso)
    {
        return Doctrine::getTable('NomCurso')->find($idcurso);
    }

    public function getCursosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomCurso c')
            ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getCursos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomCurso c')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantCursos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idcurso')
            ->from('NomCurso c');
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
            ->from('NomCurso c')
            ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}