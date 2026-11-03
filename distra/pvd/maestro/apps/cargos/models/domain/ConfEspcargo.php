<?php
class ConfEspcargo extends BaseConfEspcargo
{
    public function setUp()
    {
        parent :: setUp();
    }

    public function getHomologaciones($limit, $inicio, $idcargo)
    {
        $query = new Doctrine_Query();
        $result = $query->select('c.*')
            ->from('ConfEspcargo c')
            ->where("c.idcargo = '$idcargo'")
            ->limit($limit)
            ->offset($inicio)
            ->execute();
        return $result->toArray();
    }

    public function getCantHomologaciones($idcargo)
    {
        $query = new Doctrine_Query();
        $result = $query->select('COUNT(idespcargo)')
            ->from('ConfEspcargo c')
            ->where("c.idcargo = '$idcargo'")
            ->execute();
        return $result->toArray();
    }

    public function getById($idespcargo)
    {
        return Doctrine::getTable('ConfEspcargo')->find($idespcargo);
    }

    public function getEspCargoByIdDenom($denom, $idcargo)
    {
        $query = new Doctrine_Query();
        $result = $query->select('c.*')
            ->from('ConfEspcargo c')
            ->where("c.idcargo = '$idcargo' AND c.denominacion ilike '%$denom%'")
            ->execute();
        return $result->toArray();
    }

    public function getCargos($limit, $inicio, $filtro)
    {
        $sql = "select nc.denominacion, nc.idnomcargo AS idcargo from mod_estructuracomp.nom_cargo nc";
        if (!empty($filtro)) {
            $sql .= " where denominacion ilike '%$filtro%'";
        }
        $sql .= " order by nc.denominacion offset $inicio limit $limit";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function getCantCargos($filtro)
    {
        $sql = "select * from mod_estructuracomp.nom_cargo";
        if (!empty($filtro)) {
            $sql .= " where denominacion ilike '%$filtro%'";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }
}