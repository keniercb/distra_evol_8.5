<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomNivelinvolucrado extends BaseNomNivelinvolucrado
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatInvolucrados', array('local'   => 'idnivelinvolucrado',
                                     'foreign' => 'idnivelinvolucrado')
        );
    }

    public function Buscar($idnivelinvolucrado)
    {
        $temp = $this->conn->getTable('NomNivelinvolucrado')
            ->find($idnivelinvolucrado);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNivelinvolucrado')
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNivelinvolucrado')
            ->limit($limite = 10)
            ->offset($inicio = 0)
            ->execute();
        return $result->toArray();
    }

}//fin clase 



