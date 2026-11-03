<?php

class DatUsuariotransicionModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function getAllUser() {
        $datos = DatUsuariotransicion::listarUsuario();
        return $datos;
    }
    
    public function getUserByidtransicion($param) {
        $userAut = DatUsuariotransicion::getUserByidtransicion($param);
        $result = array();
        foreach ($userAut as $key => $user) {
            $arrayDatosUsuario = $this->integrator->seguridad->getUsersProfile(array('idusuario' => $user['idusuario']), $this->global->Perfil->certificado);
            $result[$key]['idusuario'] = $arrayDatosUsuario['idusuario']['idusuario'];
            $result[$key]['nombreusuario'] = $arrayDatosUsuario['idusuario']['usuario'];
        }
        return $result;
    }

}
