<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomTipohoja extends BaseNomTipohoja
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomNomenclador',
            array('local' => 'idtipohoja', 'foreign' => 'idnomenclador')
        );
    }

    public function Buscar($idnomenclador)
    {
        $temp = $this->conn->getTable('NomTipohoja')
            ->find($idnomenclador);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipohoja')
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipohoja')
            ->limit($limite = 10)
            ->offset($inicio = 0)
            ->execute();
        return $result->toArray();
    }

}//fin clase 



