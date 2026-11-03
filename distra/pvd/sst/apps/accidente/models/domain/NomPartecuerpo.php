<?php
class NomPartecuerpo extends BaseNomPartecuerpo
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idpartecuerpo)
    {
        return Doctrine::getTable('NomPartecuerpo')->find($idpartecuerpo);
    }

    public function getPartesActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('pc.*, pc.denominacion as partecuerpo')
            ->from('NomPartecuerpo pc')
            ->where('pc.fdesde <= now() and (now() <= pc.fhasta or pc.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getPartes($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('pc.*')
            ->from('NomPartecuerpo pc')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("pc.denominacion ILIKE '%$filtro%' OR pc.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantPartes($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('pc.idpartecuerpo')
            ->from('NomPartecuerpo pc');
        if ($filtro) {
            $queryObj->addWhere("pc.denominacion ILIKE '%$filtro%' OR pc.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('pc.denominacion')
            ->from('NomPartecuerpo pc')
            ->where("UPPER(TRIM(pc.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }

    public function getDenomPartes($partes)
    {
        $sql = "SELECT denominacion FROM mod_sstaccidente.nom_partecuerpo WHERE fhasta is null";
        $sql .= (empty($partes)) ? ";" : " and idpartecuerpo in (".$partes.");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;

    }
}