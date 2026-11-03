<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomTipoelemento extends BaseNomTipoelemento
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatElementos',
            array('local' => 'idtipoelemento', 'foreign' => 'idelemento')
        );
    }

    public function Buscar($idtipoelemento)
    {
        $temp = $this->conn->getTable('NomTipoelemento')
            ->find($idtipoelemento);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipoelemento')
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipoelemento')
            ->limit($limite = 10)
            ->offset($inicio = 0)
            ->execute();
        return $result->toArray();
    }

}//fin clase 



