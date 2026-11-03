<?php
class FuncionCargo extends BaseFuncionCargo
{
    public function setUp()
    {
        parent :: setUp();
    }

    public function getFuncionCargo($limit, $inicio, $arr)
    {
       // print_r($arr);die;

        $sql = "select n.* from mod_rrhhmaestro.conf_funccargo n where n.idestructura in ($arr) ";

        $sql .= " offset $inicio limit $limit";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function getCantFuncionCargo($idestructura)
    {
        $query = new Doctrine_Query();
        $result = $query->select('idfunccargo')
            ->from('Funcioncargo c')
            ->where("c.idestructura = '$idestructura'")
            ->execute();
        return $result->count();
    }

    public function getById($idfunccargo)
    {
        return Doctrine::getTable('Funcioncargo')->find($idfunccargo);
    }

    public function getEspCargoByIdDenom($denom, $idestructura)
    {
        $query = new Doctrine_Query();
        $result = $query->select('c.*')
            ->from('Funcioncargo c')
            ->where("c.idestructura = '$idestructura' AND c.denominacion ilike '%$denom%'")
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