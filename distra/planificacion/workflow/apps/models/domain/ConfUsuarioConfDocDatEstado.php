<?php

class ConfUsuarioConfDocDatEstado extends BaseConfUsuarioConfDocDatEstado
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'ConfDocDatEstado',
            array('local' => 'idestado', 'foreign' => 'idestado')
        );
        $this->hasOne(
            'DatTransicion',
            array('local' => 'idtransicion', 'foreign' => 'idtransicion')
        );
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfUsuarioConfDocDatEstado')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 1, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfUsuarioConfDocDatEstado')->limit(
            $limite = 1
        )->offset($inicio = 10)->execute();
        return $result->toArray();
    }

    public function ExisteUsuarioDocEstado($iduser, $idestado, $idtipodoc)
    {
        $q = Doctrine_Query::create()
            ->select('count(t.idestado)')
            ->from('ConfUsuarioConfDocDatEstado t')
            ->where(
                't.idusuario = ? AND t.idestado = ? AND t.idtipodoc = ?',
                array($iduser, $idestado, $idtipodoc)
            );
        $userdocestado = $q->fetchArray();
        return $userdocestado[0]['count'];
    }

    public function updateModificar($idtdoc, $idestado, $iduser)
    {
        $conn = Zend_Registry::get('conexion');

        $r = $conn->execute(
            "UPDATE mod_flujotrabajo.conf_usuario_conf_doc_dat_estado
            SET tipo=1 WHERE idusuario = '$iduser' 
            AND idestado = '$idestado' AND idtipodoc = '$idtdoc';"
        );
    }

    public function EliminarUserTDocEstado($iduser, $idtdoc, $idestado)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('ConfUsuarioConfDocDatEstado t')
            ->where(
                't.idusuario = ? AND t.idestado = ? AND t.idtipodoc = ?',
                array($iduser, $idestado, $idtdoc)
            )
            ->execute();
    }

    public function EliminarUserTDocEstadoTrans($idestado)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('ConfUsuarioConfDocDatEstado t')
            ->where('t.idestado = ?', $idestado)
            ->execute();
    }


}//fin clase 



