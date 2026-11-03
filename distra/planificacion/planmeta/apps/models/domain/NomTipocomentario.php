<?php

class NomTipocomentario extends BaseNomTipocomentario
{

    public function setUp()
    {
        parent::setUp();
    }

    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select("MAX('idtipocomentario')")->from(
            'NomTipocomentario'
        )->execute();
        $arr = $result->toArray();
        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
    }

    public function Buscar($idtipocomentario)
    {
        $temp = $this->conn->getTable('NomTipocomentario')->find(
            $idtipocomentario
        );
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipocomentario')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 0, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipocomentario')->limit($limite = 0)->offset(
            $inicio = 10
        )->execute();
        return $result->toArray();
    }

    public function getTiposComentariosCombo()
    {
        $query = new Doctrine_Query();
        $res = $query->select('t.denominacion,t.idtipocomentario')
            ->from('NomTipocomentario t')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $res;
    }

    public function getDenomTC($idtipocomentario)
    {
        $query = new Doctrine_Query();
        $res = $query->select('t.denominacion')
            ->from('NomTipocomentario t')
            ->where('t.idtipocomentario=?', $idtipocomentario)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $res;
    }

}


