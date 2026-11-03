<?php

class ConfUsuario extends BaseConfUsuario
{
    public function setUp()
    {
        parent::setUp();

        $this->HasMany(
            'DatTransicionConfUsuario',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->HasMany(
            'ConfUsuarioConfDocDatEstado',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfUsuario')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 1, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfUsuario')->limit($limite = 1)->offset(
            $inicio = 10
        )->execute();
        return $result->toArray();
    }

    public function ExisteUsuario($iduser)
    {
        $q = Doctrine_Query::create()
            ->select('count(u.idusuario)')
            ->from('ConfUsuario u')
            ->where('u.idusuario = ?', $iduser);
        $user = $q->fetchArray();
        return $user[0]['count'];
    }

    public function GetUsuario($idtrans)
    {
        $conn = Zend_Registry::get('conexion');
        $r = $conn->execute(
            "SELECT mod_flujotrabajo.conf_usuario.idusuario,
            mod_flujotrabajo.conf_usuario.nombre,
            mod_flujotrabajo.dat_transicion_conf_usuario.simultaneo
            FROM mod_flujotrabajo.dat_transicion
            INNER JOIN mod_flujotrabajo.dat_transicion_conf_usuario 
            ON (mod_flujotrabajo.dat_transicion.idtransicion = 
            mod_flujotrabajo.dat_transicion_conf_usuario.idtransicion)
            INNER JOIN mod_flujotrabajo.conf_usuario 
            ON (mod_flujotrabajo.dat_transicion_conf_usuario.idusuario = 
            mod_flujotrabajo.conf_usuario.idusuario)
            WHERE  mod_flujotrabajo.dat_transicion.idtransicion = '$idtrans'"
        );
        $result['data'] = $r->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}//fin clase 



