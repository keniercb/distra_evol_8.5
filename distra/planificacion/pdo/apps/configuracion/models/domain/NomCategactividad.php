<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomCategactividad extends BaseNomCategactividad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomNomenclador',
            array('local' => 'idnomenclador', 'foreign' => 'idnomenclador')
        );

    }

    public function Buscar($idnomenclador)
    {
        $temp = $this->conn->getTable('NomCategactividad')
            ->find($idnomenclador);
        return $temp->toArray();

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomCategactividad')
            ->execute();
        return $result->toArray();

    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomCategactividad')
            ->limit($limite = 10)
            ->offset($inicio = 0)
            ->execute();
        return $result->toArray();

    }

}//fin clase 



