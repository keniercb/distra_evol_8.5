<?php
class NomClasificaciondecompetencia extends BaseNomClasificaciondecompetencia
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idclasificaciondecompetencia)
    {
        return Doctrine::getTable('NomClasificaciondecompetencia')->findOneBy('idclasifcompetencia', $idclasificaciondecompetencia);
    }

    public function getClasificacionesActivas()
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomClasificaciondecompetencia c')
            ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getClasificaciones($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('NomClasificaciondecompetencia c')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        // Util::msg($queryObj->getSqlQuery());

        return $queryObj->fetchArray();
    }

    public function cantClasificaciones($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idclasifcompetencia')
            ->from('NomClasificaciondecompetencia c');
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('c.denominacion, c.idclasifcompetencia')
            ->from('NomClasificaciondecompetencia c')
            ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}