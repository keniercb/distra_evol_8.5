<?php

class DatCondicion extends BaseDatCondicion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTransicion',
            array('local' => 'idtransicion', 'foreign' => 'idtransicion')
        );
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCondicion')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 1, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCondicion')->limit($limite = 1)->offset(
            $inicio = 10
        )->execute();
        return $result->toArray();
    }

    public function GetCondiciones($idtrans)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCondicion c')
            ->where('c.idtransicion = ?', $idtrans)
            ->execute();
        return $result->toArray();
    }

    public function EliminarCondiciones($idtrans)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatCondicion c')
            ->where('c.idtransicion = ?', $idtrans)
            ->execute();
    }

    public function GetCondicionesPrePos($idtrans, $tipo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCondicion c')
            ->where('c.idtransicion = ? AND c.tipo = ?', array($idtrans, $tipo))
            ->execute();
        return $result->toArray();
    }
}//fin clase 



