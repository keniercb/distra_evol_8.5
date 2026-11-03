<?php
class NomNecesidaddecapacitacion extends BaseNomNecesidaddecapacitacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatNecesidad', array('local' => 'idnecesidad', 'foreign' => 'idnecesidad'));
        $this->hasMany('DatAccionnecesidad', array('local' => 'idnecesidad', 'foreign' => 'idnecesidad'));
    }

    public function getById($idnecesidad)
    {
        return Doctrine::getTable('NomNecesidaddecapacitacion')->find($idnecesidad);
    }

    public function getNecesidadesActivos($grafica, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('n.*, n.denominacion as necesidad')
            ->from('NomNecesidaddecapacitacion n')
            ->where("n.identidad = '$identidad'");

        if (!empty($grafica)) {
            $queryObj->innerJoin('n.DatNecesidad dn');
        }
        $queryObj->addWhere('n.fdesde <= now() and (now() <= n.fhasta or n.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getNecesidades($filtro, $start, $limit, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('n.*')
            ->from('NomNecesidaddecapacitacion n')
            ->where("n.identidad = '$identidad'")
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("n.denominacion ILIKE '%$filtro%' OR n.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantNecesidades($filtro, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('n.idnecesidad')
            ->from('NomNecesidaddecapacitacion n')
            ->where("n.identidad = '$identidad'");
        if ($filtro) {
            $queryObj->addWhere("n.denominacion ILIKE '%$filtro%' OR n.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion, $identidad)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('n.denominacion')
            ->from('NomNecesidaddecapacitacion n')
            ->where("n.identidad = '$identidad' AND UPPER(TRIM(n.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}