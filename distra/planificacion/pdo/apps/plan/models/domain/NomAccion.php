<?php

/**
 * @author  mairelys Fernandez
 * @version 1.0.0
 */
class NomAccion extends BaseNomAccion
{

    public function setUp()
    {
        parent::setUp();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomAccion')->execute();
        return $result->toArray();
    }

    public function Buscar($idaccion)
    {
        $temp = Doctrine::getTable('NomAccion')->find($idaccion);
        return $temp->toArray();
    }

}