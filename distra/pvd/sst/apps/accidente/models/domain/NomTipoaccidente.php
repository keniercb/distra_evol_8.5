<?php
class NomTipoaccidente extends BaseNomTipoaccidente
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idtipoaccidente)
    {
        return Doctrine::getTable('NomTipoaccidente')->find($idtipoaccidente);
    }

    public function getTiposActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('ta.*, ta.denominacion as tipoaccidente')
            ->from('NomTipoaccidente ta')
            ->where('ta.fdesde <= now() and (now() <= ta.fhasta or ta.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getTipos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ta.*')
            ->from('NomTipoaccidente ta')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("ta.denominacion ILIKE '%$filtro%' OR ta.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantTipos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ta.idtipoaccidente')
            ->from('NomTipoaccidente ta');
        if ($filtro) {
            $queryObj->addWhere("ta.denominacion ILIKE '%$filtro%' OR ta.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('ta.denominacion')
            ->from('NomTipoaccidente ta')
            ->where("UPPER(TRIM(ta.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }

    public function getDenomTipo($accidentes)
    {
        $sql = "SELECT denominacion FROM mod_sstaccidente.nom_tipoaccidente WHERE fhasta is null";
        $sql .= (empty($accidentes)) ? ";" : " and idtipoaccidente in (".$accidentes.");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;

    }
}