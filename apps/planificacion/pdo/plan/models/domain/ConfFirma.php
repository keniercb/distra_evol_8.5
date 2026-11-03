<?php

class ConfFirma extends BaseConfFirma
{
    public function setUp()
    {
        parent::setUp();
    }

    public function Buscar($idusuario)
    {
        $temp = $this->conn->getTable('ConfFirma')->find($idusuario);
        return $temp->toArray();

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfFirma')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfFirma')->limit($limite = 10)->offset(
            $inicio = 0
        )->execute();
        return $result->toArray();
    }


}//fin clase 



