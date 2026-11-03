<?php
class NomClasifequipo extends BaseNomClasifequipo
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idnriesgo)
    {
        return Doctrine::getTable('NomClasifequipo')->find($idnriesgo);
    }

    public function getClasificacionesActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.*, r.denominacion as riesgo')
            ->from('NomClasifequipo r')
            ->where('r.fdesde <= now() and (now() <= r.fhasta or r.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getClasificaciones($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.*')
            ->from('NomClasifequipo r')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("r.denominacion ILIKE '%$filtro%' OR r.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantClasificaciones($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('r.idclasifequipo')
            ->from('NomClasifequipo r');
        if ($filtro) {
            $queryObj->addWhere("r.denominacion ILIKE '%$filtro%' OR r.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('r.denominacion')
            ->from('NomClasifequipo r')
            ->where("UPPER(TRIM(r.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}