<?php

class NomSecuenciafacturacion extends BaseNomSecuenciafacturacion
{

    public function setUp()
    {
        parent::setUp();
    }

    public function GetLLave()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('MAX(idsecuencia)')
                ->from('NomSecuenciafacturacion')
                ->execute();
            $arr = $result->toArray();

            return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function Buscar($idsecuencia)
    {
        try {
            $temp = $this->conn->getTable('NomSecuenciafacturacion')
                ->find($idsecuencia);

            return $temp->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetTodos()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('NomSecuenciafacturacion')->execute();

            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('NomSecuenciafacturacion')
                ->limit($limite)->offset($inicio)
                ->execute();

            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
