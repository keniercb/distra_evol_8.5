<?php

class DatTransicionConfUsuario extends BaseDatTransicionConfUsuario
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
        $result = $query->from('DatTransicionConfUsuario')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 1, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatTransicionConfUsuario')->limit($limite = 1)
            ->offset($inicio = 10)->execute();
        return $result->toArray();
    }

    public function DameUser($idtrans)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatTransicionConfUsuario t')
            ->where('t.idtransicion = ?', $idtrans)
            ->execute();
        return $result->toArray();
    }

    public function EliminarUserTrans($idtrans)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatTransicionConfUsuario t')
            ->where('t.idtransicion = ?', $idtrans)
            ->execute();
    }

    public function Simultaneo($iduser, $idtrans)
    {
        $query = new Doctrine_Query();
        $result = $query->select('t.simultaneo')
            ->from('DatTransicionConfUsuario t')
            ->where(
                't.idtransicion = ? AND t.idusuario = ?',
                array($idtrans, $iduser)
            )
            ->execute();
        $r = $result->toArray();
        return $r[0]['simultaneo'];
    }
}//fin clase 



