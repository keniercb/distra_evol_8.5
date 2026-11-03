<?php

class NomTipodocumento extends BaseNomTipodocumento
{

    public function setUp()
    {
        parent::setUp();
    }

    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select("MAX('idtipodocumento')")->from(
            'NomTipodocumento'
        )->execute();
        $arr = $result->toArray();
        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
    }

    public function Buscar($idtipodocumento)
    {
        $temp = $this->conn->getTable('NomTipodocumento')->find(
            $idtipodocumento
        );
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipodocumento')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 0, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipodocumento')->limit($limite = 0)->offset(
            $inicio = 10
        )->execute();
        return $result->toArray();
    }

}


