<?php

class DatUsuariotransicion extends BaseDatUsuariotransicion {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatTransicion', array('local' => 'idtransicion', 'foreign' => 'idtransicion'));
    }

    public function getByid($idformatoetapa) {
        return Doctrine::getTable('ConfFormatoetapa')->find($idformatoetapa);
    }

    public function getUserByidtransicion($param) {
        $query = new Doctrine_Query();
        return $query->select("du.idusuario, du.idtransicion, dt.idflujotrabajo")
                        ->from('DatUsuariotransicion du')
                        ->innerJoin("du.DatTransicion dt")
                        ->where("du.idtransicion = ?", $param['idtransicion'])
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function listarUsuario() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select u.idusuario,u.nombreusuario
                        from  mod_seguridad.seg_usuario u
                        Where u.activo=true
                       ";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}
