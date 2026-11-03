<?php
class NomTipoinvalidez extends BaseNomTipoinvalidez
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idtipoinvalidez)
    {
        return Doctrine::getTable('NomTipoinvalidez')->find($idtipoinvalidez);
    }

    public function getTiposActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('ti.*, ti.denominacion as tipoinvalidez')
            ->from('NomTipoinvalidez ti')
            ->where('ti.fdesde <= now() and (now() <= ti.fhasta or ti.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getTipos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ti.*')
            ->from('NomTipoinvalidez ti')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("ti.denominacion ILIKE '%$filtro%' OR ti.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantTipos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ti.idtipoinvalidez')
            ->from('NomTipoinvalidez ti');
        if ($filtro) {
            $queryObj->addWhere("ti.denominacion ILIKE '%$filtro%' OR ti.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('ti.denominacion')
            ->from('NomTipoinvalidez ti')
            ->where("UPPER(TRIM(ti.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }

    public function getInvalidezActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('pc.*')
            ->from('NomTipoinvalidez pc')
            ->where('pc.fdesde <= now() and (now() <= pc.fhasta or pc.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getDenomInvalidez($incapacidad)
    {
        $sql = "SELECT denominacion FROM mod_sstaccidente.nom_tipoinvalidez WHERE fhasta is null";
        $sql .= (empty($incapacidad)) ? ";" : " and idtipoinvalidez in (".$incapacidad.");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;

    }
}