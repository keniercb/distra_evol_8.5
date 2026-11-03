<?php

class TempAprobacion extends BaseTempAprobacion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function UsuariosSimultaneos($idtransicion)
    {
        $query = new Doctrine_Query();
        $result = $query->from('TempAprobacion t')
            ->where('t.idtransicion = ?', $idtransicion)->execute();
        return $result->toArray();
    }

    public function EliminarUsuariosTransicion($idtransicion)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('TempAprobacion c')
            ->where('c.idtransicion = ?', $idtransicion)
            ->execute();
    }

    public function ExisteUserSimultaneo($iduser, $idtdoc, $idtrans)
    {
        $query = new Doctrine_Query();
        $result = $query->select('count(t.idtransicion)')
            ->from('TempAprobacion t')
            ->where(
                't.idtransicion = ? AND t.idusuario = ? AND t.iddocumento = ? ',
                array($idtrans, $iduser, $idtdoc)
            )->execute();
        $resp = $result->toArray();
        return $resp[0]['count'];
    }

    public function EliminarTempUser($user, $idtipodoc, $idtrans)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('TempAprobacion t')
            ->where(
                't.idtransicion = ? AND t.idusuario = ? AND t.iddocumento = ? ',
                array($idtrans, $user, $idtipodoc)
            )->execute();
    }

}//fin clase 



